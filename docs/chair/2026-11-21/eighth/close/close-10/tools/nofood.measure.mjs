import { test } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const T = '/home/user/settlement-engine', S = process.env.S;
test('nofood', async () => {
  const { famineOf } = await import(`${T}/src/domain/facts/famine.js`);
  const fv = await import(`${T}/src/domain/facts/factVocabulary.js`);
  const { factsOf } = await import(`${T}/src/domain/facts/factsOf.js`);
  const { normalizeSettlement } = await import(`${T}/src/domain/normalizeSettlement.js`);
  const dl = await import(`${T}/src/domain/dailyLife.js`);
  const words = {}; const unknown = {}; let n = 0; const fareMoved = { moved: 0, n: 0 }; const ex = [];
  for (const f of readdirSync(`${S}/d13-line-rec`).sort()) {
    const rec = normalizeSettlement(JSON.parse(readFileSync(`${S}/d13-line-rec/${f}`, 'utf8')));
    const before = dl.deriveDailyLife(rec).slots.food_culture?.text;
    const r = JSON.parse(JSON.stringify(rec)); if (r.economicState?.foodSecurity) delete r.economicState.foodSecurity.foodRecord;
    const nr = normalizeSettlement(r);
    const w = String(famineOf(nr).shownBand); words[w] = (words[w] || 0) + 1; n++;
    const facts = factsOf(nr);
    for (const a of ['food: = pressured', 'food: ≥ secure', 'grain imported', 'food production: ≥ adequate', 'fish', 'game', 'livestock']) { let h; try { h = fv.atomHolds(a, facts); } catch { h = 'ERR'; } if (h === undefined) unknown[a] = (unknown[a] || 0) + 1; }
    const after = dl.deriveDailyLife(nr).slots.food_culture?.text; fareMoved.n++; if (after !== before) { fareMoved.moved++; if (ex.length < 3) ex.push(`${f}: "${before}" -> "${after}"`); }
  }
  writeFileSync(`${S}/nofood.json`, JSON.stringify({ n, words, unknown, fareMoved, ex }, null, 1));
}, 600000);
