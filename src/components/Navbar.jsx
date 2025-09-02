import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon, 
  UserCircleIcon, 
  Bars3Icon, 
  XMarkIcon,
  FireIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CogIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// Theme is dark-only; no toggle

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { publicKey, connected } = useWallet();
  

  const toggleMenu = () => setIsOpen(!isOpen);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      };
    }
  }, [isOpen]);

  const navigationItems = [
    {
      name: 'Launchpad',
      icon: FireIcon,
      path: '/pad',
      submenu: [
        { name: 'Launchpad', path: '/pad', icon: FireIcon },
        { name: 'Quick Launch', path: '/pad/quick-launch', icon: FireIcon },
        { name: 'Degen Launch', path: '/pad/launch/degen', icon: FireIcon },
        { name: 'Custom Launch', path: '/pad/launch/custom', icon: FireIcon },
        { name: 'My Launches', path: '/pad/my-launches', icon: FireIcon }
      ]
    },
    {
      name: 'Trade',
      icon: ChartBarIcon,
      path: '/trade',
      submenu: [
        { name: 'Swap', path: '/trade', icon: ChartBarIcon },
        { name: 'Advanced', path: '/trade/advanced', icon: ChartBarIcon },
        { name: 'P2P Escrow', path: '/trade/p2p', icon: ChartBarIcon },
        { name: 'Leaderboards', path: '/trade/leaderboards', icon: ChartBarIcon },
        { name: 'Wallet Tracker', path: '/trade/tracker', icon: ChartBarIcon },
        { name: 'Copy Trading', path: '/trade/copy', icon: ChartBarIcon }
      ]
    },
    {
      name: 'Perps',
      icon: CurrencyDollarIcon,
      path: '/perps',
      submenu: [
        { name: 'Markets', path: '/perps', icon: CurrencyDollarIcon },
        { name: 'My Positions', path: '/perps/positions', icon: CurrencyDollarIcon }
      ]
    },
    {
      name: 'Social',
      icon: UserGroupIcon,
      path: '/social',
      submenu: [
        { name: 'Feed', path: '/social', icon: UserGroupIcon },
        { name: 'Chats', path: '/social/chats', icon: UserGroupIcon },
        { name: 'Communities', path: '/social/communities', icon: UserGroupIcon }
      ]
    },
    {
      name: 'Utilities',
      icon: CogIcon,
      path: '/dashboard',
      submenu: [
        { name: 'Dashboard', path: '/dashboard', icon: CogIcon },
        { name: 'Staking', path: '/staking', icon: StarIcon },
        { name: 'Trending', path: '/trending', icon: FireIcon },
        { name: 'Price Checker', path: '/price-checker', icon: ChartBarIcon },
        { name: 'Telegram Bot', path: '/telegram-bot', icon: CogIcon }
      ]
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 flex items-center justify-center overflow-hidden shadow-lg ring-1 ring-white/10">
                <img 
                  src="/assets/images/wif-hat.svg" 
                  alt="IncryptX Icon" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <span className="text-white font-bold text-xl hidden">W</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full animate-pulse"></div>
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>IncryptX</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 group-hover:bg-white/5">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                
                {/* Dropdown */}
                <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                  <div className="bg-black/70 backdrop-blur-2xl border border-white/10 p-2 space-y-1 rounded-xl navbar-dropdown shadow-[0_10px_32px_rgba(0,0,0,0.45)]">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 dropdown-item"
                      >
                        <subItem.icon className="w-4 h-4" />
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Balance Display */}
            {connected && publicKey && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center space-x-2 glass-card px-3 py-2"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white">
                  {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </span>
              </motion.div>
            )}

            {/* Theme toggle removed (dark-only) */}

            {/* Wallet Button */}
            <WalletMultiButton className="btn-primary flex items-center space-x-2 min-w-0 overflow-hidden" />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-[9999] modal-overlay"
              onClick={() => setIsOpen(false)}
              aria-modal="true"
              role="dialog"
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-xl navbar-mobile flex flex-col"
                onClick={(e) => e.stopPropagation()}
                style={{ height: '100dvh' }}
              >
              {/* Mobile Sheet Header */}
              <div className="sticky top-0 z-[1] h-16 px-4 flex items-center justify-between border-b border-white/10 bg-black/70 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-white/90">
                  <FireIcon className="w-5 h-5" />
                  <span className="font-semibold">Menu</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pb-safe px-0 space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.name} className="px-4">
                    <div className="text-white/60 text-sm font-medium mb-2 flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Theme toggle removed in mobile menu (dark-only) */}

                {/* Additional Mobile Links */}
                <div className="px-4 pt-4 border-t border-white/10">
                  <div className="text-white/60 text-sm font-medium mb-2">Utilities</div>
                  <div className="space-y-1">
                    <Link
                      to="/staking"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Staking
                    </Link>
                    <Link
                      to="/trending"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Trending
                    </Link>
                    <Link
                      to="/price-checker"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Price Checker
                    </Link>
                    <Link
                      to="/telegram-bot"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Telegram Bot
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </nav>
  );
};

export default Navbar;
