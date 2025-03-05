import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (token && storedUser) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            // axios.get("http://localhost:3001/api/auth/profile", { headers: { Authorization: token } })
                // .then(res => setUser(res.data.user))
                // .catch(() => setUser(null));
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await axios.post("http://localhost:3001/api/auth/login", { email, password });
        // localStorage.setItem("token", res.data.token);
        // setUser(res.data.user);
        const { token, user } = res.data;
        console.log("🟢 User on Login:", user); 
        // 🟢 Save user data and token to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);
    };
  

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common["Authorization"] = "";
        setUser(null);
    };
    const isAdmin = () => user?.role === "admin";


    return (
        <AuthContext.Provider value={{ user, login, logout,loading, isAdmin  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
