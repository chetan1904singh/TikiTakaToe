import { useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import socket from "../services/socket";

function Game() {
    const navigate = useNavigate();
    const location = useLocation();

    const { room, board, turn } = location.state; //just for initial state
    
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
    
    
    return (

        <div className="container">

            <div className="game-card">

                <h1>TikiTakaToe</h1>

                <h2>Room : {room}</h2>

                <h3>Turn : {currentTurn}</h3>

                <div className="board">

                    {gameBoard.map((cell, index) => (

                        <button  key={index} className="cell" onClick={()=>handleClick(index)}>
                            {cell}
                        </button>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default Game;