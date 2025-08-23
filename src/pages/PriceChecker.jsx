import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  StarIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import useMockData from '../hooks/useMockData';

const PriceChecker = () => {
  const tokens = useMockData('mock-tokens.json');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);
  const [timeframe, setTimeframe] = useState('24h');
  const [favorites, setFavorites] = useState([]);

  const timeframes = ['1h', '24h', '7d', '30d'];

  // Enhanced token data with price analytics
  const enhancedTokens = tokens.map((token, index) => ({
    ...token,
    price: Math.random() * 0.1 + 0.001,
    priceChange1h: (Math.random() - 0.5) * 20,
    priceChange24h: (Math.random() - 0.5) * 100,
    priceChange7d: (Math.random() - 0.5) * 200,
    priceChange30d: (Math.random() - 0.5) * 300,
    volume1h: Math.random() * 100000,
    volume24h: Math.random() * 5000000 + 100000,
    volume7d: Math.random() * 35000000 + 700000,
    allTimeHigh: Math.random() * 1 + 0.01,
    allTimeLow: Math.random() * 0.001,
    marketCap: token.mc,
    fullyDilutedValue: token.mc * 1.2,
    circulatingSupply: token.supply * 0.8,
    totalSupply: token.supply,
    holders: Math.floor(Math.random() * 10000) + 100,
    transactions24h: Math.floor(Math.random() * 10000) + 100,
    liquidity: Math.random() * 1000000 + 50000,
    burnedTokens: Math.floor(token.supply * 0.1),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    website: `https://${token.name.toLowerCase()}.com`,
    twitter: `@${token.name}`,
    telegram: `t.me/${token.name}`,
    logo: token.name === 'CatWifHat' ? '/assets/images/catwifhat.svg' : 
          token.name === 'DogWifLaser' ? '/assets/images/dogwiflaser.svg' : 
          '/assets/images/placeholder-meme.svg',
    description: `${token.name} is a revolutionary memecoin bringing joy and innovation to the Solana ecosystem. Built for the community, by the community.`,
    risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
  }));

  const filteredTokens = enhancedTokens.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.id.toString().includes(searchTerm)
  );

  const handleTokenSelect = (token) => {
    setSelectedToken(token);
  };

  const toggleFavorite = (tokenId) => {
    setFavorites(prev => 
      prev.includes(tokenId)
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  const getPriceChange = (token) => {
    switch (timeframe) {
      case '1h': return token.priceChange1h;
      case '24h': return token.priceChange24h;
      case '7d': return token.priceChange7d;
      case '30d': return token.priceChange30d;
      default: return token.priceChange24h;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
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
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Price Checker</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Deep dive into token analytics with comprehensive price data and market insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search & Token List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card p-6 sticky top-24"
            >
              {/* Search */}
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

              {/* Token List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTokens.slice(0, 20).map((token) => (
                  <motion.div
                    key={token.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedToken?.id === token.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={token.logo} 
                          alt={token.name}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.target.src = '/assets/images/placeholder-meme.svg';
                          }}
                        />
                        <div>
                          <div className="font-medium text-white text-sm">{token.name}</div>
                          <div className="text-xs text-gray-400">${token.price.toFixed(6)}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${
                        token.priceChange24h >= 0 ? 'price-up' : 'price-down'
                      }`}>
                        {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedToken ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                {/* Token Header */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={selectedToken.logo} 
                        alt={selectedToken.name}
                        className="w-16 h-16 rounded-full"
                        onError={(e) => {
                          e.target.src = '/assets/images/placeholder-meme.svg';
                        }}
                      />
                      <div>
                        <h2 className="text-3xl font-bold text-white">{selectedToken.name}</h2>
                        <p className="text-gray-400">#{selectedToken.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleFavorite(selectedToken.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          favorites.includes(selectedToken.id)
                            ? 'text-yellow-500 bg-yellow-500/20'
                            : 'text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <StarIcon className="w-6 h-6" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-white/10 rounded-lg transition-colors">
                        <ShareIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-4xl font-bold text-white mb-2">
                        ${selectedToken.price.toFixed(6)}
                      </div>
                      <div className="flex items-center gap-4">
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
                    <div className="flex items-center justify-end">
                      <div className={`text-2xl font-bold flex items-center gap-2 ${
                        getPriceChange(selectedToken) >= 0 ? 'price-up' : 'price-down'
                      }`}>
                        {getPriceChange(selectedToken) >= 0 ? (
                          <ArrowTrendingUpIcon className="w-6 h-6" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-6 h-6" />
                        )}
                        {getPriceChange(selectedToken) >= 0 ? '+' : ''}{getPriceChange(selectedToken).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Key Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Market Cap', value: `$${formatNumber(selectedToken.marketCap)}`, icon: CurrencyDollarIcon },
                      { label: '24h Volume', value: `$${formatNumber(selectedToken.volume24h)}`, icon: ChartBarIcon },
                      { label: 'Holders', value: formatNumber(selectedToken.holders), icon: UserGroupIcon },
                      { label: 'Transactions', value: formatNumber(selectedToken.transactions24h), icon: ArrowTrendingUpIcon }
                    ].map((metric) => (
                      <div key={metric.label} className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                          <metric.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-lg font-bold text-white">{metric.value}</div>
                        <div className="text-sm text-gray-400">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Analytics */}
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Detailed Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">All Time High:</span>
                        <span className="text-white font-medium">${selectedToken.allTimeHigh.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">All Time Low:</span>
                        <span className="text-white font-medium">${selectedToken.allTimeLow.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Circulating Supply:</span>
                        <span className="text-white font-medium">{formatNumber(selectedToken.circulatingSupply)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Supply:</span>
                        <span className="text-white font-medium">{formatNumber(selectedToken.totalSupply)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Burned Tokens:</span>
                        <span className="text-white font-medium">{formatNumber(selectedToken.burnedTokens)}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Liquidity:</span>
                        <span className="text-white font-medium">${formatNumber(selectedToken.liquidity)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fully Diluted Value:</span>
                        <span className="text-white font-medium">${formatNumber(selectedToken.fullyDilutedValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white font-medium">{selectedToken.createdAt.toDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className={`font-medium ${getRiskColor(selectedToken.risk)}`}>
                          {selectedToken.risk.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description & Links */}
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4">About {selectedToken.name}</h3>
                  <p className="text-gray-300 mb-6">{selectedToken.description}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <a href={selectedToken.website} target="_blank" rel="noopener noreferrer" 
                       className="btn-secondary px-4 py-2 text-sm">
                      🌐 Website
                    </a>
                    <a href={`https://twitter.com/${selectedToken.twitter}`} target="_blank" rel="noopener noreferrer"
                       className="btn-secondary px-4 py-2 text-sm">
                      🐦 Twitter
                    </a>
                    <a href={`https://${selectedToken.telegram}`} target="_blank" rel="noopener noreferrer"
                       className="btn-secondary px-4 py-2 text-sm">
                      💬 Telegram
                    </a>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="btn-primary px-6 py-3">
                      Trade Now
                    </button>
                    <button className="btn-secondary px-6 py-3">
                      Add to Watchlist
                    </button>
                    <button className="btn-secondary px-6 py-3">
                      View Chart
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center"
              >
                <ChartBarIcon className="w-24 h-24 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-bold text-white mb-4">Select a Token</h3>
                <p className="text-gray-400">
                  Choose a token from the list to view detailed price analytics and market data
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceChecker;
