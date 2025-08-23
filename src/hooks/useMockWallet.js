import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export const useMockWallet = () => {
  const wallet = useWallet();
  const [address, setAddress] = useState(localStorage.getItem('mockWalletAddress') || (wallet.publicKey ? wallet.publicKey.toString() : null));
  const [balance, setBalance] = useState(10);

  const connect = async (mockAddress) => {
    if (wallet.connect) await wallet.connect();
    const addr = wallet.publicKey ? wallet.publicKey.toString() : (mockAddress || 'MockWallet' + Math.random().toString(36).slice(2, 10));
    localStorage.setItem('mockWalletAddress', addr);
    setAddress(addr);
    // Fetch real balance if connected, else mock
    setBalance(wallet.connected ? /* fetch balance */ 10 : 10);
  };

  const disconnect = () => {
    if (wallet.disconnect) wallet.disconnect();
    localStorage.removeItem('mockWalletAddress');
    setAddress(null);
  };

  return { address, balance, connect, disconnect };
};
