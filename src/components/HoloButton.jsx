import React from 'react';
import { motion } from 'framer-motion';

const HoloButton = ({ children, className = '', onClick, variant = 'glass' }) => {
  const isGradient = variant === 'gradient';

  const style = isGradient
    ? {
        background: 'linear-gradient(90deg, #7DF9FF, #FF43E6)',
        border: 'none',
        boxShadow: '0 10px 30px rgba(125,249,255,0.25), 0 10px 30px rgba(255,67,230,0.18)',
        color: '#0b0b14'
      }
    : {
        background: 'linear-gradient(180deg, rgba(10,12,24,0.55), rgba(10,12,24,0.35))',
        border: '1px solid rgba(125, 249, 255, 0.18)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.45), 0 0 22px rgba(34,211,238,0.12), inset 0 0 18px rgba(255,255,255,0.04)',
        color: '#ffffff'
      };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all group ${className}`}
      style={style}
    >
      <span className="absolute inset-0 pointer-events-none">
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: isGradient
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(125,249,255,0.2), transparent)'
          }}
        />
      </span>
      {children}
    </motion.button>
  );
};

export default HoloButton;


