const { test, expect } = require('@playwright/test');

test.describe('IncryptX Staking Integration', () => {
  test('should connect wallet and stake tokens', async ({ page }) => {
    // Navigate to staking page
    await page.goto('http://localhost:5173/staking');

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

    // Select a staking pool
    await page.click('text=CatWifHat');

    // Enter stake amount
    await page.fill('input[placeholder*="Min:"]', '100');

    // Stake tokens
    await page.click('text=Stake Now');
    await page.waitForSelector('text=Stake failed. Check console for details.', { state: 'hidden', timeout: 10000 });

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

    expect(logs.some(log => log.includes('stake'))).toBeTruthy();
  });
});
