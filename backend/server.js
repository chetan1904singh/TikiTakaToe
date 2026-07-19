import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/users.js";
import http from "http";
import { Server } from "socket.io";

import checkWinner from "./services/winnerCheck.js";
import {createGame} from "./services/createGame.js";

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

//game----------------------------------------------------

        socket.on("make_move",(data)=>{
        const room = data.room;
        const index = data.index;

        const game = games[room];

        // Find which player sent the move
        const player = game.players.find(
            (p) => p.socketId === socket.id
         );
         // Safety check
        if (!player) {
            return;
        }
        // Ignore move if it isn't this players turn
        if (player.symbol !== game.turn) {
            return;
        }
       
        //update board and then check for winner
        game.board[index] = game.turn;
        
        const winner=checkWinner(game.board);
        
        if(winner!==null){
            io.to(room).emit("winner", winner);
        }
        
        else{
        game.turn = game.turn === "X" ? "O" : "X";
        io.to(room).emit("board_update", {
            board: game.board,
            turn: game.turn

        });
        }

})


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
    
     socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id);
    })

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