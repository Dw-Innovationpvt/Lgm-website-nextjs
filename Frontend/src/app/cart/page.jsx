"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    getCartTotal,
    cartUpdated,
    setCartUpdated,
    clearCart,
  } = useCart();

  const router = useRouter();
  const cartTotal = getCartTotal();

  useEffect(() => {
    if (cartUpdated) {
      setCartUpdated(false);
    }
  }, [cartUpdated, setCartUpdated]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-blue-100 to-white py-8 md:py-12 font-['Arimo']">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Your Cart is Empty
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/inline-skates"
              className="inline-block bg-orange-500 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-sm mb-9 md:text-base font-medium hover:bg-orange-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-blue-100 to-white py-8 md:py-12 font-['Arimo'] flex flex-col justify-between">
      <div className="container mx-auto px-4 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
            >
              Clear Cart
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="flex-grow space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.type}`}
                  className="bg-white rounded-xl p-4 md:p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6"
                >
                  {/* <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div> */}

                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-2">
                      {item.description}
                    </p>
                    <p className="text-blue-600 font-medium text-sm md:text-base">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-3 sm:mt-0">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => decrementQuantity(item.id, item.type)}
                        className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1} // prevent going below 1
                      >
                        -
                      </button>
                      <span className="px-2 md:px-3 py-1 border-x border-gray-200 min-w-[32px] md:min-w-[40px] text-center text-sm md:text-base text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id, item.type)}
                        disabled={item.quantity >= item.countInStock} // ✅ disable when stock limit reached
                        className={`px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative group ${
                          item.quantity >= item.countInStock
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <span className="absolute inset-0 bg-orange-100 opacity-0 group-hover:opacity-30 transition-opacity"></span>
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="text-red-500 hover:text-red-600 transition-colors p-1.5"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 mt-6 lg:mt-0">
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg sticky top-24">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-semibold text-gray-900 text-base md:text-lg">
                      <span>Total</span>
                      <span>₹{cartTotal}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const user = localStorage.getItem("user");
                    if (user) {
                      router.push("/checkout");
                    } else {
                      router.push("/user-login");
                    }
                  }}
                  className="w-full bg-orange-500 text-white py-2.5 md:py-3 rounded-lg text-sm md:text-base font-medium hover:bg-orange-600 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
