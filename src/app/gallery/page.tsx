import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalleryClient from "./gallery-client";

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-light tracking-[0.2em] text-white mb-2">作品集</h1>
            <p className="text-sm tracking-widest text-white/40">GALLERY</p>
          </div>
          <GalleryClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
