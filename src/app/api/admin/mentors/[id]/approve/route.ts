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

    if (!isAdmin.canAccessMentors) {
      return NextResponse.json({ error: "Access Denied. You do not have permission to modify mentor records." }, { status: 403 });
    }

    const mentor = await prisma.mentor.findUnique({
      where: { id },
    });

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found." }, { status: 404 });
    }

    const updated = await prisma.mentor.update({
      where: { id },
      data: {
        approved: true,
      },
    });

    // Derive base URL dynamically from request URL to direct mentor to login page
    const requestUrl = new URL(request.url);
    const loginLink = `${requestUrl.origin}/login`;

    // Send confirmation email via SMTP Nodemailer
    await sendEmail({
      to: updated.email,
      subject: "PeerPilott Mentor Profile Approved!",
      html: `
        <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 15px;">Congratulations, ${updated.name}!</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            We are thrilled to inform you that your mentor application profile has been reviewed and successfully approved by our administrator!
          </p>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            You can now log in to the mentor portal to configure your availability, customize your profile settings, and start accepting booking requests from eager students.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${loginLink}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15);">
              Log In to Mentor Portal
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 10px; text-align: center;">
            If you have any questions or require help, feel free to reply to this email to reach our support team.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, mentor: updated });
  } catch (error: any) {
    console.error("Approve Mentor API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
