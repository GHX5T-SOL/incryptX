import { Program, web3 } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

export const useAnchorProvider = () => {
  const { connection } = useConnection();
  const { wallet } = useWallet();

  return useMemo(() => {
    if (!wallet || !connection) return null;
    return new web3.Provider(connection, wallet.adapter);
  }, [connection, wallet]);
};

export const useAnchorProgram = (idl: any, programId: web3.PublicKey) => {
  const provider = useAnchorProvider();

  return useMemo(() => {
    if (!provider || !idl) return null;
    return new Program(idl, programId, provider);
  }, [idl, programId, provider]);
};

// Swap program specific hook
const SWAP_PROGRAM_ID = new web3.PublicKey('BSArzmxcSupt9tzgfQshu1xmWfBWtGDLNX7ZTvbaAfV5');

export const useSwapProgram = (idl: any) => {
  return useAnchorProgram(idl, SWAP_PROGRAM_ID);
};

// Trade program specific hook
const TRADE_PROGRAM_ID = new web3.PublicKey('HcrFFAHWXkBE7A6YZz9XYHbcCKAXb9uQxWWf1N87NTeB');

export const useTradeProgram = (idl: any) => {
  return useAnchorProgram(idl, TRADE_PROGRAM_ID);
};

// Perps program specific hook
const PERPS_PROGRAM_ID = new web3.PublicKey('6ediRNZoe7QEFdZHFedfJVvYkwiGRXgqnqvdzP9Rw9TQ');

export const usePerpsProgram = (idl: any) => {
  return useAnchorProgram(idl, PERPS_PROGRAM_ID);
};

// Staking program specific hook
const STAKING_PROGRAM_ID = new web3.PublicKey('3Fqt5PDL8snXSoZ9SV2dEdVRbszNY179pWPrMV3HvnjG');

export const useStakingProgram = (idl: any) => {
  return useAnchorProgram(idl, STAKING_PROGRAM_ID);
};

// Profiles program specific hook
const PROFILES_PROGRAM_ID = new web3.PublicKey('6qHnyRTdEL4JCGEyob87NCtX1uzTVHLJoqSEipqgu2Hs');

export const useProfilesProgram = (idl: any) => {
  return useAnchorProgram(idl, PROFILES_PROGRAM_ID);
};

// Bonding Curve program specific hook
const BONDING_CURVE_PROGRAM_ID = new web3.PublicKey('HRSjxaajaTm4rHNKoZYYLHoJNpZb7AGTWGjA6wJPy5zY');

export const useBondingCurveProgram = (idl: any) => {
  return useAnchorProgram(idl, BONDING_CURVE_PROGRAM_ID);
};

// IncryptX Launchpad program specific hook
const LAUNCHPAD_PROGRAM_ID = new web3.PublicKey('EUaDL98zaBthDc4qs9m3E3eUyvt8Wdhsmo2nEUiaH25d');

export const useLaunchpadProgram = (idl: any) => {
  return useAnchorProgram(idl, LAUNCHPAD_PROGRAM_ID);
};
