import { useNavigate } from "react-router-dom";

function Result() {

    const navigate = useNavigate();

    return (
        <div className="container">

            <div className="card">

                <h1>Game Over</h1>

                <h2>Winner</h2>

                <h1 style={{ color: "green" }}>
                    Player X
                </h1>

                <button
                    onClick={() => navigate("/game")}
                >
                    Play Again
                </button>

                <button
                    onClick={() => navigate("/home")}
                >
                    Home
                </button>

            </div>

        </div>
    );
}

export default Result;