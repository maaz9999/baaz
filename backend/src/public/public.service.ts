import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StartggService } from "../startgg/startgg.service";

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly startgg: StartggService
  ) {}

  startggStandings(slug: string) {
    return this.startgg.getEventStandings(slug, 8);
  }

  health() {
    return {
      ok: true,
      service: "baaz-cms-backend",
      time: new Date().toISOString(),
    };
  }

  async home() {
    const [placements, content, posts, events, players] = await Promise.all([
      this.placements("home"),
      this.pageContent("home"),
      this.publishedPosts(8),
      this.events(),
      this.players(),
    ]);

    return {
      placements,
      content,
      posts,
      events: events.slice(0, 6),
      players: players.slice(0, 8),
    };
  }

  async page(pageKey: string) {
    const [placements, content] = await Promise.all([this.placements(pageKey), this.pageContent(pageKey)]);
    return { pageKey, placements, content };
  }

  events() {
    return this.prisma.event.findMany({
      where: this.visibleStatusWhere(),
      orderBy: [{ startDate: "desc" }, { updatedAt: "desc" }],
    });
  }

  players() {
    return this.prisma.player.findMany({ where: { enabled: true }, orderBy: [{ country: "asc" }, { tag: "asc" }] });
  }

  sponsors() {
    return this.prisma.sponsor.findMany({ where: { enabled: true }, orderBy: [{ tier: "asc" }, { name: "asc" }] });
  }

  posts(take = 24) {
    return this.publishedPosts(take);
  }

  async postBySlug(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
      },
    });

    if (!post) return null;
    const coverImage = post.coverImageId ? await this.prisma.mediaAsset.findUnique({ where: { id: post.coverImageId } }) : null;
    return { ...post, coverImage };
  }

  eventBySlug(slug: string) {
    return this.prisma.event.findFirst({ where: { slug, ...this.visibleStatusWhere() } });
  }

  playerBySlug(slug: string) {
    return this.prisma.player.findFirst({ where: { slug, enabled: true } });
  }

  sponsorBySlug(slug: string) {
    return this.prisma.sponsor.findFirst({ where: { slug, enabled: true } });
  }

  circuitBySlug(slug: string) {
    return this.prisma.circuit.findFirst({ where: { slug, ...this.visibleStatusWhere() } });
  }

  async ptl2026() {
    const [page, circuits] = await Promise.all([
      this.page("ptl-2026"),
      this.prisma.circuit.findMany({
        where: { slug: "ptl-2026", ...this.visibleStatusWhere() },
        orderBy: [{ startDate: "asc" }, { updatedAt: "desc" }],
      }),
    ]);

    return { ...page, circuits };
  }

  async watch() {
    const [page, streams] = await Promise.all([
      this.page("watch"),
      this.prisma.stream.findMany({
        where: {
          enabled: true,
          OR: [{ scheduledStart: null }, { scheduledStart: { lte: new Date() } }, { isLive: true }],
        },
        orderBy: [{ isLive: "desc" }, { scheduledStart: "desc" }, { updatedAt: "desc" }],
      }),
    ]);

    return { ...page, streams };
  }

  about() {
    return this.page("about");
  }

  private pageContent(pageKey: string) {
    const now = new Date();
    return this.prisma.pageContent.findMany({
      where: {
        pageKey,
        enabled: true,
        AND: [
          { OR: [{ visibleFrom: null }, { visibleFrom: { lte: now } }] },
          { OR: [{ visibleUntil: null }, { visibleUntil: { gte: now } }] },
        ],
      },
      orderBy: [{ sectionKey: "asc" }, { order: "asc" }],
    });
  }

  async placements(pageKey: string) {
    const now = new Date();
    const placements = await this.prisma.contentPlacement.findMany({
      where: {
        pageKey,
        enabled: true,
        AND: [
          { OR: [{ visibleFrom: null }, { visibleFrom: { lte: now } }] },
          { OR: [{ visibleUntil: null }, { visibleUntil: { gte: now } }] },
        ],
      },
      orderBy: [{ slotKey: "asc" }, { order: "asc" }],
    });

    const placementsWithTargets = await Promise.all(
      placements.map(async (placement: { targetType: string; targetId: string }) => ({
        ...placement,
        target: await this.resolveTarget(placement.targetType, placement.targetId),
      }))
    );

    return placementsWithTargets.filter((placement) => placement.target);
  }

  private publishedPosts(take: number) {
    const now = new Date();
    return this.prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
      },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      take,
    });
  }

  private async resolveTarget(targetType: string, targetId: string) {
    const now = new Date();

    if (targetType === "post") {
      const post = await this.prisma.post.findFirst({
        where: {
          id: targetId,
          status: "PUBLISHED",
          OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
        },
      });

      if (!post) return null;
      const coverImage = post.coverImageId ? await this.prisma.mediaAsset.findUnique({ where: { id: post.coverImageId } }) : null;
      return { ...post, coverImage };
    }

    if (targetType === "event") return this.prisma.event.findFirst({ where: { id: targetId, ...this.visibleStatusWhere() } });
    if (targetType === "player") return this.prisma.player.findFirst({ where: { id: targetId, enabled: true } });
    if (targetType === "sponsor") return this.prisma.sponsor.findFirst({ where: { id: targetId, enabled: true } });
    if (targetType === "circuit") return this.prisma.circuit.findFirst({ where: { id: targetId, ...this.visibleStatusWhere() } });
    if (targetType === "stream") {
      return this.prisma.stream.findFirst({
        where: {
          id: targetId,
          enabled: true,
          OR: [{ scheduledStart: null }, { scheduledStart: { lte: now } }, { isLive: true }],
        },
      });
    }

    return null;
  }

  private visibleStatusWhere() {
    return {
      enabled: true,
      status: { notIn: ["draft", "DRAFT", "archived", "ARCHIVED", "disabled", "DISABLED"] },
    };
  }
}
