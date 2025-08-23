import { useState } from 'react';
import { Link } from 'react-router-dom';
import useMockData from '../../hooks/useMockData';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useMockWallet } from '../../hooks/useMockWallet';

const Chats = () => {
  const chats = useMockData('mock-chats.json');
  const { balance } = useMockWallet(); // Mock holdings
  const [modalOpen, setModalOpen] = useState(false);

  const handleJoin = (chat) => {
    if (balance >= chat.minHold) alert('Joined');
    else alert('Insufficient holdings');
  };

  const handleCreate = () => {
    // Mock
    alert('Chat created');
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <h1>Chats</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chats.map(chat => (
          <div key={chat.id} className="border p-4 rounded">
            <h3>{chat.name}</h3>
            <p>Gated: {chat.minHold} of {chat.gatedToken}</p>
            <Button onClick={() => handleJoin(chat)}>Join</Button>
            <Link to={`/social/chat/${chat.id}`}>View</Link>
          </div>
        ))}
      </div>
      <Button onClick={() => setModalOpen(true)}>Create Chat</Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Create Chat</h2>
        <Input placeholder="Name" />
        <Input placeholder="Gated Token" />
        <Input type="number" placeholder="Min Hold" />
        <Button onClick={handleCreate}>Create</Button>
      </Modal>
    </div>
  );
};

export default Chats;
