import { describe, test, expect } from 'bun:test';
import { generatePass, hexToRgb, type PassData } from '../passGenerator';

describe('passGenerator', () => {
  const minimalPassData: PassData = {
    title: 'Test Card',
    barcodeData: '123456789',
  };

  describe('generatePass', () => {
    test('generates a valid pkpass buffer with minimal data', async () => {
      const buffer = await generatePass(minimalPassData);
      
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      
      // Check ZIP magic bytes (PK header)
      expect(buffer[0]).toBe(0x50); // 'P'
      expect(buffer[1]).toBe(0x4B); // 'K'
    });

    test('includes pass.json in the generated pass', async () => {
      const buffer = await generatePass(minimalPassData);
      
      // The buffer should contain 'pass.json' string
      const content = buffer.toString('utf8');
      expect(content).toContain('pass.json');
    });

    test('includes barcode data in the pass', async () => {
      const passData: PassData = {
        title: 'Barcode Test',
        barcodeData: 'UNIQUE_BARCODE_123',
        barcodeFormat: 'PKBarcodeFormatQR',
      };
      
      const buffer = await generatePass(passData);
      const content = buffer.toString('utf8');
      
      expect(content).toContain('UNIQUE_BARCODE_123');
      expect(content).toContain('PKBarcodeFormatQR');
    });

    test('respects custom colors', async () => {
      const passData: PassData = {
        title: 'Color Test',
        barcodeData: 'test',
        backgroundColor: '#ff0000',
        foregroundColor: '#00ff00',
        labelColor: '#0000ff',
      };
      
      const buffer = await generatePass(passData);
      const content = buffer.toString('utf8');
      
      // Colors should be converted to rgb format
      expect(content).toContain('rgb(255, 0, 0)');
      expect(content).toContain('rgb(0, 255, 0)');
      expect(content).toContain('rgb(0, 0, 255)');
    });

    test('generates different serial numbers for each pass', async () => {
      const buffer1 = await generatePass(minimalPassData);
      const buffer2 = await generatePass(minimalPassData);
      
      // Buffers should be different due to different serial numbers
      expect(buffer1.toString('hex')).not.toBe(buffer2.toString('hex'));
    });

    test('handles different pass types', async () => {
      const passTypes = ['generic', 'storeCard', 'eventTicket', 'coupon', 'boardingPass'] as const;
      
      for (const passType of passTypes) {
        const passData: PassData = {
          title: `${passType} Test`,
          barcodeData: 'test',
          passType,
        };
        
        const buffer = await generatePass(passData);
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      }
    });

    test('includes header fields when provided', async () => {
      const passData: PassData = {
        title: 'Fields Test',
        barcodeData: 'test',
        headerFields: [
          { key: 'points', label: 'POINTS', value: '1,250' },
        ],
      };
      
      const buffer = await generatePass(passData);
      const content = buffer.toString('utf8');
      
      expect(content).toContain('points');
      expect(content).toContain('POINTS');
      expect(content).toContain('1,250');
    });

    test('includes secondary fields when provided', async () => {
      const passData: PassData = {
        title: 'Fields Test',
        barcodeData: 'test',
        secondaryFields: [
          { key: 'member', label: 'MEMBER SINCE', value: '2024' },
        ],
      };
      
      const buffer = await generatePass(passData);
      const content = buffer.toString('utf8');
      
      expect(content).toContain('member');
      expect(content).toContain('MEMBER SINCE');
      expect(content).toContain('2024');
    });

    test('supports all barcode formats', async () => {
      const formats = [
        'PKBarcodeFormatQR',
        'PKBarcodeFormatPDF417',
        'PKBarcodeFormatAztec',
        'PKBarcodeFormatCode128',
      ] as const;
      
      for (const format of formats) {
        const passData: PassData = {
          title: `${format} Test`,
          barcodeData: 'test',
          barcodeFormat: format,
        };
        
        const buffer = await generatePass(passData);
        const content = buffer.toString('utf8');
        
        expect(content).toContain(format);
      }
    });
  });

  describe('hexToRgb', () => {
    test('converts hex colors to rgb format', () => {
      expect(hexToRgb('#ff0000')).toBe('rgb(255, 0, 0)');
      expect(hexToRgb('#00ff00')).toBe('rgb(0, 255, 0)');
      expect(hexToRgb('#0000ff')).toBe('rgb(0, 0, 255)');
      expect(hexToRgb('#ffffff')).toBe('rgb(255, 255, 255)');
      expect(hexToRgb('#000000')).toBe('rgb(0, 0, 0)');
    });

    test('handles hex without # prefix', () => {
      expect(hexToRgb('ff0000')).toBe('rgb(255, 0, 0)');
      expect(hexToRgb('1a1a2e')).toBe('rgb(26, 26, 46)');
    });

    test('passes through rgb values unchanged', () => {
      expect(hexToRgb('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
      expect(hexToRgb('rgb(26, 26, 46)')).toBe('rgb(26, 26, 46)');
    });

    test('returns default color for invalid hex', () => {
      expect(hexToRgb('invalid')).toBe('rgb(26, 26, 46)');
      expect(hexToRgb('#gg0000')).toBe('rgb(26, 26, 46)');
      expect(hexToRgb('')).toBe('rgb(26, 26, 46)');
    });

    test('handles case insensitivity', () => {
      expect(hexToRgb('#FF0000')).toBe('rgb(255, 0, 0)');
      expect(hexToRgb('#aAbBcC')).toBe('rgb(170, 187, 204)');
    });
  });
});
