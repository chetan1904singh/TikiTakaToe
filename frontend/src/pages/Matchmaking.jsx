import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import socket from "../services/socket";

function Matchmaking(){

    const location = useLocation();
    const room = location.state.room;

    useEffect(()=>{

        socket.emit("join_room", room);

    },[]);

    return(
        <div className="container">

            <div className="card">

                <h1>Joining Room...</h1>

            </div>
        </div>

    );

}

export default Matchmaking;