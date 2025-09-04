"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const otpPromise = fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      // ✅ Delay redirect so success toast is visible
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1000); // wait 1s after success toast

      return data;
    });

    toast.promise(otpPromise, {
      loading: "Sending OTP...",
      success: "OTP sent to your email! Redirecting...",
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex justify-center items-start pt-30 min-h-screen bg-gradient-to-br from-orange-100 to-blue-100">
      <form
        onSubmit={handleSendOTP}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#fef3c7", // light amber background
              color: "#1f2937", // dark text
              fontSize: "15px",
              borderRadius: "10px",
              padding: "10px 16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              marginTop: "150px",
            },
          }}
        />
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 text-[#0f172a] drop-shadow-sm">
          Forgot Password
        </h2>

        <label className="block mb-2 font-medium text-black">Email Address</label>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded-md mb-4 text-black"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition-all duration-300 hover:scale-[1.01] active:scale-95"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}
