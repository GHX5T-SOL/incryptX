import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FireIcon,
  StarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  EyeIcon,
  CogIcon,
  TrashIcon,
  PencilIcon,
  ShareIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const MyLaunches = () => {
  const tokens = useMockData('mock-tokens.json');
  const [myTokens, setMyTokens] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState(null);

  useEffect(() => {
    // Generate user's launched tokens
    const userTokens = tokens.slice(0, 8).map((token, index) => ({
      ...token,
      logo: token.name === 'CatWifHat' ? '/assets/images/catwifhat.svg' : 
            token.name === 'DogWifLaser' ? '/assets/images/dogwiflaser.svg' : 
            '/assets/images/placeholder-meme.svg',
      price: Math.random() * 0.1 + 0.001,
      priceChange: Math.random() > 0.5 ? Math.random() * 100 : -Math.random() * 50,
      volume24h: Math.random() * 1000000,
      marketCap: token.mc,
      launchDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      holders: Math.floor(Math.random() * 10000) + 100,
      isVerified: Math.random() > 0.3,
      status: ['active', 'paused', 'completed', 'failed'][Math.floor(Math.random() * 4)],
      totalRaised: Math.random() * 1000 + 100,
      liquidity: Math.random() * 500000 + 50000,
      socialScore: Math.floor(Math.random() * 100) + 50,
      communitySize: Math.floor(Math.random() * 50000) + 1000
    }));
    setMyTokens(userTokens);
  }, [tokens]);

  const handleDeleteToken = (token) => {
    setTokenToDelete(token);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (tokenToDelete) {
      setMyTokens(prev => prev.filter(t => t.id !== tokenToDelete.id));
      setShowDeleteModal(false);
      setTokenToDelete(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'paused': return 'text-yellow-400 bg-yellow-400/20';
      case 'completed': return 'text-blue-400 bg-blue-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return TrendingUpIcon;
      case 'paused': return ClockIcon;
      case 'completed': return StarIcon;
      case 'failed': return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const filteredTokens = myTokens.filter(token => {
    if (activeTab === 'all') return true;
    return token.status === activeTab;
  });

  const stats = {
    totalTokens: myTokens.length,
    activeTokens: myTokens.filter(t => t.status === 'active').length,
    totalValue: myTokens.reduce((sum, t) => sum + t.totalRaised, 0),
    totalHolders: myTokens.reduce((sum, t) => sum + t.holders, 0)
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
            <span className="gradient-text">My Launches</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Manage and monitor all your launched tokens in one place
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Tokens', value: stats.totalTokens, icon: FireIcon, color: 'from-orange-500 to-red-500' },
            { label: 'Active Launches', value: stats.activeTokens, icon: ArrowTrendingUpIcon, color: 'from-green-500 to-emerald-500' },
            { label: 'Total Raised', value: `$${formatNumber(stats.totalValue)}`, icon: CurrencyDollarIcon, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Holders', value: formatNumber(stats.totalHolders), icon: UserGroupIcon, color: 'from-purple-500 to-pink-500' }
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

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-card p-2 mb-8 inline-flex rounded-xl"
        >
          {[
            { id: 'all', name: 'All Tokens', count: myTokens.length },
            { id: 'active', name: 'Active', count: myTokens.filter(t => t.status === 'active').length },
            { id: 'paused', name: 'Paused', count: myTokens.filter(t => t.status === 'paused').length },
            { id: 'completed', name: 'Completed', count: myTokens.filter(t => t.status === 'completed').length }
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
              {tab.name}
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pad/launch/degen">
              <button className="btn-primary px-8 py-3 text-lg">
                <FireIcon className="w-5 h-5 mr-2" />
                Quick Launch
              </button>
            </Link>
            <Link to="/pad/launch/custom">
              <button className="btn-secondary px-8 py-3 text-lg">
                <CogIcon className="w-5 h-5 mr-2" />
                Custom Launch
              </button>
            </Link>
            <button className="px-8 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-lg">
              <ShareIcon className="w-5 h-5 mr-2" />
              Share Portfolio
            </button>
          </div>
        </motion.div>

        {/* Tokens Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTokens.map((token, index) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-all duration-300"
            >
              {/* Token Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={token.logo} 
                    alt={token.name}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      e.target.src = '/assets/images/placeholder-meme.svg';
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{token.name}</h3>
                      {token.isVerified && (
                        <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-400">#{token.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(token.status)}`}>
                    {token.status}
                  </span>
                </div>
              </div>

              {/* Token Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white font-medium">${token.price.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Change:</span>
                  <span className={`font-medium ${token.priceChange >= 0 ? 'price-up' : 'price-down'}`}>
                    {token.priceChange >= 0 ? '+' : ''}{token.priceChange.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap:</span>
                  <span className="text-white font-medium">${formatNumber(token.marketCap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Holders:</span>
                  <span className="text-white font-medium">{formatNumber(token.holders)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Launched:</span>
                  <span className="text-white font-medium">{token.launchDate.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link to={`/pad/token/${token.id}`} className="flex-1">
                  <button className="w-full btn-primary py-2 text-sm">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                  </button>
                </Link>
                <button className="px-3 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors">
                  <CogIcon className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteToken(token)}
                  className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredTokens.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FireIcon className="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No tokens found</h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'all' 
                ? "You haven't launched any tokens yet. Get started with your first launch!"
                : `No ${activeTab} tokens found.`
              }
            </p>
            <Link to="/pad/launch/degen">
              <button className="btn-primary px-8 py-3 text-lg">
                Launch Your First Token
              </button>
            </Link>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="modal-content p-8 max-w-md mx-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <ExclamationTriangleIcon className="w-20 h-20 mx-auto text-red-500 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">Delete Token?</h2>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete "{tokenToDelete?.name}"? This action cannot be undone.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete Token
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

export default MyLaunches;
