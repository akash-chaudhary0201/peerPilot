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

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: "Rejected",
      },
    });

    // Create activity logs for the student
    await prisma.activity.create({
      data: {
        text: `Mock interview request with ${mentor.name} was declined`,
        time: "Just Now",
        type: "booking",
        studentId: booking.studentId,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Reject Booking API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
