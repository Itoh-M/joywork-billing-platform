import test from "node:test";
import assert from "node:assert/strict";
import { buildInvoiceNumber, calcItemAmount, calcTotals } from "@/lib/billing";

test("calcItemAmount: quantity * unitPrice", () => {
  assert.equal(calcItemAmount(3, 1200), 3600);
});

test("calcTotals: tax is floored at 10%", () => {
  const { taxAmount, totalAmount } = calcTotals(12345);
  assert.equal(taxAmount, 1234);
  assert.equal(totalAmount, 13579);
});

test("buildInvoiceNumber: JW-YYYYMM-SEQ", () => {
  assert.equal(buildInvoiceNumber("202606", 1), "JW-202606-001");
  assert.equal(buildInvoiceNumber("202606", 25), "JW-202606-025");
  assert.equal(buildInvoiceNumber("202606", 999), "JW-202606-999");
});
