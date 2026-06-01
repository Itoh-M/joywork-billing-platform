import { PDFDocument, StandardFonts } from "pdf-lib";

export async function createInvoicePdf(input: { invoiceNumber: string; billingMonth: string; customerName: string; items: Array<{ description: string; quantity: number; unitPrice: number; amount: number }>; subtotal: number; taxAmount: number; totalAmount: number; }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = 800;
  const draw = (t: string) => { page.drawText(t, { x: 40, y, size: 11, font }); y -= 18; };
  draw(`Invoice: ${input.invoiceNumber}`);
  draw(`Billing Month: ${input.billingMonth}`);
  draw(`Customer: ${input.customerName}`);
  y -= 10;
  draw("Description / Qty / Unit Price / Amount");
  input.items.forEach((it) => draw(`${it.description} / ${it.quantity} / ${it.unitPrice} / ${it.amount}`));
  y -= 10;
  draw(`Subtotal: ${input.subtotal}`);
  draw(`Tax(10%): ${input.taxAmount}`);
  draw(`Total: ${input.totalAmount}`);
  return pdfDoc.save();
}

