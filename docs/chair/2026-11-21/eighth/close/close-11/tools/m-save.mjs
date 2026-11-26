import { writeFileSync, mkdirSync } from 'node:fs';
export function measure(t, { row }) {
  mkdirSync(process.env.SAVE_DIR, { recursive: true });
  writeFileSync(`${process.env.SAVE_DIR}/${String(row.key ?? row.seed).replace(':', '_')}.json`, JSON.stringify(t));
  return { gv: t.generatorVersion ?? null };
}
