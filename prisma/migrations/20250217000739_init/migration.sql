/*
  Warnings:

  - You are about to drop the `EnglishWord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HebrewWord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserKnownWord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HebrewWord" DROP CONSTRAINT "HebrewWord_englishWordId_fkey";

-- DropForeignKey
ALTER TABLE "UserKnownWord" DROP CONSTRAINT "UserKnownWord_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserKnownWord" DROP CONSTRAINT "UserKnownWord_wordId_fkey";

-- DropTable
DROP TABLE "EnglishWord";

-- DropTable
DROP TABLE "HebrewWord";

-- DropTable
DROP TABLE "UserKnownWord";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSRTFile" (
    "userId" TEXT NOT NULL,
    "srtFileId" TEXT NOT NULL,

    CONSTRAINT "UserSRTFile_pkey" PRIMARY KEY ("userId","srtFileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserSRTFile" ADD CONSTRAINT "UserSRTFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSRTFile" ADD CONSTRAINT "UserSRTFile_srtFileId_fkey" FOREIGN KEY ("srtFileId") REFERENCES "SRTFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
