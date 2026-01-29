import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getT } from '@/i18n';

interface Props {
  children: ReactNode;
  fallbackTitleKey?: string;
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
      const locale = useStore.getState().locale;
      const t = getT(locale);
      const title = this.props.fallbackTitleKey
        ? t(this.props.fallbackTitleKey)
        : t('errorBoundary.defaultTitle');
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
              {t('errorBoundary.description')}
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
              {t('errorBoundary.retry')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
