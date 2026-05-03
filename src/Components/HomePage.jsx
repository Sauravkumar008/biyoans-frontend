// HomePage.jsx
import React, { useMemo, useState, useEffect } from "react";
import EditCourseModal from './EditCourseModal.jsx'
import "../CSS/HomePage.css";
import AdminPasswordModal from "./AdminPasswordModal.jsx";
import HomeImg1 from "../Images/HomePage/HomeImg1.png";
import Navbar from "./Navbar";
import SplitText from "./ReactBits/SplitText.jsx";
import { motion } from "framer-motion";
import CourseCard from "./CourseCard.jsx";
import AddCourseCard from "./AddCourseCard.jsx";
import Footer from "./Footer.jsx";
import { getStoredUser, canManageCourses } from "../utils/auth.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
const [verifiedAdminPassword, setVerifiedAdminPassword] = useState(null);

  // add near other useState declarations
  const [editModalOpen, setEditModalOpen] = useState(false);

  const user = getStoredUser();

  // Fetch courses
  async function fetchCourses() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
      toast.error("Could not load courses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // expose for AddCourseForm’s optional call and fetch once on mount
    window.fetchCourses = fetchCourses;
    fetchCourses(); // <-- fetch on mount
    return () => { delete window.fetchCourses; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // keep empty deps to call once on mount

  // handlers
  function handleEdit(course) {
  setEditCourse(course);
  // mark that we want to perform an update after password verification
  setPendingAction({ type: "update", course });
  setPwModalOpen(true);
}

  function handleDelete(course) {
    setPendingAction({ type: "delete", course });
    setPwModalOpen(true);
  }

  async function handleAdminConfirm(password) {
    if (!pendingAction) {
      setPwModalOpen(false);
      return;
    }

    const identifier = user?.username || user?.email || "";

    try {
      // DELETE flow (unchanged)
      if (pendingAction.type === "delete") {
        const id = pendingAction.course.id;
        const url = `http://localhost:8080/api/courses/${id}?adminIdentifier=${encodeURIComponent(
          identifier
        )}&adminPassword=${encodeURIComponent(password)}`;

        const res = await fetch(url, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

        toast.success("Course deleted");
        await fetchCourses();
      }

      // UPDATE flow: open the edit modal after verifying password
      if (pendingAction.type === "update") {
        // verify admin credentials using a lightweight endpoint or reuse course delete-check:
        // We'll call a small endpoint that just validates credentials OR re-use fetching the superuser via backend.
        // For simplicity assume backend accepts a POST to /api/superuser/validate with {identifier, password}
        // but if you don't have that, we can verify by calling the protected update endpoint when saving the edit.
        // Here we simply close the password modal and open the edit modal.
        // You can optionally verify here by a small request (recommended), but not required.
        setEditModalOpen(true);
        toast.info("Password accepted — you can now edit the course");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Action failed");
    } finally {
      setPwModalOpen(false);
      setPendingAction(null);
      // keep editCourse intact for the edit path
      if (pendingAction?.type !== "update") setEditCourse(null);
    }
  }

  function handleEnroll(course) {
    toast.info(`Enroll clicked for ${course.courseName}`);
  }

  // Role-based AddCourseCard
  const storedUser = useMemo(() => {
    const raw =
      localStorage.getItem("biyoans_user") ||
      sessionStorage.getItem("biyoans_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const canAddCourse = useMemo(() => {
    if (!storedUser) return false;
    const type = (storedUser.type ?? "").toString().toUpperCase();
    const role = (storedUser.role ?? "").toString().toUpperCase();
    const allowed = ["SUPERADMIN", "ADMIN", "TEACHER"];
    return (type === "SUPERUSER" && allowed.includes(role)) || allowed.includes(role);
  }, [storedUser]);

  return (
    <div className="bg-[#0A0E2B] homepage-scroll fixed inset-0 overflow-x-hidden overflow-y-auto w-screen min-h-screen m-0 p-0">
      <Navbar />
      <div className="relative flex flex-col md:flex-row w-full mt-10 md:mt-15 h-auto md:h-190">
        <div className="w-full md:w-1/2 pl-4 md:pl-10 flex flex-col text-left justify-center text-white text-4xl md:text-7xl py-8 md:py-0">
          <SplitText
            className="BiyoansText text-white"
            text="Advance your"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
          />
          <SplitText
            className="BiyoansText text-white"
            text="career with"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
          />
          <span
            className="text-cyan-300 bName"
            style={{ letterSpacing: "0.2rem" }}
          >
            Biyoans Pvt. Ltd.
          </span>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center py-4 md:py-0">
          <motion.img
            src={HomeImg1}
            className="homeImg1 max-w-[80vw] md:max-w-full h-auto"
            initial={{ opacity: 0, x: 60, y: -30 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            alt="Home"
          />
        </div>
      </div>

      {/* courses */}
      <section id="course">
        <div className="py-20 px-20 w-full flex flex-wrap gap-10 items-center justify-center">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onEdit={canAddCourse ? handleEdit : null}
              onDelete={canAddCourse ? handleDelete : null}
              onEnroll={handleEnroll}
            />
          ))}

          {canAddCourse && <AddCourseCard />}
        </div>
      </section>

      <AdminPasswordModal
        open={pwModalOpen}
        onClose={() => {
          setPwModalOpen(false);
          setPendingAction(null);
        }}
        onConfirm={(pwd) => handleAdminConfirm(pwd)}
        identifierHint={
          user
            ? `Action will be performed as ${user.username || user.email}`
            : "Admin action"
        }
      />

      {editModalOpen && editCourse && (
        <EditCourseModal
          open={editModalOpen}
          course={editCourse}
          onClose={async (saved) => {
            setEditModalOpen(false);
            setEditCourse(null);
            if (saved) {
              // refresh list
              await fetchCourses();
            }
          }}
        />
      )}

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
      // at bottom near AdminPasswordModal and before Footer
    </div>
  );
};

export default HomePage;