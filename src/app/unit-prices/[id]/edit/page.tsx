export const dynamic = 'force-dynamic';
import { UnitPriceForm } from "@/components/UnitPriceForm";
import { prisma } from "@/lib/prisma";
export default async function EditUnitPricePage({ params }: { params: Promise<{ id: string }> }){ const { id }=await params; const customers=await prisma.customer.findMany(); const unitPrice=await prisma.unitPrice.findUniqueOrThrow({where:{id}}); return <main><h1 className="text-xl font-bold">Edit Unit Price</h1><UnitPriceForm customers={customers} initial={unitPrice} id={id} /></main>; }


