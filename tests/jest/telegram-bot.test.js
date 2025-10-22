import { renderHook, act, waitFor } from '@testing-library/react';
import { useTelegramBot } from '../../src/hooks/useTelegramBot';

// Mock fetch globally
global.fetch = jest.fn();

// Mock wallet adapter
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    wallet: {
      publicKey: { toString: () => 'MockWalletAddress123' }
    },
    connected: true
  })
}));

// Mock the hook dependencies
jest.mock('../../src/hooks/useAnchorProgram', () => ({
  useTradeProgram: () => ({
    methods: {
      executeTrade: jest.fn()
    }
  })
}));

jest.mock('../../src/hooks/useSwapAggregator', () => ({
  useSwapAggregator: () => ({
    executeSwap: jest.fn()
  })
}));


describe('useTelegramBot Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default state', async () => {
    const { result } = renderHook(() => useTelegramBot());

    expect(result.current.chats).toEqual([]);
    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.botStatus).toBe('unknown');
    expect(result.current.connected).toBe(true);
    
    // Wait for initial effects to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  test('should send message successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Message sent successfully',
      output: 'Bot received: Test message'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useTelegramBot());

    await act(async () => {
      const response = await result.current.sendMessage('Test message');
      expect(response).toEqual(mockResponse);
    });

    expect(fetch).toHaveBeenCalledWith('/api/telegram/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Test message' })
    });
  });

  test('should handle message sending error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useTelegramBot());

    await act(async () => {
      const response = await result.current.sendMessage('Test message');
      expect(response.success).toBe(false);
      expect(response.message).toBe('Network error');
    });

    expect(result.current.error).toBe('Network error');
  });

  test('should execute trade successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Trade executed successfully: BUY 1.5 SOL',
      signature: 'MockTradeSignature1234567890abcdef',
      data: {
        token: 'SOL',
        action: 'buy',
        amount: 1.5,
        walletAddress: 'MockWalletAddress123'
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useTelegramBot());

    const tradeDetails = {
      token: 'SOL',
      action: 'buy',
      amount: 1.5
    };

    await act(async () => {
      const response = await result.current.executeTrade(tradeDetails);
      expect(response).toEqual(mockResponse);
    });

    expect(fetch).toHaveBeenCalledWith('/api/telegram/executeTrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tradeDetails,
        walletAddress: 'MockWalletAddress123',
        command: '/trade SOL buy 1.5'
      })
    });
  });

  test('should handle trade execution error', async () => {
    fetch.mockRejectedValueOnce(new Error('Trade failed'));

    const { result } = renderHook(() => useTelegramBot());

    const tradeDetails = {
      token: 'SOL',
      action: 'buy',
      amount: 1.5
    };

    await act(async () => {
      const response = await result.current.executeTrade(tradeDetails);
      expect(response.success).toBe(false);
      expect(response.message).toBe('Trade failed');
    });

    expect(result.current.error).toBe('Trade failed');
  });

  test('should launch token successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Token launched successfully',
      signature: 'MockLaunchSignature1234567890abcdef'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useTelegramBot());

    const tokenDetails = {
      name: 'TestToken',
      symbol: 'TEST',
      supply: 1000000000,
      description: 'Test token description'
    };

    await act(async () => {
      const response = await result.current.launchToken(tokenDetails);
      expect(response).toEqual(mockResponse);
    });

    expect(fetch).toHaveBeenCalledWith('/api/telegram/executeCommand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: '/launch TestToken TEST',
        args: ['TestToken', 'TEST', '1000000000']
      })
    });
  });

  test('should execute command successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Command executed successfully',
      command: '/portfolio',
      args: []
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useTelegramBot());

    await act(async () => {
      const response = await result.current.executeCommand('/portfolio');
      expect(response).toEqual(mockResponse);
    });

    expect(fetch).toHaveBeenCalledWith('/api/telegram/executeCommand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: '/portfolio',
        args: []
      })
    });
  });

  test('should copy trader successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Copy trading enabled for trader',
      signature: 'MockCopySignature1234567890abcdef',
      traderAddress: 'TraderAddress123'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useTelegramBot());

    await act(async () => {
      const response = await result.current.copyTrader('TraderAddress123');
      expect(response).toEqual(mockResponse);
    });

    expect(fetch).toHaveBeenCalledWith('/api/telegram/copyTrader', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        traderAddress: 'TraderAddress123'
      })
    });
  });

  test('should get chats successfully', async () => {
    const mockResponse = {
      success: true,
      chats: [
        {
          id: '1',
          title: 'IncryptX Trading',
          type: 'group',
          memberCount: 1250
        },
        {
          id: '2',
          title: 'Memecoin Launches',
          type: 'group',
          memberCount: 890
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useTelegramBot());

    await act(async () => {
      await result.current.getChats();
    });

    expect(fetch).toHaveBeenCalledWith('/api/telegram/getChats');
    expect(result.current.chats).toEqual(mockResponse.chats);
  });

  test('should get messages successfully', async () => {
    const mockResponse = {
      success: true,
      messages: [
        {
          id: '1',
          text: '/launch TestToken',
          timestamp: Date.now() - 3600000,
          user: {
            id: 123456789,
            username: 'trader_alice'
          }
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useTelegramBot());

    await act(async () => {
      await result.current.getMessages('chat1');
    });

    expect(fetch).toHaveBeenCalledWith('/api/telegram/getMessages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: 'chat1' })
    });
    expect(result.current.messages).toEqual(mockResponse.messages);
  });

  test('should setup webhook successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Webhook setup successfully',
      signature: 'MockWebhookSignature1234567890abcdef',
      webhookUrl: 'https://example.com/webhook'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useTelegramBot());

    await act(async () => {
      const response = await result.current.setupWebhook('https://example.com/webhook');
      expect(response).toEqual(mockResponse);
    });

    expect(fetch).toHaveBeenCalledWith('/api/telegram/setupWebhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhookUrl: 'https://example.com/webhook'
      })
    });
  });

  test('should check bot status successfully', async () => {
    const mockResponse = {
      success: true,
      status: 'connected',
      uptime: 3600000,
      lastPing: Date.now(),
      features: {
        trading: true,
        launching: true,
        portfolio: true,
        copyTrading: true,
        analysis: true
      },
      stats: {
        totalCommands: 1250,
        successfulTrades: 890,
        tokensLaunched: 45,
        activeUsers: 567
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useTelegramBot());

    await act(async () => {
      await result.current.checkBotStatus();
    });

    expect(fetch).toHaveBeenCalledWith('/api/telegram/status');
    expect(result.current.botStatus).toBe('connected');
  });

  test('should handle disconnected wallet', async () => {
    // Mock disconnected wallet for this test
    const mockUseWallet = jest.fn(() => ({
      wallet: null,
      connected: false
    }));
    
    jest.doMock('@solana/wallet-adapter-react', () => ({
      useWallet: mockUseWallet
    }));

    const { result } = renderHook(() => useTelegramBot());

    expect(result.current.connected).toBe(false);

    const tradeDetails = {
      token: 'SOL',
      action: 'buy',
      amount: 1.5
    };

    await act(async () => {
      const response = await result.current.executeTrade(tradeDetails);
      expect(response.success).toBe(false);
      expect(response.message).toBe('Wallet not connected');
    });
  });

  test('should handle execAsync utility function', async () => {
    const mockResponse = {
      output: 'Mock execution result'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useTelegramBot());

    await act(async () => {
      const output = await result.current.execAsync('test-command', ['arg1', 'arg2']);
      expect(output).toBe('Mock execution result');
    });

    expect(fetch).toHaveBeenCalledWith('/api/telegram/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: 'test-command',
        args: ['arg1', 'arg2']
      })
    });
  });

  test('should handle loading states correctly', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    fetch.mockReturnValueOnce(promise);

    const { result } = renderHook(() => useTelegramBot());

    // Start async operation
    act(() => {
      result.current.sendMessage('Test message');
    });

    // Check loading state
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    await act(async () => {
      resolvePromise({
        ok: true,
        json: async () => ({ success: true, message: 'Success' })
      });
    });

    // Check loading state is false
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  test('should handle network errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useTelegramBot());

    await act(async () => {
      await result.current.getChats();
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });
});
