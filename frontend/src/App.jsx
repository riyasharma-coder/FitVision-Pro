import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Camera, Home as HomeIcon, History as HistoryIcon, Info, Sparkles, BrainCircuit } from 'lucide-react'; // BrainCircuit icon add kiya scalability ke liye

import Home from './pages/Home';
import History from './pages/History';
import About from './pages/About';
import AIScan from './pages/AIScan';
import SizePredictor from './pages/SizePredictor'; // Import kiya naya page

function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    const [hasScanData, setHasScanData] = useState(false);

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        const savedScan = localStorage.getItem('lastScan');
        if (savedScan) setHasScanData(true);
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const getLinkStyle = ({ isActive }) => ({
        color: isActive ? '#10b981' : (isDarkMode ? '#94a3b8' : '#64748b'),
        textDecoration: 'none',
        fontWeight: '700',
        fontSize: '14px',
        padding: '10px 18px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
        border: isActive ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
    });

    const theme = {
        bg: isDarkMode ? '#0a0a0c' : '#f8fafc',
        text: isDarkMode ? '#ffffff' : '#0f172a',
        navBg: isDarkMode ? 'rgba(10, 10, 12, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        border: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
    };

    return (
        <Router>
            <div style={{ minHeight: '100vh', width: '100vw', background: theme.bg, color: theme.text, fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
                <Toaster position="top-center" />

                <nav style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '15px 8%', backgroundColor: theme.navBg, backdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: 1000
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#10b981', padding: '8px', borderRadius: '12px' }}>
                            <Ruler color="white" size={20} />
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>
                            FitVision <span style={{ color: '#10b981' }}>PRO</span>
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <NavLink to="/" style={getLinkStyle}><HomeIcon size={18} /> Marketplace</NavLink>

                        {/* New Predictive Link - Project Scalability Highlight */}
                        <NavLink to="/predict" style={getLinkStyle}>
                            <Sparkles size={18} color="#10b981" />
                            AI Predictor
                        </NavLink>

                        <NavLink to="/scan" style={getLinkStyle}>
                            <Camera size={18} />
                            {hasScanData ? "Re-Scan Body" : "AI Body Scan"}
                        </NavLink>

                        <NavLink to="/history" style={getLinkStyle}><HistoryIcon size={18} /> Closet</NavLink>

                        <div style={{ width: '1px', height: '24px', background: theme.border, margin: '0 10px' }} />

                        <button onClick={toggleTheme} style={toggleBtnStyle(isDarkMode)}>
                            {isDarkMode ? '🌙' : '☀️'}
                        </button>
                    </div>
                </nav>

                <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {hasScanData && (
                        <div style={welcomeBannerStyle(isDarkMode)}>
                            <BrainCircuit size={16} color="#10b981" />
                            <span>AI Profile Active: Measurements cross-referenced with ANSUR II dataset for accuracy.</span>
                        </div>
                    )}

                    <Routes>
                        <Route path="/" element={<Home isDarkMode={isDarkMode} hasScanData={hasScanData} />} />
                        <Route path="/scan" element={<AIScan isDarkMode={isDarkMode} setHasScanData={setHasScanData} />} />
                        <Route path="/predict" element={<SizePredictor isDarkMode={isDarkMode} />} /> {/* Naya Route */}
                        <Route path="/history" element={<History isDarkMode={isDarkMode} />} />
                        <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

// ... baaki styles (toggleBtnStyle, welcomeBannerStyle, Ruler) same rahenge ...

const toggleBtnStyle = (isDark) => ({
    background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
    color: isDark ? '#fff' : '#0f172a',
    width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s'
});

const welcomeBannerStyle = (isDark) => ({
    background: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5',
    color: isDark ? '#a7f3d0' : '#065f46',
    padding: '10px 8%', fontSize: '12px', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '10px',
    borderBottom: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5'}`
});

const Ruler = ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.3 15.3l-9-9L3.7 15l9 9 8.6-8.7z"/><path d="M7.2 11.5l1.5 1.5"/><path d="M10.2 8.5l1.5 1.5"/><path d="M13.2 5.5l1.5 1.5"/><path d="M16.2 2.5l1.5 1.5"/>
    </svg>
);

export default App;