-- Drop columns if they already exist (from partial first run)
ALTER TABLE "users" DROP COLUMN IF EXISTS "document";
ALTER TABLE "users" DROP COLUMN IF EXISTS "phone";
ALTER TABLE "users" DROP COLUMN IF EXISTS "whatsapp";

-- Add new columns with defaults for existing rows
ALTER TABLE "users" ADD COLUMN "document" TEXT NOT NULL DEFAULT '';
ALTER TABLE "users" ADD COLUMN "phone" TEXT NOT NULL DEFAULT '';
ALTER TABLE "users" ADD COLUMN "whatsapp" TEXT NOT NULL DEFAULT '';

-- Fill existing rows with unique placeholder values
UPDATE "users" SET
  "document" = 'PENDENTE-' || "id",
  "phone" = '00000000000',
  "whatsapp" = '00000000000'
WHERE "document" = '';

-- Remove defaults (new rows must provide values)
ALTER TABLE "users" ALTER COLUMN "document" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "phone" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "whatsapp" DROP DEFAULT;

-- Add unique constraint on document
CREATE UNIQUE INDEX "users_document_key" ON "users"("document");
