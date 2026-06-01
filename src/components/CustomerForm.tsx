"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function CustomerForm({ initial, id }: { initial?: any; id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(initial ?? { name: "", billingName: "", address: "", email: "" });
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch(id ? `/api/v1/customers/${id}` : "/api/v1/customers", { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    router.push("/customers");
    router.refresh();
  };
  return <form onSubmit={onSubmit} className="space-y-2">{["name","billingName","address","email"].map((k)=><input key={k} className="block w-full rounded border p-2" placeholder={k} value={(form as any)[k]||""} onChange={(e)=>setForm({...form,[k]:e.target.value})} />)}<button className="rounded bg-blue-600 px-3 py-2 text-white">保存</button></form>;
}

