/**
 * Generate a license key from CLI (for debugging / manual issuance).
 *
 * Usage:
 *   npx tsx scripts/generate-license.ts --bundle-id com.example.app
 *   npx tsx scripts/generate-license.ts --bundle-id com.example.app --updates-days 730
 *   npx tsx scripts/generate-license.ts --bundle-id com.example.app --no-exp
 *
 * Reads RSA_PRIVATE_KEY from .env (via dotenv).
 *
 * Output format: BGL1-{base64url(payload)}.{base64url(signature)}
 *
 * License model: perpetual (key never expires). The `exp` field is optional
 * and informational — it indicates "updates available until", not "key expires".
 */
import 'dotenv/config';
import { createSign } from 'node:crypto';
import { parseArgs } from 'node:util';

function toBase64Url(buf: Buffer): string {
  return buf.toString('base64url');
}

function main(): void {
  const { values } = parseArgs({
    options: {
      'bundle-id': { type: 'string' },
      'updates-days': { type: 'string' },
      'no-exp': { type: 'boolean' },
    },
    strict: true,
  });

  const bundleId = values['bundle-id'];
  if (!bundleId) {
    console.error(
      'Usage: npx tsx scripts/generate-license.ts --bundle-id <com.example.app> [--updates-days <N>] [--no-exp]',
    );
    process.exit(1);
  }

  const noExp = values['no-exp'] ?? false;
  const updatesDays = values['updates-days'] ? Number.parseInt(values['updates-days'], 10) : 365;
  if (!noExp && (Number.isNaN(updatesDays) || updatesDays < 1)) {
    console.error('ERROR: --updates-days must be a positive integer');
    process.exit(1);
  }

  const privateKey = process.env.RSA_PRIVATE_KEY;
  if (!privateKey) {
    console.error('ERROR: RSA_PRIVATE_KEY not found in environment. Check your .env file.');
    console.error('       Generate one with: npx tsx scripts/generate-keypair.ts');
    process.exit(1);
  }

  const iat = Math.floor(Date.now() / 1000);

  const payloadObj: Record<string, unknown> = { bid: bundleId, iat };
  if (!noExp) {
    payloadObj.exp = iat + updatesDays * 24 * 60 * 60;
  }

  const payload = JSON.stringify(payloadObj);
  const payloadB64 = toBase64Url(Buffer.from(payload));

  const signer = createSign('SHA256');
  signer.update(payload);
  const signature = toBase64Url(signer.sign(privateKey));

  const key = `BGL1-${payloadB64}.${signature}`;

  console.log('');
  console.log('License key:');
  console.log(key);
  console.log('');
  console.log(`Bundle ID:      ${bundleId}`);
  console.log(`Issued:         ${new Date(iat * 1000).toISOString()}`);
  if (noExp) {
    console.log('Updates until:  (no expiry)');
  } else {
    const exp = payloadObj.exp as number;
    console.log(`Updates until:  ${new Date(exp * 1000).toISOString()}`);
    console.log(`Updates period: ${updatesDays} days`);
  }
  console.log('License type:   PERPETUAL (never expires)');
}

main();
