import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const updatedPlan = await prisma.pricingPlan.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        price: price !== undefined ? parseInt(price.toString()) : undefined,
        duration: duration !== undefined ? parseInt(duration.toString()) : undefined,
        subtitle: subtitle !== undefined ? (subtitle ? subtitle.trim() : null) : undefined,
        tag: tag !== undefined ? (tag ? tag.trim() : null) : undefined,
        perfectFor: perfectFor !== undefined ? perfectFor : undefined,
        features: features !== undefined ? features : undefined,
      }
    });

    return NextResponse.json(updatedPlan);
  } catch (error: any) {
    console.error(`PUT /api/admin/pricing/${id} error:`, error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A plan with this name already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    await prisma.pricingPlan.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`DELETE /api/admin/pricing/${id} error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
