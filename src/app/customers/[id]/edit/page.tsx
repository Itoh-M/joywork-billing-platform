export const dynamic = 'force-dynamic';
import { CustomerForm } from "@/components/CustomerForm";
import { prisma } from "@/lib/prisma";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.customer.findUniqueOrThrow({ where: { id } });
  return <main><h1 className="text-xl font-bold">Edit Customer</h1><CustomerForm initial={customer} id={id} /></main>;
}


