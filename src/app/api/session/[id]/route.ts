import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
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

    const booking = await prisma.booking.findUnique({
      where: { id },
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
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    // Authorization check: email must match student or mentor
    const userEmail = email.trim().toLowerCase();
    const studentEmail = booking.student.email.trim().toLowerCase();
    const mentorEmail = booking.mentor.email.trim().toLowerCase();

    if (userEmail !== studentEmail && userEmail !== mentorEmail) {
      return NextResponse.json({ error: "Unauthorized. You are not a participant in this session." }, { status: 403 });
    }

    return NextResponse.json({
      id: booking.id,
      sessionType: booking.sessionType,
      date: booking.date,
      timeSlot: booking.timeSlot,
      status: booking.status,
      notes: booking.notes,
      student: booking.student,
      mentor: booking.mentor,
    });
  } catch (error: any) {
    console.error("GET Session Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
