"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function UnitPriceForm({ customers, initial, id }: { customers: any[]; initial?: any; id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(initial ?? { customerId: customers[0]?.id ?? "", itemName: "", unitPrice: 0, effectiveFrom: "202606" });
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch(id ? `/api/v1/unit-prices/${id}` : "/api/v1/unit-prices", { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, unitPrice: Number(form.unitPrice) }) });
    router.push("/unit-prices"); router.refresh();
  };
  return <form onSubmit={onSubmit} className="space-y-2"><select className="block w-full rounded border p-2" value={form.customerId} onChange={(e)=>setForm({...form,customerId:e.target.value})}>{customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input className="block w-full rounded border p-2" placeholder="itemName" value={form.itemName} onChange={(e)=>setForm({...form,itemName:e.target.value})}/><input className="block w-full rounded border p-2" type="number" placeholder="unitPrice" value={form.unitPrice} onChange={(e)=>setForm({...form,unitPrice:Number(e.target.value)})}/><input className="block w-full rounded border p-2" placeholder="effectiveFrom YYYYMM" value={form.effectiveFrom} onChange={(e)=>setForm({...form,effectiveFrom:e.target.value})}/><button className="rounded bg-blue-600 px-3 py-2 text-white">保存</button></form>;
}

