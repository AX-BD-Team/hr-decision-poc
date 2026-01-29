import { Download, FileText, BookOpen, Database, ClipboardCheck, Rocket } from 'lucide-react';
import { clsx } from 'clsx';
import type { DocMeta } from '../../types';
import { useT } from '../../i18n';

const categoryConfig: Record<string, { color: string; icon: typeof FileText }> = {
  기획: { color: 'text-zoneStruct bg-zoneStruct/15 border-zoneStruct/30', icon: BookOpen },
  데이터: { color: 'text-zoneGraph bg-zoneGraph/15 border-zoneGraph/30', icon: Database },
  평가: { color: 'text-zonePath bg-zonePath/15 border-zonePath/30', icon: ClipboardCheck },
  배포: { color: 'text-contextGreen bg-contextGreen/15 border-contextGreen/30', icon: Rocket },
};

interface DocCardProps {
  doc: DocMeta;
}

export function DocCard({ doc }: DocCardProps) {
  const t = useT();
  const cfg = categoryConfig[doc.category] ?? { color: 'text-textSub bg-surface-1 border-neutralGray/30', icon: FileText };
  const Icon = cfg.icon;

  return (
    <div className="rounded-xl glass-panel border border-neutralGray/20 p-5 flex flex-col gap-3 hover:border-neutralGray/40 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-textSub flex-shrink-0" aria-hidden="true" />
          <span className={clsx('rounded-md border px-2 py-0.5 text-xs font-medium', cfg.color)}>
            {doc.category}
          </span>
        </div>
        <span className="text-micro text-textSub flex-shrink-0">{doc.fileSize}</span>
      </div>

      <h3 className="text-sm font-semibold text-textMain leading-snug">{doc.title}</h3>
      <p className="text-xs text-textSub leading-relaxed flex-1">{doc.description}</p>

      <div className="flex items-center justify-between pt-2 border-t border-neutralGray/10">
        <span className="text-micro text-textSub">{t('docs.lastUpdated')}: {doc.lastUpdated}</span>
        <a
          href={`/docs/${doc.filename}`}
          download
          className="flex items-center gap-1.5 rounded-lg bg-decisionBlue/10 border border-decisionBlue/20 px-3 py-1.5 text-xs font-medium text-decisionBlue hover:bg-decisionBlue/20 transition-all"
          aria-label={`${doc.title} ${t('docs.downloadAria')}`}
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          {t('docs.download')}
        </a>
      </div>
    </div>
  );
}
