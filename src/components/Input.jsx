import React from 'react';

const Input = ({ placeholder, value, onChange, type = 'text' }) => {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      className="border border-hat-blue p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary-pink"
    />
  );
};

export default Input;
