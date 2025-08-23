import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  FireIcon,
  StarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const P2PEscrow = () => {
  const tokens = useMockData('mock-tokens.json');
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [escrowOrders, setEscrowOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const enhancedTokens = tokens.slice(0, 12).map((token, index) => ({
    ...token,
    logo: token.name === 'CatWifHat' ? '/assets/images/catwifhat.svg' : 
          token.name === 'DogWifLaser' ? '/assets/images/dogwiflaser.svg' : 
          '/assets/images/placeholder-meme.svg',
    price: Math.random() * 0.1 + 0.001,
    priceChange: Math.random() > 0.5 ? Math.random() * 100 : -Math.random() * 50,
    volume24h: Math.random() * 1000000
  }));

  const mockEscrowOrders = [
    {
      id: 1,
      token: 'CatWifHat',
      side: 'sell',
      amount: '1000',
      price: '0.023',
      seller: 'CryptoWhale',
      rating: 4.9,
      orders: 127,
      time: '2 min ago',
      escrowFee: '0.5%'
    },
    {
      id: 2,
      token: 'DogWifLaser',
      side: 'buy',
      amount: '500',
      price: '0.015',
      buyer: 'MemeLord',
      rating: 4.7,
      orders: 89,
      time: '5 min ago',
      escrowFee: '0.5%'
    },
    {
      id: 3,
      token: 'BunnyWifHat',
      side: 'sell',
      amount: '2000',
      price: '0.008',
      seller: 'WifCollector',
      rating: 4.8,
      orders: 156,
      time: '8 min ago',
      escrowFee: '0.5%'
    }
  ];

  useEffect(() => {
    setEscrowOrders(mockEscrowOrders);
    setMyOrders([
      {
        id: 1,
        token: 'CatWifHat',
        side: 'buy',
        amount: '500',
        price: '0.022',
        status: 'pending',
        time: '1 hour ago',
        counterparty: 'CryptoWhale'
      }
    ]);
  }, []);

  const handleCreateOrder = () => {
    if (!selectedToken || !amount || !price) return;

    const newOrder = {
      id: Date.now(),
      token: selectedToken.name,
      side: activeTab,
      amount,
      price,
      status: 'active',
      time: 'Just now',
      counterparty: 'You'
    };

    setMyOrders([newOrder, ...myOrders]);
    setShowOrderModal(true);
    setAmount('');
    setPrice('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
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
            <span className="gradient-text">P2P Escrow</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Secure peer-to-peer trading with escrow protection. Trade directly with other users safely.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-2 mb-8 inline-flex rounded-xl"
        >
          {[
            { id: 'buy', name: 'Buy Orders', icon: '🟢' },
            { id: 'sell', name: 'Sell Orders', icon: '🔴' },
            { id: 'my-orders', name: 'My Orders', icon: '📋' },
            { id: 'create', name: 'Create Order', icon: '➕' }
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
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </motion.div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Create Escrow Order</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Token</label>
                    <select
                      value={selectedToken?.id || ''}
                      onChange={(e) => setSelectedToken(tokens.find(t => t.id.toString() === e.target.value))}
                      className="input-modern w-full"
                    >
                      <option value="">Select a token</option>
                      {enhancedTokens.map(token => (
                        <option key={token.id} value={token.id}>
                          {token.name} - ${token.price.toFixed(6)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Order Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab('buy')}
                        className="flex-1 py-3 px-4 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                      >
                        Buy Order
                      </button>
                      <button
                        onClick={() => setActiveTab('sell')}
                        className="flex-1 py-3 px-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        Sell Order
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.0"
                        className="input-modern w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Price (SOL)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.0"
                        className="input-modern w-full"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreateOrder}
                    disabled={!selectedToken || !amount || !price}
                    className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Order
                  </button>
                </div>

                {/* Order Preview */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">Order Preview</h3>
                  
                  {selectedToken && amount && price ? (
                    <div className="glass-card p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Token:</span>
                          <span className="text-white font-medium">{selectedToken.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-green-400 font-medium">Buy Order</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount:</span>
                          <span className="text-white font-medium">{amount} {selectedToken.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-white font-medium">{price} SOL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Value:</span>
                          <span className="text-white font-semibold">{(parseFloat(amount) * parseFloat(price)).toFixed(6)} SOL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Escrow Fee:</span>
                          <span className="text-white font-medium">0.5%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card p-6 text-center text-gray-400">
                      Fill in the order details to see preview
                    </div>
                  )}

                  {/* Escrow Benefits */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Escrow Protection</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                        <span>Funds held securely until trade completes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                        <span>Automatic dispute resolution system</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                        <span>Verified user ratings and reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'my-orders' && (
            <motion.div
              key="my-orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6">My Orders</h2>
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${order.side === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="font-semibold text-white">{order.token}</div>
                          <div className="text-sm text-gray-400">{order.side.toUpperCase()} • {order.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{order.amount} @ {order.price} SOL</div>
                        <div className="text-sm text-gray-400">Counterparty: {order.counterparty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                  {myOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No orders yet
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'buy' || activeTab === 'sell') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {activeTab === 'buy' ? 'Buy' : 'Sell'} Orders
                </h2>
                <div className="space-y-4">
                  {escrowOrders
                    .filter(order => order.side === activeTab)
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${order.side === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div>
                            <div className="font-semibold text-white">{order.token}</div>
                            <div className="text-sm text-gray-400">{order.side.toUpperCase()} • {order.time}</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-medium">{order.amount} @ {order.price} SOL</div>
                          <div className="text-sm text-gray-400">Total: {(parseFloat(order.amount) * parseFloat(order.price)).toFixed(6)} SOL</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-medium">{order.side === 'buy' ? order.buyer : order.seller}</div>
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <StarIcon className="w-4 h-4 text-yellow-500" />
                            {order.rating} ({order.orders})
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-400">Escrow Fee</div>
                          <div className="text-white font-medium">{order.escrowFee}</div>
                        </div>
                        <button className="btn-primary px-6 py-2">
                          {activeTab === 'buy' ? 'Buy' : 'Sell'}
                        </button>
                      </div>
                    ))}
                  {escrowOrders.filter(order => order.side === activeTab).length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No {activeTab} orders available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Success Modal */}
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
                className="modal-content p-8 max-w-md mx-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircleIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Order Created! 🎉</h2>
                <p className="text-gray-300 mb-6">
                  Your escrow order has been created and is now visible to other traders
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Order ID: #{Date.now()}</p>
                  <p>Token: {selectedToken?.name}</p>
                  <p>Amount: {amount}</p>
                  <p>Price: {price} SOL</p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="btn-primary mt-6 px-8 py-3"
                >
                  View My Orders
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default P2PEscrow;
