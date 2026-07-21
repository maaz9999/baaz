ALTER TABLE "PostTemplate" ADD COLUMN "enabled" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "PostTemplate_enabled_idx" ON "PostTemplate"("enabled");

CREATE TABLE "PageContent" (
  "id" TEXT NOT NULL,
  "pageKey" TEXT NOT NULL,
  "sectionKey" TEXT NOT NULL,
  "title" TEXT,
  "eyebrow" TEXT,
  "body" JSONB,
  "imageId" TEXT,
  "cta" JSONB,
  "variant" TEXT NOT NULL DEFAULT 'default',
  "order" INTEGER NOT NULL DEFAULT 0,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "visibleFrom" TIMESTAMP(3),
  "visibleUntil" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PageContent_pageKey_sectionKey_idx" ON "PageContent"("pageKey", "sectionKey");
CREATE INDEX "PageContent_enabled_visibleFrom_visibleUntil_idx" ON "PageContent"("enabled", "visibleFrom", "visibleUntil");
