import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ensureUploadDirs, processImage } from "@/lib/upload";
import path from "path";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;

    if (!file || !title) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 });
    }

    await ensureUploadDirs();

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const timestamp = Date.now();
    const storedName = `${timestamp}${ext}`;

    const result = await processImage(buffer, storedName);

    const photo = await prisma.photo.create({
      data: {
        title,
        description: description || null,
        category: category || "general",
        filename: result.filename,
        originalName: file.name,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        width: result.width,
        height: result.height,
        fileSize: result.fileSize,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
