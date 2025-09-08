"use client";

import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginPromise = fetch("https://api.lgmsports.in/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        const { name, email, phone } = data.user;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ name, email, phone }));
        
        // Dispatch custom event to notify other components about login
        window.dispatchEvent(new Event("authChange"));

        return data;
      })
      .then(() => router.push("/userProfile"));

    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: "Login successful!",
      error: (err) => err.message || "Login failed",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Card Container */}
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Left Side - Login Form */}
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

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Mail className="w-6 h-6 text-orange-500" />
            Login Your Account
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-900">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm text-black"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-900">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm text-black"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm text-black">
              <label className="flex items-center gap-2 text-[16px]">
                <input type="checkbox" className="accent-orange-500 w-4 h-4" />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="!text-blue-600 hover:underline text-[16px] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 text-white py-2 rounded-md font-semibold text-sm shadow-md transition-all"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-900">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="!text-blue-600 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
          <p className="text-center text-sm mt-4 text-gray-900">
            Go to home page?{" "}
            <Link
              href="/"
              className="!text-blue-600 hover:underline font-semibold"
            >
              Click here
            </Link>
          </p>
        </div>

        {/* Right Side - Image/Text Section */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center bg-blend-overlay bg-orange-200 relative bg-cover bg-center"
          style={{ backgroundImage: "url('/banner/banner1.jpg')" }}
        >
          {/* Logo */}
          <div className="absolute top-4 flex justify-center w-full z-20">
            <img
              src="/logo/lo.jpg"
              alt="LGM Sports Logo"
              className="w-28 md:w-36 object-contain drop-shadow-2xl animate-pop"
            />
          </div>

          {/* Text content */}
          <div className="relative z-10 px-4 w-6/7 text-center border border-white/60 bg-white/10 backdrop-blur-md rounded-lg shadow-md p-2 mt-6">
            <h2 className="text-xl md:text-2xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-orange-700 via-red-500 to-blue-700 bg-clip-text text-transparent drop-shadow-md">
                Welcome Back
              </span>
            </h2>
            <p className="text-sm md:text-base font-medium text-gray-900 leading-relaxed">
              Sign in to access your{" "}
              <span className="font-semibold text-orange-600">Skates</span>,
              <span className="font-semibold text-blue-600"> Cycling Gear</span>,
              and
              <span className="font-semibold text-orange-600">
                {" "}
                Workout Essentials
              </span>{" "}
              — your journey to greatness continues here.
              <br className="hidden md:block" />
              <span className="italic text-black block mt-2 text-xs bg-amber-200 rounded-2xl">
                Champions never stop.
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
