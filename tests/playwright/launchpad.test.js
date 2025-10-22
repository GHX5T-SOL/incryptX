const { test, expect } = require('@playwright/test');

test.describe('IncryptX Launchpad Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the launchpad page
    await page.goto('http://localhost:3000/pad');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display launchpad page with real integration', async ({ page }) => {
    // Check if the main launchpad elements are present
    await expect(page.locator('h1')).toContainText('Launchpad');
    
    // Check for the launch button
    await expect(page.locator('button:has-text("Launch Degen Token")')).toBeVisible();
    
    // Check for stats cards
    await expect(page.locator('.glass-card')).toHaveCount.greaterThan(0);
    
    // Check for search functionality
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('should show wallet connection prompt when not connected', async ({ page }) => {
    // Check for wallet connection prompt
    await expect(page.locator('text=Connect your wallet to launch tokens')).toBeVisible();
    
    // Launch button should be disabled when wallet not connected
    const launchButton = page.locator('button:has-text("Launch Degen Token")');
    await expect(launchButton).toBeDisabled();
  });

  test('should handle token launch flow with mock wallet', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => ({
          publicKey: { toString: () => '11111111111111111111111111111111' }
        }),
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs
      };
    });

    // Click connect wallet button if present
    const connectButton = page.locator('button:has-text("Connect Wallet")');
    if (await connectButton.isVisible()) {
      await connectButton.click();
    }

    // Wait for wallet connection
    await page.waitForTimeout(1000);

    // Click launch button
    const launchButton = page.locator('button:has-text("Launch Degen Token")');
    await expect(launchButton).toBeEnabled();
    
    // Click and wait for loading state
    await launchButton.click();
    
    // Check for loading state
    await expect(page.locator('button:has-text("Launching...")')).toBeVisible();
    
    // Wait for completion (mock will complete quickly)
    await page.waitForTimeout(2000);
    
    // Check for success message or transaction signature
    const successMessage = page.locator('text=Token launched successfully');
    await expect(successMessage).toBeVisible();
  });

  test('should display error messages when launch fails', async ({ page }) => {
    // Mock wallet with error
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => {
          throw new Error('Connection failed');
        }
      };
    });

    // Try to connect wallet
    const connectButton = page.locator('button:has-text("Connect Wallet")');
    if (await connectButton.isVisible()) {
      await connectButton.click();
    }

    // Check for error display
    await expect(page.locator('.bg-red-500\\/20')).toBeVisible();
  });

  test('should show token list with real data', async ({ page }) => {
    // Wait for tokens to load
    await page.waitForTimeout(2000);
    
    // Check for token cards
    const tokenCards = page.locator('.glass-card');
    await expect(tokenCards).toHaveCount.greaterThan(0);
    
    // Check for token information
    await expect(page.locator('text=TestToken')).toBeVisible();
  });

  test('should handle token migration flow', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        connect: async () => ({
          publicKey: { toString: () => '11111111111111111111111111111111' }
        }),
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs
      };
    });

    // Connect wallet
    const connectButton = page.locator('button:has-text("Connect Wallet")');
    if (await connectButton.isVisible()) {
      await connectButton.click();
    }

    await page.waitForTimeout(1000);

    // Find migration button (if token has address)
    const migrateButton = page.locator('button[title="Migrate from Bonding Curve"]').first();
    
    if (await migrateButton.isVisible()) {
      await migrateButton.click();
      
      // Check for loading state
      await expect(page.locator('button:has-text("Launching...")')).toBeVisible();
      
      // Wait for completion
      await page.waitForTimeout(2000);
      
      // Check for success message
      const successMessage = page.locator('text=Token migrated successfully');
      await expect(successMessage).toBeVisible();
    }
  });

  test('should filter and search tokens', async ({ page }) => {
    // Test search functionality
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('TestToken');
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Test category filter
    const categoryButton = page.locator('button:has-text("All")');
    await categoryButton.click();
    
    // Check if filtered results are shown
    await expect(page.locator('.glass-card')).toHaveCount.greaterThan(0);
  });
});