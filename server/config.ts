import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';

interface Config {
  port: number;
  host: string;
}

// Get the directory where the executable/script is located
function getExecutableDir(): string {
  // For compiled binary, use process.execPath
  // For regular bun run, use import.meta.dir
  if (process.argv[0]?.includes('cuzdan')) {
    return dirname(process.argv[0]);
  }
  return import.meta.dir;
}

// Load .env file if it exists
function loadEnvFile(): void {
  const envPaths = [
    join(process.cwd(), '.env'),
    join(getExecutableDir(), '.env'),
    join(getExecutableDir(), '..', '.env'),
  ];

  for (const envPath of envPaths) {
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      }
      break;
    }
  }
}

// Check if a port is available
async function isPortAvailable(port: number): Promise<boolean> {
  try {
    const server = Bun.serve({
      port,
      fetch() {
        return new Response('');
      },
    });
    server.stop();
    return true;
  } catch {
    return false;
  }
}

// Find an available port
async function findAvailablePort(preferredPort: number): Promise<number> {
  if (await isPortAvailable(preferredPort)) {
    return preferredPort;
  }

  console.log(`⚠️  Port ${preferredPort} is in use, finding alternative...`);

  for (let port = preferredPort + 1; port < preferredPort + 100; port++) {
    if (await isPortAvailable(port)) {
      console.log(`✓ Found available port: ${port}`);
      return port;
    }
  }

  const randomPort = 10000 + Math.floor(Math.random() * 50000);
  console.log(`🎲 Using random port: ${randomPort}`);
  return randomPort;
}

export async function loadConfig(): Promise<Config> {
  loadEnvFile();

  const preferredPort = Number(process.env.PORT) || 3002;
  const host = process.env.HOST || '0.0.0.0';
  const port = await findAvailablePort(preferredPort);

  return { port, host };
}

export function getStaticDir(): string {
  const execDir = getExecutableDir();
  
  const possiblePaths = [
    // When binary is in dist/, client is in dist/client/
    join(process.cwd(), 'client'),
    // When running from project root with dist/
    join(process.cwd(), 'dist', 'client'),
    // Relative to executable
    join(execDir, 'client'),
    join(execDir, '..', 'client'),
    join(execDir, '..', 'dist', 'client'),
  ];

  for (const p of possiblePaths) {
    const indexPath = join(p, 'index.html');
    if (existsSync(indexPath)) {
      return p;
    }
  }

  // Default fallback
  return join(process.cwd(), 'client');
}
