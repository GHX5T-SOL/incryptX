import { renderHook, act } from '@testing-library/react';
import { useSwapAggregator } from '../../src/hooks/useSwapAggregator';
import { useWallet } from '@solana/wallet-adapter-react';

// Mock dependencies
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

jest.mock('../../src/hooks/useAnchorProgram', () => ({
  useSwapProgram: jest.fn(() => ({
    methods: {
      executeSwap: jest.fn(() => Promise.resolve('mock-tx')),
    },
  })),
}));

describe('useSwapAggregator', () => {
  beforeEach(() => {
    useWallet.mockReturnValue({
      connected: true,
      publicKey: { toString: () => 'mock-public-key' },
    });
  });

  it('should get best route', async () => {
    const { result } = renderHook(() => useSwapAggregator());

    await act(async () => {
      const route = await result.current.getBestRoute(
        { toBase58: () => 'mock-input-mint' },
        { toBase58: () => 'mock-output-mint' },
        1000000000,
        50
      );
      expect(route).toBeDefined();
    });
  });

  it('should execute swap', async () => {
    const { result } = renderHook(() => useSwapAggregator());

    await act(async () => {
      const tx = await result.current.executeSwap({ outAmount: 1000000 });
      expect(tx).toBe('mock-tx');
    });
  });

  it('should toggle stealth mode', () => {
    const { result } = renderHook(() => useSwapAggregator());

    act(() => {
      result.current.setStealth(true);
    });

    expect(result.current.stealth).toBe(true);
  });
});
