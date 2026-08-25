/**
 * regI1-i6corpus.mjs — lane REG-I1 · THE OWED i6 RE-RUN (REG-4 receipt §6 item 5).
 *
 * REG-4 deferred i5 and i6 with a stated reason and named them "the first thing a successor
 * should run". This is that run, for i6.
 *
 * ⭐⭐ WHY i6 MOVES AND i6 ALONE AMONG THE GEOMETRY INSTRUMENTS. L-REG-30 (the minimum-footprint
 * law) SUPPRESSES DRAWN BODIES — it fuses a sub-minimum body into a neighbour, clamps it up to
 * the floor, or drops it. F3 is `MASSES / INTRAMURAL BUILDING-INK AREA`: a law that removes
 * bodies moves the numerator directly, and (because a clamp ADDS ink while a drop REMOVES it)
 * moves the denominator in a direction nobody can predict from the rule alone. That is precisely
 * the quantity REG-4 said "genuinely should move".
 *
 * ⚠ THE PROTOCOL IS run-baselines.mjs's OWN, RE-USED VERBATIM so the numbers are comparable:
 *   · the leaf's own party-gap-resolving grid (`resolvedGrid(plotFrontage)`), never a fixed N
 *   · `plotFrontage` read off the render's OWN manifest, never re-derived here
 *   · the model's own circuit from `renders/circuits/<key>.json` where the leaf has one
 *   · one SUBPROCESS per leaf per arm — 36 masks at 6,200 in one heap is how a recorder dies
 *     half-written (run-baselines.mjs's own recorded reason)
 *
 * ⚠⚠ THE CIRCUIT IS THE **BASE** CIRCUIT ON BOTH ARMS, DELIBERATELY, and the script PROVES the
 * choice is safe rather than assuming it: `--checkcircuit` rebuilds the circuit under all five
 * wave flags and reports, per leaf, whether one vertex moved. A denominator that changes with
 * the arm would make the delta a comparison of two different questions.
 *
 * Usage: node regI1-i6corpus.mjs [--base=renders/regI1-base] [--armed=renders/regI1-all]
 *                                [--leaves=town,city] [--json=out/regI1-i6corpus.json]
 *        node regI1-i6corpus.mjs --checkcircuit --wt=<worktree>
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const pct = (x, y) => (y ? Math.round(((x - y) / y) * 1000) / 10 : null);

const BASE = arg('base', `${HERE}/renders/regI1-base`);
const ARMED = arg('armed', `${HERE}/renders/regI1-all`);
const ONLY = arg('leaves', null);
const TMP = '/tmp/.regI1-i6.json';

/** one leaf, one arm, in its own subprocess — the recorded figure comes from a re-runnable line */
const i6Leaf = (svg, frontage, circuit) => {
  const a = ['--max-old-space-size=12000', `${HERE}/i6-frontage.mjs`, `--svg=${svg}`, `--frontage=${frontage}`, `--json=${TMP}`];
  if (circuit) a.push(`--circuit=${circuit}`);
  execFileSync('node', a, { stdio: ['ignore', 'ignore', 'inherit'] });
  return JSON.parse(readFileSync(TMP, 'utf8'));
};

if (process.argv.includes('--checkcircuit')) {
  /* ⭐ THE DENOMINATOR CONTROL. REG-2 folded the band regime INTO the existing `wallForm` declared
   * input rather than adding a key, precisely so no dormant hash would move — but ARMED that same
   * fold is a new hash input, so the armed circuit COULD differ. Measured rather than argued. */
  const WT = arg('wt', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/laneREG4-tree');
  const { buildOne, CORPUS } = await import(`${WT}/harness/exemplars.mjs`);
  const circuitOf = (f) => {
    const w = (f.walls || []).find((x) => x.kind !== 'old-core') || (f.walls || [])[0];
    const p = w ? (w.closedPolygon && w.closedPolygon.length > 2 ? w.closedPolygon : w.polygon) : null;
    return p && p.length > 2 ? p : null;
  };
  const ARMS = { frontageFusion: true, rampart: true, shapeCode: true, marketRegister: true, minFootprint: true };
  let walled = 0, moved = 0;
  process.stdout.write('── CIRCUIT CONTROL · does arming move the ring the F3 denominator is measured inside?\n');
  for (const spec of CORPUS) {
    const b = circuitOf(buildOne(spec, {}).fabric);
    const a = circuitOf(buildOne(spec, { ...ARMS }).fabric);
    if (!b && !a) { process.stdout.write(`   ${spec.key.padEnd(13)} unwalled — no circuit either arm\n`); continue; }
    walled++;
    const same = b && a && b.length === a.length && b.every((p, i) => p[0] === a[i][0] && p[1] === a[i][1]);
    if (!same) moved++;
    let worst = 0;
    if (b && a && b.length === a.length) for (let i = 0; i < b.length; i++) worst = Math.max(worst, Math.hypot(b[i][0] - a[i][0], b[i][1] - a[i][1]));
    process.stdout.write(`   ${spec.key.padEnd(13)} verts ${String(b ? b.length : 0).padStart(4)}→${String(a ? a.length : 0).padStart(4)}  ${same ? 'IDENTICAL' : `MOVED (worst vertex ${Math.round(worst * 1000) / 1000} u)`}\n`);
  }
  process.stdout.write(`\nCIRCUIT_CONTROL walled=${walled} moved=${moved} — ${moved === 0 ? 'the base circuit is lawful on BOTH arms' : '⛔ the denominator is arm-dependent; read the deltas with that in hand'}\n`);
} else {
  const manifest = JSON.parse(readFileSync(`${BASE}/manifest.json`, 'utf8'));
  const keep = ONLY ? new Set(ONLY.split(',')) : null;
  const rows = [];
  process.stdout.write('── i6 · F3 FREESTANDING MASS DENSITY INTRAMUROS · BASE vs ALL WAVES ARMED, at the REG-4 seal\n');
  process.stdout.write('   (all five flags: --fuse --rampart --shapes --market --footprint)\n\n');
  for (const m of manifest) {
    if (keep && !keep.has(m.key)) continue;
    const circ = existsSync(`${HERE}/renders/circuits/${m.key}.json`) ? `${HERE}/renders/circuits/${m.key}.json` : null;
    const b = i6Leaf(`${BASE}/${m.file}`, m.plotFrontage, circ);
    const a = i6Leaf(`${ARMED}/${m.file}`, m.plotFrontage, circ);
    const row = {
      leaf: m.key, tier: m.tier, frontage: m.plotFrontage, grid: b.grid,
      scope: b.F3.scope, circuitFromModel: b.F3.circuitFromModel,
      base: b.F3, armed: a.F3,
      baseF1F2: b.F1F2_base, armedF1F2: a.F1F2_base,
      delta: {
        freestandingDensityPct: pct(a.F3.freestandingDensity, b.F3.freestandingDensity),
        massesPct: pct(a.F3.masses, b.F3.masses),
        inkAreaPct: pct(a.F3.intramuralInkAreaUnits2, b.F3.intramuralInkAreaUnits2),
        drawnBodiesPct: pct(a.F3.intramuralBodies, b.F3.intramuralBodies),
        meanFootprintPct: pct(a.F3.meanMassFootprintUnits2, b.F3.meanMassFootprintUnits2),
        meanRunPct: pct(a.F1F2_base.meanRunUnits, b.F1F2_base.meanRunUnits),
      },
    };
    rows.push(row);
    process.stdout.write(`  ${m.key.padEnd(13)} N=${String(b.grid).padEnd(5)} density ${b.F3.freestandingDensity} → ${a.F3.freestandingDensity} (${row.delta.freestandingDensityPct}%)`
      + `  masses ${b.F3.masses}→${a.F3.masses} (${row.delta.massesPct}%)`
      + `  ink ${b.F3.intramuralInkAreaUnits2}→${a.F3.intramuralInkAreaUnits2} (${row.delta.inkAreaPct}%)`
      + `  meanFootprint ${b.F3.meanMassFootprintUnits2}→${a.F3.meanMassFootprintUnits2} (${row.delta.meanFootprintPct}%)\n`);
  }
  /* reconcile against the RECORDED baseline so a moved BASE column is caught rather than assumed away */
  let recon = null;
  if (existsSync(`${HERE}/out/baselines.json`)) {
    const B = JSON.parse(readFileSync(`${HERE}/out/baselines.json`, 'utf8'));
    const by = new Map((B.i6Corpus?.rows || []).map((r) => [r.leaf, r]));
    const bad = [];
    for (const r of rows) {
      const old = by.get(r.leaf);
      if (!old) { bad.push({ leaf: r.leaf, why: 'no recorded baseline row' }); continue; }
      if (old.base.F3.freestandingDensity !== r.base.freestandingDensity || old.base.F3.masses !== r.base.masses) {
        bad.push({ leaf: r.leaf, recordedDensity: old.base.F3.freestandingDensity, nowDensity: r.base.freestandingDensity, recordedMasses: old.base.F3.masses, nowMasses: r.base.masses });
      }
    }
    recon = { checked: rows.length, mismatches: bad };
    process.stdout.write(`\n── BASE-COLUMN RECONCILIATION vs out/baselines.json (recorded at d1b32e339)\n`);
    process.stdout.write(`   ${bad.length === 0 ? `ok     all ${rows.length} BASE rows reproduce the recorded baseline exactly` : `⛔ ${bad.length} BASE rows MOVED: ${JSON.stringify(bad)}`}\n`);
  }
  const json = arg('json', `${HERE}/out/regI1-i6corpus.json`);
  writeFileSync(json, JSON.stringify({
    lane: 'TE-REG-I1',
    subject: 'i6 F3, BASE (unarmed) vs ALL FIVE WAVE FLAGS ARMED, both rendered at the REG-4 seal 7fba086d5',
    f3Formula: 'freestandingDensity = MASSES / INTRAMURAL BUILDING-INK AREA, per 1,000 sq view units',
    declaredShift: 'L-REG-30 suppresses drawn bodies by construction, so F3 MOVES LAWFULLY on the armed arm. The armed figure is a DECLARED INSTRUMENT-BASELINE SHIFT, recorded beside the baseline and never in place of it.',
    circuitNote: 'the BASE circuit is used on both arms; `--checkcircuit` proves it is arm-independent',
    baseRenders: BASE, armedRenders: ARMED, rows, reconciliation: recon,
  }, null, 2));
  process.stdout.write(`\nREGI1_I6 rows=${rows.length} json=${json}\n`);
}
