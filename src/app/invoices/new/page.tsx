export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { InvoiceForm } from "@/components/InvoiceForm";
export default async function NewInvoicePage(){ const customers = await prisma.customer.findMany(); return <main><h1 className="text-xl font-bold">New Invoice</h1><InvoiceForm customers={customers} /></main>; }


