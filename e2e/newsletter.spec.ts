import { test, expect, ROUTES } from './fixtures/test';

test.describe('Newsletter', () => {
  test.describe('Landing CTA Section', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(ROUTES.home);
    });

    test('should display newsletter CTA section', async ({ page }) => {
      const cta = page.locator('#newsletter-cta');
      await expect(cta).toBeVisible();
      await expect(
        cta.getByRole('heading', {
          name: /Follow The Next Wrapper Releases/i,
        }),
      ).toBeVisible();
      await expect(cta.getByText(/React Native Is Live/i)).toBeVisible();
    });

    test('should have consent checkbox required', async ({ page }) => {
      const cta = page.locator('#newsletter-cta');
      const checkbox = cta.locator('input[type="checkbox"]');
      await expect(checkbox).toBeVisible();
      await expect(checkbox).not.toBeChecked();
    });

    test('should disable subscribe button when consent unchecked', async ({
      page,
    }) => {
      const cta = page.locator('#newsletter-cta');
      await expect(
        cta.getByRole('button', { name: /notify me/i }),
      ).toBeDisabled();
    });

    test('should enable subscribe button after checking consent', async ({
      page,
    }) => {
      const cta = page.locator('#newsletter-cta');
      await cta.locator('input[type="checkbox"]').check();
      await expect(
        cta.getByRole('button', { name: /notify me/i }),
      ).toBeEnabled();
    });

    test('should show success message on successful subscribe', async ({
      page,
    }) => {
      await page.route('**/api/newsletter/subscribe', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Check your email to confirm' }),
        }),
      );

      const cta = page.locator('#newsletter-cta');
      await cta.getByPlaceholder('you@example.com').fill('test@example.com');
      await cta.locator('input[type="checkbox"]').check();
      await cta.getByRole('button', { name: /notify me/i }).click();

      await expect(
        cta.getByText(/check your email to confirm/i),
      ).toBeVisible();
    });

    test('should show error message on failed subscribe', async ({
      page,
    }) => {
      await page.route('**/api/newsletter/subscribe', (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' }),
        }),
      );

      const cta = page.locator('#newsletter-cta');
      await cta.getByPlaceholder('you@example.com').fill('test@example.com');
      await cta.locator('input[type="checkbox"]').check();
      await cta.getByRole('button', { name: /notify me/i }).click();

      await expect(
        cta.getByText(/internal server error/i),
      ).toBeVisible();
    });

    test('should have privacy policy link in newsletter form', async ({ page }) => {
      const form = page.locator('#newsletter-cta form');
      await expect(
        form.getByRole('link', { name: /privacy policy/i }),
      ).toHaveAttribute('href', '/privacy');
    });

    test('should display platform chips', async ({ page }) => {
      const cta = page.locator('#newsletter-cta');
      for (const platform of [
        'Capacitor',
        'React Native',
        'Flutter',
        'Kotlin Multiplatform',
      ]) {
        await expect(
          cta.getByRole('button', { name: platform }),
        ).toBeVisible();
      }
    });

    test('should toggle platform selection', async ({ page }) => {
      const cta = page.locator('#newsletter-cta');
      const btn = cta.getByRole('button', { name: 'React Native' });

      // Initially unselected (outline style)
      await expect(btn).not.toHaveClass(/bg-primary/);

      // Click to select
      await btn.click();
      await expect(btn).toHaveClass(/bg-primary/);

      // Click again to deselect
      await btn.click();
      await expect(btn).not.toHaveClass(/bg-primary/);
    });

    test('should have email input and notify button', async ({ page }) => {
      const cta = page.locator('#newsletter-cta');
      await expect(
        cta.getByPlaceholder('you@example.com'),
      ).toBeVisible();
      await expect(
        cta.getByRole('button', { name: /notify me/i }),
      ).toBeVisible();
    });

    test('should disable notify button when consent unchecked', async ({
      page,
    }) => {
      const cta = page.locator('#newsletter-cta');
      await expect(
        cta.getByRole('button', { name: /notify me/i }),
      ).toBeDisabled();
    });

    test('should show success after submission', async ({ page }) => {
      await page.route('**/api/newsletter/subscribe', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Check your email to confirm' }),
        }),
      );

      const cta = page.locator('#newsletter-cta');
      await cta.getByRole('button', { name: 'Flutter' }).click();
      await cta.getByPlaceholder('you@example.com').fill('dev@test.com');
      await cta.locator('input[type="checkbox"]').check();
      await cta.getByRole('button', { name: /notify me/i }).click();

      await expect(
        cta.getByText(/check your email to confirm/i),
      ).toBeVisible();
    });

    test('should send platforms in request body', async ({ page }) => {
      let requestBody: Record<string, unknown> | null = null;

      await page.route('**/api/newsletter/subscribe', async (route) => {
        const body = route.request().postDataJSON();
        requestBody = body;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'ok' }),
        });
      });

      const cta = page.locator('#newsletter-cta');
      await cta.getByRole('button', { name: 'Capacitor' }).click();
      await cta.getByRole('button', { name: 'Flutter' }).click();
      await cta.getByPlaceholder('you@example.com').fill('dev@test.com');
      await cta.locator('input[type="checkbox"]').check();
      await cta.getByRole('button', { name: /notify me/i }).click();

      await expect(
        cta.getByText(/check your email to confirm/i),
      ).toBeVisible();

      expect(requestBody).not.toBeNull();
      expect((requestBody as Record<string, unknown>).platforms).toEqual(
        expect.arrayContaining(['capacitor', 'flutter']),
      );
      expect((requestBody as Record<string, unknown>).source).toBe('cta');
    });
  });

  test.describe('Honeypot', () => {
    test('should silently succeed when honeypot is filled', async ({
      page,
    }) => {
      let requestBody: Record<string, unknown> | null = null;

      await page.route('**/api/newsletter/subscribe', async (route) => {
        requestBody = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Check your email to confirm',
          }),
        });
      });

      await page.goto(ROUTES.home);

      const cta = page.locator('#newsletter-cta');
      await cta.getByPlaceholder('you@example.com').fill('bot@spam.com');
      await cta.locator('input[type="checkbox"]').check();

      // Fill honeypot via JS (hidden from view)
      await page.evaluate(() => {
        const honeypot = document.querySelector(
          '#newsletter-cta input[name="website"]',
        ) as HTMLInputElement;
        if (honeypot) honeypot.value = 'http://spam.com';
      });

      await cta.getByRole('button', { name: /notify me/i }).click();

      await expect(
        cta.getByText(/check your email to confirm/i),
      ).toBeVisible();

      expect(requestBody).not.toBeNull();
      expect((requestBody as Record<string, unknown>).website).toBe(
        'http://spam.com',
      );
    });
  });

  test.describe('Confirm Page', () => {
    test('should show invalid link when no token', async ({ page }) => {
      await page.goto(ROUTES.newsletterConfirm);
      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Invalid Link/i }),
      ).toBeVisible();
      await expect(
        page.getByText(/confirmation link is invalid/i),
      ).toBeVisible();
    });

    test('should show confirm button when token is present', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.newsletterConfirm}?token=test-token-123`);
      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Confirm Your Subscription/i }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: /Confirm My Subscription/i }),
      ).toBeVisible();
    });

    test('should show success after confirming', async ({ page }) => {
      await page.route('**/api/newsletter/confirm', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Subscription confirmed' }),
        }),
      );

      await page.goto(`${ROUTES.newsletterConfirm}?token=valid-token`);
      await page.getByRole('button', { name: /Confirm My Subscription/i }).click();

      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Subscription Confirmed/i }),
      ).toBeVisible();
      await expect(
        page.getByText(/You're all set/i),
      ).toBeVisible();
    });

    test('should show already confirmed state', async ({ page }) => {
      await page.route('**/api/newsletter/confirm', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Already confirmed' }),
        }),
      );

      await page.goto(`${ROUTES.newsletterConfirm}?token=used-token`);
      await page.getByRole('button', { name: /Confirm My Subscription/i }).click();

      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Already Confirmed/i }),
      ).toBeVisible();
    });

    test('should show expired state with 410 response', async ({ page }) => {
      await page.route('**/api/newsletter/confirm', (route) =>
        route.fulfill({
          status: 410,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Token expired' }),
        }),
      );

      await page.goto(`${ROUTES.newsletterConfirm}?token=expired-token`);
      await page.getByRole('button', { name: /Confirm My Subscription/i }).click();

      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Link Expired/i }),
      ).toBeVisible();
      await expect(
        page.getByText(/confirmation link has expired/i),
      ).toBeVisible();
    });

    test('should show error state on failure', async ({ page }) => {
      await page.route('**/api/newsletter/confirm', (route) =>
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Invalid token' }),
        }),
      );

      await page.goto(`${ROUTES.newsletterConfirm}?token=bad-token`);
      await page.getByRole('button', { name: /Confirm My Subscription/i }).click();

      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Confirmation Failed/i }),
      ).toBeVisible();
    });

    test('should have link back to homepage', async ({ page }) => {
      await page.route('**/api/newsletter/confirm', (route) =>
        route.fulfill({
          status: 410,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Token expired' }),
        }),
      );

      await page.goto(`${ROUTES.newsletterConfirm}?token=expired-token`);
      await page.getByRole('button', { name: /Confirm My Subscription/i }).click();

      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Link Expired/i }),
      ).toBeVisible();

      await expect(
        page.getByRole('link', { name: /bglocation\.dev/i }),
      ).toHaveAttribute('href', '/');
    });
  });

  test.describe('Unsubscribe Page', () => {
    test('should show invalid link when no token', async ({ page }) => {
      await page.goto(ROUTES.newsletterUnsubscribe);
      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Invalid Link/i }),
      ).toBeVisible();
      await expect(
        page.getByText(/unsubscribe link is invalid/i),
      ).toBeVisible();
    });

    test('should show unsubscribe button when token present', async ({
      page,
    }) => {
      await page.goto(
        `${ROUTES.newsletterUnsubscribe}?token=test-token-123`,
      );
      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Unsubscribe/i }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: /Unsubscribe/i }),
      ).toBeVisible();
    });

    test('should show success after unsubscribing', async ({ page }) => {
      await page.route('**/api/newsletter/unsubscribe', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Unsubscribed' }),
        }),
      );

      await page.goto(
        `${ROUTES.newsletterUnsubscribe}?token=valid-token`,
      );
      await page.getByRole('button', { name: /Unsubscribe/i }).click();

      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /^Unsubscribed$/i }),
      ).toBeVisible();
      await expect(
        page.getByText(/sorry to see you go/i),
      ).toBeVisible();
    });

    test('should show already unsubscribed state', async ({ page }) => {
      await page.route('**/api/newsletter/unsubscribe', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Already unsubscribed' }),
        }),
      );

      await page.goto(
        `${ROUTES.newsletterUnsubscribe}?token=used-token`,
      );
      await page.getByRole('button', { name: /Unsubscribe/i }).click();

      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Already Unsubscribed/i }),
      ).toBeVisible();
    });

    test('should show error state on failure', async ({ page }) => {
      await page.route('**/api/newsletter/unsubscribe', (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' }),
        }),
      );

      await page.goto(
        `${ROUTES.newsletterUnsubscribe}?token=bad-token`,
      );
      await page.getByRole('button', { name: /Unsubscribe/i }).click();

      await expect(
        page.locator('[data-slot="card-title"]', { hasText: /Something Went Wrong/i }),
      ).toBeVisible();
    });
  });

  test.describe('Admin Subscribers', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        '/api/dev/admin-login?email=admin@bglocation.dev',
      );
      await expect(page).toHaveURL('/admin');
    });

    test('should have Subscribers link in sidebar', async ({ page }) => {
      await expect(
        page.getByRole('link', { name: /Subscribers/i }),
      ).toBeVisible();
    });

    test('should navigate to subscribers page', async ({ page }) => {
      await page.getByRole('link', { name: /Subscribers/i }).click();
      await expect(page).toHaveURL(/\/admin\/subscribers/);
      await expect(
        page.getByRole('heading', { name: /Subscribers/i }),
      ).toBeVisible();
    });

    test('should display KPI stat cards', async ({ page }) => {
      await page.goto(ROUTES.adminSubscribers);

      const kpiGrid = page.locator('.grid.sm\\:grid-cols-4');
      await expect(kpiGrid.locator('[data-slot="card-title"]', { hasText: 'Total' })).toBeVisible();
      await expect(kpiGrid.locator('[data-slot="card-title"]', { hasText: 'Confirmed' })).toBeVisible();
      await expect(kpiGrid.locator('[data-slot="card-title"]', { hasText: 'Pending' })).toBeVisible();
      await expect(kpiGrid.locator('[data-slot="card-title"]', { hasText: 'Unsubscribed' })).toBeVisible();
    });

    test('should have search input', async ({ page }) => {
      await page.goto(ROUTES.adminSubscribers);
      await expect(
        page.getByPlaceholder(/search by email/i),
      ).toBeVisible();
    });

    test('should have status filter buttons', async ({ page }) => {
      await page.goto(ROUTES.adminSubscribers);
      for (const status of ['confirmed', 'pending', 'unsubscribed']) {
        await expect(
          page.getByRole('button', { name: new RegExp(status, 'i') }),
        ).toBeVisible();
      }
    });

    test('should have platform filter buttons', async ({ page }) => {
      await page.goto(ROUTES.adminSubscribers);
      for (const platform of ['capacitor', 'react-native', 'flutter', 'kmp']) {
        await expect(
          page.getByRole('button', { name: new RegExp(platform, 'i') }),
        ).toBeVisible();
      }
    });

    test('should toggle status filter', async ({ page }) => {
      await page.goto(ROUTES.adminSubscribers);
      await page.getByRole('button', { name: /^confirmed$/i }).click();
      await expect(page).toHaveURL(/status=confirmed/);

      await page.getByRole('button', { name: /^confirmed$/i }).click();
      await expect(page).not.toHaveURL(/status=confirmed/);
    });

    test('should toggle platform filter', async ({ page }) => {
      await page.goto(ROUTES.adminSubscribers);
      await page.getByRole('button', { name: /^capacitor$/i }).click();
      await expect(page).toHaveURL(/platform=capacitor/);

      await page.getByRole('button', { name: /^capacitor$/i }).click();
      await expect(page).not.toHaveURL(/platform=capacitor/);
    });

    test('should search by email', async ({ page }) => {
      await page.goto(ROUTES.adminSubscribers);
      await page.getByPlaceholder(/search by email/i).fill('test@');
      const searchBtn = page.locator('form').filter({ has: page.getByPlaceholder(/search by email/i) }).getByRole('button', { name: /search/i });
      await searchBtn.scrollIntoViewIfNeeded();
      await searchBtn.click({ force: true });
      await expect(page).toHaveURL(/search=test%40/);
    });

    test('should display table with columns', async ({ page }) => {
      await page.goto(ROUTES.adminSubscribers);
      const table = page.locator('table');
      await expect(table).toBeVisible();
      await expect(table.locator('th').filter({ hasText: 'Email' })).toBeVisible();
      await expect(table.locator('th').filter({ hasText: 'Status' })).toBeVisible();
      await expect(table.locator('th').filter({ hasText: 'Platforms' })).toBeVisible();
      await expect(table.locator('th').filter({ hasText: 'Source' })).toBeVisible();
      await expect(table.locator('th').filter({ hasText: 'Subscribed' })).toBeVisible();
    });

    test('should sort by column', async ({ page }) => {
      await page.goto(ROUTES.adminSubscribers);
      await page.locator('th').filter({ hasText: 'Email' }).locator('button').click();
      await expect(page).toHaveURL(/sort=email/);
    });

    test('should show matching count', async ({ page }) => {
      await page.goto(ROUTES.adminSubscribers);
      await expect(page.getByText(/\d+ matching/)).toBeVisible();
    });
  });
});
