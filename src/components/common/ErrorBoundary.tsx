import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const title = this.props.fallbackTitle || '오류가 발생했습니다';
      return (
        <div className="flex h-full min-h-[120px] items-center justify-center p-6">
          <div className="w-full max-w-md rounded-xl border border-alertRed/30 bg-panelBg p-6 text-center shadow-lg">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-alertRed/20">
              <AlertTriangle className="h-5 w-5 text-alertRed" />
            </div>
            <h2 className="mb-2 text-sm font-semibold text-textMain">
              {title}
            </h2>
            <p className="mb-3 text-xs text-textSub">
              예기치 않은 오류가 발생했습니다. 아래 버튼을 눌러 다시 시도해 주세요.
            </p>
            {this.state.error && (
              <pre className="mb-3 max-h-24 overflow-auto rounded-lg bg-appBg/60 p-2 text-left text-xs text-alertRed/80 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded-lg bg-decisionBlue px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-decisionBlue/80"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
