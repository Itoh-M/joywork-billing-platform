import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, customerSchema } from "@/lib/validators";

export async function GET() {
  return NextResponse.json(await prisma.customer.findMany({ orderBy: { createdAt: "desc" } }));
}

export async function POST(req: NextRequest) {
  const parsed = customerSchema.safeParse(await req.json());
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid input");
  const created = await prisma.customer.create({ data: parsed.data });
  return NextResponse.json(created, { status: 201 });
}
