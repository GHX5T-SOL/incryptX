import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FireIcon, 
  RocketLaunchIcon, 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
  ChartBarIcon,
  ClockIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const LaunchpadHome = () => {
  const tokens = useMockData('mock-tokens.json');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  const categories = [
    { id: 'all', name: 'All', count: tokens.length },
    { id: 'trending', name: '🔥 Trending', count: 12 },
    { id: 'new', name: '🆕 New', count: 8 },
    { id: 'gaming', name: '🎮 Gaming', count: 15 },
    { id: 'meme', name: '🐕 Meme', count: 25 },
    { id: 'defi', name: '🏦 DeFi', count: 10 }
  ];

  const trendingTokens = tokens.slice(0, 8).map((token, index) => ({
    ...token,
    priceChange: Math.random() > 0.5 ? Math.random() * 100 : -Math.random() * 50,
    volume24h: Math.random() * 1000000,
    holders: Math.floor(Math.random() * 5000) + 100,
    isTrending: index < 3,
    category: ['meme', 'gaming', 'defi'][Math.floor(Math.random() * 3)]
  }));

  const stats = {
    totalLaunches: tokens.length,
    totalVolume: 12500000,
    activeUsers: 25420,
    successRate: 87.5
  };

  const recentLaunches = tokens.slice(0, 6);

  return (
    <div className="min-h-screen pt-20 px-4">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Launchpad</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            The ultimate memecoin launchpad. Launch, discover, and trade the next big thing in crypto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pad/launch/degen">
              <button className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                <FireIcon className="w-6 h-6" />
                Launch Degen Token
              </button>
            </Link>
            <Link to="/pad/launch/custom">
              <button className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                <RocketLaunchIcon className="w-6 h-6" />
                Custom Launch
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: 'Total Launches', value: stats.totalLaunches.toLocaleString(), icon: RocketLaunchIcon, color: 'from-purple-500 to-pink-500' },
            { label: '24h Volume', value: `$${(stats.totalVolume / 1000000).toFixed(1)}M`, icon: ArrowTrendingUpIcon, color: 'from-green-500 to-emerald-500' },
            { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: UserGroupIcon, color: 'from-blue-500 to-cyan-500' },
            { label: 'Success Rate', value: `${stats.successRate}%`, icon: StarIcon, color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="glass-card glass-card-hover p-6 text-center"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="glass-card p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tokens, creators, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-modern w-full pl-12"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-modern px-4 py-2"
            >
              <option value="trending">🔥 Trending</option>
              <option value="newest">🆕 Newest</option>
              <option value="volume">📊 Volume</option>
              <option value="holders">👥 Holders</option>
            </select>
          </div>
        </div>
      </section>

      {/* Trending Tokens */}
      <section className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
            <FireIcon className="w-8 h-8 text-orange-500" />
            Trending Launches
          </h2>
          <p className="text-gray-400">Discover the hottest tokens gaining momentum</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingTokens.map((token, index) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="token-card group cursor-pointer relative"
            >
              {token.isTrending && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  🔥 HOT
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{token.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{token.name}</h3>
                    <p className="text-sm text-gray-400">#{token.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${token.priceChange > 0 ? 'price-up' : 'price-down'}`}>
                    {token.priceChange > 0 ? '+' : ''}{token.priceChange.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">${(token.mc / 1000).toFixed(0)}K</div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">24h Volume:</span>
                  <span className="text-white">${(token.volume24h / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Holders:</span>
                  <span className="text-white">{token.holders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Supply:</span>
                  <span className="text-white">{(token.supply / 1000000).toFixed(0)}M</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/pad/token/${token.id}`} className="flex-1">
                  <button className="w-full btn-primary py-2 text-sm">
                    View Details
                  </button>
                </Link>
                <button className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <HeartIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Launches */}
      <section className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
            <ClockIcon className="w-8 h-8 text-blue-500" />
            Recent Launches
          </h2>
          <p className="text-gray-400">Latest tokens launched on IncryptX</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentLaunches.map((token, index) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card glass-card-hover p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-bold">{token.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{token.name}</h3>
                    <p className="text-sm text-gray-400">Launched 2h ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Market Cap</div>
                  <div className="font-semibold text-white">${(token.mc / 1000).toFixed(0)}K</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Initial MC:</span>
                  <span className="text-white">$1K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current MC:</span>
                  <span className="text-white">${(token.mc / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Holders:</span>
                  <span className="text-white">{token.holders}</span>
                </div>
              </div>

              <Link to={`/pad/token/${token.id}`}>
                <button className="w-full btn-secondary py-2 text-sm">
                  View Token
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Launch Your <span className="gradient-text">Memecoin</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who have already launched successful tokens. 
            Choose your launch style and start building your community today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pad/launch/degen">
              <button className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                <FireIcon className="w-6 h-6" />
                Launch Degen Token
              </button>
            </Link>
            <Link to="/pad/launch/custom">
              <button className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                <RocketLaunchIcon className="w-6 h-6" />
                Custom Launch
              </button>
            </Link>
            <Link to="/pad/my-launches">
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6" />
                My Launches
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LaunchpadHome;
