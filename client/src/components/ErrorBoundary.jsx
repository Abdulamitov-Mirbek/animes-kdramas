import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-dark-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-400 mb-6">Please try refreshing the page</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
