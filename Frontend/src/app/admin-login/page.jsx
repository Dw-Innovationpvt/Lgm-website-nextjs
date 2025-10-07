"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Lock, ShieldCheck, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginPromise = fetch("https://lgmsports.onrender.com/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem(
          "admin",
          JSON.stringify({
            name: data.name || adminId,
            email: data.email || "admin@example.com",
          })
        );

        return data;
      })
      .then(() => {
        router.push("/admin-dashboard");
      });

    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: "Admin login successful!",
      error: (err) => err.message || "Login failed",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Card Container */}
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Left Side - Admin Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#fef3c7",
                color: "#1f2937",
                fontSize: "15px",
                borderRadius: "10px",
                padding: "10px 16px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              },
            }}
          />

          <div className="flex justify-center mb-4">
            <ShieldCheck className="w-12 h-12 text-orange-500" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
            Admin Sign In
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Access your admin dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 outline-none transition duration-200 hover:border-gray-400"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 outline-none transition duration-200 hover:border-gray-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 text-white py-2 rounded-md font-semibold text-sm shadow-md transition-all"
            >
              Sign In as Admin
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-900">
            Not an admin?{" "}
            <a
              href="/"
              className="!text-blue-600 hover:underline font-semibold"
            >
              Return to store
            </a>
          </p>
        </div>

        {/* Right Side - Background Image with Logo & Text */}
        <div
          className="w-full md:w-1/2 flex flex-col items-center justify-start bg-blend-overlay bg-orange-200 relative bg-cover bg-center"
          style={{ backgroundImage: "url('/banner/banner1.jpg')" }}
        >
          {/* Logo */}
          <div className="absolute top-4 flex justify-center w-full z-20 mt-4">
            <img
              src="/logo/lo.jpg"
              alt="LGM Sports Logo"
              className="w-28 md:w-36 object-contain drop-shadow-2xl animate-pop"
            />
          </div>

          {/* Text content */}
          <div className="mt-40 relative z-10 px-4 w-5/6 text-center border border-white/60 bg-white/40 backdrop-blur-md rounded-lg shadow-md p-4">
            <h2 className="text-xl md:text-2xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-orange-700 via-red-500 to-blue-700 bg-clip-text text-transparent drop-shadow-md">
                Welcome Admin
              </span>
            </h2>
            <p className="text-sm md:text-base font-medium text-gray-900 leading-relaxed">
              Sign in to manage the{" "}
              <span className="font-semibold text-orange-600">store</span> and
              <span className="font-semibold text-blue-600"> dashboard</span> —
              stay on top of operations.
              <br className="hidden md:block" />
              <span className="italic text-gray-700 block mt-2 text-xs">
                Security and control first.
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
