// EditCourseModal.jsx
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 Props expected:
  - open: boolean
  - course: { id, courseName, courseFee, courseCategory, courseImageUrl, ... }
  - onClose(saved:boolean)  -> call onClose(true) if saved, onClose(false) if cancelled
  - verifiedAdminPassword: string | null  (optional) - password already verified by AdminPasswordModal
  - identifier: string (optional) - admin identifier (username/email). If not provided, will check local/session storage
*/

export default function EditCourseModal({
  open,
  course,
  onClose,
  verifiedAdminPassword = null,
  identifier = null,
}) {
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (course) {
      setName(course.courseName || "");
      setFee(course.courseFee ?? "");
      setCategory(course.courseCategory || "");
      setImageFile(null); // don't pre-fill file input
    }
  }, [course, open]);

  if (!open) return null;

  function getStoredIdentifier() {
    if (identifier) return identifier;
    const raw =
      localStorage.getItem("biyoans_user") ||
      sessionStorage.getItem("biyoans_user");
    if (!raw) return "";
    try {
      const u = JSON.parse(raw);
      return u.username || u.email || "";
    } catch {
      return "";
    }
  }

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!course || !course.id) {
      toast.error("Course not loaded");
      return;
    }

    const adminPassword = verifiedAdminPassword || window.prompt("Enter admin password to confirm edit:");
    if (!adminPassword) {
      toast.error("Admin password required");
      return;
    }

    const adminIdentifier = getStoredIdentifier();
    if (!adminIdentifier) {
      toast.error("Admin identifier not available");
      return;
    }

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("courseName", name);
      fd.append("courseFee", fee || "");
      fd.append("courseCategory", category || "");
      if (imageFile) {
        fd.append("courseImage", imageFile, imageFile.name);
      }

      const url = `https://biyoans-backend.onrender.com/api/courses/${encodeURIComponent(course.id)}?adminIdentifier=${encodeURIComponent(adminIdentifier)}&adminPassword=${encodeURIComponent(adminPassword)}`;

      const res = await fetch(url, {
        method: "PUT",
        body: fd, // multipart/form-data; browser sets the boundary header
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.message || data.error || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      toast.success("Course updated");
      onClose(true); // notify parent to refresh
    } catch (err) {
      console.error("Edit error:", err);
      toast.error(err.message || "Failed to update course");
      // Optionally keep modal open for retry
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setImageFile(f || null);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-lg">
        <h2 className="text-xl font-bold mb-2">Edit Course</h2>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="text-sm">Course Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <label className="text-sm">Course Fee (INR)</label>
          <input
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <label className="text-sm">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <label className="text-sm">Replace Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />

          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-3 py-2 border rounded"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-purple-700 text-white rounded"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}