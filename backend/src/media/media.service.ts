import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import * as path from "path";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MediaService {
  private readonly uploadDir: string;
  private readonly storageMode: string;
  private readonly cloudinaryReady: boolean;
  private readonly cloudinaryFolder: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService
  ) {
    this.uploadDir = path.resolve(process.cwd(), config.get<string>("UPLOAD_DIR") || "uploads");
    this.storageMode = (config.get<string>("MEDIA_STORAGE") || "local").toLowerCase();
    this.cloudinaryFolder = config.get<string>("CLOUDINARY_FOLDER") || "baaz";
    const cloudName = config.get<string>("CLOUDINARY_CLOUD_NAME");
    const apiKey = config.get<string>("CLOUDINARY_API_KEY");
    const apiSecret = config.get<string>("CLOUDINARY_API_SECRET");
    this.cloudinaryReady = Boolean(cloudName && apiKey && apiSecret);

    if (this.cloudinaryReady) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    }
  }

  async save(file: Express.Multer.File | undefined, body: { alt?: string; caption?: string }, actorId?: string) {
    if (!file) throw new BadRequestException("Missing file");
    if (!file.mimetype.startsWith("image/")) throw new BadRequestException("Only image uploads are supported");

    const extension = path.extname(file.originalname) || ".bin";
    const baseName = randomUUID();
    const filename = `${baseName}${extension}`;
    const stored = await this.storeFile(file, filename, baseName);

    const asset = await this.prisma.mediaAsset.create({
      data: {
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: stored.path,
        url: stored.url,
        alt: body.alt,
        caption: body.caption,
        createdById: actorId,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "UPLOAD",
        entityType: "mediaAsset",
        entityId: asset.id,
        metadata: { filename: asset.filename, originalName: asset.originalName },
      },
    });

    return asset;
  }

  private async storeFile(file: Express.Multer.File, filename: string, baseName: string) {
    if (this.storageMode === "cloudinary") {
      if (!this.cloudinaryReady) {
        throw new BadRequestException("Cloudinary storage is selected, but Cloudinary credentials are missing");
      }

      const uploaded = await this.uploadToCloudinary(file, baseName);
      return { path: uploaded.public_id, url: uploaded.secure_url };
    }

    await fs.mkdir(this.uploadDir, { recursive: true });
    const filePath = path.join(this.uploadDir, filename);
    await fs.writeFile(filePath, file.buffer);
    return { path: filePath, url: `/api/v1/media/${filename}` };
  }

  private uploadToCloudinary(file: Express.Multer.File, baseName: string) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: this.cloudinaryFolder,
          public_id: baseName,
          resource_type: "image",
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary upload failed"));
            return;
          }

          resolve(result);
        }
      );

      stream.end(file.buffer);
    });
  }

  list() {
    return this.prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  }

  async update(id: string, body: { alt?: string; caption?: string }, actorId?: string) {
    const existing = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Media asset not found");

    const asset = await this.prisma.mediaAsset.update({
      where: { id },
      data: {
        alt: body.alt,
        caption: body.caption,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "UPDATE",
        entityType: "mediaAsset",
        entityId: asset.id,
        metadata: { filename: asset.filename },
      },
    });

    return asset;
  }

  async remove(id: string, actorId?: string) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException("Media asset not found");

    await this.prisma.mediaAsset.delete({ where: { id } });
    await this.deleteStoredFile(asset);

    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "DELETE",
        entityType: "mediaAsset",
        entityId: asset.id,
        metadata: { filename: asset.filename, originalName: asset.originalName },
      },
    });

    return asset;
  }

  async findByFilename(filename: string) {
    const asset = await this.prisma.mediaAsset.findFirst({ where: { filename } });
    if (!asset) throw new NotFoundException("Media asset not found");
    return asset;
  }

  private async deleteStoredFile(asset: { path: string; url: string }) {
    if (asset.url.startsWith("http")) {
      if (this.cloudinaryReady) {
        await cloudinary.uploader.destroy(asset.path, { resource_type: "image" }).catch(() => undefined);
      }
      return;
    }

    await fs.unlink(asset.path).catch(() => undefined);
  }
}
