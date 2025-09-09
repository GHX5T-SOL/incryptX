import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  LockClosedIcon,
  CheckBadgeIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import HolographicCard from '../../components/HolographicCard.jsx';
import HoloButton from '../../components/HoloButton.jsx';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: UserGroupIcon },
    { id: 'trading', name: 'Trading', icon: FireIcon },
    { id: 'memes', name: 'Memes', icon: StarIcon },
    { id: 'general', name: 'General', icon: ChatBubbleLeftIcon }
  ];

  useEffect(() => {
    const mockCommunities = [
      {
        id: 1,
        name: 'WIF Warriors',
        description: 'The official WIF trading community for diamond hands only!',
        avatar: '/assets/images/placeholder-meme.svg',
        category: 'trading',
        members: 15420,
        onlineMembers: 2341,
        isPrivate: false,
        tokenGated: true,
        requiredToken: 'WIF',
        minimumHolding: 1000,
        isVerified: true,
        isJoined: true,
        messages24h: 1247,
        growth: 12.5
      },
      {
        id: 2,
        name: 'Meme Coin Hunters',
        description: 'Discover the next 100x gem! Early calls and research.',
        avatar: '/assets/images/placeholder-meme.svg',
        category: 'memes',
        members: 23567,
        onlineMembers: 4521,
        isPrivate: false,
        tokenGated: false,
        isVerified: true,
        isJoined: false,
        messages24h: 2156,
        growth: 45.2
      },
      {
        id: 3,
        name: 'Daily Crypto Chat',
        description: 'General crypto discussion and market updates. All welcome!',
        avatar: '/assets/images/placeholder-meme.svg',
        category: 'general',
        members: 45123,
        onlineMembers: 7892,
        isPrivate: false,
        tokenGated: false,
        isVerified: true,
        isJoined: true,
        messages24h: 3421,
        growth: 23.1
      }
    ];

    setCommunities(mockCommunities);
  }, []);

  const handleJoinCommunity = (communityId) => {
    setCommunities(prev => prev.map(community => 
      community.id === communityId 
        ? { ...community, isJoined: !community.isJoined, members: community.isJoined ? community.members - 1 : community.members + 1 }
        : community
    ));
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Communities</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join vibrant communities, share knowledge, and connect with like-minded traders
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <HolographicCard className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search communities..."
                className="input-modern pl-10 w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </button>
              ))}
            </div>

            <HoloButton className="px-6 py-3 flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Create
            </HoloButton>
          </div>
          </HolographicCard>
        </motion.div>

        {/* Communities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCommunities.map((community, index) => (
            <HolographicCard
              key={community.id}
              className="p-6 hover:scale-105 transition-all duration-300"
            >
              {/* Community Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={community.avatar} 
                    alt={community.name}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      e.target.src = '/assets/images/placeholder-meme.svg';
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{community.name}</h3>
                      {community.isVerified && (
                        <CheckBadgeIcon className="w-5 h-5 text-blue-400" />
                      )}
                      {community.isPrivate && (
                        <LockClosedIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="text-sm text-gray-400 capitalize">{community.category}</div>
                  </div>
                </div>
                
                <div className={`text-xs px-2 py-1 rounded-full ${
                  community.growth >= 0 ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'
                }`}>
                  {community.growth >= 0 ? '+' : ''}{community.growth.toFixed(1)}%
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {community.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{formatNumber(community.members)}</div>
                  <div className="text-xs text-gray-400">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{formatNumber(community.messages24h)}</div>
                  <div className="text-xs text-gray-400">Messages/24h</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">
                  {formatNumber(community.onlineMembers)} online
                </span>
              </div>

              {community.tokenGated && (
                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/30 mb-4">
                  <div className="text-xs text-yellow-400">
                    <strong>Token Gated:</strong> Requires {formatNumber(community.minimumHolding)} {community.requiredToken}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <HoloButton
                  onClick={() => handleJoinCommunity(community.id)}
                  className={`flex-1 justify-center py-2 ${
                    community.isJoined ? '' : ''
                  }`}
                >
                  {community.isJoined ? 'Joined' : 'Join'}
                </HoloButton>
                <Link to={`/social/chat/${community.id}`}>
                  <HoloButton className="px-4 py-2"> 
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                  </HoloButton>
                </Link>
              </div>
            </HolographicCard>
          ))}
        </motion.div>

        {filteredCommunities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <UserGroupIcon className="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No communities found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or create a new community!
            </p>
            <button className="btn-primary px-8 py-3 text-lg">
              Create Community
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Communities;