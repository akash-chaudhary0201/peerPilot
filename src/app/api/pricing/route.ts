import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.pricingPlan.findMany({
      orderBy: { price: "asc" }
    });
    return NextResponse.json(plans);
  } catch (error: any) {
    console.error("GET /api/pricing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
