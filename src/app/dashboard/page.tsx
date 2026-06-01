import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">JoyWork Billing Dashboard</h1>
      <ul className="list-disc pl-5">
        <li><Link href="/customers">顧客管理</Link></li>
        <li><Link href="/unit-prices">単価管理</Link></li>
        <li><Link href="/invoices">請求書管理</Link></li>
      </ul>
    </main>
  );
}

