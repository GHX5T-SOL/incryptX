import { motion } from 'framer-motion';
import { useState } from 'react';

const ProfileCard = ({ user }) => {
  const [showHats, setShowHats] = useState(false);

  return (
    <motion.div className="glass-card glass-card-hover p-5 rounded-2xl shadow-lg" whileHover={{ scale: 1.02 }}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <img src={user.pic} alt={user.username} className="w-24 h-24 rounded-2xl object-cover border border-white/10" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-center gradient-text heading-contrast">{user.username}</h2>
        <div className="w-full">
          <div className="flex justify-between text-sm text-white/70">
            <span>Rep Score</span>
            <span>{user.repScore}</span>
          </div>
          <div className="h-2 mt-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${user.repScore}%` }} />
          </div>
        </div>
        <button onClick={() => setShowHats(!showHats)} className="btn-primary mt-2">NFT Hats</button>
        {showHats && (
          <div className="grid grid-cols-3 gap-2 w-full mt-2">
            {user.nftHats.map(hat => <img key={hat} src={`/assets/images/nft-hats/${hat}`} alt={hat} className="w-16 rounded-lg border border-white/10" />)}
          </div>
        )}
        <p className="text-white/80">Launches: {user.launches.length}</p>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
