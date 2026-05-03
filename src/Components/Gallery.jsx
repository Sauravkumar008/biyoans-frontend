import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import { getStoredUser } from "../utils/auth.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Backend base URL (Sirf API calls ke liye)
const BASE_URL = "http://localhost:8080";
const API_BASE = `${BASE_URL}/api/gallery`;

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [enlarged, setEnlarged] = useState(null);
  const [loading, setLoading] = useState(false);

  // User role check logic
  const user = useMemo(() => getStoredUser(), []);
  const canManage = useMemo(() => {
    if (!user) return false;
    const role = (user.role || "").toUpperCase();
    return ["TEACHER", "ADMIN", "SUPERADMIN"].includes(role);
  }, [user]);

  // Fetch images from backend
  async function fetchImages() {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch gallery");
      const data = await res.json();
      console.log("Backend Data Check:", data);
      setItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Could not load gallery");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload functionality
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(API_BASE, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      toast.success("Image uploaded successfully");
      fetchImages();
    } catch (err) {
      toast.error(err.message);
    }
  }

  // Delete functionality
  async function handleDelete(id) {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Image deleted");
      fetchImages();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="bg-[#0A0E2B] flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-[1400px] mx-auto pt-32 pb-20 px-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center text-white text-4xl md:text-6xl font-bold mb-12"
        >
          Our <span className="text-cyan-400">Gallery</span>
        </motion.h1>

        {loading ? (
          <div className="text-white text-center">Loading Gallery...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative group rounded-xl overflow-hidden bg-[#151A3D] cursor-pointer h-64"
                onClick={() => setEnlarged(item)}
              >
                <img
                  // FIX: Removed ${BASE_URL} as Cloudinary provides full URL
                  src={item.image_url || item.imageUrl}
                  alt="Gallery"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => console.log("Image Load Failed:", e.target.src)}
                />
                
                {canManage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                  >
                    🗑️
                  </button>
                )}
              </motion.div>
            ))}

            {canManage && (
              <div
                onClick={() => document.getElementById("imageUpload").click()}
                className="rounded-xl border-2 border-dashed border-cyan-500 flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-cyan-500/10 transition"
              >
                <span className="text-4xl text-cyan-400">+</span>
                <p className="text-white mt-2 font-medium">Add New Image</p>
                <input id="imageUpload" type="file" className="hidden" onChange={handleUpload} />
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {enlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setEnlarged(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              // FIX: Removed ${BASE_URL} here as well
              src={enlarged.image_url || enlarged.imageUrl}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default Gallery;