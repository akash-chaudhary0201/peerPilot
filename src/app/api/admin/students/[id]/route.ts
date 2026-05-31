import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const isAdmin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    if (!isAdmin.canAccessStudents) {
      return NextResponse.json({ error: "Access Denied. You do not have permission to modify student records." }, { status: 403 });
    }

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Student record deleted." });
  } catch (error: any) {
    console.error("Delete Student API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
