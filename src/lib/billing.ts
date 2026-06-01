export const TAX_RATE = 0.1;

export function calcItemAmount(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

export function calcTotals(subtotal: number): { taxAmount: number; totalAmount: number } {
  const taxAmount = Math.floor(subtotal * TAX_RATE);
  return { taxAmount, totalAmount: subtotal + taxAmount };
}

export function buildInvoiceNumber(billingMonth: string, seq: number): string {
  return `JW-${billingMonth}-${String(seq).padStart(3, "0")}`;
}

