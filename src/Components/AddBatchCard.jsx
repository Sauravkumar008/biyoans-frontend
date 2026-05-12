import React, { useState } from "react";
import { toast } from "react-toastify";

const AddBatchCard = ({ onCreated }) => {
  const [form, setForm] = useState({ batchName: "", timing: "", mode: "", runningFrom: "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.batchName?.trim()) return toast.error("Batch name required");
    try {
      setSaving(true);
      const res = await fetch("https://biyoans-backend.onrender.com/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      toast.success("Batch created");
      setForm({ batchName: "", timing: "", mode: "", runningFrom: "" });
      if (onCreated) onCreated();
    } catch (err) {
      console.error("Add batch error", err);
      toast.error(err.message || "Create failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="w-80 bg-[#0A0E2B] text-white p-6 rounded-2xl border border-dashed border-gray-600">
      <h3 className="text-xl font-semibold mb-3">Add Batch</h3>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input name="batchName" value={form.batchName} onChange={handleChange} placeholder="Batch name" className="p-2 bg-[#11163D] rounded" />
        <input name="timing" value={form.timing} onChange={handleChange} placeholder="Timing (e.g. 6:00 AM - 9:00 AM)" className="p-2 bg-[#11163D] rounded" />
        <input name="mode" value={form.mode} onChange={handleChange} placeholder="Mode (Online/Offline)" className="p-2 bg-[#11163D] rounded" />
        <input name="runningFrom" value={form.runningFrom} onChange={handleChange} placeholder="Running from (date)" className="p-2 bg-[#11163D] rounded" />
        <button type="submit" disabled={saving} className="mt-2 bg-cyan-600 py-2 rounded"> {saving ? "Please wait..." : "Add Batch"} </button>
      </form>
    </div>
  );
};

export default AddBatchCard;