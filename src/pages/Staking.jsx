import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  FireIcon,
  StarIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  InformationCircleIcon,
  PlusIcon,
  MinusIcon,
  BoltIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import useMockData from '../hooks/useMockData';

const Staking = () => {
  const tokens = useMockData('mock-tokens.json');
  const [activeTab, setActiveTab] = useState('stake');
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [userStakes, setUserStakes] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);

  const stakingPools = tokens.slice(0, 12).map((token, index) => ({
    ...token,
    logo: token.name === 'CatWifHat' ? '/assets/images/catwifhat.svg' : 
          token.name === 'DogWifLaser' ? '/assets/images/dogwiflaser.svg' : 
          '/assets/images/placeholder-meme.svg',
    apy: Math.random() * 200 + 10, // 10-210% APY
    tvl: Math.random() * 10000000 + 100000, // Total Value Locked
    stakingRewards: Math.random() * 1000000 + 10000,
    minStake: Math.random() * 100 + 10,
    lockPeriod: [7, 14, 30, 90][Math.floor(Math.random() * 4)],
    stakersCount: Math.floor(Math.random() * 10000) + 100,
    isHot: index < 3,
    isNew: index < 2,
    riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    autoCompound: Math.random() > 0.5,
    verified: Math.random() > 0.3
  }));

  const userStats = {
    totalStaked: 15420.50,
    totalRewards: 2340.75,
    activeStakes: 5,
    totalAPY: 125.4
  };

  const recentRewards = [
    { pool: 'CatWifHat', amount: 45.23, timestamp: '2 hours ago', apy: 150 },
    { pool: 'DogWifLaser', amount: 32.10, timestamp: '5 hours ago', apy: 120 },
    { pool: 'BunnyWifHat', amount: 18.75, timestamp: '8 hours ago', apy: 95 },
    { pool: 'PandaWifHat', amount: 67.30, timestamp: '12 hours ago', apy: 180 }
  ];

  const handleStake = () => {
    if (!selectedPool || !stakeAmount) return;
    
    const newStake = {
      id: Date.now(),
      pool: selectedPool,
      amount: parseFloat(stakeAmount),
      startDate: new Date(),
      expectedReturn: parseFloat(stakeAmount) * (selectedPool.apy / 100),
      endDate: new Date(Date.now() + selectedPool.lockPeriod * 24 * 60 * 60 * 1000)
    };
    
    setUserStakes([...userStakes, newStake]);
    setStakeAmount('');
    setSelectedPool(null);
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">WIF Staking</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stake your favorite memecoins and earn rewards with up to 200% APY. 
            Secure, transparent, and community-driven staking pools.
          </p>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: 'Total Staked', value: `$${formatNumber(userStats.totalStaked)}`, icon: CurrencyDollarIcon, color: 'from-purple-500 to-pink-500' },
            { label: 'Total Rewards', value: `$${formatNumber(userStats.totalRewards)}`, icon: TrophyIcon, color: 'from-green-500 to-emerald-500' },
            { label: 'Active Stakes', value: userStats.activeStakes, icon: ChartBarIcon, color: 'from-blue-500 to-cyan-500' },
            { label: 'Avg APY', value: `${userStats.totalAPY.toFixed(1)}%`, icon: ArrowTrendingUpIcon, color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="glass-card glass-card-hover p-6 text-center group"
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
            { id: 'stake', name: 'Stake Tokens', icon: PlusIcon },
            { id: 'pools', name: 'Staking Pools', icon: ChartBarIcon },
            { id: 'rewards', name: 'My Rewards', icon: TrophyIcon },
            { id: 'history', name: 'History', icon: ClockIcon }
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

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'stake' && (
            <motion.div
              key="stake"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Staking Form */}
              <div className="lg:col-span-1">
                <div className="glass-card p-6 sticky top-24">
                  <h3 className="text-2xl font-bold text-white mb-6">Stake Tokens</h3>
                  
                  {selectedPool ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                        <img 
                          src={selectedPool.logo} 
                          alt={selectedPool.name}
                          className="w-12 h-12 rounded-full"
                          onError={(e) => {
                            e.target.src = '/assets/images/placeholder-meme.svg';
                          }}
                        />
                        <div>
                          <div className="font-semibold text-white">{selectedPool.name}</div>
                          <div className="text-sm text-gray-400">{selectedPool.apy.toFixed(1)}% APY</div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Amount to Stake</label>
                        <input
                          type="number"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          placeholder={`Min: ${selectedPool.minStake}`}
                          className="input-modern w-full"
                        />
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lock Period:</span>
                          <span className="text-white">{selectedPool.lockPeriod} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Expected Rewards:</span>
                          <span className="price-up">
                            +{stakeAmount ? (parseFloat(stakeAmount) * selectedPool.apy / 100).toFixed(2) : '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Auto Compound:</span>
                          <span className="text-white">{selectedPool.autoCompound ? 'Yes' : 'No'}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleStake}
                          disabled={!stakeAmount || parseFloat(stakeAmount) < selectedPool.minStake}
                          className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Stake Now
                        </button>
                        <button
                          onClick={() => setSelectedPool(null)}
                          className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <StarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400">Select a staking pool to get started</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Pools */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-6">Available Staking Pools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stakingPools.map((pool, index) => (
                    <motion.div
                      key={pool.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`glass-card glass-card-hover p-6 cursor-pointer relative ${
                        selectedPool?.id === pool.id ? 'ring-2 ring-purple-500' : ''
                      }`}
                      onClick={() => setSelectedPool(pool)}
                    >
                      {pool.isHot && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          🔥 HOT
                        </div>
                      )}
                      {pool.isNew && (
                        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          🆕 NEW
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={pool.logo} 
                          alt={pool.name}
                          className="w-12 h-12 rounded-full"
                          onError={(e) => {
                            e.target.src = '/assets/images/placeholder-meme.svg';
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-semibold text-white">{pool.name}</h4>
                            {pool.verified && (
                              <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(pool.riskLevel)}`}>
                              {pool.riskLevel} Risk
                            </span>
                            {pool.autoCompound && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                                Auto-Compound
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">APY:</span>
                          <span className="text-2xl font-bold price-up">{pool.apy.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">TVL:</span>
                          <span className="text-white">${formatNumber(pool.tvl)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Stakers:</span>
                          <span className="text-white">{formatNumber(pool.stakersCount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Lock Period:</span>
                          <span className="text-white">{pool.lockPeriod} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Min Stake:</span>
                          <span className="text-white">{pool.minStake} {pool.name}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="text-2xl font-bold text-white mb-6">Recent Rewards</h3>
                <div className="space-y-4">
                  {recentRewards.map((reward, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <TrophyIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{reward.pool}</div>
                          <div className="text-sm text-gray-400">{reward.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold price-up">+{reward.amount.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">{reward.apy}% APY</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Stake with <span className="gradient-text">WIF</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Industry-leading staking infrastructure with maximum security and transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Secure & Audited",
                description: "Smart contracts audited by leading security firms with insurance coverage"
              },
              {
                icon: BoltIcon,
                title: "Auto-Compound",
                description: "Maximize your returns with automatic reward compounding"
              },
              {
                icon: TrophyIcon,
                title: "High Yields",
                description: "Earn up to 200% APY on your favorite memecoins"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card glass-card-hover p-8 text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Staking;
