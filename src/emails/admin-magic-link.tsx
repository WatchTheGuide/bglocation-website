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

interface AdminMagicLinkEmailProps {
  loginUrl: string;
}

export function AdminMagicLinkEmail({ loginUrl }: AdminMagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Admin sign-in to BGLocation</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Admin Sign In</Heading>
          <Text style={text}>
            Click the link below to sign in to the BGLocation admin panel. This
            link expires in 15 minutes.
          </Text>
          <Section style={buttonContainer}>
            <Link href={loginUrl} style={button}>
              Sign In to Admin Panel
            </Link>
          </Section>
          <Text style={footer}>
            If you didn&apos;t request this email, you can safely ignore it.
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
