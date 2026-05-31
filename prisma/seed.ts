import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Inlined mentors mock data to avoid ES module path resolution errors
const mentors: any[] = [
  {
    id: "akash",
    name: "Akash",
    email: "akash.mentor@gmail.com", // Distinct mentor email to avoid conflict
    role: "Senior Frontend Engineer",
    company: "Google",
    specialty: "Frontend",
    bio: "Passionate about pixel-perfect UIs, user experience, and Next.js / React ecosystems. Helps students master Web Core Vitals, CSS/Tailwind, and system design for frontend.",
    experience: "5+ Years",
    rating: 4.9,
    completedSessions: 142,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Web Performance", "Redux"],
    imageUrl: "/images/akash.jpg",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableSlots: ["10:00 AM", "2:00 PM", "4:30 PM", "7:00 PM"]
  },
  {
    id: "prashu",
    name: "Prashu",
    email: "prashu@gmail.com",
    role: "Staff Backend Engineer",
    company: "Meta",
    specialty: "Backend",
    bio: "Specializes in high-performance microservices, REST/GraphQL APIs, database architectures, and distributed systems. Expert in Go, Java, and PostgreSQL performance tuning.",
    experience: "7+ Years",
    rating: 4.95,
    completedSessions: 198,
    skills: ["Go", "PostgreSQL", "System Design", "Docker", "gRPC", "Redis", "AWS"],
    imageUrl: "/images/prashu.jpg",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableSlots: ["11:00 AM", "3:00 PM", "5:30 PM", "8:00 PM"]
  },
  {
    id: "sumit",
    name: "Sumit",
    email: "sumit@gmail.com",
    role: "Principal Talent Acquisition Partner",
    company: "Netflix",
    specialty: "HR & Behavioral",
    bio: "Ex-Amazon, Netflix recruiter. Helping engineers ace behavioral rounds, construct outstanding resumes, and navigate difficult salary negotiation conversations successfully.",
    experience: "8+ Years",
    rating: 4.85,
    completedSessions: 220,
    skills: ["Behavioral Prep", "Resume Building", "HR Strategy", "Negotiation", "Career Coaching"],
    imageUrl: "/images/sumit.jpg",
    availableDays: ["Monday", "Tuesday", "Thursday"],
    availableSlots: ["9:00 AM", "12:00 PM", "3:30 PM", "6:00 PM"]
  },
  {
    id: "rakshit",
    name: "Rakshit",
    email: "rakshit@gmail.com",
    role: "System Design Architect",
    company: "Uber",
    specialty: "System Design",
    bio: "Architecting large scale systems that serve millions of QPS. Focuses on system scalability, cache layers, message queues, and trade-off analysis for technical interviews.",
    experience: "6+ Years",
    rating: 4.98,
    completedSessions: 167,
    skills: ["System Design", "Microservices", "Scalability", "Kafka", "Caching", "NoSQL", "Load Balancing"],
    imageUrl: "/images/rakshit.jpg",
    availableDays: ["Wednesday", "Friday", "Saturday"],
    availableSlots: ["2:00 PM", "4:00 PM", "6:00 PM", "9:00 PM"]
  }
];

// Inlined initial bookings mock data with any[] typing to avoid TypeScript compiler type checks
const initialBookings: any[] = [
  {
    id: "booking-1",
    studentName: "Akash (Student)",
    studentEmail: "akash@gmail.com",
    mentorId: "rakshit",
    mentorName: "Rakshit",
    sessionType: "System Design Mock",
    date: "2026-05-20",
    timeSlot: "4:00 PM",
    status: "Completed",
    notes: "Preparing for Uber senior role interview. Focus on rate limiters and database sharding.",
    feedback: {
      dsaScore: "A-",
      systemDesignScore: "A",
      communicationScore: "A+",
      comments: "Excellent understanding of sharding techniques and consistent hashing. Work slightly on handling high availability edge cases, but overall candidate is very strong.",
      submittedAt: "2026-05-20T17:00:00.000Z"
    }
  },
  {
    id: "booking-2",
    studentName: "Akash (Student)",
    studentEmail: "akash@gmail.com",
    mentorId: "akash",
    mentorName: "Akash",
    sessionType: "DSA Mock Interview",
    date: "2026-05-25",
    timeSlot: "2:00 PM",
    status: "Completed",
    notes: "Reviewing trees and dynamic programming.",
    feedback: {
      dsaScore: "B+",
      systemDesignScore: "N/A",
      communicationScore: "A-",
      comments: "Identified DP recurrence relation. Needed a bit of help with boundary conditions but optimized spatial complexity efficiently.",
      submittedAt: "2026-05-25T15:00:00.000Z"
    }
  },
  {
    id: "booking-3",
    studentName: "Akash (Student)",
    studentEmail: "akash@gmail.com",
    mentorId: "sumit",
    mentorName: "Sumit",
    sessionType: "HR Mock Interview",
    date: "2026-06-02",
    timeSlot: "12:00 PM",
    status: "Pending",
    notes: "Mock HR interview covering career goals, conflict resolution, and salary expectations."
  },
  {
    id: "booking-4",
    studentName: "Akash (Student)",
    studentEmail: "akash@gmail.com",
    mentorId: "prashu",
    mentorName: "Prashu",
    sessionType: "Resume Review & Career Prep",
    date: "2026-06-05",
    timeSlot: "3:00 PM",
    status: "Approved",
    notes: "Check if my backend projects stand out."
  }
];

async function main() {
  console.log("Seeding database...");

  // Delete existing data to prevent duplicates on re-run
  await prisma.activity.deleteMany({});
  await prisma.goal.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.mentor.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.pricingPlan.deleteMany({});

  const passwordHash = await bcrypt.hash("1234", 10);

  // 1. Create Super Admin
  const admin = await prisma.admin.create({
    data: {
      email: "akash@gmail.com",
      passwordHash: passwordHash,
      name: "Akash (Admin)",
      roleName: "Super Admin",
      canAccessStudents: true,
      canAccessMentors: true,
      canVerifyPayments: true,
      canManagePricing: true,
      canManageAdmins: true,
    },
  });
  console.log("Super Admin created:", admin.email);

  // 2. Create Default Student
  const student = await prisma.student.create({
    data: {
      idNumber: "STU-10001",
      name: "Akash Gupta",
      email: "akash@gmail.com",
      passwordHash: passwordHash,
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
      ] as any,
    },
  });
  console.log("Default student created:", student.email);

  // 3. Create Default Student Goals
  await prisma.goal.create({
    data: {
      text: "Complete Trees and Graphs mock evaluation",
      completed: false,
      studentId: student.id,
    },
  });
  await prisma.goal.create({
    data: {
      text: "Refine STAR behavioral stories with Sumit",
      completed: true,
      studentId: student.id,
    },
  });
  await prisma.goal.create({
    data: {
      text: "Achieve ATS Resume Score > 80",
      completed: false,
      studentId: student.id,
    },
  });
  console.log("Goals seeded.");

  // 4. Create Default Student Activities
  await prisma.activity.createMany({
    data: [
      {
        text: "Created Student Portal account session",
        time: "Just Now",
        type: "system",
        studentId: student.id,
      },
      {
        text: "ATS Resume evaluation completed (Score: 78)",
        time: "2 hours ago",
        type: "resume",
        studentId: student.id,
      },
    ],
  });
  console.log("Activities seeded.");

  // 5. Create Default Dynamic Pricing Plans
  await prisma.pricingPlan.createMany({
    data: [
      {
        name: "Starter Session",
        price: 299,
        duration: 30,
        subtitle: "Perfect for freshers and first-year students seeking initial college and career direction.",
        tag: "Volume Starter",
        perfectFor: ["Freshers", "First-year students", "Curious users"],
        features: ["One 1:1 call session", "Career guidance", "College guidance", "Roadmap checklist"],
      },
      {
        name: "Premium Session",
        price: 499,
        duration: 60,
        subtitle: "Detailed evaluation targeting specific engineering competencies, coding, or architecture.",
        tag: "Best Seller",
        perfectFor: ["Interview Practice", "Resume Feedback", "Direct Mentorship"],
        features: ["Detailed technical roadmap", "Comprehensive Resume review", "Interactive Q&A discussion", "Personalized Action plan"],
      },
      {
        name: "Career Accelerator",
        price: 999,
        duration: 90,
        subtitle: "Deep technical audit and complete placement prep for top tech engineering applications.",
        tag: "Serious Students",
        perfectFor: ["Final Year Candidates", "Hiring Sprints", "Senior Preparations"],
        features: ["Deep 1:1 mentorship & audit", "Resume & LinkedIn reviews", "Internship and job search strategy", "Interview prep and 30-day action plan"],
      },
      {
        name: "Interview Practice",
        price: 599,
        duration: 60,
        subtitle: "Mock technical interview simulation under high-pressure conditions.",
        tag: "Practice Tiers",
        perfectFor: ["DSA Practice", "System Design", "Tech Prep"],
        features: ["Detailed technical roadmap", "Interactive Q&A discussion", "Mock grading scorecards"],
      },
      {
        name: "Resume Feedback",
        price: 199,
        duration: 20,
        subtitle: "Quick evaluation of your resume format, wording, and ATS compatibility.",
        tag: "Quick Audit",
        perfectFor: ["Resume Audit", "ATS Optimization"],
        features: ["Comprehensive Resume review", "ATS score feedback", "Wording recommendations"],
      },
      {
        name: "Direct Mentorship",
        price: 1499,
        duration: 120,
        subtitle: "Intense direct mentorship session for long-term career planning and action.",
        tag: "Elite Direct",
        perfectFor: ["Long Term Guidance", "Strategic Advice"],
        features: ["Detailed technical roadmap", "Personalized Action plan", "Ongoing Slack access (mock)"],
      }
    ]
  });
  console.log("Pricing plans seeded.");

  // 6. Seed Default Mentors
  for (const [index, m] of mentors.entries()) {
    await prisma.mentor.create({
      data: {
        id: m.id,
        idNumber: `MEN-${10001 + index}`,
        approved: true,
        name: m.name,
        email: m.email,
        passwordHash: passwordHash,
        phone: "+91 98765 43210",
        role: m.role,
        company: m.company,
        specialty: m.specialty,
        bio: m.bio,
        rating: m.rating,
        completedSessions: m.completedSessions,
        experience: m.experience,
        skills: m.skills,
        availableDays: m.availableDays,
        availableSlots: m.availableSlots,
        imageUrl: m.imageUrl,
      }
    });
    console.log(`Mentor created: ${m.name} (${m.id})`);
  }
  console.log("Mentors seeded.");

  // 7. Seed Default Bookings
  for (const b of initialBookings) {
    const studentId = student.id;
    const mentorId = b.mentorId;

    await prisma.booking.create({
      data: {
        id: b.id,
        studentId: studentId,
        mentorId: mentorId,
        sessionType: b.sessionType,
        date: b.date,
        timeSlot: b.timeSlot,
        status: b.status,
        notes: b.notes,
        priceTier: b.priceTier,
        pricePaid: b.pricePaid,
        paymentDate: b.paymentDate,
        transactionId: b.transactionId,
        paymentVerified: b.paymentVerified || false,
        feedback: b.feedback ? {
          create: {
            dsaScore: b.feedback.dsaScore,
            systemDesignScore: b.feedback.systemDesignScore,
            communicationScore: b.feedback.communicationScore,
            comments: b.feedback.comments,
            submittedAt: b.feedback.submittedAt ? new Date(b.feedback.submittedAt) : undefined,
          }
        } : undefined,
      }
    });
    console.log(`Booking created: ${b.id}`);
  }
  console.log("Bookings and associated feedback seeded.");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
