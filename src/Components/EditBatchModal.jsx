import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function EditBatchModal({ open, batch, onClose }) {
  const [form, setForm] = useState({ batchName: "", timing: "", mode: "", runningFrom: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (batch) setForm({
      batchName: batch.batchName || "",
      timing: batch.timing || "",
      mode: batch.mode || "",
      runningFrom: batch.runningFrom || ""
    });
  }, [batch]);

  if (!open) return null;

  const stored = (() => {
    try {
      const raw = localStorage.getItem("biyoans_user") || sessionStorage.getItem("biyoans_user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const adminIdentifier = stored?.username || stored?.email || "";

  const submit = async (e) => {
    e.preventDefault();
    if (!batch) return;
    try {
      setSaving(true);
      // For security we asked to verify password earlier; we still need password here only if backend requires it now.
      // In our flow password was already checked before opening edit modal; backend requires adminIdentifier & adminPassword on PUT.
      // If you want to avoid asking password again, you could have a special endpoint to validate once and issue a short-lived token.
      // We'll ask the user for password now (simple prompt). If you already validated earlier, you can remove the prompt and call PUT without password.
      const adminPassword = prompt("Enter your admin password to confirm edit (required):", "");
      if (!adminPassword) { toast.error("Password required"); return; }

      const url = `http://localhost:8080/api/batches/${batch.id}?adminIdentifier=${encodeURIComponent(adminIdentifier)}&adminPassword=${encodeURIComponent(adminPassword)}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      toast.success("Batch updated");
      onClose(true);
    } catch (err) {
      console.error("Edit error:", err);
      toast.error(err.message || "Edit failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[95%] max-w-lg">
        <h2 className="text-xl font-semibold mb-3">Edit Batch</h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input value={form.batchName} onChange={e=>setForm({...form,batchName:e.target.value})} placeholder="Batch name" className="p-2 border rounded" />
          <input value={form.timing} onChange={e=>setForm({...form,timing:e.target.value})} placeholder="Timing" className="p-2 border rounded" />
          <input value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})} placeholder="Mode" className="p-2 border rounded" />
          <input value={form.runningFrom} onChange={e=>setForm({...form,runningFrom:e.target.value})} placeholder="Running from" className="p-2 border rounded" />
          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={()=>onClose(false)} className="px-3 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={saving} className="px-3 py-2 bg-cyan-600 text-white rounded">{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}