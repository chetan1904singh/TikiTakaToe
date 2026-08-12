import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket.js";


const user = JSON.parse(localStorage.getItem("user"));
if(!user)console.log('No user');
else console.log(user);

function Home(){
    const navigate = useNavigate();
    const [room,setRoom]=useState("");
    
     const handleJoinRoom = () => {
       if (!room.trim()) return;
            navigate("/matchmaking",{state:{room}})
    
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const randomMatchmaking = () => {
    navigate("/matchmaking");
     }

  return (
    <div
        className="min-h-screen flex items-center justify-center gap-10 bg-cover bg-center px-6"
        style={{ backgroundImage: "url('/FrontWp.jpg')" }}
    >
        {/* Rules Card */}
        <div className="w-[450px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">How to Play</h2>

            <p className="text-gray-200 mb-6 leading-relaxed">
                <i>Tiki-Taka-Toe</i> is not your average Tic-Tac-Toe game, but a fun football twist on the classic.
                Battle it out with a friend or any random and let the better fan win!
            </p>
            
            <h2><b>Rules:</b></h2>

            <ul className="list-disc list-inside space-y-3 text-gray-200">
                <li>Each square is defined by a row and column criterion.</li>
                <li>
                    Name a footballer who matches <strong>both</strong> criteria
                    to claim the square.
                </li>
                <li>Current and retired players are both allowed.</li>
                <li>The same footballer <strong>can not</strong> be used multiple times.</li>
                <li>
                    Steal an occupied square by naming a
                    <strong> different valid footballer</strong> for that square.
                </li>
                <li>
                    First to connect <strong>3 consecutives in any row, column or diagonal before the full time of 5 minutes</strong> wins.
                </li>
            </ul>
        </div>

        {/* Existing Home Card */}
        <div className="w-[420px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
                TikiTakaToe
            </h1>

            <p className="text-gray-200 mb-8">
                Welcome {user?.username}!
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