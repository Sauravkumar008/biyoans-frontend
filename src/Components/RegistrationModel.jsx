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
  if (!isRegOpen) return null;

  const [formData, setFormData] = useState({ userName: "", gender: "", fatherName: "", motherName: "", aadharNumber: "", dob: "", email: "", whatsAppNumber: "", userPass: "", qualification: "" });
  const [pendingUser, setPendingUser] = useState(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Focus States for UI
  const [focusFields, setFocusFields] = useState({});
  const setFocus = (field, status) => setFocusFields(prev => ({ ...prev, [field]: status }));

  const [seePassword, setSeePassword] = useState(false);
  const dobInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validations (Shortened for brevity)
    if (!formData.userName || !formData.email || !formData.userPass || !formData.gender) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const res = await fetch("https://biyoans-backend.onrender.com/api/superusers/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setPendingUser({ ...formData });
      setOtpEmail(formData.email);
      setIsOtpOpen(true);
      toast.success("OTP sent successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  async function createUserAfterOtp() {
    setIsCreating(true);
    const fd = new FormData();
    Object.keys(pendingUser).forEach(key => fd.append(key, pendingUser[key]));
    fd.append("role", "STUDENT");

    try {
      const res = await fetch("https://biyoans-backend.onrender.com/api/superusers/create-student", {
        method: "POST",
        body: fd
      });
      if (!res.ok) throw new Error("Registration failed");
      toast.success("Registration Successful!");
      setIsRegOpen(false);
      setIsLoginOpen(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 h-screen w-screen flex flex-col items-center justify-center z-50 bg-gray-950/50 backdrop-blur-sm">
      <div className="h-fit w-[500px] lg:min-w-[900px] scale-[0.6] sm:scale-90 md:scale-100">
        <div className='h-10 w-full flex flex-row justify-end items-end mb-1'>
          <button className='h-7 w-7 border rounded-full bg-gray-500/25 text-white cursor-pointer' onClick={onClose}>✖</button>
        </div>
        <div className="h-fit w-full border rounded-3xl lg:rounded-none flex items-center justify-center bg-gray-500/25 backdrop-blur-sm border-white/25">
          <div className="h-full w-full lg:w-[60%] px-4">
            <form onSubmit={handleSubmit} autoComplete="off">
              <h1 className="text-4xl Surgena text-center text-gray-300 mt-8">Register Now</h1>
              
              {/* Row 1 */}
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-2 px-2 mt-5 sm:mt-7">
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusFields.userName ? 'border-cyan-700' : 'border-white/25'}`}>
                  <input className="peer focus:ring-0 focus:outline-0 h-full w-[90%] text-[20px] px-2 placeholder-transparent bg-transparent text-white" placeholder=" " name="userName" value={formData.userName} onChange={handleChange} onFocus={() => setFocus('userName', true)} onBlur={() => setFocus('userName', false)} />
                  <GoPerson className="size-5 text-gray-300" />
                  <span className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none peer-focus:-top-5 peer-focus:text-sm peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:text-sm">Name *</span>
                </div>
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusFields.qual ? 'border-cyan-700' : 'border-white/25'}`}>
                  <select name="qualification" className="w-full bg-transparent text-white/50 outline-none cursor-pointer" required value={formData.qualification} onChange={handleChange}>
                    <option value="" disabled className="text-black">Qualification *</option>
                    <option value="Matriculation" className="text-black">Matriculation</option>
                    <option value="Intermediate" className="text-black">Intermediate</option>
                    <option value="Bachelor Degree" className="text-black">Bachelor Degree</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-2 px-2 mt-5 sm:mt-7">
                <div className="relative h-10 w-full border-b border-white/25 flex items-center bg-black/10">
                  <input name="fatherName" className="w-full bg-transparent outline-none text-white px-2" placeholder="Father's Name *" value={formData.fatherName} onChange={handleChange} />
                </div>
                <div className="relative h-10 w-full border-b border-white/25 flex items-center bg-black/10">
                  <input name="motherName" className="w-full bg-transparent outline-none text-white px-2" placeholder="Mother's Name" value={formData.motherName} onChange={handleChange} />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-2 px-2 mt-5 sm:mt-7">
                <div className="relative h-10 w-full border-b border-white/25 flex items-center bg-black/10">
                  <input name="aadharNumber" className="w-full bg-transparent outline-none text-white px-2" placeholder="Aadhar Number" value={formData.aadharNumber} onChange={handleChange} />
                </div>
                <div className="relative h-10 w-full border-b border-white/25 flex items-center bg-black/10">
                  <input name="dob" type="date" className="w-full bg-transparent outline-none text-white px-2 invert" value={formData.dob} onChange={handleChange} />
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-2 px-2 mt-5 sm:mt-7">
                <div className="relative h-10 w-full border-b border-white/25 flex items-center bg-black/10">
                  <input name="email" className="w-full bg-transparent outline-none text-white px-2" placeholder="Email *" value={formData.email} onChange={handleChange} />
                </div>
                <div className="relative h-10 w-full border-b border-white/25 flex items-center bg-black/10">
                  <input name="whatsAppNumber" className="w-full bg-transparent outline-none text-white px-2" placeholder="WhatsApp *" value={formData.whatsAppNumber} onChange={handleChange} />
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-2 px-2 mt-5 sm:mt-7">
                <div className="relative h-10 w-full border-b border-white/25 flex items-center bg-black/10">
                  <input name="userPass" type={seePassword ? "text" : "password"} className="w-full bg-transparent outline-none text-white px-2" placeholder="Set Password *" value={formData.userPass} onChange={handleChange} />
                </div>
                <div className="flex items-center gap-4 text-white/25 ml-2">
                   <label>Gender:</label>
                   <input type="radio" name="gender" value="Male" onChange={handleChange} /> M
                   <input type="radio" name="gender" value="Female" onChange={handleChange} /> F
                </div>
              </div>

              <div className="h-10 w-full flex justify-center mt-7 mb-5">
                <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-1 px-10 rounded-full">SIGN UP</button>
              </div>
            </form>
          </div>
          <div className="lg:block hidden h-full w-[40%]">
            <img className="h-[550px] object-cover" src={Security} alt="Security" />
          </div>
        </div>
      </div>
      <OTPModel isOpen={isOtpOpen} email={otpEmail} mode="signup" onClose={(success) => { setIsOtpOpen(false); if (success) createUserAfterOtp(); }} />
    </div>
  )
}

export default RegistrationModel;