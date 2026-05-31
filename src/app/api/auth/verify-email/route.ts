import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email || new URL(request.url).searchParams.get("email");
    const otp = body.otp || body.token || new URL(request.url).searchParams.get("token") || new URL(request.url).searchParams.get("otp");
    const action = body.action || new URL(request.url).searchParams.get("action");

    if (action === "resend") {
      if (!email) {
        return NextResponse.json({ error: "Email is required to resend OTP." }, { status: 400 });
      }

      const student = await prisma.student.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (!student) {
        return NextResponse.json({ error: "Student not found." }, { status: 404 });
      }

      // Generate a new 6-digit OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

      await prisma.student.update({
        where: { id: student.id },
        data: {
          verificationToken: newOtp,
        },
      });

      // Send the OTP via email
      await sendEmail({
        to: student.email,
        subject: "PeerPilott - Your Verification OTP",
        html: `
          <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 15px;">Email Verification OTP</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
              Your new email verification OTP code is:
            </p>
            <div style="font-size: 24px; font-weight: bold; color: #4f46e5; letter-spacing: 4px; text-align: center; margin: 20px 0; background-color: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
              ${newOtp}
            </div>
            <p style="color: #ef4444; font-weight: bold; font-size: 13px;">
              Note: If you do not see the email in your inbox, please check your **SPAM** folder.
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 10px; text-align: center;">
              This code was requested for email verification on PeerPilott.
            </p>
          </div>
        `,
      });

      return NextResponse.json({ success: true, message: "OTP resent successfully." });
    }

    if (!otp) {
      return NextResponse.json({ error: "Verification OTP/token is required." }, { status: 400 });
    }

    // Find student with matching token
    const student = email
      ? await prisma.student.findFirst({
          where: { email: email.trim().toLowerCase(), verificationToken: otp },
        })
      : await prisma.student.findFirst({
          where: { verificationToken: otp },
        });

    if (!student) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }

    // Update verified status and clear verification token
    await prisma.student.update({
      where: { id: student.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    return NextResponse.json({ success: true, message: "Email verified successfully." });
  } catch (error: any) {
    console.error("Verify Email API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
