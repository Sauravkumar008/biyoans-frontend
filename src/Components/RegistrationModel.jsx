import { GoPerson } from "react-icons/go";
import OTPModel from "./OTPModel";
import Security from '../Images/Security.gif';
import { TbArrowBadgeDownFilled } from "react-icons/tb";
import { IoPersonOutline, IoLogoWhatsapp } from "react-icons/io5";
import { SlUserFemale } from "react-icons/sl";
import { PiIdentificationCard } from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { LiaCalendarDaySolid } from "react-icons/lia";
import '../CSS/RegistrationModel.css';
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const RegistrationModel = ({ isRegOpen, onClose, setIsRegOpen, setIsLoginOpen }) => {
  const [formData, setFormData] = useState({ 
    userName: "", gender: "", fatherName: "", motherName: "", 
    aadharNumber: "", dob: "", email: "", whatsAppNumber: "", 
    userPass: "", qualification: "" 
  });

  const [pendingUser, setPendingUser] = useState(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Focus states
  const [focusStates, setFocusStates] = useState({});
  const setFocus = (name, val) => setFocusStates(prev => ({ ...prev, [name]: val }));

  const [seePassword, setSeePassword] = useState(false);
  const dobInputRef = useRef(null);

  if (!isRegOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (formData.userName.trim() === '') { toast.error('Name cannot be empty'); return; }
    if (formData.qualification.trim() === '') { toast.error('Qualification cannot be empty'); return; }
    if (formData.fatherName.trim() === '') { toast.error("Father's Name cannot be empty"); return; }
    if (formData.email.trim() === '' || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))) {
      toast.error('Please enter a valid email address'); return;
    }
    if (formData.whatsAppNumber.length !== 10) { toast.error('WhatsApp Number must be 10 digits'); return; }
    if (formData.userPass.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (!formData.gender) { toast.error('Please select gender'); return; }

    try {
      toast.info("Sending OTP...");
      const res = await fetch("https://biyoans-backend.onrender.com/api/superusers/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not send OTP");

      setPendingUser({ ...formData, role: "STUDENT" });
      setOtpEmail(formData.email);
      setIsOtpOpen(true);
      toast.success("OTP sent to your email!");

    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.message);
    }
  };

  async function createUserAfterOtp() {
    if (!pendingUser) {
      toast.error("Signup session expired. Try again.");
      return;
    }
    setIsCreating(true);
    const id = toast.loading("Creating your account...");

    try {
      const fd = new FormData();
      fd.append("userName", pendingUser.userName);
      fd.append("qualification", pendingUser.qualification);
      fd.append("fatherName", pendingUser.fatherName);
      if (pendingUser.motherName) fd.append("motherName", pendingUser.motherName);
      if (pendingUser.aadharNumber) fd.append("aadharNumber", pendingUser.aadharNumber);
      if (pendingUser.dob) fd.append("dob", pendingUser.dob);
      fd.append("email", pendingUser.email.trim().toLowerCase());
      fd.append("whatsAppNumber", pendingUser.whatsAppNumber);
      fd.append("userPass", pendingUser.userPass);
      fd.append("gender", pendingUser.gender);

      const res = await fetch("https://biyoans-backend.onrender.com/api/superusers/create-student", {
        method: "POST",
        body: fd
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Registration failed");

      toast.update(id, { render: "Registration Successful!", type: "success", isLoading: false, autoClose: 3000 });
      
      setPendingUser(null);
      setIsOtpOpen(false);
      setIsRegOpen(false);
      setIsLoginOpen(true);
    } catch (err) {
      toast.update(id, { render: err.message, type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 h-screen w-screen flex flex-col items-center justify-center z-50 bg-gray-950/50 backdrop-blur-sm">
      <div className="h-fit w-[500px] lg:min-w-[900px] scale-[0.6] sm:scale-90 md:scale-100">
        <div className='h-10 w-full flex flex-row justify-end items-end mb-1'>
          <button className='h-7 w-7 border rounded-full bg-gray-500/25 backdrop-blur-sm text-white/50 cursor-pointer text-[12px]' onClick={onClose} >✖</button>
        </div>
        <div className="h-fit w-full border rounded-3xl lg:rounded-none flex items-center justify-center bg-gray-500/25 backdrop-blur-sm border-white/25 overflow-hidden">
          <div className="h-full w-full lg:w-[60%] p-4">
            <form onSubmit={handleSubmit} autoComplete="off">
              <h1 className="text-4xl Surgena text-center text-gray-300 mt-4">Register Now</h1>
              
              {/* Row 1: Name & Qualification */}
              <div className="flex flex-col sm:flex-row gap-5 mt-8">
                <div className={`relative h-10 w-full border-b ${focusStates.userName ? 'border-cyan-500' : 'border-white/25'} flex items-center`}>
                  <input name="userName" className="peer w-full bg-transparent outline-none text-white px-2 placeholder-transparent" placeholder="Name" required value={formData.userName} onChange={handleChange} onFocus={() => setFocus('userName', true)} onBlur={() => setFocus('userName', false)} />
                  <GoPerson className="text-gray-400" />
                  <label className="absolute left-2 -top-5 text-sm text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all">Name *</label>
                </div>

                <div className={`relative h-10 w-full border-b ${focusStates.qual ? 'border-cyan-500' : 'border-white/25'} flex items-center`}>
                  <select name="qualification" className="w-full bg-transparent text-white outline-none cursor-pointer" required value={formData.qualification} onChange={handleChange} onFocus={() => setFocus('qual', true)} onBlur={() => setFocus('qual', false)}>
                    <option value="" disabled className="text-black">Select Qualification</option>
                    <option value="Matriculation" className="text-black">Matriculation</option>
                    <option value="Intermediate" className="text-black">Intermediate</option>
                    <option value="Bachelor Degree" className="text-black">Bachelor Degree</option>
                    <option value="Post Graduation" className="text-black">Post Graduation</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Father & Mother */}
              <div className="flex flex-col sm:flex-row gap-5 mt-8">
                <div className="relative h-10 w-full border-b border-white/25 flex items-center">
                  <input name="fatherName" className="w-full bg-transparent outline-none text-white px-2" placeholder="Father's Name *" required value={formData.fatherName} onChange={handleChange} />
                </div>
                <div className="relative h-10 w-full border-b border-white/25 flex items-center">
                  <input name="motherName" className="w-full bg-transparent outline-none text-white px-2" placeholder="Mother's Name" value={formData.motherName} onChange={handleChange} />
                </div>
              </div>

              {/* Row 3: Aadhar & DOB */}
              <div className="flex flex-col sm:flex-row gap-5 mt-8">
                <div className="relative h-10 w-full border-b border-white/25 flex items-center">
                  <input name="aadharNumber" type="number" className="w-full bg-transparent outline-none text-white px-2" placeholder="Aadhar Number" value={formData.aadharNumber} onChange={handleChange} />
                </div>
                <div className="relative h-10 w-full border-b border-white/25 flex items-center">
                  <input name="dob" type="date" className="w-full bg-transparent outline-none text-white px-2 invert" required value={formData.dob} onChange={handleChange} />
                </div>
              </div>

              {/* Row 4: Email & WhatsApp */}
              <div className="flex flex-col sm:flex-row gap-5 mt-8">
                <div className="relative h-10 w-full border-b border-white/25 flex items-center">
                  <input name="email" type="email" className="w-full bg-transparent outline-none text-white px-2" placeholder="Email *" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="relative h-10 w-full border-b border-white/25 flex items-center">
                  <input name="whatsAppNumber" type="number" className="w-full bg-transparent outline-none text-white px-2" placeholder="WhatsApp Number *" required value={formData.whatsAppNumber} onChange={handleChange} />
                </div>
              </div>

              {/* Row 5: Password & Gender */}
              <div className="flex flex-col sm:flex-row gap-5 mt-8">
                <div className="relative h-10 w-full border-b border-white/25 flex items-center">
                  <input name="userPass" type={seePassword ? "text" : "password"} className="w-full bg-transparent outline-none text-white px-2" placeholder="Set Password *" required value={formData.userPass} onChange={handleChange} />
                  <button type="button" onClick={() => setSeePassword(!seePassword)} className="text-gray-400">
                    {seePassword ? <VscEyeClosed /> : <VscEye />}
                  </button>
                </div>
                <div className="flex items-center gap-4 text-gray-400 ml-2">
                  <label><input type="radio" name="gender" value="Male" onChange={handleChange} /> M</label>
                  <label><input type="radio" name="gender" value="Female" onChange={handleChange} /> F</label>
                  <label><input type="radio" name="gender" value="Others" onChange={handleChange} /> O</label>
                </div>
              </div>

              <div className="mt-10 mb-6 flex justify-center">
                <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-12 rounded-full transition-transform hover:scale-105">
                  SIGN UP
                </button>
              </div>
            </form>
          </div>

          <div className="lg:block hidden h-full w-[40%] relative">
            <img className="h-[550px] object-cover" src={Security} alt="Security" />
          </div>
        </div>
      </div>

      <OTPModel 
        isOpen={isOtpOpen} 
        email={otpEmail} 
        mode="signup" 
        onClose={(success) => {
          if (success) createUserAfterOtp();
          else setIsOtpOpen(false);
        }} 
      />
    </div>
  )
}

export default RegistrationModel;