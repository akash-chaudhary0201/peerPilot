import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const booking = await prisma.booking.findFirst({
      where: { id, mentorId: mentor.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found or not owned by mentor." }, { status: 404 });
    }

    const body = await request.json();
    const { dsaScore, systemDesignScore, communicationScore, comments } = body;

    if (!dsaScore || !communicationScore || !comments) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Update booking status to Completed
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: "Completed",
      },
    });

    // Create feedback
    const feedback = await prisma.feedback.upsert({
      where: { bookingId: id },
      update: {
        dsaScore,
        systemDesignScore: systemDesignScore || "N/A",
        communicationScore,
        comments,
        submittedAt: new Date(),
      },
      create: {
        bookingId: id,
        dsaScore,
        systemDesignScore: systemDesignScore || "N/A",
        communicationScore,
        comments,
      },
    });

    // Increment mentor's completedSessions count
    await prisma.mentor.update({
      where: { id: mentor.id },
      data: {
        completedSessions: {
          increment: 1,
        },
      },
    });

    // Create activity logs for the student
    await prisma.activity.create({
      data: {
        text: `Mock evaluation feedback submitted by ${mentor.name} for ${updatedBooking.sessionType}`,
        time: "Just Now",
        type: "resume",
        studentId: booking.studentId,
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      feedback,
    });
  } catch (error: any) {
    console.error("Submit Feedback API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
