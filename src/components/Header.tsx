import { motion } from 'framer-motion';
import { Wallet, RotateCcw, Github, Book, Code, Globe } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

type Page = 'home' | 'docs' | 'api';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Header({ onReset, showReset, currentPage, onNavigate }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight">{t('appName')}</span>
              <span className="text-[10px] sm:text-xs text-white/50 -mt-1 hidden xs:block">{t('appTagline')}</span>
            </div>
          </motion.button>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink 
              active={currentPage === 'home'} 
              onClick={() => onNavigate('home')}
            >
              {t('home')}
            </NavLink>
            <NavLink 
              active={currentPage === 'docs'} 
              onClick={() => onNavigate('docs')}
              icon={Book}
            >
              {t('docs')}
            </NavLink>
            <NavLink 
              active={currentPage === 'api'} 
              onClick={() => onNavigate('api')}
              icon={Code}
            >
              {t('api')}
            </NavLink>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            {showReset && currentPage === 'home' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onReset}
                className="btn-secondary flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('startOver')}</span>
              </motion.button>
            )}
            
            {/* Mobile nav */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => onNavigate('docs')}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  currentPage === 'docs' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Book className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => onNavigate('api')}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  currentPage === 'api' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Code className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs sm:text-sm font-medium"
              title={language === 'en' ? 'Switch to Turkish' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60" />
              <span className="text-white/80">{language.toUpperCase()}</span>
            </button>
            
            <a
              href="https://github.com/keskinonur/cuzdan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors hidden xs:block"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ 
  children, 
  active, 
  onClick, 
  icon: Icon 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
  icon?: typeof Book;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
        ${active 
          ? 'bg-white/10 text-white' 
          : 'text-white/60 hover:text-white hover:bg-white/5'
        }
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
