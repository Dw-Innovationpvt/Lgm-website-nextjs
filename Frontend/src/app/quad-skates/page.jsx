"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const QuadSkates = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bg = "/assets/img.png";

  const extraProducts = [
    {
      id: "Basic Full Set Package",
      name: "Basic Full Set Package",
      slug: "basic-full-set-package",
      description: "All-in-one beginner set with strong wheels and essentials.",
      image: "/assets/A0015-Rubber Wheel Package/AARMS Photography-9.jpg",
      category: "quad-skates",
    },
    {
      id: "HQ Quad Package",
      name: "HQ Quad Package",
      slug: "hq-quad-package",
      description:
        "High-quality quad skates designed for smooth, stable rides.",
      image: "/assets/A0025-Viper Package (With Bag)/AARMS Photography-3.jpg",
      category: "HQ-quad-package",
    },
    {
      id: "Shoes",
      name: "Shoes",
      slug: "shoes",
      description: "Comfortable, lightweight shoes built for skating support.",
      image: "/assets/A0035 -Baby tenacity Shoes/1000210415.png",
      category: "shoes",
    },
    {
      id: "Quad Frame",
      name: "Quad Frame",
      slug: "quad-frame",
      description: "Strong metal frame engineered for speed and balance.",
      image: "/assets/A0045-Classic Yelow Frame/AARMS Photography-56.jpg",
      category: "quad-frames",
    },
    {
      id: "Shoes & Frame",
      name: "Shoes & Frame",
      slug: "shoes-frame",
      description: "Complete set pairing durable shoes with a sturdy frame.",
      image:
        "/assets/A0055 -Classic Yelow Frame & Quad Shoes/AARMS Photography-61.jpg",
      category: "shoes-and-frames",
    },
  ];

  const fetchProducts = () => {
    try {
      setProducts(extraProducts);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-blue-200 to-white font-['Arimo']">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-6 md:py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center relative z-10">
            {/* Left */}
            <div className="w-full lg:w-1/2 py-8  order-2 lg:order-1 space-y-6 md:space-y-10">
              <div className="inline-flex items-center">
                <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-lg shadow-xl border border-gray-100">
                  <span className="text-gray-900 font-medium tracking-wide text-sm uppercase">
                    New Collection 2025
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-[4.5rem] leading-none font-bold text-black">
                  Premium
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-500">
                    Quad Skates
                  </span>
                </h1>
                <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-700 max-w-xl leading-relaxed">
                  Discover the perfect blend of style, stability, and
                  performance with our professional quad skates. Built for
                  smooth rides, sharp turns, and endless fun.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-10 border-t border-gray-100">
                <div className="group">
                  <div className="text-xl md:text-2xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors ">
                    Premium
                  </div>
                  <div className="text-sm md:text-base text-gray-500">
                    Materials
                  </div>
                </div>
                <div className="group">
                  <div className="text-xl md:text-2xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    Global
                  </div>
                  <div className="text-sm md:text-base text-gray-500">
                    Shipping
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 relative mb-8 lg:mb-0 order-1 lg:order-2">
              <div className="relative group px-4 overflow-hidden">
                <img
                  src={bg}
                  alt="Pro Series Inline Skates"
                  className="w-full lg:w-[120%] h-[180%] object-contain transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-10 md:py-24 bg-gradient-to-br from-orange-100 via-blue-100 to-transparent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {loading
              ? [...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse p-6"
                  >
                    <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mt-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                  </div>
                ))
              : products.map((product) => {
                  const stockStatus = JSON.parse(
                    localStorage.getItem("lgmStockStatus") || "{}"
                  );
                  const inStock = stockStatus[product.id] !== false;

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-['Arimo']"
                    >
                      {/* Image & Price */}
                      <div className="relative p-4">
                        {/* Price pill */}
                        {/* <div className="absolute top-3 right-3 bg-white shadow text-gray-800 text-sm font-semibold px-4 py-1 rounded-full">
                          ₹{product.price}
                        </div> */}

                        {/* Out of stock badge */}
                        {!inStock && (
                          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            Out of Stock
                          </div>
                        )}

                        {/* Image */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-60 object-contain mt-5 transition-transform duration-500 transform group-hover:scale-105"
                          style={!inStock ? { opacity: 0.5 } : {}}
                        />
                      </div>

                      {/* Details */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.description}
                        </p>

                        {/* Button */}
                        <button
                          disabled={!inStock}
                          onClick={() => router.push(`/${product.slug}`)}
                          className={`mt-6 w-full py-2 rounded-lg flex justify-center items-center gap-2 font-semibold text-base transition-all duration-300 ${
                            inStock
                              ? "bg-gray-900 text-white hover:bg-gray-800"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Shop Now
                          {inStock && (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            Why Choose Our Skates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-xl">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Premium Quality
              </h3>
              <p className="text-sm text-gray-600">
                Built with the finest materials for durability and performance
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-orange-100 rounded-xl">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Fast Shipping
              </h3>
              <p className="text-sm text-gray-600">
                Quick delivery to your doorstep with tracking
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-xl">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 3-6 3-6 3 4.343 3 6zm0 0v1a4 4 0 004 4h1"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Warranty Protected
              </h3>
              <p className="text-sm text-gray-600">
                1-year warranty on all our products
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuadSkates;
