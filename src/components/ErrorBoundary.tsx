"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error | null;
    resetError: () => void;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log the error
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real app, you'd send this to your error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    };

    console.error('Error logged to service:', errorData);
  };

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-[#1a1d26] border border-[#2a2d3a] rounded-lg">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-[#d32f2f] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="space-y-3">
              <Button
                onClick={this.resetError}
                className="w-full bg-[#83bb06] hover:bg-[#6fa005] text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full bg-transparent border-[#2a2d3a] text-gray-300 hover:text-white hover:bg-[#2a2d3a]"
              >
                Reload Page
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-white">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-3 bg-[#272f3f] rounded text-xs text-red-400 overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 p-3 bg-[#272f3f] rounded text-xs text-yellow-400 overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('useErrorHandler caught error:', error);
    if (errorInfo) {
      console.error('Error info:', errorInfo);
    }
  };
}

// Specific error boundaries for different sections
export function ChartErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1d26] p-8">
          <AlertTriangle className="w-12 h-12 text-[#d32f2f] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Chart Error</h3>
          <p className="text-gray-400 text-center mb-4">
            Unable to load the trading chart. This might be due to a network issue or browser compatibility.
          </p>
          <Button onClick={resetError} className="bg-[#83bb06] hover:bg-[#6fa005] text-white">
            Retry Chart
          </Button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('Chart error:', error);
        console.error('Chart error info:', errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function DataErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="w-80 bg-[#1a1d26] border-r border-[#2a2d3a] flex flex-col items-center justify-center p-4">
          <AlertTriangle className="w-8 h-8 text-[#d32f2f] mb-3" />
          <h3 className="text-md font-semibold text-white mb-2">Data Error</h3>
          <p className="text-gray-400 text-center text-sm mb-4">
            Unable to load market data. Using fallback mode.
          </p>
          <Button onClick={resetError} size="sm" className="bg-[#83bb06] hover:bg-[#6fa005] text-white">
            Retry
          </Button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('Data error:', error);
        console.error('Data error info:', errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
