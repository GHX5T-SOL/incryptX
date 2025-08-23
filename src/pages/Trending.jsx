import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FireIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  EyeIcon,
  StarIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import useMockData from '../hooks/useMockData';

const Trending = () => {
  const tokens = useMockData('mock-tokens.json');
  const [timeframe, setTimeframe] = useState('24h');
  const [sortBy, setSortBy] = useState('volume');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const timeframes = ['1h', '24h', '7d', '30d'];
  const categories = [
    { id: 'all', name: 'All Tokens', emoji: '🌟' },
    { id: 'hot', name: 'Hot', emoji: '🔥' },
    { id: 'new', name: 'New', emoji: '🆕' },
    { id: 'meme', name: 'Meme', emoji: '😂' },
    { id: 'gaming', name: 'Gaming', emoji: '🎮' },
    { id: 'defi', name: 'DeFi', emoji: '🏦' }
  ];

  const trendingTokens = tokens.map((token, index) => ({
    ...token,
    rank: index + 1,
    price: Math.random() * 0.1 + 0.001,
    priceChange1h: (Math.random() - 0.5) * 20,
    priceChange24h: (Math.random() - 0.5) * 100,
    priceChange7d: (Math.random() - 0.5) * 200,
    volume1h: Math.random() * 100000,
    volume24h: Math.random() * 5000000 + 100000,
    volume7d: Math.random() * 35000000 + 700000,
    marketCap: token.mc,
    liquidity: Math.random() * 1000000 + 50000,
    holders: Math.floor(Math.random() * 10000) + 100,
    transactions24h: Math.floor(Math.random() * 10000) + 100,
    age: Math.floor(Math.random() * 365) + 1,
    logo: token.name === 'CatWifHat' ? '/assets/images/catwifhat.svg' : 
          token.name === 'DogWifLaser' ? '/assets/images/dogwiflaser.svg' : 
          '/assets/images/placeholder-meme.svg',
    category: ['meme', 'gaming', 'defi'][Math.floor(Math.random() * 3)]
  }));

  const filteredTokens = trendingTokens
    .filter(token => 
      filterCategory === 'all' || token.category === filterCategory ||
      (filterCategory === 'hot' && token.rank <= 10) ||
      (filterCategory === 'new' && token.age <= 7)
    )
    .filter(token => 
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.id.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.volume24h - a.volume24h;
        case 'change':
          return b.priceChange24h - a.priceChange24h;
        case 'marketcap':
          return b.marketCap - a.marketCap;
        case 'holders':
          return b.holders - a.holders;
        default:
          return a.rank - b.rank;
      }
    });

  const getPriceChange = (token) => {
    switch (timeframe) {
      case '1h': return token.priceChange1h;
      case '24h': return token.priceChange24h;
      case '7d': return token.priceChange7d;
      case '30d': return token.priceChange7d * 1.5; // Mock 30d data
      default: return token.priceChange24h;
    }
  };

  const getVolume = (token) => {
    switch (timeframe) {
      case '1h': return token.volume1h;
      case '24h': return token.volume24h;
      case '7d': return token.volume7d;
      case '30d': return token.volume7d * 4; // Mock 30d data
      default: return token.volume24h;
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Trending Tokens</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the hottest memecoins on Solana with real-time data and analytics
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern w-full pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Timeframe */}
            <div className="flex items-center gap-2">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeframe === tf
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-modern px-4 py-2"
            >
              <option value="volume">📊 Volume</option>
              <option value="change">📈 Change</option>
              <option value="marketcap">💰 Market Cap</option>
              <option value="holders">👥 Holders</option>
            </select>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filterCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span>{category.emoji}</span>
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-card p-4 mb-4"
        >
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400 items-center">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Token</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">{timeframe} Change</div>
            <div className="col-span-2">Volume ({timeframe})</div>
            <div className="col-span-1">Market Cap</div>
            <div className="col-span-1">Actions</div>
          </div>
        </motion.div>

        {/* Tokens List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          {filteredTokens.slice(0, 50).map((token, index) => {
            const priceChange = getPriceChange(token);
            const volume = getVolume(token);
            
            return (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.02 }}
                viewport={{ once: true }}
                className="glass-card glass-card-hover p-4"
              >
                <div className="grid grid-cols-12 gap-4 text-sm items-center">
                  {/* Rank */}
                  <div className="col-span-1">
                    <span className="text-gray-400 font-medium">{index + 1}</span>
                  </div>

                  {/* Token Info */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={token.logo} 
                        alt={token.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.target.src = '/assets/images/placeholder-meme.svg';
                        }}
                      />
                      <div>
                        <div className="font-semibold text-white">{token.name}</div>
                        <div className="text-gray-400 text-xs">{token.category.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2">
                    <div className="text-white font-medium">${token.price.toFixed(6)}</div>
                  </div>

                  {/* Price Change */}
                  <div className="col-span-2">
                    <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'price-up' : 'price-down'}`}>
                      {priceChange >= 0 ? (
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="col-span-2">
                    <div className="text-white font-medium">
                      ${volume >= 1000000 ? `${(volume / 1000000).toFixed(1)}M` : `${(volume / 1000).toFixed(0)}K`}
                    </div>
                  </div>

                  {/* Market Cap */}
                  <div className="col-span-1">
                    <div className="text-white font-medium">
                      ${token.marketCap >= 1000000 ? `${(token.marketCap / 1000000).toFixed(1)}M` : `${(token.marketCap / 1000).toFixed(0)}K`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <Link to={`/pad/token/${token.id}`}>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <EyeIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      </Link>
                      <Link to="/trade">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <ChartBarIcon className="w-4 h-4 text-blue-400" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="btn-secondary px-8 py-3">
            Load More Tokens
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Trending;
