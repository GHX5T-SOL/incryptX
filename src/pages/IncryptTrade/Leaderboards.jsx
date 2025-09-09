import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrophyIcon,
  FireIcon,
  StarIcon,
  UserIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BoltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const Leaderboards = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [timeframe, setTimeframe] = useState('24h');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);

  const timeframes = ['24H', '7D', '30D', 'ALL'];

  const mockLeaderboardData = [
    {
      rank: 1,
      username: 'CryptoWhale',
      avatar: '/assets/images/user-avatars/avatar1.svg',
      pnl: 15420.50,
      pnlPercent: 245.6,
      trades: 127,
      winRate: 78.5,
      volume: 1250000,
      isCurrentUser: false,
      badge: '🥇'
    },
    {
      rank: 2,
      username: 'MemeLord',
      avatar: '/assets/images/user-avatars/avatar2.svg',
      pnl: 12340.75,
      pnlPercent: 198.3,
      trades: 89,
      winRate: 82.1,
      volume: 980000,
      isCurrentUser: false,
      badge: '🥈'
    },
    {
      rank: 3,
      username: 'SolanaSage',
      avatar: '/assets/images/user-avatars/avatar3.svg',
      pnl: 9876.25,
      pnlPercent: 156.7,
      trades: 156,
      winRate: 71.2,
      volume: 2100000,
      isCurrentUser: false,
      badge: '🥉'
    },
    {
      rank: 4,
      username: 'WifCollector',
      avatar: '/assets/images/user-avatars/avatar4.svg',
      pnl: 7654.30,
      pnlPercent: 123.4,
      trades: 67,
      winRate: 85.7,
      volume: 450000,
      isCurrentUser: false,
      badge: '🔥'
    },
    {
      rank: 5,
      username: 'You',
      avatar: '/assets/images/user-avatars/avatar5.svg',
      pnl: 5432.10,
      pnlPercent: 87.6,
      trades: 45,
      winRate: 66.7,
      volume: 320000,
      isCurrentUser: true,
      badge: '⭐'
    }
  ];

  const competitions = [
    {
      id: 1,
      name: 'Daily Trading Championship',
      prize: '1000 SOL',
      participants: 1250,
      endTime: '6 hours',
      status: 'active',
      description: 'Daily competition for the best traders'
    },
    {
      id: 2,
      name: 'Weekly Memecoin Masters',
      prize: '5000 SOL',
      participants: 890,
      endTime: '3 days',
      status: 'active',
      description: 'Weekly competition focusing on memecoins'
    },
    {
      id: 3,
      name: 'Monthly WIF Warriors',
      prize: '25000 SOL',
      participants: 2100,
      endTime: '2 weeks',
      status: 'upcoming',
      description: 'Monthly championship for elite traders'
    }
  ];

  useEffect(() => {
    setLeaderboardData(mockLeaderboardData);
    setUserRank(mockLeaderboardData.find(user => user.isCurrentUser));
  }, []);

  const getPnlColor = (pnl) => {
    return pnl >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🔥';
    if (rank <= 50) return '⭐';
    return '📊';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
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
            <span className="gradient-text">Trading Leaderboards</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compete with the best traders and climb the rankings to win prizes
          </p>
        </motion.div>

        {/* User Rank Card */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={userRank.avatar} 
                    alt={userRank.username}
                    className="w-16 h-16 rounded-full border-4 border-purple-500/30"
                    onError={(e) => {
                      e.target.src = '/assets/images/placeholder-meme.svg';
                    }}
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{userRank.badge}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{userRank.username}</h3>
                  <p className="text-gray-400">Rank #{userRank.rank} of {leaderboardData.length}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-3xl font-bold ${getPnlColor(userRank.pnl)}`}>
                  ${formatNumber(userRank.pnl)}
                </div>
                <div className="text-sm text-gray-400">
                  {userRank.pnlPercent >= 0 ? '+' : ''}{userRank.pnlPercent.toFixed(2)}% PnL
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-card p-2 mb-8 inline-flex rounded-xl"
        >
          {[
            { id: 'daily', name: 'Daily', icon: FireIcon },
            { id: 'weekly', name: 'Weekly', icon: StarIcon },
            { id: 'monthly', name: 'Monthly', icon: TrophyIcon },
            { id: 'all-time', name: 'All Time', icon: SparklesIcon }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Top Traders</h2>
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

              <div className="space-y-3">
                {leaderboardData.map((user, index) => (
                  <motion.div
                    key={user.username}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                      user.isCurrentUser 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' 
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{user.rank}</span>
                        </div>
                        <span className="text-2xl">{getRankBadge(user.rank)}</span>
                      </div>
                      
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-12 h-12 rounded-full"
                        onError={(e) => {
                          e.target.src = '/assets/images/placeholder-meme.svg';
                        }}
                      />
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{user.username}</h4>
                          {user.isCurrentUser && (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.trades} trades • {user.winRate}% win rate
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-xl font-bold ${getPnlColor(user.pnl)}`}>
                        ${formatNumber(user.pnl)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {user.pnlPercent >= 0 ? '+' : ''}{user.pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Competitions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Active Competitions</h3>
              <div className="space-y-4">
                {competitions.map((comp) => (
                  <div key={comp.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{comp.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        comp.status === 'active' ? 'text-green-400 bg-green-400/20' : 'text-blue-400 bg-blue-400/20'
                      }`}>
                        {comp.status === 'active' ? 'Active' : 'Upcoming'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{comp.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Prize:</span>
                      <span className="text-white font-medium">{comp.prize}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Participants:</span>
                      <span className="text-white font-medium">{formatNumber(comp.participants)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Ends in:</span>
                      <span className="text-white font-medium">{comp.endTime}</span>
                    </div>
                    <button className="w-full btn-primary mt-3 py-2">
                      Join Competition
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Prize Pool */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Total Prize Pool</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">31,000 SOL</div>
                <div className="text-sm text-gray-400">≈ $3,100,000 USD</div>
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                  <div className="text-sm text-yellow-400">
                    <strong>Next Competition:</strong> Daily Trading Championship
                  </div>
                  <div className="text-xs text-yellow-400 mt-1">Starts in 2 hours</div>
                </div>
              </div>
            </motion.div>

            {/* How to Compete */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">How to Compete</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <BoltIcon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Trade any token on the platform to earn points</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChartBarIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Higher PnL and volume = better ranking</span>
                </div>
                <div className="flex items-start gap-2">
                  <TrophyIcon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Win prizes based on your final position</span>
                </div>
                <div className="flex items-start gap-2">
                  <ClockIcon className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Competitions reset daily, weekly, and monthly</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;
