import { z } from "zod";

const yyyymm = /^\d{6}$/;

export const customerSchema = z.object({
  name: z.string().min(1),
  billingName: z.string().min(1),
  address: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
});

export const unitPriceSchema = z.object({
  customerId: z.string().min(1),
  itemName: z.string().min(1),
  unitPrice: z.number().int().nonnegative(),
  effectiveFrom: z.string().regex(yyyymm, "effectiveFrom must be YYYYMM"),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().nonnegative(),
  billingSourceId: z.string().optional(),
  unitPriceId: z.string().optional(),
});

export const invoiceSchema = z.object({
  customerId: z.string().min(1),
  billingMonth: z.string().regex(yyyymm, "billingMonth must be YYYYMM"),
  items: z.array(invoiceItemSchema).min(1),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type UnitPriceInput = z.infer<typeof unitPriceSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;

export function badRequest(message: string) {
  return new Response(JSON.stringify({ message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
