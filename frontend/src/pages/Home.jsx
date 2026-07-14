import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket.js";



function Home(){
    const navigate = useNavigate();
    const [room,setRoom]=useState("");
    
     const handleJoinRoom = () => {
       if (!room.trim()) return;
            navigate("/matchmaking",{state:{room}})
    
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="container">
            <div className="card">

                <h1>TikiTakaToe</h1>

                <h2>Welcome!</h2>

                <button >
                    Find Match
                </button>

                <button onClick={handleLogout}>
                    Logout
                </button>
                <input type="text" placeholder="Enter room Id" 
                onChange={e=>setRoom(e.target.value)}
                />
                <button onClick={handleJoinRoom}>
                    Join Room
                </button>

            </div>
        </div>
    );
}

export default Home;