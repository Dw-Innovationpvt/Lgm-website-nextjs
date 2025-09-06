"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiSearch, FiShoppingCart, FiUser, FiBell } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMenu } from "react-icons/hi";
import { Truck, GraduationCap, ChevronDown, ShoppingBag } from "lucide-react";
import { FaUserShield, FaUserCircle, FaRegHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext"; // adjust path
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const loginDropdownRef = useRef(null);
  const router = useRouter();

  const { cart } = useCart(); // ✅ get cart from context
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0); // ✅ total quantity

  // Check login status on component mount and when localStorage changes
  const checkLoginStatus = () => {
    const admin = localStorage.getItem("admin");
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!admin || !!token || !!user);
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
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(e.target)
      ) {
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
    `px-4 py-2 rounded-md font-semibold transition-all duration-300 relative tracking-wide
     ${
       pathname === path
         ? "bg-gradient-to-r from-blue-50 to-blue-100 !text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-[3px] after:bg-blue-600 after:rounded-full font-bold"
         : "!text-gray-800 hover:bg-blue-50/70 hover:text-blue-600"
     }`;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white text-md text-center py-2.5 font-[var(--font-raleway)] flex justify-center items-center gap-4 shadow-sm">
        <motion.div 
          className="flex items-center gap-1.5"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <Truck size={18} className="text-white" strokeWidth={2.5} />
          <span>Free Delivery on Every Order</span>
        </motion.div>
        <span className="text-white/80">|</span>
        <motion.div 
          className="flex items-center gap-1.5"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.7 }}
        >
          <GraduationCap size={18} className="text-white" strokeWidth={2.5} />
          <span>Extra 10% Discount for Academic Students</span>
        </motion.div>
        <style jsx>{`
          .dropdown-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            transition: all 0.2s ease;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-dropdown {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}</style>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 md:px-12 flex justify-between items-center py-3 sticky top-0 z-50 font-[var(--font-raleway)]">
        {/* Left Nav */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Button */}
          <HiMenu
            className="text-3xl text-gray-800 md:hidden cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={() => setMobileMenu(!mobileMenu)}
          />

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-wrap items-center gap-x-4 text-[16px] md:text-[17px] max-w-5xl tracking-wide">
            <Link
              href="/"
              className={`${navLinkClass(
                "/"
              )} transition-all duration-300 hover:text-blue-600 hover:underline underline-offset-4`}
            >
              Home
            </Link>
            <Link
              href="/inline-skates"
              className={`${navLinkClass(
                "/inline-skates"
              )} transition-all duration-300 hover:text-blue-600 hover:underline underline-offset-4 `}
            >
              Professional Inline Skates
            </Link>
            <Link
              href="/adjustable-inline-skates"
              className={`${navLinkClass(
                "/adjustable-inline-skates"
              )} transition-all duration-300 hover:text-blue-600 hover:underline underline-offset-4`}
            >
              Adjustable Inline Skates
            </Link>
            <Link
              href="/hockey-skates"
              className={`${navLinkClass(
                "/hockey-skates"
              )} transition-all duration-300 hover:text-blue-600 hover:underline underline-offset-4`}
            >
              Roller / Quad Hockey Skates
            </Link>

            {/* Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="flex items-center ml-12 text-black gap-1 px-4 py-2 rounded-full transition-all duration-300 hover:text-blue-600 hover:bg-blue-50 group font-medium">
                Products
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 left-0 bg-white w-60 shadow-xl border rounded-xl overflow-hidden z-50">
                  <Link
                    href="/accessories"
                    className="block px-5 py-2 !text-black hover:bg-blue-100 hover:text-blue-600 transition"
                  >
                    Accessories
                  </Link>
                  <Link
                    href="/product"
                    className="block px-5 py-2 !text-black hover:bg-blue-100 hover:text-blue-600 transition"
                  >
                    Products
                  </Link>
                </motion.div>
              )}
            </div>

            <Link
              href="/workout-gear"
              className={`${navLinkClass(
                "/workout-gear"
              )} transition-all duration-300 hover:text-blue-600 hover:underline underline-offset-4`}
            >
              Workout Gear
            </Link>
            <Link
              href="/quad-skates"
              className={`${navLinkClass(
                "/quad-skates"
              )} transition-all duration-300 hover:text-blue-600 hover:underline underline-offset-4`}
            >
              Quad Skates
            </Link>
            <Link
              href="/baby-tenacity"
              className={`${navLinkClass(
                "/baby-tenacity"
              )} transition-all duration-300 hover:text-blue-600 hover:underline underline-offset-4`}
            >
              Tenacity & Baby Skates
            </Link>
            <Link
              href="/cycling"
              className={`${navLinkClass(
                "/cycling"
              )} transition-all duration-300 hover:text-blue-600 hover:underline underline-offset-4`}
            >
              Cycling
            </Link>

            {isAdmin && (
              <Link
                href="/admin-dashboard"
                className={`${navLinkClass(
                  "/admin-dashboard"
                )} transition-all duration-300 hover:text-blue-600 hover:underline underline-offset-4`}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 md:gap-5 pb-10 relative font-semibold">
          <div className="hidden md:block relative group">
            <input
              type="text"
              placeholder="Search products..."
              className="rounded-full border border-gray-300 py-2.5 px-5 pr-12 text-sm w-80 outline-none text-gray-800 transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 group-hover:border-blue-300"
            />
            <button className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 text-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-300 p-1.5 rounded-full">
              <FiSearch className="h-4 w-4 text-blue-600" />
            </button>
          </div>

          <Link href="/cart" className="relative">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center hover:bg-blue-100 relative transition-all duration-300 shadow-sm"
            >
              <ShoppingBag
                className="text-blue-600 h-5 w-5"
                strokeWidth={2}
              />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
          </Link>
          
          
          {/* Notification Icon - only when logged in */}
          {/* {isLoggedIn && (
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 relative">
              <FiBell className="text-gray-800 text-xl" strokeWidth={2.5} />
            </button>
          )} */}

          <div className="relative" ref={loginDropdownRef}>
            {/* Profile button */}
            <motion.button
              onClick={handleProfileClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 relative transition-all duration-300 shadow-sm"
            >
              <FiUser className="text-gray-700 h-5 w-5" strokeWidth={2} />
              {isLoggedIn && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" 
                />
              )}
            </motion.button>

            {/* Dropdown */}
            {!isLoggedIn && showLoginDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="dropdown-menu absolute right-0 mt-3 w-60 rounded-2xl shadow-2xl z-50 overflow-hidden bg-white border border-gray-100">
                <div className="px-3 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 tracking-wider">Account Access</h3>
                </div>
                <Link
                  href="/admin-login"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors duration-200 font-[var(--font-raleway)]"
                >
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FaUserShield className="text-lg text-orange-600" />
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-800">Admin Access</span>
                    <span className="text-xs text-gray-500">Login to admin dashboard</span>
                  </div>
                </Link>
                <hr className="border-gray-100" />
                <Link
                  href="/user-login"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200 font-[var(--font-raleway)]"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaUserCircle className="text-lg text-blue-600" />
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-800">User Login</span>
                    <span className="text-xs text-gray-500">Access your account</span>
                  </div>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors duration-200 font-[var(--font-raleway)]"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaUserCircle className="text-lg text-green-600" />
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-800">Sign Up</span>
                    <span className="text-xs text-gray-500">Create a new account</span>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg px-6 py-4 space-y-2 text-sm font-medium text-gray-800 border-t border-gray-100">
          {[
            { href: "/", label: "Home" },
            { href: "/inline-skates", label: "Professional Inline Skates" },
            { href: "/quad-skates", label: "Roller/Quad Skates" },
            // { href: "/hockey-skates", label: "Hockey Skates" },
            { href: "/workout-gear", label: "Workout Gear" },
            { href: "/Contact", label: "Contact" },
            ...(isAdmin
              ? [{ href: "/admin-dashboard", label: "Admin Dashboard" }]
              : []),
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2.5 rounded-lg flex items-center transition-all duration-300 ${
                pathname === href
                  ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-600 font-semibold"
                  : "hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </motion.div>
      )}
    </>
  );
}
