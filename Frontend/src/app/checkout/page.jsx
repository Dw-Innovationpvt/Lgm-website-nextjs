"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, GraduationCap, MapPin, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader } from "react-spinners";

export default function CheckoutPage() {
  const router = useRouter();
  const { clearCart: contextClearCart } = useCart();

  // Custom clearCart function that clears both context and localStorage
  const clearCart = () => {
    // Clear cart in context
    contextClearCart();

    // Also clear cart in localStorage for the current user
    const getUserId = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          return userData.id || userData.email || "guest";
        } catch (e) {
          return "guest";
        }
      }
      return "guest";
    };

    const userId = getUserId();
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify([]));
  };

  // Shipping/checkout form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    paymentMethod: "cod",
  });

  const [cart, setCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // --- Academic discount state ---
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponData, setCouponData] = useState({
    studentName: "",
    academyName: "",
    studentAddress: "",
  });
  const [discountApplied, setDiscountApplied] = useState(false);

  // Totals
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountAmount = discountApplied ? Math.round(cartTotal * 0.1) : 0; // 10%
  const finalTotal = cartTotal - discountAmount;

  const deliveryMessage = "Free delivery on every order";
  const policy = "Extra 10% discount for Academic Students";
  const returnPolicy =
    "If you have to return it should be done within 1 week of purchase or else it won't be accepted";
  const condition =
    "The returned goods should be returned in same condition with all accessories as they were purchased or else it won't be accepted";

  useEffect(() => {
    // Get user ID for cart key
    const getUserId = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          return userData.id || userData.email || "guest";
        } catch (e) {
          return "guest";
        }
      }
      return "guest";
    };

    const userId = getUserId();
    const cartKey = `cart_${userId}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);

    // Pre-fill email from logged in user if available
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    if (storedUser && storedUser.email) {
      setFormData((prev) => ({
        ...prev,
        email: storedUser.email,
        firstName: storedUser.name?.split(" ")[0] || "",
        lastName: storedUser.name?.split(" ")[1] || "",
      }));
    }

    // Listen for cart changes
    const handleCartChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCart(updatedCart);
    };

    window.addEventListener("cartChange", handleCartChange);

    return () => {
      window.removeEventListener("cartChange", handleCartChange);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCouponChange = (e) => {
    const { name, value } = e.target;
    setCouponData({ ...couponData, [name]: value });
  };

  const applyCoupon = (e) => {
    e.preventDefault();
    if (
      couponData.studentName &&
      couponData.academyName &&
      couponData.studentAddress
    ) {
      setDiscountApplied(true);
      setShowCouponForm(false);
      toast.success("10% academic discount applied!");
    } else {
      toast.error("Please fill all academic details.");
    }
  };

  // Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // send discounted amount
    const totalAmount = finalTotal;

    if (formData.paymentMethod === "razorpay") {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load Razorpay SDK.");
        setIsSubmitting(false);
        return;
      }

      try {
        // Create Razorpay order
        const { data } = await axios.post(
          "http://localhost:5000/api/payment/order",
          {
            amount: totalAmount,
          }
        );

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "Sports Store",
          description: "Order Payment",
          order_id: data.id,
          handler: async (response) => {
            try {
              // Get user email from localStorage if available
              const storedUser = JSON.parse(localStorage.getItem("user")) || {};
              const userEmail = storedUser.email || formData.email;

              // Make sure email is set in formData
              const updatedFormData = {
                ...formData,
                email: userEmail,
              };

              // Transform coupon data to academicDetails format if discount is applied
              const academicDetails = discountApplied
                ? {
                    studentName: couponData.studentName,
                    academyName: couponData.academyName,
                    studentAddress: couponData.studentAddress,
                    discountAmount: discountAmount * 100, // Convert to paise/cents for backend
                  }
                : null;

              // Verify + save order
              const verify = await axios.post(
                "http://localhost:5000/api/payment/verify",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  formData: updatedFormData,
                  cart,
                  totalAmount,
                  academicDetails,
                }
              );

              if (verify.data.success) {
                // Clear cart using our custom function
                clearCart();

                // Dispatch event to notify other components
                window.dispatchEvent(new Event("cartChange"));

                toast.success("Payment successful! Order placed.");
                router.replace("/userProfile?tab=orders");
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (err) {
              console.error("Payment verification error", err);
              alert("Payment verification error.");
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Payment initiation error", error);
        alert("Error initiating Razorpay.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Cash on Delivery
    try {
      // Get user email from localStorage if available
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      const userEmail = storedUser.email || formData.email;

      // Make sure email is set in formData
      const updatedFormData = {
        ...formData,
        email: userEmail,
      };

      // Transform coupon data to academicDetails format if discount is applied
      const academicDetails = discountApplied
        ? {
            studentName: couponData.studentName,
            academyName: couponData.academyName,
            studentAddress: couponData.studentAddress,
            discountAmount: discountAmount * 100, // Convert to paise/cents for backend
          }
        : null;

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: updatedFormData,
          cart,
          totalAmount,
          academicDetails,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart using our custom function
        clearCart();

        // Dispatch event to notify other components
        window.dispatchEvent(new Event("cartChange"));

        toast.success("Order placed successfully!");

        // Use router.replace for a clean navigation without history stacking
        router.replace("/userProfile?tab=orders");
      } else {
        toast.error("Failed to place order. Try again.");
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-blue-50 to-orange-50 font-['Arimo']">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 bg-gradient-to-br from-white to-blue-50 max-w-md w-full">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg
              className="w-12 h-12 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent inline-block mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">Add items to checkout</p>
          <button
            onClick={() => router.push("/cart")}
            className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 w-full"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-2 font-['Arimo'] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent inline-block">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Shipping form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-6 w-full lg:w-2/3 border border-blue-100 bg-gradient-to-br from-white to-blue-50"
          >
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent inline-block">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  First Name *
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:border-blue-300 font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Last Name *
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:border-blue-300 font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:border-blue-300 font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:border-blue-300 font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  rows="2"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:border-blue-300 font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  City *
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City name"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:border-blue-300 font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  State *
                </label>
                <div className="relative">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:border-blue-300 font-medium text-gray-700 appearance-none bg-white"
                  >
                    <option value="" disabled>
                      Select your state
                    </option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Pincode *
                </label>
                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:border-blue-300 font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            <div className="mt-6 text-black">
              <label className="text-sm font-medium mb-2 bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent inline-block">
                Payment Method
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={formData.paymentMethod === "razorpay"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Online Payment (Credit/Debit Card, UPI, Net Banking)
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-6 w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 rounded-lg font-medium shadow-md transform transition-all duration-300 disabled:bg-gray-400 disabled:transform-none disabled:shadow-none ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-blue-600 hover:to-orange-600 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <span>Placing Order</span>
                  <BeatLoader size={5} color="#ffffff" />
                </div>
              ) : (
                "Place Order"
              )}
            </button>
          </form>

          {/* RIGHT: Coupon button above summary + Order Summary card */}
          <div className="w-full lg:w-1/3">
            {/* Top-right coupon button (above the card) */}
            <div className="flex justify-end mb-2">
              {!discountApplied ? (
                <button
                  onClick={() => setShowCouponForm(true)}
                  className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:from-blue-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Apply Academic Coupon
                </button>
              ) : (
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                  10% discount applied
                </span>
              )}
            </div>

            {/* Order Summary card */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20 border border-blue-100 bg-gradient-to-br from-white to-blue-50">
              <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent inline-block">
                Order Summary
              </h2>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-gray-700 mb-2 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  {item.selectedColor && (
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className="w-5 h-5 rounded-full border"
                                style={{ backgroundColor: item.selectedColorHex || "#fff" }}
                              ></span>
                              <span className="text-sm text-gray-700">{item.selectedColor}</span>
                            </div>
                          )}
                  <span className="text-sm text-gray-700"></span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}

              <hr className="my-3" />

              <div className="flex justify-between text-sm text-gray-700 p-2 rounded-lg">
                <span>Subtotal</span>
                <span className="font-medium">₹{cartTotal}</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-sm text-green-600 p-2 bg-green-50 rounded-lg my-2">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Academic Discount (10%)
                  </span>
                  <span className="font-medium">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-700 p-2 rounded-lg">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-medium">₹0</span>
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                  ₹{finalTotal}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Including GST</p>

              <div className="bg-gray-50 mt-4 p-3 rounded">
                <div className="flex items-center text-sm text-green-600 mb-1">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {deliveryMessage}
                </div>
                <div className="flex items-center justify-between text-sm text-green-600 mb-2">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{policy}</span>
                  </div>

                  <button
                    onClick={() => setShowCouponForm(true)}
                    className="px-2 py-2 flex bg-orange-500 text-white rounded-md hover:bg-orange-600 text-[10px] font-medium transition"
                  >
                    Click <span className="ml-1">Here</span>
                  </button>
                </div>
                <div className="flex items-center text-sm text-green-600 mb-1">
                  <svg
                    className="w-7 h-8 mr-2 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {returnPolicy}
                </div>

                <div className="flex items-center text-sm text-green-600">
                  <svg
                    className="w-9 h-8 mr-2 mb-9"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  {condition}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Apply Academic Discount
                </h3>
              </div>
              <button onClick={() => setShowCouponForm(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={applyCoupon} className="space-y-4 text-black">
              {/* Student Name */}
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="studentName"
                  value={couponData.studentName}
                  onChange={handleCouponChange}
                  placeholder="Your Name"
                  className="w-full border px-10 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  required
                />
              </div>

              {/* Academy Name */}
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="academyName"
                  value={couponData.academyName}
                  onChange={handleCouponChange}
                  placeholder="Academy Name"
                  className="w-full border px-10 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  required
                />
              </div>

              {/* Student Address */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="studentAddress"
                  value={couponData.studentAddress}
                  onChange={handleCouponChange}
                  placeholder="Student's Address"
                  className="w-full border px-10 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCouponForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-400 via-red-300 to-blue-300 text-black rounded-lg hover:bg-green-700 transition shadow-md"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
