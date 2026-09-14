import React, { useState } from 'react';

export default function AskLoop({ mockHeaders }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: "Hello! I am the LOOP Intelligence Core. Ask me any plain-English question about customer feedback patterns (e.g., 'What are users saying about onboarding?' or 'Are there bugs in billing?') and I will generate an answer completely grounded in our active repository logs.",
      citations: []
    }
  ]);

  const handleSendQuestion = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userQuestion = query;
    setQuery('');
    setLoading(true);

    setChatLog(prev => [...prev, { sender: 'user', text: userQuestion, citations: [] }]);

    try {
      const res = await fetch('http://localhost:5000/api/feedback/ask', {
        method: 'POST',
        headers: mockHeaders,
        body: JSON.stringify({ question: userQuestion })
      });
      const responseData = await res.json();

      setChatLog(prev => [...prev, { 
        sender: 'ai', 
        text: responseData.answer, 
        citations: responseData.citations || [] 
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-3 sm:p-5 md:p-8 flex flex-col justify-between max-h-screen bg-transparent w-full">
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">LOOP Intelligence Core</h1>
        <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm mt-0.5">
          Retrieval-Augmented Generation query platform. Answers are strictly grounded in database telemetry.
        </p>
      </div>

      {/* Frosted Chat Log Display Window Area */}
      <div className="flex-1 bg-slate-950/40 border border-slate-900 rounded-2xl p-4 sm:p-6 my-4 overflow-y-auto space-y-6 max-h-[60vh] backdrop-blur-md shadow-2xl">
        {chatLog.map((msg, idx) => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={idx} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-xl sm:rounded-2xl p-3 sm:p-4 border transition ${
                isAi 
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-200' 
                  : 'bg-indigo-600/80 border-indigo-500/20 text-white shadow-md shadow-indigo-600/5'
              }`}>
                <div className="text-[9px] font-bold uppercase tracking-wider mb-1.5 opacity-60 font-mono">
                  {isAi ? '🤖 LOOP Engine Core' : '👤 User Analyst Account'}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {isAi && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                      Verified Data Citations ({msg.citations.length}):
                    </div>
                    <div className="space-y-1.5">
                      {msg.citations.map((cite, cIdx) => (
                        <div key={cite.id || cIdx} className="bg-slate-950/70 p-2 rounded-lg border border-slate-900 text-[11px] text-slate-400">
                          "{cite.content}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Frosted Command Input Form Bar */}
      <form onSubmit={handleSendQuestion} className="flex space-x-2 sm:space-x-3 items-center bg-slate-950/40 p-2 rounded-xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about database telemetry..."
          className="flex-1 bg-transparent px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-700 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-[10px] sm:text-xs px-4 py-2 rounded-lg shadow-md transition disabled:bg-slate-900/60 disabled:text-slate-600 disabled:cursor-not-allowed"
        >
          Send Inquiry ⚡
        </button>
      </form>
    </div>
  );
}
