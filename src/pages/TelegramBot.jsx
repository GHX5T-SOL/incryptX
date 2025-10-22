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
  GlobeAltIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import HolographicCard from '../components/HolographicCard.jsx';
import HoloButton from '../components/HoloButton.jsx';
import { useTelegramBot } from '../hooks/useTelegramBot';

const TelegramBot = () => {
  const [selectedFeature, setSelectedFeature] = useState('overview');
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [tradeDetails, setTradeDetails] = useState({
    token: '',
    action: 'buy',
    amount: '',
    price: ''
  });
  const [launchDetails, setLaunchDetails] = useState({
    name: '',
    symbol: '',
    supply: '1000000000',
    description: ''
  });

  // Use the Telegram bot hook
  const {
    chats,
    messages,
    isLoading,
    error,
    botStatus,
    connected,
    sendMessage,
    executeTrade,
    launchToken,
    executeCommand,
    copyTrader,
    getChats,
    getMessages,
    checkBotStatus
  } = useTelegramBot();

  const features = [
    {
      id: 'overview',
      title: 'Overview',
      icon: GlobeAltIcon,
      description: 'Get started with IncryptX Telegram Bot'
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
    
    try {
      const result = await executeCommand(command, command.split(' ').slice(1));
      setResponse(result.message);
    } catch (err) {
      setResponse(`❌ Error: ${err.message}`);
    }
  };

  const handleTradeExecution = async () => {
    if (!tradeDetails.token || !tradeDetails.amount) {
      setResponse('❌ Please fill in token and amount');
      return;
    }
    
    try {
      const result = await executeTrade({
        token: tradeDetails.token,
        action: tradeDetails.action,
        amount: parseFloat(tradeDetails.amount),
        price: tradeDetails.price ? parseFloat(tradeDetails.price) : undefined
      });
      setResponse(result.message);
    } catch (err) {
      setResponse(`❌ Trade failed: ${err.message}`);
    }
  };

  const handleTokenLaunch = async () => {
    if (!launchDetails.name || !launchDetails.symbol) {
      setResponse('❌ Please fill in token name and symbol');
      return;
    }
    
    try {
      const result = await launchToken({
        name: launchDetails.name,
        symbol: launchDetails.symbol,
        supply: parseInt(launchDetails.supply),
        description: launchDetails.description
      });
      setResponse(result.message);
    } catch (err) {
      setResponse(`❌ Launch failed: ${err.message}`);
    }
  };

  const handleCopyTrader = async (traderAddress) => {
    try {
      const result = await copyTrader(traderAddress);
      setResponse(result.message);
    } catch (err) {
      setResponse(`❌ Copy trader failed: ${err.message}`);
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
            🤖 <span className="gradient-text">IncryptX Telegram Bot</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Trade, launch, and manage your IncryptX portfolio directly from Telegram. 
            The most powerful crypto bot on Solana with zero coding required.
          </p>
          
          {/* Bot Status and Error Display */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                botStatus === 'connected' ? 'bg-green-500' : 
                botStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-gray-300">
                Bot Status: <span className={`font-semibold ${
                  botStatus === 'connected' ? 'text-green-400' : 
                  botStatus === 'disconnected' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {botStatus === 'connected' ? 'Connected' : 
                   botStatus === 'disconnected' ? 'Disconnected' : 'Unknown'}
                </span>
              </span>
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                <span className="text-red-300 text-sm">{error}</span>
              </motion.div>
            )}
            
            {!connected && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 text-sm">Wallet not connected - Some features may be limited</span>
              </motion.div>
            )}
          </div>
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
                    <h2 className="text-3xl font-bold text-white mb-4">Get Started with IncryptX Bot</h2>
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
                          <span className="text-gray-300">Search for <span className="text-white font-mono">@IncryptX_Ecosystem_Bot</span></span>
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
                    
                    <HoloButton
                      onClick={handleCommand}
                      disabled={isLoading || !command.trim()}
                      className="w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? '🤖 Processing...' : 'Send Command'}
                    </HoloButton>
                    
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
                          <span className="text-sm text-gray-400">IncryptX Bot Response:</span>
                        </div>
                        <p className="font-mono text-sm text-white whitespace-pre-line">{response}</p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Quick Trade Interface */}
                <div className="glass-card p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                    <ChartBarIcon className="w-8 h-8 text-purple-400" />
                    Quick Trade Execution
                  </h3>
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Token Symbol</label>
                        <input
                          type="text"
                          placeholder="e.g., SOL, CatWifHat"
                          value={tradeDetails.token}
                          onChange={(e) => setTradeDetails({...tradeDetails, token: e.target.value})}
                          className="input-modern w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
                        <select
                          value={tradeDetails.action}
                          onChange={(e) => setTradeDetails({...tradeDetails, action: e.target.value})}
                          className="input-modern w-full"
                        >
                          <option value="buy">Buy</option>
                          <option value="sell">Sell</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                        <input
                          type="number"
                          placeholder="e.g., 1.5"
                          value={tradeDetails.amount}
                          onChange={(e) => setTradeDetails({...tradeDetails, amount: e.target.value})}
                          className="input-modern w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Price (Optional)</label>
                        <input
                          type="number"
                          placeholder="e.g., 0.01"
                          value={tradeDetails.price}
                          onChange={(e) => setTradeDetails({...tradeDetails, price: e.target.value})}
                          className="input-modern w-full"
                        />
                      </div>
                    </div>
                    
                    <HoloButton
                      onClick={handleTradeExecution}
                      disabled={isLoading || !tradeDetails.token || !tradeDetails.amount}
                      className="w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? '⚡ Executing Trade...' : 'Execute Trade'}
                    </HoloButton>
                  </div>
                </div>

                {/* Token Launch Interface */}
                <div className="glass-card p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                    <RocketLaunchIcon className="w-8 h-8 text-purple-400" />
                    Launch New Token
                  </h3>
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Token Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Cat Wif Hat"
                          value={launchDetails.name}
                          onChange={(e) => setLaunchDetails({...launchDetails, name: e.target.value})}
                          className="input-modern w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                        <input
                          type="text"
                          placeholder="e.g., CATWIF"
                          value={launchDetails.symbol}
                          onChange={(e) => setLaunchDetails({...launchDetails, symbol: e.target.value})}
                          className="input-modern w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Supply</label>
                      <input
                        type="number"
                        placeholder="e.g., 1000000000"
                        value={launchDetails.supply}
                        onChange={(e) => setLaunchDetails({...launchDetails, supply: e.target.value})}
                        className="input-modern w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                      <textarea
                        placeholder="Describe your token..."
                        value={launchDetails.description}
                        onChange={(e) => setLaunchDetails({...launchDetails, description: e.target.value})}
                        className="input-modern w-full h-20 resize-none"
                      />
                    </div>
                    
                    <HoloButton
                      onClick={handleTokenLaunch}
                      disabled={isLoading || !launchDetails.name || !launchDetails.symbol}
                      className="w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? '🚀 Launching Token...' : 'Launch Token'}
                    </HoloButton>
                  </div>
                </div>

                {/* Chat List */}
                {chats.length > 0 && (
                  <div className="glass-card p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                      <UserGroupIcon className="w-8 h-8 text-purple-400" />
                      Active Chats
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {chats.map((chat) => (
                        <div key={chat.id} className="glass-card glass-card-hover p-4">
                          <h4 className="font-semibold text-white mb-2">{chat.title}</h4>
                          <p className="text-sm text-gray-400 mb-2">Type: {chat.type}</p>
                          <p className="text-sm text-gray-400">Members: {chat.memberCount}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              Why Choose <span className="gradient-text">IncryptX Bot</span>?
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
