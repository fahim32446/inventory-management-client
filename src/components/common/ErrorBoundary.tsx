import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    // Check if the error is a dynamic import failure (ChunkLoadError)
    const errorString = error.toString();
    const isChunkLoadError =
      error.name === 'ChunkLoadError' ||
      /Loading chunk \d+ failed/.test(error.message) ||
      errorString.includes('ChunkLoadError');

    if (isChunkLoadError) {
      const hasReloaded = sessionStorage.getItem('chunk-load-error-reloaded');

      if (!hasReloaded) {
        sessionStorage.setItem('chunk-load-error-reloaded', 'true');
        console.warn('ChunkLoadError detected. Reloading application...');
        window.location.reload();
      } else {
        console.error('ChunkLoadError persists after reload.');
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center',
            background: '#f8f9fa',
            color: '#333',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            We encountered a problem while loading the application.
          </p>
          <button
            onClick={() => {
              sessionStorage.removeItem('chunk-load-error-reloaded');
              window.location.reload();
            }}
            style={{
              padding: '10px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Reload Application
          </button>
          {import.meta.env.DEV && (
            <pre
              style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#eee',
                borderRadius: '4px',
                maxWidth: '100%',
                overflow: 'auto',
                fontSize: '0.8rem',
                textAlign: 'left',
              }}
            >
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
