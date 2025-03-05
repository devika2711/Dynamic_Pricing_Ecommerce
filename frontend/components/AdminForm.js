import { useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function AdminForm() {
    const [productId, setProductId] = useState("");
    const [demand, setDemand] = useState(0);

    const updatePrice = async () => {
        try {
            const res = await axios.post("http://localhost:3001/api/products/update-demand", { productId, demand });
            socket.emit("priceUpdate", { productId: res.data._id, newPrice: res.data.price });
            alert(`Updated Price: $${res.data.price}`);
        } catch (error) {
            alert("Error updating price: " + error.response.data.error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h1 className="text-2xl font-bold text-gray-700">Admin Panel</h1>
            <p className="text-gray-500 mb-4">Update Product Prices</p>

            <input 
                type="text" 
                placeholder="Product ID" 
                className="border p-2 w-full rounded mt-2" 
                onChange={(e) => setProductId(e.target.value)} 
            />
            <input 
                type="number" 
                placeholder="Demand Increase" 
                className="border p-2 w-full rounded mt-2" 
                onChange={(e) => setDemand(Number(e.target.value))} 
            />
            <button 
                className="bg-blue-600 text-white p-2 w-full mt-3 rounded shadow hover:bg-blue-700" 
                onClick={updatePrice}
            >
                Update Price
            </button>
        </div>
    );
}
