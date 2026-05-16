# 个人摄影作品集

基于 Next.js 的个人摄影作品展示网站，支持后台管理、照片上传和 EXIF 元数据展示。

## 功能
- 摄影作品展示（瀑布流画廊、灯箱大图）
- 管理后台（上传/编辑/删除照片）
- EXIF 拍摄参数读取
- 响应式设计

## 技术栈
- Next.js 14 + TypeScript + Tailwind CSS
- Prisma + SQLite（本地）/ Turso（生产）
- Vercel Blob 存储

## 本地运行

```bash
npm install
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

访问 http://localhost:3008

## 管理后台
- 地址：/admin/login
- 默认账号：admin / admin123

## 环境变量

```
DATABASE_URL="file:./dev.db"
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-token"
BLOB_READ_WRITE_TOKEN="your-blob-token"
```
