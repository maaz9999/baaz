import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { slugify } from "./slug";

type ModelName =
  | "post"
  | "postTemplate"
  | "contentPlacement"
  | "pageContent"
  | "event"
  | "player"
  | "sponsor"
  | "circuit"
  | "stream";

@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(model: ModelName) {
    return this.prisma[model] as {
      findMany: (args?: unknown) => Promise<unknown[]>;
      findUnique: (args: unknown) => Promise<unknown | null>;
      create: (args: unknown) => Promise<unknown>;
      update: (args: unknown) => Promise<unknown>;
      delete: (args: unknown) => Promise<unknown>;
    };
  }

  async list(model: ModelName) {
    return this.delegate(model).findMany({ orderBy: { updatedAt: "desc" } });
  }

  async get(model: ModelName, id: string) {
    const row = await this.delegate(model).findUnique({ where: { id } });
    if (!row) throw new NotFoundException(`${model} not found`);
    return row;
  }

  async create(model: ModelName, data: object, actorId?: string) {
    const prepared = this.prepare(model, data);
    const row = await this.delegate(model).create({ data: prepared });
    await this.audit(actorId, "CREATE", model, (row as { id?: string }).id, prepared);
    return row;
  }

  async update(model: ModelName, id: string, data: object, actorId?: string) {
    await this.get(model, id);
    const prepared = this.prepare(model, data, true);
    const row = await this.delegate(model).update({ where: { id }, data: prepared });
    await this.audit(actorId, "UPDATE", model, id, prepared);
    return row;
  }

  async remove(model: ModelName, id: string, actorId?: string) {
    await this.get(model, id);
    const row = await this.delegate(model).delete({ where: { id } });
    await this.audit(actorId, "DELETE", model, id);
    return row;
  }

  private prepare(model: ModelName, data: object, partial = false) {
    const next = { ...(data as Record<string, unknown>) };

    if (!partial || typeof next.slug === "undefined") {
      if (model === "post" && !next.slug && typeof next.title === "string") next.slug = slugify(next.title);
      if (model === "event" && !next.slug && typeof next.name === "string") {
        next.slug = slugify([next.name, next.edition].filter(Boolean).join(" "));
      }
      if (model === "player" && !next.slug && typeof next.tag === "string") next.slug = slugify(next.tag);
      if (model === "sponsor" && !next.slug && typeof next.name === "string") next.slug = slugify(next.name);
      if (model === "circuit" && !next.slug && typeof next.name === "string") {
        next.slug = slugify([next.name, next.edition].filter(Boolean).join(" "));
      }
    }

    for (const key of ["startDate", "endDate", "publishedAt", "visibleFrom", "visibleUntil", "scheduledStart"]) {
      if (typeof next[key] === "string" && next[key]) next[key] = new Date(next[key] as string);
    }

    return next;
  }

  private async audit(actorId: string | undefined, action: string, entityType: string, entityId?: string, metadata?: unknown) {
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });
  }
}
