"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const resetPromise = fetch(
      "http://localhost:5000/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      }
    ).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setTimeout(() => {
        router.push("/user-login");
      }, 1000); // wait 1s after success toast
    });

    toast.promise(resetPromise, {
      loading: "Resetting password...",
      success: "Password updated successfully & Redirecting to login page!",
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex justify-center items-start pt-30 min-h-screen bg-gradient-to-br from-orange-100 to-blue-100">
      <form
        onSubmit={handleResetPassword}
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
              marginTop: "140px",
            },
          }}
        />
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 text-[#0f172a] drop-shadow-sm">
          Reset Password
        </h2>
        <label className="block mb-2 font-medium text-black">OTP</label>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full border p-2 rounded-md mb-4 text-black"
        />
        <label className="block mb-2 font-medium text-black">
          New Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full border p-2 rounded-md mb-4 text-black"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
