import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext"; 

export default function CheckoutButton({ cartItems, totalAmount }) {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    
    const handlePayment = async () => {
        if (!user) {
            alert("Please log in to proceed with payment.");
            return;
        }

        setLoading(true);
        try {
            // Send payment request to backend
          
            console.log("✅ Sending Payment Request:", {
                amount: totalAmount,
                userId: user?.id,
                cartItems: cartItems.map(item => ({
                    product: item._id,  // Ensure this matches backend expectation
                    quantity: item.quantity
                })),
            });

            console.log("🔹 User from AuthContext:", user);
            console.log("🔹 User ID:", user?.id || user?._id);



            const res = await axios.post("http://localhost:3001/api/payments/razorpay", {
                amount: totalAmount,
                userId: user?.id, // Replace with actual user ID from auth context
                cartItems: cartItems.map(item => ({
                    product: item._id,  // Ensure this matches backend expectation
                    quantity: item.quantity
                })),
            });

            const { orderId, key } = res.data;
            console.log("Payment Response:", res.data);
            // Load Razorpay Checkout
            const options = {
                key,
                amount: totalAmount * 100,
                currency: "INR",
                name: "Ecom Store",
                description: "Payment for your order",
                order_id: orderId,
                handler: async function (response) {
                    alert("Payment Successful!");
                    console.log(response);

                    // ✅ Verify payment on backend (optional)
                    await axios.post("http://localhost:3001/api/payments/razorpay/webhook", {
                        order_id: response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                    });

                    window.location.href = "/orders"; // Redirect to orders page
                },
                prefill: {
                    name: user?.name || "Guest",
                    email: user?.email || "guest@example.com",
                   
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed, please try again.");
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handlePayment}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            disabled={loading}
        >
            {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
    );
}
