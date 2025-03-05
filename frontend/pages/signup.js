import { useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AuthContext from "../context/authContext"; // ✅ Import AuthContext

export default function Signup() {
    const { login } = useContext(AuthContext); // ✅ Use login function after successful signup
    const router = useRouter();
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:3001/api/auth/signup", userData);
            alert("Signup successful! Redirecting to login...");
            router.push("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full p-2 border rounded"
                        value={userData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                        Sign Up
                    </button>
                </form>
                <p className="text-center mt-2">
                    Already have an account? <a href="/login" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
}
