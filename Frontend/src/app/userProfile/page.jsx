"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { LogOut, User, Mail, Phone } from "lucide-react";

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
        `https://api.lgmsports.in/api/orders?email=${email}`
      );
      const data = await res.json();
      if (data.success) {
        console.log("Order data received:", data.orders);
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
  <div className="bg-gradient-to-tr from-gray-50 via-white to-gray-50 p-10 rounded-3xl shadow-2xl max-w-4xl mx-auto transition-all duration-500">
    
    {/* Header Section */}
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
      
      {/* Avatar with Pulse + Border */}
      <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-5xl font-extrabold text-white shadow-xl animate-pulse-slow border-4 border-white">
        {user?.name?.charAt(0).toUpperCase() || "U"}
      </div>
      
      {/* User Info */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-800 hover:text-orange-500 transition-colors duration-300">
          {user?.name || "Unknown User"}
        </h2>
        <p className="text-gray-600 mt-2 flex items-center justify-center md:justify-start gap-2">
          <Mail className="w-4 h-4 text-gray-500" /> {user?.email || "No email provided"}
        </p>
        {user?.phone && (
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" /> {user.phone}
          </p>
        )}
      </div>
    </div>

    <hr className="border-gray-300 mb-10" />

    {/* User Details Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { label: "Full Name", icon: User, value: user?.name || "Not Provided" },
        { label: "Email Address", icon: Mail, value: user?.email || "Not Provided" },
        { label: "Phone Number", icon: Phone, value: user?.phone || "Not Provided" },
      ].map((field, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-3 text-orange-500">
            <field.icon className="w-5 h-5" />
            <span className="font-medium text-gray-700">{field.label}</span>
          </div>
          <input
            type="text"
            value={field.value}
            readOnly
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-orange-300 transition-all duration-200"
          />
        </div>
      ))}
    </div>

    {/* Logout Button */}
    <div className="mt-10 flex justify-center md:justify-start">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-7 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-200 hover:scale-[1.05] active:scale-95"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  </div>
)}





    {/* Orders Tab */}
    {activeTab === "orders" && (
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl max-w-3xl mx-auto transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Order History</h2>
        </div>

        {loadingOrders ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-blue-100 rounded-2xl bg-white text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-orange-400 mb-4"
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
            <p className="text-xl sm:text-2xl font-semibold mb-2 text-blue-700">
              No orders yet
            </p>
            <p className="mb-6 text-gray-600 text-sm sm:text-base max-w-xs mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <button
              onClick={() => router.push("/inline-skates")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base shadow-md hover:shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm hover:shadow-md transition group"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="font-medium">
                        Order #<span className="font-bold">{order.id}</span>
                      </span>
                    </div>
                    <span className="text-sm opacity-90 mt-1 sm:mt-0">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="p-5">
                  <div className="space-y-3 text-gray-800 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                          <span className="font-medium">
                            {item.name} 
                            <span className="text-blue-600 ml-1 font-semibold">× {item.quantity}</span>
                          </span>
                        </div>
                        <span className="font-semibold">₹{item.price * (item.quantity / 100)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Total with Discount Breakdown */}
                  <div className="bg-blue-50 rounded-xl overflow-hidden mt-3">
                    {/* Show discount section if any discount indicator is present */}
                    {(order.discountApplied === true || 
                      (order.couponData && Object.keys(order.couponData).length > 0) ||
                      (typeof order.discountAmount === 'number' && order.discountAmount > 0)) && (
                      <>
                        <div className="bg-orange-100 px-3 py-2 border-b border-orange-200 flex justify-between items-center">
                          <span className="text-sm font-medium text-orange-700 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                            Academic Discount
                          </span>
                          <span className="text-sm font-semibold text-orange-700">-10%</span>
                        </div>
                        
                        <div className="flex justify-between items-center px-3 py-2 text-sm text-gray-600">
                          <span>Subtotal</span>
                          <span className="line-through">₹{Math.round((order.totalAmount/100) / 0.9)}</span>
                        </div>
                      </>
                    )}
                    
                    {/* Total amount */}
                    <div className="flex justify-between items-center p-3">
                      <span className="font-medium text-blue-800">
                        Total Amount
                      </span>
                      <span className="text-xl font-bold text-blue-800">
                        ₹{order.totalAmount/100}
                      </span>
                    </div>
                  </div>
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
