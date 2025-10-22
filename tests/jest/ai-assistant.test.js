import { renderHook, act, waitFor } from '@testing-library/react';
import { useAIAssistant } from '../../src/hooks/useAIAssistant';

// Mock fetch globally
global.fetch = jest.fn();

// Mock wallet adapter
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    wallet: {
      publicKey: { toBase58: () => 'MockWalletAddress123' }
    },
    connected: true,
    publicKey: { toBase58: () => 'MockWalletAddress123' }
  })
}));

// Mock the hook dependencies
jest.mock('../../src/hooks/useAnchorProgram', () => ({
  useProfilesProgram: () => ({
    methods: {
      updatePreferences: jest.fn()
    }
  }),
  useTradeProgram: () => ({
    methods: {
      executeTrade: jest.fn()
    }
  }),
  useSwapProgram: () => ({
    methods: {
      swap: jest.fn()
    }
  })
}));

// Mock Audio constructor
global.Audio = jest.fn(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  currentTime: 0,
  duration: 0,
  paused: true
}));

describe('useAIAssistant Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
  });

  test('should initialize with default state', async () => {
    const { result } = renderHook(() => useAIAssistant());

    expect(result.current.loading).toBe(false);
    expect(result.current.chatHistory).toEqual([]);
    expect(result.current.preferences).toEqual({
      riskTolerance: 'medium',
      tradingStyle: 'balanced',
      preferredTokens: [],
      emotionalMode: true,
      autoExecute: false,
      voiceEnabled: false
    });
    expect(result.current.learningData).toEqual([]);
    expect(result.current.voiceEnabled).toBe(false);
    expect(result.current.currentVoiceResponse).toBeNull();
    expect(result.current.isConnected).toBe(true);
    expect(result.current.walletAddress).toBe('MockWalletAddress123');
  });

  test('should query AI successfully', async () => {
    const mockResponse = {
      response: 'Based on current market conditions, SOL shows strong bullish momentum.',
      voiceUrl: null,
      metadata: {
        model_used: 'fine-tuned-llama',
        confidence: 0.85,
        emotion: 'analytical',
        strategy: 'balanced',
        reasoning: 'AI analysis',
        riskLevel: 'medium',
        recommendedActions: ['Set stop-loss', 'Monitor volume']
      }
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    );

    const { result } = renderHook(() => useAIAssistant());

    await act(async () => {
      const response = await result.current.queryAI('What do you think about SOL?');
      expect(response).toEqual(mockResponse);
    });

    expect(fetch).toHaveBeenCalledWith('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'chat',
        prompt: 'What do you think about SOL?',
        context: {
          mode: 'query',
          walletAddress: 'MockWalletAddress123',
          useVoice: false
        },
        useVoice: false,
        voiceId: undefined
      })
    });

    expect(result.current.chatHistory.length).toBeGreaterThan(0);
    expect(result.current.learningData.length).toBeGreaterThan(0);
  });

  test('should query AI with voice enabled', async () => {
    const mockResponse = {
      response: 'This is a voice response test.',
      voiceUrl: 'https://api.elevenlabs.io/v1/text-to-speech/mock-voice-id/audio.mp3',
      metadata: {
        model_used: 'fine-tuned-llama',
        confidence: 0.88,
        emotion: 'friendly',
        strategy: 'supportive',
        reasoning: 'Voice test response',
        riskLevel: 'low',
        recommendedActions: []
      }
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    );

    const { result } = renderHook(() => useAIAssistant());

    await act(async () => {
      const response = await result.current.queryAI('Test voice response', 'query', true);
      expect(response).toEqual(mockResponse);
    });

    expect(fetch).toHaveBeenCalledWith('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'chat',
        prompt: 'Test voice response',
        context: {
          mode: 'query',
          walletAddress: 'MockWalletAddress123',
          useVoice: true
        },
        useVoice: true,
        voiceId: '21m00Tcm4TlvDq8ikWAM'
      })
    });

    expect(result.current.currentVoiceResponse).toBe(mockResponse.voiceUrl);
  });

  test('should handle AI query error gracefully', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    const { result } = renderHook(() => useAIAssistant());

    await act(async () => {
      try {
        await result.current.queryAI('Test error handling');
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    expect(result.current.loading).toBe(false);
  });

  test('should execute trade action successfully', async () => {
    const { result } = renderHook(() => useAIAssistant());

    await act(async () => {
      const signature = await result.current.executeTradeAction('buy', 'So11111111111111111111111111111111111111112', 1.5);
      expect(signature).toMatch(/^MockSignature\d+/);
    });

    expect(result.current.chatHistory.length).toBeGreaterThan(0);
    expect(result.current.loading).toBe(false);
  });

  test('should update preferences successfully', async () => {
    const { result } = renderHook(() => useAIAssistant());

    const newPreferences = {
      riskTolerance: 'high',
      tradingStyle: 'aggressive',
      voiceEnabled: true
    };

    await act(async () => {
      await result.current.updatePreferences(newPreferences);
    });

    expect(result.current.preferences).toEqual({
      riskTolerance: 'high',
      tradingStyle: 'aggressive',
      preferredTokens: [],
      emotionalMode: true,
      autoExecute: false,
      voiceEnabled: true
    });

    expect(result.current.chatHistory.length).toBeGreaterThan(0);
  });

  test('should provide feedback successfully', async () => {
    const { result } = renderHook(() => useAIAssistant());

    // First, add a message to chat history
    await act(async () => {
      await result.current.queryAI('Test message for feedback');
    });

    const messageId = result.current.chatHistory[result.current.chatHistory.length - 1].id;

    await act(async () => {
      await result.current.provideFeedback(messageId, 'positive');
    });

    expect(result.current.learningData.length).toBeGreaterThan(0);
    expect(result.current.chatHistory.length).toBeGreaterThan(0);
  });

  test('should clear chat history', async () => {
    const { result } = renderHook(() => useAIAssistant());

    // First, add some messages
    await act(async () => {
      await result.current.queryAI('Test message 1');
    });

    await act(async () => {
      result.current.clearChatHistory();
    });

    expect(result.current.chatHistory.length).toBe(1);
    expect(result.current.chatHistory[0].type).toBe('ai');
    expect(result.current.chatHistory[0].message).toContain('Chat history cleared');
  });

  test('should get market sentiment', async () => {
    const { result } = renderHook(() => useAIAssistant());

    await act(async () => {
      const sentiment = await result.current.getMarketSentiment();
      expect(sentiment).toHaveProperty('overall');
      expect(sentiment).toHaveProperty('confidence');
      expect(sentiment).toHaveProperty('socialSentiment');
      expect(sentiment).toHaveProperty('technicalScore');
      expect(sentiment).toHaveProperty('riskScore');
      expect(sentiment).toHaveProperty('recommendation');
    });

    expect(result.current.chatHistory.length).toBeGreaterThan(0);
  });

  test('should toggle voice mode', async () => {
    const { result } = renderHook(() => useAIAssistant());

    expect(result.current.voiceEnabled).toBe(false);

    await act(async () => {
      result.current.toggleVoice();
    });

    expect(result.current.voiceEnabled).toBe(true);
    expect(result.current.preferences.voiceEnabled).toBe(true);

    await act(async () => {
      result.current.toggleVoice();
    });

    expect(result.current.voiceEnabled).toBe(false);
    expect(result.current.preferences.voiceEnabled).toBe(false);
  });

  test('should play voice response', async () => {
    const { result } = renderHook(() => useAIAssistant());

    const audioUrl = 'https://api.elevenlabs.io/v1/text-to-speech/mock-voice-id/audio.mp3';

    await act(async () => {
      result.current.playVoiceResponse(audioUrl);
    });

    expect(global.Audio).toHaveBeenCalledWith(audioUrl);
  });

  test('should stop voice response', async () => {
    const { result } = renderHook(() => useAIAssistant());

    // Set a voice response first
    await act(async () => {
      result.current.currentVoiceResponse = 'https://api.elevenlabs.io/v1/text-to-speech/mock-voice-id/audio.mp3';
    });

    expect(result.current.currentVoiceResponse).toBeTruthy();

    await act(async () => {
      result.current.stopVoiceResponse();
    });

    expect(result.current.currentVoiceResponse).toBeNull();
  });

  test('should handle disconnected wallet', async () => {
    // Mock disconnected wallet
    jest.clearAllMocks();
    jest.mock('@solana/wallet-adapter-react', () => ({
      useWallet: () => ({
        wallet: null,
        connected: false,
        publicKey: null
      })
    }));

    const { result } = renderHook(() => useAIAssistant());

    expect(result.current.isConnected).toBe(false);
    expect(result.current.walletAddress).toBeUndefined();

    await act(async () => {
      try {
        await result.current.queryAI('Test query');
      } catch (error) {
        expect(error.message).toBe('Wallet not connected');
      }
    });
  });

  test('should handle loading states correctly', async () => {
    fetch.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({ response: 'Test response' }) }), 100))
    );

    const { result } = renderHook(() => useAIAssistant());

    expect(result.current.loading).toBe(false);

    await act(async () => {
      const promise = result.current.queryAI('Test query');
      expect(result.current.loading).toBe(true);
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  test('should handle different AI modes', async () => {
    const mockResponse = {
      response: 'Strategic analysis response',
      voiceUrl: null,
      metadata: {
        model_used: 'fine-tuned-llama',
        confidence: 0.92,
        emotion: 'strategic',
        strategy: 'balanced_portfolio',
        reasoning: 'Strategic analysis',
        riskLevel: 'low',
        recommendedActions: ['Diversify portfolio', 'Use stop-losses']
      }
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    );

    const { result } = renderHook(() => useAIAssistant());

    await act(async () => {
      const response = await result.current.queryAI('Test strategy query', 'strategy');
      expect(response).toEqual(mockResponse);
    });

    expect(fetch).toHaveBeenCalledWith('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'chat',
        prompt: 'Test strategy query',
        context: {
          mode: 'strategy',
          walletAddress: 'MockWalletAddress123',
          useVoice: false
        },
        useVoice: false,
        voiceId: undefined
      })
    });
  });
});