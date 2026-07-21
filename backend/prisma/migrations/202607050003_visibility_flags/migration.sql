ALTER TABLE "Event" ADD COLUMN "enabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Player" ADD COLUMN "enabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Sponsor" ADD COLUMN "enabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Circuit" ADD COLUMN "enabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Stream" ADD COLUMN "enabled" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "Event_enabled_idx" ON "Event"("enabled");
CREATE INDEX "Player_enabled_idx" ON "Player"("enabled");
CREATE INDEX "Sponsor_enabled_idx" ON "Sponsor"("enabled");
CREATE INDEX "Circuit_enabled_idx" ON "Circuit"("enabled");
CREATE INDEX "Circuit_status_idx" ON "Circuit"("status");
CREATE INDEX "Stream_enabled_idx" ON "Stream"("enabled");
