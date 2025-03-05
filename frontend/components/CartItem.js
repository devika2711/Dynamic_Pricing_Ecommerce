import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
    const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

    return (
        <div className="flex justify-between items-center border-b p-4">
            <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500">Price: ${item.price}</p>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <div className="flex items-center">
                <button
                    className="bg-gray-300 px-3 py-1 rounded mr-2"
                    onClick={() => decreaseQuantity(item._id)}
                >
                    -
                </button>
                <span>{item.quantity}</span>
                <button
                    className="bg-gray-300 px-3 py-1 rounded ml-2"
                    onClick={() => increaseQuantity(item._id)}
                >
                    +
                </button>
            </div>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => removeFromCart(item._id)}
            >
                Remove
            </button>
        </div>
    );

}
