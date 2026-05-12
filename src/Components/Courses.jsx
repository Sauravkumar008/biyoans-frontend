// Courses.jsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CourseCard from "./CourseCard";
import AddCourseCard from "./AddCourseCard";
import AdminPasswordModal from "./AdminPasswordModal.jsx";
import EditCourseModal from "./EditCourseModal.jsx";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStoredUser } from "../utils/auth.js";

import CourseImg1 from "../Images/Card/Course1.jpg";
import CourseImg2 from "../Images/Card/Course2.jpg";
import CourseImg3 from "../Images/Card/Course3.jpg";
import { Link } from "react-router-dom";

const Courses = () => {
  // UI + data state
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // admin flow
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { type: 'delete'|'update', course }
  const [editCourse, setEditCourse] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // user from storage
  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("biyoans_user") || sessionStorage.getItem("biyoans_user");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }, []);

  // role check: show add/edit/delete for SUPERADMIN/ADMIN/TEACHER (you can adjust)
  const canAddCourse = useMemo(() => {
    if (!storedUser) return false;
    const type = (storedUser.type ?? "").toString().toUpperCase();
    const role = (storedUser.role ?? "").toString().toUpperCase();
    const allowed = ["SUPERADMIN", "ADMIN", "TEACHER"];
    return (type === "SUPERUSER" && allowed.includes(role)) || allowed.includes(role);
  }, [storedUser]);

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://biyoans-backend.onrender.com/api/courses");
      if (!res.ok) throw new Error(`Failed to fetch courses (HTTP ${res.status})`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchCourses error:", err);
      toast.error("Could not load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.fetchCourses = fetchCourses; // optional convenience for AddCourseForm
    fetchCourses();
    return () => { delete window.fetchCourses; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtering
  const filteredCourses = courses.filter((c) => {
    if (!search || search.trim() === "") return true;
    return (c.courseName || c.course_name || "")
      .toString()
      .toLowerCase()
      .includes(search.trim().toLowerCase());
  });

  // Admin actions
  function onRequestEdit(course) {
    setEditCourse(course);
    setPendingAction({ type: "update", course });
    setPwModalOpen(true);
  }

  function onRequestDelete(course) {
    setPendingAction({ type: "delete", course });
    setPwModalOpen(true);
  }

  async function handleAdminConfirm(password) {
    if (!pendingAction) {
      setPwModalOpen(false);
      return;
    }

    const identifier = (storedUser?.username || storedUser?.email || "").toString();

    try {
      if (pendingAction.type === "delete") {
        const id = pendingAction.course.id;
        const url = `https://biyoans-backend.onrender.com/api/courses/${id}?adminIdentifier=${encodeURIComponent(identifier)}&adminPassword=${encodeURIComponent(password)}`;
        const res = await fetch(url, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        toast.success("Course deleted");
        await fetchCourses();
      }

      if (pendingAction.type === "update") {
        // Password accepted — open edit modal. For stronger verification you can call a lightweight verify endpoint.
        toast.info("Password accepted — you may edit now");
        setEditModalOpen(true);
      }
    } catch (err) {
      console.error("Admin action error:", err);
      toast.error(err.message || "Action failed");
    } finally {
      setPwModalOpen(false);
      setPendingAction(null);
      if (pendingAction?.type !== "update") setEditCourse(null);
    }
  }

  async function handleEditModalClose(saved) {
    setEditModalOpen(false);
    setEditCourse(null);
    if (saved) await fetchCourses();
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearched(true);
  }

  // --- Page UI (includes testimonials, CTA etc) ---
  return (
    <div className="bg-[#0A0E2B] homepage-scroll fixed inset-0 overflow-x-hidden overflow-y-auto w-screen min-h-screen m-0 p-0">
      <Navbar />

      {/* hero */}
      <div className="pt-24 px-4 sm:px-10 md:px-20 flex flex-col items-center text-center">
        <h1 className="text-white text-4xl font-bold mb-4">Explore Our Courses</h1>
        <p className="text-gray-300 text-lg mb-6 max-w-3xl">
          Empowering future minds with knowledge that shapes careers. From competitive exams like JEE & NEET to modern tech skills like Full Stack Development & Cybersecurity — we prepare you for every path ahead.
        </p>

        {/* count */}
        <p className="text-gray-400 text-sm mb-6">
          Showing {searched ? filteredCourses.length : courses.length} course{(searched ? filteredCourses.length : courses.length) !== 1 && 's'}
        </p>

        {/* category + search */}
        <div className="flex gap-3 mb-6 flex-col md:flex-row items-center">
          <select
            className="p-2 w-auto rounded-lg bg-[#11163D] text-white border border-gray-600 mb-2 md:mb-0"
            onChange={(e) => { setSearch(e.target.value); setSearched(true); }}
          >
            <option value="">All Categories</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Hacking">Hacking</option>
            <option value="JEE">JEE</option>
            <option value="NEET">NEET</option>
          </select>

          <form className="w-full max-w-md mb-0 relative" onSubmit={handleSearchSubmit} autoComplete="off">
            <input
              type="text"
              placeholder="Search for a course..."
              className="w-full p-3 rounded-lg bg-[#11163D] text-white placeholder-gray-400 border border-gray-600 focus:outline-none pr-12"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSearched(false); }}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" aria-label="Search">
              <FiSearch size={22} className='cursor-pointer'/>
            </button>
          </form>
        </div>

        {/* course list */}
        <section id="course" className="w-full">
          <div className="py-20 px-4 md:px-20 w-full flex flex-wrap gap-10 items-center justify-center">
            {loading && <div className="text-white">Loading...</div>}

            {!loading && (searched ? filteredCourses : courses).map((c, idx) => (
              <motion.div key={c.id ?? `${c.courseName}-${idx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 + idx * 0.05 }}>
                <CourseCard
                  course={c}
                  onEdit={canAddCourse ? onRequestEdit : null}
                  onDelete={canAddCourse ? onRequestDelete : null}
                  onEnroll={() => toast.info(`Enroll clicked for ${c.courseName}`)}
                />
              </motion.div>
            ))}

            {!loading && (searched ? filteredCourses : courses).length === 0 && (
              <div className="text-red-300 text-lg py-10">No course found.</div>
            )}

            {/* Add course card for admins/teachers */}
            {canAddCourse && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <AddCourseCard />
              </motion.div>
            )}
          </div>
        </section>

        {/* Why choose us / testimonials */}
        <div className="w-full text-center mt-10 mb-10">
          <h2 className="text-2xl text-white font-semibold mb-4">Why Choose Us?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We don't just teach — we mentor. Learn from industry experts, practice real-world projects, and build a career, not just skills.
          </p>
        </div>

        <div className="bg-[#11163D] text-white px-4 py-10 w-full rounded-xl mb-10 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">What Our Students Say</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="max-w-sm p-4 bg-[#0A0E2B] rounded-xl shadow-lg">
              <p>"Thanks to Biyoans, I cracked NEET with confidence. The mentorship is on another level!"</p>
              <span className="block mt-2 text-sm text-gray-400">— Anjali, NEET Aspirant</span>
            </div>
            <div className="max-w-sm p-4 bg-[#0A0E2B] rounded-xl shadow-lg">
              <p>"The Full Stack course helped me land my first internship. Real projects, real guidance."</p>
              <span className="block mt-2 text-sm text-gray-400">— Aman, Web Dev Enthusiast</span>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-10 mb-10">
          <h2 className="text-white text-2xl font-bold mb-4">Not Sure Where to Start?</h2>
          <p className="text-gray-400 mb-6">Let our counselors guide you to the right course based on your goals.</p>
          <Link className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all">Talk to Us</Link>
        </div>
      </div>

      {/* Admin password modal */}
      <AdminPasswordModal
        open={pwModalOpen}
        onClose={() => { setPwModalOpen(false); setPendingAction(null); }}
        onConfirm={(pwd) => handleAdminConfirm(pwd)}
        identifierHint={storedUser ? `Action will be performed as ${storedUser.username || storedUser.email}` : "Admin action"}
      />

      {/* Edit modal */}
      {editModalOpen && editCourse && (
        <EditCourseModal open={editModalOpen} course={editCourse} onClose={handleEditModalClose} />
      )}

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Courses;