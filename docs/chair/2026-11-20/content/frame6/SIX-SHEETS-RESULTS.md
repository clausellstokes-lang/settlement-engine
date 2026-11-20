# FRAME-6 · SIX — the six sheets for the owner (results)

Written 2026-11-20T14:43Z (`date -u`) by FRAME-6's measuring builder SIX on `frame6-six` (cut at `9e551cda9`). The brief is `SIX-SHEETS.md`. Measure only: nothing under `src/` or `tests/` changed. The sheets, as plain text, are `SIX-SHEETS.txt` beside this file.

**Trees.** BEFORE = the line, an archive of `43ab0f5eb` (`lane/join-2026-11-14`) with its `package.json`, `node_modules` symlinked. AFTER = the lane tip `9e551cda9`, this worktree's `src/`. Every chosen town was born fresh at each tree by that tree's own generator (`generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} })`). BEFORE = the line's `composeTonightSheet(s)` (it takes no audience). AFTER = the tip's `composeTonightSheet(s, { audience: 'owner' })`. STRANGER = the tip's `composeTonightSheet(s)` (no options). Digest = sha256 of `JSON.stringify(sheet)`, 16 hex.

**The pool.** `frame6/tools/pool.mjs 55` at the tip, read once: **tried 484, calm 330**. The tip's `troubleOfWeight` over it, by opening strain and tier:

| strain | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| none | 55 | 47 | 40 | 48 | 41 | 36 | 267 |
| W1 | 0 | 5 | 14 | 0 | 0 | 0 | 19 |
| W2 | 0 | 0 | 0 | 0 | 7 | 6 | 13 |
| W3 | 0 | 3 | 1 | 5 | 5 | 12 | 26 |
| W4 | 0 | 0 | 0 | 2 | 2 | 1 | 5 |

63 framed (0, 8, 15, 7, 14, 19), 267 without: FRAME-6's count reproduced. The W4 towns are exactly CF12's five.

## The choice

**Three calm** (the tiers thorp, town, metropolis: the smallest, the middle, the largest). In each, the first town by seed index with `troubleOfWeight` null at the tip, then checked on the fresh birth: no trouble at the tip and owner sheet equal to the line's. **No candidate was skipped**: the first unframed town of each tier was equal.

| town | tier | line | tip owner | tip stranger | |
|---|---|---|---|---|---|
| frame-calm-thorp-0 | thorp | `eb85297cfc5b5e59` | `eb85297cfc5b5e59` | `eb85297cfc5b5e59` | EQUAL |
| frame-calm-town-0 | town | `ea7a1e92e52d35da` | `ea7a1e92e52d35da` | `ea7a1e92e52d35da` | EQUAL |
| frame-calm-metropolis-3 | metropolis | `88fda46e2ca6c25c` | `88fda46e2ca6c25c` | `88fda46e2ca6c25c` | EQUAL |

(metropolis-0 and -2 are not in the calm pool (in crisis at birth) and metropolis-1 is framed (W3) at the tip, so metropolis-3 is the first unframed.)

**Three framed.** Picked in the order W4 (the fewest towns), W1, W3: each the first of its strain by tier order (thorp to metropolis), then seed index, in a tier not yet taken, and not in `CF12-SHEETS.txt`. **W4 has no town outside CF12's five** (the five are the pool's only W4), so the W4 town is CF12's first by tier and seed: town-20, as the brief allows.

| town | tier | strain (grade) | opening trouble | why chosen | line | tip owner | tip stranger |
|---|---|---|---|---|---|---|---|
| frame-calm-town-20 | town | W4 (hall-captured) | crime_wave, #0 | the first W4 by tier and seed; no W4 exists outside CF12-SHEETS.txt | `d0d5036ee3166d5d` | `dc5d75f1f61c7494` | `d0d5036ee3166d5d` |
| frame-calm-hamlet-17 | hamlet | W1 (legitimacy-below-45) | succession_crisis, #0 | the first W1 of all (hamlet is the first tier holding one; index 17 its first) | `556fb73fa8d2aebf` | `08004ef0bd3d2701` | `556fb73fa8d2aebf` |
| frame-calm-village-20 | village | W3 (impaired-chain) | resource_scarcity, #1 | the first W3 in a tier not taken (hamlet's W3 is barred: hamlet holds the W1; village-20 is village's only W3) | `ad73a0aee96160eb` | `d49362ceae4298f2` | `ad73a0aee96160eb` |

**The stranger equality: 6 of 6.** In all six towns the tip's sheet for a stranger (no options) equals the BEFORE sheet byte for byte (the tables above).

**Checks.**
- The whole run, executed twice: the digests of both runs are identical (`cmp` of the JSON: equal).
- town-20 cross-read against `frame5/CF12-SHEETS.txt`: its BEFORE and AFTER blocks there and here are the same text line for line (`diff`, with this file's added Facts lines and block header removed). So this printer reproduces CF12's format, and the tip gives CF12's W4 sheet (P1B-F's wording for the outside hand prints as CF12 printed it).
- Format: CF12's; the sheet's `facts` (Food, Defence), which CF12's file did not print, are printed here as "Facts:".

**Seen in the sheets, not built around (for the owner's reading):**
- hamlet-17 (W1): two of the succession crisis's three sides name no one ("Popular candidate", "The Religious Authorities"). The only person to voice is the Headman, now on the seat's side, as he was the BEFORE sheet's only person (at the seat).
- village-20 (W3): the hoarding side's face (Günji Olqunu'ud) prints her secret, not a want, both on the side and among the people to voice.

## The script (`six.mjs`, verbatim)

Run: `node six.mjs <scratch>/pool.json <scratch>/line/src/ <worktree>/src/ SIX-SHEETS.txt six.json 43ab0f5eb 9e551cda9`.

```js
// FRAME-6 · SIX: the six sheets for the owner. Measure only.
// argv: <pool.json (the tip's calm pool, pool.mjs 55)> <line src/> <tip src/> <out sheets.txt> <out six.json> <line sha> <tip sha>
// Chooses from the pool by the tip's troubleOfWeight, births each chosen seed fresh at EACH tree with that tree's own
// generator, composes BEFORE = the line's composeTonightSheet(s) (it takes no audience), AFTER = the tip's
// composeTonightSheet(s, { audience: 'owner' }), STRANGER = the tip's composeTonightSheet(s) (no options).
import fs from 'node:fs'; import crypto from 'node:crypto';
const [POOL, LINE, TIP, OUT_TXT, OUT_JSON, LINE_SHA, TIP_SHA] = process.argv.slice(2);
const load = async (R) => ({
  gen: (await import(R + 'generators/generateSettlementPipeline.js')).generateSettlementPipeline,
  compose: (await import(R + 'domain/summary/tonightSheet.js')).composeTonightSheet,
});
const L = await load(LINE), T = await load(TIP);
const { troubleOfWeight } = await import(TIP + 'domain/tension/troubleCast.js');
const d = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const birth = (G, tier, seed) => G.gen({ settType: tier }, null, { seed, customContent: {} });
const idx = (seed) => Number(seed.split('-').pop());
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CF12 = new Set(['town-20', 'town-80', 'city-12', 'city-14', 'city-49', 'metropolis-51'].map((k) => `frame-calm-${k}`));

const { towns } = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const pool = towns.map(({ seed, tier, s }) => { const top = troubleOfWeight(s); return { seed, tier, top, strain: top ? top.strain.strain : null }; })
  .sort((a, b) => TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier) || idx(a.seed) - idx(b.seed));
const byStrain = {}; for (const t of pool) { const k = `${t.strain || 'none'}|${t.tier}`; byStrain[k] = (byStrain[k] || 0) + 1; }

const sheetsOf = (tier, seed) => {
  const sl = birth(L, tier, seed), st = birth(T, tier, seed);
  const before = L.compose(sl), after = T.compose(st, { audience: 'owner' }), stranger = T.compose(st);
  const top = troubleOfWeight(st);
  return { before, after, stranger, top, dBefore: d(before), dAfter: d(after), dStranger: d(stranger) };
};

// 1. THREE CALM: tiers thorp, town, metropolis (the smallest, the middle, the largest); in each, the first town by
// seed index with no trouble of weight at the tip whose owner sheet at the tip equals the line's byte for byte.
const calm = [], calmLog = [];
for (const tier of ['thorp', 'town', 'metropolis']) {
  for (const t of pool.filter((x) => x.tier === tier && !x.strain)) {
    const r = sheetsOf(tier, t.seed);
    if (r.top) { calmLog.push(`${t.seed}: fresh birth reads a trouble at the tip (pool said none)`); continue; }
    if (r.dAfter !== r.dBefore) { calmLog.push(`${t.seed}: owner ${r.dAfter} != line ${r.dBefore}, skipped`); continue; }
    calm.push({ seed: t.seed, tier, ...r }); break;
  }
}

// 2. THREE FRAMED: W4 first (the fewest towns), then W1, then W3; each the first of its strain by tier order then seed
// index, in a tier not yet taken, and not in CF12-SHEETS.txt (W4 falls back to CF12's five only when no other W4 exists).
const framed = [], used = new Set();
for (const strain of ['W4', 'W1', 'W3']) {
  const all = pool.filter((x) => x.strain === strain && !used.has(x.tier));
  const fresh = all.filter((x) => !CF12.has(x.seed));
  const pick = fresh[0] || (strain === 'W4' ? all[0] : null);
  if (!pick) { framed.push({ strain, missing: true }); continue; }
  used.add(pick.tier);
  framed.push({ strain, seed: pick.seed, tier: pick.tier, inCF12: CF12.has(pick.seed), otherW4: strain === 'W4' ? fresh.length : undefined, ...sheetsOf(pick.tier, pick.seed) });
}

// THE PRINTER: CF12's format. Sides 'words: who — why. Wants…'; people 'name · role [why: side] — reason — line';
// hooks with their source in parentheses.
const cap = (x) => (x ? x[0].toUpperCase() + x.slice(1) : x);
const said = (p) => (p.sameAs ? `(wants the same as ${p.sameAs})` : p.says === 'want' && p.line ? `Wants to ${p.line}` : p.line);
const end = (x) => (/[.!?]$/.test(x) ? x : `${x}.`);
const print = (sh) => {
  const o = [`Opening: ${sh.opening}`];
  if (sh.crisis) o.push(`Crisis: ${sh.crisis.type}`);
  if (sh.frame) {
    o.push(`The trouble: ${sh.frame.name}`, 'Its three sides:');
    for (const s of sh.frame.sides) {
      if (s.name) o.push(`  - ${s.words}: ${s.name}${s.role ? ` · ${s.role}` : ''} — ${end(cap(s.reason))}${said(s) ? ` ${said(s)}` : ''}`);
      else if (s.reason) o.push(`  - ${s.words}: (no one named) — ${end(cap(s.reason))}`);
      else o.push(`  - ${s.words}: (no one named)`);
    }
    o.push("  The trouble's own hooks:", ...sh.frame.hooks.map((h) => `    * ${h}`));
  }
  o.push('People to voice:');
  for (const p of sh.people) {
    const why = p.why === 'side' ? `side: ${p.side}` : p.why;
    o.push(`  - ${p.name}${p.role ? ` · ${p.role}` : ''} [${why}]${p.reason ? ` — ${p.reason}` : ''} — ${said(p)}`);
  }
  if (sh.facts.length) o.push('Facts:', ...sh.facts.map((f) => `  ${f.label}: ${f.text}`));
  o.push('Hooks:', ...sh.hooks.map((h) => `  * ${h.text} (${h.source})`));
  return o.join('\n');
};

const out = [
  `FRAME-6 · SIX — the six sheets for the owner: three CALM towns whose owner sheet at the tip is byte-identical to the line's, and three FRAMED towns (W1 seat, W3 material, W4 hall-captured) before and after, as plain text.`,
  `BEFORE = today's line, an archive of ${LINE_SHA} (lane/join-2026-11-14; no frame code), its composeTonightSheet(s) (it takes no audience). AFTER = the lane tip ${TIP_SHA}, composeTonightSheet(s, { audience: 'owner' }).`,
  `Each town born fresh at each tree by that tree's own generator: generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} }). Digests: sha256 of the composed sheet's JSON, 16 hex.`,
  `A STRANGER (the tip, no options) gets the BEFORE sheet byte for byte in every town below (the digests are printed per town).`,
  `Format: each side is 'words: who — why. Wants…'; each person to voice is 'name · role [why: side] — reason — line'; each hook ends with its source in parentheses.`,
  '',
  '##### THE THREE CALM SHEETS (no trouble of weight at the tip; the owner sheet at the tip = the line\'s, printed once)',
];
for (const c of calm) {
  out.push('', `=== ${c.seed} (${c.tier}) — calm`, `--- digests: line ${c.dBefore} · tip owner ${c.dAfter} · tip stranger ${c.dStranger} — ${c.dBefore === c.dAfter ? 'EQUAL' : 'DIFFER'}`, '--- THE SHEET (line = tip owner = tip stranger)', print(c.after));
}
out.push('', '##### THE THREE FRAMED SHEETS (before: the line; after: the tip, the owner)');
for (const f of framed) {
  if (f.missing) { out.push('', `=== ${f.strain}: no town in the pool`); continue; }
  out.push('', `=== ${f.seed} (${f.tier}) — ${f.strain} ${f.top?.strain.grade}, opening on ${f.top?.tension.type} at #${f.top?.at}`,
    `--- digests: line ${f.dBefore} · tip owner ${f.dAfter} · tip stranger ${f.dStranger} (stranger ${f.dStranger === f.dBefore ? '= line' : '!= LINE'})`,
    '--- BEFORE (the line, today\'s owner sheet)', print(f.before), '--- AFTER (the tip, the owner)', print(f.after));
}
fs.writeFileSync(OUT_TXT, out.join('\n') + '\n');
const brief = (x) => x.missing ? x : ({ seed: x.seed, tier: x.tier, strain: x.strain || null, grade: x.top?.strain.grade || null, opening: x.top?.tension.type || null, top: x.top ? { strain: x.top.strain, at: x.top.at, tension: x.top.tension.type } : null, inCF12: x.inCF12, otherW4: x.otherW4, dBefore: x.dBefore, dAfter: x.dAfter, dStranger: x.dStranger, ownerEqualsLine: x.dBefore === x.dAfter, strangerEqualsLine: x.dStranger === x.dBefore });
fs.writeFileSync(OUT_JSON, JSON.stringify({ byStrain, calmLog, calm: calm.map(brief), framed: framed.map(brief) }, null, 1));
console.log(JSON.stringify({ byStrain, calmLog, calm: calm.map(brief), framed: framed.map(brief) }, null, 1));
```
