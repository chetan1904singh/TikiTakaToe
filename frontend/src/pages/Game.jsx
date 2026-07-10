import { useNavigate } from "react-router-dom";

function Game() {

    const navigate = useNavigate();

    const board = [
        "X", "", "O",
        "", "X", "",
        "", "", "O"
    ];

    const handleClick = (index) => {
        console.log("Clicked:", index);

        // Socket.IO logic will come later
    };

    return (
        <div className="container">

            <div className="game-card">

                <h1>TikiTakaToe</h1>

                <h2>Your Turn</h2>

                <div className="board">

                    {board.map((cell, index) => (

                        <button
                            key={index}
                            className="cell"
                            onClick={() => handleClick(index)}
                        >
                            {cell}
                        </button>

                    ))}

                </div>

                <button
                    onClick={() => navigate("/result")}
                >
                    End Game (Demo)
                </button>

            </div>

        </div>
    );
}

export default Game;