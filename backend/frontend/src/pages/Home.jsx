import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Home = ({ isDarkMode }) => {
    const [measurements, setMeasurements] = useState({ chest: '', waist: '', hips: '' });
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setMeasurements({ ...measurements, [e.target.name]: e.target.value });
    };

    const handleCalculate = async () => {
        if (!measurements.chest || !measurements.waist || !measurements.hips) {
            toast.error("All metrics are required! 📏");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/fit/suggest', {
                params: { brand: 'Generic', ...measurements }
            });
            setResult(response.data);
            toast.success("AI Analysis Complete!");
        } catch (error) {
            toast.error("Backend Connection Failed!");
        } finally { setLoading(false); }
    };

    // --- 🎨 Dynamic Theme Palette ---
    const theme = {
        card: isDarkMode ? '#141417' : '#ffffff', // Dark Grey vs Pure White
        text: isDarkMode ? '#ffffff' : '#0f172a', // White vs Deep Slate
        subText: isDarkMode ? '#9ca3af' : '#64748b',
        input: isDarkMode ? '#1e1e21' : '#f8fafc',
        border: isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
        shadow: isDarkMode ? '0 40px 100px rgba(0,0,0,0.6)' : '0 20px 50px rgba(0,0,0,0.06)'
    };

    return (
        <div style={homeWrapper}>
            <div style={{...glassCard, background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow}}>
                <div style={iconStyle}>📏</div>
                <h2 style={{...titleStyle, color: theme.text}}>FitVision <span style={{color: '#10b981'}}>Calculator</span></h2>
                <p style={{...subtitleStyle, color: theme.subText}}>Precision AI metrics for your perfect brand fit.</p>

                <div style={formStyle}>
                    {[
                        { label: 'CHEST (CM)', name: 'chest', placeholder: 'e.g. 96' },
                        { label: 'WAIST (CM)', name: 'waist', placeholder: 'e.g. 84' },
                        { label: 'HIPS (CM)', name: 'hips', placeholder: 'e.g. 98' }
                    ].map((input) => (
                        <div key={input.name} style={inputGroup}>
                            <label style={labelStyle}>{input.label}</label>
                            <input
                                name={input.name}
                                placeholder={input.placeholder}
                                type="number"
                                onChange={handleChange}
                                style={{
                                    ...inputStyle,
                                    background: theme.input,
                                    color: theme.text,
                                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#cbd5e1'}`
                                }}
                            />
                        </div>
                    ))}

                    <button onClick={handleCalculate} disabled={loading} style={buttonStyle}>
                        {loading ? "PROCESSING..." : "GET BEST FIT"}
                    </button>
                </div>

                {result && (
                    <div style={{...resultGlow, background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'}}>
                        <small style={{color: '#10b981', letterSpacing: '2px', fontWeight: 'bold'}}>AI SUGGESTION</small>
                        <div style={{fontSize: '48px', fontWeight: '900', marginTop: '5px', color: theme.text}}>{result}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 🏗️ Styles ---
const homeWrapper = {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '85vh', width: '100%', transition: '0.4s ease'
};

const glassCard = {
    padding: '50px 40px', borderRadius: '35px', width: '450px',
    textAlign: 'center', transition: '0.4s ease'
};

const titleStyle = { fontSize: '32px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-1px' };
const subtitleStyle = { fontSize: '15px', marginBottom: '35px' };
const iconStyle = { fontSize: '50px', marginBottom: '15px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '22px' };
const inputGroup = { textAlign: 'left' };
const labelStyle = { display: 'block', color: '#10b981', fontSize: '11px', fontWeight: '900', marginBottom: '8px', letterSpacing: '1px' };

const inputStyle = {
    width: '100%', padding: '16px', borderRadius: '16px',
    fontSize: '16px', outline: 'none', boxSizing: 'border-box', transition: '0.3s'
};

const buttonStyle = {
    padding: '18px', background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff', border: 'none', borderRadius: '18px', cursor: 'pointer',
    fontWeight: '900', fontSize: '15px', letterSpacing: '1px', marginTop: '15px',
    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
};

const resultGlow = {
    marginTop: '35px', padding: '25px', borderRadius: '25px',
    border: '1px solid #10b981',
    boxShadow: '0 0 30px rgba(16, 185, 129, 0.1)'
};

export default Home;