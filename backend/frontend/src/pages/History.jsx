import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const History = ({ isDarkMode }) => { // 🌙 Prop receive kar rahe hain
    const [history, setHistory] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);

    const fetchHistory = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/fit/history');
            setHistory(response.data);
        } catch (error) {
            toast.error("Backend connection failed");
        }
    };

    const deleteRecord = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/fit/delete/${id}`);
            toast.success("Profile Removed");
            fetchHistory();
        } catch (error) {
            toast.error("Error");
        }
    };

    useEffect(() => { fetchHistory(); }, []);

    // --- 🎨 Dynamic Theme Palette ---
    const theme = {
        bg: isDarkMode ? '#0a0a0c' : '#f8fafc',
        card: isDarkMode ? '#141417' : '#ffffff',
        text: isDarkMode ? '#ffffff' : '#0f172a',
        subText: isDarkMode ? '#94a3b8' : '#64748b',
        innerBox: isDarkMode ? '#1e1e21' : '#f1f5f9',
        border: isDarkMode ? '#27272a' : '#e2e8f0',
        shadow: isDarkMode
            ? '0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(16, 185, 129, 0.25)'
            : '0 20px 40px rgba(0,0,0,0.06), 0 0 25px rgba(16, 185, 129, 0.15)'
    };

    return (
        <div style={{...fullPageWrapper, background: theme.bg, color: theme.text}}>
            <div style={mainContent}>
                <header style={headerStyle}>
                    <h1 style={{...titleStyle, background: isDarkMode ? 'linear-gradient(to right, #ffffff, #10b981)' : 'linear-gradient(to right, #0f172a, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                        My Fit Journey
                    </h1>
                    <p style={{...taglineStyle, color: theme.subText}}>
                        Your precision-tailored sizes, calculated by AI for every brand.
                    </p>
                </header>

                <div style={responsiveGrid}>
                    {history.map((item) => (
                        <div
                            key={item.id}
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{
                                ...premiumCard,
                                background: theme.card,
                                borderColor: hoveredId === item.id ? '#10b981' : theme.border,
                                transform: hoveredId === item.id ? 'translateY(-10px)' : 'translateY(0)',
                                boxShadow: hoveredId === item.id ? theme.shadow : 'none'
                            }}
                        >
                            <button onClick={() => deleteRecord(item.id)} style={{...closeBtn, color: theme.subText}}>✕</button>

                            <div style={cardHeader}>
                                <h3 style={brandName}>{item.brandName}</h3>
                                <span style={{...dateBadge, background: theme.innerBox, color: theme.subText}}>
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>

                            <div style={{...statsContainer, background: theme.innerBox}}>
                                <div style={statBox}>
                                    <small style={statLabel}>CHEST</small>
                                    <p style={{...statVal, color: theme.text}}>{item.chest}cm</p>
                                </div>
                                <div style={statBox}>
                                    <small style={statLabel}>WAIST</small>
                                    <p style={{...statVal, color: theme.text}}>{item.waist}cm</p>
                                </div>
                                <div style={statBox}>
                                    <small style={statLabel}>HIPS</small>
                                    <p style={{...statVal, color: theme.text}}>{item.hips}cm</p>
                                </div>
                            </div>

                            <div style={sizeFinalSection}>
                                {item.recommendedSize.includes("range") ? (
                                    <span style={rangeError}>Size Not Matchable</span>
                                ) : (
                                    <div style={heroSizeBox}>
                                        <p style={{...heroSizeText, color: theme.text}}>{item.recommendedSize}</p>
                                        <p style={recLabel}>RECOMMENDED SIZE</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {history.length === 0 && <p style={{...emptyText, color: theme.subText}}>No fit profiles recorded yet.</p>}
            </div>
        </div>
    );
};

// --- ✨ Styles Update ---
const fullPageWrapper = { minHeight: '100vh', width: '100%', transition: '0.4s ease' };
const mainContent = { padding: '80px 5% 40px 5%', maxWidth: '1400px', margin: '0 auto' };
const headerStyle = { marginBottom: '60px', textAlign: 'center' };
const titleStyle = { fontSize: '52px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '10px' };
const taglineStyle = { fontSize: '18px', fontWeight: '400', transition: '0.3s' };
const responsiveGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' };

const premiumCard = {
    borderRadius: '30px', padding: '35px', position: 'relative',
    border: '1px solid', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'pointer'
};

const closeBtn = { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' };
const cardHeader = { marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const brandName = { fontSize: '26px', fontWeight: '800', color: '#10b981', textTransform: 'capitalize', margin: '0' };
const dateBadge = { fontSize: '11px', padding: '4px 10px', borderRadius: '20px', transition: '0.3s' };
const statsContainer = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', padding: '20px', borderRadius: '20px', marginBottom: '30px', transition: '0.3s' };
const statBox = { textAlign: 'center' };
const statLabel = { fontSize: '10px', color: '#71717a', fontWeight: 'bold', display: 'block', marginBottom: '5px' };
const statVal = { margin: '0', fontSize: '14px', fontWeight: '600' };

const sizeFinalSection = { textAlign: 'center' };
const heroSizeBox = { display: 'inline-block' };
const heroSizeText = { fontSize: '64px', fontWeight: '950', margin: '0', lineHeight: '1' };
const recLabel = { fontSize: '11px', fontWeight: '700', color: '#10b981', letterSpacing: '2px', marginTop: '5px' };
const rangeError = { color: '#ef4444', fontSize: '14px', fontWeight: '600', opacity: 0.8 };
const emptyText = { textAlign: 'center', marginTop: '100px', fontSize: '20px' };

export default History;
