import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Copy, 
  Check,
  Zap,
  Lock,
  Globe,
  Layers
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function Api() {
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
              <Code className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold">{t('apiTitle')}</h1>
          </div>
          <p className="text-white/60 text-lg">
            {t('apiSubtitle')}
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          <FeatureCard icon={Zap} title={t('fast')} description={t('fastDesc')} />
          <FeatureCard icon={Lock} title={t('secure')} description={t('secureDesc')} />
          <FeatureCard icon={Globe} title={t('restApi')} description={t('restApiDesc')} />
          <FeatureCard icon={Layers} title={t('allPassTypes')} description={t('allPassTypesDesc')} />
        </motion.div>

        {/* Base URL */}
        <Section title={t('baseUrl')} delay={0.2}>
          <CodeBlock language="bash" code="http://localhost:3002/api" />
          <p className="mt-3 text-white/50 text-sm">
            {t('baseUrlNote')}
          </p>
        </Section>

        {/* Endpoints */}
        <Section title={t('endpoints')} delay={0.3}>
          <div className="space-y-6">
            {/* Generate Pass */}
            <EndpointCard
              method="POST"
              path="/pass/generate"
              description={t('generatePass')}
            >
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-white/80 mb-2">{t('requestBody')}</h5>
                  <CodeBlock 
                    language="json" 
                    code={`{
  "title": "My Loyalty Card",
  "subtitle": "Gold Member",
  "description": "Rewards program membership",
  "barcodeData": "1234567890",
  "barcodeFormat": "PKBarcodeFormatQR",
  "backgroundColor": "#1a1a2e",
  "foregroundColor": "#ffffff",
  "labelColor": "#bbbbbb",
  "passType": "storeCard",
  "logoText": "ACME Store",
  "headerFields": [
    { "key": "points", "label": "POINTS", "value": "1,250" }
  ],
  "secondaryFields": [
    { "key": "member", "label": "MEMBER SINCE", "value": "2024" }
  ]
}`} 
                  />
                </div>

                <div>
                  <h5 className="text-sm font-medium text-white/80 mb-2">{t('response')}</h5>
                  <p className="text-white/60 text-sm mb-2">
                    Returns <code className="px-1 py-0.5 rounded bg-white/10">application/vnd.apple.pkpass</code> binary file
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-white/80 mb-2">{t('exampleCurl')}</h5>
                  <CodeBlock 
                    language="bash" 
                    code={`curl -X POST http://localhost:3002/api/pass/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Coffee Card",
    "barcodeData": "COFFEE123",
    "barcodeFormat": "PKBarcodeFormatQR",
    "backgroundColor": "#78350f",
    "passType": "storeCard"
  }' \\
  -o coffee-card.pkpass`} 
                  />
                </div>
              </div>
            </EndpointCard>

            {/* Get Templates */}
            <EndpointCard
              method="GET"
              path="/pass/templates"
              description={t('getTemplates')}
            >
              <div>
                <h5 className="text-sm font-medium text-white/80 mb-2">{t('response')}</h5>
                <CodeBlock 
                  language="json" 
                  code={`[
  {
    "id": "loyalty",
    "name": "Loyalty Card",
    "description": "Store loyalty and membership cards",
    "icon": "store",
    "defaultColor": "#1a1a2e"
  },
  {
    "id": "event",
    "name": "Event Ticket",
    "description": "Concert, sports, and event tickets",
    "icon": "ticket",
    "defaultColor": "#0f3460"
  }
  // ... more templates
]`} 
                />
              </div>
            </EndpointCard>

            {/* Preview */}
            <EndpointCard
              method="POST"
              path="/pass/preview"
              description={t('validatePass')}
            >
              <div>
                <h5 className="text-sm font-medium text-white/80 mb-2">{t('response')}</h5>
                <CodeBlock 
                  language="json" 
                  code={`{
  "success": true,
  "preview": {
    "title": "My Card",
    "serialNumber": "PREVIEW-1703764800000",
    // ... validated pass data
  }
}`} 
                />
              </div>
            </EndpointCard>

            {/* Health */}
            <EndpointCard
              method="GET"
              path="/health"
              description={t('healthCheck')}
            >
              <div>
                <h5 className="text-sm font-medium text-white/80 mb-2">{t('response')}</h5>
                <CodeBlock 
                  language="json" 
                  code={`{
  "status": "ok",
  "timestamp": "2024-12-28T12:00:00.000Z"
}`} 
                />
              </div>
            </EndpointCard>
          </div>
        </Section>

        {/* Request Body Reference */}
        <Section title={t('requestBodyRef')} delay={0.4}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-medium text-white">{t('field')}</th>
                  <th className="text-left py-3 px-4 font-medium text-white">{t('type')}</th>
                  <th className="text-left py-3 px-4 font-medium text-white">{t('required')}</th>
                  <th className="text-left py-3 px-4 font-medium text-white">{t('description')}</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <TableRow field="title" type="string" required requiredLabel={t('required')} optionalLabel={t('optional')} description="Pass title (max 64 chars)" />
                <TableRow field="barcodeData" type="string" required requiredLabel={t('required')} optionalLabel={t('optional')} description="Barcode content (max 512 chars)" />
                <TableRow field="barcodeFormat" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="PKBarcodeFormatQR, PKBarcodeFormatCode128, PKBarcodeFormatPDF417, PKBarcodeFormatAztec" />
                <TableRow field="passType" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="generic, storeCard, eventTicket, boardingPass, coupon" />
                <TableRow field="backgroundColor" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="Hex color (e.g., #1a1a2e)" />
                <TableRow field="foregroundColor" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="Text color (hex)" />
                <TableRow field="labelColor" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="Label color (hex)" />
                <TableRow field="subtitle" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="Secondary title text" />
                <TableRow field="description" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="Pass description" />
                <TableRow field="logoText" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="Text next to logo" />
                <TableRow field="logo" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="Base64 encoded PNG image" />
                <TableRow field="icon" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="Base64 encoded PNG (29x29)" />
                <TableRow field="headerFields" type="array" requiredLabel={t('required')} optionalLabel={t('optional')} description="Top-right fields" />
                <TableRow field="primaryFields" type="array" requiredLabel={t('required')} optionalLabel={t('optional')} description="Main content fields" />
                <TableRow field="secondaryFields" type="array" requiredLabel={t('required')} optionalLabel={t('optional')} description="Below primary fields" />
                <TableRow field="auxiliaryFields" type="array" requiredLabel={t('required')} optionalLabel={t('optional')} description="Additional fields" />
                <TableRow field="backFields" type="array" requiredLabel={t('required')} optionalLabel={t('optional')} description="Back of pass fields" />
                <TableRow field="expirationDate" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="ISO 8601 date" />
                <TableRow field="relevantDate" type="string" requiredLabel={t('required')} optionalLabel={t('optional')} description="ISO 8601 date for notifications" />
              </tbody>
            </table>
          </div>
        </Section>

        {/* Field Object */}
        <Section title={t('fieldObjStructure')} delay={0.5}>
          <CodeBlock 
            language="typescript" 
            code={`interface PassField {
  key: string;      // Unique identifier
  label?: string;   // Display label (optional)
  value: string;    // Display value
  textAlignment?: 'PKTextAlignmentLeft' | 'PKTextAlignmentCenter' | 
                   'PKTextAlignmentRight' | 'PKTextAlignmentNatural';
}`} 
          />
        </Section>

        {/* Error Responses */}
        <Section title={t('errorResponses')} delay={0.6}>
          <div className="space-y-3">
            <ErrorCard code={400} message={t('badRequest')} description={t('badRequestDesc')} />
            <ErrorCard code={500} message={t('internalError')} description={t('internalErrorDesc')} />
          </div>
          <div className="mt-4">
            <h5 className="text-sm font-medium text-white/80 mb-2">{t('errorResponseFormat')}</h5>
            <CodeBlock 
              language="json" 
              code={`{
  "error": "Failed to generate pass",
  "details": "Barcode data is required"
}`} 
            />
          </div>
        </Section>

        {/* SDK Examples */}
        <Section title={t('integrationExamples')} delay={0.7}>
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs">JavaScript</span>
                {t('fetchApi')}
              </h4>
              <CodeBlock 
                language="javascript" 
                code={`const response = await fetch('http://localhost:3002/api/pass/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Loyalty Card',
    barcodeData: '1234567890',
    barcodeFormat: 'PKBarcodeFormatQR',
    backgroundColor: '#1a1a2e',
    passType: 'storeCard'
  })
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);

// Download the file
const a = document.createElement('a');
a.href = url;
a.download = 'pass.pkpass';
a.click();`} 
              />
            </div>

            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">Node.js</span>
                {t('withFileSave')}
              </h4>
              <CodeBlock 
                language="javascript" 
                code={`import fs from 'fs';

const response = await fetch('http://localhost:3002/api/pass/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Event Ticket',
    barcodeData: 'TICKET-001',
    passType: 'eventTicket',
    backgroundColor: '#0f3460'
  })
});

const buffer = await response.arrayBuffer();
fs.writeFileSync('ticket.pkpass', Buffer.from(buffer));`} 
              />
            </div>

            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs">Python</span>
                Requests
              </h4>
              <CodeBlock 
                language="python" 
                code={`import requests

response = requests.post(
    'http://localhost:3002/api/pass/generate',
    json={
        'title': 'Coffee Card',
        'barcodeData': 'MEMBER-123',
        'barcodeFormat': 'PKBarcodeFormatQR',
        'backgroundColor': '#78350f',
        'passType': 'storeCard'
    }
)

with open('coffee.pkpass', 'wb') as f:
    f.write(response.content)`} 
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-12"
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </motion.section>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: typeof Zap; title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <Icon className="w-5 h-5 text-purple-400 mb-2" />
      <h3 className="font-medium text-white">{title}</h3>
      <p className="text-white/50 text-sm">{description}</p>
    </div>
  );
}

function EndpointCard({ 
  method, 
  path, 
  description, 
  children 
}: { 
  method: 'GET' | 'POST'; 
  path: string; 
  description: string;
  children: React.ReactNode;
}) {
  const methodColors = {
    GET: 'bg-green-500/20 text-green-400',
    POST: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${methodColors[method]}`}>
            {method}
          </span>
          <code className="text-white font-mono">{path}</code>
        </div>
        <p className="text-white/60 text-sm">{description}</p>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

function CodeBlock({ code }: { language?: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="p-4 rounded-xl bg-black/40 border border-white/10 overflow-x-auto text-sm">
        <code className="text-white/80 font-mono">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-white/60" />
        )}
      </button>
    </div>
  );
}

function TableRow({ 
  field, 
  type, 
  required, 
  description,
  requiredLabel,
  optionalLabel
}: { 
  field: string; 
  type: string; 
  required?: boolean;
  description: string;
  requiredLabel: string;
  optionalLabel: string;
}) {
  return (
    <tr className="border-b border-white/5">
      <td className="py-3 px-4 font-mono text-purple-400">{field}</td>
      <td className="py-3 px-4 font-mono text-white/50">{type}</td>
      <td className="py-3 px-4">
        {required ? (
          <span className="text-red-400 text-xs">{requiredLabel}</span>
        ) : (
          <span className="text-white/30 text-xs">{optionalLabel}</span>
        )}
      </td>
      <td className="py-3 px-4">{description}</td>
    </tr>
  );
}

function ErrorCard({ code, message, description }: { code: number; message: string; description: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
      <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 font-mono text-sm">{code}</span>
      <div>
        <span className="font-medium text-white">{message}</span>
        <span className="text-white/50 ml-2">— {description}</span>
      </div>
    </div>
  );
}
