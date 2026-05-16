"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/admin", label: "仪表盘" },
    { href: "/admin/photos", label: "照片管理" },
    { href: "/admin/settings", label: "站点设置" },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-56 bg-zinc-950 border-r border-white/10 min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-lg font-light tracking-widest text-white">管理后台</h2>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded text-sm tracking-wider transition-colors ${
              pathname === link.href
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto text-sm text-white/40 hover:text-white transition-colors tracking-wider text-left px-3 py-2"
      >
        退出登录
      </button>
    </aside>
  );
}
