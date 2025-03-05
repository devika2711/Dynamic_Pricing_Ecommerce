import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ChatSupport from "../components/ChatSupport";
const socket = io("http://localhost:3001");

export default function Home() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchResults, setSearchResults] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3001/api/products").then((res) => {
            setProducts(res.data);
            setFilteredProducts(res.data);
        });

        socket.on("newPrice", (data) => {
            setProducts((prevProducts) =>
                prevProducts.map((p) => (p._id === data.productId ? { ...p, price: data.newPrice } : p))
            );
        });

        return () => socket.off("newPrice");
    }, []);

    // ✅ Function to filter products based on selected category
    const filterByCategory = (category) => {
        setSelectedCategory(category);
        if (category === "All") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter((p) => p.category === category));
        }
    };
  
    return (
        <div className="min-h-screen" style= {{backgroundColor: "#F8F9FA"}} >
            <Navbar filterByCategory={filterByCategory} selectedCategory={selectedCategory} setSearchResults={setSearchResults} />
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Available Products</h2>
                {/* ✅ Show search results if available */}
                {searchResults !== null ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {searchResults.length > 0 ? (
                            searchResults.map((product) => <ProductCard key={product._id} product={product} />)
                        ) : (
                            <p className="text-gray-600 text-center">No products found.</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => <ProductCard key={product._id} product={product} />)}
                    </div>
                )}
            </div>
        <div>
            <h1>Welcome to Our Store</h1>
            <ChatSupport /> {/* ✅ Chat support */}
        </div>
        </div>
    );
}