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
      const installSection = page.locator('.rounded-lg.border.bg-muted\\/30');
      await expect(installSection.getByText('npm install capacitor-bglocation')).toBeVisible();
      await expect(installSection.getByText('npx cap sync')).toBeVisible();
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
        await expect(page.getByRole('heading', { name: section }).first()).toBeVisible();
      }
    });

    test('should display section descriptions', async ({ page }) => {
      await expect(
        page.getByText(/Installation, configuration, and your first location track/i).first(),
      ).toBeVisible();
      await expect(
        page.getByText(/Complete TypeScript API/i).first(),
      ).toBeVisible();
    });

    test('should link cards to anchor sections', async ({ page }) => {
      const card = page.locator('a[href="#getting-started"]');
      await expect(card).toBeVisible();
    });
  });

  test.describe('Getting Started Section', () => {
    test('should display Getting Started content', async ({ page }) => {
      const section = page.locator('#getting-started');
      await expect(section).toBeVisible();
      await expect(section.getByRole('heading', { name: '1. Install' })).toBeVisible();
      await expect(section.getByRole('heading', { name: '2. Configure & Start' })).toBeVisible();
      await expect(section.getByRole('heading', { name: '3. Stop Tracking' })).toBeVisible();
    });

    test('should display code examples', async ({ page }) => {
      const section = page.locator('#getting-started');
      await expect(section.getByText(/BackgroundLocation\.configure/).first()).toBeVisible();
      await expect(section.getByText(/BackgroundLocation\.start/).first()).toBeVisible();
    });
  });

  test.describe('Configuration Section', () => {
    test('should display Configuration heading', async ({ page }) => {
      const section = page.locator('#configuration');
      await expect(section).toBeVisible();
    });

    test('should display Core Options table', async ({ page }) => {
      const section = page.locator('#configuration');
      await expect(section.getByRole('heading', { name: 'Core Options' })).toBeVisible();
      await expect(section.locator('table').first().getByText('distanceFilter')).toBeVisible();
      await expect(section.locator('table').first().getByText('heartbeatInterval')).toBeVisible();
    });

    test('should display HTTP Posting section', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'HTTP Posting' })).toBeVisible();
    });

    test('should display HTTP POST body structure', async ({ page }) => {
      const section = page.locator('#configuration');
      await expect(section.getByRole('heading', { name: 'HTTP POST Body' })).toBeVisible();
      await expect(section.getByText('"location"').first()).toBeVisible();
      await expect(section.getByText('"isMoving"').first()).toBeVisible();
      await expect(section.getByText('"isMock"').first()).toBeVisible();
    });

    test('should display HttpEvent interface', async ({ page }) => {
      const section = page.locator('#configuration');
      await expect(section.getByRole('heading', { name: /HttpEvent/i })).toBeVisible();
      await expect(section.getByText('bufferedCount').first()).toBeVisible();
      await expect(section.getByText('responseText').first()).toBeVisible();
    });

    test('should display Offline Buffer section', async ({ page }) => {
      const section = page.locator('#configuration');
      await expect(section.getByRole('heading', { name: /Offline Buffer/i })).toBeVisible();
      await expect(section.getByText(/SQLite/i).first()).toBeVisible();
    });

    test('should display Adaptive Distance Filter section', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Adaptive Distance Filter' }),
      ).toBeVisible();
    });
  });

  test.describe('API Reference Section', () => {
    test('should display API Reference heading', async ({ page }) => {
      const section = page.locator('#api-reference');
      await expect(section).toBeVisible();
    });

    test('should display Methods table', async ({ page }) => {
      const section = page.locator('#api-reference');
      await expect(section.getByText('configure(options)').first()).toBeVisible();
      await expect(section.getByText('start()', { exact: true }).first()).toBeVisible();
      await expect(section.getByText('stop()', { exact: true }).first()).toBeVisible();
    });

    test('should display Events table', async ({ page }) => {
      const section = page.locator('#api-reference');
      await expect(section.getByRole('heading', { name: 'Events' })).toBeVisible();
      await expect(section.getByText('onLocation', { exact: true }).first()).toBeVisible();
      await expect(section.getByText('onHeartbeat', { exact: true }).first()).toBeVisible();
      await expect(section.getByText('onGeofence', { exact: true }).first()).toBeVisible();
    });

    test('should display Location Object interface', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Location Object' }),
      ).toBeVisible();
    });

    test('should display Geofencing section', async ({ page }) => {
      const section = page.locator('#api-reference');
      await expect(section.getByRole('heading', { name: 'Geofencing' })).toBeVisible();
      await expect(section.getByText('addGeofence(geofence)').first()).toBeVisible();
    });

    test('should display Geofence interface', async ({ page }) => {
      const section = page.locator('#api-reference');
      await expect(section.getByRole('heading', { name: 'Geofence Interface' })).toBeVisible();
      await expect(section.getByText('notifyOnEntry').first()).toBeVisible();
      await expect(section.getByText('dwellDelay').first()).toBeVisible();
    });

    test('should display GeofenceEvent interface', async ({ page }) => {
      const section = page.locator('#api-reference');
      await expect(section.getByRole('heading', { name: 'GeofenceEvent Interface' })).toBeVisible();
      await expect(section.getByText("'enter' | 'exit' | 'dwell'").first()).toBeVisible();
    });

    test('should display Geofencing error codes', async ({ page }) => {
      const section = page.locator('#api-reference');
      await expect(section.getByRole('heading', { name: 'Error Codes' })).toBeVisible();
      await expect(section.getByText('GEOFENCE_LIMIT_EXCEEDED').first()).toBeVisible();
      await expect(section.getByText('NOT_CONFIGURED').first()).toBeVisible();
    });
  });

  test.describe('Platform Guides Section', () => {
    test('should display Platform Guides heading', async ({ page }) => {
      const section = page.locator('#platform-guides');
      await expect(section).toBeVisible();
    });

    test('should display iOS guide', async ({ page }) => {
      const section = page.locator('#platform-guides');
      await expect(section.getByRole('heading', { name: 'iOS' })).toBeVisible();
      await expect(section.getByRole('heading', { name: /Info\.plist/ })).toBeVisible();
      await expect(section.getByRole('heading', { name: 'Background Modes' })).toBeVisible();
    });

    test('should display Android guide', async ({ page }) => {
      const section = page.locator('#platform-guides');
      await expect(section.getByRole('heading', { name: 'Android' })).toBeVisible();
      await expect(section.getByRole('heading', { name: 'Foreground Service' })).toBeVisible();
      await expect(section.getByRole('heading', { name: 'Two-Step Permission Flow' })).toBeVisible();
    });
  });

  test.describe('Licensing Section', () => {
    test('should display Licensing heading', async ({ page }) => {
      const section = page.locator('#licensing');
      await expect(section).toBeVisible();
    });

    test('should display trial mode info', async ({ page }) => {
      const section = page.locator('#licensing');
      await expect(section.getByRole('heading', { name: 'Trial Mode' })).toBeVisible();
      await expect(section.getByText(/30-minute sessions/i).first()).toBeVisible();
      await expect(section.getByText(/1-hour cooldown/i).first()).toBeVisible();
    });

    test('should display license key configuration example', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Adding a License Key' }),
      ).toBeVisible();
      await expect(page.locator('#licensing').getByText(/capacitor\.config\.ts/i).first()).toBeVisible();
    });
  });

  test.describe('Examples Section', () => {
    test('should display Examples heading', async ({ page }) => {
      const section = page.locator('#examples');
      await expect(section).toBeVisible();
    });

    test('should display Fleet / Delivery example', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Fleet.*Delivery/i }),
      ).toBeVisible();
    });

    test('should display Fitness / Running example', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Fitness.*Running/i }),
      ).toBeVisible();
    });

    test('should display Geofencing example', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Geofencing.*Points of Interest/i }),
      ).toBeVisible();
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
