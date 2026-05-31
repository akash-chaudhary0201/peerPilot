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

    const student = await prisma.student.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id, studentId: student.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found or not owned by student." }, { status: 404 });
    }

    if (booking.status !== "Completed") {
      return NextResponse.json({ error: "Cannot submit feedback for a session that is not completed." }, { status: 400 });
    }

    const body = await request.json();
    const { rating, comments } = body;

    const ratingVal = parseInt(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ error: "Invalid rating value. Must be an integer between 1 and 5." }, { status: 400 });
    }

    // Create or update student feedback for mentor
    const mentorFeedback = await prisma.mentorFeedback.upsert({
      where: { bookingId: id },
      update: {
        rating: ratingVal,
        comments: comments || null,
      },
      create: {
        bookingId: id,
        rating: ratingVal,
        comments: comments || null,
      },
    });

    // Recalculate average rating for the mentor
    const result = await prisma.mentorFeedback.aggregate({
      where: {
        booking: {
          mentorId: booking.mentorId,
        },
      },
      _avg: {
        rating: true,
      },
    });

    const newRating = result._avg.rating || 5.0;

    await prisma.mentor.update({
      where: { id: booking.mentorId },
      data: {
        rating: parseFloat(newRating.toFixed(2)),
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        text: `Submitted rating of ${ratingVal}★ for mentor session on ${booking.sessionType}`,
        time: "Just Now",
        type: "booking",
        studentId: student.id,
      },
    });

    return NextResponse.json({
      success: true,
      mentorFeedback,
      newRating: parseFloat(newRating.toFixed(2)),
    });
  } catch (error: any) {
    console.error("Student-to-Mentor Feedback API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
