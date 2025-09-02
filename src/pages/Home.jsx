import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  RocketLaunchIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  FireIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import useMockData from '../hooks/useMockData';
import HolographicCard from '../components/HolographicCard.jsx';
import HoloButton from '../components/HoloButton.jsx';

const Home = () => {
  const tokens = useMockData('mock-tokens.json');
  const [stats, setStats] = useState({
    totalLaunches: 0,
    totalVolume: 0,
    activeUsers: 0,
    totalMarketCap: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalLaunches: tokens.length,
        totalVolume: 1250000,
        activeUsers: 15420,
        totalMarketCap: 8900000
      });
    }, 1000);
  }, [tokens]);

  const features = [
    {
      icon: RocketLaunchIcon,
      title: "Lightning Fast Launches",
      description: "Deploy memecoins in under 30 seconds with our optimized smart contracts",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: ChartBarIcon,
      title: "Advanced Analytics",
      description: "Real-time charts, holder analysis, and market insights for every token",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: CurrencyDollarIcon,
      title: "Liquidity Management",
      description: "Automated liquidity pools and anti-rug mechanisms built-in",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: UserGroupIcon,
      title: "Community Driven",
      description: "Vote on launches, earn rewards, and shape the future of memecoins",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const recentLaunches = tokens.slice(0, 6);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      


      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 relative"
          >


            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 relative z-10 heading-contrast" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.06em' }}>
              <span className="gradient-text">INCRYPT</span>
            </h1>
            
            {/* Logo (kept, will be replaced with same filename externally) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex justify-center mb-6"
            >
              <img 
                src="/assets/images/wif-logo.svg" 
                alt="WIF Logo" 
                className="w-20 h-20 md:w-24 md:h-24 opacity-80 drop-shadow-2xl"
              />
            </motion.div>
            


            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
              The ultimate memecoin launchpad and trading ecosystem. Launch, trade, and earn with 
              <span className="gradient-text-secondary font-semibold"> zero coding required</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link to="/pad/launch/degen">
              <HoloButton className="text-lg">
                <RocketLaunchIcon className="w-6 h-6" />
                Launch Token Now
              </HoloButton>
            </Link>
            <Link to="/trade">
              <HoloButton className="text-lg">
                <ChartBarIcon className="w-6 h-6" />
                Start Trading
              </HoloButton>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { label: "Total Launches", value: stats.totalLaunches, icon: RocketLaunchIcon, color: "from-purple-500 to-pink-500" },
              { label: "24h Volume", value: `$${(stats.totalVolume / 1000).toFixed(0)}K`, icon: ArrowTrendingUpIcon, color: "from-green-500 to-emerald-500" },
              { label: "Active Users", value: stats.activeUsers.toLocaleString(), icon: UserGroupIcon, color: "from-blue-500 to-cyan-500" },
              { label: "Market Cap", value: `$${(stats.totalMarketCap / 1000000).toFixed(1)}M`, icon: CurrencyDollarIcon, color: "from-orange-500 to-red-500" }
            ].map((stat, index) => (
              <HolographicCard key={stat.label} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </HolographicCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            {/* Floating hat images removed per rebrand */}

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">IncryptX</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built for the modern memecoin era with cutting-edge technology and user experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {features.map((feature, index) => (
              <HolographicCard key={feature.title} className="text-center group h-full">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </HolographicCard>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Launches Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >


            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Hot</span> Recent Launches
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the latest memecoins launched on our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLaunches.map((token, index) => (
              <HolographicCard key={token.id} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{token.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{token.name}</h3>
                      <p className="text-sm text-gray-400">#{token.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">${(token.mc / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-400">{token.holders} holders</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Supply:</span>
                    <span className="text-white">{token.supply.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Curve:</span>
                    <span className="text-white capitalize">{token.curve}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Link to={`/pad/token/${token.id}`}>
                    <button className="w-full btn-primary py-2 text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </HolographicCard>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/pad">
              <button className="btn-secondary px-8 py-3 text-lg">
                View All Launches
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Launch Your <span className="gradient-text">Memecoin</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who have already launched successful tokens on our platform. 
              Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pad/launch/degen">
                <button className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                  <FireIcon className="w-6 h-6" />
                  Launch Degen Token
                </button>
              </Link>
              <Link to="/pad/launch/custom">
                <button className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                  <StarIcon className="w-6 h-6" />
                  Custom Launch
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
