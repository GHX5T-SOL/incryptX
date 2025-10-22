import { renderHook, act } from '@testing-library/react';
import { usePerps } from '../../src/hooks/usePerps';
import { useWallet } from '@solana/wallet-adapter-react';

// Mock dependencies
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

jest.mock('../../src/hooks/useAnchorProgram', () => ({
  usePerpsProgram: jest.fn(() => ({
    methods: {
      openPosition: jest.fn(() => Promise.resolve('mock-tx')),
      closePosition: jest.fn(() => Promise.resolve('mock-tx')),
    },
  })),
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
}));

describe('usePerps', () => {
  beforeEach(() => {
    useWallet.mockReturnValue({
      connected: true,
      publicKey: { toBase58: () => 'mock-public-key' },
    });
  });

  it('should open position', async () => {
    const { result } = renderHook(() => usePerps());

    await act(async () => {
      const tx = await result.current.openPosition(
        { toBase58: () => 'mock-token-mint' },
        'long',
        100,
        10
      );
      expect(tx).toBe('mock-tx');
    });
  });

  it('should close position', async () => {
    const { result } = renderHook(() => usePerps());

    await act(async () => {
      const tx = await result.current.closePosition('position-id');
      expect(tx).toBe('mock-tx');
    });
  });

  it('should get positions', async () => {
    const { result } = renderHook(() => usePerps());

    await act(async () => {
      const positions = await result.current.getPositions();
      expect(positions).toBeDefined();
    });
  });

  it('should set leverage', () => {
    const { result } = renderHook(() => usePerps());

    act(() => {
      result.current.setLeverage(25);
    });

    expect(result.current.leverage).toBe(25);
  });
});
