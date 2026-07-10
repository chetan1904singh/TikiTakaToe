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

app.use("/auth", userRoutes);

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

    console.log(`User Connected with id ${socket.id}`);

    //data=room
    socket.on("join_room",(data)=>{
        
        socket.join(data);
        io.to(data).emit("joined_room",data);
        
        console.log(`user ${socket.id} joined room ${data}`);
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