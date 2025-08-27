import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowsUpDownIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  FireIcon,
  SparklesIcon,
  CogIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  XMarkIcon,
  BoltIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const TradeHome = () => {
  const tokens = useMockData('mock-tokens.json');
  const [fromToken, setFromToken] = useState({ name: 'SOL', symbol: 'SOL', logo: '/assets/images/wif-logo.svg', price: 98.45 });
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false);
  const [showToTokenSelector, setShowToTokenSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [balance, setBalance] = useState({ SOL: 10.5, USDC: 1000 });

  const enhancedTokens = [
    { name: 'SOL', symbol: 'SOL', price: 98.45, change24h: 5.23, volume24h: 45000000, logo: '/assets/images/wif-logo.svg', balance: balance.SOL || 0 },
    { name: 'USDC', symbol: 'USDC', price: 1.00, change24h: 0.01, volume24h: 125000000, logo: '/assets/images/placeholder-meme.svg', balance: balance.USDC || 0 },
    ...tokens.map((token, index) => ({
      ...token,
      symbol: token.name.toUpperCase(),
      logo: token.name === 'CatWifHat' ? '/assets/images/catwifhat.svg' : 
            token.name === 'DogWifLaser' ? '/assets/images/dogwiflaser.svg' : 
            '/assets/images/placeholder-meme.svg',
      price: Math.random() * 0.1 + 0.001,
      change24h: (Math.random() - 0.5) * 100,
      volume24h: Math.random() * 1000000,
      balance: Math.random() * 1000
    }))
  ];

  const filteredTokens = enhancedTokens.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentTrades = [
    { pair: 'SOL/USDC', side: 'BUY', amount: '150.5', price: '$98.24', change: '+2.5%', time: '2m ago', volume: '2.4M' },
    { pair: 'BONK/SOL', side: 'SELL', amount: '1,250,000', price: '$0.000015', change: '-1.2%', time: '5m ago', volume: '890K' },
    { pair: 'WIF/SOL', side: 'BUY', amount: '5,000', price: '$2.45', change: '+15.8%', time: '8m ago', volume: '1.2M' },
    { pair: 'RAY/USDC', side: 'BUY', amount: '890', price: '$1.85', change: '+8.4%', time: '12m ago', volume: '650K' }
  ];

  const quickSwapPairs = [
    { from: 'SOL', to: 'USDC', icon1: '/assets/images/wif-logo.svg', icon2: '/assets/images/placeholder-meme.svg' },
    { from: 'SOL', to: 'CatWifHat', icon1: '/assets/images/wif-logo.svg', icon2: '/assets/images/catwifhat.svg' },
    { from: 'USDC', to: 'DogWifLaser', icon1: '/assets/images/placeholder-meme.svg', icon2: '/assets/images/dogwiflaser.svg' },
    { from: 'SOL', to: 'WIF', icon1: '/assets/images/wif-logo.svg', icon2: '/assets/images/wif-logo.svg' }
  ];

  const stats = {
    totalVolume: 45600000,
    totalLiquidity: 12300000,
    totalTrades: 156789,
    activePairs: 1247
  };

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      // Mock price calculation with realistic rates
      const rate = toToken.price / fromToken.price;
      const calculated = (parseFloat(fromAmount) * rate * (1 - slippage / 100)).toFixed(6);
      setToAmount(calculated);
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken, slippage]);

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount) return;
    
    setIsSwapping(true);
    // Simulate swap process
    setTimeout(() => {
      setIsSwapping(false);
      // Update balances
      const newBalance = { ...balance };
      newBalance[fromToken.symbol] = (newBalance[fromToken.symbol] || 0) - parseFloat(fromAmount);
      newBalance[toToken.symbol] = (newBalance[toToken.symbol] || 0) + parseFloat(toAmount);
      setBalance(newBalance);
      
      // Show success notification
      alert(`Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}!`);
    }, 2000);
  };

  const handleTokenSwap = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const selectToken = (token, isFrom = true) => {
    if (isFrom) {
      setFromToken(token);
      setShowFromTokenSelector(false);
    } else {
      setToToken(token);
      setShowToTokenSelector(false);
    }
    setSearchTerm('');
  };

  const setMaxAmount = () => {
    if (fromToken && fromToken.balance) {
      setFromAmount(fromToken.balance.toString());
    }
  };

  const TokenSelector = ({ isFrom, show, onClose }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="modal-content w-full max-w-md mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Select Token</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <XMarkIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-modern w-full pl-10"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTokens.map((token) => (
                  <button
                    key={token.name}
                    onClick={() => selectToken(token, isFrom)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors group"
                  >
                    <img 
                      src={token.logo} 
                      alt={token.name}
                      className="w-12 h-12 rounded-full group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.target.src = '/assets/images/placeholder-meme.svg';
                      }}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white text-lg">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">${token.price.toFixed(6)}</div>
                      <div className={`text-sm ${token.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
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
            <span className="gradient-text">Trade</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Lightning-fast swaps with the best rates on Solana. Trade memecoins instantly with MEV protection.
          </p>
        </motion.div>

        {/* Quick Swap Pairs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-8"
        >
          {quickSwapPairs.map((pair, index) => (
            <button
              key={index}
              onClick={() => {
                setFromToken(enhancedTokens.find(t => t.symbol === pair.from));
                setToToken(enhancedTokens.find(t => t.symbol === pair.to));
              }}
              className="flex items-center gap-2 px-4 py-2 glass-card glass-card-hover transition-all duration-200"
            >
              <div className="flex -space-x-2">
                <img src={pair.icon1} alt={pair.from} className="w-6 h-6 rounded-full border-2 border-gray-900" />
                <img src={pair.icon2} alt={pair.to} className="w-6 h-6 rounded-full border-2 border-gray-900" />
              </div>
              <span className="text-white text-sm font-medium">{pair.from}/{pair.to}</span>
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Swap Interface */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <BoltIcon className="w-8 h-8 text-yellow-500" />
                  Swap
                </h2>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <CogIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CogIcon className="w-5 h-5" />
                      Swap Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-3 font-medium">Slippage Tolerance</label>
                        <div className="flex gap-2">
                          {[0.1, 0.5, 1.0, 3.0].map((value) => (
                            <button
                              key={value}
                              onClick={() => setSlippage(value)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                slippage === value
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                              }`}
                            >
                              {value}%
                            </button>
                          ))}
                          <input
                            type="number"
                            value={slippage}
                            onChange={(e) => setSlippage(parseFloat(e.target.value))}
                            className="input-modern w-20 text-center"
                            step="0.1"
                            min="0.1"
                            max="50"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <InformationCircleIcon className="w-4 h-4" />
                        <span>Higher slippage = faster execution but potentially worse rates</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Swap Form */}
              <div className="space-y-2">
                {/* From Token */}
                <div className="relative">
                  <div className="absolute top-4 left-4 flex items-center justify-between w-full pr-8">
                    <span className="text-sm font-medium text-gray-400">You Pay</span>
                    <span className="text-sm text-gray-400">
                      Balance: {fromToken?.balance?.toFixed(4) || '0.00'}
                    </span>
                  </div>
                  <div className="pt-12 pb-6 px-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={fromAmount}
                          onChange={(e) => setFromAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-transparent text-3xl font-bold text-white placeholder-gray-500 outline-none"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm text-gray-400">
                            {fromAmount && fromToken ? `≈ $${(parseFloat(fromAmount) * fromToken.price).toFixed(2)}` : ''}
                          </div>
                          {fromToken?.balance > 0 && (
                            <button 
                              onClick={setMaxAmount}
                              className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                            >
                              MAX
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowFromTokenSelector(true)}
                        className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-all duration-200 hover:scale-105 min-w-[120px]"
                      >
                        {fromToken ? (
                          <>
                            <img src={fromToken.logo} alt={fromToken.name} className="w-8 h-8 rounded-full" />
                            <span className="font-bold text-white text-lg">{fromToken.symbol}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Select</span>
                        )}
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-4 relative z-10">
                  <button
                    onClick={handleTokenSwap}
                    className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 border-4 border-gray-900"
                  >
                    <ArrowsUpDownIcon className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* To Token */}
                <div className="relative">
                  <div className="absolute top-4 left-4 flex items-center justify-between w-full pr-8">
                    <span className="text-sm font-medium text-gray-400">You Receive</span>
                    <span className="text-sm text-gray-400">
                      Balance: {toToken?.balance?.toFixed(4) || '0.00'}
                    </span>
                  </div>
                  <div className="pt-12 pb-6 px-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={toAmount}
                          placeholder="0.00"
                          className="w-full bg-transparent text-3xl font-bold text-white placeholder-gray-500 outline-none"
                          readOnly
                        />
                        <div className="text-sm text-gray-400 mt-2">
                          {toAmount && toToken ? `≈ $${(parseFloat(toAmount) * toToken.price).toFixed(2)}` : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowToTokenSelector(true)}
                        className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-all duration-200 hover:scale-105 min-w-[120px]"
                      >
                        {toToken ? (
                          <>
                            <img src={toToken.logo} alt={toToken.name} className="w-8 h-8 rounded-full" />
                            <span className="font-bold text-white text-lg">{toToken.symbol}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Select</span>
                        )}
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Swap Details */}
                {fromToken && toToken && fromAmount && toAmount && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30 space-y-3 mt-4"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rate:</span>
                      <span className="text-white font-medium">1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken.symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price Impact:</span>
                      <span className="text-green-400 font-medium">{"<0.01%"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network Fee:</span>
                      <span className="text-white font-medium">~0.000005 SOL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Minimum Received:</span>
                      <span className="text-white font-medium">{(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)} {toToken.symbol}</span>
                    </div>
                  </motion.div>
                )}

                {/* Swap Button */}
                <button
                  onClick={handleSwap}
                  disabled={!fromToken || !toToken || !fromAmount || isSwapping || parseFloat(fromAmount) > (fromToken?.balance || 0)}
                  className="w-full btn-primary py-5 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-3"
                >
                  {isSwapping ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Swapping...
                    </>
                  ) : !fromToken || !toToken ? (
                    'Select tokens'
                  ) : !fromAmount ? (
                    'Enter amount'
                  ) : parseFloat(fromAmount) > (fromToken?.balance || 0) ? (
                    'Insufficient balance'
                  ) : (
                    <>
                      <BoltIcon className="w-6 h-6" />
                      Swap
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">24h Statistics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Volume', value: `$${formatNumber(stats.totalVolume)}`, icon: CurrencyDollarIcon, change: '+12.5%' },
                  { label: 'Trades', value: formatNumber(stats.totalTrades), icon: ArrowTrendingUpIcon, change: '+8.2%' },
                  { label: 'Active Pairs', value: formatNumber(stats.activePairs), icon: FireIcon, change: '+15.1%' }
                ].map((stat, index) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <stat.icon className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-400">{stat.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{stat.value}</div>
                      <div className="text-green-400 text-xs">{stat.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Live Trades */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Trades
              </h3>
              <div className="space-y-3">
                {recentTrades.map((trade, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${trade.side === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <div className="font-semibold text-white text-sm">{trade.pair}</div>
                        <div className="text-xs text-gray-400">{trade.time} • {trade.volume}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white text-sm">{trade.price}</div>
                      <div className={`text-xs font-medium ${trade.change.startsWith('+') ? 'price-up' : 'price-down'}`}>
                        {trade.change}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hot Tokens */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-orange-500" />
                Hot Tokens
              </h3>
              <div className="space-y-3">
                {enhancedTokens.slice(2, 8).map((token, index) => (
                  <button
                    key={token.name}
                    onClick={() => setToToken(token)}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <img 
                      src={token.logo} 
                      alt={token.name} 
                      className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.target.src = '/assets/images/placeholder-meme.svg';
                      }}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white">{token.symbol}</div>
                      <div className="text-sm text-gray-400">${token.price.toFixed(6)}</div>
                    </div>
                    <div className={`text-sm font-bold ${token.change24h > 0 ? 'price-up' : 'price-down'}`}>
                      {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Token Selectors */}
        <TokenSelector 
          isFrom={true} 
          show={showFromTokenSelector} 
          onClose={() => setShowFromTokenSelector(false)} 
        />
        <TokenSelector 
          isFrom={false} 
          show={showToTokenSelector} 
          onClose={() => setShowToTokenSelector(false)} 
        />
      </div>
    </div>
  );
};

export default TradeHome;