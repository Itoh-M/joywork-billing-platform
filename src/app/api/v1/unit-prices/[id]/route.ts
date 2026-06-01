import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, unitPriceSchema } from "@/lib/validators";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.unitPrice.findUnique({ where: { id }, include: { customer: true } });
  if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const current = await prisma.unitPrice.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = unitPriceSchema.safeParse({ ...body, unitPrice: Number(body.unitPrice) });
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid input");

  return NextResponse.json(await prisma.unitPrice.create({ data: parsed.data }));
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.unitPrice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
