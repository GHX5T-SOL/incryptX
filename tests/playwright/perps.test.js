const { test, expect } = require('@playwright/test');

test.describe('IncryptX Perps Integration', () => {
  test('should connect wallet and open position', async ({ page }) => {
    // Navigate to perps market page
    await page.goto('http://localhost:5173/perps/sol');

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

    // Set leverage and amount
    await page.fill('input[placeholder="0.00"]', '100');

    // Open long position
    await page.click('text=Open LONG Position');
    await page.waitForSelector('text=Confirm Order', { timeout: 5000 });

    // Confirm order
    await page.click('text=Confirm Order');
    await page.waitForSelector('text=Opened long position: 100 SOL at 10x leverage', { timeout: 10000 });

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

    expect(logs.some(log => log.includes('position'))).toBeTruthy();
  });
});
