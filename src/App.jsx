import React, { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import WalletProvider from './components/WalletProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Starfield from './components/Starfield';
import Footer from './components/Footer';
import IncryptAI from './components/IncryptAI';

// Lazy-load route components for better performance
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LaunchpadHome = lazy(() => import('./pages/IncryptPad/LaunchpadHome'));
const QuickLaunch = lazy(() => import('./pages/IncryptPad/QuickLaunch'));
const DegenLaunch = lazy(() => import('./pages/IncryptPad/DegenLaunch'));
const CustomLaunch = lazy(() => import('./pages/IncryptPad/CustomLaunch'));
const MyLaunches = lazy(() => import('./pages/IncryptPad/MyLaunches'));
const TokenDetails = lazy(() => import('./pages/IncryptPad/TokenDetails'));
const TradeHome = lazy(() => import('./pages/IncryptTrade/TradeHome'));
const AdvancedTrade = lazy(() => import('./pages/IncryptTrade/AdvancedTrade'));
const P2PEscrow = lazy(() => import('./pages/IncryptTrade/P2PEscrow'));
const Leaderboards = lazy(() => import('./pages/IncryptTrade/Leaderboards'));
const WalletTracker = lazy(() => import('./pages/IncryptTrade/WalletTracker'));
const CopyTrading = lazy(() => import('./pages/IncryptTrade/CopyTrading'));
const PerpsHome = lazy(() => import('./pages/IncryptPerps/PerpsHome'));
const PerpMarket = lazy(() => import('./pages/IncryptPerps/PerpMarket'));
const MyPositions = lazy(() => import('./pages/IncryptPerps/MyPositions'));
const Feed = lazy(() => import('./pages/IncryptSocial/Feed'));
const Profile = lazy(() => import('./pages/IncryptSocial/Profile'));
const Chats = lazy(() => import('./pages/IncryptSocial/Chats'));
const ChatRoom = lazy(() => import('./pages/IncryptSocial/ChatRoom'));
const Communities = lazy(() => import('./pages/IncryptSocial/Communities'));
const Staking = lazy(() => import('./pages/Staking'));
const TelegramBot = lazy(() => import('./pages/TelegramBot'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Trending = lazy(() => import('./pages/Trending'));
const PriceChecker = lazy(() => import('./pages/PriceChecker'));

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Separate component that uses useLocation inside Router context
const AppContent = () => {
  const location = useLocation();
  
  // Dynamic document titles per route
  useEffect(() => {
    const path = location.pathname;
    const base = 'IncryptX';
    const titles = [
      { test: /^\/$/, title: `${base} — Launchpad, DEX, Perps, Social` },
      { test: /^\/dashboard/, title: `${base} — Dashboard` },
      { test: /^\/pad$/, title: `${base} — Launchpad` },
      { test: /^\/pad\/quick-launch/, title: `${base} — Quick Launch` },
      { test: /^\/pad\/launch\/degen/, title: `${base} — Degen Launch` },
      { test: /^\/pad\/launch\/custom/, title: `${base} — Custom Launch` },
      { test: /^\/pad\/my-launches/, title: `${base} — My Launches` },
      { test: /^\/pad\/token\//, title: `${base} — Token Details` },
      { test: /^\/trade$/, title: `${base} — Trade` },
      { test: /^\/trade\/advanced/, title: `${base} — Advanced Trade` },
      { test: /^\/trade\/p2p/, title: `${base} — P2P Escrow` },
      { test: /^\/trade\/leaderboards/, title: `${base} — Leaderboards` },
      { test: /^\/trade\/tracker/, title: `${base} — Wallet Tracker` },
      { test: /^\/trade\/copy/, title: `${base} — Copy Trading` },
      { test: /^\/perps$/, title: `${base} — Perps Markets` },
      { test: /^\/perps\/market\//, title: `${base} — Perp Market` },
      { test: /^\/perps\/positions/, title: `${base} — My Positions` },
      { test: /^\/social(\/feed)?$/, title: `${base} — Social Feed` },
      { test: /^\/social\/profile\//, title: `${base} — Profile` },
      { test: /^\/social\/chats/, title: `${base} — Chats` },
      { test: /^\/social\/communities/, title: `${base} — Communities` },
      { test: /^\/staking/, title: `${base} — Staking` },
      { test: /^\/telegram-bot/, title: `${base} — Telegram Bot` },
      { test: /^\/trending/, title: `${base} — Trending` },
      { test: /^\/price-checker/, title: `${base} — Price Checker` },
    ];
    const match = titles.find(t => t.test.test(path));
    document.title = match ? match.title : `${base} — Not Found`;
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen">
      <Starfield />
      <div className="animated-bg" aria-hidden="true"></div>
      <Navbar />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="p-6 text-center text-white/60">Loading…</div>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            
            {/* Launchpad Routes */}
            <Route path="/pad" element={<PageTransition><LaunchpadHome /></PageTransition>} />
            <Route path="/pad/quick-launch" element={<PageTransition><QuickLaunch /></PageTransition>} />
            <Route path="/pad/launch/degen" element={<PageTransition><DegenLaunch /></PageTransition>} />
            <Route path="/pad/launch/custom" element={<PageTransition><CustomLaunch /></PageTransition>} />
            <Route path="/pad/my-launches" element={<PageTransition><MyLaunches /></PageTransition>} />
            <Route path="/pad/token/:id" element={<PageTransition><TokenDetails /></PageTransition>} />
            
            {/* Trade Routes */}
            <Route path="/trade" element={<PageTransition><TradeHome /></PageTransition>} />
            <Route path="/trade/advanced" element={<PageTransition><AdvancedTrade /></PageTransition>} />
            <Route path="/trade/p2p" element={<PageTransition><P2PEscrow /></PageTransition>} />
            <Route path="/trade/leaderboards" element={<PageTransition><Leaderboards /></PageTransition>} />
            <Route path="/trade/tracker" element={<PageTransition><WalletTracker /></PageTransition>} />
            <Route path="/trade/copy" element={<PageTransition><CopyTrading /></PageTransition>} />
            
            {/* Perps Routes */}
            <Route path="/perps" element={<PageTransition><PerpsHome /></PageTransition>} />
            <Route path="/perps/market/:id" element={<PageTransition><PerpMarket /></PageTransition>} />
            <Route path="/perps/positions" element={<PageTransition><MyPositions /></PageTransition>} />
            
            {/* Social Routes */}
            <Route path="/social" element={<PageTransition><Feed /></PageTransition>} />
            <Route path="/social/feed" element={<PageTransition><Feed /></PageTransition>} />
            <Route path="/social/profile/:username" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/social/chats" element={<PageTransition><Chats /></PageTransition>} />
            <Route path="/social/chat/:id" element={<PageTransition><ChatRoom /></PageTransition>} />
            <Route path="/social/communities" element={<PageTransition><Communities /></PageTransition>} />
            
            {/* Other Routes */}
            <Route path="/staking" element={<PageTransition><Staking /></PageTransition>} />
            <Route path="/telegram-bot" element={<PageTransition><TelegramBot /></PageTransition>} />
            <Route path="/trending" element={<PageTransition><Trending /></PageTransition>} />
            <Route path="/price-checker" element={<PageTransition><PriceChecker /></PageTransition>} />
            
            {/* 404 Route */}
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Footer />
      <IncryptAI />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <Router>
          <AppContent />
        </Router>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App; 