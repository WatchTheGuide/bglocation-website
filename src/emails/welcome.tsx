import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  portalUrl: string;
  plan: string;
}

export function WelcomeEmail({ portalUrl, plan }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to BGLocation — your {plan} license is ready</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Welcome to BGLocation!</Heading>
          <Text style={text}>
            Thank you for purchasing the <strong>{plan}</strong> plan. Your perpetual license is ready.
          </Text>
          <Text style={text}>
            To generate your license key, sign in to the license portal:
          </Text>
          <Link href={portalUrl} style={button}>
            Go to License Portal
          </Link>
          <Text style={text}>
            In the portal you can:
          </Text>
          <ul>
            <li style={listItem}>Generate license keys for your bundle IDs</li>
            <li style={listItem}>View your active licenses</li>
            <li style={listItem}>Copy keys with one click</li>
          </ul>
          <Text style={footer}>
            Need help? Reply to this email and we&apos;ll get back to you.
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

const text = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '24px',
};

const button = {
  backgroundColor: '#111827',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block',
  margin: '16px 0',
};

const listItem = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '28px',
};

const footer = {
  fontSize: '14px',
  color: '#6b7280',
  marginTop: '24px',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '16px',
};
