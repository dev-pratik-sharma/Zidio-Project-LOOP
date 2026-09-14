import React, { useState, useEffect } from 'react';

export default function Inbox({ mockHeaders, currentRole }) {
  const [logs, setLogs] = useState([]);
  const [contentInput, setContentInput] = useState('');
  const [channelSelect, setChannelSelect] = useState('Support ticket');
  const [filterChannel, setFilterChannel] = useState('');
  const [filterSentiment, setFilterSentiment] = useState('');

  // UI Interactive States
  const [isIngesting, setIsIngesting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fetchInboxLogs = async () => {
    try {
      let queryParams = new URLSearchParams();
      if (filterChannel) queryParams.append('channel', filterChannel);
      if (filterSentiment) queryParams.append('sentiment', filterSentiment);

      // 🔥 FIXED: Dynamically switches between the live Render API URL and local fallback routing
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/feedback?${queryParams.toString()}`, {
        headers: mockHeaders
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error('Error fetching stream records:', err);
      setLogs([]);
    }
  };

  useEffect(() => {
    fetchInboxLogs();
  }, [filterChannel, filterSentiment, mockHeaders['x-user-role']]);

  const handleSubmitIngest = async (e) => {
    e.preventDefault();
    if (!contentInput.trim() || isIngesting) return;

    if (currentRole === 'VIEWER') {
      alert('❌ Security Guard Refusal: Read-Only [VIEWER] accounts are explicitly forbidden from mutating pipeline variables.');
      return;
    }

    try {
      setIsIngesting(true);
      // 🔥 FIXED: Dynamically reads the live production endpoint environment variable
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/feedback`, {
        method: 'POST',
        headers: mockHeaders,
        body: JSON.stringify({ content: contentInput, channel: channelSelect })
      });

      if (res.status === 403) {
        alert('❌ Security Guard Refusal: Read-Only [VIEWER] accounts are forbidden.');
        setIsIngesting(false);
        return;
      }

      setContentInput('');
      await fetchInboxLogs();
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Ingestion fault error:', err);
    } finally {
      setIsIngesting(false);
    }
  };

  const triggerBulkCSVImportSimulation = async () => {
    if (currentRole === 'VIEWER') {
      alert('❌ Security Guard Refusal: Read-Only [VIEWER] access tier accounts cannot inject bulk arrays.');
      return;
    }

    try {
      const csvMockItems = [
        { channel: 'App store review', content: 'The premium analytics layout options save my team five working hours a week!' },
        { channel: 'NPS survey', content: 'Experiencing significant loading frame rendering freezes when generating wide table sheets.' },
        { channel: 'Support ticket', content: 'Invoice billing confirmation emails keep landing in our corporate spam folder routing.' }
      ];

      // 🔥 FIXED: Dynamically maps the production API cluster path for CSV processing arrays
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/feedback/bulk`, {
        method: 'POST',
        headers: mockHeaders,
        body: JSON.stringify({ items: csvMockItems })
      });

      const reportingMetrics = await res.json();
      alert(`📊 CSV Batch Parser Report:\nSuccessfully parsed and bulk-inserted into cloud cluster: ${reportingMetrics.imported} items.\nFault failures: 0 rows.`);
      fetchInboxLogs();
    } catch (err) {
      console.error(err);
    }
  };

      return (
    <div className="flex-1 p-3 sm:p-5 md:p-8 overflow-y-auto max-h-screen bg-transparent w-full relative">
      
      {/* 🔔 FLOATING GLASSMORPHIC SUCCESS TOAST */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-xl px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 animate-bounce">
          <span className="text-sm">✅</span>
          <span className="text-xs font-bold font-mono tracking-wide">Telemetry Log Processed & Auto-Classified!</span>
        </div>
      )}

      {/* Page Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">Data Triage Center</h1>
          <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm mt-0.5">Review live stream classifications or feed single text logs into the engine.</p>
        </div>
        
        <button
          onClick={triggerBulkCSVImportSimulation}
          disabled={currentRole === 'VIEWER'}
          className={`w-fit text-[10px] sm:text-xs font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md transition duration-200 border ${
            currentRole === 'VIEWER'
              ? 'bg-slate-900/60 text-slate-600 border-slate-800/40 cursor-not-allowed shadow-none'
              : 'bg-indigo-600/80 hover:bg-indigo-600 text-white border-indigo-500/20 shadow-indigo-600/5'
          }`}
        >
          📁 Upload Payload
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Left Side Intake Form */}
        <div className="bg-slate-950/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-900 shadow-2xl backdrop-blur-md h-fit">
          <h3 className="text-xs sm:text-base md:text-lg font-bold text-white tracking-wide mb-0.5">Manual Document Intake</h3>
          <p className="text-[9px] sm:text-[11px] md:text-xs text-slate-500 mb-4 sm:mb-6">Pipeline processing checks sentiment values natively.</p>

          <form onSubmit={handleSubmitIngest} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Feedback Content Body</label>
              <textarea
                rows="3"
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                disabled={isIngesting}
                placeholder="Ex: Customer reports the onboarding portal checkout throws validation timeout exceptions..."
                className="w-full bg-slate-950/90 border border-slate-900 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition placeholder-slate-700"
              />
            </div>

            <div>
              <label className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Channel Vector Origin</label>
              <select
                value={channelSelect}
                onChange={(e) => setChannelSelect(e.target.value)}
                disabled={isIngesting}
                className="w-full bg-slate-950/90 border border-slate-900 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              >
                <option>Support ticket</option>
                <option>App store review</option>
                <option>NPS survey</option>
              </select>
            </div>

            {/* Submit Button with Spinner */}
            <div className="w-full flex justify-start">
              <button
                type="submit"
                disabled={currentRole === 'VIEWER' || isIngesting}
                className={`w-fit font-bold py-2 sm:py-2.5 px-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm shadow-md transition duration-200 border flex items-center space-x-2 ${
                  currentRole === 'VIEWER' 
                    ? 'bg-slate-900/60 text-slate-700 border-slate-800/20 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600/80 hover:bg-indigo-600 text-white border-indigo-500/10'
                }`}
              >
                {isIngesting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing Ingest...</span>
                  </>
                ) : currentRole === 'VIEWER' ? (
                  <span>🔒 Intake Disabled</span>
                ) : (
                  <span>🚀 Process Analytics</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Spreadsheet Grid Matrix */}
        <div className="xl:col-span-2 bg-slate-950/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-900 shadow-2xl backdrop-blur-md flex flex-col">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-slate-900/60 pb-4 mb-4 sm:pb-6 sm:mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[8px] sm:text-[10px] font-bold uppercase text-slate-500 tracking-wider mr-1">Filter:</span>
              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="bg-slate-950 border border-slate-900 text-[10px] sm:text-xs rounded-md sm:rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 text-slate-300 focus:outline-none"
              >
                <option value="">All Channels</option>
                <option>Support ticket</option>
                <option>App store review</option>
                <option>NPS survey</option>
              </select>

              <select
                value={filterSentiment}
                onChange={(e) => setFilterSentiment(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-[10px] sm:text-xs rounded-md sm:rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 text-slate-300 focus:outline-none"
              >
                <option value="">All Sentiments</option>
                <option value="POS">🟢 Positive</option>
                <option value="NEU">🟡 Neutral</option>
                <option value="NEG">🔴 Negative</option>
              </select>
            </div>
            
            <span className="text-[9px] sm:text-xs text-slate-500 font-mono">
              Indexed: {logs ? logs.length : 0} items
            </span>
          </div>

          <div className="space-y-3 max-h-87.5 sm:max-h-115 overflow-y-auto pr-1">
            {logs && logs.length > 0 ? (
              logs.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-slate-950/60 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-900 flex justify-between items-start hover:border-slate-800/40 transition duration-150 group"
                >
                  <div className="space-y-2 max-w-[78%]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {item.channel}
                      </span>
                      <span className="bg-indigo-950/40 border border-indigo-500/10 text-indigo-400 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                        📁 {item.featureArea || item.featurearea || 'General'}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 leading-relaxed group-hover:text-slate-100 transition">
                      {item.content}
                    </p>
                  </div>
                  
                  <div className="text-right flex flex-col items-end justify-between h-full shrink-0">
                    <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider border ${
                      item.sentiment === 'POS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      item.sentiment === 'NEG' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {item.sentiment}
                    </span>
                    <p className="text-[8px] sm:text-[9px] font-mono text-slate-500 mt-2 font-semibold">
                      Score: {item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 text-slate-600 text-xs font-medium">
                No telemetry records found or server connection offline.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
