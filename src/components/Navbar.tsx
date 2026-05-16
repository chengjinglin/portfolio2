"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-light tracking-widest text-white">
          PHOTOGRAPHY
        </Link>
        <div className="flex gap-8 text-sm tracking-wider text-white/80">
          <Link href="/" className="hover:text-white transition-colors">
            首页
          </Link>
          <Link href="/gallery" className="hover:text-white transition-colors">
            作品集
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            关于
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors">
            管理
          </Link>
        </div>
      </div>
    </nav>
  );
}
