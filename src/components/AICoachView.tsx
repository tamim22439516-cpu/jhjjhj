import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, Send, Bot, User, RefreshCw, MessageSquare } from 'lucide-react';

interface AICoachViewProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => Promise<void>;
  loadingChat: boolean;
}

export const AICoachView: React.FC<AICoachViewProps> = ({ messages, onSendMessage, loadingChat }) => {
  const [input, setInput] = useState('');

  const presetPrompts = [
    "How can I balance deep work with restorative rest?",
    "Give me a 3-step time blocking strategy for high productivity.",
    "I'm feeling overwhelmed with too many tasks. How should I prioritize?",
    "How do I prevent burnout while pursuing ambitious career goals?",
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loadingChat) return;
    const text = input;
    setInput('');
    await onSendMessage(text);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">AI Mentorship</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Tawzoon AI Balance Coach</h1>
          <p className="text-slate-400 text-sm mt-1">Your dedicated AI mentor for workflow optimization, time blocking, and stress relief powered by Gemini.</p>
        </div>
      </div>

      {/* Preset Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {presetPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            disabled={loadingChat}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-slate-300 text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col h-[600px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-24 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Ask your Balance Coach anything</h3>
              <p className="text-slate-400 text-xs max-w-md mx-auto">Get expert advice on work-life equilibrium, focus habits, and energy management.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    m.role === 'user'
                      ? 'bg-teal-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-teal-400 border border-slate-700'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-teal-400 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  <span className={`text-[10px] block mt-2 font-mono ${m.role === 'user' ? 'text-slate-800 text-right' : 'text-slate-500'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}

          {loadingChat && (
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-teal-400 border border-slate-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-slate-400 text-xs flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                <span>Tawzoon AI is formulating guidance...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your balance coach for guidance..."
            disabled={loadingChat}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loadingChat || !input.trim()}
            className="px-6 py-3 bg-teal-400 text-slate-950 font-bold rounded-2xl hover:bg-teal-300 transition-all shadow-md shadow-teal-400/20 cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
