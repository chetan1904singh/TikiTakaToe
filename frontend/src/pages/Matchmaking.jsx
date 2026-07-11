import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import socket from "../services/socket";

function Matchmaking(){
    const navigate = useNavigate();
    const location = useLocation();
    const room = location.state.room;

    useEffect(() => {

    socket.emit("join_room", room);

    socket.on("room_full", () => {
        alert("Room is already full.");
        navigate("/home");
     });

    socket.on("start_game", () => {
        navigate("/game");
    });

    return () => {
        socket.off("start_game");
        socket.off("room_full");
    };

}, []);
    
  
   

    return(
        <div className="container">

            <div className="card">

                <h1>Joining Room...</h1>

            </div>
        </div>

    );

}

export default Matchmaking;