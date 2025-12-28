"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { Mail } from "lucide-react";

// Client component that uses searchParams
function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    // Get email from URL params on client side only
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const resetPromise = fetch("https://api.lgmsports.in/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setTimeout(() => {
        router.push("/user-login");
      }, 1000);
    });

    toast.promise(resetPromise, {
      loading: "Resetting password...",
      success: "Password updated successfully! Redirecting to login...",
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Card Container */}
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Left Side - Reset Password Form */}
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
            Reset Password
          </h2>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-900">
                OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm text-black"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-900">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 text-white py-2 rounded-md font-semibold text-sm shadow-md transition-all"
            >
              Reset Password
            </button>
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
          <div className=" relative z-10 px-4 w-5/6 text-center border border-white/60 bg-white/40 backdrop-blur-md rounded-lg shadow-md p-4">
            <h2 className="text-xl md:text-2xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-orange-700 via-red-500 to-blue-700 bg-clip-text text-transparent drop-shadow-md">
                Secure Your Account
              </span>
            </h2>
            <p className="text-sm md:text-base font-medium text-gray-900 leading-relaxed">
              Enter the <span className="font-semibold text-red-600">OTP</span> sent
              to your email and choose a{" "}
              <span className="font-semibold text-blue-600">new password</span>.
              <br className="hidden md:block" />
              <span className="italic text-gray-700 block mt-2 text-xs">
                A fresh start for stronger security.
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

// Loading fallback
function ResetPasswordLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Loading...</h2>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
