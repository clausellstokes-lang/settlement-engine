// Magic notes: the tradition behind the note, the premise (depleted ground, herd, forest, fish...), the chain it sits on.
const { lines, ctxOf, roster } = require('./ctx.js');
const fams = new Set(lines.filter((r) => /^Economic Flows: (Druid|Arcane|Blessed|Sacred|Temple|Conjured)/.test(r.fam)).map((r) => r.fam));
const out = {};
for (const r of lines) {
  if (!fams.has(r.fam)) continue;
  const c = ctxOf(r); const rc = c.rchain, t = c.lv.traditions, R = c.R;
  if (!rc) { console.log("NOCHAIN", r.seed, r.line, c.where, c.card && c.card.kind, c.card && c.card.header); continue; }
  const trad = /Druid/.test(r.line) ? (t.hasDruid ? 'druid' : 'NO-DRUID') : /Arcane|Conjured/.test(r.line) ? (t.hasArcane || t.hasArcaneGuild ? 'arcane' : 'NO-ARCANE') : /Blessed|divine|Temple|Sacred/.test(r.line) ? (t.hasDivine ? 'divine' : 'NO-DIVINE') : '?';
  const dep = rc.resourceDepleted || rc.resourceCondition === 'depleted' || rc.resourceInputCondition === 'depleted';
  const k = `${trad} chain=${rc.chainId} in=${rc.resourceInputKey} cond=${rc.resourceCondition}/${rc.resourceInputCondition} depl=${!!dep} subst=${rc.substituteActive} chip=${c.card.chip} magic=${R.config.magicExists}`;
  const f = (out[r.fam] = out[r.fam] || {}); (f[k] = f[k] || []).push(r.seed);
}
for (const [fam, f] of Object.entries(out)) { console.log('##', fam); for (const [k, v] of Object.entries(f).sort((a, b) => b[1].length - a[1].length)) console.log('   ', v.length, k, v.slice(0, 3).join(' ')); }
