const { test, expect } = require('@playwright/test');

test.describe('IncryptX Advanced Trade Integration', () => {
  test('should connect wallet and place limit order', async ({ page }) => {
    // Navigate to advanced trade page
    await page.goto('http://localhost:5173/trade/advanced');

    // Mock wallet connection
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        publicKey: { toString: () => '11111111111111111111111111111112' },
        connect: async () => ({ publicKey: { toString: () => '11111111111111111111111111111112' } }),
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs,
        signMessage: async (msg) => ({ signature: 'mock-signature' })
      };
    });

    // Select token
    await page.click('input[placeholder="Search tokens…"]');
    await page.click('text=CatWifHat');

    // Place limit order
    await page.fill('input[placeholder="0.00"]', '100');
    await page.fill('input[placeholder="0.00"]', '0.023');
    await page.click('button:has-text("BUY")');
    await page.waitForSelector('text=Confirm Order', { timeout: 5000 });

    // Confirm order
    await page.click('text=Confirm Order');
    await page.waitForSelector('text=Order placed: buy 100 CatWifHat at 0.023', { timeout: 10000 });

    // Check for transaction signature in console
    const logs = await page.evaluate(() => {
      return new Promise((resolve) => {
        const originalLog = console.log;
        const logs = [];
        console.log = (...args) => {
          logs.push(args.join(' '));
          originalLog(...args);
        };
        setTimeout(() => resolve(logs), 1000);
      });
    });

    expect(logs.some(log => log.includes('order'))).toBeTruthy();
  });
});
