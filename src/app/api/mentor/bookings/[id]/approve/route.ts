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

    const mentor = await prisma.mentor.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found." }, { status: 404 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id, mentorId: mentor.id },
      include: {
        student: true,
        pricingPlan: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found or not owned by mentor." }, { status: 404 });
    }

    const duration = booking.pricingPlan?.duration || 60; // default to 60 mins if no plan

    // Derive base URL dynamically from request URL to direct student to dashboard and session room
    const requestUrl = new URL(request.url);
    const dashboardLink = `${requestUrl.origin}/login`;
    const sessionLink = `${requestUrl.origin}/session/${booking.id}`;

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: "Approved",
        meetingLink: sessionLink, // Store Jitsi session room url
      },
    });

    // Create activity logs for the student
    await prisma.activity.create({
      data: {
        text: `Mock interview with ${mentor.name} was approved for ${updated.date}`,
        time: "Just Now",
        type: "booking",
        studentId: booking.studentId,
      },
    });

    // Send confirmation email via SMTP Nodemailer to the student
    await sendEmail({
      to: booking.student.email,
      subject: "PeerPilot - Interview Session Confirmed!",
      html: `
        <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 15px;">Interview Confirmed!</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            Hello ${booking.student.name},
          </p>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            Your mock interview booking request has been accepted and approved by <strong>${mentor.name}</strong>.
          </p>
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #f1f5f9;">
            <h3 style="margin-top: 0; margin-bottom: 10px; color: #1e293b; font-size: 15px;">Session Details</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse; color: #475569;">
              <tr>
                <td style="padding: 4px 0; font-weight: bold; width: 100px;">Topic:</td>
                <td style="padding: 4px 0;">${booking.sessionType}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Date:</td>
                <td style="padding: 4px 0;">${booking.date}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Time Slot:</td>
                <td style="padding: 4px 0;">${booking.timeSlot} (Duration: ${duration} mins)</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Mentor:</td>
                <td style="padding: 4px 0;">${mentor.name} (${mentor.role} @ ${mentor.company})</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Session Room:</td>
                <td style="padding: 4px 0;"><a href="${sessionLink}" style="color: #4f46e5; text-decoration: underline; font-weight: bold;" target="_blank" rel="noopener noreferrer">Enter Call Room</a></td>
              </tr>
            </table>
          </div>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            Please log in to your student dashboard to view more details or click below to join the call room directly at the scheduled time.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${sessionLink}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; margin-right: 12px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15);" target="_blank" rel="noopener noreferrer">
              Enter Call Room
            </a>
            <a href="${dashboardLink}" style="background-color: #ffffff; color: #475569; padding: 13px 24px; border-radius: 12px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; border: 1px solid #cbd5e1;">
              Go to Dashboard
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 10px; text-align: center;">
            If you need to reschedule or have any questions, please contact our support team.
          </p>
        </div>
      `,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Approve Booking API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
