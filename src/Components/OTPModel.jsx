// src/Components/OTPModel.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

/**
 * OTPModel
 *
 * Props:
 *  - isOpen: boolean
 *  - email: string (target email)
 *  - mode: "signup" | "reset" (default: "signup")
 *  - onClose: function
 *       - called as onClose(success:boolean, extra?) 
 *         - signup mode: onClose(true) means verification succeeded -> parent should create user
 *         - signup mode: onClose(false) means cancelled or failed
 *         - reset mode: you can adapt as needed
 */
export default function OTPModel({ isOpen, email = "", mode = "signup", onClose }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setOtp("");
      setLoading(false);
      setResendLoading(false);
    }
  }, [isOpen, email, mode]);

  if (!isOpen) return null;

  // resolve endpoints used by your backend
  // signup flow uses /api/superusers/send-otp and /api/superusers/verify-otp (based on your controller)
  const sendOtpUrl = mode === "signup" ? "/api/superusers/send-otp" : "/api/auth/password/resend";
  const verifyOtpUrl = mode === "signup" ? "/api/superusers/verify-otp" : "/api/auth/password/verify";

  // helper: build absolute URL for localhost:8080
  const toUrl = (path) => {
    // if running frontend on 5173 and backend on 8080
    const proto = window.location.protocol;
    const host = window.location.hostname;
    const backendPort = "8080";
    return `${proto}//${host}:${backendPort}${path}`;
  };

  async function verify() {
    if (!otp || otp.trim().length < 4) {
      toast.error("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(toUrl(verifyOtpUrl), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp.trim() })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `OTP verification failed (HTTP ${res.status})`);
      }

      toast.success(data.message || "OTP verified");
      // Let parent know verification succeeded. Parent will create user.
      onClose?.(true);
    } catch (e) {
      console.error("OTP verify error:", e);
      toast.error(e.message || "Failed to verify OTP");
      onClose?.(false);
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (!email) {
      toast.error("Email missing");
      return;
    }
    setResendLoading(true);
    try {
      const res = await fetch(toUrl(sendOtpUrl), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Resend failed (HTTP ${res.status})`);
      }
      toast.success(data.message || "OTP resent");
      // optionally display debug_code if backend returns it in dev
      if (data.debug_code) {
        console.info("OTP debug_code (dev):", data.debug_code);
      }
    } catch (e) {
      console.error("Resend failed:", e);
      toast.error(e.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-md">
        <h2 className="text-xl font-bold mb-2">
          {mode === "signup" ? "Verify your email" : "Enter the OTP to reset password"}
        </h2>
        <p className="text-sm mb-4">
          We sent a 6-digit OTP to <b>{email}</b>. Enter it below.
        </p>

        <input
          className="w-full border px-3 py-2 rounded mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          inputMode="numeric"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => { onClose?.(false); }}
            disabled={loading || resendLoading}
            className="px-3 py-2 border rounded text-sm"
          >
            Cancel
          </button>

          <button
            onClick={resend}
            disabled={resendLoading || loading}
            className="px-3 py-2 border rounded text-sm"
          >
            {resendLoading ? "Resending..." : "Resend"}
          </button>

          <button
            onClick={verify}
            disabled={loading || resendLoading}
            className="px-3 py-2 bg-purple-700 text-white rounded text-sm"
          >
            {loading ? "Please wait..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}