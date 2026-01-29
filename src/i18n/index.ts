import { useStore } from '../store/useStore';
import { ko, type TranslationKeys } from './ko';
import { en } from './en';
import type { Locale } from '../types';

const translations: Record<Locale, TranslationKeys> = { ko, en };

/**
 * Get a nested value from an object using dot-separated path.
 * e.g., get(ko, 'dashboard.title') => 'HR 대시보드'
 */
function get(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

/** Translation function bound to current locale */
export function useT() {
  const locale = useStore((s) => s.locale);
  const dict = translations[locale];
  return (key: string) => get(dict as unknown as Record<string, unknown>, key);
}

/** Translation function for use outside React components (e.g. class components) */
export function getT(locale: Locale) {
  const dict = translations[locale];
  return (key: string) => get(dict as unknown as Record<string, unknown>, key);
}

export { ko, en };
