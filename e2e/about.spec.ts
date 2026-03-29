import { test, expect, ROUTES } from './fixtures/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.about);
  });

  test.describe('Header', () => {
    test('should display page heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'About' }),
      ).toBeVisible();
    });

    test('should display subtitle', async ({ page }) => {
      await expect(
        page.getByText('The person behind @bglocation/capacitor.'),
      ).toBeVisible();
    });
  });

  test.describe('Intro Section', () => {
    test('should display author name', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Szymon Walczak' }),
      ).toBeVisible();
    });

    test('should display role description', async ({ page }) => {
      await expect(
        page.getByText(/Senior Software Architect/i),
      ).toBeVisible();
    });

    test('should mention PMP certification', async ({ page }) => {
      await expect(
        page.getByText(/PMP certification/i),
      ).toBeVisible();
    });

    test('should mention PhD in Mathematics', async ({ page }) => {
      await expect(
        page.getByText(/PhD in Mathematics/i).first(),
      ).toBeVisible();
    });
  });

  test.describe('Background Section', () => {
    test('should display Background heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Background', exact: true }),
      ).toBeVisible();
    });

    test('should display GuideTrackee highlight', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'GuideTrackee' }),
      ).toBeVisible();
      await expect(
        page.getByText(/cross-platform mobile application for the tourism industry/i),
      ).toBeVisible();
    });

    test('should display Frontend Framework Author highlight', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Frontend Framework Author' }),
      ).toBeVisible();
    });

    test('should display Academic Background highlight', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Academic Background' }),
      ).toBeVisible();
    });
  });

  test.describe('Technical Expertise', () => {
    test('should display expertise heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Technical Expertise' }),
      ).toBeVisible();
    });

    test('should display key technology badges', async ({ page }) => {
      const skills = [
        'React / Next.js',
        'Capacitor / Ionic',
        'TypeScript',
        'Node.js',
      ];

      for (const skill of skills) {
        await expect(page.getByText(skill, { exact: true })).toBeVisible();
      }
    });
  });

  test.describe('Certifications', () => {
    test('should display certifications heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Certifications' }),
      ).toBeVisible();
    });

    test('should list PMP certification', async ({ page }) => {
      await expect(
        page.getByText(/Project Management Professional \(PMP\)/i),
      ).toBeVisible();
    });

    test('should list Apollo GraphQL certification', async ({ page }) => {
      await expect(
        page.getByText(/Graph Developer.*Professional/i),
      ).toBeVisible();
    });
  });

  test.describe('Contact', () => {
    test('should display contact heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Contact' }),
      ).toBeVisible();
    });

    test('should display location', async ({ page }) => {
      await expect(
        page.getByText('Kraków, Poland'),
      ).toBeVisible();
    });

    test('should display LinkedIn link', async ({ page }) => {
      const link = page.getByRole('link', { name: /linkedin.com\/in\/szymonwalczak/i });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/szymonwalczak/');
      await expect(link).toHaveAttribute('target', '_blank');
    });
  });
});

test.describe('About Page — SEO', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(ROUTES.about);
    await expect(page).toHaveTitle(/About.*@bglocation/capacitor/i);
  });

  test('should have meta description', async ({ page }) => {
    await page.goto(ROUTES.about);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      /Szymon Walczak/i,
    );
  });
});
