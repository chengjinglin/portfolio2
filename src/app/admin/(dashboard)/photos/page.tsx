"use client";

import { useState, useEffect, useCallback } from "react";

interface Photo {
  id: number;
  title: string;
  description: string | null;
  category: string;
  filename: string;
  originalName: string;
  url: string | null;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  createdAt: string;
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photos?limit=200");
      const data = await res.json();
      setPhotos(data.photos || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleDelete = async (id: number, filename: string) => {
    if (!confirm(`确定要删除 "${filename}" 吗？此操作不可恢复。`)) return;
    try {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        showMsg("success", "删除成功");
      } else {
        showMsg("error", "删除失败");
      }
    } catch {
      showMsg("error", "网络错误");
    }
  };

  const startEdit = (photo: Photo) => {
    setEditingId(photo.id);
    setEditTitle(photo.title);
    setEditDesc(photo.description || "");
    setEditCategory(photo.category);
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await fetch(`/api/photos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDesc, category: editCategory }),
      });
      if (res.ok) {
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, title: editTitle, description: editDesc, category: editCategory }
              : p
          )
        );
        setEditingId(null);
        showMsg("success", "更新成功");
      } else {
        showMsg("error", "更新失败");
      }
    } catch {
      showMsg("error", "网络错误");
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        showMsg("success", "上传成功");
        (e.target as HTMLFormElement).reset();
        fetchPhotos();
      } else {
        const data = await res.json();
        showMsg("error", data.error || "上传失败");
      }
    } catch {
      showMsg("error", "网络错误");
    } finally {
      setUploading(false);
    }
  };

  const showMsg = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-wider text-white">照片管理</h1>
          <p className="text-sm tracking-widest text-white/30 mt-1">PHOTO MANAGEMENT</p>
        </div>
      </div>

      {msg && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            msg.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Upload Form */}
      <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h3 className="text-sm tracking-widest text-white/50 mb-4">上传新照片</h3>
        <form onSubmit={handleUpload} className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <label className="block text-xs tracking-widest text-white/30 mb-2">照片文件</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="w-full text-sm text-white/50 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white/70 hover:file:bg-white/20 file:cursor-pointer file:transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-white/30 mb-2">标题</label>
            <input
              type="text"
              name="title"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
              placeholder="照片标题"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-white/30 mb-2">分类</label>
            <input
              type="text"
              name="category"
              defaultValue="general"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
              placeholder="分类名称"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={uploading}
              className="w-full rounded-lg bg-white text-black py-2 text-sm tracking-widest font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {uploading ? "上传中..." : "上传"}
            </button>
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs tracking-widest text-white/30 mb-2">描述（可选）</label>
            <input
              type="text"
              name="description"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
              placeholder="照片描述..."
            />
          </div>
        </form>
      </div>

      {/* Photos Table */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-xs tracking-widest text-white/30 font-normal">预览</th>
                  <th className="text-left py-3 px-4 text-xs tracking-widest text-white/30 font-normal">标题</th>
                  <th className="text-left py-3 px-4 text-xs tracking-widest text-white/30 font-normal">分类</th>
                  <th className="text-left py-3 px-4 text-xs tracking-widest text-white/30 font-normal">分辨率</th>
                  <th className="text-left py-3 px-4 text-xs tracking-widest text-white/30 font-normal">操作</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((photo) => (
                  <tr key={photo.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <img
                        src={photo.thumbnailUrl || `/uploads/thumbnails/${photo.filename}`}
                        alt={photo.title}
                        className="h-12 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-4">
                      {editingId === photo.id ? (
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white w-full"
                        />
                      ) : (
                        <span className="text-white/80">{photo.title}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === photo.id ? (
                        <input
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white w-24"
                        />
                      ) : (
                        <span className="text-white/40">{photo.category}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-white/30 text-xs">
                      {photo.width}x{photo.height}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {editingId === photo.id ? (
                          <>
                            <button
                              onClick={() => handleEdit(photo.id)}
                              className="text-xs text-green-400 hover:text-green-300 px-2 py-1"
                            >
                              保存
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs text-white/30 hover:text-white px-2 py-1"
                            >
                              取消
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(photo)}
                              className="text-xs text-white/40 hover:text-white px-2 py-1"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDelete(photo.id, photo.title)}
                              className="text-xs text-red-400/60 hover:text-red-400 px-2 py-1"
                            >
                              删除
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {photos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-white/20 text-sm tracking-wider">
                      暂无照片，请上传
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
