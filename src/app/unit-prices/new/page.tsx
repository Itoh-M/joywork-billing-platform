export const dynamic = 'force-dynamic';
import { UnitPriceForm } from "@/components/UnitPriceForm";
import { prisma } from "@/lib/prisma";
export default async function NewUnitPricePage(){ const customers = await prisma.customer.findMany(); return <main><h1 className="text-xl font-bold">New Unit Price</h1><UnitPriceForm customers={customers} /></main>; }


