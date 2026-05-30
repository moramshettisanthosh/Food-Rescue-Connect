import React, { useState } from 'react';
import { 
  Bell, 
  Accessibility, 
  Sparkles,
  Globe
} from 'lucide-react';

interface DashboardHeaderProps {
  currentRole: 'donor' | 'ngo' | 'volunteer' | 'admin';
  setCurrentRole: (role: 'donor' | 'ngo' | 'volunteer' | 'admin') => void;
  language: 'en' | 'hi' | 'te';
  setLanguage: (lang: 'en' | 'hi' | 'te') => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentRole,
  setCurrentRole,
  language,
  setLanguage
}) => {
  const [showAccessMenu, setShowAccessMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const toggleContrast = () => {
    document.body.classList.toggle('contrast-mode');
  };

  const toggleLargeText = () => {
    document.body.classList.toggle('large-text-mode');
  };

  const getRoleLabel = () => {
    switch(currentRole) {
      case 'donor': return language === 'hi' ? 'दाता' : language === 'te' ? 'దాత' : 'Donor';
      case 'ngo': return language === 'hi' ? 'एनजीओ' : language === 'te' ? 'స్వచ్ఛంద సంస్థ' : 'NGO Shelter';
      case 'volunteer': return language === 'hi' ? 'स्वयंसेवक' : language === 'te' ? 'వాలంటీర్' : 'Volunteer Rider';
      case 'admin': return language === 'hi' ? 'प्रशासक' : language === 'te' ? 'అడ్మిన్' : 'Admin Control';
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>
          {getRoleLabel()} Console <Sparkles size={16} style={{ display: 'inline', color: 'var(--accent-yellow)' }} />
        </h1>
      </div>

      <div className="header-actions">
        {/* Role Toggle Selector */}
        <div className="role-selector">
          {(['donor', 'ngo', 'volunteer', 'admin'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              className={`role-btn ${currentRole === role ? 'active' : ''}`}
            >
              {role.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Language Selection */}
        <div style={{ position: 'relative' }}>
          <button 
            className="header-icon-btn" 
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            title="Choose Language"
          >
            <Globe size={18} />
          </button>
          {showLanguageMenu && (
            <div className="glass-card" style={{
              position: 'absolute', top: '50px', right: 0, zIndex: 120,
              padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '120px'
            }}>
              <button 
                onClick={() => { setLanguage('en'); setShowLanguageMenu(false); }}
                className="role-btn" 
                style={{ width: '100%', textAlign: 'left', background: language === 'en' ? 'var(--accent-emerald)' : 'transparent', color: '#fff' }}
              >
                English
              </button>
              <button 
                onClick={() => { setLanguage('hi'); setShowLanguageMenu(false); }}
                className="role-btn"
                style={{ width: '100%', textAlign: 'left', background: language === 'hi' ? 'var(--accent-emerald)' : 'transparent', color: '#fff' }}
              >
                हिन्दी
              </button>
              <button 
                onClick={() => { setLanguage('te'); setShowLanguageMenu(false); }}
                className="role-btn"
                style={{ width: '100%', textAlign: 'left', background: language === 'te' ? 'var(--accent-emerald)' : 'transparent', color: '#fff' }}
              >
                తెలుగు
              </button>
            </div>
          )}
        </div>

        {/* Accessibility Panel */}
        <div style={{ position: 'relative' }}>
          <button 
            className="header-icon-btn"
            onClick={() => setShowAccessMenu(!showAccessMenu)}
            title="Accessibility Settings"
          >
            <Accessibility size={18} />
          </button>
          {showAccessMenu && (
            <div className="glass-card" style={{
              position: 'absolute', top: '50px', right: 0, zIndex: 120,
              padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px'
            }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accessibility Options</h4>
              <button onClick={toggleContrast} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Toggle High Contrast
              </button>
              <button onClick={toggleLargeText} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Toggle Large Text
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className="header-icon-btn" title="System Notifications">
          <Bell size={18} />
          <span className="notification-badge"></span>
        </button>
      </div>
    </header>
  );
};
