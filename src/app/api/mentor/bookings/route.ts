import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const mentor = await prisma.mentor.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found." }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { 
        mentorId: mentor.id,
        paymentVerified: true
      },
      include: {
        student: true,
        feedback: true,
        mentorFeedback: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Format structure to match client expectation
    const formatted = bookings.map((b) => ({
      id: b.id,
      studentName: b.student.name,
      studentEmail: b.student.email,
      mentorId: b.mentorId,
      mentorName: mentor.name,
      sessionType: b.sessionType,
      date: b.date,
      timeSlot: b.timeSlot,
      status: b.status,
      notes: b.notes,
      feedback: b.feedback
        ? {
            dsaScore: b.feedback.dsaScore,
            systemDesignScore: b.feedback.systemDesignScore,
            communicationScore: b.feedback.communicationScore,
            comments: b.feedback.comments,
            submittedAt: b.feedback.submittedAt.toISOString(),
          }
        : undefined,
      mentorFeedback: b.mentorFeedback
        ? {
            id: b.mentorFeedback.id,
            rating: b.mentorFeedback.rating,
            comments: b.mentorFeedback.comments,
            createdAt: b.mentorFeedback.createdAt.toISOString(),
          }
        : undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET Mentor Bookings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
