import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  FireIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
  CogIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const AdvancedTrade = () => {
  const tokens = useMockData('mock-tokens.json');
  const [selectedToken, setSelectedToken] = useState(null);
  const [orderType, setOrderType] = useState('limit');
  const [side, setSide] = useState('buy');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeTab, setActiveTab] = useState('orderbook');
  const [timeInForce, setTimeInForce] = useState('GTC');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  useEffect(() => {
    if (tokens.length > 0) {
      setSelectedToken(tokens[0]);
    }
  }, [tokens]);

  const orderBookData = [
    { price: 0.0234, amount: 15000, total: 351, side: 'sell' },
    { price: 0.0233, amount: 22000, total: 512.6, side: 'sell' },
    { price: 0.0232, amount: 18000, total: 417.6, side: 'sell' },
    { price: 0.0231, amount: 12000, total: 277.2, side: 'sell' },
    { price: 0.0230, amount: 25000, total: 575, side: 'sell' },
    { price: 0.0229, amount: 30000, total: 687, side: 'buy' },
    { price: 0.0228, amount: 28000, total: 638.4, side: 'buy' },
    { price: 0.0227, amount: 20000, total: 454, side: 'buy' },
    { price: 0.0226, amount: 15000, total: 339, side: 'buy' },
    { price: 0.0225, amount: 35000, total: 787.5, side: 'buy' }
  ];

  const recentTrades = [
    { price: 0.0230, amount: 5000, side: 'sell', time: '12:34:56' },
    { price: 0.0229, amount: 8000, side: 'buy', time: '12:34:45' },
    { price: 0.0231, amount: 3000, side: 'sell', time: '12:34:32' },
    { price: 0.0228, amount: 12000, side: 'buy', time: '12:34:18' },
    { price: 0.0232, amount: 6000, side: 'sell', time: '12:34:05' }
  ];

  const openOrders = [
    { id: 1, token: 'CatWifHat', side: 'buy', type: 'limit', price: 0.0225, amount: 10000, filled: 2500, time: '12:30:00' },
    { id: 2, token: 'CatWifHat', side: 'sell', type: 'stop', price: 0.0240, amount: 5000, filled: 0, time: '12:25:00' }
  ];

  const handlePlaceOrder = () => {
    setShowOrderModal(true);
  };

  const confirmOrder = () => {
    alert(`Order placed: ${side} ${amount} ${selectedToken?.name} at ${price}`);
    setShowOrderModal(false);
    setPrice('');
    setAmount('');
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getSideColor = (side) => {
    return side === 'buy' ? 'text-green-400' : 'text-red-400';
  };

  const getSideBgColor = (side) => {
    return side === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20';
  };

  if (!selectedToken) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading trading data...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Advanced Trading</span>
          </h1>
          <p className="text-xl text-gray-300">Professional trading interface with advanced order types</p>
        </motion.div>

        {/* Token Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={selectedToken.image} 
                alt={selectedToken.name}
                className="w-12 h-12 rounded-full"
                onError={(e) => {
                  e.target.src = '/assets/images/placeholder-meme.svg';
                }}
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedToken.name}</h2>
                <p className="text-gray-400">Market Cap: ${formatNumber(selectedToken.mc)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">$0.0230</div>
              <div className="text-green-400">+2.45%</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Order Form */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Place Order</h3>
              
              {/* Order Type Selection */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => setOrderType('market')}
                  className={`p-3 rounded-lg transition-colors ${
                    orderType === 'market'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Market
                </button>
                <button
                  onClick={() => setOrderType('limit')}
                  className={`p-3 rounded-lg transition-colors ${
                    orderType === 'limit'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Limit
                </button>
              </div>

              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => setSide('buy')}
                  className={`p-3 rounded-lg font-semibold transition-colors ${
                    side === 'buy'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setSide('sell')}
                  className={`p-3 rounded-lg font-semibold transition-colors ${
                    side === 'sell'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  SELL
                </button>
              </div>

              {/* Order Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (USD)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="input-modern w-full"
                    disabled={orderType === 'market'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount ({selectedToken.name})</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="input-modern w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time in Force</label>
                  <select
                    value={timeInForce}
                    onChange={(e) => setTimeInForce(e.target.value)}
                    className="input-modern w-full"
                  >
                    <option value="GTC">Good Till Cancelled</option>
                    <option value="IOC">Immediate or Cancel</option>
                    <option value="FOK">Fill or Kill</option>
                  </select>
                </div>

                {/* Advanced Options */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Stop Loss (USD)</label>
                    <input
                      type="number"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      placeholder="Optional"
                      className="input-modern w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit (USD)</label>
                    <input
                      type="number"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      placeholder="Optional"
                      className="input-modern w-full"
                    />
                  </div>
                </div>

                {/* Order Summary */}
                {amount && price && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Value:</span>
                        <span className="text-white">${(parseFloat(amount || 0) * parseFloat(price || 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fee:</span>
                        <span className="text-white">$0.00</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={!amount || (orderType === 'limit' && !price)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    side === 'buy'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {side.toUpperCase()} {selectedToken.name}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Trading Interface */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-card p-6"
            >
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {[
                  { id: 'orderbook', name: 'Order Book', icon: ChartBarIcon },
                  { id: 'trades', name: 'Recent Trades', icon: ClockIcon },
                  { id: 'orders', name: 'Open Orders', icon: EyeIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Order Book */}
              {activeTab === 'orderbook' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 font-medium mb-3">
                    <div>Price (USD)</div>
                    <div>Amount</div>
                    <div>Total</div>
                  </div>
                  {orderBookData.map((order, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-3 gap-4 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors ${
                        order.side === 'buy' ? 'hover:bg-green-500/10' : 'hover:bg-red-500/10'
                      }`}
                      onClick={() => {
                        setPrice(order.price.toString());
                        setSide(order.side === 'buy' ? 'buy' : 'sell');
                      }}
                    >
                      <div className={getSideColor(order.side)}>${order.price.toFixed(4)}</div>
                      <div className="text-white">{formatNumber(order.amount)}</div>
                      <div className="text-white">${order.total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Trades */}
              {activeTab === 'trades' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 text-sm text-gray-400 font-medium mb-3">
                    <div>Price (USD)</div>
                    <div>Amount</div>
                    <div>Side</div>
                    <div>Time</div>
                  </div>
                  {recentTrades.map((trade, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-2 rounded-lg">
                      <div className="text-white">${trade.price.toFixed(4)}</div>
                      <div className="text-white">{formatNumber(trade.amount)}</div>
                      <div className={getSideColor(trade.side)}>{trade.side.toUpperCase()}</div>
                      <div className="text-gray-400">{trade.time}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Open Orders */}
              {activeTab === 'orders' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-7 gap-4 text-sm text-gray-400 font-medium mb-3">
                    <div>Token</div>
                    <div>Side</div>
                    <div>Type</div>
                    <div>Price</div>
                    <div>Amount</div>
                    <div>Filled</div>
                    <div>Actions</div>
                  </div>
                  {openOrders.map((order) => (
                    <div key={order.id} className="grid grid-cols-7 gap-4 p-2 rounded-lg bg-white/5">
                      <div className="text-white">{order.token}</div>
                      <div className={getSideColor(order.side)}>{order.side.toUpperCase()}</div>
                      <div className="text-white">{order.type}</div>
                      <div className="text-white">${order.price.toFixed(4)}</div>
                      <div className="text-white">{formatNumber(order.amount)}</div>
                      <div className="text-white">{formatNumber(order.filled)}</div>
                      <div>
                        <button className="text-red-400 hover:text-red-300 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Order Confirmation Modal */}
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
                    side === 'buy' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}>
                    {side === 'buy' ? (
                      <ArrowTrendingUpIcon className="w-10 h-10 text-white" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Confirm Order</h2>
                  <p className="text-gray-300">
                    {side.toUpperCase()} {amount} {selectedToken.name}
                  </p>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order Type:</span>
                    <span className="text-white capitalize">{orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white">${price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">{amount} {selectedToken.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Value:</span>
                    <span className="text-white">${(parseFloat(amount || 0) * parseFloat(price || 0)).toFixed(2)}</span>
                  </div>
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
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      side === 'buy'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                    } text-white`}
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

export default AdvancedTrade;
