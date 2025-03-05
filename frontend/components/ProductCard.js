import { useCart } from "../context/CartContext"; 
export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    return (
        <div style={{ backgroundColor: "#FAE1DD" }} className="p-4 flex flex-col justify-between rounded-lg shadow-lg transition hover:shadow-xl h-full">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
            <h2 className="text-lg text-[#575757] font-semibold mt-3">{product.name}</h2>
            <p className="text-xl font-bold text-green-600 mt-1">${product.price}</p>
            <button
                className="mt-3 bg-[#77DD77] text-white px-4 py-2 w-full rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => addToCart(product)}
            >
                Add to Cart
            </button>
        </div>
    );
}
