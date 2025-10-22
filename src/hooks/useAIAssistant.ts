// src/hooks/useAIAssistant.ts
import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProfilesProgram, useTradeProgram, useSwapProgram } from './useAnchorProgram';

// AI call using fine-tuned model and voice capabilities
const callAI = async (query: string, mode: 'query' | 'strategy' | 'emotion' = 'query', walletAddress?: string, useVoice: boolean = false): Promise<any> => {
  try {
    // Try to call the Vercel API with enhanced parameters
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'chat',
        prompt: query,
        context: {
          mode,
          walletAddress,
          useVoice
        },
        useVoice,
        voiceId: useVoice ? '21m00Tcm4TlvDq8ikWAM' : undefined
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        response: data.response,
        voiceUrl: data.voiceUrl,
        metadata: data.metadata
      };
    } else {
      throw new Error(`API call failed: ${response.status}`);
    }
  } catch (error) {
    console.warn('AI API call failed, using fallback:', error);
    
    // Fallback to mock responses
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = {
          query: {
            response: `Based on current market data, here's my analysis: ${query} suggests bullish momentum. Consider setting a stop-loss at 0.025 SOL and take profit at 0.035 SOL.`,
            confidence: 0.85,
            emotion: 'optimistic',
            strategy: 'buy_with_caution',
            reasoning: 'Technical indicators show positive trend with strong support levels.',
            riskLevel: 'medium',
            recommendedActions: ['Set stop-loss', 'Monitor volume', 'Consider DCA']
          },
          strategy: {
            response: `Strategic analysis for ${query}: I recommend a diversified approach with 60% long positions, 30% swing trades, and 10% for quick scalps. Focus on tokens with strong fundamentals and active communities.`,
            confidence: 0.92,
            emotion: 'strategic',
            strategy: 'balanced_portfolio',
            reasoning: 'Market conditions favor a balanced approach with risk management.',
            riskLevel: 'low',
            recommendedActions: ['Diversify portfolio', 'Use stop-losses', 'Monitor market sentiment']
          },
          emotion: {
            response: `Market sentiment analysis: The current mood around ${query} is ${Math.random() > 0.5 ? 'bullish' : 'cautious'}. Community engagement is high, and social macros show positive momentum.`,
            confidence: 0.78,
            emotion: Math.random() > 0.5 ? 'bullish' : 'neutral',
            strategy: 'sentiment_driven',
            reasoning: 'Social sentiment and community engagement drive price movements.',
            riskLevel: 'medium',
            recommendedActions: ['Monitor social channels', 'Track community growth', 'Watch for sentiment shifts']
          }
        };
        
        resolve(responses[mode]);
      }, 1500 + Math.random() * 1000); // Simulate AI processing time
    });
  }
};

// Mock trade execution
const executeTrade = async (action: string, tokenMint: PublicKey, amount: number, price?: number): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock transaction signature
      const mockSignature = `MockSignature${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      console.log(`Executing ${action} trade: ${amount} of ${tokenMint.toBase58()} at ${price || 'market'} price`);
      resolve(mockSignature);
    }, 2000);
  });
};

// Mock preference storage
const storePreferences = async (walletAddress: string, preferences: any): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Storing AI preferences for wallet:', walletAddress, preferences);
      // In real implementation, this would store in profiles program or off-chain DB
      resolve();
    }, 500);
  });
};

// Mock learning feedback
const updateLearning = async (query: string, response: any, feedback: 'positive' | 'negative' | 'neutral'): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Updating AI learning:', { query, response, feedback });
      // In real implementation, this would update AI model weights or preference profiles
      resolve();
    }, 300);
  });
};

export const useAIAssistant = () => {
  const { wallet, publicKey, connected } = useWallet();
  const profilesProgram = useProfilesProgram({}); // Placeholder IDL
  const tradeProgram = useTradeProgram({}); // Placeholder IDL
  const swapProgram = useSwapProgram({}); // Placeholder IDL
  
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [preferences, setPreferences] = useState({
    riskTolerance: 'medium',
    tradingStyle: 'balanced',
    preferredTokens: [],
    emotionalMode: true,
    autoExecute: false,
    voiceEnabled: false
  });
  const [learningData, setLearningData] = useState<any[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentVoiceResponse, setCurrentVoiceResponse] = useState<string | null>(null);

  // Mock chat history for initial state
  useEffect(() => {
    const mockHistory = [
      {
        id: 1,
        type: 'ai',
        message: 'Welcome to IncryptX AI Assistant! I can help you with trading strategies, market analysis, and emotional support. What would you like to know?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        confidence: 1.0,
        emotion: 'friendly'
      },
      {
        id: 2,
        type: 'user',
        message: 'What do you think about WIF token?',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        confidence: null,
        emotion: null
      },
      {
        id: 3,
        type: 'ai',
        message: 'WIF shows strong fundamentals with growing community adoption. Technical indicators suggest bullish momentum, but be mindful of volatility. Consider a balanced approach with proper risk management.',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        confidence: 0.87,
        emotion: 'analytical',
        strategy: 'balanced_approach',
        actions: ['Monitor support levels', 'Set stop-loss', 'Watch volume trends']
      }
    ];
    setChatHistory(mockHistory);
  }, []);

  const queryAI = async (query: string, mode: 'query' | 'strategy' | 'emotion' = 'query', useVoice: boolean = false): Promise<any> => {
    if (!connected) throw new Error('Wallet not connected');
    
    setLoading(true);
    try {
      console.log(`AI Query: ${query} (mode: ${mode}, voice: ${useVoice})`);
      
      // Add user message to chat history
      const userMessage = {
        id: Date.now(),
        type: 'user',
        message: query,
        timestamp: new Date(),
        confidence: null,
        emotion: null
      };
      setChatHistory(prev => [...prev, userMessage]);

      // Call AI service with voice support
      const aiResponse = await callAI(query, mode, publicKey?.toBase58(), useVoice);
      
      // Set voice response if available
      if (aiResponse.voiceUrl && useVoice) {
        setCurrentVoiceResponse(aiResponse.voiceUrl);
      }
      
      // Add AI response to chat history
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: aiResponse.response,
        timestamp: new Date(),
        confidence: aiResponse.confidence || 0.8,
        emotion: aiResponse.emotion || 'neutral',
        strategy: aiResponse.strategy || 'balanced',
        reasoning: aiResponse.reasoning || 'AI analysis',
        riskLevel: aiResponse.riskLevel || 'medium',
        recommendedActions: aiResponse.recommendedActions || [],
        voiceUrl: aiResponse.voiceUrl
      };
      setChatHistory(prev => [...prev, aiMessage]);

      // Store learning data
      const learningEntry = {
        query,
        response: aiResponse,
        timestamp: new Date(),
        userWallet: publicKey?.toBase58()
      };
      setLearningData(prev => [...prev, learningEntry]);

      return aiResponse;
    } catch (error) {
      console.error('AI query failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const executeTradeAction = async (action: 'buy' | 'sell', tokenMint: PublicKey, amount: number, price?: number): Promise<string> => {
    if (!connected || !tradeProgram && !swapProgram) throw new Error('Wallet not connected or programs not available');
    
    setLoading(true);
    try {
      console.log(`Executing trade: ${action} ${amount} of ${tokenMint.toBase58()}`);
      
      // Simulate CPI call to appropriate program
      let txSignature: string;
      if (action === 'buy' || action === 'sell') {
        // Use swap program for immediate trades
        // await swapProgram.rpc.swap(action, amount, price, { accounts: {}, signers: [] });
        txSignature = await executeTrade(action, tokenMint, amount, price);
      } else {
        // Use trade program for limit orders
        // await tradeProgram.rpc.createOrder(action, amount, price, { accounts: {}, signers: [] });
        txSignature = await executeTrade(action, tokenMint, amount, price);
      }

      // Add trade execution to chat history
      const tradeMessage = {
        id: Date.now(),
        type: 'ai',
        message: `Trade executed: ${action.toUpperCase()} ${amount} ${tokenMint.toBase58().slice(0, 8)}... at ${price || 'market'} price. Transaction: ${txSignature.slice(0, 8)}...`,
        timestamp: new Date(),
        confidence: 1.0,
        emotion: 'executive',
        txSignature,
        tradeDetails: { action, tokenMint: tokenMint.toBase58(), amount, price }
      };
      setChatHistory(prev => [...prev, tradeMessage]);

      return txSignature;
    } catch (error) {
      console.error('Trade execution failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: any): Promise<void> => {
    if (!connected) throw new Error('Wallet not connected');
    
    setLoading(true);
    try {
      console.log('Updating AI preferences:', newPreferences);
      
      // Simulate CPI call to profiles program to store preferences
      // await profilesProgram.rpc.updatePreferences(newPreferences, { accounts: {}, signers: [] });
      await storePreferences(publicKey?.toBase58() || '', newPreferences);
      
      setPreferences(prev => ({ ...prev, ...newPreferences }));
      
      // Add preference update to chat history
      const prefMessage = {
        id: Date.now(),
        type: 'ai',
        message: `Preferences updated! Your AI assistant will now adapt to your ${newPreferences.riskTolerance || 'current'} risk tolerance and ${newPreferences.tradingStyle || 'current'} trading style.`,
        timestamp: new Date(),
        confidence: 1.0,
        emotion: 'helpful'
      };
      setChatHistory(prev => [...prev, prefMessage]);
    } catch (error) {
      console.error('Update preferences failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const provideFeedback = async (messageId: number, feedback: 'positive' | 'negative' | 'neutral'): Promise<void> => {
    if (!connected) throw new Error('Wallet not connected');
    
    try {
      const message = chatHistory.find(msg => msg.id === messageId);
      if (!message) throw new Error('Message not found');

      console.log(`Providing feedback for message ${messageId}: ${feedback}`);
      
      // Update learning data with feedback
      await updateLearning(message.message, message, feedback);
      
      // Update learning data state
      const feedbackEntry = {
        messageId,
        feedback,
        timestamp: new Date(),
        userWallet: publicKey?.toBase58()
      };
      setLearningData(prev => [...prev, feedbackEntry]);

      // Add feedback confirmation to chat history
      const feedbackMessage = {
        id: Date.now(),
        type: 'ai',
        message: `Thank you for your ${feedback} feedback! This helps me learn and improve my responses for you.`,
        timestamp: new Date(),
        confidence: 1.0,
        emotion: 'grateful'
      };
      setChatHistory(prev => [...prev, feedbackMessage]);
    } catch (error) {
      console.error('Provide feedback failed:', error);
      throw error;
    }
  };

  const clearChatHistory = (): void => {
    setChatHistory([{
      id: 1,
      type: 'ai',
      message: 'Chat history cleared. How can I help you today?',
      timestamp: new Date(),
      confidence: 1.0,
      emotion: 'friendly'
    }]);
  };

  const getMarketSentiment = async (tokenMint?: PublicKey): Promise<any> => {
    if (!connected) throw new Error('Wallet not connected');
    
    setLoading(true);
    try {
      const token = tokenMint?.toBase58() || 'SOL';
      console.log(`Getting market sentiment for ${token}`);
      
      // Mock sentiment analysis
      const sentiment = {
        overall: Math.random() > 0.5 ? 'bullish' : 'neutral',
        confidence: 0.7 + Math.random() * 0.2,
        socialSentiment: Math.random() * 100,
        technicalScore: Math.random() * 100,
        communityEngagement: Math.random() * 100,
        riskScore: Math.random() * 100,
        recommendation: Math.random() > 0.5 ? 'buy' : 'hold'
      };

      // Add sentiment to chat history
      const sentimentMessage = {
        id: Date.now(),
        type: 'ai',
        message: `Market sentiment for ${token}: ${sentiment.overall} with ${(sentiment.confidence * 100).toFixed(1)}% confidence. Social sentiment: ${sentiment.socialSentiment.toFixed(1)}%, Technical score: ${sentiment.technicalScore.toFixed(1)}%, Risk score: ${sentiment.riskScore.toFixed(1)}%. Recommendation: ${sentiment.recommendation.toUpperCase()}.`,
        timestamp: new Date(),
        confidence: sentiment.confidence,
        emotion: sentiment.overall,
        sentimentData: sentiment
      };
      setChatHistory(prev => [...prev, sentimentMessage]);

      return sentiment;
    } catch (error) {
      console.error('Get market sentiment failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Voice-related functions
  const toggleVoice = (): void => {
    setVoiceEnabled(!voiceEnabled);
    setPreferences(prev => ({ ...prev, voiceEnabled: !voiceEnabled }));
  };

  const playVoiceResponse = (audioUrl: string): void => {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Error playing voice response:', error);
    });
  };

  const stopVoiceResponse = (): void => {
    setCurrentVoiceResponse(null);
  };

  return {
    // State
    loading,
    chatHistory,
    preferences,
    learningData,
    voiceEnabled,
    currentVoiceResponse,
    
    // Actions
    queryAI,
    executeTradeAction,
    updatePreferences,
    provideFeedback,
    clearChatHistory,
    getMarketSentiment,
    toggleVoice,
    playVoiceResponse,
    stopVoiceResponse,
    
    // Computed
    isConnected: connected,
    walletAddress: publicKey?.toBase58()
  };
};
