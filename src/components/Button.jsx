import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className }) => {
  return (
    <motion.button 
      onClick={onClick} 
      className={`bg-primary-pink text-white px-4 py-2 rounded ${className}`} 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
