import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import AskLoop from './pages/AskLoop';
import Reports from './pages/Reports';
// 🔥 Import your premium animation component engine
import InteractiveBackground from './components/InteractiveBackground';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('ADMIN'); 

  const mockHeaders = {
    'Content-Type': 'application/json',
    'x-workspace-id': '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 
    'x-user-role': currentRole                     
  };

  const renderActiveViewportContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard mockHeaders={mockHeaders} />;
      case 'inbox':
        return <Inbox mockHeaders={mockHeaders} currentRole={currentRole} />;
      case 'ask':
        return <AskLoop mockHeaders={mockHeaders} />;
      case 'reports':
        return <Reports mockHeaders={mockHeaders} />;
      default:
        return <Dashboard mockHeaders={mockHeaders} />;
    }
  };

  return (
    <div 
      className="w-screen h-screen overflow-hidden text-slate-100 font-sans antialiased selection:bg-indigo-500/30"
      style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', backgroundColor: '#030712' }}
    >
      {/* 🔥 Mounted the interactive animated background loop */}
      <InteractiveBackground />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentRole={currentRole} 
        setCurrentRole={setCurrentRole} 
      />

      <main 
        className="flex-1 flex flex-col relative z-10 bg-transparent"
        style={{ minWidth: 0, height: '100%', overflowY: 'auto' }}
      >
        {renderActiveViewportContent()}
      </main>
    </div>
  );
}
