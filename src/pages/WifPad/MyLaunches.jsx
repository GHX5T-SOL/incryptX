import { useState, useEffect } from 'react';
import TokenCard from '../../components/TokenCard';
import useMockData from '../../hooks/useMockData';
import { useMockWallet } from '../../hooks/useMockWallet';
import Modal from '../../components/Modal';

const MyLaunches = () => {
  const { address } = useMockWallet();
  const users = useMockData('mock-users.json');
  const tokens = useMockData('mock-tokens.json');
  const [myLaunches, setMyLaunches] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  useEffect(() => {
    const user = users.find(u => u.username === 'CurrentUser'); // Mock
    const launches = tokens.filter(t => user.launches.includes(t.id));
    setMyLaunches(launches);
  }, [users, tokens]);

  return (
    <div className="p-4">
      <h1>My Launches</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {myLaunches.map(token => (
          <div key={token.id}>
            <TokenCard token={token} />
            <Button onClick={() => { setSelectedToken(token); setEditOpen(true); }}>Edit</Button>
          </div>
        ))}
      </div>
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        {selectedToken && <h2>Edit {selectedToken.name}</h2>}
        {/* Edit form */}
      </Modal>
    </div>
  );
};

export default MyLaunches;
