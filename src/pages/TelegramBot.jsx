import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon,
  CommandLineIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  FireIcon,
  StarIcon,
  CogIcon,
  ShieldCheckIcon,
  BoltIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const TelegramBot = () => {
  const [selectedFeature, setSelectedFeature] = useState('overview');
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      id: 'overview',
      title: 'Overview',
      icon: GlobeAltIcon,
      description: 'Get started with WIF Telegram Bot'
    },
    {
      id: 'launch',
      title: 'Launch Commands',
      icon: RocketLaunchIcon,
      description: 'Launch tokens via Telegram'
    },
    {
      id: 'trading',
      title: 'Trading Commands',
      icon: ChartBarIcon,
      description: 'Execute trades and view markets'
    },
    {
      id: 'portfolio',
      title: 'Portfolio & Analytics',
      icon: CurrencyDollarIcon,
      description: 'Track your holdings and performance'
    },
    {
      id: 'social',
      title: 'Social Features',
      icon: UserGroupIcon,
      description: 'Community and social tools'
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      icon: CogIcon,
      description: 'Advanced bot capabilities'
    }
  ];

  const commands = {
    launch: [
      { cmd: '/launch', desc: 'Launch a new memecoin', example: '/launch CatWifHat 1000000', category: 'Launch' },
      { cmd: '/launch_tweet', desc: 'Launch via tweet link', example: '/launch_tweet https://twitter.com/...', category: 'Launch' },
      { cmd: '/launch_custom', desc: 'Custom launch with parameters', example: '/launch_custom name supply curve', category: 'Launch' }
    ],
    trading: [
      { cmd: '/trade', desc: 'Execute a trade', example: '/trade $TOKEN 1000', category: 'Trading' },
      { cmd: '/swap', desc: 'Quick token swap', example: '/swap SOL CatWifHat 1', category: 'Trading' },
      { cmd: '/price', desc: 'Get token price', example: '/price CatWifHat', category: 'Trading' },
      { cmd: '/chart', desc: 'View token chart', example: '/chart CatWifHat 1D', category: 'Trading' },
      { cmd: '/limit', desc: 'Set limit order', example: '/limit buy CatWifHat 1000 0.01', category: 'Trading' },
      { cmd: '/stop', desc: 'Set stop loss', example: '/stop CatWifHat 0.008', category: 'Trading' }
    ],
    portfolio: [
      { cmd: '/portfolio', desc: 'View your portfolio', example: '/portfolio', category: 'Portfolio' },
      { cmd: '/balance', desc: 'Check wallet balance', example: '/balance', category: 'Portfolio' },
      { cmd: '/pnl', desc: 'View profit/loss', example: '/pnl 24h', category: 'Portfolio' },
      { cmd: '/holdings', desc: 'Check token holdings', example: '/holdings CatWifHat', category: 'Portfolio' },
      { cmd: '/transactions', desc: 'View recent transactions', example: '/transactions 10', category: 'Portfolio' }
    ],
    social: [
      { cmd: '/leaderboard', desc: 'View top traders', example: '/leaderboard', category: 'Social' },
      { cmd: '/copy', desc: 'Copy a trader', example: '/copy @username', category: 'Social' },
      { cmd: '/follow', desc: 'Follow a trader', example: '/follow @username', category: 'Social' },
      { cmd: '/community', desc: 'Join token community', example: '/community CatWifHat', category: 'Social' },
      { cmd: '/vote', desc: 'Vote on proposals', example: '/vote 123 yes', category: 'Social' }
    ],
    advanced: [
      { cmd: '/snapshot', desc: 'Take wallet snapshot', example: '/snapshot', category: 'Advanced' },
      { cmd: '/alert', desc: 'Set price alert', example: '/alert CatWifHat > 0.02', category: 'Advanced' },
      { cmd: '/whale', desc: 'Track whale movements', example: '/whale CatWifHat', category: 'Advanced' },
      { cmd: '/mev', desc: 'MEV protection status', example: '/mev', category: 'Advanced' },
      { cmd: '/gas', desc: 'Check gas prices', example: '/gas', category: 'Advanced' }
    ]
  };

  const handleCommand = async () => {
    if (!command.trim()) return;
    
    setIsLoading(true);
    // Simulate bot response
    setTimeout(() => {
      const mockResponses = {
        '/launch': '🚀 Launching CatWifHat... Success! Token deployed at 0x123...\n\n📊 Initial MC: $1,000\n💰 Supply: 1,000,000,000\n🎯 Migration MC: $69,000',
        '/trade': '💹 Trade executed! Bought 1000 CatWifHat at $0.01\n\n📈 New Balance: 1000 CatWifHat\n💸 Cost: 0.01 SOL\n⏱️ Execution: 0.2s',
        '/price': '💰 CatWifHat: $0.015 (+50% in 24h)\n\n📊 Market Cap: $15,000\n📈 24h Volume: $45,000\n👥 Holders: 1,247',
        '/portfolio': '📊 Portfolio Summary\n\n💰 Total Value: $1,250 (+25% today)\n🎯 Top Holdings:\n• CatWifHat: $500 (+40%)\n• SOL: $750 (+15%)',
        '/leaderboard': '🏆 Top Traders This Week\n\n🥇 @DegenPuppy: +150% ($2,500)\n🥈 @MemeMaster: +120% ($1,800)\n🥉 @WifWhale: +95% ($3,200)',
        '/copy': '📋 Now copying @DegenPuppy trades\n\n⚙️ Settings:\n• Copy %: 100%\n• Max trade: $100\n• Auto-follow: Enabled'
      };
      
      const response = mockResponses[command.split(' ')[0]] || '🤖 Command not recognized. Type /help for available commands.';
      setResponse(response);
      setIsLoading(false);
    }, 1500);
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
            🤖 <span className="gradient-text">WIF Telegram Bot</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trade, launch, and manage your WIF portfolio directly from Telegram. 
            The most powerful crypto bot on Solana with zero coding required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card p-6 sticky top-24"
            >
              <h3 className="text-lg font-bold text-white mb-4">Features</h3>
              <div className="space-y-2">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setSelectedFeature(feature.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      selectedFeature === feature.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <feature.icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{feature.title}</div>
                      <div className="text-xs opacity-80">{feature.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Setup Instructions */}
            {selectedFeature === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="glass-card p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <PaperAirplaneIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Get Started with WIF Bot</h2>
                    <p className="text-gray-300">Follow these simple steps to start using the most powerful crypto bot on Solana</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white mb-4">📱 Step 1: Add Bot to Telegram</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">1</div>
                          <span className="text-gray-300">Open Telegram</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">2</div>
                          <span className="text-gray-300">Search for <span className="text-white font-mono">@WIF_Ecosystem_Bot</span></span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">3</div>
                          <span className="text-gray-300">Click "Start" or send <span className="text-white font-mono">/start</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white mb-4">🔗 Step 2: Connect Wallet</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">1</div>
                          <span className="text-gray-300">Send <span className="text-white font-mono">/connect</span></span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">2</div>
                          <span className="text-gray-300">Choose your wallet (Phantom, Solflare)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">3</div>
                          <span className="text-gray-300">Approve connection</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                    <h3 className="text-lg font-semibold text-white mb-3">🚀 Ready to Launch?</h3>
                    <p className="text-gray-300 mb-4">
                      Once connected, you can immediately start using powerful commands like:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-400">•</span>
                        <span className="text-white font-mono">/launch</span>
                        <span className="text-gray-400">- Launch memecoins</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-400">•</span>
                        <span className="text-white font-mono">/trade</span>
                        <span className="text-gray-400">- Execute trades</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-400">•</span>
                        <span className="text-white font-mono">/portfolio</span>
                        <span className="text-gray-400">- View holdings</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-400">•</span>
                        <span className="text-white font-mono">/copy</span>
                        <span className="text-gray-400">- Copy traders</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bot Simulator */}
                <div className="glass-card p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Try the Bot Simulator</h3>
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type a command (e.g., /launch CatWifHat)"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        className="input-modern w-full pl-12"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <CommandLineIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCommand}
                      disabled={isLoading || !command.trim()}
                      className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? '🤖 Processing...' : 'Send Command'}
                    </button>
                    
                    {response && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white text-xs">🤖</span>
                          </div>
                          <span className="text-sm text-gray-400">WIF Bot Response:</span>
                        </div>
                        <p className="font-mono text-sm text-white whitespace-pre-line">{response}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Command Documentation */}
            {selectedFeature !== 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {Object.entries(commands).map(([category, categoryCommands]) => (
                  <div key={category} className="glass-card p-6">
                                         <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                       {(() => {
                         const feature = features.find(f => f.id === category);
                         return feature?.icon ? <feature.icon className="w-8 h-8 text-purple-400" /> : null;
                       })()}
                       {features.find(f => f.id === category)?.title} Commands
                     </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryCommands.map((cmd, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="glass-card glass-card-hover p-4 cursor-pointer"
                          onClick={() => {
                            setCommand(cmd.example);
                            setResponse('');
                          }}
                        >
                          <div className="font-bold text-primary-pink mb-2">{cmd.cmd}</div>
                          <div className="text-sm text-gray-300 mb-3">{cmd.desc}</div>
                          <div className="font-mono text-xs bg-gray-800 p-2 rounded border border-gray-700">
                            {cmd.example}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose <span className="gradient-text">WIF Bot</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The most advanced Telegram bot for Solana trading and memecoin launches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BoltIcon,
                title: "Lightning Fast",
                description: "Execute trades in under 0.2 seconds with our optimized infrastructure"
              },
              {
                icon: ShieldCheckIcon,
                title: "Secure & Private",
                description: "End-to-end encryption, no data storage, complete privacy protection"
              },
              {
                icon: RocketLaunchIcon,
                title: "Zero Coding",
                description: "Launch memecoins, trade tokens, and manage portfolios with simple commands"
              },
              {
                icon: ChartBarIcon,
                title: "Advanced Analytics",
                description: "Real-time charts, portfolio tracking, and performance analytics"
              },
              {
                icon: UserGroupIcon,
                title: "Social Trading",
                description: "Copy successful traders, join communities, and share strategies"
              },
              {
                icon: GlobeAltIcon,
                title: "Multi-Chain",
                description: "Trade on Solana, Ethereum, BNB Chain, and more from one bot"
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
      </div>
    </div>
  );
};

export default TelegramBot;
