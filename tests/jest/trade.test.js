import { renderHook, act } from '@testing-library/react';
import { useTradeTerminal } from '../../src/hooks/useTradeTerminal';
import { useWallet } from '@solana/wallet-adapter-react';

// Mock dependencies
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

jest.mock('../../src/hooks/useAnchorProgram', () => ({
  useTradeProgram: jest.fn(() => ({
    methods: {
      createLimitOrder: jest.fn(() => Promise.resolve('mock-tx')),
      snipeToken: jest.fn(() => Promise.resolve('mock-subscription')),
    },
  })),
}));

// Mock Helius
jest.mock('@helius-labs/helius-sdk', () => ({
  Helius: jest.fn(() => ({
    rpc: {
      subscribeToProgramLogs: jest.fn(() => Promise.resolve('mock-subscription')),
      createWebhook: jest.fn(() => Promise.resolve('mock-webhook')),
    },
  })),
}));

describe('useTradeTerminal', () => {
  beforeEach(() => {
    useWallet.mockReturnValue({
      connected: true,
      publicKey: { toString: () => 'mock-public-key' },
    });
  });

  it('should create limit order', async () => {
    const { result } = renderHook(() => useTradeTerminal());

    await act(async () => {
      const tx = await result.current.createLimitOrder(
        { toBase58: () => 'mock-token-mint' },
        100,
        0.023
      );
      expect(tx).toBe('mock-tx');
    });
  });

  it('should snipe token', async () => {
    const { result } = renderHook(() => useTradeTerminal());

    await act(async () => {
      const subscription = await result.current.snipeToken(
        { toBase58: () => 'mock-token-mint' },
        100
      );
      expect(subscription).toBe('mock-subscription');
    });
  });

  it('should get chart data', async () => {
    const { result } = renderHook(() => useTradeTerminal());

    await act(async () => {
      const data = await result.current.getChartData(
        { toBase58: () => 'mock-token-mint' }
      );
      expect(data).toBeDefined();
    });
  });

  it('should track wallet', async () => {
    const { result } = renderHook(() => useTradeTerminal());

    await act(async () => {
      const webhook = await result.current.trackWallet(
        { toBase58: () => 'mock-wallet-address' }
      );
      expect(webhook).toBe('mock-webhook');
    });
  });

  it('should toggle order type', () => {
    const { result } = renderHook(() => useTradeTerminal());

    act(() => {
      result.current.setOrderType('market');
    });

    expect(result.current.orderType).toBe('market');
  });
});
