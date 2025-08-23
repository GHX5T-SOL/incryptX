import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Modal from './Modal.jsx';

const TokenCard = ({ token }) => {
  const [stakeOpen, setStakeOpen] = useState(false);

  return (
    <motion.div className="bg-dog-white p-4 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
      <img src={token.image} alt={token.name} className="w-24 h-24 mx-auto" />
      <h3 className="text-lg font-bold">{token.name}</h3>
      <p>MC: ${token.mc}</p>
      <p>Holders: {token.holders}</p>
      <Link to={`/pad/token/${token.id}`} className="block bg-hat-blue text-white p-2 rounded">View Details</Link>
      <button onClick={() => setStakeOpen(true)} className="block bg-primary-pink text-white p-2 rounded mt-2">Stake</button>
      <Link to={`/trade?token=${token.id}`} className="block bg-meme-black text-white p-2 rounded mt-2">Trade</Link>
      <Modal open={stakeOpen} onClose={() => setStakeOpen(false)}>
        <h2>Stake {token.name}</h2>
        <input type="number" placeholder="Amount" className="border p-2 w-full" />
        <button className="bg-primary-pink p-2 mt-2">Stake</button> {/* Mock stake logic */}
      </Modal>
    </motion.div>
  );
};

export default TokenCard;
