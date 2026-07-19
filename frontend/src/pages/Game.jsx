import { useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import socket from "../services/socket";

function Game() {
    const navigate = useNavigate();
    const location = useLocation();

    const { room, board, turn, symbol } = location.state; //just for initial state
    
    
    const [gameBoard, setGameBoard] = useState(board);
    const [currentTurn, setCurrentTurn] = useState(turn);
    
    const handleClick = (index) => {
        socket.emit("make_move",{
        room,
        index
    });

}
     useEffect(() => {
            socket.on("board_update", (data) => {
            setGameBoard(data.board);
            setCurrentTurn(data.turn);

        });

        socket.on("winner",(data)=>{
            navigate("/result", {state: data});
        })
        
        return () => {
            socket.off("winner");
            socket.off("board_update");
        };

    }, []);
    
    console.log(gameBoard);
    return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 flex flex-col items-center">

            <h1 className="text-5xl font-extrabold text-white mb-6">
                TikiTakaToe
            </h1>

            <div className="text-center mb-8">
                <h2 className="text-xl text-gray-300">
                    Room: <span className="font-semibold text-white">{room}</span>
                </h2>

                <h3 className="text-xl text-gray-300 mt-2">
                    Turn: <span className="font-semibold text-green-400">{currentTurn}</span>
                </h3>
            </div>

            <div className="grid grid-cols-3 gap-2">

                {gameBoard.map((cell, index) => (

                    <button
                        key={index}
                        onClick={() => handleClick(index)}
                        className="
                            w-24 h-24
                            rounded-xl
                            bg-gray-800
                            border-2 border-gray-600
                            text-4xl font-bold text-white
                            hover:bg-gray-700
                            active:scale-95
                            transition-all duration-200
                        "
                    >
                        {cell}
                    </button>

                ))}

            </div>

        </div>

    </div>
);

}

export default Game;