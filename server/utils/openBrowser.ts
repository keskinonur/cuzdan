import { spawn } from 'child_process';
import { platform } from 'os';

/**
 * Opens a URL in the default browser across different operating systems
 */
export function openBrowser(url: string): void {
  const os = platform();
  
  let command: string;
  let args: string[];

  switch (os) {
    case 'darwin': // macOS
      command = 'open';
      args = [url];
      break;
    case 'win32': // Windows
      command = 'cmd';
      args = ['/c', 'start', '', url.replace(/&/g, '^&')];
      break;
    case 'linux':
      // Try xdg-open first (most common), fallback to other options
      command = 'xdg-open';
      args = [url];
      break;
    default:
      console.log(`📎 Open in browser: ${url}`);
      return;
  }

  try {
    const child = spawn(command, args, {
      detached: true,
      stdio: 'ignore',
    });
    
    child.unref();
    
    // Handle Linux fallbacks
    child.on('error', () => {
      if (os === 'linux') {
        // Try alternative Linux commands
        const alternatives = ['gnome-open', 'kde-open', 'wslview'];
        tryAlternatives(alternatives, url);
      }
    });
  } catch {
    console.log(`📎 Open in browser: ${url}`);
  }
}

function tryAlternatives(commands: string[], url: string): void {
  for (const cmd of commands) {
    try {
      const child = spawn(cmd, [url], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
      return;
    } catch {
      continue;
    }
  }
  console.log(`📎 Open in browser: ${url}`);
}

/**
 * Waits for the server to be ready, then opens the browser
 */
export async function openBrowserWhenReady(url: string, maxRetries = 10): Promise<void> {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${url}/api/health`);
      if (response.ok) {
        // Small delay to ensure everything is fully ready
        await delay(100);
        openBrowser(url);
        return;
      }
    } catch {
      // Server not ready yet
    }
    await delay(200);
  }
  
  // Open anyway after max retries
  openBrowser(url);
}
