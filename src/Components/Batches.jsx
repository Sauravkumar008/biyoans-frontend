// src/Components/Batches.jsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddBatchCard from "./AddBatchCard.jsx";
import AdminPasswordModal from "./AdminPasswordModal.jsx";
import EditBatchModal from "./EditBatchModal.jsx";
import BatchCard from "./BatchCard.jsx"; // small card UI (we'll create it below)
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Batches = () => {
  useEffect(() => { document.title = "Batches | Biyoans"; }, []);

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(false);

  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { type, batch }
  const [editBatch, setEditBatch] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("biyoans_user") || sessionStorage.getItem("biyoans_user");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }, []);

  const canManage = useMemo(() => {
    if (!storedUser) return false;
    const type = (storedUser.type ?? "").toString().toUpperCase();
    const role = (storedUser.role ?? "").toString().toUpperCase();
    const allowed = ["SUPERADMIN", "ADMIN", "TEACHER"];
    return (type === "SUPERUSER" && allowed.includes(role)) || allowed.includes(role);
  }, [storedUser]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://biyoans-backend.onrender.com/api/batches");
      if (!res.ok) throw new Error("Failed to fetch batches");
      const data = await res.json();
      setBatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
    window.fetchBatches = fetchBatches;
    return () => { delete window.fetchBatches; };
  }, []);

  const filtered = batches.filter(b => {
    if (!search || search.trim() === "") return true;
    return (b.batchName || "").toLowerCase().includes(search.trim().toLowerCase());
  });

  function onRequestEdit(batch) {
    setEditBatch(batch);
    setPendingAction({ type: "update", batch });
    setPwModalOpen(true);
  }

  function onRequestDelete(batch) {
    setPendingAction({ type: "delete", batch });
    setPwModalOpen(true);
  }

  async function handleAdminConfirm(password) {
    if (!pendingAction) { setPwModalOpen(false); return; }
    const identifier = storedUser?.username || storedUser?.email || "";

    try {
      if (pendingAction.type === "delete") {
        const id = pendingAction.batch.id;
        const url = `https://biyoans-backend.onrender.com/api/batches/${id}?adminIdentifier=${encodeURIComponent(identifier)}&adminPassword=${encodeURIComponent(password)}`;
        const res = await fetch(url, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        toast.success("Batch deleted");
        await fetchBatches();
      } else if (pendingAction.type === "update") {
        // open edit modal after password accepted
        toast.info("Password accepted — you may edit now");
        setEditModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Action failed");
    } finally {
      setPwModalOpen(false);
      setPendingAction(null);
      if (pendingAction?.type !== "update") setEditBatch(null);
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#0A0E2B] to-[#1C1F47] fixed inset-0 overflow-x-hidden overflow-y-auto w-screen min-h-screen">
      <Navbar />
      <div className="pt-24 px-6 sm:px-10 md:px-20 flex flex-col items-center text-center">
        <h1 className="text-white text-4xl font-extrabold mb-4 tracking-wide">Our Active Batches</h1>
        <p className="text-gray-300 text-lg mb-6 max-w-3xl leading-relaxed">
          Choose your preferred learning window and start your journey with us today!
        </p>

        <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 p-3 rounded-lg bg-[#11163D] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Search batch"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearched(false);
            }}
          />
          <button
            onClick={() => setSearched(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            Search
          </button>
        </div>

        <div className="w-full flex flex-wrap gap-8 justify-center">
          {loading && <div className="text-white animate-pulse">Loading...</div>}

          {!loading &&
            (searched ? filtered : batches).map((b, idx) => (
              <motion.div
                key={b.id ?? idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="transform hover:scale-105 transition-transform"
              >
                <BatchCard
                  batch={b}
                  onEdit={canManage ? onRequestEdit : null}
                  onDelete={canManage ? onRequestDelete : null}
                />
              </motion.div>
            ))}

          {!loading && (searched ? filtered : batches).length === 0 && (
            <div className="text-red-300 py-10 text-lg">No batches found.</div>
          )}

          {canManage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="transform hover:scale-105 transition-transform"
            >
              <AddBatchCard onCreated={() => fetchBatches()} />
            </motion.div>
          )}
        </div>

        <div className="text-center mt-20 mb-10 px-4">
          <h2 className="text-2xl text-white font-semibold mb-4">Need Help Choosing?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
            Let our academic coordinators help you pick the best batch for your goals and lifestyle.
          </p>
          <Link
            to={"/home/contact-us"}
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Talk to Us
          </Link>
        </div>
      </div>

      <AdminPasswordModal
        open={pwModalOpen}
        onClose={() => {
          setPwModalOpen(false);
          setPendingAction(null);
        }}
        onConfirm={(pwd) => handleAdminConfirm(pwd)}
        identifierHint={
          storedUser
            ? `Action will be performed as ${storedUser.username || storedUser.email}`
            : "Admin action"
        }
      />

      {editModalOpen && editBatch && (
        <EditBatchModal
          open={editModalOpen}
          batch={editBatch}
          onClose={async (saved) => {
            setEditModalOpen(false);
            setEditBatch(null);
            if (saved) await fetchBatches();
          }}
        />
      )}

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Batches;