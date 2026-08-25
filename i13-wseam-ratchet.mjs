/**
 * i13-wseam-ratchet.mjs — REG-I0 · INSTRUMENT 13 · ⛔ THE WATER-TRUTH AGREEMENT RATCHET.
 *
 * Built by CAR-INSTRUMENTS on the chair's mid-flight addendum (ODQ §660) from CAR-MEASURES'
 * landed TE-WSEAM measure. That lane's own cure table ranks this instrument FIRST of the
 * non-gated options and says why (`laneMEASURES-receipt.md` §6.7, row 4, verbatim):
 *
 *     "THE AGREEMENT RATCHET (structural prevention). An only-shrinks test pinning corpus
 *      agreement inside the drawn river (2.63 %) and DRAWN∧¬SUB (208,644 u²), so the figure
 *      cannot silently worsen and, once a cure lands, cannot regress. ... DO NOW — land before
 *      1 or 2."
 *
 * ═══════════════ WHAT IS BEING PINNED, AND THE NAMES KEPT STRAIGHT ═══════════════
 * Two surfaces both answer "is this point water" and nothing makes them agree: the DRAWN
 * watercourse (the `fill="#8d999d"` path in the armed SVG — the artifact, not a predicate) and
 * `sub.wet > REFUSAL.standingWater` (0.64), the only thing `groundRefusal.refusalAt` consults.
 * THREE figures, and they are three different things:
 *
 *   · AGREEMENT INSIDE THE DRAWN RIVER = both / drawn. **2.63 %** corpus-wide. A FLOOR.
 *   · ⛔ THE PRIMARY CLASS, `DRAWN ∧ ¬SUB` = **208,644 u²** — drawn river the ground law scores
 *     BUILDABLE. This is the dangerous one: it is what puts a body in the water. A CEILING.
 *   · ⚠ THE MIRROR CLASS, `SUB ∧ ¬DRAWN` = **50,444 u²** — ground the law refuses as standing
 *     water with NO water drawn on it, an invisible refusal presenting as a hole in the fabric
 *     with no cause. A CEILING.
 *
 * ⚠⚠ THE ADDENDUM'S TWO FIGURES WERE CROSSED, AND THE RATCHET PINS WHAT THE RECEIPT MEASURED.
 * The chair's note gave the mirror class as 208,644 u² "…verify that second figure against the
 * receipt — it may be 50,444 u²". Verified, and it is the second: `laneMEASURES-receipt.md` §6.2
 * defines the mirror class in its own words —
 *     "MIRROR CLASS: **50,444 u² corpus-wide** the law refuses as standing water with NO water
 *      drawn on it — an invisible refusal."
 * — while 208,644 u² is the row above it, `⛔ DRAWN∧¬SUB`. The receipt's own corpus line carries
 * both and the arithmetic settles it beyond doubt:
 *     "CORPUS  drawn 214269 u²  ·  AGREE 5625 u²  ·  ⛔ DRAWN∧¬SUB 208644 u²  ·  ⚠ SUB∧¬DRAWN 50444 u²"
 * Re-added from the receipt's own nine per-leaf rows: drawn 214,268.8 · AGREE 5,625.1 ·
 * DRAWN∧¬SUB 208,643.8 · SUB∧¬DRAWN 50,444.1, and `drawn = AGREE + DRAWN∧¬SUB` closes exactly
 * (214,268.8 = 5,625.1 + 208,643.8). Both figures are therefore pinned, each under its own name.
 *
 * ═══════════════ THE RATCHET DIRECTION ═══════════════
 * Only-shrinks, in the sense that matters: **agreement may rise and never fall; both wrong-class
 * areas may fall and never rise.** An IMPROVEMENT is not a pass-with-a-shrug — it is reported as
 * a DECLARED SHIFT with the exact re-pin values, because a cure that lands and is never re-pinned
 * leaves the ratchet guarding a floor the code has already cleared.
 *
 * ⚠ PER-LEAF PINS AS WELL AS CORPUS ONES. A corpus total can hold while one leaf collapses —
 * town-2 carries 22.58 % agreement and 28,762 u² of the mirror class on its own, so a corpus-only
 * pin would let the other eight rot behind it.
 *
 * Usage: node i13-wseam-ratchet.mjs [--svg=<armed svg dir>]        ← RE-MEASURES (the real verdict)
 *        node i13-wseam-ratchet.mjs --from=<wseam.json>            ← reads a recorded measurement
 *        node i13-wseam-ratchet.mjs --controls                     ← liveness: perturb, red, restore
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const SP = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad';
const HERE = `${SP}/reg-instruments`;
const CENSUS = `${SP}/measures/wseam/wseamCensus.mjs`;
const RECORDED = `${SP}/measures/wseam/wseam.json`;
const ARMED_SVG = `${SP}/review654/out-armed`;
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };

/**
 * ⭐⭐⭐ THE PINS. Every number below is quoted from `laneMEASURES-receipt.md` §6.2's table and
 * corpus line — the seal `9de729021`, armed 10-arm corpus, 400² grid, cell 2.50 u, standing-water
 * limit 0.64. They are TRANSCRIBED, not re-derived; the re-measure is what tests them.
 */
export const PIN = Object.freeze({
  provenance: {
    source: 'laneMEASURES-receipt.md §6.2 (TE-WSEAM, review row I19, ODQ §641.2)',
    seal: '9de729021', grid: 400, cellArea: 6.25, standingWaterLimit: 0.64,
    svgCorpus: 'review654/out-armed (the 10-arm armed render)',
    recordedJson: 'measures/wseam/wseam.json',
    recordedJsonSha256: '543616f657771b6820f98b9efe062abac60f86257a9c416c9acd73c20fbc84a0',
  },
  corpus: {
    drawnArea: 214269,          // reported; not a ratchet direction, a scale check
    agreeArea: 5625,
    agreementPctFloor: 2.63,    // FLOOR — may rise, never fall
    drawnNotSubCeiling: 208644, // ⛔ CEILING — may fall, never rise
    subNotDrawnCeiling: 50444,  // ⚠ CEILING — the MIRROR class, may fall, never rise
  },
  // per-leaf: [agreement% FLOOR, DRAWN∧¬SUB u² CEILING, SUB∧¬DRAWN u² CEILING, drawnArea u²]
  leaves: {
    town: [0.42, 23762.5, 2706.3, 23862.5],
    'town-2': [22.58, 16650, 28762.5, 21506.3],
    highwater: [0.27, 25656.3, 2737.5, 25725],
    siege: [0.42, 23762.5, 2706.3, 23862.5],
    plague: [0.42, 23762.5, 2706.3, 23862.5],
    famine: [0.42, 23762.5, 2706.3, 23862.5],
    'year-018': [0.42, 23762.5, 2706.3, 23862.5],
    'year-100': [0.42, 23762.5, 2706.3, 23862.5],
    crossing: [0.42, 23762.5, 2706.3, 23862.5],
  },
  notes: {
    worstLeaf: 'highwater, 0.27 % agreement, 25,656 u² of drawn river reading dry (meanWet 0.0865)',
    bestLeaf: 'town-2, 22.58 % — fjord-reconciled, genuinely wetter substrate, and still under a quarter',
    headline: '97.4 % of the area a reader sees as river is scored BUILDABLE DRY GROUND by the ground law',
  },
});

// One grid cell is 6.25 u², so an area figure cannot move by less than that without the grid
// moving; percentages are recorded to 2 dp. Anything tighter would red on transcription rounding.
export const AREA_EPS = 6.25;
export const PCT_EPS = 0.01;

export function judge(measurement) {
  const rows = measurement.rows.filter((r) => !r.ERROR);
  const errors = measurement.rows.filter((r) => r.ERROR);
  const tot = rows.reduce((a, r) => ({
    drawnArea: a.drawnArea + r.drawnArea, both: a.both + r.bothArea,
    drawnOnly: a.drawnOnly + r.drawnOnlyArea, subOnly: a.subOnly + r.subOnlyArea,
  }), { drawnArea: 0, both: 0, drawnOnly: 0, subOnly: 0 });
  const agreePct = tot.drawnArea ? (100 * tot.both) / tot.drawnArea : null;

  const fails = [], shifts = [];
  const check = (name, kind, value, pin, eps) => {
    if (value == null) { fails.push({ name, kind, value, pin, why: 'NOT MEASURED' }); return; }
    if (kind === 'floor') {
      if (value < pin - eps) fails.push({ name, kind, value, pin, why: `fell below the pinned floor by ${(pin - value).toFixed(2)}` });
      else if (value > pin + eps) shifts.push({ name, kind, value, pin, why: `IMPROVED by ${(value - pin).toFixed(2)} — re-pin` });
    } else {
      if (value > pin + eps) fails.push({ name, kind, value, pin, why: `grew above the pinned ceiling by ${(value - pin).toFixed(1)}` });
      else if (value < pin - eps) shifts.push({ name, kind, value, pin, why: `IMPROVED by ${(pin - value).toFixed(1)} — re-pin` });
    }
  };

  // ── the leaf roster itself is pinned: a leaf that stops being measured must not read as clean
  const seen = new Set(rows.map((r) => r.leaf));
  const missing = Object.keys(PIN.leaves).filter((k) => !seen.has(k));
  const extra = [...seen].filter((k) => !PIN.leaves[k]);

  check('CORPUS agreement inside the drawn river (%)', 'floor', agreePct == null ? null : +agreePct.toFixed(2), PIN.corpus.agreementPctFloor, PCT_EPS);
  check('CORPUS ⛔ DRAWN∧¬SUB (u²)', 'ceiling', +tot.drawnOnly.toFixed(1), PIN.corpus.drawnNotSubCeiling, AREA_EPS);
  check('CORPUS ⚠ SUB∧¬DRAWN — THE MIRROR CLASS (u²)', 'ceiling', +tot.subOnly.toFixed(1), PIN.corpus.subNotDrawnCeiling, AREA_EPS);
  for (const r of rows) {
    const p = PIN.leaves[r.leaf];
    if (!p) continue;
    check(`${r.leaf} · agreement (%)`, 'floor', r.agreementInsideDrawn, p[0], PCT_EPS);
    check(`${r.leaf} · ⛔ DRAWN∧¬SUB (u²)`, 'ceiling', r.drawnOnlyArea, p[1], AREA_EPS);
    check(`${r.leaf} · ⚠ SUB∧¬DRAWN (u²)`, 'ceiling', r.subOnlyArea, p[2], AREA_EPS);
  }

  const configOk = measurement.grid === PIN.provenance.grid && measurement.limit === PIN.provenance.standingWaterLimit;
  return {
    totals: { drawnArea: +tot.drawnArea.toFixed(1), agreeArea: +tot.both.toFixed(1), drawnNotSub: +tot.drawnOnly.toFixed(1), subNotDrawn: +tot.subOnly.toFixed(1), agreementPct: agreePct == null ? null : +agreePct.toFixed(2) },
    leavesMeasured: rows.length, missingLeaves: missing, unpinnedLeaves: extra, extractionErrors: errors,
    configOk, grid: measurement.grid, limit: measurement.limit,
    fails, shifts,
    pass: fails.length === 0 && missing.length === 0 && errors.length === 0 && configOk,
  };
}

function remeasure(svgDir, outJson) {
  const t0 = Date.now();
  const res = spawnSync(process.execPath, [CENSUS, svgDir, `--json=${outJson}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
  return { ms: Date.now() - t0, status: res.status, stdout: res.stdout || '', stderr: res.stderr || '' };
}

const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
const W = (s) => process.stdout.write(s);

function report(J, provenanceLine) {
  W(`── THE WATER-TRUTH AGREEMENT RATCHET (ODQ §660 · TE-WSEAM §6.7 row 4)\n`);
  W(`   ${provenanceLine}\n`);
  W(`   config: grid=${J.grid} limit=${J.limit}  ${J.configOk ? 'matches the pin' : '⛔ DOES NOT MATCH THE PIN — the figures are not comparable'}\n\n`);
  W(`   ${'figure'.padEnd(46)} ${'measured'.padStart(12)} ${'pinned'.padStart(12)}  direction\n`);
  const row = (n, m, p, d) => W(`   ${n.padEnd(46)} ${String(m).padStart(12)} ${String(p).padStart(12)}  ${d}\n`);
  row('agreement inside the drawn river (%)', J.totals.agreementPct, PIN.corpus.agreementPctFloor, 'FLOOR — may rise, never fall');
  row('⛔ DRAWN∧¬SUB (u²)', J.totals.drawnNotSub, PIN.corpus.drawnNotSubCeiling, 'CEILING — may fall, never rise');
  row('⚠ SUB∧¬DRAWN — the MIRROR class (u²)', J.totals.subNotDrawn, PIN.corpus.subNotDrawnCeiling, 'CEILING — may fall, never rise');
  row('drawn river area (u², scale check)', J.totals.drawnArea, PIN.corpus.drawnArea, 'reported');
  W(`   leaves measured ${J.leavesMeasured}/${Object.keys(PIN.leaves).length}`
    + `${J.missingLeaves.length ? `  ⛔ MISSING: ${J.missingLeaves.join(', ')}` : ''}`
    + `${J.unpinnedLeaves.length ? `  ⚠ UNPINNED (new): ${J.unpinnedLeaves.join(', ')}` : ''}`
    + `${J.extractionErrors.length ? `  ⛔ EXTRACTION ERRORS: ${J.extractionErrors.length}` : ''}\n`);
  if (J.shifts.length) {
    W(`\n   ⭐ ${J.shifts.length} DECLARED SHIFT(S) — the figure IMPROVED. A ratchet guarding a floor the code has already\n`);
    W('      cleared is guarding nothing: RE-PIN these in PIN above, in one act, with the cure named.\n');
    for (const s of J.shifts) W(`      ${s.name.padEnd(46)} ${String(s.value).padStart(11)}  (pin ${s.pin})  ${s.why}\n`);
  }
  if (J.fails.length) {
    W(`\n   ⛔ ${J.fails.length} RATCHET BREACH(ES) — the water seam got WORSE:\n`);
    for (const f of J.fails) W(`      ${f.name.padEnd(46)} ${String(f.value).padStart(11)}  (pin ${f.pin})  ${f.why}\n`);
  }
  W(`\nI13_${J.pass ? 'PASS' : 'FAIL'}\n`);
  if (!J.pass) process.exitCode = 1;   // ⛔ C4: the verdict is the exit status too
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--controls')) {
    // ═══ LIVENESS · perturb one number, the ratchet must red; restore, it must green ═══
    const base = JSON.parse(readFileSync(RECORDED, 'utf8'));
    const beforeSha = sha(RECORDED);
    const J0 = judge(base);
    W(`C0 baseline (recorded measurement, sha ${beforeSha.slice(0, 12)}…)  I13_${J0.pass ? 'PASS' : 'FAIL'}  fails=${J0.fails.length} shifts=${J0.shifts.length}\n`);
    const live = [['C0 the recorded measurement satisfies its own pins', J0.pass]];

    // C1 · agreement falls on ONE leaf (the corpus total barely moves — this is why per-leaf pins exist)
    const c1 = JSON.parse(JSON.stringify(base));
    const t2 = c1.rows.find((r) => r.leaf === 'town-2');
    t2.agreementInsideDrawn = 11.0; t2.bothArea = 2400; t2.drawnOnlyArea = 19106.3;
    const J1 = judge(c1);
    W(`C1 town-2 agreement 22.58 → 11.00   I13_${J1.pass ? 'PASS' : 'FAIL'}  fails=${J1.fails.length}: ${J1.fails.map((f) => f.name).join(' | ')}\n`);
    live.push(['C1 a HALVED agreement on ONE leaf reds the ratchet (per-leaf pins are load-bearing)', !J1.pass && J1.fails.some((f) => f.name.startsWith('town-2 · agreement'))]);

    // C2 · the MIRROR class grows corpus-wide
    const c2 = JSON.parse(JSON.stringify(base));
    for (const r of c2.rows) r.subOnlyArea = +(r.subOnlyArea * 1.5).toFixed(1);
    const J2 = judge(c2);
    W(`C2 mirror class ×1.5 corpus-wide     I13_${J2.pass ? 'PASS' : 'FAIL'}  measured subNotDrawn=${J2.totals.subNotDrawn} (ceiling ${PIN.corpus.subNotDrawnCeiling})\n`);
    live.push(['C2 a GROWING mirror class reds the ratchet', !J2.pass && J2.fails.some((f) => f.name.includes('MIRROR'))]);

    // C3 · a leaf silently stops being measured — must NOT read as clean
    const c3 = JSON.parse(JSON.stringify(base));
    c3.rows = c3.rows.filter((r) => r.leaf !== 'highwater');
    const J3 = judge(c3);
    W(`C3 highwater dropped from the run    I13_${J3.pass ? 'PASS' : 'FAIL'}  missing=${JSON.stringify(J3.missingLeaves)}\n`);
    live.push(['C3 a leaf that silently stops being measured cannot read as clean', !J3.pass && J3.missingLeaves.includes('highwater')]);

    // C4 · an IMPROVEMENT is a declared shift, not a silent pass
    const c4 = JSON.parse(JSON.stringify(base));
    for (const r of c4.rows) { r.agreementInsideDrawn = +(r.agreementInsideDrawn + 20).toFixed(2); r.bothArea = +(r.drawnArea * 0.5).toFixed(1); r.drawnOnlyArea = +(r.drawnArea * 0.5).toFixed(1); }
    const J4 = judge(c4);
    W(`C4 agreement improved corpus-wide    I13_${J4.pass ? 'PASS' : 'FAIL'}  shifts=${J4.shifts.length} fails=${J4.fails.length}\n`);
    live.push(['C4 an IMPROVEMENT passes but is surfaced as a DECLARED SHIFT with re-pin values', J4.pass && J4.shifts.length > 0]);

    // C5 · a config change makes the figures incomparable and must not read as a pass
    const c5 = JSON.parse(JSON.stringify(base)); c5.grid = 200;
    const J5 = judge(c5);
    W(`C5 grid 400 → 200                    I13_${J5.pass ? 'PASS' : 'FAIL'}  configOk=${J5.configOk}\n`);
    live.push(['C5 a changed grid/limit is not comparable and reds rather than passing', !J5.pass && !J5.configOk]);

    // C6 · ON-DISK perturb-and-restore, byte-proven — the file the ratchet actually reads
    const bak = `${HERE}/out/.i13-RESTORE.bak`;
    copyFileSync(RECORDED, bak);
    const onDisk = JSON.parse(readFileSync(RECORDED, 'utf8'));
    onDisk.rows.find((r) => r.leaf === 'highwater').agreementInsideDrawn = 0.10;
    writeFileSync(RECORDED, JSON.stringify(onDisk, null, 2));
    const spoiled = spawnSync(process.execPath, [process.argv[1], `--from=${RECORDED}`], { encoding: 'utf8' });
    copyFileSync(bak, RECORDED);
    const afterSha = sha(RECORDED);
    unlinkSync(bak);
    W(`C6 on-disk perturb → exit=${spoiled.status}, verdict=${(spoiled.stdout.match(/I13_\w+/) || ['?'])[0]}; restored sha ${afterSha.slice(0, 12)}… ${afterSha === beforeSha ? 'BYTE-IDENTICAL ✓' : '⛔ DIFFERS'}\n`);
    live.push(['C6 a perturbed measurement file makes the process EXIT NON-ZERO (an &&-chain cannot read it green)', spoiled.status === 1]);
    live.push(['C6 the measurement file is restored byte-identically', afterSha === beforeSha]);

    W('\n── LIVENESS\n');
    for (const [n, ok] of live) W(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
    const ok = live.every((l) => l[1]);
    W(`\nI13_CONTROLS ${ok ? 'LIVE' : 'BROKEN'}\n`);
    if (!ok) process.exitCode = 1;
  } else if (arg('from', null)) {
    const p = arg('from', RECORDED);
    const m = JSON.parse(readFileSync(p, 'utf8'));
    report(judge(m), `⚠ RECORDED MEASUREMENT, NOT A FRESH ONE — read from ${p} (sha ${sha(p).slice(0, 12)}…). Re-run without --from to re-measure.`);
  } else {
    const svgDir = arg('svg', ARMED_SVG);
    if (!existsSync(svgDir)) {
      W(`⛔ armed SVG corpus not found at ${svgDir} — cannot re-measure. Use --svg=<dir> or --from=<wseam.json>.\n`);
      W('I13_FAIL\n'); process.exitCode = 1;
    } else {
      const out = `${HERE}/out/i13-wseam-remeasure.json`;
      const R = remeasure(svgDir, out);
      if (R.status !== 0 || !existsSync(out)) {
        W(`⛔ the WSEAM census exited ${R.status} — its own controls are BROKEN, so nothing it measured is a verdict.\n`);
        W(R.stdout.split('\n').slice(-14).join('\n') + '\n');
        W('I13_FAIL\n'); process.exitCode = 1;
      } else {
        const m = JSON.parse(readFileSync(out, 'utf8'));
        const wseamLive = /WSEAM_CONTROLS LIVE/.test(R.stdout);
        report(judge(m), `FRESH RE-MEASURE of ${svgDir} in ${(R.ms / 1000).toFixed(1)}s — the WSEAM census's own controls: ${wseamLive ? 'LIVE' : '⛔ BROKEN'}`);
        if (!wseamLive) { W('⛔ the underlying census controls are BROKEN — the ratchet\'s verdict is void.\n'); process.exitCode = 1; }
      }
    }
  }
}
