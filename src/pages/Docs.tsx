import { motion } from 'framer-motion';
import { 
  Book, 
  Zap, 
  Shield,
  Camera, 
  Palette,
  QrCode,
  Smartphone,
  Key,
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function Docs() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Book className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold">{t('docsTitle')}</h1>
          </div>
          <p className="text-white/60 text-lg">
            {t('docsSubtitle')}
          </p>
        </motion.div>

        {/* Quick Start */}
        <Section title={t('quickStart')} icon={Zap} delay={0.1}>
          <div className="space-y-4">
            <p className="text-white/70">
              {t('quickStartIntro')}
            </p>
            <ol className="space-y-3">
              <Step number={1} title={t('step1Title')}>
                {t('step1Desc')}
              </Step>
              <Step number={2} title={t('step2Title')}>
                {t('step2Desc')}
              </Step>
              <Step number={3} title={t('step3Title')}>
                {t('step3Desc')}
              </Step>
              <Step number={4} title={t('step4Title')}>
                {t('step4Desc')}
              </Step>
            </ol>
          </div>
        </Section>

        {/* Pass Types */}
        <Section title={t('passTypes')} icon={FileCode} delay={0.2}>
          <div className="grid gap-4">
            <PassTypeCard
              name={t('storeCardTitle')}
              description={t('storeCardDesc')}
              examples={['Starbucks Rewards', 'Gym Membership', 'Store Loyalty Card']}
            />
            <PassTypeCard
              name={t('eventTicketTitle')}
              description={t('eventTicketDocDesc')}
              examples={['Concert Tickets', 'Movie Passes', 'Conference Badges']}
            />
            <PassTypeCard
              name={t('boardingPassTitle')}
              description={t('boardingPassDocDesc')}
              examples={['Flight Tickets', 'Train Passes', 'Bus Tickets']}
            />
            <PassTypeCard
              name={t('couponTitle')}
              description={t('couponDocDesc')}
              examples={['20% Off Coupon', 'Free Item Offer', 'Gift Card']}
            />
            <PassTypeCard
              name={t('genericTitle')}
              description={t('genericDocDesc')}
              examples={['Library Card', 'Student ID', 'Insurance Card']}
            />
          </div>
        </Section>

        {/* Barcode Formats */}
        <Section title={t('supportedBarcodes')} icon={QrCode} delay={0.3}>
          <div className="grid sm:grid-cols-2 gap-4">
            <BarcodeCard
              name={t('qrCode')}
              description={t('qrCodeDesc')}
              recommendedLabel={t('recommended')}
              recommended
            />
            <BarcodeCard
              name="Code 128"
              description={t('code128Desc')}
              recommendedLabel={t('recommended')}
            />
            <BarcodeCard
              name="PDF417"
              description={t('pdf417Desc')}
              recommendedLabel={t('recommended')}
            />
            <BarcodeCard
              name="Aztec"
              description={t('aztecDesc')}
              recommendedLabel={t('recommended')}
            />
          </div>
        </Section>

        {/* Camera Scanning */}
        <Section title={t('barcodeScanning')} icon={Camera} delay={0.4}>
          <div className="space-y-4 text-white/70">
            <p>
              {t('barcodeScanningIntro')}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span>{t('scanStep1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span>{t('scanStep2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span>{t('scanStep3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span>{t('scanStep4')}</span>
              </li>
            </ul>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-yellow-200/80 text-sm">
                  {t('scanningTip')}
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Customization */}
        <Section title={t('customizationOptions')} icon={Palette} delay={0.5}>
          <div className="space-y-6 text-white/70">
            <div>
              <h4 className="font-medium text-white mb-2">{t('colors')}</h4>
              <p className="mb-3">
                {t('colorsDesc')}
              </p>
              <ul className="space-y-1 ml-4">
                <li>• <strong className="text-white">{t('bgColorLabel')}</strong> - {t('bgColorDesc')}</li>
                <li>• <strong className="text-white">{t('textColorLabel')}</strong> - {t('textColorDesc')}</li>
                <li>• <strong className="text-white">{t('labelColorLabel')}</strong> - {t('labelColorDesc')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">{t('images')}</h4>
              <ul className="space-y-1 ml-4">
                <li>• <strong className="text-white">Logo</strong> - {t('logoDesc')}</li>
                <li>• <strong className="text-white">Icon</strong> - {t('iconDesc')}</li>
                <li>• <strong className="text-white">Strip</strong> - {t('stripDesc')}</li>
                <li>• <strong className="text-white">Thumbnail</strong> - {t('thumbnailDesc')}</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Adding to Wallet */}
        <Section title={t('addingToWallet')} icon={Smartphone} delay={0.6}>
          <div className="space-y-4 text-white/70">
            <p>{t('afterDownloading')}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-medium text-white mb-2">{t('onIphone')}</h4>
                <ol className="space-y-1 text-sm">
                  <li>1. {t('iphoneStep1')}</li>
                  <li>2. {t('iphoneStep2')}</li>
                  <li>3. {t('iphoneStep3')}</li>
                  <li>4. {t('iphoneStep4')}</li>
                </ol>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-medium text-white mb-2">{t('viaAirdrop')}</h4>
                <ol className="space-y-1 text-sm">
                  <li>1. {t('airdropStep1')}</li>
                  <li>2. {t('airdropStep2')}</li>
                  <li>3. {t('airdropStep3')}</li>
                  <li>4. {t('airdropStep4')}</li>
                </ol>
              </div>
            </div>
          </div>
        </Section>

        {/* Self-Hosting */}
        <Section title={t('certSetup')} icon={Key} delay={0.7}>
          <div className="space-y-4 text-white/70">
            <p>
              {t('certSetupIntro')}
            </p>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="font-medium text-white">1. {t('getDeveloperAccount')}</h4>
              <p className="text-sm">
                {t('getDeveloperAccountDesc')} - <a href="https://developer.apple.com/programs/" target="_blank" rel="noopener" 
                  className="text-purple-400 hover:text-purple-300">developer.apple.com/programs</a>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="font-medium text-white">2. {t('createPassTypeId')}</h4>
              <p className="text-sm">
                {t('createPassTypeIdDesc')} - <a href="https://developer.apple.com/account/resources/identifiers/list/passTypeId" target="_blank" rel="noopener" 
                  className="text-purple-400 hover:text-purple-300">Identifiers → Pass Type IDs</a>
                (e.g., <code className="px-1 py-0.5 rounded bg-white/10">pass.com.yourcompany.wallet</code>)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="font-medium text-white">3. {t('createCertificate')}</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>{t('createCertStep1')}</li>
                <li>{t('createCertStep2')}</li>
                <li>{t('createCertStep3')}</li>
                <li>{t('createCertStep4')}</li>
                <li>{t('createCertStep5')}</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="font-medium text-white">4. {t('exportFromKeychain')}</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>{t('exportStep1')}</li>
                <li>{t('exportStep2')}</li>
                <li>{t('exportStep3')}</li>
                <li>{t('exportStep4')}</li>
                <li>{t('exportStep5')}</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="font-medium text-white">5. {t('convertToPem')}</h4>
              <p className="text-sm text-white/60 mb-2">{t('convertToPemDesc')}</p>
              <pre className="text-sm bg-black/30 p-3 rounded-lg overflow-x-auto">
{`# Extract certificate and key
openssl pkcs12 -in Certificates.p12 -clcerts -nokeys -out signerCert.pem -legacy
openssl pkcs12 -in Certificates.p12 -nocerts -out signerKey.pem -legacy`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="font-medium text-white">6. {t('downloadWwdr')}</h4>
              <p className="text-sm mb-2">
                {t('downloadWwdrDesc')} - <a href="https://www.apple.com/certificateauthority/" target="_blank" rel="noopener" 
                  className="text-purple-400 hover:text-purple-300">Apple PKI</a>
              </p>
              <pre className="text-sm bg-black/30 p-3 rounded-lg overflow-x-auto">
{`# Convert to PEM
openssl x509 -in AppleWWDRCAG4.cer -inform DER -out wwdr.pem`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="font-medium text-white">7. {t('configure')}</h4>
              <p className="text-sm mb-2">{t('configureDesc')}</p>
              <pre className="text-sm bg-black/30 p-3 rounded-lg overflow-x-auto">
{`PASS_TYPE_IDENTIFIER=pass.com.yourcompany.wallet
TEAM_IDENTIFIER=YOUR_TEAM_ID
SIGNER_KEY_PASSPHRASE=your_pem_password`}
              </pre>
              <p className="text-sm mt-2">
                {t('findTeamId')} - <a href="https://developer.apple.com/account/#/membership" target="_blank" rel="noopener" 
                  className="text-purple-400 hover:text-purple-300">Membership Details</a>
              </p>
            </div>
          </div>
        </Section>

        {/* Privacy */}
        <Section title={t('privacySecurity')} icon={Shield} delay={0.8}>
          <div className="space-y-4 text-white/70">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span><strong className="text-white">{t('localProcessing')}</strong> - {t('localProcessingDesc')}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span><strong className="text-white">{t('noDataStorage')}</strong> - {t('noDataStorageDesc')}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span><strong className="text-white">{t('cameraPrivacy')}</strong> - {t('cameraPrivacyDesc')}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span><strong className="text-white">{t('openSource')}</strong> - {t('openSourceDesc')}</span>
              </li>
            </ul>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ 
  title, 
  icon: Icon, 
  children, 
  delay = 0 
}: { 
  title: string; 
  icon: typeof Book; 
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="pl-8">
        {children}
      </div>
    </motion.section>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-medium text-white">{title}</h4>
        <p className="text-white/60 text-sm">{children}</p>
      </div>
    </li>
  );
}

function PassTypeCard({ name, description, examples }: { name: string; description: string; examples: string[] }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <h4 className="font-medium text-white mb-2">{name}</h4>
      <p className="text-white/60 text-sm mb-3">{description}</p>
      <div className="flex flex-wrap gap-2">
        {examples.map((example, i) => (
          <span key={i} className="px-2 py-1 rounded-lg bg-white/5 text-xs text-white/50">
            {example}
          </span>
        ))}
      </div>
    </div>
  );
}

function BarcodeCard({ name, description, recommended, recommendedLabel }: { name: string; description: string; recommended?: boolean; recommendedLabel: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative">
      {recommended && (
        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
          {recommendedLabel}
        </span>
      )}
      <h4 className="font-medium text-white mb-1">{name}</h4>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
  );
}
