"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Zap, Star } from "lucide-react";

const WorkoutGear = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bg =
    "/assets/126- Turing Stool/AARMS_Photography-162-removebg-preview.png";

  const extraProducts = [
    {
      id: "bearing-cleaning-bottle-1",
      name: "Bearing Cleaning Bottle",
      slug: "bearing-cleaning-bottle",
      description:
        "Keep your bearings smooth and rust-free with this easy-to-use cleaning bottle.",
      image: "/assets/122 - Bearing Cleaning Bottle/1000211187.png",
      category: "Professional workout-gear",
      countInStock: 15,
    },
    {
      id: "bearing-puller-combo-2",
      name: "Bearing Puller Combo",
      slug: "bearing-puller-combo",
      description:
        "Quickly remove and replace bearings with this durable puller combo tool.",
      image: "/assets/124- Bearing Puller Combo/AARMS Photography-147.jpg",
      category: "Professional workout-gear",
      countInStock: 15,
    },
    {
      id: "turing-stool-3",
      name: "Turing Stool",
      slug: "turing-stool",
      description:
        "Practice spins, balance, and turns with confidence using this sturdy stool.",
      image: "/assets/126- Turing Stool/AARMS Photography-162.jpg",
      category: "Professional workout-gear",
      countInStock: 15,
    },
    {
      id: "parchute-4",
      name: "Parachute",
      slug: "parchute",
      description:
        "Boost your speed and endurance with resistance sprint training using this parachute.",
      image: "/assets/129 - Parchute/1000211301.png",
      category: "Professional workout-gear",
      countInStock: 15,
    },
    {
      id: "harness-5",
      name: "Harness",
      slug: "harness",
      description:
        "Strengthen your performance with this durable harness designed for resistance training.",
      image: "/assets/130 - Harness/1000211284.png",
      category: "Professional workout-gear",
      countInStock: 15,
    },
    // {
    //   id: "parachute-with-harness-6",
    //   name: "Parachute With Harness",
    //   slug: "parachute-with-harness",
    //   description: "Maximize sprint power and stamina with a parachute and harness training combo.",
    //   image: "/assets/131 - Parchute With Harness/1000211284.png",
    //   category: "Professional workout-gear",
    //   countInStock: 15,
    // },
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
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
                    Professional Workout Gear
                  </span>
                </h1>
                <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-700 max-w-xl leading-relaxed">
                  Experience the perfect blend of style and performance with our
                  professional workout gear. Designed for both beginners and
                  advanced skaters.
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
                  className="w-full lg:w-[60%] h-[80%] object-contain transform transition-transform duration-700 group-hover:scale-105 translate-x-32"
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
            Why Choose Our Workout Gear?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Feature 1 - Affordable Pricing */}
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-xl">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Affordable Pricing
              </h3>
              <p className="text-sm text-gray-600">
                Quality workout gear at competitive prices.
              </p>
            </div>

            {/* Feature 2 - Performance Enhancement */}
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-orange-100 rounded-xl">
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Enhancement
              </h3>
              <p className="text-sm text-gray-600">
                Designed to improve your skating skills and techniques.
              </p>
            </div>

            {/* Feature 3 - Professional Quality */}
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-xl">
                <Star className="w-8 h-8 text-green-600 fill-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Professional Quality
              </h3>
              <p className="text-sm text-gray-600">
                Built to meet the demands of professional skaters and athletes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkoutGear;
