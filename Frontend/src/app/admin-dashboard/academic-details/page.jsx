"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  ArrowLeft,
  Search,
  Download,
  ShieldCheck,
  Mail,
  IndianRupee
} from "lucide-react";

export default function AcademicDetailsPage() {
  const router = useRouter();
  const [academicDetails, setAcademicDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if admin is logged in
    const admin = localStorage.getItem("admin");
    if (!admin) {
      router.push("/admin-login");
      return;
    }

    // Fetch academic details
    fetchAcademicDetails();
  }, []);

  const fetchAcademicDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.lgmsports.in/api/admin/academic-details");
      const data = await response.json();
      
      if (data.success) {
        setAcademicDetails(data.academicDetails);
      } else {
        console.error("Failed to fetch academic details");
      }
    } catch (error) {
      console.error("Error fetching academic details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter academic details based on search term
  const filteredDetails = academicDetails.filter(detail => 
    detail.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.academyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.academyNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.studentAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.order?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Export data as CSV
  const exportToCSV = () => {
    if (academicDetails.length === 0) return;
    
    const headers = ["Student Name", "Academy Name", "Academy No", "Student Address", "Order ID", "Order Date", "Customer Name", "Email", "Discount Amount"];
    
    const csvData = academicDetails.map(detail => [
      detail.studentName,
      detail.academyName,
      detail.academyNo,
      detail.studentAddress,
      detail.orderId,
      detail.createdAt ? formatDate(detail.createdAt) : "-",
      detail.order ? `${detail.order.firstName} ${detail.order.lastName}` : "-",
      detail.order?.email || "-",
      detail.order?.discountAmount ? `₹${detail.order.discountAmount/100}` : "-"
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `academic-details-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-orange-400" size={28} />
            Academic Discount Details
          </h1>
          <button 
            onClick={() => router.push("/admin-dashboard")}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all shadow-md"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Records Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center border-l-4 border-blue-500 hover:transform hover:scale-105 transition-all duration-300">
            <div className="rounded-full bg-blue-100 p-4 mr-4 shadow-inner">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Records</h3>
              <p className="text-3xl font-bold text-blue-700">{academicDetails.length}</p>
            </div>
          </div>

          {/* Total Discount Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center border-l-4 border-orange-500 hover:transform hover:scale-105 transition-all duration-300">
            <div className="rounded-full bg-orange-100 p-4 mr-4 shadow-inner">
              <IndianRupee className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Discount</h3>
              <p className="text-3xl font-bold text-orange-600">
                ₹{academicDetails.reduce((sum, detail) => sum + (detail.order?.discountAmount || 0), 0)/100}
              </p>
            </div>
          </div>

          {/* Export Card */}
          <div onClick={exportToCSV} className="bg-white rounded-xl shadow-lg p-6 flex items-center border-l-4 border-green-500 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="rounded-full bg-green-100 p-4 mr-4 shadow-inner">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Export Data</h3>
              <p className="text-sm text-gray-500">Download as CSV</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <GraduationCap className="text-blue-600" />
            Student Academic Records
          </h2>
          <p className="text-gray-600">
            View and manage all academic discount applications
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, academy or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-blue-100 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Details Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-orange-50 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-blue-800">Student Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-blue-800">Academy Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-blue-800">Academy No.</th>
                  <th className="px-6 py-4 text-left font-semibold text-blue-800">Student Address</th>
                  <th className="px-6 py-4 text-left font-semibold text-blue-800">Order Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-blue-800">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold text-blue-800">Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center text-blue-500">
                        <svg className="animate-spin h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading academic details...
                      </div>
                    </td>
                  </tr>
                ) : filteredDetails.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <GraduationCap size={40} className="text-blue-300 mb-2" />
                        <p className="text-lg font-medium">{searchTerm ? "No matching records found" : "No academic details available"}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDetails.map((detail) => (
                    <tr key={detail.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User size={16} className="text-blue-500 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{detail.studentName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <GraduationCap size={16} className="text-orange-500 mr-2" />
                          <div className="text-sm text-gray-900">{detail.academyName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <GraduationCap size={16} className="text-orange-500 mr-2" />
                          <div className="text-sm text-gray-900">{detail.academyNo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin size={16} className="text-red-500 mr-2" />
                          <div className="text-sm text-gray-900">{detail.studentAddress}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-blue-500 mr-2" />
                          <div className="text-sm text-gray-900">
                            {detail.createdAt ? formatDate(detail.createdAt) : "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detail.order ? (
                          <div className="text-sm text-gray-900">
                            {detail.order.firstName} {detail.order.lastName}
                            <div className="text-xs text-gray-500">{detail.order.email}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detail.order?.discountAmount ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            ₹{detail.order.discountAmount/100}
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
    </div>
  );
}
