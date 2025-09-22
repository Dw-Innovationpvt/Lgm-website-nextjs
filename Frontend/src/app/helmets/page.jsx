"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

const productImages = {
  A0245: {
    Red: ["/assets/A0245 - Patti Head Gear/1000211176.png"],
    Blue: [
    "/assets/A0245 - Patti Head Gear/1000211233.png",
    "/assets/A0245 - Patti Head Gear/1000211177.png",
    "/assets/A0245 - Patti Head Gear/1000211234.png",]
  },
  A0246: {
    Green: ["/assets/A0246 - Round Fluoescent Helmet/1000211225.png"],
    Red:["/assets/A0246 - Round Fluoescent Helmet/1000211226.png"],
    Orange: ["/assets/A0246 - Round Fluoescent Helmet/1000211228.png",
    "/assets/A0246 - Round Fluoescent Helmet/1000211231.png",]
  },
  A0247: {
    Red: ["/assets/A0247 - Fluoescent Helmet/1000211220.png"],
    Blue: ["/assets/A0247 - Fluoescent Helmet/1000211222.png",
    "/assets/A0247 - Fluoescent Helmet/1000211229.png",]
  },
  A0248: {
    Orange: ["/assets/A0248 - Keeper Helmet/AARMS Photography-131.jpg",
    "/assets/A0248 - Keeper Helmet/AARMS Photography-132.jpg",
    "/assets/A0248 - Keeper Helmet/AARMS Photography-133.jpg"],

    Blue: ["/assets/A0248 - Keeper Helmet/AARMS Photography-134.jpg",
    "/assets/A0248 - Keeper Helmet/AARMS Photography-135.jpg",
    "/assets/A0248 - Keeper Helmet/AARMS Photography-136.jpg"],

    Green: ["/assets/A0248 - Keeper Helmet/AARMS Photography-137.jpg",
    "/assets/A0248 - Keeper Helmet/AARMS Photography-138.jpg",
    "/assets/A0248 - Keeper Helmet/AARMS Photography-139.jpg"],

    Pink: ["/assets/A0248 - Keeper Helmet/AARMS Photography-140.jpg",
    "/assets/A0248 - Keeper Helmet/AARMS Photography-141.jpg",
    "/assets/A0248 - Keeper Helmet/AARMS Photography-142.jpg"],

    DarkBlue: ["/assets/A0248 - Keeper Helmet/AARMS Photography-143.jpg",
    "/assets/A0248 - Keeper Helmet/AARMS Photography-144.jpg",
    "/assets/A0248 - Keeper Helmet/AARMS Photography-145.jpg"],
  },

  A0249: ["/assets/comming-soon.png"],
};

export default function Helmet() {
  const [view, setView] = useState("grid");
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // selections shape: { [productId]: { color: string, size: string } }
  const [selections, setSelections] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        let data = await res.json();

        // Filter only Helmet
        data = data.filter(
          (p) =>
            ["A0245", "A0246", "A0247", "A0248", "A0249"].includes(p.code) ||
            ["A0245", "A0246", "A0247", "A0248", "A0249"].includes(p.code)
        );

        // Attach images from local mapping
        data = data.map((p) => {
          const productImg = productImages[p.code];

          // Determine first image to display
          let firstImage = "/placeholder.png";

          if (Array.isArray(productImg) && productImg.length > 0) {
            firstImage = productImg[0];
          } else if (productImg && typeof productImg === "object") {
            const firstColor = Object.keys(productImg)[0];
            firstImage = productImg[firstColor][0];
          }

          // All images for product
          let allImages = [];
          if (Array.isArray(productImg)) allImages = productImg;
          else if (productImg && typeof productImg === "object") {
            allImages = Object.values(productImg).flat();
          } else allImages = ["/placeholder.png"];

          return {
            ...p,
            image: firstImage,
            images: allImages,
            specs: {
              usage: "Skating",
              wheels: "4 Wheel",
              material: "Stainless Steel",
            },
            colors: (p.colors || []).map((c) => {
              let colorImage = firstImage;
              if (productImg && productImg[c.name])
                colorImage = productImg[c.name][0];
              return {
                name: c.name,
                hexCode: c.hexCode,
                image: colorImage,
              };
            }),
            sizes: ["Small", "Medium", "Large"],
            countInStock: p.stockQuantity ?? 0,
          };
        });

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
            Helmets
          </h1>
          <p className="text-lg text-gray-600 mb-6 font-['Arimo']">
            Professional helmets for optimal skating performance
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
                              
                        {/* Color selector */}
                        {["A0246", "A0247", "A0248", "A0245"].includes(product.code) && product.colors?.length > 0 && (
                          <div className="flex items-center gap-2 ml-5">
                            {product.colors.map((color) => {
                              const isSelected = selections[product.id]?.color === color.name;
                              return (
                                <button
                                  key={color.name}
                                  onClick={() => {
                                    setSelection(
                                      product.id,
                                      "color",
                                      color.name
                                    );
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
                                    backgroundColor:
                                      color.hexCode?.trim() || "#fff",
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
                          <h3 className="text-2xl font-bold font-['Arimo'] text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono mb-1">
                            Code: {product.code}
                               
                          </p>
                          <p className="text-gray-600 mb-4">
                            {product.description || "Premium quality skating gear."}
                          </p>
        
                          <div className="space-y-4 mt-auto">
                            {/* Price in flex */}
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-blue-600">
                                ₹{product.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">(incl. GST)</span>
                              </span>
                            </div>
                            
                            {/* Buttons in flex */}
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleAddToCart(product)}
                                disabled={product.countInStock <= 0}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${product.countInStock <= 0 
                                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-70' 
                                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95 cursor-pointer'}`}
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
                                {product.countInStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                              </button>
                              <button
                                onClick={() => handleBuyNow(product)}
                                disabled={product.countInStock <= 0}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${product.countInStock <= 0 
                                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-70' 
                                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg active:transform active:scale-95 cursor-pointer'}`}
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
                                {product.countInStock <= 0 ? 'Out of Stock' : 'Buy Now'}
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
