import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
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
      where: {
        id,
        studentId: student.id,
      },
      include: {
        mentor: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    await prisma.booking.delete({
      where: { id },
    });

    // Add activity log
    await prisma.activity.create({
      data: {
        text: `Cancelled mock with ${booking.mentor.name}`,
        time: "Just Now",
        type: "booking",
        studentId: student.id,
      },
    });

    return NextResponse.json({ success: true, message: "Booking cancelled." });
  } catch (error: any) {
    console.error("DELETE Booking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
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
      where: {
        id,
        studentId: student.id,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const body = await request.json();
    const { paymentDate, transactionId } = body;

    if (!paymentDate || !transactionId) {
      return NextResponse.json({ error: "Payment Date and Transaction ID are required." }, { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        paymentDate,
        transactionId,
        paymentVerified: false, // Reset verification on new submission
      },
    });

    // Add activity log
    await prisma.activity.create({
      data: {
        text: `Submitted payment for session ID: ${id}`,
        time: "Just Now",
        type: "booking",
        studentId: student.id,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    console.error("PUT Booking Payment Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
