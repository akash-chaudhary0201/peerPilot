import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

// GET: List all administrators
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Missing email." }, { status: 401 });
    }

    const caller = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!caller) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    if (!caller.canManageAdmins) {
      return NextResponse.json({ error: "Access Denied. You do not have permission to manage administrators." }, { status: 403 });
    }

    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(admins);
  } catch (error: any) {
    console.error("GET Admin Listing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new administrator
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Missing email." }, { status: 401 });
    }

    const caller = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!caller) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    if (!caller.canManageAdmins) {
      return NextResponse.json({ error: "Access Denied. You do not have permission to manage administrators." }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      email: newAdminEmail,
      password,
      roleName,
      canAccessStudents,
      canAccessMentors,
      canVerifyPayments,
      canManagePricing,
      canManageAdmins,
    } = body;

    if (!name || !newAdminEmail || !password || !roleName) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const cleanNewEmail = newAdminEmail.trim().toLowerCase();

    // Check if email already exists in any table
    const existingStudent = await prisma.student.findUnique({ where: { email: cleanNewEmail } });
    const existingMentor = await prisma.mentor.findUnique({ where: { email: cleanNewEmail } });
    const existingAdmin = await prisma.admin.findUnique({ where: { email: cleanNewEmail } });

    if (existingStudent || existingMentor || existingAdmin) {
      return NextResponse.json({ error: "A user with this email address already exists." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email: cleanNewEmail,
        passwordHash,
        roleName,
        canAccessStudents: canAccessStudents ?? true,
        canAccessMentors: canAccessMentors ?? true,
        canVerifyPayments: canVerifyPayments ?? true,
        canManagePricing: canManagePricing ?? true,
        canManageAdmins: canManageAdmins ?? true,
      },
    });

    return NextResponse.json(newAdmin);
  } catch (error: any) {
    console.error("POST Create Admin Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
