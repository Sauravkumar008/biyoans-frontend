import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { toast } from 'react-toastify';

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://biyoans-backend.onrender.com/api/courses");
      const data = await res.json();
      setCourses(data);
    } catch (e) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    try {
      const res = await fetch(`https://biyoans-backend.onrender.com/api/courses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted");
      setCourses(courses.filter(c => c.id !== id));
    } catch (e) {
      toast.error(e.message || "Delete failed");
    }
  };

  return (
    <div className='bg-[#0A0E2B] homepage-scroll fixed inset-0 overflow-x-hidden overflow-y-auto w-screen min-h-screen m-0 p-0'>
      <Navbar />
      <div className="p-8">
        <h2 className="text-white text-2xl mb-4">Courses List</h2>
        {loading ? <p className="text-gray-300">Loading...</p> : null}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(c => (
            <div key={c.id} className="bg-gray-800 p-4 rounded">
              {c.photoUrl ? <img src={c.photoUrl} alt={c.courseName} className="h-40 w-full object-cover rounded mb-3" /> : null}
              <h3 className="text-white font-semibold">{c.courseName}</h3>
              <p className="text-gray-300">Category: {c.courseCategory}</p>
              <p className="text-gray-300">Fee: ₹{c.courseFee}</p>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 bg-red-600 rounded" onClick={() => handleDelete(c.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}