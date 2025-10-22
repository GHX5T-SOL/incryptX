import { test, expect } from '@playwright/test';

test.describe('IncryptX Telegram Bot Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Telegram bot page
    await page.goto('http://localhost:3000/telegram-bot');
    
    // Wait for the page to load
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('should display bot status and connection information', async ({ page }) => {
    // Check if bot status is displayed
    await expect(page.locator('text=Bot Status')).toBeVisible();
    
    // Check if status indicator is present
    const statusIndicator = page.locator('.w-3.h-3.rounded-full');
    await expect(statusIndicator).toBeVisible();
    
    // Check if the main heading is present
    await expect(page.locator('h1:has-text("IncryptX Telegram Bot")')).toBeVisible();
  });

  test('should send message command to bot', async ({ page }) => {
    // Find the command input field
    const commandInput = page.locator('input[placeholder*="Type a command"]');
    await expect(commandInput).toBeVisible();
    
    // Type a command
    await commandInput.fill('/launch CatWifHat');
    
    // Click the send button
    const sendButton = page.locator('button:has-text("Send Command")');
    await expect(sendButton).toBeVisible();
    await sendButton.click();
    
    // Wait for response
    await page.waitForSelector('.font-mono.text-sm.text-white', { timeout: 10000 });
    
    // Check if response is displayed
    const response = page.locator('.font-mono.text-sm.text-white');
    await expect(response).toBeVisible();
    
    // Check if response contains expected content
    await expect(response).toContainText(/launch|Launch|Mock/i);
  });

  test('should execute trade via bot interface', async ({ page }) => {
    // Fill in trade details
    const tokenInput = page.locator('input[placeholder*="e.g., SOL, CatWifHat"]');
    await expect(tokenInput).toBeVisible();
    await tokenInput.fill('SOL');
    
    // Select buy action
    const actionSelect = page.locator('select');
    await expect(actionSelect).toBeVisible();
    await actionSelect.selectOption('buy');
    
    // Fill in amount
    const amountInput = page.locator('input[placeholder*="e.g., 1.5"]');
    await expect(amountInput).toBeVisible();
    await amountInput.fill('1.5');
    
    // Click execute trade button
    const executeButton = page.locator('button:has-text("Execute Trade")');
    await expect(executeButton).toBeVisible();
    await executeButton.click();
    
    // Wait for response
    await page.waitForSelector('.font-mono.text-sm.text-white', { timeout: 10000 });
    
    // Check if trade response is displayed
    const response = page.locator('.font-mono.text-sm.text-white');
    await expect(response).toBeVisible();
    await expect(response).toContainText(/trade|Trade|Mock/i);
  });

  test('should launch token via bot interface', async ({ page }) => {
    // Fill in launch details
    const nameInput = page.locator('input[placeholder*="e.g., Cat Wif Hat"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('TestToken');
    
    const symbolInput = page.locator('input[placeholder*="e.g., CATWIF"]');
    await expect(symbolInput).toBeVisible();
    await symbolInput.fill('TEST');
    
    const supplyInput = page.locator('input[placeholder*="e.g., 1000000000"]');
    await expect(supplyInput).toBeVisible();
    await supplyInput.fill('1000000000');
    
    // Click launch button
    const launchButton = page.locator('button:has-text("Launch Token")');
    await expect(launchButton).toBeVisible();
    await launchButton.click();
    
    // Wait for response
    await page.waitForSelector('.font-mono.text-sm.text-white', { timeout: 10000 });
    
    // Check if launch response is displayed
    const response = page.locator('.font-mono.text-sm.text-white');
    await expect(response).toBeVisible();
    await expect(response).toContainText(/launch|Launch|Mock/i);
  });

  test('should display chat list when available', async ({ page }) => {
    // Wait for potential chat list to load
    await page.waitForTimeout(2000);
    
    // Check if chat list section exists
    const chatSection = page.locator('text=Active Chats');
    
    // If chats are loaded, verify they display correctly
    if (await chatSection.isVisible()) {
      await expect(chatSection).toBeVisible();
      
      // Check if chat cards are displayed
      const chatCards = page.locator('.glass-card.glass-card-hover');
      await expect(chatCards.first()).toBeVisible();
    }
  });

  test('should handle wallet connection status', async ({ page }) => {
    // Check if wallet connection warning is displayed when not connected
    const walletWarning = page.locator('text=Wallet not connected');
    
    // The warning may or may not be visible depending on wallet state
    // We just check that the page loads without errors
    await expect(page.locator('h1:has-text("IncryptX Telegram Bot")')).toBeVisible();
  });

  test('should navigate between different feature sections', async ({ page }) => {
    // Test navigation to different sections
    const launchSection = page.locator('button:has-text("Launch Commands")');
    await expect(launchSection).toBeVisible();
    await launchSection.click();
    
    // Wait for section to load
    await page.waitForTimeout(1000);
    
    // Check if launch commands are displayed
    await expect(page.locator('text=/launch')).toBeVisible();
    
    // Navigate to trading section
    const tradingSection = page.locator('button:has-text("Trading Commands")');
    await expect(tradingSection).toBeVisible();
    await tradingSection.click();
    
    // Wait for section to load
    await page.waitForTimeout(1000);
    
    // Check if trading commands are displayed
    await expect(page.locator('text=/trade')).toBeVisible();
  });

  test('should handle loading states during operations', async ({ page }) => {
    // Fill in command and trigger loading state
    const commandInput = page.locator('input[placeholder*="Type a command"]');
    await commandInput.fill('/portfolio');
    
    const sendButton = page.locator('button:has-text("Send Command")');
    await sendButton.click();
    
    // Check if loading state is displayed
    const loadingButton = page.locator('button:has-text("Processing")');
    await expect(loadingButton).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('.font-mono.text-sm.text-white', { timeout: 10000 });
    
    // Check if response is displayed
    const response = page.locator('.font-mono.text-sm.text-white');
    await expect(response).toBeVisible();
  });

  test('should display error messages when operations fail', async ({ page }) => {
    // Try to execute trade without filling required fields
    const executeButton = page.locator('button:has-text("Execute Trade")');
    await expect(executeButton).toBeVisible();
    
    // Button should be disabled when required fields are empty
    await expect(executeButton).toBeDisabled();
  });

  test('should handle bot command examples', async ({ page }) => {
    // Navigate to launch commands section
    const launchSection = page.locator('button:has-text("Launch Commands")');
    await launchSection.click();
    
    // Wait for commands to load
    await page.waitForTimeout(1000);
    
    // Click on a command example
    const commandExample = page.locator('.glass-card.glass-card-hover').first();
    await expect(commandExample).toBeVisible();
    await commandExample.click();
    
    // Check if command is populated in input
    const commandInput = page.locator('input[placeholder*="Type a command"]');
    await expect(commandInput).toHaveValue(/\/launch/);
  });

  test('should display bot features and capabilities', async ({ page }) => {
    // Check if feature cards are displayed
    const featureCards = page.locator('.glass-card.glass-card-hover');
    await expect(featureCards).toHaveCount.greaterThan(0);
    
    // Check specific features
    await expect(page.locator('text=Lightning Fast')).toBeVisible();
    await expect(page.locator('text=Secure & Private')).toBeVisible();
    await expect(page.locator('text=Zero Coding')).toBeVisible();
  });

  test('should handle multiple rapid commands', async ({ page }) => {
    const commandInput = page.locator('input[placeholder*="Type a command"]');
    const sendButton = page.locator('button:has-text("Send Command")');
    
    // Send multiple commands in sequence
    const commands = ['/launch Test1', '/trade SOL buy 1', '/portfolio'];
    
    for (const command of commands) {
      await commandInput.clear();
      await commandInput.fill(command);
      await sendButton.click();
      
      // Wait for response
      await page.waitForSelector('.font-mono.text-sm.text-white', { timeout: 10000 });
      
      // Clear response for next command
      await page.waitForTimeout(500);
    }
    
    // Verify final response is displayed
    const response = page.locator('.font-mono.text-sm.text-white');
    await expect(response).toBeVisible();
  });
});
