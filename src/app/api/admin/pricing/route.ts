import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
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

    if (!isAdmin.canManagePricing) {
      return NextResponse.json({ error: "Access Denied. You do not have permission to access pricing plans." }, { status: 403 });
    }

    const plans = await prisma.pricingPlan.findMany({
      orderBy: { price: "asc" }
    });

    return NextResponse.json(plans);
  } catch (error: any) {
    console.error("GET /api/admin/pricing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    if (!isAdmin.canManagePricing) {
      return NextResponse.json({ error: "Access Denied. You do not have permission to modify pricing plans." }, { status: 403 });
    }

    const body = await request.json();
    const { name, price, duration, subtitle, tag, perfectFor, features } = body;

    if (!name || price === undefined || duration === undefined) {
      return NextResponse.json({ error: "Missing required fields: name, price, duration." }, { status: 400 });
    }

    const newPlan = await prisma.pricingPlan.create({
      data: {
        name: name.trim(),
        price: parseInt(price.toString()),
        duration: parseInt(duration.toString()),
        subtitle: subtitle ? subtitle.trim() : null,
        tag: tag ? tag.trim() : null,
        perfectFor: perfectFor || [],
        features: features || [],
      }
    });

    return NextResponse.json(newPlan);
  } catch (error: any) {
    console.error("POST /api/admin/pricing error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A plan with this name already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
