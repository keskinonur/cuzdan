import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, QrCode, Copy, Check, Smartphone } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { useLanguage } from '../lib/LanguageContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadUrl: string;
  passTitle: string;
  onDirectDownload: () => void;
}

export function ShareModal({ isOpen, onClose, downloadUrl, passTitle, onDirectDownload }: ShareModalProps) {
  const { t } = useLanguage();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (downloadUrl) {
      QRCodeLib.toDataURL(downloadUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).then(setQrCodeUrl).catch(console.error);
    }
  }, [downloadUrl]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm bg-gray-900 rounded-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-purple-400" />
              <span className="font-medium">{t('passReady')}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-center text-white/60 text-sm mb-4">
              {t('scanWithIphone')} <strong className="text-white">{passTitle}</strong> {t('toWallet')}
            </p>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-4 mx-auto w-fit mb-4">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-56 h-56" />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-white/40 justify-center mb-6">
              <Smartphone className="w-4 h-4" />
              <span>{t('opensInWallet')}</span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onDirectDownload}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t('downloadToDevice')}
              </button>

              <button
                onClick={handleCopy}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    {t('copied')}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {t('copyLink')}
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-white/30 text-xs mt-4">
              {t('linkExpires')}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
