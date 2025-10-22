import nock from 'nock';
import { Connection } from '@solana/web3.js';
import { ChartFetcher, Sniper } from '../advanced_trade/trade_terminal';

describe('Advanced Trade Terminal', () => {
  const connection = new Connection('http://localhost:8899');

  beforeAll(() => {
    (global as any).fetch = async (url: string) => {
      const u = new URL(url);
      const path = u.pathname + (u.search || '');
      const res = await fetch(`http://localhost:0${path}` as any).catch(()=>({ ok: true, json: async ()=>({ pairs: [{ priceUsd: '1.23' }] }) } as any));
      return res as any;
    };
  });

  it('fetches dexscreener data', async () => {
    const cf = new ChartFetcher();
    const data = await cf.getDexscreenerPair('So11111111111111111111111111111111111111112');
    expect(data.pairs[0].priceUsd).toBe('1.23');
  });

  it('snipes on launch detect (stub)', async () => {
    const sniper = new Sniper(connection);
    const ok = await sniper.onLaunchDetected('Mint111111111111111111111111111111111111111', { maxPriceUsd: 2 });
    expect(ok).toBe(true);
  });
});
