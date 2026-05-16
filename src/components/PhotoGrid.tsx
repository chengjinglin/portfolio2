import PhotoCard from "./PhotoCard";

interface Photo {
  id: number;
  title: string;
  description: string | null;
  category: string;
  filename: string;
  width: number | null;
  height: number | null;
}

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-white/40">
        <p className="text-lg tracking-wider">暂无照片</p>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {photos.map((photo) => (
        <div key={photo.id} className="mb-4 break-inside-avoid">
          <PhotoCard photo={photo} />
        </div>
      ))}
    </div>
  );
}
