import { test, expect, ROUTES } from './fixtures/test';

test.describe('Docs Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.docs);
  });

  test('should display page heading and framework switcher', async ({ page }) => {
    const switcher = page.locator('main').getByTestId('framework-switcher').first();

    await expect(page.getByRole('heading', { name: /Documentation/i }).first()).toBeVisible();
    await expect(switcher).toBeVisible();
  });

  test('should display default Capacitor quick install', async ({ page }) => {
    await expect(page.locator('code').filter({ hasText: 'npm install capacitor-bglocation' }).first()).toBeVisible();
    await expect(page.locator('code').filter({ hasText: 'npx cap sync' }).first()).toBeVisible();
  });

  test('should switch docs to React Native', async ({ page }) => {
    await page.locator('main').getByRole('radio', { name: /React Native/i }).first().click();

    await expect(page).toHaveURL(/framework=react-native/);
    await expect(page.locator('code').filter({ hasText: 'npm install react-native-bglocation' }).first()).toBeVisible();
    await expect(page.locator('code').filter({ hasText: 'npx expo prebuild' }).first()).toBeVisible();
    await expect(page.getByText(/Bare React Native apps still need/)).toBeVisible();
  });

  test('should render framework-aware section cards with jump links', async ({ page }) => {
    const sections = [
      'Getting Started',
      'Configuration',
      'API Reference',
      'Platform Guides',
      'Licensing',
      'Examples',
    ];

    for (const section of sections) {
      await expect(page.getByRole('heading', { name: section }).first()).toBeVisible();
    }

    await expect(page.locator('a[href="/docs?framework=capacitor#getting-started"]')).toBeVisible();
  });

  test('should display Capacitor getting started code by default', async ({ page }) => {
    const section = page.locator('#getting-started');

    await expect(section.getByText(/BackgroundLocation\.configure/).first()).toBeVisible();
    await expect(section.getByText(/BackgroundLocation\.start/).first()).toBeVisible();
  });

  test('should display React Native getting started code after switch', async ({ page }) => {
    await page.locator('main').getByRole('radio', { name: /React Native/i }).first().click();

    const section = page.locator('#getting-started');
    await expect(section.getByText(/const locationSubscription = addListener/)).toBeVisible();
    await expect(section.getByText(/await start\(\);/)).toBeVisible();
  });

  test('should display API, platform, licensing and examples content', async ({ page }) => {
    await expect(page.locator('#api-reference').getByText('getVersion()')).toBeVisible();
    await expect(page.locator('#api-reference').getByText('onGeofence')).toBeVisible();
    await expect(page.locator('#platform-guides').getByRole('heading', { name: 'iOS' })).toBeVisible();
    await expect(page.locator('#platform-guides').getByRole('heading', { name: 'Android' })).toBeVisible();
    await expect(page.locator('#licensing').getByRole('heading', { name: 'Adding a License Key' })).toBeVisible();
    await expect(page.locator('#examples').getByRole('heading', { name: /Fleet.*Delivery/i })).toBeVisible();
  });
});

test.describe('Docs Page — SEO', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(ROUTES.docs);
    await expect(page).toHaveTitle(/Documentation.*bglocation/i);
  });

  test('should have meta description', async ({ page }) => {
    await page.goto(ROUTES.docs);
    const description = page.locator('meta[name="description"]');

    await expect(description).toHaveAttribute(
      'content',
      /Capacitor and React Native apps/i,
    );
  });
});
