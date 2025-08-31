import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Context for the theme
const ThemeContext = createContext();

// Custom hook to use the ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ThemeProvider component
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeProvider = ({ children }) => {
  // Lock theme to dark only
  const [theme] = useState('dark');

  // No-op toggle retained for API compatibility
  const toggleTheme = () => {
    // Intentionally no-op to enforce dark-only theme
  };

  // Apply the theme class to the body element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.className = 'dark';

    // Update theme-color meta for supported browsers
    const ensureMeta = (name) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      return el;
    };
    const meta = ensureMeta('theme-color');
    meta.setAttribute('content', '#0b0b14');
  }, [theme]);

  // Ignore system theme changes; user can toggle explicitly

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
