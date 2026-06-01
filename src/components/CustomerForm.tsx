"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CustomerInput } from "@/lib/validators";

export function CustomerForm({ initial, id }: { initial?: CustomerInput; id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(initial ?? { name: "", billingName: "", address: "", email: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch(id ? `/api/v1/customers/${id}` : "/api/v1/customers", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: "Failed to save" }));
      setError(body.message ?? "Failed to save");
      setSaving(false);
      return;
    }

    router.push("/customers");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      {["name", "billingName", "address", "email"].map((k) => (
        <input
          key={k}
          className="block w-full rounded border p-2"
          placeholder={k}
          value={form[k as keyof CustomerInput] || ""}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        />
      ))}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={saving} className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-60">{saving ? "保存中..." : "保存"}</button>
    </form>
  );
}
