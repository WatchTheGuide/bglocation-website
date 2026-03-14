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
      await expect(page.getByText(/No license key needed/i)).toBeVisible();
    });
  });

  test.describe('Early Adopter Banner', () => {
    test('should display early adopter badge', async ({ page }) => {
      await expect(page.getByText('Early Adopter Offer')).toBeVisible();
    });

    test('should display discounted prices', async ({ page }) => {
      await expect(page.getByText(/\$149\/year/i)).toBeVisible();
      await expect(page.getByText(/\$229\/year/i)).toBeVisible();
    });
  });

  test.describe('Pricing Cards', () => {
    test('should display all three plan names', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Indie' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Enterprise' })).toBeVisible();
    });

    test('should display Indie plan details', async ({ page }) => {
      await expect(page.getByText('$199')).toBeVisible();
      await expect(page.getByText('1 bundle ID')).toBeVisible();
      await expect(page.getByText('For solo developers and small side projects.')).toBeVisible();
    });

    test('should display Team plan details', async ({ page }) => {
      await expect(page.getByText('$299')).toBeVisible();
      await expect(page.getByText('5 bundle IDs')).toBeVisible();
      await expect(page.getByText('For teams shipping multiple apps.')).toBeVisible();
    });

    test('should display Enterprise plan details', async ({ page }) => {
      await expect(page.getByText('Custom').first()).toBeVisible();
      await expect(page.getByText('Unlimited bundle IDs')).toBeVisible();
      await expect(page.getByText('For organizations with custom requirements.')).toBeVisible();
    });

    test('should display "Most Popular" badge on Team plan', async ({ page }) => {
      await expect(page.getByText('Most Popular')).toBeVisible();
    });

    test('should display Buy License buttons for Indie and Team', async ({ page }) => {
      const buyButtons = page.getByRole('link', { name: /Buy License/i });
      await expect(buyButtons).toHaveCount(2);
    });

    test('should display Contact Us button for Enterprise', async ({ page }) => {
      const contactBtn = page.getByRole('link', { name: /Contact Us/i });
      await expect(contactBtn).toBeVisible();
      await expect(contactBtn).toHaveAttribute('href', 'mailto:hello@bglocation.dev');
    });

    test('should display early adopter prices on paid plans', async ({ page }) => {
      await expect(page.getByText('$149/yr early adopter price')).toBeVisible();
      await expect(page.getByText('$229/yr early adopter price')).toBeVisible();
    });

    test('should display feature lists with checkmarks', async ({ page }) => {
      const commonFeatures = [
        'All plugin features',
        'iOS + Android',
        'npm registry access',
        'Source code access (ELv2)',
        'Email support',
        'Trial mode included',
      ];

      for (const feature of commonFeatures) {
        await expect(page.getByText(feature)).toBeVisible();
      }
    });

    test('should display license note', async ({ page }) => {
      await expect(
        page.getByText(/No license key needed to evaluate/i),
      ).toBeVisible();
    });
  });

  test.describe('FAQ Section', () => {
    test('should display FAQ heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Frequently Asked Questions/i }),
      ).toBeVisible();
    });

    test('should display all 8 FAQ questions', async ({ page }) => {
      const questions = [
        'How does trial mode work?',
        'What is a bundle ID and how are licenses bound?',
        'Can I use one license for both iOS and Android?',
        'What happens if I need more bundle IDs later?',
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
    await expect(page).toHaveTitle(/Pricing.*capacitor-bglocation/i);
  });

  test('should have meta description', async ({ page }) => {
    await page.goto(ROUTES.pricing);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      /Simple pricing for capacitor-bglocation/i,
    );
  });
});
