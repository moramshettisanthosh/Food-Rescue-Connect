import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, ShieldCheck } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'system' | 'responder';
  name: string;
  text: string;
  timestamp: string;
}

interface ChatSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'system', name: 'Rescue Engine', text: 'Secure chat channel established between Donor and Volunteer Rider.', timestamp: '10:45 AM' },
    { id: '2', sender: 'responder', name: 'Rider Sam', text: 'Hello! I accepted the Canteen Biryani pickup task. Do you have insulated bags ready?', timestamp: '10:46 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const msgEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      name: 'You',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate smart responder after 1.5s
    setTimeout(() => {
      let replyText = "Understood. I will arrive in approximately 7 minutes. Please have the QR pickup code open.";
      if (inputText.toLowerCase().includes('bag') || inputText.toLowerCase().includes('pack')) {
        replyText = "Yes, I carry triple-insulated thermal food boxes to keep the cooked meal safe during transit.";
      } else if (inputText.toLowerCase().includes('where') || inputText.toLowerCase().includes('location')) {
        replyText = "I am currently passing by the main campus archway, heading right to your canteen entrance.";
      }

      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'responder',
        name: 'Rider Sam',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  return (
    <div className={`chat-drawer ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} style={{ color: 'var(--accent-emerald)' }} />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Rider Sam</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ShieldCheck size={10} /> Active Volunteer
            </span>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Messages Board */}
      <div className="chat-messages">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`chat-bubble ${msg.sender === 'user' ? 'sender' : msg.sender === 'responder' ? 'recipient' : ''}`}
            style={msg.sender === 'system' ? { 
              alignSelf: 'center', background: 'rgba(255,255,255,0.02)', 
              color: 'var(--text-muted)', border: '1px dashed var(--card-border)',
              borderRadius: '8px', fontSize: '0.75rem', textAlign: 'center', maxWidth: '95%'
            } : {}}
          >
            {msg.sender !== 'system' && (
              <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: msg.sender === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--accent-teal)', marginBottom: '2px' }}>
                {msg.name}
              </div>
            )}
            <div>{msg.text}</div>
            <div style={{ fontSize: '0.6rem', textAlign: 'right', opacity: 0.6, marginTop: '4px' }}>{msg.timestamp}</div>
          </div>
        ))}
        <div ref={msgEndRef} />
      </div>

      {/* User Input Drawer */}
      <form onSubmit={handleSendMessage} className="chat-input-area">
        <input
          type="text"
          placeholder="Ask Sam about pickup details..."
          className="form-input"
          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', borderRadius: '8px' }}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
