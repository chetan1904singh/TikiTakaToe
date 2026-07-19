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

    const randomMatchmaking = () => {
    navigate("/matchmaking");
     }

   return (
    <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/FrontWp.jpg')" }}
    >

        <div className="w-[420px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-center">

            <h1 className="text-4xl font-bold text-white mb-2">
                TikiTakaToe
            </h1>

            <p className="text-gray-200 mb-8">
                Welcome!
            </p>

            <button
                onClick={randomMatchmaking}
                className="w-full py-3 mb-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300"
            >
                Find Match
            </button>

            <button
                onClick={handleLogout}
                className="w-full py-3 mb-6 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-300"
            >
                Logout
            </button>

            <div className="border-t border-white/20 pt-6">

                <h2 className="text-xl font-semibold text-white mb-4">
                    Join Private Room
                </h2>

                <input
                    type="text"
                    placeholder="Enter Room ID"
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20 outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                />

                <button
                    onClick={handleJoinRoom}
                    className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-300"
                >
                    Join Room
                </button>

            </div>

        </div>

    </div>
);
}

export default Home;