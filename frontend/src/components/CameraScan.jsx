import React, { useRef, useEffect, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils/camera_utils';
import Webcam from 'react-webcam';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Sparkles, ShoppingBag, CheckCircle, Ruler, AlertCircle, Zap } from 'lucide-react';

const CameraScan = ({ isDarkMode }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);

    const [brand, setBrand] = useState('');
    const [userHeight, setUserHeight] = useState(170);
    const [measurements, setMeasurements] = useState({ chest: 0, waist: 0, hips: 0 });
    const [allRecommendations, setAllRecommendations] = useState([]);
    const [history, setHistory] = useState({ chest: [], waist: [], hips: [] });

    const theme = {
        text: isDarkMode ? '#ffffff' : '#0f172a',
        panelBg: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc',
        border: isDarkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
        label: isDarkMode ? '#94a3b8' : '#64748b',
        cardBg: isDarkMode ? '#1e1e21' : '#ffffff'
    };

    const calculateDistance = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    const getSmoothedValue = (key, newValue) => {
        setHistory(prev => {
            const currentArr = [...prev[key], newValue].slice(-15);
            return { ...prev, [key]: currentArr };
        });
        const arr = history[key];
        if (arr.length === 0) return Math.round(newValue);
        const sum = arr.reduce((a, b) => a + b, 0);
        return Math.round(sum / arr.length);
    };

    useEffect(() => {
        const pose = new Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.75,
            minTrackingConfidence: 0.75
        });

        pose.onResults((results) => {
            if (!results.poseLandmarks) return;
            const canvasElement = canvasRef.current;
            if (!canvasElement) return;

            const canvasCtx = canvasElement.getContext("2d");
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            const landmarks = results.poseLandmarks;
            drawPose(canvasCtx, landmarks, canvasElement.width, canvasElement.height);

            const nose = landmarks[0];
            const ankle = landmarks[28];

            if (nose.visibility > 0.6 && ankle.visibility > 0.6) {
                const pixelHeight = calculateDistance(nose, ankle);

                if (pixelHeight > 0.25) {
                    const cmPerPixel = userHeight / (pixelHeight * 100);
                    const shoulderPx = calculateDistance(landmarks[11], landmarks[12]);
                    const waistPx = calculateDistance(landmarks[23], landmarks[24]);

                    setMeasurements({
                        chest: getSmoothedValue('chest', (shoulderPx * cmPerPixel) * Math.PI * 1.15),
                        waist: getSmoothedValue('waist', (waistPx * cmPerPixel) * Math.PI * 1.10),
                        hips: getSmoothedValue('hips', (waistPx * cmPerPixel) * Math.PI * 1.15)
                    });
                }
            }
            canvasCtx.restore();
        });

        if (webcamRef.current) {
            cameraRef.current = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (webcamRef.current?.video) await pose.send({ image: webcamRef.current.video });
                },
                width: 640, height: 480,
            });
            cameraRef.current.start();
        }

        return () => { if (cameraRef.current) cameraRef.current.stop(); };
    }, [userHeight, history]);

    const handleCapture = async () => {
        const toastId = 'sync-toast';
        toast.loading("Fetching Smart Inventory...", { id: toastId });

        try {
            const response = await axios.get(`http://localhost:8080/api/fit/wardrobe`, {
                params: { brand: brand || 'All', ...measurements }
            });

            setAllRecommendations(response.data);
            localStorage.setItem('lastScan', JSON.stringify(measurements));
            toast.success("Identity & Wardrobe Synced!", { id: toastId });
        } catch { // Fixed unused variable error
            toast.error("Cloud Server Offline.", { id: toastId });
        }
    };

    const drawPose = (ctx, landmarks, width, height) => {
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 3;
        // Draw Skeleton Lines for Visual Feedback
        const connections = [[11, 12], [23, 24], [11, 23], [12, 24]];
        connections.forEach(([a, b]) => {
            ctx.beginPath();
            ctx.moveTo(landmarks[a].x * width, landmarks[a].y * height);
            ctx.lineTo(landmarks[b].x * width, landmarks[b].y * height);
            ctx.stroke();
        });
    };

    return (
        <div style={{ color: theme.text, width: '100%' }}>
            <div style={calibrationBar}>
                <Ruler size={14} color="#10b981" />
                <span style={{fontSize: '10px', fontWeight: '900', letterSpacing: '1px'}}>CALIBRATE HEIGHT:</span>
                <input type="number" value={userHeight} onChange={(e) => setUserHeight(e.target.value)} style={heightInput} />
                <span style={{fontSize: '10px', fontWeight: '900', color: '#10b981'}}>CM</span>
            </div>

            <div style={viewfinderWrapper}>
                <Webcam ref={webcamRef} style={webcamStyle} mirrored />
                <canvas ref={canvasRef} width="640" height="480" style={canvasOverlay} />
                <div style={aiStatusTag}>
                    <div className={measurements.chest > 0 ? "pulse-active" : "pulse-idle"} />
                    {measurements.chest > 0 ? "AI TRACKING ACTIVE" : "POSITIONING BODY..."}
                </div>
            </div>

            <div style={{ ...dataPanelStyle, background: theme.panelBg, border: `1px solid ${theme.border}` }}>
                <div style={telemetryGrid}>
                    {Object.entries(measurements).map(([key, val]) => (
                        <div key={key} style={telemetryBox}>
                            <span style={{ fontSize: '9px', color: theme.label, fontWeight: '900', letterSpacing: '1px' }}>{key.toUpperCase()}</span>
                            <div style={{ fontSize: '22px', fontWeight: '950', color: val > 0 ? '#10b981' : theme.label }}>{val}<small style={{fontSize: '12px'}}>cm</small></div>
                        </div>
                    ))}
                </div>

                <div style={actionRow}>
                    <input type="text" placeholder="Brand Preference" value={brand} onChange={(e) => setBrand(e.target.value)} style={{ ...brandInput, border: `1px solid ${theme.border}`, background: theme.cardBg, color: theme.text }} />
                    <button onClick={handleCapture} style={mainBtn} disabled={measurements.chest === 0}>
                        <Zap size={16} fill="white" /> SYNC CLOSET
                    </button>
                </div>
            </div>

            {allRecommendations.length > 0 && (
                <div style={{marginTop: '30px', textAlign: 'left'}}>
                    <h3 style={{fontSize: '14px', fontWeight: '900', marginBottom: '15px', color: '#10b981'}}>SMART RECOMMENDATIONS</h3>
                    <div style={gridContainer}>
                        {allRecommendations.map((rec, i) => (
                            <div key={i} className="rec-card" style={{ ...recCard, background: theme.cardBg, border: `1px solid ${theme.border}` }}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                    <div style={brandIcon}><ShoppingBag size={14} color="#10b981" /></div>
                                    <div>
                                        <div style={{fontSize: '12px', fontWeight: '800'}}>{rec.brand}</div>
                                        <div style={{fontSize: '9px', color: theme.label}}>{rec.name || 'Premium Apparel'}</div>
                                    </div>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                    <div style={{fontSize: '18px', fontWeight: '900', color: '#10b981'}}>{rec.suggestedSize}</div>
                                    <div style={{fontSize: '8px', fontWeight: '900', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px'}}>
                                        <CheckCircle size={8} /> MATCH
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <style>{`
                .pulse-active { width: 8px; height: 8px; background: #10b981; borderRadius: 50%; box-shadow: 0 0 10px #10b981; animation: pulse 1.5s infinite; }
                .pulse-idle { width: 8px; height: 8px; background: #64748b; borderRadius: 50%; }
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
                .rec-card { transition: transform 0.2s ease; cursor: pointer; }
                .rec-card:hover { transform: translateY(-3px); border-color: #10b981 !important; }
            `}</style>
        </div>
    );
};

// --- Styles ---
const calibrationBar = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', width: 'fit-content' };
const heightInput = { background: 'transparent', border: 'none', borderBottom: '1.5px solid #10b981', color: '#10b981', width: '45px', fontWeight: '900', outline: 'none', textAlign: 'center', fontSize: '13px' };
const viewfinderWrapper = { position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' };
const webcamStyle = { width: '100%', display: 'block' };
const canvasOverlay = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'scaleX(-1)' };
const aiStatusTag = { position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', padding: '5px 12px', borderRadius: '15px', color: 'white', fontSize: '9px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' };
const dataPanelStyle = { marginTop: '15px', padding: '20px', borderRadius: '20px' };
const telemetryGrid = { display: 'flex', justifyContent: 'space-around', marginBottom: '15px' };
const telemetryBox = { textAlign: 'center' };
const actionRow = { display: 'flex', gap: '10px' };
const brandInput = { flex: 1, padding: '10px 15px', borderRadius: '12px', outline: 'none', fontSize: '12px' };
const mainBtn = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' };
const gridContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' };
const recCard = { padding: '12px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const brandIcon = { width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' };

export default CameraScan;