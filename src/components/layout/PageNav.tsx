import { GitBranch, LayoutDashboard, FileText, Moon, Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n';
import { clsx } from 'clsx';
import type { PageId } from '../../types';

const pageKeys: { id: PageId; labelKey: string; icon: typeof GitBranch }[] = [
  { id: 'workflow', labelKey: 'pages.workflow', icon: GitBranch },
  { id: 'dashboard', labelKey: 'pages.dashboard', icon: LayoutDashboard },
  { id: 'docs', labelKey: 'pages.docs', icon: FileText },
];

export function PageNav() {
  const activePage = useStore((s) => s.activePage);
  const setActivePage = useStore((s) => s.setActivePage);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const locale = useStore((s) => s.locale);
  const toggleLocale = useStore((s) => s.toggleLocale);
  const t = useT();

  return (
    <nav className="flex items-center gap-1 border-b border-neutralGray/20 mb-3" aria-label={t('a11y.pageNav')}>
      {pageKeys.map((page) => {
        const Icon = page.icon;
        const isActive = activePage === page.id;
        return (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px',
              isActive
                ? 'border-decisionBlue text-decisionBlue'
                : 'border-transparent text-textSub hover:text-textMain hover:border-neutralGray/40'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t(page.labelKey)}</span>
          </button>
        );
      })}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-textSub transition-all hover:text-textMain"
        >
          <span className={locale === 'ko' ? 'text-decisionBlue font-bold' : ''}>KO</span>
          <span className="text-neutralGray/50">|</span>
          <span className={locale === 'en' ? 'text-decisionBlue font-bold' : ''}>EN</span>
        </button>
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? t('a11y.themeToLight') : t('a11y.themeToDark')}
          className="rounded-lg p-2 text-textSub transition-all hover:text-textMain"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </nav>
  );
}
