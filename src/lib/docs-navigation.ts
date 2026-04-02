export type DocPage = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  group: "getting-started" | "guides" | "advanced" | "reference";
};

export const DOC_PAGES: readonly DocPage[] = [
  {
    slug: "quick-start",
    title: "Quick Start",
    shortTitle: "Quick Start",
    description: "Install, configure, and get your first location update in 5 minutes.",
    group: "getting-started",
  },
  {
    slug: "background-tracking",
    title: "Background Location Tracking",
    shortTitle: "Background Tracking",
    description: "Distance filter, heartbeat, accuracy, and battery impact.",
    group: "guides",
  },
  {
    slug: "http-posting",
    title: "HTTP Posting & Offline Buffer",
    shortTitle: "HTTP Posting",
    description: "Native HTTP delivery with automatic offline buffering and retry.",
    group: "guides",
  },
  {
    slug: "geofencing",
    title: "Geofencing Guide",
    shortTitle: "Geofencing",
    description: "Circular regions, enter/exit/dwell transitions, and batch operations.",
    group: "guides",
  },
  {
    slug: "permissions",
    title: "Permissions & Setup",
    shortTitle: "Permissions",
    description: "iOS and Android permissions, background modes, and Expo config plugin.",
    group: "guides",
  },
  {
    slug: "adaptive-filter",
    title: "Adaptive Distance Filter",
    shortTitle: "Adaptive Filter",
    description: "Speed-adaptive distance filter for optimal battery and accuracy.",
    group: "guides",
  },
  {
    slug: "debug-mode",
    title: "Debug Mode",
    shortTitle: "Debug Mode",
    description: "Verbose logs, system sounds, and onDebug events for development.",
    group: "advanced",
  },
  {
    slug: "licensing",
    title: "Licensing & Trial",
    shortTitle: "Licensing",
    description: "Trial mode, license key setup, perpetual model, and update gating.",
    group: "advanced",
  },
  {
    slug: "platform-differences",
    title: "Platform Differences",
    shortTitle: "Platform Differences",
    description: "Feature availability and behavior differences across iOS, Android, and Web.",
    group: "reference",
  },
  {
    slug: "error-codes",
    title: "Error Codes Reference",
    shortTitle: "Error Codes",
    description: "All error codes with descriptions, causes, and fixes.",
    group: "reference",
  },
  {
    slug: "examples",
    title: "Use Case Examples",
    shortTitle: "Examples",
    description: "Production-ready code for fleet tracking, fitness, delivery, and attendance.",
    group: "reference",
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    shortTitle: "Troubleshooting",
    description: "Common problems and solutions for background location tracking.",
    group: "reference",
  },
  {
    slug: "migration",
    title: "Migration Guide",
    shortTitle: "Migration",
    description: "Migrate from @capacitor-community/background-geolocation.",
    group: "reference",
  },
  {
    slug: "api-reference",
    title: "API Reference",
    shortTitle: "API Reference",
    description: "Complete TypeScript API: methods, events, interfaces, and types.",
    group: "reference",
  },
] as const;

export const DOC_GROUPS = [
  { key: "getting-started" as const, label: "Getting Started" },
  { key: "guides" as const, label: "Guides" },
  { key: "advanced" as const, label: "Advanced" },
  { key: "reference" as const, label: "Reference" },
] as const;

export function getDocPage(slug: string): DocPage | undefined {
  return DOC_PAGES.find((page) => page.slug === slug);
}

export function getAdjacentPages(slug: string): {
  prev: DocPage | undefined;
  next: DocPage | undefined;
} {
  const index = DOC_PAGES.findIndex((page) => page.slug === slug);
  return {
    prev: index > 0 ? DOC_PAGES[index - 1] : undefined,
    next: index < DOC_PAGES.length - 1 ? DOC_PAGES[index + 1] : undefined,
  };
}
