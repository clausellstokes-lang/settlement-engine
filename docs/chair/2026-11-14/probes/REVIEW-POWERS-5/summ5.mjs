// REVIEW-POWERS-5 summ5.mjs — node summ5.mjs <lines5 json>... : the counts step 1's rows quote (every print by size and
// crisis; the criminal-sway chips the hall line contradicts; the hall line under an occupation or an infiltration).
import fs from 'node:fs';
const J = process.argv.slice(2).map((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
const all = (k) => J.flatMap((j) => j[k]);
const sz = (rs) => rs.reduce((a, r) => ((a[r.tier] = (a[r.tier] || 0) + 1), a), {});
const cr = (rs) => rs.reduce((a, r) => { for (const s of r.st.length ? r.st : ['calm']) a[s] = (a[s] || 0) + 1; return a; }, {});
const chip = all('chip').filter((r) => r.words);
const out = {};
for (const w of [...new Set(chip.map((r) => r.words))]) { const rs = chip.filter((r) => r.words === w); out['chip ' + w] = { prints: rs.length, sizes: sz(rs), crises: cr(rs) }; }
const cs = chip.filter((r) => r.words === 'criminal sway');
const CON = /Nobody at (the head|its head)|none of them takes orders|rules in its own name|has no friend among/;
out['criminal sway contradicted'] = { n: cs.filter((r) => CON.test(r.facts.hallLine || '')).length, of: cs.length, sizes: sz(cs.filter((r) => CON.test(r.facts.hallLine || ''))) };
const ch = chip.filter((r) => /church/.test(r.words)); out['church chip, no religious power on the roster'] = { n: ch.filter((r) => !r.roster.some((x) => x.cat === 'religious')).length, of: ch.length, sizes: sz(ch.filter((r) => !r.roster.some((x) => x.cat === 'religious'))) };
const hall = all('hall'); out.hall = { prints: hall.length, sizes: sz(hall), crises: cr(hall), lines: [...new Set(hall.map((r) => (r.tip || '').replace(r.ruler, 'X')))] };
out['hall under occupation'] = hall.filter((r) => r.st.includes('occupied')).length;
out['hall under infiltration'] = hall.filter((r) => r.st.includes('infiltrated')).length;
out.stability = all('stability').map((r) => `${r.seed}: ${r.base} -> ${r.tip} (${r.readiness})`);
out.conflict = all('conflict').map((r) => `${r.seed}: ${String(r.base).slice(0, 50)}... -> ${r.tip}`);
const inn = all('inn'); const moved = inn.filter((r) => r.imp !== r.baseImp);
out.inn = { keepers: inn.length, moved: moved.length, sizes: sz(moved), crises: cr(moved), behaviours: moved.reduce((a, r) => ((a[r.beh] = (a[r.beh] || 0) + 1), a), {}),
  siegeSecrets: inn.filter((r) => (r.crisisKinds || []).includes('under_siege') && /coach|travellers|road/.test(r.secret || '')).map((r) => `${r.seed}: ${r.secret}`) };
console.log(JSON.stringify(out, null, 1));
