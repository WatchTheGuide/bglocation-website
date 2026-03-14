import { test, expect, ROUTES } from './fixtures/test';

test.describe('Docs Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.docs);
  });

  test('should display page heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Documentation/i }).first(),
    ).toBeVisible();
  });

  test('should display page description', async ({ page }) => {
    await expect(
      page.getByText(/Everything you need to integrate background location/i),
    ).toBeVisible();
  });

  test.describe('Quick Install', () => {
    test('should display install commands', async ({ page }) => {
      await expect(page.getByText('npm install capacitor-bglocation')).toBeVisible();
      await expect(page.getByText('npx cap sync')).toBeVisible();
    });
  });

  test.describe('Doc Section Cards', () => {
    test('should display all 6 doc section cards', async ({ page }) => {
      const sections = [
        'Getting Started',
        'Configuration',
        'API Reference',
        'Platform Guides',
        'Licensing',
        'Examples',
      ];

      for (const section of sections) {
        await expect(page.getByRole('heading', { name: section })).toBeVisible();
      }
    });

    test('should display section descriptions', async ({ page }) => {
      await expect(
        page.getByText(/Installation, configuration, and your first location track/i),
      ).toBeVisible();
      await expect(
        page.getByText(/Complete TypeScript API/i),
      ).toBeVisible();
    });
  });

  test.describe('Coming Soon', () => {
    test('should display coming soon notice', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Full documentation coming soon/i }),
      ).toBeVisible();
    });

    test('should link to npm README', async ({ page }) => {
      const npmLink = page.getByRole('link', { name: /README on npm/i });
      await expect(npmLink).toBeVisible();
      await expect(npmLink).toHaveAttribute(
        'href',
        'https://www.npmjs.com/package/capacitor-bglocation',
      );
    });
  });
});

test.describe('Docs Page — SEO', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(ROUTES.docs);
    await expect(page).toHaveTitle(/Documentation.*capacitor-bglocation/i);
  });

  test('should have meta description', async ({ page }) => {
    await page.goto(ROUTES.docs);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      /Guides, API reference, and examples/i,
    );
  });
});
