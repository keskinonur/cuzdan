import { PKPass } from 'passkit-generator';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';

export type PassType = 'generic' | 'boardingPass' | 'coupon' | 'eventTicket' | 'storeCard';
export type BarcodeFormat = 'PKBarcodeFormatQR' | 'PKBarcodeFormatPDF417' | 'PKBarcodeFormatAztec' | 'PKBarcodeFormatCode128';

export interface PassData {
  // Basic info
  title: string;
  subtitle?: string;
  description?: string;
  
  // Appearance
  backgroundColor?: string;
  foregroundColor?: string;
  labelColor?: string;
  logoText?: string;
  
  // Barcode
  barcodeData: string;
  barcodeFormat?: BarcodeFormat;
  barcodeAltText?: string;
  
  // Pass type and fields
  passType?: PassType;
  headerFields?: PassField[];
  primaryFields?: PassField[];
  secondaryFields?: PassField[];
  auxiliaryFields?: PassField[];
  backFields?: PassField[];
  
  // Images (base64)
  logo?: string;
  icon?: string;
  thumbnail?: string;
  strip?: string;
  
  // Additional
  expirationDate?: string;
  relevantDate?: string;
  locations?: Array<{ latitude: number; longitude: number; relevantText?: string }>;
}

export interface PassField {
  key: string;
  label?: string;
  value: string;
  textAlignment?: 'PKTextAlignmentLeft' | 'PKTextAlignmentCenter' | 'PKTextAlignmentRight' | 'PKTextAlignmentNatural';
}

// Default icons as base64 (minimal placeholder)
const DEFAULT_ICON = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGqSURBVHgB7ZrBDoIwDIa7+f6P7NmDMiYJHgQP4gPgxRvxYBQPxoNRPBgPRvFgPBhFQP/CLmQg3cY2xv+SJrAN7Fc6ugFQFEVRfpGyE8dxw8EB3uXNlrKw3eP7viHNIIqirCBPIvbsLMuaQZyUJEkbsl06zG0IIXmxzDMkeQCjKJoHQSBwnufP2ARWMCC7xPM8A5J30ZKN46VqNcHVKJyNiE2SpB96nicyT5dj7IZJkjwCLOshXMdpwI5OGDeQxC5b4lDCdh4EgYn+UzVJkj7AZoT3KNySW+VDSAeS1zRN1iFdXoNxM+h5npADwtihHsK9R8hO8eA+S9MUZFlm7xY3gF2FYVh3Hl2W5RgbBUAyEJZlCYIgsK9kYPFmUBL0CsIRPVPyjYJd2x0YsLNqA3YRBiF8M5x2gq0lB3Yd1hbG9h9C0gC7vEW0Bi8I3gdWA+vPMQySrG0PWLewbuqr0VjZWF8R0VqyMGmzwX8Z3hiyYBPDXODnkO0v5zluifSvWWJhMxLdFnAr0V2SHyG0S3JdhB9AKIoig/8BqGZNaKJbqowAAAAASUVORK5CYII=',
  'base64'
);

const DEFAULT_LOGO = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAPoAAABaCAYAAACse7pEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMSSURBVHgB7d0xchoxFIDhd+t0PgJH8BHcJT2NJ+NLuExqN27dZJhJnQN4SDrfwEdIQ7rEWwKy0EqLVrv/1wxgsZb9tJIW2M/r6+saAKb28/X1V/X59fUFABPz+f31tfb6+uoNYFLW//39/T+3v76+voH/mNV5xU7W/XK0QM86fHx8LJbLpZRlGb++vjb7Ga/+u7+/z3YON6fD+/v7bAKnB74/5D7V8eWoQ4d6HJumafz1x38qy1Le398X8/m8M2EYM7Bsz8d6CdSjejWbDf7x+Pi4cH2O71ePfHp6ehyT3DYdXl9f13d3d+LxGLN2fUf1CrvhVoMYm0Xuz2lXH/4gJ+twpzuD4xv/dF3HG7gBhKYRuk5w4+u+VK/M5/O5eD5FWX+37gH6sKM67NLh9/f3p5RRzh2/H7sXXfL/ukNcXl5KURTxSKe9K4LwSE/Xif58Pp/P9/f39Ww2kxc/Fwc70G+RnQ6bJq7EI4fAHrDXa4P9mCbIg+1o4dZbhEeQfddxHdjJ/pAFeyLI+5sPdtjnfdxgu9T2QL2fQ58xyK2xh+31NsIj2IVNDvDgP1e7n7HXU2JH+1pswCGD3fzd/d0xNTH4i9C2QE+6Qx6xNw74u9C2wGCDHerZdsht8Dv4k/4g/J0O/qSvwUZxRIDXyH7oDvZ4VIfeILuug+0fDiKDvmOQm8BGCO6zMQbZl3awQ/1f/Wev7+F0b2zwHbJbCH6Hwz+0BrtrC2TXZyewtzqsOvuaA50fQuSrH2Ln3VqD7LsGuhvkd1Jn+yE7DgnaWAP7c7BDhD5p63Dw0/bU18EOcH+oxVDn78eZNq8o8k8NdFewW+zzQUbo3+Q3fAg66Nfo/rS/X+J3cBv8RuiaQ/X+BpkXcti2fP8h2GFAn+Q3+BsJhLzYDbb7U/HQ2Q66tP01PkIN8jfsaBvkDvYHPKJ/0+fQ1wh00Lt1BQCm7P/wK/kkv9e/Ef6kTwH8XRxC91/H3LbYDlqD3cF+7+x8gWpHgPcFORQd7AfjxKA32BvD3LYdJH8J7I9hk92vw6DDb9fxO3+F/g38dR1/C+iHv7vD/wF/GofB7vDD/xD+uh3+F3D4FfgHXXR/CeQHPaR/C+gOOuR/D+gG2A5xBB3uT/qvYXd/Vf4fKOoZ6HaQxwLdIfg/4dB/H0H/C/B/gG6a8M8OAAAAASUVORK5CYII=',
  'base64'
);

export async function generatePass(data: PassData): Promise<Buffer> {
  const serialNumber = nanoid(16);
  const passType = data.passType || 'generic';
  
  // Convert hex colors to rgb if needed
  const backgroundColor = hexToRgb(data.backgroundColor || '#1a1a2e');
  const foregroundColor = hexToRgb(data.foregroundColor || '#ffffff');
  const labelColor = hexToRgb(data.labelColor || '#bbbbbb');

  // Check for certificates
  const certsPath = path.join(process.cwd(), 'certs');
  const hasCerts = fs.existsSync(path.join(certsPath, 'signerCert.pem'));
  
  if (!hasCerts) {
    // Generate demo pass without signing (for development)
    return generateDemoPass(data, serialNumber, backgroundColor, foregroundColor, labelColor);
  }

  // Production pass generation with signing
  const wwdr = fs.readFileSync(path.join(certsPath, 'wwdr.pem'));
  const signerCert = fs.readFileSync(path.join(certsPath, 'signerCert.pem'));
  const signerKey = fs.readFileSync(path.join(certsPath, 'signerKey.pem'));
  const signerKeyPassphrase = process.env.SIGNER_KEY_PASSPHRASE || '';

  // Build pass files
  const passFiles: Record<string, Buffer> = {
    'icon.png': data.icon ? Buffer.from(data.icon, 'base64') : DEFAULT_ICON,
    'icon@2x.png': data.icon ? Buffer.from(data.icon, 'base64') : DEFAULT_ICON,
    'logo.png': data.logo ? Buffer.from(data.logo, 'base64') : DEFAULT_LOGO,
    'logo@2x.png': data.logo ? Buffer.from(data.logo, 'base64') : DEFAULT_LOGO,
  };

  if (data.thumbnail) {
    passFiles['thumbnail.png'] = Buffer.from(data.thumbnail, 'base64');
    passFiles['thumbnail@2x.png'] = Buffer.from(data.thumbnail, 'base64');
  }

  if (data.strip) {
    passFiles['strip.png'] = Buffer.from(data.strip, 'base64');
    passFiles['strip@2x.png'] = Buffer.from(data.strip, 'base64');
  }

  const pass = new PKPass(passFiles, {
    wwdr,
    signerCert,
    signerKey,
    signerKeyPassphrase,
  }, {
    formatVersion: 1,
    passTypeIdentifier: process.env.PASS_TYPE_IDENTIFIER || 'pass.com.example.cuzdan',
    teamIdentifier: process.env.TEAM_IDENTIFIER || 'XXXXXXXXXX',
    organizationName: data.title || 'Cüzdan',
    description: data.description || data.title || 'Digital Pass',
    serialNumber,
    backgroundColor,
    foregroundColor,
    labelColor,
    logoText: data.logoText || data.title,
  });

  // Set barcode
  pass.setBarcodes({
    format: data.barcodeFormat || 'PKBarcodeFormatQR',
    message: data.barcodeData,
    messageEncoding: 'iso-8859-1',
    altText: data.barcodeAltText || data.barcodeData,
  });

  // Set pass type specific structure
  const passStructure = getPassStructure(passType, data);
  
  if (passType === 'generic') {
    pass.type = 'generic';
    if (passStructure.headerFields) pass.headerFields.push(...passStructure.headerFields);
    if (passStructure.primaryFields) pass.primaryFields.push(...passStructure.primaryFields);
    if (passStructure.secondaryFields) pass.secondaryFields.push(...passStructure.secondaryFields);
    if (passStructure.auxiliaryFields) pass.auxiliaryFields.push(...passStructure.auxiliaryFields);
  } else if (passType === 'storeCard') {
    pass.type = 'storeCard';
    if (passStructure.headerFields) pass.headerFields.push(...passStructure.headerFields);
    if (passStructure.primaryFields) pass.primaryFields.push(...passStructure.primaryFields);
    if (passStructure.secondaryFields) pass.secondaryFields.push(...passStructure.secondaryFields);
  } else if (passType === 'eventTicket') {
    pass.type = 'eventTicket';
    if (passStructure.headerFields) pass.headerFields.push(...passStructure.headerFields);
    if (passStructure.primaryFields) pass.primaryFields.push(...passStructure.primaryFields);
    if (passStructure.secondaryFields) pass.secondaryFields.push(...passStructure.secondaryFields);
  } else if (passType === 'coupon') {
    pass.type = 'coupon';
    if (passStructure.headerFields) pass.headerFields.push(...passStructure.headerFields);
    if (passStructure.primaryFields) pass.primaryFields.push(...passStructure.primaryFields);
  } else if (passType === 'boardingPass') {
    pass.type = 'boardingPass';
    pass.transitType = 'PKTransitTypeAir';
    if (passStructure.headerFields) pass.headerFields.push(...passStructure.headerFields);
    if (passStructure.primaryFields) pass.primaryFields.push(...passStructure.primaryFields);
    if (passStructure.secondaryFields) pass.secondaryFields.push(...passStructure.secondaryFields);
  }

  // Set expiration if provided
  if (data.expirationDate) {
    pass.setExpirationDate(new Date(data.expirationDate));
  }

  // Set relevant date if provided
  if (data.relevantDate) {
    pass.setRelevantDate(new Date(data.relevantDate));
  }

  // Add locations if provided
  if (data.locations && data.locations.length > 0) {
    pass.setLocations(...data.locations);
  }

  return pass.getAsBuffer();
}

// Generate a demo pass without Apple signing (for development)
async function generateDemoPass(
  data: PassData, 
  serialNumber: string,
  backgroundColor: string,
  foregroundColor: string,
  labelColor: string
): Promise<Buffer> {
  const { toBuffer: doNotZip } = await import('do-not-zip');
  
  const passType = data.passType || 'generic';
  const passStructure = getPassStructure(passType, data);
  
  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: 'pass.com.example.cuzdan.demo',
    teamIdentifier: 'DEMO000000',
    organizationName: data.title || 'Cüzdan',
    description: data.description || data.title || 'Digital Pass (Demo)',
    serialNumber,
    backgroundColor,
    foregroundColor,
    labelColor,
    logoText: data.logoText || data.title,
    barcodes: [{
      format: data.barcodeFormat || 'PKBarcodeFormatQR',
      message: data.barcodeData,
      messageEncoding: 'iso-8859-1',
      altText: data.barcodeAltText || data.barcodeData,
    }],
    [passType]: passStructure,
  };

  // Add optional dates
  if (data.expirationDate) {
    (passJson as any).expirationDate = data.expirationDate;
  }
  if (data.relevantDate) {
    (passJson as any).relevantDate = data.relevantDate;
  }

  // Create files for the pass
  const files = [
    { path: 'pass.json', data: JSON.stringify(passJson, null, 2) },
    { path: 'icon.png', data: data.icon ? Buffer.from(data.icon, 'base64') : DEFAULT_ICON },
    { path: 'icon@2x.png', data: data.icon ? Buffer.from(data.icon, 'base64') : DEFAULT_ICON },
    { path: 'logo.png', data: data.logo ? Buffer.from(data.logo, 'base64') : DEFAULT_LOGO },
    { path: 'logo@2x.png', data: data.logo ? Buffer.from(data.logo, 'base64') : DEFAULT_LOGO },
  ];

  if (data.thumbnail) {
    files.push({ path: 'thumbnail.png', data: Buffer.from(data.thumbnail, 'base64') });
  }
  if (data.strip) {
    files.push({ path: 'strip.png', data: Buffer.from(data.strip, 'base64') });
  }

  // Create manifest
  const manifest: Record<string, string> = {};
  for (const file of files) {
    const hash = new Bun.CryptoHasher('sha1');
    hash.update(typeof file.data === 'string' ? file.data : file.data);
    manifest[file.path] = hash.digest('hex');
  }
  
  files.push({ path: 'manifest.json', data: JSON.stringify(manifest, null, 2) });

  // Create zip (without signature for demo)
  const zipData = doNotZip(files.map(f => ({
    path: f.path,
    data: typeof f.data === 'string' ? f.data : new Uint8Array(f.data),
  })));

  return Buffer.from(zipData);
}

function getPassStructure(_passType: string, data: PassData) {
  const structure: any = {};
  
  if (data.headerFields && data.headerFields.length > 0) {
    structure.headerFields = data.headerFields;
  }
  
  if (data.primaryFields && data.primaryFields.length > 0) {
    structure.primaryFields = data.primaryFields;
  } else if (data.title) {
    structure.primaryFields = [{
      key: 'title',
      label: data.subtitle || '',
      value: data.title,
    }];
  }
  
  if (data.secondaryFields && data.secondaryFields.length > 0) {
    structure.secondaryFields = data.secondaryFields;
  }
  
  if (data.auxiliaryFields && data.auxiliaryFields.length > 0) {
    structure.auxiliaryFields = data.auxiliaryFields;
  }
  
  if (data.backFields && data.backFields.length > 0) {
    structure.backFields = data.backFields;
  }

  return structure;
}

function hexToRgb(hex: string): string {
  if (hex.startsWith('rgb')) return hex;
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result?.[1] && result[2] && result[3]) {
    return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
  }
  return 'rgb(26, 26, 46)';
}
