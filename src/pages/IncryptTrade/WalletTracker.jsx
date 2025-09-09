import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  BellIcon,
  EyeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  UserIcon,
  FireIcon,
  StarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const WalletTracker = () => {
  const trades = useMockData('mock-trades.json');
  const [search, setSearch] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    email: '',
    priceChange: 10,
    volumeSpike: 100,
    whaleMovement: 10000
  });

  const [trackedWallets, setTrackedWallets] = useState([]);
  const [walletActivity, setWalletActivity] = useState([]);

  useEffect(() => {
    // Generate mock tracked wallets
    const wallets = [
      {
        address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        label: 'Whale Wallet #1',
        balance: 125000,
        lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        riskLevel: 'high',
        tags: ['Whale', 'Active Trader'],
        isTracked: true
      },
      {
        address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        label: 'Smart Money',
        balance: 89000,
        lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        riskLevel: 'medium',
        tags: ['Smart Money', 'DeFi'],
        isTracked: true
      },
      {
        address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        label: 'Meme Trader',
        balance: 45000,
        lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        riskLevel: 'low',
        tags: ['Meme Trader', 'Community'],
        isTracked: false
      }
    ];
    setTrackedWallets(wallets);

    // Generate mock wallet activity
    const activity = [
      {
        id: 1,
        wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        type: 'buy',
        token: 'CatWifHat',
        amount: 50000,
        price: 0.023,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        impact: 'high'
      },
      {
        id: 2,
        wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        type: 'sell',
        token: 'DogWifLaser',
        amount: 25000,
        price: 0.018,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        impact: 'medium'
      },
      {
        id: 3,
        wallet: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        type: 'buy',
        token: 'WIF',
        amount: 10000,
        price: 0.45,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        impact: 'low'
      }
    ];
    setWalletActivity(activity);
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      // Mock search result
      const mockWallet = {
        address: search,
        label: 'Searched Wallet',
        balance: Math.random() * 100000,
        lastActivity: new Date(),
        riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        tags: ['Searched'],
        isTracked: false
      };
      setSelectedWallet(mockWallet);
    }
  };

  const handleTrackWallet = (wallet) => {
    setTrackedWallets(prev => 
      prev.map(w => 
        w.address === wallet.address 
          ? { ...w, isTracked: !w.isTracked }
          : w
      )
    );
  };

  const handleSetAlert = () => {
    setShowAlertModal(true);
  };

  const confirmAlert = () => {
    alert(`Alert set for wallet ${selectedWallet?.address || 'tracked wallets'}`);
    setShowAlertModal(false);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
            <span className="gradient-text">Wallet Tracker</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor whale movements, track smart money, and set alerts for significant wallet activity
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Wallet Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter Solana wallet address..."
                  className="input-modern w-full pr-12"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSetAlert}
                className="btn-primary px-8 py-3 flex items-center gap-2"
              >
                <BellIcon className="w-5 h-5" />
                Set Alert
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracked Wallets */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Tracked Wallets</h2>
              <div className="space-y-4">
                {trackedWallets.map((wallet, index) => (
                  <motion.div
                    key={wallet.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{wallet.label}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(wallet.riskLevel)}`}>
                            {wallet.riskLevel}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 font-mono">{formatAddress(wallet.address)}</div>
                        <div className="flex gap-2 mt-2">
                          {wallet.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-medium">${formatNumber(wallet.balance)}</div>
                      <div className="text-sm text-gray-400">{formatDate(wallet.lastActivity)}</div>
                      <button
                        onClick={() => handleTrackWallet(wallet)}
                        className={`mt-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                          wallet.isTracked
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {wallet.isTracked ? 'Untrack' : 'Track'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Wallet Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {walletActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'buy' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {activity.type === 'buy' ? (
                        <ArrowTrendingUpIcon className="w-5 h-5" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{activity.token}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(activity.impact)} bg-white/10`}>
                          {activity.impact} Impact
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {activity.type.toUpperCase()} ${formatNumber(activity.amount)} at ${activity.price}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Wallet: {formatAddress(activity.wallet)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{formatDate(activity.timestamp)}</div>
                      <div className="text-white font-medium">${formatNumber(activity.amount * activity.price)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Wallet Info */}
            {selectedWallet && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Wallet Details</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-400">Address</div>
                    <div className="text-white font-mono text-sm break-all">{selectedWallet.address}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Balance</div>
                    <div className="text-white font-medium">${formatNumber(selectedWallet.balance)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Risk Level</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedWallet.riskLevel)}`}>
                      {selectedWallet.riskLevel}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Last Activity</div>
                    <div className="text-white font-medium">{formatDate(selectedWallet.lastActivity)}</div>
                  </div>
                  <button
                    onClick={() => handleTrackWallet(selectedWallet)}
                    className={`w-full px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedWallet.isTracked
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {selectedWallet.isTracked ? 'Untrack Wallet' : 'Track Wallet'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Tracking Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Wallets Tracked:</span>
                  <span className="text-white font-medium">{trackedWallets.filter(w => w.isTracked).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="text-white font-medium">${formatNumber(trackedWallets.reduce((sum, w) => sum + w.balance, 0))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">High Risk:</span>
                  <span className="text-red-400 font-medium">{trackedWallets.filter(w => w.riskLevel === 'high').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Alerts Active:</span>
                  <span className="text-white font-medium">3</span>
                </div>
              </div>
            </motion.div>

            {/* Alert Types */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Alert Types</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <FireIcon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Large transactions (&gt;$10K)</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChartBarIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Price impact movements</span>
                </div>
                <div className="flex items-start gap-2">
                  <StarIcon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Whale wallet activity</span>
                </div>
                <div className="flex items-start gap-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Unusual trading patterns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Alert Modal */}
        <AnimatePresence>
          {showAlertModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowAlertModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="modal-content p-8 max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                    <BellIcon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Set Wallet Alert</h2>
                  <p className="text-gray-300">
                    Get notified about significant wallet activity
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={alertSettings.email}
                      onChange={(e) => setAlertSettings(prev => ({ ...prev, email: e.target.value }))}
                      className="input-modern w-full"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price Change Alert (%)</label>
                    <input
                      type="number"
                      value={alertSettings.priceChange}
                      onChange={(e) => setAlertSettings(prev => ({ ...prev, priceChange: parseFloat(e.target.value) }))}
                      className="input-modern w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Volume Spike Alert (%)</label>
                    <input
                      type="number"
                      value={alertSettings.volumeSpike}
                      onChange={(e) => setAlertSettings(prev => ({ ...prev, volumeSpike: parseFloat(e.target.value) }))}
                      className="input-modern w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Whale Movement ($)</label>
                    <input
                      type="number"
                      value={alertSettings.whaleMovement}
                      onChange={(e) => setAlertSettings(prev => ({ ...prev, whaleMovement: parseFloat(e.target.value) }))}
                      className="input-modern w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAlert}
                    className="flex-1 btn-primary px-6 py-3"
                  >
                    Set Alert
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

export default WalletTracker;
