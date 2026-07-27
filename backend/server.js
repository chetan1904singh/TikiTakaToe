import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/users.js";
import http from "http";
import { Server } from "socket.io";

import checkWinner from "./services/winnerCheck.js";
import {createGame} from "./services/createGame.js";
import { players } from "./data/players.js";
import { startTimer } from "./services/timer.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//routes
app.use("/auth", userRoutes);
//routes

//SOCKET IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

const games = {}; //to store board,turns and curr game
const queue=[];
const usedPlayers=[];

//main connecton fn
// all other socket events only after conn happens/inside it
io.on("connection", (socket) => {

    //**data=room=roomId
    socket.on("join_room",(data)=>{
         
        const checkData = io.sockets.adapter.rooms.get(data);
        
        if (checkData && checkData.size >= 2){
             socket.emit("room_full");
             return;
        }
        
        socket.join(data);
        //games[room].players.push(socket.id);
        const roomData = io.sockets.adapter.rooms.get(data); //returns a set
        
        if(roomData.size===2){
          const players = [...roomData];
            createGame(
                io,
                games,
                data,
                { id: players[0] },
                { id: players[1] }
            );
            
        }
        
        console.log(`there are ${roomData.size} users`);
})

//game/Validate Answers && Winner Check too-------------------------------

    socket.on("submit_answer", (data) => {

    const game = games[data.room];
    if (!game) return;
    
    //dont let overwrite (no steals yet)
    if (game.board[data.index] !== "") {
    socket.emit("answer_result", {
        correct: false,
        message: "Cell already occupied."
    });
    return;
}
    
    //check if curr player 
    const currentPlayer = game.players.find(
        p => p.socketId === socket.id
    );
    if (!currentPlayer) return;
    
    if (currentPlayer.symbol !== game.turn) {

    socket.emit("answer_result", {
        correct: false,
        message: "Not your turn."
    });

    return;
}
    

    //game validation
    const row = Math.floor(data.index / 3);
    const col = data.index % 3;

    const rowRequirement = game.grid.rows[row];
    const colRequirement = game.grid.cols[col];

    const player = players.find(
        p => p.name.toLowerCase() === data.answer.toLowerCase()
    );

    if (!player) {
        console.log("Player not found");
        socket.emit("answer_result", {
        correct: false,
        message: "Unknown footballer"
        });
        return;
    }
    if(usedPlayers.find(p=>p===player)){
        console.log("Player Already Used");
        socket.emit("answer_result", {
        correct: false,
        message: "Player Already Used"
        });
        return;
    }

    const satisfiesRow =
        player.clubs.includes(rowRequirement) ||
        player.countries.includes(rowRequirement) ||
        player.competitions.includes(rowRequirement);

    const satisfiesCol =
        player.clubs.includes(colRequirement) ||
        player.countries.includes(colRequirement) ||
        player.competitions.includes(colRequirement);

    if (satisfiesRow && satisfiesCol) {
        usedPlayers.push(player);
        
        game.board[data.index] = currentPlayer.symbol;

        //after filling table check winner
        const winner = checkWinner(game.board);
        if (winner) {
            io.to(data.room).emit("winner", winner);
            clearInterval(game.timer);
            delete games[data.room];
            return;
        } 

//----------Restart timer after a correct answer
        clearInterval(game.timer);
        game.turn =game.turn === "X" ? "O" : "X";
        startTimer(io, games, data.room);
        //
        
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
socket.on("find_match",()=>{
    
    queue.push(socket);
    
    if(queue.length>=2){
        const player1 = queue.shift(); //socket objs
        const player2 = queue.shift();
        
        const room = "room-" + Date.now();//create room
         player1.join(room);
         player2.join(room);    
        
         createGame(
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


//socket io


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