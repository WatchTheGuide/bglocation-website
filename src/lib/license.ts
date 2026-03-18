import { createSign } from 'node:crypto';

const UPDATES_DAYS = 365;

function toBase64Url(buf: Buffer): string {
  return buf.toString('base64url');
}

function getPrivateKey(): string {
  const key = process.env.RSA_PRIVATE_KEY;
  if (!key) {
    throw new Error('RSA_PRIVATE_KEY environment variable is not set');
  }
  return key;
}

export function generateLicenseKey(bundleId: string): {
  licenseKey: string;
  issuedAt: Date;
  updatesUntil: Date;
} {
  const privateKey = getPrivateKey();

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + UPDATES_DAYS * 24 * 60 * 60;

  const payload = JSON.stringify({ bid: bundleId, iat, exp });
  const payloadB64 = toBase64Url(Buffer.from(payload));

  const signer = createSign('SHA256');
  signer.update(payload);
  const signature = toBase64Url(signer.sign(privateKey));

  return {
    licenseKey: `BGL1-${payloadB64}.${signature}`,
    issuedAt: new Date(iat * 1000),
    updatesUntil: new Date(exp * 1000),
  };
}

const BUNDLE_ID_REGEX = /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*){1,}$/;

export function isValidBundleId(bundleId: string): boolean {
  if (!bundleId || bundleId.length > 255) return false;
  return BUNDLE_ID_REGEX.test(bundleId);
}
