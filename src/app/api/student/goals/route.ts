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

    const goals = await prisma.goal.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(goals);
  } catch (error: any) {
    console.error("GET Goals Error:", error);
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

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Goal text is required." }, { status: 400 });
    }

    const newGoal = await prisma.goal.create({
      data: {
        text,
        completed: false,
        studentId: student.id,
      },
    });

    // Add activity log
    await prisma.activity.create({
      data: {
        text: `Added goal: "${text}"`,
        time: "Just Now",
        type: "goal",
        studentId: student.id,
      },
    });

    return NextResponse.json(newGoal);
  } catch (error: any) {
    console.error("POST Goal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
