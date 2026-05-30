import React, { useState } from 'react';
import { HeartHandshake, Upload, Camera, CheckCircle, Navigation, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface DonorModuleProps {
  onDonationSuccess: (meals: number, co2: number, water: number, landfill: number) => void;
  language: 'en' | 'hi' | 'te';
}

interface PresetItem {
  name: string;
  category: string;
  qty: string;
  qtyVal: number; // in meals/servings
  freshness: number;
  window: string;
  status: 'safe' | 'unsafe';
  warning: string;
}

export const DonorModule: React.FC<DonorModuleProps> = ({ onDonationSuccess, language }) => {
  const [donationType, setDonationType] = useState<'household' | 'event'>('household');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<PresetItem | null>(null);
  const [matchedNgo, setMatchedNgo] = useState<string | null>(null);

  // AI Presets for Simulation
  const presets: PresetItem[] = [
    {
      name: 'Bulk Vegetable Biryani (Canteen Surplus)',
      category: 'Catered Hot Meals',
      qty: '45 Servings (approx. 18 kg)',
      qtyVal: 45,
      freshness: 94,
      window: '8 Hours',
      status: 'safe',
      warning: 'Freshly prepared. Rich calorie profile. Store in temperature-insulated vessels.'
    },
    {
      name: 'Whole Wheat Sandwich Loaves',
      category: 'Bakery Items',
      qty: '4 Loaves (approx. 40 slices)',
      qtyVal: 15,
      freshness: 82,
      window: '24 Hours',
      status: 'safe',
      warning: 'Safe. Expiration date checklist clear. Standard household portion.'
    },
    {
      name: 'Dairy Fresh Milk Pouches',
      category: 'Dairy Products',
      qty: '12 Packets (6 Liters)',
      qtyVal: 20,
      freshness: 42,
      window: '2 Hours (Nearing Expiry)',
      status: 'unsafe',
      warning: 'Unsafe for redistribution. Temperature violation detected. Rejected for donation safety.'
    }
  ];

  const handleStartScan = (presetIndex: number) => {
    setSelectedPreset(presetIndex);
    setIsScanning(true);
    setScanResult(null);
    setMatchedNgo(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult(presets[presetIndex]);
    }, 2000);
  };

  const handlePublishDonation = async () => {
    if (!scanResult) return;
    
    // Increment stats in parent
    const meals = scanResult.qtyVal;
    const co2 = meals * 2.5;
    const water = meals * 1000;
    const landfill = meals * 0.4;
    
    onDonationSuccess(meals, co2, water, landfill);
    setMatchedNgo('Matching Established! Volunteer Rider Rider Sam has accepted pickup coordinates.');

    // Write donation directly into the live cloud database!
    if (isSupabaseConfigured) {
      try {
        await supabase.from('donations').insert([{
          title: scanResult.name,
          category: scanResult.category,
          scale: donationType === 'event' ? 'event_bulk' : 'household',
          quantity_description: scanResult.qty,
          quantity_meals: meals,
          freshness_score: scanResult.freshness,
          consumption_window_hours: parseInt(scanResult.window) || 8,
          status: 'claimed',
          latitude: 12.9716,
          longitude: 77.5946,
          expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
        }]);
      } catch (err) {
        console.error("Supabase Database Insert Error:", err);
      }
    }
  };

  const getLabel = (key: string) => {
    const labels: Record<string, Record<'en' | 'hi' | 'te', string>> = {
      type: { en: 'Select Donation Scale', hi: 'दान का पैमाना चुनें', te: 'విరాళం రకం ఎంచుకోండి' },
      household: { en: 'Household Surplus (Small Qty)', hi: 'घरेलू अधिशेष (कम मात्रा)', te: 'ఇంటి ఆహార విరాళం' },
      event: { en: 'Bulk Event / Canteen Management', hi: 'थोक कार्यक्रम / कैंटीन प्रबंधन', te: 'ఈవెంట్ / క్యాంటీన్ విరాళం' },
      scanHeader: { en: 'AI Smart Food Safety & Quality Scanner', hi: 'एआई स्मार्ट खाद्य सुरक्षा स्कैनर', te: 'AI స్మార్ట్ ఆహార భద్రతా స్కానర్' },
      recommendNgo: { en: 'Smart Nearest Shelter Recommendations', hi: 'स्मार्ट निकटतम आश्रय अनुशंसाएँ', te: 'స్మార్ట్ సమీప ఆశ్రయాల సిఫార్సులు' }
    };
    return labels[key]?.[language] || labels[key]?.['en'] || '';
  };

  return (
    <div className="dashboard-grid">
      {/* Selection Row */}
      <div className="col-12 glass-card">
        <div className="section-title" style={{ marginBottom: '14px' }}>
          <HeartHandshake style={{ color: 'var(--accent-emerald)' }} />
          <span>{getLabel('type')}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <button
            onClick={() => { setDonationType('household'); setScanResult(null); setSelectedPreset(null); setMatchedNgo(null); }}
            className={`btn ${donationType === 'household' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{getLabel('household')}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Ideal for local families and single households.</span>
          </button>
          
          <button
            onClick={() => { setDonationType('event'); setScanResult(null); setSelectedPreset(null); setMatchedNgo(null); }}
            className={`btn ${donationType === 'event' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{getLabel('event')}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Specialized flow for caterers, campus canteens & weddings.</span>
          </button>
        </div>
      </div>

      {/* Interactive AI Image Scanner */}
      <div className="col-7 glass-card">
        <div className="section-title" style={{ marginBottom: '16px' }}>
          <Camera style={{ color: 'var(--accent-teal)' }} />
          <span>{getLabel('scanHeader')}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Choose a preset surplus item below to trigger the AI quality, quantity and safety check algorithm:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {presets.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleStartScan(idx)}
                className={`btn btn-secondary btn-sm ${selectedPreset === idx ? 'active' : ''}`}
                style={{
                  border: selectedPreset === idx ? '1px solid var(--accent-teal)' : '1px solid var(--card-border)',
                  background: selectedPreset === idx ? 'rgba(20, 184, 166, 0.1)' : 'var(--bg-tertiary)',
                  padding: '10px 6px', fontSize: '0.75rem', height: '64px'
                }}
              >
                {item.name.split(' (')[0]}
              </button>
            ))}
          </div>

          {/* Scanner Area */}
          <div className={`scanner-container ${isScanning ? 'scanning' : ''}`} style={{ height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="scanner-line"></div>
            
            {isScanning ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Camera className="logo-icon" style={{ animation: 'pulse-glow 1s infinite alternate' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent-teal)' }}>AI Estimating Category & Safety Index...</span>
              </div>
            ) : scanResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={32} style={{ color: scanResult.status === 'safe' ? 'var(--accent-emerald)' : 'var(--accent-red)' }} />
                <span style={{ fontWeight: '700', fontSize: '1rem' }}>{scanResult.name}</span>
                <span className="badge badge-teal">{scanResult.category}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Upload size={32} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Choose an item above to scan</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Telemetry Results */}
      <div className="col-5 glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="section-title" style={{ marginBottom: '14px', fontSize: '1.05rem' }}>
            <Sparkles style={{ color: 'var(--accent-yellow)' }} />
            <span>AI Safety Assessment Output</span>
          </div>

          {scanResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Detected Portion Volume:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{scanResult.qty}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>AI Freshness Rating:</span>
                <strong style={{ color: scanResult.freshness > 80 ? 'var(--accent-emerald)' : 'var(--accent-orange)' }}>
                  {scanResult.freshness}% Score
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Safe Consumption Window:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{scanResult.window}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>AI Redistribution Verdict:</span>
                <span className={`badge ${scanResult.status === 'safe' ? 'badge-emerald' : 'badge-red'}`}>
                  {scanResult.status === 'safe' ? 'APPROVED / SAFE' : 'REJECTED / HAZARD'}
                </span>
              </div>

              <div className="user-profile-preview" style={{ padding: '10px', marginTop: '6px', borderRadius: '8px', borderLeft: scanResult.status === 'safe' ? '3px solid var(--accent-emerald)' : '3px solid var(--accent-red)' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <strong>Safety Notice:</strong> {scanResult.warning}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              No active scans telemetry. Select a food card to view AI analysis.
            </div>
          )}
        </div>

        {scanResult && (
          <div style={{ marginTop: '16px' }}>
            {scanResult.status === 'safe' ? (
              <button
                onClick={handlePublishDonation}
                disabled={!!matchedNgo}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                {matchedNgo ? 'Matching established!' : 'Securely Publish & Match NGO'}
              </button>
            ) : (
              <button
                disabled
                className="btn btn-secondary"
                style={{ width: '100%', cursor: 'not-allowed', color: 'var(--accent-red)' }}
              >
                Blocked: Unsafe Food Quality
              </button>
            )}
          </div>
        )}
      </div>

      {/* Proximity Matching Recommendations */}
      {scanResult && scanResult.status === 'safe' && (
        <div className="col-12 glass-card animate-fade-in">
          <div className="section-title" style={{ marginBottom: '14px' }}>
            <Navigation style={{ color: 'var(--accent-emerald)' }} />
            <span>{getLabel('recommendNgo')}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="user-profile-preview" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Asha Orphanage Shelter</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Distance: 1.2 km • Time: 5 mins</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '8px' }}>High Capacity Match (Needs 25 servings)</div>
              </div>
            </div>

            <div className="user-profile-preview" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>South Community Kitchen</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Distance: 2.8 km • Time: 12 mins</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 600, marginTop: '8px' }}>Moderate Match (Open intake)</div>
              </div>
            </div>

            <div className="user-profile-preview" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Holy Family Welfare Home</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Distance: 4.1 km • Time: 18 mins</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px' }}>Distant (Sufficient stock)</div>
              </div>
            </div>
          </div>

          {matchedNgo && (
            <div className="user-profile-preview" style={{ padding: '16px', marginTop: '16px', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--accent-emerald)', borderLeft: '4px solid var(--accent-emerald)' }}>
              <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600' }}>
                🚀 {matchedNgo}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
