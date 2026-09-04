// VOICECURE probe — read-only measurement + behaviour capture.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const { scanJsxTree } = await import(join(ROOT, 'tests/helpers/jsxLiteralWalk.js'));
const { deriveGranaryOutlook } = await import(join(ROOT, 'src/domain/display/dossierViewModel.js'));

// ── Tier 3 (JSX) ────────────────────────────────────────────────────────────
const JSX = scanJsxTree(join(ROOT, 'src'), ROOT);
const cur = {};
for (const { rel, strings } of JSX) {
  let em = 0, bang = 0;
  for (const t of strings) { em += (t.match(/—/g) || []).length; bang += (t.match(/!/g) || []).length; }
  if (em > 0 || bang > 0) cur[rel] = { em, bang };
}
const base = JSON.parse(readFileSync(join(ROOT, 'tests/copy/.voice-mechanics-jsx-baseline.json'), 'utf8'));
const diffs = [];
for (const k of [...new Set([...Object.keys(base), ...Object.keys(cur)])].sort()) {
  const b = base[k] || { em: 0, bang: 0 }; const c = cur[k] || { em: 0, bang: 0 };
  if (b.em !== c.em || b.bang !== c.bang) diffs.push({ k, b, c });
}
const emSum = diffs.reduce((s, d) => s + d.c.em, 0);
const bangSum = diffs.reduce((s, d) => s + d.c.bang, 0);
const repoTotal = Object.values(cur).reduce((s, c) => s + c.em, 0);
const repoBang = Object.values(cur).reduce((s, c) => s + c.bang, 0);

// ── Tier 2 (string literals) for dossierViewModel.js ────────────────────────
function stringLiteralContents(src) {
  const out = []; let i = 0; const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    if (c === "'" || c === '"') { const q = c; let buf = ''; i++; while (i < n && src[i] !== q) { if (src[i] === '\\') { buf += src[i + 1] ?? ''; i += 2; continue; } buf += src[i]; i++; } i++; out.push(buf); continue; }
    if (c === '`') { let buf = ''; i++; while (i < n && src[i] !== '`') { if (src[i] === '\\') { buf += src[i + 1] ?? ''; i += 2; continue; } if (src[i] === '$' && src[i + 1] === '{') { i += 2; let d = 1; while (i < n && d > 0) { if (src[i] === '{') d++; else if (src[i] === '}') d--; i++; } buf += ' '; continue; } buf += src[i]; i++; } i++; out.push(buf); continue; }
    i++;
  }
  return out;
}
const dvmSrc = readFileSync(join(ROOT, 'src/domain/display/dossierViewModel.js'), 'utf8');
const dvmLits = stringLiteralContents(dvmSrc);
const dvmEm = dvmLits.reduce((s, t) => s + ((t.match(/—/g) || []).length), 0);
const dvmBang = dvmLits.reduce((s, t) => s + ((t.match(/!/g) || []).length), 0);

// ── BEHAVIOUR CAPTURE: deriveGranaryOutlook over a matrix ───────────────────
const mk = (patch = {}, fsPatch = {}) => ({
  economicState: { foodSecurity: { deficitPct: 5, storageMonths: 1.3, ...fsPatch,
    stockpile: { capacityMonths: 5, reliefPct: 0, season: 'winter', seasonWeek: 44, seasonalSwingPct: -19.4, seasonalEvent: null, ...patch } } },
});
const CASES = {
  'unavailable-null': null,
  'unavailable-empty': { economicState: { foodSecurity: {} } },
  'unavailable-noseason': { economicState: { foodSecurity: { stockpile: { capacityMonths: 5, blockaded: false } } } },
  'winter-thin-nodraw': mk(),
  'spring-welstocked': mk({ season: 'spring', seasonWeek: 3 }, { storageMonths: 4.6 }),
  'summer-stocked-draw': mk({ season: 'summer', seasonWeek: 20, reliefPct: 20 }, { storageMonths: 2.2 }),
  'autumn-spent': mk({ season: 'autumn', seasonWeek: 30, reliefPct: 20 }, { storageMonths: 0 }),
  'hard_winter': mk({ seasonalEvent: 'hard_winter' }),
  'drought': mk({ seasonalEvent: 'drought' }),
  'bountiful-draw': mk({ seasonalEvent: 'bountiful', reliefPct: 40 }, { storageMonths: 3 }),
  'nearly-empty': mk({}, { storageMonths: 0.2 }),
  'zero-capacity': mk({ capacityMonths: 0 }),
  'unknown-season-key': mk({ season: 'monsoon' }),
  'beyond-the-year': mk({ reliefPct: 1 }, { storageMonths: 4.9 }),
};
const behaviour = {};
for (const [name, s] of Object.entries(CASES)) {
  const o = deriveGranaryOutlook(s);
  const d = o.display;
  behaviour[name] = {
    out: o,
    // what the JSX does TODAY (the split), computed from display:
    tileValue_viaSplit: d == null ? null : d.split(' — ')[0],
    tileSub_viaSplit: d == null ? null : d.split(' — ').slice(1).join(' — '),
    // what the JSX will do AFTER (the exposed parts); undefined pre-edit:
    tileValue_viaField: o.seasonTitle,
    tileSub_viaField: o.detail,
  };
}

console.log(JSON.stringify({
  tier3: { diffFiles: diffs.length, emSum, bangSum, repoTotalEm: repoTotal, repoTotalBang: repoBang,
           diffs: diffs.map((d) => `${d.k}: baseline em:${d.b.em} bang:${d.b.bang} -> current em:${d.c.em} bang:${d.c.bang}`) },
  tier2_dossierViewModel: { em: dvmEm, bang: dvmBang },
  behaviour,
}, null, 1));
