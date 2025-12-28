import { useMemo } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import type { PassData } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface PassPreviewProps {
  passData: PassData;
}

export function PassPreview({ passData }: PassPreviewProps) {
  const { t } = useLanguage();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (passData.barcodeData && passData.barcodeFormat === 'PKBarcodeFormatQR') {
      QRCode.toDataURL(passData.barcodeData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).then(setQrCodeUrl).catch(() => setQrCodeUrl(''));
    } else {
      setQrCodeUrl('');
    }
  }, [passData.barcodeData, passData.barcodeFormat]);

  const isLight = useMemo(() => {
    const hex = passData.backgroundColor.replace('#', '');
    if (hex.length !== 6) return false;
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }, [passData.backgroundColor]);

  const textColor = passData.foregroundColor || (isLight ? '#000000' : '#ffffff');
  const labelColor = passData.labelColor || (isLight ? '#666666' : '#bbbbbb');

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-white/50 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {t('livePreview')}
      </div>
      
      <motion.div
        className="pass-3d"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div 
          className="pass-3d-inner w-[320px] rounded-2xl shadow-2xl overflow-hidden"
          style={{ 
            backgroundColor: passData.backgroundColor,
            boxShadow: `0 25px 50px -12px ${passData.backgroundColor}80`,
          }}
        >
          {/* Header */}
          <div className="p-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              {passData.logo ? (
                <img 
                  src={`data:image/png;base64,${passData.logo}`}
                  alt="Logo"
                  className="h-10 object-contain"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                  style={{ 
                    backgroundColor: `${textColor}20`,
                    color: textColor,
                  }}
                >
                  {passData.title?.charAt(0) || 'P'}
                </div>
              )}
              <div style={{ color: textColor }}>
                <div className="font-semibold text-lg leading-tight">
                  {passData.logoText || passData.title || 'Pass Title'}
                </div>
              </div>
            </div>
            
            {passData.headerFields && passData.headerFields.length > 0 && passData.headerFields[0] && (
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide" style={{ color: labelColor }}>
                  {passData.headerFields[0].label}
                </div>
                <div className="font-semibold" style={{ color: textColor }}>
                  {passData.headerFields[0].value}
                </div>
              </div>
            )}
          </div>

          {/* Divider line */}
          <div 
            className="h-px mx-5"
            style={{ backgroundColor: `${textColor}20` }}
          />

          {/* Primary Content */}
          <div className="p-5">
            {passData.subtitle && (
              <div 
                className="text-sm mb-1"
                style={{ color: labelColor }}
              >
                {passData.subtitle}
              </div>
            )}
            <div 
              className="text-2xl font-bold"
              style={{ color: textColor }}
            >
              {passData.title || 'Your Pass Title'}
            </div>
            
            {passData.description && (
              <div 
                className="text-sm mt-2 opacity-80"
                style={{ color: textColor }}
              >
                {passData.description}
              </div>
            )}
          </div>

          {/* Secondary Fields */}
          {passData.secondaryFields && passData.secondaryFields.length > 0 && (
            <div className="px-5 pb-3 grid grid-cols-2 gap-4">
              {passData.secondaryFields.slice(0, 4).map((field, i) => (
                <div key={i}>
                  <div className="text-xs uppercase tracking-wide" style={{ color: labelColor }}>
                    {field.label}
                  </div>
                  <div className="font-medium" style={{ color: textColor }}>
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Barcode Section */}
          <div className="p-5 pt-2">
            <div className="bg-white rounded-xl p-4 flex flex-col items-center">
                {passData.barcodeData ? (
                <>
                  {passData.barcodeFormat === 'PKBarcodeFormatQR' && qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-40 h-40"
                    />
                  ) : passData.barcodeFormat === 'PKBarcodeFormatCode128' ? (
                    <div className="w-full h-16 flex items-center justify-center">
                      <Code128Barcode data={passData.barcodeData} />
                    </div>
                  ) : passData.barcodeFormat === 'PKBarcodeFormatPDF417' ? (
                    <div className="w-full flex items-center justify-center">
                      <PDF417Barcode data={passData.barcodeData} />
                    </div>
                  ) : passData.barcodeFormat === 'PKBarcodeFormatAztec' ? (
                    <div className="w-36 h-36 flex items-center justify-center">
                      <AztecBarcode data={passData.barcodeData} />
                    </div>
                  ) : (
                    <div className="w-40 h-40 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs text-center px-2">
                        {passData.barcodeFormat.replace('PKBarcodeFormat', '')}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-gray-600 mt-2 font-mono">
                    {passData.barcodeAltText || passData.barcodeData}
                  </div>
                </>
              ) : (
                <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">{t('noBarcode')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* iPhone frame hint */}
      <div className="mt-6 text-xs text-white/30 text-center max-w-xs">
        {t('previewHint')}
      </div>
    </div>
  );
}

function Code128Barcode({ data }: { data: string }) {
  // Simple visual representation of Code128 barcode
  const bars = useMemo(() => {
    const result: boolean[] = [];
    // Generate deterministic pattern based on data
    for (let i = 0; i < Math.min(data.length * 11, 120); i++) {
      const charCode = data.charCodeAt(i % data.length) || 0;
      result.push((charCode + i) % 3 !== 0);
    }
    return result;
  }, [data]);

  return (
    <div className="flex h-14 items-end">
      {bars.map((filled, i) => (
        <div
          key={i}
          className={filled ? 'bg-black' : 'bg-white'}
          style={{ 
            width: (i % 4 === 0) ? '2px' : '1px',
            height: '100%'
          }}
        />
      ))}
    </div>
  );
}

function PDF417Barcode({ data }: { data: string }) {
  // PDF417 is a stacked linear barcode - multiple rows of bars
  const rows = useMemo(() => {
    const result: boolean[][] = [];
    const numRows = 8;
    const colsPerRow = 60;
    
    for (let row = 0; row < numRows; row++) {
      const rowData: boolean[] = [];
      for (let col = 0; col < colsPerRow; col++) {
        const charCode = data.charCodeAt((row + col) % data.length) || 0;
        rowData.push((charCode + row + col) % 3 !== 0);
      }
      result.push(rowData);
    }
    return result;
  }, [data]);

  return (
    <div className="flex flex-col gap-px">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex h-3">
          {row.map((filled, colIndex) => (
            <div
              key={colIndex}
              className={filled ? 'bg-black' : 'bg-white'}
              style={{ width: colIndex % 5 === 0 ? '3px' : '2px' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function AztecBarcode({ data }: { data: string }) {
  // Aztec is a square 2D barcode with a bullseye center
  const grid = useMemo(() => {
    const size = 15;
    const result: boolean[][] = [];
    
    for (let row = 0; row < size; row++) {
      const rowData: boolean[] = [];
      for (let col = 0; col < size; col++) {
        const centerDist = Math.max(Math.abs(row - 7), Math.abs(col - 7));
        
        // Create bullseye pattern in center
        if (centerDist <= 3) {
          if (centerDist === 0) rowData.push(true);
          else if (centerDist === 1) rowData.push(false);
          else if (centerDist === 2) rowData.push(true);
          else if (centerDist === 3) rowData.push(false);
          else rowData.push(true);
        } else {
          // Data area - deterministic pattern based on input
          const charCode = data.charCodeAt((row + col) % data.length) || 0;
          rowData.push((charCode + row * col) % 2 === 0);
        }
      }
      result.push(rowData);
    }
    return result;
  }, [data]);

  return (
    <div className="flex flex-col">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((filled, colIndex) => (
            <div
              key={colIndex}
              className={filled ? 'bg-black' : 'bg-white'}
              style={{ width: '8px', height: '8px' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
