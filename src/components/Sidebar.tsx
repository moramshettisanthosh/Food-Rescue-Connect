import React from 'react';
import { 
  HeartHandshake, 
  BarChart3, 
  Map, 
  Award, 
  Building2, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: 'donor' | 'ngo' | 'volunteer' | 'admin';
  userPoints: number;
  openChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  currentRole, 
  userPoints,
  openChat
}) => {
  const getNavItems = () => {
    const baseItems = [
      { id: 'impact', label: 'Impact Dashboard', icon: BarChart3 },
      { id: 'map', label: 'Ecosystem Map', icon: Map },
    ];

    if (currentRole === 'donor') {
      baseItems.push(
        { id: 'donor-portal', label: 'Donate Food', icon: HeartHandshake },
      );
    } else if (currentRole === 'ngo') {
      baseItems.push(
        { id: 'ngo-portal', label: 'NGO Console', icon: Building2 },
      );
    } else if (currentRole === 'volunteer') {
      baseItems.push(
        { id: 'volunteer-portal', label: 'Volunteer Hub', icon: Award },
      );
    } else if (currentRole === 'admin') {
      baseItems.push(
        { id: 'admin-portal', label: 'Admin Command', icon: ShieldCheck },
      );
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <HeartHandshake className="logo-icon" size={32} />
        <span className="logo-text">RescueConnect</span>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button 
          onClick={openChat}
          className="nav-item"
          style={{ marginTop: 'auto', marginBottom: '10px' }}
        >
          <MessageSquare />
          <span>Chat Assistance</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-preview">
          <div className="profile-avatar">
            {currentRole.substring(0, 1).toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="profile-name">
              {currentRole === 'admin' ? 'Admin Controller' : 
               currentRole === 'ngo' ? 'Asha Shelter' : 
               currentRole === 'volunteer' ? 'Rider Sam' : 'Apex Canteen'}
            </span>
            <span className="profile-role">
              {currentRole} {userPoints > 0 && `• ${userPoints} pts`}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
