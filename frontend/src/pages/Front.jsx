import { useNavigate } from "react-router-dom";

const Front = () => {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/FrontWp.jpg')" }} // change to png if needed
    >
      <div className="w-[420px] rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-10 flex flex-col items-center text-white">
        <h1 className="text-5xl font-extrabold tracking-wide text-center">
          Tiki Taka Toe
        </h1>

        <p className="mt-5 text-center text-gray-200 leading-relaxed">
          Challenge your friends in the ultimate football-themed
          Tic-Tac-Toe experience.
        </p>

        <div className="mt-10 flex flex-col gap-4 w-full">
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-xl bg-emerald-500 py-3 text-lg font-semibold transition duration-300 hover:bg-emerald-600 hover:scale-105 active:scale-95"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="w-full rounded-xl bg-sky-500 py-3 text-lg font-semibold transition duration-300 hover:bg-sky-600 hover:scale-105 active:scale-95"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Front;