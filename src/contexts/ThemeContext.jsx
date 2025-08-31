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
  // Initialize theme state based on localStorage (default to dark)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('wifpad-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return 'dark';
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('wifpad-theme', newTheme);
  };

  // Apply the theme class to the body element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme;

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
    meta.setAttribute('content', theme === 'dark' ? '#0f0f23' : '#ffffff');
  }, [theme]);

  // Ignore system theme changes; user can toggle explicitly

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
