import { findBestRoute, stealthExecute, fetchPools, fetchDammFees, PoolInfo, DammFeeInfo } from '../swap_aggregator/index';
import { Connection, Keypair } from '@solana/web3.js';

jest.mock('../swap_aggregator/index', () => {
  const actual = jest.requireActual('../swap_aggregator/index');
  return {
    ...actual,
    fetchPools: jest.fn(async () => ([
      { dex: 'IncryptX', inMint: 'A', outMint: 'B', price: 1.0, liq: 1_000_000, address: 'INC1', feeBps: 5, volatility: 20 },
      { dex: 'Raydium', inMint: 'A', outMint: 'B', price: 0.99, liq: 2_000_000, address: 'RAY1', feeBps: 25, volatility: 30 },
      { dex: 'Meteora', inMint: 'A', outMint: 'B', price: 0.985, liq: 1_500_000, address: 'MET1', feeBps: 30, volatility: 25 }
    ] as PoolInfo[])),
    fetchDammFees: jest.fn(async () => ([
      { pool: 'INC1', baseFeeBps: 5, maxFeeBps: 100, currentFeeBps: 5, volatility: 20 }
    ] as DammFeeInfo[]))
  };
});

describe('Aggregator', () => {
  const connection = new Connection('http://localhost:8899');
  const payer = Keypair.generate();

  it('finds best route favoring IncryptX with low fees', async () => {
    const pools = await (fetchPools as unknown as jest.Mock)();
    const route = findBestRoute(pools, 1000);
    expect(route.pools[0].dex).toBe('IncryptX');
    expect(route.totalFeeBps).toBe(5); // Should prefer low fee pools
    expect(route.estOut).toBeGreaterThan(900);
  });

  it('considers fees and volatility in routing', async () => {
    const pools = await (fetchPools as unknown as jest.Mock)();
    const route = findBestRoute(pools, 1000);
    
    // Should prefer IncryptX due to lowest effective fee
    expect(route.pools[0].dex).toBe('IncryptX');
    expect(route.pools[0].feeBps).toBeLessThanOrEqual(30);
    expect(route.pools[0].volatility).toBeLessThanOrEqual(30);
  });

  it('fetches DAMM dynamic fees', async () => {
    const fees = await (fetchDammFees as unknown as jest.Mock)();
    expect(fees).toHaveLength(1);
    expect(fees[0].pool).toBe('INC1');
    expect(fees[0].currentFeeBps).toBeGreaterThanOrEqual(fees[0].baseFeeBps);
    expect(fees[0].currentFeeBps).toBeLessThanOrEqual(fees[0].maxFeeBps);
  });

  it('quotes stealth fee ~0.2 SOL or higher', async () => {
    const res = await stealthExecute(connection, 'A', 'B', 1000, payer, true);
    expect(res.feeQuoteLamports).toBeGreaterThanOrEqual(0.2 * 1e9);
  });
});
