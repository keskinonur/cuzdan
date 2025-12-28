import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PassBuilder } from './components/PassBuilder';
import { PassPreview } from './components/PassPreview';
import { TemplateSelector } from './components/TemplateSelector';
import { Footer } from './components/Footer';
import { BackgroundEffects } from './components/BackgroundEffects';
import { ShareModal } from './components/ShareModal';
import { Docs } from './pages/Docs';
import { Api } from './pages/Api';
import { useLanguage } from './lib/LanguageContext';
import type { PassData, PassTemplate } from './types';
import { Eye, EyeOff } from 'lucide-react';

type Page = 'home' | 'docs' | 'api';

interface ShareInfo {
  downloadUrl: string;
  passTitle: string;
}

const defaultPassData: PassData = {
  title: 'My Card',
  subtitle: '',
  description: '',
  backgroundColor: '#1a1a2e',
  foregroundColor: '#ffffff',
  labelColor: '#bbbbbb',
  logoText: '',
  barcodeData: '',
  barcodeFormat: 'PKBarcodeFormatQR',
  passType: 'generic',
  headerFields: [],
  primaryFields: [],
  secondaryFields: [],
  auxiliaryFields: [],
};

export default function App() {
  const { t } = useLanguage();
  const [page, setPage] = useState<Page>('home');
  const [passData, setPassData] = useState<PassData>(defaultPassData);
  const [selectedTemplate, setSelectedTemplate] = useState<PassTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const builderRef = useRef<HTMLDivElement>(null);

  // Handle browser navigation
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      if (path === '/docs') {
        setPage('docs');
      } else if (path === '/api') {
        setPage('api');
      } else {
        setPage('home');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  const navigate = (newPage: Page) => {
    const path = newPage === 'home' ? '/' : `/${newPage}`;
    window.history.pushState({}, '', path);
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleTemplateSelect = useCallback((template: PassTemplate) => {
    setSelectedTemplate(template);
    setPassData(prev => ({
      ...prev,
      passType: template.passType,
      backgroundColor: template.defaultColor,
      title: template.name,
    }));
    setShowBuilder(true);
    setShowPreviewMobile(false);
    // Scroll to top after a brief delay to ensure DOM is ready
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  const handlePassDataChange = useCallback((updates: Partial<PassData>) => {
    setPassData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!passData.barcodeData) {
      alert('Please enter barcode data');
      return;
    }

    setIsGenerating(true);
    try {
      // Request JSON response to get share URL
      const response = await fetch('/api/pass/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(passData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate pass');
      }

      const data = await response.json();
      
      // Show share modal with QR code
      setShareInfo({
        downloadUrl: data.downloadUrl,
        passTitle: passData.title || 'Pass',
      });
    } catch (error) {
      console.error('Error generating pass:', error);
      alert('Failed to generate pass. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [passData]);

  const handleDirectDownload = useCallback(async () => {
    if (!shareInfo) return;

    // Fetch the pass directly
    const response = await fetch(shareInfo.downloadUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shareInfo.passTitle}.pkpass`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShareInfo(null);
  }, [shareInfo]);

  const handleReset = useCallback(() => {
    setPassData(defaultPassData);
    setSelectedTemplate(null);
    setShowBuilder(false);
  }, []);

  const handleHomeClick = () => {
    handleReset();
    navigate('home');
  };

  return (
    <div className="min-h-screen relative noise">
      <BackgroundEffects />
      
      <div className="relative z-10">
        <Header 
          onReset={handleHomeClick} 
          showReset={showBuilder || page !== 'home'} 
          currentPage={page}
          onNavigate={navigate}
        />
        
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {page === 'docs' ? (
              <motion.div
                key="docs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Docs />
              </motion.div>
            ) : page === 'api' ? (
              <motion.div
                key="api"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Api />
              </motion.div>
            ) : !showBuilder ? (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Hero />
                <TemplateSelector 
                  onSelect={handleTemplateSelect} 
                  selectedTemplate={selectedTemplate}
                />
              </motion.div>
            ) : (
              <motion.div
                key="builder"
                ref={builderRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-8 items-start"
              >
                <div>
                  <PassBuilder 
                    passData={passData}
                    onChange={handlePassDataChange}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                  />
                  
                  {/* Mobile Preview Toggle */}
                  <button
                    onClick={() => setShowPreviewMobile(!showPreviewMobile)}
                    className="lg:hidden w-full mt-4 py-3 rounded-xl glass flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    {showPreviewMobile ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>{t('hidePreview')}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>{t('showPreview')}</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Desktop: always show, Mobile: toggle */}
                <div className={`lg:sticky lg:top-24 ${showPreviewMobile ? 'block' : 'hidden lg:block'}`}>
                  <PassPreview passData={passData} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        <Footer onNavigate={navigate} />
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={!!shareInfo}
        onClose={() => setShareInfo(null)}
        downloadUrl={shareInfo?.downloadUrl || ''}
        passTitle={shareInfo?.passTitle || ''}
        onDirectDownload={handleDirectDownload}
      />
    </div>
  );
}
