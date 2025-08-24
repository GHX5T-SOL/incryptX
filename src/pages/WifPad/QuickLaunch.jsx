import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RocketLaunchIcon,
  PhotoIcon,
  LinkIcon,
  CurrencyDollarIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
// import useMockAPI from '../../hooks/useMockAPI';

const QuickLaunch = () => {
  const [formData, setFormData] = useState({
    coinName: '',
    ticker: '',
    description: '',
    website: '',
    telegram: '',
    twitter: '',
    discord: '',
    initialBuy: 0.1
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLaunching(true);
    
    // Simulate launch process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLaunching(false);
    setShowSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        coinName: '',
        ticker: '',
        description: '',
        website: '',
        telegram: '',
        twitter: '',
        discord: '',
        initialBuy: 0.1
      });
      setLogoFile(null);
      setLogoPreview(null);
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
            <span className="gradient-text">Quick Launch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Launch your memecoin in minutes with our streamlined process
          </p>
        </motion.div>

        {/* Launch Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Coin Name *
                </label>
                <input
                  type="text"
                  name="coinName"
                  value={formData.coinName}
                  onChange={handleInputChange}
                  required
                  className="input-modern w-full"
                  placeholder="e.g., CatWifHat"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ticker Symbol *
                </label>
                <input
                  type="text"
                  name="ticker"
                  value={formData.ticker}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                  className="input-modern w-full"
                  placeholder="e.g., CWIF"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="input-modern w-full"
                placeholder="Describe your memecoin..."
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Logo Upload
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition-colors"
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </label>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">
                    Upload a logo for your token (PNG, JPG, SVG)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 512x512px, transparent background
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Social Links (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <LinkIcon className="w-5 h-5 text-blue-400" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="input-modern flex-1"
                    placeholder="Website URL"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className="input-modern flex-1"
                    placeholder="Twitter/X URL"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <input
                    type="url"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleInputChange}
                    className="input-modern flex-1"
                    placeholder="Telegram URL"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">D</span>
                  </div>
                  <input
                    type="url"
                    name="discord"
                    value={formData.discord}
                    onChange={handleInputChange}
                    className="input-modern flex-1"
                    placeholder="Discord URL"
                  />
                </div>
              </div>
            </div>

            {/* Initial Buy */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Initial Buy Amount (SOL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="initialBuy"
                  value={formData.initialBuy}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  className="input-modern w-full pr-20"
                  placeholder="0.1"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  SOL
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                This will be your first purchase to seed the bonding curve
              </p>
            </div>

            {/* Launch Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLaunching || !formData.coinName || !formData.ticker}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLaunching ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Launching...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <RocketLaunchIcon className="w-6 h-6" />
                    <span>Launch Token</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </motion.div>

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
                className="modal-content p-8 max-w-md mx-4 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <SparklesIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Token Launched!</h2>
                <p className="text-gray-300 mb-4">
                  Your memecoin "{formData.coinName}" has been successfully launched!
                </p>
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-300">
                    <strong>Name:</strong> {formData.coinName}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong>Ticker:</strong> {formData.ticker}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong>Initial Buy:</strong> {formData.initialBuy} SOL
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="btn-primary px-8 py-3"
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

export default QuickLaunch;
