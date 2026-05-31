import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const mentors = await prisma.mentor.findMany({
      where: { approved: true },
      orderBy: { name: "asc" },
    });

    // Format output to match existing UI TS models
    const formatted = mentors.map((m) => ({
      id: m.id,
      idNumber: m.idNumber,
      name: m.name,
      email: m.email,
      role: m.role,
      company: m.company,
      specialty: m.specialty,
      bio: m.bio,
      rating: m.rating,
      completedSessions: m.completedSessions,
      experience: m.experience,
      skills: m.skills,
      imageUrl: m.imageUrl || undefined,
      availableDays: m.availableDays,
      availableSlots: m.availableSlots,
      blockedDates: m.blockedDates,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET Mentors Directory Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
