"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  GraduationCap,
  LogOut,
  ShoppingBag,
  BarChart2,
  Clock,
  ShieldCheck,
  Search,
  Download,
  Calendar,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [academicDetails, setAcademicDetails] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [stockUpdates, setStockUpdates] = useState({});
  const [academicCount, setAcademicCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingAcademic, setLoadingAcademic] = useState(true);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Export academic data as CSV
  const exportToCSV = () => {
    if (academicDetails.length === 0) return;

    const headers = [
      "Student Name",
      "Academy Name",
      "Student Address",
      "Order ID",
      "Order Date",
      "Customer Name",
      "Email",
      "Discount Amount",
    ];

    const csvData = academicDetails.map((detail) => [
      detail.studentName,
      detail.academyName,
      detail.studentAddress,
      detail.orderId,
      detail.createdAt ? formatDate(detail.createdAt) : "-",
      detail.order ? `${detail.order.firstName} ${detail.order.lastName}` : "-",
      detail.order?.email || "-",
      detail.order?.discountAmount
        ? `₹${detail.order.discountAmount / 100}`
        : "-",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `academic-details-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter academic details based on search term
  const filteredDetails = academicDetails.filter(
    (detail) =>
      detail.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.academyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.studentAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.order?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      router.push("/admin-login");
    } else {
      // Fetch orders
      fetch("http://localhost:5000/api/admin/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setOrders(data.orders);
        });

      // Fetch products
      fetch("http://localhost:5000/api/products")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
        });

      // Fetch academic details
      setLoadingAcademic(true);
      fetch("http://localhost:5000/api/admin/academic-details")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setAcademicDetails(data.academicDetails);
            setAcademicCount(data.academicDetails.length);
          }
        })
        .catch((err) => {
          console.error("Error fetching academic details:", err);
        })
        .finally(() => {
          setLoadingAcademic(false);
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
        // Update the product in the list
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, stockQuantity: updatedStock } : p
          )
        );

        // Clear the input
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

  const handleDeliveryStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryStatus: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        // Update orders state to reflect new delivery status
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, deliveryStatus: newStatus } : order
          )
        );
      } else {
        alert("Failed to update delivery status.");
      }
    } catch (err) {
      console.error("Error updating delivery status:", err);
      alert("Something went wrong while updating status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-orange-400" size={28} />
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all shadow-md"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Orders Card */}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
          <div className="flex border-b bg-gradient-to-r from-blue-50 to-orange-50">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-4 font-medium transition-all duration-200 ${
                activeTab === "orders"
                  ? "text-blue-700 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag
                  size={18}
                  className={
                    activeTab === "orders" ? "text-blue-600" : "text-gray-500"
                  }
                />
                Orders
              </div>
            </button>
            <button
              onClick={() => setActiveTab("stocks")}
              className={`px-6 py-4 font-medium transition-all duration-200 ${
                activeTab === "stocks"
                  ? "text-orange-700 border-b-2 border-orange-500 bg-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <Boxes
                  size={18}
                  className={
                    activeTab === "stocks" ? "text-orange-600" : "text-gray-500"
                  }
                />
                Stock Management
              </div>
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`px-6 py-4 font-medium transition-all duration-200 ${
                activeTab === "academic"
                  ? "text-blue-700 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap
                  size={18}
                  className={
                    activeTab === "academic" ? "text-blue-600" : "text-gray-500"
                  }
                />
                Academic Details
              </div>
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="text-blue-600" />
                Recent Orders
              </h2>

              {orders.length === 0 ? (
                <div className="bg-blue-50 text-blue-700 p-8 rounded-xl text-center border border-blue-200">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-blue-400 opacity-75" />
                  <p className="text-lg">No orders found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {orders.map((order) => (
    <div
      key={order.id}
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-all duration-300"
    >
      {/* Top Row: Order ID + Delivery Status */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-blue-700 text-lg flex items-center gap-1">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          Order #{order.id}
        </h3>

        {/* Delivery Status */}
        <div className="flex flex-col items-end">
          <label className="text-xs font-medium text-blue-700 mb-1">
            Delivery Status
          </label>
          <select
            value={order.deliveryStatus}
            onChange={(e) => handleDeliveryStatusChange(order.id, e.target.value)}
            className={`border rounded-lg px-3 py-1 text-sm font-medium focus:outline-none transition-all duration-200 ${
              order.deliveryStatus === "Delivered"
                ? "bg-green-100 border-green-400 text-green-800"
                : order.deliveryStatus === "Shipped"
                ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                : "bg-blue-50 border-blue-300 text-blue-700"
            }`}
          >
            <option value="In Progress">In Progress</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Remaining content (Customer Info, Items, Discounts) stays unchanged */}
      <p className="text-xs text-gray-500 mb-4 bg-blue-50 inline-block px-2 py-1 rounded-md">
        <Clock className="w-3 h-3 inline mr-1 text-blue-500" />
        {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="text-sm space-y-2 bg-white p-3 rounded-lg shadow-inner border border-blue-50 mb-3">
        <p className="flex items-center gap-2 text-blue-800">
          <User className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Customer:</span> {order.firstName} {order.lastName}
        </p>
        <p className="flex items-center gap-2 text-blue-800">
          <Mail className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Email:</span> {order.email}
        </p>
        <p className="flex items-center gap-2 text-blue-800">
          <Phone className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Phone:</span> {order.phone}
        </p>
        <p className="flex items-start gap-2 text-blue-800">
          <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
          <span>
            <span className="font-medium">Address:</span> {order.address}, {order.city}, {order.state} - {order.pincode}
          </span>
        </p>
        <p className="flex items-center gap-2 text-blue-800">
          <CreditCard className="w-4 h-4 text-orange-500" />
          <span className="font-medium">Payment:</span> {order.paymentMethod}
        </p>
        <p className="flex items-center gap-2 font-bold text-orange-700 text-lg">
          <IndianRupee className="w-5 h-5 text-orange-600" />₹{(order.totalAmount / 100).toLocaleString()}
        </p>
      </div>

      <div className="mt-2">
        <p className="font-medium flex items-center gap-2 text-blue-700 mb-2">
          <Package className="w-5 h-5 text-blue-600" /> Order Items
        </p>
        <div className="bg-white rounded-lg p-3 shadow-inner border border-blue-50">
          {order.items?.length > 0 ? (
            <ul className="space-y-1">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-1 border-b border-blue-50 last:border-0">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md">× {item.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No items found</p>
          )}
        </div>
      </div>

      {order.discountApplied && order.discountAmount > 0 && (
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-orange-50 p-4 rounded-lg border border-blue-100 shadow-sm">
          <p className="font-medium flex items-center gap-2 text-blue-700 mb-1">
            <GraduationCap className="w-5 h-5 text-orange-600" /> Academic Discount Applied
          </p>
          <p className="text-sm text-blue-700 flex items-center gap-1">
            <span className="font-medium">Discount Amount:</span> 
            <span className="text-orange-700 font-bold">₹{(order.discountAmount / 100).toLocaleString()}</span>
          </p>
        </div>
      )}
    </div>
  ))}
</div>


              )}
            </div>
          )}

          {/* Stock Tab */}
          {activeTab === "stocks" && (
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Boxes className="text-orange-600" />
                Stock Management
              </h2>

              <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-orange-100">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">
                        <Boxes className="inline w-4 h-4 mr-2 text-orange-600" />
                        Product
                      </th>
                      <th className="px-6 py-4 font-semibold">Code</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Current Stock</th>
                      <th className="px-6 py-4 font-semibold">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-orange-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {product.code}
                        </td>
                        <td className="px-6 py-4 text-blue-700 font-medium">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              product.stockQuantity === 0
                                ? "bg-red-100 text-red-700 font-bold"
                                : product.stockQuantity < 5
                                ? "bg-orange-100 text-orange-700 font-medium"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="New stock"
                              value={stockUpdates[product.id] ?? ""}
                              onChange={(e) =>
                                handleStockChange(product.id, e.target.value)
                              }
                              className="border border-orange-200  text-gray-700 px-3 py-2 w-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => updateStock(product.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                            >
                              <CheckCircle className="w-4 h-4" /> Update
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Academic Details Tab */}
          {activeTab === "academic" && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="text-blue-600" />
                  Academic Discount Records
                </h2>
                <button
                  onClick={exportToCSV}
                  disabled={academicDetails.length === 0}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  Export to CSV
                </button>
              </div>

              {/* Academic Details Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-50 to-orange-50 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-blue-800">
                          Student Name
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-blue-800">
                          Academy Name
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-blue-800">
                          Student Address
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-blue-800">
                          Order Date
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-blue-800">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-blue-800">
                          Discount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      {loadingAcademic ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="flex justify-center items-center text-blue-500">
                              <svg
                                className="animate-spin h-8 w-8 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Loading academic details...
                            </div>
                          </td>
                        </tr>
                      ) : filteredDetails.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <GraduationCap
                                size={40}
                                className="text-blue-300 mb-2"
                              />
                              <p className="text-lg font-medium">
                                {searchTerm
                                  ? "No matching records found"
                                  : "No academic details available"}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredDetails.map((detail) => (
                          <tr
                            key={detail.id}
                            className="hover:bg-blue-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <User
                                  size={16}
                                  className="text-blue-500 mr-2"
                                />
                                <div className="text-sm font-medium text-gray-900">
                                  {detail.studentName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <GraduationCap
                                  size={16}
                                  className="text-orange-500 mr-2"
                                />
                                <div className="text-sm text-gray-900">
                                  {detail.academyName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <MapPin
                                  size={16}
                                  className="text-red-500 mr-2"
                                />
                                <div className="text-sm text-gray-900">
                                  {detail.studentAddress}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Calendar
                                  size={16}
                                  className="text-blue-500 mr-2"
                                />
                                <div className="text-sm text-gray-900">
                                  {detail.createdAt
                                    ? formatDate(detail.createdAt)
                                    : "-"}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {detail.order ? (
                                <div className="text-sm text-gray-900">
                                  {detail.order.firstName}{" "}
                                  {detail.order.lastName}
                                  <div className="text-xs text-gray-500">
                                    {detail.order.email}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {detail.order?.discountAmount ? (
                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                  ₹{detail.order.discountAmount / 100}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
