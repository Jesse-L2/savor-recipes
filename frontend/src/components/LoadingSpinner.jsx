import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      {/* Simple spinner using border and animation */}
      <div
        className="
          animate-spin
          rounded-full
          h-12
          w-12
          border-t-4
          border-b-4
          border-primary
          border-opacity-75
        "
      ></div>
      {/* Optional: Add text below the spinner */}
      {/* <p className="ml-3 text-lg text-gray-700">Loading...</p> */}
    </div>
  );
};

export default LoadingSpinner;
