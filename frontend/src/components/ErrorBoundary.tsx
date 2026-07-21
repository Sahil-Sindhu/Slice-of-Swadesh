'use client';

import * as React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In the future, log this to Sentry, Datadog, etc.
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFBF5] text-[#1A1208] p-8">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-[#F0E6D8] text-center">
            <div className="text-4xl mb-4">🚨</div>
            <h1 className="text-2xl font-black mb-2">Something went wrong</h1>
            <p className="text-[#8C6E5A] mb-6">
              We encountered an unexpected error. Our team has been notified.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="bg-[#E8441A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#D03A12] transition-colors w-full"
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 text-left bg-red-50 p-4 rounded-xl text-xs overflow-auto font-mono text-red-900 border border-red-100 max-h-40">
                {this.state.error.message}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
