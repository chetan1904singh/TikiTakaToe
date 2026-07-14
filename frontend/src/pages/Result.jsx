import { useLocation ,useNavigate } from "react-router-dom";

function Result() {

    const navigate = useNavigate();
    const location = useLocation();
    const winner=location.state;

    return (
        <div className="container">

            <div className="card">

                <h1>Game Over</h1>

                <h2>Winner</h2>

                <h1 style={{ color: "green" }}>
                    {winner}
                </h1>

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