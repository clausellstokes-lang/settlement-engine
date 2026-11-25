// node page-why.mjs <dirA> <dirB> : for births whose pageHash moved, which printed views differ; tally by view set
import { readFileSync, readdirSync } from 'node:fs';
const [A, Bd] = process.argv.slice(2);
const tally = {}; const per = [];
for (const f of readdirSync(A + '/rows').sort()) {
  const a = JSON.parse(readFileSync(`${A}/rows/${f}`, 'utf8')); const b = JSON.parse(readFileSync(`${Bd}/rows/${f}`, 'utf8'));
  if (a.pageHash === b.pageHash) continue;
  const views = [...new Set([...Object.keys(a.printed || {}), ...Object.keys(b.printed || {})])].filter((v) => JSON.stringify(a.printed?.[v]) !== JSON.stringify(b.printed?.[v]));
  const k = views.join(' + ') || '(no printed view differs)'; tally[k] = (tally[k] || 0) + 1; per.push(a.seed + '\t' + k);
}
for (const [k, n] of Object.entries(tally).sort((x, y) => y[1] - x[1])) console.log(n + '\t' + k);
if (process.argv[4]) (await import('node:fs')).writeFileSync(process.argv[4], per.join('\n') + '\n');
