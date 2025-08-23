import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export const useMockWallet = () => {
  const wallet = useWallet();
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(10);

  useEffect(() => {
    // Check localStorage first, then wallet connection
    const savedAddress = localStorage.getItem('mockWalletAddress');
    if (savedAddress) {
      setAddress(savedAddress);
    } else if (wallet.connected && wallet.publicKey) {
      setAddress(wallet.publicKey.toString());
    }
  }, [wallet.connected, wallet.publicKey]);

  const connect = async (mockAddress) => {
    try {
      // Try to connect real wallet first
      if (wallet.connect && !wallet.connected) {
        await wallet.connect();
      }
      
      // Set address from wallet or mock
      const addr = wallet.publicKey ? wallet.publicKey.toString() : (mockAddress || 'MockWallet' + Math.random().toString(36).slice(2, 10));
      localStorage.setItem('mockWalletAddress', addr);
      setAddress(addr);
      setBalance(10); // Mock balance for demo
    } catch (error) {
      console.log('Wallet connection failed, using mock:', error);
      // Fallback to mock wallet
      const addr = mockAddress || 'MockWallet' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('mockWalletAddress', addr);
      setAddress(addr);
      setBalance(10);
    }
  };

  const disconnect = () => {
    try {
      if (wallet.disconnect) {
        wallet.disconnect();
      }
    } catch (error) {
      console.log('Wallet disconnect failed:', error);
    }
    
    localStorage.removeItem('mockWalletAddress');
    setAddress(null);
    setBalance(0);
  };

  return { 
    address, 
    balance, 
    connect, 
    disconnect,
    isConnected: !!address 
  };
};
