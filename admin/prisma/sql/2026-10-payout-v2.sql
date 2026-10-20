-- Payout structure v2 (see src/lib/split.ts). Adds fields only; nothing is dropped.
-- Existing bookings stay on the old 50/50 split (payoutVersion = 1), except Jutes,
-- the first booking on the new structure. New bookings are created as version 2 by the app.

ALTER TABLE "Booking"
  ADD COLUMN "payoutVersion"     INTEGER          NOT NULL DEFAULT 1,
  ADD COLUMN "adminBy"           TEXT             NOT NULL DEFAULT 'both',
  ADD COLUMN "dropoffBy"         TEXT,
  ADD COLUMN "pickupBy"          TEXT,
  ADD COLUMN "minimumAdjustment" DOUBLE PRECISION NOT NULL DEFAULT 0;

ALTER TABLE "SubRental"
  ADD COLUMN "clientPrice" DOUBLE PRECISION;

-- Jutes (Art Barkley, Inc.), Jan 30 – Feb 16 2027: all admin roles were Marko's
UPDATE "Booking"
SET "payoutVersion" = 2, "adminBy" = 'marko'
WHERE id = 'cmvb9mn2q0001l5040n23kyad';
