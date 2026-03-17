import { test, expect } from './fixtures/test';

test.describe('Admin Panel', () => {
  test.describe('Authentication', () => {
    test('should redirect /admin to /admin/login when not authenticated', async ({
      page,
    }) => {
      await page.goto('/admin');
      await expect(page).toHaveURL(/\/admin\/login/);
    });

    test('should show admin login form', async ({ page }) => {
      await page.goto('/admin/login');
      await expect(
        page.getByRole('heading', { name: /Admin Panel/i }),
      ).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(
        page.getByRole('button', { name: /send sign-in link/i }),
      ).toBeVisible();
    });

    test('should show success message after submitting email', async ({
      page,
    }) => {
      await page.goto('/admin/login');
      await page.getByLabel(/email/i).fill('admin@bglocation.dev');
      await page.getByRole('button', { name: /send sign-in link/i }).click();
      await expect(page.getByText(/check your email/i)).toBeVisible();
    });

    test('should show success even for non-existent admin email', async ({
      page,
    }) => {
      await page.goto('/admin/login');
      await page.getByLabel(/email/i).fill('nobody@example.com');
      await page.getByRole('button', { name: /send sign-in link/i }).click();
      await expect(page.getByText(/check your email/i)).toBeVisible();
    });

    test('should login via dev endpoint and see dashboard', async ({
      page,
    }) => {
      await page.goto(
        '/api/dev/admin-login?email=admin@bglocation.dev',
      );
      await expect(page).toHaveURL('/admin');
      await expect(
        page.getByRole('heading', { name: /Dashboard/i }),
      ).toBeVisible();
    });

    test('should sign out from admin panel', async ({ page }) => {
      await page.goto(
        '/api/dev/admin-login?email=admin@bglocation.dev',
      );
      await expect(page).toHaveURL('/admin');

      await page.getByRole('button', { name: /sign out/i }).click();
      await expect(page).toHaveURL(/\/admin\/login/);
    });
  });

  test.describe('Verify Page', () => {
    test('should show error when token is missing', async ({ page }) => {
      await page.goto('/admin/verify');
      await expect(page.getByText(/Verification failed/i)).toBeVisible();
      await expect(page.getByText(/Missing verification token/i)).toBeVisible();
      await expect(
        page.getByRole('link', { name: /back to sign in/i }),
      ).toBeVisible();
    });

    test('should show error when token is invalid', async ({ page }) => {
      await page.goto('/admin/verify?token=invalid-token-xyz');
      await expect(page.getByText(/Verification failed/i)).toBeVisible();
      await expect(
        page.getByText(/Invalid or expired link/i),
      ).toBeVisible();
    });

    test('should link back to admin login', async ({ page }) => {
      await page.goto('/admin/verify');
      await page.getByRole('link', { name: /back to sign in/i }).click();
      await expect(page).toHaveURL(/\/admin\/login/);
    });
  });

  test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        '/api/dev/admin-login?email=admin@bglocation.dev',
      );
    });

    test('should display KPI cards', async ({ page }) => {
      await expect(page.getByText('Total Customers')).toBeVisible();
      await expect(page.getByText('Active Licenses')).toBeVisible();
      await expect(page.getByText('Total Orders')).toBeVisible();
      await expect(page.getByText('New Customers (30d)')).toBeVisible();
    });

    test('should display breakdown cards', async ({ page }) => {
      await expect(page.getByText('Customers by Plan')).toBeVisible();
      await expect(page.getByText('Orders & Licenses')).toBeVisible();
    });

    test('should have sidebar navigation', async ({ page }) => {
      await expect(page.getByRole('link', { name: /Dashboard/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Customers/i })).toBeVisible();
    });

    test('should display numeric KPI values', async ({ page }) => {
      // Each stat card should have a numeric value
      const cards = page.locator('[class*="grid"] > div').first();
      await expect(cards).toContainText(/\d+/);
    });

    test('should show breakdown items', async ({ page }) => {
      // Customers by Plan card should show plan names
      await expect(page.getByText('Purchases')).toBeVisible();
      await expect(page.getByText('Renewals')).toBeVisible();
    });
  });

  test.describe('Customers List', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        '/api/dev/admin-login?email=admin@bglocation.dev',
      );
      await page.getByRole('link', { name: /Customers/i }).click();
      await expect(page).toHaveURL(/\/admin\/customers/);
    });

    test('should display customers heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Customers/i }),
      ).toBeVisible();
    });

    test('should show total count', async ({ page }) => {
      await expect(page.getByText(/\d+ total/)).toBeVisible();
    });

    test('should have search input', async ({ page }) => {
      await expect(
        page.getByPlaceholder(/search by email/i),
      ).toBeVisible();
    });

    test('should have plan filter buttons', async ({ page }) => {
      for (const plan of ['indie', 'team', 'factory', 'enterprise']) {
        await expect(
          page.getByRole('button', { name: new RegExp(plan, 'i') }),
        ).toBeVisible();
      }
    });

    test('should display test customer in list', async ({ page }) => {
      await expect(page.getByText('test@bglocation.dev')).toBeVisible();
    });

    test('should navigate to customer details', async ({ page }) => {
      await page.getByRole('link', { name: 'test@bglocation.dev' }).click();
      await expect(page).toHaveURL(/\/admin\/customers\/.+/);
      await expect(
        page.getByRole('heading', { name: 'test@bglocation.dev' }),
      ).toBeVisible();
    });

    test('should filter by plan when plan button is clicked', async ({
      page,
    }) => {
      await page.getByRole('button', { name: /team/i }).click();
      await expect(page).toHaveURL(/plan=team/);
      await expect(page.getByText('test@bglocation.dev')).toBeVisible();
    });

    test('should toggle plan filter off when clicked again', async ({
      page,
    }) => {
      await page.getByRole('button', { name: /team/i }).click();
      await expect(page).toHaveURL(/plan=team/);
      await page.getByRole('button', { name: /team/i }).click();
      await expect(page).not.toHaveURL(/plan=team/);
    });

    test('should search by email', async ({ page }) => {
      await page.getByPlaceholder(/search by email/i).fill('test@');
      await page.getByRole('button', { name: /search/i }).click();
      await expect(page).toHaveURL(/search=test%40/);
      await expect(page.getByText('test@bglocation.dev')).toBeVisible();
    });

    test('should show table headers with sortable columns', async ({
      page,
    }) => {
      await expect(page.getByRole('columnheader', { name: /Email/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /Plan/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /Registered/i })).toBeVisible();
    });

    test('should sort by column when header clicked', async ({ page }) => {
      await page.getByRole('columnheader', { name: /Email/i }).locator('button').click();
      await expect(page).toHaveURL(/sort=email/);
    });

    test('should display license count in table', async ({ page }) => {
      // The seeded customer should show license count
      const row = page.locator('tr', { hasText: 'test@bglocation.dev' });
      await expect(row).toContainText(/\d+ \/ (\d+|∞)/);
    });
  });

  test.describe('Customer Detail', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        '/api/dev/admin-login?email=admin@bglocation.dev',
      );
      await page.getByRole('link', { name: /Customers/i }).click();
      await page.getByRole('link', { name: 'test@bglocation.dev' }).click();
      await expect(page).toHaveURL(/\/admin\/customers\/.+/);
    });

    test('should display customer info', async ({ page }) => {
      await expect(page.getByText('Customer Information')).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'test@bglocation.dev' }),
      ).toBeVisible();
      await expect(page.getByText('team').first()).toBeVisible();
    });

    test('should display plan and slots', async ({ page }) => {
      await expect(page.getByText('Bundle ID Slots')).toBeVisible();
      await expect(
        page.locator('dt:has-text("Bundle ID Slots") + dd'),
      ).toHaveText('5');
    });

    test('should display licenses section with data', async ({ page }) => {
      await expect(page.getByText('Licenses').first()).toBeVisible();
      await expect(page.getByText('com.test.app')).toBeVisible();
    });

    test('should show license status badge', async ({ page }) => {
      await expect(page.getByText('Active').first()).toBeVisible();
    });

    test('should display order history section with data', async ({
      page,
    }) => {
      await expect(page.getByText('Order History')).toBeVisible();
      await expect(page.getByText('ls_order_test_001')).toBeVisible();
    });

    test('should show order type badge', async ({ page }) => {
      await expect(page.getByText('purchase').first()).toBeVisible();
    });

    test('should have copy button for license key', async ({ page }) => {
      const licenseRow = page.locator('tr', { hasText: 'com.test.app' });
      await expect(licenseRow.getByRole('button').first()).toBeVisible();
    });

    test('should have toggle button for license activation', async ({
      page,
    }) => {
      const licenseRow = page.locator('tr', { hasText: 'com.test.app' });
      await expect(
        licenseRow.getByRole('button', { name: /Deactivate/i }),
      ).toBeVisible();
    });

    test('should deactivate and reactivate license', async ({ page }) => {
      const licenseRow = page.locator('tr', { hasText: 'com.test.app' });

      // Deactivate
      await licenseRow.getByRole('button', { name: /Deactivate/i }).click();
      await expect(
        licenseRow.getByRole('button', { name: /Activate/i }),
      ).toBeVisible({ timeout: 10000 });
      await expect(licenseRow.getByText('Inactive')).toBeVisible();

      // Reactivate
      await licenseRow.getByRole('button', { name: /Activate/i }).click();
      await expect(
        licenseRow.getByRole('button', { name: /Deactivate/i }),
      ).toBeVisible({ timeout: 10000 });
      await expect(licenseRow.getByText('Active')).toBeVisible();
    });

    test('should navigate back to customers list', async ({ page }) => {
      await page.getByRole('button', { name: /Back/i }).click();
      await expect(page).toHaveURL(/\/admin\/customers/);
    });
  });

  test.describe('Customer Detail — Error States', () => {
    test('should show 404 for invalid customer UUID', async ({ page }) => {
      await page.goto(
        '/api/dev/admin-login?email=admin@bglocation.dev',
      );
      await page.goto('/admin/customers/not-a-valid-uuid');
      await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    });

    test('should show 404 for non-existent customer', async ({ page }) => {
      await page.goto(
        '/api/dev/admin-login?email=admin@bglocation.dev',
      );
      await page.goto('/admin/customers/00000000-0000-0000-0000-000000000000');
      await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    });
  });
});
