"use client";

import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryWrapper from "../components/CategoryWrapper";
import { FaWhatsapp } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Loader from '../components/Loader';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // Pages where Navbar/Footer should be hidden
  const noNavFooter = ["/register", "/user-login", "/forgot-password", "/reset-password", "/admin-login", "/components/Loader"];
  const hideNavFooter = noNavFooter.includes(pathname);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    },1900);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {!hideNavFooter && <Navbar />}
      {!hideNavFooter && <CategoryWrapper />}
      {/* Loader will appear when loading is true */}
      <Loader loading={loading} />
      {children}

      {!hideNavFooter && (
        <footer className="">
          <Footer />
        </footer>
      )}

      {!hideNavFooter && (
        <>
          <div className="fixed bottom-6 right-16 bg-white text-gray-600 text-sm p-2 rounded-lg shadow-lg animate-bounce z-50">
            Any queries? Contact us!
          </div>
          <a
            href={`https://wa.me/7744042929`}
            className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 animate-bounce z-50"
            target="_blank"
            rel="noopener noreferrer"
            style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.1))" }}
          >
            <FaWhatsapp size={24} />
          </a>
        </>
      )}
    </>
  );
}
