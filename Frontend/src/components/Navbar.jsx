"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiSearch, FiShoppingCart, FiUser, FiBell } from "react-icons/fi"; // added FiBell
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMenu } from "react-icons/hi";
import { Truck, GraduationCap } from "lucide-react";
import { FaUserShield, FaUserCircle } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const loginDropdownRef = useRef(null);
  const router = useRouter();
  const { cart } = useCart();

  // Check login status on component mount and when localStorage changes
  const checkLoginStatus = () => {
    const admin = localStorage.getItem("admin");
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!admin || !!token);
    setIsAdmin(!!admin);
  };
  
  useEffect(() => {
    // Initial check
    checkLoginStatus();
    
    // Listen for storage events (when localStorage changes in other tabs/components)
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for same-tab localStorage changes
    const handleAuthChange = () => {
      checkLoginStatus();
    };
    
    // Listen for cart changes
    const handleCartChange = () => {
      // Force cart refresh by triggering a re-render
      // The cart state will be updated through the CartContext
    };
    
    // Listen for both auth and cart changes
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("cartChange", handleCartChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("cartChange", handleCartChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(e.target)) {
        setShowLoginDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    const admin = localStorage.getItem("admin");
    const token = localStorage.getItem("token");

    if (admin) {
      router.push("/adminProfile");
    } else if (token) {
      router.push("/userProfile");
    } else {
      setShowLoginDropdown(true);
    }
  };

  const navLinkClass = (path) =>
    `px-4 py-1.5 rounded-sm font-semibold transition-all duration-200 relative
     ${
       pathname === path
         ? "bg-[#e6f0ff] !text-[#2563eb] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#2563eb]"
         : "!text-gray-800 hover:bg-[#e6f0ff] hover:text-[#2563eb]"
     }`;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-orange-400 text-white text-md text-center py-2 font-bold font-[Arimo] flex justify-center items-center gap-4">
        <div className="flex items-center gap-1 animate-blinkSlow">
          <Truck size={18} className="text-white" />
          <span>Free Delivery on Every Order</span>
        </div>
        <span className="text-white">|</span>
        <div className="flex items-center gap-1 animate-blinkSlow">
          <GraduationCap size={18} className="text-white" />
          <span>Extra 10% Discount for Academic Students</span>
        </div>
        <style jsx>{`
          @keyframes blinkSlow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .animate-blinkSlow {
            animation: blinkSlow 2.5s ease-in-out infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out forwards;
          }
          @keyframes pulse-subtle {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-pulse-subtle {
            animation: pulse-subtle 2s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-sm font-semibold px-4 md:px-12 py-3 flex justify-between items-center">
        {/* Left Nav */}
        <div className="flex items-center gap-6">
          <HiMenu
            className="text-2xl text-gray-700 md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          />

          <div className="hidden md:flex items-center gap-2 text-[15px] font-medium">
            <Link href="/" className={navLinkClass("/")}>Home</Link>
            <Link href="/inline-skates" className={navLinkClass("/inline-skates")}>Professional Inline Skates</Link>
            <Link href="/quad-skates" className={navLinkClass("/quad-skates")}>Roller/Quad Skates</Link>

            {isAdmin && (
              <Link href="/admin-dashboard" className={navLinkClass("/admin-dashboard")}>
                Admin Dashboard
              </Link>
            )}

            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-full">
                Products <MdKeyboardArrowDown className="text-lg" />
              </button>
              {showDropdown && (
                <div className="absolute top-8 left-0 bg-white w-48 shadow-lg border rounded z-50">
                  <Link href="/workout-gear" className="block px-4 py-2 !text-black">Workout Gear</Link>
                  <Link href="/sunglasses" className="block px-4 py-2 !text-black">Sunglasses</Link>
                </div>
              )}
            </div>

            {/* <Link href="/hockey-skates" className={navLinkClass("/hockey-skates")}>Hockey Skates</Link> */}
            <Link href="/workout-gear" className={navLinkClass("/workout-gear")}>Workout Gear</Link>
            <Link href="/Contact" className={navLinkClass("/Contact")}>Contact</Link>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 md:gap-4 relative font-semibold">
          <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search products..."
              className="rounded-full border border-gray-300 py-2 px-4 pr-10 text-sm w-64 outline-none text-gray-800"
            />
            <FiSearch className="absolute top-2.5 right-4 text-gray-500 text-lg" />
          </div>

          <Link href="/cart">
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 relative">
              <FiShoppingCart className="text-gray-800 text-xl" strokeWidth={2.5} />
              {cart.length > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse-subtle">
                  {cart.length}
                </div>
              )}
            </button>
          </Link>

          {/* Notification Icon - only when logged in */}
          {isLoggedIn && (
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 relative">
              <FiBell className="text-gray-800 text-xl" strokeWidth={2.5} />
              {/* dot will be used when notification count is implemented */}
            </button>
          )}

          <div className="relative" ref={loginDropdownRef}>
            <button
              onClick={handleProfileClick}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 relative group"
            >
              {isLoggedIn && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white z-10 animate-pulse"></div>
              )}
              <FiUser className="text-gray-800 text-xl group-hover:text-blue-600 transition-colors duration-200" strokeWidth={2.5} />
            </button>

            {!isLoggedIn && showLoginDropdown && (
              <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-lg shadow-xl z-50 text-black overflow-hidden transform transition-all duration-300 ease-in-out animate-fadeIn">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-2 px-4 text-white text-sm font-medium">
                  Account Access
                </div>
                <Link href="/admin-login" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 transition-colors duration-150">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FaUserShield className="text-lg" />
                  </div>
                  <span>Admin Access</span>
                </Link>
                <div className="border-t border-gray-100"></div>
                <Link href="/user-login" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 transition-colors duration-150">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FaUserCircle className="text-lg" />
                  </div>
                  <span>User Login</span>
                </Link>
                <Link href="/register" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 transition-colors duration-150">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <FaUserCircle className="text-lg" />
                  </div>
                  <span>User Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-2 text-sm font-medium text-gray-800">
          {[
            { href: "/", label: "Home" },
            { href: "/inline-skates", label: "Professional Inline Skates" },
            { href: "/quad-skates", label: "Roller/Quad Skates" },
            // { href: "/hockey-skates", label: "Hockey Skates" },
            { href: "/workout-gear", label: "Workout Gear" },
            { href: "/Contact", label: "Contact" },
            ...(isAdmin ? [{ href: "/admin-dashboard", label: "Admin Dashboard" }] : [])
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded-full ${
                pathname === href
                  ? "bg-blue-100 text-blue-600"
                  : "hover:text-blue-600 hover:bg-blue-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}



