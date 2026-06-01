import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildInvoiceNumber, calcItemAmount, calcTotals } from "@/lib/billing";
import { badRequest, invoiceSchema } from "@/lib/validators";

async function nextSeq(tx: Prisma.TransactionClient, billingMonth: string) {
  const seq = await tx.invoiceSequence.upsert({
    where: { billingMonth },
    create: { billingMonth, currentSeq: 1 },
    update: { currentSeq: { increment: 1 } },
  });
  return seq.currentSeq;
}

export async function GET() {
  return NextResponse.json(await prisma.invoice.findMany({ include: { customer: true, items: true }, orderBy: { createdAt: "desc" } }));
}

export async function POST(req: NextRequest) {
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

  const created = await prisma.$transaction(async (tx) => {
    const seq = await nextSeq(tx, parsed.data.billingMonth);
    const invoiceNumber = buildInvoiceNumber(parsed.data.billingMonth, seq);

    return tx.invoice.create({
      data: {
        customerId: parsed.data.customerId,
        billingMonth: parsed.data.billingMonth,
        invoiceNumber,
        subtotal,
        taxAmount,
        totalAmount,
        items: {
          create: items.map((it) => ({
            description: it.description,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            amount: it.amount,
            billingSourceId: it.billingSourceId || null,
            unitPriceId: it.unitPriceId || null,
          })),
        },
      },
      include: { items: true },
    });
  });

  return NextResponse.json(created, { status: 201 });
}
