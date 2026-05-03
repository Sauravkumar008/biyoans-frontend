import '../CSS/LoginModel.css';
import { useEffect, useState } from "react";
// import PixelCard from './PixelCard';
// import Orb from './Orb';
import Particles from './ReactBits/Particles.jsx';
import { GoPerson } from "react-icons/go";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordResetModal from './PasswordResetModal.jsx';
import NewPasswordModal from './NewPasswordModal.jsx';
import OTPModel from './OTPModel.jsx';
import { VscEye, VscEyeClosed } from "react-icons/vsc";


// at component start (after useState)



const LoginModel = ({ isLoginOpen, onClose, setIsRegOpen, setIsLoginOpen }) => {
    if (!isLoginOpen) return null;

    const [checked, setChecked] = useState(false);
    const [formData, setFormData] = useState({ userName: '', userPass: '' });
    const [seePassword, setSeePassword] = useState(false);
    const [focusUserName, setFocusUserName] = useState(false);
    const [focusUserPass, setFocusUserPass] = useState(false);

    const [isResetEmailOpen, setIsResetEmailOpen] = useState(false);
    const [isOtpOpenForReset, setIsOtpOpenForReset] = useState(false);
    const [isNewPassOpen, setIsNewPassOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetOtp, setResetOtp] = useState("");

    // const [loading, setLoading] = useState(false);



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        const saved = localStorage.getItem("biyoans_user") || sessionStorage.getItem("biyoans_user");
        if (saved) {
            try {
                const u = JSON.parse(saved);
                setFormData((prev) => ({ ...prev, userName: u.email || u.userName || "" }));
            } catch { }
        }
    }, []);

    const handleLoginSuccess = (user) => {
        // store user in memory/localStorage
        if (checked) {
            // remember me -> persist longer
            localStorage.setItem("biyoans_user", JSON.stringify(user));
        } else {
            // only session storage
            sessionStorage.setItem("biyoans_user", JSON.stringify(user));
        }

        toast.success("Login successful — welcome " + user.userName);
        onClose(); // close login modal
    };

    // replace your current handleSubmit with this
const handleSubmit = async (e) => {
  e.preventDefault();

  const identifier = formData.userName?.trim();
  const pwd = formData.userPass?.trim();

  if (!identifier) {
    toast.error("Username or Email cannot be empty");
    return;
  }
  if (!pwd || pwd.length < 8) {
    toast.error(pwd ? "Password must be at least 8 characters long" : "Password cannot be empty");
    return;
  }

  try {
    // debug info
    console.debug("Login attempt:", { identifier, userPass: pwd });

    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, userPass: pwd }),
    });

    // read raw text so we can show non-json errors too
    const raw = await res.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (parseErr) {
      // server returned HTML or other non-json content (likely a 500 stacktrace page)
      console.warn("Non-JSON login response:", raw);
      if (!res.ok) {
        // show the raw response trimmed (helpful in dev)
        const preview = raw.slice(0, 1000);
        toast.error(`Server error: ${res.status}. See console for details.`);
        console.error("Login failed, raw response:", raw);
        throw new Error(`Login failed (HTTP ${res.status})`);
      } else {
        // weird: OK but non-json — treat as failure
        throw new Error("Unexpected server response");
      }
    }

    if (!res.ok) {
      // server returned JSON error payload
      const msg = data.message || raw || `HTTP ${res.status}`;
      toast.error(msg);
      throw new Error(msg);
    }

    // Server returned success JSON — build stored user
    const user = {
      id: data.id ?? data.userId ?? null,
      type: (data.type ?? "").toString().toUpperCase() || null,
      role: data.role ?? data.userRole ?? null,
      username: data.username || data.userName || data.email || identifier,
      photoUrl: data.photoUrl || null,
      email: data.email || null,
      name: data.name || data.userName || null,
    };

    // store according to 'remember me'
    if (checked) localStorage.setItem("biyoans_user", JSON.stringify(user));
    else sessionStorage.setItem("biyoans_user", JSON.stringify(user));

    // single toast + debug log
    toast.success("Login successful — welcome " + (user.username || user.name || ""));
    console.debug("Login success, stored user:", user);

    // close modal and redirect (you were already navigating to /home)
    onClose?.();
    // small delay to allow toast to show (optional)
    setTimeout(() => {
      window.location.href = "/home";
    }, 250);

  } catch (err) {
    console.error("Login error:", err);
    // if err.message is JSON-like, show it; otherwise generic
    toast.error(err?.message || "Login failed, please try again.");
  }
};
    return (
        <div className='fixed inset-0 h-screen w-screen flex flex-col items-center justify-center bg-gray-950/50 z-50 backdrop-blur-sm'>
            <div className='h-fit w-fit scale-75 sm:scale-90 md:w-2/5 md:scale-75 lg:scale-90 xl:scale-100 md:min-w-[760px]'>
                <div className='h-10 w-full flex flex-row justify-end items-end mb-1'>
                    <button className='h-7 w-7 border rounded-full bg-gray-500/25 backdrop-blur-sm text-white/50 cursor-pointer text-[12px]' onClick={onClose} >✖</button>
                </div>
                <div className='h-fit w-full border border-white/25 flex flex-row rounded-3xl md:rounded-none'>
                    <div className="w-1/2 min-w-1/2 hidden md:block relative">
                        <Particles
                            particleColors={['#437EF4', '#437EF4']}
                            particleCount={1000}
                            particleSpread={4}
                            speed={0.1}
                            particleBaseSize={200}
                            moveParticlesOnHover={true}
                            alphaParticles={true}
                            disableRotation={false}
                        />
                        <div className="absolute inset-0 pointer-events-none h-full w-full flex flex-col items-center justify-center gap-10">
                            <div className="Surgena text-4xl font-bold">
                                <h2>Welcome Back!</h2>
                            </div>
                            <p className="font-serif text-center">To keep connected with us please login with your personal information.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 p-10 bg-gray-500/25 backdrop-blur-sm rounded-3xl md:rounded-none">
                        <form onSubmit={handleSubmit} autoComplete='off' className='h-full w-full flex flex-col items-center gap-6 text-gray-400'>
                            <div className="pt-3">
                                <h2 className="Surgena text-4xl font-bold text-gray-300 text-center">Login</h2>
                                <p className="font-serif">Sign in to your account</p>
                            </div>
                            <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusUserName ? 'border-cyan-700' : 'border-white/25'} mt-2`}>
                                <input
                                    className="peer focus:ring-0 focus:outline-0 h-full w-[90%] text-[20px] px-2 placeholder-transparent"
                                    placeholder=" "
                                    required
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusUserName(true)}
                                    onBlur={() => setFocusUserName(false)}
                                />
                                <GoPerson className="size-5 text-gray-300" />
                                {/* so this is my final year code for  a project  */}
                                <span
                                    className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none
                                            peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/25
                                            peer-focus:-top-5 peer-focus:left-1 peer-focus:text-sm peer-focus:text-gray-300
                                            peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:left-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-300
                                        "
                                >
                                    Username / Email <span className="text-red-600">*</span>
                                </span>
                            </div>
                            <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusUserPass ? 'border-cyan-700' : 'border-white/25'} mt-2`}>
                                <input
                                    className="peer focus:ring-0 focus:outline-0 h-full w-[90%] text-[20px] px-2 placeholder-transparent"
                                    placeholder=" "
                                    required
                                    type={`${seePassword ? 'text' : 'password'}`}
                                    name="userPass"
                                    value={formData.userPass}
                                    onChange={handleChange}
                                    onFocus={() => setFocusUserPass(true)}
                                    onBlur={() => setFocusUserPass(false)}
                                />
                                <button type="button" className='text-gray-300 focus:ring-0 focus:outline-0' onClick={() => setSeePassword(!seePassword)}>
                                    {seePassword ? (
                                        <VscEyeClosed className='size-5 cursor-pointer' />
                                    ) : (
                                        <VscEye className='size-5 cursor-pointer' />
                                    )}
                                </button>
                                <span
                                    className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none
                                            peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/25
                                            peer-focus:-top-5 peer-focus:left-1 peer-focus:text-sm peer-focus:text-gray-200
                                            peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:left-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-200
                                        "
                                >
                                    Password <span className="text-red-600">*</span>
                                </span>
                            </div>
                            <div className="w-full flex flex-row justify-between">
                                <label className="checkbox-container">
                                    <input
                                        checked={checked}
                                        type="checkbox"
                                        onChange={(e) => setChecked(e.target.checked)}
                                    />
                                    <span className="checkmark text-gray-300"></span>
                                    Remember me
                                </label>
                                <a href="#" onClick={(e) => { e.preventDefault(); setIsResetEmailOpen(true); }} className="font-semibold focus:ring-0 focus:outline-0 text-gray-300">Forget Password?</a>
                            </div>
                            <div className="h-10 w-full flex justify-center">
                                <button type="submit" className="signupBtn h-full w-fit px-10 bg-purple-700 hover:bg-purple-800 font-bold py-1 transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-1 focus:outline-purple-900 focus:ring-0">SIGN IN</button>
                            </div>
                            <div className="w-full flex flex-row justify-center gap-2">
                                <span>Don't have an account?</span>
                                <button type="button" onClick={() => { setIsLoginOpen(false); setIsRegOpen(true) }} className="font-semibold focus:ring-0 focus:outline-0 text-gray-300 cursor-pointer">Sign Up</button>
                            </div>

                            {/**/}
                        </form>
                    </div>
                </div>
                <div className='h-10 w-full'>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
            <PasswordResetModal
                isOpen={isResetEmailOpen}
                onClose={() => setIsResetEmailOpen(false)}
                onInitiated={(email) => {
                    setResetEmail(email);
                    setIsResetEmailOpen(false);
                    setIsOtpOpenForReset(true);
                }}
            />

            <OTPModel
                isOpen={isOtpOpenForReset}
                email={resetEmail}
                mode="reset"
                onClose={(success, otp) => {
                    setIsOtpOpenForReset(false);
                    if (success) {
                        setResetOtp(otp);
                        setIsNewPassOpen(true);
                    }
                }}
            />

            <NewPasswordModal
                isOpen={isNewPassOpen}
                email={resetEmail}
                otp={resetOtp}
                onClose={(passwordResetSuccess) => {
                    setIsNewPassOpen(false);
                    if (passwordResetSuccess) {
                        toast.success("Password reset successful. You may login now.");
                    }
                }}
            />

        </div>
    )
}

export default LoginModel