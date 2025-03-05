import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/authContext'; // ✅ Import AuthProvider
import Script from "next/script"; // ✅ Load Razorpay script

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            {/* ✅ Load Razorpay script globally */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

            <AuthProvider>  {/* ✅ Ensure authentication wraps everything */}
                <CartProvider>
                    <Component {...pageProps} />
                </CartProvider>
            </AuthProvider>
        </>
    );
}
