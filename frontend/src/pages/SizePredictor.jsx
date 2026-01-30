import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, ArrowRight, Activity, Ruler } from 'lucide-react';

const SizePredictor = ({ isDarkMode }) => {
    const [formData, setFormData] = useState({ height: '', gender: 'male' });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        if (!formData.height) {
            alert("Please enter a valid height to proceed.");
            return;
        }

        setLoading(true);
        try {
            // Updated to match your FitController RequestMapping ("/api/fit")
            const response = await axios.get(`http://localhost:8080/api/fit/predict-size`, {
                params: {
                    height: formData.height,
                    gender: formData.gender
                }
            });

            if (response.status === 204) {
                alert("No statistical matches found for the provided height in the ANSUR II dataset.");
            } else {
                setPrediction(response.data);
            }
        } catch (error) {
            console.error("Prediction Service Error:", error);
            alert("The prediction service is currently unavailable. Please verify that the backend server is operational.");
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            padding: '60px 8%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '80vh'
        },
        card: {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
            padding: '40px',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center',
            boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.05)'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginTop: '30px'
        },
        input: {
            padding: '14px',
            borderRadius: '12px',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1'}`,
            background: isDarkMode ? '#0f172a' : '#f8fafc',
            color: isDarkMode ? '#ffffff' : '#0f172a',
            fontSize: '16px',
            outline: 'none'
        },
        button: {
            padding: '16px',
            borderRadius: '12px',
            background: '#10b981',
            color: 'white',
            fontWeight: '700',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: '0.3s ease',
            opacity: loading ? 0.7 : 1
        },
        resultCard: {
            marginTop: '30px',
            padding: '25px',
            borderRadius: '20px',
            background: isDarkMode ? 'rgba(16, 185, 129, 0.05)' : '#f0fdf4',
            border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5'}`,
            width: '100%',
            maxWidth: '500px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    width: '60px', height: '60px',
                    borderRadius: '18px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px'
                }}>
                    <Sparkles color="#10b981" size={30} />
                </div>

                <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                    AI Size Predictor
                </h2>
                <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '15px' }}>
                    Utilizing the ANSUR II database to estimate body metrics.
                </p>

                <div style={styles.inputGroup}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="number"
                            placeholder="Height (cm)"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            style={styles.input}
                        />
                    </div>

                    <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        style={styles.input}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    <button
                        onClick={handlePredict}
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Processing Profiles...' : 'Analyze Measurements'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </div>
            </div>

            {prediction && (
                <div style={styles.resultCard}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>CHEST</p>
                        <h4 style={{ fontSize: '18px', margin: '5px 0' }}>{prediction.predictedChest}</h4>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>cm</span>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, borderRight: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}` }}>
                        <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>WAIST</p>
                        <h4 style={{ fontSize: '18px', margin: '5px 0' }}>{prediction.predictedWaist}</h4>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>cm</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>HIPS</p>
                        <h4 style={{ fontSize: '18px', margin: '5px 0' }}>{prediction.predictedHips}</h4>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>cm</span>
                    </div>
                    <div style={{ gridColumn: 'span 3', marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#d1fae5'}`, textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#10b981', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <Activity size={12} /> Verified against {prediction.sampleSize || '6,000+'} profiles
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SizePredictor;
