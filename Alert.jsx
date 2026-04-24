import React from "react";

export function Alert({ children, className = "", ...props }) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-sm ${className}`} {...props}>
      {children}
    </p>
  );
}
