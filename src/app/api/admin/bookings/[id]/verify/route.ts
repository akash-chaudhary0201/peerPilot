import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export async function POST(
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

    if (!isAdmin.canVerifyPayments) {
      return NextResponse.json({ error: "Access Denied. You do not have permission to verify payment details." }, { status: 403 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        student: true,
        mentor: true,
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        paymentVerified: true,
      },
    });

    // Add activity log for student
    await prisma.activity.create({
      data: {
        text: `Payment verified by admin for session with ${booking.mentor.name}`,
        time: "Just Now",
        type: "booking",
        studentId: booking.studentId,
      },
    });

    // Derive base URL dynamically from request URL
    const requestUrl = new URL(request.url);

    // 1. Send verification email via SMTP Nodemailer to the Student
    await sendEmail({
      to: booking.student.email,
      subject: "PeerPilot - Payment Verified Successfully!",
      html: `
        <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 15px;">Payment Verified Successfully!</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            Hello ${booking.student.name},
          </p>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            We are pleased to inform you that your payment details for the mock interview booking have been verified and approved by the admin.
          </p>
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #f1f5f9;">
            <h3 style="margin-top: 0; margin-bottom: 10px; color: #1e293b; font-size: 15px;">Transaction Details</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse; color: #475569;">
              <tr>
                <td style="padding: 4px 0; font-weight: bold; width: 120px;">Mentor:</td>
                <td style="padding: 4px 0;">${booking.mentor.name}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Topic:</td>
                <td style="padding: 4px 0;">${booking.sessionType}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Date & Time:</td>
                <td style="padding: 4px 0;">${booking.date} at ${booking.timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Amount Paid:</td>
                <td style="padding: 4px 0;">₹${booking.pricePaid}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Transaction ID:</td>
                <td style="padding: 4px 0; font-family: monospace; font-size: 13px;">${booking.transactionId || "N/A"}</td>
              </tr>
            </table>
          </div>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            You can access your portal dashboard to join the session or review feedback once the interview is completed.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${requestUrl.origin}/login" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15);">
              Go to Dashboard
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 10px; text-align: center;">
            If you have any questions regarding your transaction, please reply to this email to contact support.
          </p>
        </div>
      `,
    });

    // 2. Send verification email via SMTP Nodemailer to the Mentor
    await sendEmail({
      to: booking.mentor.email,
      subject: "PeerPilot - Student Payment Verified!",
      html: `
        <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 15px;">Student Payment Verified</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            Hello ${booking.mentor.name},
          </p>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            We want to inform you that the payment for the student booking with <strong>${booking.student.name}</strong> has been successfully verified and confirmed by our administrator.
          </p>
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #f1f5f9;">
            <h3 style="margin-top: 0; margin-bottom: 10px; color: #1e293b; font-size: 15px;">Session Details</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse; color: #475569;">
              <tr>
                <td style="padding: 4px 0; font-weight: bold; width: 120px;">Student:</td>
                <td style="padding: 4px 0;">${booking.student.name}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Topic:</td>
                <td style="padding: 4px 0;">${booking.sessionType}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Date & Time:</td>
                <td style="padding: 4px 0;">${booking.date} at ${booking.timeSlot}</td>
              </tr>
            </table>
          </div>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            Please be ready to join the mock session at the scheduled time from your mentor dashboard portal.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${requestUrl.origin}/login" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15);">
              Go to Mentor Portal
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 10px; text-align: center;">
            If you need to reschedule or have questions, please reach out via your portal dashboard.
          </p>
        </div>
      `,
    });

    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    console.error("POST Booking Verify Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
