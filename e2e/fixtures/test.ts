import { test as base } from '@playwright/test';

export const test = base;
export { expect } from '@playwright/test';

export const ROUTES = {
  home: '/',
  pricing: '/pricing',
  docs: '/docs',
} as const;
