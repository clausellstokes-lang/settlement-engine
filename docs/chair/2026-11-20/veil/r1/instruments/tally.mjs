import { readFileSync } from 'node:fs';
const { REGISTRY_ROWS } = await import('/home/user/settlement-engine/src/domain/veil/rosterChoiceRegistry.js');
const paths = new Set();
for (const run of ['base-gallery', 'base-link', 'master-gallery', 'master-link']) for (const l of readFileSync(`/var/tmp/v18/out/${run}/classlist.txt`, 'utf8').split('\n')) if (l) paths.add(l.split(' | ')[0].trim());
const hit = new Map(REGISTRY_ROWS.map((r) => [r.id, 0])); let multi = 0;
for (const p of paths) { const m = REGISTRY_ROWS.filter((r) => new RegExp(r.path).test(p)); if (m.length > 1) { multi += 1; console.log('MULTI', p, m.map((r) => r.id).join(',')); } for (const r of m) hit.set(r.id, hit.get(r.id) + 1); }
console.log(`union of in-class paths: ${paths.size}; rows ${REGISTRY_ROWS.length}; paths matched by >1 row: ${multi}`);
console.log('rows matching no differ path (registered from VR4 / SUB-BRIEF-BCD):', REGISTRY_ROWS.filter((r) => !hit.get(r.id)).map((r) => r.id).join(', '));
const t = {}; for (const r of REGISTRY_ROWS) { const k = `${r.rule}/${r.when}`; t[k] = t[k] || {}; t[k][r.vr14 ?? '-'] = (t[k][r.vr14 ?? '-'] || 0) + 1; }
console.log(JSON.stringify(t));
const pt = {}; for (const p of paths) { const r = REGISTRY_ROWS.find((x) => new RegExp(x.path).test(p)); const k = r ? `${r.rule}/${r.when}` : 'NONE'; pt[k] = (pt[k] || 0) + 1; } console.log('paths by rule:', JSON.stringify(pt));
console.log('chair rows:', REGISTRY_ROWS.filter((r) => r.chair).length, REGISTRY_ROWS.filter((r) => r.drawn === 'unsettled').length, 'unsettled');
