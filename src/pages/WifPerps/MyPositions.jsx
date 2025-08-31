import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  XMarkIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import HolographicCard from '../../components/HolographicCard.jsx';
import HoloButton from '../../components/HoloButton.jsx';

const MyPositions = () => {
  const [myPositions, setMyPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showCloseModal, setShowCloseModal] = useState(false);

  useEffect(() => {
    const mockPositions = [
      {
        id: 1,
        market: 'CatWifHat',
        direction: 'long',
        size: 10000,
        entryPrice: 0.023,
        markPrice: 0.025,
        leverage: 10,
        margin: 23.0,
        unrealizedPnL: 200.0,
        unrealizedPnLPercent: 8.7,
        liquidationPrice: 0.0207,
        openTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'open'
      },
      {
        id: 2,
        market: 'DogWifLaser',
        direction: 'short',
        size: 5000,
        entryPrice: 0.018,
        markPrice: 0.015,
        leverage: 20,
        margin: 4.5,
        unrealizedPnL: 150.0,
        unrealizedPnLPercent: 33.3,
        liquidationPrice: 0.0225,
        openTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'open'
      }
    ];
    setMyPositions(mockPositions);
  }, []);

  const handleClosePosition = (position) => {
    setSelectedPosition(position);
    setShowCloseModal(true);
  };

  const confirmClose = () => {
    setMyPositions(prev => prev.filter(p => p.id !== selectedPosition.id));
    alert(`Closed ${selectedPosition.market} position`);
    setShowCloseModal(false);
    setSelectedPosition(null);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getPnLColor = (value) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getDirectionColor = (direction) => {
    return direction === 'long' ? 'text-green-400' : 'text-red-400';
  };

  const totalStats = {
    totalPnL: myPositions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0),
    totalMargin: myPositions.reduce((sum, pos) => sum + pos.margin, 0),
    totalPositions: myPositions.length,
    profitablePositions: myPositions.filter(pos => pos.unrealizedPnL > 0).length
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">My Positions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor and manage your perpetual trading positions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total PnL', value: `${totalStats.totalPnL >= 0 ? '+' : ''}$${totalStats.totalPnL.toFixed(2)}`, icon: ChartBarIcon },
            { label: 'Total Margin', value: `$${formatNumber(totalStats.totalMargin)}`, icon: CurrencyDollarIcon },
            { label: 'Open Positions', value: totalStats.totalPositions, icon: ChartBarIcon },
            { label: 'Profitable', value: `${totalStats.profitablePositions}/${totalStats.totalPositions}`, icon: ArrowTrendingUpIcon }
          ].map((stat, index) => (
            <HolographicCard key={stat.label} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </HolographicCard>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <HolographicCard>
          <h2 className="text-2xl font-bold text-white mb-6">Open Positions</h2>
          
          {myPositions.length === 0 ? (
            <div className="text-center py-16">
              <ChartBarIcon className="w-24 h-24 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Open Positions</h3>
              <p className="text-gray-400 mb-6">You don't have any open perpetual positions yet.</p>
              <HoloButton className="px-8 py-3 text-lg">Open Your First Position</HoloButton>
            </div>
          ) : (
            <div className="space-y-4">
              {myPositions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${position.direction === 'long' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="font-semibold text-white">{position.market}</div>
                          <div className={`text-sm font-medium ${getDirectionColor(position.direction)}`}>
                            {position.leverage}x {position.direction.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-1 text-center lg:text-left">
                      <div className="text-white font-medium">{formatNumber(position.size)}</div>
                      <div className="text-sm text-gray-400">Size</div>
                    </div>

                    <div className="lg:col-span-1 text-center lg:text-left">
                      <div className="text-white font-medium">${position.entryPrice.toFixed(6)}</div>
                      <div className="text-sm text-gray-400">Entry</div>
                    </div>

                    <div className="lg:col-span-1 text-center lg:text-left">
                      <div className="text-white font-medium">${position.markPrice.toFixed(6)}</div>
                      <div className="text-sm text-gray-400">Mark Price</div>
                    </div>

                    <div className="lg:col-span-1 text-center lg:text-left">
                      <div className={`text-xl font-bold ${getPnLColor(position.unrealizedPnL)}`}>
                        {position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
                      </div>
                      <div className={`text-sm ${getPnLColor(position.unrealizedPnLPercent)}`}>
                        {position.unrealizedPnLPercent >= 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%
                      </div>
                    </div>

                    <div className="lg:col-span-1 flex gap-2 justify-center lg:justify-end">
                      <button
                        onClick={() => handleClosePosition(position)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          </HolographicCard>
        </motion.div>

        <AnimatePresence>
          {showCloseModal && selectedPosition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowCloseModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="modal-content p-8 max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                    <XMarkIcon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Close Position</h2>
                  <p className="text-gray-300">
                    Close your {selectedPosition.market} position?
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCloseModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmClose}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Close Position
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

export default MyPositions;