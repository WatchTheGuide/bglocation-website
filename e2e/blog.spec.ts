import { test, expect, ROUTES } from './fixtures/test';

test.describe('Blog', () => {
  test.describe('Listing Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(ROUTES.blog);
    });

    test('should display blog heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { level: 1, name: /Blog/i }),
      ).toBeVisible();
    });

    test('should display posts or empty state', async ({ page }) => {
      const article = page.locator('article').first();
      const emptyState = page.getByText(/No posts yet/i);
      await expect(article.or(emptyState)).toBeVisible();
    });

    test('should navigate to a post when clicking a card', async ({ page }) => {
      await page.locator('article').first().click();
      await expect(page).toHaveURL(/\/blog\/.+/);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  });

  test.describe('Post Page', () => {
    test('should render post content with prose styling', async ({ page }) => {
      await page.goto(ROUTES.blog);
      await page.locator('article').first().click();

      await expect(page.locator('.prose')).toBeVisible();
      await expect(page.locator('.prose h2').first()).toBeVisible();
    });

    test('should display post metadata', async ({ page }) => {
      await page.goto('/blog/building-production-ready-background-location-plugin');

      await expect(page.getByText(/min read/)).toBeVisible();
      await expect(page.getByText('Szymon Walczak')).toBeVisible();
    });

    test('should have back to blog link', async ({ page }) => {
      await page.goto('/blog/building-production-ready-background-location-plugin');

      const backLink = page.getByRole('link', { name: /Back to blog/i });
      await expect(backLink).toBeVisible();
      await backLink.click();
      await expect(page).toHaveURL(/\/blog$/);
    });
  });

  test.describe('404', () => {
    test('should return 404 for non-existent post', async ({ page }) => {
      const response = await page.goto('/blog/non-existent-post-slug');
      expect(response?.status()).toBe(404);
    });
  });

  test.describe('RSS Feed', () => {
    test('should return valid RSS XML', async ({ request }) => {
      const response = await request.get('/blog/feed.xml');
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/rss+xml');

      const body = await response.text();
      expect(body).toContain('<rss version="2.0"');
      expect(body).toContain('<title>bglocation Blog</title>');
      expect(body).toContain('<item>');
    });

    test('should contain required item elements (title, link, pubDate)', async ({ request }) => {
      const response = await request.get('/blog/feed.xml');
      const body = await response.text();

      // Each <item> should have title, link, pubDate
      expect(body).toMatch(/<item>[\s\S]*?<title>/);
      expect(body).toMatch(/<item>[\s\S]*?<link>/);
      expect(body).toMatch(/<item>[\s\S]*?<pubDate>/);
    });

    test('should have RSS feed link in post page head', async ({ page }) => {
      await page.goto('/blog/building-production-ready-background-location-plugin');

      const rssLink = page.locator('link[type="application/rss+xml"]');
      await expect(rssLink).toHaveAttribute('href', /feed\.xml/);
    });
  });

  test.describe('Tags', () => {
    test('should display tags on post listing page', async ({ page }) => {
      await page.goto(ROUTES.blog);

      // Post cards should contain tag badges
      const firstArticle = page.locator('article').first();
      await expect(firstArticle).toBeVisible();
      const badges = firstArticle.locator('[data-slot="badge"]');
      expect(await badges.count()).toBeGreaterThan(0);
    });

    test('should display tags on individual post page', async ({ page }) => {
      await page.goto('/blog/building-production-ready-background-location-plugin');

      // Post page should show tags
      const badges = page.locator('[data-slot="badge"]').filter({ hasText: /.+/ });
      expect(await badges.count()).toBeGreaterThan(0);
    });
  });

  test.describe('SEO', () => {
    test('should have OG meta tags on post page', async ({ page }) => {
      await page.goto('/blog/building-production-ready-background-location-plugin');

      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    });

    test('should have canonical URL on post page', async ({ page }) => {
      await page.goto('/blog/building-production-ready-background-location-plugin');

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /\/blog\/building-production-ready-background-location-plugin/);
    });

    test('should include blog URLs in sitemap', async ({ request }) => {
      const response = await request.get('/sitemap.xml');
      const body = await response.text();

      expect(body).toContain('/blog');
    });
  });

  test.describe('Navigation', () => {
    test('should have Blog link in header navigation', async ({ page }) => {
      await page.goto('/');

      const blogLink = page.getByRole('navigation').getByRole('link', { name: /Blog/i });
      await expect(blogLink).toBeVisible();
      await expect(blogLink).toHaveAttribute('href', /\/blog/);
    });

    test('should have Blog and RSS links in footer', async ({ page }) => {
      await page.goto('/');

      const footer = page.locator('footer');
      const blogFooterLink = footer.getByRole('link', { name: /Blog/i });
      await expect(blogFooterLink).toBeVisible();

      const rssFooterLink = footer.getByRole('link', { name: /RSS/i });
      await expect(rssFooterLink).toBeVisible();
    });
  });
});
