import { useState } from 'react';
import useMockData from '../../hooks/useMockData';
import TokenCard from '../../components/TokenCard';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';

const PerpsHome = () => {
  const tokens = useMockData('mock-tokens.json');
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const qualified = tokens.filter(t => t.mc > 1000000); // Mock qualification

  const filtered = qualified.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()));

  const handlePropose = () => {
    // Mock
    alert('Market proposed');
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <h1>Perps Markets</h1>
      <Input placeholder="Filter by MC/Volume" value={filter} onChange={e => setFilter(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(token => <TokenCard key={token.id} token={token} />)}
      </div>
      <Button onClick={() => setModalOpen(true)}>Propose Market</Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Propose Market</h2>
        <select>{tokens.map(t => <option key={t.id}>{t.name}</option>)}</select>
        {/* Params inputs */}
        <Button onClick={handlePropose}>Submit</Button>
      </Modal>
    </div>
  );
};

export default PerpsHome;
