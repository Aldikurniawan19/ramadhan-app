-- CreateTable
CREATE TABLE "QuranHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "surahNomor" INTEGER NOT NULL,
    "surahNama" TEXT NOT NULL,
    "ayatNomor" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuranHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "QuranHistory_userId_key" ON "QuranHistory"("userId");
