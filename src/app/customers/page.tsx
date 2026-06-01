export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const rows = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
  return <main><h1 className="text-xl font-bold">Customers</h1><Link href="/customers/new" className="underline">新規作成</Link><table className="mt-3 w-full"><tbody>{rows.map(r=><tr key={r.id}><td>{r.name}</td><td>{r.billingName}</td><td><Link className="underline" href={`/customers/${r.id}/edit`}>編集</Link></td></tr>)}</tbody></table></main>;
}


