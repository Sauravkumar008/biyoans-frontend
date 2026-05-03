  // src/pages/AdminDashboard.jsx
  import React, { useEffect, useMemo, useState } from "react";
  import { motion } from "framer-motion";
  import { ToastContainer, toast } from "react-toastify";
  import Navbar from "../Components/Navbar.jsx";
  import Footer from "./Footer.jsx";
  import AddTeacherModal from "./AddTeacherModal.jsx";
  import "react-toastify/dist/ReactToastify.css";

  // Helper - re-use your existing auth util or inline similar logic
  function getStoredUser() {
    const raw = localStorage.getItem("biyoans_user") || sessionStorage.getItem("biyoans_user");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  export default function AdminDashboard() {
    // backend base (change if your backend runs on different host/port)
    const BASE = "http://localhost:8080";

    const storedUser = useMemo(() => getStoredUser(), []);

    // UI state
    const [modalOpen, setModalOpen] = useState(false);
    const [active, setActive] = useState("manageTeachers"); // default panel: teachers
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]); // generic list for each panel
    const [query, setQuery] = useState("");

    // enforce admin-only (route-level protection recommended)
    const role = (storedUser?.role || "").toString().toUpperCase();
    const isAdmin = role === "ADMIN";

    // Fetch list whenever active changes
    useEffect(() => {
      if (!isAdmin) return;
      fetchActiveList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    async function fetchActiveList() {
      setLoading(true);
      try {
        let url = "";
        switch (active) {
          case "manageTeachers":
            url = `${BASE}/api/admin/teachers`; // adjust to /api/teachers if your backend has that route
            break;
          case "manageCourses":
            url = `${BASE}/api/admin/courses`;
            break;
          case "manageBatches":
            url = `${BASE}/api/admin/batches`;
            break;
          case "manageStudents":
            url = `${BASE}/api/admin/students`;
            break;
          case "searchStudents":
            url = `${BASE}/api/admin/students/search`;
            break;
          default:
            url = `${BASE}/api/courses`;
        }

        if (active === "searchStudents" && query.trim()) {
          url = `${BASE}/api/students/search?q=${encodeURIComponent(query.trim())}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : (data.items || []));
      } catch (e) {
        console.error("Failed to load list", e);
        toast.error("Failed to load list");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    // delete item (route mapping handled here)
    async function handleDelete(resource, id) {
      if (!confirm("Are you sure you want to delete this item?")) return;
      const adminIdentifier = storedUser?.username || storedUser?.email || "";
      const adminPassword = window.prompt("Enter admin password to confirm delete:");
      if (!adminPassword) return toast.info("Delete cancelled");

      try {
        const route = (resource === "teachers" || resource === "superusers") ? "superusers" : resource;
        const url = `${BASE}/api/${route}/${id}?adminIdentifier=${encodeURIComponent(adminIdentifier)}&adminPassword=${encodeURIComponent(adminPassword)}`;
        const res = await fetch(url, { method: "DELETE" });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.message || `HTTP ${res.status}`);
        toast.success("Deleted");
        fetchActiveList();
      } catch (e) {
        console.error("Delete failed", e);
        toast.error(e.message || "Delete failed");
      }
    }

    // quick edit (prompt-based). Replace with a full modal in production.
    async function handleEdit(resource, item) {
      const adminIdentifier = storedUser?.username || storedUser?.email || "";
      const adminPassword = window.prompt("Enter admin password to start editing:");
      if (!adminPassword) return toast.info("Edit cancelled");

      const newName = window.prompt(`Edit name/title for id=${item.id}`, item.courseName || item.userName || item.name || item.title || "");
      if (newName === null) return toast.info("Edit cancelled");

      try {
        const payload = { id: item.id };
        if (resource === "courses") payload.courseName = newName;
        else if (resource === "teachers" || resource === "students") payload.userName = newName;
        else if (resource === "batches") payload.batchName = newName;

        const route = (resource === "teachers" || resource === "superusers") ? "superusers" : resource;
        const res = await fetch(`${BASE}/api/${route}/${item.id}?adminIdentifier=${encodeURIComponent(adminIdentifier)}&adminPassword=${encodeURIComponent(adminPassword)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.message || `HTTP ${res.status}`);
        toast.success("Updated");
        fetchActiveList();
      } catch (e) {
        console.error("Update failed", e);
        toast.error(e.message || "Update failed");
      }
    }

    // render list table based on active panel
    function renderTable() {
      if (loading) return <div className="p-6">Loading...</div>;
      if (!items.length) return <div className="p-6 text-gray-300">No items found.</div>;

      if (active === "manageTeachers" || active === "manageStudents") {
        return (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-sm text-gray-400">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id} className="border-t border-white/5">
                  <td className="p-2 text-sm">{it.id}</td>
                  <td className="p-2 text-sm">{it.userName || it.name || it.username}</td>
                  <td className="p-2 text-sm">{it.email}</td>
                  <td className="p-2 text-sm">{it.role || '-'}</td>
                  <td className="p-2 text-sm flex gap-2">
                    <button onClick={() => handleEdit(active === "manageTeachers" ? "admin/teachers" : "students", it)} className="px-3 py-1 bg-yellow-500 rounded">Edit</button>
                    <button onClick={() => handleDelete(active === "manageTeachers" ? "admin/teachers" : "students", it.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      if (active === "manageCourses") {
        return (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-sm text-gray-400">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Fee</th>
                <th className="p-2">Category</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id} className="border-t border-white/5">
                  <td className="p-2 text-sm">{it.id}</td>
                  <td className="p-2 text-sm">{it.courseName}</td>
                  <td className="p-2 text-sm">{it.courseFee ?? '-'}</td>
                  <td className="p-2 text-sm">{it.courseCategory ?? '-'}</td>
                  <td className="p-2 text-sm flex gap-2">
                    <button onClick={() => handleEdit('courses', it)} className="px-3 py-1 bg-yellow-500 rounded">Edit</button>
                    <button onClick={() => handleDelete('courses', it.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      if (active === "manageBatches") {
        return (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-sm text-gray-400">
                <th className="p-2">ID</th>
                <th className="p-2">Batch Name</th>
                <th className="p-2">Timing</th>
                <th className="p-2">Mode</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id} className="border-t border-white/5">
                  <td className="p-2 text-sm">{it.id}</td>
                  <td className="p-2 text-sm">{it.batchName}</td>
                  <td className="p-2 text-sm">{it.timing ?? '-'}</td>
                  <td className="p-2 text-sm">{it.mode ?? '-'}</td>
                  <td className="p-2 text-sm flex gap-2">
                    <button onClick={() => handleEdit('batches', it)} className="px-3 py-1 bg-yellow-500 rounded">Edit</button>
                    <button onClick={() => handleDelete('batches', it.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      if (active === "searchStudents") {
        return (
          <div>
            <div className="mb-4">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or email" className="p-2 rounded bg-[#0A0E2B] border border-gray-700 w-80" />
              <button onClick={fetchActiveList} className="ml-2 px-3 py-1 bg-cyan-600 rounded">Search</button>
            </div>
            {renderTable()}
          </div>
        );
      }

      return <div className="p-6">Select a panel</div>;
    }

    if (!isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0E2B] text-white">
          <div className="p-10 bg-[#11163D] rounded-lg shadow">
            <h2 className="text-2xl font-semibold">Access denied</h2>
            <p className="text-sm text-gray-300">You must be an ADMIN to view this dashboard.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0A0E2B] text-white p-6">
        <Navbar />
        <div className="mt-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-[#11163D] p-4 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
            <nav className="flex flex-col gap-2">
              <button onClick={() => setActive('manageTeachers')} className={`text-left p-2 rounded ${active === 'manageTeachers' ? 'bg-cyan-600' : ''}`}>Manage teachers</button>
              <button onClick={() => setActive('manageCourses')} className={`text-left p-2 rounded ${active === 'manageCourses' ? 'bg-cyan-600' : ''}`}>Manage courses</button>
              <button onClick={() => setActive('manageBatches')} className={`text-left p-2 rounded ${active === 'manageBatches' ? 'bg-cyan-600' : ''}`}>Manage batches</button>
              <button onClick={() => setActive('manageStudents')} className={`text-left p-2 rounded ${active === 'manageStudents' ? 'bg-cyan-600' : ''}`}>Manage students</button>
              <button onClick={() => setActive('searchStudents')} className={`text-left p-2 rounded ${active === 'searchStudents' ? 'bg-cyan-600' : ''}`}>Search students</button>
              <button onClick={() => setModalOpen(true)} className="btn text-left p-2 rounded">Add Teacher</button>
            </nav>
          </div>

          <AddTeacherModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onCreated={(user) => {
              toast.success("Teacher added");
              setModalOpen(false);
              setActive("manageTeachers");
              fetchActiveList();
            }}
          />

          {/* Main panel */}
          <div className="md:col-span-3 bg-[#0A0E2B] p-6 rounded-2xl border border-white/5 shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold capitalize">{active.replace(/([A-Z])/g, ' $1')}</h3>
              <div className="flex items-center gap-2">
                <button onClick={fetchActiveList} className="px-3 py-1 rounded bg-white/5">Refresh</button>
                <button onClick={() => { setActive('manageCourses'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-3 py-1 rounded bg-cyan-600">Quick add</button>
              </div>
            </div>

            <div className="bg-[#0F1633] rounded p-2">
              {renderTable()}
            </div>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }