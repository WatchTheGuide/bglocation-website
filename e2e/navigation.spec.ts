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

async function selectFramework(
  page: import('@playwright/test').Page,
  frameworkName: string,
  scope: 'header' | 'page' = 'header',
) {
  const container = scope === 'header' ? page.locator('header') : page.locator('main');
  const frameworkValue = frameworkName.toLowerCase().replace(/\s+/g, '-');
  const switchers = container.getByTestId('framework-switcher');
  const firstSwitcher = switchers.first();
  let switcher = await firstSwitcher.isVisible().catch(() => false)
    ? firstSwitcher
    : switchers.last();

  if (!(await switcher.isVisible().catch(() => false)) && scope === 'header') {
    await openMenuIfMobile(page);
    switcher = container.getByTestId('framework-switcher').last();
  }

  const segmentedOption = switcher.locator(`[data-framework-option="${frameworkValue}"]`).first();

  if (await segmentedOption.isVisible().catch(() => false)) {
    await segmentedOption.click();
    await expect(page).toHaveURL(new RegExp(`framework=${frameworkValue}`));
    return;
  }

  const trigger = switcher.getByTestId('framework-switcher-trigger');
  await trigger.click();
  await switcher.locator(`[data-framework-option="${frameworkValue}"]`).click();
  await expect(page).toHaveURL(new RegExp(`framework=${frameworkValue}`));
}

test.describe('Announcement Banner', () => {
  test('should display launch message on landing page', async ({ page }) => {
    await page.goto(ROUTES.home);
    await expect(page.getByText(/License sales launch: April 27, 2026/)).toBeVisible();
  });

  test('should display launch message on docs page', async ({ page }) => {
    await page.goto(ROUTES.docs);
    await expect(page.getByText(/License sales launch: April 27, 2026/)).toBeVisible();
  });

  test('should display launch message on pricing page', async ({ page }) => {
    await page.goto(ROUTES.pricing);
    await expect(page.getByText(/License sales launch: April 27, 2026/)).toBeVisible();
  });

  test('should link to newsletter section and pricing', async ({ page }) => {
    await page.goto(ROUTES.home);
    const banner = page.locator('div').filter({ hasText: /License sales launch/ }).first();
    await expect(banner.getByRole('link', { name: /Get notified/i })).toHaveAttribute(
      'href',
      /\/\?framework=capacitor#newsletter-cta/,
    );
    await expect(banner.getByRole('link', { name: /view pricing/i })).toHaveAttribute(
      'href',
      /\/pricing\?framework=capacitor/,
    );
  });
});

test.describe('Navigation — Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
  });

  test('should canonicalize a truncated framework query to the closest supported value', async ({ page }) => {
    await page.goto('/docs?framework=react-nativ');

    await expect(page).toHaveURL(/\/docs\?framework=react-native/);
    await expect(
      page.locator('code').filter({ hasText: 'npm install @bglocation/react-native' }).first(),
    ).toBeVisible();
  });

  test('should canonicalize an unknown framework query to the default framework', async ({ page }) => {
    await page.goto('/pricing?framework=unknown');

    await expect(page).toHaveURL(/\/pricing\?framework=capacitor/);
    await expect(page.getByRole('heading', { name: /Simple, Transparent Pricing/i })).toBeVisible();
  });

  test('should switch framework on the first click from a bare URL', async ({ page }) => {
    await page.goto('/');
    await selectFramework(page, 'react-native');

    await expect(page).toHaveURL(/\/\?framework=react-native/);
    await expect(
      page.locator('code').filter({ hasText: 'npm install @bglocation/react-native' }).first(),
    ).toBeVisible();
  });

  test('should display logo with brand name', async ({ page }) => {
    await expect(page.getByRole('link', { name: /bglocation/i }).first()).toBeVisible();
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

  test('should display framework switcher in header', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop-only test');
    await expect(page.locator('header').getByTestId('framework-switcher')).toBeVisible();
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
    await expect(page).toHaveURL(/framework=capacitor.*#features/);
  });

  test('should navigate home via logo click', async ({ page }) => {
    await page.goto(ROUTES.pricing);
    await page.getByRole('link', { name: /bglocation/i }).first().click();
    await expect(page).toHaveURL(/\/\?framework=capacitor/);
  });

  test('should preserve framework when navigating between pages', async ({ page }) => {
    test.skip(page.viewportSize()?.width === 375, 'Uses desktop header switcher');
    await selectFramework(page, 'react-native');
    await page.locator('header').getByRole('link', { name: 'Docs' }).click();

    await expect(page).toHaveURL(/\/docs\?framework=react-native/);
    await expect(page.locator('code').filter({ hasText: 'npm install @bglocation/react-native' }).first()).toBeVisible();
  });
});

test.describe('Navigation — Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
  });

  test('should display footer brand', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /bglocation/i })).toBeVisible();
  });

  test('should display footer column headings', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByText('Product', { exact: true })).toBeVisible();
    await expect(footer.getByText('Documentation', { exact: true })).toBeVisible();
    await expect(footer.getByText('Company', { exact: true })).toBeVisible();
  });

  test('should display copyright notice', async ({ page }) => {
    await expect(page.getByText(/© \d{4} Szymon Walczak/)).toBeVisible();
  });

  test('should display ELv2 license link', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /Elastic License v2/i })).toBeVisible();
  });

  test('should have npm link with external target', async ({ page }) => {
    const npmLink = page.locator('footer').getByRole('link', { name: 'npm', exact: true });
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
  });

  test('should preserve framework when clicking footer links', async ({ page }) => {
    test.skip(page.viewportSize()?.width === 375, 'Uses desktop switcher to set framework explicitly');
    await selectFramework(page, 'react-native');
    await page.locator('footer').getByRole('link', { name: 'Getting Started' }).click();

    await expect(page).toHaveURL(/\/docs\?framework=react-native/);
    await expect(
      page.locator('code').filter({ hasText: 'npm install @bglocation/react-native' }).first(),
    ).toBeVisible();
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
    await page.getByRole('link', { name: /bglocation/i }).first().click();
    await expect(page).toHaveURL(/\/\?framework=capacitor/);
  });
});
