import { useState } from 'react';
import useMockData from '../../hooks/useMockData';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

const MyPositions = () => {
  const positions = useMockData('mock-positions.json');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdjust = (pos) => {
    setSelected(pos);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1>My Positions</h1>
      <table className="w-full">
        <thead><tr><th>Market</th><th>Leverage</th><th>PNL</th><th>Actions</th></tr></thead>
        <tbody>
          {positions.map(pos => (
            <tr key={pos.market}>
              <td>{pos.market}</td>
              <td>{pos.leverage}x {pos.direction}</td>
              <td>{pos.pnl}</td>
              <td><Button onClick={() => handleAdjust(pos)}>Adjust/Close</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Adjust Position for {selected?.market}</h2>
        {/* Adjust form */}
        <Button>Save</Button>
        <Button>Close</Button>
      </Modal>
    </div>
  );
};

export default MyPositions;
