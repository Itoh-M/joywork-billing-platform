import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json(await prisma.unitPrice.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" } }));
}

export async function POST(req: NextRequest) {
  const created = await prisma.unitPrice.create({ data: await req.json() });
  return NextResponse.json(created, { status: 201 });
}

