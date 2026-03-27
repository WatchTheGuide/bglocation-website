import { test, expect, ROUTES } from './fixtures/test';

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.pricing);
  });

  test.describe('Header', () => {
    test('should display page heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Simple, Transparent Pricing/i }),
      ).toBeVisible();
    });

    test('should display no license key needed message', async ({ page }) => {
      await expect(page.getByText(/No license key needed/i).first()).toBeVisible();
    });
  });

  test.describe('Early Adopter Banner', () => {
    test('should display early adopter badge', async ({ page }) => {
      await expect(page.getByText('Early Adopter Offer')).toBeVisible();
    });

    test('should display discounted prices', async ({ page }) => {
      const banner = page.locator('.rounded-lg').filter({ hasText: 'Early Adopter Offer' });
      await expect(banner.getByText('$149')).toBeVisible();
      await expect(banner.getByText('$229')).toBeVisible();
      await expect(banner.getByText('$399')).toBeVisible();
    });
  });

  test.describe('Pricing Cards', () => {
    test('should display all four plan names', async ({ page }) => {
      await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Indie' })).toBeVisible();
      await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Team' })).toBeVisible();
      await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Factory' })).toBeVisible();
      await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Enterprise' })).toBeVisible();
    });

    test('should display Indie plan details', async ({ page }) => {
      await expect(page.getByText('$199').first()).toBeVisible();
      await expect(page.getByText('1 bundle ID')).toBeVisible();
      await expect(page.getByText('For solo developers and side projects.')).toBeVisible();
    });

    test('should display Team plan details', async ({ page }) => {
      await expect(page.getByText('$299').first()).toBeVisible();
      await expect(page.getByText('5 bundle IDs')).toBeVisible();
      await expect(page.getByText('For small teams shipping multiple apps.')).toBeVisible();
    });

    test('should display Factory plan details', async ({ page }) => {
      await expect(page.getByText('$499').first()).toBeVisible();
      await expect(page.getByText('20 bundle IDs')).toBeVisible();
      await expect(page.getByText('For companies with many applications.')).toBeVisible();
    });

    test('should display Enterprise plan details', async ({ page }) => {
      await expect(page.getByText('Custom').first()).toBeVisible();
      await expect(page.getByText('Unlimited bundle IDs').first()).toBeVisible();
      await expect(page.getByText('For organizations with custom requirements.')).toBeVisible();
    });

    test('should display "Most Popular" badge on Team plan', async ({ page }) => {
      await expect(page.getByText('Most Popular')).toBeVisible();
    });

    test('should display Buy License buttons for Indie, Team and Factory', async ({ page }) => {
      const buyButtons = page.getByRole('button', { name: /Buy License/i });
      await expect(buyButtons).toHaveCount(3);
    });

    test('should render actionable Buy License triggers for paid plans', async ({ page }) => {
      const buyButtons = page.getByRole('button', { name: /Buy License/i });

      await expect(buyButtons.first()).toBeVisible();
      await expect(buyButtons.nth(1)).toBeVisible();
      await expect(buyButtons.last()).toBeVisible();
    });

    test('should display Contact Us button for Enterprise', async ({ page }) => {
      const contactBtn = page.getByRole('button', { name: /Contact Us/i });
      await expect(contactBtn).toBeVisible();
      await expect(contactBtn).toHaveAttribute('href', 'mailto:hello@bglocation.dev');
    });

    test('should display early adopter prices on paid plans', async ({ page }) => {
      await expect(page.getByText('$149 early adopter price')).toBeVisible();
      await expect(page.getByText('$229 early adopter price')).toBeVisible();
      await expect(page.getByText('$399 early adopter price')).toBeVisible();
    });

    test('should display feature lists with checkmarks', async ({ page }) => {
      const commonFeatures = [
        'All plugin features',
        'iOS + Android',
        'Capacitor + React Native wrappers',
        'Perpetual license',
        '1 year of updates included',
        'Source code access (ELv2)',
      ];

      for (const feature of commonFeatures) {
        await expect(page.getByText(feature, { exact: true }).first()).toBeVisible();
      }
    });

    test('should display license note', async ({ page }) => {
      await expect(
        page.getByText(/No license key needed.*30 min sessions/i),
      ).toBeVisible();
    });
  });

  test.describe('FAQ Section', () => {
    test('should display FAQ heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Frequently Asked Questions/i }),
      ).toBeVisible();
    });

    test('should display all FAQ questions including cross-framework licensing', async ({ page }) => {
      const questions = [
        'How does trial mode work?',
        'What is a bundle ID and how are licenses bound?',
        'Can I use one license for both iOS and Android?',
        'Does one license cover Capacitor and React Native?',
        'What happens if I need more bundle IDs later?',
        'What happens after the first year?',
        'What does "Source Available" mean?',
        'Do I need an internet connection for the license to work?',
        'What payment methods do you accept?',
        'Is there a refund policy?',
      ];

      for (const question of questions) {
        await expect(page.getByText(question)).toBeVisible();
      }
    });

    test('should expand FAQ item on click', async ({ page }) => {
      const trigger = page.getByText('How does trial mode work?');
      await trigger.click();

      await expect(
        page.getByText(/Install the plugin and start building immediately/i),
      ).toBeVisible();
    });
  });
});

test.describe('Pricing Page — SEO', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(ROUTES.pricing);
    await expect(page).toHaveTitle(/Pricing.*bglocation/i);
  });

  test('should have meta description', async ({ page }) => {
    await page.goto(ROUTES.pricing);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      /Capacitor and React Native/i,
    );
  });
});
