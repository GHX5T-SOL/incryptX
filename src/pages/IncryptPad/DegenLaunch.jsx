import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FireIcon, 
  RocketLaunchIcon, 
  SparklesIcon,
  PhotoIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { simulateLaunch } from '../../hooks/useMockAPI';

const DegenLaunch = () => {
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    description: '',
    memeImage: null,
    initialBuy: 0.1,
    useAI: false
  });
  const [isLaunching, setIsLaunching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [step, setStep] = useState(1);



  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateAISuggestions = () => {
    const suggestions = [
      { name: 'CatWifLaser', symbol: 'CWL', description: 'A cat wearing a laser hat, ready to conquer the universe!' },
      { name: 'DogeWifRocket', symbol: 'DWR', description: 'Doge astronaut exploring the cosmos with style' },
      { name: 'PepWifNinja', symbol: 'PWN', description: 'Stealthy Pep with ninja skills and meme power' },
      { name: 'BonkWifHat', symbol: 'BWH', description: 'Bonk with the coolest hat collection in crypto' },
      { name: 'SolWifDragon', symbol: 'SWD', description: 'Solana dragon breathing fire and memes' }
    ];
    setAiSuggestions(suggestions);
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      await simulateLaunch(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Launch failed:', error);
    } finally {
      setIsLaunching(false);
    }
  };

  const useAISuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      tokenName: suggestion.name,
      tokenSymbol: suggestion.symbol,
      description: suggestion.description
    }));
    setStep(2);
  };

  const steps = [
    { id: 1, title: 'AI Suggestions', icon: SparklesIcon },
    { id: 2, title: 'Token Details', icon: RocketLaunchIcon },
    { id: 3, title: 'Launch Settings', icon: FireIcon },
    { id: 4, title: 'Review & Deploy', icon: ChartBarIcon }
  ];

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Degen</span> Launch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Launch your memecoin in under 30 seconds. No coding required, just pure degen energy! 🚀
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  step >= stepItem.id 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-white/10'
                }`}>
                  <stepItem.icon className={`w-6 h-6 ${
                    step >= stepItem.id ? 'text-white' : 'text-gray-400'
                  }`} />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step > stepItem.id ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step 1: AI Suggestions */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">AI-Powered Suggestions</h2>
              <p className="text-gray-300">Let our AI help you create the perfect memecoin name and description</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {aiSuggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card glass-card-hover p-6 cursor-pointer"
                  onClick={() => useAISuggestion(suggestion)}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{suggestion.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{suggestion.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">${suggestion.symbol}</p>
                    <p className="text-sm text-gray-300">{suggestion.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Section */}
            <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Customize Your Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Enter a prompt or link to an X post</label>
                  <textarea
                    placeholder="Describe your memecoin idea, or paste a link to an X post to generate a memecoin based on it..."
                    rows={3}
                    className="input-modern w-full"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-3">
                    💡 Enter a prompt or a link to an X post to generate a memecoin
                  </p>
                  <button
                    onClick={generateAISuggestions}
                    className="btn-primary px-8 py-3 text-lg flex items-center gap-2 mx-auto"
                  >
                    <LightBulbIcon className="w-6 h-6" />
                    Generate AI Suggestions
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Token Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <RocketLaunchIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Token Details</h2>
              <p className="text-gray-300">Customize your token name, symbol, and description</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Token Name</label>
                <input
                  type="text"
                  value={formData.tokenName}
                  onChange={(e) => handleInputChange('tokenName', e.target.value)}
                  placeholder="e.g., CatWifLaser"
                  className="input-modern w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Token Symbol</label>
                <input
                  type="text"
                  value={formData.tokenSymbol}
                  onChange={(e) => handleInputChange('tokenSymbol', e.target.value)}
                  placeholder="e.g., CWL"
                  className="input-modern w-full"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your memecoin..."
                  rows={4}
                  className="input-modern w-full resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Meme Image</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors cursor-pointer">
                  <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.tokenName || !formData.tokenSymbol}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Launch Settings */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <FireIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Launch Settings</h2>
              <p className="text-gray-300">Configure your launch parameters for maximum success</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Initial Buy Amount (SOL)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.initialBuy}
                    onChange={(e) => handleInputChange('initialBuy', parseFloat(e.target.value))}
                    step="0.1"
                    min="0.1"
                    className="input-modern w-full pr-16"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    SOL
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Minimum 0.1 SOL to start the curve</p>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Launch Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token Supply:</span>
                    <span className="text-white">1,000,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Initial MC:</span>
                    <span className="text-white">$1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bonding Curve:</span>
                    <span className="text-white">Linear</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Migration MC:</span>
                    <span className="text-white">$69,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform Fee:</span>
                    <span className="text-white">0.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax:</span>
                    <span className="text-white">0%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="useAI"
                  checked={formData.useAI}
                  onChange={(e) => handleInputChange('useAI', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="useAI" className="text-sm text-gray-300">
                  Use AI to optimize launch timing and marketing strategy
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="btn-primary px-8 py-3"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review & Deploy */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <ChartBarIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Review & Deploy</h2>
              <p className="text-gray-300">Review your token details and launch to the moon! 🚀</p>
            </div>

            <div className="glass-card p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Token Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{formData.tokenName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Symbol:</span>
                  <span className="text-white">${formData.tokenSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Description:</span>
                  <span className="text-white">{formData.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Initial Buy:</span>
                  <span className="text-white">{formData.initialBuy} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Supply:</span>
                  <span className="text-white">1,000,000,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Optimization:</span>
                  <span className="text-white">{formData.useAI ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleLaunch}
                disabled={isLaunching}
                className="btn-primary px-12 py-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLaunching ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Launching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FireIcon className="w-6 h-6" />
                    Launch Token
                  </span>
                )}
              </button>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="glass-card p-12 text-center max-w-md mx-4"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <FireIcon className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">🚀 Launch Successful!</h2>
                <p className="text-gray-300 mb-6">
                  Your token <span className="text-white font-semibold">{formData.tokenName}</span> has been launched successfully!
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Token Address: 0x1234...5678</p>
                  <p>Initial Market Cap: $1,000</p>
                  <p>Launch Time: {new Date().toLocaleTimeString()}</p>
                </div>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="btn-primary mt-6 px-8 py-3"
                >
                  View Token
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DegenLaunch;
