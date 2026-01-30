import React from 'react';

const About = ({ isDarkMode }) => { // 🌙 Prop receive ho rahi hai

    // --- 🎨 Dynamic Theme Palette ---
    const theme = {
        bg: isDarkMode ? '#0a0a0c' : '#f8fafc',
        card: isDarkMode ? '#141417' : '#ffffff',
        text: isDarkMode ? '#ffffff' : '#0f172a',
        subText: isDarkMode ? '#94a3b8' : '#64748b',
        border: isDarkMode ? '#27272a' : '#e2e8f0',
        bodyText: isDarkMode ? '#cbd5e1' : '#475569',
        footerBorder: isDarkMode ? '#1e1e21' : '#e2e8f0',
        shadow: isDarkMode ? '0 30px 60px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.05)'
    };

    return (
        <div style={{...fullPageWrapper, background: theme.bg, color: theme.text}}>
            <div style={contentContainer}>
                {/* Header Section */}
                <header style={headerStyle}>
                    <h1 style={{
                        ...titleStyle,
                        background: isDarkMode ? 'linear-gradient(to right, #ffffff, #10b981)' : 'linear-gradient(to right, #0f172a, #10b981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        About FitVision AI
                    </h1>
                    <p style={{...taglineStyle, color: theme.subText}}>Revolutionizing the way you find your perfect fit.</p>
                </header>

                {/* Mission Section */}
                <section style={{...glassSection, background: theme.card, borderColor: theme.border, boxShadow: theme.shadow}}>
                    <h2 style={sectionTitle}>Our Mission</h2>
                    <p style={{...textStyle, color: theme.bodyText}}>
                        Finding the right size shouldn't be a guessing game. FitVision AI uses
                        advanced data analytics to bridge the gap between brand-specific size
                        charts and your unique body measurements.
                    </p>
                </section>

                {/* Features Grid */}
                <div style={featureGrid}>
                    {[
                        { icon: '🎯', title: 'Precision Matching', desc: 'Exact size recommendations tailored to individual brand charts.' },
                        { icon: '💾', title: 'Fit Library', desc: 'Save and manage your measurements for different brands in one place.' },
                        { icon: '⚡', title: 'Instant Analysis', desc: 'Get AI-powered size suggestions in milliseconds.' }
                    ].map((f, i) => (
                        <div key={i} style={{...featureCard, background: theme.card, borderColor: theme.border, boxShadow: theme.shadow}}>
                            <div style={iconStyle}>{f.icon}</div>
                            <h3 style={{...cardTitle, color: theme.text}}>{f.title}</h3>
                            <p style={{...cardText, color: theme.subText}}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Tech Stack Footer */}
                <footer style={{...footerStyle, borderTop: `1px solid ${theme.footerBorder}`, color: theme.subText}}>
                    <p>Powered by <strong>Spring Boot</strong> • <strong>React</strong> • <strong>MongoDB</strong></p>
                </footer>
            </div>
        </div>
    );
};

// --- ✨ High-End Styles ---
const fullPageWrapper = { minHeight: '100vh', width: '100%', padding: '80px 5%', transition: 'all 0.4s ease' };
const contentContainer = { maxWidth: '1000px', margin: '0 auto' };
const headerStyle = { textAlign: 'center', marginBottom: '60px' };
const titleStyle = { fontSize: '52px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-1.5px' };
const taglineStyle = { fontSize: '20px', transition: '0.3s' };

const glassSection = { padding: '40px', borderRadius: '30px', border: '1px solid', marginBottom: '50px', textAlign: 'center', transition: '0.4s ease' };
const sectionTitle = { color: '#10b981', marginBottom: '20px', fontSize: '28px', fontWeight: '800' };
const textStyle = { lineHeight: '1.8', fontSize: '18px', transition: '0.3s' };

const featureGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' };
const featureCard = { padding: '30px', borderRadius: '24px', border: '1px solid', textAlign: 'center', transition: 'all 0.3s ease' };
const iconStyle = { fontSize: '40px', marginBottom: '15px' };
const cardTitle = { marginBottom: '10px', fontSize: '20px', fontWeight: '700' };
const cardText = { fontSize: '15px', lineHeight: '1.5', transition: '0.3s' };
const footerStyle = { marginTop: '80px', textAlign: 'center', fontSize: '14px', paddingTop: '30px', transition: '0.3s' };

export default About;
