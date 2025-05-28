import React from "react";

export default function SearchChildModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Search for Child</h2>
        <input
          type="text"
          placeholder="First Name"
          className="w-full mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}