import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
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

    const { availableDays, availableSlots, blockedDates } = await request.json();

    const updated = await prisma.mentor.update({
      where: { id: mentor.id },
      data: {
        availableDays: availableDays || [],
        availableSlots: availableSlots || [],
        blockedDates: blockedDates || [],
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT Mentor Settings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
