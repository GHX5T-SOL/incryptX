import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePerpsProgram } from './useAnchorProgram';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const usePerps = () => {
  const { wallet } = useWallet();
  const perpsProgram = usePerpsProgram({}); // Placeholder IDL
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [leverage, setLeverage] = useState(10);

  useEffect(() => {
    if (wallet?.publicKey) {
      loadPositions();
    }
  }, [wallet?.publicKey]);

  const loadPositions = async () => {
    if (!wallet?.publicKey) return;

    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('user_address', wallet.publicKey.toBase58());

      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      console.error('Error loading positions:', error);
      // Fallback to mock data
      setPositions([
        { id: 1, token: 'SOL', side: 'long', leverage: 10, size: 100, entryPrice: 98.45, pnl: 2.3 },
      ]);
    }
  };

  const openPosition = async (tokenMint: PublicKey, side: string, size: number, leverage: number) => {
    if (!wallet || !perpsProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      // Mock oracle price validation
      const oraclePrice = 98.45; // Stub with mock price
      if (oraclePrice <= 0) throw new Error('Invalid oracle price');

      // Simulate transaction before execution
      const simulated = await perpsProgram.methods.openPosition(side, size, leverage).accounts({
        user: wallet.publicKey,
        tokenMint,
      }).simulate();

      if (simulated.err) throw new Error('Simulation failed');

      // Execute the position
      const tx = await perpsProgram.methods.openPosition(side, size, leverage).accounts({
        user: wallet.publicKey,
        tokenMint,
      }).rpc();

      // Save to Supabase
      await supabase.from('positions').insert({
        user_address: wallet.publicKey.toBase58(),
        token: 'SOL',
        side,
        size,
        leverage,
        entry_price: oraclePrice,
      });

      await loadPositions();
      return tx;
    } catch (error) {
      console.error('Open position failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const closePosition = async (positionId: string) => {
    if (!wallet || !perpsProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      const tx = await perpsProgram.methods.closePosition(positionId).accounts({
        user: wallet.publicKey,
      }).rpc();

      // Update Supabase
      await supabase
        .from('positions')
        .update({ closed_at: new Date().toISOString() })
        .eq('id', positionId);

      await loadPositions();
      return tx;
    } catch (error) {
      console.error('Close position failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPositions = async () => {
    await loadPositions();
    return positions;
  };

  return {
    openPosition,
    closePosition,
    getPositions,
    positions,
    loading,
    leverage,
    setLeverage,
  };
};
