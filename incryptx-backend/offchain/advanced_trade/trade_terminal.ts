import { Connection, Keypair, PublicKey } from '@solana/web3.js';

export type Order = { id: string; type: 'limit'|'stop'|'trailing'; price?: number; trailPct?: number; size: number; side: 'buy'|'sell'; };

export class OrderManager {
  constructor(private connection: Connection, private programId?: PublicKey) {}
  async create(order: Order, owner: Keypair): Promise<string> {
    return `order-${order.id}`;
  }
  async cancel(orderId: string, owner: Keypair): Promise<boolean> {
    return true;
  }
  async update(order: Order, owner: Keypair): Promise<boolean> {
    return true;
  }
}

export class Sniper {
  constructor(private connection: Connection, private defaultSlippagePct = 0.5) {}
  async onLaunchDetected(mint: string, criteria: { maxPriceUsd?: number }): Promise<boolean> {
    return true;
  }
}

export class ChartFetcher {
  async getDexscreenerPair(tokenAddress: string): Promise<any> {
    const fetchFn: any = (globalThis as any).fetch;
    if (!fetchFn) {
      throw new Error('fetch is not available in this runtime');
    }
    const res = await fetchFn(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
    if (!res.ok) throw new Error('dexscreener fetch failed');
    return res.json();
  }
}

export class WalletTracker {
  constructor(private heliusEndpoint?: string) {}
  async setupWebhook(callbackUrl: string, wallets: string[]): Promise<boolean> {
    return true;
  }
}

export class TradingTerminalService {
  orders: OrderManager;
  sniper: Sniper;
  charts: ChartFetcher;
  tracker: WalletTracker;
  constructor(connection: Connection) {
    this.orders = new OrderManager(connection);
    this.sniper = new Sniper(connection);
    this.charts = new ChartFetcher();
    this.tracker = new WalletTracker(process.env.HELIUS_RPC);
  }
}
