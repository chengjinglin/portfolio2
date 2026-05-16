"use client";

import { useEffect, useCallback } from "react";

interface Photo {
  id: number;
  title: string;
  filename: string;
  category: string;
  url?: string | null;
  width: number | null;
  height: number | null;
}

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

function getSrc(photo: Photo): string {
  if (photo.url) return photo.url;
  return `/uploads/${photo.filename}`;
}

export default function Lightbox({ photo, onClose, onPrev, onNext }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-white/60 hover:text-white text-3xl transition-colors z-10"
      >
        &times;
      </button>

      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl transition-colors z-10"
        >
          &#8249;
        </button>
      )}

      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl transition-colors z-10"
        >
          &#8250;
        </button>
      )}

      <div className="flex max-h-[90vh] max-w-[90vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={getSrc(photo)}
          alt={photo.title}
          className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain"
        />
        <div className="mt-4 text-center">
          <h3 className="text-lg font-light text-white">{photo.title}</h3>
          <p className="text-sm text-white/50">{photo.category}</p>
        </div>
      </div>
    </div>
  );
}
