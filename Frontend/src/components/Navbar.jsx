"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiSearch, FiShoppingCart, FiUser, FiBell } from "react-icons/fi"; // added FiBell
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMenu } from "react-icons/hi";
import { Truck, GraduationCap } from "lucide-react";
import { FaUserShield, FaUserCircle } from "react-icons/fa";
import { useCart } from "../context/CartContext"; // adjust path

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

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!admin || !!token || !!user);
    setIsAdmin(!!admin);
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
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.3;
            }
          }
          .animate-blinkSlow {
            animation: blinkSlow 2.5s ease-in-out infinite;
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
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link
              href="/inline-skates"
              className={navLinkClass("/inline-skates")}
            >
              Professional Inline Skates
            </Link>
            <Link
              href="adjustable-inline-skates"
              className={navLinkClass("#")}
            >
              Adjustable Inline Skates
            </Link>
            <Link
              href="roller-quad-hockey-skates"
              className={navLinkClass("#")}
            >
              Roller/ Quad Hockey Skates
            </Link>
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
                  <Link
                    href="/accessories"
                    className="block px-4 py-2 !text-black"
                  >
                    Accessories
                  </Link>
                  <Link
                    href="/products"
                    className="block px-4 py-2 !text-black"
                  >
                    Products
                  </Link>
                </div>
              )}
            </div>

            {isAdmin && (
              <Link
                href="/admin-dashboard"
                className={navLinkClass("/admin-dashboard")}
              >
                Admin Dashboard
              </Link>
            )}

            <Link
              href="/workout-gear"
              className={navLinkClass("/workout-gear")}
            >
              Workout Gear
            </Link>
            <Link href="/quad-skates" className={navLinkClass("/quad-skates")}>
              Quad Skates
            </Link>
            <Link href="/baby-tenacity" className={navLinkClass("/baby-tenacity")}>
              Tenacity & Baby Skates
            </Link>
            <Link href="/cycling" className={navLinkClass("#")}>
              Cycling
            </Link>
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

          <Link href="/cart" className="relative">
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 relative">
              <FiShoppingCart
                className="text-gray-800 text-xl"
                strokeWidth={2.5}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>

          {/* Notification Icon - only when logged in */}
          {/* {isLoggedIn && (
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 relative">
              <FiBell className="text-gray-800 text-xl" strokeWidth={2.5} />
            </button>
          )} */}

      <div className="relative" ref={loginDropdownRef}>
  {/* Profile button */}
  <button
    onClick={handleProfileClick}
    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 relative transition duration-300 shadow-sm"
  >
    <FiUser className="text-gray-800 text-xl" strokeWidth={2.5} />
    {isLoggedIn && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full border border-white shadow-sm" />
    )}
  </button>

  {/* Dropdown */}
  {!isLoggedIn && showLoginDropdown && (
    <div className="dropdown-menu absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl z-50 overflow-hidden animate-dropdown">
      <Link
        href="/admin-login"
        className="dropdown-item !text-orange-600 hover:bg-orange-50"
      >
        <FaUserShield className="text-lg text-orange-500" />
        <span className="text-orange-500">Admin Access</span>
      </Link>
      <hr className="border-gray-200" />
      <Link
        href="/user-login"
        className="dropdown-item text-blue-600 hover:bg-blue-50"
      >
        <FaUserCircle className="text-lg text-black" />
        <span className="text-black">User Login</span>
      </Link>
      <Link
        href="/register"
        className="dropdown-item text-green-600 hover:bg-green-50"
      >
        <FaUserCircle className="text-lg text-black" />
        <span className="text-black">User Sign Up</span>
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
            ...(isAdmin
              ? [{ href: "/admin-dashboard", label: "Admin Dashboard" }]
              : []),
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
