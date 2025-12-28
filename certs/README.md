# Apple Wallet Certificate Setup

This guide walks you through obtaining and configuring the certificates needed to create signed Apple Wallet passes.

## Prerequisites

- Apple Developer account ($99/year) — [Sign up here](https://developer.apple.com/programs/)
- macOS with Keychain Access (for certificate export)
- OpenSSL (pre-installed on macOS/Linux)

## Step 1: Create a Pass Type ID

1. Go to [Apple Developer Portal → Identifiers](https://developer.apple.com/account/resources/identifiers/list/passTypeId)
2. Click the **+** button
3. Select **Pass Type IDs** and click Continue
4. Enter:
   - **Description**: e.g., "Cuzdan Wallet Pass"
   - **Identifier**: e.g., `pass.com.yourcompany.cuzdan`
5. Click **Register**

> Save your Pass Type ID — you'll need it for the `.env` file.

## Step 2: Create a Pass Type ID Certificate

1. Go to [Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Click the **+** button
3. Under **Services**, select **Pass Type ID Certificate**
4. Click **Continue**
5. Select your Pass Type ID from the dropdown
6. Click **Continue**

### Create a Certificate Signing Request (CSR)

On your Mac:

1. Open **Keychain Access** (Applications → Utilities)
2. Go to **Keychain Access → Certificate Assistant → Request a Certificate from a Certificate Authority**
3. Enter your email address
4. Select **Saved to disk**
5. Click **Continue** and save the `.certSigningRequest` file

Back in the Apple Developer Portal:

6. Upload the CSR file
7. Click **Continue**
8. Click **Download** to get your certificate (`.cer` file)

## Step 3: Export the Certificate

1. Double-click the downloaded `.cer` file to add it to Keychain
2. Open **Keychain Access**
3. Find your certificate under **My Certificates** (look for "Pass Type ID: ...")
4. Expand it to see the private key
5. Select **both** the certificate and private key
6. Right-click → **Export 2 items...**
7. Save as `.p12` file
8. Set a strong password (you'll need this later)

## Step 4: Convert to PEM Format

Open Terminal and run:

```bash
# Navigate to where you saved the .p12 file
cd ~/Downloads

# Extract the certificate (use -legacy flag for OpenSSL 3.x)
openssl pkcs12 -in Certificates.p12 -clcerts -nokeys -out signerCert.pem -legacy

# Extract the private key
openssl pkcs12 -in Certificates.p12 -nocerts -out signerKey.pem -legacy

# You'll be prompted for:
# 1. The .p12 password you set during export
# 2. A new PEM passphrase (save this for .env)
```

> **Note**: The `-legacy` flag is required for OpenSSL 3.x to read `.p12` files exported from Keychain Access.

## Step 5: Download Apple's WWDR Certificate

Apple's Worldwide Developer Relations (WWDR) certificate is required for signing.

1. Go to [Apple PKI](https://www.apple.com/certificateauthority/)
2. Download **Worldwide Developer Relations - G4** (or latest version)
3. Convert to PEM format:

```bash
# If downloaded as .cer (DER format)
openssl x509 -in AppleWWDRCAG4.cer -inform DER -out wwdr.pem

# If downloaded as .pem, just rename it
mv AppleWWDRCAG4.pem wwdr.pem
```

## Step 6: Configure Cüzdan

1. Copy the three PEM files to the `certs/` folder:

```bash
cp signerCert.pem /path/to/cuzdan/certs/
cp signerKey.pem /path/to/cuzdan/certs/
cp wwdr.pem /path/to/cuzdan/certs/
```

2. Create a `.env` file in the project root:

```env
PASS_TYPE_IDENTIFIER=pass.com.yourcompany.cuzdan
TEAM_IDENTIFIER=YOUR_TEAM_ID
SIGNER_KEY_PASSPHRASE=your_pem_passphrase
```

> **Find your Team ID**: Go to [Membership Details](https://developer.apple.com/account/#/membership) in the Apple Developer Portal.

## Step 7: Verify Setup

Your `certs/` folder should contain:

```
certs/
├── README.md
├── wwdr.pem          # Apple WWDR certificate
├── signerCert.pem    # Your Pass Type ID certificate
└── signerKey.pem     # Your private key
```

Start the server and create a test pass:

```bash
bun run dev
```

If configured correctly, generated passes will open in Apple Wallet!

## Troubleshooting

### "Certificate not valid"
- Ensure all three PEM files are present
- Check that `PASS_TYPE_IDENTIFIER` matches your registered Pass Type ID exactly
- Verify `TEAM_IDENTIFIER` is correct

### "Unable to read private key"
- Check `SIGNER_KEY_PASSPHRASE` in `.env` matches the password you set

### "Pass cannot be read"
- The WWDR certificate may be expired — download the latest version
- Ensure you're using the G4 certificate (or later)

## Security Notes

- **Never commit certificates to git** — they're in `.gitignore`
- Keep your `.p12` file and passphrase secure
- Certificates expire — check renewal dates in Keychain Access

## Quick Reference

| File | Description |
|------|-------------|
| `wwdr.pem` | Apple's WWDR intermediate certificate |
| `signerCert.pem` | Your Pass Type ID certificate |
| `signerKey.pem` | Your private key (encrypted) |

| Environment Variable | Description |
|---------------------|-------------|
| `PASS_TYPE_IDENTIFIER` | e.g., `pass.com.yourcompany.cuzdan` |
| `TEAM_IDENTIFIER` | Your 10-character Apple Team ID |
| `SIGNER_KEY_PASSPHRASE` | Password for `signerKey.pem` |
