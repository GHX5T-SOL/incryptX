import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import WalletProvider from './components/WalletProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LaunchpadHome from './pages/WifPad/LaunchpadHome';
import QuickLaunch from './pages/WifPad/QuickLaunch';
import DegenLaunch from './pages/WifPad/DegenLaunch';
import CustomLaunch from './pages/WifPad/CustomLaunch';
import MyLaunches from './pages/WifPad/MyLaunches';
import TokenDetails from './pages/WifPad/TokenDetails';
import TradeHome from './pages/WifTrade/TradeHome';
import AdvancedTrade from './pages/WifTrade/AdvancedTrade';
import P2PEscrow from './pages/WifTrade/P2PEscrow';
import Leaderboards from './pages/WifTrade/Leaderboards';
import WalletTracker from './pages/WifTrade/WalletTracker';
import CopyTrading from './pages/WifTrade/CopyTrading';
import PerpsHome from './pages/WifPerps/PerpsHome';
import PerpMarket from './pages/WifPerps/PerpMarket';
import MyPositions from './pages/WifPerps/MyPositions';
import Feed from './pages/WifSocial/Feed';
import Profile from './pages/WifSocial/Profile';
import Chats from './pages/WifSocial/Chats';
import ChatRoom from './pages/WifSocial/ChatRoom';
import Communities from './pages/WifSocial/Communities';
import Staking from './pages/Staking';
import TelegramBot from './pages/TelegramBot';
import NotFound from './pages/NotFound';
import Trending from './pages/Trending';
import PriceChecker from './pages/PriceChecker';

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
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          
          {/* WIF Pad Routes */}
          <Route path="/pad" element={<PageTransition><LaunchpadHome /></PageTransition>} />
          <Route path="/pad/quick-launch" element={<PageTransition><QuickLaunch /></PageTransition>} />
          <Route path="/pad/launch/degen" element={<PageTransition><DegenLaunch /></PageTransition>} />
          <Route path="/pad/launch/custom" element={<PageTransition><CustomLaunch /></PageTransition>} />
          <Route path="/pad/my-launches" element={<PageTransition><MyLaunches /></PageTransition>} />
          <Route path="/pad/token/:id" element={<PageTransition><TokenDetails /></PageTransition>} />
          
          {/* WIF Trade Routes */}
          <Route path="/trade" element={<PageTransition><TradeHome /></PageTransition>} />
          <Route path="/trade/advanced" element={<PageTransition><AdvancedTrade /></PageTransition>} />
          <Route path="/trade/p2p" element={<PageTransition><P2PEscrow /></PageTransition>} />
          <Route path="/trade/leaderboards" element={<PageTransition><Leaderboards /></PageTransition>} />
          <Route path="/trade/tracker" element={<PageTransition><WalletTracker /></PageTransition>} />
          <Route path="/trade/copy" element={<PageTransition><CopyTrading /></PageTransition>} />
          
          {/* WIF Perps Routes */}
          <Route path="/perps" element={<PageTransition><PerpsHome /></PageTransition>} />
          <Route path="/perps/market/:id" element={<PageTransition><PerpMarket /></PageTransition>} />
          <Route path="/perps/positions" element={<PageTransition><MyPositions /></PageTransition>} />
          
          {/* WIF Social Routes */}
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
      </AnimatePresence>
      <Footer />
      <div className="fixed top-20 right-10 w-16 h-16 opacity-20 pointer-events-none">
        <img src="/assets/images/wif-hat.svg" alt="Floating Hat" className="w-full h-full animate-bounce" />
      </div>
      <div className="fixed bottom-20 left-10 w-12 h-12 opacity-20 pointer-events-none">
        <img src="/assets/images/wif-logo.svg" alt="Floating Logo" className="w-full h-full animate-spin-slow" />
      </div>
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