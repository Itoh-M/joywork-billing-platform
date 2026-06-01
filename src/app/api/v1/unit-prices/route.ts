import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, unitPriceSchema } from "@/lib/validators";

export async function GET() {
  return NextResponse.json(await prisma.unitPrice.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" } }));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = unitPriceSchema.safeParse({ ...body, unitPrice: Number(body.unitPrice) });
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid input");
  const created = await prisma.unitPrice.create({ data: parsed.data });
  return NextResponse.json(created, { status: 201 });
}
