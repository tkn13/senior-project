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
        <div className="flex flex-col items-center justify-center h-screen">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
                className="bg-white p-6 rounded shadow-md w-80"
            >
                <h2 className="text-2xl mb-4">Login</h2>
                <div className="mb-4">
                    <label className="block mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    className={`w-full ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"} text-white py-2 rounded`}
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}