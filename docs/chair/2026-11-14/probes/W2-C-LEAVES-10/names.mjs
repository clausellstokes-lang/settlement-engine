import { readFileSync } from 'node:fs';
const { isArcaneInstitution } = await import(process.argv[2] + '/src/domain/arcaneInstitutionIdentity.js');
const OLD = /\bprint|\bscriptor|\bbookbind|\blibrar|\buniversit|\bcollege|\bscribe|\bsage|\bwizard/;
const NEW = /\bprint|\bscriptor|\bbookbind|\blibrar|\buniversit|\bcollege|\bscribe|\bsage/;
const names = new Map();
for (const l of readFileSync(process.argv[3], 'utf8').split('\n').filter(Boolean)) { const r = JSON.parse(l); for (const n of r.names) names.set(n, (names.get(n) || 0) + 1); }
const wiz = [], arc = [], diff = [];
for (const [n, c] of names) { const low = n.toLowerCase(); const o = OLD.test(low); const a = isArcaneInstitution(n); const a2 = isArcaneInstitution(low);
  if (/\bwizard/.test(low)) wiz.push(`${n} (${c}) arcane=${a}/${a2} new=${NEW.test(low)}`);
  if (a || a2) arc.push(`${n} (${c}) ${a}/${a2} old=${o}`);
  const nw = NEW.test(low) || a2; if (o !== nw) diff.push(`${n} (${c}) old=${o} new=${nw}`); }
console.log('distinct names', names.size); console.log('WIZARD', wiz); console.log('ARCANE', arc); console.log('DIFF', diff);
