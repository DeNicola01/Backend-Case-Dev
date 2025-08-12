-- CreateEnum
CREATE TYPE "public"."GoalType" AS ENUM ('retirement', 'short_term', 'medium_term');

-- AlterTable
ALTER TABLE "public"."Customer" ALTER COLUMN "isActive" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."Planning" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "goalType" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "portfolioJson" JSONB NOT NULL,
    "totalAssets" DOUBLE PRECISION NOT NULL,
    "plannedAssets" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Planning_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Planning" ADD CONSTRAINT "Planning_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
