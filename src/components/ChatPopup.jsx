import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, XMarkIcon, MicrophoneIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import ZyraAvatar from './ZyraAvatar';

const ChatPopup = ({ isOpen, onClose, onSendMessage, messages = [], onVoiceRecord, isRecording = false }) => {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showGreeting, setShowGreeting] = useState(false);
  const [sentiment, setSentiment] = useState('idle');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const avatarRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Simple sentiment analysis for avatar emotions
  const analyzeSentiment = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('won') || lowerText.includes('win') || lowerText.includes('success') || lowerText.includes('great') || lowerText.includes('awesome') || lowerText.includes('celebration')) {
      return 'happy';
    } else if (lowerText.includes('loss') || lowerText.includes('sad') || lowerText.includes('disappointed')) {
      return 'sad';
    } else if (lowerText.includes('excited') || lowerText.includes('thrilled') || lowerText.includes('amazing')) {
      return 'excited';
    } else if (lowerText.includes('fun') || lowerText.includes('dance') || lowerText.includes('party')) {
      return 'fun';
    }
    return 'idle';
  };

  // Show greeting animation when popup opens
  useEffect(() => {
    if (isOpen) {
      setShowGreeting(true);
      // Play greeting animation
      if (avatarRef.current) {
        avatarRef.current.playAnimation('Wave');
      }
      const timer = setTimeout(() => setShowGreeting(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle sentiment-based animations
  useEffect(() => {
    if (sentiment && avatarRef.current) {
      if (sentiment === 'happy') {
        avatarRef.current.playAnimation('Victory_Dance');
        setTimeout(() => {
          if (avatarRef.current) {
            avatarRef.current.playAnimation('Idle_Loop');
          }
        }, 2000);
      } else if (sentiment === 'sad') {
        avatarRef.current.playAnimation('Sad_Pose');
        setTimeout(() => {
          if (avatarRef.current) {
            avatarRef.current.playAnimation('Idle_Loop');
          }
        }, 2000);
      } else if (sentiment === 'idle') {
        avatarRef.current.playAnimation('Idle_Loop');
      }
    }
  }, [sentiment]);

  const handleSend = () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    
    // Analyze sentiment and trigger animation
    const detectedSentiment = analyzeSentiment(input.trim());
    setSentiment(detectedSentiment);
    
    const message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: input.trim(),
      files: attachedFiles,
      timestamp: new Date()
    };
    
    onSendMessage(message);
    setInput('');
    setAttachedFiles([]);
    
    // Return to idle after a delay
    setTimeout(() => {
      setSentiment('idle');
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files.map(f => ({ 
        name: f.name, 
        size: f.size,
        type: f.type 
      }))]);
    }
    e.target.value = '';
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl h-[600px] bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Z</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Zyra</h3>
                  <p className="text-gray-400 text-sm">Your AI companion for Solana degen adventures</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <XMarkIcon className="w-5 h-5 text-white/80" />
              </button>
            </div>

            <div className="flex h-[calc(100%-80px)]">
              {/* Avatar Section - Left Side */}
              <div className="w-1/2 p-4 border-r border-white/10">
                <div className="h-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-white/10">
                  <ZyraAvatar 
                    ref={avatarRef}
                    onGreeting={showGreeting}
                    emotion={sentiment}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Chat Section - Right Side */}
              <div className="w-1/2 flex flex-col">
                {/* Messages Area */}
                <div 
                  ref={messagesEndRef}
                  className="flex-1 p-4 overflow-y-auto space-y-3"
                  style={{ maxHeight: '400px' }}
                >
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <p className="text-sm">Start a conversation with Zyra!</p>
                      <p className="text-xs mt-1">Ask about Solana, DeFi, or trading strategies</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        {message.files && message.files.length > 0 && (
                          <div className="mt-2 text-xs opacity-80">
                            {message.files.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <PaperClipIcon className="w-3 h-3" />
                                {file.name} ({Math.round(file.size / 1024)} KB)
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-xs opacity-60 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Attached Files */}
                {attachedFiles.length > 0 && (
                  <div className="px-4 py-2 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {attachedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-white"
                        >
                          <PaperClipIcon className="w-3 h-3" />
                          <span>{file.name}</span>
                          <button
                            onClick={() => removeFile(index)}
                            className="hover:text-red-400 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      aria-label="Attach files"
                    >
                      <PaperClipIcon className="w-5 h-5 text-white/80" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={onPickFiles}
                    />

                    <button
                      onClick={onVoiceRecord}
                      className={`p-2 rounded-lg transition-colors ${
                        isRecording 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'hover:bg-white/10 text-white/80'
                      }`}
                      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    >
                      <MicrophoneIcon className="w-5 h-5" />
                    </button>

                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />

                    <button
                      onClick={handleSend}
                      disabled={!input.trim() && attachedFiles.length === 0}
                      className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                      aria-label="Send message"
                    >
                      <PaperAirplaneIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPopup;
