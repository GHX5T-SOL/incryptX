import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const P2PEscrow = () => {
  const [token, setToken] = useState('');
  const [amount, setAmount] = useState(0);
  const [counterparty, setCounterparty] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleNegotiate = () => setModalOpen(true);

  const handleLock = () => {
    // Mock
    alert('Escrow locked');
  };

  return (
    <div className="p-4">
      <h1>P2P Escrow</h1>
      <Input placeholder="Token" value={token} onChange={e => setToken(e.target.value)} />
      <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <Input placeholder="Counterparty Address" value={counterparty} onChange={e => setCounterparty(e.target.value)} />
      <Button onClick={handleNegotiate}>Negotiate</Button>
      <Button onClick={handleLock}>Lock</Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Negotiate</h2>
        <p>Mock chat for negotiation.</p>
      </Modal>
    </div>
  );
};

export default P2PEscrow;
