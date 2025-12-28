/**
 * Development Certificate Generator
 * 
 * For production Apple Wallet passes, you need:
 * 1. An Apple Developer account ($99/year)
 * 2. A Pass Type ID registered in the Apple Developer portal
 * 3. A signing certificate for that Pass Type ID
 * 
 * This script creates placeholder instructions for setting up certificates.
 * The actual certificate generation must be done through Apple's portal.
 */

import fs from 'fs';
import path from 'path';

const certsDir = path.join(process.cwd(), 'certs');

const README_CONTENT = `# Apple Wallet Certificates Setup

To create fully signed Apple Wallet passes, you need certificates from Apple.

## Prerequisites
- Apple Developer Account ($99/year): https://developer.apple.com/programs/
- macOS with Keychain Access

## Steps

### 1. Create a Pass Type ID
1. Go to https://developer.apple.com/account/resources/identifiers/list/passTypeId
2. Click "+" to create a new Pass Type ID
3. Enter a description and identifier (e.g., "pass.com.yourcompany.wallet")
4. Register the Pass Type ID

### 2. Create a Pass Type ID Certificate
1. Go to https://developer.apple.com/account/resources/certificates/list
2. Click "+" to create a new certificate
3. Select "Pass Type ID Certificate"
4. Select your Pass Type ID
5. Follow the instructions to create a CSR (Certificate Signing Request)
6. Upload the CSR and download the certificate

### 3. Export the Certificate
1. Double-click the downloaded certificate to add it to Keychain Access
2. In Keychain Access, find the certificate under "My Certificates"
3. Right-click and export as .p12 file
4. Set a password (you'll need this later)

### 4. Convert to PEM format
Run these commands in Terminal:

\`\`\`bash
# Extract the certificate
openssl pkcs12 -in pass.p12 -clcerts -nokeys -out signerCert.pem

# Extract the private key
openssl pkcs12 -in pass.p12 -nocerts -out signerKey.pem
\`\`\`

### 5. Download WWDR Certificate
Download Apple's Worldwide Developer Relations certificate:
https://www.apple.com/certificateauthority/

Look for "Worldwide Developer Relations - G4" and download it.
Convert to PEM:
\`\`\`bash
openssl x509 -in AppleWWDRCAG4.cer -inform DER -out wwdr.pem
\`\`\`

### 6. Place certificates in this folder
- wwdr.pem (Apple's WWDR certificate)
- signerCert.pem (Your Pass Type ID certificate)
- signerKey.pem (Your private key)

### 7. Set environment variables
Create a .env file in the project root:
\`\`\`
PASS_TYPE_IDENTIFIER=pass.com.yourcompany.wallet
TEAM_IDENTIFIER=YOUR_TEAM_ID
SIGNER_KEY_PASSPHRASE=your_key_password
\`\`\`

## Development Mode
Without certificates, the app will generate demo passes that show the structure
but cannot be added to Apple Wallet. This is useful for UI development and testing.
`;

async function main() {
  // Create certs directory if it doesn't exist
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }

  // Write README
  fs.writeFileSync(path.join(certsDir, 'README.md'), README_CONTENT);

  // Create .gitkeep to track the directory
  fs.writeFileSync(path.join(certsDir, '.gitkeep'), '');

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   Certificate Setup Instructions                              ║
║                                                               ║
║   Created: certs/README.md                                    ║
║                                                               ║
║   Please read the README for instructions on obtaining        ║
║   Apple Developer certificates for pass signing.              ║
║                                                               ║
║   Without certificates, the app will generate demo passes     ║
║   that show the structure but cannot be added to Wallet.      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);
}

main().catch(console.error);
