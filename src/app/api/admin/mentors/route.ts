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

    if (!isAdmin.canAccessMentors) {
      return NextResponse.json({ error: "Access Denied. You do not have permission to access mentor records." }, { status: 403 });
    }

    const mentors = await prisma.mentor.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(mentors);
  } catch (error: any) {
    console.error("GET Admin Mentors Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
