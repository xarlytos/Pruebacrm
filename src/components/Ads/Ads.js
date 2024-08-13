// C:\Users\usuario\Downloads\crmworkspaceEspacial\crm-frontend\src\components\Ads.js
import React, { useState } from 'react';
import './Ads.css';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PopupInfoMark from './PopupInfoMark.js';

const Ads = ({ theme }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleGenerateReport = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const organicData = [
        { name: 'Ad A', visits: 5000, clicks: 3000, conversions: 500 },
        { name: 'Ad B', visits: 4500, clicks: 2800, conversions: 450 },
        { name: 'Ad C', visits: 4200, clicks: 2500, conversions: 400 },
        { name: 'Ad D', visits: 3800, clicks: 2300, conversions: 380 },
        { name: 'Ad E', visits: 3600, clicks: 2100, conversions: 350 },
        { name: 'Ad F', visits: 3400, clicks: 2000, conversions: 300 },
        { name: 'Ad G', visits: 3200, clicks: 1900, conversions: 290 },
    ];

    const paidData = [
        { name: 'Ad A', reached: 7000, interactions: 5000, followers: 2000 },
        { name: 'Ad B', reached: 6500, interactions: 4800, followers: 1800 },
        { name: 'Ad C', reached: 6000, interactions: 4500, followers: 1600 },
        { name: 'Ad D', reached: 5800, interactions: 4200, followers: 1400 },
        { name: 'Ad E', reached: 5600, interactions: 4000, followers: 1300 },
        { name: 'Ad F', reached: 5400, interactions: 3800, followers: 1200 },
        { name: 'Ad G', reached: 5200, interactions: 3600, followers: 1100 },
    ];

    const emailCampaignData = [
        { name: 'Campaign A', sent: 5000, conversions: 500 },
        { name: 'Campaign B', sent: 4500, conversions: 450 },
        { name: 'Campaign C', sent: 4200, conversions: 400 },
        { name: 'Campaign D', sent: 3800, conversions: 380 },
        { name: 'Campaign E', sent: 3600, conversions: 350 },
        { name: 'Campaign F', sent: 3400, conversions: 300 },
        { name: 'Campaign G', sent: 3200, conversions: 290 },
    ];

    const funnelData = [
        { name: 'Funnel A', visits: 8000, clicks: 3000, conversions: 500 },
        { name: 'Funnel B', visits: 7500, clicks: 2800, conversions: 450 },
        { name: 'Funnel C', visits: 7200, clicks: 2500, conversions: 400 },
        { name: 'Funnel D', visits: 6800, clicks: 2300, conversions: 380 },
        { name: 'Funnel E', visits: 6600, clicks: 2100, conversions: 350 },
        { name: 'Funnel F', visits: 6400, clicks: 2000, conversions: 300 },
        { name: 'Funnel G', visits: 6200, clicks: 1900, conversions: 290 },
    ];

    return (
        <div className={`ads-container ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="ads-section">
                <div className="ads-header">
                    <h2>Campañas orgánicas</h2>
                    <button className="generate-report-button" onClick={handleGenerateReport}>Generar informe</button>
                </div>
                <div className="ads-charts">
                    <div className="chart-container">
                        <h3>Visitas de los anuncios</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={organicData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Bar dataKey="visits" fill={theme === 'dark' ? 'var(--color1-dark)' : 'var(--color1-light)'} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-container">
                        <h3>Clicks en anuncio</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={organicData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="clicks" stroke={theme === 'dark' ? 'var(--color2-dark)' : 'var(--color2-light)'} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-container">
                        <h3>Conversiones</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={organicData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="conversions" stroke={theme === 'dark' ? 'var(--color3-dark)' : 'var(--color3-light)'} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="ads-section">
                <div className="ads-header">
                    <h2>Campañas pagadas</h2>
                    <button className="generate-report-button" onClick={handleGenerateReport}>Generar informe</button>
                </div>
                <div className="ads-charts">
                    <div className="chart-container">
                        <h3>Cuentas alcanzadas</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={paidData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Bar dataKey="reached" fill={theme === 'dark' ? 'var(--color4-dark)' : 'var(--color4-light)'} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-container">
                        <h3>Interacciones</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={paidData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="interactions" stroke={theme === 'dark' ? 'var(--color5-dark)' : 'var(--color5-light)'} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-container">
                        <h3>Nuevos seguidores</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={paidData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="followers" stroke={theme === 'dark' ? 'var(--color6-dark)' : 'var(--color6-light)'} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="ads-section">
                <div className="ads-header">
                    <h2>Campañas de correo</h2>
                    <button className="generate-report-button" onClick={handleGenerateReport}>Generar informe</button>
                </div>
                <div className="ads-charts">
                    <div className="chart-container">
                        <h3>Correos enviados</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={emailCampaignData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Bar dataKey="sent" fill={theme === 'dark' ? 'var(--color1-dark)' : 'var(--color1-light)'} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-container">
                        <h3>Conversion por click</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={emailCampaignData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="conversions" stroke={theme === 'dark' ? 'var(--color2-dark)' : 'var(--color2-light)'} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="ads-section">
                <div className="ads-header">
                    <h2>Funnels</h2>
                    <button className="generate-report-button" onClick={handleGenerateReport}>Generar informe</button>
                </div>
                <div className="ads-charts">
                    <div className="chart-container">
                        <h3>Visitas</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={funnelData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Bar dataKey="visits" fill={theme === 'dark' ? 'var(--color3-dark)' : 'var(--color3-light)'} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-container">
                        <h3>Clicks</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={funnelData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="clicks" stroke={theme === 'dark' ? 'var(--color4-dark)' : 'var(--color4-light)'} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-container">
                        <h3>Conversiones</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={funnelData} style={{ backgroundColor: theme === 'dark' ? 'var(--chart-bg-dark)' : 'var(--chart-bg-light)' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'var(--secondary-light)' : 'var(--secondary-dark)'} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <YAxis stroke={theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)', color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="conversions" stroke={theme === 'dark' ? 'var(--color5-dark)' : 'var(--color5-light)'} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <PopupInfoMark show={showPopup} onClose={closePopup} />
        </div>
    );
}

export default Ads;
