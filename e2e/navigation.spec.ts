import { test, expect, ROUTES } from './fixtures/test';

/**
 * Helper: open the mobile hamburger menu if visible (mobile viewport).
 * On desktop the nav is already visible — this is a no-op.
 */
async function openMenuIfMobile(page: import('@playwright/test').Page) {
  const hamburger = page.getByRole('button', { name: /Toggle menu/i });
  if (await hamburger.isVisible()) {
    await hamburger.click();
  }
}

test.describe('Announcement Banner', () => {
  test('should display coming soon message on landing page', async ({ page }) => {
    await page.goto(ROUTES.home);
    await expect(page.getByText(/Coming soon/)).toBeVisible();
  });

  test('should display coming soon message on docs page', async ({ page }) => {
    await page.goto(ROUTES.docs);
    await expect(page.getByText(/Coming soon/)).toBeVisible();
  });

  test('should display coming soon message on pricing page', async ({ page }) => {
    await page.goto(ROUTES.pricing);
    await expect(page.getByText(/Coming soon/)).toBeVisible();
  });

  test('should link to docs and pricing', async ({ page }) => {
    await page.goto(ROUTES.home);
    const banner = page.locator('div').filter({ hasText: /Coming soon/ }).first();
    await expect(banner.getByRole('link', { name: /Explore the docs/i })).toHaveAttribute(
      'href',
      '/docs',
    );
    await expect(banner.getByRole('link', { name: /check pricing/i })).toHaveAttribute(
      'href',
      '/pricing',
    );
  });
});

test.describe('Navigation — Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
  });

  test('should display logo with brand name', async ({ page }) => {
    await expect(page.getByRole('link', { name: /capacitor-bglocation/i }).first()).toBeVisible();
  });

  test('should display desktop nav links', async ({ page, }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop-only test');
    const nav = page.locator('header nav').first();
    await expect(nav.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Pricing' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
  });

  test('should display Get License CTA in header', async ({ page }) => {
    await openMenuIfMobile(page);
    await expect(
      page.locator('header').getByRole('button', { name: /Get License/i }).first(),
    ).toBeVisible();
  });

  test('should navigate to pricing page', async ({ page }) => {
    await openMenuIfMobile(page);
    await page.locator('header').getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL(/\/pricing/);
    await expect(
      page.getByRole('heading', { name: /Simple, Transparent Pricing/i }),
    ).toBeVisible();
  });

  test('should navigate to docs page', async ({ page }) => {
    await openMenuIfMobile(page);
    await page.locator('header').getByRole('link', { name: 'Docs' }).click();
    await expect(page).toHaveURL(/\/docs/);
    await expect(
      page.getByRole('heading', { name: /Documentation/i }).first(),
    ).toBeVisible();
  });

  test('should navigate to features section via anchor', async ({ page }) => {
    await openMenuIfMobile(page);
    await page.locator('header').getByRole('link', { name: 'Features' }).click();
    await expect(page).toHaveURL(/\/#features/);
  });

  test('should navigate home via logo click', async ({ page }) => {
    await page.goto(ROUTES.pricing);
    await page.getByRole('link', { name: /capacitor-bglocation/i }).first().click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Navigation — Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
  });

  test('should display footer brand', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /capacitor-bglocation/i })).toBeVisible();
  });

  test('should display footer column headings', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByText('Product', { exact: true })).toBeVisible();
    await expect(footer.getByText('Documentation', { exact: true })).toBeVisible();
    await expect(footer.getByText('Legal', { exact: true })).toBeVisible();
  });

  test('should display copyright notice', async ({ page }) => {
    await expect(page.getByText(/© \d{4} Szymon Walczak/)).toBeVisible();
  });

  test('should display ELv2 license link', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /Elastic License v2/i })).toBeVisible();
  });

  test('should have npm link with external target', async ({ page }) => {
    const npmLink = page.locator('footer').getByRole('link', { name: 'npm' });
    await expect(npmLink).toHaveAttribute('href', /npmjs\.com/);
    await expect(npmLink).toHaveAttribute('target', '_blank');
  });

  test('should display footer links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Pricing' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Getting Started' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'API Reference' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(footer.getByRole('link', { name: /License.*ELv2/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
  });
});

test.describe('Navigation — Mobile Menu', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show hamburger on mobile', async ({ page }) => {
    await page.goto(ROUTES.home);
    await expect(page.getByRole('button', { name: /Toggle menu/i })).toBeVisible();
  });

  test('should hide desktop nav on mobile', async ({ page }) => {
    await page.goto(ROUTES.home);
    const desktopNav = page.locator('header nav.hidden');
    await expect(desktopNav).not.toBeVisible();
  });

  test('should open and close mobile menu', async ({ page }) => {
    await page.goto(ROUTES.home);
    const toggle = page.getByRole('button', { name: /Toggle menu/i });

    // Open
    await toggle.click();
    await expect(page.locator('header nav').last().getByRole('link', { name: 'Pricing' })).toBeVisible();

    // Close
    await toggle.click();
    await expect(page.locator('header nav').last().getByRole('link', { name: 'Pricing' })).not.toBeVisible();
  });

  test('should navigate from mobile menu', async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.getByRole('button', { name: /Toggle menu/i }).click();
    await page.locator('header nav').last().getByRole('link', { name: 'Pricing' }).click();

    await expect(page).toHaveURL(/\/pricing/);
  });

  test('should close mobile menu after navigation', async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.getByRole('button', { name: /Toggle menu/i }).click();
    await page.locator('header nav').last().getByRole('link', { name: 'Docs' }).click();

    await expect(page).toHaveURL(/\/docs/);
    // Menu should be closed after nav click (onClick sets mobileOpen=false)
    const mobileNavLinks = page.locator('header nav').last().getByRole('link', { name: 'Features' });
    await expect(mobileNavLinks).not.toBeVisible();
  });
});

test.describe('Cross-page Navigation', () => {
  test('should navigate landing → pricing → docs → home', async ({ page }) => {
    // Landing
    await page.goto(ROUTES.home);
    await expect(page.getByRole('heading', { name: /Background Location/i }).first()).toBeVisible();

    // → Pricing
    await openMenuIfMobile(page);
    await page.locator('header').getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL(/\/pricing/);
    await expect(page.getByRole('heading', { name: /Simple, Transparent Pricing/i })).toBeVisible();

    // → Docs
    await openMenuIfMobile(page);
    await page.locator('header').getByRole('link', { name: 'Docs' }).click();
    await expect(page).toHaveURL(/\/docs/);
    await expect(page.getByRole('heading', { name: /Documentation/i }).first()).toBeVisible();

    // → Home via logo
    await page.getByRole('link', { name: /capacitor-bglocation/i }).first().click();
    await expect(page).toHaveURL('/');
  });
});
