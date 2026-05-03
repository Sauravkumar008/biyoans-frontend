import React, { useState } from "react";

export default function AdminPasswordModal({ open, onClose, onConfirm, identifierHint }) {
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    onConfirm(password);
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Admin Confirmation</h2>
        <p className="text-sm mb-2">{identifierHint}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Enter your admin password"
            className="border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}