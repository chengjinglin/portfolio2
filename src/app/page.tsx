import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import { getBaseUrl } from "@/lib/url";

async function getPhotos() {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/photos?limit=20`, { cache: "no-store" });
    if (!res.ok) return { photos: [] };
    return res.json();
  } catch {
    return { photos: [] };
  }
}

export default async function HomePage() {
  const data = await getPhotos();
  const featured = data.photos.slice(0, 4);
  const recent = data.photos.slice(4, 20);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative flex h-screen items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-zinc-950" />
          {featured[0] && (
            <img
              src={featured[0].url || `/uploads/${featured[0].filename}`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-light tracking-[0.2em] text-white mb-6">
              光影瞬间
            </h1>
            <p className="text-lg tracking-[0.3em] text-white/60 font-light mb-8">
              MOMENTS OF LIGHT
            </p>
            <a
              href="/gallery"
              className="inline-block border border-white/30 px-8 py-3 text-sm tracking-[0.2em] text-white/80 hover:bg-white/10 transition-colors"
            >
              浏览作品集
            </a>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="h-6 w-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-light tracking-[0.2em] text-white mb-2">精选作品</h2>
            <p className="text-sm tracking-widest text-white/40">FEATURED WORKS</p>
          </div>
          <PhotoGrid photos={recent} />
        </section>
      </main>
      <Footer />
    </>
  );
}
