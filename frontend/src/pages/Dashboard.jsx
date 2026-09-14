import React, { useState, useEffect } from 'react';
import StatCards from '../components/statCards';

export default function Dashboard({ mockHeaders }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 🔥 FIXED: Dynamically switches between the live Render API URL and local fallback routing
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/feedback/analytics`, {
        headers: mockHeaders
      });
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error contacting analytics endpoints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [mockHeaders['x-user-role']]);

  if (loading) {
    return (
      <div className="flex-1 p-3 sm:p-5 md:p-8 space-y-6 animate-pulse bg-transparent w-full">
        <div className="h-8 bg-slate-800/50 w-48 rounded-xl" />
        <StatCards summaryData={null} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-slate-900/40 h-80 rounded-2xl border border-slate-800/40" />
          <div className="bg-slate-900/40 h-80 rounded-2xl border border-slate-800/40" />
        </div>
      </div>
    );
  }

  const COLOR_PALETTE = [
    { bgHex: '#6366f1' }, // Indigo Neon
    { bgHex: '#10b981' }, // Mint Emerald
    { bgHex: '#f43f5e' }, // Velvet Rose
    { bgHex: '#fbbf24' }  // Cyber Amber
  ];

    return (
    <div className="flex-1 p-3 sm:p-5 md:p-8 overflow-y-auto max-h-screen bg-transparent w-full">
      {/* Header Panel - Adaptive fluid typography & left-aligned compact action button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm mt-0.5">
            Real-time multi-tenant data logs parsed by local intelligence loops.
          </p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="w-fit sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800/60 hover:border-slate-700 font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs transition-all flex items-center justify-center space-x-2 backdrop-blur-md shadow-sm"
        >
          <span>🔄</span> <span>Re-fetch Telemetry</span>
        </button>
      </div>

      <StatCards summaryData={analytics?.summary} />

      {/* Grid adapts cleanly from 1 column on mobile to 2 columns on tablet/desktop displays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4">
        
        {/* LEFT CARD: Feature Clustered Areas */}
        <div className="bg-slate-900/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-xl flex flex-col justify-between min-h-80 sm:min-h-95">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide mb-0.5">Clustered Feature Areas</h3>
            <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-500 mb-4 sm:mb-6">Volume breakdown across vectors.</p>
          </div>
          
          <div className="space-y-4 sm:space-y-6 my-auto">
            {analytics && analytics.chartData && analytics.chartData.length > 0 ? (
              analytics.chartData.map((item, idx) => {
                const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                const totalItems = analytics.summary?.total || 1;
                const percentage = ((item.value / totalItems) * 100).toFixed(1);

                return (
                  <div key={item.name} className="space-y-1.5 sm:space-y-2">
                    <div className="flex justify-between text-[11px] sm:text-xs font-medium">
                      <span className="text-slate-300 flex items-center space-x-2">
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full inline-block shadow-sm" style={{ backgroundColor: color.bgHex }} />
                        <span className="truncate max-w-30 sm:max-w-none">{item.name}</span>
                      </span>
                      <span className="text-slate-400 font-mono text-[10px] sm:text-[11px]">{item.value} rows ({percentage}%)</span>
                    </div>
                    {/* Sleek Minimalist Dynamic Horizontal Fill Track */}
                    <div className="w-full bg-slate-950/80 rounded-full h-1 sm:h-1.5 border border-slate-800/50">
                      <div 
                        className="h-full rounded-full transition-all duration-700 shadow-md" 
                        style={{ width: `${percentage}%`, backgroundColor: color.bgHex }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-[11px] sm:text-xs text-slate-600 text-center py-12">No data arrays parsed yet.</div>
            )}
          </div>
        </div>

        {/* RIGHT CARD: Sentiment Spread */}
        <div className="bg-slate-900/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-xl flex flex-col justify-between min-h-80 sm:min-h-95">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide mb-0.5">Sentiment Volume Spread</h3>
            <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-500 mb-4 sm:mb-6">Proportional snapshot matching satisfaction criteria.</p>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 py-2">
            {/* Horizontal graph frame displaying visible dimensions across minor viewports */}
            <div className="w-full flex items-end space-x-4 sm:space-x-8 h-36 sm:h-40 justify-center pb-2 bg-slate-950/30 p-3 sm:p-4 rounded-xl border border-slate-900/60 overflow-x-auto no-scrollbar">
              {[
                { label: 'Positive', val: analytics?.summary?.positive || 0, colorHex: '#10b981' },
                { label: 'Neutral', val: analytics?.summary?.neutral || 0, colorHex: '#f59e0b' },
                { label: 'Negative', val: analytics?.summary?.negative || 0, colorHex: '#f43f5e' }
              ].map((bar) => {
                const maxVal = Math.max(
                  analytics?.summary?.positive || 0, 
                  analytics?.summary?.neutral || 0, 
                  analytics?.summary?.negative || 0
                ) || 1;
                const heightPercentage = ((bar.val / maxVal) * 100).toFixed(0);
                const computedHeight = `${Math.max(Number(heightPercentage), 12)}%`;

                return (
                  <div key={bar.label} className="flex flex-col items-center space-y-1.5 sm:space-y-2 w-12 sm:w-16 h-full justify-end shrink-0">
                    <div className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-300">{bar.val}</div>
                    <div 
                      className="w-8 sm:w-12 rounded-t-md sm:rounded-t-lg transition-all duration-500 shadow-sm border-t border-white/5" 
                      style={{ height: computedHeight, backgroundColor: bar.colorHex }}
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-[9px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center space-x-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <span>Positive</span></span>
              <span className="flex items-center space-x-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> <span>Neutral</span></span>
              <span className="flex items-center space-x-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> <span>Negative</span></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
