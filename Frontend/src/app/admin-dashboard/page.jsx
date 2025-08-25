// // "use client";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import {
// //   User,
// //   Mail,
// //   Phone,
// //   MapPin,
// //   CreditCard,
// //   IndianRupee,
// //   Clock,
// //   Package,
// //   Boxes,
// //   CheckCircle,
// // } from "lucide-react";

// // export default function AdminDashboard() {
// //   const router = useRouter();
// //   const [orders, setOrders] = useState([]);
// //   const [products, setProducts] = useState([]);
// //   const [activeTab, setActiveTab] = useState("orders");
// //   const [stockUpdates, setStockUpdates] = useState({});

// //   useEffect(() => {
// //     const admin = localStorage.getItem("admin");
// //     if (!admin) {
// //       router.push("/admin-login");
// //     } else {
// //       fetch("http://localhost:5000/api/admin/orders")
// //         .then((res) => res.json())
// //         .then((data) => {
// //           if (data.success) setOrders(data.orders);
// //         });

// //       // inside useEffect → when fetching products
// //       // fetch("http://localhost:5000/api/products")
// //       //   .then((res) => res.json())
// //       //   .then((data) => {
// //       //     // ✅ Keep only products with stockQuantity === 0
// //       //     const outOfStock = data.filter((p) => p.stockQuantity === 0);
// //       //     setProducts(outOfStock);
// //       //   });
// //       // Fetch all products (with stockQuantity)
// // fetch("http://localhost:5000/api/products")
// //   .then((res) => res.json())
// //   .then((data) => {
// //     setProducts(data); // 👈 show ALL products
// //   });

// //     }
// //   }, []);

// //   const handleStockChange = (productId, newStock) => {
// //     const value = parseInt(newStock);
// //     if (!isNaN(value)) {
// //       setStockUpdates((prev) => ({
// //         ...prev,
// //         [productId]: value,
// //       }));
// //     }
// //   };

// //   const updateStock = async (productId) => {
// //     const updatedStock = stockUpdates[productId];
// //     if (updatedStock === undefined || isNaN(updatedStock)) {
// //       alert("Please enter a valid stock quantity.");
// //       return;
// //     }

// //     try {
// //       const res = await fetch(
// //         `http://localhost:5000/api/products/${productId}/stock`,
// //         {
// //           method: "PUT",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({ stockQuantity: updatedStock }),
// //         }
// //       );

// //       const data = await res.json();
// //       if (data.success) {
// //         alert("Stock updated successfully!");
// //         // Remove updated product from out-of-stock list
// //         setProducts((prev) => prev.filter((p) => p.id !== productId));
// //         setStockUpdates((prev) => {
// //           const { [productId]: _, ...rest } = prev;
// //           return rest;
// //         });
// //       } else {
// //         alert("Failed to update stock.");
// //       }
// //     } catch (err) {
// //       console.error("Error updating stock:", err);
// //       alert("Something went wrong.");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen p-6 bg-gradient-to-br from-[#e8f0ff] to-[#ffffff] font-['Arimo']">
// //       <div className="max-w-7xl mx-auto">
// //         <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">
// //           Admin Dashboard
// //         </h1>
// //         <p className="text-center text-gray-600 mb-8">
// //           Manage orders and product stock.
// //         </p>

// //         {/* Tabs */}
// //         <div className="flex justify-center mb-6 gap-4">
// //           <button
// //             onClick={() => setActiveTab("orders")}
// //             className={`px-4 py-2 rounded-md font-medium ${
// //               activeTab === "orders"
// //                 ? "bg-blue-600 text-white"
// //                 : "bg-gray-200 text-gray-700"
// //             }`}
// //           >
// //             Orders
// //           </button>
// //           <button
// //             onClick={() => setActiveTab("stocks")}
// //             className={`px-4 py-2 rounded-md font-medium ${
// //               activeTab === "stocks"
// //                 ? "bg-blue-600 text-white"
// //                 : "bg-gray-200 text-gray-700"
// //             }`}
// //           >
// //             Manage Stock
// //           </button>
// //         </div>

// //         {/* Orders Tab */}
// //         {activeTab === "orders" && (
// //           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
// //             {orders.length === 0 ? (
// //               <div className="col-span-full text-center text-gray-500">
// //                 No orders found.
// //               </div>
// //             ) : (
// //               orders.map((order) => (
// //                 <div
// //                   key={order.id}
// //                   className="bg-white shadow-md rounded-lg p-5 border text-black border-gray-200 hover:shadow-lg transition"
// //                 >
// //                   <div className="flex items-center justify-between mb-3">
// //                     <h2 className="font-bold text-lg">Order #{order.id}</h2>
// //                     <span className="text-sm text-gray-500">
// //                       {new Date(order.createdAt).toLocaleString("en-IN")}
// //                     </span>
// //                   </div>

// //                   <div className="space-y-2 text-sm text-gray-700">
// //                     <p className="flex items-center gap-2">
// //                       <User className="w-4 h-4 text-blue-500" />
// //                       {order.firstName} {order.lastName}
// //                     </p>
// //                     <p className="flex items-center gap-2">
// //                       <Mail className="w-4 h-4 text-purple-500" />
// //                       {order.email}
// //                     </p>
// //                     <p className="flex items-center gap-2">
// //                       <Phone className="w-4 h-4 text-green-500" />
// //                       {order.phone}
// //                     </p>
// //                     <p className="flex items-start gap-2">
// //                       <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
// //                       <span>
// //                         {order.address}, {order.city}, {order.state} -{" "}
// //                         {order.pincode}
// //                       </span>
// //                     </p>
// //                     <p className="flex items-center gap-2">
// //                       <CreditCard className="w-4 h-4 text-yellow-500" />
// //                       {order.paymentMethod}
// //                     </p>
// //                     <p className="flex items-center gap-2 font-semibold text-black">
// //                       <IndianRupee className="w-4 h-4 text-green-600" />
// //                       {order.totalAmount}
// //                     </p>
// //                   </div>

// //                   <div className="mt-4">
// //                     <p className="font-medium flex items-center gap-2">
// //                       <Package className="w-4 h-4 text-pink-500" /> Items:
// //                     </p>
// //                     <ul className="list-disc ml-6 text-sm text-gray-600">
// //                       {order.items.map((item) => (
// //                         <li key={item.id}>
// //                           {item.name} × {item.quantity}
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 </div>
// //               ))
// //             )}
// //           </div>
// //         )}

// //         {/* Stock Tab */}
// //         {activeTab === "stocks" && (
// //           <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
// //             <table className="min-w-full text-sm text-left text-gray-700">
// //               <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
// //                 <tr>
// //                   <th className="px-4 py-3">
// //                     <Boxes className="inline w-4 h-4 mr-1" />
// //                     Product
// //                   </th>
// //                   <th className="px-4 py-3">Price</th>
// //                   <th className="px-4 py-3">Current Stock</th>
// //                   <th className="px-4 py-3">Update</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {products.map((product) => (
// //                   <tr key={product.id} className="border-t hover:bg-gray-50">
// //                     <td className="px-4 py-3">{product.name}</td>
// //                     <td className="px-4 py-3">₹{product.price}</td>
// //                     <td className="px-4 py-3">{product.stockQuantity}</td>
// //                     <td className="px-4 py-3">
// //                       <input
// //                         type="number"
// //                         placeholder="Enter new stock"
// //                         value={stockUpdates[product.id] ?? ""}
// //                         onChange={(e) =>
// //                           handleStockChange(product.id, e.target.value)
// //                         }
// //                         className="border px-2 py-1 w-24 rounded mr-2"
// //                       />
// //                       <button
// //                         onClick={() => updateStock(product.id)}
// //                         className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
// //                       >
// //                         <CheckCircle className="w-4 h-4" /> Update
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }













// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   CreditCard,
//   IndianRupee,
//   Package,
//   Boxes,
//   CheckCircle,
// } from "lucide-react";

// export default function AdminDashboard() {
//   const router = useRouter();
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [activeTab, setActiveTab] = useState("orders");
//   const [stockUpdates, setStockUpdates] = useState({});

//   useEffect(() => {
//     const admin = localStorage.getItem("admin");
//     if (!admin) {
//       router.push("/admin-login");
//     } else {
//       fetch("http://localhost:5000/api/admin/orders")
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.success) setOrders(data.orders);
//         });

//       // fetch all products
//       fetch("http://localhost:5000/api/products")
//   .then((res) => res.json())
//   .then((data) => {
//     console.log("Products API Response:", data); // 👈 check in browser console
//     setProducts(data.products || data); // handles both cases
//   });

//     }
//   }, []);

//   const handleStockChange = (productId, newStock) => {
//     const value = parseInt(newStock);
//     if (!isNaN(value)) {
//       setStockUpdates((prev) => ({
//         ...prev,
//         [productId]: value,
//       }));
//     }
//   };

//   const updateStock = async (productId) => {
//     const updatedStock = stockUpdates[productId];
//     if (updatedStock === undefined || isNaN(updatedStock)) {
//       alert("Please enter a valid stock quantity.");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/products/${productId}/stock`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ stockQuantity: updatedStock }),
//         }
//       );

//       const data = await res.json();
//       if (data.success) {
//         alert("Stock updated successfully!");
//         // ✅ update product in list instead of removing it
//         setProducts((prev) =>
//           prev.map((p) =>
//             p.id === productId ? { ...p, stockQuantity: updatedStock } : p
//           )
//         );
//         // clear input field
//         setStockUpdates((prev) => {
//           const { [productId]: _, ...rest } = prev;
//           return rest;
//         });
//       } else {
//         alert("Failed to update stock.");
//       }
//     } catch (err) {
//       console.error("Error updating stock:", err);
//       alert("Something went wrong.");
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-br from-[#e8f0ff] to-[#ffffff] font-['Arimo']">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">
//           Admin Dashboard
//         </h1>
//         <p className="text-center text-gray-600 mb-8">
//           Manage orders and product stock.
//         </p>

//         {/* Tabs */}
//         <div className="flex justify-center mb-6 gap-4">
//           <button
//             onClick={() => setActiveTab("orders")}
//             className={`px-4 py-2 rounded-md font-medium ${
//               activeTab === "orders"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             Orders
//           </button>
//           <button
//             onClick={() => setActiveTab("stocks")}
//             className={`px-4 py-2 rounded-md font-medium ${
//               activeTab === "stocks"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             Manage Stock
//           </button>
//         </div>

//         {/* Orders Tab */}
//         {activeTab === "orders" && (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {orders.length === 0 ? (
//               <div className="col-span-full text-center text-gray-500">
//                 No orders found.
//               </div>
//             ) : (
//               orders.map((order) => (
//                 <div
//                   key={order.id}
//                   className="bg-white shadow-md rounded-lg p-5 border text-black border-gray-200 hover:shadow-lg transition"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <h2 className="font-bold text-lg">Order #{order.id}</h2>
//                     <span className="text-sm text-gray-500">
//                       {new Date(order.createdAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>

//                   <div className="space-y-2 text-sm text-gray-700">
//                     <p className="flex items-center gap-2">
//                       <User className="w-4 h-4 text-blue-500" />
//                       {order.firstName} {order.lastName}
//                     </p>
//                     <p className="flex items-center gap-2">
//                       <Mail className="w-4 h-4 text-purple-500" />
//                       {order.email}
//                     </p>
//                     <p className="flex items-center gap-2">
//                       <Phone className="w-4 h-4 text-green-500" />
//                       {order.phone}
//                     </p>
//                     <p className="flex items-start gap-2">
//                       <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
//                       <span>
//                         {order.address}, {order.city}, {order.state} -{" "}
//                         {order.pincode}
//                       </span>
//                     </p>
//                     <p className="flex items-center gap-2">
//                       <CreditCard className="w-4 h-4 text-yellow-500" />
//                       {order.paymentMethod}
//                     </p>
//                     <p className="flex items-center gap-2 font-semibold text-black">
//                       <IndianRupee className="w-4 h-4 text-green-600" />
//                       {order.totalAmount}
//                     </p>
//                   </div>

//                   <div className="mt-4">
//                     <p className="font-medium flex items-center gap-2">
//                       <Package className="w-4 h-4 text-pink-500" /> Items:
//                     </p>
//                     <ul className="list-disc ml-6 text-sm text-gray-600">
//                       {order.items.map((item) => (
//                         <li key={item.id}>
//                           {item.name} × {item.quantity}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {/* Stock Tab */}
//         {activeTab === "stocks" && (
//           <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
//             <table className="min-w-full text-sm text-left text-gray-700">
//               <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
//                 <tr>
//                   <th className="px-4 py-3">
//                     <Boxes className="inline w-4 h-4 mr-1" />
//                     Product
//                   </th>
//                   <th className="px-4 py-3">Price</th>
//                   <th className="px-4 py-3">Current Stock</th>
//                   <th className="px-4 py-3">Update</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product) => (
//                   <tr key={product.id} className="border-t hover:bg-gray-50">
//                     <td className="px-4 py-3">{product.name}</td>
//                     <td className="px-4 py-3">₹{product.price}</td>
//                     <td className="px-4 py-3">{product.stockQuantity}</td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="number"
//                         placeholder="Enter new stock"
//                         value={stockUpdates[product.id] ?? ""}
//                         onChange={(e) =>
//                           handleStockChange(product.id, e.target.value)
//                         }
//                         className="border px-2 py-1 w-24 rounded mr-2"
//                       />
//                       <button
//                         onClick={() => updateStock(product.id)}
//                         className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
//                       >
//                         <CheckCircle className="w-4 h-4" /> Update
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





























"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  IndianRupee,
  Package,
  Boxes,
  CheckCircle,
  BookOpen,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [stockUpdates, setStockUpdates] = useState({});

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      router.push("/admin-login");
    } else {
      fetch("http://localhost:5000/api/admin/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setOrders(data.orders);
        });

      fetch("http://localhost:5000/api/products")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.products || data);
        });
    }
  }, []);

  const handleStockChange = (productId, newStock) => {
    const value = parseInt(newStock);
    if (!isNaN(value)) {
      setStockUpdates((prev) => ({
        ...prev,
        [productId]: value,
      }));
    }
  };

  const updateStock = async (productId) => {
    const updatedStock = stockUpdates[productId];
    if (updatedStock === undefined || isNaN(updatedStock)) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${productId}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stockQuantity: updatedStock }),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Stock updated successfully!");
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, stockQuantity: updatedStock } : p
          )
        );
        setStockUpdates((prev) => {
          const { [productId]: _, ...rest } = prev;
          return rest;
        });
      } else {
        alert("Failed to update stock.");
      }
    } catch (err) {
      console.error("Error updating stock:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#e8f0ff] to-[#ffffff] font-['Arimo']">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Manage orders and product stock.
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("stocks")}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === "stocks"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Manage Stock
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orders.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No orders found.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white shadow-md rounded-lg p-5 border text-black border-gray-200 hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-lg">Order #{order.id}</h2>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      {order.formData?.firstName} {order.formData?.lastName}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      {order.formData?.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      {order.formData?.phone}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                      <span>
                        {order.formData?.address}, {order.formData?.city},{" "}
                        {order.formData?.state} - {order.formData?.pincode}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-yellow-500" />
                      {order.formData?.paymentMethod}
                    </p>
                    <p className="flex items-center gap-2 font-semibold text-black">
                      <IndianRupee className="w-4 h-4 text-green-600" />
                      {order.totalAmount}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="mt-4">
                    <p className="font-medium flex items-center gap-2">
                      <Package className="w-4 h-4 text-pink-500" /> Items:
                    </p>
                    <ul className="list-disc ml-6 text-sm text-gray-600">
                      {order.cart?.map((item) => (
                        <li key={item.id}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Academic Coupon Details */}
                  {order.discountApplied && order.couponData && (
                    <div className="mt-4 bg-gray-50 p-3 rounded text-sm text-gray-700">
                      <p className="font-medium flex items-center gap-2 text-blue-600">
                        <BookOpen className="w-4 h-4" /> Academic Discount
                      </p>
                      <p>
                        <strong>Student Name:</strong>{" "}
                        {order.couponData.studentName}
                      </p>
                      <p>
                        <strong>Academic Year:</strong>{" "}
                        {order.couponData.academicYear}
                      </p>
                      <p>
                        <strong>Student ID / Institute:</strong>{" "}
                        {order.couponData.studentId}
                      </p>
                      <p className="text-green-600 font-medium mt-1">
                        Discount Applied: -₹{order.discountAmount}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Stock Tab */}
        {activeTab === "stocks" && (
          <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">
                    <Boxes className="inline w-4 h-4 mr-1" />
                    Product
                  </th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Current Stock</th>
                  <th className="px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">₹{product.price}</td>
                    <td className="px-4 py-3">{product.stockQuantity}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        placeholder="Enter new stock"
                        value={stockUpdates[product.id] ?? ""}
                        onChange={(e) =>
                          handleStockChange(product.id, e.target.value)
                        }
                        className="border px-2 py-1 w-24 rounded mr-2"
                      />
                      <button
                        onClick={() => updateStock(product.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
