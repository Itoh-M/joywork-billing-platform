import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcItemAmount, calcTotals } from "@/lib/billing";
import { badRequest, invoiceSchema } from "@/lib/validators";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await prisma.invoice.findUnique({ where: { id }, include: { customer: true, items: true } });
  if (!data) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const current = await prisma.invoice.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ message: "Not found" }, { status: 404 });
  if (current.status !== "DRAFT") {
    return NextResponse.json({ message: "Only DRAFT invoices can be updated" }, { status: 409 });
  }

  const body = await req.json();
  const rawItems = Array.isArray(body.items) ? body.items : [];
  const parsed = invoiceSchema.safeParse({
    ...body,
    items: rawItems.map((it: unknown) => {
      const obj = it as Record<string, unknown>;
      return { ...obj, quantity: Number(obj.quantity), unitPrice: Number(obj.unitPrice) };
    }),
  });
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid input");

  const items = parsed.data.items.map((it) => ({ ...it, amount: calcItemAmount(it.quantity, it.unitPrice) }));
  const subtotal = items.reduce((s, it) => s + it.amount, 0);
  const { taxAmount, totalAmount } = calcTotals(subtotal);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
    return tx.invoice.update({
      where: { id },
      data: {
        customerId: parsed.data.customerId,
        billingMonth: parsed.data.billingMonth,
        subtotal,
        taxAmount,
        totalAmount,
        items: {
          create: items.map((it) => ({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice, amount: it.amount })),
        },
      },
      include: { items: true },
    });
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
