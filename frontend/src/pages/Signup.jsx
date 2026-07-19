import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {

            await api.post("/auth/register", formData);

            navigate("/");

        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

   return (
    <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/FrontWp.jpg')" }}
    >
        {/* Dark Overlay */}
        <div className="absolute inset-0 "></div>

        {/* Glass Card */}
        <div className="relative w-[420px] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

                <h1 className="text-4xl font-bold text-center text-white">
                    Signup
                </h1>

                {error && (
                    <p className="text-center text-red-300">
                        {error}
                    </p>
                )}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-white/20 border border-white/30 px-4 py-3 text-white placeholder-gray-300 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/40"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-white/20 border border-white/30 px-4 py-3 text-white placeholder-gray-300 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/40"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-white/20 border border-white/30 px-4 py-3 text-white placeholder-gray-300 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/40"
                />

                <button
                    type="submit"
                    className="w-full rounded-xl bg-green-500 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-green-600 hover:scale-105 active:scale-95"
                >
                    Signup
                </button>

                <p className="text-center text-gray-200">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-green-300 hover:text-green-200 transition"
                    >
                        Login
                    </Link>
                </p>

            </form>

        </div>
    </div>
);
}

export default Signup;