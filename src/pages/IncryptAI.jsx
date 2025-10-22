// src/pages/IncryptAI.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAIAssistant } from '../hooks/useAIAssistant';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const IncryptAI = () => {
  const { loading, chatHistory, preferences, queryAI, executeTradeAction, updatePreferences, provideFeedback, clearChatHistory, getMarketSentiment, isConnected } = useAIAssistant();
  const { connect, connected, publicKey } = useWallet();
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState('query');
  const [showPreferences, setShowPreferences] = useState(false);
  const [executionMode, setExecutionMode] = useState(false);
  const [selectedToken, setSelectedToken] = useState('SOL');
  const [tradeAmount, setTradeAmount] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isConnected) return;

    try {
      await queryAI(inputMessage, selectedMode);
      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExecuteTrade = async (action, tokenMint, amount, price) => {
    if (!isConnected) return;

    try {
      const mockTokenMint = new PublicKey('11111111111111111111111111111111'); // Mock token mint
      await executeTradeAction(action, mockTokenMint, parseFloat(amount), price);
    } catch (error) {
      console.error('Failed to execute trade:', error);
    }
  };

  const handleFeedback = async (messageId, feedback) => {
    try {
      await provideFeedback(messageId, feedback);
    } catch (error) {
      console.error('Failed to provide feedback:', error);
    }
  };

  const handlePreferenceUpdate = async (newPrefs) => {
    try {
      await updatePreferences(newPrefs);
      setShowPreferences(false);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'bullish': return 'text-green-500';
      case 'bearish': return 'text-red-500';
      case 'optimistic': return 'text-blue-500';
      case 'cautious': return 'text-yellow-500';
      case 'analytical': return 'text-purple-500';
      case 'friendly': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">AI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">IncryptX AI Assistant</h1>
                <p className="text-gray-300">Your intelligent trading companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!isConnected ? (
                <button
                  onClick={connect}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Connected</span>
                  <span className="text-gray-300 text-sm">
                    {publicKey?.toBase58().slice(0, 8)}...
                  </span>
                </div>
              )}
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 h-[600px] flex flex-col">
              {/* Mode Selector */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setSelectedMode('query')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedMode === 'query'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30'
                  }`}
                >
                  💬 Query
                </button>
                <button
                  onClick={() => setSelectedMode('strategy')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedMode === 'strategy'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30'
                  }`}
                >
                  📊 Strategy
                </button>
                <button
                  onClick={() => setSelectedMode('emotion')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedMode === 'emotion'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30'
                  }`}
                >
                  😊 Emotion
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatHistory.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/20 backdrop-blur-lg text-white'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.type === 'ai' && (
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">AI</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{message.message}</p>
                          {message.type === 'ai' && (
                            <div className="mt-2 flex items-center space-x-4 text-xs">
                              {message.confidence && (
                                <span className={`${getConfidenceColor(message.confidence)}`}>
                                  Confidence: {(message.confidence * 100).toFixed(0)}%
                                </span>
                              )}
                              {message.emotion && (
                                <span className={`${getEmotionColor(message.emotion)}`}>
                                  {message.emotion}
                                </span>
                              )}
                              {message.recommendedActions && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-300 mb-1">Recommended Actions:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {message.recommendedActions.map((action, idx) => (
                                      <span key={idx} className="bg-white/20 px-2 py-1 rounded text-xs">
                                        {action}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {message.type === 'user' && (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">U</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Feedback buttons for AI messages */}
                      {message.type === 'ai' && (
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleFeedback(message.id, 'positive')}
                            className="text-green-400 hover:text-green-300 text-sm"
                          >
                            👍 Good
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'negative')}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            👎 Bad
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'neutral')}
                            className="text-gray-400 hover:text-gray-300 text-sm"
                          >
                            🤷 OK
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/20 backdrop-blur-lg text-white p-4 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">AI</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isConnected ? "Ask me anything about trading, strategies, or market sentiment..." : "Connect your wallet to start chatting"}
                  disabled={!isConnected || loading}
                  className="flex-1 bg-white/20 backdrop-blur-lg text-white placeholder-gray-300 px-4 py-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !isConnected || loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
                <button
                  onClick={clearChatHistory}
                  disabled={loading}
                  className="bg-white/20 text-white px-4 py-3 rounded-lg hover:bg-white/30 transition-all disabled:opacity-50"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => getMarketSentiment()}
                  disabled={!isConnected || loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  📈 Market Sentiment
                </button>
                <button
                  onClick={() => setExecutionMode(!executionMode)}
                  disabled={!isConnected}
                  className={`w-full px-4 py-2 rounded-lg transition-all ${
                    executionMode
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {executionMode ? '🎯 Trade Mode ON' : '🎯 Enable Trade Mode'}
                </button>
                <button
                  onClick={() => queryAI('What are the best trading strategies for today?', 'strategy')}
                  disabled={!isConnected || loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  💡 Get Strategy
                </button>
              </div>
            </div>

            {/* Trade Execution Panel */}
            {executionMode && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Trade Execution</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm mb-2">Token</label>
                    <select
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      className="w-full bg-white/20 backdrop-blur-lg text-white px-3 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="SOL">SOL</option>
                      <option value="USDC">USDC</option>
                      <option value="WIF">WIF</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-2">Amount</label>
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-white/20 backdrop-blur-lg text-white placeholder-gray-300 px-3 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleExecuteTrade('buy', selectedToken, tradeAmount)}
                      disabled={!tradeAmount || !isConnected || loading}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => handleExecuteTrade('sell', selectedToken, tradeAmount)}
                      disabled={!tradeAmount || !isConnected || loading}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Panel */}
            {showPreferences && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-white text-lg font-semibold mb-4">AI Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm mb-2">Risk Tolerance</label>
                    <select
                      value={preferences.riskTolerance}
                      onChange={(e) => handlePreferenceUpdate({ riskTolerance: e.target.value })}
                      className="w-full bg-white/20 backdrop-blur-lg text-white px-3 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-2">Trading Style</label>
                    <select
                      value={preferences.tradingStyle}
                      onChange={(e) => handlePreferenceUpdate({ tradingStyle: e.target.value })}
                      className="w-full bg-white/20 backdrop-blur-lg text-white px-3 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="conservative">Conservative</option>
                      <option value="balanced">Balanced</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.emotionalMode}
                      onChange={(e) => handlePreferenceUpdate({ emotionalMode: e.target.checked })}
                      className="rounded"
                    />
                    <label className="text-white text-sm">Emotional Support Mode</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.autoExecute}
                      onChange={(e) => handlePreferenceUpdate({ autoExecute: e.target.checked })}
                      className="rounded"
                    />
                    <label className="text-white text-sm">Auto Execute Trades</label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncryptAI;
