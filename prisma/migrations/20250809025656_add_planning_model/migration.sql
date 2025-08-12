/*
  Warnings:

  - Added the required column `goalName` to the `Planning` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `goalType` on the `Planning` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Planning" ADD COLUMN     "goalName" TEXT NOT NULL,
DROP COLUMN "goalType",
ADD COLUMN     "goalType" "public"."GoalType" NOT NULL,
ALTER COLUMN "portfolioJson" DROP NOT NULL;
