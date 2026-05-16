"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMsg("保存成功");
        setTimeout(() => setMsg(null), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wider text-white">站点设置</h1>
        <p className="text-sm tracking-widest text-white/30 mt-1">SITE SETTINGS</p>
      </div>

      {msg && (
        <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="max-w-lg space-y-6">
        <div>
          <label className="block text-xs tracking-widest text-white/30 mb-2">网站标题</label>
          <input
            value={settings.siteTitle || ""}
            onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
            placeholder="个人摄影作品集"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest text-white/30 mb-2">关于我</label>
          <textarea
            value={settings.aboutText || ""}
            onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 resize-none"
            placeholder="关于我的描述..."
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest text-white/30 mb-2">Instagram</label>
          <input
            value={settings.instagram || ""}
            onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
            placeholder="Instagram 链接..."
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-white text-black px-6 py-3 text-sm tracking-widest font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存设置"}
        </button>
      </form>
    </div>
  );
}
