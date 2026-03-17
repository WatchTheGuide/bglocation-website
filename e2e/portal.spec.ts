import { test, expect } from './fixtures/test';

test.describe('Portal', () => {
  test.describe('Authentication', () => {
    test('should redirect /portal to /portal/login when not authenticated', async ({
      page,
    }) => {
      await page.goto('/portal');
      await expect(page).toHaveURL(/\/portal\/login/);
    });

    test('should show portal login form', async ({ page }) => {
      await page.goto('/portal/login');
      await expect(page.getByText(/sign in with email/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(
        page.getByRole('button', { name: /send sign-in link/i }),
      ).toBeVisible();
    });

    test('should show success message after submitting email', async ({
      page,
    }) => {
      await page.goto('/portal/login');
      await page.getByLabel(/email/i).fill('test@bglocation.dev');
      await page.getByRole('button', { name: /send sign-in link/i }).click();
      await expect(page.getByText(/check your email/i)).toBeVisible();
    });

    test('should login via dev endpoint and see dashboard', async ({
      page,
    }) => {
      await page.goto(
        '/api/dev/login?email=test@bglocation.dev',
      );
      await expect(page).toHaveURL('/portal');
      await expect(
        page.getByRole('heading', { name: /License Portal/i }),
      ).toBeVisible();
    });

    test('should sign out from portal', async ({ page }) => {
      await page.goto(
        '/api/dev/login?email=test@bglocation.dev',
      );
      await expect(page).toHaveURL('/portal');

      await page.getByRole('button', { name: /sign out/i }).click();
      await expect(page).toHaveURL(/\/portal\/login/);
    });
  });

  test.describe('Verify Page', () => {
    test('should show error when token is missing', async ({ page }) => {
      await page.goto('/portal/verify');
      await expect(page.getByText(/Verification failed/i)).toBeVisible();
      await expect(page.getByText(/Missing verification token/i)).toBeVisible();
      await expect(
        page.getByRole('link', { name: /back to sign in/i }),
      ).toBeVisible();
    });

    test('should show error when token is invalid', async ({ page }) => {
      await page.goto('/portal/verify?token=invalid-token-xyz');
      await expect(page.getByText(/Verification failed/i)).toBeVisible();
      await expect(
        page.getByText(/Invalid or expired link/i),
      ).toBeVisible();
    });

    test('should link back to portal login', async ({ page }) => {
      await page.goto('/portal/verify');
      await page.getByRole('link', { name: /back to sign in/i }).click();
      await expect(page).toHaveURL(/\/portal\/login/);
    });
  });

  test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        '/api/dev/login?email=test@bglocation.dev',
      );
    });

    test('should display customer email', async ({ page }) => {
      await expect(page.getByText('test@bglocation.dev')).toBeVisible();
    });

    test('should display plan information', async ({ page }) => {
      await expect(page.getByText(/team/i).first()).toBeVisible();
    });

    test('should display bundle ID slots', async ({ page }) => {
      await expect(page.getByText(/\d+ \/ (unlimited|\d+)/)).toBeVisible();
    });

    test('should show Generate New Key button', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: /Generate New Key/i }),
      ).toBeVisible();
    });

    test('should display licenses table', async ({ page }) => {
      await expect(page.getByText('com.test.app')).toBeVisible();
    });

    test('should have copy button for license keys', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: /copy/i }).first(),
      ).toBeVisible();
    });

    test('should show generate key form when button clicked', async ({
      page,
    }) => {
      await page.getByRole('button', { name: /Generate New Key/i }).click();
      await expect(page.getByLabel(/Bundle ID/i)).toBeVisible();
      await expect(
        page.getByRole('button', { name: /Generate Key/i }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: /Cancel/i }),
      ).toBeVisible();
    });

    test('should hide generate key form when Cancel clicked', async ({
      page,
    }) => {
      await page.getByRole('button', { name: /Generate New Key/i }).click();
      await expect(page.getByLabel(/Bundle ID/i)).toBeVisible();

      await page.getByRole('button', { name: /Cancel/i }).click();
      await expect(page.getByLabel(/Bundle ID/i)).not.toBeVisible();
    });
  });
});
