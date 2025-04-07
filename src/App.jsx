import { useState, useEffect, createContext } from 'react'
import './App.css'
import ImageGenerator from './components/ImageGenerator'

// Create Theme Context
export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Update theme in localStorage and on body element
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        <header className="app-header">
          <h1>Vision AI Image Generator</h1>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>
        <main>
          <ImageGenerator />
        </main>
        <footer className="app-footer">
          <p>Powered by Stable Horde AI</p>
        </footer>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
