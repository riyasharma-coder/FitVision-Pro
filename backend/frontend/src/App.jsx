import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import History from './pages/History';
import About from './pages/About';
import AIScan from './pages/AIScan';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    // ✨ Dynamic Link Style - Light mode mein readable dark text ke saath
    const getLinkStyle = ({ isActive }) => ({
        color: isActive ? '#10b981' : (isDarkMode ? '#ffffff' : '#475569'),
        textDecoration: 'none',
        fontWeight: '700',
        fontSize: '15px',
        padding: '8px 20px',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
        letterSpacing: '0.3px'
    });

    // --- 🎨 Master Global Styles ---
    const layoutStyle = {
        minHeight: '100vh',
        width: '100vw',
        background: isDarkMode ? '#0a0a0c' : '#f8fafc', // Pure Light mode background
        color: isDarkMode ? '#ffffff' : '#0f172a',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.4s ease, color 0.4s ease',
        margin: 0, padding: 0, overflowX: 'hidden'
    };

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 8%',
        backgroundColor: isDarkMode ? 'rgba(10, 10, 12, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        // Dynamic border color
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'}`,
        position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)'
    };

    const toggleBtnStyle = {
        background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
        color: isDarkMode ? '#fff' : '#0f172a',
        width: '42px', height: '42px',
        borderRadius: '12px', cursor: 'pointer', fontSize: '18px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginLeft: '15px',
        boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
        transition: '0.3s all'
    };

    return (
        <Router>
            <div style={layoutStyle}>
                <Toaster position="top-center" reverseOrder={false} />

                <nav style={navStyle}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: isDarkMode ? '#fff' : '#0f172a' }}>
                        📏 FitVision <span style={{ color: '#10b981' }}>AI</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <NavLink to="/" style={getLinkStyle}>Home</NavLink>
                            <NavLink to="/scan" style={getLinkStyle}>AI Scan</NavLink>
                            <NavLink to="/history" style={getLinkStyle}>History</NavLink>
                            <NavLink to="/about" style={getLinkStyle}>About</NavLink>
                        </div>
                        {/* Toggle Button with Light Mode optimization */}
                        <button onClick={toggleTheme} style={toggleBtnStyle}>
                            {isDarkMode ? '🌙' : '☀️'}
                        </button>
                    </div>
                </nav>

                <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Routes>
                        <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
                        <Route path="/scan" element={<AIScan isDarkMode={isDarkMode} />} />
                        <Route path="/history" element={<History isDarkMode={isDarkMode} />} />
                        <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
