import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';
import { existsSync } from 'fs';
import { join } from 'path';
import { passRouter } from './routes/pass';
import { loadConfig, getStaticDir } from './config';
import { serveStaticFile, serveIndex } from './static';
import { openBrowser } from './utils/openBrowser';

const app = new Hono();

// Global error handler
app.onError((err, c) => {
  console.error(`[Error] ${err.message}`);
  
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  
  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
    
  return c.json({ error: message }, 500);
});

// 404 handler for API routes
app.notFound((c) => {
  if (c.req.path.startsWith('/api/')) {
    return c.json({ error: 'Not found' }, 404);
  }
  return c.text('Not found', 404);
});

// Auto-detect production mode: if client/index.html exists, serve static files
const staticDir = getStaticDir();
const hasStaticFiles = existsSync(join(staticDir, 'index.html'));
const isProduction = process.env.NODE_ENV === 'production' || hasStaticFiles;

// Check if we should open browser (can be disabled via env)
const shouldOpenBrowser = process.env.NO_OPEN !== '1' && process.env.NO_OPEN !== 'true';

// Middleware
app.use('*', logger());
app.use('/api/*', cors({
  origin: (origin) => origin || '*',
  credentials: true,
}));

// API Routes
app.route('/api/pass', passRouter);

// Health check
app.get('/api/health', (c) => c.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  mode: isProduction ? 'production' : 'development',
}));

// Serve static files when available
if (hasStaticFiles) {
  // Static assets (JS, CSS, images)
  app.get('/assets/*', (c) => {
    const response = serveStaticFile(c.req.path);
    return response ?? c.notFound();
  });

  // Other static files at root (favicon, robots.txt, etc)
  app.get('/:file{.+\\.[a-z0-9]+$}', (c) => {
    const response = serveStaticFile(c.req.path);
    return response ?? c.notFound();
  });

  // SPA fallback - serve index.html for all other routes
  app.get('*', (c) => {
    const response = serveIndex();
    return response ?? c.text('index.html not found', 404);
  });
}

// Start server
async function start() {
  const config = await loadConfig();
  const url = `http://localhost:${config.port}`;

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎫  CÜZDAN - Apple Wallet Pass Generator                 ║
║                                                            ║
║   🌐 Server:  ${url.padEnd(41)}║
║   📦 Mode:    ${(isProduction ? 'Production' : 'Development').padEnd(29)}║
${hasStaticFiles ? `║   📁 Static: ${(staticDir.length > 30 ? '...' + staticDir.slice(-27) : staticDir).padEnd(30)}║\n` : ''}║                                                            ║
║   💡 Set NO_OPEN=1 to disable auto-opening browser         ║
║   💡 Create a .env file to customize PORT and settings     ║
║                                                            ║
║   Press Ctrl+C to stop                                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

  // Start the server
  Bun.serve({
    port: config.port,
    hostname: config.host,
    fetch: app.fetch,
  });

  // Open browser after server is ready
  if (shouldOpenBrowser) {
    // Give the server a moment to fully initialize
    setTimeout(() => {
      console.log(`🌐 Opening ${url} in your browser...`);
      openBrowser(url);
    }, 500);
  }
}

start().catch(console.error);
