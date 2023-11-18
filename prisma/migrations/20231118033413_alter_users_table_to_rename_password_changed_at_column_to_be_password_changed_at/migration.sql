/*
  Warnings:

  - You are about to drop the column `passwordChangedAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordChangedAt",
ADD COLUMN     "password_changed_at" TIMESTAMP(3);
