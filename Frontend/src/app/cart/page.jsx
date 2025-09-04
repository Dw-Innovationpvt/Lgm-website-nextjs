"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";
import { FiShoppingBag, FiTrash2, FiChevronLeft } from "react-icons/fi";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";

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
    
    // Listen for cart changes from other components
    const handleCartChange = () => {
      // Force re-render by updating cartUpdated state
      setCartUpdated(true);
    };
    
    window.addEventListener("cartChange", handleCartChange);
    
    return () => {
      window.removeEventListener("cartChange", handleCartChange);
    };
  }, [cartUpdated, setCartUpdated]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12 md:py-16  font-['Arimo']">
        <div className="container mx-auto px-4 mb-10">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center transform transition-all duration-300 hover:shadow-2xl">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <div className="absolute w-36 h-36 bg-orange-50 rounded-full -z-10 animate-pulse-slow opacity-70"></div>
                <FiShoppingBag className="w-12 h-12 text-orange-500" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Explore our products and find something you'll love!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inline-skates"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3.5 rounded-lg font-medium hover:from-blue-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
              >
                <FiShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-black px-6 py-3.5 rounded-lg font-medium hover:bg-gray-50 transition-all transform hover:-translate-y-1 active:translate-y-0 hover:shadow-md"
              >
                <FiChevronLeft className="w-5 h-5 text-gray-700"  />
                <span className="text-black">Back to Home</span>
              </Link>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">Popular categories you might like</p>
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <Link href="/inline-skates" className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">
                  Inline Skates
                </Link>
                <Link href="/skateboards" className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium hover:bg-orange-100 transition-colors">
                  Skateboards
                </Link>
                <Link href="/accessories" className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors">
                  Accessories
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8 md:py-12 font-['Arimo'] flex flex-col justify-between">
      <div className="container mx-auto px-4 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8 border-b border-gray-100 pb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FiShoppingBag className="text-orange-500" />
                  Your Shopping Cart
                </h1>
                <p className="text-gray-500 mt-1">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/inline-skates" className="text-orange-600 hover:text-orange-800 text-sm md:text-base font-medium flex items-center gap-1">
                  <FiChevronLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm md:text-base font-medium border border-red-200"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Cart Items */}
              <div className="flex-grow space-y-5">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.type}`}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-full sm:w-24 h-32 sm:h-24 md:w-32 md:h-32 flex-shrink-0 bg-gradient-to-b from-gray-50 to-white border-b sm:border-b-0 sm:border-r border-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-110"
                      />
                    </div>

                    <div className="flex-grow px-4 py-3 sm:py-0 sm:pr-0">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-1 tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mb-3 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-orange-600 font-bold text-sm md:text-base">
                          ₹{item.price}
                        </p>
                        {item.oldPrice && (
                          <p className="text-gray-400 text-xs md:text-sm line-through">
                            ₹{item.oldPrice}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end px-4 py-3 sm:py-0 sm:pr-6 bg-gray-50 sm:bg-transparent border-t sm:border-t-0 border-gray-100">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
                        <button
                          onClick={() => decrementQuantity(item.id, item.type)}
                          className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
                          disabled={item.quantity <= 1}
                        >
                          <HiOutlineMinus className={`w-4 h-4 ${item.quantity <= 1 ? 'opacity-50' : ''}`} />
                        </button>
                        <span className="px-3 py-1 border-x border-gray-200 min-w-[40px] text-center text-sm md:text-base font-medium text-gray-800 bg-gray-50">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item.id, item.type)}
                          disabled={item.quantity >= item.countInStock}
                          className={`p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 ${
                            item.quantity >= item.countInStock
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <HiOutlinePlus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.type)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 transform hover:scale-110 hover:rotate-12"
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:w-96 mt-6 lg:mt-0">
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xl sticky top-24 transform transition-all duration-300 hover:shadow-2xl">
                  <div className="bg-gradient-to-r from-blue-600 to-orange-500 px-6 py-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <h2 className="text-lg md:text-xl font-bold relative z-10 flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Order Summary
                    </h2>
                    <p className="text-blue-100 text-sm mt-1 relative z-10">Total {cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                  </div>
                  
                  <div className="p-6 md:p-7">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm md:text-base text-gray-600 items-center">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Subtotal
                        </span>
                        <span className="font-medium">₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm md:text-base text-gray-600 items-center">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Shipping
                        </span>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>
                      <div className="flex justify-between text-sm md:text-base text-gray-600 items-center">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Tax
                        </span>
                        <span className="font-medium">Included</span>
                      </div>
                      <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                        <div className="flex justify-between font-bold text-gray-900 text-base md:text-lg">
                          <span>Total</span>
                          <span className="text-orange-600">₹{cartTotal}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-5">
                      <button
                        onClick={() => {
                          const user = localStorage.getItem("user");
                          if (user) {
                            router.push("/checkout");
                          } else {
                            router.push("/user-login");
                          }
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3.5 rounded-lg text-base font-semibold hover:from-blue-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:translate-y-[-2px] active:translate-y-[0px]"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Proceed to Checkout
                      </button>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-2 border-t border-gray-100 pt-4">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-xs font-medium text-gray-700">Secure</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-xs font-medium text-gray-700">Encrypted</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                            <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 9V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V9M5 22H19C20.1046 22 21 21.1046 21 20V11C21 9.89543 20.1046 9 19 9H5C3.89543 9 3 9.89543 3 11V20C3 21.1046 3.89543 22 5 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-xs font-medium text-gray-700">Fast</span>
                          </div>
                        </div>
                        <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Secure checkout powered by Stripe
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
