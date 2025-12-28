import { Heart } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

type Page = 'home' | 'docs' | 'api';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-white/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-sm text-white/40">
            <span>{t('madeWith')}</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span>{t('using')}</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <button 
              onClick={() => onNavigate('docs')}
              className="text-white/40 hover:text-white transition-colors"
            >
              {t('documentation')}
            </button>
            <button 
              onClick={() => onNavigate('api')}
              className="text-white/40 hover:text-white transition-colors"
            >
              {t('api')}
            </button>
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-white/30">
          <p>
            {t('disclaimer')}
          </p>
          <p className="mt-2">
            {t('passesForPersonalUse')}
          </p>
        </div>
      </div>
    </footer>
  );
}
