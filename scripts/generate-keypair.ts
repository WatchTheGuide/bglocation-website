/**
 * Generate RSA-2048 keypair for license signing.
 *
 * Usage:
 *   npx tsx scripts/generate-keypair.ts
 *
 * Output:
 *   - Private key formatted for .env (RSA_PRIVATE_KEY="...")
 *   - Public key (to embed in native plugin validators)
 */
import { generateKeyPairSync } from 'node:crypto';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// Format for .env — single line with literal \n
const envValue = privateKey.trimEnd().replace(/\n/g, '\\n');

console.log('=== RSA-2048 Keypair Generated ===');
console.log('');
console.log('Add to .env:');
console.log('');
console.log(`RSA_PRIVATE_KEY="${envValue}"`);
console.log('');
console.log('=== Public Key (embed in native validators) ===');
console.log('');
console.log(publicKey);
console.log('IMPORTANT: Keep the private key secret. Never commit it to version control.');
