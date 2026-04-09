-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "max_bundle_ids" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "plan" "Plan";
