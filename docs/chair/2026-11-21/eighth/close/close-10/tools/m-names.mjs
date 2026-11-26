import { writeFileSync, mkdirSync } from 'node:fs';
export function measure(t, { row }) {
  if (process.env.SAVE_DIR) { mkdirSync(process.env.SAVE_DIR, { recursive: true }); writeFileSync(`${process.env.SAVE_DIR}/${row.seed}.json`, JSON.stringify(t)); }
  return { names: (t.institutions || []).map((i) => `${i.name}<${i.source || ''}>`), exports: t.economicState?.primaryExports || [] };
}
