### IncryptX Swap Aggregator (Offchain)

- fetchPools: queries DEX pools (stubbed) for a pair.
- findBestRoute: size-aware selection (Dijkstra scaffold) prioritizing IncryptX.
- executeSwap: builds tx per route (stub for CPI/Raydium/Meteora).
- stealthExecute: optional stealth pre/post hops with 100 ephemeral keypairs; returns fee quote.
- SimpleSwapService: createPool/addLiquidity CPIs to IncryptX swap.

Usage (React hook sketch):
```ts
import { Connection, Keypair } from '@solana/web3.js';
import { fetchPools, findBestRoute, stealthExecute } from './index';

export function useQuote() {
  const connection = new Connection(process.env.HELIUS_RPC!);
  return async (inMint: string, outMint: string, amountIn: number) => {
    const pools = await fetchPools(connection, inMint, outMint);
    return findBestRoute(pools, amountIn);
  };
}
```

Testing:
- npm test runs mocks asserting routing choice and stealth fee quote.
