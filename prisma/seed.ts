import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Criar Customer
  const customer = await prisma.customer.create({
    data: {
      name: "Gabriel",
      email: "gabr7@hotmail.com",
      age: 23,
      isActive: true,
      familyProfile: "single",
    },
  });

  console.log('Customer criado:', customer);

  // 2. Criar Planning com customerId
  const planning = await prisma.planning.create({
    data: {
      customerId: customer.id,
      goalName: "aposentar",
      goalType: "retirement",
      targetValue: 100000,
      targetDate: new Date("2025-08-13T10:23:19.927Z"),
      portfolioJson: {},
      totalAssets: 20000,
      plannedAssets: 10000,
    },
  });

  console.log('Planning criado:', planning);

  // 3. Criar Movement com customerId e planningId
  const movement = await prisma.movement.create({
    data: {
      planningId: planning.id,
      customerId: customer.id,
      type: "positive",
      value: 10000,
      frequency: "one_time",
      date: new Date("2025-08-13T10:24:20.911Z"),
    },
  });

  console.log('Movement criado:', movement);

  // 4. Criar Insurance com customerId
  const insurance = await prisma.insurance.create({
    data: {
      customerId: customer.id,
      type: "vida",
      value: 1000,
      startDate: new Date("2025-08-13T10:25:23.044Z"),
      endDate: new Date("2025-08-13T10:25:23.044Z"),
    },
  });

  console.log('Insurance criado:', insurance);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
