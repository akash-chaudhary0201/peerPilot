import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const isAdmin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    if (!isAdmin.canAccessStudents && !isAdmin.canAccessMentors && !isAdmin.canVerifyPayments) {
      return NextResponse.json({ error: "Access Denied. You do not have permission to view booking audit records." }, { status: 403 });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        mentor: {
          select: {
            name: true,
          },
        },
        feedback: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = bookings.map((b) => ({
      id: b.id,
      studentName: b.student.name,
      studentEmail: b.student.email,
      mentorId: b.mentorId,
      mentorName: b.mentor.name,
      sessionType: b.sessionType,
      date: b.date,
      timeSlot: b.timeSlot,
      status: b.status,
      notes: b.notes,
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
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET Admin Bookings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
