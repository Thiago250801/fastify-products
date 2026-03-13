-- Add userId column to products
ALTER TABLE "Product"
ADD COLUMN "userId" TEXT;

-- Enforce non-null constraint once existing rows are updated
ALTER TABLE "Product"
ALTER COLUMN "userId" SET NOT NULL;

-- Foreign key to user
ALTER TABLE "Product"
ADD CONSTRAINT "Product_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- Index to speed up lookups
CREATE INDEX "Product_userId_idx" ON "Product"("userId");
