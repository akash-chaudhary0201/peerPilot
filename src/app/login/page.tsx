"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { mentors } from "@/data/mentors";
import { 
  Mail, 
  Lock, 
  UserCheck, 
  Sparkles, 
  GraduationCap, 
  User, 
  Briefcase, 
  Building, 
  Plus, 
  Check, 
  Info,
  ChevronRight
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Auth Modes: 'login' | 'signup_student' | 'signup_mentor' | 'forgot_password' | 'verify_otp'
  const [authMode, setAuthMode] = useState<'login' | 'signup_student' | 'signup_mentor' | 'forgot_password' | 'verify_otp'>('login');
  
  // Login fields
  const [role, setRole] = useState<'student' | 'mentor' | 'admin'>('student');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Student Signup fields
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentCollege, setStudentCollege] = useState("");
  const [studentDegree, setStudentDegree] = useState("");
  const [studentGradYear, setStudentGradYear] = useState("2026");
  const [studentTargetRole, setStudentTargetRole] = useState("");
  const [studentTargetCompanies, setStudentTargetCompanies] = useState("");
  const [studentSignupStep, setStudentSignupStep] = useState<1 | 2>(1);
  const [studentSignupProjects, setStudentSignupProjects] = useState<Array<{title: string, desc: string, tech: string}>>([
    { title: "", desc: "", tech: "" }
  ]);

  // Mentor Onboarding fields
  const [mentorName, setMentorName] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [mentorPassword, setMentorPassword] = useState("");
  const [mentorRoleTitle, setMentorRoleTitle] = useState("");
  const [mentorCompany, setMentorCompany] = useState("");
  const [mentorYoe, setMentorYoe] = useState("");
  const [mentorBio, setMentorBio] = useState("");
  const [mentorSkills, setMentorSkills] = useState<string[]>([]);
  const [skillInputText, setSkillInputText] = useState("");
  const [mentorPhone, setMentorPhone] = useState("");
  const [mentorSignupStep, setMentorSignupStep] = useState<1 | 2 | 3>(1);
  const [mentorOnboardDays, setMentorOnboardDays] = useState<string[]>(["Monday", "Wednesday", "Friday"]);
  const [mentorOnboardSlots, setMentorOnboardSlots] = useState<string[]>(["10:00 AM", "2:00 PM", "4:30 PM", "7:00 PM"]);
  const [mentorOnboardSuccess, setMentorOnboardSuccess] = useState(false);

  // Forgot Password fields
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotRole, setForgotRole] = useState<'student' | 'mentor'>('student');
  const [forgotSuccess, setForgotSuccess] = useState("");

  const [verifyEmail, setVerifyEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "mentor") {
      setRole("mentor");
    } else if (roleParam === "admin") {
      setRole("admin");
    } else {
      setRole("student");
    }
  }, [searchParams]);

  // Handle Login Validation calling backend APIs
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
        if (res.status === 403 && role === "student") {
          setVerifyEmail(email);
          setAuthMode('verify_otp');
          setError("");
          setSuccessMsg("Please verify your email address. Enter the 6-digit OTP code sent to your registered email (check SPAM folder if not found).");
        }
        setLoading(false);
        return;
      }

      const session = {
        email: data.email,
        role: data.role,
        name: data.name,
      };

      localStorage.setItem("user_session", JSON.stringify(session));

      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "mentor") {
        router.push("/mentor");
      } else {
        router.push("/student");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Student Sign Up calling API
  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!studentName || !studentEmail || !studentPassword || !studentCollege || !studentDegree || !studentTargetRole) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail,
          password: studentPassword,
          college: studentCollege,
          degree: studentDegree,
          gradYear: studentGradYear,
          targetRole: studentTargetRole,
          targetCompanies: studentTargetCompanies,
          projects: studentSignupProjects.filter(p => p.title.trim() !== "")
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign up failed.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setVerifyEmail(studentEmail);
      setAuthMode('verify_otp');
      setError("");
      setSuccessMsg("Registration successful! Enter the 6-digit OTP code sent to your registered email (check SPAM folder if not found).");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  // Mentor Onboarding calling API
  const handleMentorOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!mentorName || !mentorEmail || !mentorPassword || !mentorRoleTitle || !mentorCompany || !mentorYoe || !mentorBio || mentorSkills.length === 0 || !mentorPhone) {
      setError("Please fill out all required fields and complete all steps.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mentorName,
          email: mentorEmail,
          password: mentorPassword,
          roleTitle: mentorRoleTitle,
          company: mentorCompany,
          yoe: mentorYoe,
          bio: mentorBio,
          skills: mentorSkills,
          phone: mentorPhone,
          availableDays: mentorOnboardDays,
          availableSlots: mentorOnboardSlots,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Onboarding failed.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setMentorOnboardSuccess(true);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  // Forgot Password calling API
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setForgotSuccess("");
    setLoading(true);

    if (!forgotEmail || !forgotPhone || !forgotNewPassword) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: forgotRole,
          email: forgotEmail,
          phone: forgotPhone,
          newPassword: forgotNewPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed.");
        setLoading(false);
        return;
      }

      setForgotSuccess("Password reset successfully! You can now log in.");
      setLoading(false);
      setForgotEmail("");
      setForgotPhone("");
      setForgotNewPassword("");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    if (otpInput.length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmail, otp: otpInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccessMsg("Email verified successfully! You can now sign in.");
      setOtpInput("");
      setAuthMode('login');
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during OTP verification.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmail, action: "resend" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Resending OTP failed.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccessMsg("A new 6-digit OTP has been sent. Please check your email inbox and SPAM folder.");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while resending OTP.");
      setLoading(false);
    }
  };



  const handleStudentNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!studentName || !studentEmail || !studentPassword || !studentCollege || !studentDegree || !studentTargetRole) {
      setError("Please fill out all required fields.");
      return;
    }
    setStudentSignupStep(2);
  };

  const addSignupProject = () => {
    setStudentSignupProjects([...studentSignupProjects, { title: "", desc: "", tech: "" }]);
  };

  const removeSignupProject = (index: number) => {
    const updated = studentSignupProjects.filter((_, i) => i !== index);
    setStudentSignupProjects(updated.length > 0 ? updated : [{ title: "", desc: "", tech: "" }]);
  };

  const handleSignupProjectChange = (index: number, field: 'title' | 'desc' | 'tech', value: string) => {
    const updated = [...studentSignupProjects];
    updated[index][field] = value;
    setStudentSignupProjects(updated);
  };

  const handleNextStep1 = () => {
    if (!mentorName || !mentorEmail || !mentorPassword || !mentorPhone || !mentorBio) {
      setError("Please fill out all fields in Step 1.");
      return;
    }
    setError("");
    setMentorSignupStep(2);
  };

  const handleNextStep2 = () => {
    if (!mentorRoleTitle || !mentorCompany || !mentorYoe || mentorSkills.length === 0) {
      setError("Please fill out all fields and add at least one skill in Step 2.");
      return;
    }
    setError("");
    setMentorSignupStep(3);
  };



  return (
    <div className="w-full max-w-lg space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 animate-in fade-in duration-200">
      
      {/* 1. SIGN IN MODE */}
      {authMode === 'login' && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-100">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-sm text-slate-500">Sign in to access your interview workspace</p>
          </div>

          {/* Role Toggle Selector */}
          <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => { setRole("student"); setError(""); setSuccessMsg(""); }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                role === "student"
                  ? "bg-white text-indigo-650 shadow-sm"
                  : "text-slate-500 hover:text-slate-705"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => { setRole("mentor"); setError(""); setSuccessMsg(""); }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                role === "mentor"
                  ? "bg-white text-indigo-650 shadow-sm"
                  : "text-slate-500 hover:text-slate-705"
              }`}
            >
              Mentor
            </button>
            <button
              type="button"
              onClick={() => { setRole("admin"); setError(""); setSuccessMsg(""); }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                role === "admin"
                  ? "bg-white text-indigo-650 shadow-sm"
                  : "text-slate-500 hover:text-slate-705"
              }`}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-600 leading-normal">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-semibold text-emerald-700 leading-normal">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5 text-left">
              <div>
                <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs font-semibold"
                    placeholder={
                      role === "student" ? "akash@gmail.com" :
                      role === "mentor" ? "mentor@mentor.com" : "admin.peerpilot@gmail.com"
                    }
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot_password'); setError(""); }}
                    className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs font-semibold"
                    placeholder="••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl hover:shadow-lg transition-all duration-200 shadow shadow-indigo-100 disabled:opacity-80 text-xs cursor-pointer"
            >
              {loading ? (
                <div className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In to Workspace
                  <UserCheck className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration toggles */}
          <div className="pt-2 flex flex-col sm:flex-row justify-between text-xs font-bold text-slate-500 gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setAuthMode('signup_student'); setError(""); setSuccessMsg(""); }}
              className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
            >
              New student? <span className="text-indigo-600 underline">Sign Up Profile</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup_mentor'); setError(""); setSuccessMsg(""); }}
              className="hover:text-indigo-600 transition-colors cursor-pointer text-right"
            >
              Become a Mentor? <span className="text-indigo-600 underline">Apply Onboarding</span>
            </button>
          </div>


        </div>
      )}

      {/* 1.5. FORGOT PASSWORD MODE */}
      {authMode === 'forgot_password' && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-650 text-white shadow-md shadow-indigo-100">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
            <p className="text-sm text-slate-500">Verify your details to set a new password</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-105 rounded-xl">
            <button
              type="button"
              onClick={() => setForgotRole('student')}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                forgotRole === 'student'
                  ? 'bg-white text-indigo-650 shadow-sm'
                  : 'text-slate-505 hover:text-slate-700'
              }`}
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => setForgotRole('mentor')}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                forgotRole === 'mentor'
                  ? 'bg-white text-indigo-650 shadow-sm'
                  : 'text-slate-505 hover:text-slate-700'
              }`}
            >
              Mentor Portal
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-600 leading-normal">
              {error}
            </div>
          )}

          {forgotSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-semibold text-emerald-700 leading-normal">
              {forgotSuccess}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-5 text-left">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs font-semibold"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Registered Phone Number
              </label>
              <input
                type="text"
                required
                value={forgotPhone}
                onChange={(e) => setForgotPhone(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs font-semibold"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                required
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs font-semibold"
                placeholder="••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold rounded-2xl hover:shadow-lg transition-all duration-200 shadow shadow-indigo-100 disabled:opacity-80 text-xs cursor-pointer"
            >
              {loading ? (
                <div className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(""); setForgotSuccess(""); }}
              className="text-xs font-bold text-slate-500 hover:text-indigo-650 transition-colors underline cursor-pointer"
            >
              Back to Sign In Workspace
            </button>
          </div>
        </div>
      )}

      {/* 2. STUDENT SIGN UP WORKSPACE */}
      {authMode === 'signup_student' && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <User className="h-5.5 w-5.5" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Student Profile</h2>
            <p className="text-xs text-slate-500 leading-normal">
              {studentSignupStep === 1
                ? "Step 1 of 2: Academic & Career Profile"
                : "Step 2 of 2: Tell us about your projects"}
            </p>
          </div>
 
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-600 leading-normal">
              {error}
            </div>
          )}
 
          {studentSignupStep === 1 ? (
            /* ==========================================
               STEP 1: BASIC INFORMATION
               ========================================== */
            <form onSubmit={handleStudentNextStep} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Akash Gupta"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@university.edu"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    University / College *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IIIT Delhi"
                    value={studentCollege}
                    onChange={(e) => setStudentCollege(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Degree & Major *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="B.Tech in Computer Science"
                    value={studentDegree}
                    onChange={(e) => setStudentDegree(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Grad Year *
                  </label>
                  <select
                    value={studentGradYear}
                    onChange={(e) => setStudentGradYear(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700 font-bold"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Target Engineering Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Engineer"
                    value={studentTargetRole}
                    onChange={(e) => setStudentTargetRole(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Target Companies
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Uber, Netflix"
                    value={studentTargetCompanies}
                    onChange={(e) => setStudentTargetCompanies(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
              </div>
 
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl hover:shadow-lg transition-all duration-200 text-xs cursor-pointer shadow shadow-indigo-150"
                >
                  Next: Add Projects
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            /* ==========================================
               STEP 2: PORTFOLIO PROJECTS DETAILS
               ========================================== */
            <form onSubmit={handleStudentSignup} className="space-y-5 text-left animate-in fade-in duration-200">
              <span className="text-[10px] text-slate-400 font-semibold block leading-relaxed">
                Add projects that highlight your engineering stack. These details will be showcased on your student profile page.
              </span>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {studentSignupProjects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Project #{idx + 1}
                      </span>
                      {studentSignupProjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSignupProject(idx)}
                          className="text-[10px] font-bold text-rose-650 hover:text-rose-700 hover:underline cursor-pointer"
                        >
                          Remove Project
                        </button>
                      )}
                    </div>
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Project Title (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Distributed Key-Value Store"
                          value={proj.title}
                          onChange={(e) => handleSignupProjectChange(idx, 'title', e.target.value)}
                          className="block w-full rounded-xl border border-slate-205 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Technologies Used (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Go, gRPC, Raft, Docker"
                          value={proj.tech}
                          onChange={(e) => handleSignupProjectChange(idx, 'tech', e.target.value)}
                          className="block w-full rounded-xl border border-slate-205 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
 
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Project Description (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Briefly describe what you built, system highlights, and metrics achieved."
                        value={proj.desc}
                        onChange={(e) => handleSignupProjectChange(idx, 'desc', e.target.value)}
                        className="block w-full rounded-xl border border-slate-205 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
 
              <button
                type="button"
                onClick={addSignupProject}
                className="w-full py-2.5 bg-white hover:bg-slate-50 text-indigo-700 border border-dashed border-indigo-200 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Another Project
              </button>
 
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStudentSignupStep(1)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Back to Profile
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl hover:shadow-lg transition-all duration-200 text-xs cursor-pointer disabled:opacity-85"
                >
                  {loading ? (
                    <div className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Complete Sign Up
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
 
          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(""); setSuccessMsg(""); }}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors underline cursor-pointer"
            >
              Back to Sign In Workspace
            </button>
          </div>
        </div>
      )}

      {/* 3. MENTOR ONBOARDING WORKSPACE */}
      {authMode === 'signup_mentor' && (
        mentorOnboardSuccess ? (
          <div className="space-y-6 text-center animate-in fade-in duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
              <Check className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Application Submitted!</h2>
              <p className="text-xs text-slate-500 leading-normal">
                Thank you, <span className="font-semibold text-slate-800">{mentorName}</span>. Your onboarding profile has been submitted to the administration team for approval.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-[11px] text-slate-600 leading-relaxed text-left space-y-1">
              <span className="font-bold text-slate-700 block mb-1">Application Details:</span>
              <div><strong className="text-slate-700">Role:</strong> {mentorRoleTitle}</div>
              <div><strong className="text-slate-700">Company:</strong> {mentorCompany}</div>
              <div><strong className="text-slate-700">Experience:</strong> {mentorYoe}</div>
              <div><strong className="text-slate-700">Phone:</strong> {mentorPhone || "None"}</div>
              <div><strong className="text-slate-700">Skills:</strong> {mentorSkills.join(", ") || "None"}</div>
              <div><strong className="text-slate-700">Availability:</strong> {mentorOnboardDays.join(", ")} at {mentorOnboardSlots.join(", ")}</div>
              <div><strong className="text-slate-700">Login Email:</strong> {mentorEmail}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setRole('mentor');
                setEmail(mentorEmail);
                setPassword("");
                setMentorOnboardSuccess(false);
                setError("");
              }}
              className="w-full py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold rounded-2xl hover:shadow-lg transition-all text-xs cursor-pointer"
            >
              Back to Sign In Workspace
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Briefcase className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Apply Mentor Onboarding</h2>
              <p className="text-xs text-slate-500 leading-normal">Onboard as a PeerPilot Evaluator. Seed specialties to appear in the booking directory.</p>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-600 leading-normal mb-4">
                {error}
              </div>
            )}

            {/* Step Indicator Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Step {mentorSignupStep} of 3: {
                  mentorSignupStep === 1 ? "Basic Credentials" :
                  mentorSignupStep === 2 ? "Professional Details" :
                  "Weekly Availability"
                }
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(st => (
                  <div
                    key={st}
                    className={`h-2 w-8 rounded-full transition-all ${
                      mentorSignupStep === st ? "bg-indigo-650" :
                      mentorSignupStep > st ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleMentorOnboarding} className="space-y-4 text-left">
              {mentorSignupStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Mentor Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sumit (Netflix)"
                        value={mentorName}
                        onChange={(e) => setMentorName(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Onboarding Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={mentorEmail}
                        onChange={(e) => setMentorEmail(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Create Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••"
                        value={mentorPassword}
                        onChange={(e) => setMentorPassword(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Contact Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={mentorPhone}
                        onChange={(e) => setMentorPhone(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Bio Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Briefly review your professional credentials and target focus areas to guide candidates..."
                      value={mentorBio}
                      onChange={(e) => setMentorBio(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleNextStep1}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl hover:shadow-lg transition-all text-xs cursor-pointer"
                    >
                      Next Step: Professional Info
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {mentorSignupStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Engineering Title / Role *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Staff Backend Architect"
                        value={mentorRoleTitle}
                        onChange={(e) => setMentorRoleTitle(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Current Company / Employer *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Meta"
                        value={mentorCompany}
                        onChange={(e) => setMentorCompany(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Experience Level (YOE) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 8+ Years"
                      value={mentorYoe}
                      onChange={(e) => setMentorYoe(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Specialty Skills * (Type a skill and press Enter or Comma)
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Type skill (e.g. Node, Python, Communication, HR) and press Enter"
                        value={skillInputText}
                        onChange={(e) => setSkillInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const val = skillInputText.trim().replace(/,$/, '');
                            if (val && !mentorSkills.includes(val)) {
                              setMentorSkills([...mentorSkills, val]);
                            }
                            setSkillInputText("");
                          }
                        }}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                      {mentorSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                          {mentorSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => setMentorSkills(mentorSkills.filter(s => s !== skill))}
                                className="hover:text-indigo-200 font-extrabold focus:outline-none cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setMentorSignupStep(1)}
                      className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep2}
                      className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs cursor-pointer"
                    >
                      Next Step: Availability
                    </button>
                  </div>
                </div>
              )}

              {mentorSignupStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Interactive Day Availability * (Click to Toggle)
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-1">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                        const isSelected = mentorOnboardDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setMentorOnboardDays(mentorOnboardDays.filter(d => d !== day));
                              } else {
                                setMentorOnboardDays([...mentorOnboardDays, day]);
                              }
                            }}
                            className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-indigo-600 border-indigo-650 text-white font-extrabold shadow-sm"
                                : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                            }`}
                          >
                            {day.substring(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Interactive Time Slot Availability * (Click to Toggle)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                      {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"].map(slot => {
                        const isSelected = mentorOnboardSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setMentorOnboardSlots(mentorOnboardSlots.filter(s => s !== slot));
                              } else {
                                setMentorOnboardSlots([...mentorOnboardSlots, slot]);
                              }
                            }}
                            className={`py-1.5 px-2 rounded-lg border text-[9px] font-bold transition-all cursor-pointer text-center ${
                              isSelected
                                ? "bg-indigo-600 border-indigo-655 text-white font-extrabold shadow-sm"
                                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-2.5 text-[10px] text-amber-800 leading-normal">
                    <Info className="h-4.5 w-4.5 shrink-0 text-amber-600" />
                    <span>Your schedule will be listed for students to book sessions. You can edit availability anytime in the Mentor settings.</span>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setMentorSignupStep(2)}
                      className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs cursor-pointer shadow disabled:opacity-85"
                    >
                      {loading ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                      ) : (
                        "Submit Onboarding Request"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(""); }}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors underline cursor-pointer"
              >
                Back to Sign In Workspace
              </button>
            </div>
          </div>
        )
      )}

      {/* 4. OTP VERIFICATION WORKSPACE */}
      {authMode === 'verify_otp' && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-650 text-white shadow-md shadow-indigo-100">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Verify Your Email</h2>
            <p className="text-sm text-slate-505 leading-relaxed">
              We sent a 6-digit OTP code to <strong className="text-slate-800">{verifyEmail}</strong>.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-600 leading-normal text-left">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-semibold text-emerald-700 leading-normal text-left">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleOtpVerify} className="space-y-5 text-left">
            <div>
              <label htmlFor="otp" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                Enter 6-Digit OTP Code
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                required
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                className="block w-full text-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-2xl font-bold tracking-[8px] text-slate-900 placeholder-slate-350 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="000000"
              />
              <span className="block text-[10px] text-slate-400 font-semibold text-center mt-2.5 leading-relaxed">
                Note: If you do not see the email in your inbox, check your **SPAM** folder.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-650 hover:bg-indigo-750 text-white font-extrabold rounded-2xl hover:shadow-lg transition-all duration-200 shadow shadow-indigo-100 disabled:opacity-85 text-xs cursor-pointer"
            >
              {loading ? (
                <div className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Verify OTP Code
                  <Check className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center flex justify-between text-xs font-bold text-slate-500">
            <button
              type="button"
              onClick={handleResendOtp}
              className="hover:text-indigo-650 transition-colors cursor-pointer underline"
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(""); setOtpInput(""); setSuccessMsg(""); }}
              className="hover:text-indigo-650 transition-colors cursor-pointer underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
