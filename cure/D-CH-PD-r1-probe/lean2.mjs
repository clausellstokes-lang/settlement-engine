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
const rows = []; const out = [];
for (const [fn, f] of Object.entries(faces)) for (const g of gods) { const r = lean(g, f); rows.push({ fn, f, g, ...r }); out.push([fn, g.name, g.temper, r.mAx.toFixed(4), r.align.toFixed(4), r.bold.toFixed(4), r.act.toFixed(4)].join('\t')); }
writeFileSync(new URL('./lean2.out.tsv', import.meta.url), 'face\tgod\ttemper\tm_A\'\talign\tbold\tact\n' + out.join('\n') + '\n');
const say = (s) => console.log(s);
const get = (fn, gn) => rows.find((r) => r.fn === fn && r.g.name === gn);
say(`W=${W} (alignment half and law half), W/2=${W / 2} (boldness half), mu=${MU}, shame bar m_A' <= ${SHAME}`);
// T1 — the chair's test: the skeptic's selected war rows, re-run.
say('\nT1 the skeptic\'s rows (old act -> new act):');
for (const [fn, gn, old] of [['war/champion', 'evil/chaotic/derived', '1.0002'], ['war/champion', 'good/lawful/derived', '1.0235'], ['war/champion', 'neutral/neutral/auth:warlike', '1.0042'], ['duel_won/champion (pursue_nemesis)', 'good/lawful/derived', '1.0314'], ['faith/champion (saint, own creed)', 'evil/chaotic/derived', '0.9919'], ['order/champion', 'neutral/neutral/auth:warlike', '0.9958'], ['health/champion', 'good/lawful/derived', '1.0673']]) {
  const r = get(fn, gn); say(`   ${fn} | ${gn} (${r.g.temper}) | ${old} -> ${r.act.toFixed(4)}`);
}
const T1 = get('war/champion', 'evil/chaotic/derived').act > get('war/champion', 'good/lawful/derived').act;
say(`   T1 warlike-derived war champion > peacelike-derived: ${T1}`);
// T1b — every war deed: every warlike god (derived or authored) > every peacelike god.
let warFails = [];
for (const [fn, f] of Object.entries(faces)) { if (!f.war) continue;
  const W_ = rows.filter((r) => r.fn === fn && r.g.temper === 'warlike'), P_ = rows.filter((r) => r.fn === fn && r.g.temper === 'peacelike');
  const minW = Math.min(...W_.map((r) => r.act)), maxP = Math.max(...P_.map((r) => r.act));
  say(`   war deed ${fn}: min act over warlike gods ${minW.toFixed(4)} vs max over peacelike ${maxP.toFixed(4)}`); if (!(minW > maxP)) warFails.push(fn); }
say(`T1b every war deed, every warlike god > every peacelike god: ${warFails.length === 0} ${warFails.join(',')}`);
// T2 — monotone per coordinate: gods differing in ONE coordinate.
const ord = { al: ['good', 'neutral', 'evil'], lw: ['lawful', 'neutral', 'chaotic'] }; let monoFails = [];
for (const [fn, f] of Object.entries(faces)) {
  for (const g of gods) {
    // malice step (good->neutral->evil), same law, same temper arm only where the arm is AUTHORED (derived tempers move with alignment)
    const i = ord.al.indexOf(g.al); if (i < 2 && g.at !== 'derived') { const h = gods.find((x) => x.al === ord.al[i + 1] && x.lw === g.lw && x.at === g.at);
      const d = get(fn, h.name).align - get(fn, g.name).align; const want = f.k > 0.5 ? (d <= 1e-12) : (d >= -1e-12); if (!want) monoFails.push(`${fn} malice ${g.name}->${h.name} d=${d.toFixed(5)}`); }
    const j = ord.lw.indexOf(g.lw); if (j < 2 && g.at !== 'derived') { const h = gods.find((x) => x.al === g.al && x.lw === ord.lw[j + 1] && x.at === g.at);
      const d = get(fn, h.name).align - get(fn, g.name).align; const want = sgn(-d) === sgn(f.l - 0.5) || Math.abs(d) < 1e-12; if (!want) monoFails.push(`${fn} law ${g.name}->${h.name} d=${d.toFixed(5)}`); }
  }
  for (const al of ord.al) for (const lw of ord.lw) { const t = (at) => get(fn, `${al}/${lw}/auth:${at}`).act; const s = sgn(f.f - 0.5);
    const okT = s > 0 ? (t('warlike') > t('neutral') && t('neutral') > t('peacelike')) : s < 0 ? (t('warlike') < t('neutral') && t('neutral') < t('peacelike')) : (t('warlike') === t('neutral') && t('neutral') === t('peacelike'));
    if (!okT) monoFails.push(`${fn} temper at ${al}/${lw}`); }
}
say(`T2 monotone in each coordinate holding the others (malice, law on the alignment half; temper on act): ${monoFails.length === 0} ${monoFails.slice(0, 5).join(' ; ')}`);
// T3 — the neutral god.
const nn = rows.filter((r) => r.g.al === 'neutral' && r.g.lw === 'neutral');
const nnNoTie = nn.filter((r) => !r.f.td);
say(`T3 neutral/neutral god, no-tie faces: alignment half exactly 1 on every temper arm: ${nnNoTie.every((r) => r.align === 1)}; act exactly 1 when the temper is neutral (derived or authored): ${nnNoTie.filter((r) => r.g.temper === 'neutral').every((r) => r.act === 1)}; commit exactly 1: ${nn.every((r) => r.commit === 1)}`);
say(`   neutral/neutral/auth:warlike leans ONLY through the temper: ${nnNoTie.filter((r) => r.g.at === 'warlike').map((r) => `${r.fn.split(' ')[0]} ${r.act.toFixed(3)}`).slice(0, 6).join(' · ')}`);
say(`   neutral/neutral god, own-creed tie rows (lens two only): ${nn.filter((r) => r.f.td && r.g.temper === 'neutral').map((r) => `${r.fn} align ${r.align.toFixed(3)}`).filter((v, i, A) => A.indexOf(v) === i).join(' · ')}`);
// T4 — the envelope.
const acts = rows.map((r) => r.act), aligns = rows.map((r) => r.align);
say(`T4 envelope by construction: act in [${((1 - W) * (1 - W / 2)).toFixed(4)}, ${((1 + W) * (1 + W / 2)).toFixed(4)}], commit in [${(1 - W).toFixed(2)}, ${(1 + W).toFixed(2)}]; MEASURED over the registered faces x 36 gods: act [${Math.min(...acts).toFixed(4)}, ${Math.max(...acts).toFixed(4)}], alignment half [${Math.min(...aligns).toFixed(4)}, ${Math.max(...aligns).toFixed(4)}]`);
// T5 — shame reach (exertion faces only).
say('T5 exertion rows reaching shame (m_A\' <= -1/2), by face: ');
const byFace = {}; for (const r of rows) if (r.f.ex && r.mAx <= SHAME + 1e-12) (byFace[r.fn] ||= new Set()).add(`${r.g.al}/${r.g.lw}`);
for (const [fn, s] of Object.entries(byFace)) say(`   ${fn}: ${[...s].join(' ')}`);
const fallenGood = rows.filter((r) => r.fn.startsWith('faith/villain (FALLEN') && r.g.al === 'good');
say(`   S65: the fallen saint under EVERY good creed reaches shame: ${fallenGood.every((r) => r.mAx <= SHAME)} (m_A' ${Math.max(...fallenGood.map((r) => r.mAx)).toFixed(3)} at most); its act ${Math.min(...fallenGood.map((r) => r.act)).toFixed(3)}..${Math.max(...fallenGood.map((r) => r.act)).toFixed(3)}`);
// T6 — S62's god: the most opposed reading of the act it pins.
const dv = rows.filter((r) => r.fn === 'duel_won/villain').sort((x, y) => x.act - y.act);
say(`T6 S62 duel_won/villain most opposed: ${dv[0].g.name} act ${dv[0].act.toFixed(4)}; good/lawful/derived act ${get('duel_won/villain', 'good/lawful/derived').act.toFixed(4)}`);
// T7 — a saint preaching its own god vs a heretic of no tie (r1-3).
say(`T7 saint of an evil creed preaching its own god: act ${get('faith/champion (saint, own creed)', 'evil/chaotic/derived').act.toFixed(4)} (align ${get('faith/champion (saint, own creed)', 'evil/chaotic/derived').align.toFixed(4)}) — was 0.9919`);
say(`   conclave hunt of its OWN god's flock vs another flock, good/lawful/derived: ${get('hunt_won/conclave (ITS OWN flock)', 'good/lawful/derived').act.toFixed(4)} vs ${get('hunt_won/conclave (not its flock)', 'good/lawful/derived').act.toFixed(4)}`);
