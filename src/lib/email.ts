import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'BGLocation <no-reply@bglocation.dev>';

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  const resend = getResend();
  if (!resend) {
    console.log(`[Email] Skipping send to ${to}: ${subject} (no API key)`);
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    react,
  });

  if (error) {
    console.error(`[Email] Failed to send to ${to}:`, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log(`[Email] Sent to ${to}: ${subject} (id: ${data?.id})`);
  return data;
}
