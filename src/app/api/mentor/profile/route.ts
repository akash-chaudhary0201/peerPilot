import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Missing email parameter." }, { status: 401 });
    }

    const mentor = await prisma.mentor.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found." }, { status: 404 });
    }

    return NextResponse.json(mentor);
  } catch (error: any) {
    console.error("GET Mentor Profile Error:", error);
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

    const mentor = await prisma.mentor.findUnique({
      where: { email: cleanEmail },
    });

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found." }, { status: 404 });
    }

    // Exclude security fields and relation parameters
    const { id, idNumber, passwordHash, email: bodyEmail, createdAt, updatedAt, ...updateData } = body;

    const updatedMentor = await prisma.mentor.update({
      where: { id: mentor.id },
      data: updateData,
    });

    return NextResponse.json(updatedMentor);
  } catch (error: any) {
    console.error("PUT Mentor Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
