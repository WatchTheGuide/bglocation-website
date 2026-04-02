import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBanner } from "@/components/landing/announcement-banner";
import { ChatWidget } from "@/components/chat/chat-widget";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { FrameworkProvider } from "@/components/framework/framework-provider";
import { isFramework } from "@/lib/framework";
import "./globals.css";

export const metadata: Metadata = {
  referrer: "same-origin",
  title: {
    default: "bglocation — Background Location SDK",
    template: "%s | bglocation",
  },
  icons: {
    icon: [{ url: "/bglocation-icon.svg", type: "image/svg+xml" }],
    shortcut: "/bglocation-icon.svg",
  },
  description:
    "Production-ready background location SDK for Capacitor and React Native. Continuous GPS tracking, native HTTP posting, offline buffer, heartbeat timer, and geofencing.",
  keywords: [
    "capacitor",
    "react native",
    "background location",
    "geolocation",
    "gps tracking",
    "ionic",
    "expo",
    "capacitor plugin",
    "ios",
    "android",
  ],
  openGraph: {
    title: "bglocation — Background Location SDK",
    description:
      "Continuous background GPS tracking for Capacitor and React Native apps on iOS and Android. Native HTTP, offline buffer, trial mode, and geofencing.",
    url: "https://bglocation.dev",
    siteName: "bglocation",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bglocation",
    description:
      "Production-ready SDK for continuous background GPS tracking on Capacitor and React Native.",
  },
  alternates: {
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://bglocation.dev"),
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "bglocation",
  url: "https://bglocation.dev",
  logo: "https://bglocation.dev/bglocation-icon.svg",
  description:
    "Production-ready background location SDK for Capacitor, React Native, and Flutter.",
  sameAs: ["https://gitlab.com/bglocation"],
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "bglocation",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "iOS, Android",
  description:
    "Continuous background GPS tracking SDK for Capacitor, React Native, and Flutter. Native HTTP posting, offline buffer, heartbeat timer, and geofencing.",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "149",
    highPrice: "749",
    priceCurrency: "USD",
    offerCount: 3,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const frameworkHeader = headerStore.get("x-bgl-framework");
  const initialFramework = isFramework(frameworkHeader) ? frameworkHeader : undefined;

  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <FrameworkProvider initialFramework={initialFramework}>
          <AnnouncementBanner />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ChatWidget />
          <CookieBanner />
        </FrameworkProvider>
      </body>
    </html>
  );
}
