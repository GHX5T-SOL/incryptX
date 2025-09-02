import React, { useEffect, useRef, useState } from 'react';
import { PaperAirplaneIcon, XMarkIcon, MicrophoneIcon, PaperClipIcon, SparklesIcon } from '@heroicons/react/24/outline';

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
    { id: 'sys-hello', role: 'assistant', text: 'Hello, I am Zyra, your trusty AI assistant. What can I help you with today?' }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const listRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: input.trim(), files: attachedFiles };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFiles([]);
    // Mock assistant reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: 'Got it. I will simulate this request in the demo environment and outline next steps.' }]);
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
        try {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0.85;
            // Attempt playback on user gesture
            audioRef.current.play().catch(() => {});
          }
        } catch (_) {}
      } else {
        try {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        } catch (_) {}
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
    } catch (_) {}
    setOpen(false);
  };

  return (
    <>
      <audio ref={audioRef} src="/assets/zyra_voice.mp3" preload="auto" />
      {/* Floating Action Button */}
      <button
        aria-label="Open Incrypt AI"
        className="ai-fab group"
        onClick={handleToggle}
      >
        <SparklesIcon className="w-6 h-6 text-white" />
        <span className="ml-2 hidden sm:block text-white font-semibold">Incrypt AI</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="ai-panel glass-card">
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
            <button aria-label="Send message" className="btn-primary p-2 rounded-full h-10 w-10 flex items-center justify-center" onClick={handleSend}>
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Anime Companion GIF */}
      {open && (
        <div className="ai-companion" aria-hidden="true">
          <img
            src="/assets/zyra_ai.gif"
            alt="Zyra, your anime AI companion"
            className="w-full h-auto select-none"
            draggable="false"
          />
        </div>
      )}
    </>
  );
};

export default IncryptAI;


