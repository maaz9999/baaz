import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function removeUploadedFiles() {
  const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const entries = await fs.readdir(uploadDir, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name !== ".gitkeep")
      .map((entry) => fs.unlink(path.join(uploadDir, entry.name)).catch(() => undefined))
  );
}

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.pointsStanding.deleteMany();
  await prisma.circuitStage.deleteMany();
  await prisma.stream.deleteMany();
  await prisma.contentPlacement.deleteMany();
  await prisma.pageContent.deleteMany();
  await prisma.post.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.event.deleteMany();
  await prisma.player.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.circuit.deleteMany();
  await prisma.game.deleteMany();
  await removeUploadedFiles();

  console.log("Content cleanup complete. Admin users and post templates were preserved.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
