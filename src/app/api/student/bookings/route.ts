import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { studentId: student.id },
      include: {
        mentor: {
          select: {
            name: true,
          },
        },
        feedback: true,
        mentorFeedback: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Format output to match existing UI TS structures
    const formatted = bookings.map((b) => ({
      id: b.id,
      studentName: student.name,
      studentEmail: student.email,
      mentorId: b.mentorId,
      mentorName: b.mentor.name,
      sessionType: b.sessionType,
      date: b.date,
      timeSlot: b.timeSlot,
      status: b.status,
      notes: b.notes,
      meetingLink: b.meetingLink,
      priceTier: b.priceTier,
      pricePaid: b.pricePaid,
      paymentDate: b.paymentDate,
      transactionId: b.transactionId,
      paymentVerified: b.paymentVerified,
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
    console.error("GET Student Bookings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const body = await request.json();
    const { mentorId, sessionType, date, timeSlot, notes, priceTier, pricePaid } = body;

    if (!mentorId || !sessionType || !date || !timeSlot) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Verify mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
    });

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found." }, { status: 404 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        studentId: student.id,
        mentorId: mentor.id,
        sessionType,
        date,
        timeSlot,
        status: "Pending",
        notes,
        priceTier,
        pricePaid: pricePaid ? parseInt(pricePaid.toString()) : null,
        paymentVerified: false,
      },
    });

    // Add activity log
    await prisma.activity.create({
      data: {
        text: `Booked ${sessionType} mock with ${mentor.name}`,
        time: "Just Now",
        type: "booking",
        studentId: student.id,
      },
    });

    return NextResponse.json(newBooking);
  } catch (error: any) {
    console.error("POST Student Booking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
