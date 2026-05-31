import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
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

    const activities = await prisma.activity.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Format output structure
    const formatted = activities.map((a) => ({
      id: a.id,
      text: a.text,
      time: a.time,
      type: a.type,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET Student Activities Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const { text, type } = await request.json();

    if (!text || !type) {
      return NextResponse.json({ error: "Text and type are required." }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: {
        text,
        type,
        time: "Just Now",
        studentId: student.id,
      },
    });

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error("POST Student Activities Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
