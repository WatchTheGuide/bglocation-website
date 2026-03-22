import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ConfirmSubscriptionEmailProps {
  confirmUrl: string;
  unsubUrl: string;
}

export function ConfirmSubscriptionEmail({ confirmUrl, unsubUrl }: ConfirmSubscriptionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your bglocation newsletter subscription</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Confirm your subscription</Heading>
          <Text style={text}>
            Thanks for signing up for the bglocation newsletter! Please confirm your email address by
            clicking the link below.
          </Text>
          <Section style={buttonContainer}>
            <Link href={confirmUrl} style={button}>
              Confirm Subscription
            </Link>
          </Section>
          <Text style={text}>
            You&apos;ll receive updates about new platform support (React Native, Flutter, KMP),
            plugin releases, and occasional promotions.
          </Text>
          <Text style={footer}>
            This link expires in 24 hours. If you didn&apos;t sign up, you can safely ignore this
            email or{' '}
            <Link href={unsubUrl} style={footerLink}>
              unsubscribe
            </Link>
            .
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

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
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
};

const footer = {
  fontSize: '14px',
  color: '#6b7280',
  marginTop: '24px',
};

const footerLink = {
  color: '#6b7280',
  textDecoration: 'underline',
};
