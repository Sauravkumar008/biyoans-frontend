// src/Components/Profile.jsx
import React, { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Small helper to read stored user
function getStoredUser() {
    const raw = localStorage.getItem("biyoans_user") || sessionStorage.getItem("biyoans_user");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

export default function Profile() {
    // read stored user once (keeps previous behavior)
    const storedUser = useMemo(() => {
        const raw = localStorage.getItem("biyoans_user") || sessionStorage.getItem("biyoans_user");
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
    }, []);

    // robust identifier: try all possible fields student/superuser might have
    // reliable identifier for backend:
    // - STUDENT: backend expects email
    // - SUPERUSER: backend supports findByUsernameOrEmail so prefer username then email
    const identifier = (() => {
        const t = (storedUser?.type || "").toString().toUpperCase();
        if (t === "STUDENT") return storedUser?.email || "";
        return storedUser?.username || storedUser?.email || storedUser?.userName || "";
    })();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null); // payload returned from GET /api/profile
    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        currentPassword: "",
        newPassword: "",
        fatherName: "",
        motherName: "",
        dob: "" // ISO date string yyyy-mm-dd
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [enrollments, setEnrollments] = useState(null); // student courses



    useEffect(() => {
        if (!identifier) return;
        fetchProfile();
        // eslint-disable-next-line
    }, [identifier]);

    async function fetchProfile() {
        setLoading(true);
        try {
            // Use the storedUser created by useMemo at the top of the component
            const stored = storedUser || JSON.parse(localStorage.getItem('biyoans_user') || sessionStorage.getItem('biyoans_user') || 'null');
            if (!stored) {
                setProfile(null);
                return;
            }

            // build candidate identifiers (email, username, userName, id)
            const candidates = [
                stored.email,
                stored.username,
                stored.userName,
                stored.id && String(stored.id)
            ].filter(Boolean);

            if (candidates.length === 0) {
                throw new Error('No identifier available for current user');
            }

            let data = null;
            let lastError = null;

            // try each candidate until one succeeds
            for (const ident of candidates) {
                try {
                    const url = `https://biyoans-backend.onrender.com/api/profile?identifier=${encodeURIComponent(ident)}`;
                    const res = await fetch(url);
                    if (!res.ok) {
                        lastError = { status: res.status, body: await res.text().catch(() => null) };
                        continue; // try next identifier
                    }
                    data = await res.json();
                    break; // success
                } catch (err) {
                    lastError = err;
                    continue;
                }
            }

            if (!data) {
                console.error('Profile fetch failed for all identifiers:', lastError);
                throw new Error('Profile not found (tried email/username/userName/id)');
            }

            // set profile and initial form values safely
            setProfile(data);
            setForm((f) => ({
                ...f,
                name: data.userName || data.name || f.name,
                email: data.email || f.email,
                phoneNumber: data.whatsAppNumber || data.phoneNumber || f.phoneNumber,
                fatherName: data.fatherName || data.father || f.fatherName || '',
                motherName: data.motherName || data.mother || f.motherName || '',
                dob: data.dob || data.dateOfBirth || f.dob || ''
            }));

            // if stored user type indicates student, fetch enrollments (optional endpoint)
            const isStudent = ((stored?.type ?? '').toString().toUpperCase() === 'STUDENT')
                || ((data?.type ?? '').toString().toUpperCase() === 'STUDENT');
            if (isStudent && data.id) {
                fetchEnrollments(data.id);
            }
        } catch (e) {
            console.error('Failed to load profile', e);
            toast.error(e.message || 'Failed to load profile');
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }

    async function fetchEnrollments(studentId) {
        try {
            // try a conventional endpoint; if your backend uses another path, update it
            const res = await fetch(`https://biyoans-backend.onrender.com/api/enrollments?studentId=${encodeURIComponent(studentId)}`);
            if (!res.ok) return setEnrollments([]); // silently ignore if endpoint absent
            const data = await res.json();
            setEnrollments(Array.isArray(data) ? data : []);
        } catch (e) {
            console.warn("Enrollments fetch failed (this is optional):", e);
            setEnrollments([]);
        }
    }


    const handleProfileUpdate = async ({ name, phone, photoFile }) => {
        try {
            const stored = JSON.parse(localStorage.getItem('biyoans_user') || sessionStorage.getItem('biyoans_user') || 'null');
            // replace existing identifier selection line with:
            const identifierForUpdate = identifier; // use the same identifier from top-level variable
            if (!identifier) throw new Error('User not identified');

            const fd = new FormData();
            fd.append("identifier", identifier);
            fd.append("currentPassword", form.currentPassword);
            if (form.name) fd.append("name", form.name);
            if (form.email) fd.append("email", form.email);
            if (form.phoneNumber) fd.append("phoneNumber", form.phoneNumber);
            if (form.newPassword) fd.append("newPassword", form.newPassword);

            const isStudent = ((storedUser?.type ?? "").toString().toUpperCase() === "STUDENT")
                || ((profile?.type ?? "").toString().toUpperCase() === "STUDENT");

            if (isStudent) {
                if (form.fatherName) fd.append("fatherName", form.fatherName);
                if (form.motherName) fd.append("motherName", form.motherName);
                if (form.dob) fd.append("dob", form.dob);
            }

            if (photoFile) fd.append("photo", photoFile);
            const res = await fetch('https://biyoans-backend.onrender.com/api/profile/update', {
                method: 'POST',
                body: fd // DO NOT set Content-Type header — the browser will set boundary
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

            // success
            toast.success('Profile updated');

            // update stored user (name/photo) — keep token/session if any
            const updatedUser = { ...stored };
            if (data.user) {
                // when backend returns full SuperUser or Student object:
                updatedUser.username = data.user.username || updatedUser.username;
                updatedUser.userName = data.user.name || data.user.userName || updatedUser.userName;
                updatedUser.email = data.user.email || updatedUser.email;
                updatedUser.photoUrl = data.user.photoUrl || updatedUser.photoUrl;
                updatedUser.role = data.user.role || updatedUser.role;
            } else if (data.student) {
                updatedUser.userName = data.student.userName || updatedUser.userName;
                updatedUser.photoUrl = data.student.photoUrl || updatedUser.photoUrl;
            }

            // write back to storage where it came from
            if (localStorage.getItem('biyoans_user')) localStorage.setItem('biyoans_user', JSON.stringify(updatedUser));
            else sessionStorage.setItem('biyoans_user', JSON.stringify(updatedUser));

            // refresh displayed profile
            setProfile(prev => ({ ...prev, ...data.user, ...data.student }));
        } catch (err) {
            console.error('Update error', err);
            toast.error(err.message || 'Update failed');
        }
    };


    function handleFileChange(e) {
        const f = e.target.files?.[0] ?? null;
        setPhotoFile(f);
        if (f) {
            const url = URL.createObjectURL(f);
            setPhotoPreview(url);
        } else {
            setPhotoPreview(null);
        }
    }


    const logout = async () => {
        try {
            await fetch('https://biyoans-backend.onrender.com/api/profile/logout', { method: 'POST' });
        } catch (e) { /* ignore */ }
        localStorage.removeItem('biyoans_user');
        sessionStorage.removeItem('biyoans_user');
        window.location.href = '/'; // or route to login
    };

    // compute avatar src (place this above the JSX return)
    const rawAvatar = photoPreview || profile?.photoUrl || storedUser?.photoUrl || "";

    const BACKEND_BASE = "https://biyoans-backend.onrender.com";

    const resolvedAvatar = (() => {
        if (!rawAvatar) return ""; // nothing to render
        if (rawAvatar.startsWith("blob:") || rawAvatar.startsWith("data:")) return rawAvatar;
        if (rawAvatar.startsWith("/")) {
            return `${BACKEND_BASE}${rawAvatar}`;
        }
        return rawAvatar;
    })();

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!identifier) return toast.error("No logged-in user found.");
        if (!form.currentPassword) return toast.error("Please enter your current password to confirm changes.");

        try {
            setLoading(true);

            // build form data matching backend expectations
            const fd = new FormData();
            fd.append("identifier", identifier);            // backend expects identifier
            fd.append("currentPassword", form.currentPassword);

            if (form.name) fd.append("name", form.name);
            if (form.email) fd.append("email", form.email);
            // backend updateProfile expects "phone" param (not phoneNumber)
            if (form.phoneNumber) fd.append("phone", form.phoneNumber);

            // student-specific fields
            if (form.fatherName) fd.append("fatherName", form.fatherName);
            if (form.motherName) fd.append("motherName", form.motherName);
            if (form.dob) fd.append("dob", form.dob);

            if (photoFile) fd.append("photo", photoFile);

            // POST to the update endpoint (multipart)
            const res = await fetch("https://biyoans-backend.onrender.com/api/profile/update", {
                method: "POST",
                body: fd
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

            toast.success("Profile updated");

            // update local stored copy if backend returned updated user/student
            const stored = JSON.parse(localStorage.getItem('biyoans_user') || sessionStorage.getItem('biyoans_user') || 'null') || {};
            const updatedUser = { ...stored };

            if (data.user) {
                // superuser returned
                updatedUser.username = data.user.username || updatedUser.username;
                updatedUser.userName = data.user.name || data.user.userName || updatedUser.userName;
                updatedUser.email = data.user.email || updatedUser.email;
                updatedUser.photoUrl = data.user.photoUrl || updatedUser.photoUrl;
            } else if (data.student) {
                // student returned
                updatedUser.userName = data.student.userName || updatedUser.userName;
                updatedUser.email = data.student.email || updatedUser.email;
                updatedUser.photoUrl = data.student.photoUrl || updatedUser.photoUrl;
            }

            // persist back to same storage used previously
            if (localStorage.getItem("biyoans_user")) localStorage.setItem("biyoans_user", JSON.stringify(updatedUser));
            else sessionStorage.setItem("biyoans_user", JSON.stringify(updatedUser));

            // clear password fields and preview
            setForm(f => ({ ...f, currentPassword: "", newPassword: "" }));
            setPhotoFile(null);
            setPhotoPreview(null);

            // refresh profile from server
            await fetchProfile();

        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.message || "Update failed");
        } finally {
            setLoading(false);
        }
    }

    if (!storedUser) {
        return (
            <div>
                <Navbar />
                <div className="pt-24 px-6 text-white">
                    <h2>Please login to view profile.</h2>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#0A0E2B] flex flex-col min-h-screen overflow-hidden">
            <Navbar />
            <motion.div
                className="min-h-screen pt-24 pb-10 px-6 sm:px-10 md:px-20 bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#1E293B] text-white"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="max-w-4xl mx-auto">
                    <motion.h1
                        className="text-4xl font-bold mb-8 text-center text-cyan-400"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        My Profile
                    </motion.h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left: Avatar & Enrollments */}
                        <motion.div
                            className="bg-[#1E293B] p-6 rounded-2xl shadow-lg shadow-cyan-500/20"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="flex flex-col items-center">
                                <motion.div
                                    className="w-36 h-36 rounded-full overflow-hidden mb-4 bg-gray-800 flex items-center justify-center shadow-lg shadow-cyan-500/30"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    {resolvedAvatar ? (
                                        <img
                                            src={resolvedAvatar}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-500 text-sm">No Photo</span>
                                    )}
                                </motion.div>
                                <div className="text-center">
                                    <div className="font-semibold text-lg text-cyan-300">{profile?.userName || profile?.name || storedUser?.username || storedUser?.userName}</div>
                                    <div className="text-sm text-gray-400">{profile?.email || storedUser?.email}</div>
                                </div>
                            </div>

                            {/* Student Enrollments */}
                            {(storedUser?.type ?? "").toString().toUpperCase() === "STUDENT" && (
                                <div className="mt-6">
                                    <h3 className="font-semibold mb-2 text-cyan-400">Courses Enrolled</h3>
                                    {enrollments === null ? (
                                        <div className="text-sm text-gray-400">Loading...</div>
                                    ) : enrollments.length === 0 ? (
                                        <div className="text-sm text-gray-400">No enrollments found.</div>
                                    ) : (
                                        <ul className="space-y-2 text-sm">
                                            {enrollments.map((e) => (
                                                <motion.li
                                                    key={e.id ?? e.courseId ?? Math.random()}
                                                    className="bg-[#0F172A] p-3 rounded-lg shadow-md shadow-cyan-500/10"
                                                    whileHover={{ scale: 1.05, backgroundColor: "#1E293B" }}
                                                >
                                                    <div className="font-medium text-cyan-300">{e.courseName ?? e.title ?? "Course"}</div>
                                                    <div className="text-xs text-gray-400">Status: {e.status ?? "enrolled"}</div>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Right: Edit Form */}
                        <motion.div
                            className="md:col-span-2 bg-[#1E293B] p-6 rounded-2xl shadow-lg shadow-cyan-500/20"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <motion.div
                                    className="group"
                                    whileFocusWithin={{ scale: 1.02 }}
                                >
                                    <label className="block text-sm text-gray-400 group-hover:text-cyan-400">Full Name</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-3 rounded bg-[#0F172A] border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                                    />
                                </motion.div>

                                <motion.div
                                    className="group"
                                    whileFocusWithin={{ scale: 1.02 }}
                                >
                                    <label className="block text-sm text-gray-400 group-hover:text-cyan-400">Email</label>
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-3 rounded bg-[#0F172A] border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                                    />
                                </motion.div>

                                <motion.div
                                    className="group"
                                    whileFocusWithin={{ scale: 1.02 }}
                                >
                                    <label className="block text-sm text-gray-400 group-hover:text-cyan-400">Phone Number</label>
                                    <input
                                        name="phoneNumber"
                                        value={form.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-3 rounded bg-[#0F172A] border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                                    />
                                </motion.div>

                                {((storedUser?.type ?? "").toString().toUpperCase() === "STUDENT"
                                    || (profile?.type ?? "").toString().toUpperCase() === "STUDENT") && (
                                        <>
                                            <motion.div
                                                className="group"
                                                whileFocusWithin={{ scale: 1.02 }}
                                            >
                                                <label className="block text-sm text-gray-400 group-hover:text-cyan-400">Father's Name</label>
                                                <input
                                                    name="fatherName"
                                                    value={form.fatherName}
                                                    onChange={handleChange}
                                                    className="w-full mt-1 p-3 rounded bg-[#0F172A] border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                                                />
                                            </motion.div>

                                            <motion.div
                                                className="group"
                                                whileFocusWithin={{ scale: 1.02 }}
                                            >
                                                <label className="block text-sm text-gray-400 group-hover:text-cyan-400">Mother's Name</label>
                                                <input
                                                    name="motherName"
                                                    value={form.motherName}
                                                    onChange={handleChange}
                                                    className="w-full mt-1 p-3 rounded bg-[#0F172A] border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                                                />
                                            </motion.div>

                                            <motion.div
                                                className="group"
                                                whileFocusWithin={{ scale: 1.02 }}
                                            >
                                                <label className="block text-sm text-gray-400 group-hover:text-cyan-400">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={form.dob}
                                                    onChange={handleChange}
                                                    className="w-full mt-1 p-3 rounded bg-[#0F172A] border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                                                />
                                            </motion.div>
                                        </>
                                    )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.div
                                        className="group"
                                        whileFocusWithin={{ scale: 1.02 }}
                                    >
                                        <label className="block text-sm text-gray-400 group-hover:text-cyan-400">Current Password</label>
                                        <input
                                            name="currentPassword"
                                            type="password"
                                            value={form.currentPassword}
                                            onChange={handleChange}
                                            className="w-full mt-1 p-3 rounded bg-[#0F172A] border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </motion.div>

                                    <motion.div
                                        className="group"
                                        whileFocusWithin={{ scale: 1.02 }}
                                    >
                                        <label className="block text-sm text-gray-400 group-hover:text-cyan-400">New Password</label>
                                        <input
                                            name="newPassword"
                                            type="password"
                                            value={form.newPassword}
                                            onChange={handleChange}
                                            className="w-full mt-1 p-3 rounded bg-[#0F172A] border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </motion.div>
                                </div>

                                <motion.div
                                    className="group"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <label className="block text-sm text-gray-400 group-hover:text-cyan-400">Profile Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="mt-2 text-sm text-gray-400"
                                    />
                                </motion.div>

                                <div className="flex items-center gap-4">
                                    <motion.button
                                        type="button"
                                        onClick={logout}
                                        className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-white font-semibold shadow-md shadow-red-500/20"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        Logout
                                    </motion.button>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-white font-semibold shadow-md shadow-cyan-500/20"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    <motion.div
                        className="mt-8 text-sm text-gray-400 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <div>Note: To change email or phone, we check uniqueness. If your update fails, read the toast message.</div>
                    </motion.div>
                </div>
            </motion.div>
                <Footer />

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}