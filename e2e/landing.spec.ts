import { test, expect, ROUTES } from './fixtures/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
  });

  test.describe('Hero Section', () => {
    test('should display hero headline', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Background Location.*That Just Works/i }),
      ).toBeVisible();
    });

    test('should display Capacitor 8 badge', async ({ page }) => {
      await expect(page.getByText(/Capacitor 8.*iOS.*Android/i)).toBeVisible();
    });

    test('should display CTA buttons', async ({ page }) => {
      await expect(page.getByRole('link', { name: /Get License.*\$199\/year/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Read the Docs/i })).toBeVisible();
    });

    test('should display npm install command', async ({ page }) => {
      await expect(page.getByText('npm install capacitor-bglocation')).toBeVisible();
    });

    test('should link Get License to pricing page', async ({ page }) => {
      await expect(page.getByRole('link', { name: /Get License/i }).first()).toHaveAttribute(
        'href',
        '/pricing',
      );
    });

    test('should link Read the Docs to docs page', async ({ page }) => {
      const link = page.locator('section').first().getByRole('link', { name: /Read the Docs/i });
      await expect(link).toHaveAttribute('href', '/docs');
    });
  });

  test.describe('Trust Bar', () => {
    test('should display all trust stats', async ({ page }) => {
      await expect(page.getByText('300+')).toBeVisible();
      await expect(page.getByText('Unit Tests')).toBeVisible();
      await expect(page.getByText('2')).toBeVisible();
      await expect(page.getByText('Native Platforms')).toBeVisible();
      await expect(page.getByText('3,200+')).toBeVisible();
      await expect(page.getByText('Lines of Native Code')).toBeVisible();
      await expect(page.getByText('Source')).toBeVisible();
      await expect(page.getByText('Available (ELv2)')).toBeVisible();
      await expect(page.getByText('1.06:1')).toBeVisible();
      await expect(page.getByText('Test-to-Code Ratio')).toBeVisible();
    });
  });

  test.describe('Features Section', () => {
    test('should display features heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Everything You Need for Location Tracking/i }),
      ).toBeVisible();
    });

    test('should display all 9 feature cards', async ({ page }) => {
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
    });

    test('should have features section with correct id for anchor link', async ({ page }) => {
      await expect(page.locator('#features')).toBeVisible();
    });
  });

  test.describe('Code Example Section', () => {
    test('should display code section heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Up and Running in Minutes/i }),
      ).toBeVisible();
    });

    test('should display code snippet with key API calls', async ({ page }) => {
      await expect(page.getByText(/BackgroundLocation\.configure/)).toBeVisible();
      await expect(page.getByText(/BackgroundLocation\.addListener/)).toBeVisible();
      await expect(page.getByText(/BackgroundLocation\.start/)).toBeVisible();
    });
  });

  test.describe('Comparison Table', () => {
    test('should display comparison heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /How We Compare/i }),
      ).toBeVisible();
    });

    test('should display all three column headers', async ({ page }) => {
      await expect(page.getByText('capacitor-bglocation')).toBeVisible();
      await expect(page.getByText('transistorsoft')).toBeVisible();
      await expect(page.getByText(/@capacitor\/.*geolocation/)).toBeVisible();
    });

    test('should display recommended badge', async ({ page }) => {
      await expect(page.getByText('recommended')).toBeVisible();
    });

    test('should display pricing rows', async ({ page }) => {
      await expect(page.getByText('$199/yr')).toBeVisible();
      await expect(page.getByText('$299/yr')).toBeVisible();
      await expect(page.getByText('$499/yr')).toBeVisible();
    });

    test('should display 14 comparison rows', async ({ page }) => {
      const rows = page.locator('table tbody tr');
      await expect(rows).toHaveCount(14);
    });
  });

  test.describe('CTA Section', () => {
    test('should display CTA heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Ready to Ship Background Location/i }),
      ).toBeVisible();
    });

    test('should display View Pricing and Read the Docs buttons', async ({ page }) => {
      const ctaSection = page.locator('section').filter({ hasText: 'Ready to Ship' });
      await expect(ctaSection.getByRole('link', { name: /View Pricing/i })).toBeVisible();
      await expect(ctaSection.getByRole('link', { name: /Read the Docs/i })).toBeVisible();
    });
  });
});

test.describe('Landing Page — SEO', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(ROUTES.home);
    await expect(page).toHaveTitle(
      /capacitor-bglocation.*Background Location Plugin/i,
    );
  });

  test('should have meta description', async ({ page }) => {
    await page.goto(ROUTES.home);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      /Production-ready Capacitor 8 plugin/i,
    );
  });
});
