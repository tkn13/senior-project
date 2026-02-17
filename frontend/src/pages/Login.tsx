import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate, Navigate } from "react-router";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { user, login, isLoading } = useAuth();
    const navigate = useNavigate();

    // 1. Handle the Login Action
    const handleLogin = async () => {
        if (!login) {
            alert("Login function is not available");
            return;
        }
        try {
            await login(username, password);
            navigate("/");
        } catch (error) {
            setError("Login failed. Please check your credentials and try again.");
            
        }
    };

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div 
            className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/bg.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Blur overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            {/* Form Container */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
                className="relative z-10 bg-white/95 p-8 rounded-lg shadow-2xl w-96 backdrop-blur-sm"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-center text-gray-800">Blade Cluster Monitor</h1>
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
                        isLoading 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-lg hover:shadow-xl"
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-gray-600 text-xs mt-6">
                    © 2026 Thaksin Chiaokon. All rights reserved.
                </p>
            </form>
        </div>
    );
}