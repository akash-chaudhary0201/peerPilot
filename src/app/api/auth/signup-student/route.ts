import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, password, college, degree, gradYear, targetRole, targetCompanies, projects } = data;

    if (!name || !email || !password || !college || !degree || !targetRole) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists in any table
    const existingStudent = await prisma.student.findUnique({ where: { email: cleanEmail } });
    const existingMentor = await prisma.mentor.findUnique({ where: { email: cleanEmail } });
    const existingAdmin = await prisma.admin.findUnique({ where: { email: cleanEmail } });

    if (existingStudent || existingMentor || existingAdmin) {
      return NextResponse.json({ error: "A user with this email address already exists." }, { status: 400 });
    }

    // Generate Custom STU ID
    const studentCount = await prisma.student.count();
    const idNumber = `STU-${10002 + studentCount}`;

    const passwordHash = await bcrypt.hash(password, 10);
    // Generate a 6-digit numeric OTP code
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    const projectsArray = projects || [];
    const p1 = projectsArray[0] || {};
    const p2 = projectsArray[1] || {};

    const newStudent = await prisma.student.create({
      data: {
        idNumber,
        name,
        email: cleanEmail,
        passwordHash,
        college,
        degree,
        gradYear: gradYear || "2026",
        targetRole,
        targetCompanies: targetCompanies || "Google, Meta, Netflix",
        phone: "+91 98765 43210",
        githubUrl: "https://github.com",
        linkedinUrl: "https://linkedin.com",
        portfolioUrl: "https://portfolio.dev",
        gpa: "8.5/10",
        preferredLocation: "Remote / Bengaluru",
        searchStatus: "Actively Looking",
        yoe: "Fresher / New Grad",
        languages: "JavaScript, TypeScript, Python",
        frameworks: "React, Next.js, Node.js",
        project1Title: p1.title || null,
        project1Desc: p1.desc || null,
        project1Tech: p1.tech || null,
        project2Title: p2.title || null,
        project2Desc: p2.desc || null,
        project2Tech: p2.tech || null,
        projects: projectsArray,
        emailVerified: false,
        verificationToken: token,
      },
    });

    // Seed initial activity for the student
    await prisma.activity.create({
      data: {
        text: "Created Student Portal account session",
        time: "Just Now",
        type: "system",
        studentId: newStudent.id,
      },
    });

    // Send verification email via SMTP Nodemailer with 6-digit OTP code
    await sendEmail({
      to: cleanEmail,
      subject: "Verify Your PeerPilott Account",
      html: `
        <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 15px;">Welcome to PeerPilott, ${name}!</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            Thank you for creating an account on PeerPilott. To verify your email address and activate your workspace portal, please enter the following 6-digit OTP code on the verification screen:
          </p>
          <div style="font-size: 24px; font-weight: bold; color: #4f46e5; letter-spacing: 4px; text-align: center; margin: 25px 0; background-color: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
            ${token}
          </div>
          <p style="color: #ef4444; font-weight: bold; font-size: 13px; text-align: center;">
            Note: If you do not see the email in your inbox, please check your **SPAM** folder.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 10px; text-align: center;">
            If you did not request this sign-up, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      email: newStudent.email,
      role: "student",
      name: newStudent.name,
      message: "Verification email sent.",
    });
  } catch (error: any) {
    console.error("Signup Student API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
