import React, { useState, useEffect } from 'react';

export default function Sidebar({ activeTab, setActiveTab, currentRole, setCurrentRole }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Analytics', icon: '📊' },
    { id: 'inbox', label: 'Inbox', icon: '📥' },
    { id: 'ask', label: 'Ask AI', icon: '🤖' },
    { id: 'reports', label: 'Reports', icon: '📑' }
  ];

  if (isMobile) {
    return (
      /* 📱 MOBILE GLASSMorphic HEADER BAR */
      <div className="w-full bg-[#090d16]/70 border-b border-slate-900/60 p-4 flex flex-row items-center justify-between z-50 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 px-2 py-1 rounded text-white font-black text-xs shadow-md shadow-indigo-600/10">LOOP</div>
          <span className="text-xs font-bold text-white tracking-tight">Project LOOP</span>
        </div>
        
        <nav className="flex space-x-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === item.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900/40'
              }`}
            >
              {item.icon}
            </button>
          ))}
        </nav>
      </div>
    );
  }

  return (
    /* 🖥️ DESKTOP LEFT PANEL GLASSMORPHIC SIDEBAR PANEL */
    <div className="w-64 bg-[#090d16]/60 border-r border-slate-900/60 flex flex-col justify-between h-screen sticky top-0 z-50 backdrop-blur-md">
      <div>
        <div className="p-6 border-b border-slate-900/40 flex items-center space-x-3">
          <div className="bg-indigo-600 px-2 py-1.5 rounded-lg text-white font-black tracking-wider text-xs shadow-lg shadow-indigo-600/20">
            LOOP
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight leading-none">Project LOOP</h2>
            <span className="text-[10px] text-indigo-400 font-medium mt-0.5 inline-block">Tenant Alpha</span>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition duration-150 ${
                activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-900/40 bg-slate-950/20">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
          Simulator Account Role [RBAC]
        </label>
        <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-900/60">
          {['ADMIN', 'ANALYST', 'VIEWER'].map((role) => (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              className={`text-[9px] font-bold py-1.5 rounded transition ${
                currentRole === role ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
