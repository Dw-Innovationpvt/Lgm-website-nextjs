"use client";

import { ShieldCheck, LogOut, Mail, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdminProfile = () => {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("admin@example.com"); // default

  const joinDate = "August 2025";

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setAdminEmail(admin.email || "admin@example.com");
    } else {
      // If not logged in, redirect
      router.push("/admin-login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token"); // optional if you're using it
    router.push("/admin-login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900 font-sans">
      <div className="bg-white/90 backdrop-blur-xl sm:p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-200 animate-fadeIn">
        
        {/* Admin Icon */}
        <div className="flex justify-center mb-5">
          <div className="bg-orange-100 p-4 rounded-full shadow-md">
            <ShieldCheck size={60} className="text-orange-500 drop-shadow-sm" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-1">Admin Profile</h2>
        <p className="text-gray-500 mb-8">
          Welcome back,{" "}
          <span className="font-semibold text-orange-600">
            {adminEmail?.split("@")[0]}
          </span>
        </p>

        {/* Admin Details Card */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-left p-5 rounded-xl mb-8 border border-gray-200 shadow-inner space-y-3">
          <p className="flex items-center gap-2 font-semibold text-gray-700">
            <Mail size={18} className="text-orange-500" />
            Email: <span className="font-normal text-gray-600">{adminEmail}</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-gray-700">
            <UserCheck size={18} className="text-green-600" />
            Role: <span className="ml-1 font-medium">Admin</span>
          </p>
          <p className="text-sm text-gray-600">Joined: {joinDate}</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center cursor-pointer justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
