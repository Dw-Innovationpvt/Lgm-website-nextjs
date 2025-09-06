
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const InlineSkates = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bg = "/banner/c3.png";

  const extraProducts = [
  {
    id: "Fleet Altra Package",
    name: "Fleet Altra Package",
    slug: "fleet-altra-package",
    description: "Performance inline skate with 4-wheel setup",
    image: "/Rapid Skate ( 4 wheel )-20250620T042233Z-1-001/Rapid Skate ( 4 wheel )/Rapid Skate .jpg",
    category: "Professional inline-skates",
    countInStock: 15,
  },
  {
    id: "Raptor Flash Package",
    name: "Raptor Flash Package",
    slug: "raptor-flash-package",
    description: "Performance inline skate with 4-wheel setup",
    image: "/assets/AARMS Photography-1.jpg",
    category: "Professional inline-skates",
    countInStock: 15,
  },
  {
    id: "Rapid Warp Package",
    name: "Rapid Warp Package",
    slug: "rapid-wrap-package",
    description: "Performance inline skate with 4-wheel setup",
    image: "/assets/55- 3 X 90 Rapid/AARMS Photography-17.jpg",
    category: "Professional inline-skates",
    countInStock: 15,
  },
  {
    id: "Inline Frames",
    name: "Inline Frames",
    slug: "inline-frames",
    description: "Performance inline skate with 4-wheel setup",
      image: "/assets/65-3X110= Flash 11.25/AARMS Photography-51.jpg",
    category: "Professional inline-skates",
    countInStock: 15,
  },
  {
    id: "Inline Shoes",
    name: "Inline Shoes",
    slug: "inline-shoes",
    description: "Performance inline skate with 4-wheel setup",
    image: "/Rapid Skate ( 4 wheel )-20250620T042233Z-1-001/Rapid Skate ( 4 wheel )/Rapid Skate .jpg",
    category: "Professional inline-skates",
    countInStock: 15,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 font-[var(--font-raleway)]">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center relative z-10">
            {/* Left */}
            <div className="w-full lg:w-1/2 py-8  order-2 lg:order-1 space-y-6 md:space-y-10">
              <div className="inline-flex items-center">
                <div className="px-5 py-2 bg-gradient-to-r from-blue-600/10 to-orange-500/10 backdrop-blur rounded-full shadow-lg border border-blue-100 transform hover:scale-105 transition-transform duration-300">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500 font-semibold tracking-wider text-sm uppercase">
                    New Collection 2025
                  </span>
                </div>
              </div>
              <div className="relative">
                {/* Decorative element */}
                <div className="absolute -left-6 -top-6 w-20 h-20 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl leading-none font-extrabold text-gray-900 tracking-tight">
                  Premium
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500 relative inline-block">
                    Professional
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-orange-500 transform scale-x-100"></span>
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">
                    Inline Skates
                  </span>
                </h1>
                
                <p className="mt-6 md:mt-8 text-base md:text-lg text-gray-700 max-w-xl leading-relaxed">
                  Experience unparalleled performance with our
                  professional-grade inline skates. Crafted for speed, designed
                  for champions.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 md:gap-10 pt-8 md:pt-12 border-t border-gray-200">
                <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 mb-2 transition-colors">
                    Premium
                  </div>
                  <div className="text-sm md:text-base text-gray-600">
                    Materials engineered for durability and performance
                  </div>
                </div>
                <div className="group bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-orange-500 mb-2 transition-colors">
                    Global
                  </div>
                  <div className="text-sm md:text-base text-gray-600">
                    Worldwide shipping with express delivery options
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="pt-6">
                <button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
                  Shop Collection
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 relative mb-8 lg:mb-0 order-1 lg:order-2">
              <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
                {/* Background decorative circles */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                
                {/* Image container with gradient overlay */}
                <div className="relative overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-orange-500/10 to-transparent z-10"></div>
                  <img
                    src={bg}
                    alt="Pro Series Inline Skates"
                    className="w-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Floating badge */}
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-20 transform rotate-3 group-hover:rotate-0 transition-all duration-300">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500 font-bold">Pro Series</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-orange-50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500 inline-block relative">
              Our Premium Collection
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-orange-400 transform scale-x-50"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our range of professional inline skates designed for performance, comfort, and style.</p>
          </div>
          

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
                      className="group bg-gradient-to-b from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 font-[var(--font-raleway)] border border-gray-100"
                    >
                      {/* Image & Price */}
                      <div className="relative p-4 overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 z-0"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-500/10 rounded-full -ml-8 -mb-8 z-0"></div>
                        {/* Price pill */}
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-orange-500 shadow-md text-white text-sm font-bold px-4 py-1.5 rounded-full transform transition-transform group-hover:scale-110 z-10">
                          ₹{product.price || '12,999'}
                        </div>

                        {/* Out of stock badge */}
                        {!inStock && (
                          <div className="absolute top-3 left-3 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-full shadow-md z-10 animate-pulse">
                            Out of Stock
                          </div>
                        )}

                        {/* Image with overlay */}
                        <div className="relative overflow-hidden rounded-xl">
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-64 object-contain mt-5 transition-all duration-700 transform group-hover:scale-110"
                            style={!inStock ? { opacity: 0.5, filter: 'grayscale(50%)' } : {}}
                          />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-6">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center bg-gradient-to-r from-blue-50 to-orange-50 px-2 py-1 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-orange-500 mr-2 animate-pulse"></span>
                            <span className="text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500 uppercase tracking-wider">{product.category}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-orange-500 transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {/* Stock indicator */}
                        <div className="flex items-center mt-3 bg-gradient-to-r from-blue-50 to-orange-50 px-3 py-1.5 rounded-full w-fit">
                          <span className={`inline-block w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'} mr-2 ${inStock ? 'animate-pulse' : ''}`}></span>
                          <span className="text-xs font-medium text-gray-600">{inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </div>

                        {/* Button */}
                        <button
                          disabled={!inStock}
                          onClick={() => router.push(`/${product.slug}`)}
                          className={`mt-6 w-full py-3 rounded-lg flex justify-center items-center gap-2 font-semibold text-base transition-all duration-300 ${
                            inStock
                              ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white hover:from-blue-700 hover:to-orange-600 shadow-md hover:shadow-lg"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {inStock ? 'Shop Now' : 'Sold Out'}
                          {inStock && (
                            <svg
                              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 via-white to-orange-50 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
            Why Choose Our Skates
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">Our premium inline skates are designed with quality and performance in mind</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center bg-gradient-to-b from-white to-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-100/50 group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
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
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 mb-2">
                Premium Quality
              </h3>
              <p className="text-sm text-gray-600">
                Built with the finest materials for durability and performance
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center bg-gradient-to-b from-white to-orange-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-orange-100/50 group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
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
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-orange-500 mb-2">
                Fast Shipping
              </h3>
              <p className="text-sm text-gray-600">
                Quick delivery to your doorstep with tracking
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center bg-gradient-to-b from-white to-blue-50/50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-100/30 group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-blue-100/80 to-orange-100/80 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-transparent fill-transparent stroke-current bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500"
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
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500 mb-2">
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

export default InlineSkates;
