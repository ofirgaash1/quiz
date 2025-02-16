-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnglishWord" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,

    CONSTRAINT "EnglishWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserKnownWord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,

    CONSTRAINT "UserKnownWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HebrewWord" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "englishWordId" TEXT,

    CONSTRAINT "HebrewWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SRTFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "episode" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SRTFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EnglishWord_word_key" ON "EnglishWord"("word");

-- CreateIndex
CREATE INDEX "user_word_unique" ON "UserKnownWord"("userId", "wordId");

-- AddForeignKey
ALTER TABLE "UserKnownWord" ADD CONSTRAINT "UserKnownWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserKnownWord" ADD CONSTRAINT "UserKnownWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "EnglishWord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HebrewWord" ADD CONSTRAINT "HebrewWord_englishWordId_fkey" FOREIGN KEY ("englishWordId") REFERENCES "EnglishWord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
