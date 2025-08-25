// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import axios from "axios";

// export default function CheckoutPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "Maharashtra",
//     pincode: "",
//     paymentMethod: "cod",
//   });

//   const [cart, setCart] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   const deliveryCharge = cartTotal > 10000 ? 0 : 400;
//   const deliveryMessage =
//     cartTotal > 10000
//       ? "Free Delivery on every orders! | Extra 10% discount for Academic Students"
//       : "Fixed ₹400 Delivery + 12% GST on other orders";

//   const calculateGST = (amount) => Math.round((amount * 12) / 100);
//   const calculateTotalWithGST = (subtotal, delivery) =>
//     subtotal + delivery + calculateGST(subtotal + delivery);

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(storedCart);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Razorpay script loader
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrors({});

//     const totalAmount = cartTotal; // Send only the product total (₹1 in your case)

//     if (formData.paymentMethod === "razorpay") {
//       // Online Payment Flow
//       const loaded = await loadRazorpayScript();
//       if (!loaded) {
//         toast.error("Failed to load Razorpay SDK.");
//         setIsSubmitting(false);
//         return;
//       }

//       try {
//         // Create Razorpay order from backend
//         const { data } = await axios.post("http://localhost:5000/api/payment/order", {
//           amount: totalAmount,
//         });

//         const options = {
//           key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//           amount: data.amount,
//           currency: data.currency,
//           name: "Sports Store",
//           description: "Order Payment",
//           order_id: data.id,
//           handler: async (response) => {
//   try {
//     // Verify payment + save order in DB in one step
//     const verify = await axios.post("http://localhost:5000/api/payment/verify", {
//       razorpay_order_id: response.razorpay_order_id,
//       razorpay_payment_id: response.razorpay_payment_id,
//       razorpay_signature: response.razorpay_signature,
//       formData,
//       cart,
//       totalAmount,
//     });

//     if (verify.data.success) {
//       localStorage.removeItem("cart");
//       toast.success("Payment successful! Order placed.");
//       router.push("/userProfile");
//     } else {
//       toast.error("Payment verification failed.");
//     }
//   } catch (err) {
//     console.error("Payment verification error", err);
//     toast.error("Payment verification error.");
//   }
// },
//           prefill: {
//             name: `${formData.firstName} ${formData.lastName}`,
//             email: formData.email,
//             contact: formData.phone,
//           },
//           theme: {
//             color: "#3399cc",
//           },
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       } catch (error) {
//         console.error("Payment initiation error", error);
//         toast.error("Error initiating Razorpay.");
//       } finally {
//         setIsSubmitting(false);
//       }
//       return;
//     }

//     // Cash on Delivery flow
//     try {
//       const response = await fetch("http://localhost:5000/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ formData, cart, totalAmount }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         localStorage.removeItem("cart");
//         toast.success("Order placed successfully!");
//         router.push("/userProfile");
//       } else {
//         toast.error("Failed to place order. Try again.");
//       }
//     } catch (err) {
//       console.error("Order Error:", err);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-center bg-gradient-to-r from-orange-100 via-blue-100 to-white font-['Arimo']">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
//           <p className="text-gray-500 mb-4">Add items to checkout</p>
//           <button
//             onClick={() => router.push("/cart")}
//             className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
//           >
//             Go to Cart
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-orange-100 via-blue-100 to-white py-2 font-['Arimo'] pb-12">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
//         <div className="flex flex-col lg:flex-row gap-6">
//           <form
//             onSubmit={handleSubmit}
//             className="bg-white rounded-xl shadow p-6 w-full lg:w-2/3"
//           >
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               Shipping Information
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   First Name *
//                 </label>
//                 <input
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   placeholder="Enter your first name"
//                   className="w-full border px-3 py-2 rounded-lg"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Last Name *
//                 </label>
//                 <input
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   placeholder="Enter your last name"
//                   className="w-full border px-3 py-2 rounded-lg"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="you@example.com"
//                   className="w-full border px-3 py-2 rounded-lg"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="10-digit mobile number"
//                   className="w-full border px-3 py-2 rounded-lg"
//                   required
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium mb-1">
//                   Address *
//                 </label>
//                 <textarea
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   placeholder="Enter your full address"
//                   rows="2"
//                   className="w-full border px-3 py-2 rounded-lg"
//                   required
//                 ></textarea>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">City *</label>
//                 <input
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   placeholder="City name"
//                   className="w-full border px-3 py-2 rounded-lg"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   State *
//                 </label>
//                 <select
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className="w-full border px-3 py-2 rounded-lg"
//                 >
//                   <option value="Maharashtra">Maharashtra</option>
//                   <option value="Delhi">Delhi</option>
//                   <option value="Karnataka">Karnataka</option>
//                   <option value="Tamil Nadu">Tamil Nadu</option>
//                   <option value="Gujarat">Gujarat</option>
//                   <option value="West Bengal">West Bengal</option>
//                   <option value="Uttar Pradesh">Uttar Pradesh</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Pincode *
//                 </label>
//                 <input
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleChange}
//                   placeholder="6-digit pincode"
//                   className="w-full border px-3 py-2 rounded-lg"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="mt-6 text-black">
//               <label className="block text-sm font-medium mb-2">
//                 Payment Method
//               </label>
//               <div className="flex items-center gap-6">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     value="cod"
//                     checked={formData.paymentMethod === "cod"}
//                     onChange={handleChange}
//                     className="mr-2"
//                   />
//                   Cash on Delivery
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     value="razorpay"
//                     checked={formData.paymentMethod === "razorpay"}
//                     onChange={handleChange}
//                     className="mr-2"
//                   />
//                   Online Payment (Credit/Debit Card, UPI, Net Banking)
//                 </label>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
//             >
//               {isSubmitting ? "Placing Order..." : "Place Order"}
//             </button>
//           </form>

//           <div className="w-full lg:w-1/3">
//             <div className="bg-white rounded-xl shadow p-6 sticky top-20">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                 Order Summary
//               </h2>
//               {cart.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex justify-between text-sm text-gray-700 mb-2"
//                 >
//                   <span>
//                     {item.name} (x{item.quantity})
//                   </span>
//                   <span>₹{item.price * item.quantity}</span>
//                 </div>
//               ))}
//               <hr className="my-3" />
//               <div className="flex justify-between text-sm text-gray-700">
//                 <span>Subtotal</span>
//                 <span>₹{cartTotal}</span>
//               </div>
//               <div className="flex justify-between text-sm text-gray-700">
//                 <span>Delivery Charges</span>
//                 <span className={deliveryCharge === 0 ? "text-green-600" : ""}>
//                   ₹0
//                 </span>
//               </div>
//               <p className="text-xs text-gray-500 mb-2">{deliveryMessage}</p>
//               <div className="flex justify-between text-sm text-gray-700">
//                 <span>GST (12%)</span>
//                 {/* <span>₹{calculateGST(cartTotal + deliveryCharge)}</span> */}
//                 <span>₹0</span>

//               </div>
//               <div className="border-t mt-3 pt-3 flex justify-between text-lg font-semibold text-gray-900">
//                 <span>Total</span>
//                 {/* <span>₹{calculateTotalWithGST(cartTotal, deliveryCharge)}</span> */}
//                 <span>₹{cartTotal}</span>

//               </div>
//               <p className="text-xs text-gray-500 mt-1">Including GST</p>

//               <div className="bg-gray-50 mt-4 p-3 rounded">
//                 <div className="flex items-center text-sm text-green-600 mb-1">
//                   <svg
//                     className="w-4 h-4 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   {deliveryMessage}
//                 </div>
//                 <div className="flex items-center text-sm text-green-600">
//                   <svg
//                     className="w-4 h-4 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   Secure checkout
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
  const router = useRouter();

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

  // --- Coupon / discount state ---
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponData, setCouponData] = useState({
    studentName: "",
    academicYear: "",
    studentId: "",
  });
  const [discountApplied, setDiscountApplied] = useState(false);

  // Totals
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountAmount = discountApplied ? Math.round(cartTotal * 0.1) : 0; // 10%
  const finalTotal = cartTotal - discountAmount;

  const deliveryMessage =
    cartTotal > 10000
      ? "Free Delivery on every orders! | Extra 10% discount for Academic Students"
      : "Fixed ₹400 Delivery + 12% GST on other orders";

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
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
      couponData.academicYear &&
      couponData.studentId
    ) {
      setDiscountApplied(true);
      setShowCouponForm(false);
      toast.success("10% academic discount applied!");
    } else {
      toast.error("Please fill all coupon details.");
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
        toast.error("Failed to load Razorpay SDK.");
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
              // Verify + save order
              const verify = await axios.post(
                "http://localhost:5000/api/payment/verify",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  formData,
                  cart,
                  totalAmount,
                  discountApplied,
                  discountAmount,
                  couponData,
                }
              );

              if (verify.data.success) {
                localStorage.removeItem("cart");
                toast.success("Payment successful! Order placed.");
                router.push("/userProfile");
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (err) {
              console.error("Payment verification error", err);
              toast.error("Payment verification error.");
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
        toast.error("Error initiating Razorpay.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Cash on Delivery
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          cart,
          totalAmount,
          discountApplied,
          discountAmount,
          couponData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("cart");
        toast.success("Order placed successfully!");
        router.push("/userProfile");
      } else {
        toast.error("Failed to place order. Try again.");
      }
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-gradient-to-r from-orange-100 via-blue-100 to-white font-['Arimo']">
        <div>
          <h2 className="text-2xl font-bold text-gray-700">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-4">Add items to checkout</p>
          <button
            onClick={() => router.push("/cart")}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-blue-100 to-white py-2 font-['Arimo'] pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Shipping form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 w-full lg:w-2/3"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name *
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name *
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  rows="2"
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City name"
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pincode *
                </label>
                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="mt-6 text-black">
              <label className="block text-sm font-medium mb-2">
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
              className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* RIGHT: Coupon button above summary + Order Summary card */}
          <div className="w-full lg:w-1/3">
            {/* Top-right coupon button (above the card) */}
            <div className="flex justify-end mb-2">
              {!discountApplied ? (
                <button
                  onClick={() => setShowCouponForm(true)}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
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
            <div className="bg-white rounded-xl shadow p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-gray-700 mb-2"
                >
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}

              <hr className="my-3" />

              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Academic Discount (10%)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery Charges</span>
                <span className="text-green-600">₹0</span>
              </div>

              <div className="flex justify-between text-sm text-gray-700">
                <span>GST (12%)</span>
                <span>₹0</span>
              </div>

              <div className="border-t mt-3 pt-3 flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Including GST</p>

              <div className="bg-gray-50 mt-4 p-3 rounded">
                <div className="flex items-center text-sm text-green-600 mb-1">
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
                  {deliveryMessage}
                </div>
                <div className="flex items-center text-sm text-green-600">
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
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Apply Academic Discount
            </h3>
            <form onSubmit={applyCoupon} className="space-y-3 text-black">
              <input
                type="text"
                name="studentName"
                value={couponData.studentName}
                onChange={handleCouponChange}
                placeholder="Your Name"
                className="w-full border px-3 py-2 rounded-lg"
                required
              />
              <input
                type="text"
                name="academicYear"
                value={couponData.academicYear}
                onChange={handleCouponChange}
                placeholder="Academic Year (e.g., 2024–25)"
                className="w-full border px-3 py-2 rounded-lg"
                required
              />
              <input
                type="text"
                name="studentId"
                value={couponData.studentId}
                onChange={handleCouponChange}
                placeholder="Student's Address"
                className="w-full border px-3 py-2 rounded-lg"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCouponForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
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
