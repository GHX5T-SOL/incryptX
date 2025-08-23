import { useState } from 'react';
import useMockData from '../../hooks/useMockData';
import ProfileCard from '../../components/ProfileCard';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

const CopyTrading = () => {
  const users = useMockData('mock-users.json');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCopy = (user) => {
    setSelected(user);
    setModalOpen(true);
  };

  const confirmCopy = () => {
    // Mock add to dashboard
    alert(`Copying ${selected.username}`);
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <h1>Copy Trading</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.slice(0,10).map(user => (
          <div key={user.username}>
            <ProfileCard user={user} />
            <Button onClick={() => handleCopy(user)}>Copy</Button>
          </div>
        ))}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Copy {selected?.username}?</h2>
        <Button onClick={confirmCopy}>Confirm</Button>
      </Modal>
    </div>
  );
};

export default CopyTrading;
