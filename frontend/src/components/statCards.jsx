import React from 'react';

export default function StatCards({ summaryData }) {
  if (!summaryData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-900/30 h-24 rounded-xl border border-slate-800/40" />
        ))}
      </div>
    );
  }

  const cards = [
    { title: 'Total Audited Logs', value: summaryData.total, color: 'text-indigo-400', border: 'border-indigo-500/10', bg: 'from-indigo-500/5 to-transparent' },
    { title: 'Positive Insights', value: summaryData.positive, color: 'text-emerald-400', border: 'border-emerald-500/10', bg: 'from-emerald-500/5 to-transparent' },
    { title: 'Escalated Alerts', value: summaryData.negative, color: 'text-rose-400', border: 'border-rose-500/10', bg: 'from-rose-500/5 to-transparent' },
    { title: 'Escalation Share', value: `${summaryData.escalationPercentage}%`, color: 'text-amber-400', border: 'border-amber-500/10', bg: 'from-amber-500/5 to-transparent' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-linear-to-br ${card.bg} bg-slate-900/40 p-5 rounded-xl border ${card.border} backdrop-blur-md transition-all duration-200 hover:border-slate-700/60`}
        >
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {card.title}
          </p>
          <p className={`text-2xl sm:text-3xl font-black mt-2 tracking-tight ${card.color}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
