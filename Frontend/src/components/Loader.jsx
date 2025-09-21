// components/Loader.jsx
import React from "react";
import { ClockLoader } from "react-spinners";

const Loader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div
      className="loader-overlay fixed inset-0 z-50 flex items-center justify-center 
      bg-gradient-to-r from-blue-400 via-orange-300 to-red-400 animate-gradient-x 
      bg-opacity-80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-6">
        <p className="text-white font-bold text-8xl drop-shadow-lg animate-pulse">
          Loading
        </p>
        <ClockLoader color="#fff" size={100} />
      </div>
    </div>
  );
};

export default Loader;
