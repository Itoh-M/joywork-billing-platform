import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createInvoicePdf } from "@/lib/pdf";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await prisma.invoice.findUnique({ where: { id }, include: { customer: true, items: true } });
  if (!inv) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const bytes = await createInvoicePdf({
    invoiceNumber: inv.invoiceNumber,
    billingMonth: inv.billingMonth,
    customerName: inv.customer.name,
    items: inv.items,
    subtotal: inv.subtotal,
    taxAmount: inv.taxAmount,
    totalAmount: inv.totalAmount,
  });
  return new NextResponse(Buffer.from(bytes), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename=${inv.invoiceNumber}.pdf` } });
}

