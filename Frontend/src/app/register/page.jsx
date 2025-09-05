"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          })
        );
        localStorage.setItem("token", data.token);

        router.push("/userProfile");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Card Container */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <UserPlus className="w-6 h-6 text-orange-500" />
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-900">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm text-black"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-900">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm text-black"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-900">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">
                <span className="px-2 bg-gray-100 text-gray-700 text-xs">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-2 py-2 outline-none text-sm text-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-900">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm text-black"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-900">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm text-black"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 text-white py-2 rounded-md font-semibold text-sm shadow-md transition-all"
            >
              Create Account
            </button>

            {message && (
              <p className="text-center mt-2 text-xs text-red-600">{message}</p>
            )}
          </form>

          <p className="text-center text-sm mt-4 text-gray-900">
            Already have an account?{" "}
            <Link
              href="/user-login"
              className="text-orange-600 hover:underline font-semibold"
            >
              <span className="text-blue-600">Login</span>
            </Link>
          </p>
        </div>

        {/* Right Side - Image/Text Section */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center bg-blend-overlay bg-orange-300 relative bg-cover bg-center"
          style={{ backgroundImage: "url('/inline.jpg')" }}
        >
          {/* Logo */}
          <div className="absolute top-4 mt-14 flex justify-center w-full z-20">
            <img
              src="/logo/lo.jpg"
              alt="LGM Sports Logo"
              className="w-28 md:w-36 object-contain drop-shadow-2xl animate-pop"
            />
          </div>

          {/* Text content */}
          <div className="relative z-10 px-4 max-w-sm text-center border border-white/60 bg-white/40 backdrop-blur-md rounded-lg shadow-md p-4">
            <h2 className="text-xl md:text-2xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-orange-700 via-red-500 to-blue-700 bg-clip-text text-transparent drop-shadow-md">
                Gear Up for Greatness
              </span>
            </h2>
            <p className="text-sm md:text-base font-medium text-gray-900 leading-relaxed">
              Discover{" "}
              <span className="font-semibold text-orange-600">Skates</span>,
              <span className="font-semibold text-blue-600"> Cycling Gear</span>
              , and
              <span className="font-semibold text-red-600">
                {" "}
                Workout Essentials
              </span>{" "}
              — designed to push your limits.
              <br className="hidden md:block" />
              <span className="italic text-gray-700 block mt-2 text-xs">
                Every champion starts with the right gear.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Animation Style */}
      <style jsx>{`
        @keyframes pop {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        .animate-pop {
          animation: pop 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
