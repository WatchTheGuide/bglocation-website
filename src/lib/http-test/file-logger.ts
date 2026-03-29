import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const LOGS_DIR = join(process.cwd(), 'logs');

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
