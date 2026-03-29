import { test, expect, ROUTES } from './fixtures/test';

const STORAGE_KEY = 'bgl_cookie_consent_v1';

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
    await expect(link).toHaveAttribute('href', '/cookies');
  });

  test('should dismiss banner on "Got it" click', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await expect(banner).toBeVisible();

    await banner.getByRole('button', { name: /got it/i }).click();
    await expect(banner).not.toBeVisible();
  });

  test('should not show banner after dismissal on page reload', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await banner.getByRole('button', { name: /got it/i }).click();
    await expect(banner).not.toBeVisible();

    await page.reload();

    await expect(
      page.getByRole('region', { name: /cookie notice/i })
    ).not.toBeVisible();
  });

  test('should persist dismissal in localStorage', async ({ page }) => {
    await page.goto(ROUTES.home);

    const banner = page.getByRole('region', { name: /cookie notice/i });
    await banner.getByRole('button', { name: /got it/i }).click();

    const value = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEY,
    );
    expect(value).not.toBeNull();
    expect(Number(value)).toBeGreaterThan(0);
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
