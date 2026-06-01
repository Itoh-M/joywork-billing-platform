export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function InvoicesPage() {
  const rows = await prisma.invoice.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" } });
  return <main><h1 className="text-xl font-bold">Invoices</h1><Link href="/invoices/new" className="underline">新規作成</Link><table className="mt-3 w-full"><tbody>{rows.map(r=><tr key={r.id}><td><Link href={`/invoices/${r.id}`} className="underline">{r.invoiceNumber}</Link></td><td>{r.customer.name}</td><td>{r.billingMonth}</td><td>{r.totalAmount}</td><td>{r.status}</td></tr>)}</tbody></table></main>;
}


