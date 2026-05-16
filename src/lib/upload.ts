import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const THUMB_DIR = path.join(UPLOAD_DIR, "thumbnails");

export async function ensureUploadDirs() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return; // Vercel Blob, no local dirs needed
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(THUMB_DIR, { recursive: true });
}

export interface ProcessResult {
  width: number;
  height: number;
  fileSize: number;
  url: string | null;
  thumbnailUrl: string | null;
  filename: string;
}

export async function processImage(
  buffer: Buffer,
  filename: string
): Promise<ProcessResult> {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  const baseName = path.basename(filename, path.extname(filename));
  const safeName = `${baseName}.jpg`;

  // Generate thumbnail buffer
  const thumbBuffer = await sharp(buffer)
    .resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production: Vercel Blob Storage
    const { put } = await import("@vercel/blob");

    const thumbBlob = await put(`thumbnails/${safeName}`, thumbBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    const imgBuffer = await image.jpeg({ quality: 85 }).withMetadata().toBuffer();
    const imgBlob = await put(`photos/${safeName}`, imgBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    return {
      width,
      height,
      fileSize: imgBuffer.length,
      url: imgBlob.url,
      thumbnailUrl: thumbBlob.url,
      filename: safeName,
    };
  }

  // Development: local filesystem
  const originalPath = path.join(UPLOAD_DIR, safeName);
  await image.jpeg({ quality: 85 }).withMetadata().toFile(originalPath);

  const thumbPath = path.join(THUMB_DIR, safeName);
  await fs.writeFile(thumbPath, thumbBuffer);

  const stats = await fs.stat(originalPath);
  return {
    width,
    height,
    fileSize: stats.size,
    url: null,
    thumbnailUrl: null,
    filename: safeName,
  };
}

export async function deleteImageFiles(filename: string) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { del } = await import("@vercel/blob");
    await del(`photos/${filename}`).catch(() => {});
    await del(`thumbnails/${filename}`).catch(() => {});
    return;
  }

  try { await fs.unlink(path.join(UPLOAD_DIR, filename)); } catch {}
  try { await fs.unlink(path.join(THUMB_DIR, filename)); } catch {}
}
