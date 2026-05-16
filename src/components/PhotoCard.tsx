"use client";

import Link from "next/link";

interface Photo {
  id: number;
  title: string;
  category: string;
  filename: string;
  url?: string | null;
  thumbnailUrl?: string | null;
}

function getSrc(photo: Photo): string {
  if (photo.thumbnailUrl) return photo.thumbnailUrl;
  return `/uploads/thumbnails/${photo.filename}`;
}

export default function PhotoCard({ photo, priority = false }: { photo: Photo; priority?: boolean }) {
  return (
    <Link href={`/gallery/${photo.id}`} className="group relative block overflow-hidden rounded-lg bg-zinc-900">
      <img
        src={getSrc(photo)}
        alt={photo.title}
        width="400"
        height="300"
        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading={priority ? "eager" : "lazy"}
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-sm font-medium text-white">{photo.title}</h3>
        <p className="text-xs text-white/60">{photo.category}</p>
      </div>
    </Link>
  );
}
