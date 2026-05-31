export interface Feedback {
  dsaScore: string; // e.g. "A", "B", "C"
  systemDesignScore?: string;
  communicationScore: string;
  comments: string;
  submittedAt: string;
}

export interface MentorFeedback {
  id: string;
  rating: number;
  comments?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  studentName: string;
  studentEmail: string;
  mentorId: string;
  mentorName: string;
  sessionType: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  notes?: string;
  feedback?: Feedback;
  mentorFeedback?: MentorFeedback;
  priceTier?: string;
  pricePaid?: number;
  paymentDate?: string;
  transactionId?: string;
  paymentVerified?: boolean;
}

export const initialBookings: Booking[] = [
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
