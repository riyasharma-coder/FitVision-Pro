import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Trash2, Activity, Ruler, ChevronRight, PackageSearch, AlertCircle } from 'lucide-react';

const History = ({ isDarkMode }) => {
    const [history, setHistory] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/fit/history');
            // Backend synchronization check
            setHistory(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Backend offline. Check IntelliJ.");
        } finally {
            setLoading(false);
        }
    };

    const deleteRecord = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/fit/delete/${id}`);
            toast.success("Profile Removed");
            fetchHistory();
        } catch (error) {
            console.error(error);
            toast.error("Error deleting");
        }
    };

    useEffect(() => { fetchHistory(); }, []);

    const theme = {
        bg: isDarkMode ? '#0a0a0c' : '#f8fafc',
        card: isDarkMode ? '#141417' : '#ffffff',
        text: isDarkMode ? '#ffffff' : '#0f172a',
        subText: isDarkMode ? '#94a3b8' : '#64748b',
        innerBox: isDarkMode ? '#1e1e21' : '#f1f5f9',
        border: isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
        shadow: isDarkMode
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    };

    return (
        <div style={{...fullPageWrapper, background: theme.bg, color: theme.text}}>
            <div style={mainContent}>
                <header style={headerStyle}>
                    <div style={badgeStyle}>AI-POWERED ARCHIVE</div>
                    <h1 style={{...titleStyle, background: isDarkMode ? 'linear-gradient(to right, #ffffff, #10b981)' : 'linear-gradient(to right, #0f172a, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                        Your Smart Closet
                    </h1>
                </header>

                {loading ? (
                    <div style={centeredContainer}><Activity className="spin-anim" color="#10b981" /></div>
                ) : history.length > 0 ? (
                    <div style={responsiveGrid}>
                        {history.map((item) => {
                            // NULL-SAFE CHECK: Ensures app doesn't crash if recommendedSize is null
                            const rawSize = item.recommendedSize || "N/A";
                            const isOutOfRange = rawSize.toLowerCase().includes("range") || rawSize === "N/A";

                            return (
                                <div
                                    key={item.id}
                                    onMouseEnter={() => setHoveredId(item.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    style={{
                                        ...premiumCard,
                                        background: theme.card,
                                        borderColor: hoveredId === item.id ? (isOutOfRange ? '#ef4444' : '#10b981') : theme.border,
                                        transform: hoveredId === item.id ? 'translateY(-8px)' : 'translateY(0)',
                                        boxShadow: hoveredId === item.id ? theme.shadow : 'none'
                                    }}
                                >
                                    <button
                                        onClick={() => deleteRecord(item.id)}
                                        style={{...closeBtn, color: hoveredId === item.id ? '#ef4444' : theme.subText}}
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div style={cardHeader}>
                                        <div>
                                            <h3 style={brandName}>{item.brandName || "Generic"}</h3>
                                            <div style={{...fitBadge, background: isOutOfRange ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: isOutOfRange ? '#ef4444' : '#10b981'}}>
                                                {isOutOfRange ? 'OUT OF RANGE' : 'PERFECT FIT'}
                                            </div>
                                        </div>
                                        <div style={{textAlign: 'right'}}>
                                            <span style={{fontSize: '10px', color: theme.subText, fontWeight: '700'}}>
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : "RECENT"}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{...statsContainer, background: theme.innerBox}}>
                                        <div style={statBox}>
                                            <Activity size={12} color="#10b981" />
                                            <small style={statLabel}>CHEST</small>
                                            <p style={{...statVal, color: theme.text}}>{item.chest || 0}cm</p>
                                        </div>
                                        <div style={statBox}>
                                            <Ruler size={12} color="#10b981" />
                                            <small style={statLabel}>WAIST</small>
                                            <p style={{...statVal, color: theme.text}}>{item.waist || 0}cm</p>
                                        </div>
                                        <div style={statBox}>
                                            <ChevronRight size={12} color="#10b981" />
                                            <small style={statLabel}>HIPS</small>
                                            <p style={{...statVal, color: theme.text}}>{item.hips || 0}cm</p>
                                        </div>
                                    </div>

                                    <div style={sizeFinalSection}>
                                        {isOutOfRange ? (
                                            <div style={errorContainer}>
                                                <AlertCircle size={18} color="#ef4444" />
                                                <p style={errorText}>Size not found for metrics</p>
                                            </div>
                                        ) : (
                                            <div style={heroSizeBox}>
                                                <p style={{...heroSizeText, color: theme.text}}>{rawSize}</p>
                                                <p style={recLabel}>RECOMMENDED SIZE</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={centeredContainer}>
                        <PackageSearch size={48} color={theme.subText} strokeWidth={1} />
                        <p style={{marginTop: '15px', fontWeight: '600', color: theme.subText}}>No smart profiles found.</p>
                    </div>
                )}
            </div>
            <style>{`.spin-anim { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

// --- Updated Styles for Professional Scaling ---
const fullPageWrapper = { minHeight: '100vh', width: '100%', transition: '0.4s ease' };
const mainContent = { padding: '40px 5%', maxWidth: '1400px', margin: '0 auto' };
const headerStyle = { marginBottom: '50px', textAlign: 'center' };
const badgeStyle = { display: 'inline-block', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '100px', fontSize: '10px', fontWeight: '900', marginBottom: '15px', letterSpacing: '1px' };
const titleStyle = { fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '10px' };
const responsiveGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' };

const premiumCard = { borderRadius: '28px', padding: '30px', position: 'relative', border: '1px solid', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'default' };
const closeBtn = { position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10, transition: '0.2s' };
const cardHeader = { marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const brandName = { fontSize: '22px', fontWeight: '900', color: '#10b981', margin: '0', letterSpacing: '-0.5px' };
const fitBadge = { fontSize: '9px', fontWeight: '900', padding: '4px 10px', borderRadius: '8px', marginTop: '8px', display: 'inline-block' };

const statsContainer = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '18px', borderRadius: '20px', marginBottom: '25px' };
const statBox = { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' };
const statLabel = { fontSize: '8px', color: '#71717a', fontWeight: '900', letterSpacing: '0.5px' };
const statVal = { margin: '0', fontSize: '14px', fontWeight: '800' };

const sizeFinalSection = { textAlign: 'center', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const heroSizeBox = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
const heroSizeText = { fontSize: '58px', fontWeight: '900', margin: '0', lineHeight: '0.9', letterSpacing: '-2px' };
const recLabel = { fontSize: '9px', fontWeight: '900', color: '#10b981', letterSpacing: '1.5px', marginTop: '12px' };

const errorContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' };
const errorText = { fontSize: '13px', fontWeight: '700', color: '#ef4444', margin: 0, maxWidth: '200px', lineHeight: '1.4' };
const centeredContainer = { textAlign: 'center', marginTop: '120px' };

export default History;
