import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
