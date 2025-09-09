import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  FireIcon,
  StarIcon,
  ShareIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  EyeIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const TokenDetails = () => {
  const { id } = useParams();
  const tokens = useMockData('mock-tokens.json');
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('24h');
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const timeframes = ['1H', '4H', '24H', '7D', '30D'];

  useEffect(() => {
    const foundToken = tokens.find(t => t.id.toString() === id);
    if (foundToken) {
      setToken({
        ...foundToken,
        logo: foundToken.name === 'CatWifHat' ? '/assets/images/catwifhat.svg' : 
              foundToken.name === 'DogWifLaser' ? '/assets/images/dogwiflaser.svg' : 
              '/assets/images/placeholder-meme.svg',
        price: Math.random() * 0.1 + 0.001,
        priceChange1h: (Math.random() - 0.5) * 20,
        priceChange24h: (Math.random() - 0.5) * 100,
        priceChange7d: (Math.random() - 0.5) * 200,
        volume1h: Math.random() * 100000,
        volume24h: Math.random() * 5000000 + 100000,
        volume7d: Math.random() * 35000000 + 700000,
        marketCap: foundToken.mc,
        liquidity: Math.random() * 1000000 + 50000,
        holders: Math.floor(Math.random() * 10000) + 100,
        transactions24h: Math.floor(Math.random() * 10000) + 100,
        age: Math.floor(Math.random() * 365) + 1,
        website: `https://${foundToken.name.toLowerCase()}.com`,
        twitter: `@${foundToken.name}`,
        telegram: `t.me/${foundToken.name}`,
        description: `${foundToken.name} is a revolutionary memecoin bringing joy and innovation to the Solana ecosystem. Built for the community, by the community.`,
        risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        isVerified: Math.random() > 0.3,
        socialScore: Math.floor(Math.random() * 100) + 50,
        communitySize: Math.floor(Math.random() * 50000) + 1000
      });
    }
  }, [id, tokens]);

  if (!token) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading token...</p>
        </div>
      </div>
    );
  }

  const getPriceChange = () => {
    switch (timeframe) {
      case '1H': return token.priceChange1h;
      case '24H': return token.priceChange24h;
      case '7D': return token.priceChange7d;
      default: return token.priceChange24h;
    }
  };

  const getVolume = () => {
    switch (timeframe) {
      case '1H': return token.volume1h;
      case '24H': return token.volume24h;
      case '7D': return token.volume7d;
      default: return token.volume24h;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-500 bg-green-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/20';
      case 'High': return 'text-red-500 bg-red-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Token Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Token Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={token.logo} 
                  alt={token.name}
                  className="w-20 h-20 rounded-full"
                  onError={(e) => {
                    e.target.src = '/assets/images/placeholder-meme.svg';
                  }}
                />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">{token.name}</h1>
                    {token.isVerified && (
                      <ShieldCheckIcon className="w-8 h-8 text-blue-500" />
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(token.risk)}`}>
                      {token.risk} Risk
                    </span>
                  </div>
                  <p className="text-gray-400 text-lg">#{token.id} • Launched {token.age} days ago</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <div className="text-2xl font-bold text-white">${token.price.toFixed(6)}</div>
                  <div className="text-sm text-gray-400">Current Price</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${getPriceChange() >= 0 ? 'price-up' : 'price-down'}`}>
                    {getPriceChange() >= 0 ? '+' : ''}{getPriceChange().toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-400">{timeframe} Change</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">${formatNumber(token.marketCap)}</div>
                  <div className="text-sm text-gray-400">Market Cap</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{formatNumber(token.holders)}</div>
                  <div className="text-sm text-gray-400">Holders</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ShareIcon className="w-5 h-5" />
                  Share
                </button>
                <Link to="/trade">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-all duration-200">
                    <BoltIcon className="w-5 h-5" />
                    Trade Now
                  </button>
                </Link>
              </div>
            </div>

            {/* Social Stats */}
            <div className="lg:w-80">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Social Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Social Score:</span>
                    <span className="text-white font-medium">{token.socialScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Community Size:</span>
                    <span className="text-white font-medium">{formatNumber(token.communitySize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Volume:</span>
                    <span className="text-white font-medium">${formatNumber(token.volume24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Liquidity:</span>
                    <span className="text-white font-medium">${formatNumber(token.liquidity)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <a href={token.website} target="_blank" rel="noopener noreferrer" 
                     className="w-full btn-secondary py-2 text-center block">
                    🌐 Website
                  </a>
                  <a href={`https://twitter.com/${token.twitter}`} target="_blank" rel="noopener noreferrer"
                     className="w-full btn-secondary py-2 text-center block">
                    🐦 Twitter
                  </a>
                  <a href={`https://${token.telegram}`} target="_blank" rel="noopener noreferrer"
                     className="w-full btn-secondary py-2 text-center block">
                    💬 Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-2 mb-8 inline-flex rounded-xl"
        >
          {[
            { id: 'overview', name: 'Overview', icon: EyeIcon },
            { id: 'chart', name: 'Chart', icon: ChartBarIcon },
            { id: 'trading', name: 'Trading', icon: CurrencyDollarIcon },
            { id: 'social', name: 'Social', icon: UserGroupIcon },
            { id: 'analytics', name: 'Analytics', icon: FireIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Description */}
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4">About {token.name}</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">{token.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Token Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Supply:</span>
                        <span className="text-white">{token.supply.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Circulating Supply:</span>
                        <span className="text-white">{formatNumber(token.supply * 0.8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bonding Curve:</span>
                        <span className="text-white capitalize">{token.curve}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Launch Date:</span>
                        <span className="text-white">{new Date(Date.now() - token.age * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Market Data</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">24h High:</span>
                        <span className="text-white">${(token.price * 1.15).toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">24h Low:</span>
                        <span className="text-white">${(token.price * 0.85).toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transactions (24h):</span>
                        <span className="text-white">{formatNumber(token.transactions24h)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Transaction:</span>
                        <span className="text-white">${(token.volume24h / token.transactions24h).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Trade?</h3>
                <p className="text-gray-300 mb-6">Join thousands of traders and start building your portfolio</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/trade">
                    <button className="btn-primary px-8 py-3 text-lg">
                      Start Trading
                    </button>
                  </Link>
                  <Link to="/pad/launch/degen">
                    <button className="btn-secondary px-8 py-3 text-lg">
                      Launch Your Token
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'chart' && (
            <motion.div
              key="chart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Price Chart</h3>
                <div className="flex gap-2">
                  {timeframes.map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        timeframe === tf
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chart-container h-96 flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400 text-lg">Chart for {token.name}</p>
                  <p className="text-sm text-gray-500">TradingView integration coming soon</p>
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400">Mock Data:</p>
                    <p className="text-white">Price: ${token.price.toFixed(6)}</p>
                    <p className="text-white">Change: {getPriceChange().toFixed(2)}%</p>
                    <p className="text-white">Volume: ${formatNumber(getVolume())}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'trading' && (
            <motion.div
              key="trading"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Quick Trade</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Buy {token.name}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Amount (SOL)</label>
                      <input
                        type="number"
                        placeholder="0.0"
                        className="input-modern w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">You'll receive</label>
                      <div className="input-modern w-full bg-white/5 text-center py-3">
                        <span className="text-white font-medium">0.00 {token.name}</span>
                      </div>
                    </div>
                    <button className="w-full btn-primary py-3">
                      Buy {token.name}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Sell {token.name}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Amount ({token.name})</label>
                      <input
                        type="number"
                        placeholder="0.0"
                        className="input-modern w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">You'll receive</label>
                      <div className="input-modern w-full bg-white/5 text-center py-3">
                        <span className="text-white font-medium">0.00 SOL</span>
                      </div>
                    </div>
                    <button className="w-full btn-secondary py-3">
                      Sell {token.name}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Community Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <UserGroupIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{formatNumber(token.communitySize)}</div>
                    <div className="text-sm text-gray-400">Community Members</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <ChatBubbleLeftIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">1,247</div>
                    <div className="text-sm text-gray-400">Daily Messages</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <StarIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{token.socialScore}/100</div>
                    <div className="text-sm text-gray-400">Social Score</div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { user: 'CryptoWhale', action: 'bought', amount: '10,000', time: '2 min ago' },
                    { user: 'MemeLord', action: 'sold', amount: '5,000', time: '5 min ago' },
                    { user: 'SolanaSage', action: 'joined', amount: 'community', time: '8 min ago' },
                    { user: 'WifCollector', action: 'staked', amount: '25,000', time: '12 min ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{activity.user.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{activity.user}</div>
                          <div className="text-sm text-gray-400">{activity.action} {activity.amount}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Price Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">1 Hour:</span>
                        <span className={`font-medium ${token.priceChange1h >= 0 ? 'price-up' : 'price-down'}`}>
                          {token.priceChange1h >= 0 ? '+' : ''}{token.priceChange1h.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">24 Hours:</span>
                        <span className={`font-medium ${token.priceChange24h >= 0 ? 'price-up' : 'price-down'}`}>
                          {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">7 Days:</span>
                        <span className={`font-medium ${token.priceChange7d >= 0 ? 'price-up' : 'price-down'}`}>
                          {token.priceChange7d >= 0 ? '+' : ''}{token.priceChange7d.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Volume Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">1 Hour:</span>
                        <span className="text-white font-medium">${formatNumber(token.volume1h)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">24 Hours:</span>
                        <span className="text-white font-medium">${formatNumber(token.volume24h)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">7 Days:</span>
                        <span className="text-white font-medium">${formatNumber(token.volume7d)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Risk Assessment</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Risk Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(token.risk)}`}>
                      {token.risk}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Liquidity Score:</span>
                    <span className="text-white font-medium">8.5/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Volatility Index:</span>
                    <span className="text-white font-medium">High</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Market Sentiment:</span>
                    <span className="text-green-400 font-medium">Bullish</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowShareModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="modal-content p-8 max-w-md mx-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Share {token.name}</h3>
                <div className="space-y-4">
                  <button className="w-full btn-primary py-3">
                    Share on Twitter
                  </button>
                  <button className="w-full btn-secondary py-3">
                    Copy Link
                  </button>
                  <button className="w-full px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TokenDetails;
