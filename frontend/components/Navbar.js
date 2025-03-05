import { useState, useEffect, useContext } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import axios from "axios";
import AuthContext from "../context/authContext"; 
import { FaShoppingCart, FaUserCircle, FaSearch, FaBars } from "react-icons/fa"; // ✅ Icons added

export default function Navbar({ filterByCategory, selectedCategory, setSearchResults }) {
    const { cart } = useCart();
    const { user, logout } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState(["All"]);
    const [searchQuery, setSearchQuery] = useState("");
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:3001/api/products/categories").then((res) => {
            setCategories(res.data);
        });
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            const res = await axios.get(`http://localhost:3001/api/products/search?query=${searchQuery}`);
            setSearchResults(res.data);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    return (
        <nav className="bg-[#FEC5BB] shadow-md py-4 px-6">
            <div className="container mx-auto flex justify-between items-center">
                
                {/* ✅ Brand Logo */}
                <Link href="/" className="flex items-center space-x-2 text-gray-800 font-bold text-xl">
                    <FaBars className="text-2xl" />
                    <span>Ecom Store</span>
                </Link>

                {/* ✅ Category Dropdown & Search Bar */}
                <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg">
                    <button
                        className="text-gray-700 font-medium"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {selectedCategory} ▼
                    </button>
                    {dropdownOpen && (
                        <div className="absolute mt-12 w-48 bg-white border rounded-lg shadow-lg z-10">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                    onClick={() => {
                                        filterByCategory(category);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleSearch} className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="px-3 py-2 rounded-lg bg-white text-gray-700 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="ml-2 text-gray-600">
                            <FaSearch />
                        </button>
                    </form>
                </div>

                {/* ✅ Cart & User Profile */}
                <div className="flex items-center space-x-4">
                    {/* ✅ Cart */}
                    <Link href="/cart">
                        <button className="flex items-center bg-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300">
                            <FaShoppingCart className="mr-2" />
                            Cart ({cart.length})
                        </button>
                    </Link>

                    {/* ✅ User Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300"
                        >
                            <FaUserCircle className="text-xl" />
                            <span>{user ? user.name : "Account"}</span>
                        </button>
                        {userDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                {user ? (
                                    <>
                                        <Link href="/profile">
                                            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                                                Profile
                                            </button>
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                                                Login
                                            </button>
                                        </Link>
                                        <Link href="/signup">
                                            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                                                Signup
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ✅ Admin Panel - Visible Only to Admin Users */}
                    {user && user.role === "admin" && (  // 🟢 Show only for admin users
                        <Link href="/admin">
                            <button className="bg-white text-blue-500 px-4 py-2 rounded shadow hover:bg-gray-200 transition">
                                Admin Panel
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
