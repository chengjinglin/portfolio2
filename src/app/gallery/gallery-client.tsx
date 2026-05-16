"use client";

import { useState, useEffect, useCallback } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import Lightbox from "@/components/Lightbox";

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
}

export default function GalleryClient() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async (category: string) => {
    setLoading(true);
    try {
      const url = category === "all"
        ? "/api/photos?limit=100"
        : `/api/photos?category=${category}&limit=100`;
      const res = await fetch(url);
      const data = await res.json();
      setPhotos(data.photos);
      setCategories(data.categories || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos(activeCategory);
  }, [activeCategory, fetchPhotos]);

  const currentPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <>
      {/* Category Filter */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-5 py-2 text-sm tracking-wider transition-colors ${
            activeCategory === "all"
              ? "bg-white/10 text-white"
              : "text-white/40 hover:text-white"
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 text-sm tracking-wider transition-colors ${
              activeCategory === cat
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        </div>
      ) : (
        <PhotoGrid photos={photos} />
      )}

      {currentPhoto && (
        <Lightbox
          photo={currentPhoto}
          onClose={() => setLightboxIndex(null)}
          onPrev={
            lightboxIndex! > 0
              ? () => setLightboxIndex(lightboxIndex! - 1)
              : undefined
          }
          onNext={
            lightboxIndex! < photos.length - 1
              ? () => setLightboxIndex(lightboxIndex! + 1)
              : undefined
          }
        />
      )}
    </>
  );
}
