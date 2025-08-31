import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className }) => {
  return (
    <motion.button 
      onClick={onClick} 
      className={`btn-primary text-white px-5 py-2.5 rounded-xl tracking-wide ${className}`} 
      whileHover={{ scale: 1.04 }} 
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
