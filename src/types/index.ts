export type PassType = 'generic' | 'boardingPass' | 'coupon' | 'eventTicket' | 'storeCard';
export type BarcodeFormat = 'PKBarcodeFormatQR' | 'PKBarcodeFormatPDF417' | 'PKBarcodeFormatAztec' | 'PKBarcodeFormatCode128';

export interface PassField {
  key: string;
  label?: string;
  value: string;
  textAlignment?: 'PKTextAlignmentLeft' | 'PKTextAlignmentCenter' | 'PKTextAlignmentRight' | 'PKTextAlignmentNatural';
}

export interface PassData {
  // Basic info
  title: string;
  subtitle?: string;
  description?: string;
  
  // Appearance
  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;
  logoText?: string;
  
  // Barcode
  barcodeData: string;
  barcodeFormat: BarcodeFormat;
  barcodeAltText?: string;
  
  // Pass type and fields
  passType: PassType;
  headerFields?: PassField[];
  primaryFields?: PassField[];
  secondaryFields?: PassField[];
  auxiliaryFields?: PassField[];
  backFields?: PassField[];
  
  // Images (base64)
  logo?: string | undefined;
  icon?: string | undefined;
  thumbnail?: string | undefined;
  strip?: string | undefined;
  
  // Additional
  expirationDate?: string;
  relevantDate?: string;
  locations?: Array<{ latitude: number; longitude: number; relevantText?: string }>;
}

export interface PassTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultColor: string;
  passType: PassType;
  previewImage?: string;
}
