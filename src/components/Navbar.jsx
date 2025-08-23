import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDownIcon, UserCircleIcon, WalletIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import WalletConnectModal from './WalletConnectModal';
import { useMockWallet } from '../hooks/useMockWallet';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { isConnected, address, hatPoints, connect, disconnect } = useMockWallet();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.img
              src="/assets/images/wif-logo.svg"
              alt="WIF Logo"
              className="h-10 w-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <span className="text-2xl font-bold text-meme-black font-comic">WIF Ecosystem</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* WIF Pad Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-meme-black hover:text-primary-pink transition-colors font-comic">
                <span>WIF Pad</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-pink-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/pad" className="block px-4 py-2 text-meme-black hover:bg-pink-50 rounded-t-lg">Launchpad</Link>
                <Link to="/pad/launch/degen" className="block px-4 py-2 text-meme-black hover:bg-pink-50">Degen Launch</Link>
                <Link to="/pad/launch/custom" className="block px-4 py-2 text-meme-black hover:bg-pink-50">Custom Launch</Link>
                <Link to="/pad/my-launches" className="block px-4 py-2 text-meme-black hover:bg-pink-50 rounded-b-lg">My Launches</Link>
              </div>
            </div>

            {/* WIF Trade Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-meme-black hover:text-primary-pink transition-colors font-comic">
                <span>WIF Trade</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-pink-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/trade" className="block px-4 py-2 text-meme-black hover:bg-pink-50 rounded-t-lg">Swap</Link>
                <Link to="/trade/advanced" className="block px-4 py-2 text-meme-black hover:bg-pink-50">Advanced</Link>
                <Link to="/trade/p2p" className="block px-4 py-2 text-meme-black hover:bg-pink-50">P2P Escrow</Link>
                <Link to="/trade/leaderboards" className="block px-4 py-2 text-meme-black hover:bg-pink-50 rounded-b-lg">Leaderboards</Link>
              </div>
            </div>

            {/* WIF Perps Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-meme-black hover:text-primary-pink transition-colors font-comic">
                <span>WIF Perps</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-pink-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/perps" className="block px-4 py-2 text-meme-black hover:bg-pink-50 rounded-t-lg">Markets</Link>
                <Link to="/perps/my-positions" className="block px-4 py-2 text-meme-black hover:bg-pink-50 rounded-b-lg">My Positions</Link>
              </div>
            </div>

            {/* WIF Social Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-meme-black hover:text-primary-pink transition-colors font-comic">
                <span>WIF Social</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-pink-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/social" className="block px-4 py-2 text-meme-black hover:bg-pink-50 rounded-t-lg">Feed</Link>
                <Link to="/social/chats" className="block px-4 py-2 text-meme-black hover:bg-pink-50">Chats</Link>
                <Link to="/social/communities" className="block px-4 py-2 text-meme-black hover:bg-pink-50 rounded-b-lg">Communities</Link>
              </div>
            </div>

            {/* Other Links */}
            <Link to="/staking" className="text-meme-black hover:text-primary-pink transition-colors font-comic">Staking</Link>
            <Link to="/telegram-bot" className="text-meme-black hover:text-primary-pink transition-colors font-comic">Telegram Bot</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Hat Points */}
            {isConnected && (
              <div className="hidden md:flex items-center space-x-2 bg-pastel-yellow px-3 py-2 rounded-full">
                <span className="text-sm font-comic text-meme-black">🎩 {hatPoints}</span>
              </div>
            )}

            {/* Wallet Button */}
            <button
              onClick={() => setShowWalletModal(true)}
              className="bg-primary-pink hover:bg-pink-600 text-white px-4 py-2 rounded-full font-comic transition-colors flex items-center space-x-2"
            >
              <WalletIcon className="h-5 w-5" />
              <span>{isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-meme-black hover:text-primary-pink"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-pink-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/pad" className="block px-3 py-2 text-meme-black hover:bg-pink-50 rounded-md">WIF Pad</Link>
              <Link to="/trade" className="block px-3 py-2 text-meme-black hover:bg-pink-50 rounded-md">WIF Trade</Link>
              <Link to="/perps" className="block px-3 py-2 text-meme-black hover:bg-pink-50 rounded-md">WIF Perps</Link>
              <Link to="/social" className="block px-3 py-2 text-meme-black hover:bg-pink-50 rounded-md">WIF Social</Link>
              <Link to="/staking" className="block px-3 py-2 text-meme-black hover:bg-pink-50 rounded-md">Staking</Link>
              <Link to="/telegram-bot" className="block px-3 py-2 text-meme-black hover:bg-pink-50 rounded-md">Telegram Bot</Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={connect}
      />
    </nav>
  );
};

export default Navbar;
