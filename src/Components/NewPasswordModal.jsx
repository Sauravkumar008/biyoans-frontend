// src/Components/NewPasswordModal.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

/**
 * Props:
 *  - isOpen: boolean
 *  - email: string (required)
 *  - otp: string (optional)  // if provided, prefill OTP input
 *  - onClose: function(success:boolean)  // called when done
 */
export default function NewPasswordModal({ isOpen, email, otp: propOtp, onClose }) {
  const [otp, setOtp] = useState(propOtp || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // reset fields when closed
      setOtp(propOtp || "");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    } else {
      // when opened, keep prop OTP if given
      setOtp(propOtp || "");
    }
  }, [isOpen, propOtp]);

  if (!isOpen) return null;

  const validate = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email.");
      return false;
    }
    if (!otp || otp.trim().length < 4) {
      toast.error("Please enter the OTP (6 digits).");
      return false;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("https://biyoans-backend.onrender.com/api/auth/password/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp.trim(), newPassword })
      });

      const jsonText = await res.text();
      let data = {};
      try { data = jsonText ? JSON.parse(jsonText) : {}; } catch { data = {}; }

      if (!res.ok) {
        const msg = data.message || jsonText || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      toast.success(data.message || "Password updated. Please login.");
      onClose?.(true);
    } catch (err) {
      console.error("Password reset failed:", err);
      toast.error(err.message || "Failed to reset password.");
      onClose?.(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-md">
        <h2 className="text-xl font-bold mb-2">Reset Password</h2>
        <p className="text-sm mb-4">
          Reset password for <b>{email}</b>. Enter OTP and your new password.
        </p>

        <label className="text-sm block mb-1">OTP</label>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          inputMode="numeric"
          className="w-full border px-3 py-2 rounded mb-3"
        />

        <label className="text-sm block mb-1">New password</label>
        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          placeholder="At least 8 characters"
          className="w-full border px-3 py-2 rounded mb-3"
        />

        <label className="text-sm block mb-1">Confirm password</label>
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Repeat new password"
          className="w-full border px-3 py-2 rounded mb-3"
        />

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => onClose?.(false)}
            disabled={loading}
            className="px-3 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-2 bg-purple-700 text-white rounded"
          >
            {loading ? "Please wait..." : "Set new password"}
          </button>
        </div>
      </div>
    </div>
  );
}