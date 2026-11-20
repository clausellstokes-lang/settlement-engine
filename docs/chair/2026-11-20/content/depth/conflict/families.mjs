// families.mjs <before> <after> — the word-matchers that read recentConflict's words (guardLineUnderTheLaw.js FAMILIES_NAMED;
// lowFamiliesI.mjs KEY 'old families'): places whose sentence held the word before and not after (an upper bound: the
// matchers also read the factions, conflicts, tensions and stress, not stored in these rows).
import { readFileSync } from 'node:fs';
const rd = (f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const [A, B] = [rd(process.argv[2]), rd(process.argv[3])];
const RX = { FAMILIES_NAMED: /\b(?:famil(?:y|ies)|nobles?|nobility|clans?|elders?)\b/i, 'law15K grazing': /\bdispute over grazing rights\b|\bgrazing rights and water\b/i, 'BOYCOTT (factionDynamics)': /stopped attending the sessions|argued against every one of them/ };
for (const [k, re] of Object.entries(RX)) { const by = {}; A.forEach((a, i) => { const x = re.test(a.rc || ''), y = re.test(B[i].rc || ''); if (x !== y) by[a.size + (x ? ' lost' : ' gained')] = (by[a.size + (x ? ' lost' : ' gained')] || 0) + 1; }); console.log(k.padEnd(28), JSON.stringify(by)); }
