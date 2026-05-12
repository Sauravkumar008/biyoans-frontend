// src/Components/AddImageModal.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { getStoredUser } from "../utils/auth.js";

export default function AddImageModal({ open=true, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit() {
    if (!file) return toast.error("Pick an image");
    const user = getStoredUser();
    if (!user) return toast.error("You must be logged in (admin/teacher)");

    const adminPassword = window.prompt("Enter admin password to upload:");
    if (!adminPassword) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("adminIdentifier", user.username || user.email || "");
      fd.append("adminPassword", adminPassword);

      const res = await fetch("https://biyoans-backend.onrender.com/api/gallery", {
        method: "POST",
        body: fd
      });

      const body = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(body.message || `HTTP ${res.status}`);
      toast.success("Uploaded");
      onClose(true);
    } catch (err) {
      console.error("Upload error", err);
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded p-5 w-[90%] max-w-md">
        <h3 className="mb-3 font-bold">Upload Image</h3>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0]||null)} />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => onClose(false)} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={submit} disabled={loading} className="px-3 py-1 bg-cyan-600 text-white rounded">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}