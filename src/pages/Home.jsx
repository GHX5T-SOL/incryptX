import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TokenCard from '../components/TokenCard.jsx';
import { useEffect, useState } from 'react';

const Home = () => {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetch('/assets/mock-data/mock-tokens.json').then(res => res.json()).then(setTokens);
  }, []);

  return (
    <div className="p-4">
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="text-center">
        <img src="/assets/images/wif-hat.svg" alt="WIF Hero" className="mx-auto w-48 animate-bounce" />
        <h1 className="text-4xl font-bold">Welcome to WIF Ecosystem</h1>
        <Link to="/pad/launch/degen" className="bg-primary-pink p-4 rounded mt-4 inline-block">Launch Your Meme</Link>
      </motion.div>
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Link to="/pad" className="bg-hat-blue p-4 rounded text-white">WIF Pad</Link>
        <Link to="/trade" className="bg-hat-blue p-4 rounded text-white">WIF Trade</Link>
        <Link to="/perps" className="bg-hat-blue p-4 rounded text-white">WIF Perps</Link>
        <Link to="/social/feed" className="bg-hat-blue p-4 rounded text-white">WIF Social</Link>
      </section>
      <section className="mt-8">
        <h2>Mock Stats</h2>
        <div>500+ Tokens Launched</div>
        <div>10K Users</div>
      </section>
      <section className="mt-8">
        <h2>Recent Launches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tokens.slice(0, 6).map(token => <TokenCard key={token.id} token={token} />)}
        </div>
      </section>
    </div>
  );
};

export default Home;
