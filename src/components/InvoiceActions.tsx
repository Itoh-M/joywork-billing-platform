"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function InvoiceActions({ invoiceId, status }: { invoiceId: string; status: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const call = async (action: "confirm" | "issue" | "cancel") => {
    setLoading(action);
    setError("");
    const res = await fetch(`/api/v1/invoices/${invoiceId}/${action}`, { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: "Failed" }));
      setError(body.message ?? "Failed");
      setLoading(null);
      return;
    }
    router.refresh();
    setLoading(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button className="rounded border px-3 py-1" disabled={loading !== null || status !== "DRAFT"} onClick={() => call("confirm")}>確定</button>
        <button className="rounded border px-3 py-1" disabled={loading !== null || status !== "CONFIRMED"} onClick={() => call("issue")}>発行</button>
        <button className="rounded border px-3 py-1" disabled={loading !== null || status === "CANCELED"} onClick={() => call("cancel")}>取消</button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
