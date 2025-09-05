"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

// Local images mapping
const productImages = {
  A0015: [
    "/assets/comming-soon.png"
  ],
  A0016: [
    "/assets/comming-soon.png"
  ],
  A0017: [
    "/assets/comming-soon.png"
  ]
};

export default function ShoesFramePage() {
  const [view, setView] = useState("grid");
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selections, setSelections] = useState({}); // { [id]: { color, size } }

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        let data = await res.json();

        // Filter only Baby + Tenacity codes
        data = data.filter((p) =>
          [
            "A0015",
            "A0016",
            "A0017"
          ].includes(p.code)
        );

        // Attach images from local mapping
        data = data.map((p) => ({
          ...p,
          image: productImages[p.code]?.[0] || "/placeholder.png",
          images: productImages[p.code] || ["/placeholder.png"],
          specs: {
            usage: "Skating",
            wheels: "4 Wheel",
            material: "Stainless Steel",
          },
          colors: ["red", "blue", "green", "pink"],
          sizes: ["Small", "Medium", "Large"],
          countInStock: p.stockQuantity ?? 0,
        }));

        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const setSelection = (productId, field, value) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), [field]: value },
    }));
  };

  const handleAddToCart = (product) => {
    const { color = "", size = "" } = selections[product.id] || {};
    addToCart({ ...product, selectedColor: color, selectedSize: size });
    router.push("/cart");
  };

  const handleBuyNow = (product) => {
    const { color = "", size = "" } = selections[product.id] || {};
    addToCart({ ...product, selectedColor: color, selectedSize: size });
    router.push("/checkout");
  };

  const openImageModal = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };
  const closeImageModal = () => setSelectedProduct(null);

  const nextImage = () =>
    setCurrentImageIndex((prev) =>
      selectedProduct && prev === selectedProduct.images.length - 1
        ? 0
        : prev + 1
    );

  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      selectedProduct && prev === 0
        ? selectedProduct.images.length - 1
        : prev - 1
    );

  // Key navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProduct) return;
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") closeImageModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProduct]);

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="border-b border-gray-200 mb-8">
          <h1 className="text-4xl font-bold font-['Arimo'] text-gray-900 mb-2">
            Basic Full Set Package
          </h1>
          <p className="text-lg text-gray-600 mb-6 font-['Arimo']">
            A complete starter kit designed for comfort, safety, and fun. The Basic Full Set Package includes everything you need to begin your skating journey.
          </p>
          <div className="flex items-center justify-between pb-6">
            <p className="text-gray-600">{products.length} products</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView("grid")}
                className={`p-2 ${
                  view === "grid" ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {/* grid icon */}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zm-12 6h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zm-12 6h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
                </svg>
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 ${
                  view === "list" ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {/* list icon */}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Display */}
        <div
          className={`grid ${
            view === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "grid-cols-1 gap-6"
          }`}
        >
          {products.map((product) => {
            const sel = selections[product.id] || { color: "", size: "" };
            return (
              <div
                key={product.id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  view === "list" ? "flex" : "flex flex-col"
                }`}
              >
                {/* Image */}
                <div
                  className={`relative group ${
                    view === "grid" ? "h-70" : "w-1/3 h-56"
                  }`}
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>

                  {/* ✅ Stock Badge */}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md ${
                      product.countInStock > 0
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </span>

                  <button
                    onClick={() => openImageModal(product)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 
                      bg-white/95 rounded-full shadow-xl hover:bg-white cursor-pointer
                      transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="View images"
                  >
                    {/* eye icon */}
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Details */}
                <div
                  className={`flex flex-col ${
                    view === "grid" ? "flex-1 p-6" : "w-2/3 p-6"
                  }`}
                >
                  <h3 className="text-2xl font-bold font-['Arimo'] text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono mb-1">
                    Code: {product.code}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {product.description || "Premium quality skating gear."}
                  </p>

                  <div className="space-y-4">
                    {/* Price + CTAs */}
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 hover:shadow-lg active:transform active:scale-95 cursor-pointer"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow(product)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 hover:shadow-lg active:transform active:scale-95 cursor-pointer"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="font-['Arimo'] font-bold text-gray-900 mb-2">
                        Specifications:
                      </h4>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        <li className="flex justify-between">
                          <span className="font-medium">Usage:</span>
                          <span>{product.specs.usage}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-medium">Wheels:</span>
                          <span>{product.specs.wheels}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-medium">Material:</span>
                          <span>{product.specs.material}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-medium">Color:</span>
                          <select
                            value={selections[product.id]?.color || ""}
                            onChange={(e) =>
                              setSelection(product.id, "color", e.target.value)
                            }
                            className="border rounded-md py-1 px-2"
                          >
                            <option value="">Select Color</option>
                            {product.colors.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-medium">Size:</span>
                          <select
                            value={selections[product.id]?.size || ""}
                            onChange={(e) =>
                              setSelection(product.id, "size", e.target.value)
                            }
                            className="border rounded-md py-1 px-2"
                          >
                            <option value="">Select Size</option>
                            {product.sizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white"
            >
              ✖
            </button>
            {selectedProduct.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white"
                >
                  ◀
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white"
                >
                  ▶
                </button>
              </>
            )}
            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedProduct.images[currentImageIndex]}
                alt={selectedProduct.name}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
