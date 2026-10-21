// D-CH-PD-r1 probe: the RE-DERIVED sworn lean (RULINGS-P6 §F.1) against the skeptic's
// test (skeptic/CH-PD-r1-probe/lean.out.txt). Master's own deityAxes.js is imported
// read-only from the detached worktree; RN §6.2's lens one is restated HERE ONLY as the
// probe's model of RN's export (the volume never restates it).
//   align = 1 + W   * m_A'    m_A  = lensOne(god with aggr 1/2, face) / ((a+b)/2)
//                              m_A' = (1-mu)*m_A + mu*ally  (lens two, target-dependent rows; ally = +1 own creed helped, -1 hurt; no tie => m_A)
//   bold  = 1 + W/2 * sgn(force01 - 1/2) * TEMPER_SIGN[deityTemper(god)]   (warlike +1, neutral 0, peacelike -1)
//   act   = align * bold;   commit = 1 + W * (2*lawfulness01 - 1)
import { evil01, chaos01, deityTemper } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/worldPulse/deityAxes.js';
import { writeFileSync } from 'node:fs';
const a = 1.0, b = 0.5, c = 0.4, W = 0.10, MU = 0.5, SHAME = -0.5;
const MAXA = (a + b) / 2;
const TS = { warlike: 1, neutral: 0, peacelike: -1 };
const lensOne = (g, f, aggr01) => {
  const K = f.k > 0.5 ? Math.max(0, 1 - 2 * g.mal) : 1 - 2 * g.mal;
  return a * (f.k - 0.5) * K + b * (f.l - 0.5) * (2 * g.law - 1) + c * (f.f - 0.5) * (2 * aggr01 - 1);
};
const sgn = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
// CH §2.2b faces the lean reads (exertion by domain x side; duel_won; hunt_won). td = target-dependent (lens two).
const faces = {
  'faith/champion (saint, own creed)': { k: .70, l: .55, f: .40, ex: 1, td: +1 },
  'faith/villain (heretic, not its god)': { k: .30, l: .35, f: .55, ex: 1, td: 0 },
  'faith/villain (FALLEN: against its own god)': { k: .30, l: .35, f: .55, ex: 1, td: -1 },
  'health/champion': { k: .90, l: .50, f: .40, ex: 1 }, 'health/villain (plaguebearer)': { k: .10, l: .30, f: .60, ex: 1 },
  'order/champion': { k: .70, l: .75, f: .40, ex: 1 }, 'order/villain': { k: .30, l: .20, f: .70, ex: 1 },
  'wildland/champion': { k: .70, l: .50, f: .50, ex: 1 }, 'wildland/villain': { k: .15, l: .30, f: .75, ex: 1 },
  'trade/champion': { k: .65, l: .55, f: .40, ex: 1 }, 'trade/villain': { k: .30, l: .40, f: .50, ex: 1 },
  'diplomacy/champion': { k: .70, l: .60, f: .30, ex: 1 }, 'diplomacy/villain': { k: .30, l: .40, f: .75, ex: 1 },
  'war/champion': { k: .65, l: .55, f: .60, ex: 1, war: 1 }, 'war/villain': { k: .25, l: .40, f: .85, ex: 1, war: 1 },
  'information/champion': { k: .50, l: .50, f: .40, ex: 1 }, 'information/villain (false reports)': { k: .30, l: .25, f: .50, ex: 1 },
  'duel_won/champion (pursue_nemesis)': { k: .70, l: .55, f: .60, war: 1 }, 'duel_won/villain': { k: .30, l: .40, f: .65, war: 1 },
  'hunt_won/gang-beast': { k: .70, l: .65, f: .65, war: 1 },
  'hunt_won/conclave (not its flock)': { k: .40, l: .60, f: .70, war: 1, td: 0 },
  'hunt_won/conclave (ITS OWN flock)': { k: .40, l: .60, f: .70, war: 1, td: -1 },
};
const gods = [];
for (const al of ['good', 'neutral', 'evil']) for (const lw of ['lawful', 'neutral', 'chaotic']) for (const at of [undefined, 'warlike', 'peacelike', 'neutral']) {
  const e = { alignmentAxis: al, lawAxis: lw, ...(at ? { authoredTemper: at } : {}) };
  const temper = deityTemper(e);
  gods.push({ al, lw, at: at || 'derived', name: `${al}/${lw}/${at ? 'auth:' + at : 'derived'}`, temper, law: 1 - chaos01(e), mal: evil01(e) });
}
const lean = (g, f) => {
  const mA = lensOne(g, f, 0.5) / MAXA;
  const mAx = f.td ? (1 - MU) * mA + MU * f.td : mA;
  const align = 1 + W * mAx;
  const bold = 1 + (W / 2) * sgn(f.f - 0.5) * TS[g.temper];
  return { mA, mAx, align, bold, act: align * bold, commit: 1 + W * (2 * g.law - 1) };
};
// V-CH-PD-r1: S68 (i) read literally over the 36-god grid INCLUDING the derived arm:
// "every one-step change of malice, of law or of an authored temper moves `act` the way the face's coordinate says, or not at all".
const ord = { al: ['good', 'neutral', 'evil'], lw: ['lawful', 'neutral', 'chaotic'] };
const sgn2 = (x) => (x > 1e-12 ? 1 : x < -1e-12 ? -1 : 0);
const fails = [];
for (const [fn, f] of Object.entries(faces)) for (const g of gods) {
  const i = ord.al.indexOf(g.al); if (i >= 2) continue;
  const h = gods.find((x) => x.al === ord.al[i + 1] && x.lw === g.lw && x.at === g.at);
  const d = lean(h, f).act - lean(g, f).act;
  // the face's kind coordinate says: more malice => a kind act (k>1/2) no easier; a cruel act (k<1/2) no harder
  const ok = f.k > 0.5 ? sgn2(d) <= 0 : f.k < 0.5 ? sgn2(d) >= 0 : true;
  if (!ok) fails.push(`${fn} | ${g.name} -> ${h.name} | act ${lean(g, f).act.toFixed(4)} -> ${lean(h, f).act.toFixed(4)} (temper ${g.temper} -> ${h.temper})`);
}
console.log(`S68(i) literal over the derived + authored grid: ${fails.length} one-step malice changes move act AGAINST the face's kind coordinate`);
for (const s of fails) console.log('  ' + s);
// the two pins side by side on the war champion (kind face k .65)
const wc = faces['war/champion'];
const G = (n) => gods.find((x) => x.name === n);
console.log(`war/champion: good/lawful/derived ${lean(G('good/lawful/derived'), wc).act.toFixed(4)} · neutral/lawful/derived ${lean(G('neutral/lawful/derived'), wc).act.toFixed(4)} · evil/lawful/derived ${lean(G('evil/lawful/derived'), wc).act.toFixed(4)}`);
