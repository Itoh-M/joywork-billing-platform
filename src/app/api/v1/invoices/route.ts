import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildInvoiceNumber, calcItemAmount, calcTotals } from "@/lib/billing";

async function nextSeq(billingMonth: string) {
  const count = await prisma.invoice.count({ where: { billingMonth } });
  return count + 1;
}

export async function GET() {
  return NextResponse.json(await prisma.invoice.findMany({ include: { customer: true, items: true }, orderBy: { createdAt: "desc" } }));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const billingMonth: string = body.billingMonth;
  const seq = await nextSeq(billingMonth);
  const invoiceNumber = buildInvoiceNumber(billingMonth, seq);
  const items = (body.items ?? []).map((it: any) => ({ ...it, amount: calcItemAmount(Number(it.quantity), Number(it.unitPrice)) }));
  const subtotal = items.reduce((s: number, it: any) => s + it.amount, 0);
  const { taxAmount, totalAmount } = calcTotals(subtotal);

  const created = await prisma.invoice.create({
    data: {
      customerId: body.customerId,
      billingMonth,
      invoiceNumber,
      subtotal,
      taxAmount,
      totalAmount,
      items: {
        create: items.map((it: any) => ({
          description: it.description,
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
          amount: it.amount,
          billingSourceId: it.billingSourceId || null,
          unitPriceId: it.unitPriceId || null,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(created, { status: 201 });
}

