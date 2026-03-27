import { test, expect, ROUTES } from './fixtures/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
  });

  test.describe('Hero Section', () => {
    test('should display hero headline and cross-framework badge', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Background Location.*That Just Works/i }),
      ).toBeVisible();
      await expect(
        page.locator('[data-slot="badge"]').filter({ hasText: /Capacitor 8.*React Native/i }),
      ).toBeVisible();
    });

    test('should render framework-aware CTA links', async ({ page }) => {
      const hero = page.locator('section').first();

      await expect(hero.getByRole('button', { name: /Get License/i })).toHaveAttribute(
        'href',
        /\/pricing\?framework=capacitor/,
      );
      await expect(hero.getByRole('button', { name: /Read the Docs/i })).toHaveAttribute(
        'href',
        /\/docs\?framework=capacitor/,
      );
    });

    test('should display default install command for Capacitor', async ({ page }) => {
      await expect(
        page.locator('section').first().getByText('npm install capacitor-bglocation'),
      ).toBeVisible();
    });
  });

  test.describe('Framework Switcher', () => {
    test('should switch the landing page to React Native', async ({ page }) => {
      await page.getByRole('tab', { name: /React Native/i }).first().click();

      await expect(page).toHaveURL(/framework=react-native/);
      await expect(page.getByText('npm install react-native-bglocation')).toBeVisible();
      await expect(page.getByText(/const subscription = addListener/).first()).toBeVisible();
      await expect(page.locator('table').getByText('expo-location')).toBeVisible();
    });
  });

  test.describe('Trust Bar', () => {
    test('should display all trust stats', async ({ page }) => {
      await expect(page.getByText('300+', { exact: true })).toBeVisible();
      await expect(page.getByText('Unit Tests', { exact: true })).toBeVisible();
      await expect(page.getByText('2', { exact: true }).first()).toBeVisible();
      await expect(page.getByText('Native Platforms', { exact: true })).toBeVisible();
      await expect(page.getByText('3,200+', { exact: true })).toBeVisible();
      await expect(page.getByText('Lines of Native Code', { exact: true })).toBeVisible();
      await expect(page.getByText('Source', { exact: true })).toBeVisible();
      await expect(page.getByText('Available (ELv2)', { exact: true })).toBeVisible();
      await expect(page.getByText('1.06:1', { exact: true })).toBeVisible();
      await expect(page.getByText('Test-to-Code Ratio', { exact: true })).toBeVisible();
    });
  });

  test.describe('Features Section', () => {
    test('should display all core feature cards', async ({ page }) => {
      const featureTitles = [
        'Background GPS Tracking',
        'Native HTTP Posting',
        'Offline Buffer',
        'Heartbeat Timer',
        'Adaptive Distance Filter',
        'Offline License Validation',
        'SLC Fallback (iOS)',
        'Debug Mode',
        'Battery Optimization Detection',
      ];

      for (const title of featureTitles) {
        await expect(page.getByText(title, { exact: true })).toBeVisible();
      }

      await expect(page.locator('#features')).toBeVisible();
    });
  });

  test.describe('Comparison Table', () => {
    test('should display recommended badge and 13 rows', async ({ page }) => {
      await expect(page.getByText('recommended')).toBeVisible();
      await expect(page.locator('table tbody tr')).toHaveCount(13);
    });
  });
});

test.describe('Landing Page — SEO', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(ROUTES.home);
    await expect(page).toHaveTitle(/bglocation.*Background Location SDK/i);
  });

  test('should have meta description', async ({ page }) => {
    await page.goto(ROUTES.home);
    const description = page.locator('meta[name="description"]').first();

    await expect(description).toHaveAttribute(
      'content',
      /Production-ready background location SDK for Capacitor and React Native/i,
    );
  });
});
