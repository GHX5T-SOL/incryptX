import { motion } from 'framer-motion';
import { useState } from 'react';

const ProfileCard = ({ user }) => {
  const [showHats, setShowHats] = useState(false);

  return (
    <motion.div className="bg-dog-white p-4 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
      <img src={user.pic} alt={user.username} className="w-24 h-24 rounded-full mx-auto" />
      <h2 className="text-xl font-bold text-center">{user.username}</h2>
      <p>Rep Score: {user.repScore}</p>
      <progress value={user.repScore} max="100" className="w-full" />
      <button onClick={() => setShowHats(!showHats)}>NFT Hats</button>
      {showHats && (
        <div className="grid grid-cols-3 gap-2">
          {user.nftHats.map(hat => <img key={hat} src={`/assets/images/nft-hats/${hat}`} alt={hat} className="w-16" />)}
        </div>
      )}
      <p>Launches: {user.launches.length}</p>
    </motion.div>
  );
};

export default ProfileCard;
