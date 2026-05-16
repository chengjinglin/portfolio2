import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

async function getExif(input: Buffer | string) {
  try {
    const exifr = await import("exifr");
    const data = await exifr.parse(input, {
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
    });
    return data;
  } catch {
    return null;
  }
}

function formatExposureTime(seconds: number | null): string {
  if (!seconds) return "";
  if (seconds >= 1) return `${seconds}s`;
  const denom = Math.round(1 / seconds);
  return `1/${denom}s`;
}

const exposurePrograms: Record<number, string> = {
  0: "未定义", 1: "手动", 2: "程序自动", 3: "光圈优先",
  4: "快门优先", 5: "创意模式", 6: "运动模式", 7: "人像模式", 8: "风景模式",
};

const meteringModes: Record<number, string> = {
  0: "未知", 1: "平均", 2: "中央重点", 3: "点测光", 4: "多区分割", 5: "局部", 6: "其他",
};

const whiteBalanceLabels: Record<number, string> = {
  0: "自动", 1: "手动",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const photo = await prisma.photo.findUnique({ where: { id: parseInt(id) } });
  if (!photo) {
    return NextResponse.json({ error: "照片不存在" }, { status: 404 });
  }

  let raw: Record<string, unknown> | null = null;

  if (photo.url) {
    // Production: fetch from Vercel Blob URL
    try {
      const res = await fetch(photo.url);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        raw = await getExif(buffer);
      }
    } catch {
      // Fallback: return empty
    }
  } else {
    // Development: read local file
    const filePath = path.join(process.cwd(), "public", "uploads", photo.filename);
    try {
      await fs.access(filePath);
      raw = await getExif(filePath);
    } catch {
      // File not found
    }
  }

  if (!raw) {
    return NextResponse.json({}, { status: 200 });
  }

  const exif: Record<string, string> = {};

  if (raw.Make) exif.camera = raw.Model ? `${raw.Make} ${raw.Model}` : String(raw.Make);
  if (raw.LensModel) exif.lens = String(raw.LensModel);
  if (raw.FocalLength) {
    exif.focalLength = `${raw.FocalLength}mm`;
    if (raw.FocalLengthIn35mmFormat) exif.focalLength35mm = `${raw.FocalLengthIn35mmFormat}mm`;
  }
  if (raw.FNumber) exif.aperture = `f/${raw.FNumber}`;
  if (raw.ExposureTime) exif.shutterSpeed = formatExposureTime(raw.ExposureTime as number);
  if (raw.ISO) exif.iso = `ISO ${raw.ISO}`;
  if (raw.DateTimeOriginal) {
    exif.dateTaken = raw.DateTimeOriginal instanceof Date
      ? raw.DateTimeOriginal.toISOString()
      : String(raw.DateTimeOriginal);
  }

  if (raw.Flash != null) exif.flash = raw.Flash ? "闪光灯开启" : "未闪光";
  if (raw.ExposureProgram != null) exif.exposureProgram = exposurePrograms[raw.ExposureProgram as number] || `程序 ${raw.ExposureProgram}`;
  if (raw.MeteringMode != null) exif.meteringMode = meteringModes[raw.MeteringMode as number] || `模式 ${raw.MeteringMode}`;
  if (raw.WhiteBalance != null) exif.whiteBalance = whiteBalanceLabels[raw.WhiteBalance as number] || "手动";

  return NextResponse.json(exif);
}
