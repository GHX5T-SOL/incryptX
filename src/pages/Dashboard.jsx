import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FireIcon,
  StarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BoltIcon,
  TrophyIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import useMockData from '../hooks/useMockData';
import { useWallet } from '@solana/wallet-adapter-react';

const Dashboard = () => {
  const { publicKey, connected } = useWallet();
  const tokens = useMockData('mock-tokens.json');
  const trades = useMockData('mock-trades.json');
  const posts = useMockData('mock-posts.json');

  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalChange: 0,
    totalTokens: 0,
    activePositions: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    // Generate portfolio stats
    const myTokens = tokens.slice(0, 5).map(token => ({
      ...token,
      price: Math.random() * 0.1 + 0.001,
      priceChange: Math.random() > 0.5 ? Math.random() * 100 : -Math.random() * 50,
      balance: Math.random() * 1000000 + 10000,
      logo: token.name === 'CatWifHat' ? '/assets/images/catwifhat.svg' : 
            token.name === 'DogWifLaser' ? '/assets/images/dogwiflaser.svg' : 
            '/assets/images/placeholder-meme.svg'
    }));

    const totalValue = myTokens.reduce((sum, token) => sum + token.balance, 0);
    const totalChange = myTokens.reduce((sum, token) => sum + (token.balance * token.priceChange / 100), 0);

    setPortfolioStats({
      totalValue,
      totalChange,
      totalTokens: myTokens.length,
      activePositions: Math.floor(Math.random() * 10) + 5
    });

    // Generate recent activity
    const activity = [
      {
        id: 1,
        type: 'trade',
        action: 'Bought CatWifHat',
        amount: '100,000',
        price: '$0.023',
        time: '2 hours ago',
        icon: ArrowTrendingUpIcon,
        color: 'text-green-400'
      },
      {
        id: 2,
        type: 'launch',
        action: 'Launched new token',
        amount: 'WIFMoon',
        price: 'Success',
        time: '1 day ago',
        icon: FireIcon,
        color: 'text-orange-400'
      },
      {
        id: 3,
        type: 'stake',
        action: 'Staked WIF tokens',
        amount: '50,000',
        price: 'APY: 12%',
        time: '2 days ago',
        icon: StarIcon,
        color: 'text-yellow-400'
      },
      {
        id: 4,
        type: 'social',
        action: 'Joined WIF Warriors',
        amount: 'Community',
        price: 'Active',
        time: '3 days ago',
        icon: UserGroupIcon,
        color: 'text-purple-400'
      }
    ];
    setRecentActivity(activity);

    // Generate quick actions
    const actions = [
      {
        id: 1,
        title: 'Quick Launch',
        description: 'Launch a memecoin in minutes',
        icon: FireIcon,
        color: 'from-orange-500 to-red-500',
        link: '/pad/launch/degen'
      },
      {
        id: 2,
        title: 'Trade Tokens',
        description: 'Swap and trade memecoins',
        icon: ChartBarIcon,
        color: 'from-blue-500 to-cyan-500',
        link: '/trade'
      },
      {
        id: 3,
        title: 'Stake & Earn',
        description: 'Earn rewards by staking',
        icon: StarIcon,
        color: 'from-yellow-500 to-orange-500',
        link: '/staking'
      },
      {
        id: 4,
        title: 'Join Community',
        description: 'Connect with other traders',
        icon: UserGroupIcon,
        color: 'from-purple-500 to-pink-500',
        link: '/social/feed'
      }
    ];
    setQuickActions(actions);
  }, [tokens]);

  if (!connected || !publicKey) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <CogIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-xl text-gray-300 mb-8">
            Connect your Solana wallet to view your dashboard and portfolio
          </p>
          <button className="btn-primary px-8 py-3 text-lg">
            Connect Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Welcome Back!</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Here's what's happening with your portfolio today
          </p>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                label: 'Portfolio Value', 
                value: `$${formatNumber(portfolioStats.totalValue)}`, 
                change: portfolioStats.totalChange,
                icon: CurrencyDollarIcon, 
                color: 'from-green-500 to-emerald-500' 
              },
              { 
                label: 'Total Tokens', 
                value: portfolioStats.totalTokens, 
                change: null,
                icon: FireIcon, 
                color: 'from-orange-500 to-red-500' 
              },
              { 
                label: 'Active Positions', 
                value: portfolioStats.activePositions, 
                change: null,
                icon: ChartBarIcon, 
                color: 'from-blue-500 to-cyan-500' 
              },
              { 
                label: '24h Change', 
                value: `${portfolioStats.totalChange >= 0 ? '+' : ''}${(portfolioStats.totalChange / portfolioStats.totalValue * 100).toFixed(2)}%`, 
                change: portfolioStats.totalChange,
                icon: ArrowTrendingUpIcon, 
                color: 'from-purple-500 to-pink-500' 
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                {stat.change !== null && (
                  <div className={`text-sm ${getChangeColor(stat.change)}`}>
                    {stat.change >= 0 ? '+' : ''}${formatNumber(Math.abs(stat.change))}
                  </div>
                )}
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="group"
                  >
                    <Link to={action.link}>
                      <div className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                        <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                        <p className="text-sm text-gray-400">{action.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                <Link to="/social/feed" className="text-purple-400 hover:text-purple-300 transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{activity.action}</div>
                      <div className="text-sm text-gray-400">
                        {activity.amount} • {activity.price}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{activity.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portfolio Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Portfolio Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="text-white font-medium">${formatNumber(portfolioStats.totalValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">24h Change:</span>
                  <span className={`font-medium ${getChangeColor(portfolioStats.totalChange)}`}>
                    {portfolioStats.totalChange >= 0 ? '+' : ''}${formatNumber(Math.abs(portfolioStats.totalChange))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tokens Held:</span>
                  <span className="text-white font-medium">{portfolioStats.totalTokens}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Positions:</span>
                  <span className="text-white font-medium">{portfolioStats.activePositions}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <TrophyIcon className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-white font-medium">Rank #156</div>
                    <div className="text-sm text-gray-400">Trading Leaderboard</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-white font-medium">Rep Score: 847</div>
                    <div className="text-sm text-gray-400">Community Standing</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BoltIcon className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-white font-medium">5 Tokens Launched</div>
                    <div className="text-sm text-gray-400">Creator Status</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg">
                  <BellIcon className="w-5 h-5 text-yellow-400" />
                  <div className="text-sm">
                    <div className="text-white font-medium">Price Alert</div>
                    <div className="text-gray-400">CatWifHat +15%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
                  <BellIcon className="w-5 h-5 text-blue-400" />
                  <div className="text-sm">
                    <div className="text-white font-medium">New Competition</div>
                    <div className="text-gray-400">Daily Trading Championship</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
