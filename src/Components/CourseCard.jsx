// CourseCard.jsx
import React from 'react';
import SpotlightCard from './ReactBits/SpotlightCard';
import '../CSS/CourseCard.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { MdOutlineDownload } from 'react-icons/md';

/**
 * Props:
 *  - course: { id, courseName, courseFee, courseImage, courseCategory, ... }
 *  - onEdit(course) optional
 *  - onDelete(course) optional
 *  - onEnroll(course) optional
 */
const CourseCard = ({ course, onEdit, onDelete, onEnroll }) => {
  if (!course) return null;

  const {
    id,
    courseName = 'Untitled Course',
    courseFee = 0,
    courseImage = null,
    courseCategory = '',
  } = course;

  // resolve image path: if server returns relative path like "/uploads/..." and you need
  // absolute URL, adjust here (e.g. prefix with backend origin)
 const imgSrc = (() => {
  const u = course.courseImageUrl || course.course_image_url || course.courseImage;

  if (!u) return '/default-course.jpg';

  // agar already full URL hai
  if (/^https?:\/\//i.test(u)) return u;

  // agar /images/... hai (frontend public folder)
  if (u.startsWith('/images')) return u;

  // agar backend uploads hai
  return `https://biyoans-backend.onrender.com${u.startsWith('/') ? '' : '/'}${u}`;
})();
  return (
    <div className="cursor-pointer">
      <SpotlightCard
        className="custom-spotlight-card flex flex-col spotCard gap-4 text-white h-120 w-90"
        spotlightColor="rgba(116, 234, 247, 0.300)"
      >
        <div className="imgCard h-60 w-full overflow-hidden rounded-t-lg">
          {/* Use object-cover so images don't stretch */}
          <img
            src={imgSrc}
            alt={courseName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              // fallback if image path is broken
              e.currentTarget.src = '/default-course.jpg';
            }}
          />
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="courseName text-left text-2xl md:text-3xl font-bold text-shadow-white">
              {courseName}
            </div>

            {/* small category badge */}
            {courseCategory && (
              <div className="text-xs px-3 py-1 bg-cyan-700/20 rounded-full text-white/90">
                {courseCategory}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="fee text-left font-semibold text-lg md:text-xl text-shadow-indigo-300">
              Rs. {courseFee} /-
            </div>

            <div className="flex items-center gap-3">
              {/* Enroll button (always shown) */}
              <button
                onClick={() => onEnroll?.(course)}
                className="enroll-btn px-5 py-2 rounded-full bg-cyan-600 text-white font-semibold shadow-lg transition-all duration-200 hover:bg-cyan-500 hover:scale-105 focus:outline-none"
              >
                Enroll
              </button>

              {/* Admin/teacher controls: show only if callbacks provided */}
              {onEdit && (
                <button
                  title="Edit course"
                  onClick={() => onEdit?.(course)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <FiEdit size={18} />
                </button>
              )}

              {onDelete && (
                <button
                  title="Delete course"
                  onClick={() => onDelete?.(course)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <FiTrash2 size={18} />
                </button>
              )}

              {/* optional: download image button */}
              {courseImage && (
                <a
                  href={imgSrc}
                  target="_blank"
                  rel="noreferrer"
                  title="Open image"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <MdOutlineDownload size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
  export default CourseCard