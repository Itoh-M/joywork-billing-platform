"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { InvoiceInput } from "@/lib/validators";

type CustomerOption = { id: string; name: string };

function currentYYYYMM() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}${m}`;
}

export function InvoiceForm({ customers }: { customers: CustomerOption[] }) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [billingMonth, setBillingMonth] = useState(currentYYYYMM());
  const [items, setItems] = useState<InvoiceInput["items"]>([{ description: "", quantity: 1, unitPrice: 0 }]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const add = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/v1/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, billingMonth, items }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: "Failed to create invoice" }));
      setError(body.message ?? "Failed to create invoice");
      setSaving(false);
      return;
    }

    const created = await res.json();
    router.push(`/invoices/${created.id}`);
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <select className="block w-full rounded border p-2" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
        {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input className="block w-full rounded border p-2" value={billingMonth} onChange={(e) => setBillingMonth(e.target.value)} placeholder="YYYYMM" />
      {items.map((it, idx) => (
        <div className="grid grid-cols-3 gap-2" key={idx}>
          <input className="rounded border p-2" placeholder="description" value={it.description} onChange={(e) => { const x = [...items]; x[idx].description = e.target.value; setItems(x); }} />
          <input className="rounded border p-2" type="number" value={it.quantity} onChange={(e) => { const x = [...items]; x[idx].quantity = Number(e.target.value); setItems(x); }} />
          <input className="rounded border p-2" type="number" value={it.unitPrice} onChange={(e) => { const x = [...items]; x[idx].unitPrice = Number(e.target.value); setItems(x); }} />
        </div>
      ))}
      <button type="button" className="rounded border px-3 py-2" onClick={add}>明細追加</button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={saving} className="ml-2 rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-60">{saving ? "作成中..." : "請求書作成"}</button>
    </form>
  );
}
