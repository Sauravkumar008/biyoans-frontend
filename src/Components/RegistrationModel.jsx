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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // --- at top of file, keep imports and state as you already have ---
  // add these state hooks near your other state:
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // ------ inside your handleSubmit (replace your fetch call) ------
  // inside RegistrationModel.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- validation ---
    if (formData.userName.trim() === '') {
      alert('Name cannot be empty');
      return;
    }
    if (formData.qualification.trim() === '') {
      alert('Qualification cannot be empty');
      return;
    }
    if (formData.fatherName.trim() === '') {
      alert("Father's Name cannot be empty");
      return;
    }
    if (formData.aadharNumber.trim() !== '' && formData.aadharNumber.length !== 12) {
      alert('Aadhar Number must be of 12 digits only');
      return;
    }
    if (formData.dob.trim() === '') {
      alert('Date of Birth cannot be empty');
      return;
    }
    if (formData.email.trim() === '' || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))) {
      alert(formData.email.trim() === '' ? 'Email cannot be empty' : 'Please enter a valid email address');
      return;
    }
    if (formData.whatsAppNumber.trim() === '' || formData.whatsAppNumber.length !== 10) {
      alert(formData.whatsAppNumber.trim() === '' ? 'WhatsApp Number cannot be empty' : 'WhatsApp Number must be 10 digits only');
      return;
    }
    if (formData.userPass.trim() === '' || formData.userPass.length < 8) {
      alert(formData.userPass.trim() === '' ? 'Password cannot be empty' : 'Password must be at least 8 characters long');
      return;
    }
    if (formData.gender.trim() === '') {
      toast.error('Please select your gender');
      return;
    }

    try {
      // --- Step 1: Send OTP ---
      const res = await fetch("http://localhost:8080/api/superusers/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not send OTP");

      // --- Step 2: Store pendingUser and open OTP modal ---
      const pending = {
        ...formData,
        role: "STUDENT", // enforce student role by default
        // photoFile: selectedPhotoFile // add if you capture profile photo here
      };

      setPendingUser(pending);   // make sure you have a state: const [pendingUser, setPendingUser] = useState(null);
      setOtpEmail(formData.email);
      setIsOtpOpen(true);
      // setPendingUser({ ...formData, role: "STUDENT" });
      // setOtpEmail(formData.email);
      // setIsOtpOpen(true);

    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message);
    }
  };


  const [focusUserName, setFocusUserName] = useState(false);
  const [focusFatherName, setFocusFatherName] = useState(false);
  const [focusMotherName, setFocusMotherName] = useState(false);
  const [focusAadharNumber, setFocusAadharNumber] = useState(false);
  const [focusDob, setFocusDob] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusWhatsAppNumber, setFocusWhatsAppNumber] = useState(false);
  const [focusUserPass, setFocusUserPass] = useState(false);
  const [focusQualification, setFocusQualification] = useState(false);

  const [seePassword, setSeePassword] = useState(false);

  const dobInputRef = useRef(null);;

  const handleTextInputFocus1 = () => {
    setTimeout(() => {
      dobInputRef.current?.showPicker?.();
      dobInputRef.current?.click();
    }, 0);
  };

  // call this after OTP modal returns success
  // put near the other functions inside RegistrationModel.jsx
  // inside RegistrationModel.jsx (import useState, etc. at top)

  // when you send OTP (handleSubmit), set pendingUser and open OTP modal:
  // (after successful send-otp response)


  // Render OTPModel with onClose wired to create:


  // add this createUserAfterOtp function in the component:
  async function createUserAfterOtp() {
    if (!pendingUser) {
      alert("Internal error: pending signup not found.");
      return;
    }
    setIsCreating(true);
    try {
      console.debug("createUserAfterOtp: payload=", pendingUser);

      const fd = new FormData();
      fd.append("userName", pendingUser.userName || "");
      fd.append("qualification", pendingUser.qualification || "");
      fd.append("fatherName", pendingUser.fatherName || "");
      if (pendingUser.motherName) fd.append("motherName", pendingUser.motherName);
      if (pendingUser.aadharNumber) fd.append("aadharNumber", pendingUser.aadharNumber);
      if (pendingUser.dob) fd.append("dob", pendingUser.dob);
      fd.append("email", pendingUser.email || "");
      fd.append("whatsAppNumber", pendingUser.whatsAppNumber || "");
      fd.append("userPass", pendingUser.userPass || "");
      fd.append("gender", pendingUser.gender || "");
      fd.append("role", "STUDENT");
      // add photo if you capture it: fd.append("photo", pendingUser.photoFile);

      const url = "http://localhost:8080/api/superusers/create-student";
      console.debug("POST to", url);
      const res = await fetch(url, {
        method: "POST",
        body: fd // do NOT set Content-Type
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Create student failed:", json);
        throw new Error(json.message || `Create failed (HTTP ${res.status})`);
      }

      toast.success(json.message || "Registration completed");
      // cleanup
      setPendingUser(null);
      setIsCreating(false);
      setIsOtpOpen(false);
      // close registration modal, open login if you want:
      setIsRegOpen(false);
      setIsLoginOpen(true);
    } catch (err) {
      console.error("createUserAfterOtp error:", err);
      alert(err.message || "Failed to create user after OTP");
      setIsCreating(false);
    }
  }


  return (
    <div className="fixed inset-0 h-screen w-screen flex flex-col items-center justify-center z-50 bg-gray-950/50 backdrop-blur-sm">
      <div className="h-fit w-[500px] lg:min-w-[900px] scale-[0.6] sm:scale-90 md:scale-100">
        <div className='h-10 w-full flex flex-row justify-end items-end mb-1'>
          <button className='h-7 w-7 border rounded-full bg-gray-500/25 backdrop-blur-sm text-white/50 cursor-pointer text-[12px]' onClick={onClose} >✖</button>
        </div>
        <div className="h-fit w-full border rounded-3xl lg:rounded-none flex items-center justify-center bg-gray-500/25 backdrop-blur-sm border-white/25">
          <div className="h-full w-full lg:w-[60%]">
            <form onSubmit={handleSubmit} autoComplete="off">
              <h1 className="text-4xl Surgena text-center text-gray-300 mt-8">Register Now</h1>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-2 px-2 mt-5 sm:mt-7">
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusUserName ? 'border-cyan-700' : 'border-white/25'}`}>
                  <input
                    className="peer focus:ring-0 focus:outline-0 h-full w-[94%] sm:w-[90%] text-[20px] px-2 placeholder-transparent"
                    placeholder=" "
                    required
                    type="text"
                    value={formData.userName}
                    name="userName"
                    onChange={handleChange}
                    onFocus={() => setFocusUserName(true)}
                    onBlur={() => setFocusUserName(false)}
                  />
                  <GoPerson className="size-5 text-gray-300" />
                  <span
                    className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none
                          peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/25
                          peer-focus:-top-5 peer-focus:left-1 peer-focus:text-sm peer-focus:text-gray-300
                          peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:left-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-300"
                  >
                    Name <span className="text-red-600">*</span>
                  </span>
                </div>
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusQualification ? 'border-cyan-700' : 'border-white/25'} pl-2`}>
                  {/* <select
                    onFocus={() => setFocusQualification(true)}
                    onClick={() => setFocusQualification(true)}
                    onBlur={() => setFocusQualification(false)}
                    required
                    name="qualification"
                    onChange={handleChange}
                    className="text-white/25 opacity-0 focus:ring-0 focus:outline-0 w-[94%] sm:w-[90%] h-full cursor-pointer pointer-events-auto"
                  >
                    <option className="text-gray-300" selected disabled value="">--Select last qualification--</option>
                    <option className="text-black" value="Matriculation">Matriculation</option>
                    <option className="text-black" value="Intermediate">Intermediate</option>
                    <option className="text-black" value="Bachelor Degree">Bachelor Degree</option>
                    <option className="text-black" value="Post Graduation">Post Graduation</option>
                  </select> */}

                  <select
                    value={formData.qualification}
                    onFocus={() => setFocusQualification(true)}
                    onClick={() => setFocusQualification(true)}
                    onBlur={() => setFocusQualification(false)}
                    required
                    name="qualification"
                    onChange={handleChange}
                    className="text-white/25 opacity-0 focus:ring-0 focus:outline-0 w-[94%] sm:w-[90%] h-full cursor-pointer-auto"
                  >
                    <option className="text-gray-300" selected disabled value="">--Select last qualification--</option>
                    <option className="text-black" value="Matriculation">Matriculation</option>
                    <option className="text-black" value="Intermediate">Intermediate</option>
                    <option className="text-black" value="Bachelor Degree">Bachelor Degree</option>
                    <option className="text-black" value="Post Graduation">Post Graduation</option>
                  </select>

                  <TbArrowBadgeDownFilled className="size-5 text-gray-300" />
                  <input
                    className="absolute inset-0 peer focus:ring-0 focus:outline-0 h-full w-full text-[20px] px-2 placeholder-transparent pointer-events-none"
                    placeholder=" "
                    readOnly
                    type="text"
                    value={formData.qualification}
                  />
                  <span
                    className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none
                          peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/25
                          peer-focus:-top-5 peer-focus:left-1 peer-focus:text-sm peer-focus:text-gray-300
                          peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:left-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-300"
                  >
                    Select Last Qualification <span className="text-red-600">*</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-2 px-2 mt-5 sm:mt-7">
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusFatherName ? 'border-cyan-700' : 'border-white/25'}`}>
                  <input
                    className="peer focus:ring-0 focus:outline-0 h-full w-[94%] sm:w-[90%] text-[20px] px-2 placeholder-transparent"
                    placeholder=" "
                    required
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    onFocus={() => setFocusFatherName(true)}
                    onBlur={() => setFocusFatherName(false)}
                  />
                  <IoPersonOutline className="text-gray-300 size-5" />
                  <span
                    className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none
                          peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/25
                          peer-focus:-top-5 peer-focus:left-1 peer-focus:text-sm peer-focus:text-gray-300
                          peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:left-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-300"
                  >
                    Father's Name <span className="text-red-600">*</span>
                  </span>
                </div>
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusMotherName ? 'border-cyan-700' : 'border-white/25'}`}>
                  <input
                    className="peer focus:ring-0 focus:outline-0 h-full w-[94%] sm:w-[90%] text-[20px] px-2 placeholder-transparent"
                    placeholder=" "
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    onFocus={() => setFocusMotherName(true)}
                    onBlur={() => setFocusMotherName(false)}
                  />
                  <SlUserFemale className="size-5 text-gray-300" />
                  <span
                    className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none
                          peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/25
                          peer-focus:-top-5 peer-focus:left-1 peer-focus:text-sm peer-focus:text-gray-300
                          peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:left-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-300"
                  >
                    Mother's Name
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-2 px-2 mt-5 sm:mt-7">
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusAadharNumber ? 'border-cyan-700' : 'border-white/25'}`}>
                  <input
                    className="peer focus:ring-0 focus:outline-0 h-full w-[94%] sm:w-[90%] text-[20px] px-2 placeholder-transparent"
                    placeholder=" "
                    type="number"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    onFocus={() => setFocusAadharNumber(true)}
                    onBlur={() => setFocusAadharNumber(false)}
                  />
                  <PiIdentificationCard className="size-5.5 text-gray-300" />
                  <span
                    className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none
                          peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/25
                          peer-focus:-top-5 peer-focus:left-1 peer-focus:text-sm peer-focus:text-gray-300
                          peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:left-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-300"
                  >
                    Aadhar Number
                  </span>
                </div>
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusDob ? 'border-cyan-700' : 'border-white/25'}`}>
                  <input
                    className="cursor-pointer dob-input opacity-0 focus:ring-0 focus:outline-0 h-full w-[94%] sm:w-[90%] text-[18px] pr-1.5"
                    required
                    type="date"
                    name="dob"
                    ref={dobInputRef}
                    onChange={handleChange}
                    onFocus={() => setFocusDob(true)}
                    onBlur={() => setFocusDob(false)}
                  />
                  <LiaCalendarDaySolid className="size-5.5 text-gray-300" />
                  <input
                    className="absolute inset-0 peer focus:ring-0 focus:outline-0 h-full w-full text-[20px] px-2 placeholder-transparent"
                    placeholder=" "
                    readOnly
                    type="text"
                    value={formData.dob}
                    onFocus={() => setFocusDob(true)}
                    onClick={handleTextInputFocus1}
                    onBlur={() => setFocusDob(false)}
                  />
                  <span
                    className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none
                          peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/25
                          peer-focus:-top-5 peer-focus:left-1 peer-focus:text-sm peer-focus:text-gray-300
                          peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:left-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-300"
                  >
                    Date of Birth <span className="text-red-600">*</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-2 px-2 mt-5 sm:mt-7">
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusEmail ? 'border-cyan-700' : 'border-white/25'}`}>
                  <input
                    className="peer focus:ring-0 focus:outline-0 h-full w-[94%] sm:w-[90%] text-[20px] px-2 placeholder-transparent"
                    placeholder=" "
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusEmail(true)}
                    onBlur={() => setFocusEmail(false)}
                  />
                  <TfiEmail className="size-4.5 text-gray-300 ml-0.5" />
                  <span
                    className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none
                                            peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/25
                                            peer-focus:-top-5 peer-focus:left-1 peer-focus:text-sm peer-focus:text-gray-300
                                            peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:left-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-300
                                        "
                  >
                    Email <span className="text-red-600">*</span>
                  </span>
                </div>
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusWhatsAppNumber ? 'border-cyan-700' : 'border-white/25'}`}>
                  <input
                    className="peer focus:ring-0 focus:outline-0 h-full w-[94%] sm:w-[90%] text-[20px] px-2 placeholder-transparent"
                    placeholder=" "
                    required
                    type="number"
                    name="whatsAppNumber"
                    value={formData.whatsAppNumber}
                    onChange={handleChange}
                    onFocus={() => setFocusWhatsAppNumber(true)}
                    onBlur={() => setFocusWhatsAppNumber(false)}
                  />
                  <IoLogoWhatsapp className="size-5 text-gray-300" />
                  <span
                    className="absolute left-2 top-2 text-white/25 transition-all duration-200 pointer-events-none
                                            peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/25
                                            peer-focus:-top-5 peer-focus:left-1 peer-focus:text-sm peer-focus:text-gray-300
                                            peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:left-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-300
                                        "
                  >
                    WhatsApp Number <span className="text-red-600">*</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-2 px-2 mt-5 sm:mt-7">
                <div className={`relative h-10 w-full flex items-center bg-black/10 border-b ${focusUserPass ? 'border-cyan-700' : 'border-white/25'}`}>
                  <input
                    className="peer focus:ring-0 focus:outline-0 h-full w-[94%] sm:w-[90%] text-[20px] px-2 placeholder-transparent"
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
                    Set Password <span className="text-red-600">*</span>
                  </span>
                </div>
                <div className={`h-10 w-full flex items-center text-white/25`}>
                  <label className="text-[20px] h-full w-[35%] pl-10 sm:pl-0">Gender <span className="text-red-600">*</span></label>
                  <div className="flex flex-row justify-around sm:justify-between w-[65%] ml-2">
                    <div className="flex flex-col">
                      <input
                        type="radio"
                        value='Male'
                        id="male"
                        name="gender"
                        onChange={handleChange}
                        className="cursor-pointer"
                      />
                      <label className="cursor-pointer" htmlFor="male">Male</label>
                    </div>
                    <div className="flex flex-col">
                      <input
                        type="radio"
                        value='Female'
                        id="female"
                        name="gender"
                        onChange={handleChange}
                        className="cursor-pointer"
                      />
                      <label className="cursor-pointer" htmlFor="female">Female</label>
                    </div>
                    <div className="flex flex-col">
                      <input
                        type="radio"
                        value='Others'
                        id="others"
                        name="gender"
                        onChange={handleChange}
                        className="cursor-pointer"
                      />
                      <label className="cursor-pointer" htmlFor="others">Others</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-10 w-full flex justify-center mt-7">
                <button type="submit" className="signupBtn h-full w-fit px-10 bg-purple-700 hover:bg-purple-800 font-bold py-1 transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-1 focus:outline-purple-900 focus:ring-0">SIGN UP</button>
              </div>
              <div className="w-full flex flex-row justify-center gap-2 my-5 text-gray-400">
                <span>Already have an account?</span>
                <button type="button" onClick={() => { setIsLoginOpen(true); setIsRegOpen(false) }} className="font-semibold focus:ring-0 focus:outline-0 text-gray-300 cursor-pointer">Sign In</button>
              </div>
            </form>
          </div>
          <div className="lg:block hidden h-full w-[40%] relative">
            <img className="h-[550px]" src={Security} alt="Security Image" />
            <div className="absolute inset-0 flex flex-col items-center justify-between text-gray-100 pt-10 pb-7">
              <h2 className="text-3xl font-serif">Safe security is on</h2>
              <div className="text-center text-sm">
                <p>By signing up to our service, you agree to our</p>
                <p>
                  <span className="text-blue-950 font-semibold pr-2 cursor-pointer">Terms & Conditions</span>
                  and
                  <span className="text-blue-950 font-semibold pl-2 cursor-pointer">Privacy Policy</span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='h-10 w-full'>
        </div>
      </div>
      {/* Place near bottom of RegistrationModel JSX */}
      <OTPModel
        isOpen={isOtpOpen}
        email={otpEmail}
        mode="signup"
        onClose={(success) => {
          setIsOtpOpen(false);
          if (success) {
            createUserAfterOtp();
          }
        }}

      />

    </div>
  )
}

export default RegistrationModel