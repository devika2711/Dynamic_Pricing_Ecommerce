import { useState, useContext } from "react";
import AuthContext from "../context/authContext";
import { useRouter } from "next/router";

export default function Login() {
    const { login } = useContext(AuthContext);
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            alert("Login Successful!");
            router.push("/");
        } catch (error) {
            alert("Login Failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold">Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full my-2"/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full my-2"/>
            <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">Login</button>
        </form>
    );
}
