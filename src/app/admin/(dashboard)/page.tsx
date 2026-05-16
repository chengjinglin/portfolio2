async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3008";
    const photosRes = await fetch(`${baseUrl}/api/photos?limit=1`, { cache: "no-store" });
    const photosData = await photosRes.json();
    const totalPhotos = photosData.total || 0;
    const categories = photosData.categories || [];
    return { totalPhotos, categories };
  } catch {
    return { totalPhotos: 0, categories: [] };
  }
}

export default async function AdminDashboard() {
  const { totalPhotos, categories } = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wider text-white">仪表盘</h1>
        <p className="text-sm tracking-widest text-white/30 mt-1">DASHBOARD</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-sm tracking-widest text-white/30 mb-2">照片总数</p>
          <p className="text-4xl font-light text-white">{totalPhotos}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-sm tracking-widest text-white/30 mb-2">分类数量</p>
          <p className="text-4xl font-light text-white">{categories.length}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-sm tracking-widest text-white/30 mb-2">存储空间</p>
          <p className="text-4xl font-light text-white">本地</p>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-sm tracking-widest text-white/30 mb-4">分类列表</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: string) => (
              <span
                key={cat}
                className="px-3 py-1 text-xs tracking-wider rounded-full bg-white/5 text-white/60"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
