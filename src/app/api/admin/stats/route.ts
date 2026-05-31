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

    const studentsCount = await prisma.student.count();
    const mentorsCount = await prisma.mentor.count({ where: { approved: true } });
    const pendingMentorsCount = await prisma.mentor.count({ where: { approved: false } });
    const bookingsCount = await prisma.booking.count();
    const completedSessionsCount = await prisma.booking.count({ where: { status: "Completed" } });
    const pendingBookingsCount = await prisma.booking.count({ where: { status: "Pending" } });
    const approvedBookingsCount = await prisma.booking.count({ where: { status: "Approved" } });

    // Earnings check (Sum of verified payment amount)
    const verifiedBookings = await prisma.booking.findMany({
      where: { paymentVerified: true },
      select: { pricePaid: true }
    });
    const totalEarnings = verifiedBookings.reduce((sum, b) => sum + (b.pricePaid || 0), 0);

    return NextResponse.json({
      studentsCount,
      mentorsCount,
      pendingMentorsCount,
      bookingsCount,
      completedSessionsCount,
      pendingBookingsCount,
      approvedBookingsCount,
      totalEarnings,
    });
  } catch (error: any) {
    console.error("GET Admin Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
