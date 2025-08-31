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
    <footer className="p-6 text-center border-t border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="flex flex-wrap justify-center gap-6 mb-3 text-white/80">
        <Link className="hover:text-white" to="/">Home</Link>
        <Link className="hover:text-white" to="/pad">Launchpad</Link>
        <Link className="hover:text-white" to="/trade">Trade</Link>
        <Link className="hover:text-white" to="/perps">Perps</Link>
        <Link className="hover:text-white" to="/social/feed">Social</Link>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        <button className="px-3 py-1 rounded-lg hover:bg-white/10" onClick={() => openModal('Twitter')}>Twitter</button>
        <button className="px-3 py-1 rounded-lg hover:bg-white/10" onClick={() => openModal('Discord')}>Discord</button>
        <button className="px-3 py-1 rounded-lg hover:bg-white/10" onClick={() => openModal('Telegram')}>Telegram</button>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{modalContent} Link</h2>
        <p>Mock link to {modalContent}. In real app, this would redirect.</p>
      </Modal>
    </footer>
  );
};

export default Footer;
