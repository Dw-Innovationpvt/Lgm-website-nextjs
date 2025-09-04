"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  // Import additional icons
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
  
  const OrderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
  
  const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch orders if user is logged in
        if (parsedUser.email) {
          fetchOrders(parsedUser.email);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Handle invalid user data in localStorage
        localStorage.removeItem("user");
        router.replace("/user-login");
      }
    } else {
      // No user found in localStorage, redirect to login
      router.replace("/user-login");
    }
    
    // Set active tab to orders if coming from checkout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'orders') {
      setActiveTab('orders');
    }
  }, []);
  
  // Listen for cart changes which might indicate a new order
  useEffect(() => {
    const refreshOrders = () => {
      if (user?.email) {
        fetchOrders(user.email);
        setActiveTab('orders'); // Switch to orders tab
      }
    };
    
    window.addEventListener("cartChange", refreshOrders);
    
    return () => {
      window.removeEventListener("cartChange", refreshOrders);
    };
  }, [user]);

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
    // Remove user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Force a client-side state update before navigation
    setUser(null);
    setOrders([]);
    
    // Dispatch a custom event to notify other components (like Navbar) about the auth change
    window.dispatchEvent(new Event("authChange"));
    
    // Use router.replace instead of push for a clean navigation
    router.replace("/user-login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-orange-50 font-['Arimo']">
      <main className="flex-grow px-4 py-12 max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 px-8 py-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h1 className="text-3xl font-bold relative z-10">My Account</h1>
            <p className="text-blue-100 mt-1 relative z-10">Manage your profile and orders</p>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-8 py-4 font-medium transition-all duration-200 ${activeTab === "profile"
                ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"}`}
            >
              <UserIcon />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-8 py-4 font-medium transition-all duration-200 ${activeTab === "orders"
                ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"}`}
            >
              <OrderIcon />
              Orders
            </button>
          </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-3xl font-bold text-white uppercase shadow-lg transform hover:scale-105 transition-transform duration-300">
                {user?.name?.charAt(0) || '?'}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {user?.name || 'Guest User'}
                </h2>
                <p className="text-gray-500 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {user?.email || 'No email available'}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-orange-50 p-6 rounded-xl mb-8 border border-orange-100 shadow-inner">
              <h3 className="text-lg font-semibold text-orange-700 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-800 font-medium">{user?.name || 'Not Available'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-800 font-medium">{user?.email || 'Not Available'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-800 font-medium">{user?.phone || "Not Provided"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-lg font-medium transition-all duration-200"
              >
                <LogoutIcon />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order History
              </h2>
            </div>

            {loadingOrders ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl text-center border border-orange-100">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center mb-4 shadow-inner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-orange-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <p className="text-xl font-bold mb-2 text-gray-800">
                  No orders yet
                </p>
                <p className="mb-8 text-gray-500 max-w-md">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <button
                  onClick={() => router.push("/inline-skates")}
                  className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-orange-50 px-6 py-4 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <span className="font-semibold text-gray-800">Order #{order.id}</span>
                        </div>
                        <span className="text-sm text-gray-500 mt-1 sm:mt-0 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                          {new Date(order.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3 mb-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-medium">
                                {item.quantity}
                              </span>
                              <span className="font-medium text-gray-800">{item.name}</span>
                            </div>
                            <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
                        <span className="font-medium text-gray-700">
                          Total Amount
                        </span>
                        <span className="text-xl font-bold text-orange-600">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
