import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const statusMap = { confirm: "CONFIRMED", issue: "ISSUED", cancel: "CANCELED" } as const;

async function setStatus(id: string, key: keyof typeof statusMap) {
  return prisma.invoice.update({ where: { id }, data: { status: statusMap[key], issuedAt: key === "issue" ? new Date() : null } });
}

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(await setStatus(id, "confirm"));
}

