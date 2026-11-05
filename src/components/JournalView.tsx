import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { Brain, Sparkles, Smile, Battery, Calendar, Trash2 } from 'lucide-react';

interface JournalViewProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ entries, onAddEntry, onDeleteEntry }) => {
  const [reflection, setReflection] = useState('');
  const [energyLevel, setEnergyLevel] = useState(7);
  const [mood, setMood] = useState('Calm & Focused');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) return;

    // Simulate AI feedback based on energy & mood
    const aiFeedback = energyLevel >= 7 
      ? "Your energy is robust today! Ideal for tackling deep strategic tasks, but ensure you take intentional pause breaks."
      : "Your energy is gentle today. Honor your rhythm by prioritizing lighter tasks and restorative activities.";

    onAddEntry({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      energyLevel,
      mood,
      reflection,
      aiFeedback,
    });
    setReflection('');
  };

  return (
    <div className="space-y-10 pb-16 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Mind & Reflection</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">AI Equilibrium Journal</h1>
          <p className="text-slate-400 text-sm mt-1">Record your daily energy and thoughts. Receive instant AI reflection to prevent burnout and foster calm.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entry Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-teal-400">
            <Brain className="w-5 h-5" />
            <h2 className="font-bold text-white text-base">New Reflection Entry</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Energy Level (1-10)</span>
                <span className="font-mono text-teal-400 font-bold">{energyLevel}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full accent-teal-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <Smile className="w-4 h-4 text-teal-400" />
                <span>Primary Mood / State</span>
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
              >
                <option value="Calm & Focused">Calm & Focused</option>
                <option value="High Velocity">High Velocity</option>
                <option value="Reflective & Quiet">Reflective & Quiet</option>
                <option value="Tired / Needs Rest">Tired / Needs Rest</option>
                <option value="Inspired & Creative">Inspired & Creative</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Daily Thoughts & Observations</label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What went well today? Where did you feel resistance or friction? How is your work-life balance..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 h-36 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-teal-400 text-slate-950 font-bold rounded-xl hover:bg-teal-300 transition-all shadow-md shadow-teal-400/20 cursor-pointer text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save & Get AI Reflection</span>
            </button>
          </form>
        </div>

        {/* Entries Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white">Previous Journal Entries</h2>

          {entries.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <Brain className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">No journal entries yet. Record your first reflection above.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  {/* Unboxed Metadata */}
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-white">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      {entry.date}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-teal-400 font-semibold">{entry.mood}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Battery className="w-3.5 h-3.5" />
                      Energy: {entry.energyLevel}/10
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                  {entry.reflection}
                </p>

                {entry.aiFeedback && (
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block mb-0.5">Gemini Equilibrium Reflection:</strong>
                      <span>{entry.aiFeedback}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
