import React, { useEffect, useRef, useState } from 'react';
import { PaperAirplaneIcon, XMarkIcon, MicrophoneIcon, PaperClipIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ZyraAvatar from './ZyraAvatar';

const examplePrompts = [
  'Do market research on SOL ecosystem narratives',
  'Find trending tokens with growing holders in 24h',
  'Design a DeFi yield strategy using SOL + stables',
  'Draft an automated trading strategy with risk guards',
  'Use voice to place a trade on a token pair',
];

const IncryptAI = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 'sys-hello', 
      role: 'assistant', 
      text: "Hi, I'm Zyra, your AI companion for Solana degen adventures! How can I help you today?", 
      timestamp: new Date()
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [avatarEmotion, setAvatarEmotion] = useState('idle');
  const fileInputRef = useRef(null);
  const listRef = useRef(null);
  const audioRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Simple sentiment analysis for avatar emotions
  const analyzeSentiment = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('won') || lowerText.includes('win')) {
      return 'happy';
    } else if (lowerText.includes('loss')) {
      return 'sad';
    } else if (lowerText.includes('success') || lowerText.includes('great') || lowerText.includes('awesome') || lowerText.includes('celebration')) {
      return 'happy';
    } else if (lowerText.includes('sad') || lowerText.includes('disappointed')) {
      return 'sad';
    } else if (lowerText.includes('excited') || lowerText.includes('thrilled') || lowerText.includes('amazing')) {
      return 'excited';
    } else if (lowerText.includes('fun') || lowerText.includes('dance') || lowerText.includes('party')) {
      return 'fun';
    } else if (lowerText.includes('walk') || lowerText.includes('move') || lowerText.includes('travel')) {
      return 'walking';
    }
    return 'idle';
  };

  const handleSend = () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: input.trim(), files: attachedFiles };
    setMessages(prev => [...prev, userMsg]);
    
    // Analyze sentiment and set avatar emotion
    const sentiment = analyzeSentiment(input.trim());
    setAvatarEmotion(sentiment);
    
    setInput('');
    setAttachedFiles([]);
    
    // Play audio and send custom response based on sentiment
    setTimeout(() => {
      let responseText = '';
      let audioFile = '';
      
      if (sentiment === 'sad') {
        responseText = "Aww, don't worry you will make it back. Oneday you will be a better trader than Cupsey, just don't give up";
        audioFile = '/assets/Sad_message.mp3';
        // Play sad animation
        if (avatarRef.current) {
          avatarRef.current.playAnimation('sad');
        }
      } else if (sentiment === 'happy') {
        responseText = "Yay!! Well done! I am so proud of you! You are the best trencher in the world!";
        audioFile = '/assets/Happy_message.mp3';
        // Play happy animation
        if (avatarRef.current) {
          avatarRef.current.playAnimation('happy');
        }
      } else {
        // Default responses for other sentiments
        const responses = {
          excited: "Wow, that sounds thrilling! I'm excited to help you with this!",
          fun: "That sounds like so much fun! Let's make this enjoyable!",
          walking: "Great! Let's get moving on this together!",
          idle: "Got it. I will simulate this request in the demo environment and outline next steps."
        };
        responseText = responses[sentiment] || responses.idle;
      }
      
      // Play audio if available
      if (audioFile) {
        const audio = new Audio(audioFile);
        audio.play().catch(error => {
          console.warn('Could not play audio:', error);
        });
      }
      
      setMessages(prev => [...prev, { 
        id: `a-${Date.now()}`, 
        role: 'assistant', 
        text: responseText 
      }]);
      
      // Return to idle after response
      setTimeout(() => {
        setAvatarEmotion('idle');
        if (avatarRef.current) {
          avatarRef.current.playAnimation('idle');
        }
      }, 3000);
    }, 700);
  };

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, size: f.size }))]);
    }
    e.target.value = '';
  };

  const toggleRecord = () => {
    setIsRecording(v => !v);
    if (!isRecording) {
      setMessages(prev => [...prev, { id: `v-${Date.now()}`, role: 'assistant', text: 'Recording started (demo)... speak your request.' }]);
    } else {
      setMessages(prev => [...prev, { id: `v-${Date.now()}`, role: 'assistant', text: 'Recording stopped (demo). I will transcribe and respond.' }]);
    }
  };

  const handleToggle = () => {
    setOpen(prev => {
      const next = !prev;
      if (next) {
        // Play greeting animation when opening
        if (avatarRef.current) {
          avatarRef.current.playAnimation('greeting');
        }
        
        try {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0.85;
            // Attempt playback on user gesture
            audioRef.current.play().catch(() => {});
          }
        } catch (error) {
          console.warn('Audio playback failed:', error);
        }
      } else {
        try {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        } catch (error) {
          console.warn('Audio pause failed:', error);
        }
      }
      return next;
    });
  };

  const handleClose = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch (error) {
      console.warn('Audio close failed:', error);
    }
    setOpen(false);
  };

  return (
    <>
      <audio ref={audioRef} src="/assets/zyra_voice.mp3" preload="auto" />
      
      {/* Floating Container with Avatar and Button */}
      <div className="ai-floating-container">
        {/* 3D Avatar - Always visible, positioned on top of button */}
        <div className="ai-avatar-persistent" aria-hidden="true">
          <ZyraAvatar 
            ref={avatarRef}
            onGreeting={open}
            emotion={avatarEmotion}
            className="w-full h-full"
          />
        </div>
        
        {/* Floating Action Button */}
        <button
          aria-label="Open Incrypt AI"
          className="ai-fab group"
          onClick={handleToggle}
        >
          <SparklesIcon className="w-6 h-6 text-white" />
          <span className="ml-2 hidden sm:block text-white font-semibold">Incrypt AI</span>
        </button>
      </div>

      {/* Chat Panel - Opens to the left of avatar */}
      {open && (
        <div className="ai-panel-left glass-card">
          <div className="flex items-center justify-between p-3 border-b border-white/10" role="region" aria-label="Incrypt AI header">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-lg" aria-hidden="true">🧠</div>
              <div>
                <div className="text-white font-semibold">Incrypt AI</div>
                <div className="text-xs text-gray-400">Cyberpunk assistant • Demo</div>
              </div>
            </div>
            <button aria-label="Close Incrypt AI" className="p-2 hover:bg-white/10 rounded-lg" onClick={handleClose}>
              <XMarkIcon className="w-5 h-5 text-white/80" />
            </button>
          </div>

          <div className="p-3 border-b border-white/10">
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((ex, i) => (
                <button key={i} className="px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 text-white/90"
                  onClick={() => setInput(ex)}>
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div ref={listRef} className="px-3 pt-3 overflow-y-auto" style={{ maxHeight: '40vh' }}>
            {messages.map(m => (
              <div key={m.id} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-3 py-2 rounded-2xl ${m.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-white/10 text-white'}`}>
                  <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                  {m.files && m.files.length > 0 && (
                    <div className="mt-2 text-xs text-white/80">
                      {m.files.map((f, idx) => (
                        <div key={idx}>📎 {f.name} ({Math.round(f.size / 1024)} KB)</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {attachedFiles.length > 0 && (
            <div className="px-3 pb-1 text-xs text-gray-300">
              Attached: {attachedFiles.map(f => f.name).join(', ')}
            </div>
          )}

          <div className="p-3 flex items-center gap-2">
            <button aria-label="Attach files" className="p-2 rounded-lg hover:bg-white/10" onClick={() => fileInputRef.current?.click()}>
              <PaperClipIcon className="w-5 h-5 text-white/80" />
            </button>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onPickFiles} />

            <button aria-label="Record voice" className={`p-2 rounded-lg hover:bg-white/10 ${isRecording ? 'bg-red-500/20' : ''}`} onClick={toggleRecord}>
              <MicrophoneIcon className={`w-5 h-5 ${isRecording ? 'text-red-400' : 'text-white/80'}`} />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 input-modern"
            />
            <button aria-label="Send message" className="bg-[#33e1ff] hover:bg-[#33e1ff]/80 p-2 rounded-full h-10 w-10 flex items-center justify-center transition-all duration-300" onClick={handleSend}>
              <PaperAirplaneIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default IncryptAI;


