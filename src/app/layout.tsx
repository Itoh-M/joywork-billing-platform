import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl p-6">
          <nav className="mb-6 flex gap-4">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/customers">Customers</Link>
            <Link href="/unit-prices">Unit Prices</Link>
            <Link href="/invoices">Invoices</Link>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}

