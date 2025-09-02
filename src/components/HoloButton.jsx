import React from 'react';
import { motion } from 'framer-motion';

const HoloButton = ({ children, className = '', onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all group ${className}`}
      style={{
        background: 'linear-gradient(90deg, rgba(0,255,255,0.12), rgba(255,0,204,0.12))',
        border: '1px solid rgba(0,255,255,0.25)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.25), 0 0 24px rgba(0,255,255,0.15), inset 0 0 24px rgba(0,255,255,0.08)'
      }}
    >
      <span className="absolute inset-0 pointer-events-none">
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)'
        }} />
      </span>
      {children}
    </motion.button>
  );
};

export default HoloButton;


