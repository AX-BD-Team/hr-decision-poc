import { useState } from 'react';
import { FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { docsMeta } from '../../data/docs-meta';
import { DocCard } from './DocCard';

const categories = ['전체', ...Array.from(new Set(docsMeta.map((d) => d.category)))];

export function DocsPage() {
  const [activeCategory, setActiveCategory] = useState('전체');

  const filtered = activeCategory === '전체'
    ? docsMeta
    : docsMeta.filter((d) => d.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-decisionBlue" aria-hidden="true" />
        <div>
          <h1 className="text-lg font-semibold text-textMain">프로젝트 문서</h1>
          <p className="text-xs text-textSub">기획서, 데이터 명세, 평가 계획 등 프로젝트 산출물을 열람할 수 있습니다.</p>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
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
            {cat}
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
          해당 카테고리에 문서가 없습니다.
        </div>
      )}
    </div>
  );
}
