import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.unitPrice.findUnique({ where: { id }, include: { customer: true } });
  if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { itemName, unitPrice, effectiveFrom, customerId } = await req.json();
  const current = await prisma.unitPrice.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(await prisma.unitPrice.create({ data: { itemName, unitPrice, effectiveFrom, customerId } }));
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.unitPrice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

