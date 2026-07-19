import { useLocation ,useNavigate } from "react-router-dom";

function Result() {

    const navigate = useNavigate();
    const location = useLocation();
    const winner=location.state;

    return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md">

            <h1 className="text-5xl font-extrabold text-white mb-6">
                🎉 Game Over
            </h1>

            <p className="text-xl text-gray-400 mb-3">
                Winner
            </p>

            <h2 className="text-6xl font-extrabold text-green-400 mb-10">
                {winner}
            </h2>

            <button
                onClick={() => navigate("/home")}
                className="
                    w-full
                    py-3
                    rounded-xl
                    bg-green-500
                    text-white
                    font-semibold
                    text-lg
                    hover:bg-green-600
                    transition-all
                    duration-200
                "
            >
                Return Home
            </button>

        </div>

    </div>
);
}

export default Result;