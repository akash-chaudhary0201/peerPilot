"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mentors as defaultMentors, Mentor } from "@/data/mentors";
import { initialBookings, Booking } from "@/data/bookings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemePicker from "@/components/ThemePicker";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarCheck,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  Search,
  Award,
  ShieldAlert,
  DollarSign,
  TrendingUp,
  UserCheck,
  Clock,
  Lock,
  Building,
  Code,
  Sparkles,
  User,
  Check,
  FileText,
  ChevronRight,
  Shield,
  Building2,
  Calendar,
  Activity,
  Sliders,
  Sparkle,
  Github,
  Linkedin,
  Globe,
  Filter,
  GraduationCap,
  Percent,
  X
} from "lucide-react";

// ==========================================
// COLUMN CONFIGURATION & EXCEL EXPORT HELPER
// ==========================================

const studentHeadersMap = {
  name: "Name",
  email: "Email",
  targetRole: "Target Role Focus",
  gpa: "GPA",
  gradYear: "Grad Year",
  status: "Status"
};

const mentorHeadersMap = {
  name: "Name",
  email: "Email",
  role: "Role",
  company: "Company",
  sessions: "Sessions",
  rating: "Rating"
};

const exportToCSV = (data: any[], visibleCols: Record<string, boolean>, headersMap: Record<string, string>, filename: string) => {
  const activeKeys = Object.keys(visibleCols).filter(key => visibleCols[key]);
  const headers = activeKeys.map(key => headersMap[key]);
  
  const csvRows = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",")
  ];

  data.forEach(item => {
    const row = activeKeys.map(key => {
      let val = "";
      if (key === "name") val = item.name || "";
      else if (key === "email") val = item.email || "";
      else if (key === "targetRole") val = item.targetRole || "";
      else if (key === "gpa") val = item.gpa || "";
      else if (key === "gradYear") val = item.gradYear || "";
      else if (key === "status") val = item.searchStatus || "Registered";
      else if (key === "role") val = item.role || "";
      else if (key === "company") val = item.company || "";
      else if (key === "sessions") val = (item.completedSessions ?? 0).toString();
      else if (key === "rating") val = (item.rating ?? 0).toString();

      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(row.join(","));
  });

  const csvContent = "\uFEFF" + csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==========================================
// SEEDED SANDBOX DATASETS FOR ADMINISTRATION
// ==========================================

const seededStudents = [
  {
    name: "Akash Gupta",
    email: "akash@gmail.com",
    phone: "+91 98765 43210",
    githubUrl: "https://github.com/akash-gupta",
    linkedinUrl: "https://linkedin.com/in/akash-gupta",
    portfolioUrl: "https://akashgupta.dev",
    college: "IIIT Delhi",
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
    project1Tech: "Next.js, Tailwind, React Hooks, LocalStorage",
    project2Title: "Low Latency API Orchestrator",
    project2Desc: "Designed an API microservice that caches request blocks using Redis cache layers and stores transactional data logs.",
    project2Tech: "TypeScript, Express, Redis, PostgreSQL"
  },
  {
    name: "Priyanshu Sharma",
    email: "priyanshu@gmail.com",
    phone: "+91 88765 12345",
    githubUrl: "https://github.com/priyanshu-sharma",
    linkedinUrl: "https://linkedin.com/in/priyanshu-sharma",
    portfolioUrl: "https://priyanshu.dev",
    college: "IIT Bombay",
    degree: "B.Tech in Electrical Engineering",
    gradYear: "2025",
    gpa: "9.2/10",
    targetRole: "Backend Engineer",
    targetCompanies: "Meta, Stripe, Razorpay",
    preferredLocation: "Bengaluru",
    searchStatus: "Actively Looking",
    yoe: "Fresher / New Grad",
    languages: "Go, C++, Python, SQL",
    frameworks: "Gin, Express, Docker, Kubernetes, AWS",
    project1Title: "Distributed Key-Value Store",
    project1Desc: "Created a partitioned key-value store using Raft consensus for state replication.",
    project1Tech: "Go, gRPC, Protobuf, Raft consensus",
    project2Title: "Metrics Collector Daemon",
    project2Desc: "Background system daemon collecting memory heap snapshots and pushing payload vectors to PromQL database endpoints.",
    project2Tech: "C++, Prometheus, Grafana"
  },
  {
    name: "Sumit Nair",
    email: "sumitnair@gmail.com",
    phone: "+91 77654 32109",
    githubUrl: "https://github.com/sumit-nair",
    linkedinUrl: "https://linkedin.com/in/sumit-nair",
    portfolioUrl: "https://sumitnair.dev",
    college: "BITS Pilani",
    degree: "M.Sc in Physics + B.E. in Computer Science",
    gradYear: "2026",
    gpa: "8.5/10",
    targetRole: "Full Stack Developer",
    targetCompanies: "Atlassian, Microsoft, Netflix",
    preferredLocation: "Remote",
    searchStatus: "Open to Offers",
    yoe: "1 Year (Internship)",
    languages: "Java, JavaScript, Python",
    frameworks: "Spring Boot, React, PostgreSQL, Docker, Redis",
    project1Title: "Collab Canvas Board",
    project1Desc: "Real-time canvas editor supporting concurrent pointer updates and undo-redo transactional stacks.",
    project1Tech: "React, Spring Boot WebSockets, Redis, PostgreSQL",
    project2Title: "Microservice File Processor",
    project2Desc: "Event-driven architecture analyzing bulk text files asynchronously via queue allocations.",
    project2Tech: "Java, AWS SQS, Spring Batch"
  },
  {
    name: "Ananya Roy",
    email: "ananya@gmail.com",
    phone: "+91 91234 56789",
    githubUrl: "https://github.com/ananya-roy",
    linkedinUrl: "https://linkedin.com/in/ananya-roy",
    portfolioUrl: "https://ananya.dev",
    college: "NIT Trichy",
    degree: "B.Tech in Computer Science",
    gradYear: "2025",
    gpa: "9.5/10",
    targetRole: "Machine Learning Engineer",
    targetCompanies: "Meta, Google, Apple",
    preferredLocation: "Bengaluru / Remote",
    searchStatus: "Actively Looking",
    yoe: "Fresher / New Grad",
    languages: "Python, R, Julia, SQL",
    frameworks: "PyTorch, Scikit-Learn, TensorFlow, NumPy, FastAPI",
    project1Title: "Real-time Edge Segmentation model",
    project1Desc: "Optimized U-Net image semantic segmentation algorithm to achieve 45 FPS on edge GPUs.",
    project1Tech: "PyTorch, CUDA, TensorRT, FastAPI",
    project2Title: "Quantized Language Transformer",
    project2Desc: "Quantized 7B parameter text generation model to 4-bit weights with low execution latency.",
    project2Tech: "Python, HuggingFace, LlamaCpp"
  },
  {
    name: "Tarun Mehta",
    email: "tarun@gmail.com",
    phone: "+91 93456 78901",
    githubUrl: "https://github.com/tarun-mehta",
    linkedinUrl: "https://linkedin.com/in/tarun-mehta",
    portfolioUrl: "https://tarun.dev",
    college: "DTU Delhi",
    degree: "B.Tech in Software Engineering",
    gradYear: "2026",
    gpa: "7.9/10",
    targetRole: "Systems Engineer",
    targetCompanies: "Uber, Amazon, Microsoft",
    preferredLocation: "Bengaluru / Pune",
    searchStatus: "Actively Looking",
    yoe: "Fresher / New Grad",
    languages: "Rust, C, C++, Assembly",
    frameworks: "Linux Kernel, Docker, WebAssembly, SQLite",
    project1Title: "Custom Kernel Scheduler Mock",
    project1Desc: "Designed an interactive process scheduler simulator implementing priority-based scheduling algorithms.",
    project1Tech: "Rust, Linux system libraries, Assembly",
    project2Title: "Low-Latency File System Driver",
    project2Desc: "Lightweight, read-only file allocation driver operating directly within user spaces.",
    project2Tech: "C, FUSE library, SQLite"
  },
  {
    name: "Pooja Desai",
    email: "pooja@gmail.com",
    phone: "+91 94567 89012",
    githubUrl: "https://github.com/pooja-desai",
    linkedinUrl: "https://linkedin.com/in/pooja-desai",
    portfolioUrl: "https://pooja.dev",
    college: "RV College of Engineering",
    degree: "B.E. in Information Science",
    gradYear: "2026",
    gpa: "8.9/10",
    targetRole: "Frontend Developer",
    targetCompanies: "Meta, Google, Razorpay",
    preferredLocation: "Bengaluru / Hyderabad",
    searchStatus: "Open to Offers",
    yoe: "Fresher / New Grad",
    languages: "TypeScript, CSS/Sass, JavaScript",
    frameworks: "React, Svelte, Vue.js, Tailwind CSS, Cypress",
    project1Title: "E-Commerce Fluid Canvas",
    project1Desc: "Re-engineered a checkout page with custom micro-animations and offline persistence triggers.",
    project1Tech: "React, Svelte, Sass, IndexedDB, Tailwind CSS",
    project2Title: "Web Accessibility Audit Tool",
    project2Desc: "Linter script auditing HTML formats against WCAG color-contrast guidelines automatically.",
    project2Tech: "TypeScript, Node CLI, Cypress"
  },
  {
    name: "Rohit Sen",
    email: "rohit@gmail.com",
    phone: "+91 95678 90123",
    githubUrl: "https://github.com/rohit-sen",
    linkedinUrl: "https://linkedin.com/in/rohit-sen",
    portfolioUrl: "https://rohit.dev",
    college: "COEP Pune",
    degree: "B.Tech in Computer Engineering",
    gradYear: "2025",
    gpa: "8.2/10",
    targetRole: "DevOps Engineer",
    targetCompanies: "Netflix, Amazon, Google",
    preferredLocation: "Remote",
    searchStatus: "Actively Looking",
    yoe: "1 Year",
    languages: "Python, Shell scripting, Go, Yaml",
    frameworks: "Terraform, Ansible, Docker, Kubernetes, Jenkins, AWS",
    project1Title: "Multi-Region Cloud Deployer",
    project1Desc: "Wrote Terraform scripts to spin up fault-tolerant VPC clusters with automatic scaling groups.",
    project1Tech: "Terraform, AWS, Ansible, Bash",
    project2Title: "Canary Deployment Controller",
    project2Desc: "Integrated Istio virtual service routers to route canary loads dynamically under monitoring thresholds.",
    project2Tech: "Kubernetes, Istio, Prometheus"
  },
  {
    name: "Sneha Patel",
    email: "sneha@gmail.com",
    phone: "+91 96789 01234",
    githubUrl: "https://github.com/sneha-patel",
    linkedinUrl: "https://linkedin.com/in/sneha-patel",
    portfolioUrl: "https://sneha.dev",
    college: "VIT Vellore",
    degree: "B.Tech in Information Technology",
    gradYear: "2026",
    gpa: "9.1/10",
    targetRole: "Full Stack Engineer",
    targetCompanies: "Stripe, Uber, Razorpay",
    preferredLocation: "Bengaluru / Chennai",
    searchStatus: "Actively Looking",
    yoe: "Fresher / New Grad",
    languages: "JavaScript, Python, Ruby, SQL",
    frameworks: "Next.js, Ruby on Rails, PostgreSQL, Tailwind, Cypress",
    project1Title: "Platform Booking Engine",
    project1Desc: "Client-side reservation booking engine supporting calendar exception blockouts and slots grids.",
    project1Tech: "Next.js, Ruby on Rails, PostgreSQL, Tailwind CSS",
    project2Title: "API Gateway Filter",
    project2Desc: "Built an API limiter checking authentication headers dynamically under 2ms routing speeds.",
    project2Tech: "Node.js, Express, Redis"
  },
  {
    name: "Vikram Rao",
    email: "vikram@gmail.com",
    phone: "+91 97890 12345",
    githubUrl: "https://github.com/vikram-rao",
    linkedinUrl: "https://linkedin.com/in/vikram-rao",
    portfolioUrl: "https://vikram.dev",
    college: "IIT Madras",
    degree: "B.Tech in Computer Science",
    gradYear: "2025",
    gpa: "8.7/10",
    targetRole: "Backend Engineer",
    targetCompanies: "Google, Meta, Uber",
    preferredLocation: "Bengaluru / Singapore",
    searchStatus: "Open to Offers",
    yoe: "Fresher / New Grad",
    languages: "C++, C, Python, SQL",
    frameworks: "Express, PostgreSQL, Redis, Docker, GCP",
    project1Title: "B-Tree Database Indexer",
    project1Desc: "Custom implementation of disk-persisted B-Tree index structures for custom database engines.",
    project1Tech: "C++, POSIX filesystem hooks, Docker",
    project2Title: "Query Load Balancer",
    project2Desc: "TCP load balancer distributing search queries among primary and secondary database read replicas.",
    project2Tech: "C, Socket programming, Redis"
  },
  {
    name: "Neha Joshi",
    email: "neha@gmail.com",
    phone: "+91 98901 23456",
    githubUrl: "https://github.com/neha-joshi",
    linkedinUrl: "https://linkedin.com/in/neha-joshi",
    portfolioUrl: "https://neha.dev",
    college: "NIT Surathkal",
    degree: "B.Tech in Computer Engineering",
    gradYear: "2026",
    gpa: "8.4/10",
    targetRole: "Mobile Software Engineer",
    targetCompanies: "Netflix, Spotify, Apple",
    preferredLocation: "Bengaluru / Remote",
    searchStatus: "Actively Looking",
    yoe: "Fresher / New Grad",
    languages: "Swift, Kotlin, TypeScript, Java",
    frameworks: "SwiftUI, Jetpack Compose, React Native, Firebase",
    project1Title: "Offline Media Player",
    project1Desc: "Offline audio streaming application with encrypted caching layers.",
    project1Tech: "SwiftUI, CoreData, SQLite encryption layers",
    project2Title: "Cross-Platform Chat Engine",
    project2Desc: "Real-time communication app utilizing WebSocket pools and push notifications.",
    project2Tech: "React Native, Node.js, WebSockets"
  }
];

const seededPendingMentors = [
  {
    id: "rakeshkumar",
    name: "Rakesh Kumar",
    email: "rakesh@gmail.com",
    role: "Staff Infrastructure Architect",
    company: "Microsoft",
    specialty: "System Design" as const,
    bio: "Specializes in design scaling audits, distributed transaction algorithms, memory partitioning, and cloud topologies. Ex-Microsoft Azure core team designer.",
    experience: "6 Years",
    rating: 5.0,
    completedSessions: 0,
    skills: ["System Design", "Cloud Architecture", "Kubernetes", "Redis", "Distributed Transactions"],
    imageUrl: "/images/placeholder.jpg",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableSlots: ["10:00 AM", "2:00 PM", "4:30 PM", "7:00 PM"],
    blockedDates: []
  },
  {
    id: "priyapatel",
    name: "Priya Patel",
    email: "priya@stripe.com",
    role: "Senior Frontend Lead",
    company: "Stripe",
    specialty: "Frontend" as const,
    bio: "Dedicated UI architect focused on complex web forms, payment widgets accessibility, React compiler updates, and design tokens frameworks integration.",
    experience: "8 Years",
    rating: 5.0,
    completedSessions: 0,
    skills: ["React", "CSS Architecture", "TypeScript", "Cypress", "Web Accessibility (A11y)"],
    imageUrl: "/images/placeholder.jpg",
    availableDays: ["Tuesday", "Thursday"],
    availableSlots: ["11:00 AM", "3:00 PM", "5:00 PM"],
    blockedDates: []
  },
  {
    id: "sanjaytesla",
    name: "Sanjay Dutt",
    email: "sanjay@tesla.com",
    role: "Staff Robotics Engineer",
    company: "Tesla",
    specialty: "Backend" as const,
    bio: "Focused on real-time operating systems tuning, compiler configurations, high-frequency serialization structures, and embedded C++ pipelines.",
    experience: "9 Years",
    rating: 5.0,
    completedSessions: 0,
    skills: ["C++", "Rust", "Embedded Systems", "Linux Kernel", "Concurrency"],
    imageUrl: "/images/placeholder.jpg",
    availableDays: ["Monday", "Wednesday", "Saturday"],
    availableSlots: ["10:00 AM", "2:00 PM", "6:00 PM"],
    blockedDates: []
  },
  {
    id: "aishakhan",
    name: "Aisha Khan",
    email: "aisha@airbnb.com",
    role: "HR Talent Advisor",
    company: "Airbnb",
    specialty: "HR & Behavioral" as const,
    bio: "Career mentor helping engineers construct outstanding STAR behavioral logs, negotiate salary levels, and structure leadership impact bullet points.",
    experience: "7 Years",
    rating: 5.0,
    completedSessions: 0,
    skills: ["Behavioral Prep", "STAR Interviewing", "Resume Reviewing", "Salary Negotiation"],
    imageUrl: "/images/placeholder.jpg",
    availableDays: ["Monday", "Thursday"],
    availableSlots: ["9:00 AM", "12:00 PM", "4:00 PM"],
    blockedDates: []
  },
  {
    id: "monicageller",
    name: "Monica Geller",
    email: "monica@slack.com",
    role: "Engineering Lead",
    company: "Slack",
    specialty: "Backend" as const,
    bio: "Passionate about building scalable message brokers, managing transactional databases under high stress, and debugging performance bottlenecks.",
    experience: "10 Years",
    rating: 5.0,
    completedSessions: 0,
    skills: ["Go", "Kafka", "PostgreSQL", "System Scalability", "Redis Cache"],
    imageUrl: "/images/placeholder.jpg",
    availableDays: ["Wednesday", "Friday"],
    availableSlots: ["1:00 PM", "4:30 PM", "7:00 PM"],
    blockedDates: []
  }
];

const additionalApprovedMentors = [
  {
    id: "sarahjenkins",
    name: "Sarah Jenkins",
    email: "sarah@google.com",
    role: "Senior Frontend Lead",
    company: "Google",
    specialty: "Frontend" as const,
    bio: "Core contributor to the Angular and Chrome DevTools repositories. Master of CSS grid architectures, web accessibility, and low-latency client state caches.",
    experience: "8+ Years",
    rating: 4.96,
    completedSessions: 84,
    skills: ["React", "Angular", "Web Vitals", "Cypress", "UX Design"],
    imageUrl: "/images/placeholder.jpg",
    availableDays: ["Tuesday", "Thursday"],
    availableSlots: ["10:00 AM", "2:00 PM", "6:00 PM"],
    blockedDates: []
  },
  {
    id: "harpreetmeta",
    name: "Harpreet Singh",
    email: "harpreet@meta.com",
    role: "Staff Infrastructure Architect",
    company: "Meta",
    specialty: "System Design" as const,
    bio: "Architected real-time chat data storage schemas serving 1.5 billion DAU. Expert in Cassandra, RocksDB, load routing systems, and database partition keys.",
    experience: "9+ Years",
    rating: 4.97,
    completedSessions: 110,
    skills: ["Cassandra", "RocksDB", "System Scalability", "gRPC", "Message Queues"],
    imageUrl: "/images/placeholder.jpg",
    availableDays: ["Monday", "Wednesday"],
    availableSlots: ["11:00 AM", "3:00 PM", "7:00 PM"],
    blockedDates: []
  },
  {
    id: "linustorvalds",
    name: "Linus Torvalds",
    email: "linus@linux.org",
    role: "Kernel Lead Developer",
    company: "Linux Foundation",
    specialty: "Backend" as const,
    bio: "Created Linux and Git. Expert in systems programming, compiler architectures, resource allocation, and general hardware interface configurations.",
    experience: "25+ Years",
    rating: 5.0,
    completedSessions: 340,
    skills: ["C", "Assembly", "Operating Systems", "Git", "System Performance"],
    imageUrl: "/images/placeholder.jpg",
    availableDays: ["Friday", "Saturday"],
    availableSlots: ["2:00 PM", "4:30 PM", "6:00 PM"],
    blockedDates: []
  },
  {
    id: "gracehopper",
    name: "Grace Hopper",
    email: "grace@harvard.edu",
    role: "Compiler Design Lead",
    company: "Harvard Computing",
    specialty: "Backend" as const,
    bio: "Pioneered COBOL compiler architectures. Helps candidates structure low-level algorithms, debug compiler stack spaces, and understand hardware heaps.",
    experience: "15+ Years",
    rating: 4.99,
    completedSessions: 280,
    skills: ["Compilers", "Assembly", "Algorithmic Complexity", "C", "FORTRAN"],
    imageUrl: "/images/placeholder.jpg",
    availableDays: ["Monday", "Tuesday", "Thursday"],
    availableSlots: ["9:00 AM", "12:00 PM", "3:00 PM"],
    blockedDates: []
  }
];

const seededBookings = [
  {
    id: "booking-s1",
    studentName: "Akash Gupta",
    studentEmail: "akash@gmail.com",
    mentorId: "prashu",
    mentorName: "Prashu",
    sessionType: "DSA Mock Interview" as const,
    date: "2026-06-01",
    timeSlot: "2:00 PM",
    status: "Completed" as const,
    notes: "Review binary search tree algorithms and custom heap structures.",
    feedback: {
      dsaScore: "A-",
      systemDesignScore: "N/A",
      communicationScore: "A",
      comments: "Excellent logical clarity. Addressed boundary checks successfully. Tweak recursive space calculations for optimized runs.",
      submittedAt: "2026-05-29T10:00:00Z"
    }
  },
  {
    id: "booking-s2",
    studentName: "Priyanshu Sharma",
    studentEmail: "priyanshu@gmail.com",
    mentorId: "rakshit",
    mentorName: "Rakshit",
    sessionType: "System Design Mock" as const,
    date: "2026-06-03",
    timeSlot: "4:00 PM",
    status: "Approved" as const,
    notes: "Design a distributed rate-limiter for global API gateways.",
    feedback: undefined
  },
  {
    id: "booking-s3",
    studentName: "Sumit Nair",
    studentEmail: "sumitnair@gmail.com",
    mentorId: "sumit",
    mentorName: "Sumit",
    sessionType: "HR Mock Interview" as const,
    date: "2026-06-04",
    timeSlot: "12:00 PM",
    status: "Pending" as const,
    notes: "Prepare STAR stories relating to project scaling failures and stakeholder conflict management.",
    feedback: undefined
  },
  {
    id: "booking-s4",
    studentName: "Ananya Roy",
    studentEmail: "ananya@gmail.com",
    mentorId: "prashu",
    mentorName: "Prashu",
    sessionType: "DSA Mock Interview" as const,
    date: "2026-06-05",
    timeSlot: "11:00 AM",
    status: "Pending" as const,
    notes: "Graph shortest path algorithms (Dijkstra, A* search complexity grids).",
    feedback: undefined
  },
  {
    id: "booking-s5",
    studentName: "Tarun Mehta",
    studentEmail: "tarun@gmail.com",
    mentorId: "harpreetmeta",
    mentorName: "Harpreet Singh",
    sessionType: "System Design Mock" as const,
    date: "2026-06-06",
    timeSlot: "3:00 PM",
    status: "Approved" as const,
    notes: "Design real-time video stream transcoding pipelines at scale.",
    feedback: undefined
  },
  {
    id: "booking-s6",
    studentName: "Pooja Desai",
    studentEmail: "pooja@gmail.com",
    mentorId: "akash",
    mentorName: "Akash",
    sessionType: "Resume Review & Career Prep" as const,
    date: "2026-06-08",
    timeSlot: "10:00 AM",
    status: "Completed" as const,
    notes: "Review React components file structures, bundle size optimizations, and state overrides.",
    feedback: {
      dsaScore: "N/A",
      systemDesignScore: "N/A",
      communicationScore: "A+",
      comments: "Highly detailed portfolio references. Replaced weak verbs. Linked custom Cypress bundle reports successfully.",
      submittedAt: "2026-05-28T14:30:00Z"
    }
  },
  {
    id: "booking-s7",
    studentName: "Rohit Sen",
    studentEmail: "rohit@gmail.com",
    mentorId: "linustorvalds",
    mentorName: "Linus Torvalds",
    sessionType: "DSA Mock Interview" as const,
    date: "2026-06-10",
    timeSlot: "4:30 PM",
    status: "Rejected" as const,
    notes: "Review C system memory leaks, thread locks, and heap allocation optimizations.",
    feedback: undefined
  },
  {
    id: "booking-s8",
    studentName: "Sneha Patel",
    studentEmail: "sneha@gmail.com",
    mentorId: "sarahjenkins",
    mentorName: "Sarah Jenkins",
    sessionType: "Resume Review & Career Prep" as const,
    date: "2026-06-11",
    timeSlot: "2:00 PM",
    status: "Approved" as const,
    notes: "Align frontend dossier coordinates to Stripe product page specifications.",
    feedback: undefined
  },
  {
    id: "booking-s9",
    studentName: "Vikram Rao",
    studentEmail: "vikram@gmail.com",
    mentorId: "gracehopper",
    mentorName: "Grace Hopper",
    sessionType: "DSA Mock Interview" as const,
    date: "2026-06-12",
    timeSlot: "12:00 PM",
    status: "Completed" as const,
    notes: "Review recursive parsing syntax structures and abstract syntax tree algorithms.",
    feedback: {
      dsaScore: "A",
      systemDesignScore: "N/A",
      communicationScore: "A-",
      comments: "Parsed formulas successfully. Great understanding of call stacks. Complexity calculations were correct.",
      submittedAt: "2026-05-27T17:00:00Z"
    }
  },
  {
    id: "booking-s10",
    studentName: "Neha Joshi",
    studentEmail: "neha@gmail.com",
    mentorId: "sumit",
    mentorName: "Sumit",
    sessionType: "HR Mock Interview" as const,
    date: "2026-06-14",
    timeSlot: "9:00 AM",
    status: "Pending" as const,
    notes: "Review leadership STAR examples for senior product roles.",
    feedback: undefined
  }
];

export default function AdminPortal() {
  const router = useRouter();
  
  // Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'pending' | 'mentors' | 'bookings' | 'settings' | 'pricing' | 'admins'>('dashboard');
  
  // Current admin details
  const [currentAdminProfile, setCurrentAdminProfile] = useState<any>(null);
  
  // Registry lists
  const [students, setStudents] = useState<any[]>([]);
  const [pendingMentors, setPendingMentors] = useState<Mentor[]>([]);
  const [approvedMentors, setApprovedMentors] = useState<Mentor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [processingMentorId, setProcessingMentorId] = useState<string | null>(null);
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);

  // Admin Management Modal States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    roleName: "Admin",
    canAccessStudents: true,
    canAccessMentors: true,
    canVerifyPayments: true,
    canManagePricing: true,
    canManageAdmins: false,
  });
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [adminFormError, setAdminFormError] = useState("");
  
  // Dynamic Pricing Form Modal States
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    name: "",
    price: "",
    duration: "",
    subtitle: "",
    tag: "",
    perfectFor: "",
    features: "",
  });
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [pricingSearch, setPricingSearch] = useState("");
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  
  // Detail selection inspect (Modal state)
  const [inspectingStudent, setInspectingStudent] = useState<any | null>(null);
  const [inspectingMentor, setInspectingMentor] = useState<Mentor | null>(null);
  
  // Filters & Search
  const [studentSearch, setStudentSearch] = useState("");
  const [mentorSearch, setMentorSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>("All");
  const [bookingFilterPayment, setBookingFilterPayment] = useState<string>("All");
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ type: 'student' | 'mentor'; id: string; name: string } | null>(null);
  
  // Column Visibility States
  const [visibleStudentCols, setVisibleStudentCols] = useState({
    name: true,
    email: true,
    targetRole: true,
    gpa: true,
    gradYear: true,
    status: true,
  });

  const [visibleMentorCols, setVisibleMentorCols] = useState({
    name: true,
    email: true,
    role: true,
    company: true,
    sessions: true,
    rating: true,
  });

  const [isStudentColsDropdownOpen, setIsStudentColsDropdownOpen] = useState(false);
  const [isMentorColsDropdownOpen, setIsMentorColsDropdownOpen] = useState(false);
  
  // System Config Toggles
  const [configGradeSync, setConfigGradeSync] = useState(true);
  const [configAIDrafts, setConfigAIDrafts] = useState(true);
  const [configCommission, setConfigCommission] = useState("15");
  const [configMaintenance, setConfigMaintenance] = useState(false);
  
  // Feedback Toast
  const [successToast, setSuccessToast] = useState("");
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  const fetchAdminDashboardData = async (email: string, isInitial = false) => {
    if (isInitial) {
      setIsLoadingDashboard(true);
    }
    try {
      const headers = { "x-user-email": email };

      // 0. Own Profile & Permissions
      const profileRes = await fetch(`/api/admin/profile?email=${email}`, { headers });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setCurrentAdminProfile(profileData);

        // 1. Mentors
        if (profileData.canAccessMentors) {
          const mentorsRes = await fetch(`/api/admin/mentors?email=${email}`, { headers });
          if (mentorsRes.ok) {
            const mentorsData = await mentorsRes.json();
            setApprovedMentors(mentorsData.filter((m: any) => m.approved));
            setPendingMentors(mentorsData.filter((m: any) => !m.approved));
          }
        }

        // 2. Students
        if (profileData.canAccessStudents) {
          const studentsRes = await fetch(`/api/admin/students?email=${email}`, { headers });
          if (studentsRes.ok) {
            const studentsData = await studentsRes.json();
            setStudents(studentsData);
          }
        }

        // 3. Bookings
        if (profileData.canAccessStudents || profileData.canAccessMentors || profileData.canVerifyPayments) {
          const bookingsRes = await fetch(`/api/admin/bookings?email=${email}`, { headers });
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            setBookings(bookingsData);
          }
        }

        // 4. Pricing Plans
        if (profileData.canManagePricing) {
          const pricingRes = await fetch(`/api/admin/pricing?email=${email}`, { headers });
          if (pricingRes.ok) {
            const pricingData = await pricingRes.json();
            setPricingPlans(pricingData);
          }
        }

        // 5. Administrators
        if (profileData.canManageAdmins) {
          const adminsRes = await fetch(`/api/admin/admins?email=${email}`, { headers });
          if (adminsRes.ok) {
            const adminsData = await adminsRes.json();
            setAdminsList(adminsData);
          }
        }
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  // Load datasets on mount and seed if empty
  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.role === "admin") {
          setIsAdminLoggedIn(true);
          fetchAdminDashboardData(parsed.email, true);
        }
      } catch (err) {}
    }
  }, []);

  // Admin login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin", email: adminUsername, password: adminPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Invalid administrator credentials.");
        setIsLoggingIn(false);
        return;
      }

      if (data.role !== "admin") {
        setLoginError("Unauthorized. Admin role required.");
        setIsLoggingIn(false);
        return;
      }

      const adminSession = {
        email: data.email,
        role: "admin",
        name: data.name
      };
      localStorage.setItem("user_session", JSON.stringify(adminSession));
      setIsAdminLoggedIn(true);
      fetchAdminDashboardData(data.email, true);
      showToast("Access Granted. Welcome Administrator.", "success");
    } catch (err) {
      console.error(err);
      setLoginError("An unexpected error occurred.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    localStorage.removeItem("user_session");
    document.cookie = "user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAdminLoggedIn(false);
    router.push("/");
  };

  // Toast Helper
  const showToast = (msg: string, type: 'success' | 'danger' = 'success') => {
    setSuccessToast(msg);
    setToastType(type);
    setTimeout(() => setSuccessToast(""), 4500);
  };

  // Mentor approval handler
  const handleApproveMentor = async (mentor: Mentor) => {
    const sessionStr = localStorage.getItem("user_session");
    if (!sessionStr) return;
    setProcessingMentorId(mentor.id);
    try {
      const session = JSON.parse(sessionStr);
      const res = await fetch(`/api/admin/mentors/${mentor.id}/approve`, {
        method: "POST",
        headers: { "x-user-email": session.email },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Approval failed.");
        setProcessingMentorId(null);
        return;
      }

      await fetchAdminDashboardData(session.email);
      showToast(`Mentor "${mentor.name}" successfully approved and listed!`, "success");
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingMentorId(null);
    }
  };

  // Mentor rejection handler
  const handleRejectMentor = async (mentorId: string, mentorName: string) => {
    const sessionStr = localStorage.getItem("user_session");
    if (!sessionStr) return;
    setProcessingMentorId(mentorId);
    try {
      const session = JSON.parse(sessionStr);
      const res = await fetch(`/api/admin/mentors/${mentorId}/reject`, {
        method: "POST",
        headers: { "x-user-email": session.email },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Rejection failed.");
        setProcessingMentorId(null);
        return;
      }

      await fetchAdminDashboardData(session.email);
      showToast(`Mentor "${mentorName}" request rejected.`, "danger");
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingMentorId(null);
    }
  };

  const handleVerifyPayment = async (bookingId: string) => {
    const sessionStr = localStorage.getItem("user_session");
    if (!sessionStr) return;
    setProcessingBookingId(bookingId);
    try {
      const session = JSON.parse(sessionStr);
      const res = await fetch(`/api/admin/bookings/${bookingId}/verify`, {
        method: "POST",
        headers: { "x-user-email": session.email },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Verification failed.");
        setProcessingBookingId(null);
        return;
      }

      await fetchAdminDashboardData(session.email);
      showToast(`Payment verified successfully! Booking request sent to the mentor.`, "success");
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingBookingId(null);
    }
  };

  // Pricing plans CRUD handlers
  const handleSavePricingPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionStr = localStorage.getItem("user_session");
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      setIsSubmittingPlan(true);

      const perfectForArray = pricingForm.perfectFor
        ? pricingForm.perfectFor.split(",").map(t => t.trim()).filter(Boolean)
        : [];
      const featuresArray = pricingForm.features
        ? pricingForm.features.split(",").map(f => f.trim()).filter(Boolean)
        : [];

      const payload = {
        name: pricingForm.name,
        price: pricingForm.price,
        duration: pricingForm.duration,
        subtitle: pricingForm.subtitle,
        tag: pricingForm.tag,
        perfectFor: perfectForArray,
        features: featuresArray,
      };

      const url = editingPlanId
        ? `/api/admin/pricing/${editingPlanId}?email=${session.email}`
        : `/api/admin/pricing?email=${session.email}`;
      const method = editingPlanId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save pricing plan.");
        setIsSubmittingPlan(false);
        return;
      }

      await fetchAdminDashboardData(session.email);
      showToast(editingPlanId ? "Pricing plan updated!" : "Pricing plan created!", "success");
      
      // Reset form
      setPricingForm({
        name: "",
        price: "",
        duration: "",
        subtitle: "",
        tag: "",
        perfectFor: "",
        features: "",
      });
      setEditingPlanId(null);
      setIsPricingModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the plan.");
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  const handleDeletePricingPlan = async (planId: string, planName: string) => {
    if (!confirm(`Are you sure you want to delete the pricing plan "${planName}"?`)) return;
    const sessionStr = localStorage.getItem("user_session");
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      const res = await fetch(`/api/admin/pricing/${planId}?email=${session.email}`, {
        method: "DELETE",
        headers: { "x-user-email": session.email },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete plan.");
        return;
      }

      await fetchAdminDashboardData(session.email);
      showToast(`Pricing plan "${planName}" deleted.`, "danger");
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the plan.");
    }
  };

  const handleEditPricingPlanClick = (plan: any) => {
    setEditingPlanId(plan.id);
    setPricingForm({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      subtitle: plan.subtitle || "",
      tag: plan.tag || "",
      perfectFor: plan.perfectFor ? plan.perfectFor.join(", ") : "",
      features: plan.features ? plan.features.join(", ") : "",
    });
    setIsPricingModalOpen(true);
  };

  // Admin User CRUD handlers
  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFormError("");
    const sessionStr = localStorage.getItem("user_session");
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      setIsSubmittingAdmin(true);

      const payload = {
        name: adminForm.name,
        email: adminForm.email,
        password: adminForm.password,
        roleName: adminForm.roleName,
        canAccessStudents: adminForm.canAccessStudents,
        canAccessMentors: adminForm.canAccessMentors,
        canVerifyPayments: adminForm.canVerifyPayments,
        canManagePricing: adminForm.canManagePricing,
        canManageAdmins: adminForm.canManageAdmins,
      };

      const url = editingAdminId
        ? `/api/admin/admins/${editingAdminId}?email=${session.email}`
        : `/api/admin/admins?email=${session.email}`;
      const method = editingAdminId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setAdminFormError(data.error || "Failed to save administrator.");
        setIsSubmittingAdmin(false);
        return;
      }

      await fetchAdminDashboardData(session.email);
      showToast(editingAdminId ? "Administrator updated!" : "Administrator created!", "success");
      
      // Reset form
      setAdminForm({
        name: "",
        email: "",
        password: "",
        roleName: "Admin",
        canAccessStudents: true,
        canAccessMentors: true,
        canVerifyPayments: true,
        canManagePricing: true,
        canManageAdmins: false,
      });
      setEditingAdminId(null);
      setIsAdminModalOpen(false);
    } catch (error) {
      console.error(error);
      setAdminFormError("An error occurred while saving the administrator.");
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to delete the administrator "${adminName}"?`)) return;
    const sessionStr = localStorage.getItem("user_session");
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      const res = await fetch(`/api/admin/admins/${adminId}?email=${session.email}`, {
        method: "DELETE",
        headers: { "x-user-email": session.email },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete administrator.");
        return;
      }

      await fetchAdminDashboardData(session.email);
      showToast(`Administrator "${adminName}" deleted.`, "danger");
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the administrator.");
    }
  };

  const handleEditAdminClick = (admin: any) => {
    setEditingAdminId(admin.id);
    setAdminFormError("");
    setAdminForm({
      name: admin.name,
      email: admin.email,
      password: "",
      roleName: admin.roleName,
      canAccessStudents: admin.canAccessStudents,
      canAccessMentors: admin.canAccessMentors,
      canVerifyPayments: admin.canVerifyPayments,
      canManagePricing: admin.canManagePricing,
      canManageAdmins: admin.canManageAdmins,
    });
    setIsAdminModalOpen(true);
  };

  const handleCreateAdminClick = () => {
    setEditingAdminId(null);
    setAdminFormError("");
    setAdminForm({
      name: "",
      email: "",
      password: "",
      roleName: "Admin",
      canAccessStudents: true,
      canAccessMentors: true,
      canVerifyPayments: true,
      canManagePricing: true,
      canManageAdmins: false,
    });
    setIsAdminModalOpen(true);
  };

  // Revoke active mentor access
  const handleRevokeMentor = async (mentorId: string, mentorName: string) => {
    if (confirm(`Are you sure you want to revoke platform access for "${mentorName}"?`)) {
      const sessionStr = localStorage.getItem("user_session");
      if (!sessionStr) return;
      try {
        const session = JSON.parse(sessionStr);
        const res = await fetch(`/api/admin/mentors/${mentorId}/reject`, {
          method: "POST",
          headers: { "x-user-email": session.email },
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "Revocation failed.");
          return;
        }

        await fetchAdminDashboardData(session.email);
        showToast(`Access revoked for "${mentorName}".`, "danger");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    setDeleteConfirmation({ type: "student", id: studentId, name: studentName });
  };

  const handleDeleteMentor = (mentorId: string, mentorName: string) => {
    setDeleteConfirmation({ type: "mentor", id: mentorId, name: mentorName });
  };

  const executeDeleteStudent = async (studentId: string, studentName: string) => {
    const sessionStr = localStorage.getItem("user_session");
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      const res = await fetch(`/api/admin/students/${studentId}?email=${session.email}`, {
        method: "DELETE",
        headers: { "x-user-email": session.email },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Deletion failed.");
        return;
      }

      await fetchAdminDashboardData(session.email);
      showToast(`Student record for "${studentName}" deleted successfully.`, "danger");
    } catch (error) {
      console.error(error);
    }
  };

  const executeDeleteMentor = async (mentorId: string, mentorName: string) => {
    const sessionStr = localStorage.getItem("user_session");
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      const res = await fetch(`/api/admin/mentors/${mentorId}?email=${session.email}`, {
        method: "DELETE",
        headers: { "x-user-email": session.email },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Deletion failed.");
        return;
      }

      await fetchAdminDashboardData(session.email);
      showToast(`Mentor record for "${mentorName}" deleted successfully.`, "danger");
    } catch (error) {
      console.error(error);
    }
  };

  // Save admin config settings
  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Global system configurations saved successfully!", "success");
  };

  // Search/Filters handlers
  const filteredStudents = students.filter(s => {
    return s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
           s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
           s.college.toLowerCase().includes(studentSearch.toLowerCase()) ||
           s.targetRole.toLowerCase().includes(studentSearch.toLowerCase());
  });

  const filteredMentors = approvedMentors.filter(m => {
    return m.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
           m.company.toLowerCase().includes(mentorSearch.toLowerCase()) ||
           m.role.toLowerCase().includes(mentorSearch.toLowerCase()) ||
           m.specialty.toLowerCase().includes(mentorSearch.toLowerCase());
  });

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.studentName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.mentorName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.sessionType.toLowerCase().includes(bookingSearch.toLowerCase());
    
    const matchesStatus = bookingFilterStatus === "All" || b.status === bookingFilterStatus;
    
    let matchesPayment = true;
    if (bookingFilterPayment === "Done") {
      matchesPayment = b.paymentVerified === true;
    } else if (bookingFilterPayment === "Pending") {
      matchesPayment = b.paymentVerified === false && !!b.transactionId;
    } else if (bookingFilterPayment === "NotDone") {
      matchesPayment = b.paymentVerified === false && !b.transactionId;
    }
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculations
  const totalRevenue = bookings
    .filter(b => b.paymentVerified === true)
    .reduce((sum, b) => sum + (b.pricePaid || 0), 0);
  const adminShare = Math.round(totalRevenue * (parseInt(configCommission) / 100));

  if (isAdminLoggedIn && isLoadingDashboard) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4 font-sans">
        <div className="h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Syncing Admin Control Panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* Toast Alert */}
      {successToast && (
        <div className={`fixed bottom-5 right-5 z-50 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-bounce text-xs font-semibold ${
          toastType === 'success' ? 'bg-slate-900' : 'bg-rose-600'
        }`}>
          {toastType === 'success' ? <CheckCircle className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-rose-200" />}
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-grow flex items-stretch">
        {!isAdminLoggedIn ? (
          /* ==========================================
             1. LOGIN PANEL (Light mode theme)
             ========================================== */
          <div className="w-full flex items-center justify-center py-16 px-4 bg-slate-50">
            <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-100">
                  <Shield className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h2>
                <p className="text-xs text-slate-400">Sign in with system administrator credentials to access dashboard configurations.</p>
              </div>

              {loginError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-650 text-center leading-relaxed">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-6 text-left">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="adminUser" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Admin Username
                    </label>
                    <input
                      id="adminUser"
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold"
                      placeholder="admin"
                    />
                  </div>

                  <div>
                    <label htmlFor="adminPass" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <input
                      id="adminPass"
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold"
                      placeholder="••••"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl hover:shadow-lg transition-all text-xs cursor-pointer shadow shadow-indigo-100 disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <>
                        <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full shrink-0"></span>
                        Authorizing...
                      </>
                    ) : (
                      <>
                        Authorize Console Access
                        <Lock className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors underline cursor-pointer"
                >
                  Back to Public Homepage
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ==========================================
             2. LOGGED-IN ADMIN CONSOLE WORKSPACE
             ========================================== */
          <div className="w-full flex flex-col lg:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0">
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-8">
                  <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-100">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    PeerPilot <span className="text-indigo-600 font-extrabold">Admin</span>
                  </span>
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "dashboard"
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard Overview
                  </button>

                  {(!currentAdminProfile || currentAdminProfile.canAccessStudents) && (
                    <button
                      onClick={() => setActiveTab("students")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "students"
                          ? "bg-indigo-50 text-indigo-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      Student Directory ({students.length})
                    </button>
                  )}

                  {(!currentAdminProfile || currentAdminProfile.canAccessMentors) && (
                    <button
                      onClick={() => setActiveTab("pending")}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "pending"
                          ? "bg-indigo-50 text-indigo-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-4 w-4" />
                        <span>Onboarding Queue</span>
                      </div>
                      {pendingMentors.length > 0 && (
                        <span className="px-2 py-0.5 bg-indigo-600 text-white font-extrabold text-[9px] rounded-full leading-none">
                          {pendingMentors.length}
                        </span>
                      )}
                    </button>
                  )}

                  {(!currentAdminProfile || currentAdminProfile.canAccessMentors) && (
                    <button
                      onClick={() => setActiveTab("mentors")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "mentors"
                          ? "bg-indigo-50 text-indigo-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Briefcase className="h-4 w-4" />
                      Approved Mentors ({approvedMentors.length})
                    </button>
                  )}

                  {(!currentAdminProfile || currentAdminProfile.canAccessStudents || currentAdminProfile.canAccessMentors || currentAdminProfile.canVerifyPayments) && (
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "bookings"
                          ? "bg-indigo-50 text-indigo-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <CalendarCheck className="h-4 w-4" />
                      Mock Booking Audit
                    </button>
                  )}

                  {(!currentAdminProfile || currentAdminProfile.canManagePricing) && (
                    <button
                      onClick={() => setActiveTab("pricing")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "pricing"
                          ? "bg-indigo-50 text-indigo-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <DollarSign className="h-4 w-4" />
                      Pricing Tiers
                    </button>
                  )}

                  {currentAdminProfile?.canManageAdmins && (
                    <button
                      onClick={() => setActiveTab("admins")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "admins"
                          ? "bg-indigo-50 text-indigo-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Admin Management ({adminsList.length})
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "settings"
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    System Configs
                  </button>
                </nav>
              </div>

              <div className="p-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 h-9 w-9 rounded-full text-white flex items-center justify-center font-bold text-xs uppercase shadow shadow-indigo-100">
                    AD
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">Super Admin</p>
                    <p className="text-[10px] text-slate-400 truncate">admin@peerpilot.com</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Content Audit Panel */}
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50 flex flex-col justify-start">
              
              {/* Premium Dashboard Header with Sign Out */}
              <div className="flex justify-between items-center pb-5 border-b border-slate-200/60 mb-8 bg-transparent shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-900 text-slate-200 border border-slate-800 px-2.5 py-1 rounded-xl font-bold uppercase tracking-wider">
                    Console Administration Mode
                  </span>
                </div>
                <button
                  onClick={handleAdminLogout}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-slate-650 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm animate-in fade-in"
                >
                  <LogOut className="h-4 w-4" />
                  Console Logout
                </button>
              </div>
              
              {/* PLATFORM KPI SUMMARY */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Students</span>
                    <span className="text-base font-extrabold text-slate-950 block">{students.length}</span>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-650 rounded-xl border border-emerald-100">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Coaches</span>
                    <span className="text-base font-extrabold text-slate-950 block">{approvedMentors.length}</span>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Queue Size</span>
                    <span className="text-base font-extrabold text-slate-950 block text-amber-600">{pendingMentors.length}</span>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
                    <CalendarCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Mock Audits</span>
                    <span className="text-base font-extrabold text-slate-950 block">{bookings.length}</span>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
                  <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl border border-teal-100">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Gross Revenue</span>
                    <span className="text-base font-extrabold text-slate-950 block">₹{totalRevenue}</span>
                  </div>
                </div>
              </div>

              {/* TAB 1: OVERVIEW DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-in fade-in duration-200 text-left">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Console Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Platform analytics indices, retained commissions ratios, and audit transaction logs.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Revenues and Activity Feeds */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Unpaid Bookings Queue */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <DollarSign className="h-4.5 w-4.5 text-indigo-600" /> Unpaid Bookings Queue ({bookings.filter(b => !b.paymentVerified).length})
                        </h3>
                        
                        {bookings.filter(b => !b.paymentVerified).length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-2">No unpaid bookings awaiting verification.</p>
                        ) : (
                          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-2">
                            {bookings.filter(b => !b.paymentVerified).map((booking) => (
                              <div key={booking.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 first:pt-0 last:pb-0">
                                <div className="space-y-1.5 flex-grow">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-slate-900">
                                      {booking.studentName} &rarr; {booking.mentorName}
                                    </span>
                                    {booking.transactionId ? (
                                      <span className="inline-flex px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[9px] font-bold">
                                        Awaiting Verification
                                      </span>
                                    ) : (
                                      <span className="inline-flex px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded text-[9px] font-bold">
                                        Unpaid
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-medium">
                                    {booking.sessionType} ({booking.priceTier} — ₹{booking.pricePaid})
                                  </div>
                                  <div className="text-[9px] text-slate-400 font-mono">
                                    {booking.transactionId ? (
                                      `Ref: ${booking.transactionId} | Date: ${booking.paymentDate}`
                                    ) : (
                                      "No transaction details submitted yet"
                                    )}
                                  </div>
                                </div>
                                
                                {processingBookingId === booking.id ? (
                                   <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] font-bold text-slate-400">
                                     <span className="animate-spin h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent rounded-full shrink-0"></span>
                                     Verifying...
                                   </div>
                                 ) : (
                                   <button
                                     disabled={processingBookingId !== null}
                                     onClick={() => handleVerifyPayment(booking.id)}
                                     className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-extrabold shadow shadow-emerald-100 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                                   >
                                     Verify Payment
                                   </button>
                                 )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Commission Retention Auditing */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <TrendingUp className="h-4.5 w-4.5 text-indigo-600" /> Commission Retention Yields
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="p-4.5 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total Mentors Payout</span>
                            <span className="text-2xl font-black text-slate-900 mt-1 block">₹{totalRevenue - adminShare}</span>
                            <span className="text-[9px] text-slate-400 block mt-1 font-medium">{100 - parseInt(configCommission)}% of gross platform revenue</span>
                          </div>
                          <div className="p-4.5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                            <span className="text-[10px] text-indigo-600 block font-bold uppercase tracking-wider">Platform Retention ({configCommission}%)</span>
                            <span className="text-2xl font-black text-indigo-950 mt-1 block">₹{adminShare}</span>
                            <span className="text-[9px] text-indigo-550 block mt-1 font-medium">Platform operations yield commission</span>
                          </div>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-2.5 text-[10px] text-amber-800 leading-normal">
                          <Sparkle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>Platform commission rates are dynamically adjustable. To modify, visit the **System Configs** tab to set 10%, 15%, or 20% commission rates.</span>
                        </div>
                      </div>

                      {/* Platform transaction logs */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <Activity className="h-4.5 w-4.5 text-indigo-600" /> Platform Transaction Feed
                        </h3>

                        <div className="flow-root">
                          <ul className="-mb-8">
                            {[
                              { text: "Sarah Jenkins completed frontend performance mock evaluation scorecard", time: "1 hour ago", icon: <Award className="h-3.5 w-3.5 text-indigo-600" />, bg: "bg-indigo-50" },
                              { text: "Registered student profile: Sneha Patel credentials generated", time: "3 hours ago", icon: <User className="h-3.5 w-3.5 text-emerald-600" />, bg: "bg-emerald-50" },
                              { text: "Onboarding requested: Rakesh Kumar (Microsoft) pending approval", time: "1 day ago", icon: <Briefcase className="h-3.5 w-3.5 text-amber-600" />, bg: "bg-amber-50" },
                              { text: "Mock requested: System Design booked with Harpreet Singh (Meta)", time: "2 days ago", icon: <Calendar className="h-3.5 w-3.5 text-sky-600" />, bg: "bg-sky-50" }
                            ].map((item, idx) => (
                              <li key={idx}>
                                <div className="relative pb-8">
                                  {idx !== 3 && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" />}
                                  <div className="relative flex space-x-3">
                                    <div>
                                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${item.bg} border border-slate-100`}>
                                        {item.icon}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                                      <div>
                                        <p className="text-xs text-slate-700 font-medium">{item.text}</p>
                                      </div>
                                      <div className="text-right text-[10px] whitespace-nowrap text-slate-400 font-semibold">
                                        <time>{item.time}</time>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Right: Category Distribution & Config Index */}
                    <div className="space-y-8">
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-indigo-600" /> Configuration Status
                        </h3>

                        <div className="space-y-3.5 pt-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-650">Maintenance Mode</span>
                            <span className={`px-2 py-0.5 rounded-lg font-bold text-[9px] ${configMaintenance ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                              {configMaintenance ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-650">Suggested Grades Sync</span>
                            <span className={`px-2 py-0.5 rounded-lg font-bold text-[9px] ${configGradeSync ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                              {configGradeSync ? "ENABLED" : "DISABLED"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-650">AI Feedback drafts</span>
                            <span className={`px-2 py-0.5 rounded-lg font-bold text-[9px] ${configAIDrafts ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                              {configAIDrafts ? "ENABLED" : "DISABLED"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-650">Retention Commission</span>
                            <span className="font-extrabold text-indigo-600 text-xs">{configCommission}%</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab("settings")}
                          className="w-full mt-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-[10px] font-bold tracking-wide transition-colors cursor-pointer"
                        >
                          Modify Parameters
                        </button>
                      </div>

                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                          Booking Categories
                        </h3>

                        <div className="space-y-3.5 pt-2">
                          {[
                            { name: "DSA Mock Interview", count: bookings.filter(b => b.sessionType === "DSA Mock Interview").length, pct: "40%", color: "bg-indigo-500" },
                            { name: "System Design Mock", count: bookings.filter(b => b.sessionType === "System Design Mock").length, pct: "30%", color: "bg-sky-500" },
                            { name: "HR Mock Interview", count: bookings.filter(b => b.sessionType === "HR Mock Interview").length, pct: "20%", color: "bg-teal-500" },
                            { name: "Resume Review & Prep", count: bookings.filter(b => b.sessionType.includes("Resume")).length, pct: "10%", color: "bg-amber-500" }
                          ].map((cat, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                                <span className="truncate pr-2">{cat.name}</span>
                                <span className="font-bold text-slate-900">{cat.count} ({cat.pct})</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className={`${cat.color} h-1.5 rounded-full`} style={{ width: cat.pct }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STUDENT DIRECTORY (Tabular Form) */}
              {activeTab === "students" && (
                <div className="space-y-8 animate-in fade-in duration-200 text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Student Profile Directory</h1>
                      <p className="text-slate-500 text-sm mt-1">Audit platform candidate portfolios, CGPAs, target role focus, and skills dossier.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center relative">
                      <div className="relative flex-grow sm:w-64">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Search className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search student..."
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none transition-all shadow-sm"
                        />
                      </div>

                      {/* Columns Select Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setIsStudentColsDropdownOpen(!isStudentColsDropdownOpen)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <Sliders className="h-3.5 w-3.5 text-indigo-650" />
                          Columns
                        </button>
                        {isStudentColsDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsStudentColsDropdownOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-25 p-3.5 space-y-2 text-left">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Visible Columns</span>
                              {Object.entries(studentHeadersMap).map(([key, label]) => (
                                <label key={key} className="flex items-center gap-2.5 text-xs font-semibold text-slate-650 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={visibleStudentCols[key as keyof typeof visibleStudentCols]}
                                    onChange={() => {
                                      setVisibleStudentCols(prev => ({
                                        ...prev,
                                        [key]: !prev[key as keyof typeof visibleStudentCols]
                                      }));
                                    }}
                                    className="h-4 w-4 text-indigo-650 border-slate-350 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span>{label}</span>
                                </label>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Export Excel Button */}
                      <button
                        onClick={() => exportToCSV(filteredStudents, visibleStudentCols, studentHeadersMap, "students_records.csv")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shadow-emerald-100"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Export Excel
                      </button>
                    </div>
                  </div>
 
                  {filteredStudents.length === 0 ? (
                    <div className="p-12 bg-white rounded-3xl border border-slate-100 text-center text-slate-400 shadow-sm">
                      <Users className="h-10 w-10 mx-auto text-slate-350 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">No registered students found matching criteria.</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left text-slate-500 border-collapse">
                          <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-100">
                            <tr>
                              {visibleStudentCols.name && <th className="px-6 py-4">Name</th>}
                              {visibleStudentCols.email && <th className="px-6 py-4">Email</th>}
                              {visibleStudentCols.targetRole && <th className="px-6 py-4">Target Role Focus</th>}
                              {visibleStudentCols.gpa && <th className="px-6 py-4 text-center">GPA</th>}
                              {visibleStudentCols.gradYear && <th className="px-6 py-4 text-center">Grad Year</th>}
                              {visibleStudentCols.status && <th className="px-6 py-4 text-center">Status</th>}
                              <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-650">
                            {filteredStudents.map(student => (
                              <tr key={student.email} className="hover:bg-slate-50/50">
                                {visibleStudentCols.name && (
                                  <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                                )}
                                {visibleStudentCols.email && (
                                  <td className="px-6 py-4 font-semibold text-slate-550">{student.email}</td>
                                )}
                                {visibleStudentCols.targetRole && (
                                  <td className="px-6 py-4 font-semibold text-slate-700">{student.targetRole || "N/A"}</td>
                                )}
                                {visibleStudentCols.gpa && (
                                  <td className="px-6 py-4 text-center">
                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-705 border border-indigo-100 rounded-lg text-[9px] font-black">
                                      {student.gpa || "N/A"}
                                    </span>
                                  </td>
                                )}
                                {visibleStudentCols.gradYear && (
                                  <td className="px-6 py-4 text-center font-bold text-slate-600">{student.gradYear || "N/A"}</td>
                                )}
                                {visibleStudentCols.status && (
                                  <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex px-2 py-0.5 font-bold rounded-lg text-[9px] border ${
                                      student.searchStatus === "Actively Looking"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : "bg-slate-50 text-slate-600 border-slate-150"
                                    }`}>
                                      {student.searchStatus || "Registered"}
                                    </span>
                                  </td>
                                )}
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => setInspectingStudent(student)}
                                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors"
                                    >
                                      View Detail
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStudent(student.id, student.name)}
                                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl font-bold text-[10px] cursor-pointer transition-colors"
                                    >
                                      Delete Student
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ONBOARDING REQUEST QUEUE (Redesigned Evaluator Cards) */}
              {activeTab === "pending" && (
                <div className="space-y-8 animate-in fade-in duration-200 text-left">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Onboarding Request Queue</h1>
                    <p className="text-slate-500 text-sm mt-1">Review evaluator credential submissions, audit candidate specialties, and approve profile listings.</p>
                  </div>

                  {pendingMentors.length === 0 ? (
                    <div className="p-12 bg-white border border-slate-100 shadow-sm rounded-3xl text-center text-slate-400">
                      <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700">Approval queue is empty!</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">All pending onboarding requests have been resolved.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {pendingMentors.map(mentor => (
                        <div key={mentor.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between gap-6 hover:border-indigo-100 transition-all">
                          {/* Left: Bio, role coordinates */}
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                                  Pending Review
                                </span>
                                <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                                  {mentor.specialty}
                                </span>
                                <span className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                                  {mentor.experience} Exp
                                </span>
                              </div>
                              <h3 className="text-lg font-black text-slate-900">{mentor.name}</h3>
                              <p className="text-[10px] text-slate-400 font-semibold leading-none">{mentor.role} at <strong className="text-slate-800 font-extrabold">{mentor.company}</strong></p>
                              <span className="text-[10px] text-slate-400 font-semibold block">{mentor.email} • {mentor.phone || "No Phone"}</span>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-650 leading-relaxed pt-1">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Professional Bio</h4>
                              <blockquote className="border-l-2 border-slate-200 pl-3 italic text-slate-500">
                                "{mentor.bio}"
                              </blockquote>
                            </div>
                          </div>

                          {/* Right: Specialties, approval buttons */}
                          <div className="w-full lg:w-72 shrink-0 flex flex-col justify-between items-stretch gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs">
                            <div className="space-y-2">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Onboarded Skills</h4>
                              <div className="flex flex-wrap gap-1">
                                {mentor.skills.map((spec, sIdx) => (
                                  <span key={sIdx} className="bg-white text-indigo-650 px-2 py-0.5 rounded-lg border border-slate-150 text-[9px] font-bold">
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                              <button
                                onClick={() => setInspectingMentor(mentor)}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl font-extrabold text-[10px] transition-all cursor-pointer"
                              >
                                Inspect Full Application
                              </button>
                              {processingMentorId === mentor.id ? (
                                <div className="w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl">
                                  <span className="animate-spin h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent rounded-full shrink-0"></span>
                                  Processing Onboarding...
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <button
                                    disabled={processingMentorId !== null}
                                    onClick={() => handleApproveMentor(mentor)}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-[10px] transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    <Check className="h-3.5 w-3.5" /> Approve
                                  </button>
                                  <button
                                    disabled={processingMentorId !== null}
                                    onClick={() => handleRejectMentor(mentor.id, mentor.name)}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl font-bold text-[10px] transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    <X className="h-3.5 w-3.5" /> Decline
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: APPROVED MENTORS (Tabular Form) */}
              {activeTab === "mentors" && (
                <div className="space-y-8 animate-in fade-in duration-200 text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Approved Mentors Directory</h1>
                      <p className="text-slate-500 text-sm mt-1">Audit active platform mentors, inspect statistics, and revoke platform access permissions.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center relative">
                      <div className="relative flex-grow sm:w-64">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Search className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search mentor..."
                          value={mentorSearch}
                          onChange={(e) => setMentorSearch(e.target.value)}
                          className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none transition-all shadow-sm"
                        />
                      </div>

                      {/* Columns Select Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setIsMentorColsDropdownOpen(!isMentorColsDropdownOpen)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <Sliders className="h-3.5 w-3.5 text-indigo-650" />
                          Columns
                        </button>
                        {isMentorColsDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsMentorColsDropdownOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-25 p-3.5 space-y-2 text-left">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Visible Columns</span>
                              {Object.entries(mentorHeadersMap).map(([key, label]) => (
                                <label key={key} className="flex items-center gap-2.5 text-xs font-semibold text-slate-650 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={visibleMentorCols[key as keyof typeof visibleMentorCols]}
                                    onChange={() => {
                                      setVisibleMentorCols(prev => ({
                                        ...prev,
                                        [key]: !prev[key as keyof typeof visibleMentorCols]
                                      }));
                                    }}
                                    className="h-4 w-4 text-indigo-650 border-slate-350 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span>{label}</span>
                                </label>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Export Excel Button */}
                      <button
                        onClick={() => exportToCSV(filteredMentors, visibleMentorCols, mentorHeadersMap, "mentors_records.csv")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shadow-emerald-100"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Export Excel
                      </button>
                    </div>
                  </div>
 
                  {filteredMentors.length === 0 ? (
                    <div className="p-12 bg-white rounded-3xl border border-slate-100 text-center text-slate-400 shadow-sm">
                      <Briefcase className="h-10 w-10 mx-auto text-slate-350 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">No approved mentors found matching criteria.</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left text-slate-500 border-collapse">
                          <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-100">
                            <tr>
                              {visibleMentorCols.name && <th className="px-6 py-4">Name</th>}
                              {visibleMentorCols.email && <th className="px-6 py-4">Email</th>}
                              {visibleMentorCols.role && <th className="px-6 py-4">Role</th>}
                              {visibleMentorCols.company && <th className="px-6 py-4">Company</th>}
                              {visibleMentorCols.sessions && <th className="px-6 py-4 text-center">Sessions</th>}
                              {visibleMentorCols.rating && <th className="px-6 py-4 text-center">Rating</th>}
                              <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-650">
                            {filteredMentors.map(mentor => (
                              <tr key={mentor.id} className="hover:bg-slate-50/50">
                                {visibleMentorCols.name && (
                                  <td className="px-6 py-4 font-bold text-slate-900">{mentor.name}</td>
                                )}
                                {visibleMentorCols.email && (
                                  <td className="px-6 py-4 font-semibold text-slate-550">{mentor.email}</td>
                                )}
                                {visibleMentorCols.role && (
                                  <td className="px-6 py-4 font-bold text-slate-800">{mentor.role}</td>
                                )}
                                {visibleMentorCols.company && (
                                  <td className="px-6 py-4 font-semibold text-slate-550">{mentor.company}</td>
                                )}
                                {visibleMentorCols.sessions && (
                                  <td className="px-6 py-4 text-center font-bold text-slate-600">{mentor.completedSessions} mocks</td>
                                )}
                                {visibleMentorCols.rating && (
                                  <td className="px-6 py-4 text-center">
                                    <span className="bg-amber-50 text-amber-705 font-extrabold text-[10px] px-2 py-0.5 rounded-lg border border-amber-100 inline-flex items-center gap-0.5 shadow-sm">
                                      ★ {mentor.rating}
                                    </span>
                                  </td>
                                )}
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => setInspectingMentor(mentor)}
                                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors"
                                    >
                                      View Detail
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMentor(mentor.id, mentor.name)}
                                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl font-bold text-[10px] cursor-pointer transition-colors"
                                    >
                                      Remove Login
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: MOCK BOOKINGS AUDITOR */}
              {activeTab === "bookings" && (
                <div className="space-y-8 animate-in fade-in duration-200 text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Mock Booking Audit Log</h1>
                      <p className="text-slate-500 text-sm mt-1">Audit all platform candidate scheduling logs, dates, timeslots, and feedback comment details.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <select
                        value={bookingFilterStatus}
                        onChange={(e) => setBookingFilterStatus(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-650 font-bold"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <select
                        value={bookingFilterPayment}
                        onChange={(e) => setBookingFilterPayment(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-650 font-bold"
                      >
                        <option value="All">All Payments</option>
                        <option value="Done">Payment Done</option>
                        <option value="Pending">Pending Verification</option>
                        <option value="NotDone">Not Done / Unpaid</option>
                      </select>

                      <div className="relative flex-grow sm:w-56">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Search className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search student, mentor..."
                          value={bookingSearch}
                          onChange={(e) => setBookingSearch(e.target.value)}
                          className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-500 border-collapse">
                        <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4">Student Candidate</th>
                            <th className="px-6 py-4">Mentor Evaluator</th>
                            <th className="px-6 py-4">Topic Category & Plan</th>
                            <th className="px-6 py-4">Schedule Date & Slot</th>
                            <th className="px-6 py-4">Payment Audit</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-650">
                          {filteredBookings.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-8 text-center text-slate-400 italic">No mock bookings found matching search criteria.</td>
                            </tr>
                          ) : (
                            filteredBookings.map(booking => (
                              <tr key={booking.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-900">{booking.studentName}</td>
                                <td className="px-6 py-4 font-semibold text-slate-700">{booking.mentorName}</td>
                                <td className="px-6 py-4 font-medium text-slate-600">
                                  <div>{booking.sessionType}</div>
                                  {booking.priceTier && (
                                    <div className="text-[10px] text-indigo-600 font-bold mt-0.5">
                                      {booking.priceTier} (₹{booking.pricePaid})
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-slate-550 font-semibold">{booking.date} • {booking.timeSlot}</td>
                                <td className="px-6 py-4">
                                  {booking.paymentVerified ? (
                                    <div className="space-y-0.5">
                                      <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-bold">Verified</span>
                                      {booking.transactionId && (
                                        <div className="text-[9px] text-slate-405 font-mono">ID: {booking.transactionId}</div>
                                      )}
                                    </div>
                                  ) : booking.transactionId ? (
                                    <div className="space-y-0.5">
                                      <span className="inline-flex px-1.5 py-0.5 bg-amber-50 text-amber-705 border border-amber-100 rounded text-[9px] font-bold">Pending Review</span>
                                      <div className="text-[9px] text-slate-600 font-mono font-bold">Ref: {booking.transactionId}</div>
                                      <div className="text-[9px] text-slate-400">Date: {booking.paymentDate}</div>
                                    </div>
                                  ) : (
                                    <span className="inline-flex px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded text-[9px] font-bold">Unpaid</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`inline-flex px-2 py-0.5 font-bold rounded-lg text-[9px] border ${
                                    booking.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                    booking.status === "Approved" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                                    booking.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse" :
                                    "bg-rose-50 text-rose-700 border-rose-100"
                                  }`}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {!booking.paymentVerified && booking.transactionId ? (
                                    processingBookingId === booking.id ? (
                                      <div className="flex items-center justify-center">
                                        <span className="animate-spin h-3.5 w-3.5 border-2 border-indigo-650 border-t-transparent rounded-full"></span>
                                      </div>
                                    ) : (
                                      <button
                                        disabled={(currentAdminProfile && !currentAdminProfile.canVerifyPayments) || processingBookingId !== null}
                                        onClick={() => handleVerifyPayment(booking.id)}
                                        className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold transition-all ${
                                          currentAdminProfile && !currentAdminProfile.canVerifyPayments
                                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow shadow-emerald-100 cursor-pointer"
                                        }`}
                                        title={currentAdminProfile && !currentAdminProfile.canVerifyPayments ? "No permission to verify payments" : ""}
                                      >
                                        Verify Payment
                                      </button>
                                    )
                                  ) : (
                                    <span className="text-[9px] text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: DYNAMIC PRICING TIERS MANAGEMENT */}
              {activeTab === "pricing" && (
                <div className="space-y-8 animate-in fade-in duration-200 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pricing Tiers Management</h1>
                      <p className="text-slate-500 text-sm mt-1">Create, edit, and delete mock session pricing tiers and benefits packages dynamically.</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingPlanId(null);
                        setPricingForm({
                          name: "",
                          price: "",
                          duration: "",
                          subtitle: "",
                          tag: "",
                          perfectFor: "",
                          features: "",
                        });
                        setIsPricingModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs transition-colors shadow-md shadow-indigo-100 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      Create New Pricing Tier
                    </button>
                  </div>

                  {pricingPlans.length === 0 ? (
                    <div className="p-12 bg-white rounded-3xl border border-slate-100 text-center text-slate-400 shadow-sm">
                      <DollarSign className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">No pricing plans defined yet.</p>
                      <p className="text-[10px] text-slate-400 mt-1">Click the button above to create the first pricing plan tier.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pricingPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between space-y-5 hover:border-indigo-250 transition-all relative overflow-hidden"
                        >
                          {plan.tag && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-indigo-55 text-indigo-750 text-[9px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider">
                                {plan.tag}
                              </span>
                            </div>
                          )}

                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] text-indigo-650 font-bold block uppercase tracking-wider">
                                {plan.duration} Min Duration
                              </span>
                              <h3 className="text-base font-extrabold text-slate-900 mt-1">{plan.name}</h3>
                              {plan.subtitle && (
                                <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                                  {plan.subtitle}
                                </p>
                              )}
                            </div>

                            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-slate-900">₹{plan.price}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                per session
                              </span>
                            </div>

                            {plan.perfectFor && plan.perfectFor.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Best For:</span>
                                <div className="flex flex-wrap gap-1">
                                  {plan.perfectFor.map((t: string, idx: number) => (
                                    <span key={idx} className="bg-slate-100 text-slate-650 text-[9px] font-bold px-2 py-0.5 rounded-lg border border-slate-150">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {plan.features && plan.features.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">What's Included:</span>
                                <ul className="space-y-1 text-xs text-slate-605 font-medium">
                                  {plan.features.slice(0, 4).map((feat: string, idx: number) => (
                                    <li key={idx} className="flex items-center gap-1.5 truncate">
                                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                      <span className="truncate">{feat}</span>
                                    </li>
                                  ))}
                                  {plan.features.length > 4 && (
                                    <li className="text-[10px] text-slate-400 font-bold tracking-wider uppercase pl-5 pt-0.5">
                                      + {plan.features.length - 4} more benefits
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex gap-2">
                            <button
                              onClick={() => handleEditPricingPlanClick(plan)}
                              className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer text-center"
                            >
                              Edit Details
                            </button>
                            <button
                              onClick={() => handleDeletePricingPlan(plan.id, plan.name)}
                              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: ADMIN MANAGEMENT */}
              {activeTab === "admins" && (
                <div className="space-y-8 animate-in fade-in duration-200 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin User Management</h1>
                      <p className="text-slate-500 text-sm mt-1">Manage administrators, create custom roles, and define granular rights and permissions.</p>
                    </div>
                    <button
                      onClick={handleCreateAdminClick}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-indigo-100 cursor-pointer"
                    >
                      <Users className="h-4 w-4" />
                      Create Admin User
                    </button>
                  </div>

                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-500 border-collapse">
                        <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email Address</th>
                            <th className="px-6 py-4">Custom Role</th>
                            <th className="px-6 py-4">Access Rights & Permissions</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-650">
                          {adminsList.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">No administrators found.</td>
                            </tr>
                          ) : (
                            adminsList.map((admin: any) => (
                              <tr key={admin.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-900">{admin.name}</td>
                                <td className="px-6 py-4 font-semibold text-slate-700">{admin.email}</td>
                                <td className="px-6 py-4 font-medium">
                                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">
                                    {admin.roleName}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    {admin.canAccessStudents && (
                                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-emerald-100">Students</span>
                                    )}
                                    {admin.canAccessMentors && (
                                      <span className="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-sky-100">Mentors</span>
                                    )}
                                    {admin.canVerifyPayments && (
                                      <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-amber-100">Payments</span>
                                    )}
                                    {admin.canManagePricing && (
                                      <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-purple-100">Pricing</span>
                                    )}
                                    {admin.canManageAdmins && (
                                      <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-rose-100">Admins</span>
                                    )}
                                    {!admin.canAccessStudents && !admin.canAccessMentors && !admin.canVerifyPayments && !admin.canManagePricing && !admin.canManageAdmins && (
                                      <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px] font-semibold">No Permissions</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={() => handleEditAdminClick(admin)}
                                      className="py-1 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      disabled={admin.email === currentAdminProfile?.email}
                                      onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                      className={`py-1 px-3 rounded-lg text-[10px] font-bold transition-all ${
                                        admin.email === currentAdminProfile?.email
                                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                          : "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 cursor-pointer"
                                      }`}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SYSTEM SETTINGS CONFIG */}
              {activeTab === "settings" && (
                <div className="space-y-8 animate-in fade-in duration-200 text-left">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Configs</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure global parameters, Commission deduction margins, and automatic portal controls.</p>
                  </div>

                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <form onSubmit={handleSaveConfigs} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="space-y-5">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Automated Rules</h3>
                          
                          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Automatic Suggested Grades</span>
                              <span className="text-[10px] text-slate-400 leading-normal block max-w-xs mt-0.5">Automatically calculate suggested letter grades based on slider values.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={configGradeSync}
                              onChange={(e) => setConfigGradeSync(e.target.checked)}
                              className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">AI Feedback Drafting</span>
                              <span className="text-[10px] text-slate-400 leading-normal block max-w-xs mt-0.5">Enable markdown AI generator draft drafts for score report builders.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={configAIDrafts}
                              onChange={(e) => setConfigAIDrafts(e.target.checked)}
                              className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="space-y-5">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Operations Settings</h3>
                          
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                            <label className="text-xs font-bold text-slate-800 block">Commission Retention Fee</label>
                            <span className="text-[10px] text-slate-400 leading-normal block mb-2">Select the deduction yield held by the platform per mock interview booking session.</span>
                            <select
                              value={configCommission}
                              onChange={(e) => setConfigCommission(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                            >
                              <option value="10">10% Platform fee</option>
                              <option value="15">15% Platform fee</option>
                              <option value="20">20% Platform fee</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div>
                              <span className="text-xs font-bold text-slate-800 block text-rose-650">Maintenance Mode Override</span>
                              <span className="text-[10px] text-slate-400 leading-normal block max-w-xs mt-0.5">Force student and mentor portals into a simulated maintenance status lock.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={configMaintenance}
                              onChange={(e) => setConfigMaintenance(e.target.checked)}
                              className="h-4 w-4 text-rose-650 rounded focus:ring-rose-500 cursor-pointer"
                            />
                          </div>
                        </div>

                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-xs cursor-pointer shadow-md shadow-indigo-150"
                        >
                          <CheckCircle className="h-4 w-4" /> Save System Configs
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* ==========================================
         2.5 CUSTOM DELETE CONFIRMATION POPUP
         ========================================== */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative bg-white w-full max-w-md rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 text-center animate-in zoom-in duration-200 space-y-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100">
              <ShieldAlert className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900">Confirm Permanent Deletion</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Are you sure you want to permanently delete the {deleteConfirmation.type} record for{" "}
                <strong className="text-slate-800 font-bold">{deleteConfirmation.name}</strong>? 
                This action is irreversible and will cascade-remove all related mock session bookings and portal access.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel Action
              </button>
              <button
                type="button"
                onClick={async () => {
                  const target = deleteConfirmation;
                  setDeleteConfirmation(null);
                  if (target.type === 'student') {
                    await executeDeleteStudent(target.id, target.name);
                  } else {
                    await executeDeleteMentor(target.id, target.name);
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow shadow-rose-100 cursor-pointer"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
         3. STUDENT PROFILE POPUP MODAL DIALOG
         ========================================== */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col justify-between text-left animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 sm:px-8 py-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[8px] font-black text-indigo-350 bg-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                  Student Dossier Audit
                </span>
                <h2 className="text-lg font-black mt-1 leading-none">{inspectingStudent.name}</h2>
                <span className="text-[10px] text-slate-400 font-semibold">{inspectingStudent.email}</span>
              </div>
              <button
                onClick={() => setInspectingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer bg-slate-800/40 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Academic Coordinates */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap className="h-4 w-4 text-indigo-650" /> Academic Standing
                  </h4>
                  <div className="text-[11px] text-slate-650 space-y-1.5 pt-1">
                    <div><strong className="text-slate-800">College:</strong> {inspectingStudent.college}</div>
                    <div><strong className="text-slate-800">Degree:</strong> {inspectingStudent.degree}</div>
                    <div><strong className="text-slate-800">Grad Year:</strong> {inspectingStudent.gradYear}</div>
                    <div><strong className="text-slate-800">GPA Rank:</strong> {inspectingStudent.gpa}</div>
                  </div>
                </div>

                {/* Target Roadmap Coordinates */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-indigo-650" /> Job Search Targets
                  </h4>
                  <div className="text-[11px] text-slate-650 space-y-1.5 pt-1">
                    <div><strong className="text-slate-800">Focus Role:</strong> {inspectingStudent.targetRole}</div>
                    <div><strong className="text-slate-800">Companies:</strong> {inspectingStudent.targetCompanies}</div>
                    <div><strong className="text-slate-800">Search Status:</strong> {inspectingStudent.searchStatus}</div>
                    <div><strong className="text-slate-800">Preferred Location:</strong> {inspectingStudent.preferredLocation}</div>
                  </div>
                </div>
              </div>

              {/* Stack specialties */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Technical Stack</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <strong className="text-[10px] text-slate-800 block mb-1">Languages:</strong>
                    <div className="flex flex-wrap gap-1">
                      {inspectingStudent.languages.split(",").map((lang: string, lIdx: number) => (
                        <span key={lIdx} className="bg-white text-slate-600 border border-slate-150 px-2 py-0.5 rounded text-[9px] font-bold">
                          {lang.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <strong className="text-[10px] text-slate-800 block mb-1">Frameworks:</strong>
                    <div className="flex flex-wrap gap-1">
                      {inspectingStudent.frameworks.split(",").map((fw: string, fIdx: number) => (
                        <span key={fIdx} className="bg-white text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded text-[9px] font-bold">
                          {fw.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects highlight */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highlight Project Dossiers</h4>
                {(() => {
                  const studentProjects = (inspectingStudent.projects && Array.isArray(inspectingStudent.projects) && inspectingStudent.projects.length > 0)
                    ? inspectingStudent.projects
                    : [
                        { title: inspectingStudent.project1Title, desc: inspectingStudent.project1Desc, tech: inspectingStudent.project1Tech },
                        { title: inspectingStudent.project2Title, desc: inspectingStudent.project2Desc, tech: inspectingStudent.project2Tech }
                      ].filter(p => p.title);
                  
                  if (studentProjects.length === 0) {
                    return (
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                        <p className="text-[10px] text-slate-400">No project details provided.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {studentProjects.map((proj: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                          <strong className="text-[11px] text-slate-900 block font-black leading-tight">{proj.title || "N/A"}</strong>
                          <p className="text-[10px] text-slate-400 leading-normal">{proj.desc || "N/A"}</p>
                          <span className="text-[9px] font-bold text-indigo-650 block pt-1">Tech Stack: {proj.tech || "N/A"}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-100">
              <div className="flex gap-4.5 text-[10px] text-slate-400 font-semibold">
                {inspectingStudent.githubUrl && (
                  <a href={inspectingStudent.githubUrl} target="_blank" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
                    <Github className="h-4 w-4" /> Github References
                  </a>
                )}
                {inspectingStudent.linkedinUrl && (
                  <a href={inspectingStudent.linkedinUrl} target="_blank" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
                    <Linkedin className="h-4 w-4" /> LinkedIn Profile
                  </a>
                )}
              </div>

              <button
                onClick={() => setInspectingStudent(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow shadow-indigo-100 cursor-pointer transition-colors"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ==========================================
         4. MENTOR PROFILE POPUP MODAL DIALOG
         ========================================== */}
      {inspectingMentor && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col justify-between text-left animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 sm:px-8 py-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[8px] font-black text-indigo-350 bg-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                  Mentor Profile Audit
                </span>
                <h2 className="text-lg font-black mt-1 leading-none">{inspectingMentor.name}</h2>
                <span className="text-[10px] text-slate-400 font-semibold">{inspectingMentor.email}</span>
              </div>
              <button
                onClick={() => setInspectingMentor(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer bg-slate-800/40 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Professional Coordinates */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-indigo-600" /> Professional Coordinates
                  </h4>
                  <div className="text-[11px] text-slate-650 space-y-1.5 pt-1">
                    <div><strong className="text-slate-800">Company:</strong> {inspectingMentor.company}</div>
                    <div><strong className="text-slate-800">Role:</strong> {inspectingMentor.role}</div>
                    <div><strong className="text-slate-800">Specialty:</strong> {inspectingMentor.specialty}</div>
                    <div><strong className="text-slate-800">Experience:</strong> {inspectingMentor.experience}</div>
                    <div><strong className="text-slate-800">Phone:</strong> {inspectingMentor.phone || "No Phone"}</div>
                  </div>
                </div>

                {/* Rating & Performance Stats */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Award className="h-4 w-4 text-indigo-600" /> Performance & Rating
                  </h4>
                  <div className="text-[11px] text-slate-650 space-y-1.5 pt-1">
                    <div className="flex items-center gap-1"><strong className="text-slate-800">Average Rating:</strong> 
                      {inspectingMentor.approved ? (
                        <span className="bg-amber-50 text-amber-700 font-extrabold text-[10px] px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-0.5">
                          ★ {inspectingMentor.rating.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold italic">
                          New Applicant (Unrated)
                        </span>
                      )}
                    </div>
                    <div><strong className="text-slate-800">Completed Sessions:</strong> {inspectingMentor.completedSessions} mocks</div>
                    <div><strong className="text-slate-800">Availability:</strong> {inspectingMentor.availableDays?.length || 0} days/week</div>
                    <div><strong className="text-slate-800">Approval Status:</strong> <span className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${inspectingMentor.approved ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>{inspectingMentor.approved ? "Approved" : "Pending Approval"}</span></div>
                  </div>
                </div>
              </div>

              {/* Bio block */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Professional Bio</h4>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-xs text-slate-600 leading-relaxed italic font-normal">
                    &quot;{inspectingMentor.bio}&quot;
                  </p>
                </div>
              </div>

              {/* Skills checklist */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Onboarded Skills</h4>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex flex-wrap gap-1.5">
                    {inspectingMentor.skills.map((skill, index) => (
                      <span key={index} className="bg-white text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Availability schedule details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Availability Days</h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {inspectingMentor.availableDays?.map((day, index) => (
                      <span key={index} className="bg-white text-slate-700 border border-slate-150 px-2.5 py-1 rounded-lg text-[9px] font-bold">
                        {day}
                      </span>
                    )) || <span className="text-slate-400 italic">None set</span>}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Availability Slots</h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {inspectingMentor.availableSlots?.map((slot, index) => (
                      <span key={index} className="bg-white text-indigo-655 border border-indigo-100 px-2.5 py-1 rounded-lg text-[9px] font-bold">
                        {slot}
                      </span>
                    )) || <span className="text-slate-400 italic">None set</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-100">
              <div className="flex gap-4.5 text-[10px] text-slate-500 font-semibold">
                <span>Mentor ID: {inspectingMentor.idNumber || inspectingMentor.id}</span>
                <span>•</span>
                <span>Contact: {inspectingMentor.phone || inspectingMentor.email}</span>
              </div>

              <div className="flex gap-2">
                {!inspectingMentor.approved && (
                  <button
                    onClick={() => {
                      handleApproveMentor(inspectingMentor);
                      setInspectingMentor(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-colors"
                  >
                    Approve Mentor
                  </button>
                )}
                <button
                  onClick={() => setInspectingMentor(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow shadow-indigo-100 cursor-pointer transition-colors"
                >
                  Close Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ==========================================
         5. CREATE / EDIT PRICING PLAN MODAL
         ========================================== */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative bg-white w-full max-w-lg rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col justify-between text-left animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-955 to-slate-900 px-6 sm:px-8 py-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[8px] font-black text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                  Pricing Plan Configuration
                </span>
                <h2 className="text-lg font-black mt-1 leading-none">
                  {editingPlanId ? "Edit Pricing Plan" : "Create Pricing Plan"}
                </h2>
              </div>
              <button
                onClick={() => setIsPricingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer bg-slate-800/40 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePricingPlan}>
              <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Interview Practice"
                      value={pricingForm.name}
                      onChange={(e) => setPricingForm({ ...pricingForm, name: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 599"
                      value={pricingForm.price}
                      onChange={(e) => setPricingForm({ ...pricingForm, price: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Duration (Minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 60"
                      value={pricingForm.duration}
                      onChange={(e) => setPricingForm({ ...pricingForm, duration: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Plan Tag (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Best Seller, Practice Tiers"
                      value={pricingForm.tag}
                      onChange={(e) => setPricingForm({ ...pricingForm, tag: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Subtitle / Quick Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mock technical interview simulation under high-pressure conditions."
                    value={pricingForm.subtitle}
                    onChange={(e) => setPricingForm({ ...pricingForm, subtitle: e.target.value })}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Best For (Comma separated tags)
                  </label>
                  <span className="text-[9px] text-slate-400 block mb-2">Separate target audiences with commas, e.g. DSA Practice, System Design, Tech Prep</span>
                  <input
                    type="text"
                    placeholder="e.g. DSA Practice, System Design, Tech Prep"
                    value={pricingForm.perfectFor}
                    onChange={(e) => setPricingForm({ ...pricingForm, perfectFor: e.target.value })}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    What's Included (Comma separated features)
                  </label>
                  <span className="text-[9px] text-slate-400 block mb-2">Separate benefits with commas, e.g. Detailed roadmap, Resume review, Interactive Q&A</span>
                  <textarea
                    rows={3}
                    placeholder="e.g. Detailed technical roadmap, Comprehensive Resume review, Interactive Q&A discussion"
                    value={pricingForm.features}
                    onChange={(e) => setPricingForm({ ...pricingForm, features: e.target.value })}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-655 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPlan}
                  className="px-5 py-2 bg-indigo-655 hover:bg-indigo-755 text-white font-extrabold text-xs rounded-xl shadow shadow-indigo-100 cursor-pointer disabled:opacity-50 transition-colors inline-flex items-center gap-1.5 justify-center"
                >
                  {isSubmittingPlan ? (
                    <>
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full shrink-0"></span>
                      Saving Plan...
                    </>
                  ) : (
                    "Save Pricing Plan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ONBOARD ADMINISTRATOR ROLE MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  {editingAdminId ? "Edit Admin Role & Permissions" : "Onboard Administrator"}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Assign credentials and select granular access privileges.</p>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-extrabold text-xs transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin}>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-left">
                {adminFormError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold leading-normal">
                    {adminFormError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abhay Chauhan"
                      value={adminForm.name}
                      onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Custom Role Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Billing Specialist"
                      value={adminForm.roleName}
                      onChange={(e) => setAdminForm({ ...adminForm, roleName: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      disabled={!!editingAdminId}
                      placeholder="e.g. abhay@gmail.com"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      className={`block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold ${
                        editingAdminId ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-50"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {editingAdminId ? "New Password (Leave blank to keep same)" : "Password *"}
                    </label>
                    <input
                      type="password"
                      required={!editingAdminId}
                      placeholder={editingAdminId ? "••••••" : "e.g. secure123"}
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    />
                  </div>
                </div>

                <hr className="border-slate-100 my-4" />

                <div className="space-y-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assign Access Permissions</span>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Checkbox 1: Students */}
                    <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-150 cursor-pointer hover:bg-slate-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={adminForm.canAccessStudents}
                        onChange={(e) => setAdminForm({ ...adminForm, canAccessStudents: e.target.checked })}
                        className="mt-1 accent-indigo-650 h-4 w-4"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Access Students Registry</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Allows viewing lists, checking project dossiers, and revoking student logins.</span>
                      </div>
                    </label>

                    {/* Checkbox 2: Mentors */}
                    <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-150 cursor-pointer hover:bg-slate-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={adminForm.canAccessMentors}
                        onChange={(e) => setAdminForm({ ...adminForm, canAccessMentors: e.target.checked })}
                        className="mt-1 accent-indigo-650 h-4 w-4"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Access Mentors Onboarding</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Allows inspecting mentor logs, approving pending profiles, and removing active evaluation accounts.</span>
                      </div>
                    </label>

                    {/* Checkbox 3: Payments */}
                    <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-150 cursor-pointer hover:bg-slate-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={adminForm.canVerifyPayments}
                        onChange={(e) => setAdminForm({ ...adminForm, canVerifyPayments: e.target.checked })}
                        className="mt-1 accent-indigo-650 h-4 w-4"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Verify Transaction Payments</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Allows approving pending payments in the mock booking ledger to make video rooms simulation ready.</span>
                      </div>
                    </label>

                    {/* Checkbox 4: Pricing */}
                    <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-150 cursor-pointer hover:bg-slate-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={adminForm.canManagePricing}
                        onChange={(e) => setAdminForm({ ...adminForm, canManagePricing: e.target.checked })}
                        className="mt-1 accent-indigo-650 h-4 w-4"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Manage Pricing Plans</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Allows creating, updating, and removing plans from the website.</span>
                      </div>
                    </label>

                    {/* Checkbox 5: Admins */}
                    <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-150 cursor-pointer hover:bg-slate-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={adminForm.canManageAdmins}
                        onChange={(e) => setAdminForm({ ...adminForm, canManageAdmins: e.target.checked })}
                        className="mt-1 accent-indigo-650 h-4 w-4"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Manage Administrator Access</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Allows creating and deleting other administrators and changing permissions.</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-655 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="px-5 py-2 bg-indigo-655 hover:bg-indigo-755 text-white font-extrabold text-xs rounded-xl shadow shadow-indigo-100 cursor-pointer disabled:opacity-50 transition-colors inline-flex items-center gap-1.5 justify-center"
                >
                  {isSubmittingAdmin ? (
                    <>
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full shrink-0"></span>
                      Saving Admin...
                    </>
                  ) : (
                    "Save Administrator"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ThemePicker />
    </div>
  );
}
