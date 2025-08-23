import { useState } from 'react';
import useMockData from '../../hooks/useMockData';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const Communities = () => {
  const tokens = useMockData('mock-tokens.json');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = tokens.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const handleJoin = (token) => {
    // Mock gated check
    alert(`Joined ${token.name} community`);
  };

  const handleTask = (token) => {
    setSelected(token);
    setModalOpen(true);
  };

  const submitProof = () => {
    // Mock
    alert('Reward claimed');
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <h1>Communities</h1>
      <Input placeholder="Search communities" value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(token => (
        <div key={token.id} className="border p-4 mb-4">
          <h3>{token.name} Community</h3>
          <Button onClick={() => handleJoin(token)}>Join</Button>
          <h4>Treasury Tasks</h4>
          <Button onClick={() => handleTask(token)}>Promote on X</Button>
        </div>
      ))}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Submit Proof for {selected?.name}</h2>
        <Input placeholder="Link to post" />
        <Button onClick={submitProof}>Submit</Button>
      </Modal>
    </div>
  );
};

export default Communities;
