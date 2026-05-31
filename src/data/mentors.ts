export interface Mentor {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  specialty: 'Frontend' | 'Backend' | 'System Design' | 'HR & Behavioral';
  bio: string;
  experience: string;
  rating: number;
  completedSessions: number;
  skills: string[];
  imageUrl?: string;
  availableDays: string[];
  availableSlots: string[];
  blockedDates?: string[];
  approved?: boolean;
  idNumber?: string;
  phone?: string;
}

export const mentors: Mentor[] = [
  {
    id: "akash",
    name: "Akash",
    email: "akash@gmail.com",
    role: "Senior Frontend Engineer",
    company: "Google",
    specialty: "Frontend",
    bio: "Passionate about pixel-perfect UIs, user experience, and Next.js / React ecosystems. Helps students master Web Core Vitals, CSS/Tailwind, and system design for frontend.",
    experience: "5+ Years",
    rating: 4.9,
    completedSessions: 142,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Web Performance", "Redux"],
    imageUrl: "/images/akash.jpg", // We can use fallbacks or icons
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

