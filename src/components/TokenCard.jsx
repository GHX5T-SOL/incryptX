import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Modal from './Modal.jsx';
import HolographicCard from './HolographicCard.jsx';

const TokenCard = ({ token }) => {
  const [stakeOpen, setStakeOpen] = useState(false);

  return (
    <HolographicCard className="group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 flex items-center justify-center">
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
          <span className="text-white">{token.supply?.toLocaleString?.() || '—'}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Link to={`/pad/token/${token.id}`}>
          <button className="w-full btn-primary py-2 text-sm">Details</button>
        </Link>
        <button onClick={() => setStakeOpen(true)} className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors">Stake</button>
        <Link to={`/trade?token=${token.id}`}>
          <button className="w-full btn-secondary py-2 text-sm">Trade</button>
        </Link>
      </div>

      <Modal open={stakeOpen} onClose={() => setStakeOpen(false)}>
        <h2 className="text-2xl font-bold text-white mb-4">Stake {token.name}</h2>
        <input type="number" placeholder="Amount" className="input-modern w-full" />
        <button className="btn-primary w-full mt-4 py-2">Stake</button>
      </Modal>
    </HolographicCard>
  );
};

export default TokenCard;
