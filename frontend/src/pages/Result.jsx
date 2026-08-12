import { useLocation, useNavigate } from "react-router-dom";

function Result() {

    const navigate = useNavigate();
    const location = useLocation();

    const {winner} = location.state || {};

    const me = JSON.parse(localStorage.getItem("me"));
    const opponent = JSON.parse(localStorage.getItem("opponent"));
    
    console.log(me);
    console.log(`winner: ${winner}`)
    let printRes="DRAW";
    if(me.symbol===winner)printRes=me.name;
    else if(opponent.symbol===winner)printRes=opponent.name;
    
    let conclusion="🏆 Winner :";
    if(printRes==="DRAW")conclusion="Result :"
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: "url('/winner.jpg')" }}
        >
            {/* dark overlay so the crowd shot doesn't fight with the card */}
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative bg-gray-800/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md">

                <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg">
                    Full Time!
                </h1>

                <p className="text-xl text-gray-200 mb-3 drop-shadow">
                    {conclusion}
                </p>

                <h2 className="text-6xl font-extrabold text-green-400 mb-10 drop-shadow-lg">
                    {printRes}
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
                        shadow-lg
                    "
                >
                    Return Home
                </button>

            </div>

        </div>
    );
}

export default Result;