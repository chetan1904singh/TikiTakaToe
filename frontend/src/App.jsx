import { Routes, Route } from "react-router-dom";
import Front from "./pages/Front";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Result from "./pages/Result";
import Matchmaking from "./pages/Matchmaking";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Front />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/home" element={<Home />} />

            <Route path="/game" element={<Game />} />

            <Route path="/result" element={<Result />} />

            <Route path="/matchmaking" element={<Matchmaking />} />
        </Routes>
    );
}

export default App;