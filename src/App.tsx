import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { ImpactDashboard } from './components/ImpactDashboard';
import { InteractiveMap } from './components/InteractiveMap';
import { DonorModule } from './components/DonorModule';
import { NgoModule } from './components/NgoModule';
import { VolunteerHub } from './components/VolunteerHub';
import { AdminCenter } from './components/AdminCenter';
import { ChatSimulator } from './components/ChatSimulator';

function App() {
  // Global LocalStorage persistent states
  const [currentRole, setCurrentRole] = useState<'donor' | 'ngo' | 'volunteer' | 'admin'>(() => {
    const saved = localStorage.getItem('rescue_role');
    return (saved as any) || 'donor';
  });

  const [currentTab, setCurrentTab] = useState<string>(() => {
    const saved = localStorage.getItem('rescue_tab');
    return saved || 'impact';
  });

  const [userPoints, setUserPoints] = useState<number>(() => {
    const saved = localStorage.getItem('rescue_points');
    return saved ? Number(saved) : 450;
  });

  const [language, setLanguage] = useState<'en' | 'hi' | 'te'>('en');
  const [chatOpen, setChatOpen] = useState(false);

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('rescue_stats');
    if (saved) return JSON.parse(saved);
    return {
      mealsServed: 1240,
      co2Saved: 3100, // meals * 2.5
      waterSaved: 1240000, // meals * 1000
      landfillDiverted: 496, // meals * 0.4
    };
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('rescue_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('rescue_tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem('rescue_points', String(userPoints));
  }, [userPoints]);

  useEffect(() => {
    localStorage.setItem('rescue_stats', JSON.stringify(stats));
  }, [stats]);

  // Handle Tab switches when Role switches
  const handleRoleChange = (role: 'donor' | 'ngo' | 'volunteer' | 'admin') => {
    setCurrentRole(role);
    if (role === 'donor') setCurrentTab('donor-portal');
    else if (role === 'ngo') setCurrentTab('ngo-portal');
    else if (role === 'volunteer') setCurrentTab('volunteer-portal');
    else if (role === 'admin') setCurrentTab('admin-portal');
  };

  const handleAddPoints = (pts: number) => {
    setUserPoints(prev => prev + pts);
  };

  const handleDonationSuccess = (meals: number, co2: number, water: number, landfill: number) => {
    setStats((prev: any) => ({
      mealsServed: prev.mealsServed + meals,
      co2Saved: prev.co2Saved + co2,
      waterSaved: prev.waterSaved + water,
      landfillDiverted: prev.landfillDiverted + landfill,
    }));
    setUserPoints(prev => prev + 100); // 100 points for matching donation
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'impact':
        return <ImpactDashboard stats={stats} language={language} />;
      case 'map':
        return <InteractiveMap />;
      case 'donor-portal':
        return <DonorModule onDonationSuccess={handleDonationSuccess} language={language} />;
      case 'ngo-portal':
        return <NgoModule />;
      case 'volunteer-portal':
        return <VolunteerHub onAddPoints={handleAddPoints} />;
      case 'admin-portal':
        return <AdminCenter />;
      default:
        return <ImpactDashboard stats={stats} language={language} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        currentRole={currentRole}
        userPoints={userPoints}
        openChat={() => setChatOpen(true)}
      />

      <main className="main-content">
        <DashboardHeader 
          currentRole={currentRole} 
          setCurrentRole={handleRoleChange}
          language={language}
          setLanguage={setLanguage}
        />

        <div style={{ flex: 1 }}>
          {renderActiveTab()}
        </div>
      </main>

      <ChatSimulator 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />
    </div>
  );
}

export default App;
