import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CogIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  FireIcon,
  StarIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const CustomLaunch = () => {
  const tokens = useMockData('mock-tokens.json');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    description: '',
    totalSupply: '',
    initialPrice: '',
    bondingCurve: 'linear',
    launchType: 'fair',
    vestingSchedule: 'none',
    antiBot: false,
    maxTransaction: '',
    maxWallet: '',
    marketingWallet: '',
    teamWallet: '',
    liquidityLock: '30',
    presale: false,
    presalePrice: '',
    presaleAmount: '',
    presaleStart: '',
    presaleEnd: ''
  });

  const bondingCurves = [
    { id: 'linear', name: 'Linear', description: 'Standard linear bonding curve' },
    { id: 'exponential', name: 'Exponential', description: 'Exponential price growth' },
    { id: 'polynomial', name: 'Polynomial', description: 'Polynomial price curve' },
    { id: 'custom', name: 'Custom', description: 'Custom mathematical formula' }
  ];

  const launchTypes = [
    { id: 'fair', name: 'Fair Launch', description: 'No presale, equal opportunity' },
    { id: 'presale', name: 'Presale', description: 'Private sale before public launch' },
    { id: 'whitelist', name: 'Whitelist', description: 'Restricted to approved addresses' },
    { id: 'auction', name: 'Dutch Auction', description: 'Price discovery through bidding' }
  ];

  const vestingSchedules = [
    { id: 'none', name: 'No Vesting', description: 'Immediate full access' },
    { id: 'linear', name: 'Linear Vesting', description: 'Gradual release over time' },
    { id: 'cliff', name: 'Cliff Vesting', description: 'Locked then sudden release' },
    { id: 'custom', name: 'Custom Schedule', description: 'Define your own rules' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    
    // Simulate launch process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsLaunching(false);
    setShowSuccess(true);
  };

  const calculateLaunchCost = () => {
    const baseCost = 0.1; // Base SOL cost
    const supplyCost = parseFloat(formData.totalSupply) / 1000000 * 0.01; // Cost per million tokens
    const curveCost = formData.bondingCurve === 'custom' ? 0.05 : 0;
    const vestingCost = formData.vestingSchedule !== 'none' ? 0.03 : 0;
    const antiBotCost = formData.antiBot ? 0.02 : 0;
    
    return (baseCost + supplyCost + curveCost + vestingCost + antiBotCost).toFixed(4);
  };

  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (step, status) => {
    if (status === 'completed') return CheckCircleIcon;
    if (status === 'current') return CogIcon;
    return StarIcon;
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Custom Launch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced token creation with custom bonding curves, vesting schedules, and anti-bot protection
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
            {[
              { step: 1, name: 'Token Basics', description: 'Name, symbol, supply' },
              { step: 2, name: 'Launch Settings', description: 'Price, curve, type' },
              { step: 3, name: 'Advanced Features', description: 'Vesting, anti-bot' },
              { step: 4, name: 'Review & Deploy', description: 'Finalize launch' }
            ].map((stepInfo) => {
              const status = getStepStatus(stepInfo.step);
              const Icon = getStepIcon(stepInfo.step, status);
              
              return (
                <div key={stepInfo.step} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    status === 'current' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    'bg-white/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      status === 'completed' ? 'text-white' :
                      status === 'current' ? 'text-white' :
                      'text-gray-400'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <div className={`font-medium ${
                      status === 'completed' ? 'text-white' :
                      status === 'current' ? 'text-white' :
                      'text-gray-400'
                    }`}>
                      {stepInfo.name}
                    </div>
                    <div className="text-sm text-gray-500">{stepInfo.description}</div>
                  </div>
                  {stepInfo.step < 4 && (
                    <ArrowRightIcon className="w-5 h-5 text-gray-500 mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Token Basics</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Token Name</label>
                      <input
                        type="text"
                        value={formData.tokenName}
                        onChange={(e) => handleInputChange('tokenName', e.target.value)}
                        placeholder="e.g., My Awesome Token"
                        className="input-modern w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Token Symbol</label>
                      <input
                        type="text"
                        value={formData.tokenSymbol}
                        onChange={(e) => handleInputChange('tokenSymbol', e.target.value)}
                        placeholder="e.g., MAT"
                        className="input-modern w-full"
                        maxLength={10}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your token's purpose and features..."
                        rows={4}
                        className="input-modern w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Total Supply</label>
                      <input
                        type="number"
                        value={formData.totalSupply}
                        onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                        placeholder="e.g., 1000000000"
                        className="input-modern w-full"
                      />
                      <p className="text-sm text-gray-400 mt-1">Total number of tokens that will ever exist</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Launch Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Initial Price (SOL)</label>
                      <input
                        type="number"
                        value={formData.initialPrice}
                        onChange={(e) => handleInputChange('initialPrice', e.target.value)}
                        placeholder="e.g., 0.001"
                        step="0.000001"
                        className="input-modern w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bonding Curve</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {bondingCurves.map((curve) => (
                          <button
                            key={curve.id}
                            onClick={() => handleInputChange('bondingCurve', curve.id)}
                            className={`p-4 rounded-lg text-left transition-all duration-200 ${
                              formData.bondingCurve === curve.id
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            <div className="font-semibold">{curve.name}</div>
                            <div className="text-sm opacity-80">{curve.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Launch Type</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {launchTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => handleInputChange('launchType', type.id)}
                            className={`p-4 rounded-lg text-left transition-all duration-200 ${
                              formData.launchType === type.id
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            <div className="font-semibold">{type.name}</div>
                            <div className="text-sm opacity-80">{type.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.launchType === 'presale' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Presale Price (SOL)</label>
                          <input
                            type="number"
                            value={formData.presalePrice}
                            onChange={(e) => handleInputChange('presalePrice', e.target.value)}
                            placeholder="e.g., 0.0005"
                            className="input-modern w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Presale Amount</label>
                          <input
                            type="number"
                            value={formData.presaleAmount}
                            onChange={(e) => handleInputChange('presaleAmount', e.target.value)}
                            placeholder="e.g., 10000000"
                            className="input-modern w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Advanced Features</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Vesting Schedule</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {vestingSchedules.map((schedule) => (
                          <button
                            key={schedule.id}
                            onClick={() => handleInputChange('vestingSchedule', schedule.id)}
                            className={`p-4 rounded-lg text-left transition-all duration-200 ${
                              formData.vestingSchedule === schedule.id
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            <div className="font-semibold">{schedule.name}</div>
                            <div className="text-sm opacity-80">{schedule.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="font-medium text-white">Anti-Bot Protection</div>
                        <div className="text-sm text-gray-400">Prevent bot manipulation and MEV attacks</div>
                      </div>
                      <button
                        onClick={() => handleInputChange('antiBot', !formData.antiBot)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          formData.antiBot ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          formData.antiBot ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Max Transaction (%)</label>
                        <input
                          type="number"
                          value={formData.maxTransaction}
                          onChange={(e) => handleInputChange('maxTransaction', e.target.value)}
                          placeholder="e.g., 5"
                          className="input-modern w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Max Wallet (%)</label>
                        <input
                          type="number"
                          value={formData.maxWallet}
                          onChange={(e) => handleInputChange('maxWallet', e.target.value)}
                          placeholder="e.g., 10"
                          className="input-modern w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Liquidity Lock (Days)</label>
                      <select
                        value={formData.liquidityLock}
                        onChange={(e) => handleInputChange('liquidityLock', e.target.value)}
                        className="input-modern w-full"
                      >
                        <option value="0">No Lock</option>
                        <option value="30">30 Days</option>
                        <option value="90">90 Days</option>
                        <option value="180">180 Days</option>
                        <option value="365">1 Year</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Review & Deploy</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Token Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Name:</span>
                            <span className="text-white">{formData.tokenName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Symbol:</span>
                            <span className="text-white">{formData.tokenSymbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Supply:</span>
                            <span className="text-white">{formData.totalSupply}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Initial Price:</span>
                            <span className="text-white">{formData.initialPrice} SOL</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Launch Settings</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Bonding Curve:</span>
                            <span className="text-white capitalize">{formData.bondingCurve}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Launch Type:</span>
                            <span className="text-white capitalize">{formData.launchType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Vesting:</span>
                            <span className="text-white capitalize">{formData.vestingSchedule}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Anti-Bot:</span>
                            <span className="text-white">{formData.antiBot ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold text-white">Launch Cost</div>
                          <div className="text-sm text-gray-400">Total SOL required to deploy</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{calculateLaunchCost()} SOL</div>
                          <div className="text-sm text-gray-400">≈ ${(parseFloat(calculateLaunchCost()) * 100).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                      <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                      <div className="text-sm text-yellow-400">
                        <strong>Important:</strong> Make sure all details are correct before launching. 
                        Token creation cannot be undone once deployed to the blockchain.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="btn-primary px-6 py-3"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleLaunch}
                  disabled={isLaunching}
                  className="btn-primary px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLaunching ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Launching...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <BoltIcon className="w-5 h-5" />
                      Launch Token
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Launch Cost Calculator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Launch Cost Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Base Cost:</span>
                  <span className="text-white">0.1 SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Supply Cost:</span>
                  <span className="text-white">{(parseFloat(formData.totalSupply || 0) / 1000000 * 0.01).toFixed(4)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Curve Cost:</span>
                  <span className="text-white">{formData.bondingCurve === 'custom' ? '0.05 SOL' : '0 SOL'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vesting Cost:</span>
                  <span className="text-white">{formData.vestingSchedule !== 'none' ? '0.03 SOL' : '0 SOL'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Anti-Bot Cost:</span>
                  <span className="text-white">{formData.antiBot ? '0.02 SOL' : '0 SOL'}</span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Total:</span>
                    <span className="text-white">{calculateLaunchCost()} SOL</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Features Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Features Guide</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <FireIcon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Custom bonding curves for unique price discovery</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Anti-bot protection and MEV resistance</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChartBarIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Flexible vesting schedules for team tokens</span>
                </div>
                <div className="flex items-start gap-2">
                  <StarIcon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Professional-grade tokenomics and security</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

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
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircleIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Token Launched Successfully! 🎉</h2>
                <p className="text-gray-300 mb-6">
                  Your token "{formData.tokenName}" has been deployed to the Solana blockchain
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Token Address: {formData.tokenSymbol}...</p>
                  <p>Transaction Hash: 0x1234...5678</p>
                  <p>Launch Cost: {calculateLaunchCost()} SOL</p>
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

export default CustomLaunch;
