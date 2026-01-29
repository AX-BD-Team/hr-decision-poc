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
    <nav className="flex items-center gap-1 border-b border-neutralGray/20 mb-2" aria-label={t('a11y.pageNav')}>
      {pageKeys.map((page) => {
        const Icon = page.icon;
        const isActive = activePage === page.id;
        return (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all border-b-2 -mb-px',
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

      {/* KO|EN + Theme toggle — pushed to right */}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-textSub transition-all hover:text-textMain hover:bg-appBg/40"
        >
          <span className={locale === 'ko' ? 'text-decisionBlue font-bold' : ''}>KO</span>
          <span className="text-neutralGray/50">|</span>
          <span className={locale === 'en' ? 'text-decisionBlue font-bold' : ''}>EN</span>
        </button>
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? t('a11y.themeToLight') : t('a11y.themeToDark')}
          className="flex items-center rounded-lg px-2.5 py-1.5 text-sm text-textSub transition-all hover:bg-appBg/40 hover:text-textMain"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </nav>
  );
}
