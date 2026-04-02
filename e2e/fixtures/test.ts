import { test as base } from '@playwright/test';

export const test = base;
export { expect } from '@playwright/test';

export const ROUTES = {
  home: '/',
  pricing: '/pricing',
  docs: '/docs',
  docsQuickStart: '/docs/quick-start',
  docsBackgroundTracking: '/docs/background-tracking',
  docsHttpPosting: '/docs/http-posting',
  docsGeofencing: '/docs/geofencing',
  docsPermissions: '/docs/permissions',
  docsAdaptiveFilter: '/docs/adaptive-filter',
  docsDebugMode: '/docs/debug-mode',
  docsLicensing: '/docs/licensing',
  docsPlatformDifferences: '/docs/platform-differences',
  docsErrorCodes: '/docs/error-codes',
  docsExamples: '/docs/examples',
  docsTroubleshooting: '/docs/troubleshooting',
  docsMigration: '/docs/migration',
  docsApiReference: '/docs/api-reference',
  about: '/about',
  blog: '/blog',
  cookies: '/cookies',
  newsletterConfirm: '/newsletter/confirm',
  newsletterUnsubscribe: '/newsletter/unsubscribe',
  adminSubscribers: '/admin/subscribers',
} as const;
