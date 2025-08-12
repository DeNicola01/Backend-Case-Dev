/*
  Warnings:

  - Changed the type of `type` on the `Movement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."MovementType" AS ENUM ('positive', 'negative');

-- AlterTable
ALTER TABLE "public"."Movement" DROP COLUMN "type",
ADD COLUMN     "type" "public"."MovementType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Planning" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
