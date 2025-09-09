import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  FireIcon,
  StarIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const CopyTrading = () => {
  const users = useMockData('mock-users.json');
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyAmount, setCopyAmount] = useState(100);
  const [copySettings, setCopySettings] = useState({
    autoCopy: false,
    stopLoss: 10,
    takeProfit: 20,
    maxSlippage: 5
  });

  const [topTraders, setTopTraders] = useState([]);

  useEffect(() => {
    // Generate mock top traders data
    const traders = users.slice(0, 12).map((user, index) => ({
      ...user,
      totalPnL: Math.random() > 0.5 ? Math.random() * 50000 + 10000 : -(Math.random() * 30000 + 5000),
      winRate: Math.random() * 40 + 60,
      totalTrades: Math.floor(Math.random() * 1000) + 100,
      followers: Math.floor(Math.random() * 5000) + 100,
      avgReturn: Math.random() * 100 + 20,
      riskScore: Math.random() * 100,
      isVerified: Math.random() > 0.3,
      isFollowing: Math.random() > 0.7,
      lastTrade: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      specialties: ['Memecoins', 'DeFi', 'NFTs'].slice(0, Math.floor(Math.random() * 3) + 1)
    }));
    
    // Sort by total PnL
    traders.sort((a, b) => b.totalPnL - a.totalPnL);
    setTopTraders(traders);
  }, [users]);

  const handleCopyTrader = (trader) => {
    setSelectedTrader(trader);
    setShowCopyModal(true);
  };

  const confirmCopy = () => {
    // Mock copy trading setup
    alert(`Successfully started copying ${selectedTrader.username} with $${copyAmount}`);
    setShowCopyModal(false);
    setSelectedTrader(null);
  };

  const getPnLColor = (pnl) => {
    return pnl >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getRiskColor = (risk) => {
    if (risk < 30) return 'text-green-400';
    if (risk < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
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
            <span className="gradient-text">Copy Trading</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Follow and automatically copy the trades of successful traders
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Active Copiers', value: '2,847', icon: UserGroupIcon, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Copied', value: '$1.2M', icon: CurrencyDollarIcon, color: 'from-green-500 to-emerald-500' },
            { label: 'Avg. Return', value: '+23.4%', icon: ArrowTrendingUpIcon, color: 'from-purple-500 to-pink-500' },
            { label: 'Top Trader', value: '+156%', icon: FireIcon, color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="glass-card p-6 text-center group"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Top Traders Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {topTraders.map((trader, index) => (
            <motion.div
              key={trader.username}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-all duration-300"
            >
              {/* Trader Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={trader.pic} 
                      alt={trader.username}
                      className="w-12 h-12 rounded-full border-2 border-purple-500/30"
                      onError={(e) => {
                        e.target.src = '/assets/images/placeholder-meme.svg';
                      }}
                    />
                    {trader.isVerified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <ShieldCheckIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{trader.username}</h3>
                      {trader.isFollowing && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                          Following
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">Rank #{index + 1}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getPnLColor(trader.totalPnL)}`}>
                    ${formatNumber(Math.abs(trader.totalPnL))}
                  </div>
                  <div className="text-sm text-gray-400">
                    {trader.totalPnL >= 0 ? '+' : '-'}${formatNumber(Math.abs(trader.totalPnL))}
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Win Rate:</span>
                  <span className="text-white font-medium">{trader.winRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Trades:</span>
                  <span className="text-white font-medium">{formatNumber(trader.totalTrades)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Return:</span>
                  <span className="text-white font-medium">{trader.avgReturn.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Score:</span>
                  <span className={`font-medium ${getRiskColor(trader.riskScore)}`}>
                    {trader.riskScore.toFixed(0)}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Followers:</span>
                  <span className="text-white font-medium">{formatNumber(trader.followers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Trade:</span>
                  <span className="text-white font-medium">{formatDate(trader.lastTrade)}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Specialties:</div>
                <div className="flex flex-wrap gap-2">
                  {trader.specialties.map((specialty, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyTrader(trader)}
                  className="flex-1 btn-primary py-2 text-sm"
                >
                  <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                  Copy Trader
                </button>
                <button className="px-3 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors">
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Copy Trading Modal */}
        <AnimatePresence>
          {showCopyModal && selectedTrader && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowCopyModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="modal-content p-8 max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <DocumentDuplicateIcon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Copy {selectedTrader.username}</h2>
                  <p className="text-gray-300">
                    Automatically copy all trades from this trader
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Copy Amount (USD)</label>
                    <input
                      type="number"
                      value={copyAmount}
                      onChange={(e) => setCopyAmount(parseFloat(e.target.value))}
                      className="input-modern w-full"
                      placeholder="100"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Auto-copy new trades</span>
                    <button
                      onClick={() => setCopySettings(prev => ({ ...prev, autoCopy: !prev.autoCopy }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        copySettings.autoCopy ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        copySettings.autoCopy ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Stop Loss (%)</label>
                      <input
                        type="number"
                        value={copySettings.stopLoss}
                        onChange={(e) => setCopySettings(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) }))}
                        className="input-modern w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Take Profit (%)</label>
                      <input
                        type="number"
                        value={copySettings.takeProfit}
                        onChange={(e) => setCopySettings(prev => ({ ...prev, takeProfit: parseFloat(e.target.value) }))}
                        className="input-modern w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCopyModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCopy}
                    className="flex-1 btn-primary px-6 py-3"
                  >
                    Start Copying
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

export default CopyTrading;
