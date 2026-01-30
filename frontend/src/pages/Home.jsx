import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sparkles, RefreshCw, AlertCircle, ArrowLeft, BookmarkCheck } from 'lucide-react';

const Home = ({ isDarkMode }) => {
    const [measurements, setMeasurements] = useState({ chest: '', waist: '', hips: '' });
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasCalculated, setHasCalculated] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const theme = {
        card: isDarkMode ? '#141417' : '#ffffff',
        text: isDarkMode ? '#ffffff' : '#0f172a',
        subText: isDarkMode ? '#9ca3af' : '#64748b',
        input: isDarkMode ? '#1e1e21' : '#f8fafc',
        border: isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
        shadow: isDarkMode ? '0 40px 100px rgba(0,0,0,0.6)' : '0 20px 50px rgba(0,0,0,0.06)'
    };

    const fetchRecommendations = useCallback(async (data) => {
        if (!data.chest || data.chest <= 0) return;
        setLoading(true);
        const toastId = 'sync-toast';
        toast.loading("Finding matches...", { id: toastId });

        try {
            const response = await axios.get('http://localhost:8080/api/fit/wardrobe', {
                params: { ...data }
            });
            setRecommendations(response.data);
            setHasCalculated(true);
            toast.success("Matches found!", { id: toastId });
        } catch {
            toast.error("Backend unreachable. Check IntelliJ.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const toastId = 'save-toast';
        toast.loading("Archiving to Atlas...", { id: toastId });

        try {
            // Hum pehla recommendation pick kar rahe hain as primary match
            const bestMatch = recommendations[0] || { brand: 'Generic', suggestedSize: 'N/A' };

            await axios.post('http://localhost:8080/api/fit/save', {
                brandName: "Manual Input",
                chest: measurements.chest,
                waist: measurements.waist,
                hips: measurements.hips,
                recommendedSize: bestMatch.suggestedSize
            });

            toast.success("Profile saved to History!", { id: toastId });
        } catch  {
            toast.error("Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const savedData = localStorage.getItem('lastScan');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setMeasurements(parsed);
        }
    }, []);

    return (
        <div style={containerStyle}>
            {!hasCalculated ? (
                <div style={{...glassCard, background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow}}>
                    <div style={iconStyle}>
                        {loading ? <RefreshCw className="spin-anim" size={40} color="#10b981" /> : <Sparkles size={40} color="#10b981" />}
                    </div>
                    <h2 style={{...titleStyle, color: theme.text}}>Initialize <span style={{color: '#10b981'}}>FitProfile</span></h2>

                    <div style={formStyle}>
                        {['chest', 'waist', 'hips'].map((field) => (
                            <div key={field} style={inputGroup}>
                                <label style={labelStyle}>{field.toUpperCase()} (CM)</label>
                                <input
                                    type="number"
                                    value={measurements[field]}
                                    onChange={(e) => setMeasurements({...measurements, [field]: e.target.value})}
                                    placeholder="Enter CM"
                                    style={{...inputStyle, background: theme.input, color: theme.text, border: `1px solid ${theme.border}`}}
                                />
                            </div>
                        ))}
                        <button
                            onClick={() => fetchRecommendations(measurements)}
                            disabled={loading || !measurements.chest}
                            style={buttonStyle}
                        >
                            {loading ? "SEARCHING..." : "VIEW SMART WARDROBE"}
                        </button>
                    </div>
                </div>
            ) : (
                <div style={wardrobeWrapper}>
                    <header style={wardrobeHeader}>
                        <div style={{display: 'flex', gap: '12px'}}>
                            <button onClick={() => setHasCalculated(false)} style={backBtn}>
                                <ArrowLeft size={18} /> Edit Metrics
                            </button>
                            {/* Naya Save Button */}
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                style={{...backBtn, background: '#10b981', color: '#fff', border: 'none'}}
                            >
                                <BookmarkCheck size={18} /> {isSaving ? "Saving..." : "Save to History"}
                            </button>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <h2 style={{margin: 0, color: theme.text}}>Smart <span style={{color: '#10b981'}}>Closet</span></h2>
                            <p style={{color: theme.subText, fontSize: '12px'}}>Personalized for {measurements.chest}cm Chest</p>
                        </div>
                    </header>

                    <div style={productGrid}>
                        {recommendations.length > 0 ? recommendations.map((item, idx) => (
                            <div key={idx} className="product-card" style={{...productCard, background: theme.card, border: `1px solid ${theme.border}`}}>
                                <div style={imageContainer}>
                                    <img
                                        src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=500&h=600&keyword=${item.brand}`}
                                        alt={item.name}
                                        style={productImage}
                                        className="card-img"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=500&h=600&auto=format&fit=crop'; }}
                                    />
                                    <div style={imageOverlay} />
                                    <div style={categoryBadge}>{item.brand}</div>
                                </div>
                                <div style={{padding: '20px'}}>
                                    <div style={brandTag}>{item.brand}</div>
                                    <div style={{fontWeight: '800', fontSize: '18px', color: theme.text, marginBottom: '4px'}}>Recommended Fit</div>
                                    <div style={{fontSize: '13px', color: theme.subText}}>
                                        Size: <span style={{color: '#10b981', fontWeight: '900'}}>{item.suggestedSize}</span>
                                    </div>
                                    <div style={stockIndicator}>● READY TO SYNC</div>
                                </div>
                            </div>
                        )) : (
                            <div style={emptyState}>
                                <AlertCircle size={40} color={theme.subText} />
                                <p>No exact matches in Atlas database.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <style>{`
                .spin-anim { animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; } 
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .product-card { transition: all 0.3s ease; }
                .product-card:hover { transform: translateY(-8px); }
                .product-card:hover .card-img { transform: scale(1.05); }
            `}</style>
        </div>
    );
};

// --- Styles (Restored & Polished) ---
const containerStyle = { padding: '60px 5%', minHeight: '85vh', display: 'flex', justifyContent: 'center' };
const wardrobeWrapper = { width: '100%', maxWidth: '1100px' };
const wardrobeHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid rgba(16, 185, 129, 0.1)', paddingBottom: '20px' };
const productGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' };
const productCard = { borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', position: 'relative' };
const imageContainer = { height: '300px', width: '100%', position: 'relative', overflow: 'hidden', background: '#1a1a1a' };
const productImage = { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' };
const imageOverlay = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))' };
const categoryBadge = { position: 'absolute', bottom: '15px', left: '15px', color: '#fff', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' };
const brandTag = { fontSize: '10px', fontWeight: '900', color: '#10b981', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' };
const stockIndicator = { fontSize: '10px', color: '#10b981', marginTop: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' };
const backBtn = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', border: '1px solid #10b981', color: '#10b981', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '700' };
const glassCard = { padding: '45px', borderRadius: '40px', width: '100%', maxWidth: '480px', textAlign: 'center' };
const titleStyle = { fontSize: '32px', fontWeight: '950', marginBottom: '30px', letterSpacing: '-1px' };
const iconStyle = { marginBottom: '25px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '25px' };
const inputGroup = { textAlign: 'left' };
const labelStyle = { color: '#10b981', fontSize: '10px', fontWeight: '900', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '16px', borderRadius: '16px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' };
const buttonStyle = { padding: '18px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '18px', cursor: 'pointer', fontWeight: '900', fontSize: '14px' };
const emptyState = { gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', opacity: 0.5 };

export default Home;
