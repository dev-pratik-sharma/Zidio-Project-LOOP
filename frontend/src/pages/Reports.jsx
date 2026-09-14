import React, { useState } from 'react';

export default function Reports({ mockHeaders }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const triggerExecutiveReportCompilation = async () => {
    try {
      setLoading(true);
      
      // 🔥 FIXED: Dynamically switches between the live Render API URL and local fallback routing
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/feedback/report`, {
        headers: mockHeaders
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="flex-1 p-3 sm:p-5 md:p-8 overflow-y-auto max-h-screen bg-transparent w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 md:mb-8 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">Executive Briefings</h1>
          <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm mt-0.5">
            Compile macro-level Voice of Customer digests complete with standalone citation verbatims.
          </p>
        </div>

        <button
          onClick={triggerExecutiveReportCompilation}
          disabled={loading}
          className="w-fit text-[10px] sm:text-xs font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-500/10 shadow-lg shadow-indigo-600/5 transition disabled:bg-slate-900/60 disabled:text-slate-600"
        >
          {loading ? '🖨️ Compiling...' : '📊 Generate Summary Report'}
        </button>
      </div>

      {!report ? (
        /* Frosted Empty State Placeholder Area */
        <div className="border border-dashed border-slate-800/80 bg-slate-950/25 rounded-2xl py-24 sm:py-32 text-center backdrop-blur-md shadow-2xl print:hidden">
          <span className="text-3xl sm:text-4xl">📑</span>
          <h3 className="text-sm sm:text-base font-bold text-slate-300 mt-4">No Document Hydrated</h3>
          <p className="text-[10px] sm:text-xs text-slate-500 max-w-xs sm:max-w-sm mx-auto mt-1 px-4 leading-relaxed">
            Click the upper compilation trigger to prompt the intelligence engine to build a structured narrative summary based on active tenant logs.
          </p>
        </div>
      ) : (
        /* Clean Printable Document Sheet View Container Component */
        <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xl max-w-3xl mx-auto space-y-6 transition print:shadow-none print:border-none print:p-0">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3 print:hidden">
            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 font-mono">
              ⚡ Platform Report Artifact Verified
            </span>
            <button
              onClick={() => window.print()}
              className="bg-slate-950 hover:bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition"
            >
              Export Report
            </button>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">{report.title}</h2>
              <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">
                Target Segment: Workspace Account Alpha
              </p>
            </div>
            <div className="text-right text-[10px] font-mono font-bold text-slate-400">
              Generated: {report.generatedAt}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Telemetry Audited</span>
              <span className="text-xl font-black text-slate-950">{report.metrics.totalFeedbackAudited} entries</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Critical Escalations Noted</span>
              <span className="text-xl font-black text-rose-600">{report.metrics.criticalAlertsCount} items</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Executive Summary Abstract</h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify font-serif">
              {report.narrative}
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Notable Verbatim Customer Citations</h4>
            <div className="space-y-2">
              {report.verbatimQuotes.map((quote, qIdx) => (
                <div key={qIdx} className="bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-500 text-xs italic text-slate-600 leading-relaxed">
                  "{quote}"
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            <span>Project LOOP Reporting Node</span>
            <span>Isolation Signature Verified</span>
          </div>
        </div>
      )}
    </div>
  );
}
