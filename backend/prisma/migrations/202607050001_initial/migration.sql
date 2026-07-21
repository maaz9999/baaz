CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PostTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultEyebrow" TEXT,
    "defaultCtaLabel" TEXT,
    "recommendedSlots" JSONB,
    "editorGuidance" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PostTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "eyebrow" TEXT,
    "excerpt" TEXT,
    "body" JSONB,
    "coverImageId" TEXT,
    "gallery" JSONB,
    "cta" JSONB,
    "sourceLinks" JSONB,
    "seo" JSONB,
    "relatedEventId" TEXT,
    "relatedPlayerId" TEXT,
    "relatedSponsorId" TEXT,
    "relatedCircuitId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentPlacement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "slotKey" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "variant" TEXT NOT NULL DEFAULT 'default',
    "order" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "visibleFrom" TIMESTAMP(3),
    "visibleUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ContentPlacement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "caption" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short" TEXT,
    "publisher" TEXT,
    "art" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'partner',
    "url" TEXT,
    "logoLight" JSONB,
    "logoDark" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "realName" TEXT,
    "country" TEXT NOT NULL DEFAULT 'PK',
    "teamId" TEXT,
    "photo" JSONB,
    "mains" JSONB,
    "socials" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "edition" TEXT,
    "tagline" TEXT,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "venue" TEXT,
    "city" TEXT,
    "country" TEXT,
    "prizePool" JSONB,
    "games" JSONB,
    "participants" INTEGER,
    "format" TEXT,
    "tier" TEXT,
    "organizer" TEXT DEFAULT 'BAAZ',
    "sponsors" JSONB,
    "broadcastTalent" JSONB,
    "liquipedia" TEXT,
    "poster" JSONB,
    "gallery" JSONB,
    "recapVideo" TEXT,
    "startggEventId" TEXT,
    "results" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Circuit" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "edition" TEXT,
    "gameSlug" TEXT,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "city" TEXT,
    "country" TEXT,
    "tagline" TEXT,
    "prizePool" JSONB,
    "slots" JSONB,
    "pointsRules" TEXT,
    "registrationOpen" BOOLEAN NOT NULL DEFAULT false,
    "registrationUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CircuitStage" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "circuitId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "city" TEXT,
    "venue" TEXT,
    "startggEventId" TEXT,
    "winnerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CircuitStage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PointsStanding" (
    "id" TEXT NOT NULL,
    "circuitId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "stagesPlayed" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PointsStanding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Stream" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "channel" TEXT,
    "url" TEXT,
    "scheduledStart" TIMESTAMP(3),
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "eventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE INDEX "AdminUser_role_idx" ON "AdminUser"("role");
CREATE UNIQUE INDEX "PostTemplate_key_key" ON "PostTemplate"("key");
CREATE INDEX "PostTemplate_key_idx" ON "PostTemplate"("key");
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE INDEX "Post_status_idx" ON "Post"("status");
CREATE INDEX "Post_templateKey_idx" ON "Post"("templateKey");
CREATE INDEX "Post_publishedAt_idx" ON "Post"("publishedAt");
CREATE INDEX "ContentPlacement_pageKey_slotKey_idx" ON "ContentPlacement"("pageKey", "slotKey");
CREATE INDEX "ContentPlacement_targetType_targetId_idx" ON "ContentPlacement"("targetType", "targetId");
CREATE INDEX "ContentPlacement_enabled_visibleFrom_visibleUntil_idx" ON "ContentPlacement"("enabled", "visibleFrom", "visibleUntil");
CREATE INDEX "MediaAsset_mimeType_idx" ON "MediaAsset"("mimeType");
CREATE INDEX "MediaAsset_createdById_idx" ON "MediaAsset"("createdById");
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
CREATE UNIQUE INDEX "Sponsor_slug_key" ON "Sponsor"("slug");
CREATE INDEX "Sponsor_tier_idx" ON "Sponsor"("tier");
CREATE UNIQUE INDEX "Player_slug_key" ON "Player"("slug");
CREATE INDEX "Player_country_idx" ON "Player"("country");
CREATE INDEX "Player_teamId_idx" ON "Player"("teamId");
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE INDEX "Event_status_idx" ON "Event"("status");
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");
CREATE UNIQUE INDEX "Circuit_slug_key" ON "Circuit"("slug");
CREATE INDEX "CircuitStage_circuitId_idx" ON "CircuitStage"("circuitId");
CREATE INDEX "CircuitStage_status_idx" ON "CircuitStage"("status");
CREATE UNIQUE INDEX "PointsStanding_circuitId_playerId_key" ON "PointsStanding"("circuitId", "playerId");
CREATE INDEX "PointsStanding_circuitId_rank_idx" ON "PointsStanding"("circuitId", "rank");
CREATE INDEX "Stream_platform_idx" ON "Stream"("platform");
CREATE INDEX "Stream_isLive_idx" ON "Stream"("isLive");
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
