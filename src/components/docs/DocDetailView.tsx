import { ArrowLeft, Download, FileText, BookOpen, Database, ClipboardCheck, Rocket, Calendar, HardDrive } from 'lucide-react';
import { clsx } from 'clsx';
import type { DocMeta } from '../../types';
import { useT } from '../../i18n';

const categoryConfig: Record<string, { color: string; icon: typeof FileText }> = {
  기획: { color: 'text-zoneStruct bg-zoneStruct/15 border-zoneStruct/30', icon: BookOpen },
  데이터: { color: 'text-zoneGraph bg-zoneGraph/15 border-zoneGraph/30', icon: Database },
  평가: { color: 'text-zonePath bg-zonePath/15 border-zonePath/30', icon: ClipboardCheck },
  배포: { color: 'text-contextGreen bg-contextGreen/15 border-contextGreen/30', icon: Rocket },
};

interface DocDetailViewProps {
  doc: DocMeta;
  onBack: () => void;
}

function renderContent(content: string) {
  const lines = content.split('\n');
  return (
    <ul className="space-y-1.5 ml-1">
      {lines.map((line, i) => {
        const text = line.startsWith('- ') ? line.slice(2) : line;
        return (
          <li key={i} className="flex items-baseline gap-2 text-sm text-textSub leading-relaxed">
            <span className="text-textSub/50 flex-shrink-0">•</span>
            <span>{text}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function DocDetailView({ doc, onBack }: DocDetailViewProps) {
  const t = useT();
  const cfg = categoryConfig[doc.category] ?? { color: 'text-textSub bg-surface-1 border-neutralGray/30', icon: FileText };
  const Icon = cfg.icon;

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-textSub hover:text-textMain transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('docs.backToList')}
      </button>

      {/* 헤더 */}
      <div className="rounded-xl glass-panel border border-neutralGray/20 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-textSub flex-shrink-0" aria-hidden="true" />
              <span className={clsx('rounded-md border px-2.5 py-0.5 text-xs font-medium', cfg.color)}>
                {doc.category}
              </span>
            </div>
            <h1 className="text-xl font-bold text-textMain">{doc.title}</h1>
            <p className="text-sm text-textSub leading-relaxed">{doc.description}</p>
            <div className="flex items-center gap-4 text-micro text-textSub">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {t('docs.lastUpdated')}: {doc.lastUpdated}
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
                {doc.fileSize}
              </span>
            </div>
          </div>
          <a
            href={`/docs/${doc.filename}`}
            download
            className="flex items-center gap-1.5 rounded-lg bg-decisionBlue/10 border border-decisionBlue/20 px-4 py-2 text-sm font-medium text-decisionBlue hover:bg-decisionBlue/20 transition-all flex-shrink-0"
            aria-label={`${doc.title} ${t('docs.downloadAria')}`}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t('docs.download')}
          </a>
        </div>
      </div>

      {/* 본문: 목차 + 섹션 */}
      <div className="flex gap-6">
        {/* 좌측 목차 (sticky) */}
        <nav className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-4 rounded-xl glass-panel border border-neutralGray/20 p-4 space-y-2">
            <h2 className="text-xs font-semibold text-textMain uppercase tracking-wider">
              {t('docs.tableOfContents')}
            </h2>
            <ul className="space-y-1">
              {doc.sections.map((section, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    className="block text-xs text-textSub hover:text-decisionBlue transition-colors py-1 px-2 rounded hover:bg-surface-1"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 space-y-4">
          {doc.sections.map((section, i) => (
            <section
              key={i}
              id={`section-${i}`}
              className="rounded-xl glass-panel border border-neutralGray/20 p-5 space-y-3"
            >
              <h2 className="text-sm font-semibold text-textMain">{section.heading}</h2>
              {renderContent(section.content)}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
