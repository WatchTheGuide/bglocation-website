import { test, expect, ROUTES } from './fixtures/test';

test.describe('Docs Hub Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.docs);
  });

  test('should display page heading and framework switcher', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Documentation/i }).first()).toBeVisible();
    await expect(page.locator('[data-testid="framework-switcher"]').first()).toBeVisible();
  });

  test('should display quick install for Capacitor by default', async ({ page }) => {
    await expect(page.locator('code').filter({ hasText: 'npm install @bglocation/capacitor' }).first()).toBeVisible();
  });

  test('should switch to React Native', async ({ page }) => {
    await page.locator('[data-framework-option="react-native"]').first().click();
    await expect(page).toHaveURL(/framework=react-native/);
    await expect(page.locator('code').filter({ hasText: 'npm install @bglocation/react-native' }).first()).toBeVisible();
  });

  test('should display sidebar with grouped navigation links', async ({ page }) => {
    const vp = page.viewportSize();
    test.skip(!!vp && vp.width < 1024, 'Sidebar hidden on mobile');
    const sidebar = page.locator('aside');
    await expect(sidebar.getByRole('link', { name: /Quick Start/i })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: /API Reference/i })).toBeVisible();
  });

  test('should display category cards linking to subpages', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Quick Start/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Background Tracking/i }).first()).toBeVisible();
  });
});

test.describe('Docs Subpages', () => {
  const docPages = [
    { route: ROUTES.docsQuickStart, heading: /Quick Start/i, hasFrameworkSwitcher: true },
    { route: ROUTES.docsBackgroundTracking, heading: /Background Tracking/i, hasFrameworkSwitcher: true },
    { route: ROUTES.docsHttpPosting, heading: /HTTP Posting/i, hasFrameworkSwitcher: true },
    { route: ROUTES.docsGeofencing, heading: /Geofencing/i, hasFrameworkSwitcher: true },
    { route: ROUTES.docsPermissions, heading: /Permissions/i, hasFrameworkSwitcher: true },
    { route: ROUTES.docsAdaptiveFilter, heading: /Adaptive.+Filter/i, hasFrameworkSwitcher: false },
    { route: ROUTES.docsDebugMode, heading: /Debug Mode/i, hasFrameworkSwitcher: true },
    { route: ROUTES.docsLicensing, heading: /Licensing/i, hasFrameworkSwitcher: true },
    { route: ROUTES.docsPlatformDifferences, heading: /Platform Differences/i, hasFrameworkSwitcher: false },
    { route: ROUTES.docsErrorCodes, heading: /Error Codes/i, hasFrameworkSwitcher: false },
    { route: ROUTES.docsExamples, heading: /Examples/i, hasFrameworkSwitcher: true },
    { route: ROUTES.docsTroubleshooting, heading: /Troubleshooting/i, hasFrameworkSwitcher: true },
    { route: ROUTES.docsMigration, heading: /Migration/i, hasFrameworkSwitcher: false },
    { route: ROUTES.docsApiReference, heading: /API Reference/i, hasFrameworkSwitcher: true },
  ];

  for (const { route, heading, hasFrameworkSwitcher } of docPages) {
    test(`should render ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      if (hasFrameworkSwitcher) {
        await expect(page.locator('[data-testid="framework-switcher"]').first()).toBeVisible();
      }
    });
  }
});

test.describe('Docs Navigation', () => {
  test('should navigate from hub to subpage via card link', async ({ page }) => {
    await page.goto(ROUTES.docs);
    await page.getByRole('link', { name: /Quick Start/i }).first().click();
    await expect(page).toHaveURL(/\/docs\/quick-start/);
    await expect(page.getByRole('heading', { level: 1, name: /Quick Start/i })).toBeVisible();
  });

  test('should navigate via sidebar', async ({ page }) => {
    const vp = page.viewportSize();
    test.skip(!!vp && vp.width < 1024, 'Sidebar hidden on mobile');
    await page.goto(ROUTES.docsQuickStart);
    const sidebar = page.locator('aside');
    await sidebar.getByRole('link', { name: /Geofencing/i }).click();
    await expect(page).toHaveURL(/\/docs\/geofencing/);
    await expect(page.getByRole('heading', { level: 1, name: /Geofencing/i })).toBeVisible();
  });

  test('should display breadcrumbs on subpage', async ({ page }) => {
    await page.goto(ROUTES.docsQuickStart);
    await expect(page.getByRole('link', { name: /Docs/i })).toBeVisible();
  });

  test('should display breadcrumbs on later subpage', async ({ page }) => {
    await page.goto(ROUTES.docsLicensing);
    await expect(page.getByRole('link', { name: /Docs/i })).toBeVisible();
  });

  test('should display prev/next navigation on subpage', async ({ page }) => {
    await page.goto(ROUTES.docsBackgroundTracking);
    await expect(page.getByRole('link', { name: /Quick Start/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /HTTP Posting/i })).toBeVisible();
  });

  test('should display prev/next navigation on later subpage', async ({ page }) => {
    await page.goto(ROUTES.docsExamples);
    await expect(page.getByRole('link', { name: /Error Codes/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Troubleshooting/i })).toBeVisible();
  });
});

test.describe('Docs Page — SEO', () => {
  test('should have correct page title on hub', async ({ page }) => {
    await page.goto(ROUTES.docs);
    await expect(page).toHaveTitle(/Documentation.*bglocation/i);
  });

  test('should have correct page title on subpage', async ({ page }) => {
    await page.goto(ROUTES.docsQuickStart);
    await expect(page).toHaveTitle(/Quick Start/i);
  });

  test('should have meta description on hub', async ({ page }) => {
    await page.goto(ROUTES.docs);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
  });
});
