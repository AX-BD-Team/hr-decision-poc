import { useState, useCallback } from 'react';
import { FileText, KanbanSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { docsMeta } from '../../data/docs-meta';
import { DocCard } from './DocCard';
import { DocDetailView } from './DocDetailView';
import { ProjectBoard } from './ProjectBoard';
import { useT } from '../../i18n';
import type { DocMeta } from '../../types';

type DocsTab = 'docs' | 'board';

const ALL_KEY = '__all__';
const categoryKeys = [ALL_KEY, ...Array.from(new Set(docsMeta.map((d) => d.category)))];

export function DocsPage() {
  const t = useT();
  const [activeTab, setActiveTab] = useState<DocsTab>('docs');
  const [activeCategory, setActiveCategory] = useState(ALL_KEY);
  const [selectedDoc, setSelectedDoc] = useState<DocMeta | null>(null);

  const filtered = activeCategory === ALL_KEY
    ? docsMeta
    : docsMeta.filter((d) => d.category === activeCategory);

  const handleTabChange = useCallback((tab: DocsTab) => {
    setActiveTab(tab);
    setSelectedDoc(null);
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setSelectedDoc(null);
  }, []);

  const tabs: { key: DocsTab; label: string; icon: typeof FileText }[] = [
    { key: 'docs', label: t('docs.tabDocs'), icon: FileText },
    { key: 'board', label: t('docs.tabBoard'), icon: KanbanSquare },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-decisionBlue" aria-hidden="true" />
        <div>
          <h1 className="text-lg font-semibold text-textMain">{t('docs.title')}</h1>
          <p className="text-xs text-textSub">{t('docs.subtitle')}</p>
        </div>
      </div>

      {/* 탭 바 */}
      <div className="flex gap-6 border-b border-surface-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={clsx(
              'flex items-center gap-1.5 pb-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === key
                ? 'border-decisionBlue text-decisionBlue'
                : 'border-transparent text-textSub hover:text-textMain',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'docs' ? (
        selectedDoc ? (
          <DocDetailView doc={selectedDoc} onBack={() => setSelectedDoc(null)} />
        ) : (
          <>
            {/* 카테고리 필터 */}
            <div className="flex items-center gap-2 flex-wrap">
              {categoryKeys.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={clsx(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                    activeCategory === cat
                      ? 'bg-decisionBlue text-white'
                      : 'glass-panel text-textSub hover:text-textMain hover:bg-appBg/50'
                  )}
                >
                  {cat === ALL_KEY ? t('common.all') : cat}
                </button>
              ))}
            </div>

            {/* 문서 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((doc) => (
                <DocCard key={doc.id} doc={doc} onSelect={setSelectedDoc} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-textSub text-sm">
                {t('docs.noDocs')}
              </div>
            )}
          </>
        )
      ) : (
        <ProjectBoard />
      )}
    </div>
  );
}
