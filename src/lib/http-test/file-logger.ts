import { appendFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Serverless filesystems (Vercel) are read-only except the OS temp dir, so
// writing under process.cwd() ENOENTs on `mkdir`. Use a writable base there.
// NOTE: on serverless /tmp is per-instance and ephemeral — the durable record
// is the console.log output captured in the platform's function logs.
const LOGS_DIR = process.env.VERCEL
  ? join(tmpdir(), 'bgl-http-test-logs')
  : join(process.cwd(), 'logs');

function getLogFilePath(): string {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return join(LOGS_DIR, `${date}.jsonl`);
}

export async function logHttpTestRequest(entry: Record<string, unknown>): Promise<void> {
  try {
    await mkdir(LOGS_DIR, { recursive: true });
    const line = JSON.stringify(entry) + '\n';
    await appendFile(getLogFilePath(), line, 'utf-8');
  } catch (err) {
    console.error('[HTTP Test] Failed to write log file:', err);
  }
}
