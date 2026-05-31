import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { role, email, password } = await request.json();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Admin Login Check (explicit role === "admin")
    if (role === "admin") {
      const adminUser = await prisma.admin.findUnique({
        where: { email: cleanEmail },
      });

      if (adminUser) {
        const match = await bcrypt.compare(password, adminUser.passwordHash);
        if (match) {
          await setSessionCookie({
            email: adminUser.email,
            role: "admin",
            name: adminUser.name,
          });
          return NextResponse.json({
            success: true,
            email: adminUser.email,
            role: "admin",
            name: adminUser.name,
          });
        }
      }
      return NextResponse.json(
        { error: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    // 2. Student Login Check
    if (role === "student") {
      const studentUser = await prisma.student.findUnique({
        where: { email: cleanEmail },
      });

      if (studentUser) {
        const match = await bcrypt.compare(password, studentUser.passwordHash);
        if (match) {
          if (!studentUser.emailVerified) {
            return NextResponse.json(
              { error: "Please verify your email address before signing in. A verification link was sent to your registered email." },
              { status: 403 }
            );
          }
          await setSessionCookie({
            email: studentUser.email,
            role: "student",
            name: studentUser.name,
          });
          return NextResponse.json({
            success: true,
            email: studentUser.email,
            role: "student",
            name: studentUser.name,
          });
        }
      }

      // Fallback to Admin for backwards compatibility if role sent was student but user is Admin
      const adminUser = await prisma.admin.findUnique({
        where: { email: cleanEmail },
      });

      if (adminUser) {
        const match = await bcrypt.compare(password, adminUser.passwordHash);
        if (match) {
          await setSessionCookie({
            email: adminUser.email,
            role: "admin",
            name: adminUser.name,
          });
          return NextResponse.json({
            success: true,
            email: adminUser.email,
            role: "admin",
            name: adminUser.name,
          });
        }
      }

      return NextResponse.json(
        { error: "Invalid student credentials." },
        { status: 401 }
      );
    }

    // 3. Mentor Login Check
    if (role === "mentor") {
      const mentorUser = await prisma.mentor.findUnique({
        where: { email: cleanEmail },
      });

      if (!mentorUser) {
        return NextResponse.json(
          { error: "Invalid mentor credentials." },
          { status: 401 }
        );
      }

      if (!mentorUser.approved) {
        return NextResponse.json(
          { error: "Your account application is pending admin approval." },
          { status: 403 }
        );
      }

      const match = await bcrypt.compare(password, mentorUser.passwordHash);
      if (!match) {
        return NextResponse.json(
          { error: "Invalid mentor credentials." },
          { status: 401 }
        );
      }

      await setSessionCookie({
        email: mentorUser.email,
        role: "mentor",
        name: mentorUser.name,
      });

      return NextResponse.json({
        success: true,
        email: mentorUser.email,
        role: "mentor",
        name: mentorUser.name,
      });
    }

    return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
