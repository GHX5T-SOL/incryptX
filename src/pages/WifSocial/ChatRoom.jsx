import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  PaperAirplaneIcon,
  UserGroupIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const ChatRoom = () => {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const mockChat = {
      id: parseInt(id),
      name: id === "1" ? "WIF Warriors" : "Meme Hunters",
      type: "group",
      avatar: "/assets/images/placeholder-meme.svg",
      members: 1547
    };

    setChat(mockChat);

    const mockMessages = [
      {
        id: 1,
        user: "CryptoWhale",
        text: "Just bought more WIF! ��",
        timestamp: new Date(),
        isOwn: false
      },
      {
        id: 2,
        user: "You",
        text: "Great choice!",
        timestamp: new Date(),
        isOwn: true
      }
    ];

    setMessages(mockMessages);
  }, [id]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      user: "You",
      text: newMessage,
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  if (!chat) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mx-4 mb-4 p-4"
      >
        <div className="flex items-center gap-4">
          <Link to="/social/chats">
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-white" />
            </button>
          </Link>
          
          <img 
            src={chat.avatar} 
            alt={chat.name}
            className="w-12 h-12 rounded-full"
          />
          
          <div>
            <h1 className="text-xl font-bold text-white">{chat.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <UserGroupIcon className="w-4 h-4" />
              <span>{chat.members} members</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 mx-4 mb-4 glass-card overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.isOwn ? "items-end" : "items-start"} flex flex-col`}>
                {!message.isOwn && (
                  <div className="text-sm font-medium text-white mb-1">
                    {message.user}
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl ${
                  message.isOwn 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                    : "bg-white/10 text-white"
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
