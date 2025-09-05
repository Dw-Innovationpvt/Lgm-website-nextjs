import { Clock } from "lucide-react";

export default function FleetAltraPackagePage() {
  const products = []; // replace with your actual products fetch

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-white">
        <Clock className="w-12 h-12 text-gray-500 mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Products Coming Soon
        </h2>
        <p className="text-gray-600 max-w-md">
          We’re working hard to bring you the Fleet Altra Package products. 
          Please check back soon for exciting updates!
        </p>
      </div>
    );
  }

  
}