import { test, expect, ROUTES } from './fixtures/test';

function createUiMessageStream(text: string) {
  const chunks = [
    { type: 'start', messageId: 'assistant-1' },
    { type: 'text-start', id: 'text-1' },
    { type: 'text-delta', id: 'text-1', delta: text },
    { type: 'text-end', id: 'text-1' },
    { type: 'finish', finishReason: 'stop' },
  ];

  return `${chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join('')}data: [DONE]\n\n`;
}

test.describe('Chat Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
  });

  function getChatDialog(page: Parameters<typeof test.beforeEach>[0]['page']) {
    return page.getByRole('dialog', { name: /Chat with AI assistant/i });
  }

  test.describe('Toggle', () => {
    test('should display floating chat button', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: /Open chat/i }),
      ).toBeVisible();
    });

    test('should open chat panel when clicking the button', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      await expect(
        page.getByRole('dialog', { name: /Chat with AI assistant/i }),
      ).toBeVisible();
    });

    test('should hide floating button when panel is open', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      await expect(
        page.getByRole('button', { name: /Open chat/i }),
      ).not.toBeVisible();
    });

    test('should close panel when clicking close button', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      await page.getByRole('button', { name: /Close chat/i }).click();
      await expect(
        page.getByRole('dialog', { name: /Chat with AI assistant/i }),
      ).not.toBeVisible();
      await expect(
        page.getByRole('button', { name: /Open chat/i }),
      ).toBeVisible();
    });

    test('should close panel on Escape key', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      await page.keyboard.press('Escape');
      await expect(
        page.getByRole('dialog', { name: /Chat with AI assistant/i }),
      ).not.toBeVisible();
    });
  });

  test.describe('Content', () => {
    test('should display welcome message', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      await expect(
        page.getByText(/I can help with bglocation for Capacitor or React Native/i),
      ).toBeVisible();
    });

    test('should display AI disclosure in header', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      await expect(
        page.getByText(/Powered by AI/i),
      ).toBeVisible();
    });

    test('should display quick reply buttons before first message', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      await expect(
        page.getByRole('button', { name: /What features does the plugin include/i }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: /How does pricing work/i }),
      ).toBeVisible();
    });

    test('should display input field with placeholder', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      await expect(
        page.getByPlaceholder(/Ask a question/i),
      ).toBeVisible();
    });

    test('should have send button disabled when input is empty', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      await expect(
        page.getByRole('button', { name: /Send message/i }),
      ).toBeDisabled();
    });
  });

  test.describe('Messaging', () => {
    test('should send a message and display response', async ({ page }) => {
      await page.route('**/api/chat', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/event-stream; charset=utf-8',
          headers: {
            'x-vercel-ai-ui-message-stream': 'v1',
          },
          body: createUiMessageStream(
            'Hello! bglocation is a background location SDK for Capacitor and React Native.',
          ),
        });
      });

      await page.getByRole('button', { name: /Open chat/i }).click();
      const input = getChatDialog(page).getByRole('textbox');
      await input.fill('What is this plugin?');
      await page.getByRole('button', { name: /Send message/i }).click();

      // User message should appear
      await expect(page.getByText('What is this plugin?')).toBeVisible();

      // Assistant response should appear
      await expect(
        page.getByText(
          /Hello! bglocation is a background location SDK for Capacitor and React Native\./i,
        ),
      ).toBeVisible();
    });

    test('should send a quick reply as a user message', async ({ page }) => {
      await page.route('**/api/chat', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/event-stream; charset=utf-8',
          headers: {
            'x-vercel-ai-ui-message-stream': 'v1',
          },
          body: createUiMessageStream('The plugin includes many features.'),
        });
      });

      await page.getByRole('button', { name: /Open chat/i }).click();
      await page.getByRole('button', { name: /What features does the plugin include/i }).click();

      // Quick reply text should appear as user message
      await expect(
        page.getByText('What features does the plugin include?'),
      ).toBeVisible();

      // Quick replies should be hidden after first message
      await expect(
        page.getByRole('button', { name: /How does pricing work/i }),
      ).not.toBeVisible();
    });

    test('should show limit reached after max messages', async ({ page }) => {
      let requestCount = 0;
      await page.route('**/api/chat', async (route) => {
        requestCount++;
        await route.fulfill({
          status: 200,
          contentType: 'text/event-stream; charset=utf-8',
          headers: {
            'x-vercel-ai-ui-message-stream': 'v1',
          },
          body: createUiMessageStream(`Response ${requestCount}`),
        });
      });

      await page.getByRole('button', { name: /Open chat/i }).click();
      const input = getChatDialog(page).getByRole('textbox');

      // Send MAX_MESSAGES (10) user messages
      for (let i = 1; i <= 10; i++) {
        await input.fill(`Message ${i}`);
        await page.getByRole('button', { name: /Send message/i }).click();
        // Wait for message to appear before sending next
        await expect(page.getByText(`Message ${i}`)).toBeVisible();
      }

      // Limit reached UI should show
      await expect(
        page.getByText(/reached the message limit/i),
      ).toBeVisible();

      // Input should be disabled with limit placeholder
      await expect(input).toBeDisabled();
      await expect(
        page.getByPlaceholder(/Message limit reached/i),
      ).toBeVisible();

      // Send button should be disabled
      await expect(
        page.getByRole('button', { name: /Send message/i }),
      ).toBeDisabled();
    });
  });

  test.describe('Error States', () => {
    test('should display error message on API failure', async ({ page }) => {
      await page.route('**/api/chat', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'text/plain; charset=utf-8',
          body: 'Internal Server Error',
        });
      });

      await page.getByRole('button', { name: /Open chat/i }).click();
      const input = getChatDialog(page).getByRole('textbox');
      await input.fill('Hello');
      await page.getByRole('button', { name: /Send message/i }).click();

      await expect(
        page.getByText(/Something went wrong/i),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: /Retry/i }),
      ).toBeVisible();
    });

    test('should display rate limit message on 429', async ({ page }) => {
      await page.route('**/api/chat', async (route) => {
        await route.fulfill({
          status: 429,
          contentType: 'text/plain; charset=utf-8',
          body: 'Too many requests',
        });
      });

      await page.getByRole('button', { name: /Open chat/i }).click();
      const input = getChatDialog(page).getByRole('textbox');
      await input.fill('Hello');
      await page.getByRole('button', { name: /Send message/i }).click();

      await expect(
        page.getByText(/Too many requests/i),
      ).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper dialog role and label', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      const dialog = page.getByRole('dialog', { name: /Chat with AI assistant/i });
      await expect(dialog).toBeVisible();
    });

    test('should focus input when panel opens', async ({ page }) => {
      await page.getByRole('button', { name: /Open chat/i }).click();
      const input = page.getByPlaceholder(/Ask a question/i);
      await expect(input).toBeFocused();
    });
  });

  test.describe('Responsive', () => {
    test('should display fullscreen on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.getByRole('button', { name: /Open chat/i }).click();
      const dialog = page.getByRole('dialog', { name: /Chat with AI assistant/i });
      await expect(dialog).toBeVisible();
      // On mobile, dialog should be fullscreen (inset-0)
      const box = await dialog.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(370);
      expect(box?.height).toBeGreaterThanOrEqual(660);
    });
  });
});
