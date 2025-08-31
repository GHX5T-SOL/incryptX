import { motion } from 'framer-motion';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <motion.div className="fixed inset-0 modal-overlay flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div 
        className="modal-content p-6 rounded-2xl relative w-[min(92vw,640px)]"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <button onClick={onClose} className="absolute top-3 right-3 px-2 py-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">✕</button>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;
