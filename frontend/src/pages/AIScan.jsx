import React from 'react';
import { ShieldCheck, Zap, Activity, Target, Camera } from 'lucide-react';
import CameraScan from '../components/CameraScan';

/**
 * AIScan View: Orchestrates the CameraScan component with professional
 * instructions and system telemetry visualization.
 */
const AIScan = ({ isDarkMode }) => {
    const theme = {
        bg: isDarkMode ? '#0a0a0c' : '#f8fafc',
        card: isDarkMode ? '#141417' : '#ffffff',
        title: isDarkMode
            ? 'linear-gradient(to right, #ffffff, #10b981)'
            : 'linear-gradient(to right, #0f172a, #059669)',
        text: isDarkMode ? '#ffffff' : '#0f172a',
        sub: isDarkMode ? '#94a3b8' : '#64748b',
        border: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
        shadow: isDarkMode
            ? '0 40px 100px rgba(0,0,0,0.5)'
            : '0 20px 50px rgba(15, 23, 42, 0.08)'
    };

    return (
        <div style={{ ...fullPageWrapper, background: theme.bg, color: theme.text }}>
            <div style={contentContainer}>
                {/* Header Section */}
                <header style={headerStyle}>
                    <div style={badgeStyle}>
                        <Zap size={14} fill="#10b981" color="#10b981" />
                        <span style={{ marginLeft: '8px' }}>ENGINE: MEDIAPIPE POSE V1.0</span>
                    </div>
                    <h1 style={{
                        ...titleStyle,
                        background: theme.title,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Neural Fit Scanner
                    </h1>
                    <p style={{ ...taglineStyle, color: theme.sub }}>
                        Advanced body-mapping technology for precision garment sizing.
                    </p>
                </header>

                <div style={mainGrid}>
                    {/* Left Side: Scanner Component */}
                    <div style={{
                        ...scannerCard,
                        background: theme.card,
                        border: `1px solid ${theme.border}`,
                        boxShadow: theme.shadow,
                    }}>
                        <CameraScan isDarkMode={isDarkMode} />
                    </div>

                    {/* Right Side: Pro Instructions & System Health */}
                    <div style={sidePanel}>
                        <div style={systemHealthCard}>
                            <h3 style={panelTitle}>System Diagnostics</h3>
                            <div style={statusItem}>
                                <Activity size={16} color="#10b981" />
                                <span>Local Neural Engine: <strong style={{color: '#10b981'}}>Active</strong></span>
                            </div>
                            <div style={statusItem}>
                                <Target size={16} color="#10b981" />
                                <span>Calibration Status: <strong>Calibrated</strong></span>
                            </div>
                        </div>

                        <h3 style={{ ...panelTitle, marginTop: '30px' }}>Scanning Protocol</h3>

                        <div style={stepItem}>
                            <div style={stepCircle}>01</div>
                            <div>
                                <h4 style={stepTitle}>Positioning</h4>
                                <p style={{ color: theme.sub, fontSize: '13px' }}>Stand 2-3 meters away until your ankles are visible.</p>
                            </div>
                        </div>

                        <div style={stepItem}>
                            <div style={stepCircle}>02</div>
                            <div>
                                <h4 style={stepTitle}>Reference Stance</h4>
                                <p style={{ color: theme.sub, fontSize: '13px' }}>Maintain a standard 'A-Pose' for accurate width mapping.</p>
                            </div>
                        </div>

                        <div style={stepItem}>
                            <div style={stepCircle}>03</div>
                            <div>
                                <h4 style={stepTitle}>Illumination</h4>
                                <p style={{ color: theme.sub, fontSize: '13px' }}>Ensure uniform lighting to minimize edge-detection noise.</p>
                            </div>
                        </div>

                        <div style={{ ...privacyNotice, background: isDarkMode ? 'rgba(16,185,129,0.05)' : '#f0fdf4' }}>
                            <ShieldCheck size={18} color="#10b981" />
                            <div style={{textAlign: 'left'}}>
                                <div style={{ fontSize: '12px', fontWeight: '800', color: '#10b981' }}>ENCRYPTED PROCESSING</div>
                                <div style={{ fontSize: '11px', color: theme.sub }}>Data processed on-device. Privacy maintained.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Enhanced Professional Styles ---

const fullPageWrapper = {
    minHeight: '100vh', width: '100vw', padding: '60px 0px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', transition: '0.4s ease'
};

const contentContainer = { maxWidth: '1200px', width: '92%' };
const headerStyle = { textAlign: 'center', marginBottom: '60px' };

const badgeStyle = {
    display: 'inline-flex', alignItems: 'center', padding: '8px 16px',
    background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
    borderRadius: '100px', fontSize: '10px', fontWeight: '900', marginBottom: '20px', letterSpacing: '1.5px'
};

const titleStyle = { fontSize: '56px', fontWeight: '950', marginBottom: '15px', letterSpacing: '-2px' };
const taglineStyle = { fontSize: '18px', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6', fontWeight: '500' };

const mainGrid = {
    display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '40px', width: '100%', alignItems: 'start'
};

const scannerCard = { borderRadius: '40px', padding: '25px', overflow: 'hidden', position: 'relative' };

const sidePanel = { textAlign: 'left' };
const systemHealthCard = { padding: '25px', borderRadius: '25px', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.02)' };
const panelTitle = { fontSize: '18px', fontWeight: '900', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' };

const statusItem = { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', marginBottom: '12px' };

const stepItem = { display: 'flex', gap: '18px', marginBottom: '28px' };
const stepCircle = {
    minWidth: '32px', height: '32px', borderRadius: '10px', background: '#10b981',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '900'
};
const stepTitle = { fontSize: '16px', fontWeight: '800', marginBottom: '4px', margin: 0 };

const privacyNotice = {
    marginTop: '45px', padding: '20px', borderRadius: '20px',
    display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid rgba(16, 185, 129, 0.1)'
};

export default AIScan;
