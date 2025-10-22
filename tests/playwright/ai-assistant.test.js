// tests/playwright/ai-assistant.test.js
import { test, expect } from '@playwright/test';

test.describe('AI Assistant E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/ai'); // Assuming AI page route
    // Mock wallet connection for Playwright
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        publicKey: { toBase58: () => 'MockPublicKey12345...' },
        isConnected: true,
        signTransaction: async () => ({ signature: 'MockSignature123...' }),
        signAllTransactions: async () => ([{ signature: 'MockSignature123...' }]),
        connect: async () => {},
        disconnect: async () => {},
      };
    });
    await page.reload(); // Reload to apply mock wallet
    await page.waitForSelector('text=Connect Wallet', { state: 'hidden' }); // Ensure wallet is "connected"
  });

  test('should display AI assistant interface', async ({ page }) => {
    await expect(page.locator('text=IncryptX AI Assistant')).toBeVisible();
    await expect(page.locator('text=Your intelligent trading companion')).toBeVisible();
    await expect(page.locator('text=Connected')).toBeVisible();
  });

  test('should allow user to send AI query and receive response', async ({ page }) => {
    const queryInput = page.locator('input[placeholder*="Ask me anything"]');
    const sendButton = page.locator('button:has-text("Send")');
    
    await queryInput.fill('What do you think about WIF token?');
    await sendButton.click();
    
    // Wait for AI response
    await page.waitForSelector('text=Based on current market data', { timeout: 10000 });
    
    // Verify AI response is displayed
    await expect(page.locator('text=Based on current market data')).toBeVisible();
    await expect(page.locator('text=Confidence:')).toBeVisible();
    await expect(page.locator('text=optimistic')).toBeVisible();
  });

  test('should switch between different AI modes', async ({ page }) => {
    // Test Strategy mode
    await page.click('button:has-text("Strategy")');
    await page.fill('input[placeholder*="Ask me anything"]', 'What trading strategy should I use?');
    await page.click('button:has-text("Send")');
    
    await page.waitForSelector('text=Strategic analysis', { timeout: 10000 });
    await expect(page.locator('text=Strategic analysis')).toBeVisible();
    
    // Test Emotion mode
    await page.click('button:has-text("Emotion")');
    await page.fill('input[placeholder*="Ask me anything"]', 'How is the market sentiment?');
    await page.click('button:has-text("Send")');
    
    await page.waitForSelector('text=Market sentiment analysis', { timeout: 10000 });
    await expect(page.locator('text=Market sentiment analysis')).toBeVisible();
  });

  test('should provide feedback on AI responses', async ({ page }) => {
    await page.fill('input[placeholder*="Ask me anything"]', 'Test query for feedback');
    await page.click('button:has-text("Send")');
    
    await page.waitForSelector('text=Based on current market data', { timeout: 10000 });
    
    // Click on positive feedback
    await page.click('button:has-text("👍 Good")');
    
    // Verify feedback confirmation message
    await page.waitForSelector('text=Thank you for your positive feedback', { timeout: 5000 });
    await expect(page.locator('text=Thank you for your positive feedback')).toBeVisible();
  });

  test('should execute trade actions when enabled', async ({ page }) => {
    // Enable trade mode
    await page.click('button:has-text("Enable Trade Mode")');
    await expect(page.locator('text=Trade Mode ON')).toBeVisible();
    
    // Fill trade execution form
    await page.selectOption('select', 'WIF');
    await page.fill('input[placeholder="0.0"]', '100');
    
    // Execute buy trade
    await page.click('button:has-text("Buy")');
    
    // Wait for trade execution confirmation
    await page.waitForSelector('text=Trade executed: BUY', { timeout: 10000 });
    await expect(page.locator('text=Trade executed: BUY')).toBeVisible();
    await expect(page.locator('text=Transaction:')).toBeVisible();
  });

  test('should get market sentiment analysis', async ({ page }) => {
    await page.click('button:has-text("📈 Market Sentiment")');
    
    // Wait for sentiment analysis response
    await page.waitForSelector('text=Market sentiment for', { timeout: 10000 });
    await expect(page.locator('text=Market sentiment for')).toBeVisible();
    await expect(page.locator('text=confidence')).toBeVisible();
    await expect(page.locator('text=Social sentiment:')).toBeVisible();
    await expect(page.locator('text=Technical score:')).toBeVisible();
  });

  test('should update AI preferences', async ({ page }) => {
    // Open preferences panel
    await page.click('button:has-text("⚙️")');
    await expect(page.locator('text=AI Preferences')).toBeVisible();
    
    // Update risk tolerance
    await page.selectOption('select', 'high');
    
    // Update trading style
    await page.selectOption('select', 'aggressive');
    
    // Enable emotional support mode
    await page.check('input[type="checkbox"]');
    
    // Verify preferences are updated (this would trigger the update in real implementation)
    await expect(page.locator('select')).toHaveValue('high');
  });

  test('should clear chat history', async ({ page }) => {
    // Send a message first
    await page.fill('input[placeholder*="Ask me anything"]', 'Test message');
    await page.click('button:has-text("Send")');
    
    await page.waitForSelector('text=Based on current market data', { timeout: 10000 });
    
    // Clear chat history
    await page.click('button:has-text("🗑️")');
    
    // Verify chat is cleared
    await expect(page.locator('text=Chat history cleared')).toBeVisible();
    await expect(page.locator('text=How can I help you today?')).toBeVisible();
  });

  test('should display loading states during AI processing', async ({ page }) => {
    await page.fill('input[placeholder*="Ask me anything"]', 'Test loading state');
    await page.click('button:has-text("Send")');
    
    // Verify loading indicator appears
    await expect(page.locator('.animate-bounce')).toBeVisible();
    
    // Wait for response and verify loading disappears
    await page.waitForSelector('text=Based on current market data', { timeout: 10000 });
    await expect(page.locator('.animate-bounce')).not.toBeVisible();
  });

  test('should handle quick action buttons', async ({ page }) => {
    // Test Get Strategy quick action
    await page.click('button:has-text("💡 Get Strategy")');
    
    await page.waitForSelector('text=Strategic analysis', { timeout: 10000 });
    await expect(page.locator('text=Strategic analysis')).toBeVisible();
    await expect(page.locator('text=diversified approach')).toBeVisible();
  });

  test('should show confidence and emotion indicators', async ({ page }) => {
    await page.fill('input[placeholder*="Ask me anything"]', 'Analyze market conditions');
    await page.click('button:has-text("Send")');
    
    await page.waitForSelector('text=Based on current market data', { timeout: 10000 });
    
    // Verify confidence and emotion are displayed
    await expect(page.locator('text=Confidence:')).toBeVisible();
    await expect(page.locator('text=optimistic')).toBeVisible();
    
    // Verify confidence percentage is displayed
    await expect(page.locator('text=Confidence: 8')).toBeVisible(); // Should show percentage like "85%"
  });

  test('should display recommended actions', async ({ page }) => {
    await page.fill('input[placeholder*="Ask me anything"]', 'What should I do with my portfolio?');
    await page.click('button:has-text("Send")');
    
    await page.waitForSelector('text=Recommended Actions:', { timeout: 10000 });
    await expect(page.locator('text=Recommended Actions:')).toBeVisible();
    
    // Verify action items are displayed
    await expect(page.locator('text=Set stop-loss')).toBeVisible();
    await expect(page.locator('text=Monitor volume')).toBeVisible();
  });
});
