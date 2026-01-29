import { useState } from 'react';
import { FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { docsMeta } from '../../data/docs-meta';
import { DocCard } from './DocCard';
import { useT } from '../../i18n';

const ALL_KEY = '__all__';
const categoryKeys = [ALL_KEY, ...Array.from(new Set(docsMeta.map((d) => d.category)))];

export function DocsPage() {
  const t = useT();
  const [activeCategory, setActiveCategory] = useState(ALL_KEY);

  const filtered = activeCategory === ALL_KEY
    ? docsMeta
    : docsMeta.filter((d) => d.category === activeCategory);

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

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-2 flex-wrap">
        {categoryKeys.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
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
          <DocCard key={doc.id} doc={doc} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-textSub text-sm">
          {t('docs.noDocs')}
        </div>
      )}
    </div>
  );
}
