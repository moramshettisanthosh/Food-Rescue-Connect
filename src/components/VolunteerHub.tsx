import React, { useRef, useState } from 'react';
import { Award, Trophy, Sparkles, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Job {
  id: string;
  source: string;
  dest: string;
  food: string;
  urgency: string;
  status: 'idle' | 'claimed' | 'delivered';
}

interface VolunteerHubProps {
  onAddPoints: (points: number) => void;
}

export const VolunteerHub: React.FC<VolunteerHubProps> = ({ onAddPoints }) => {
  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  
  const [jobs, setJobs] = useState<Job[]>([
    { id: '1', source: 'Apex Student Canteen', dest: 'Asha Orphanage Shelter', food: 'Vegetable Biryani (45 portions)', urgency: 'High (Expires in 6h)', status: 'idle' },
    { id: '2', source: 'Grand Royal Banquet Hall', dest: 'South Community Kitchen', food: 'Mixed Desserts & Veggies (12kg)', urgency: 'Medium', status: 'idle' }
  ]);

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [showQrVerify, setShowQrVerify] = useState(false);

  const claimJob = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'claimed' } : j));
    setActiveJobId(id);
  };

  const verifyDelivery = () => {
    if (!activeJobId) return;
    setJobs(jobs.map(j => j.id === activeJobId ? { ...j, status: 'delivered' } : j));
    setActiveJobId(null);
    setShowQrVerify(false);
    
    // Add points & trigger celebratory confetti
    onAddPoints(150);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Canvas Certificate Generator
  const generateCertificate = () => {
    setShowCertModal(true);
    // Let state update then draw
    setTimeout(() => {
      const canvas = certCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gold Borders
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 10;
      ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

      // Certificate content text
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 36px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICATE OF RECOGNITION', canvas.width / 2, 85);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText('PROUDLY PRESENTED TO', canvas.width / 2, 130);

      // User name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Outfit, sans-serif';
      ctx.fillText('Volunteer Rider Sam', canvas.width / 2, 180);

      // Core statement
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '15px Inter, sans-serif';
      ctx.fillText('For exceptional dedication in the fight against food waste,', canvas.width / 2, 230);
      ctx.fillText('successfully salvaging surplus meals and safeguarding the local ecosystem.', canvas.width / 2, 255);

      // Stats
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px Outfit, sans-serif';
      ctx.fillText('Rescued: 140 kg Food • Diverted: 350 kg CO₂ Emissions', canvas.width / 2, 305);

      // Gold seal sketch
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 370, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('SEAL', canvas.width / 2, 374);

      // Date & Authority
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Dated: May 2026', 150, 380);
      ctx.fillText('Authorized: RescueConnect Corp', 490, 380);
    }, 100);
  };

  const downloadCertificate = () => {
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'RescueConnect_Volunteer_Certificate.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="dashboard-grid">
      {/* Active Deliveries List */}
      <div className="col-8 glass-card">
        <div className="section-title" style={{ marginBottom: '14px' }}>
          <Trophy style={{ color: 'var(--accent-yellow)' }} />
          <span>Active Volunteer Pickups Available</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map(job => (
            <div key={job.id} className="user-profile-preview" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{job.food}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    From: <strong>{job.source}</strong> ➡️ To: <strong>{job.dest}</strong>
                  </p>
                  <span className="badge badge-teal" style={{ marginTop: '8px' }}>{job.urgency}</span>
                </div>
                
                <div>
                  {job.status === 'idle' && (
                    <button onClick={() => claimJob(job.id)} className="btn btn-primary btn-sm">
                      Accept Rescue Task
                    </button>
                  )}
                  {job.status === 'claimed' && (
                    <button onClick={() => setShowQrVerify(true)} className="btn btn-secondary btn-sm" style={{ border: '1px solid var(--accent-yellow)', color: 'var(--accent-yellow)' }}>
                      Verify with QR
                    </button>
                  )}
                  {job.status === 'delivered' && (
                    <span className="badge badge-emerald">
                      Delivered ✓ (+150 pts)
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gamification Dashboard */}
      <div className="col-4 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="section-title">
          <Award style={{ color: 'var(--accent-emerald)' }} />
          <span>Rider Level & Achievements</span>
        </div>

        <div className="user-profile-preview" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> RIDER LEVEL</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-yellow)', margin: '4px 0' }}>LEVEL 4 HERO</div>
            <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', margin: '10px 0' }}>
              <div style={{ width: '72%', height: '100%', background: 'var(--accent-emerald)' }}></div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2,420 / 3,000 EXP to Level 5</div>
          </div>
        </div>

        {/* Certificate trigger button */}
        <button onClick={generateCertificate} className="btn btn-secondary" style={{ width: '100%' }}>
          <Download size={16} /> Monthly Recognition Certificate
        </button>

        {/* Badge Grid */}
        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Unlocked Badges</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 4px', borderRadius: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--accent-yellow)', margin: '0 auto' }} />
              <div style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: '4px' }}>Rescue Rookie</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 4px', borderRadius: '8px' }}>
              <Award size={20} style={{ color: 'var(--accent-emerald)', margin: '0 auto' }} />
              <div style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: '4px' }}>Midnight Rider</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 4px', borderRadius: '8px' }}>
              <Trophy size={20} style={{ color: 'var(--accent-teal)', margin: '0 auto' }} />
              <div style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: '4px' }}>Biryani Hero</div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Verification Modal */}
      {showQrVerify && (
        <div className="certificate-preview-modal">
          <div className="glass-card" style={{ maxWidth: '380px', width: '100%', textAlign: 'center', padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px' }}>QR Code Pickup Verification</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Scan the recipient's secure QR code to verify this delivery location and prevent misuse.
            </p>
            <div className="qr-box" style={{ marginBottom: '20px' }}>
              <div className="qr-dots"></div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowQrVerify(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel Scan
              </button>
              <button onClick={verifyDelivery} className="btn btn-primary" style={{ flex: 1 }}>
                Verify & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {showCertModal && (
        <div className="certificate-preview-modal">
          <div className="certificate-box">
            <div className="certificate-border-decor"></div>
            <canvas ref={certCanvasRef} width={640} height={440} style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
            
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '24px' }}>
              <button onClick={() => setShowCertModal(false)} className="btn btn-secondary">
                Close Viewer
              </button>
              <button onClick={downloadCertificate} className="btn btn-primary">
                <Download size={16} /> Download High-Res PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
