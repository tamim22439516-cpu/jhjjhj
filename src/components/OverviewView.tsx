import React from 'react';
import { BalanceScores, EquilibriumAnalysis, TabType } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Zap, HeartPulse, Brain, Compass, Clock, CheckCircle2 } from 'lucide-react';

interface OverviewViewProps {
  balanceScores: BalanceScores;
  analysis: EquilibriumAnalysis | null;
  loadingAnalysis: boolean;
  onNavigate: (tab: TabType) => void;
  onRunAudit: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  balanceScores,
  analysis,
  loadingAnalysis,
  onNavigate,
  onRunAudit,
}) => {
  const scoresArray = [
    { label: 'Work', value: balanceScores.work, icon: Compass, color: 'bg-blue-500' },
    { label: 'Health', value: balanceScores.health, icon: HeartPulse, color: 'bg-emerald-500' },
    { label: 'Focus', value: balanceScores.focus, icon: Zap, color: 'bg-amber-500' },
    { label: 'Mind', value: balanceScores.mind, icon: Brain, color: 'bg-purple-500' },
    { label: 'Creativity', value: balanceScores.creativity, icon: Sparkles, color: 'bg-rose-500' },
    { label: 'Rest', value: balanceScores.rest, icon: Clock, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-10 pb-16 animate-fadeIn">
      {/* Hero Section with Generated Image */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/tawzoon_hero_banner_1792513579490.jpg"
            alt="Tawzoon Equilibrium"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" />
            <span>Powered by Gemini 3.8 Flash AI Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Harmonize Your Life & Workflow With Precision Equilibrium.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Tawzoon (توازن) bridges deep productivity with restorative well-being. Continuously balance your work output, mental clarity, physical vitality, and inner calm using advanced AI orchestration.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onRunAudit}
              disabled={loadingAnalysis}
              className="flex items-center gap-2 px-6 py-3.5 bg-teal-400 text-slate-950 font-bold rounded-xl hover:bg-teal-300 transition-all shadow-lg shadow-teal-400/20 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              <span>{loadingAnalysis ? 'Analyzing Equilibrium...' : 'Run Instant AI Audit'}</span>
            </button>
            <button
              onClick={() => onNavigate('balance')}
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-800/80 text-white font-semibold rounded-xl hover:bg-slate-700 border border-slate-700 transition-all backdrop-blur-md cursor-pointer"
            >
              <span>Explore Balance Wheel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Unboxed Static Metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-400 pt-4 border-t border-slate-800/60">
            <span>Adaptive AI Coaching</span>
            <span aria-hidden="true">·</span>
            <span>Energy-Smart Task Orchestration</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Equilibrium Score: <strong className="text-teal-400">{analysis?.overallScore || 82}%</strong></span>
          </div>
        </div>
      </div>

      {/* Equilibrium Scorecard & AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Equilibrium Status</span>
              <h2 className="text-2xl font-bold text-white mt-1">
                {analysis?.equilibriumStatus || 'Optimal Energy Balance'}
              </h2>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xl font-black tabular-nums">
              {analysis?.overallScore || 82}
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            "{analysis?.keyInsight || 'Your focus and execution are operating at peak efficiency. Consider allocating more time to restorative rest to maintain sustainable long-term velocity.'}"
          </p>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Recommended Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(analysis?.recommendations || [
                'Schedule a 20-minute digital sunset',
                'Incorporate a physical stretch break',
                'Prioritize top 2 critical tasks today'
              ]).map((rec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 flex flex-col justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{rec}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Action item 0{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Domain Scores */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Domain Breakdown</h3>
              <button
                onClick={() => onNavigate('balance')}
                className="text-xs text-teal-400 hover:underline font-medium cursor-pointer"
              >
                Adjust Wheel →
              </button>
            </div>
            <div className="space-y-4">
              {scoresArray.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-teal-400" />
                        {item.label}
                      </span>
                      <span className="font-mono font-bold text-white tabular-nums">{item.value}/10</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                        style={{ width: `${(item.value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300">
            <strong>Coach Note:</strong> {analysis?.aiCoachNote || "You're doing wonderfully. Balance is a daily practice, not a static destination."}
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">Core Equilibrium Pillars</h2>
          <p className="text-slate-400 text-sm">Four integrated modules designed to keep your professional ambition and personal well-being in perfect alignment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => onNavigate('balance')}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-teal-500/50 transition-all cursor-pointer group space-y-4 shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Balance Wheel</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Fine-tune your 6 core life pillars with instant AI diagnostics and personalized equilibrium scoring.</p>
            <div className="text-xs text-teal-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Wheel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('tasks')}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-teal-500/50 transition-all cursor-pointer group space-y-4 shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Task Orchestrator</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Turn ambiguous goals into balanced action items with Gemini energy estimation and duration tracking.</p>
            <div className="text-xs text-teal-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Manage Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('journal')}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-teal-500/50 transition-all cursor-pointer group space-y-4 shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Journal & Mood</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Record daily thoughts and energy levels. Receive instant AI reflections to prevent burnout.</p>
            <div className="text-xs text-teal-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Write Entry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('coach')}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-teal-500/50 transition-all cursor-pointer group space-y-4 shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Balance Coach</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Chat with your dedicated AI mentor for workflow optimization, time blocking, and stress relief.</p>
            <div className="text-xs text-teal-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Start Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
