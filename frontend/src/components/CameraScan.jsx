import React, { useRef, useEffect, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils/camera_utils';
import Webcam from 'react-webcam';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CameraScan = ({ isDarkMode }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [brand, setBrand] = useState('');
    const [measurements, setMeasurements] = useState({ chest: 0, waist: 0, hips: 0 });
    const [resultSize, setResultSize] = useState(null);
    const [allRecommendations, setAllRecommendations] = useState([]); // 🚀 New State

    const theme = {
        text: isDarkMode ? '#ffffff' : '#1e293b',
        panelBg: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        border: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
        label: isDarkMode ? '#94a3b8' : '#64748b',
        cardBg: isDarkMode ? '#1e1e21' : '#ffffff'
    };

    const calculateDistance = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    useEffect(() => {
        const pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });
        pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

        pose.onResults((results) => {
            if (!results.poseLandmarks) return;
            const canvasElement = canvasRef.current;
            const canvasCtx = canvasElement.getContext("2d");
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            const landmarks = results.poseLandmarks;
            drawPose(canvasCtx, landmarks, canvasElement.width, canvasElement.height);

            const shoulderDist = calculateDistance(landmarks[11], landmarks[12]);
            const hipDist = calculateDistance(landmarks[23], landmarks[24]);

            setMeasurements({
                chest: Math.round(shoulderDist * 215),
                waist: Math.round(hipDist * 230 * 0.92),
                hips: Math.round(hipDist * 230)
            });
            canvasCtx.restore();
        });

        if (webcamRef.current) {
            const camera = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => { await pose.send({ image: webcamRef.current.video }); },
                width: 640, height: 480,
            });
            camera.start();
        }
    }, []);

    const handleCapture = async () => {
        if (!brand) { toast.error("Please enter a Brand Name first!"); return; }
        try {
            toast.loading("AI is analyzing all brands...");

            // 1. Single Suggestion Call
            const resSingle = await axios.get(`http://localhost:8080/api/fit/suggest`, { params: { brand, ...measurements } });
            setResultSize(resSingle.data);

            // 2. Explore All Brands Call 🚀
            const resExplore = await axios.get(`http://localhost:8080/api/fit/explore-all`, { params: { ...measurements } });
            setAllRecommendations(resExplore.data);

            toast.dismiss();
            toast.success("Analysis Complete!");
        } catch (error) { toast.dismiss(); toast.error("Backend offline!"); }
    };

    const drawPose = (ctx, landmarks, width, height) => {
        ctx.strokeStyle = "#10b981"; ctx.lineWidth = 4;
        [[11, 12], [23, 24]].forEach(([a, b]) => {
            ctx.beginPath();
            ctx.moveTo(landmarks[a].x * width, landmarks[a].y * height);
            ctx.lineTo(landmarks[b].x * width, landmarks[b].y * height);
            ctx.stroke();
        });
    };

    return (
        <div style={{ textAlign: 'center', color: theme.text, width: '100%' }}>
            <h2 style={{ marginBottom: '15px', fontWeight: '800' }}>📏 FitVision AI Calculator</h2>

            <div style={{ position: 'relative', display: 'inline-block', borderRadius: '25px', overflow: 'hidden', border: `4px solid ${theme.border}` }}>
                <Webcam ref={webcamRef} style={{ width: 640, height: 480, display: 'block' }} />
                <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0 }} />
            </div>

            <div style={{ ...dataPanelStyle, background: theme.panelBg, border: `1px solid ${theme.border}` }}>
                <input
                    type="text" placeholder="Enter Brand (e.g. Nike)" value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    style={{ ...brandInputStyle, border: `1px solid ${theme.border}`, color: theme.text, background: isDarkMode ? '#1e1e21' : '#ffffff' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    {['chest', 'waist', 'hips'].map((key) => (
                        <div key={key} style={statBox}>
                            <small style={{ color: theme.label, textTransform: 'uppercase', fontWeight: 'bold', fontSize: '10px' }}>{key}</small>
                            <input
                                type="number" value={measurements[key]}
                                onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
                                style={{ ...miniInput, color: theme.text, borderBottom: `2px solid #10b981` }}
                            />
                        </div>
                    ))}
                </div>

                <button onClick={handleCapture} style={captureBtnStyle}>Find My Size</button>

                {resultSize && (
                    <div style={{ marginTop: '20px', padding: '15px', background: '#10b981', color: '#ffffff', borderRadius: '15px', fontWeight: 'bold' }}>
                        <h3>Suggested {brand} Size: {resultSize}</h3>
                    </div>
                )}
            </div>

            {/* 👗 Virtual Wardrobe Section */}
            {allRecommendations.length > 0 && (
                <div style={{ marginTop: '40px', textAlign: 'left', width: '100%', maxWidth: '640px', margin: '40px auto' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '22px' }}>✨ Your Smart Wardrobe</h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {allRecommendations.map((rec, i) => (
                            <div key={i} style={{ ...recCardStyle, background: theme.cardBg, border: `1px solid ${theme.border}`, borderLeft: `6px solid ${rec.themeColor}` }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{rec.brand}</h4>
                                    <small style={{ color: theme.label }}>{rec.category}</small>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>{rec.size}</div>
                                    <small style={{ fontWeight: 'bold', fontSize: '10px' }}>{rec.fitStatus.toUpperCase()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Styles ---
const dataPanelStyle = { marginTop: '20px', padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '640px', margin: '20px auto' };
const brandInputStyle = { width: '90%', padding: '12px', marginBottom: '20px', borderRadius: '12px', fontSize: '16px', textAlign: 'center', outline: 'none' };
const statBox = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
const miniInput = { width: '70px', background: 'transparent', border: 'none', textAlign: 'center', fontSize: '22px', fontWeight: '900', outline: 'none' };
const captureBtnStyle = { width: '100%', padding: '16px', fontSize: '18px', cursor: 'pointer', borderRadius: '12px', border: 'none', background: '#10b981', color: '#ffffff', fontWeight: 'bold' };
const recCardStyle = { padding: '15px 25px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s' };

export default CameraScan;