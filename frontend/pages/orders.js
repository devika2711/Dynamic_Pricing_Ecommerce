// export default function Orders() {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-4"> Order Placed Successfully!</h2>
//                 <p className="text-gray-600">
//                     Thank you for shopping with us! Your order has been placed successfully.
//                 </p>

//                 <div className="mt-6">
//                     <img 
//                         src="https://cdn-icons-png.flaticon.com/128/5610/5610944.png" 
//                         alt="Order Success" 
//                         className="w-24 mx-auto mb-4"
//                     />
//                 </div>

//                 <a href="/" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
//                     Back to Home
//                 </a>
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import Link from "next/link";

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // For error handling

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                console.log("🔹 Fetching orders for user:", user.id || user._id);
                console.log("🟢 User from AuthContext:", user);
                console.log("🟢 User ID Used for API:", user.id || user._id);

                const res = await axios.get(`http://localhost:3001/api/orders/${user.id || user._id}`);
                console.log("✅ Orders Response:", res.data);

                if (res.data.length === 0) {
                    console.warn("⚠️ No orders found for this user.");
                }

                setOrders(res.data);
            } catch (error) {
                console.error("❌ Failed to fetch orders:", error);
                setError("Failed to load orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    // Handling different states
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Loading, please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <Link href="/">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition mt-4">
                            Go Back Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">No orders found. Try making a purchase!</p>
                    <Link href="/">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition mt-4">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Your Orders</h1>

            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                {orders.map(order => (
                    <div key={order._id} className="border-b pb-4 mb-4">
                        <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                        <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleString()}</p>
                        <p className="text-sm text-gray-700 font-semibold">
                            Status:
                            <span className={`ml-2 px-2 py-1 rounded ${
                                order.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}>
                                {order.paymentStatus}
                            </span>
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {order.products.map(productItem => {
                                const product = productItem.product || {}; // ✅ Get product details
                                return (
                                    <div key={product._id} className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                                        <img src={product.image || "https://via.placeholder.com/80"} 
                                            alt={product.name || "Product"} 
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                        <div>
                                            <p className="font-semibold">{product.name || "Unknown Product"}</p>
                                            <p className="text-gray-500">Qty: {productItem.quantity}</p>
                                            <p className="text-gray-700 font-medium">₹{product.price || "N/A"}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="text-right font-bold mt-4 text-lg">Total: ₹{order.totalAmount}</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-6">
                <Link href="/">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    );
}
