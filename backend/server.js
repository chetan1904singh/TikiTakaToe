import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/users.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/auth", userRoutes);
//routes


//socket io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

//main connecton fn
// all other socket events only after conn happens/inside it
io.on("connection", (socket) => {

    //**data=room
    socket.on("join_room",(data)=>{
         
        const checkData = io.sockets.adapter.rooms.get(data);
        
        if (checkData && checkData.size >= 2) {
             socket.emit("room_full");
             return;
        }
        
        socket.join(data);
        
        const roomData = io.sockets.adapter.rooms.get(data); //returns a set
        
        if(roomData.size===2){
            io.to(data).emit("start_game");
        }
        
        console.log(`there are ${roomData.size} users`);
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