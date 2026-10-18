// Build-time helpers for images that live in public/.
// Reads intrinsic dimensions (to avoid layout shift) and detects a sibling
// .webp so components can serve it via <picture> without extra config.
import fs from "node:fs";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");
const cache = new Map<string, ImageInfo>();

export interface ImageInfo {
  src: string;
  webp?: string;
  width?: number;
  height?: number;
}

function readDims(buf: Buffer): { width: number; height: number } | undefined {
  // PNG
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: walk segments to the first SOFn marker
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  // WebP (VP8 / VP8L / VP8X)
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  }
  return undefined;
}

export function imageInfo(src: string): ImageInfo {
  const hit = cache.get(src);
  if (hit) return hit;
  const info: ImageInfo = { src };
  if (src.startsWith("/")) {
    const file = path.join(publicDir, src);
    try {
      Object.assign(info, readDims(fs.readFileSync(file)) ?? {});
    } catch {
      /* missing file: render without dimensions */
    }
    const webp = src.replace(/\.(png|jpe?g)$/i, ".webp");
    if (webp !== src && fs.existsSync(path.join(publicDir, webp))) info.webp = webp;
  }
  cache.set(src, info);
  return info;
}
