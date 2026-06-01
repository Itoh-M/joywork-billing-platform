export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function UnitPricesPage() {
  const rows = await prisma.unitPrice.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" } });
  return <main><h1 className="text-xl font-bold">Unit Prices</h1><Link href="/unit-prices/new" className="underline">新規作成</Link><table className="mt-3 w-full"><tbody>{rows.map(r=><tr key={r.id}><td>{r.customer.name}</td><td>{r.itemName}</td><td>{r.unitPrice}</td><td>{r.effectiveFrom}</td><td><Link className="underline" href={`/unit-prices/${r.id}/edit`}>編集</Link></td></tr>)}</tbody></table></main>;
}


