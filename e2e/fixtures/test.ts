import { test as base } from '@playwright/test';

export const test = base;
export { expect } from '@playwright/test';

export const ROUTES = {
  home: '/',
  pricing: '/pricing',
  docs: '/docs',
  about: '/about',
  cookies: '/cookies',
  newsletterConfirm: '/newsletter/confirm',
  newsletterUnsubscribe: '/newsletter/unsubscribe',
  adminSubscribers: '/admin/subscribers',
} as const;
