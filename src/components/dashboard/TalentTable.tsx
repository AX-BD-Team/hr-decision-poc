import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { TalentRow } from '../../types';
import { useT } from '../../i18n';

interface TalentTableProps {
  data: TalentRow[];
}

type SortKey = keyof TalentRow;
type SortDir = 'asc' | 'desc';

const skillLevelOrder: Record<string, number> = {
  L5_Expert: 5,
  L4_High: 4,
  L3_High: 3,
  L3_Mid: 2,
  L3_Low: 1,
};

const evalGradeOrder: Record<string, number> = {
  S: 4,
  A: 3,
  'B+': 2,
  B: 1,
};

function getSkillBadgeClass(level: string) {
  if (level.startsWith('L5')) return 'bg-warning/15 text-warning';
  if (level.startsWith('L4')) return 'bg-decisionBlue/15 text-decisionBlue';
  return 'bg-neutralGray/20 text-textSub';
}

function getEvalBadgeClass(grade: string) {
  if (grade === 'S') return 'bg-success/15 text-success';
  if (grade === 'A') return 'bg-decisionBlue/15 text-decisionBlue';
  return 'bg-warning/15 text-warning';
}

const columnKeys: { key: SortKey; labelKey: string }[] = [
  { key: 'name', labelKey: 'dashboard.colName' },
  { key: 'rank', labelKey: 'dashboard.colRank' },
  { key: 'role', labelKey: 'dashboard.colRole' },
  { key: 'skillLevel', labelKey: 'dashboard.colSkillLevel' },
  { key: 'evalGrade', labelKey: 'dashboard.colEvalGrade' },
  { key: 'department', labelKey: 'dashboard.colDepartment' },
];

export function TalentTable({ data }: TalentTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterDept, setFilterDept] = useState<string>('all');
  const t = useT();

  const departments = useMemo(() => {
    const depts = [...new Set(data.map((r) => r.department))].sort();
    return ['all', ...depts];
  }, [data]);

  const filtered = useMemo(() => {
    let rows = filterDept === 'all' ? data : data.filter((r) => r.department === filterDept);

    rows = [...rows].sort((a, b) => {
      let av: string | number = a[sortKey] as string;
      let bv: string | number = b[sortKey] as string;

      if (sortKey === 'skillLevel') {
        av = skillLevelOrder[av] ?? 0;
        bv = skillLevelOrder[bv] ?? 0;
      } else if (sortKey === 'evalGrade') {
        av = evalGradeOrder[av] ?? 0;
        bv = evalGradeOrder[bv] ?? 0;
      }

      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return rows;
  }, [data, sortKey, sortDir, filterDept]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div className="rounded-xl glass-panel border border-neutralGray/20 p-5 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-sm font-semibold text-textMain">{t('dashboard.talentTableTitle')}</h3>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="rounded-lg bg-surface-1 border border-neutralGray/20 px-3 py-1.5 text-xs text-textMain outline-none focus:border-decisionBlue/50"
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d === 'all' ? t('dashboard.allDepartments') : d}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutralGray/20 text-left text-xs text-textSub">
              {columnKeys.map((col) => (
                <th
                  key={col.key}
                  className="py-2 pr-3 cursor-pointer select-none hover:text-textMain transition-colors"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {t(col.labelKey)}
                    {sortKey === col.key && (
                      sortDir === 'asc'
                        ? <ChevronUp className="h-3 w-3" />
                        : <ChevronDown className="h-3 w-3" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="border-b border-neutralGray/10 hover:bg-decisionBlue/5 transition-colors"
              >
                <td className="py-2 pr-3 text-textMain font-medium">{row.name}</td>
                <td className="py-2 pr-3 text-textSub">{row.rank}</td>
                <td className="py-2 pr-3 text-textSub">{row.role}</td>
                <td className="py-2 pr-3">
                  <span className={clsx('rounded-full px-2 py-0.5 text-xs font-mono', getSkillBadgeClass(row.skillLevel))}>
                    {row.skillLevel}
                  </span>
                </td>
                <td className="py-2 pr-3">
                  <span className={clsx('rounded-full px-2 py-0.5 text-xs font-bold', getEvalBadgeClass(row.evalGrade))}>
                    {row.evalGrade}
                  </span>
                </td>
                <td className="py-2 text-textSub">{row.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-6 text-center text-xs text-textSub">{t('dashboard.emptyTalent')}</p>
        )}
      </div>
    </div>
  );
}
