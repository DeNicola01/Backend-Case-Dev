/*
  Warnings:

  - The values [UNICA,MENSAL,ANUAL] on the enum `Frequency` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `date` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planningId` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `frequency` on the `Movement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Frequency_new" AS ENUM ('one_time', 'monthly', 'yearly');
ALTER TABLE "public"."Movement" ALTER COLUMN "frequency" TYPE "public"."Frequency_new" USING ("frequency"::text::"public"."Frequency_new");
ALTER TYPE "public"."Frequency" RENAME TO "Frequency_old";
ALTER TYPE "public"."Frequency_new" RENAME TO "Frequency";
DROP TYPE "public"."Frequency_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Movement" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "planningId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "frequency",
ADD COLUMN     "frequency" "public"."Frequency" NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Movement" ADD CONSTRAINT "Movement_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "public"."Planning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
