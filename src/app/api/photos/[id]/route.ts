import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { deleteImageFiles } from "@/lib/upload";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const photo = await prisma.photo.findUnique({ where: { id: parseInt(id) } });
  if (!photo) {
    return NextResponse.json({ error: "照片不存在" }, { status: 404 });
  }
  return NextResponse.json(photo);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const photo = await prisma.photo.update({
    where: { id: parseInt(id) },
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
    },
  });
  return NextResponse.json(photo);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const photo = await prisma.photo.findUnique({ where: { id: parseInt(id) } });
  if (!photo) {
    return NextResponse.json({ error: "照片不存在" }, { status: 404 });
  }

  await deleteImageFiles(photo.filename);
  await prisma.photo.delete({ where: { id: parseInt(id) } });

  return NextResponse.json({ success: true });
}
