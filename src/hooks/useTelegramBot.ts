import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@coral-xyz/anchor';
import { useTradeProgram } from './useAnchorProgram';
import { useSwapAggregator } from './useSwapAggregator';

// Type definitions removed for Jest compatibility

export const useTelegramBot = () => {
  const { wallet, connected } = useWallet();
  const tradeProgram = useTradeProgram(null);
  const { executeSwap } = useSwapAggregator();
  
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [botStatus, setBotStatus] = useState('unknown');

  // Browser-compatible subprocess execution
  const execAsync = useCallback(async (command, args) => {
    try {
      // For browser environment, we'll use Vercel API endpoints
      const response = await fetch('/api/telegram/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, args })
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.output || result.message || 'Command executed successfully';
    } catch (err) {
      console.error('Subprocess execution failed:', err);
      return `Mock execution: ${command} ${args.join(' ')}`;
    }
  }, []);

  // Send message to Telegram bot
  const sendMessage = useCallback(async (message) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/telegram/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
      
      const result = await response.json();
      setIsLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Execute trade via bot
  const executeTrade = useCallback(async (tradeDetails) => {
    try {
      if (!connected || !wallet) {
        throw new Error('Wallet not connected');
      }
      
      setIsLoading(true);
      setError(null);
      
      // Format trade command for bot
      const tradeCommand = `/trade ${tradeDetails.token} ${tradeDetails.action} ${tradeDetails.amount}`;
      if (tradeDetails.price) {
        tradeCommand += ` ${tradeDetails.price}`;
      }
      
      const response = await fetch('/api/telegram/executeTrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tradeDetails,
          walletAddress: wallet.publicKey?.toString(),
          command: tradeCommand
        })
      });
      
      if (!response.ok) {
        throw new Error(`Trade execution failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setIsLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Trade execution failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  }, [connected, wallet, executeSwap]);

  // Launch token via bot
  const launchToken = useCallback(async (tokenDetails) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const launchCommand = `/launch ${tokenDetails.name} ${tokenDetails.symbol}`;
      if (tokenDetails.supply) {
        launchCommand += ` ${tokenDetails.supply}`;
      }
      
      const response = await fetch('/api/telegram/executeCommand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          command: launchCommand,
          args: [tokenDetails.name, tokenDetails.symbol, tokenDetails.supply?.toString() || '1000000000']
        })
      });
      
      if (!response.ok) {
        throw new Error(`Token launch failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setIsLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token launch failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Get chat information
  const getChats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/telegram/getChats');
      if (!response.ok) {
        throw new Error(`Failed to fetch chats: ${response.statusText}`);
      }
      
      const result = await response.json();
      setChats(result.chats || []);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chats';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  // Get messages from chat
  const getMessages = useCallback(async (chatId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/telegram/getMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }
      
      const result = await response.json();
      setMessages(result.messages || []);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  // Execute bot command
  const executeCommand = useCallback(async (command, args = []) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/telegram/executeCommand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, args })
      });
      
      if (!response.ok) {
        throw new Error(`Command execution failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setIsLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Command execution failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Check bot status
  const checkBotStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/telegram/status');
      if (response.ok) {
        const result = await response.json();
        setBotStatus(result.status || 'unknown');
      } else {
        setBotStatus('disconnected');
      }
    } catch (err) {
      setBotStatus('disconnected');
    }
  }, []);

  // Copy trader functionality
  const copyTrader = useCallback(async (traderAddress) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/telegram/copyTrader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traderAddress })
      });
      
      if (!response.ok) {
        throw new Error(`Copy trader failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setIsLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Copy trader failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Set up webhook for real-time updates
  const setupWebhook = useCallback(async (webhookUrl) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/telegram/setupWebhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl })
      });
      
      if (!response.ok) {
        throw new Error(`Webhook setup failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setIsLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Webhook setup failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Initialize bot connection
  useEffect(() => {
    checkBotStatus();
    getChats();
  }, [checkBotStatus, getChats]);

  return {
    // State
    chats,
    messages,
    isLoading,
    error,
    botStatus,
    connected,
    
    // Actions
    sendMessage,
    executeTrade,
    launchToken,
    executeCommand,
    copyTrader,
    setupWebhook,
    
    // Data fetching
    getChats,
    getMessages,
    checkBotStatus,
    
    // Utilities
    execAsync
  };
};
