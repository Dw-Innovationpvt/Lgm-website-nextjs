


"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginPromise = fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }

        // ✅ Save token and full user info including phone
        const { name, email, phone } = data.user;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ name, email, phone }));

        return data;
      })
      .then(() => {
        router.push("/userProfile");
      });

    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: "Login successful!",
      error: (err) => err.message || "Login failed",
    });
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-gradient-to-br from-orange-100 to-blue-100 text-black text-[16px]">
      <div className="flex-grow flex justify-center items-center px-4 py-20">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-[#0f172a] drop-shadow-sm">
            Login Your Account
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="relative">
              <label className="block mb-2 font-medium text-[16px]">
                Email Address
              </label>
              <Mail className="absolute left-3 top-10 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-orange-400 text-black placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <label className="block mb-2 font-medium text-[16px]">
                Password
              </label>
              <Lock className="absolute left-3 top-10 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-orange-400 text-black placeholder-gray-400"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
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
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold text-lg shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-95"
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-base mt-6 text-black text-[16px]">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="!text-blue-600 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>  
    </div>
  );
}
