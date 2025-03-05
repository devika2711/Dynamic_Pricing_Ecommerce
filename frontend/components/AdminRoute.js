import { useAuth } from "../context/authContext";
import { useRouter } from "next/router";

export default function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) return <p>Loading...</p>;

    if (!user) {
        router.replace("/login");
        return null;  // 🟢 Prevent rendering if not logged in
    }

    if (user.role !== "admin") {
        router.replace("/");
        return null;  // 🟢 Prevent rendering if not admin
    }

    return children;  // 🟢 Render children if admin
}
