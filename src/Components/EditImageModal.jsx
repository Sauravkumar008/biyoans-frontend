// src/Components/EditImageModal.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { getStoredUser } from "../utils/auth.js";

export default function EditImageModal({ open = true, item, onClose }) {
  const [title, setTitle] = useState(item?.title || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open || !item) return null;

  async function submit() {
    const user = getStoredUser();
    if (!user) return toast.error("You must be logged in as admin/teacher");

    const adminPassword = window.prompt("Enter admin password to update image:");
    if (!adminPassword) return;

    setLoading(true);
    try {
      const fd = new FormData();
      if (title) fd.append("title", title);
      if (file) fd.append("image", file);
      fd.append("adminIdentifier", user.username || user.email);
      fd.append("adminPassword", adminPassword);

      const res = await fetch(`https://biyoans-backend.onrender.com/api/gallery/${item.id}`, {
        method: "PUT",
        body: fd
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      toast.success("Image updated");
      onClose(true);
    } catch (err) {
      console.error("Edit error", err);
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-lg">
        <h3 className="text-xl font-bold mb-3">Edit Image</h3>
        <div className="flex flex-col gap-3">
          <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="p-2 border rounded"/>
          <div className="flex items-center gap-3">
            <img src={item.imageUrl} alt="preview" className="w-24 h-24 object-cover rounded" />
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={()=>onClose(false)} className="px-3 py-2 border rounded">Cancel</button>
            <button onClick={submit} disabled={loading} className="px-3 py-2 bg-cyan-600 text-white rounded">
              {loading ? "Updating..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}