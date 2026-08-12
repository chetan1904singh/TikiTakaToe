import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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
            const res = await api.post("/auth/login", formData); // bakcend creates token and sends {token, user obj}
            
            //store name (for displaying) and token keys separately
            const { token, user } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            //lc stores only strings

            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
    <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/FrontWp.jpg')" }}
    >
        {/* Dark overlay */}
        <div className="absolute inset-0 "></div>

        {/* Glass Card */}
        <div className="relative w-[400px] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

                <h1 className="text-4xl font-bold text-center text-white mb-2">
                    Login
                </h1>

                {error && (
                    <p className="text-red-300 text-center">
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-white/20 border border-white/30 px-4 py-3 text-white placeholder-gray-300 outline-none focus:border-green-400"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-white/20 border border-white/30 px-4 py-3 text-white placeholder-gray-300 outline-none focus:border-green-400"
                />

                <button
                    type="submit"
                    className="w-full rounded-xl bg-green-500 py-3 text-lg font-semibold text-white transition hover:bg-green-600 hover:scale-105"
                >
                    Login
                </button>

                <p className="text-center text-gray-200">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-semibold text-green-300 hover:text-green-200"
                    >
                        Signup
                    </Link>
                </p>

            </form>

        </div>
    </div>
);
}

export default Login;