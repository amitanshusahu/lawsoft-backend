/*
  Warnings:

  - You are about to drop the column `courtPractice` on the `lawyers` table. All the data in the column will be lost.
  - You are about to drop the column `stateBarIds` on the `lawyers` table. All the data in the column will be lost.
  - The `education` column on the `lawyers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[licenseNumber]` on the table `lawyers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "CasteCategory" AS ENUM ('GENERAL', 'OBC', 'SC', 'ST', 'EWS', 'OTHER');

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "caste" "CasteCategory",
ADD COLUMN     "casteProofUrl" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'India',
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "income" INTEGER,
ADD COLUMN     "incomeProofUrl" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "lawyers" DROP COLUMN "courtPractice",
DROP COLUMN "stateBarIds",
ADD COLUMN     "barCouncil" TEXT,
ADD COLUMN     "barCouncilProofUrl" TEXT,
ADD COLUMN     "experience" JSONB,
ADD COLUMN     "licenseProofUrl" TEXT,
ADD COLUMN     "organisation" TEXT,
ALTER COLUMN "feePerConsultation" DROP NOT NULL,
DROP COLUMN "education",
ADD COLUMN     "education" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "lawyers_licenseNumber_key" ON "lawyers"("licenseNumber");
