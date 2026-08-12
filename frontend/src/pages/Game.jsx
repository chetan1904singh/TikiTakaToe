import { useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect, useRef } from "react";
import socket from "../services/socket";

function Game() {
    const navigate = useNavigate();
    const location = useLocation();
    const gameEnded = useRef(false);
    const { room, board, grid, turn, symbol, players } = location.state; //just for initial state
    /*
    players: [
        {
            socketId: player1.id,
            symbol: "X",
            name: player1.username
        },
    */
   
    const me = players.find(
      p => p.symbol === symbol
     );
     const opponent = players.find(
        p => p.symbol !== symbol
    );
    localStorage.setItem("me", JSON.stringify(me));
    localStorage.setItem("opponent", JSON.stringify(opponent));
    //console.log(me);
    
    
    const [gameBoard, setGameBoard] = useState(board);
    const [currentTurn, setCurrentTurn] = useState(turn);
    
    const [showModal,setShowModal]=useState(false);
    const [selectedCell,setSelectedCell]=useState(null);
    const [answer,setAnswer]=useState("");

   const [turnTimeLeft, setTurnTimeLeft] = useState(20);
const [globalTimeLeft, setGlobalTimeLeft] = useState(300);
    
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
                alert("Incorrect Player!");
            }
        });


        //---------------winner check-------------------    
        socket.on("winner", (data) => {

            console.log("WINNER RECEIVED:", data);
            navigate("/result", {state: {winner: data}    
            });
        });

        
        socket.on("opponent_left", () => {
            alert("Opponent Disconnected!.");
            navigate("/home");
        });
//------------timer-------------
         socket.on("turn_timer_update", (time) => {
        setTurnTimeLeft(time);
    });

    socket.on("global_timer_update", (time) => {
        setGlobalTimeLeft(time);
    });
//--------end if globalTimer expires---------
    socket.on("game_over", (data) => {
     
    
        navigate("/result", {
            state: {
                winner:"D"
            }
        });

    });

        return () => {
            
            socket.off("winner");
            socket.off("board_update");
            socket.off("answer_result");
            socket.off("opponent_left");
            socket.off("turn_timer_update");
            socket.off("global_timer_update");
            socket.off("game_over");
        };

    }, []);
    
    //console.log(gameBoard);
  return (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
              <div className="flex flex-col items-center">
              
              <div className="absolute top-6 right-8 text-3xl font-extrabold tracking-wide
                          bg-gradient-to-r from-blue-400 to-purple-500
                          bg-clip-text text-transparent">
              {me.name}
             </div>

              {/* Match scoreboard — top left, football broadcast style */}
              <div className="absolute top-6 left-8 flex items-stretch rounded-md overflow-hidden border-2 border-slate-700 shadow-xl font-mono">
                {/* Time segment */}
                <div className="bg-white text-slate-900 font-black text-sm px-3 py-1.5 flex items-center tabular-nums">
                  {String(Math.floor(globalTimeLeft / 60)).padStart(2, "0")}:
                  {String(globalTimeLeft % 60).padStart(2, "0")}
                </div>
                {/* Matchup segment */}
                <div className="bg-blue-900 text-white font-bold text-sm px-3 py-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className={me.symbol === "X" ? "text-red-400" : "text-sky-300"}>
                     {me.symbol} 
                  </span>
                  
                  <span>{me.name}</span>
                  <span className="text-white/50 font-medium normal-case px-0.5">vs</span>
                  <span>{opponent.name}</span>
                  <span className={opponent.symbol === "X" ? "text-red-400" : "text-sky-300"}>
                    {opponent.symbol}
                  </span>
                </div>
              </div>
                
          <h1 className="text-5xl font-black text-white tracking-tight mb-1">
            TikiTakaToe 
          </h1>
          
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-6">
            Kick-off
          </p>
          
          {/* Scoreboard */}
          <div className="bg-gray-900 border border-gray-800 rounded-full px-6 py-2 flex items-center gap-6 mb-6 shadow-lg">
            <span className="text-white/70 text-sm">
              Room <span className="font-semibold text-white">{room}</span>
            </span>
          
            <span className="w-px h-4 bg-gray-700" />
          
            {/* Current turn timer */}
            
            <span className="text-white/50 text-sm font-mono tabular-nums">
              ⏱ {turnTimeLeft}s
            </span>
    </div>
          
                {/* Turn indicator — twice the size */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                  <span className="text-emerald-400">
                    {me.symbol === currentTurn ? "Your" : "Opponents"}  ({currentTurn}'s)
                  </span>{" "}
                  <span className="text-white/50 font-medium">Turn</span>
        </h3>
{/*------------------------*/}
      
      {/* Pitch board — contained, not full-page */}
      <div
        className="relative rounded-2xl border border-white/10 p-6 shadow-2xl"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #0F2A17 0px, #0F2A17 48px, #122F1A 48px, #122F1A 96px)",
        }}
      >
        {/* low-key center circle + halfway line, scoped to the board only */}
        <div className="absolute left-1/2 top-2 bottom-2 w-px bg-white/10 -translate-x-1/2 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 w-24 h-24 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10">
          {/* Column headers */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div></div>
            {grid.cols.map((col) => (
              <div
                key={col}
                className="w-20 sm:w-24 text-center text-white/50 font-semibold uppercase text-xs tracking-wider"
              >
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {grid.rows.map((row, rowIndex) => (
            <div key={row} className="grid grid-cols-4 gap-2 mb-2">
              <div className="w-20 sm:w-24 flex items-center justify-center text-white/50 font-semibold uppercase text-xs tracking-wider">
                {row}
              </div>

              {[0, 1, 2].map((colIndex) => {
                const index = rowIndex * 3 + colIndex;
                const cellValue = gameBoard[index];
                const isX = cellValue === "X";
                const isO = cellValue === "O";

                return (
                  <button
                    key={index}
                    onClick={() => handleClick(index)}
                    className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-transform hover:scale-105"
                    style={{
                      clipPath:
                        "polygon(20% 0%, 35% 0%, 50% 10%, 65% 0%, 80% 0%, 100% 20%, 85% 38%, 78% 32%, 78% 100%, 22% 100%, 22% 32%, 15% 38%, 0% 20%)",
                      backgroundColor: isX
                        ? "#8C1D2B"
                        : isO
                        ? "#1E3A6B"
                        : "rgba(255,255,255,0.04)",
                      border: cellValue
                        ? "1px solid rgba(255,255,255,0.4)"
                        : "1px dashed rgba(255,255,255,0.15)",
                    }}
                  >
                    <span className="text-white font-black text-2xl sm:text-3xl">
                      {cellValue}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/*---pop-up and input button----------------------------------------------------*/}
    {(currentTurn === symbol) && showModal && (
      <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-20">
        <div className="bg-white p-6 rounded-xl w-72">
          <h2 className="text-gray-900 text-xl font-bold mb-4">Guess the Player</h2>

          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="p-2 rounded w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-2 rounded transition-colors"
            onClick={() => {
              socket.emit("submit_answer", {
                room,
                index: selectedCell,
                answer,
              });
              console.log(answer);
              setShowModal(false);
              setAnswer("");
              setSelectedCell(null);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    )}
  </div>
);

}

export default Game;