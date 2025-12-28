import { Hono } from 'hono';
import { generatePass, type PassData } from '../services/passGenerator';
import { nanoid } from 'nanoid';

export const passRouter = new Hono();

// In-memory store for generated passes (with expiration)
const passStore = new Map<string, { buffer: Buffer; title: string; expiresAt: number }>();

// Clean up expired passes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, pass] of passStore) {
    if (pass.expiresAt < now) {
      passStore.delete(id);
    }
  }
}, 5 * 60 * 1000);

// Generate a pass and store it for sharing
passRouter.post('/generate', async (c) => {
  try {
    const body = await c.req.json<PassData>();
    
    if (!body.barcodeData) {
      return c.json({ error: 'Barcode data is required' }, 400);
    }

    const passBuffer = await generatePass(body);
    
    // Generate a short ID for sharing
    const shareId = nanoid(10);
    
    // Store pass for 10 minutes
    passStore.set(shareId, {
      buffer: passBuffer,
      title: body.title || 'pass',
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    // Check if client wants JSON response (for QR code sharing)
    const acceptHeader = c.req.header('Accept') || '';
    if (acceptHeader.includes('application/json')) {
      const host = c.req.header('host') || 'localhost:3002';
      const protocol = c.req.header('x-forwarded-proto') || 'http';
      const downloadUrl = `${protocol}://${host}/api/pass/download/${shareId}`;
      
      return c.json({
        success: true,
        shareId,
        downloadUrl,
        expiresIn: '10 minutes',
      });
    }

    // Direct download
    return new Response(new Uint8Array(passBuffer), {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${body.title || 'pass'}.pkpass"`,
      },
    });
  } catch (error) {
    console.error('Error generating pass:', error);
    return c.json({ 
      error: 'Failed to generate pass', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Download a shared pass by ID
passRouter.get('/download/:id', (c) => {
  const id = c.req.param('id');
  const pass = passStore.get(id);

  if (!pass) {
    return c.html(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Pass Expired</title>
          <style>
            body { font-family: -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #0a0a0f; color: white; }
            .container { text-align: center; padding: 20px; }
            h1 { font-size: 24px; margin-bottom: 10px; }
            p { color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Pass Expired</h1>
            <p>This pass link has expired or doesn't exist.</p>
            <p>Please generate a new pass.</p>
          </div>
        </body>
      </html>
    `, 404);
  }

  // Delete after download (one-time use)
  passStore.delete(id);

  return new Response(new Uint8Array(pass.buffer), {
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="${pass.title}.pkpass"`,
    },
  });
});

// Get pass templates
passRouter.get('/templates', (c) => {
  const templates = [
    {
      id: 'loyalty',
      name: 'Loyalty Card',
      description: 'Store loyalty and membership cards',
      icon: 'store',
      defaultColor: '#1a1a2e',
    },
    {
      id: 'event',
      name: 'Event Ticket',
      description: 'Concert, sports, and event tickets',
      icon: 'ticket',
      defaultColor: '#0f3460',
    },
    {
      id: 'boarding',
      name: 'Boarding Pass',
      description: 'Flight and transit boarding passes',
      icon: 'plane',
      defaultColor: '#16213e',
    },
    {
      id: 'coupon',
      name: 'Coupon',
      description: 'Discounts and promotional offers',
      icon: 'percent',
      defaultColor: '#533483',
    },
    {
      id: 'generic',
      name: 'Generic Pass',
      description: 'ID cards, gym memberships, library cards',
      icon: 'card',
      defaultColor: '#2d3748',
    },
  ];
  
  return c.json(templates);
});

// Preview endpoint
passRouter.post('/preview', async (c) => {
  try {
    const body = await c.req.json<PassData>();
    
    return c.json({
      success: true,
      preview: {
        ...body,
        serialNumber: `PREVIEW-${Date.now()}`,
      },
    });
  } catch {
    return c.json({ error: 'Invalid pass data' }, 400);
  }
});
