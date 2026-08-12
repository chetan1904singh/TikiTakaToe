import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import socket from "../services/socket";

function Matchmaking(){
    const navigate = useNavigate();
    const location = useLocation();
    const room = location.state?.room;
    const user = JSON.parse(localStorage.getItem("user"));
    //user is an obj**
    

    useEffect(() => {

    if (room) {
        socket.emit("join_room", room,user);
    } else {
        socket.emit("find_match",user);
    }

    socket.on("room_full", () => {
        alert("Room is already full.");
        navigate("/home");
     });

    socket.on("game_start", (game) => {
        console.log("GAME START RECEIVED", game);
        console.log(game.players);
         navigate("/game", {state: game});
    });

    return () => {
        socket.off("game_start");
        socket.off("room_full");
    };

}, []);
    
  
   

    return (
    <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/FrontWp.jpg')" }}>

        <div className="w-[400px] rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl p-8 text-center">

            <h1 className="text-4xl font-bold text-black mb-6">
                Joining Room...
            </h1>

            <div className="flex justify-center mb-6">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>

            <p className="text-black/80 text-lg">
                Waiting for another player...
            </p>

        </div>

    </div>
);

}

export default Matchmaking;