// PasswordResetModal.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function PasswordResetModal({ isOpen, onClose, onInitiated }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  // Candidate endpoints to try (ordered). Add/remove as needed.
  const CANDIDATE_URLS = [
    "https://biyoans-backend.onrender.com/api/auth/password/send-otp",
    "https://biyoans-backend.onrender.com/api/auth/password/initiate",
    "https://biyoans-backend.onrender.com/api/auth/signup/send-otp",
    "https://biyoans-backend.onrender.com/api/auth/signup/initiate",
    "https://biyoans-backend.onrender.com/api/superusers/send-otp",
    "https://biyoans-backend.onrender.com/api/superusers/send-otp", // duplicate intentionally safe
  ];

  const submit = async () => {
    if (!email || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);

    let lastError = null;
    for (const url of CANDIDATE_URLS) {
      try {
        console.debug("Trying OTP URL:", url);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const text = await res.text().catch(() => "");
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }

        // 404 -> try next url
        if (res.status === 404) {
          console.warn(`404 from ${url}, trying next candidate. body:`, text);
          lastError = `404 from ${url}`;
          continue;
        }

        // If server returned non-ok, surface message and stop (usually it's that endpoint but validation failed)
        if (!res.ok) {
          const message = data?.message || text || `HTTP ${res.status} from ${url}`;
          console.error(`Non-ok response from ${url}:`, message);
          lastError = message;
          // If it's 4xx other than 404, it's likely the correct endpoint but invalid input — stop trying.
          if (res.status >= 400 && res.status < 500) {
            throw new Error(message);
          }
          // If it's 5xx try next url
          continue;
        }

        // success
        console.info("OTP send success from", url, data);
        toast.success(data.message || "OTP sent to your email");
        // pass debug_code if present for dev convenience
        if (onInitiated) onInitiated(email, data?.debug_code ?? null);
        setLoading(false);
        onClose?.();
        return;
      } catch (err) {
        console.error("Error trying OTP URL", url, err);
        lastError = (err && err.message) || String(err);
        // continue to next candidate
        continue;
      }
    }

    // none worked
    toast.error(`Failed to send OTP: ${lastError || "No endpoint responded"}`);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-2">Forgot Password</h3>
        <p className="text-sm mb-4">Enter your registered email. We'll send an OTP to reset your password.</p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
          placeholder="Email"
          type="email"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
          <button
            onClick={submit}
            className="px-3 py-2 bg-purple-700 text-white rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}