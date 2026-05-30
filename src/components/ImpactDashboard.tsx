import React, { useState } from 'react';
import { 
  Leaf, 
  Droplet, 
  Trash2, 
  Utensils, 
  Sparkles, 
  TrendingUp 
} from 'lucide-react';

interface ImpactDashboardProps {
  stats: {
    mealsServed: number;
    co2Saved: number; // in kg
    waterSaved: number; // in liters
    landfillDiverted: number; // in kg
  };
  language: 'en' | 'hi' | 'te';
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ stats, language }) => {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const getLabel = (key: string) => {
    const labels: Record<string, Record<'en' | 'hi' | 'te', string>> = {
      meals: { en: 'Meals Rescued', hi: 'बचाया गया भोजन (भोजन)', te: 'రక్షించబడిన ఆహారం' },
      co2: { en: 'CO₂ Saved', hi: 'CO₂ उत्सर्जन की बचत', te: 'మొత్తం CO₂ ఆదా' },
      water: { en: 'Water Rescued', hi: 'पानी की बचत', te: 'ఆదా చేసిన నీరు' },
      landfill: { en: 'Landfill Diverted', hi: 'कचरा डंप होने से बचा', te: 'ల్యాండ్‌ఫిల్ నివారించబడింది' },
      environmental: { en: 'Environmental Footprint Saved', hi: 'पर्यावरणीय प्रभाव रिपोर्ट', te: 'పర్యావరణ ప్రభావ నివేదిక' },
      trends: { en: 'Donation & Success Trends', hi: 'दान और सफलता रुझान', te: 'విరాళాల ట్రెండ్స్' },
      forecast: { en: 'AI Waste Prediction & Demand Analysis', hi: 'एआई कचरा और मांग पूर्वानुमान', te: 'AI వ్యర్థాల డిమాండ్ అంచనా' }
    };
    return labels[key]?.[language] || labels[key]?.['en'] || '';
  };

  // Preset Mock Weekly Trends for SVGs
  const trendData = {
    daily: [15, 24, 18, 30, 25, 45, 52],
    weekly: [120, 150, 180, 240, 210, 310, 390],
    monthly: [520, 680, 810, 950, 1100, 1340, 1550]
  };

  const getActiveTrend = () => trendData[reportPeriod];

  // SVG Chart Calculation Helpers
  const maxVal = Math.max(...getActiveTrend());
  const points = getActiveTrend()
    .map((val, index) => {
      const x = (index * 80) + 40;
      const y = 160 - (val / maxVal * 120);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="dashboard-grid">
      {/* Dynamic Count Banner */}
      <div className="col-12 glass-card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(20, 184, 166, 0.05) 100%)',
        borderColor: 'rgba(16, 185, 129, 0.25)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {language === 'hi' ? 'आपका लाइव सामाजिक प्रभाव' : language === 'te' ? 'మీ లైవ్ సామాజిక ప్రభావం' : 'Your Live Ecological Impact'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {language === 'hi' ? 'हर दान से पर्यावरण बचता है और जरूरतमंदों का पेट भरता है।' : 'Every verified contribution reduces global greenhouse emissions.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setReportPeriod(period)}
              className={`role-btn ${reportPeriod === period ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              {period.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Environmental Metrics */}
      <div className="col-3 glass-card impact-card" style={{ '--card-glow-color': 'var(--accent-emerald)' } as React.CSSProperties}>
        <div className="impact-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
          <Utensils size={24} />
        </div>
        <div className="impact-info">
          <h3>{getLabel('meals')}</h3>
          <div className="impact-value">
            {stats.mealsServed.toLocaleString()}
            <span className="impact-unit">meals</span>
          </div>
        </div>
      </div>

      <div className="col-3 glass-card impact-card" style={{ '--card-glow-color': 'var(--accent-teal)' } as React.CSSProperties}>
        <div className="impact-icon-wrapper" style={{ background: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent-teal)' }}>
          <Leaf size={24} />
        </div>
        <div className="impact-info">
          <h3>{getLabel('co2')}</h3>
          <div className="impact-value">
            {stats.co2Saved.toFixed(1)}
            <span className="impact-unit">kg</span>
          </div>
        </div>
      </div>

      <div className="col-3 glass-card impact-card" style={{ '--card-glow-color': 'var(--accent-blue)' } as React.CSSProperties}>
        <div className="impact-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
          <Droplet size={24} />
        </div>
        <div className="impact-info">
          <h3>{getLabel('water')}</h3>
          <div className="impact-value">
            {stats.waterSaved.toLocaleString()}
            <span className="impact-unit">Liters</span>
          </div>
        </div>
      </div>

      <div className="col-3 glass-card impact-card" style={{ '--card-glow-color': 'var(--accent-orange)' } as React.CSSProperties}>
        <div className="impact-icon-wrapper" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--accent-orange)' }}>
          <Trash2 size={24} />
        </div>
        <div className="impact-info">
          <h3>{getLabel('landfill')}</h3>
          <div className="impact-value">
            {stats.landfillDiverted.toLocaleString()}
            <span className="impact-unit">kg</span>
          </div>
        </div>
      </div>

      {/* Analytics Chart Panel */}
      <div className="col-8 glass-card">
        <div className="section-header">
          <div className="section-title">
            <TrendingUp style={{ color: 'var(--accent-emerald)' }} />
            <span>{getLabel('trends')} ({reportPeriod.toUpperCase()})</span>
          </div>
        </div>
        
        {/* Native SVG Polyline Chart */}
        <div style={{ width: '100%', height: '220px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px', padding: '20px 10px', position: 'relative' }}>
          <svg viewBox="0 0 540 180" style={{ width: '100%', height: '100%' }}>
            {/* Gridlines */}
            <line x1="40" y1="40" x2="520" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="40" y1="100" x2="520" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="40" y1="160" x2="520" y2="160" stroke="rgba(255,255,255,0.1)" />

            {/* Glowing path */}
            <polyline
              fill="none"
              stroke="var(--accent-emerald)"
              strokeWidth="4"
              points={points}
              filter="drop-shadow(0 4px 6px var(--accent-emerald-glow))"
            />

            {/* Area under the line */}
            <polygon
              fill="url(#chart-grad)"
              points={`40,160 ${points} 520,160`}
              opacity="0.15"
            />

            {/* Data nodes */}
            {getActiveTrend().map((val, index) => {
              const x = (index * 80) + 40;
              const y = 160 - (val / maxVal * 120);
              return (
                <g key={index}>
                  <circle cx={x} cy={y} r="6" fill="var(--bg-primary)" stroke="var(--accent-teal)" strokeWidth="3" />
                  <text x={x} y={y - 12} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontWeight="bold">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Definitions */}
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-emerald)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* AI Forecasting Recommender Widget */}
      <div className="col-4 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="section-title">
          <Sparkles style={{ color: 'var(--accent-yellow)' }} />
          <span>{getLabel('forecast')}</span>
        </div>
        
        <div className="user-profile-preview" style={{ padding: '16px', borderRadius: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>AI Match Predictive Model</div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>HIGH MATCH RATE PROBABILITY</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Historical analysis predicts a 94.2% supply claim probability within 18 minutes in the current campus zone today.
            </div>
          </div>
        </div>

        <div className="user-profile-preview" style={{ padding: '16px', borderRadius: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>High-Risk Waste Warning</div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-orange)' }}>CAMPUS CANTEEN FLOOD DETECTED</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Student canteens exhibit high surplus trends on Fridays. Predictive alerts triggered to student volunteer responders.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
