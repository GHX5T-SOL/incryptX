import { renderHook, act } from '@testing-library/react';
import { useStaking } from '../../src/hooks/useStaking';
import { useWallet } from '@solana/wallet-adapter-react';

// Mock dependencies
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

jest.mock('../../src/hooks/useAnchorProgram', () => ({
  useStakingProgram: jest.fn(() => ({
    methods: {
      stakeToken: jest.fn(() => Promise.resolve('mock-tx')),
      unstakeToken: jest.fn(() => Promise.resolve('mock-tx')),
      claimRewards: jest.fn(() => Promise.resolve('mock-tx')),
    },
  })),
}));

describe('useStaking', () => {
  beforeEach(() => {
    useWallet.mockReturnValue({
      connected: true,
      publicKey: { toBase58: () => 'mock-public-key' },
    });
  });

  it('should stake token', async () => {
    const { result } = renderHook(() => useStaking());

    await act(async () => {
      const tx = await result.current.stakeToken(
        { toBase58: () => 'mock-token-mint' },
        100
      );
      expect(tx).toBe('mock-tx');
    });
  });

  it('should unstake token', async () => {
    const { result } = renderHook(() => useStaking());

    await act(async () => {
      const tx = await result.current.unstakeToken('stake-id');
      expect(tx).toBe('mock-tx');
    });
  });

  it('should claim rewards', async () => {
    const { result } = renderHook(() => useStaking());

    await act(async () => {
      const tx = await result.current.claimRewards();
      expect(tx).toBe('mock-tx');
    });
  });

  it('should get stakes', async () => {
    const { result } = renderHook(() => useStaking());

    await act(async () => {
      const stakes = await result.current.getStakes();
      expect(stakes).toBeDefined();
    });
  });
});
