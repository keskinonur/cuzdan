import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Palette, 
  Type, 
  QrCode, 
  Share2,
  ChevronDown,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { PassData, BarcodeFormat } from '../types';
import { BarcodeScanner } from './BarcodeScanner';
import { useLanguage } from '../lib/LanguageContext';

interface PassBuilderProps {
  passData: PassData;
  onChange: (updates: Partial<PassData>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const barcodeFormats: { value: BarcodeFormat; label: string }[] = [
  { value: 'PKBarcodeFormatQR', label: 'QR Code' },
  { value: 'PKBarcodeFormatCode128', label: 'Code 128' },
  { value: 'PKBarcodeFormatPDF417', label: 'PDF417' },
  { value: 'PKBarcodeFormatAztec', label: 'Aztec' },
];

const colorPresets = [
  { name: 'Midnight', bg: '#1a1a2e', fg: '#ffffff' },
  { name: 'Ocean', bg: '#0f3460', fg: '#ffffff' },
  { name: 'Forest', bg: '#14532d', fg: '#ffffff' },
  { name: 'Sunset', bg: '#7c2d12', fg: '#ffffff' },
  { name: 'Royal', bg: '#533483', fg: '#ffffff' },
  { name: 'Slate', bg: '#374151', fg: '#ffffff' },
  { name: 'Coffee', bg: '#78350f', fg: '#ffffff' },
  { name: 'Rose', bg: '#881337', fg: '#ffffff' },
];

export function PassBuilder({ passData, onChange, onGenerate, isGenerating }: PassBuilderProps) {
  const { t } = useLanguage();
  const [showScanner, setShowScanner] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('barcode');

  const handleImageUpload = useCallback((file: File, type: 'logo' | 'icon' | 'thumbnail' | 'strip') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      onChange({ [type]: base64 });
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const onLogoDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      handleImageUpload(acceptedFiles[0], 'logo');
    }
  }, [handleImageUpload]);

  const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps } = useDropzone({
    onDrop: onLogoDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
  });

  const handleScanResult = useCallback((data: string) => {
    onChange({ barcodeData: data });
    setShowScanner(false);
  }, [onChange]);

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <div className="space-y-4">
      {/* Section: Barcode Data */}
      <Section 
        title={t('barcodeData')} 
        icon={QrCode}
        isExpanded={expandedSection === 'barcode'}
        onToggle={() => toggleSection('barcode')}
        requiredLabel={t('required')}
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setShowScanner(true)}
              className="btn-secondary flex items-center gap-2 flex-1"
            >
              <Camera className="w-4 h-4" />
              {t('scan')}
            </button>
            <label className="btn-secondary flex items-center gap-2 flex-1 cursor-pointer">
              <Upload className="w-4 h-4" />
              {t('upload')}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  // Handle QR image upload and decode
                  const file = e.target.files?.[0];
                  if (file) {
                    // For now, just show scanner
                    setShowScanner(true);
                  }
                }}
              />
            </label>
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={passData.barcodeData}
              onChange={(e) => onChange({ barcodeData: e.target.value })}
              placeholder={t('enterBarcodeManually')}
              className="w-full"
            />
            {passData.barcodeData && (
              <button
                onClick={() => onChange({ barcodeData: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">{t('barcodeFormat')}</label>
            <div className="grid grid-cols-2 gap-2">
              {barcodeFormats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => onChange({ barcodeFormat: format.value })}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${passData.barcodeFormat === format.value
                      ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                    }
                  `}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section: Pass Info */}
      <Section 
        title={t('passInformation')} 
        icon={Type}
        isExpanded={expandedSection === 'info'}
        onToggle={() => toggleSection('info')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">{t('title')} *</label>
            <input
              type="text"
              value={passData.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder={t('titlePlaceholder')}
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">{t('subtitle')}</label>
            <input
              type="text"
              value={passData.subtitle || ''}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder={t('subtitlePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">{t('description')}</label>
            <textarea
              value={passData.description || ''}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder={t('descriptionPlaceholder')}
              rows={2}
              className="w-full resize-none"
            />
          </div>
        </div>
      </Section>

      {/* Section: Appearance */}
      <Section 
        title={t('appearance')} 
        icon={Palette}
        isExpanded={expandedSection === 'appearance'}
        onToggle={() => toggleSection('appearance')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-3">{t('colorPresets')}</label>
            <div className="grid grid-cols-4 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onChange({ 
                    backgroundColor: preset.bg, 
                    foregroundColor: preset.fg 
                  })}
                  className={`
                    group relative h-12 rounded-xl transition-all overflow-hidden
                    ${passData.backgroundColor === preset.bg 
                      ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900' 
                      : 'hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: preset.bg }}
                  title={preset.name}
                >
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 text-xs font-medium text-white">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">{t('background')}</label>
              <div className="relative">
                <input
                  type="text"
                  value={passData.backgroundColor}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                  className="w-full pl-10"
                />
                <div 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded border border-white/20"
                  style={{ backgroundColor: passData.backgroundColor }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">{t('textColor')}</label>
              <div className="relative">
                <input
                  type="text"
                  value={passData.foregroundColor}
                  onChange={(e) => onChange({ foregroundColor: e.target.value })}
                  className="w-full pl-10"
                />
                <div 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded border border-white/20"
                  style={{ backgroundColor: passData.foregroundColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section: Logo */}
      <Section 
        title={t('logoAndImages')} 
        icon={ImageIcon}
        isExpanded={expandedSection === 'images'}
        onToggle={() => toggleSection('images')}
      >
        <div className="space-y-4">
          <div
            {...getLogoRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
              ${passData.logo 
                ? 'border-purple-500/50 bg-purple-500/10' 
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
              }
            `}
          >
            <input {...getLogoInputProps()} />
            {passData.logo ? (
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={`data:image/png;base64,${passData.logo}`} 
                  alt="Logo" 
                  className="h-12 object-contain"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange({ logo: undefined });
                  }}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="text-white/50">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{t('dropLogoHere')}</p>
                <p className="text-xs mt-1">{t('pngRecommended')}</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Generate Button */}
      <motion.button
        onClick={onGenerate}
        disabled={!passData.barcodeData || isGenerating}
        className={`
          w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3
          transition-all duration-300
          ${passData.barcodeData && !isGenerating
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 text-white'
            : 'bg-white/10 text-white/40 cursor-not-allowed'
          }
        `}
        whileHover={passData.barcodeData && !isGenerating ? { scale: 1.02 } : {}}
        whileTap={passData.barcodeData && !isGenerating ? { scale: 0.98 } : {}}
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t('generating')}
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5" />
            {t('createAndShare')}
          </>
        )}
      </motion.button>

      <p className="text-xs text-center text-white/40">
        {t('generateQrCode')}
      </p>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onResult={handleScanResult}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: typeof QrCode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  requiredLabel?: string;
}

function Section({ title, icon: Icon, children, isExpanded, onToggle, requiredLabel }: SectionProps) {
  return (
    <motion.div 
      className="glass rounded-2xl overflow-hidden"
      initial={false}
    >
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-purple-400" />
          <span className="font-medium">{title}</span>
          {requiredLabel && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
              {requiredLabel}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </button>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
