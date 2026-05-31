"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mentors } from "@/data/mentors";
import { initialBookings, Booking, Feedback } from "@/data/bookings";
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  Settings,
  LogOut,
  GraduationCap,
  Star,
  Clock,
  Briefcase,
  Users,
  User,
  Video,
  FileCheck,
  CheckCircle,
  XCircle,
  Play,
  Monitor,
  PenTool,
  Save,
  DollarSign,
  TrendingUp,
  Github,
  Linkedin,
  MessageSquare,
  BadgeAlert,
  ChevronRight,
  Code,
  Calendar,
  AlertTriangle,
  Info
} from "lucide-react";

export default function MentorPortal() {
  const router = useRouter();
  const [session, setSession] = useState<{ email: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'feedback' | 'profile' | 'settings'>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingSubTab, setBookingSubTab] = useState<'all' | 'pending' | 'approved' | 'completed' | 'declined'>('all');

  // Feedback form states
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState<string>("");
  const [dsaGrade, setDsaGrade] = useState("A");
  const [systemDesignGrade, setSystemDesignGrade] = useState("A-");
  const [communicationGrade, setCommunicationGrade] = useState("A");
  const [feedbackComments, setFeedbackComments] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // Search, filter, and accordion states for Bookings Manager
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionTypeFilter, setSessionTypeFilter] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null);

  // Sub-metric sliders for scoring
  const [scoreSubMetric1, setScoreSubMetric1] = useState(8);
  const [scoreSubMetric2, setScoreSubMetric2] = useState(8);
  const [scoreSubMetric3, setScoreSubMetric3] = useState(8);

  // Video call simulation states
  const [simulatedCallBooking, setSimulatedCallBooking] = useState<Booking | null>(null);
  const [callTimer, setCallTimer] = useState(15 * 60); // 15 mins mock
  const [whiteboardText, setWhiteboardText] = useState("// Type your solution or diagrams here...\n\nfunction findTwoSum(arr, target) {\n  // write code\n}");

  // Mentor profile & scheduling states (ADDED INTELLIGENCE: EXTRACTED FOR MORE DETAIL)
  const [availableDays, setAvailableDays] = useState<string[]>(["Monday", "Wednesday", "Friday"]);
  const [availableSlots, setAvailableSlots] = useState<string[]>(["10:00 AM", "2:00 PM", "4:30 PM", "7:00 PM"]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [localMentors, setLocalMentors] = useState<any[]>([]);
  const [newSkillText, setNewSkillText] = useState("");
  
  const [mentorProfile, setMentorProfile] = useState<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    company: string;
    bio: string;
    yoe: string;
    githubUrl?: string;
    linkedinUrl?: string;
    skills: string[];
    specialties: string[];
    languages: string;
    hobbies: string;
    rating?: number;
  }>({
    id: "",
    name: "Prashu",
    email: "prashu@gmail.com",
    phone: "",
    role: "Staff Backend Engineer",
    company: "Meta",
    bio: "Passionate about high-performance microservices, REST/GraphQL APIs, database architectures, and distributed systems. Expert in Go, Java, and PostgreSQL performance tuning.",
    yoe: "7+ Years",
    githubUrl: "https://github.com/prashu-backend",
    linkedinUrl: "https://linkedin.com/in/prashu-meta",
    skills: ["Backend", "System Design", "Algorithms"],
    specialties: ["Backend", "System Design", "Algorithms"],
    languages: "Go, Java, C++, Python, SQL",
    hobbies: "Marathon running, open source contributing, technical blogging",
    rating: 5.0
  });

  const [studentProfiles, setStudentProfiles] = useState<Record<string, any>>({});

  const fetchMentorDashboardData = async (email: string) => {
    try {
      const headers = { "x-user-email": email };

      // 1. Profile
      const profileRes = await fetch(`/api/mentor/profile?email=${email}`, { headers });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setMentorProfile(profileData);
        setAvailableDays(profileData.availableDays || []);
        setAvailableSlots(profileData.availableSlots || []);
        setBlockedDates(profileData.blockedDates || []);
      }

      // 2. Bookings
      const bookingsRes = await fetch(`/api/mentor/bookings?email=${email}`, { headers });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);

        // Fetch dynamic student profiles
        const uniqueEmails = Array.from(new Set(bookingsData.map((b: any) => b.studentEmail))) as string[];
        const profilesMap: Record<string, any> = {};
        await Promise.all(
          uniqueEmails.map(async (studentEmail) => {
            try {
              const res = await fetch(`/api/student/profile?email=${studentEmail}`);
              if (res.ok) {
                const data = await res.json();
                if (data) {
                  profilesMap[studentEmail] = data;
                }
              }
            } catch (e) {
              console.error("Error fetching student profile for", studentEmail, e);
            }
          })
        );
        setStudentProfiles(profilesMap);
      }
    } catch (error) {
      console.error("Error loading mentor data:", error);
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
      if (parsedSession.role !== "mentor") {
        router.push("/student");
        return;
      }
      setSession(parsedSession);
      fetchMentorDashboardData(parsedSession.email);
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

  // Booking Action: Approve
  const handleApproveBooking = async (id: string) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/mentor/bookings/${id}/approve`, {
        method: "POST",
        headers: { "x-user-email": session.email },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Approval failed.");
        return;
      }

      await fetchMentorDashboardData(session.email);
      showToast("Booking Approved! Meet the student at the scheduled slot.");
    } catch (error) {
      console.error(error);
    }
  };

  // Booking Action: Reject
  const handleRejectBooking = async (id: string) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/mentor/bookings/${id}/reject`, {
        method: "POST",
        headers: { "x-user-email": session.email },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Rejection failed.");
        return;
      }

      await fetchMentorDashboardData(session.email);
      showToast("Booking request declined.");
    } catch (error) {
      console.error(error);
    }
  };

  // Template Applier helper
  const handleApplyTemplate = (type: 'dsa' | 'system' | 'star') => {
    let template = "";
    if (type === 'dsa') {
      template = `### Technical Capability:\n- Correctly identified optimal algorithmic approach using...\n- Handled basic test suites successfully.\n\n### Optimization Areas:\n- Needs to improve boundary condition validation for empty/negative inputs.\n- Dry-running code step-by-step before finalizing syntax.\n\n### Suggested Roadmap Practice:\n- Study DFS/BFS tree traversals.\n- Review LeetCode Medium/Hard DP grids.`;
    } else if (type === 'system') {
      template = `### Scalable Architecture Design:\n- Strong high-level architectural layout for handling QPS bottlenecks.\n- Correct use of Redis caching and horizontal DB clusters.\n\n### Storage & Cache Gaps:\n- Deepen understanding of consistent hashing ring redistribution redistribution under partition failure.\n- Study distributed message queuing (e.g. Kafka partition limits).\n\n### Suggested Roadmap Practice:\n- Design distributed rate limiter templates.\n- Read consistent hashing ring algorithms.`;
    } else {
      template = `### STAR Delivery Structure:\n- Structured stories using the Situation-Task-Action-Result format effectively.\n- Direct personal contributions were highlighted clearly.\n\n### Quantification and Tone:\n- Needs to add concrete quantitative business output percentages or latency gains.\n- Work on simplifying complex system descriptions for non-technical interviews.\n\n### Suggested Roadmap Practice:\n- Draft 3 core STAR stories focusing on team conflicts and scaling metrics.`;
    }
    setFeedbackComments(template);
  };

  // Generate simulated AI feedback comments using metric slider ratings
  const handleGenerateAIDraft = () => {
    if (!selectedBookingForFeedback) return;
    const booking = bookings.find(b => b.id === selectedBookingForFeedback);
    if (!booking) return;

    const studentName = booking.studentName;
    const type = booking.sessionType;

    let draft = "";
    if (type === "DSA Mock Interview") {
      draft = `### 🌟 DSA Performance Assessment for ${studentName}

- **Algorithmic Correctness**: Rated **${scoreSubMetric1}/10**. Candidate successfully approached the core problem. Code correctness was generally maintained.
- **Complexity Bound Auditing**: Rated **${scoreSubMetric2}/10**. Big-O bounds were identified correctly. Candidate should focus on optimizing recursive stack spaces.
- **Dry-run Execution**: Rated **${scoreSubMetric3}/10**. Candidate dry-ran test cases with minor pointers on boundaries.

### 📈 Actionable Roadmap Focus:
${scoreSubMetric2 < 7 ? "- [ ] Practice 5 Leetcode Dynamic Programming grid optimizations.\n" : ""}${scoreSubMetric1 < 8 ? "- [ ] Dry run boundary conditions (null nodes, overflow numbers) on paper first.\n" : ""}- [ ] Review depth-first search graph traversal patterns.`;
    } else if (type === "System Design Mock") {
      draft = `### 🌟 System Design Performance Assessment for ${studentName}

- **High-Level Topology**: Rated **${scoreSubMetric1}/10**. Structured general microservices and API gateways successfully.
- **Database Partitioning & Caching**: Rated **${scoreSubMetric2}/10**. Explained consistent hashing partitions. Needs concrete Redis invalidation strategies under load.
- **Scalability Trade-offs**: Rated **${scoreSubMetric3}/10**. Addressed active-passive replica patterns.

### 📈 Actionable Roadmap Focus:
${scoreSubMetric2 < 7 ? "- [ ] Read consistent hashing ring algorithms and distributed key store partitioning.\n" : ""}${scoreSubMetric3 < 8 ? "- [ ] Study message queues (Kafka vs RabbitMQ) load weights.\n" : ""}- [ ] Draft high-level layout for a distributed rate-limiter.`;
    } else {
      draft = `### 🌟 Behavioral STAR Interview Assessment for ${studentName}

- **STAR Story Architecture**: Rated **${scoreSubMetric1}/10**. Followed Situation-Task-Action-Result format.
- **Outcome Quantification**: Rated **${scoreSubMetric2}/10**. Mentioned business impacts. Should add more metric details.
- **Communication Pacing**: Rated **${scoreSubMetric3}/10**. Candidate spoke clearly and structure was sound.

### 📈 Actionable Roadmap Focus:
${scoreSubMetric2 < 7 ? "- [ ] Prepare 3 STAR narratives focusing on core project business percentage improvements.\n" : ""}- [ ] Practice mock storytelling focusing on handling team conflicts.`;
    }

    setFeedbackComments(draft);
    showToast("AI Evaluation Draft populated below!");
  };


  // Submit Mock Feedback Form
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForFeedback || !session) return;

    try {
      const res = await fetch(`/api/mentor/bookings/${selectedBookingForFeedback}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify({
          dsaScore: dsaGrade,
          systemDesignScore: systemDesignGrade,
          communicationScore: communicationGrade,
          comments: feedbackComments,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Feedback submission failed.");
        return;
      }

      await fetchMentorDashboardData(session.email);
      setSelectedBookingForFeedback("");
      setFeedbackComments("");
      setActiveTab("dashboard");
      showToast("Session marked as Complete and feedback sent to Student Portal!");
    } catch (error) {
      console.error(error);
    }
  };

  // Save Mentor Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      const res = await fetch("/api/mentor/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify(mentorProfile),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Profile save failed.");
        return;
      }

      await fetchMentorDashboardData(session.email);
      showToast("Mentor profile coordinates saved successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(""), 4500);
  };

  // Video call timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simulatedCallBooking) {
      interval = setInterval(() => {
        setCallTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulatedCallBooking]);

  // Mapping average slider scores to recommended letter grade
  const getSuggestedGrade = (avg: number) => {
    if (avg >= 9.5) return "A+";
    if (avg >= 8.5) return "A";
    if (avg >= 7.5) return "A-";
    if (avg >= 6.5) return "B+";
    if (avg >= 5.5) return "B";
    if (avg >= 4.5) return "B-";
    return "C";
  };

  // Sync grading recommendations dynamically based on slider values
  useEffect(() => {
    if (!selectedBookingForFeedback) return;
    const booking = bookings.find(b => b.id === selectedBookingForFeedback);
    if (!booking) return;

    const avg = (scoreSubMetric1 + scoreSubMetric2 + scoreSubMetric3) / 3;
    const suggested = getSuggestedGrade(avg);

    if (booking.sessionType === "DSA Mock Interview") {
      setDsaGrade(suggested);
      setSystemDesignGrade("N/A");
      setCommunicationGrade("A-"); 
    } else if (booking.sessionType === "System Design Mock") {
      setDsaGrade("N/A");
      setSystemDesignGrade(suggested);
      setCommunicationGrade("A-");
    } else {
      setDsaGrade("N/A");
      setSystemDesignGrade("N/A");
      setCommunicationGrade(suggested);
    }
  }, [scoreSubMetric1, scoreSubMetric2, scoreSubMetric3, selectedBookingForFeedback]);


  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLaunchCall = (booking: Booking) => {
    setSimulatedCallBooking(booking);
    setCallTimer(45 * 60); // 45 mins countdown
  };

  const handleEndCall = () => {
    if (simulatedCallBooking) {
      setSelectedBookingForFeedback(simulatedCallBooking.id);
      setSimulatedCallBooking(null);
      setActiveTab("feedback");
      showToast("Call ended. Writing feedback report now.");
    }
  };

  // Fetch student profile details dynamically (real context)
  const getStudentProfileData = (studentEmail: string, studentName: string) => {
    if (studentProfiles[studentEmail]) {
      return studentProfiles[studentEmail];
    }
    if (studentEmail === "akash@gmail.com") {
      const stored = localStorage.getItem("student_profile");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    // Default fallback mock student dossier
    return {
      name: studentName,
      email: studentEmail,
      phone: "+91 98765 43210",
      college: "Indian Institute of Information Technology (IIIT)",
      degree: "B.Tech in Computer Science & Engineering",
      gradYear: "2026",
      gpa: "8.8/10",
      targetRole: "Software Engineer",
      targetCompanies: "Google, Meta, Netflix, Uber",
      preferredLocation: "Bengaluru / Remote",
      searchStatus: "Actively Looking",
      yoe: "Fresher / New Grad",
      languages: "Java, Python, C++, Go, JavaScript, SQL",
      frameworks: "React, Node.js, Spring Boot, AWS, Docker",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      portfolioUrl: "https://portfolio.dev",
      project1Title: "Interactive Developer Portal Dashboard",
      project1Desc: "Designed client-side persistent portal interfaces with interactive metrics roadmaps and calendars.",
      project1Tech: "Next.js, Tailwind v4, LocalStorage",
      project2Title: "Distributed Cache Allocator",
      project2Desc: "Built an partition distributor that structures hash rings to route query payloads under peak QPS loads.",
      project2Tech: "C++, Consistent Hashing, Redis"
    };
  };

  // Generate simulated calendar dates for next 14 days
  const getMentor14Days = () => {
    const dates = [];
    const today = new Date();
    
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);

      const dayOfWeek = dayNames[nextDate.getDay()];
      const dateKey = nextDate.toISOString().split("T")[0]; // YYYY-MM-DD

      // Check if there are active bookings for this mentor on this date
      const activeMentorId = mentorProfile.id;
      const bookedSessionsForDay = bookings.filter(b => 
        (!activeMentorId || b.mentorId === activeMentorId) && 
        b.date === dateKey && 
        (b.status === "Approved" || b.status === "Pending")
      );

      const isWeekdayScheduled = availableDays.includes(dayOfWeek);
      const isBlocked = blockedDates.includes(dateKey);

      dates.push({
        dateStr: dateKey,
        dayOfMonth: nextDate.getDate(),
        monthLabel: monthNames[nextDate.getMonth()],
        dayOfWeek,
        isWeekdayScheduled,
        isBlocked,
        bookedSessions: bookedSessionsForDay
      });
    }

    return dates;
  };


  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      const res = await fetch("/api/mentor/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify({
          availableDays,
          availableSlots,
          blockedDates,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Settings save failed.");
        return;
      }

      await fetchMentorDashboardData(session.email);
      showToast("Availability and calendar schedule updated!");
    } catch (error) {
      console.error(error);
    }
  };

  // Calculate Mentor Specific Dashboard Stats (Filter strictly by active mentor)
  const mentorBookings = bookings;
  const completedSessions = mentorBookings.filter(b => b.status === "Completed").length;
  const pendingRequests = mentorBookings.filter(b => b.status === "Pending");
  const approvedRequests = mentorBookings.filter(b => b.status === "Approved");

  const filteredSubBookings = mentorBookings.filter(b => {
    if (bookingSubTab === "all") return true;
    if (bookingSubTab === "pending") return b.status === "Pending";
    if (bookingSubTab === "approved") return b.status === "Approved";
    if (bookingSubTab === "completed") return b.status === "Completed";
    return b.status === "Rejected"; // declined
  });

  // Mock Earnings ledger
  const mockEarnings = completedSessions * 1500; // Rs 1500 per mock

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-bounce text-xs font-semibold">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Portal Container */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Mentor<span className="text-indigo-600">Hub</span>
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
                Performance Overview
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "bookings"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <CalendarCheck className="h-4 w-4" />
                Manage Requests ({pendingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "feedback"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Award className="h-4 w-4" />
                Submit Mock Scores
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
                Mentor Profile Section
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "settings"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Settings className="h-4 w-4" />
                Availability Settings
              </button>
            </nav>
          </div>

          <div className="p-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-sky-500 to-indigo-500 h-9 w-9 rounded-full text-white flex items-center justify-center font-bold text-sm">
                {mentorProfile.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{mentorProfile.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{mentorProfile.email}</p>
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
                Mentor Workspace Mode
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-slate-650 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm animate-in fade-in"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mentor Workspace</h1>
                <p className="text-slate-500 text-sm mt-1">Check statistics, manage pending bookings, and track mock-interview payouts.</p>
              </div>

              {/* Stats Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Completed</span>
                    <span className="text-lg font-extrabold text-slate-950 block">{completedSessions} sessions</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Total Hours</span>
                    <span className="text-lg font-extrabold text-slate-950 block">{completedSessions * 1} hrs</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                    <Star className="h-5 w-5 fill-emerald-500 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Average Rating</span>
                    <span className="text-lg font-extrabold text-slate-950 block">
                      {mentorProfile.rating !== undefined ? mentorProfile.rating.toFixed(2) : "5.00"}★
                    </span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl">
                    <DollarSign className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Total Earnings</span>
                    <span className="text-lg font-extrabold text-slate-950 block">₹{mockEarnings}</span>
                  </div>
                </div>
              </div>

              {/* Schedules and upcoming calls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1 & 2: Active & Pending Panels */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Immediate Request Panel */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Pending Mock Inquiries</h3>
                    {pendingRequests.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No pending session requests at the moment.</p>
                    ) : (
                      <div className="space-y-3">
                        {pendingRequests.map(req => (
                          <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4">
                            <div>
                              <span className="text-xs font-bold text-slate-900 block">{req.studentName}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">{req.sessionType} • {req.date} at {req.timeSlot}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveBooking(req.id)}
                                className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 rounded-xl transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectBooking(req.id)}
                                className="p-1.5 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl transition-colors"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Approved / Active Sessions */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Upcoming Active Mocks</h3>
                    {approvedRequests.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No approved upcoming sessions listed.</p>
                    ) : (
                      <div className="space-y-3">
                        {approvedRequests.map(app => (
                          <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4 animate-in fade-in">
                            <div>
                              <span className="text-xs font-bold text-slate-900 block">{app.studentName}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">{app.sessionType}</span>
                              <span className="text-[10px] text-indigo-600 font-semibold block mt-1">{app.date} at {app.timeSlot}</span>
                            </div>
                            
                            <button
                              onClick={() => handleLaunchCall(app)}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-[10px] font-bold shadow-md shadow-indigo-100 transition-colors shrink-0"
                            >
                              <Play className="h-3 w-3 fill-white" /> Launch Simulator
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 3: Earnings ledger payouts (Added Intelligence) */}
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-indigo-600" /> Monthly Payout Ledger
                    </h3>

                    {/* CSS mock visual chart bar */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Target Monthly Cap (₹50,000)</span>
                          <span className="font-bold text-slate-700">₹{mockEarnings} earned</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((mockEarnings / 50000) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <hr className="border-slate-100" />

                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                          <span>Recent payout history</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>May 2026</span>
                            <span className="font-bold text-slate-800">₹{mockEarnings} (Pending)</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>April 2026</span>
                            <span className="font-bold text-slate-800">₹12,000 (Paid)</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>March 2026</span>
                            <span className="font-bold text-slate-800">₹8,500 (Paid)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: REQUEST SCHEDULER */}
          {activeTab === "bookings" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Session Bookings</h1>
                  <p className="text-slate-500 text-sm mt-1">Review requests, check calendar alignments, and inspect candidate profiles.</p>
                </div>

                {/* Sub-tabs */}
                <div className="bg-white p-1 rounded-xl border border-slate-150 flex flex-wrap shrink-0">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'pending', label: `Pending (${mentorBookings.filter(b => b.status === "Pending").length})` },
                    { id: 'approved', label: 'Approved' },
                    { id: 'completed', label: 'Completed' },
                    { id: 'declined', label: 'Declined' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setBookingSubTab(sub.id as any)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        bookingSubTab === sub.id
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SEARCH, FILTERS & Timeline Suite */}
              <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Search query */}
                  <div className="md:col-span-6 relative">
                    <input
                      type="text"
                      placeholder="Search by student name, email, or session expectations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-semibold"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Session type dropdown filter */}
                  <div className="md:col-span-4">
                    <select
                      value={sessionTypeFilter}
                      onChange={(e) => setSessionTypeFilter(e.target.value)}
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="all">All Session Types</option>
                      <option value="DSA Mock Interview">DSA Mock Interview</option>
                      <option value="System Design Mock">System Design Mock</option>
                      <option value="HR Mock Interview">HR Mock Interview</option>
                      <option value="Resume Review & Career Prep">Resume Review & Career Prep</option>
                    </select>
                  </div>

                  {/* Reset all filters */}
                  <div className="md:col-span-2">
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSessionTypeFilter("all");
                        setSelectedDateFilter(null);
                        setBookingSubTab("all");
                      }}
                      className="w-full h-full inline-flex items-center justify-center gap-1.5 px-4 py-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 transition-all cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Horizontal Scheduler Workload Timeline */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1"><CalendarCheck className="h-4 w-4 text-indigo-600" /> Upcoming Workload Timeline (Next 14 Days)</span>
                    {selectedDateFilter && (
                      <button
                        onClick={() => setSelectedDateFilter(null)}
                        className="text-[10px] text-indigo-600 hover:underline"
                      >
                        Reset Date Filter ({selectedDateFilter})
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-light">
                    Click any day in the workload row below to filter bookings scheduled for that specific date.
                  </p>

                  <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
                    {(() => {
                      const today = new Date();
                      const timelineDates = Array.from({ length: 14 }, (_, i) => {
                        const d = new Date();
                        d.setDate(today.getDate() + i + 1); // start tomorrow
                        const dateKey = d.toISOString().split("T")[0];
                        const count = bookings.filter(b => 
                          (!mentorProfile.id || b.mentorId === mentorProfile.id) && 
                          b.date === dateKey && 
                          (b.status === "Approved" || b.status === "Pending")
                        ).length;
                        
                        return {
                          dateStr: dateKey,
                          dayOfMonth: d.getDate(),
                          monthLabel: d.toLocaleString('en-US', { month: 'short' }),
                          weekday: d.toLocaleString('en-US', { weekday: 'short' }),
                          count
                        };
                      });

                      return timelineDates.map((day) => {
                        const isActive = selectedDateFilter === day.dateStr;
                        const hasBookings = day.count > 0;
                        
                        let dateStyle = "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50";
                        if (isActive) {
                          dateStyle = "border-indigo-600 bg-indigo-600 text-white shadow-md scale-102";
                        } else if (hasBookings) {
                          dateStyle = "border-indigo-200 bg-indigo-50 text-indigo-900 font-bold hover:bg-indigo-100/50";
                        }

                        return (
                          <div
                            key={day.dateStr}
                            onClick={() => setSelectedDateFilter(isActive ? null : day.dateStr)}
                            className={`flex-shrink-0 w-16 py-2.5 rounded-2xl border text-center transition-all cursor-pointer relative ${dateStyle}`}
                          >
                            <span className="text-[9px] uppercase font-bold block opacity-75">{day.weekday}</span>
                            <span className="text-base font-black tracking-tight block mt-0.5">{day.dayOfMonth}</span>
                            <span className="text-[8px] tracking-wide block font-semibold opacity-85 mt-0.5">{day.monthLabel}</span>
                            
                            {hasBookings && (
                              <span className={`absolute -top-1 -right-1 text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border shadow ${
                                isActive ? "bg-white text-indigo-600 border-indigo-600" : "bg-rose-600 text-white border-rose-100"
                              }`}>
                                {day.count}
                              </span>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* BOOKINGS LIST */}
              {(() => {
                const filteredBookings = bookings.filter(b => {
                  // Mentor filter
                  if (mentorProfile.id && b.mentorId !== mentorProfile.id) return false;

                  // Sub-tab filter
                  if (bookingSubTab !== "all") {
                    if (bookingSubTab === "pending" && b.status !== "Pending") return false;
                    if (bookingSubTab === "approved" && b.status !== "Approved") return false;
                    if (bookingSubTab === "completed" && b.status !== "Completed") return false;
                    if (bookingSubTab === "declined" && b.status !== "Rejected") return false;
                  }

                  // Search query filter
                  if (searchQuery.trim() !== "") {
                    const q = searchQuery.toLowerCase();
                    const nameMatch = b.studentName.toLowerCase().includes(q);
                    const emailMatch = b.studentEmail.toLowerCase().includes(q);
                    const notesMatch = b.notes ? b.notes.toLowerCase().includes(q) : false;
                    if (!nameMatch && !emailMatch && !notesMatch) return false;
                  }

                  // Session type filter
                  if (sessionTypeFilter !== "all" && b.sessionType !== sessionTypeFilter) return false;

                  // Date filter
                  if (selectedDateFilter !== null && b.date !== selectedDateFilter) return false;

                  return true;
                });

                if (filteredBookings.length === 0) {
                  return (
                    <div className="bg-white p-16 text-center rounded-3xl border border-slate-100 shadow-sm space-y-4 max-w-lg mx-auto">
                      <div className="bg-slate-50 text-slate-400 p-4 rounded-full w-fit mx-auto border border-slate-100">
                        <CalendarCheck className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">No sessions match filters</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                          Try searching for a different keyword, updating your date filter, or clearing search properties.
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBookings.map((booking) => {
                      const isExpanded = expandedProfileId === booking.id;
                      return (
                        <div 
                          key={booking.id} 
                          className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200"
                        >
                          <div>
                            {/* Header Details */}
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex items-center gap-2.5">
                                <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-indigo-600 shrink-0">
                                  {booking.sessionType === "DSA Mock Interview" ? <Code className="h-5 w-5 text-indigo-600" /> :
                                   booking.sessionType === "System Design Mock" ? <Monitor className="h-5 w-5 text-sky-600" /> :
                                   booking.sessionType === "HR Mock Interview" ? <User className="h-5 w-5 text-teal-600" /> :
                                   <FileCheck className="h-5 w-5 text-amber-600" />}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900">{booking.sessionType}</h4>
                                  <div className="flex items-center gap-1 mt-0.5 text-[10px] text-indigo-600 font-semibold">
                                    <Clock className="h-3 w-3 text-slate-400" />
                                    <span>{booking.date} at {booking.timeSlot}</span>
                                  </div>
                                </div>
                              </div>

                              <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                                booking.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                booking.status === 'Approved' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                booking.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {booking.status}
                              </span>
                            </div>

                            {/* Student Details */}
                            <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-100/60">
                              <div className="flex items-center gap-2">
                                <div className="bg-indigo-50 h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
                                  {booking.studentName.charAt(0)}
                                </div>
                                <div className="text-[10px] min-w-0">
                                  <span className="font-bold text-slate-800 block truncate">{booking.studentName} (Candidate)</span>
                                  <span className="text-slate-400 block truncate">{booking.studentEmail}</span>
                                </div>
                              </div>
                            </div>

                            {/* Expanded Candidate Dossier */}
                            <button
                              type="button"
                              onClick={() => setExpandedProfileId(isExpanded ? null : booking.id)}
                              className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/60 rounded-xl text-[10px] font-bold text-slate-600 transition-all cursor-pointer"
                            >
                              <Briefcase className="h-3.5 w-3.5" />
                              {isExpanded ? "Hide Candidate Target Dossier" : "Inspect Candidate Target Dossier"}
                            </button>

                            {isExpanded && (
                              <div className="mt-3 p-4 bg-indigo-50/15 border border-indigo-100/40 rounded-2xl space-y-3.5 text-[10px] animate-in slide-in-from-top duration-200">
                                {(() => {
                                  const profile = getStudentProfileData(booking.studentEmail, booking.studentName);
                                  return (
                                    <>
                                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-indigo-100/30">
                                        <div>
                                          <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wide">University & Degree</span>
                                          <span className="font-bold text-slate-700 block mt-0.5 leading-snug">{profile.college}</span>
                                          <span className="text-slate-500 font-light block mt-0.5">{profile.degree} (GPA: {profile.gpa})</span>
                                        </div>
                                        <div>
                                          <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wide">Graduation Year</span>
                                          <span className="font-bold text-slate-700 block mt-0.5">{profile.gradYear}</span>
                                          <span className="text-indigo-600 font-semibold block mt-1 uppercase text-[8px] bg-indigo-50/80 px-1.5 py-0.5 rounded w-fit">{profile.searchStatus}</span>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-indigo-100/30">
                                        <div>
                                          <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wide">Target Role & Companies</span>
                                          <span className="font-bold text-slate-700 block mt-0.5 leading-snug">{profile.targetRole}</span>
                                          <span className="text-slate-500 block mt-0.5">{profile.targetCompanies}</span>
                                        </div>
                                        <div>
                                          <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wide">Technical Stack</span>
                                          <span className="font-semibold text-slate-700 block mt-0.5 truncate" title={profile.languages}>Languages: {profile.languages}</span>
                                          <span className="text-slate-500 block mt-0.5 truncate" title={profile.frameworks}>Libs: {profile.frameworks}</span>
                                        </div>
                                      </div>

                                      <div className="space-y-3">
                                        <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wide text-indigo-700 bg-indigo-50/50 px-2 py-0.5 rounded-full w-fit">Portfolio Projects</span>
                                        {(() => {
                                          const studentProjects = (profile.projects && Array.isArray(profile.projects) && profile.projects.length > 0)
                                            ? profile.projects
                                            : [
                                                { title: profile.project1Title, desc: profile.project1Desc, tech: profile.project1Tech },
                                                { title: profile.project2Title, desc: profile.project2Desc, tech: profile.project2Tech }
                                              ].filter(p => p.title);
                                          
                                          if (studentProjects.length === 0) {
                                            return <span className="text-slate-500 font-light italic block text-[9px]">No projects specified.</span>;
                                          }

                                          return (
                                            <div className="space-y-2">
                                              {studentProjects.map((proj: any, idx: number) => (
                                                <div key={idx} className="bg-white/60 p-2.5 rounded-xl border border-indigo-100/30 space-y-1">
                                                  <span className="font-bold text-slate-800 block text-[10px]">{proj.title || "N/A"}</span>
                                                  <p className="text-slate-500 font-light leading-normal text-[9px]">{proj.desc || "No description provided."}</p>
                                                  <span className="text-indigo-600 font-semibold block text-[8px] mt-0.5">Built with: {proj.tech || "N/A"}</span>
                                                </div>
                                              ))}
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            )}

                            {/* Candidate Custom Notes */}
                            {booking.notes && (
                              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100/60 text-[10px] text-slate-500 leading-normal font-normal">
                                <span className="font-bold text-slate-700 block mb-0.5">Student expectations:</span>
                                {booking.notes}
                              </div>
                            )}

                            {/* Scorecard indicators if completed */}
                            {booking.status === "Completed" && booking.feedback && (
                              <div className="mt-4 p-3 bg-indigo-50/20 border border-indigo-100/50 rounded-xl space-y-2">
                                <span className="text-[9px] font-bold text-indigo-800 uppercase tracking-wide block">Your Score Report</span>
                                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                                  <div className="bg-white py-1 rounded-lg border border-slate-100">
                                    <span className="text-[8px] text-slate-400 font-bold block uppercase">DSA</span>
                                    <span className="text-xs font-black text-indigo-700 block mt-0.5">{booking.feedback.dsaScore}</span>
                                  </div>
                                  <div className="bg-white py-1 rounded-lg border border-slate-100">
                                    <span className="text-[8px] text-slate-400 font-bold block uppercase">System</span>
                                    <span className="text-xs font-black text-indigo-700 block mt-0.5">{booking.feedback.systemDesignScore || "N/A"}</span>
                                  </div>
                                  <div className="bg-white py-1 rounded-lg border border-slate-100">
                                    <span className="text-[8px] text-slate-400 font-bold block uppercase">STAR</span>
                                    <span className="text-xs font-black text-indigo-700 block mt-0.5">{booking.feedback.communicationScore}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Student Rating & Comments */}
                            {booking.status === "Completed" && booking.mentorFeedback && (
                              <div className="mt-3 p-3 bg-amber-50/30 border border-amber-100/50 rounded-xl space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wide">Student Review</span>
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-0.5">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400 animate-pulse" /> {booking.mentorFeedback.rating}.0
                                  </span>
                                </div>
                                {booking.mentorFeedback.comments && (
                                  <p className="text-[10px] text-slate-600 leading-relaxed font-normal italic">
                                    &quot;{booking.mentorFeedback.comments}&quot;
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Card Actions */}
                          <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-between items-center gap-4">
                            {booking.status === "Pending" ? (
                              <>
                                <button
                                  onClick={() => handleRejectBooking(booking.id)}
                                  className="text-[10px] font-bold text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                                >
                                  Decline Request
                                </button>
                                <button
                                  onClick={() => handleApproveBooking(booking.id)}
                                  className="text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                                >
                                  Approve Session
                                </button>
                              </>
                            ) : booking.status === "Approved" ? (
                              <>
                                <span className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600 uppercase tracking-wide">
                                  <span className="h-2 w-2 bg-indigo-600 rounded-full animate-ping shrink-0"></span>
                                  Simulation Ready
                                </span>
                                <button
                                  onClick={() => handleLaunchCall(booking)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-755 text-white text-[10px] font-bold rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer"
                                >
                                  <Video className="h-3.5 w-3.5" /> Start Call Room
                                </button>
                              </>
                            ) : booking.status === "Completed" ? (
                              <>
                                <span className="text-[10px] text-slate-400 font-medium">Feedback Submitted</span>
                                <button
                                  onClick={() => {
                                    setSelectedBookingForFeedback(booking.id);
                                    if (booking.feedback) {
                                      setDsaGrade(booking.feedback.dsaScore);
                                      setSystemDesignGrade(booking.feedback.systemDesignScore || "N/A");
                                      setCommunicationGrade(booking.feedback.communicationScore);
                                      setFeedbackComments(booking.feedback.comments);
                                    }
                                    setActiveTab("feedback");
                                  }}
                                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                >
                                  Edit Scores
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-rose-500 font-semibold">Declined by you</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: FEEDBACK scores FORM */}
          {activeTab === "feedback" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Evaluate Mock Results</h1>
                <p className="text-slate-500 text-sm mt-1">Grade student sessions with numeric sliders, auto-generate AI evaluations, and preview report scorecards.</p>
              </div>

              <form onSubmit={handleSubmitFeedback} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COL: Session Context, Sliders & Report */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Select Booking Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">1. Select Target Session</h3>
                    <div>
                      <select
                        value={selectedBookingForFeedback}
                        onChange={(e) => {
                          setSelectedBookingForFeedback(e.target.value);
                          const bookingObj = bookings.find(b => b.id === e.target.value);
                          if (bookingObj) {
                            if (bookingObj.sessionType === "DSA Mock Interview") handleApplyTemplate('dsa');
                            else if (bookingObj.sessionType === "System Design Mock") handleApplyTemplate('system');
                            else handleApplyTemplate('star');
                          }
                        }}
                        required
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs cursor-pointer font-bold text-slate-750"
                      >
                        <option value="">-- Choose Candidate Session --</option>
                        {bookings.filter(b => (b.status === 'Approved' || b.status === 'Completed') && (!mentorProfile.id || b.mentorId === mentorProfile.id)).map(b => (
                          <option key={b.id} value={b.id}>
                            {b.studentName} - {b.sessionType} ({b.date}) [{b.status}]
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedBookingForFeedback && (
                      <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-[11px] text-slate-600 space-y-2.5 animate-in fade-in">
                        <div className="flex justify-between items-center pb-1 border-b border-slate-200/50">
                          <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider">Candidate Coordinates</span>
                          <span className="text-[9px] text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded font-black uppercase">
                            {bookings.find(b => b.id === selectedBookingForFeedback)?.status} Session
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-semibold">Student Name</span>
                            <span className="font-bold text-slate-700 block mt-0.5">{bookings.find(b => b.id === selectedBookingForFeedback)?.studentName}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-semibold">Scheduled Date</span>
                            <span className="font-bold text-slate-700 block mt-0.5">{bookings.find(b => b.id === selectedBookingForFeedback)?.date}</span>
                          </div>
                        </div>
                        {bookings.find(b => b.id === selectedBookingForFeedback)?.notes && (
                          <div>
                            <span className="text-[9px] text-slate-400 block font-semibold">Expectations & Focus Areas</span>
                            <span className="block mt-0.5 font-normal leading-normal italic text-slate-500 bg-white p-2 rounded-xl border border-slate-100">&quot;{bookings.find(b => b.id === selectedBookingForFeedback)?.notes}&quot;</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Competency Metric Sliders (OVERHAUL) */}
                  {selectedBookingForFeedback && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in slide-in-from-bottom duration-250">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">2. Performance Competency Sliders</h3>
                        <p className="text-[11px] text-slate-400 font-light mt-1">Adjust numeric scales (0-10) to generate recommended letter grades.</p>
                      </div>

                      {(() => {
                        const activeBooking = bookings.find(b => b.id === selectedBookingForFeedback);
                        const topic = activeBooking?.sessionType || "DSA Mock Interview";
                        
                        let label1 = "Algorithmic Logic & Correctness";
                        let label2 = "Complexity Bounds (Time & Space)";
                        let label3 = "Code Cleanliness & Boundary Testing";

                        if (topic === "System Design Mock") {
                          label1 = "System Topology & Diagrams";
                          label2 = "Data Sharding, Caching & Master-Replica";
                          label3 = "Reliability & Bottleneck Identification";
                        } else if (topic === "HR Mock Interview") {
                          label1 = "STAR Story Narrative Structure";
                          label2 = "Business Outcomes Quantification";
                          label3 = "Communication Pacing & Presence";
                        } else if (topic === "Resume Review & Career Prep") {
                          label1 = "Keyword Density & Stack Alignment";
                          label2 = "Action Verbs & Impact Metrics";
                          label3 = "Structure, Layout & Readability";
                        }

                        const avgScore = ((scoreSubMetric1 + scoreSubMetric2 + scoreSubMetric3) / 3).toFixed(1);
                        const suggested = getSuggestedGrade(parseFloat(avgScore));

                        return (
                          <div className="space-y-5">
                            {/* Slider 1 */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                                <span>{label1}</span>
                                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-black">{scoreSubMetric1}/10</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={scoreSubMetric1}
                                onChange={(e) => setScoreSubMetric1(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                              />
                            </div>

                            {/* Slider 2 */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                                <span>{label2}</span>
                                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-black">{scoreSubMetric2}/10</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={scoreSubMetric2}
                                onChange={(e) => setScoreSubMetric2(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                              />
                            </div>

                            {/* Slider 3 */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                                <span>{label3}</span>
                                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-black">{scoreSubMetric3}/10</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={scoreSubMetric3}
                                onChange={(e) => setScoreSubMetric3(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                              />
                            </div>

                            {/* Live recommendation summary */}
                            <div className="p-4 bg-indigo-50/40 border border-indigo-100/50 rounded-2xl flex justify-between items-center gap-4">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Estimated Score</span>
                                <span className="text-lg font-black text-slate-900 block mt-0.5">{avgScore} / 10 Average</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Suggested Grade</span>
                                <span className="text-2xl font-black text-indigo-700 block tracking-tight">{suggested}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Manual Override controls */}
                  {selectedBookingForFeedback && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-indigo-600" />
                        <h3 className="text-sm font-bold text-slate-900">3. Select Letter Grades (Override Options)</h3>
                      </div>
                      
                      <div className="space-y-5">
                        {/* DSA Grade */}
                        <div className="space-y-2">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Data Structures & Algorithms (DSA) Grade
                          </label>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                            {["A+", "A", "A-", "B+", "B", "B-", "C", "N/A"].map((grade) => (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => setDsaGrade(grade)}
                                className={`py-1.5 text-center rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                                  dsaGrade === grade
                                    ? "bg-indigo-600 border-indigo-700 text-white shadow shadow-indigo-200 font-black"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50"
                                }`}
                              >
                                {grade}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* System Design Grade */}
                        <div className="space-y-2">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            System Architecture Design Grade
                          </label>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                            {["A+", "A", "A-", "B+", "B", "B-", "C", "N/A"].map((grade) => (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => setSystemDesignGrade(grade)}
                                className={`py-1.5 text-center rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                                  systemDesignGrade === grade
                                    ? "bg-indigo-600 border-indigo-700 text-white shadow shadow-indigo-200 font-black"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50"
                                }`}
                              >
                                {grade}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Communication Grade */}
                        <div className="space-y-2">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            STAR Behavioral & Soft Skills Grade
                          </label>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                            {["A+", "A", "A-", "B+", "B", "B-", "C", "N/A"].map((grade) => (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => setCommunicationGrade(grade)}
                                className={`py-1.5 text-center rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                                  communicationGrade === grade
                                    ? "bg-indigo-600 border-indigo-700 text-white shadow shadow-indigo-200 font-black"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50"
                                }`}
                              >
                                {grade}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback Commentary Card */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">4. Interview Report Details</h3>
                      
                      {/* Template buttons */}
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={handleGenerateAIDraft}
                          disabled={!selectedBookingForFeedback}
                          className="text-[9px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                        >
                          ✨ AI Draft Report
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTemplate('dsa')}
                          className="text-[9px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          + DSA Template
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTemplate('system')}
                          className="text-[9px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          + System Template
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTemplate('star')}
                          className="text-[9px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          + STAR Template
                        </button>
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={8}
                        required
                        value={feedbackComments}
                        onChange={(e) => setFeedbackComments(e.target.value)}
                        placeholder="Detail performance outcomes. Mention strengths, points of optimization, complexity details, caching recommendations, or response pacing metrics..."
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder-slate-450 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs font-mono leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedBookingForFeedback}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4" /> Submit Report Card Evaluation
                    </button>
                  </div>
                </div>

                {/* RIGHT COL: Rubrics & Scorecard Live Preview */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Scorecard Live Preview Panel */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Live Student Report Preview</h3>
                      <span className="flex items-center gap-1.5 text-[8px] font-bold text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                        <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-pulse"></span>
                        Live
                      </span>
                    </div>

                    {/* Report box visual */}
                    {(() => {
                      const activeBooking = bookings.find(b => b.id === selectedBookingForFeedback);
                      const studentName = activeBooking?.studentName || "Candidate Name";
                      const sessionType = activeBooking?.sessionType || "MOCK SESSION";
                      const dateVal = activeBooking?.date || "YYYY-MM-DD";

                      return (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-50/50 p-4 space-y-4 text-slate-800">
                          {/* Inner preview card styled like actual modal */}
                          <div className="bg-white rounded-xl border border-slate-200 shadow p-5 space-y-4">
                            {/* Report Header */}
                            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                              <div>
                                <h4 className="text-[11px] font-black text-slate-905 uppercase tracking-wider leading-none">Assessment Report</h4>
                                <span className="text-[8px] text-slate-400 block mt-1">ID: SEC-EM-BOOKING-PREV</span>
                              </div>
                              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-lg text-[8px] uppercase tracking-wide">
                                {sessionType.replace(" Mock Interview", "").replace(" Mock", "")}
                              </span>
                            </div>

                            {/* Sub header */}
                            <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 py-1 bg-slate-50 rounded-lg px-2">
                              <div>
                                <span className="block font-bold text-[8px]">Candidate</span>
                                <span className="block text-slate-700 mt-0.5 font-semibold">{studentName}</span>
                              </div>
                              <div>
                                <span className="block font-bold text-[8px]">Evaluator</span>
                                <span className="block text-slate-700 mt-0.5 font-semibold">{mentorProfile.name}</span>
                              </div>
                            </div>

                            {/* Ratings preview */}
                            <div className="space-y-2">
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Assessed Scores</span>
                              <div className="grid grid-cols-3 gap-1.5 text-center">
                                <div className="bg-slate-50/80 p-1.5 rounded-lg border border-slate-100">
                                  <span className="text-[7px] text-slate-400 font-bold block uppercase">DSA</span>
                                  <span className="text-xs font-black text-indigo-700 block mt-0.5">{dsaGrade}</span>
                                </div>
                                <div className="bg-slate-50/80 p-1.5 rounded-lg border border-slate-100">
                                  <span className="text-[7px] text-slate-400 font-bold block uppercase">SYSTEM</span>
                                  <span className="text-xs font-black text-indigo-700 block mt-0.5">{systemDesignGrade}</span>
                                </div>
                                <div className="bg-slate-50/80 p-1.5 rounded-lg border border-slate-100">
                                  <span className="text-[7px] text-slate-400 font-bold block uppercase">STAR</span>
                                  <span className="text-xs font-black text-indigo-700 block mt-0.5">{communicationGrade}</span>
                                </div>
                              </div>
                            </div>

                            {/* Competency metrics slider sync */}
                            {selectedBookingForFeedback && (
                              <div className="space-y-1.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Competency Scales</span>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[8px] text-slate-500 font-semibold">
                                    <span>Metric A</span>
                                    <span>{scoreSubMetric1 * 10}%</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${scoreSubMetric1 * 10}%` }}></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[8px] text-slate-500 font-semibold">
                                    <span>Metric B</span>
                                    <span>{scoreSubMetric2 * 10}%</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${scoreSubMetric2 * 10}%` }}></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[8px] text-slate-500 font-semibold">
                                    <span>Metric C</span>
                                    <span>{scoreSubMetric3 * 10}%</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${scoreSubMetric3 * 10}%` }}></div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Written reviews snippet */}
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Written Comments Draft</span>
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-105 text-[8px] text-slate-500 font-light max-h-24 overflow-y-auto leading-normal whitespace-pre-wrap font-mono">
                                {feedbackComments || "No notes written yet. Select template or generate AI draft..."}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Rubric Matrix Checklist */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Standard Assessment Rubrics</h3>
                    
                    {(() => {
                      const activeBooking = bookings.find(b => b.id === selectedBookingForFeedback);
                      const topic = activeBooking?.sessionType || "DSA Mock Interview";
                      
                      const rubrics = 
                        topic === "DSA Mock Interview" ? [
                          { label: "Complexity bounds", desc: "Identify Big O runtime and memory consumption limits." },
                          { label: "Code correctness", desc: "Syntax alignment, clean dynamic data arrays, tree traversals." },
                          { label: "Boundary test runs", desc: "Scan for empty structures, negatives, or numerical overflow limits." },
                          { label: "Manual Dry Tracing", desc: "Walk through variables step by step before coding." }
                        ] :
                        topic === "System Design Mock" ? [
                          { label: "High Level Diagrams", desc: "Outline clients, DNS, load balancers, APIs, servers, databases." },
                          { label: "Database Sharding Ring", desc: "Explain consistent hashing, caching keys, master-replica patterns." },
                          { label: "Scaling bottleneck", desc: "Address single-point-of-failure limits and high reliability limits." },
                          { label: "API payload structures", desc: "Structure message payloads using REST, GraphQL, or gRPC specs." }
                        ] : [
                          { label: "Situation structure (STAR)", desc: "Set background constraints, goals, and actions concisely." },
                          { label: "Personal impact metrics", desc: "Explain outcome percentages, cash savings, or team speed metrics." },
                          { label: "Technical leadership indicators", desc: "Demonstrate cross-functional leadership, trade-offs, and pushback handling." },
                          { label: "Speed & Communication clarity", desc: "Logical narrative flow, standard engineering terms check." }
                        ];

                      return (
                        <div className="space-y-3">
                          <p className="text-[10px] text-slate-400 leading-normal font-normal">
                            Assess candidate against these evaluation criteria during grading score assignments:
                          </p>
                          <div className="space-y-2">
                            {rubrics.map((rubric, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-2.5">
                                <div className="mt-0.5 h-3.5 w-3.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-200 flex items-center justify-center font-bold text-[8px]">
                                  {idx + 1}
                                </div>
                                <div className="text-[10px]">
                                  <span className="font-bold text-slate-800 block">{rubric.label}</span>
                                  <span className="text-slate-500 font-light block leading-normal mt-0.5">{rubric.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: MENTOR PROFILE TAB (ADDED INTELLIGENCE: NEW DETAILED PROFILE SETUP) */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mentor Profile Setup</h1>
                <p className="text-slate-500 text-sm mt-1">Configure profile coordinates, tech scopes, and view student testimonial ratings.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1 & 2: Edit Form */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Professional Credentials
                  </h3>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          required
                          value={mentorProfile.name}
                          onChange={(e) => setMentorProfile({ ...mentorProfile, name: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Current Email Coordinates
                        </label>
                        <input
                          type="email"
                          disabled
                          value={mentorProfile.email}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-400 text-xs cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={mentorProfile.phone || ""}
                          onChange={(e) => setMentorProfile({ ...mentorProfile, phone: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Engineering Role Description
                        </label>
                        <input
                          type="text"
                          value={mentorProfile.role}
                          onChange={(e) => setMentorProfile({ ...mentorProfile, role: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Target Employer / Company
                        </label>
                        <input
                          type="text"
                          value={mentorProfile.company}
                          onChange={(e) => setMentorProfile({ ...mentorProfile, company: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Experience Level YOE
                        </label>
                        <input
                          type="text"
                          value={mentorProfile.yoe}
                          onChange={(e) => setMentorProfile({ ...mentorProfile, yoe: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          LinkedIn Link
                        </label>
                        <input
                          type="url"
                          value={mentorProfile.linkedinUrl}
                          onChange={(e) => setMentorProfile({ ...mentorProfile, linkedinUrl: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          GitHub Link
                        </label>
                        <input
                          type="url"
                          value={mentorProfile.githubUrl}
                          onChange={(e) => setMentorProfile({ ...mentorProfile, githubUrl: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Professional Overview Bio
                      </label>
                      <textarea
                        rows={3}
                        value={mentorProfile.bio}
                        onChange={(e) => setMentorProfile({ ...mentorProfile, bio: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Programming Languages Spec
                        </label>
                        <input
                          type="text"
                          value={mentorProfile.languages || ""}
                          onChange={(e) => setMentorProfile({ ...mentorProfile, languages: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Hobbies / Personal Info
                        </label>
                        <input
                          type="text"
                          value={mentorProfile.hobbies || ""}
                          onChange={(e) => setMentorProfile({ ...mentorProfile, hobbies: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Specialty Skills (Type skill and press Enter or Comma)
                      </label>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Type skill (e.g. Node, Python, Communication) and press Enter"
                          value={newSkillText}
                          onChange={(e) => setNewSkillText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              const val = newSkillText.trim().replace(/,$/, '');
                              const currentSkills = Array.isArray(mentorProfile.skills) ? mentorProfile.skills : [];
                              if (val && !currentSkills.includes(val)) {
                                setMentorProfile({ 
                                  ...mentorProfile, 
                                  skills: [...currentSkills, val] 
                                });
                              }
                              setNewSkillText("");
                            }
                          }}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        
                        {(Array.isArray(mentorProfile.skills) && mentorProfile.skills.length > 0) && (
                          <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                            {mentorProfile.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => setMentorProfile({
                                    ...mentorProfile,
                                    skills: mentorProfile.skills.filter(s => s !== skill)
                                  })}
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

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      <Save className="h-4 w-4" /> Save Professional Credentials
                    </button>
                  </form>
                </div>

                {/* Column 3: Badge Achievements and Testimonials */}
                <div className="space-y-8">
                  {/* Badges card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <Award className="h-4 w-4 text-indigo-600" /> Platform Achievements
                    </h3>

                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
                        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-700">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">PeerPilott Contributor</span>
                          <span className="text-[9px] text-slate-400">Completed 100+ simulated mocks</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
                        <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">5-Star Architect</span>
                          <span className="text-[9px] text-slate-400">Maintained &gt; 4.9 average rating score</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Testimonials List */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-indigo-600" /> Student Testimonials
                    </h3>

                    <div className="space-y-4 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                      <div className="space-y-1.5 pt-3">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-700">Akash Gupta</span>
                          <span className="text-amber-500 flex items-center gap-0.5 font-bold">5★</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal font-light">
                          &ldquo;Invaluable feedback! Helped me correct sharding bottleneck assumptions.&rdquo;
                        </p>
                      </div>
                      <div className="space-y-1.5 pt-3">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-700">Prashant S.</span>
                          <span className="text-amber-500 flex items-center gap-0.5 font-bold">5★</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal font-light">
                          &ldquo;Structured mock loops that felt exactly likeMeta coding rounds.&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AVAILABILITY SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Availability Settings</h1>
                  <p className="text-slate-500 text-sm mt-1">Configure your weekly operating days, timeslots, and calendar date blockouts.</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl text-[11px] text-amber-800 font-semibold max-w-sm">
                  <Info className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>Changes sync instantly to the student portal once saved.</span>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Days & Slots */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Weekdays */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4 text-indigo-600" />
                        <h3 className="text-sm font-bold text-slate-900">Weekly Operating Days</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 font-light">
                        Select which days of the week you are generally open to accept mock sessions.
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                          const isChecked = availableDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                if (isChecked) {
                                  setAvailableDays(availableDays.filter(d => d !== day));
                                } else {
                                  setAvailableDays([...availableDays, day]);
                                }
                              }}
                              className={`py-2.5 px-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                                isChecked
                                  ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-sm"
                                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100/50"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Slots */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-indigo-600" />
                          <h3 className="text-sm font-bold text-slate-900">Hourly Meeting Windows</h3>
                        </div>
                        {/* Quick actions */}
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => setAvailableSlots(["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:30 PM", "6:00 PM", "7:00 PM", "8:00 PM"])}
                            className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-100"
                          >
                            All
                          </button>
                          <button
                            type="button"
                            onClick={() => setAvailableSlots(["10:00 AM", "2:00 PM", "4:30 PM", "7:00 PM"])}
                            className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg hover:bg-slate-200"
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            onClick={() => setAvailableSlots([])}
                            className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg hover:bg-rose-100"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 font-light">
                        Configure the exact time slots students can book on your scheduled days.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:30 PM", "6:00 PM", "7:00 PM", "8:00 PM"].map(slot => {
                          const isChecked = availableSlots.includes(slot);
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                if (isChecked) {
                                  setAvailableSlots(availableSlots.filter(s => s !== slot));
                                } else {
                                  setAvailableSlots([...availableSlots, slot]);
                                }
                              }}
                              className={`py-2 px-1 text-[11px] rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                                isChecked
                                  ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-sm"
                                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100/50"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Calendar Date Exceptions */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-600" />
                          <h3 className="text-sm font-bold text-slate-900">14-Day Calendar Exception Planner</h3>
                        </div>
                        {blockedDates.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setBlockedDates([])}
                            className="text-[10px] font-bold text-rose-600 hover:underline"
                          >
                            Clear All Blockouts ({blockedDates.length})
                          </button>
                        )}
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold text-slate-700 block">💡 How to manage calendar blockouts:</span>
                        <ul className="text-[10px] text-slate-500 space-y-1 font-light list-disc pl-4 leading-normal">
                          <li>Click on any scheduled <span className="text-emerald-600 font-semibold">Available</span> day to block it out (e.g. for personal leave).</li>
                          <li>Click a <span className="text-rose-600 font-semibold">Blocked</span> day to make it open for booking again.</li>
                          <li>Days with active student bookings are locked (<span className="text-indigo-600 font-semibold">Booked</span>) to prevent accidental cancellations.</li>
                        </ul>
                      </div>

                      {/* 14 Day Grid Calendar */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {getMentor14Days().map((day) => {
                          const hasBookings = day.bookedSessions.length > 0;
                          
                          // Style states:
                          // 1. Has bookings: locked
                          // 2. Weekday not in availableDays: Off-day
                          // 3. Blocked: Red blockout
                          // 4. Available: Green
                          let cardStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed";
                          let badgeText = "Off-day";
                          let badgeStyle = "bg-slate-100 text-slate-500 border-slate-200";
                          let canToggle = false;

                          if (hasBookings) {
                            cardStyle = "border-indigo-200 bg-indigo-50/50 text-indigo-900 cursor-not-allowed shadow-sm";
                            badgeText = "Booked";
                            badgeStyle = "bg-indigo-600 text-white border-indigo-700";
                            canToggle = false;
                          } else if (day.isWeekdayScheduled) {
                            canToggle = true;
                            if (day.isBlocked) {
                              cardStyle = "border-rose-300 bg-rose-50/50 text-rose-900 hover:bg-rose-50 cursor-pointer shadow-sm animate-in fade-in duration-200";
                              badgeText = "Blocked";
                              badgeStyle = "bg-rose-600 text-white border-rose-700";
                            } else {
                              cardStyle = "border-emerald-300 bg-emerald-50/20 text-emerald-900 hover:bg-emerald-50/50 cursor-pointer hover:border-emerald-400 transition-all";
                              badgeText = "Available";
                              badgeStyle = "bg-emerald-600 text-white border-emerald-700";
                            }
                          }

                          return (
                            <div
                              key={day.dateStr}
                              onClick={() => {
                                if (canToggle) {
                                  if (day.isBlocked) {
                                    setBlockedDates(blockedDates.filter(d => d !== day.dateStr));
                                  } else {
                                    setBlockedDates([...blockedDates, day.dateStr]);
                                  }
                                }
                              }}
                              className={`p-3.5 rounded-2xl border flex flex-col justify-between h-28 text-left transition-all ${cardStyle}`}
                            >
                              <div className="flex justify-between items-start w-full">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">{day.dayOfWeek}</span>
                                  <span className="text-lg font-black text-slate-800 tracking-tight block mt-0.5">{day.dayOfMonth} {day.monthLabel}</span>
                                </div>
                                <span className={`inline-flex px-1.5 py-0.5 rounded-lg text-[8px] font-bold border ${badgeStyle}`}>
                                  {badgeText}
                                </span>
                              </div>

                              <div className="text-[9px] mt-2 font-medium">
                                {hasBookings ? (
                                  <div className="min-w-0">
                                    <span className="font-bold text-indigo-700 truncate block">
                                      {day.bookedSessions[0].studentName}
                                    </span>
                                    <span className="text-[8px] text-indigo-500 truncate block mt-0.5">
                                      {day.bookedSessions[0].timeSlot} • {day.bookedSessions[0].sessionType.replace(" Mock Interview", "").replace(" Mock", "")}
                                    </span>
                                  </div>
                                ) : day.isWeekdayScheduled ? (
                                  day.isBlocked ? (
                                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                                      <XCircle className="h-3 w-3" /> Blocked for booking
                                    </span>
                                  ) : (
                                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3 text-emerald-600" /> Open for booking
                                    </span>
                                  )
                                ) : (
                                  <span className="text-slate-400 font-normal">
                                    Not operating day
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Available Schedule Bar */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Confirm Availability Setup</h4>
                    <p className="text-[11px] text-slate-300 font-light mt-1">
                      Active: {availableDays.length} operating days/week • {availableSlots.length} slots/day • {blockedDates.length} exception blockouts.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-755 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-indigo-550/20 cursor-pointer"
                  >
                    <Save className="h-4 w-4" /> Save Available Schedule
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* SIMULATED LIVE CALL OVERLAY */}
      {simulatedCallBooking && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col font-sans text-white select-none">
          {/* Header */}
          <div className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Live Mock Call</span>
              <span className="text-slate-400">|</span>
              <span className="text-xs font-medium">Candidate: {simulatedCallBooking.studentName}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono bg-slate-950 border border-slate-800 px-4 py-1.5 rounded-full">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Session ends in: <span className="text-indigo-400 font-bold">{formatTimer(callTimer)}</span></span>
            </div>

            <button
              onClick={handleEndCall}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
            >
              End Call & Write Feedback
            </button>
          </div>

          {/* Main workspace */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Whiteboard / Code Canvas */}
            <div className="flex-1 flex flex-col bg-slate-950 border-r border-slate-800">
              <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><PenTool className="h-3.5 w-3.5 text-indigo-400" /> Live Whiteboard Sketchpad</span>
                <span>Language: JS / TS</span>
              </div>
              <textarea
                value={whiteboardText}
                onChange={(e) => whiteboardText && setWhiteboardText(e.target.value)}
                className="flex-1 w-full bg-slate-950 p-6 text-xs font-mono text-indigo-200 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Video Streams panel */}
            <div className="w-full md:w-80 bg-slate-900 flex flex-col divide-y divide-slate-800">
              <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-indigo-500/20">
                  A
                </div>
                <span className="absolute bottom-3 left-3 text-[10px] font-bold text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-white/5">
                  Candidate ({simulatedCallBooking.studentName})
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] text-slate-500 italic">Audio Connect ok</span>
              </div>

              <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="h-16 w-16 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-sky-500/20">
                  M
                </div>
                <span className="absolute bottom-3 left-3 text-[10px] font-bold text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-white/5">
                  You ({mentorProfile.name})
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] text-indigo-500 font-semibold flex items-center gap-1">
                  <Monitor className="h-3 w-3" /> Screen Share ok
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
