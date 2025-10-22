import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserGroupIcon,
  ClockIcon,
  CheckIcon,
  PhotoIcon,
  MicrophoneIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSocials } from '../../hooks/useSocials';
import HolographicCard from '../../components/HolographicCard.jsx';
import HoloButton from '../../components/HoloButton.jsx';

const Chats = () => {
  const { connected } = useWallet();
  const { chats, sendMessage, createChat, loading } = useSocials();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatRecipient, setNewChatRecipient] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');

  useEffect(() => {
    setMyChats(chats);
  }, [chats]);

  const handleCreateChat = async (newChatRecipient, newChatMessage) => {
    if (!connected || !newChatRecipient.trim() || !newChatMessage.trim()) return;

    try {
      await createChat(newChatRecipient, newChatMessage);
      setShowNewChatModal(false);
      setNewChatRecipient('');
      setNewChatMessage('');
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to create chat. Check console for details.');
    }
  };

  const filteredChats = myChats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'groups' && chat.type === 'group') ||
                      (activeTab === 'direct' && chat.type === 'direct') ||
                      (activeTab === 'unread' && chat.unreadCount > 0);
    return matchesSearch && matchesTab;
  });

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const totalUnread = myChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Chats</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay connected with your communities and friends
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <HolographicCard className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chats..."
                className="input-modern pl-10 w-full"
              />
            </div>

            <HoloButton
              onClick={() => setShowNewChatModal(true)}
              className="px-6 py-3 flex items-center gap-2 disabled:opacity-50"
              disabled={!connected}
            >
              <PlusIcon className="w-5 h-5" />
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'New Chat'
              )}
            </HoloButton>
            {!connected && (
              <div className="text-yellow-400 text-sm mt-2">
                Connect your wallet to start chatting
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'all', name: 'All Chats', count: myChats.length },
              { id: 'groups', name: 'Groups', count: myChats.filter(c => c.type === 'group').length },
              { id: 'direct', name: 'Direct', count: myChats.filter(c => c.type === 'direct').length },
              { id: 'unread', name: 'Unread', count: totalUnread }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tab.name}
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          </HolographicCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <HolographicCard>
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Recent Conversations</h2>
          </div>

          {filteredChats.length === 0 ? (
            <div className="text-center py-16">
              <ChatBubbleLeftIcon className="w-24 h-24 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No chats found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? 'Try adjusting your search' : 'Start a conversation with someone!'}
              </p>
              <button className="btn-primary px-8 py-3 text-lg">
                Start Chatting
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={`/social/chat/${chat.id}`}
                    className="flex items-center gap-4 p-6 hover:bg-white/5 transition-colors group"
                  >
                    <div className="relative">
                      <img 
                        src={chat.avatar} 
                        alt={chat.name}
                        className="w-14 h-14 rounded-full"
                        onError={(e) => {
                          e.target.src = '/assets/images/placeholder-meme.svg';
                        }}
                      />
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {chat.name}
                          </h3>
                          {chat.isVerified && (
                            <CheckIcon className="w-4 h-4 text-blue-400" />
                          )}
                          {chat.type === 'group' && (
                            <UserGroupIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm text-gray-400">
                          {formatTimeAgo(chat.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {chat.messageType === 'image' && (
                            <PhotoIcon className="w-4 h-4 text-gray-400" />
                          )}
                          {chat.messageType === 'voice' && (
                            <MicrophoneIcon className="w-4 h-4 text-gray-400" />
                          )}
                          <p className="text-sm text-gray-400 truncate">
                            {chat.type === 'group' && chat.messageType === 'text' && (
                              <span className="font-medium">{chat.lastSender}: </span>
                            )}
                            {chat.lastMessage}
                          </p>
                        </div>

                        {chat.type === 'group' && chat.members && (
                          <span className="text-xs text-gray-500 ml-2">
                            {chat.members} members
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-gray-400 group-hover:text-purple-400 transition-colors">
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          </HolographicCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <HolographicCard className="p-6 text-center">
            <UserGroupIcon className="w-12 h-12 mx-auto text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Join Communities</h3>
            <p className="text-sm text-gray-400 mb-4">
              Connect with traders and enthusiasts
            </p>
            <Link to="/social/communities">
              <HoloButton className="w-full">Browse</HoloButton>
            </Link>
          </HolographicCard>

          <HolographicCard className="p-6 text-center">
            <ChatBubbleLeftIcon className="w-12 h-12 mx-auto text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Start Chat</h3>
            <p className="text-sm text-gray-400 mb-4">
              Begin a conversation with friends
            </p>
            <HoloButton className="w-full">New Chat</HoloButton>
          </HolographicCard>

          <HolographicCard className="p-6 text-center">
            <ClockIcon className="w-12 h-12 mx-auto text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Recent Activity</h3>
            <p className="text-sm text-gray-400 mb-4">
              View your chat history
            </p>
            <HoloButton className="w-full">View All</HoloButton>
          </HolographicCard>
        </motion.div>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 p-6 rounded-lg w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Start New Chat</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Recipient</label>
                  <input
                    type="text"
                    value={newChatRecipient}
                    onChange={(e) => setNewChatRecipient(e.target.value)}
                    placeholder="Enter username or wallet address"
                    className="input-modern w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Initial Message</label>
                  <textarea
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Type your first message..."
                    className="input-modern w-full resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <HoloButton
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1"
                >
                  Cancel
                </HoloButton>
                <HoloButton
                  onClick={handleCreateChat}
                  disabled={!newChatRecipient.trim() || !newChatMessage.trim() || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Start Chat'
                  )}
                </HoloButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Chats;