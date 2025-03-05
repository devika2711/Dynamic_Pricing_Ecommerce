import AdminForm from "../components/AdminForm";
import Navbar from "../components/Navbar";
import AdminRoute from "../components/AdminRoute";  // 🟢 Import AdminRoute

export default function Admin() {
    return (
        <AdminRoute>  {/* 🟢 Protect Admin Page */}
            <div className="min-h-screen" style={{ backgroundColor: "#F2F0EA" }}>
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <AdminForm />
                </div>
            </div>
        </AdminRoute>
    );
}
