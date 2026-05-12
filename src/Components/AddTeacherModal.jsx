// src/Components/AddTeacherModal.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

/**
 * AddTeacherModal
 *
 * Props:
 *  - open: boolean
 *  - onClose(): void
 *  - onCreated(user): optional callback after successful creation
 *
 * Backend endpoints expected:
 *  - GET  /api/superusers/check-email?email=someone@example.com
 *  - GET  /api/superusers/check-username?username=alice
 *  - POST /api/superusers/send-otp    { email } (JSON)
 *  - POST /api/superusers/verify-otp  { email, code } (JSON)
 *  - POST /api/superusers             multipart/form-data (create teacher)
 *
 * If your backend endpoints differ, update the BACKEND_BASE and paths below.
 */

const BACKEND_BASE = "https://biyoans-backend.onrender.com"; // <<-- adjust if backend port/host differs

const defaultForm = {
  name: "",
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
  role: "TEACHER",
  gender: "Male"
};

export default function AddTeacherModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(defaultForm);
  const [photoFile, setPhotoFile] = useState(null);

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setPhotoFile(null);
      setCheckingEmail(false);
      setCheckingUsername(false);
      setEmailExists(false);
      setUsernameExists(false);
      setOtpSent(false);
      setOtpCode("");
      setOtpVerified(false);
      setSendingOtp(false);
      setVerifyingOtp(false);
      setSubmitting(false);
    }
  }, [open]);

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  // Check if email exists (non-blocking — backend may return 404 for not found)
  async function checkEmailExists(email) {
    if (!email) {
      setEmailExists(false);
      return;
    }
    setCheckingEmail(true);
    setEmailExists(false);
    try {
      const url = `${BACKEND_BASE}/api/superusers/check-email?email=${encodeURIComponent(email.trim())}`;
      const res = await fetch(url);
      if (res.status === 404) {
        setEmailExists(false);
      } else if (!res.ok) {
        console.warn("checkEmailExists unexpected status", res.status);
        setEmailExists(false);
      } else {
        const data = await res.json().catch(() => ({}));
        if (typeof data.exists === "boolean") setEmailExists(!!data.exists);
        else setEmailExists(false);
      }
    } catch (e) {
      console.warn("checkEmailExists network error", e);
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  }

  // Check if username exists
  async function checkUsernameExists(username) {
    if (!username) {
      setUsernameExists(false);
      return;
    }
    setCheckingUsername(true);
    setUsernameExists(false);
    try {
      const url = `${BACKEND_BASE}/api/superusers/check-username?username=${encodeURIComponent(username.trim())}`;
      const res = await fetch(url);
      if (res.status === 404) {
        setUsernameExists(false);
      } else if (!res.ok) {
        console.warn("checkUsernameExists unexpected status", res.status);
        setUsernameExists(false);
      } else {
        const data = await res.json().catch(() => ({}));
        if (typeof data.exists === "boolean") setUsernameExists(!!data.exists);
        else setUsernameExists(false);
      }
    } catch (e) {
      console.warn("checkUsernameExists network error", e);
      setUsernameExists(false);
    } finally {
      setCheckingUsername(false);
    }
  }

  // Send OTP
  async function handleSendOtp() {
    if (!form.email) return toast.error("Please enter email first");
    setSendingOtp(true);
    try {
      const url = `${BACKEND_BASE}/api/superusers/send-otp`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim().toLowerCase() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Send OTP failed (HTTP ${res.status})`);
      }
      setOtpSent(true);
      if (data.debug_code) {
        // toast.info(`OTP sent (dev code: ${data.debug_code})`);
        toast.success('OTP Sent to email')
      } else {
        toast.success("OTP sent to email");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  }

  // Verify OTP
  async function handleVerifyOtp() {
    if (!form.email) return toast.error("No email to verify");
    if (!otpCode) return toast.error("Enter the OTP code");
    setVerifyingOtp(true);
    try {
      const url = `${BACKEND_BASE}/api/superusers/verify-otp`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), code: otpCode.trim() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Verify OTP failed (HTTP ${res.status})`);
      setOtpVerified(true);
      toast.success(data.message || "Email verified");
    } catch (err) {
      console.error("Verify OTP error:", err);
      setOtpVerified(false);
      toast.error(err.message || "OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  }

  // Create teacher (multipart)
  async function handleCreate(e) {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.username || !form.email || !form.phoneNumber || !form.password) {
      return toast.error("Please fill name, username, email, phone and password");
    }
    if (emailExists || usernameExists) {
      return toast.error("Fix username/email before creating");
    }
    if (!otpVerified) {
      return toast.error("Please verify the email with OTP before creating");
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("username", form.username);
      fd.append("email", form.email.trim().toLowerCase());
      fd.append("phoneNumber", form.phoneNumber.trim());
      fd.append("password", form.password);
      fd.append("role", form.role || "TEACHER");
      fd.append("gender", form.gender || "Male");
      if (photoFile) fd.append("photo", photoFile);

      // Use absolute URL to backend
      const url = `${BACKEND_BASE}/api/superusers`;
      const res = await fetch(url, {
        method: "POST",
        body: fd // DO NOT set Content-Type header
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) {
          const msg = data.message || "Username/email/phone already exists";
          toast.error(msg);
        } else if (res.status === 403) {
          toast.error(data.message || "OTP not verified or forbidden");
        } else {
          toast.error(data.message || `Create failed (HTTP ${res.status})`);
        }
        return;
      }

      toast.success("Teacher created");
      if (onCreated) onCreated(data.user || data);

      // reset / close
      setForm(defaultForm);
      setPhotoFile(null);
      setOtpSent(false);
      setOtpVerified(false);
      onClose?.();
    } catch (err) {
      console.error("Create error:", err);
      toast.error(err.message || "Failed to create teacher");
    } finally {
      setSubmitting(false);
    }
  }

  // Render
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#0A0E2B] w-full max-w-xl rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Add Teacher</h2>

        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-300">Full name</label>
              <input
                value={form.name}
                onChange={e => setField("name", e.target.value)}
                className="w-full mt-1 p-2 rounded bg-[#0A0E2B] border border-gray-700"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Username</label>
              <input
                value={form.username}
                onChange={e => { setField("username", e.target.value); setUsernameExists(false); }}
                onBlur={e => checkUsernameExists(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-[#0A0E2B] border border-gray-700"
              />
              {checkingUsername ? <div className="text-xs text-gray-400 mt-1">Checking username...</div> : null}
              {usernameExists ? <div className="text-xs text-red-400 mt-1">Username already exists</div> : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                value={form.email}
                onChange={e => { setField("email", e.target.value); setEmailExists(false); setOtpSent(false); setOtpVerified(false); }}
                onBlur={e => checkEmailExists(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-[#0A0E2B] border border-gray-700"
              />
              {checkingEmail ? <div className="text-xs text-gray-400 mt-1">Checking email...</div> : null}
              {emailExists ? <div className="text-xs text-red-400 mt-1">Email already exists</div> : null}
            </div>

            <div>
              <label className="text-sm text-gray-300">Phone</label>
              <input
                value={form.phoneNumber}
                onChange={e => setField("phoneNumber", e.target.value)}
                className="w-full mt-1 p-2 rounded bg-[#0A0E2B] border border-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setField("password", e.target.value)}
                className="w-full mt-1 p-2 rounded bg-[#0A0E2B] border border-gray-700"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Gender</label>
              <select
                value={form.gender}
                onChange={e => setField("gender", e.target.value)}
                className="w-full mt-1 p-2 rounded bg-[#0A0E2B] border border-gray-700"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300">Profile photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
              className="mt-2 text-sm text-gray-300"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={!form.email || checkingEmail || emailExists || sendingOtp}
              className="px-3 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50"
            >
              {sendingOtp ? "Sending..." : (otpSent ? "Resend OTP" : "Send OTP")}
            </button>

            <input
              placeholder="Enter OTP"
              value={otpCode}
              onChange={e => setOtpCode(e.target.value)}
              className="mt-0 p-2 rounded bg-[#0A0E2B] border border-gray-700"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={!otpCode || verifyingOtp}
              className="px-3 py-2 rounded bg-green-600 hover:bg-green-500 disabled:opacity-50"
            >
              {verifyingOtp ? "Verifying..." : (otpVerified ? "Verified" : "Verify OTP")}
            </button>

            <div className="ml-auto text-sm">
              {otpVerified ? <span className="text-green-300">Email verified</span> : <span className="text-gray-400">Email not verified</span>}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => { onClose?.(); }} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Cancel</button>

            <button
              type="submit"
              disabled={submitting || !otpVerified || emailExists || usernameExists}
              className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}