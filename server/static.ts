import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { getStaticDir } from './config';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

export function serveStaticFile(path: string): Response | null {
  const staticDir = getStaticDir();
  
  // Security: prevent directory traversal
  const safePath = path.replace(/\.\./g, '').replace(/\/+/g, '/');
  const filePath = join(staticDir, safePath);

  // Ensure the resolved path is still within staticDir
  if (!filePath.startsWith(staticDir)) {
    return null;
  }

  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Cache static assets aggressively, but not HTML
    const cacheControl = ext === '.html' 
      ? 'no-cache, no-store, must-revalidate'
      : 'public, max-age=31536000, immutable';

    return new Response(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return null;
  }
}

export function serveIndex(): Response | null {
  return serveStaticFile('/index.html');
}

export { getStaticDir };
