import { headers } from "next/headers";

export function getBaseUrl(): string {
  try {
    const h = headers();
    const host = h.get("host") || "localhost:3008";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    return `${protocol}://${host}`;
  } catch {
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3008";
  }
}
