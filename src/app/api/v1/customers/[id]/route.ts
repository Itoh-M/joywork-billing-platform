import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, customerSchema } from "@/lib/validators";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.customer.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = customerSchema.safeParse(await req.json());
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid input");
  return NextResponse.json(await prisma.customer.update({ where: { id }, data: parsed.data }));
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.customer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
