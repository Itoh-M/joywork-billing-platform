export const dynamic = 'force-dynamic';
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { InvoiceActions } from "@/components/InvoiceActions";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await prisma.invoice.findUniqueOrThrow({ where: { id }, include: { customer: true, items: true } });

  return (
    <main className="space-y-3">
      <h1 className="text-xl font-bold">{inv.invoiceNumber}</h1>
      <p>{inv.customer.name} / {inv.billingMonth} / {inv.status}</p>
      <p>subtotal:{inv.subtotal} tax:{inv.taxAmount} total:{inv.totalAmount}</p>
      <InvoiceActions invoiceId={inv.id} status={inv.status} />
      <table className="w-full"><tbody>{inv.items.map((i) => <tr key={i.id}><td>{i.description}</td><td>{i.quantity}</td><td>{i.unitPrice}</td><td>{i.amount}</td></tr>)}</tbody></table>
      <div className="flex gap-3"><a className="underline" href={`/api/v1/invoices/${inv.id}/pdf`}>PDFダウンロード</a><Link className="underline" href={`/invoices/${inv.id}/pdf`}>PDFページ</Link></div>
    </main>
  );
}
