import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useStakingProgram } from './useAnchorProgram';

export const useStaking = () => {
  const { wallet } = useWallet();
  const stakingProgram = useStakingProgram({}); // Placeholder IDL
  const [loading, setLoading] = useState(false);
  const [stakes, setStakes] = useState([]);
  const [rewards, setRewards] = useState(0);

  useEffect(() => {
    if (wallet?.publicKey) {
      loadStakes();
    }
  }, [wallet?.publicKey]);

  const loadStakes = async () => {
    if (!wallet?.publicKey) return;

    try {
      // Mock data for now - replace with actual program call
      setStakes([
        { id: 1, token: 'SOL', amount: 100, stakedAt: new Date(), rewards: 5.23 },
        { id: 2, token: 'USDC', amount: 1000, stakedAt: new Date(), rewards: 12.45 },
      ]);
      setRewards(17.68);
    } catch (error) {
      console.error('Error loading stakes:', error);
      // Fallback to mock data
      setStakes([]);
      setRewards(0);
    }
  };

  const stakeToken = async (tokenMint: PublicKey, amount: number) => {
    if (!wallet || !stakingProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      // Execute stake transaction
      const tx = await stakingProgram.methods.stakeToken(amount).accounts({
        user: wallet.publicKey,
        tokenMint,
      }).rpc();

      await loadStakes();
      return tx;
    } catch (error) {
      console.error('Stake failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unstakeToken = async (stakeId: string) => {
    if (!wallet || !stakingProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      const tx = await stakingProgram.methods.unstakeToken(stakeId).accounts({
        user: wallet.publicKey,
      }).rpc();

      await loadStakes();
      return tx;
    } catch (error) {
      console.error('Unstake failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const claimRewards = async () => {
    if (!wallet || !stakingProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      const tx = await stakingProgram.methods.claimRewards().accounts({
        user: wallet.publicKey,
      }).rpc();

      await loadStakes();
      return tx;
    } catch (error) {
      console.error('Claim rewards failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStakes = async () => {
    await loadStakes();
    return stakes;
  };

  return {
    stakeToken,
    unstakeToken,
    claimRewards,
    getStakes,
    stakes,
    rewards,
    loading,
  };
};
