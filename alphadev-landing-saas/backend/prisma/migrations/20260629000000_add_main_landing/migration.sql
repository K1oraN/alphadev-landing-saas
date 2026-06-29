-- AlterTable
ALTER TABLE "LandingPage" ADD COLUMN "isMain" BOOLEAN NOT NULL DEFAULT false;

-- Mark one existing published landing as the main landing for upgraded databases.
UPDATE "LandingPage"
SET "isMain" = true
WHERE "id" = (
  SELECT "id"
  FROM "LandingPage"
  WHERE "status" = 'PUBLISHED'
  ORDER BY "createdAt" ASC
  LIMIT 1
);

-- Indexes
CREATE INDEX "LandingPage_isMain_idx" ON "LandingPage"("isMain");
CREATE UNIQUE INDEX "LandingPage_single_main_idx" ON "LandingPage"("isMain") WHERE "isMain" = true;
