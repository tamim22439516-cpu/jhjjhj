import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI component tree:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('tawzoon_portal');
      sessionStorage.clear();
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#009245] flex items-center justify-center mx-auto shadow-2xs">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                পেজ লোড করতে সমস্যা হয়েছে
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                নিচের বাটনে ক্লিক করে পুনরায় চেষ্টা করুন অথবা হোম পেজে ফিরে যান।
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-[#009245] hover:bg-[#007a3a] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>রিলোড করুন</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
