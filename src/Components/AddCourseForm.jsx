import React, { useState, useRef } from "react";
import Navbar from "./Navbar";
import SpotlightCard from "./ReactBits/SpotlightCard";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCourseForm = () => {
  const [formData, setFormData] = useState({
    courseImage: null,
    courseName: "",
    courseFee: "",
    courseCategory: "",
  });

  const fileInputRef = useRef(null); // 👈 ref for file input

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "courseImage") setFormData({ ...formData, courseImage: files?.[0] || null });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courseName?.trim()) {
      return toast.error("Course name is required");
    }

    const fd = new FormData();
    fd.append("courseName", formData.courseName.trim());
    if (formData.courseFee) fd.append("courseFee", String(formData.courseFee));
    if (formData.courseCategory) fd.append("courseCategory", formData.courseCategory);
    if (formData.courseImage) fd.append("courseImage", formData.courseImage); // <-- must be 'courseImage'

    try {
      const res = await fetch("https://biyoans-backend.onrender.com/api/courses", {
        method: "POST",
        body: fd, // no headers; browser sets correct multipart boundary
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      toast.success("Course added successfully");

      // reset form
      setFormData({ courseImage: null, courseName: "", courseFee: "", courseCategory: "" });
      // clear <input type="file">
      const fileInput = document.querySelector('input[name="courseImage"]');
      if (fileInput) fileInput.value = "";

      // optional: tell HomePage to reload courses (if AddCourseForm is on Home)
      if (typeof window.fetchCourses === "function") window.fetchCourses();

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add course");
    }
  };

  return (
    <div className="bg-[#0A0E2B] homepage-scroll fixed inset-0 overflow-x-hidden overflow-y-auto w-screen min-h-screen m-0 p-0">
      <Navbar />
      <div className="px-4 sm:px-10 md:px-20 my-24">
        <SpotlightCard
          className="custom-spotlight-card spotCard text-white p-10 rounded-2xl w-full max-w-3xl mx-auto"
          spotlightColor="rgba(116, 234, 247, 0.300)"
        >
          <h2 className="text-3xl font-semibold text-center mb-8">
            Add New Course
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Course Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Upload Course Image</label>
              <input
                type="file"
                name="courseImage"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef} // 👈 attach ref
                className="bg-[#11163D] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
              />
            </div>

            {/* Course Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Course Name</label>
              <input
                type="text"
                name="courseName"
                placeholder="Enter course name"
                value={formData.courseName}
                onChange={handleChange}
                className="bg-[#11163D] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
              />
            </div>

            {/* Course Fee */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Course Fee (INR)</label>
              <input
                type="number"
                name="courseFee"
                placeholder="Enter fee"
                value={formData.courseFee}
                onChange={handleChange}
                className="bg-[#11163D] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
              />
            </div>

            {/* Course Category Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Category</label>
              <select
                name="courseCategory"
                value={formData.courseCategory}
                onChange={handleChange}
                className="bg-[#11163D] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="AI">AI</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Web Dev">Web Dev</option>
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="Foundation">Foundation</option>
                <option value="Non-IT">Non-IT</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white py-2 px-6 rounded-lg text-lg transition-all"
            >
              Add Course
            </button>
          </form>
        </SpotlightCard>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default AddCourseForm;