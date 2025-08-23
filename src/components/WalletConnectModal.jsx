import { useState } from 'react';
import Modal from './Modal'; // Change to default import

const WalletConnectModal = ({ open, onClose, onConnect }) => {
  const [selected, setSelected] = useState('phantom'); // Mock providers

  const handleConnect = () => {
    onConnect('Mock' + selected.charAt(0).toUpperCase() + selected.slice(1));
    onClose();
  };

  if (!open) return null;

  return (
    <Modal>
      <h2>Connect Wallet</h2>
      <div className="flex flex-col">
        <button onClick={() => setSelected('phantom')}>Phantom (Mock)</button>
        <button onClick={() => setSelected('solflare')}>Solflare (Mock)</button>
        {/* More mock options */}
        <button onClick={handleConnect} className="bg-primary-pink mt-4">Connect</button>
      </div>
    </Modal>
  );
};

export default WalletConnectModal;
