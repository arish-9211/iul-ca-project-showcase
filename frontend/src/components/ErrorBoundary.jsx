import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="fatal-error">
          <p className="eyebrow">LET’S TRY THAT AGAIN</p>
          <h1>The showcase couldn’t open this page.</h1>
          <p>
            Please refresh to load the latest version. If the problem continues, contact the project
            coordinator.
          </p>
          <button className="button button-primary" onClick={() => window.location.reload()}>
            Refresh page
          </button>
          <a href="/" className="text-link">
            Return to overview
          </a>
        </main>
      );
    return this.props.children;
  }
}
