import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Missing email parameter." }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("GET Student Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Missing email parameter." }, { status: 401 });
    }

    const body = await request.json();
    const cleanEmail = email.trim().toLowerCase();

    const student = await prisma.student.findUnique({
      where: { email: cleanEmail },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    // Exclude security fields
    const { id, passwordHash, email: bodyEmail, createdAt, updatedAt, ...updateData } = body;

    const updatedStudent = await prisma.student.update({
      where: { id: student.id },
      data: updateData,
    });

    // Add activity log entry
    await prisma.activity.create({
      data: {
        text: "Updated professional profile parameters",
        time: "Just Now",
        type: "profile",
        studentId: student.id,
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error: any) {
    console.error("PUT Student Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
