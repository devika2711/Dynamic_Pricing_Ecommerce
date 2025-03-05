import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import CheckoutButton from "../components/CheckoutButton";

export default function Cart() {
    const { cart } = useCart();

    const totalAmount = cart.reduce((total, item) => {
        const price = item?.price || item?.product?.price || 0;
        return total + price * item.quantity;
    }, 0);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F2F0EA" }}>
            <Navbar />
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Shopping Cart</h2>
                {cart.length === 0 ? (
                    <p className="text-center text-gray-500">Your cart is empty.</p>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {cart.map((item) => (
                            <CartItem key={item._id} item={item} />
                        ))}
                        <h3 className="text-xl font-bold text-right mt-4">Total: ${totalAmount.toFixed(2)}</h3>
                        <CheckoutButton cartItems={cart} totalAmount={totalAmount} />
                    </div>
                )}
            </div>
        </div>
    );
}
