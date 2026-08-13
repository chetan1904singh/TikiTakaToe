import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/users.js";
import http from "http";
import { Server } from "socket.io";

import checkWinner from "./services/winnerCheck.js";
import {createGame} from "./services/createGame.js";
import {startTimer,startGlobalTimer } from "./services/TimerManager.js";
import { generateBoard, validateAnswerByGemini } from "./services/gemini.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.time("Generate Board");
const board = await generateBoard();
console.timeEnd("Generate Board");

console.log(board);

//routes
app.use("/auth", userRoutes);
//routes

//SOCKET IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
         origin: "*",
        methods: ["GET", "POST"]
    },
});

const games = {};//key=roomId,
//1)board, 2)grid(by gemini), 3)turn, 4)players=[you,opponent]
//5 timer
const queue=[];
const usedPlayers=[];

//main connecton fn
// all other socket events only after conn happens/inside it
io.on("connection", (socket) => {
   
    //**data=room=roomId
    socket.on("join_room",async (data,user)=>{
         
        const checkData = io.sockets.adapter.rooms.get(data);//returns a set
        
        if (checkData && checkData.size >= 2){
             socket.emit("room_full");
             return;
        }
        socket.user=user;
        socket.join(data);
        //games[room].players.push(socket.id);
        const roomData = io.sockets.adapter.rooms.get(data); //returns a set
        
        if(roomData.size===2){
             const players = [...roomData];
             
             const player1 = io.sockets.sockets.get(players[0]);
             const player2 = io.sockets.sockets.get(players[1]);
             
             await createGame(
                io,
                games,
                data,
                player1,
                player2
            );
            
        }
        
        console.log(`there are ${roomData.size} users`);
})

//-----game/Validate Answers && Winner Check too-------------------------------

    socket.on("submit_answer", async (data) => {

    const game = games[data.room];
    if (!game) return;
    //after adding global timer
    if (game.gameOver) return;

    if (game.globalTimeLeft <= 0) return;

//************Don't allow overwriting
    /**
     if (game.board[data.index] !== "") {
        socket.emit("answer_result", {
            correct: false,
            message: "Cell already occupied."
        });
        return;
    }
     * 
     */
//********************* */

    // Check if current player
    const currentPlayer = game.players.find(
        p => p.socketId === socket.id
    );

    if (!currentPlayer) return;

    // Check turn
    if (currentPlayer.symbol !== game.turn) {
        socket.emit("answer_result", {
            correct: false,
            message: "Not your turn."
        });
        return;
    }

    const row = Math.floor(data.index / 3);
    const col = data.index % 3;

    const rowRequirement = game.grid.rows[row];
    const colRequirement = game.grid.cols[col];

    // Check duplicate player
    if (!data.answer) {
    socket.emit("answer_result", {
        correct: false,
        message: "Please enter a player name."
    });
    return;
}
    if (game.usedPlayers.has(data.answer.toLowerCase())) {
        socket.emit("answer_result", {
            correct: false,
            message: "Player already used."
        });
        return;
    }
//---------send answer check----------
    let result;
    try {
    result = await validateAnswerByGemini(
        data.answer,
        rowRequirement, //realMadrid
        colRequirement  //France
    );

    console.log(result);

} catch (err) {
    console.error("Gemini Error:", err);

    socket.emit("answer_result", {
        correct: false,
        message: "Couldn't validate answer."
    });

    return;
}
//---------------------------------------
//--------update board if valid result
    
    if(result.valid) {
        game.usedPlayers.add(data.answer.toLowerCase());
        
        game.board[data.index] = currentPlayer.symbol;
        const winner = checkWinner(game.board);

        if (winner) {
            io.to(data.room).emit("winner", winner);
            clearInterval(game.timer);
            delete games[data.room];
            return;
        }

        //Restart timer after a correct answer
        clearInterval(game.timer);
        game.turn =game.turn === "X" ? "O" : "X";
        startTimer(io, games, data.room);
        //

//---------Update board after resetting timer------------
        io.to(data.room).emit("board_update", {
            board: game.board,
            answers: game.answers,
            turn: game.turn
        });

    } 
    
        else {
            console.log("Wrong Answer!");
            socket.emit("answer_result", {
                correct: false
            });

    }

});


//------------randomMatchmaking Logic---------------
socket.on("find_match",async(user)=>{
    
    socket.user=user;
    queue.push(socket);
    
    //console.log(user);
    if(queue.length>=2){
        const player1 = queue.shift(); //socket objs
        const player2 = queue.shift();
        
        const room =Date.now();//create random room
         player1.join(room);
         player2.join(room);    
        
         await createGame(
             io,
             games,
             room,
             player1,
             player2
         );
         console.log("match Found with random!");
        
    }
    console.log(`${socket.id} searching for random`);

})

//--------------Refresh check-----------------
//ADD ALERT TO ENTIRE ROOM LATER
  socket.on("check_game", (room) => {
    if (games[room]) {
        socket.emit("game_exists");
    } else {
        socket.emit("game_not_found");
    }
    socket.emit("board_update", {
        board: games[room].board,
        answers: games[room].answers,
        turn: games[room].turn
    });

    socket.emit("turn_timer_update", games[room].turnTimeLeft);
    socket.emit("global_timer_update", games[room].globalTimeLeft);
});



//-------disconnect logic------------------

  socket.on("disconnect", () => {

    console.log(socket.id, "disconnected");

    // Remove from matchmaking queue
    const idx = queue.findIndex(s => s.id === socket.id);

    if (idx !== -1) {
        queue.splice(idx, 1);
    }

    // Remove active game
    for (const room in games) {

        const game = games[room];

        if (!game.players.some(p => p.socketId === socket.id))
            continue;

        // Notify the remaining player and delete timer**
        socket.to(room).emit("opponent_left");
        
        clearInterval(game.timer);
        delete games[room];

        break;
    }

});

});
//socket io-----ends

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");

        server.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });