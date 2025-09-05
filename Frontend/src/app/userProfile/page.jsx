"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch orders if user is logged in
      if (parsedUser.email) {
        fetchOrders(parsedUser.email);
      }
    } else {
      router.push("/user-login");
    }
  }, []);

  const fetchOrders = async (email) => {
    try {
      setLoadingOrders(true);
      const res = await fetch(
        `http://localhost:5000/api/orders?email=${email}`
      );
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/user-login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdf6f1] to-[#d7e9ff] font-['Arimo']">
  <main className="flex-grow px-6 py-12">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-gray-800 drop-shadow-sm">
      My Account
    </h1>

    {/* Tabs */}
    <div className="flex justify-center mb-8 border-b border-gray-300">
      <button
        onClick={() => setActiveTab("profile")}
        className={`px-6 py-3 font-semibold border-b-2 ${
          activeTab === "profile"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700 transition"
        }`}
      >
        Profile
      </button>
      <button
        onClick={() => setActiveTab("orders")}
        className={`px-6 py-3 font-semibold border-b-2 ${
          activeTab === "orders"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700 transition"
        }`}
      >
        Orders
      </button>
    </div>

    {/* Profile Tab */}
{activeTab === "profile" && (
  <div className="bg-gradient-to-tr from-white via-gray-100 to-white p-8 rounded-3xl shadow-xl max-w-3xl mx-auto transition-all duration-300">
    {/* Header */}
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
      {/* Avatar with pulse animation */}
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg animate-pulse-slow">
        {user.name?.charAt(0)}
      </div>
      {/* User Info */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 transition-transform duration-300 hover:scale-105">
          {user.name}
        </h2>
        <p className="text-gray-600 mt-1">{user.email}</p>
        {user.phone && (
          <p className="text-gray-500 mt-1 text-sm">Phone: {user.phone}</p>
        )}
      </div>
    </div>

    <hr className="border-gray-300 mb-8" />

    {/* User Details Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {["Full Name", "Email Address", "Phone Number"].map((label, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]"
        >
          <label className="block text-sm font-medium mb-2 text-gray-600">
            {label}
          </label>
          <input
            value={
              label === "Full Name"
                ? user.name
                : label === "Email Address"
                ? user.email
                : user.phone || "Not Provided"
            }
            readOnly
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          />
        </div>
      ))}
    </div>

    {/* Logout Button */}
    <div className="mt-8 flex justify-center md:justify-start">
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-[1.05] active:scale-95 hover:shadow-2xl"
      >
        Logout
      </button>
    </div>
  </div>
)}


    {/* Orders Tab */}
    {activeTab === "orders" && (
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl max-w-3xl mx-auto transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
        </div>

        {loadingOrders ? (
          <p className="text-center text-gray-500 py-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border rounded-2xl bg-gray-50 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-gray-400 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1M9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
              No orders yet
            </p>
            <p className="mb-6 text-gray-500 text-sm sm:text-base">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => router.push("/inline-skates")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base shadow-md hover:shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    <strong className="text-gray-700">Order ID:</strong> #
                    {order.id}
                  </span>
                  <span>
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <div className="space-y-2 text-gray-800 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * (item.quantity / 100)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t pt-3 mt-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{order.totalAmount/100}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </main>
</div>

  );
}
