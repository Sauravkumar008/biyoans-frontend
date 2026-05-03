// utils/auth.js
export function getStoredUser() {
  const raw = localStorage.getItem("biyoans_user") || sessionStorage.getItem("biyoans_user");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function canManageCourses() {
  const u = getStoredUser();
  if (!u) return false;
  // only SUPERUSER type and roles ADMIN or SUPERADMIN
  return u.type === "SUPERUSER" && ["ADMIN", "SUPERADMIN"].includes((u.role || "").toUpperCase());
}

// role check for gallery/course management

export function canManageContent() {
  const user = getStoredUser();
  if (!user) return false;
  const type = (user.type ?? "").toString().toUpperCase();
  const role = (user.role ?? "").toString().toUpperCase();
  const allowed = ["SUPERADMIN", "ADMIN", "TEACHER"];
  return (type === "SUPERUSER" && allowed.includes(role)) || allowed.includes(role);
}