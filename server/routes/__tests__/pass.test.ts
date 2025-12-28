import { describe, test, expect } from 'bun:test';
import { Hono } from 'hono';
import { passRouter } from '../pass';

// Create a test app with the pass router
const app = new Hono();
app.route('/api/pass', passRouter);

describe('Pass API Routes', () => {
  describe('GET /api/pass/templates', () => {
    test('returns list of templates', async () => {
      const response = await app.request('/api/pass/templates');
      
      expect(response.status).toBe(200);
      
      const templates = await response.json();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
      
      // Check template structure
      const template = templates[0];
      expect(template).toHaveProperty('id');
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('description');
      expect(template).toHaveProperty('icon');
      expect(template).toHaveProperty('defaultColor');
    });

    test('includes all required template types', async () => {
      const response = await app.request('/api/pass/templates');
      const templates = await response.json();
      
      const templateIds = templates.map((t: { id: string }) => t.id);
      
      expect(templateIds).toContain('loyalty');
      expect(templateIds).toContain('event');
      expect(templateIds).toContain('boarding');
      expect(templateIds).toContain('coupon');
      expect(templateIds).toContain('generic');
    });
  });

  describe('POST /api/pass/generate', () => {
    test('returns 400 when barcodeData is missing', async () => {
      const response = await app.request('/api/pass/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test' }),
      });
      
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Barcode data is required');
    });

    test('returns pkpass file with valid data', async () => {
      const response = await app.request('/api/pass/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Card',
          barcodeData: '123456789',
        }),
      });
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/vnd.apple.pkpass');
      expect(response.headers.get('Content-Disposition')).toContain('.pkpass');
    });

    test('returns JSON with share URL when Accept header is application/json', async () => {
      const response = await app.request('/api/pass/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          title: 'Shareable Card',
          barcodeData: '123456789',
        }),
      });
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data).toHaveProperty('shareId');
      expect(data).toHaveProperty('downloadUrl');
      expect(data).toHaveProperty('expiresIn');
      expect(data.downloadUrl).toContain('/api/pass/download/');
    });

    test('uses custom title in Content-Disposition header', async () => {
      const response = await app.request('/api/pass/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'My Custom Card',
          barcodeData: 'test',
        }),
      });
      
      const disposition = response.headers.get('Content-Disposition');
      expect(disposition).toContain('My Custom Card.pkpass');
    });
  });

  describe('GET /api/pass/download/:id', () => {
    test('returns 404 HTML for non-existent pass', async () => {
      const response = await app.request('/api/pass/download/nonexistent123');
      
      expect(response.status).toBe(404);
      
      const html = await response.text();
      expect(html).toContain('Pass Expired');
    });

    test('downloads pass after generation and deletes it (one-time use)', async () => {
      // First, generate a pass and get the share ID
      const generateResponse = await app.request('/api/pass/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          title: 'One Time Pass',
          barcodeData: 'test123',
        }),
      });
      
      const { shareId } = await generateResponse.json();
      
      // Download the pass
      const downloadResponse = await app.request(`/api/pass/download/${shareId}`);
      expect(downloadResponse.status).toBe(200);
      expect(downloadResponse.headers.get('Content-Type')).toBe('application/vnd.apple.pkpass');
      
      // Try to download again - should be 404 (one-time use)
      const secondDownload = await app.request(`/api/pass/download/${shareId}`);
      expect(secondDownload.status).toBe(404);
    });
  });

  describe('POST /api/pass/preview', () => {
    test('returns preview data with serial number', async () => {
      const passData = {
        title: 'Preview Test',
        barcodeData: 'test',
        backgroundColor: '#ff0000',
      };
      
      const response = await app.request('/api/pass/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passData),
      });
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.preview).toHaveProperty('serialNumber');
      expect(data.preview.serialNumber).toContain('PREVIEW-');
      expect(data.preview.title).toBe('Preview Test');
      expect(data.preview.backgroundColor).toBe('#ff0000');
    });

    test('returns 400 for invalid JSON', async () => {
      const response = await app.request('/api/pass/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      });
      
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Invalid pass data');
    });
  });
});
