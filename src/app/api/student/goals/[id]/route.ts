import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const goal = await prisma.goal.findFirst({
      where: { id, studentId: student.id },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found." }, { status: 404 });
    }

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        completed: !goal.completed,
      },
    });

    // Add activity log
    await prisma.activity.create({
      data: {
        text: `${updated.completed ? "Completed" : "Reopened"} goal: "${goal.text}"`,
        time: "Just Now",
        type: "goal",
        studentId: student.id,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT Goal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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

    const goal = await prisma.goal.findFirst({
      where: { id, studentId: student.id },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found." }, { status: 404 });
    }

    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Goal deleted." });
  } catch (error: any) {
    console.error("DELETE Goal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
