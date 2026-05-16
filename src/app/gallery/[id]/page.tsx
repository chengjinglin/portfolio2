import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DetailClient from "./detail-client";

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

async function getPhoto(id: string): Promise<Photo | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3008";
    const res = await fetch(`${baseUrl}/api/photos/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = await getPhoto(id);

  if (!photo) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center pt-24">
          <p className="text-white/40 text-lg tracking-wider">照片不存在</p>
        </main>
        <Footer />
      </>
    );
  }

  return <DetailClient photo={photo} />;
}
