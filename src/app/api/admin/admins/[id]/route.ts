import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

// PUT: Update an administrator's profile and permissions
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      roleName,
      password,
      canAccessStudents,
      canAccessMentors,
      canVerifyPayments,
      canManagePricing,
      canManageAdmins,
    } = body;

    const existingAdmin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return NextResponse.json({ error: "Admin user not found." }, { status: 404 });
    }

    const updateData: any = {
      name,
      roleName,
      canAccessStudents,
      canAccessMentors,
      canVerifyPayments,
      canManagePricing,
      canManageAdmins,
    };

    if (password && password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedAdmin);
  } catch (error: any) {
    console.error("PUT Update Admin Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove an administrator
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const adminToDelete = await prisma.admin.findUnique({
      where: { id },
    });

    if (!adminToDelete) {
      return NextResponse.json({ error: "Admin user not found." }, { status: 404 });
    }

    if (adminToDelete.id === caller.id) {
      return NextResponse.json({ error: "Action blocked. You cannot delete your own administrator account." }, { status: 400 });
    }

    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Admin user deleted successfully." });
  } catch (error: any) {
    console.error("DELETE Admin Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
