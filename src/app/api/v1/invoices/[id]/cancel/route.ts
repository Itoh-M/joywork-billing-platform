import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) return NextResponse.json({ message: "Not found" }, { status: 404 });
  if (invoice.status === "CANCELED") {
    return NextResponse.json({ message: "Invoice is already canceled" }, { status: 409 });
  }

  const updated = await prisma.invoice.update({
    where: { id },
    data: { status: "CANCELED", issuedAt: null },
  });
  return NextResponse.json(updated);
}
