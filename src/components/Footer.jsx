import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal.jsx';

const Footer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  return (
    <footer className="bg-meme-black text-dog-white p-4 text-center">
      <div className="flex justify-center space-x-4 mb-2">
        <Link to="/">Home</Link>
        <Link to="/pad">Launchpad</Link>
        <Link to="/trade">Trade</Link>
        <Link to="/perps">Perps</Link>
        <Link to="/social/feed">Social</Link>
      </div>
      <div className="flex justify-center space-x-4 mt-2">
        <button onClick={() => openModal('Twitter')}>Twitter</button>
        <button onClick={() => openModal('Discord')}>Discord</button>
        <button onClick={() => openModal('Telegram')}>Telegram</button>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{modalContent} Link</h2>
        <p>Mock link to {modalContent}. In real app, this would redirect.</p>
      </Modal>
    </footer>
  );
};

export default Footer;
