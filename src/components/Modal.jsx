import { motion } from 'framer-motion';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-dog-white p-6 rounded-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2">X</button>
        {children}
      </div>
    </motion.div>
  );
};

export default Modal;
