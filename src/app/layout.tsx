import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "个人摄影作品集",
  description: "专业摄影作品展示",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-zinc-950 text-white">
        {children}
      </body>
    </html>
  );
}
