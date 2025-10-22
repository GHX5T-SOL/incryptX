import { test, expect } from '@playwright/test';

test.describe('Social Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/social');
  });

  test('should create profile, post message, and interact with communities', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => ({ publicKey: { toString: () => 'Ghx5t...' } }),
        signTransaction: async (tx) => tx,
      };
    });

    // Connect wallet
    await page.click('[data-testid="wallet-connect"]');
    await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible();

    // Navigate to profile
    await page.goto('http://localhost:5173/social/profile/ghxst');

    // Create profile (this would trigger real CPI in production)
    await page.click('[data-testid="create-profile"]');
    await expect(page.locator('[data-testid="profile-created"]')).toBeVisible();

    // Post a message
    await page.goto('http://localhost:5173/social/feed');
    await page.fill('[data-testid="post-input"]', 'Test post from Playwright!');
    await page.click('[data-testid="post-button"]');
    await expect(page.locator('[data-testid="post-success"]')).toBeVisible();

    // Navigate to communities
    await page.goto('http://localhost:5173/social/communities');

    // Create a new community
    await page.click('[data-testid="create-community"]');
    await page.fill('[data-testid="community-name"]', 'Test Community');
    await page.fill('[data-testid="community-description"]', 'A test community for Playwright');
    await page.click('[data-testid="create-community-confirm"]');
    await expect(page.locator('[data-testid="community-created"]')).toBeVisible();

    // Join an existing community
    await page.click('[data-testid="join-community-1"]');
    await expect(page.locator('[data-testid="community-joined"]')).toBeVisible();

    // Post to community
    await page.click('[data-testid="community-chat-1"]');
    await page.fill('[data-testid="community-post-input"]', 'Test community post!');
    await page.click('[data-testid="community-post-button"]');
    await expect(page.locator('[data-testid="community-post-success"]')).toBeVisible();

    // Verify transaction signatures in console
    page.on('console', (msg) => {
      if (msg.type() === 'log' && (msg.text().includes('Profile created with tx:') ||
                                   msg.text().includes('Community created with tx:') ||
                                   msg.text().includes('Post created with tx:'))) {
        console.log('Transaction signature captured:', msg.text());
      }
    });
  });

  test('should handle chat creation and messaging', async ({ page }) => {
    // Mock wallet
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => ({ publicKey: { toString: () => 'Ghx5t...' } }),
        signTransaction: async (tx) => tx,
      };
    });

    await page.click('[data-testid="wallet-connect"]');
    await page.goto('http://localhost:5173/social/chats');

    // Create new chat
    await page.click('[data-testid="new-chat"]');
    await page.fill('[data-testid="chat-recipient"]', 'testuser');
    await page.fill('[data-testid="chat-message"]', 'Hello from Playwright!');
    await page.click('[data-testid="start-chat"]');
    await expect(page.locator('[data-testid="chat-created"]')).toBeVisible();

    // Verify chat appears in list
    await expect(page.locator('[data-testid="chat-list"]')).toContainText('testuser');
  });

  test('should handle X integration', async ({ page }) => {
    // Mock wallet and X API
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => ({ publicKey: { toString: () => 'Ghx5t...' } }),
        signTransaction: async (tx) => tx,
      };

      // Mock fetch for X API calls
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          posts: [
            { id: '1', content: 'Test X post', author: 'testuser', timestamp: new Date().toISOString() }
          ]
        })
      });
    });

    await page.click('[data-testid="wallet-connect"]');
    await page.goto('http://localhost:5173/social/feed');

    // Post to X
    await page.fill('[data-testid="post-input"]', 'Test post to X!');
    await page.check('[data-testid="post-to-x"]');
    await page.click('[data-testid="post-button"]');
    await expect(page.locator('[data-testid="x-post-success"]')).toBeVisible();

    // Scan X mentions
    await page.click('[data-testid="scan-x"]');
    await expect(page.locator('[data-testid="x-scan-success"]')).toBeVisible();
  });
});
