import { useState } from 'react';
import useMockData from '../../hooks/useMockData';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';

const WalletTracker = () => {
  const trades = useMockData('mock-trades.json');
  const [search, setSearch] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const filteredTrades = trades.filter(t => t.token.includes(search)); // Mock

  return (
    <div className="p-4">
      <h1>Wallet Tracker</h1>
      <Input placeholder="Search wallet or token" value={search} onChange={e => setSearch(e.target.value)} />
      <ul>
        {filteredTrades.map(trade => <li key={trade.id}>{trade.type} at {trade.price} - {new Date().toLocaleString()}</li>)}
      </ul>
      <Button onClick={() => setAlertOpen(true)}>Set Alert</Button>
      <Modal open={alertOpen} onClose={() => setAlertOpen(false)}>
        <h2>Set Alert</h2>
        <Input placeholder="Email" />
        <Button>Save</Button>
      </Modal>
    </div>
  );
};

export default WalletTracker;
