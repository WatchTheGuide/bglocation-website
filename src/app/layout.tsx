import type { Metadata } from "next";
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
import { FrameworkProvider } from "@/components/framework/framework-provider";
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
        <FrameworkProvider>
          <AnnouncementBanner />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ChatWidget />
        </FrameworkProvider>
      </body>
    </html>
  );
}
