import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { role, email, phone, newPassword } = await request.json();

    if (!role || !email || !phone || !newPassword) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const passwordHash = await bcrypt.hash(newPassword, 10);

    if (role === "student") {
      const student = await prisma.student.findUnique({
        where: { email: cleanEmail },
      });

      if (!student) {
        return NextResponse.json({ error: "Student email not found." }, { status: 404 });
      }

      // Verify phone matches (removing spaces and special characters for a relaxed check)
      const studentPhoneClean = (student.phone || "").replace(/\s+/g, "").replace(/\+/g, "");
      const inputPhoneClean = cleanPhone.replace(/\s+/g, "").replace(/\+/g, "");

      if (studentPhoneClean !== inputPhoneClean) {
        return NextResponse.json({ error: "Phone number verification failed." }, { status: 400 });
      }

      await prisma.student.update({
        where: { id: student.id },
        data: { passwordHash },
      });

      return NextResponse.json({ success: true, message: "Password reset successful." });
    }

    if (role === "mentor") {
      const mentor = await prisma.mentor.findUnique({
        where: { email: cleanEmail },
      });

      if (!mentor) {
        return NextResponse.json({ error: "Mentor email not found." }, { status: 404 });
      }

      const mentorPhoneClean = (mentor.phone || "").replace(/\s+/g, "").replace(/\+/g, "");
      const inputPhoneClean = cleanPhone.replace(/\s+/g, "").replace(/\+/g, "");

      // For seeded mentors who might not have a phone number yet, allow resetting if they provide "+91 98765 43210" or similar
      if (mentor.phone && mentorPhoneClean !== inputPhoneClean) {
        return NextResponse.json({ error: "Phone number verification failed." }, { status: 400 });
      }

      await prisma.mentor.update({
        where: { id: mentor.id },
        data: { passwordHash },
      });

      return NextResponse.json({ success: true, message: "Password reset successful." });
    }

    return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
  } catch (error: any) {
    console.error("Forgot Password API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
