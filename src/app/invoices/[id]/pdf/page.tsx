export default async function InvoicePdfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main><h1 className="text-xl font-bold">Invoice PDF</h1><a className="underline" href={`/api/v1/invoices/${id}/pdf`}>PDFをダウンロード</a></main>;
}

