import React, { useState } from 'react';
import { TaskItem } from '../types';
import { Zap, Plus, Sparkles, CheckCircle2, Circle, Trash2, Clock, Filter } from 'lucide-react';

interface TaskOrchestratorViewProps {
  tasks: TaskItem[];
  onAddTask: (task: TaskItem) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onGenerateTasksFromGoal: (goal: string) => Promise<void>;
  loadingTasks: boolean;
}

export const TaskOrchestratorView: React.FC<TaskOrchestratorViewProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onGenerateTasksFromGoal,
  loadingTasks,
}) => {
  const [goalInput, setGoalInput] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState('Work');
  const [manualEnergy, setManualEnergy] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [manualDuration, setManualDuration] = useState(30);
  const [filterCategory, setFilterCategory] = useState('All');

  const handleAIBreakdown = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    await onGenerateTasksFromGoal(goalInput);
    setGoalInput('');
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;
    onAddTask({
      id: Date.now().toString(),
      title: manualTitle,
      category: manualCategory,
      energy: manualEnergy,
      durationMinutes: manualDuration,
      completed: false,
      createdAt: new Date().toLocaleDateString(),
    });
    setManualTitle('');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === 'All') return true;
    if (filterCategory === 'Completed') return t.completed;
    if (filterCategory === 'Active') return !t.completed;
    return t.category === filterCategory;
  });

  return (
    <div className="space-y-10 pb-16 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Workflow Orchestration</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">AI Task Orchestrator</h1>
          <p className="text-slate-400 text-sm mt-1">Transform ambiguous ambitions into balanced action items with Gemini energy & duration estimation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Goal Breakdown & Manual Add */}
        <div className="space-y-6">
          {/* AI Goal Breakdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-teal-400">
              <Sparkles className="w-5 h-5" />
              <h2 className="font-bold text-white text-base">Gemini Goal Breakdown</h2>
            </div>
            <p className="text-slate-400 text-xs">Enter any complex goal and let Gemini orchestrate balanced actionable tasks for you.</p>

            <form onSubmit={handleAIBreakdown} className="space-y-3">
              <textarea
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="e.g., Prepare quarterly strategy presentation and establish a daily morning workout routine..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 h-28 resize-none"
              />
              <button
                type="submit"
                disabled={loadingTasks || !goalInput.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-teal-400 text-slate-950 font-bold rounded-xl hover:bg-teal-300 transition-all shadow-md shadow-teal-400/20 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${loadingTasks ? 'animate-spin' : ''}`} />
                <span>{loadingTasks ? 'Orchestrating Tasks...' : 'Generate AI Tasks'}</span>
              </button>
            </form>
          </div>

          {/* Manual Task Add Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-400" />
              <span>Add Custom Task</span>
            </h2>

            <form onSubmit={handleManualAdd} className="space-y-3">
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Category</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="Work">Work</option>
                    <option value="Health">Health</option>
                    <option value="Focus">Focus</option>
                    <option value="Mind">Mind</option>
                    <option value="Rest">Rest</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Energy Required</label>
                  <select
                    value={manualEnergy}
                    onChange={(e) => setManualEnergy(e.target.value as any)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Duration (Minutes)</label>
                <input
                  type="number"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(parseInt(e.target.value) || 30)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Add Task</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Task List & Filtering */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            {['All', 'Active', 'Completed', 'Work', 'Health', 'Focus', 'Mind'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-teal-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Task Items List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                <Zap className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-sm">No tasks found in this view. Use Gemini AI goal breakdown or add one manually.</p>
              </div>
            ) : (
              filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-5 bg-slate-900 border rounded-2xl flex items-center justify-between gap-4 transition-all shadow-md ${
                    t.completed ? 'border-slate-800 opacity-60 bg-slate-950/40' : 'border-slate-800 hover:border-teal-500/40'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      onClick={() => onToggleTask(t.id)}
                      className="text-teal-400 hover:scale-110 transition-transform cursor-pointer shrink-0"
                    >
                      {t.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-teal-400 fill-teal-500/20" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-600" />
                      )}
                    </button>
                    <div className="min-w-0 space-y-1">
                      <h3 className={`font-semibold text-sm truncate ${t.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {t.title}
                      </h3>
                      {/* Unboxed Metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-teal-400 font-medium">{t.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>Energy: {t.energy}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {t.durationMinutes}m
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTask(t.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
