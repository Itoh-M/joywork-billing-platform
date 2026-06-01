"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { UnitPriceInput } from "@/lib/validators";

type CustomerOption = { id: string; name: string };

function currentYYYYMM() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}${m}`;
}

export function UnitPriceForm({ customers, initial, id }: { customers: CustomerOption[]; initial?: UnitPriceInput; id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(initial ?? { customerId: customers[0]?.id ?? "", itemName: "", unitPrice: 0, effectiveFrom: currentYYYYMM() });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch(id ? `/api/v1/unit-prices/${id}` : "/api/v1/unit-prices", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, unitPrice: Number(form.unitPrice) }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: "Failed to save" }));
      setError(body.message ?? "Failed to save");
      setSaving(false);
      return;
    }

    router.push("/unit-prices");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <select className="block w-full rounded border p-2" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
        {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input className="block w-full rounded border p-2" placeholder="itemName" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} />
      <input className="block w-full rounded border p-2" type="number" placeholder="unitPrice" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })} />
      <input className="block w-full rounded border p-2" placeholder="effectiveFrom YYYYMM" value={form.effectiveFrom} onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={saving} className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-60">{saving ? "保存中..." : "保存"}</button>
    </form>
  );
}
