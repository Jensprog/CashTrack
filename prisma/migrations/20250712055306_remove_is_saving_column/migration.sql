/*
  Warnings:

  - You are about to drop the column `isSaving` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `savingsAccountId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_savingsAccountId_fkey`;

-- DropIndex
DROP INDEX `Transaction_savingsAccountId_fkey` ON `Transaction`;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `isSaving`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `savingsAccountId`;

-- CreateTable
CREATE TABLE `Transfer` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `description` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `type` ENUM('TO_SAVINGS', 'FROM_SAVINGS') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `savingsAccountId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_savingsAccountId_fkey` FOREIGN KEY (`savingsAccountId`) REFERENCES `SavingsAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
