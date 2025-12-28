import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Ticket, 
  Plane, 
  Tag, 
  IdCard,
  Store,
  Coffee,
  Dumbbell,
  BookOpen,
  ShoppingBag
} from 'lucide-react';
import type { PassTemplate, PassType } from '../types';
import { useLanguage } from '../lib/LanguageContext';
import type { TranslationKey } from '../lib/i18n';

interface TemplateConfig {
  id: string;
  nameKey: TranslationKey;
  descKey: TranslationKey;
  icon: string;
  defaultColor: string;
  passType: PassType;
}

const templateConfigs: TemplateConfig[] = [
  {
    id: 'loyalty',
    nameKey: 'loyaltyCard',
    descKey: 'loyaltyCardDesc',
    icon: 'store',
    defaultColor: '#1a1a2e',
    passType: 'storeCard',
  },
  {
    id: 'event',
    nameKey: 'eventTicket',
    descKey: 'eventTicketDesc',
    icon: 'ticket',
    defaultColor: '#0f3460',
    passType: 'eventTicket',
  },
  {
    id: 'boarding',
    nameKey: 'boardingPass',
    descKey: 'boardingPassDesc',
    icon: 'plane',
    defaultColor: '#16213e',
    passType: 'boardingPass',
  },
  {
    id: 'coupon',
    nameKey: 'coupon',
    descKey: 'couponDesc',
    icon: 'tag',
    defaultColor: '#533483',
    passType: 'coupon',
  },
  {
    id: 'coffee',
    nameKey: 'coffeeCard',
    descKey: 'coffeeCardDesc',
    icon: 'coffee',
    defaultColor: '#78350f',
    passType: 'storeCard',
  },
  {
    id: 'gym',
    nameKey: 'gymMembership',
    descKey: 'gymMembershipDesc',
    icon: 'gym',
    defaultColor: '#14532d',
    passType: 'generic',
  },
  {
    id: 'library',
    nameKey: 'libraryCard',
    descKey: 'libraryCardDesc',
    icon: 'book',
    defaultColor: '#1e3a5f',
    passType: 'generic',
  },
  {
    id: 'retail',
    nameKey: 'retailRewards',
    descKey: 'retailRewardsDesc',
    icon: 'shopping',
    defaultColor: '#7c2d12',
    passType: 'storeCard',
  },
  {
    id: 'generic',
    nameKey: 'genericPass',
    descKey: 'genericPassDesc',
    icon: 'id',
    defaultColor: '#374151',
    passType: 'generic',
  },
];

const iconMap: Record<string, typeof CreditCard> = {
  store: Store,
  ticket: Ticket,
  plane: Plane,
  tag: Tag,
  id: IdCard,
  card: CreditCard,
  coffee: Coffee,
  gym: Dumbbell,
  book: BookOpen,
  shopping: ShoppingBag,
};

interface TemplateSelectorProps {
  onSelect: (template: PassTemplate) => void;
  selectedTemplate: PassTemplate | null;
}

export function TemplateSelector({ onSelect, selectedTemplate }: TemplateSelectorProps) {
  const { t } = useLanguage();

  // Build templates with translated names
  const templates: PassTemplate[] = templateConfigs.map(config => ({
    id: config.id,
    name: t(config.nameKey),
    description: t(config.descKey),
    icon: config.icon,
    defaultColor: config.defaultColor,
    passType: config.passType,
  }));

  return (
    <section className="py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {templates.map((template, index) => {
          const Icon = iconMap[template.icon] || CreditCard;
          const isSelected = selectedTemplate?.id === template.id;
          
          return (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSelect(template)}
              className={`
                group relative p-6 rounded-2xl text-left transition-all duration-300
                ${isSelected 
                  ? 'glass-strong ring-2 ring-purple-500/50' 
                  : 'glass hover:glass-strong'
                }
              `}
            >
              {/* Gradient background on hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${template.defaultColor}40 0%, transparent 100%)`,
                }}
              />
              
              <div className="relative z-10">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: template.defaultColor }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="font-semibold text-lg text-white mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-white/50">
                  {template.description}
                </p>
              </div>
              
              {/* Arrow indicator */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <svg 
                  className="w-5 h-5 text-white/50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
