import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const prisma = new PrismaClient();

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const THUMB_DIR = path.join(UPLOAD_DIR, "thumbnails");

async function ensureUploadDirs() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(THUMB_DIR, { recursive: true });
}

async function processImage(
  buffer: Buffer,
  filename: string
): Promise<{ width: number; height: number; fileSize: number }> {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  const originalPath = path.join(UPLOAD_DIR, filename);
  await image.jpeg({ quality: 85 }).withMetadata().toFile(originalPath);

  const thumbPath = path.join(THUMB_DIR, filename);
  await sharp(buffer)
    .resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(thumbPath);

  const stats = await fs.stat(originalPath);
  return { width, height, fileSize: stats.size };
}

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const existingUser = await prisma.user.findUnique({ where: { username: "admin" } });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        username: "admin",
        password: await bcrypt.hash("admin123", 12),
      },
    });
    console.log("Admin user created (admin / admin123)");
  } else {
    console.log("Admin user already exists");
  }

  // Import existing photos
  const photosDir = path.join(process.cwd(), "..");
  await ensureUploadDirs();

  try {
    const files = await fs.readdir(photosDir);
    const jpgFiles = files
      .filter((f) => {
        const upper = f.toUpperCase();
        return upper.endsWith(".JPG") || upper.endsWith(".JPEG");
      })
      .sort();

    if (jpgFiles.length === 0) {
      console.log("No JPG files found in", photosDir);
      return;
    }

    for (const file of jpgFiles) {
      const existing = await prisma.photo.findFirst({
        where: { originalName: file },
      });
      if (existing) {
        console.log(`Skipping ${file} (already imported)`);
        continue;
      }

      const filePath = path.join(photosDir, file);
      const buffer = await fs.readFile(filePath);
      const { width, height, fileSize } = await processImage(buffer, file);

      await prisma.photo.create({
        data: {
          title: file.replace(/\.(jpg|jpeg)$/i, "").replace(/_/g, " "),
          description: null,
          category: "general",
          filename: file,
          originalName: file,
          width,
          height,
          fileSize,
        },
      });

      console.log(`Imported: ${file} (${width}x${height})`);
    }

    const count = await prisma.photo.count();
    console.log(`\nTotal photos in database: ${count}`);
  } catch (error) {
    console.error("Error importing photos:", error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
