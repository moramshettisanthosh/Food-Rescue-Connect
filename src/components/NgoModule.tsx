import React, { useState } from 'react';
import { ShieldAlert, PlusCircle, Flame } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface AlertItem {
  id: string;
  location: string;
  shortageType: string;
  urgency: 'high' | 'medium';
  mealsNeeded: number;
}

export const NgoModule: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: '1', location: 'Holy Family Welfare Home', shortageType: 'Fresh Produce / Vegetables', urgency: 'high', mealsNeeded: 35 },
    { id: '2', location: 'South Community Kitchen', shortageType: 'Cooked Hot Surplus', urgency: 'medium', mealsNeeded: 50 },
  ]);

  const [newLocation, setNewLocation] = useState('');
  const [newShortage, setNewShortage] = useState('');
  const [newUrgency, setNewUrgency] = useState<'high' | 'medium'>('medium');
  const [meals, setMeals] = useState(15);
  
  // Emergency Escalator Simulation State
  const [escalationStep, setEscalationStep] = useState<0 | 1 | 2 | 3>(0);
  const [escalationStatus, setEscalationStatus] = useState<string>('Idle');
  const [isEscalating, setIsEscalating] = useState(false);

  const triggerEscalation = () => {
    setIsEscalating(true);
    setEscalationStep(1);
    setEscalationStatus('RING 1: Notifying nearest Student Responders within 500m...');
    
    setTimeout(() => {
      setEscalationStep(2);
      setEscalationStatus('RING 2: (No claim) Escalating to Core Volunteer Networks within 3km...');
    }, 2500);

    setTimeout(() => {
      setEscalationStep(3);
      setEscalationStatus('RING 3: (Critical) Escalating to Public App Broadcast & Regional Food Bank...');
      setIsEscalating(false);
    }, 5000);
  };

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation || !newShortage) return;

    const freshAlert: AlertItem = {
      id: Date.now().toString(),
      location: newLocation,
      shortageType: newShortage,
      urgency: newUrgency,
      mealsNeeded: Number(meals),
    };

    setAlerts([freshAlert, ...alerts]);
    setNewLocation('');
    setNewShortage('');

    // Write shortage directly into the live cloud database!
    if (isSupabaseConfigured) {
      try {
        await supabase.from('community_shortages').insert([{
          description: `Resource needed: ${newShortage} at ${newLocation}`,
          urgency: newUrgency,
          meals_needed: Number(meals),
          is_resolved: false
        }]);
      } catch (err) {
        console.error("Supabase Database Insert Error:", err);
      }
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Shortage Logger Form */}
      <div className="col-6 glass-card">
        <div className="section-title" style={{ marginBottom: '14px' }}>
          <PlusCircle style={{ color: 'var(--accent-emerald)' }} />
          <span>Report Local Food Shortage</span>
        </div>

        <form onSubmit={handleAddAlert} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Shelter / Intake Location</label>
            <input
              type="text"
              placeholder="e.g. Asha Shelter Annex"
              className="form-input"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Needed Food Types</label>
            <input
              type="text"
              placeholder="e.g. Cooked grains, baby formula, fruits"
              className="form-input"
              value={newShortage}
              onChange={(e) => setNewShortage(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Urgency Tier</label>
              <select 
                className="form-select" 
                value={newUrgency} 
                onChange={(e) => setNewUrgency(e.target.value as 'high' | 'medium')}
              >
                <option value="medium">Medium Demand</option>
                <option value="high">High Emergency</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Portion Estimates</label>
              <input
                type="number"
                min={5}
                className="form-input"
                value={meals}
                onChange={(e) => setMeals(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            Broadcast Shortage Alert
          </button>
        </form>
      </div>

      {/* Emergency Escalate System */}
      <div className="col-6 glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="section-title" style={{ marginBottom: '10px' }}>
            <Flame style={{ color: 'var(--accent-red)' }} />
            <span>Emergency Alert & Notification Escalator</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '14px' }}>
            Simulate the system's smart response to high-perishability event food (expires in &lt;1.5 hours) by automatically cascading notification rings.
          </p>

          {/* Progress Indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: escalationStep >= 1 ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>Ring 1: Near Responders</span>
              <span style={{ color: escalationStep >= 2 ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>Ring 2: Core Riders</span>
              <span style={{ color: escalationStep >= 3 ? 'var(--accent-red)' : 'var(--text-muted)', fontWeight: 600 }}>Ring 3: Public Broadcast</span>
            </div>
            
            <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: escalationStep >= 1 ? '33.3%' : '0%', background: 'var(--accent-emerald)', transition: 'all 0.5s ease' }}></div>
              <div style={{ width: escalationStep >= 2 ? '33.3%' : '0%', background: 'var(--accent-teal)', transition: 'all 0.5s ease' }}></div>
              <div style={{ width: escalationStep >= 3 ? '33.4%' : '0%', background: 'var(--accent-red)', transition: 'all 0.5s ease' }}></div>
            </div>
          </div>

          <div className="user-profile-preview" style={{ padding: '12px', borderLeft: '3px solid var(--accent-teal)', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Escalation Status:</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', marginTop: '2px' }}>{escalationStatus}</div>
            </div>
          </div>
        </div>

        <button 
          onClick={triggerEscalation} 
          disabled={isEscalating} 
          className="btn btn-danger" 
          style={{ width: '100%', marginTop: '16px' }}
        >
          {isEscalating ? 'Simulating Cascades...' : 'Trigger Perishable Emergency Escalation'}
        </button>
      </div>

      {/* Active Shortage Alerts Board */}
      <div className="col-12 glass-card">
        <div className="section-title" style={{ marginBottom: '14px' }}>
          <ShieldAlert style={{ color: 'var(--accent-orange)' }} />
          <span>Active Community Shortage Boards</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {alerts.map((item) => (
            <div 
              key={item.id} 
              className="leaderboard-row" 
              style={{ borderLeft: `4px solid ${item.urgency === 'high' ? 'var(--accent-red)' : 'var(--accent-orange)'}` }}
            >
              <div className="leaderboard-user">
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{item.location}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Resource needed: {item.shortageType}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge ${item.urgency === 'high' ? 'badge-red' : 'badge-orange'}`}>
                  {item.urgency.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.mealsNeeded} Meals Required</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
