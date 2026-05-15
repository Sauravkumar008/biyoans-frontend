// src/Components/OTPModel.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  }, [isOpen]);

  if (!isOpen) return null;

  // ✅ Yahan humne rasta badal kar Render wala kar diya hai
  const sendOtpUrl = mode === "signup" ? "/api/superusers/send-otp" : "/api/auth/password/resend";
  const verifyOtpUrl = mode === "signup" ? "/api/superusers/verify-otp" : "/api/auth/password/verify";

  // 🔥 Fix: Localhost hata kar Render ka absolute URL setup kiya
  const toUrl = (path) => `https://biyoans-backend.onrender.com${path}`;

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
        body: JSON.stringify({ email, code: otp.trim() }) // Backend "code" expect kar raha hai
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `OTP verification failed (HTTP ${res.status})`);
      }

      toast.success(data.message || "OTP verified");
      // parent (RegistrationModel) ko success signal do taaki user create ho jaye
      onClose?.(true); 
    } catch (e) {
      console.error("OTP verify error:", e);
      toast.error(e.message || "Failed to verify OTP");
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
    } catch (e) {
      console.error("Resend failed:", e);
      toast.error(e.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          {mode === "signup" ? "Verify your email" : "Reset password"}
        </h2>
        <p className="text-sm mb-4 text-gray-600">
          We sent a 6-digit OTP to <b>{email}</b>.
        </p>

        <input
          className="w-full border-2 border-purple-100 focus:border-purple-500 outline-none px-3 py-3 rounded-lg mb-3 text-center text-2xl tracking-widest font-bold"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          maxLength={6}
          inputMode="numeric"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => { onClose?.(false); }}
            disabled={loading || resendLoading}
            className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={resend}
            disabled={resendLoading || loading}
            className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            {resendLoading ? "Sending..." : "Resend"}
          </button>

          <button
            onClick={verify}
            disabled={loading || resendLoading}
            className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-semibold transition"
          >
            {loading ? "Please wait..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}