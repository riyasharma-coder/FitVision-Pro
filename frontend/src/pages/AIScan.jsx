import React from 'react';
import CameraScan from '../components/CameraScan';

const AIScan = ({ isDarkMode }) => {
    const theme = {
        bg: isDarkMode ? '#0a0a0c' : '#f1f5f9',
        card: isDarkMode ? '#141417' : '#ffffff',
        title: isDarkMode
            ? 'linear-gradient(to right, #ffffff, #10b981)'
            : 'linear-gradient(to right, #0f172a, #10b981)',
        // 🚨 Isse light mode mein text dark slate ho jayega (#1e293b)
        text: isDarkMode ? '#ffffff' : '#1e293b',
        sub: isDarkMode ? '#94a3b8' : '#475569',
        border: isDarkMode ? '#27272a' : '#e2e8f0',
        shadow: isDarkMode
            ? '0 40px 100px rgba(0,0,0,0.5)'
            : '0 20px 50px rgba(15, 23, 42, 0.08)'
    };

    return (
        <div style={{...fullPageWrapper, background: theme.bg, color: theme.text}}>
            <div style={contentContainer}>
                <header style={headerStyle}>
                    <h1 style={{
                        ...titleStyle,
                        background: theme.title,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        AI Fit Scanner
                    </h1>
                    <p style={{...taglineStyle, color: theme.sub}}>
                        Get precision measurements and brand-specific sizing in seconds.
                    </p>
                </header>

                <div style={{
                    ...scannerCard,
                    background: theme.card,
                    border: `1px solid ${theme.border}`,
                    boxShadow: theme.shadow,
                    // 🚨 Force dark text color inside card for light mode visibility
                    color: theme.text
                }}>
                    {/* Yahan prop pass ho raha hai, ab isse CameraScan.jsx mein use karna hoga */}
                    <CameraScan isDarkMode={isDarkMode} />
                </div>
            </div>
        </div>
    );
};

const fullPageWrapper = {
    minHeight: '100vh',
    width: '100vw',
    margin: '0',
    padding: '80px 0px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    transition: 'all 0.4s ease',
    boxSizing: 'border-box'
};

const contentContainer = {
    maxWidth: '1200px',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const headerStyle = { textAlign: 'center', marginBottom: '40px', width: '100%' };
const titleStyle = { fontSize: '52px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-1.5px' };
const taglineStyle = { fontSize: '18px', transition: 'color 0.3s ease', fontWeight: '500' };

const scannerCard = {
    borderRadius: '40px',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    transition: 'all 0.4s ease',
    width: '100%',
    maxWidth: '800px',
    boxSizing: 'border-box'
};

export default AIScan;
