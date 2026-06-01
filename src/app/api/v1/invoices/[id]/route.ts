import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcItemAmount, calcTotals } from "@/lib/billing";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await prisma.invoice.findUnique({ where: { id }, include: { customer: true, items: true } });
  if (!data) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const items = (body.items ?? []).map((it: any) => ({ ...it, amount: calcItemAmount(Number(it.quantity), Number(it.unitPrice)) }));
  const subtotal = items.reduce((s: number, it: any) => s + it.amount, 0);
  const { taxAmount, totalAmount } = calcTotals(subtotal);

  const updated = await prisma.$transaction(async (tx: any) => {
    await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
    return tx.invoice.update({
      where: { id },
      data: {
        customerId: body.customerId,
        billingMonth: body.billingMonth,
        subtotal,
        taxAmount,
        totalAmount,
        items: {
          create: items.map((it: any) => ({ description: it.description, quantity: Number(it.quantity), unitPrice: Number(it.unitPrice), amount: it.amount })),
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

