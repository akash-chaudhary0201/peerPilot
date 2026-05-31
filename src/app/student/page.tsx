"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mentors, Mentor } from "@/data/mentors";
import { initialBookings, Booking, Feedback } from "@/data/bookings";
import {
  LayoutDashboard,
  Search,
  CalendarDays,
  History,
  User,
  GraduationCap,
  LogOut,
  Star,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BookmarkCheck,
  Video,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Github,
  Linkedin,
  Globe,
  Award,
  Building,
  Calendar,
  Briefcase,
  Code,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  CalendarCheck,
  UserCheck,
  XCircle,
  VideoOff,
  Printer,
  Share2,
  FileDown,
  Check
} from "lucide-react";

export default function StudentPortal() {
  const router = useRouter();
  const [session, setSession] = useState<{ email: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'find-mentor' | 'history' | 'profile'>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [localMentors, setLocalMentors] = useState<Mentor[]>([]);
  
  // --- REDESIGNED INTERACTIVE BOOKING MODAL STATES ---
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [selectedDateStr, setSelectedDateStr] = useState(""); // "YYYY-MM-DD"
  const [selectedDayName, setSelectedDayName] = useState(""); // e.g. "Monday"
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // e.g. "10:00 AM"
  const [selectedTopic, setSelectedTopic] = useState<string>("DSA Mock Interview");
  const [bookingNotes, setBookingNotes] = useState("");
  
  // Pricing states inside booking modal
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>("Starter");
  const [selectedPricePaid, setSelectedPricePaid] = useState<number>(299);

  // Student manual payment verification modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [paymentDateInput, setPaymentDateInput] = useState("");
  const [paymentTxIdInput, setPaymentTxIdInput] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [successToast, setSuccessToast] = useState("");

  // States for Mentor Filtering
  const [mentorFilter, setMentorFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Advanced Sort/Filter states
  const [selectedSkillsFilter, setSelectedSkillsFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "sessions">("rating");

  // --- ADDED INTELLIGENCE: LOGS SUB-TAB FILTER ---
  const [historyFilter, setHistoryFilter] = useState<"All" | "Scheduled" | "Completed" | "Declined">("All");

  // States for Resume Checker
  const [resumeText, setResumeText] = useState("");
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [resumeFeedback, setResumeFeedback] = useState<string[]>([]);
  const [resumeAnalyzing, setResumeAnalyzing] = useState(false);
  const [resumeMatchedSkills, setResumeMatchedSkills] = useState<string[]>([]);
  const [resumeMissingSkills, setResumeMissingSkills] = useState<string[]>([]);
  const [resumeWeakPhrases, setResumeWeakPhrases] = useState<string[]>([]);
  const [resumeMetricsFound, setResumeMetricsFound] = useState<string[]>([]);

  // States for Feedback Modal
  const [activeFeedbackBooking, setActiveFeedbackBooking] = useState<Booking | null>(null);
  const [activeFeedbackTab, setActiveFeedbackTab] = useState<'scores' | 'comments' | 'roadmap'>('scores');
  const [isExporting, setIsExporting] = useState(false);

  // Student rating/feedback about mentor states
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [ratingHoverValue, setRatingHoverValue] = useState<number | null>(null);
  const [ratingComments, setRatingComments] = useState<string>("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const openRatingModal = (booking: Booking) => {
    setRatingBooking(booking);
    setRatingValue(5);
    setRatingHoverValue(null);
    setRatingComments("");
    setIsRatingModalOpen(true);
  };

  const handleSubmittingRating = async () => {
    if (!ratingBooking || !session) return;
    setIsSubmittingRating(true);
    try {
      const res = await fetch(`/api/student/bookings/${ratingBooking.id}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify({
          rating: ratingValue,
          comments: ratingComments,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to submit rating.");
        setIsSubmittingRating(false);
        return;
      }

      await fetchDashboardData(session.email);
      setIsRatingModalOpen(false);
      setRatingBooking(null);
      setIsSubmittingRating(false);
      setSuccessToast("Thank you! Your feedback for the mentor has been submitted.");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err) {
      console.error(err);
      alert("Error submitting rating.");
      setIsSubmittingRating(false);
    }
  };

  // Goals List State
  const [goals, setGoals] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: "1", text: "Complete Trees and Graphs mock evaluation", completed: false },
    { id: "2", text: "Refine STAR behavioral stories with Sumit", completed: true },
    { id: "3", text: "Achieve ATS Resume Score > 80", completed: false }
  ]);
  const [newGoalText, setNewGoalText] = useState("");
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);

  // Activity Log State
  const [activities, setActivities] = useState<{ id: string; text: string; time: string; type: string }[]>([
    { id: "act-1", text: "Created Student Portal account session", time: "Just Now", type: "system" },
    { id: "act-2", text: "ATS Resume evaluation completed (Score: 78)", time: "2 hours ago", type: "resume" },
    { id: "act-3", text: "Mock HR Interview booked with Sumit", time: "1 day ago", type: "booking" }
  ]);

  // Student Profile State
  const [studentProfile, setStudentProfile] = useState({
    name: "Akash Gupta",
    email: "akash@gmail.com",
    phone: "+91 98765 43210",
    githubUrl: "https://github.com/akash-gupta",
    linkedinUrl: "https://linkedin.com/in/akash-gupta",
    portfolioUrl: "https://akashgupta.dev",
    
    college: "Indian Institute of Information Technology (IIIT)",
    degree: "B.Tech in Computer Science & Engineering",
    gradYear: "2026",
    gpa: "8.8/10",
    
    targetRole: "Frontend Software Engineer",
    targetCompanies: "Google, Meta, Netflix, Uber",
    preferredLocation: "Bengaluru / Remote",
    searchStatus: "Actively Looking",
    
    yoe: "Fresher / New Grad",
    languages: "JavaScript, TypeScript, HTML/CSS, Python",
    frameworks: "React, Next.js, Redux, Tailwind CSS, Node.js",
    
    project1Title: "Interactive Dev Workspace Analytics",
    project1Desc: "Built a real-time tracking workspace dashboard supporting state persistence, ATS evaluations, and mock whiteboard canvases.",
    project1Tech: "Next.js, Tailwind v4, React Hooks, LocalStorage",
    
    project2Title: "Low Latency API Orchestrator",
    project2Desc: "Designed an API microservice that caches request blocks using Redis cache layers and stores transactional data logs.",
    project2Tech: "TypeScript, Express, Redis, PostgreSQL",
    projects: [
      {
        title: "Interactive Dev Workspace Analytics",
        desc: "Built a real-time tracking workspace dashboard supporting state persistence, ATS evaluations, and mock whiteboard canvases.",
        tech: "Next.js, Tailwind v4, React Hooks, LocalStorage"
      },
      {
        title: "Low Latency API Orchestrator",
        desc: "Designed an API microservice that caches request blocks using Redis cache layers and stores transactional data logs.",
        tech: "TypeScript, Express, Redis, PostgreSQL"
      }
    ] as any
  });

  const fetchDashboardData = async (email: string) => {
    try {
      const headers = { "x-user-email": email };

      // 1. Profile
      const profileRes = await fetch(`/api/student/profile?email=${email}`, { headers });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (!profileData.projects || !Array.isArray(profileData.projects)) {
          const legacyProjects = [];
          if (profileData.project1Title) {
            legacyProjects.push({
              title: profileData.project1Title,
              desc: profileData.project1Desc || "",
              tech: profileData.project1Tech || ""
            });
          }
          if (profileData.project2Title) {
            legacyProjects.push({
              title: profileData.project2Title,
              desc: profileData.project2Desc || "",
              tech: profileData.project2Tech || ""
            });
          }
          profileData.projects = legacyProjects;
        }
        setStudentProfile(profileData);
      }

      // 2. Bookings
      const bookingsRes = await fetch(`/api/student/bookings?email=${email}`, { headers });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }

      // 3. Mentors
      const mentorsRes = await fetch(`/api/mentors`);
      if (mentorsRes.ok) {
        const mentorsData = await mentorsRes.json();
        setLocalMentors(mentorsData);
      }

      // 4. Goals
      const goalsRes = await fetch(`/api/student/goals?email=${email}`, { headers });
      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData);
      }

      // 5. Activities
      const activitiesRes = await fetch(`/api/student/activities?email=${email}`, { headers });
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData);
      }

      // 6. Pricing plans
      const pricingRes = await fetch(`/api/pricing`);
      if (pricingRes.ok) {
        const pricingData = await pricingRes.json();
        setPricingPlans(pricingData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const logActivity = async (text: string, type: string) => {
    if (!session) return;
    try {
      const res = await fetch("/api/student/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify({ text, type }),
      });
      if (res.ok) {
        const activitiesRes = await fetch(`/api/student/activities?email=${session.email}`, {
          headers: { "x-user-email": session.email }
        });
        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData);
        }
      }
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  // Verify Authentication & Initialize Data
  useEffect(() => {
    const userSession = localStorage.getItem("user_session");
    if (!userSession) {
      router.push("/login");
      return;
    }
    
    try {
      const parsedSession = JSON.parse(userSession);
      if (parsedSession.role === "admin") {
        router.push("/admin");
        return;
      }
      if (parsedSession.role !== "student") {
        router.push("/mentor");
        return;
      }
      setSession(parsedSession);
      fetchDashboardData(parsedSession.email);
    } catch (e) {
      router.push("/login");
      return;
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    document.cookie = "user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  // Booking Form Submission from Modal
  const handleConfirmBooking = async () => {
    if (!bookingMentor || !selectedDateStr || !selectedTimeSlot || !session) {
      alert("Missing slot variables.");
      return;
    }

    try {
      const res = await fetch("/api/student/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify({
          mentorId: bookingMentor.id,
          sessionType: selectedTopic,
          date: selectedDateStr,
          timeSlot: selectedTimeSlot,
          notes: bookingNotes,
          priceTier: selectedPriceTier,
          pricePaid: selectedPricePaid,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Booking failed.");
        return;
      }

      await fetchDashboardData(session.email);

      // Close Modal & Reset
      setIsBookingModalOpen(false);
      setBookingMentor(null);
      setBookingStep(1);
      setSelectedDateStr("");
      setSelectedDayName("");
      setSelectedTimeSlot("");
      setBookingNotes("");
      
      setSuccessToast("Booking requested successfully! Waiting for mentor confirmation.");
      setActiveTab("history");

      setTimeout(() => {
        setSuccessToast("");
      }, 5000);
    } catch (error) {
      console.error(error);
      alert("An error occurred during booking.");
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentBooking || !paymentDateInput.trim() || !paymentTxIdInput.trim() || !session) {
      setPaymentError("Please fill out all required fields.");
      return;
    }

    setPaymentSubmitting(true);
    setPaymentError("");

    try {
      const res = await fetch(`/api/student/bookings/${paymentBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify({
          paymentDate: paymentDateInput,
          transactionId: paymentTxIdInput,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setPaymentError(data.error || "Submission failed.");
        setPaymentSubmitting(false);
        return;
      }

      await fetchDashboardData(session.email);
      setIsPaymentModalOpen(false);
      setPaymentBooking(null);
      setPaymentDateInput("");
      setPaymentTxIdInput("");
      setPaymentSubmitting(false);

      setSuccessToast("Payment details submitted successfully! Awaiting verification.");
      setTimeout(() => setSuccessToast(""), 5500);
    } catch (err) {
      console.error(err);
      setPaymentError("An error occurred during submission.");
      setPaymentSubmitting(false);
    }
  };

  // Cancel Booking Helper
  const handleCancelBooking = async (id: string) => {
    const target = bookings.find(b => b.id === id);
    if (!target || !session) return;

    if (confirm(`Are you sure you want to cancel your session with ${target.mentorName}?`)) {
      try {
        const res = await fetch(`/api/student/bookings/${id}`, {
          method: "DELETE",
          headers: {
            "x-user-email": session.email,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "Cancellation failed.");
          return;
        }

        await fetchDashboardData(session.email);
        setSuccessToast("Session booking request cancelled.");
        setTimeout(() => setSuccessToast(""), 4000);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Open booking modal for a specific mentor
  const openBookingModal = (mentor: Mentor) => {
    setBookingMentor(mentor);
    setBookingStep(1);
    setSelectedDateStr("");
    setSelectedDayName("");
    setSelectedTimeSlot("");
    setSelectedTopic(mentor.skills && mentor.skills.length > 0 ? mentor.skills[0] : "DSA Mock Interview");
    setBookingNotes("");
    if (pricingPlans && pricingPlans.length > 0) {
      setSelectedPriceTier(pricingPlans[0].name);
      setSelectedPricePaid(pricingPlans[0].price);
    } else {
      setSelectedPriceTier("Starter Session");
      setSelectedPricePaid(299);
    }
    setIsBookingModalOpen(true);
  };

  // Generate simulated calendar dates for next 14 days
  const getNext14Days = (mentor: Mentor) => {
    const dates = [];
    const today = new Date();
    
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);

      const dayOfWeek = dayNames[nextDate.getDay()];
      const dateKey = nextDate.toISOString().split("T")[0]; // YYYY-MM-DD

      const dbMentor = localMentors.find(m => m.id === mentor.id) || mentor;
      const isAvailable = dbMentor.availableDays.includes(dayOfWeek) && 
                          !(dbMentor.blockedDates?.includes(dateKey));

      dates.push({
        dateStr: dateKey,
        dayOfMonth: nextDate.getDate(),
        monthLabel: monthNames[nextDate.getMonth()],
        dayOfWeek,
        isAvailable
      });
    }

    return dates;
  };

  // Analyze Resume Mock Tool
  const handleAnalyzeResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setResumeAnalyzing(true);
    setResumeScore(null);

    setTimeout(() => {
      const textLower = resumeText.toLowerCase();

      // 1. Core Profile Target Technologies Match
      const profileSkills: string[] = [];
      if (studentProfile.languages) {
        studentProfile.languages.split(",").forEach(s => profileSkills.push(s.trim()));
      }
      if (studentProfile.frameworks) {
        studentProfile.frameworks.split(",").forEach(s => profileSkills.push(s.trim()));
      }
      if (studentProfile.targetRole) {
        profileSkills.push(studentProfile.targetRole);
      }
      
      const targetSkills = Array.from(new Set(profileSkills.filter(s => s.length > 0)));
      const matched: string[] = [];
      const missing: string[] = [];

      targetSkills.forEach(skill => {
        if (textLower.includes(skill.toLowerCase())) {
          matched.push(skill);
        } else {
          missing.push(skill);
        }
      });

      // 2. Action Verbs Audit
      const strongVerbs = [
        "designed", "architected", "engineered", "optimized", "scaled", "implemented", 
        "spearheaded", "delivered", "integrated", "reduced", "increased", "led", 
        "created", "built", "developed", "refactored", "orchestrated", "automated"
      ];
      
      const weakPhrases = [
        "helped", "assisted", "worked on", "part of", "responsible for", "participated in"
      ];

      const strongFound = strongVerbs.filter(verb => textLower.includes(verb));
      const weakFound = weakPhrases.filter(phrase => textLower.includes(phrase));

      // 3. Quantitative Impact Metrics Check
      const metricsFound: string[] = [];
      const percentRegex = /\b\d+%\b/g;
      const dollarRegex = /\$\d+[\d,]*\b/g;
      const scalingRegex = /\b\d+\s*(ms|x|k|m|million|users|req|requests|tps|fps)\b/gi;
      
      const percentMatches = resumeText.match(percentRegex) || [];
      const dollarMatches = resumeText.match(dollarRegex) || [];
      const scalingMatches = resumeText.match(scalingRegex) || [];

      percentMatches.forEach(m => metricsFound.push(m));
      dollarMatches.forEach(m => metricsFound.push(m));
      scalingMatches.forEach(m => metricsFound.push(m));

      const uniqueMetrics = Array.from(new Set(metricsFound)).slice(0, 5);

      // 4. Score Calculation
      let score = 55; // base rating

      // Keyword match rating (max 25 points)
      if (targetSkills.length > 0) {
        const ratio = matched.length / targetSkills.length;
        score += Math.round(ratio * 25);
      } else {
        score += 20;
      }

      // Strong verbs points (max 10 points)
      score += Math.min(strongFound.length * 2, 10);

      // Weak phrases penalty (max -10 points)
      score -= Math.min(weakFound.length * 2, 10);

      // Metrics/Quantifiers points (max 20 points)
      score += Math.min(metricsFound.length * 4, 20);

      // Cap bounds
      score = Math.max(35, Math.min(score, 99));

      // 5. Suggestions
      const suggestions: string[] = [];
      if (missing.length > 0) {
        suggestions.push(`Missing profile technologies: Add "${missing.slice(0, 3).join(", ")}" to align with your dossier goals.`);
      }
      if (weakFound.length > 0) {
        suggestions.push(`Passive styling: Replace "${weakFound.slice(0, 2).join(", ")}" with strong results-driven verbs (e.g. "Delivered").`);
      }
      if (metricsFound.length < 3) {
        suggestions.push("Quantified metrics missing: Detail bullet points with speed, scale, or business output metrics (e.g., 'scaled systems by 40%').");
      }
      if (!textLower.includes("http://") && !textLower.includes("https://")) {
        suggestions.push("Missing references: Put link pointers to GitHub or LinkedIn to pass verification check rounds.");
      }
      if (suggestions.length === 0) {
        suggestions.push("Excellent structure layout, keyword compliance, and quantification standards verified!");
      }

      // Commit changes to state
      setResumeScore(score);
      setResumeMatchedSkills(matched);
      setResumeMissingSkills(missing);
      setResumeWeakPhrases(weakFound);
      setResumeMetricsFound(uniqueMetrics);
      setResumeFeedback(suggestions);
      setResumeAnalyzing(false);

      // Save to localStorage
      localStorage.setItem("student_ats_score", score.toString());
      localStorage.setItem("student_ats_analysis", JSON.stringify({
        matched,
        missing,
        weakPhrases: weakFound,
        metricsFound: uniqueMetrics,
        feedback: suggestions
      }));
      
      logActivity(`ATS Resume scored: ${score}/100`, "resume");
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setResumeText(text);
        setSuccessToast(`Successfully loaded text from ${file.name}!`);
        setTimeout(() => setSuccessToast(""), 3000);
      }
    };
    reader.readAsText(file);
  };

  // Profile save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      const projectsArray = (studentProfile as any).projects || [];
      const p1 = projectsArray[0] || {};
      const p2 = projectsArray[1] || {};

      const payload = {
        ...studentProfile,
        project1Title: p1.title || null,
        project1Desc: p1.desc || null,
        project1Tech: p1.tech || null,
        project2Title: p2.title || null,
        project2Desc: p2.desc || null,
        project2Tech: p2.tech || null,
      };

      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save profile.");
        return;
      }

      await fetchDashboardData(session.email);
      setSuccessToast("Profile settings saved successfully!");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (error) {
      console.error(error);
    }
  };

  // Goals CRUD
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim() || !session) return;

    try {
      const res = await fetch("/api/student/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify({ text: newGoalText }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to add goal.");
        return;
      }

      setNewGoalText("");
      await fetchDashboardData(session.email);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleGoal = async (id: string) => {
    if (!session) return;

    try {
      const res = await fetch(`/api/student/goals/${id}`, {
        method: "PUT",
        headers: {
          "x-user-email": session.email,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update goal.");
        return;
      }

      await fetchDashboardData(session.email);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!session) return;

    try {
      const res = await fetch(`/api/student/goals/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-email": session.email,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete goal.");
        return;
      }

      await fetchDashboardData(session.email);
    } catch (error) {
      console.error(error);
    }
  };

  // Dynamically extract all unique skills from localMentors
  const allAvailableSkills = Array.from(
    new Set(localMentors.flatMap(m => m.skills || []))
  ).filter(Boolean).sort();

  // Category filters
  const filteredMentors = localMentors.filter(mentor => {
    const matchesCategory = mentorFilter === "All" || mentor.specialty === mentorFilter;
    
    // Multi-filtration by selected skills (mentor must possess all of the selected skills)
    const matchesSkills = selectedSkillsFilter.length === 0 || 
      selectedSkillsFilter.every(skill => 
        (mentor.skills || []).map((s: string) => s.toLowerCase()).includes(skill.toLowerCase())
      );

    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (mentor.skills || []).some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSkills && matchesSearch;
  });

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "experience") {
      const expA = parseInt(a.experience) || 0;
      const expB = parseInt(b.experience) || 0;
      return expB - expA;
    }
    if (sortBy === "sessions") {
      return b.completedSessions - a.completedSessions;
    }
    return 0;
  });

  // --- HISTORY FILTERING LOGIC (ADDED SUB-TABS FILTER) ---
  const filteredHistory = bookings.filter(b => {
    if (historyFilter === "Scheduled") return b.status === "Pending" || b.status === "Approved";
    if (historyFilter === "Completed") return b.status === "Completed";
    if (historyFilter === "Declined") return b.status === "Rejected";
    return true; // All
  });

  // Calculate profile completion rate
  const calculateProfileCompletion = () => {
    const fields = [
      studentProfile.name, studentProfile.phone, studentProfile.githubUrl, 
      studentProfile.linkedinUrl, studentProfile.portfolioUrl, studentProfile.college,
      studentProfile.degree, studentProfile.gradYear, studentProfile.gpa,
      studentProfile.targetRole, studentProfile.targetCompanies, studentProfile.preferredLocation,
      studentProfile.languages, studentProfile.frameworks
    ];
    const filledFields = fields.filter(f => f && f.trim() !== "");
    const projectsArray = (studentProfile as any).projects || [];
    const totalPossibleFields = fields.length + 6; // 6 fields for up to 2 projects
    let actualFilled = filledFields.length;
    projectsArray.slice(0, 2).forEach((proj: any) => {
      if (proj.title && proj.title.trim() !== "") actualFilled++;
      if (proj.desc && proj.desc.trim() !== "") actualFilled++;
      if (proj.tech && proj.tech.trim() !== "") actualFilled++;
    });
    return Math.round((actualFilled / totalPossibleFields) * 100);
  };

  // Calculate Interview Readiness Score
  const calculateInterviewReadiness = () => {
    let base = 60;
    const completed = bookings.filter(b => b.status === "Completed");
    if (completed.length > 0) {
      let mockSum = 0;
      completed.forEach(b => {
        if (b.feedback) {
          const letter = b.feedback.dsaScore.charAt(0);
          if (letter === 'A') mockSum += 95;
          else if (letter === 'B') mockSum += 80;
          else mockSum += 65;
        } else {
          mockSum += 75;
        }
      });
      base += Math.round((mockSum / completed.length) * 0.2);
    }

    if (resumeScore) {
      base += Math.round(resumeScore * 0.15);
    }

    const completedGoals = goals.filter(g => g.completed).length;
    if (goals.length > 0) {
      base += Math.round((completedGoals / goals.length) * 5);
    }

    return Math.min(base, 100);
  };

  // Weekdays Helper for Schedule indicator card
  const weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const getFullDayName = (short: string) => {
    const mapping: Record<string, string> = {
      "Mon": "Monday",
      "Tue": "Tuesday",
      "Wed": "Wednesday",
      "Thu": "Thursday",
      "Fri": "Friday",
      "Sat": "Saturday",
      "Sun": "Sunday"
    };
    return mapping[short];
  };

  // Topic Icons helper for History Cards (ADDED INTELLIGENCE)
  const getTopicIcon = (topic: Booking['sessionType']) => {
    if (topic === "DSA Mock Interview") return <Code className="h-5 w-5 text-indigo-600" />;
    if (topic === "System Design Mock") return <Building className="h-5 w-5 text-sky-600" />;
    if (topic === "HR Mock Interview") return <UserCheck className="h-5 w-5 text-teal-600" />;
    return <FileText className="h-5 w-5 text-amber-600" />;
  };

  // Grade mapping helper for visual meters
  const getGradeDetails = (grade: string | undefined) => {
    if (!grade || grade === "N/A" || grade === "n/a") {
      return {
        percentage: 0,
        color: "bg-slate-50 text-slate-400 border-slate-200",
        barColor: "bg-slate-200",
        status: "Not Evaluated",
        textColor: "text-slate-400"
      };
    }
    const cleanGrade = grade.trim().toUpperCase();
    if (cleanGrade.startsWith("A")) {
      return {
        percentage: cleanGrade === "A+" ? 100 : cleanGrade === "A" ? 95 : 90,
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        barColor: "bg-emerald-500",
        status: "Excellent Capability",
        textColor: "text-emerald-700"
      };
    }
    if (cleanGrade.startsWith("B")) {
      return {
        percentage: cleanGrade === "B+" ? 85 : cleanGrade === "B" ? 80 : 75,
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        barColor: "bg-indigo-500",
        status: "Proficient Skill",
        textColor: "text-indigo-700"
      };
    }
    if (cleanGrade.startsWith("C")) {
      return {
        percentage: cleanGrade === "C+" ? 65 : cleanGrade === "C" ? 60 : 55,
        color: "bg-amber-50 text-amber-700 border-amber-200",
        barColor: "bg-amber-500",
        status: "Developing Skill",
        textColor: "text-amber-700"
      };
    }
    return {
      percentage: 45,
      color: "bg-rose-50 text-rose-700 border-rose-200",
      barColor: "bg-rose-500",
      status: "Needs Support",
      textColor: "text-rose-700"
    };
  };

  // Generate actionable tasks from session grades
  const getRoadmapTasks = (booking: Booking) => {
    const tasks: { text: string; details: string; type: string }[] = [];
    const dsa = booking.feedback?.dsaScore || "N/A";
    const system = booking.feedback?.systemDesignScore || "N/A";
    const comm = booking.feedback?.communicationScore || "N/A";

    if (dsa !== "N/A") {
      const cleanDsa = dsa.trim().toUpperCase();
      if (cleanDsa.startsWith("A")) {
        tasks.push({
          text: "Practice speed coding & hard DP edge cases",
          details: "Maintain optimization standards. Focus on LeetCode hard problems on graphs and dynamic programming.",
          type: "dsa"
        });
      } else {
        tasks.push({
          text: "Review core binary search, trees & graph traversals",
          details: "Address boundary checks and time/space complexity optimization. Practice dry running.",
          type: "dsa"
        });
      }
    }

    if (system !== "N/A") {
      const cleanSystem = system.trim().toUpperCase();
      if (cleanSystem.startsWith("A")) {
        tasks.push({
          text: "Design deep dives: microservices & global consensus",
          details: "Explore raft consensus, distributed locking databases, and ring architecture under partition failure.",
          type: "system"
        });
      } else {
        tasks.push({
          text: "Understand load balancers, rate limiters, caching layers",
          details: "Study cache eviction (LRU/LFU), horizontal partitioning, system bottlenecks, and failure nodes.",
          type: "system"
        });
      }
    } else if (booking.sessionType === "System Design Mock") {
      tasks.push({
        text: "Initialize fundamental system scalability study",
        details: "Focus on vertical vs horizontal scaling, load balancer algorithms, and database metrics.",
        type: "system"
      });
    }

    if (comm !== "N/A") {
      const cleanComm = comm.trim().toUpperCase();
      if (cleanComm.startsWith("A")) {
        tasks.push({
          text: "Refine leadership STAR delivery constraints",
          details: "Draft stories focusing on direct business metric impacts, trade-off decisions, and conflict pushback.",
          type: "behavioral"
        });
      } else {
        tasks.push({
          text: "Structure response using Situation-Task-Action-Result format",
          details: "Structure action steps clearly. Ensure each story lists the exact engineering role you played and outcome details.",
          type: "behavioral"
        });
      }
    }

    tasks.push({
      text: "Book target company simulation run",
      details: `Schedule another round with ${booking.mentorName} or alternate panelists like Rakshit/Sumit to verify feedback fixes.`,
      type: "general"
    });

    return tasks;
  };

  // Actions
  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setSuccessToast("Assessment report PDF compiled and downloaded successfully!");
      setTimeout(() => setSuccessToast(""), 4000);
    }, 2000);
  };

  const handleShareReport = () => {
    setSuccessToast("Assessment scorecard link copied to clipboard! Ready to share on LinkedIn.");
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-bounce">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                PeerPilott <span className="text-indigo-600">Portal</span>
              </span>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Overview Dashboard
              </button>
              <button
                onClick={() => setActiveTab("find-mentor")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "find-mentor"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Search className="h-4 w-4" />
                Find Mentors
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "history"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <History className="h-4 w-4" />
                My Booking Logs
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "profile"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <User className="h-4 w-4" />
                My Profile Section
              </button>
            </nav>
          </div>

          <div className="p-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-indigo-500 to-indigo-600 h-9 w-9 rounded-full text-white flex items-center justify-center font-bold text-sm">
                {studentProfile.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{studentProfile.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{studentProfile.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto w-full flex flex-col justify-start">
          
          {/* Top Header Bar with Logout */}
          <div className="flex justify-between items-center pb-5 border-b border-slate-200/60 mb-8 bg-transparent shrink-0">
            <div>
              <span className="text-[10px] bg-slate-900 text-slate-200 border border-slate-800 px-2.5 py-1 rounded-xl font-bold uppercase tracking-wider">
                Student Workspace Mode
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-slate-655 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm animate-in fade-in"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Workspace</h1>
                  <p className="text-slate-500 text-sm mt-1">Acclerate your metrics, plan goals, check resume ATS matches, and coordinate mocks.</p>
                </div>
                
                {/* Profile completeness bar */}
                <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm shrink-0 flex items-center gap-3">
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Profile Completion</span>
                    <span className="text-xs font-extrabold text-slate-800">{calculateProfileCompletion()}% Complete</span>
                  </div>
                  <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${calculateProfileCompletion()}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Total Mocks</span>
                    <span className="text-lg font-extrabold text-slate-950 block">{bookings.length} sessions</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Upcoming Mock</span>
                    <span className="text-lg font-extrabold text-slate-950 block">
                      {bookings.filter(b => b.status === 'Approved' || b.status === 'Pending').length} scheduled
                    </span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Resume Score</span>
                    <span className="text-lg font-extrabold text-slate-950 block">
                      {resumeScore ? `${resumeScore}/100` : "Unchecked"}
                    </span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Interview Readiness</span>
                    <span className="text-lg font-extrabold text-slate-950 block">
                      {calculateInterviewReadiness()}% Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-grid layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMN 1 & 2: Resume Check and Roadmap */}
                <div className="lg:col-span-2 space-y-8">
                  {/* ATS Checker */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-700">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Interactive ATS Resume Checker</h3>
                      </div>
                      
                      <label className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0">
                        <FileDown className="h-3.5 w-3.5" /> Upload TXT/MD
                        <input 
                          type="file" 
                          accept=".txt,.md" 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Copy/paste your resume content or upload a plain text/markdown file. Our system analyzes technology densities, strong results-driven verbs, weak phrasing, and numerical metrics alignment.
                    </p>

                    <form onSubmit={handleAnalyzeResume} className="space-y-4">
                      <textarea
                        rows={5}
                        required
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume text here (e.g. Experience: Developed React application, optimized load times by 40% using Next.js caching...)"
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-[11px] font-mono leading-relaxed"
                      />
                      <button
                        type="submit"
                        disabled={resumeAnalyzing}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-950 text-white hover:bg-indigo-600 font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                      >
                        {resumeAnalyzing ? (
                          <>
                            <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full shrink-0"></span>
                            Analyzing Text Matrices...
                          </>
                        ) : (
                          "Analyze Resume Text"
                        )}
                      </button>
                    </form>

                    {resumeScore !== null && (
                      <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 animate-in fade-in duration-200">
                        
                        {/* Dial Match Rating */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Match Score</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-black text-slate-900">{resumeScore}</span>
                              <span className="text-sm font-bold text-indigo-600">/ 100 points</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status Report</span>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                              resumeScore >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              resumeScore >= 65 ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                              "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {resumeScore >= 80 ? "Excellent Match" : resumeScore >= 65 ? "Moderate Alignment" : "Needs Optimization"}
                            </span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1.5">
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                resumeScore >= 80 ? "bg-emerald-500" :
                                resumeScore >= 65 ? "bg-indigo-500" :
                                "bg-rose-500"
                              }`}
                              style={{ width: `${resumeScore}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          
                          {/* Column 1: Keywords Density */}
                          <div className="p-4 bg-white border border-slate-150 rounded-2xl flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Skills & Tech Density</span>
                              
                              <div className="mt-3 space-y-3">
                                <div>
                                  <span className="text-[8px] font-bold text-emerald-600 uppercase block mb-1">Matched Target Skills ({resumeMatchedSkills.length})</span>
                                  {resumeMatchedSkills.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {resumeMatchedSkills.map(skill => (
                                        <span key={skill} className="text-[8px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-[9px] text-slate-400 block font-normal">None found.</span>
                                  )}
                                </div>

                                <div>
                                  <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Missing Target Skills ({resumeMissingSkills.length})</span>
                                  {resumeMissingSkills.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {resumeMissingSkills.map(skill => (
                                        <span key={skill} className="text-[8px] font-bold bg-slate-50 text-slate-400 line-through px-1.5 py-0.5 rounded border border-slate-200">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-[9px] text-slate-400 block font-normal">All match.</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Column 2: Verbs Audit */}
                          <div className="p-4 bg-white border border-slate-150 rounded-2xl flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Action Verbs Audit</span>
                              
                              <div className="mt-3 space-y-3">
                                <div>
                                  <span className="text-[8px] font-bold text-indigo-600 uppercase block mb-1">Strong verbs found</span>
                                  {resumeText.toLowerCase().match(/\b(designed|architected|engineered|optimized|scaled|implemented|spearheaded|delivered|integrated|reduced|increased|led|created|built|developed|refactored|orchestrated|automated)\b/g) ? (
                                    <div className="flex flex-wrap gap-1">
                                      {Array.from(new Set(resumeText.toLowerCase().match(/\b(designed|architected|engineered|optimized|scaled|implemented|spearheaded|delivered|integrated|reduced|increased|led|created|built|developed|refactored|orchestrated|automated)\b/g))).slice(0, 5).map(verb => (
                                        <span key={verb} className="text-[8px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                                          {verb}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-[9px] text-rose-500 block font-bold">No strong action verbs.</span>
                                  )}
                                </div>

                                <div>
                                  <span className="text-[8px] font-bold text-rose-600 uppercase block mb-1">Passive phrases flagged</span>
                                  {resumeWeakPhrases.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {resumeWeakPhrases.map(phrase => (
                                        <span key={phrase} className="text-[8px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-100">
                                          {phrase}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-[9px] text-emerald-600 block font-bold">0 passive verbs found!</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Column 3: Impact Metrics */}
                          <div className="p-4 bg-white border border-slate-150 rounded-2xl flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Quantification & scale</span>
                              
                              <div className="mt-3 space-y-2.5">
                                <span className="text-[8px] font-bold text-sky-600 uppercase block">Impact indicators detected</span>
                                {resumeMetricsFound.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {resumeMetricsFound.map(metric => (
                                      <span key={metric} className="text-[8px] font-bold bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-100">
                                        {metric}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-[9px] font-normal leading-normal">
                                    Add quantitative stats (e.g. latency metrics, users scaled, percent cost reductions).
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                        </div>

                        {/* Checklist Suggestions */}
                        <div className="space-y-2 pt-2 border-t border-slate-200/60">
                          <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">ATS scanner recommended checklist</h4>
                          <div className="space-y-2">
                            {resumeFeedback.map((fb, idx) => (
                              <div key={idx} className="flex gap-2 items-start p-2.5 bg-white border border-slate-100 rounded-xl">
                                <AlertCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                <span className="text-[10px] text-slate-600 font-normal leading-normal">{fb}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Learning check map */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-sky-100 p-1.5 rounded-lg text-sky-700">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Engineering Learning Checkpoints</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                        <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">DSA: Advanced Binary Trees, DP & Graphs</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Focus areas: DFS/BFS traversal algorithms, memoization logic matrices.</p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                        <input type="checkbox" className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">System Design: Scaling, Consistent Hashing & CDNs</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Design rate limiters, database shards, and cache cluster validation.</p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                        <input type="checkbox" className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Behavioral Prep: Constructing STAR Story Matrix</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Ace Amazon Leadership indicators, conflict handling, and negotiation layouts.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: Goals planner and Activity log */}
                <div className="space-y-8">
                  {/* Goals checklist */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Preparation Planner</h3>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                        {goals.filter(g => g.completed).length}/{goals.length} Checked
                      </span>
                    </div>

                    <form onSubmit={handleAddGoal} className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="Add preparation milestone..."
                        className="flex-grow rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] outline-none focus:border-indigo-500 focus:bg-white text-slate-900"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </form>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {goals.map(g => (
                        <div key={g.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                          <label className="flex items-center gap-2 cursor-pointer flex-grow min-w-0">
                            <input
                              type="checkbox"
                              checked={g.completed}
                              onChange={() => toggleGoal(g.id)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                            />
                            <span className={`text-xs truncate ${g.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
                              {g.text}
                            </span>
                          </label>
                          <button
                            onClick={() => deleteGoal(g.id)}
                            className="text-slate-300 hover:text-rose-600 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity Timeline */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Workspace Activity</h3>
                    <div className="space-y-4">
                      {activities.map((act) => (
                        <div key={act.id} className="flex gap-3 text-xs">
                          <div className="relative flex items-center justify-center shrink-0">
                            <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-slate-700 text-xs font-normal">{act.text}</p>
                            <span className="text-[9px] text-slate-400 block">{act.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: FIND A MENTOR */}
          {activeTab === "find-mentor" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Meet the Founding Team</h1>
                <p className="text-slate-500 text-sm mt-1">Book technical mock interviews, system design checks, or resume assessments with verified developers.</p>
              </div>

              {/* Advanced Filter & Sorting Panel */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {["All", "Frontend", "Backend", "System Design", "HR & Behavioral"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setMentorFilter(cat)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                          mentorFilter === cat
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-150"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-64">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search skills, keywords..."
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                    />
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2 flex-wrap flex-grow">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <SlidersHorizontal className="h-3.5 w-3.5" /> Filter by Skills:
                    </span>
                    {selectedSkillsFilter.length > 0 && (
                      <button
                        onClick={() => setSelectedSkillsFilter([])}
                        className="text-[9px] font-extrabold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Clear Skills ({selectedSkillsFilter.length})
                      </button>
                    )}
                    {allAvailableSkills.length === 0 ? (
                      <span className="text-[10px] text-slate-400 italic">No skills available</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto w-full p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        {allAvailableSkills.map((skill) => {
                          const isSelected = selectedSkillsFilter.includes(skill);
                          return (
                            <button
                              key={skill}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedSkillsFilter(selectedSkillsFilter.filter(s => s !== skill));
                                } else {
                                  setSelectedSkillsFilter([...selectedSkillsFilter, skill]);
                                }
                              }}
                              className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-0.5 ${
                                isSelected
                                  ? "border-indigo-650 bg-indigo-600 text-white shadow-sm font-extrabold"
                                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100/50"
                              }`}
                            >
                              {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <SlidersHorizontal className="h-3.5 w-3.5" /> Sort By:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="rating">Rating (High to Low)</option>
                      <option value="experience">Experience (YOE)</option>
                      <option value="sessions">Mock Sessions Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mentors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sortedMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 rounded-2xl shadow-sm">
                            <div className="bg-white p-0.5 rounded-[14px]">
                              <div className="bg-slate-100 h-11 w-11 rounded-xl flex items-center justify-center font-black text-lg text-slate-700">
                                {mentor.name.charAt(0)}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-base font-bold text-slate-900">{mentor.name}</h3>
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" title="Verified Founder"></span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mt-0.5">
                              <span>{mentor.role}</span>
                              <span>•</span>
                              <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-extrabold uppercase text-[9px] tracking-wide">
                                {mentor.company}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-600 text-xs font-bold bg-amber-50/70 border border-amber-100 px-2.5 py-1 rounded-xl shrink-0">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {mentor.rating}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-4 leading-relaxed font-normal min-h-[48px] line-clamp-3">
                        {mentor.bio}
                      </p>

                      <div className="grid grid-cols-3 gap-2 py-3.5 px-4 my-4 bg-slate-50 rounded-2xl border border-slate-100/50 text-center text-xs">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-semibold block">Experience</span>
                          <span className="font-extrabold text-slate-800 mt-0.5 block">{mentor.experience}</span>
                        </div>
                        <div className="border-x border-slate-200">
                          <span className="text-[9px] text-slate-400 uppercase font-semibold block">Mock Mocks</span>
                          <span className="font-extrabold text-slate-800 mt-0.5 block">{mentor.completedSessions}+</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-semibold block">Availability</span>
                          <span className="font-extrabold text-indigo-600 mt-0.5 block">{mentor.availableDays.length} days/wk</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                          <CalendarCheck className="h-3 w-3" /> Active Booking Days:
                        </span>
                        <div className="flex gap-1.5">
                          {weekdaysShort.map((day) => {
                            const isAvailable = mentor.availableDays.includes(getFullDayName(day));
                            return (
                              <span
                                key={day}
                                className={`text-[9px] font-bold h-6 w-8 rounded-lg flex items-center justify-center border transition-all ${
                                  isAvailable
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold"
                                    : "bg-slate-50 border-slate-100 text-slate-300"
                                }`}
                                title={isAvailable ? `${mentor.name} is available on ${getFullDayName(day)}` : "Unavailable"}
                              >
                                {day.slice(0, 2)}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 shrink-0">
                      <div className="flex flex-wrap gap-1">
                        {mentor.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-bold bg-indigo-50/40 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => openBookingModal(mentor)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-900 text-white hover:bg-indigo-600 font-extrabold rounded-2xl text-xs shadow-md transition-all duration-200"
                      >
                        Book 1:1 session <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MY BOOKING LOGS (ADDED INTELLIGENCE: REDESIGNED WITH DYNAMIC CARDS & FILTER TABS) */}
          {activeTab === "history" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Session History</h1>
                  <p className="text-slate-500 text-sm mt-1">Review mock evaluation cards, check scores, and access simulator call panels.</p>
                </div>

                {/* Sub-tab Filter chips */}
                <div className="bg-white p-1 rounded-xl border border-slate-150 flex shrink-0">
                  {["All", "Scheduled", "Completed", "Declined"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setHistoryFilter(tab as any)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                        historyFilter === tab
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="bg-white p-16 text-center rounded-3xl border border-slate-100 shadow-sm space-y-4 max-w-lg mx-auto">
                  <div className="bg-slate-50 text-slate-400 p-4 rounded-full w-fit mx-auto border border-slate-100">
                    <VideoOff className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">No bookings in this filter</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Schedule mock assessments or browse the founder profiles to request your initial session.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("find-mentor")}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-750 transition-colors shadow-md shadow-indigo-100"
                  >
                    Browse Mentors <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredHistory.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        {/* Topic Header details */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              {getTopicIcon(booking.sessionType)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{booking.sessionType}</h4>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{booking.date} at {booking.timeSlot}</span>
                                </span>
                                {booking.priceTier && (
                                  <span className="bg-indigo-50 text-indigo-750 px-1.5 py-0.5 rounded font-bold text-[9px] border border-indigo-100/50">
                                    {booking.priceTier} Session (₹{booking.pricePaid})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                              booking.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              booking.status === 'Approved' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                              booking.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {booking.status}
                            </span>
                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                              booking.paymentVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              booking.transactionId ? 'bg-amber-50 text-amber-750 border border-amber-100' :
                              'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              {booking.paymentVerified ? 'Paid & Verified' : booking.transactionId ? 'Pending Check' : 'Unpaid'}
                            </span>
                          </div>
                        </div>

                        {/* Interviewer details */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100/60">
                          <div className="bg-indigo-50 h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs text-indigo-700">
                            {booking.mentorName.charAt(0)}
                          </div>
                          <div className="text-[10px]">
                            <span className="font-bold text-slate-800 block">Mentor: {booking.mentorName}</span>
                            <span className="text-slate-400">Verified Platform Panelist</span>
                          </div>
                        </div>

                        {/* Booking custom notes */}
                        {booking.notes && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100/60 text-[10px] text-slate-500 leading-normal">
                            <span className="font-bold text-slate-700 block mb-0.5">Focus areas specified:</span>
                            {booking.notes}
                          </div>
                        )}

                        {/* Completed score markers (Upgrade layout) */}
                        {booking.status === "Completed" && booking.feedback && (
                          <div className="mt-4 p-3.5 bg-indigo-50/20 border border-indigo-100/50 rounded-xl space-y-2">
                            <span className="text-[9px] font-bold text-indigo-800 uppercase tracking-wide block">Mock Scorecard</span>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="bg-white py-1 rounded-lg border border-slate-100">
                                <span className="text-[8px] text-slate-400 uppercase font-semibold block">DSA</span>
                                <span className="text-xs font-black text-indigo-700 block mt-0.5">{booking.feedback.dsaScore}</span>
                              </div>
                              <div className="bg-white py-1 rounded-lg border border-slate-100">
                                <span className="text-[8px] text-slate-400 uppercase font-semibold block">System</span>
                                <span className="text-xs font-black text-indigo-700 block mt-0.5">{booking.feedback.systemDesignScore || "N/A"}</span>
                              </div>
                              <div className="bg-white py-1 rounded-lg border border-slate-100">
                                <span className="text-[8px] text-slate-400 uppercase font-semibold block">STAR</span>
                                <span className="text-xs font-black text-indigo-700 block mt-0.5">{booking.feedback.communicationScore}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card actions (Upgrade layout) */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-between items-center gap-4">
                        {booking.status === "Pending" ? (
                          <>
                            <div className="flex gap-2 items-center">
                              {booking.paymentVerified ? (
                                <span className="text-[10px] text-slate-400 italic">Awaiting approval</span>
                              ) : booking.transactionId ? (
                                <span className="text-[10px] text-amber-600 font-bold italic">Awaiting payment verification</span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setPaymentBooking(booking);
                                    setPaymentDateInput(new Date().toISOString().split('T')[0]);
                                    setPaymentTxIdInput("");
                                    setPaymentError("");
                                    setIsPaymentModalOpen(true);
                                  }}
                                  className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-3 py-1.5 rounded-lg transition-all"
                                >
                                  Submit Payment Info
                                </button>
                              )}
                            </div>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Cancel Request
                            </button>
                          </>
                        ) : booking.status === "Approved" ? (
                          <>
                            {/* Live blinking call indicator */}
                            <span className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600 uppercase tracking-wide">
                              <span className="h-2 w-2 bg-indigo-600 rounded-full animate-ping shrink-0"></span>
                              Mock Room Open
                            </span>
                            <button
                              onClick={() => alert("Launching mock call simulator... Joining room details...")}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-xl transition-all shadow-md shadow-indigo-100"
                            >
                              <Video className="h-3.5 w-3.5" /> Join call room
                            </button>
                          </>
                        ) : booking.status === "Completed" ? (
                          <>
                            <span className="text-[10px] text-slate-400 font-medium">Evaluation finalized</span>
                            <div className="flex gap-2">
                              {booking.mentorFeedback ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-150 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" /> Rated {booking.mentorFeedback.rating}
                                </span>
                              ) : (
                                <button
                                  onClick={() => openRatingModal(booking)}
                                  className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-all"
                                >
                                  Rate Mentor
                                </button>
                              )}
                              <button
                                onClick={() => setActiveFeedbackBooking(booking)}
                                className="text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-3 py-1.5 rounded-lg transition-all"
                              >
                                View Feedback Card
                              </button>
                            </div>
                          </>
                        ) : (
                          <span className="text-[10px] text-rose-500 font-semibold">Cancelled by admin</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE EDIT */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Professional Dossier Setup</h1>
                <p className="text-slate-500 text-sm mt-1">Manage target roles, tech stacks, projects, and contact indicators to share with hiring mentors.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-8">
                
                {/* 1. GENERAL PERSONAL DATA */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4" /> Personal Coordinates
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={studentProfile.name}
                        onChange={(e) => setStudentProfile({ ...studentProfile, name: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        disabled
                        value={studentProfile.email}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-400 text-xs cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={studentProfile.phone}
                        onChange={(e) => setStudentProfile({ ...studentProfile, phone: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        GitHub Profile URL
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Github className="h-4 w-4" />
                        </span>
                        <input
                          type="url"
                          value={studentProfile.githubUrl}
                          onChange={(e) => setStudentProfile({ ...studentProfile, githubUrl: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        LinkedIn Profile URL
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Linkedin className="h-4 w-4" />
                        </span>
                        <input
                          type="url"
                          value={studentProfile.linkedinUrl}
                          onChange={(e) => setStudentProfile({ ...studentProfile, linkedinUrl: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Portfolio Website URL
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Globe className="h-4 w-4" />
                        </span>
                        <input
                          type="url"
                          value={studentProfile.portfolioUrl}
                          onChange={(e) => setStudentProfile({ ...studentProfile, portfolioUrl: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                          placeholder="https://mywebsite.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. ACADEMIC LOGISTICS */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <Building className="h-4 w-4" /> Academic Dossier
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        University / Institution Name
                      </label>
                      <input
                        type="text"
                        value={studentProfile.college}
                        onChange={(e) => setStudentProfile({ ...studentProfile, college: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Major/Degree Specification
                      </label>
                      <input
                        type="text"
                        value={studentProfile.degree}
                        onChange={(e) => setStudentProfile({ ...studentProfile, degree: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                        placeholder="e.g. B.Tech Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Graduation Year
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Calendar className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          value={studentProfile.gradYear}
                          onChange={(e) => setStudentProfile({ ...studentProfile, gradYear: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                          placeholder="2026"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Current GPA / CGPA Value
                      </label>
                      <input
                        type="text"
                        value={studentProfile.gpa}
                        onChange={(e) => setStudentProfile({ ...studentProfile, gpa: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                        placeholder="8.5/10"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Job Placement Status
                      </label>
                      <select
                        value={studentProfile.searchStatus}
                        onChange={(e) => setStudentProfile({ ...studentProfile, searchStatus: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-slate-700"
                      >
                        <option value="Actively Looking">Actively Booking & Applying (Immediate)</option>
                        <option value="Exploring Options">Just Exploring mentorship (Not looking yet)</option>
                        <option value="Offer Secured">Offer secured (Preparing for onboarding)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. PROFESSIONAL PROFILE CARDS */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Career Milestones
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Target Career Role
                      </label>
                      <input
                        type="text"
                        value={studentProfile.targetRole}
                        onChange={(e) => setStudentProfile({ ...studentProfile, targetRole: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                        placeholder="Frontend Engineer / Backend Dev"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Target Companies (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={studentProfile.targetCompanies}
                        onChange={(e) => setStudentProfile({ ...studentProfile, targetCompanies: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                        placeholder="Google, Microsoft, Amazon"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Location Preference
                      </label>
                      <input
                        type="text"
                        value={studentProfile.preferredLocation}
                        onChange={(e) => setStudentProfile({ ...studentProfile, preferredLocation: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                        placeholder="Bengaluru / Remote / San Francisco"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Experience Level YOE
                      </label>
                      <input
                        type="text"
                        value={studentProfile.yoe}
                        onChange={(e) => setStudentProfile({ ...studentProfile, yoe: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                        placeholder="Fresher / 2 YOE"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Core Programming Languages
                      </label>
                      <input
                        type="text"
                        value={studentProfile.languages}
                        onChange={(e) => setStudentProfile({ ...studentProfile, languages: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                        placeholder="TypeScript, Python, Java"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Core Frameworks & Tools
                      </label>
                      <input
                        type="text"
                        value={studentProfile.frameworks}
                        onChange={(e) => setStudentProfile({ ...studentProfile, frameworks: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                        placeholder="React, Next.js, Docker, Kubernetes"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. PROJECTS SPECIFICATIONS */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                      <Code className="h-4 w-4" /> Selected Portfolio Projects
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const currentProjects = (studentProfile as any).projects || [];
                        setStudentProfile({
                          ...studentProfile,
                          projects: [...currentProjects, { title: "", desc: "", tech: "" }]
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition-colors"
                    >
                      <Plus className="h-3 w-3" /> Add Project
                    </button>
                  </div>
                  
                  {((studentProfile as any).projects || []).length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                      <p className="text-xs text-slate-500 font-medium">No projects added yet. Click &quot;Add Project&quot; above to showcase your work.</p>
                    </div>
                  ) : (
                    ((studentProfile as any).projects || []).map((proj: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4 relative">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Project #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentProjects = (studentProfile as any).projects || [];
                              const updated = currentProjects.filter((_: any, i: number) => i !== idx);
                              setStudentProfile({
                                ...studentProfile,
                                projects: updated
                              });
                            }}
                            className="text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Project Title</label>
                            <input
                              type="text"
                              value={proj.title || ""}
                              onChange={(e) => {
                                const currentProjects = [...((studentProfile as any).projects || [])];
                                currentProjects[idx] = { ...currentProjects[idx], title: e.target.value };
                                setStudentProfile({ ...studentProfile, projects: currentProjects });
                              }}
                              className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-950 text-xs"
                              placeholder="e.g. Portfolio Website"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Technologies Used</label>
                            <input
                              type="text"
                              value={proj.tech || ""}
                              onChange={(e) => {
                                const currentProjects = [...((studentProfile as any).projects || [])];
                                currentProjects[idx] = { ...currentProjects[idx], tech: e.target.value };
                                setStudentProfile({ ...studentProfile, projects: currentProjects });
                              }}
                              className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-955 text-xs"
                              placeholder="e.g. Next.js, Tailwind v4"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Project Description</label>
                          <textarea
                            rows={2}
                            value={proj.desc || ""}
                            onChange={(e) => {
                              const currentProjects = [...((studentProfile as any).projects || [])];
                              currentProjects[idx] = { ...currentProjects[idx], desc: e.target.value };
                              setStudentProfile({ ...studentProfile, projects: currentProjects });
                            }}
                            className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-905 text-xs"
                            placeholder="Brief description of the project"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-grow inline-flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs transition-colors shadow-md shadow-indigo-100"
                  >
                    Save Professional Dossier Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* --- ADDED INTELLIGENCE: REDESIGNED INTERACTIVE MULTI-STEP BOOKING MODAL --- */}
      {isBookingModalOpen && bookingMentor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-250 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-indigo-900 text-white p-6 relative shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-xl text-white">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Book 1:1 Session</h3>
                  <p className="text-indigo-200 text-xs mt-0.5">Mentor: {bookingMentor.name} • {bookingMentor.role} @ {bookingMentor.company}</p>
                </div>
              </div>
              <button
                onClick={() => { setIsBookingModalOpen(false); setBookingMentor(null); }}
                className="absolute top-6 right-6 text-indigo-200 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Stepper Progress bar */}
            <div className="bg-slate-50 border-b border-slate-150 px-8 py-3.5 shrink-0 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span className={bookingStep === 1 ? "text-indigo-600 font-extrabold" : ""}>1. Availability Check</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className={bookingStep === 2 ? "text-indigo-600 font-extrabold" : ""}>2. Topic details</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className={bookingStep === 3 ? "text-indigo-600 font-extrabold" : ""}>3. Booking Summary</span>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-6 flex-grow">
              
              {/* STEP 1: Date & Time Selector */}
              {bookingStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Select Date from Available Calendar</h4>
                    <p className="text-xs text-slate-500 leading-normal mb-4">
                      Founding mentors work on specific scheduling cycles. Green dates indicate matching days of week when {bookingMentor.name} is available. Red dates are unavailable.
                    </p>
                    
                    {/* Calendar grid view */}
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
                      {getNext14Days(bookingMentor).map((dayItem) => (
                        <button
                          key={dayItem.dateStr}
                          type="button"
                          disabled={!dayItem.isAvailable}
                          onClick={() => {
                            setSelectedDateStr(dayItem.dateStr);
                            setSelectedDayName(dayItem.dayOfWeek);
                            setSelectedTimeSlot(""); // Reset slot
                          }}
                          className={`p-3 rounded-2xl border text-center flex flex-col justify-center items-center transition-all ${
                            !dayItem.isAvailable
                              ? "bg-rose-50/50 border-rose-100 text-rose-300 cursor-not-allowed"
                              : selectedDateStr === dayItem.dateStr
                              ? "bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-150"
                              : "bg-emerald-50/50 border-emerald-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-350"
                          }`}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-wider block">
                            {dayItem.monthLabel}
                          </span>
                          <span className="text-lg font-black block mt-0.5 leading-none">
                            {dayItem.dayOfMonth}
                          </span>
                          <span className="text-[8px] font-bold block mt-1 uppercase tracking-wider opacity-85">
                            {dayItem.dayOfWeek.slice(0, 3)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDateStr && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Select Time Slot</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {bookingMentor.availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`p-3 rounded-xl border font-bold text-xs transition-all ${
                              selectedTimeSlot === slot
                                ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Topic & Notes Selector */}
              {bookingStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Choose Interview Topic</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {bookingMentor && bookingMentor.skills && bookingMentor.skills.length > 0 ? (
                        bookingMentor.skills.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => setSelectedTopic(skill)}
                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              selectedTopic === skill
                                ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                                : "border-slate-200 hover:border-slate-350 hover:bg-slate-50/30"
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-900">{skill} Mock Session</span>
                            <span className="text-[10px] text-slate-500 mt-1 font-normal leading-normal">
                              Practice mock session focused on {skill} concepts and core technical questions.
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <span className="text-xs text-slate-500 font-medium">No specialized skills listed for this mentor.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Choice of selecting the type of pricing */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Choose Pricing Plan</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(pricingPlans && pricingPlans.length > 0 ? pricingPlans : [
                        { name: "Starter Session", price: 299, subtitle: "30 Mins guidance session" },
                        { name: "Premium Session", price: 499, subtitle: "60 Mins evaluation roadmap" },
                        { name: "Career Accelerator", price: 999, subtitle: "90 Mins prep strategy session" }
                      ]).map((plan) => (
                        <button
                          key={plan.id || plan.name}
                          type="button"
                          onClick={() => {
                            setSelectedPriceTier(plan.name);
                            setSelectedPricePaid(plan.price);
                          }}
                          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            selectedPriceTier === plan.name
                              ? "border-indigo-650 bg-indigo-50/50 shadow-sm font-extrabold animate-in fade-in"
                              : "border-slate-200 hover:border-slate-350 hover:bg-slate-50/30"
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{plan.name}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block truncate max-w-[150px]">
                              {plan.subtitle || `${plan.duration || 30} Mins session`}
                            </span>
                          </div>
                          <span className="text-sm font-black text-indigo-700 block mt-2">₹{plan.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Focal questions / Areas you want reviewed (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Specify focus areas..."
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Summary & Confirm details */}
              {bookingStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Dossier Summary</h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Selected Mentor</span>
                        <span className="font-bold text-slate-900 text-sm block mt-0.5">{bookingMentor.name}</span>
                        <span className="text-[10px] text-slate-500 block">{bookingMentor.role} @ {bookingMentor.company}</span>
                      </div>
                      
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Session Slot</span>
                        <span className="font-bold text-slate-900 text-sm block mt-0.5">{selectedDateStr}</span>
                        <span className="text-[10px] text-indigo-600 font-semibold block">{selectedTimeSlot} ({selectedDayName})</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Interview Type</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{selectedTopic}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Selected Plan</span>
                        <span className="font-bold text-indigo-700 block mt-0.5">{selectedPriceTier} Session</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-bold">₹{selectedPricePaid} (UPI Payment Required)</span>
                      </div>

                      {bookingNotes && (
                        <div className="col-span-2">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Focal Notes</span>
                          <span className="text-slate-500 block mt-0.5 leading-normal">{bookingNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-normal font-medium">
                      Confirming this request adds it to your log and routes it directly to {bookingMentor.name}&apos;s mentor portal for approval. You will receive session access details once approved.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-150 p-6 flex justify-between shrink-0">
              {bookingStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setBookingStep(prev => (prev - 1) as 1 | 2 | 3)}
                  className="inline-flex items-center gap-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setIsBookingModalOpen(false); setBookingMentor(null); }}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-500 bg-white hover:bg-slate-50 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
              )}

              {bookingStep === 1 ? (
                <button
                  type="button"
                  disabled={!selectedDateStr || !selectedTimeSlot}
                  onClick={() => setBookingStep(2)}
                  className="inline-flex items-center gap-1 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100 transition-all"
                >
                  Select Details <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : bookingStep === 2 ? (
                <button
                  type="button"
                  onClick={() => setBookingStep(3)}
                  className="inline-flex items-center gap-1 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                >
                  Review Summary <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="inline-flex items-center gap-1 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all"
                >
                  Confirm & Request Call
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* STUDENT RATING MODAL */}
      {isRatingModalOpen && ratingBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white p-6 relative shrink-0">
              <h3 className="text-lg font-black tracking-tight">Rate Your Mentor</h3>
              <p className="text-amber-100 text-xs mt-0.5">Share your feedback about {ratingBooking.mentorName} for {ratingBooking.sessionType}</p>
              <button
                onClick={() => { setIsRatingModalOpen(false); setRatingBooking(null); }}
                className="absolute top-6 right-6 text-amber-150 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Star selection */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Session Rating</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingValue(star)}
                      onMouseEnter={() => setRatingHoverValue(star)}
                      onMouseLeave={() => setRatingHoverValue(null)}
                      className="p-1 transition-transform hover:scale-115 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          (ratingHoverValue !== null ? star <= ratingHoverValue : star <= ratingValue)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {ratingValue === 5 ? "Excellent - Highly Recommend!" :
                   ratingValue === 4 ? "Very Good - Great Session" :
                   ratingValue === 3 ? "Good - Met Expectations" :
                   ratingValue === 2 ? "Fair - Could Be Better" :
                   "Poor - Unsatisfactory"}
                </span>
              </div>

              {/* Text review */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Review Comments (Optional)
                </label>
                <textarea
                  rows={4}
                  value={ratingComments}
                  onChange={(e) => setRatingComments(e.target.value)}
                  placeholder="Tell us what you liked or how the mentor could improve..."
                  className="block w-full rounded-2xl border border-slate-250 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-xs"
                />
              </div>
            </div>
            <div className="bg-slate-50 border-t border-slate-150 p-6 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => { setIsRatingModalOpen(false); setRatingBooking(null); }}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-500 bg-white hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                disabled={isSubmittingRating}
                onClick={handleSubmittingRating}
                className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-amber-100 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingRating ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {activeFeedbackBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header Panel */}
            <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white p-6 relative shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2.5 rounded-2xl text-amber-400 border border-amber-500/20 shadow-inner">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Verified Assessment
                    </span>
                    <h3 className="text-lg font-black tracking-tight mt-1">Official Mock Scorecard</h3>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs shrink-0">
                  <span className="text-slate-300 block">Report ID</span>
                  <span className="font-mono text-indigo-200 font-bold">SEC-EM-{activeFeedbackBooking.id.toUpperCase()}</span>
                </div>
              </div>
              
              <button
                onClick={() => setActiveFeedbackBooking(null)}
                className="absolute top-6 right-6 text-indigo-200 hover:text-white text-lg font-bold transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Context Sub-Bar (Interviewer Details) */}
            <div className="bg-slate-50 border-b border-slate-150 p-4 sm:px-6 shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Session Topic</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  {getTopicIcon(activeFeedbackBooking.sessionType)}
                  {activeFeedbackBooking.sessionType}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Evaluation Expert</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <span className="h-4 w-4 bg-indigo-100 text-indigo-700 text-[9px] font-extrabold rounded-full flex items-center justify-center">
                    {activeFeedbackBooking.mentorName.charAt(0)}
                  </span>
                  {activeFeedbackBooking.mentorName} (Panel Mentor)
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Completed Date</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {activeFeedbackBooking.feedback?.submittedAt 
                    ? new Date(activeFeedbackBooking.feedback.submittedAt).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) 
                    : activeFeedbackBooking.date}
                </span>
              </div>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="bg-white px-6 border-b border-slate-150 shrink-0 flex gap-2">
              {[
                { id: 'scores', label: 'Evaluation Ratings' },
                { id: 'comments', label: 'Interviewer Review Notes' },
                { id: 'roadmap', label: 'Actionable Next Steps' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeedbackTab(tab.id as any)}
                  className={`text-xs font-bold py-3.5 px-4 border-b-2 transition-all cursor-pointer ${
                    activeFeedbackTab === tab.id
                      ? "border-indigo-600 text-indigo-600 font-extrabold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-grow bg-slate-50/50 space-y-6">
              
              {/* TAB 1: SCORES */}
              {activeFeedbackTab === 'scores' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* DSA score card */}
                    {activeFeedbackBooking.feedback?.dsaScore && (
                      <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DSA & Coding</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${getGradeDetails(activeFeedbackBooking.feedback.dsaScore).color}`}>
                              {getGradeDetails(activeFeedbackBooking.feedback.dsaScore).status}
                            </span>
                          </div>
                          
                          <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">
                              {activeFeedbackBooking.feedback.dsaScore}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">grade tier</span>
                          </div>
                        </div>

                        <div className="mt-4 space-y-1.5">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                            <span>Calculated Proficiency</span>
                            <span>{getGradeDetails(activeFeedbackBooking.feedback.dsaScore).percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${getGradeDetails(activeFeedbackBooking.feedback.dsaScore).barColor}`}
                              style={{ width: `${getGradeDetails(activeFeedbackBooking.feedback.dsaScore).percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sys Design score card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">System Design</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${getGradeDetails(activeFeedbackBooking.feedback?.systemDesignScore).color}`}>
                            {getGradeDetails(activeFeedbackBooking.feedback?.systemDesignScore).status}
                          </span>
                        </div>
                        
                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-900">
                            {activeFeedbackBooking.feedback?.systemDesignScore || "N/A"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">grade tier</span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                          <span>Calculated Proficiency</span>
                          <span>{getGradeDetails(activeFeedbackBooking.feedback?.systemDesignScore).percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${getGradeDetails(activeFeedbackBooking.feedback?.systemDesignScore).barColor}`}
                            style={{ width: `${getGradeDetails(activeFeedbackBooking.feedback?.systemDesignScore).percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Communication/Behavioral score card */}
                    {activeFeedbackBooking.feedback?.communicationScore && (
                      <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Behavioral (STAR)</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${getGradeDetails(activeFeedbackBooking.feedback.communicationScore).color}`}>
                              {getGradeDetails(activeFeedbackBooking.feedback.communicationScore).status}
                            </span>
                          </div>
                          
                          <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">
                              {activeFeedbackBooking.feedback.communicationScore}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">grade tier</span>
                          </div>
                        </div>

                        <div className="mt-4 space-y-1.5">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                            <span>Calculated Proficiency</span>
                            <span>{getGradeDetails(activeFeedbackBooking.feedback.communicationScore).percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${getGradeDetails(activeFeedbackBooking.feedback.communicationScore).barColor}`}
                              style={{ width: `${getGradeDetails(activeFeedbackBooking.feedback.communicationScore).percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary Assessment */}
                  <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">Aggregated readiness assessment</h4>
                      <p className="text-xs text-indigo-900 mt-1 leading-relaxed">
                        Based on this feedback report, the applicant displays a strong grasp of technical requirements. 
                        Targeting Tier-1 product-based roles is highly recommended. Complete the corrective checklist in the 
                        <strong className="text-indigo-950 font-bold"> Actionable Next Steps</strong> tab to cement dynamic system layouts.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COMMENTS */}
              {activeFeedbackTab === 'comments' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-150 shadow-sm relative">
                    <div className="absolute top-6 right-6 opacity-5 text-indigo-800">
                      <FileText className="h-24 w-24" />
                    </div>
                    
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Interviewer Commentary</h4>
                    <div className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal italic relative z-10 pl-4 border-l-2 border-indigo-500">
                      &quot;{activeFeedbackBooking.feedback?.comments}&quot;
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Signature Verification System</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase tracking-wide">
                        Verified by {activeFeedbackBooking.mentorName}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ROADMAP */}
              {activeFeedbackTab === 'roadmap' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Corrective Action Roadmap</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        We have automatically generated this custom checklist based on the score metrics submitted by your mentor. Complete these milestones to optimize performance:
                      </p>
                    </div>

                    <div className="space-y-3.5 pt-2">
                      {getRoadmapTasks(activeFeedbackBooking).map((task, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                          <div className="mt-0.5 shrink-0">
                            <input 
                              type="checkbox" 
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                              defaultChecked={idx === 2}
                            />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{task.text}</span>
                            <span className="text-[10px] text-slate-500 mt-0.5 block leading-normal font-normal">{task.details}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-150 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleExportReport}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-750 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100 transition-all cursor-pointer"
                >
                  {isExporting ? (
                    <>
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full shrink-0"></span>
                      Exporting PDF...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-3.5 w-3.5" />
                      Export Report
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleShareReport}
                  className="inline-flex items-center justify-center p-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                  title="Share to LinkedIn"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveFeedbackBooking(null)}
                className="w-full sm:w-auto px-6 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all text-center cursor-pointer"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STUDENT MANUAL PAYMENT MODAL */}
      {isPaymentModalOpen && paymentBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="bg-indigo-900 text-white p-6 relative shrink-0">
              <h3 className="text-lg font-black tracking-tight">Manual Payment Verification</h3>
              <p className="text-indigo-200 text-xs mt-0.5">Pay for your {paymentBooking.priceTier} Session — ₹{paymentBooking.pricePaid}</p>
              <button
                onClick={() => { setIsPaymentModalOpen(false); setPaymentBooking(null); }}
                className="absolute top-6 right-6 text-indigo-200 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleConfirmPayment} className="flex flex-col flex-grow">
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                
                {/* QR Code Graphic */}
                <div className="text-center space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scan UPI QR Code to Pay</span>
                  <img
                    src="/upi_payment_qr.png"
                    alt="UPI QR Code for Payment"
                    className="w-48 h-48 mx-auto border border-slate-200 rounded-xl shadow-sm bg-white"
                  />
                  <div className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                    Scan with any UPI app (GPay, PhonePe, Paytm) to transfer <strong className="text-slate-800 font-extrabold">₹{paymentBooking.pricePaid}</strong>.
                  </div>
                </div>

                {paymentError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-650 text-center">
                    {paymentError}
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      required
                      value={paymentDateInput}
                      onChange={(e) => setPaymentDateInput(e.target.value)}
                      className="block w-full rounded-xl border border-slate-250 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Transaction ID / UPI Reference ID
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter 12-digit transaction ID..."
                      value={paymentTxIdInput}
                      onChange={(e) => setPaymentTxIdInput(e.target.value)}
                      className="block w-full rounded-xl border border-slate-250 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                    />
                  </div>
                </div>

              </div>

              <div className="bg-slate-50 border-t border-slate-150 p-6 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => { setIsPaymentModalOpen(false); setPaymentBooking(null); }}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-500 bg-white hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={paymentSubmitting}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-50"
                >
                  {paymentSubmitting ? "Submitting..." : "Submit Transaction Info"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
