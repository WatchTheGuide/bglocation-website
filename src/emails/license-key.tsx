import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface LicenseKeyEmailProps {
  bundleId: string;
  licenseKey: string;
  updatesUntil: string;
  plan: string;
}

export function LicenseKeyEmail({
  bundleId,
  licenseKey,
  updatesUntil,
  plan,
}: LicenseKeyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your BGLocation license key for {bundleId}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Your License Key</Heading>
          <Text style={text}>
            Here is your BGLocation license key for <strong>{bundleId}</strong> ({plan} plan).
          </Text>

          <Section style={keyBox}>
            <code style={keyCode}>{licenseKey}</code>
          </Section>

          <Text style={text}>
            <strong>Updates available until:</strong> {updatesUntil}
          </Text>

          <Heading as="h3" style={subheading}>How to use</Heading>
          <Text style={text}>
            Add the key to your <code style={inlineCode}>capacitor.config.ts</code>:
          </Text>
          <Section style={codeBlock}>
            <pre style={codeText}>{`plugins: {
  BackgroundLocation: {
    licenseKey: '${licenseKey.substring(0, 20)}...'
  }
}`}</pre>
          </Section>
          <Text style={text}>
            Then run <code style={inlineCode}>npx cap sync</code> to apply the configuration.
          </Text>

          <Text style={footer}>
            This is a perpetual license — your key never expires. The updates period indicates
            how long you have access to new plugin versions and email support.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
  borderRadius: '8px',
};

const heading = {
  fontSize: '24px',
  fontWeight: '600' as const,
  color: '#111827',
  marginBottom: '16px',
};

const subheading = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#111827',
  marginTop: '24px',
  marginBottom: '8px',
};

const text = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '24px',
};

const keyBox = {
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
  overflowX: 'auto' as const,
};

const keyCode = {
  fontSize: '13px',
  fontFamily: 'IBM Plex Mono, monospace',
  color: '#111827',
  wordBreak: 'break-all' as const,
};

const codeBlock = {
  backgroundColor: '#1f2937',
  borderRadius: '6px',
  padding: '16px',
  margin: '8px 0',
};

const codeText = {
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: '13px',
  color: '#e5e7eb',
  margin: 0,
};

const inlineCode = {
  backgroundColor: '#f3f4f6',
  borderRadius: '3px',
  padding: '2px 6px',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: '14px',
};

const footer = {
  fontSize: '14px',
  color: '#6b7280',
  marginTop: '24px',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '16px',
};
