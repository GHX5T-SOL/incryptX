import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  UserIcon,
  WalletIcon,
  CurrencyDollarIcon,
  FireIcon,
  StarIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  TrophyIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { useWallet } from '@solana/wallet-adapter-react';
import useMockData from '../../hooks/useMockData';

const Profile = () => {
  const { username } = useParams();
  const { publicKey, connected } = useWallet();
  const tokens = useMockData('mock-tokens.json');
  const users = useMockData('mock-users.json');
  const [activeTab, setActiveTab] = useState('overview');
  const [showQR, setShowQR] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState(null);
  const [userTokens, setUserTokens] = useState([]);
  const [userPositions, setUserPositions] = useState([]);
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    // Find user profile
    const foundUser = users.find(u => u.username === username) || users[0];
    setProfile(foundUser);

    // Generate user's tokens (tokens they've launched)
    const launchedTokens = tokens.slice(0, 5).map((token, index) => ({
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
      isVerified: Math.random() > 0.3
    }));
    setUserTokens(launchedTokens);

    // Generate user's trading positions
    const positions = [
      {
        id: 1,
        token: 'CatWifHat',
        type: 'long',
        entryPrice: 0.020,
        currentPrice: 0.023,
        amount: 1000,
        pnl: 15.0,
        pnlPercent: 15.0,
        time: '2 days ago'
      },
      {
        id: 2,
        token: 'DogWifLaser',
        type: 'short',
        entryPrice: 0.018,
        currentPrice: 0.015,
        amount: 500,
        pnl: 16.67,
        pnlPercent: 16.67,
        time: '1 day ago'
      }
    ];
    setUserPositions(positions);

    // Generate user's groups
    const groups = [
      {
        id: 1,
        name: 'WIF Warriors',
        members: 1250,
        description: 'Elite WIF community for serious traders',
        joinedDate: '2 weeks ago',
        role: 'Admin',
        isActive: true
      },
      {
        id: 2,
        name: 'Meme Masters',
        members: 890,
        description: 'Community for memecoin enthusiasts',
        joinedDate: '1 month ago',
        role: 'Member',
        isActive: true
      },
      {
        id: 3,
        name: 'Solana Sages',
        members: 2100,
        description: 'Advanced Solana trading strategies',
        joinedDate: '3 weeks ago',
        role: 'Moderator',
        isActive: false
      }
    ];
    setUserGroups(groups);
  }, [username, users, tokens]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatAddress = (address) => {
    if (!address) return 'Not connected';
    return `${address.toString().slice(0, 6)}...${address.toString().slice(-4)}`;
  };

  const getPnlColor = (pnl) => {
    return pnl >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'text-red-400 bg-red-400/20';
      case 'Moderator': return 'text-blue-400 bg-blue-400/20';
      case 'Member': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <img 
                    src={profile.pic} 
                    alt={profile.username}
                    className="w-24 h-24 rounded-full border-4 border-purple-500/30"
                    onError={(e) => {
                      e.target.src = '/assets/images/placeholder-meme.svg';
                    }}
                  />
                  {profile.nftHats.length > 0 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{profile.nftHats.length}</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">{profile.username}</h1>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-5 h-5 text-yellow-500" />
                      <span className="text-white font-medium">{profile.repScore}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-lg">Member since {new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-gray-400">Launches: {profile.launches}</span>
                    <span className="text-gray-400">NFT Hats: {profile.nftHats.length}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="btn-primary px-6 py-2">
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Share Profile
                </button>
                <button className="btn-secondary px-6 py-2">
                  <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
                  Send Message
                </button>
                <button className="px-6 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors">
                  <HeartIcon className="w-4 h-4 mr-2" />
                  Follow
                </button>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="lg:w-80">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <WalletIcon className="w-5 h-5" />
                  Wallet Information
                </h3>
                
                {connected && publicKey ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Address</label>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-sm">{formatAddress(publicKey)}</span>
                        <button
                          onClick={() => copyToClipboard(publicKey.toString())}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <DocumentDuplicateIcon className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => setShowQR(!showQR)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <QrCodeIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {showQR && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-white/5 rounded-lg text-center"
                      >
                        <div className="w-32 h-32 mx-auto bg-white rounded-lg p-2">
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                            <QrCodeIcon className="w-16 h-16 text-gray-600" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">QR Code for {formatAddress(publicKey)}</p>
                      </motion.div>
                    )}

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between">
                        <span className="text-gray-400">SOL Balance:</span>
                        <span className="text-white font-medium">2.45 SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">USD Value:</span>
                        <span className="text-white font-medium">$245.00</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <WalletIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-400">Wallet not connected</p>
                    <button className="btn-primary mt-3 px-4 py-2 text-sm">
                      Connect Wallet
                    </button>
                  </div>
                )}

                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-2 bg-green-500/20 text-green-400 text-sm rounded text-center"
                  >
                    Address copied to clipboard!
                  </motion.div>
                )}
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
            { id: 'tokens', name: 'Tokens Launched', icon: FireIcon },
            { id: 'positions', name: 'Positions', icon: ChartBarIcon },
            { id: 'groups', name: 'Groups', icon: UserGroupIcon },
            { id: 'activity', name: 'Activity', icon: ClockIcon }
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
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Value', value: '$12,450', icon: CurrencyDollarIcon, color: 'from-green-500 to-emerald-500' },
                  { label: 'Tokens Launched', value: userTokens.length, icon: FireIcon, color: 'from-orange-500 to-red-500' },
                  { label: 'Active Positions', value: userPositions.length, icon: ChartBarIcon, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Groups Joined', value: userGroups.length, icon: UserGroupIcon, color: 'from-purple-500 to-pink-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card p-6 text-center group"
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Launched token', details: 'CatWifHat', time: '2 hours ago', type: 'launch' },
                    { action: 'Opened position', details: 'Long CatWifHat', time: '1 day ago', type: 'trade' },
                    { action: 'Joined group', details: 'WIF Warriors', time: '2 days ago', type: 'social' },
                    { action: 'Staked tokens', details: '500 WIF', time: '3 days ago', type: 'stake' }
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.type === 'launch' ? 'bg-green-500' :
                          activity.type === 'trade' ? 'bg-blue-500' :
                          activity.type === 'social' ? 'bg-purple-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <div>
                          <div className="text-white font-medium">{activity.action}</div>
                          <div className="text-sm text-gray-400">{activity.details}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">{activity.time}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tokens' && (
            <motion.div
              key="tokens"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tokens Launched</h2>
                <div className="space-y-4">
                  {userTokens.map((token, index) => (
                    <motion.div
                      key={token.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
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
                            <h4 className="text-lg font-semibold text-white">{token.name}</h4>
                            {token.isVerified && (
                              <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400">Launched {token.launchDate.toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-white font-medium">${token.price.toFixed(6)}</div>
                        <div className={`text-sm ${token.priceChange >= 0 ? 'price-up' : 'price-down'}`}>
                          {token.priceChange >= 0 ? '+' : ''}{token.priceChange.toFixed(2)}%
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-white font-medium">${formatNumber(token.marketCap)}</div>
                        <div className="text-sm text-gray-400">Market Cap</div>
                      </div>

                      <div className="text-center">
                        <div className="text-white font-medium">{formatNumber(token.holders)}</div>
                        <div className="text-sm text-gray-400">Holders</div>
                      </div>

                      <button className="btn-secondary px-4 py-2">
                        View Details
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'positions' && (
            <motion.div
              key="positions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Trading Positions</h2>
                <div className="space-y-4">
                  {userPositions.map((position, index) => (
                    <motion.div
                      key={position.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${position.type === 'long' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="font-semibold text-white">{position.token}</div>
                          <div className="text-sm text-gray-400">{position.type.toUpperCase()} • {position.time}</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-white font-medium">{position.amount}</div>
                        <div className="text-sm text-gray-400">Amount</div>
                      </div>

                      <div className="text-center">
                        <div className="text-white font-medium">${position.entryPrice.toFixed(6)}</div>
                        <div className="text-sm text-gray-400">Entry Price</div>
                      </div>

                      <div className="text-center">
                        <div className="text-white font-medium">${position.currentPrice.toFixed(6)}</div>
                        <div className="text-sm text-gray-400">Current Price</div>
                      </div>

                      <div className="text-center">
                        <div className={`font-medium ${getPnlColor(position.pnl)}`}>
                          ${position.pnl.toFixed(2)} ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                        </div>
                        <div className="text-sm text-gray-400">PnL</div>
                      </div>

                      <button className="btn-secondary px-4 py-2">
                        Close
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'groups' && (
            <motion.div
              key="groups"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Groups Joined</h2>
                <div className="space-y-4">
                  {userGroups.map((group, index) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <UserGroupIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{group.name}</h4>
                          <p className="text-sm text-gray-400">{group.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-white font-medium">{formatNumber(group.members)}</div>
                        <div className="text-sm text-gray-400">Members</div>
                      </div>

                      <div className="text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(group.role)}`}>
                          {group.role}
                        </span>
                        <div className="text-sm text-gray-400 mt-1">{group.joinedDate}</div>
                      </div>

                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${group.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        <div className="text-sm text-gray-400">{group.isActive ? 'Active' : 'Inactive'}</div>
                      </div>

                      <button className="btn-secondary px-4 py-2">
                        View Group
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Activity Timeline</h2>
                <div className="space-y-4">
                  {[
                    { action: 'Launched CatWifHat token', time: '2 hours ago', type: 'launch', icon: FireIcon },
                    { action: 'Opened long position on CatWifHat', time: '1 day ago', type: 'trade', icon: ChartBarIcon },
                    { action: 'Joined WIF Warriors group', time: '2 days ago', type: 'social', icon: UserGroupIcon },
                    { action: 'Staked 500 WIF tokens', time: '3 days ago', type: 'stake', icon: TrophyIcon },
                    { action: 'Created first post in community', time: '1 week ago', type: 'social', icon: ChatBubbleLeftIcon }
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                    >
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                        activity.type === 'launch' ? 'from-orange-500 to-red-500' :
                        activity.type === 'trade' ? 'from-blue-500 to-cyan-500' :
                        activity.type === 'social' ? 'from-purple-500 to-pink-500' :
                        'from-yellow-500 to-orange-500'
                      } flex items-center justify-center`}>
                        <activity.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{activity.action}</div>
                        <div className="text-sm text-gray-400">{activity.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
