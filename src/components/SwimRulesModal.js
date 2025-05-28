import React from "react";
import { createPortal } from "react-dom";

export default function Modal({ title, children, onClose }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>
        {title && <h2 className="text-xl font-bold mb-4 text-blue-600">{title}</h2>}
        <div className="text-sm text-gray-700">{children}</div>
      </div>
    </div>,
    document.body
  );
}
