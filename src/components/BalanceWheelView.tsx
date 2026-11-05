import React from 'react';
import { BalanceScores, EquilibriumAnalysis } from '../types';
import { Compass, HeartPulse, Zap, Brain, Sparkles, Clock, RefreshCw } from 'lucide-react';

interface BalanceWheelViewProps {
  balanceScores: BalanceScores;
  onScoreChange: (domain: keyof BalanceScores, value: number) => void;
  analysis: EquilibriumAnalysis | null;
  loadingAnalysis: boolean;
  onRunAudit: () => void;
}

export const BalanceWheelView: React.FC<BalanceWheelViewProps> = ({
  balanceScores,
  onScoreChange,
  analysis,
  loadingAnalysis,
  onRunAudit,
}) => {
  const domains = [
    { key: 'work' as keyof BalanceScores, label: 'Work & Ambition', desc: 'Professional output & career goals', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { key: 'health' as keyof BalanceScores, label: 'Physical Health', desc: 'Nutrition, exercise & vitality', icon: HeartPulse, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { key: 'focus' as keyof BalanceScores, label: 'Deep Focus', desc: 'Flow state & distraction control', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { key: 'mind' as keyof BalanceScores, label: 'Mental Clarity', desc: 'Emotional regulation & calm', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { key: 'creativity' as keyof BalanceScores, label: 'Creativity & Play', desc: 'Curiosity, art & exploration', icon: Sparkles, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { key: 'rest' as keyof BalanceScores, label: 'Rest & Recovery', desc: 'Sleep quality & relaxation', icon: Clock, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  ];

  return (
    <div className="space-y-10 pb-16 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Equilibrium Mapping</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">The Balance Wheel</h1>
          <p className="text-slate-400 text-sm mt-1">Rate your satisfaction across your 6 core life pillars (1-10) and let Gemini AI analyze your equilibrium.</p>
        </div>
        <button
          onClick={onRunAudit}
          disabled={loadingAnalysis}
          className="flex items-center gap-2 px-5 py-3 bg-teal-400 text-slate-950 font-bold rounded-xl hover:bg-teal-300 transition-all shadow-md shadow-teal-400/20 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loadingAnalysis ? 'animate-spin' : ''}`} />
          <span>{loadingAnalysis ? 'Analyzing...' : 'Refresh AI Analysis'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sliders Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {domains.map((d) => {
            const Icon = d.icon;
            const val = balanceScores[d.key];
            return (
              <div key={d.key} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${d.bg} flex items-center justify-center ${d.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{d.label}</h3>
                        <p className="text-[11px] text-slate-400">{d.desc}</p>
                      </div>
                    </div>
                    <span className="text-xl font-black font-mono text-teal-400 tabular-nums">{val}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={val}
                    onChange={(e) => onScoreChange(d.key, parseInt(e.target.value))}
                    className="w-full accent-teal-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1 (Critical)</span>
                    <span>5 (Moderate)</span>
                    <span>10 (Optimal)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Analysis Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Gemini Evaluation</span>
              <div className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-300 text-xs font-bold tabular-nums">
                Score: {analysis?.overallScore || 82}%
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">
                {analysis?.equilibriumStatus || 'Stable Equilibrium'}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                "{analysis?.keyInsight || 'Adjust the sliders to instantly trigger a comprehensive AI equilibrium and stress analysis.'}"
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actionable Recommendations</h4>
              <ul className="space-y-2">
                {(analysis?.recommendations || [
                  'Balance high work output with dedicated recovery blocks',
                  'Maintain consistent sleep schedules',
                  'Incorporate mindfulness breaks'
                ]).map((rec, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                    <span className="text-teal-400 font-bold">0{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300">
            <strong>AI Coach:</strong> {analysis?.aiCoachNote || "Equilibrium isn't about equal time in every area; it's about intentional alignment with your core values."}
          </div>
        </div>
      </div>
    </div>
  );
};
