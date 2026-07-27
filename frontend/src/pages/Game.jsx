import { useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import socket from "../services/socket";

function Game() {
    const navigate = useNavigate();
    const location = useLocation();

    const { room, board, grid, turn, symbol } = location.state; //just for initial state
    
    
    const [gameBoard, setGameBoard] = useState(board);
    const [currentTurn, setCurrentTurn] = useState(turn);
    
    const [showModal,setShowModal]=useState(false);
    const [selectedCell,setSelectedCell]=useState(null);
    const [answer,setAnswer]=useState("");

    const [timeLeft, setTimeLeft] = useState(15);
    
    const handleClick = (index) => {
         setSelectedCell(index);
         setShowModal(true);

}
     useEffect(() => {
//--REFRESH HANLDE---------------------
         const checkGame = () => {
        socket.emit("check_game", room);
    };

    if (socket.connected) {
        checkGame();
    } else {
        socket.once("connect", checkGame);
    }

    socket.on("game_not_found", () => {
        alert('You Left The');
        navigate("/home");
    });
//-------------------------------------
        

        socket.on("board_update", (data) => {
             setGameBoard(data.board);
            setCurrentTurn(data.turn);
            setAnswer(data.answers);
        });
        
        socket.on("answer_result", (data) => {
             if (!data.correct) {
                alert(data.message);
            }
        });
    
        socket.on("winner",(data)=>{
            navigate("/result", {state: data});
        })
        
        
        socket.on("opponent_left", () => {
            alert("Opponent disconnected.");
            navigate("/home");
        });
//------------timer-------------
        socket.on("timer_update", (time) => {
        setTimeLeft(time);
    });

        
        
        return () => {
            
            
            socket.off("winner");
            socket.off("board_update");
            socket.off("answer_result");
            socket.off("opponent_left");
            socket.off("timer_update");
        };

    }, []);
    
    //console.log(gameBoard);
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
             <div className="text-2xl font-bold">
                Time Left: {timeLeft}
            </div>
            <div className="flex flex-col items-center mt-6">

    {/* Column headers */}
    <div className="grid grid-cols-4 gap-2 mb-2">

        <div></div>

        {grid.cols.map((col) => (

            <div
                key={col}
                className="w-24 text-center text-white font-bold"
            >
                {col}
            </div>

        ))}

    </div>

    {/* Rows */}
    {grid.rows.map((row,rowIndex)=>(

        <div key={row} className="grid grid-cols-4 gap-2 mb-2">

            <div className="w-24 flex items-center justify-center text-white font-bold">
                {row}
            </div>

            {[0,1,2].map(colIndex=>{ 
                const index=rowIndex*3+colIndex;
                return(

                    <button
                        key={index}
                        onClick={()=>handleClick(index)}
                        className="w-24 h-24 rounded-xl bg-gray-800 border border-gray-600 text-4xl text-white hover:bg-gray-700"
                    >
                        {gameBoard[index]}
                    </button>

                );

            })}

        </div>

    ))}

</div>

{/*---pop-up and input button----------------------------------------------------*/}
    
    </div>
        
{showModal && <div className="fixed inset-0 bg-black/70 flex justify-center items-center">

    <div className="bg-white p-6 rounded-xl">

        <h2 className="text-olive text-xl mb-4">Guess the Player</h2>

        <input
            value={answer}
            onChange={(e)=>setAnswer(e.target.value)}
            className="p-2 rounded w-full"
        />

        <button className="mt-4 w-full bg-green-500 p-2 rounded" onClick={() => {

        socket.emit("submit_answer", {
            room,
            index: selectedCell,
            answer
        });
        console.log(answer);
        setShowModal(false);
        setAnswer("");
        setSelectedCell(null);}
        
        }>
        Submit
        </button>

    </div>

</div>
}

    </div>
);

}

export default Game;