import type { Metadata } from "next";
import Script from "next/script";
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
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "capacitor-bglocation — Background Location Plugin for Capacitor",
    template: "%s | capacitor-bglocation",
  },
  description:
    "Production-ready Capacitor 8 plugin for continuous background GPS tracking on iOS and Android. Native HTTP posting, offline buffer, heartbeat timer, and more.",
  keywords: [
    "capacitor",
    "background location",
    "geolocation",
    "gps tracking",
    "ionic",
    "capacitor plugin",
    "ios",
    "android",
  ],
  openGraph: {
    title: "capacitor-bglocation — Background Location for Capacitor",
    description:
      "Continuous background GPS tracking for iOS & Android. Native HTTP, offline buffer, evaluate free with trial mode.",
    url: "https://bglocation.dev",
    siteName: "capacitor-bglocation",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "capacitor-bglocation",
    description:
      "Production-ready Capacitor 8 plugin for continuous background GPS tracking.",
  },
  metadataBase: new URL("https://bglocation.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AnnouncementBanner />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatWidget />
        <Script
          src="https://app.lemonsqueezy.com/js/lemon.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
