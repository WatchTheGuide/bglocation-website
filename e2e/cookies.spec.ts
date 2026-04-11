import { test, expect, ROUTES } from './fixtures/test';

const STORAGE_KEY = 'bgl_cookie_consent_v2';

function makeConsent(analytics: boolean, timestamp?: number): string {
  return JSON.stringify({
    necessary: true,
    analytics,
    timestamp: timestamp ?? Date.now(),
  });
}

test.describe('Cookie Banner', () => {
  test('should display cookie banner on first visit', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await expect(banner).toBeVisible();
    await expect(banner.getByText(/essential cookies/i)).toBeVisible();
  });

  test('should contain link to cookie policy', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    const link = banner.getByRole('link', { name: /learn more/i });
    await expect(link).toHaveAttribute('href', /\/cookies/);
  });

  test('should dismiss banner on "Essential only" click', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await expect(banner).toBeVisible();

    await banner.getByRole('button', { name: /essential only/i }).click();
    await expect(banner).not.toBeVisible();
  });

  test('should dismiss banner on "Accept all" click', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await expect(banner).toBeVisible();

    await banner.getByRole('button', { name: /accept all/i }).click();
    await expect(banner).not.toBeVisible();
  });

  test('should not show banner after dismissal on page reload', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await banner.getByRole('button', { name: /essential only/i }).click();
    await expect(banner).not.toBeVisible();

    await page.reload();

    await expect(
      page.getByRole('region', { name: /cookie notice/i })
    ).not.toBeVisible();
  });

  test('should persist consent as JSON in localStorage with "Essential only"', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await banner.getByRole('button', { name: /essential only/i }).click();

    const value = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEY,
    );
    expect(value).not.toBeNull();
    const parsed = JSON.parse(value!);
    expect(parsed.necessary).toBe(true);
    expect(parsed.analytics).toBe(false);
    expect(parsed.timestamp).toBeGreaterThan(0);
  });

  test('should persist consent as JSON in localStorage with "Accept all"', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await banner.getByRole('button', { name: /accept all/i }).click();

    const value = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEY,
    );
    expect(value).not.toBeNull();
    const parsed = JSON.parse(value!);
    expect(parsed.necessary).toBe(true);
    expect(parsed.analytics).toBe(true);
    expect(parsed.timestamp).toBeGreaterThan(0);
  });

  test('should re-show banner when consent is expired (>365 days)', async ({ page }) => {
    const expiredTimestamp = Date.now() - 366 * 24 * 60 * 60 * 1000;
    const consent = makeConsent(true, expiredTimestamp);
    await page.addInitScript(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key: STORAGE_KEY, value: consent });

    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await expect(banner).toBeVisible();
  });

  test('should hide banner when consent is fresh (<365 days)', async ({ page }) => {
    const freshConsent = makeConsent(false, Date.now() - 1 * 24 * 60 * 60 * 1000);
    await page.addInitScript(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key: STORAGE_KEY, value: freshConsent });

    await page.goto(ROUTES.home);

    await expect(
      page.getByRole('region', { name: /cookie notice/i })
    ).not.toBeVisible();
  });

  test('should migrate v1 consent and re-show banner', async ({ page }) => {
    const v1Timestamp = String(Date.now());
    await page.addInitScript(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key: 'bgl_cookie_consent_v1', value: v1Timestamp });

    await page.goto(ROUTES.home);

    // Banner should re-appear (v1 users must re-consent for analytics)
    const banner = page.getByRole('region', { name: /cookie notice/i });
    await expect(banner).toBeVisible();

    // After hydration + migration, v1 key should be removed
    const v1Value = await page.evaluate(() =>
      localStorage.getItem('bgl_cookie_consent_v1'),
    );
    expect(v1Value).toBeNull();
  });
});

test.describe('Analytics Consent', () => {
  test('should not load analytics script when "Essential only" is chosen', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await banner.getByRole('button', { name: /essential only/i }).click();

    // Verify consent was saved with analytics: false
    const value = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEY,
    );
    expect(value).not.toBeNull();
    const parsed = JSON.parse(value!);
    expect(parsed.analytics).toBe(false);
  });

  test('should save analytics consent when "Accept all" is chosen', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await banner.getByRole('button', { name: /accept all/i }).click();

    // Verify consent was saved with analytics: true
    const value = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEY,
    );
    expect(value).not.toBeNull();
    const parsed = JSON.parse(value!);
    expect(parsed.analytics).toBe(true);
  });

  test('should have analytics consent active on revisit with existing consent', async ({ page }) => {
    const consent = makeConsent(true);
    await page.addInitScript(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key: STORAGE_KEY, value: consent });

    await page.goto(ROUTES.home);

    // Banner should be hidden
    await expect(
      page.getByRole('region', { name: /cookie notice/i })
    ).not.toBeVisible();

    // Consent should still be present with analytics: true
    const value = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEY,
    );
    expect(value).not.toBeNull();
    const parsed = JSON.parse(value!);
    expect(parsed.analytics).toBe(true);
  });
});

test.describe('Manage Cookie Preferences', () => {
  test('should re-show banner when "Manage cookie preferences" is clicked in footer', async ({ page }) => {
    // First accept all cookies
    await page.goto(ROUTES.home);
    const banner = page.getByRole('region', { name: /cookie notice/i });
    await banner.getByRole('button', { name: /accept all/i }).click();
    await expect(banner).not.toBeVisible();

    // Click manage preferences in footer
    const footer = page.locator('footer');
    await footer.getByRole('button', { name: /manage cookie preferences/i }).click();

    // Banner should re-appear
    await expect(
      page.getByRole('region', { name: /cookie notice/i })
    ).toBeVisible();
  });

  test('should re-show banner when "Manage cookie preferences" is clicked on cookies page', async ({ page }) => {
    // Set consent so banner is hidden
    const consent = makeConsent(true);
    await page.addInitScript(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key: STORAGE_KEY, value: consent });

    await page.goto(ROUTES.cookies);

    await expect(
      page.getByRole('region', { name: /cookie notice/i })
    ).not.toBeVisible();

    // Click manage preferences button on cookies page
    const main = page.getByRole('main');
    await main.getByRole('button', { name: /manage cookie preferences/i }).click();

    // Banner should re-appear
    await expect(
      page.getByRole('region', { name: /cookie notice/i })
    ).toBeVisible();
  });
});

test.describe('Cookie Policy Page', () => {
  test('should render cookie policy page', async ({ page }) => {
    await page.goto(ROUTES.cookies);

    await expect(
      page.getByRole('heading', { level: 1, name: /cookie policy/i }),
    ).toBeVisible();
  });

  test('should list session cookies in table', async ({ page }) => {
    await page.goto(ROUTES.cookies);

    await expect(page.getByText('bgl_session')).toBeVisible();
    await expect(page.getByText('bgl_admin_session')).toBeVisible();
  });

  test('should have analytics section', async ({ page }) => {
    await page.goto(ROUTES.cookies);

    await expect(
      page.getByRole('heading', { name: /analytics/i }),
    ).toBeVisible();
    await expect(page.getByText(/vercel web analytics/i)).toBeVisible();
  });

  test('should link to privacy policy', async ({ page }) => {
    await page.goto(ROUTES.cookies);

    const main = page.getByRole('main');
    const link = main.getByRole('link', { name: /privacy policy/i });
    await expect(link).toHaveAttribute('href', '/privacy');
  });

  test('should have cookie policy link in footer', async ({ page }) => {
    await page.goto(ROUTES.home);

    const footer = page.locator('footer');
    const link = footer.getByRole('link', { name: /cookie policy/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/cookies/);
  });
});
