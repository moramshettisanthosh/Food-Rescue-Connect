import React, { useState } from 'react';
import { UserCheck, Ban, AlertOctagon, Activity } from 'lucide-react';

interface VerificationRequest {
  id: string;
  name: string;
  type: string;
  regNo: string;
  status: 'pending' | 'verified';
}

interface AbuseReport {
  id: string;
  user: string;
  reason: string;
  flagScore: number; // 0-100%
}

export const AdminCenter: React.FC = () => {
  const [ngos, setNgos] = useState<VerificationRequest[]>([
    { id: '1', name: 'Nourish India Foodbank', type: 'Registered NGO Trust', regNo: 'REG-842-NGO', status: 'pending' },
    { id: '2', name: 'Youth For Hunger Campus Chapter', type: 'Student Welfare Club', regNo: 'REG-COLL-441', status: 'pending' },
  ]);

  const [abuseLogs, setAbuseLogs] = useState<AbuseReport[]>([
    { id: '1', user: 'Apex Catering (Hostel)', reason: 'Repeated late-hour submission (>11 PM)', flagScore: 68 },
    { id: '2', user: 'External User 442', reason: 'Attempted to submit dairy past expiry date', flagScore: 92 },
  ]);

  const [auditTrail, setAuditTrail] = useState<string[]>([
    'Admin approved NGO "Holy Family Welfare Home" registration.',
    'System security: Completed encrypted SSL backup handshake.',
    'Abuse detection engine: Flagged account External User 442 (AI Quality failure count = 3).',
    'User session: Admin authentication role session established.',
  ]);

  const verifyNgo = (id: string) => {
    setNgos(ngos.map(n => n.id === id ? { ...n, status: 'verified' } : n));
    setAuditTrail([`Admin verified organization ID ${id} registration credentials.`, ...auditTrail]);
  };

  const moderateAbuse = (id: string, user: string) => {
    setAbuseLogs(abuseLogs.filter(a => a.id !== id));
    setAuditTrail([`Admin suspended user "${user}" account due to safety violation pattern.`, ...auditTrail]);
  };

  return (
    <div className="dashboard-grid">
      {/* NGO Registration Vetting Queue */}
      <div className="col-6 glass-card">
        <div className="section-title" style={{ marginBottom: '14px' }}>
          <UserCheck style={{ color: 'var(--accent-emerald)' }} />
          <span>NGO & Shield Verification Queue</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ngos.map(ngo => (
            <div key={ngo.id} className="user-profile-preview" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{ngo.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ngo.type} • {ngo.regNo}</p>
                </div>
                <div>
                  {ngo.status === 'pending' ? (
                    <button onClick={() => verifyNgo(ngo.id)} className="btn btn-primary btn-sm">
                      Approve Vetting
                    </button>
                  ) : (
                    <span className="badge badge-emerald">Verified ✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Abuse Detection Console */}
      <div className="col-6 glass-card">
        <div className="section-title" style={{ marginBottom: '14px' }}>
          <AlertOctagon style={{ color: 'var(--accent-red)' }} />
          <span>AI Abuse & Safety Violations</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {abuseLogs.map(log => (
            <div key={log.id} className="user-profile-preview" style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{log.user}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{log.reason}</p>
                  <span className="badge badge-red" style={{ marginTop: '6px' }}>Threat Risk: {log.flagScore}%</span>
                </div>
                <button onClick={() => moderateAbuse(log.id, log.user)} className="btn btn-danger btn-sm">
                  <Ban size={14} /> Suspend User
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit Logging System */}
      <div className="col-12 glass-card">
        <div className="section-title" style={{ marginBottom: '14px' }}>
          <Activity style={{ color: 'var(--accent-purple)' }} />
          <span>Real-time System Security & Audit Trails</span>
        </div>

        <div style={{
          maxHeight: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', 
          borderRadius: '8px', padding: '14px', border: '1px solid var(--card-border)',
          fontFamily: 'monospace', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px'
        }}>
          {auditTrail.map((log, idx) => (
            <div key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--accent-purple)' }}>[AUDIT]</span> <span style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleTimeString()}</span> - <span style={{ color: 'var(--text-primary)' }}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
