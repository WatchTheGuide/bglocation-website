import { test, expect, ROUTES } from './fixtures/test';

/**
 * Helper: ensure the theme toggle is visible.
 * On desktop it's always visible. On mobile, open the hamburger menu if needed.
 */
async function ensureToggleVisible(page: import('@playwright/test').Page) {
  const toggle = page.getByRole('button', { name: /toggle theme/i });
  if (await toggle.isVisible()) return;

  // Mobile: open hamburger menu
  const hamburger = page.getByRole('button', { name: /toggle menu/i });
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await toggle.waitFor({ state: 'visible' });
  }
}

test.describe('Dark Mode', () => {
  test('should toggle dark mode via dropdown', async ({ page }) => {
    await page.goto(ROUTES.home);

    const html = page.locator('html');

    await ensureToggleVisible(page);

    // Open theme toggle dropdown and select "Dark"
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: /dark/i }).click();

    // Verify .dark class is on <html>
    await expect(html).toHaveClass(/dark/);

    // Re-ensure toggle visible (on mobile, dropdown close may affect nav state)
    await ensureToggleVisible(page);

    // Switch to "Light"
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: /light/i }).click();

    // Verify .dark class is removed
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should persist theme choice across page reload', async ({ page }) => {
    await page.goto(ROUTES.home);

    await ensureToggleVisible(page);

    // Select dark theme
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: /dark/i }).click();

    await expect(page.locator('html')).toHaveClass(/dark/);

    // Reload page
    await page.reload();

    // Theme should persist
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should offer System option that removes manual override', async ({ page }) => {
    await page.goto(ROUTES.home);

    await ensureToggleVisible(page);

    // First set dark mode manually
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: /dark/i }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Re-ensure toggle visible
    await ensureToggleVisible(page);

    // Switch to system
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: /system/i }).click();

    // Verify localStorage theme key is set to "system"
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('system');
  });

  test('should show toggle on mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(ROUTES.home);

    // Open mobile menu
    await page.getByRole('button', { name: /toggle menu/i }).click();

    // Theme toggle should be visible in mobile nav
    const toggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(toggle).toBeVisible();
  });
});
