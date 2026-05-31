import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Missing email." }, { status: 401 });
    }

    const cleanEmail = email.trim().toLowerCase();
    let admin = await prisma.admin.findUnique({
      where: { email: cleanEmail },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found." }, { status: 404 });
    }

    // Auto-upgrade default admin Akash to Super Admin if roleName is default "Admin"
    if (cleanEmail === "akash@gmail.com" && admin.roleName === "Admin") {
      admin = await prisma.admin.update({
        where: { id: admin.id },
        data: {
          roleName: "Super Admin",
          canAccessStudents: true,
          canAccessMentors: true,
          canVerifyPayments: true,
          canManagePricing: true,
          canManageAdmins: true,
        },
      });
    }

    return NextResponse.json(admin);
  } catch (error: any) {
    console.error("GET Admin Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
