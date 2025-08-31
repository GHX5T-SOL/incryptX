import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';
import HolographicCard from '../../components/HolographicCard.jsx';
import HoloButton from '../../components/HoloButton.jsx';

const PerpMarket = () => {
  const { id } = useParams();
  const tokens = useMockData('mock-tokens.json');
  const [token, setToken] = useState(null);
  const [leverage, setLeverage] = useState(10);
  const [direction, setDirection] = useState('long');
  const [amount, setAmount] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [livePnL, setLivePnL] = useState(0);
  const [marketData, setMarketData] = useState({
    price: 0,
    change24h: 0,
    volume24h: 0,
    openInterest: 0,
    fundingRate: 0
  });

  useEffect(() => {
    const foundToken = tokens.find(t => t.id === id) || tokens[0];
    setToken(foundToken);

    const price = Math.random() * 0.1 + 0.001;
    setMarketData({
      price,
      change24h: Math.random() > 0.5 ? Math.random() * 15 : -Math.random() * 15,
      volume24h: Math.random() * 10000000 + 1000000,
      openInterest: Math.random() * 5000000 + 500000,
      fundingRate: (Math.random() - 0.5) * 0.1
    });

    const interval = setInterval(() => {
      setLivePnL(prev => prev + (Math.random() - 0.5) * 10);
    }, 2000);

    return () => clearInterval(interval);
  }, [id, tokens]);

  const handleOpenPosition = () => {
    setShowOrderModal(true);
  };

  const confirmOrder = () => {
    alert(`Opened ${direction} position: ${amount} ${token?.name} at ${leverage}x leverage`);
    setShowOrderModal(false);
    setAmount('');
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getPnLColor = (value) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  if (!token) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{token.name} Perpetual</span>
          </h1>
          <p className="text-xl text-gray-300">Trade {token.name} with up to 100x leverage</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <HolographicCard>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">${marketData.price.toFixed(6)}</div>
              <div className="text-sm text-gray-400">Mark Price</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getPnLColor(marketData.change24h)}`}>
                {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-400">24h Change</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">${formatNumber(marketData.volume24h)}</div>
              <div className="text-sm text-gray-400">24h Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">${formatNumber(marketData.openInterest)}</div>
              <div className="text-sm text-gray-400">Open Interest</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getPnLColor(marketData.fundingRate)}`}>
                {marketData.fundingRate >= 0 ? '+' : ''}{(marketData.fundingRate * 100).toFixed(4)}%
              </div>
              <div className="text-sm text-gray-400">Funding Rate</div>
            </div>
          </div>
          </HolographicCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <HolographicCard>
              <h2 className="text-2xl font-bold text-white mb-6">Open Position</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setDirection('long')}
                  className={`p-4 rounded-lg font-semibold transition-all duration-200 ${
                    direction === 'long'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <ArrowTrendingUpIcon className="w-6 h-6 mx-auto mb-2" />
                  Long
                </button>
                <button
                  onClick={() => setDirection('short')}
                  className={`p-4 rounded-lg font-semibold transition-all duration-200 ${
                    direction === 'short'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <ArrowTrendingDownIcon className="w-6 h-6 mx-auto mb-2" />
                  Short
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Leverage: {leverage}x
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1x</span>
                  <span>25x</span>
                  <span>50x</span>
                  <span>100x</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount ({token.name})</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-modern w-full"
                />
              </div>

              <HoloButton
                onClick={handleOpenPosition}
                className={`w-full justify-center py-4 text-lg ${direction === 'long' ? '' : ''}`}
                disabled={!amount}
              >
                Open {direction.toUpperCase()} Position
              </HoloButton>
              </HolographicCard>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <HolographicCard>
              <h3 className="text-lg font-bold text-white mb-4">Live Portfolio PnL</h3>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getPnLColor(livePnL)}`}>
                  {livePnL >= 0 ? '+' : ''}${livePnL.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400 mt-1">Unrealized PnL</div>
              </div>
              </HolographicCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <HolographicCard>
              <div className="flex items-center gap-3 mb-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-bold text-white">Risk Warning</h3>
              </div>
              <div className="text-sm text-gray-300 space-y-2">
                <p>• Perpetual trading involves significant risk</p>
                <p>• High leverage amplifies gains and losses</p>
                <p>• Monitor positions to avoid liquidation</p>
              </div>
              </HolographicCard>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showOrderModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowOrderModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="modal-content p-8 max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    direction === 'long' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}>
                    {direction === 'long' ? (
                      <ArrowTrendingUpIcon className="w-10 h-10 text-white" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Confirm Order</h2>
                  <p className="text-gray-300">
                    {direction.toUpperCase()} {amount} {token.name} at {leverage}x leverage
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmOrder}
                    className="flex-1 btn-primary px-6 py-3"
                  >
                    Confirm Order
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

export default PerpMarket;