import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">
              Something went wrong!
            </h2>
            <p className="text-foreground/80 max-w-md mx-auto">
              We encountered an issue loading the content. Please try again.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-primary text-primary-foreground hover:bg-yellow-600 transition-colors rounded-lg font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;