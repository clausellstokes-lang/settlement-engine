// CH-PD-r1 probe: patronLean's act multiplier over CH §2.2b's registered faces,
// RN §6.2 lens one (a 1.0, b 0.5, c 0.4; K = max(0,1-2m) kind / 1-2m cruel),
// the god's coords per CH §10b (lawfulness = 1 - chaos01, malice = evil01,
// aggr = temper band centre 0.83/0.5/0.17), deriveTemper copied byte-for-byte
// from master deityAxes.js (imported directly from the read-only worktree).
import { evil01, chaos01, deityTemper } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/worldPulse/deityAxes.js';
const a = 1.0, b = 0.5, c = 0.4, W = 0.15, MAX = (a + b + c) / 2;
const T = { warlike: 0.83, neutral: 0.5, peacelike: 0.17 };
const lens = (g, f) => {
  const kindAct = f.k > 0.5;
  const K = kindAct ? Math.max(0, 1 - 2 * g.mal) : 1 - 2 * g.mal;
  return a * (f.k - 0.5) * K + b * (f.l - 0.5) * (2 * g.law - 1) + c * (f.f - 0.5) * (2 * g.aggr - 1);
};
const faces = {
  'faith/champion (saint preaching)': { k: .70, l: .55, f: .40 },
  'faith/villain (heretic)': { k: .30, l: .35, f: .55 },
  'health/champion': { k: .90, l: .50, f: .40 },
  'health/villain (plaguebearer)': { k: .10, l: .30, f: .60 },
  'order/champion': { k: .70, l: .75, f: .40 },
  'order/villain': { k: .30, l: .20, f: .70 },
  'wildland/champion': { k: .70, l: .50, f: .50 },
  'wildland/villain': { k: .15, l: .30, f: .75 },
  'trade/champion': { k: .65, l: .55, f: .40 },
  'trade/villain': { k: .30, l: .40, f: .50 },
  'diplomacy/champion': { k: .70, l: .60, f: .30 },
  'diplomacy/villain': { k: .30, l: .40, f: .75 },
  'war/champion': { k: .65, l: .55, f: .60 },
  'war/villain': { k: .25, l: .40, f: .85 },
  'information/champion': { k: .50, l: .50, f: .40 },
  'information/villain (false reports)': { k: .30, l: .25, f: .50 },
  'duel_won/champion (pursue_nemesis)': { k: .70, l: .55, f: .60 },
  'duel_won/villain': { k: .30, l: .40, f: .65 },
  'hunt_won/gang-beast': { k: .70, l: .65, f: .65 },
  'hunt_won/conclave': { k: .40, l: .60, f: .70 },
};
const gods = [];
for (const al of ['good', 'neutral', 'evil']) for (const lw of ['lawful', 'neutral', 'chaotic']) for (const at of [undefined, 'warlike', 'peacelike', 'neutral']) {
  const e = { alignmentAxis: al, lawAxis: lw, ...(at ? { authoredTemper: at } : {}) };
  gods.push({ name: `${al}/${lw}/${at ? 'auth:' + at : 'derived'}`, temper: deityTemper(e), law: 1 - chaos01(e), mal: evil01(e), aggr: T[deityTemper(e)] });
}
const out = [];
let maxAbs = 0, shameRows = [];
for (const [fn, f] of Object.entries(faces)) for (const g of gods) {
  const m = lens(g, f) / MAX; const act = 1 + W * m;
  maxAbs = Math.max(maxAbs, Math.abs(m));
  if (m <= -0.5) shameRows.push(`${fn} | ${g.name} | m=${m.toFixed(3)}`);
  out.push(`${fn}\t${g.name}\t${g.temper}\tm=${m.toFixed(4)}\tact=${act.toFixed(4)}`);
}
console.log('derived temper by (alignment, law):');
for (const g of gods.filter((x) => x.name.endsWith('derived'))) console.log('  ', g.name, '->', g.temper);
console.log('\nmax |m| over all faces x gods:', maxAbs.toFixed(4), ' => max act deviation', (W * maxAbs).toFixed(4));
console.log('\nrows reaching shame (m <= -0.5):'); for (const r of shameRows) console.log('  ', r);
const pick = (fn, gn) => out.find((r) => r.startsWith(fn + '\t' + gn + '\t'));
console.log('\nselected:');
for (const [fn, gn] of [
  ['war/champion', 'evil/chaotic/derived'], ['war/champion', 'good/lawful/derived'], ['war/champion', 'neutral/neutral/auth:warlike'], ['war/champion', 'good/neutral/auth:warlike'],
  ['war/villain', 'evil/chaotic/derived'], ['duel_won/champion (pursue_nemesis)', 'good/neutral/derived'], ['duel_won/champion (pursue_nemesis)', 'good/lawful/derived'],
  ['health/champion', 'good/neutral/derived'], ['health/champion', 'good/lawful/derived'], ['health/villain (plaguebearer)', 'good/lawful/derived'],
  ['faith/champion (saint preaching)', 'evil/chaotic/derived'], ['faith/champion (saint preaching)', 'evil/lawful/derived'], ['faith/villain (heretic)', 'good/lawful/derived'],
  ['information/villain (false reports)', 'good/lawful/derived'], ['information/villain (false reports)', 'neutral/lawful/derived'],
  ['hunt_won/conclave', 'good/lawful/derived'], ['hunt_won/conclave', 'neutral/lawful/auth:warlike'],
  ['wildland/champion', 'neutral/neutral/auth:warlike'], ['order/champion', 'neutral/neutral/auth:warlike'],
]) console.log('  ', pick(fn, gn));
import { writeFileSync } from 'node:fs';
writeFileSync(new URL('./lean.out.tsv', import.meta.url), out.join('\n') + '\n');
