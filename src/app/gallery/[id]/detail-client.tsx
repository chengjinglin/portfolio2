"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import { useState, useEffect } from "react";

interface Photo {
  id: number;
  title: string;
  description: string | null;
  category: string;
  filename: string;
  url: string | null;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  createdAt: string;
}

interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  focalLength35mm?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  dateTaken?: string;
  flash?: string;
  exposureProgram?: string;
  meteringMode?: string;
  whiteBalance?: string;
}

const exifLabels: Record<string, string> = {
  camera: "相机型号",
  lens: "镜头",
  focalLength: "焦距",
  aperture: "光圈",
  shutterSpeed: "快门",
  iso: "感光度",
  dateTaken: "拍摄日期",
  flash: "闪光灯",
  exposureProgram: "曝光模式",
  meteringMode: "测光模式",
  whiteBalance: "白平衡",
};

function formatExifValue(key: string, value: string): string {
  if (key === "dateTaken") {
    try {
      return new Date(value).toLocaleDateString("zh-CN", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return value; }
  }
  return value;
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "未知";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getSrc(photo: Photo): string {
  if (photo.url) return photo.url;
  return `/uploads/${photo.filename}`;
}

export default function DetailClient({ photo }: { photo: Photo }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [exif, setExif] = useState<ExifData | null>(null);
  const [exifLoading, setExifLoading] = useState(true);

  useEffect(() => {
    setExifLoading(true);
    fetch(`/api/exif/${photo.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setExif(data))
      .catch(() => setExif(null))
      .finally(() => setExifLoading(false));
  }, [photo.id]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div
              className="cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={getSrc(photo)}
                alt={photo.title}
                className="w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-light tracking-wider text-white mb-2">
                {photo.title}
              </h1>
              <p className="text-sm tracking-widest text-white/40 mb-8">
                {photo.category}
              </p>

              {photo.description && (
                <p className="text-white/70 leading-relaxed mb-8">
                  {photo.description}
                </p>
              )}

              {/* EXIF Metadata */}
              <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="text-xs font-medium tracking-[0.3em] text-white/30 mb-5 uppercase">
                  拍摄参数
                </h3>

                {exifLoading ? (
                  <div className="space-y-3 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-white/5 rounded w-full" />
                    ))}
                  </div>
                ) : exif && Object.keys(exif).length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {Object.entries(exifLabels).map(([key, label]) => {
                      const val = exif[key as keyof ExifData];
                      if (!val) return null;
                      return (
                        <div key={key} className="contents">
                          <span className="text-white/40 tracking-wider">{label}</span>
                          <span className="text-white/80">{formatExifValue(key, val)}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-white/20">无拍摄参数信息</p>
                )}
              </div>

              {/* File Info */}
              <div className="space-y-3 text-sm text-white/50">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>分辨率</span>
                  <span>{photo.width} x {photo.height}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>文件大小</span>
                  <span>{formatSize(photo.fileSize)}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>上传时间</span>
                  <span>{new Date(photo.createdAt).toLocaleDateString("zh-CN")}</span>
                </div>
              </div>

              <a
                href={getSrc(photo)}
                download
                className="mt-8 inline-block border border-white/20 px-6 py-3 text-sm tracking-wider text-white/70 hover:bg-white/10 transition-colors text-center"
              >
                下载原图
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {lightboxOpen && (
        <Lightbox
          photo={photo}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
