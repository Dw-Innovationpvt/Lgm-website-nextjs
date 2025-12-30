"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

// Local images mapping
const productImages = {
  A0330: ["/assets/comming-soon.png"],
  A0331: ["/assets/comming-soon.png"],
  A0332: ["/assets/comming-soon.png"],
  A0333: ["/assets/A0333  - Shoes Strap pcs/1000218262.png",
    "/assets/A0333  - Shoes Strap pcs/1000218263.png",
  ],
  A0334: ["/assets/comming-soon.png"],
  A0335: ["/assets/comming-soon.png"],
  A0336: ["/assets/comming-soon.png"],
  A0337: ["/assets/comming-soon.png"],
  A0338: ["/assets/A0338 - Quad Shoe Nuts/1000211297.png",
    "/assets/A0338 - Quad Shoe Nuts/1000211299.png"
  ],
  A0339: {
    Black:"/assets/A0339 - Quad Lace/1000211293.png",
    Red: "/assets/A0339 - Quad Lace/1000211294.png",
    Blue: "/assets/A0339 - Quad Lace/1000211295.png"
},
  A0340: ["/assets/144 - Washers ( 7mm - 8mm )/AARMS Photography-218.jpg"],
  A0341: ["/assets/1000211300(1).png",
    "/assets/10002113002.png"
  ],
  A0342: ["/assets/comming-soon.png"],
  A0343: ["/assets/comming-soon.png"],
  A0344: ["/assets/comming-soon.png"],
  A0345: ["/assets/comming-soon.png"],
  A0346: ["/assets/A0346 - Allen Kay/AARMS Photography-217.jpg"],
  A0347: ["/assets/comming-soon.png"],
};

// // Images
// import quadShoeNuts1 from "public/assets/140 - Quad Shoe Nuts/1000211297.png";
// import quadShoeNuts2 from "public/assets/140 - Quad Shoe Nuts/1000211299.png";

// import washers1 from "public/assets/144 - Washers ( 7mm - 8mm )/AARMS Photography-218.jpg";

// import quadLace1 from "/public/assets/151- Quad Lace/1000211293.png";
// import quadLace2 from "/public/assets/151- Quad Lace/1000211294.png";
// import quadLace3 from "/public/assets/151- Quad Lace/1000211295.png";

// import allenKay1 from "/public/assets/153- Allen Kay/AARMS Photography-217.jpg";

export default function Accessories() {
  const [view, setView] = useState("grid");
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // selections shape: { [productId]: { color: string, size: string } }
  const [selections, setSelections] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://api.lgmsports.in/api/products");
        let data = await res.json();

        // Filter only Guard Set codes
        data = data.filter(
          (p) =>
            [
              "A0330",
              "A0331",
              "A0332",
              "A0333",
              "A0334",
              "A0335",
              "A0336",
              "A0337",
              "A0338",
              "A0339",
              "A0340",
              "A0341",
              "A0342",
              "A0343",
              "A0344",
              "A0345",
              "A0346",
              "A0347",
            ].includes(p.code) ||
            [
              "A0330",
              "A0331",
              "A0332",
              "A0333",
              "A0334",
              "A0335",
              "A0336",
              "A0337",
              "A0338",
              "A0339",
              "A0340",
              "A0341",
              "A0342",
              "A0343",
              "A0344",
              "A0345",
              "A0346",
              "A0347",
            ].includes(p.code)
        );
        
        data = data.map((p) => {
          let firstColorImage = "/placeholder.png";

          if (Array.isArray(productImages[p.code])) {
            firstColorImage = productImages[p.code][0];
          } else if (typeof productImages[p.code] === "object") {
            firstColorImage = Object.values(productImages[p.code])[0];
          }

          return {
            ...p,
            image: firstColorImage,
            images: Array.isArray(productImages[p.code])
              ? productImages[p.code]
              : Object.values(productImages[p.code] || ["/placeholder.png"]),
            specs: {
              usage: "Skating",
              wheels: "4 Wheel",
              material: "Stainless Steel",
            },
            colors: Array.isArray(p.colors)
              ? p.colors.map((c) => ({
                  name: c.name,
                  hexCode: c.hexCode,
                  image: productImages[p.code]?.[c.name] || firstColorImage,
                }))
              : [],
            sizes: ["Small", "Medium", "Large"],
            countInStock: p.stockQuantity ?? 0,
          };
        });

        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
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
  const selectedColor = selections[product.id]?.color || null;

  addToCart({
    ...product,
    selectedColor,
    selectedColorHex:
      product.colors.find((c) => c.name === selectedColor)?.hexCode || null,
    uniqueKey: `${product.id}-${selectedColor || "default"}`, // 👈 Important
  });

  router.push("/cart");
};

  const handleBuyNow = (product) => {
  const selectedColor = selections[product.id]?.color || null;

  addToCart({
    ...product,
    selectedColor,
    selectedColorHex:
      product.colors.find((c) => c.name === selectedColor)?.hexCode || null,
    uniqueKey: `${product.id}-${selectedColor || "default"}`, // 👈 Important
  });

  router.push("/checkout");
  };
  const openImageModal = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };
  const closeImageModal = () => setSelectedProduct(null);

  const nextImage = () => {
    if (!selectedProduct) return;
    setCurrentImageIndex((prev) =>
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1
    );
  };
  const prevImage = () => {
    if (!selectedProduct) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

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
            Accessories
          </h1>
          <p className="text-lg text-gray-600 mb-6 font-['Arimo']">
            Professional accessories for optimal skating performance
          </p>
          <div className="flex items-center justify-between pb-6">
            <p className="text-gray-600">{loading ? "Loading products..." : `${products.length} products`}</p>
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
          {loading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg p-6 h-64" />
              ))
            : products.map((product) => {
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

                {/* Color selector */}
                {product.code === "A0339" && product.colors?.length > 0 && (
                  <div className="flex items-center gap-2 ml-5">
                    {product.colors.map((color) => {
                      const isSelected = selections[product.id]?.color === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => {
                            setSelection(product.id, "color", color.name);
                            setProducts((prev) =>
                              prev.map((p) =>
                                p.id === product.id
                                  ? { ...p, image: color.image }
                                  : p
                              )
                            );
                          }}
                          className={`w-6 h-6 rounded-full border-2 ${
                            selections[product.id]?.color === color.name
                              ? "border-black"
                              : "border-gray-300"
                          }`}
                          style={{
                            backgroundColor: color.hexCode?.trim() || "#fff",
                          }}
                        ></button>
                      );
                    })}
                  </div>
                )}

                {/* Details */}
                <div
                  className={`flex flex-col ${
                    view === "grid" ? "flex-1 p-6" : "w-2/3 p-6"
                  }`}
                >
                  {/* Title and Code in flex */}
                  <div className="flex flex-col mb-2">
                    <h3 className="text-2xl font-bold font-['Arimo'] text-gray-900 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      Code: {product.code}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">{product.description}</p>

                  <div className="space-y-4 mt-auto">
                    {/* Price in flex */}
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{product.price.toLocaleString()}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          (incl. GST)
                        </span>
                      </span>
                    </div>

                    {/* Buttons in flex */}
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.countInStock <= 0}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          product.countInStock <= 0
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed opacity-70"
                            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95 cursor-pointer"
                        }`}
                      >
                        {/* cart icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a1 1 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        {product.countInStock <= 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        disabled={product.countInStock <= 0}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          product.countInStock <= 0
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed opacity-70"
                            : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg active:transform active:scale-95 cursor-pointer"
                        }`}
                      >
                        {/* check icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                        {product.countInStock <= 0 ? "Out of Stock" : "Buy Now"}
                      </button>
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
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              aria-label="Close"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {selectedProduct.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-2 text-white hover:text-blue-400"
                aria-label="Previous image"
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {selectedProduct.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-2 text-white hover:text-blue-400"
                aria-label="Next image"
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedProduct.images[currentImageIndex]}
                alt={selectedProduct.name}
                fill
                className="object-contain rounded-lg"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
