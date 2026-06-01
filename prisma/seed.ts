import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.customer.upsert({
    where: { id: "seed-customer-1" },
    update: {},
    create: {
      id: "seed-customer-1",
      name: "JoyWork Sample Co.",
      billingName: "JoyWork Sample Co. 経理部",
      address: "Tokyo",
      email: "billing@example.com",
    },
  });

  await prisma.unitPrice.create({
    data: { customerId: customer.id, itemName: "開発工数", unitPrice: 100000, effectiveFrom: "202606" },
  });
}

main().finally(async () => prisma.$disconnect());

