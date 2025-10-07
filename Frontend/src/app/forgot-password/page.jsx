"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const otpPromise = fetch("https://lgmsports.onrender.com/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      // Delay redirect so success toast is visible
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1000);

      return data;
    });

    toast.promise(otpPromise, {
      loading: "Sending OTP...",
      success: "OTP sent to your email! Redirecting...",
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Card Container */}
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Left Side - Forgot Password Form */}
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
            Forgot Password
          </h2>

          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-900">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 text-white py-2 rounded-md font-semibold text-sm shadow-md transition-all"
            >
              Send OTP
            </button>

            <p className="text-center text-sm mt-4 text-gray-900">
              Remembered your password?{" "}
              <Link
                href="/user-login"
                className="!text-blue-600 hover:underline font-semibold"
              >
                Back to Login
              </Link>
            </p>
          </form>
        </div>

        {/* Right Side - Background Image with Logo & Text */}
<div
  className="w-full md:w-1/2 flex flex-col items-center justify-start bg-blend-overlay bg-orange-300 relative bg-cover bg-center"
  style={{ backgroundImage: "url('/inline.jpg')" }}
>
  {/* Logo */}
  <div className="mt-6 flex justify-center w-full z-20">
    <img
      src="/logo/lo.jpg"
      alt="LGM Sports Logo"
      className="w-28 md:w-36 object-contain drop-shadow-2xl animate-pop"
    />
  </div>

  {/* Text content */}
  <div className="relative z-10 px-4 w-5/6 text-center border border-white/60 bg-white/40 backdrop-blur-md rounded-lg shadow-md">
    <h2 className="text-xl md:text-2xl font-extrabold mb-3">
      <span className="bg-gradient-to-r from-orange-700 via-red-500 to-blue-700 bg-clip-text text-transparent drop-shadow-md">
        Reset Your Password
      </span>
    </h2>
    <p className="text-sm md:text-base font-medium text-gray-900 leading-relaxed">
      Enter your email to receive a{" "}
      <span className="font-semibold text-orange-600">secure OTP</span> and
      reset your password.
      <br className="hidden md:block" />
      <span className="italic text-gray-700 block mt-2 text-xs">
        Security first. Quick recovery.
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
