import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FireIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  StarIcon,
  BoltIcon,
  ShieldCheckIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const PerpsHome = () => {
  const tokens = useMockData('mock-tokens.json');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('volume');
  const [showProposalModal, setShowProposalModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Markets', count: 25 },
    { id: 'hot', name: '🔥 Hot', count: 8 },
    { id: 'new', name: '🆕 New', count: 5 },
    { id: 'high-leverage', name: '⚡ High Leverage', count: 12 }
  ];

  const perpetualMarkets = tokens.slice(0, 25).map((token, index) => ({
    ...token,
    price: Math.random() * 0.1 + 0.001,
    priceChange: Math.random() > 0.5 ? Math.random() * 100 : -Math.random() * 50,
    volume24h: Math.random() * 5000000 + 100000,
    openInterest: Math.random() * 1000000 + 50000,
    maxLeverage: Math.floor(Math.random() * 50) + 10,
    fundingRate: (Math.random() - 0.5) * 0.02,
    longShortRatio: Math.random() * 2 + 0.5,
    isHot: index < 8,
    isNew: index < 5,
    category: ['meme', 'gaming', 'defi'][Math.floor(Math.random() * 3)]
  }));

  const stats = {
    totalVolume: 125000000,
    totalOpenInterest: 45000000,
    activeTraders: 15420,
    totalMarkets: perpetualMarkets.length
  };

  const topTraders = [
    { username: 'DegenPuppy', pnl: 15420, volume: 1250000, winRate: 78 },
    { username: 'MemeMaster', pnl: 12350, volume: 980000, winRate: 82 },
    { username: 'WifWhale', pnl: 9870, volume: 750000, winRate: 71 },
    { username: 'HatCollector', pnl: 8540, volume: 620000, winRate: 69 }
  ];

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
            <span className="gradient-text">WIF Perps</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trade perpetual futures with up to 100x leverage on the hottest memecoins. 
            Zero fees, instant execution, and advanced risk management.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: '24h Volume', value: `$${(stats.totalVolume / 1000000).toFixed(1)}M`, icon: ArrowTrendingUpIcon, color: 'from-green-500 to-emerald-500' },
            { label: 'Open Interest', value: `$${(stats.totalOpenInterest / 1000000).toFixed(1)}M`, icon: ChartBarIcon, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active Traders', value: stats.activeTraders.toLocaleString(), icon: UserGroupIcon, color: 'from-purple-500 to-pink-500' },
            { label: 'Total Markets', value: stats.totalMarkets, icon: StarIcon, color: 'from-orange-500 to-red-500' }
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

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
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

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-modern px-4 py-2"
              >
                <option value="volume">📊 Volume</option>
                <option value="change">📈 Change</option>
                <option value="leverage">⚡ Leverage</option>
                <option value="funding">💰 Funding</option>
              </select>

              <button
                onClick={() => setShowProposalModal(true)}
                className="btn-primary px-6 py-2 flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Propose Market
              </button>
            </div>
          </div>
        </motion.div>

        {/* Markets Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perpetualMarkets.map((market, index) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="glass-card glass-card-hover p-6 cursor-pointer relative"
              >
                {market.isHot && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    🔥 HOT
                  </div>
                )}
                {market.isNew && (
                  <div className="absolute -top-2 -left-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    🆕 NEW
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{market.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{market.name}</h3>
                      <p className="text-sm text-gray-400">Perpetual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${market.priceChange > 0 ? 'price-up' : 'price-down'}`}>
                      {market.priceChange > 0 ? '+' : ''}{market.priceChange.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">${market.price.toFixed(6)}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">24h Volume:</span>
                    <span className="text-white">${(market.volume24h / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Open Interest:</span>
                    <span className="text-white">${(market.openInterest / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Max Leverage:</span>
                    <span className="text-white">{market.maxLeverage}x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Funding Rate:</span>
                    <span className={`${market.fundingRate > 0 ? 'price-up' : 'price-down'}`}>
                      {(market.fundingRate * 100).toFixed(4)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Long/Short:</span>
                    <span className="text-white">{market.longShortRatio.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 btn-primary py-2 text-sm">
                    Trade Now
                  </button>
                  <button className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Traders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            🏆 Top <span className="gradient-text">Traders</span> This Week
          </h2>
          <div className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topTraders.map((trader, index) => (
                <motion.div
                  key={trader.username}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{trader.username.charAt(0)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">@{trader.username}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">PNL:</span>
                      <span className="price-up">+${trader.pnl.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volume:</span>
                      <span className="text-white">${(trader.volume / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate:</span>
                      <span className="text-white">{trader.winRate}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            Why Choose <span className="gradient-text">WIF Perps</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BoltIcon,
                title: "High Leverage",
                description: "Trade with up to 100x leverage on qualified tokens"
              },
              {
                icon: ShieldCheckIcon,
                title: "Risk Management",
                description: "Advanced liquidation protection and position sizing"
              },
              {
                icon: ArrowTrendingUpIcon,
                title: "Zero Fees",
                description: "No trading fees, only network gas costs"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card glass-card-hover p-6 text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Market Proposal Modal */}
        <AnimatePresence>
          {showProposalModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="glass-card p-8 max-w-md mx-4"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Propose New Market</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Token Name</label>
                    <input
                      type="text"
                      placeholder="e.g., CatWifHat"
                      className="input-modern w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Leverage</label>
                    <select className="input-modern w-full">
                      <option value="10">10x</option>
                      <option value="25">25x</option>
                      <option value="50">50x</option>
                      <option value="100">100x</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Initial Liquidity (SOL)</label>
                    <input
                      type="number"
                      placeholder="10"
                      className="input-modern w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowProposalModal(false)}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 btn-primary py-2">
                    Submit Proposal
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

export default PerpsHome;
