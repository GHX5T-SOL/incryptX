const { test, expect } = require('@playwright/test');

test.describe('IncryptX Trade Swap Integration', () => {
  test('should connect wallet and perform swap', async ({ page }) => {
    // Navigate to trade page
    await page.goto('http://localhost:5173/trade');

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

    // Connect wallet
    await page.click('text=Connect Wallet');
    await page.waitForSelector('text=Select tokens', { state: 'hidden' });

    // Select tokens
    await page.click('button:has-text("Select")');
    await page.click('text=SOL');
    await page.click('text=USDC');

    // Enter amount
    await page.fill('input[placeholder="0.00"]', '1');

    // Wait for route calculation
    await page.waitForSelector('text=Swapping...', { timeout: 5000 });

    // Perform swap
    await page.click('text=Swap');
    await page.waitForSelector('text=Successfully swapped', { timeout: 10000 });

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

    expect(logs.some(log => log.includes('swap'))).toBeTruthy();
  });
});
