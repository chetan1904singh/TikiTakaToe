import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/users.js";
import http from "http";
import { Server } from "socket.io";

import checkWinner from "./services/winnerCheck.js";



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

const games = {};
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

            games[data] = {
                board: Array(9).fill(""),
                turn: "X",
                players: [
                    {socketId: players[0],symbol: "X"},
                    {socketId: players[1],symbol: "O"}
                ]
            }
       
            // Tell Player X
            io.to(players[0]).emit("game_start", {
                room: data,
                board: games[data].board,
                turn: games[data].turn,
                symbol: "X"
            });

            // Tell Player O
            io.to(players[1]).emit("game_start", {
                room: data,
                board: games[data].board,
                turn: games[data].turn,
                symbol: "O"
            });
                
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