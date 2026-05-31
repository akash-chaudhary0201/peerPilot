"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { mentors } from "@/data/mentors";
import { 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Video, 
  FileText, 
  Briefcase, 
  Award, 
  Code, 
  Monitor, 
  Users, 
  Terminal, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const studentFeedbacks = [
  {
    studentName: "Devansh K.",
    originalRole: "Associate Dev (Service Firm)",
    placedRole: "SDE-2 at Google",
    company: "Google",
    rating: 5,
    sessionsCount: 6,
    prepGap: "Lacked structure in graph traversals and raw topological sorting edge cases.",
    sessionOutcome: "My coach ran three double-blind Google mock rounds. The visual tracing tips for dynamic graph layers changed how I trace state on the whiteboard. Placed in under 4 weeks.",
    avatarBg: "from-amber-450 to-orange-500",
    tags: ["Graph Algorithms", "Offer Unlocked"]
  },
  {
    studentName: "Priyanjali S.",
    originalRole: "Senior Frontend Engineer",
    placedRole: "Staff UI Engineer at Meta",
    company: "Meta",
    rating: 5,
    sessionsCount: 8,
    prepGap: "Struggled to coordinate large-scale client cache sync architectures in under 35 minutes.",
    sessionOutcome: "Prashu (Meta founder) tore down my system design layout. We spent two sessions optimizing atomic state queues and virtual DOM rendering pipelines. The live feedback was incredibly raw and high-impact.",
    avatarBg: "from-sky-400 to-indigo-500",
    tags: ["UI Systems Design", "FAANG Placement"]
  },
  {
    studentName: "Sumit T.",
    originalRole: "SDE-2 (Fintech Startup)",
    placedRole: "Senior Backend Developer at Stripe",
    company: "Stripe",
    rating: 5,
    sessionsCount: 5,
    prepGap: "Weak handling of transactional consistency models and transaction retries.",
    sessionOutcome: "The coaching rounds focused 100% on API idempotency, Saga patterns, and real-world system failure boundaries. I went from being rejected at design rounds to securing a Senior offer.",
    avatarBg: "from-teal-400 to-emerald-500",
    tags: ["Distributed Databases", "System Design"]
  },
  {
    studentName: "Rohan M.",
    originalRole: "Staff Architect (Enterprise Node)",
    placedRole: "Principal Systems Engineer at Netflix",
    company: "Netflix",
    rating: 5,
    sessionsCount: 10,
    prepGap: "Behavioral alignment was too generic; STAR scenarios lacked concrete business metrics.",
    sessionOutcome: "We reconstructed my entire portfolio of architectural stories. We quantified latency reductions and infrastructure cost metrics. Crucial preparation for Staff behavioral loops.",
    avatarBg: "from-violet-400 to-fuchsia-500",
    tags: ["Leadership Loop", "STAR blueprint"]
  },
  {
    studentName: "Kriti A.",
    originalRole: "L3 Engineer",
    placedRole: "L5 SWE at Google",
    company: "Google",
    rating: 5,
    sessionsCount: 7,
    prepGap: "Timeout issues in DP bounds and recursion state caching.",
    sessionOutcome: "My mentor taught me how to decompose DP problems into standard decision trees. The live whiteboard dry-runs gave me the confidence to pass Google's hiring committee easily.",
    avatarBg: "from-rose-450 to-pink-500",
    tags: ["Leetcode DP", "Whiteboard Tracing"]
  },
  {
    studentName: "Aravind R.",
    originalRole: "Core Dev (AdTech)",
    placedRole: "SDE-3 at Meta",
    company: "Meta",
    rating: 5,
    sessionsCount: 6,
    prepGap: "Unfamiliar with Meta's fast-paced codebase execution paradigms and product loops.",
    sessionOutcome: "The mock interviews were identical to the real Meta loop. We went through coding speedups, optimization verification, and high scale system design metrics. Literally saved months of self-study.",
    avatarBg: "from-blue-400 to-indigo-650",
    tags: ["Coding Speed", "Meta System Design"]
  }
];

export default function Home() {
  // 1. Student Case Study Slider States & Autoplay Loop
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);
  const [maxSlide, setMaxSlide] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setMaxSlide(width >= 768 ? studentFeedbacks.length - 3 : studentFeedbacks.length - 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3800);
    return () => clearInterval(timer);
  }, [currentSlide, maxSlide]);

  // 2. Success Calculator States
  const [leetcodeSolved, setLeetcodeSolved] = useState(120);
  const [systemDesignLevel, setSystemDesignLevel] = useState<'novice' | 'intermediate' | 'architect'>('novice');
  const [resumeQuantified, setResumeQuantified] = useState(false);
  const [mockInterviewsCount, setMockInterviewsCount] = useState(1);

  // Dynamic success score calculator
  const calculateSuccessScore = () => {
    let score = 0;
    // Leetcode solved: max 40 points
    score += Math.min((leetcodeSolved / 500) * 40, 40);

    // System design experience: max 40 points
    if (systemDesignLevel === 'architect') score += 40;
    else if (systemDesignLevel === 'intermediate') score += 25;
    else score += 10;

    // Resume completeness: max 10 points
    if (resumeQuantified) score += 10;

    // Mock interviews count: max 10 points
    score += Math.min((mockInterviewsCount / 10) * 10, 10);

    return Math.round(score);
  };

  const successScore = calculateSuccessScore();

  // Score tier text and formatting
  const getSuccessTier = (score: number) => {
    if (score >= 85) {
      return {
        label: "FAANG Ready 🚀",
        colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        barColor: "bg-emerald-600",
        description: "Your parameters are outstanding! Keep dry-tracing boundary cases, you are ready to ace staff level architecture and algorithmic rounds."
      };
    } else if (score >= 60) {
      return {
        label: "Strong Candidate 📈",
        colorClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
        barColor: "bg-indigo-600",
        description: "Solid prep base! Focus slightly on optimization boundary checks in DSA, and add 2-3 metric-driven business outcomes to your STAR narratives."
      };
    } else if (score >= 35) {
      return {
        label: "Aspirant Tier 🔍",
        colorClass: "bg-amber-50 text-amber-700 border-amber-200",
        barColor: "bg-amber-500",
        description: "Good foundations. Focus on scaling database partition rings, consistent hashing theory, and structuring behavioral stories with clear situations."
      };
    } else {
      return {
        label: "Beginner Stage 🌱",
        colorClass: "bg-slate-100 text-slate-700 border-slate-200",
        barColor: "bg-slate-500",
        description: "You're at the starting line. Try formatting your resume, solving basic array manipulation patterns, and booking a mock session for a personalized blueprint."
      };
    }
  };

  const tier = getSuccessTier(successScore);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-sans">
      <Navbar />

      {/* 1. PREMIUM SPLIT HERO SECTION */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-white border-b border-slate-100">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-50 blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-sky-50 blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Side: Copy */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase">
                <Award className="h-3.5 w-3.5" /> Verified Industry Mentorship
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                Ace Your Tech Rounds with <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">1:1 Mentorship</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-650 font-normal leading-relaxed max-w-xl">
                Get direct, high-fidelity mock interviews, real-time code dry-runs, and ATS resume audits with engineering leaders from Google, Meta, Uber, and Netflix.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-3">
                <Link
                  href="/login?role=student"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-150 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-250 transition-all duration-200 gap-2 cursor-pointer"
                >
                  Book Mock Interview
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 border border-slate-200/80 active:scale-98 transition-all duration-200"
                >
                  Meet the Founders
                </Link>
              </div>

              {/* Founder Mini Avatars Row */}
              <div className="pt-6 flex items-center gap-3.5 border-t border-slate-100">
                <div className="flex -space-x-3">
                  {['Akash', 'Prashu', 'Sumit', 'Rakshit'].map((name, i) => (
                    <div 
                      key={name} 
                      className={`h-9 w-9 rounded-full ring-2 ring-white flex items-center justify-center font-bold text-xs text-white shadow bg-gradient-to-tr ${
                        i === 0 ? 'from-indigo-500 to-indigo-600' :
                        i === 1 ? 'from-sky-500 to-sky-600' :
                        i === 2 ? 'from-teal-500 to-teal-600' : 'from-violet-500 to-violet-600'
                      }`}
                    >
                      {name.charAt(0)}
                    </div>
                  ))}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-850">Founded by Google & Meta Engineers</p>
                  <p className="text-slate-400">100% Client-Side Interactive Prep Suite</p>
                </div>
              </div>
            </div>

            {/* Right Side: Premium Graphics Display */}
            <div className="lg:col-span-6 animate-in fade-in duration-500 relative">
              <div className="relative rounded-[2.5rem] border border-slate-200/50 bg-slate-100 p-3 shadow-2xl shadow-slate-250 overflow-hidden group">
                {/* Inner image container */}
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] w-full bg-slate-900">
                  <img
                    src="/mentorship_session_clean.png"
                    alt="PeerPilott 1:1 Mock Interview Call Session"
                    className="object-cover w-full h-full transform group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                </div>

                {/* Floating Connection Status Badge */}
                <div className="absolute top-8 left-8 backdrop-blur-md bg-white/90 border border-white/60 p-4 rounded-3xl shadow-xl flex items-center gap-3.5 max-w-[240px] animate-fade-in hover:scale-102 transition-transform duration-300 select-none">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Match Confirmed</span>
                    <span className="text-xs font-black text-slate-800 block mt-0.5 leading-tight">Google & Meta Mentors</span>
                  </div>
                </div>

                {/* Floating Interview Slot Schedule Card (Generic Ex-FAANG Mentor) */}
                <div className="absolute bottom-8 right-8 backdrop-blur-md bg-slate-900/90 border border-slate-800/80 p-4.5 rounded-3xl shadow-2xl flex gap-3 max-w-[280px] hover:scale-102 transition-transform duration-300 select-none">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
                    M
                  </div>
                  <div className="text-left">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[10px] font-extrabold text-slate-200 leading-none">Meta Architect (Ex-Meta)</span>
                      <span className="text-[8px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded font-black border border-emerald-900/40 uppercase">LIVE ROOM</span>
                    </div>
                    <p className="text-slate-350 text-[10px] font-light mt-1.5 leading-normal">
                      &quot;Let&apos;s review system design caching and performance benchmarks.&quot;
                    </p>
                    <span className="text-[9px] font-bold text-indigo-350 block mt-1">Starting in 5 minutes &rarr;</span>
                  </div>
                </div>

                {/* Additional Rating Badge */}
                <div className="absolute bottom-8 left-8 backdrop-blur-md bg-white/90 border border-white/60 px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-1.5 hover:scale-102 transition-transform duration-300 select-none">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-black text-slate-800">4.95 / 5.0</span>
                  <span className="text-[9px] text-slate-400 font-semibold border-l border-slate-200 pl-1.5">700+ Sessions</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS INDICATORS SECTION */}
      <section className="py-12 border-b border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "700+", label: "Mock Rounds Completed", icon: <Video className="h-4.5 w-4.5 text-indigo-600" /> },
              { num: "4.95★", label: "Average Session Rating", icon: <Star className="h-4.5 w-4.5 fill-indigo-600 text-indigo-600" /> },
              { num: "98%", label: "Offer Placement Success", icon: <ShieldCheck className="h-4.5 w-4.5 text-indigo-600" /> },
              { num: "15 min", label: "Average Response SLA", icon: <Briefcase className="h-4.5 w-4.5 text-indigo-600" /> },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="p-5 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3.5 hover:shadow-md transition-shadow"
              >
                <div className="bg-indigo-50 p-2.5 rounded-2xl text-indigo-600 shrink-0">
                  {stat.icon}
                </div>
                <div className="text-left min-w-0">
                  <span className="text-2xl font-black text-slate-950 block leading-tight">{stat.num}</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5 truncate">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* 3. INTERACTIVE CUSTOM CURRICULUM BLUEPRINT BUILDER */}


      {/* 4. GAMIFIED "INTERVIEW SUCCESS ESTIMATOR" CALCULATOR WIDGET */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Preparation Diagnostic</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Evaluate Your Interview Readiness</h2>
            <p className="text-slate-650 leading-relaxed max-w-xl mx-auto font-light text-sm">
              Use our interactive diagnostic estimator to analyze your current prep status and view customized actionable roadmap tips instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Calculator input panel */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 text-left flex flex-col justify-between">
              
              <div className="space-y-6">
                {/* Solved Leetcode count slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>LeetCode Algorithms Solved</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-black">{leetcodeSolved === 500 ? "500+" : leetcodeSolved} solved</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="50"
                    value={leetcodeSolved}
                    onChange={(e) => setLeetcodeSolved(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                    <span>0 solved</span>
                    <span>250 solved</span>
                    <span>500+ solved</span>
                  </div>
                </div>

                {/* System design level button selector */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-700">System Design Practical Experience</span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'novice', label: 'Novice / Beginner', desc: 'Read basic blogs' },
                      { id: 'intermediate', label: 'Intermediate / Mid', desc: 'Understand SQL caching' },
                      { id: 'architect', label: 'System Architect', desc: 'Can design Consistent Hashing' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setSystemDesignLevel(lvl.id as any)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          systemDesignLevel === lvl.id
                            ? "border-indigo-600 bg-indigo-50/70 text-indigo-750 font-bold shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span className="text-xs block leading-tight">{lvl.label}</span>
                        <span className="text-[8px] text-slate-400 block mt-1 font-light">{lvl.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resume Quantified checkbox toggle */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-150">
                  <input
                    type="checkbox"
                    id="resumeCheck"
                    checked={resumeQuantified}
                    onChange={(e) => setResumeQuantified(e.target.checked)}
                    className="h-4.5 w-4.5 text-indigo-600 rounded border-slate-350 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="resumeCheck" className="text-xs text-slate-750 font-semibold cursor-pointer select-none">
                    My resume is quantified with measurable business output outcomes (e.g. percentages, latencies, dollars).
                  </label>
                </div>

                {/* Mock Interviews Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>1:1 High-Fidelity Mock Interviews Completed</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-black">{mockInterviewsCount === 10 ? "10+ rounds" : `${mockInterviewsCount} round(s)`}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={mockInterviewsCount}
                    onChange={(e) => setMockInterviewsCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-light flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-indigo-500" />
                <span>Adjust parameters to view estimated metrics diagnostics.</span>
              </div>
            </div>

            {/* Calculator result panel */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between text-left items-stretch relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1 w-full bg-indigo-600"></div>
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Estimated Readiness Profile</span>
                  <div className="flex justify-between items-baseline mt-1.5 flex-wrap gap-2">
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">Diagnostic Analysis</h3>
                    <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${tier.colorClass}`}>
                      {tier.label}
                    </span>
                  </div>
                </div>

                {/* Dynamic dial value */}
                <div className="flex items-center gap-4 py-3 border-y border-slate-105">
                  <div className="h-16 w-16 rounded-full border-4 border-slate-100 flex items-center justify-center font-black text-xl text-indigo-600 bg-indigo-50/20 shrink-0">
                    {successScore}%
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Success Score Rating</span>
                    <p className="text-xs text-slate-550 leading-relaxed font-light mt-1">Based on simulated recruiter filtration indices.</p>
                  </div>
                </div>

                {/* Diagnosis details */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Actionable Feedback Blueprint</span>
                  <p className="text-xs text-slate-650 leading-normal font-light">
                    {tier.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href="/login?role=student"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-6 py-4 bg-slate-950 hover:bg-indigo-600 text-white font-extrabold rounded-2xl text-xs transition-all shadow shadow-slate-900/10 cursor-pointer"
                >
                  Schedule Custom 1:1 Diagnostic Mock <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 5. VERIFIED STUDENT APPRAISALS & SLIDER FEEDBACK SECTION */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Premium Section Header with controls & tabs */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 text-left">
            <div className="space-y-3">
              <span className="text-xs font-bold text-indigo-650 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
                Student Appraisals
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Verified Success Stories
              </h2>
              <p className="text-slate-500 leading-relaxed max-w-xl font-light text-sm">
                Explore dynamic interview insights, preparation gaps, and outcomes.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Slider Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-655 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow hover:border-slate-300 active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-655 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow hover:border-slate-300 active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Slider Row */}
          <div className="relative overflow-hidden w-full px-1 py-4">
            <div 
              className="flex transition-transform duration-500 ease-out -mx-3"
              style={{ 
                transform: `translate3d(-${currentSlide * (windowWidth >= 768 ? 100 / 3 : 100)}%, 0, 0)` 
              }}
            >
              {studentFeedbacks.map((fb, idx) => (
                <div
                  key={idx}
                  className="w-full md:w-1/3 px-3 flex-shrink-0"
                >
                  <div className="bg-white border border-slate-150 rounded-3xl p-5.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left min-h-[220px] h-full">
                    <div className="space-y-3.5">
                      {/* Header: Avatar, Name, Company, Transition */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-9 w-9 rounded-xl bg-gradient-to-tr ${fb.avatarBg} text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0`}>
                            {fb.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-[12px] font-black text-slate-900 leading-none">{fb.studentName}</h4>
                            <span className="text-[9.5px] font-semibold text-slate-400 block mt-1">
                              {fb.originalRole}
                            </span>
                          </div>
                        </div>
                        
                        <span className="text-[9.5px] font-black text-indigo-650 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                          {fb.company}
                        </span>
                      </div>

                      {/* Transition arrow block */}
                      <div className="text-[10px] leading-tight text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Landed:</span>
                        <strong className="text-slate-800 font-black">{fb.placedRole}</strong>
                      </div>

                      {/* Concise quote with prep gap inline prefix */}
                      <p className="text-[11.5px] leading-relaxed text-slate-650 font-light">
                        <span className="text-[9px] text-amber-700 font-extrabold uppercase bg-amber-50 px-1 py-0.5 rounded mr-1">Gap: {fb.prepGap.split(' ').slice(0, 3).join(' ')}...</span>
                        &ldquo;{fb.sessionOutcome}&rdquo;
                      </p>
                    </div>

                    {/* Card bottom: stars and sessions count */}
                    <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(fb.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                        ))}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                        {fb.sessionsCount} sessions
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Indicator Dots */}
          {maxSlide > 0 && (
            <div className="flex justify-center items-center gap-1.5 pt-6">
              {[...Array(maxSlide + 1)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx 
                      ? "w-6 bg-indigo-600" 
                      : "w-2.5 bg-slate-200 hover:bg-slate-350"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Small bottom action footer */}
          <div className="pt-10 text-center">
            <Link
              href="/login?role=student"
              className="inline-flex items-center gap-1.5 px-6 py-3.5 bg-slate-950 hover:bg-indigo-650 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-slate-900/10 cursor-pointer"
            >
              Start Your Calibration Loop <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-t-[3.5rem] relative overflow-hidden shadow-2xl">
        {/* background dots */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Ace Your Next Interview?</h2>
          <p className="text-slate-305 text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-light">
            Don&apos;t practice in isolation. Receive dynamic grading blueprints and structured evaluations from active evaluators who run corporate loop assessments daily.
          </p>
          <div className="pt-2">
            <Link
              href="/login?role=student"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-950 font-extrabold rounded-2xl hover:bg-slate-100 hover:scale-102 transition-all duration-200 gap-2 cursor-pointer shadow-xl"
            >
              Sign Up as Student
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
