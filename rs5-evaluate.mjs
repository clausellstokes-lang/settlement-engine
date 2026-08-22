/**
 * RS-4 post-run evaluation — tip ac243e1c (TE34 harness cures live). Standing RS-1
 * identities kept for dedupe safety (expected NOT to fire — §206.2b NOT-EXECUTABLE
 * replaces the dark-control failure). Ledger folds measured cells; runs: 3 expected.
 * New surface collected: receipt.notExecutables (§206.2b third status).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { join } from 'node:path';

const SCRATCH = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad';
const RS4 = `${SCRATCH}/rs5`;
const RECEIPT_DIR = `${SCRATCH}/rs5-receipts`;
const ART = `${SCRATCH}/rs5-artifacts`;
const TIP = '4eafca31a295b5288f8c5b0b551e248e386e7791';

const STANDING = [
  'throw_or_assert|w0-soak::30::4::dark-control|unknown',
  'throw_or_assert|w0-soak-b::30::4::dark-control|unknown',
  'throw_or_assert|w0-soak-c::30::4::dark-control|unknown',
  // ca-015 (RS-1 positional id) cannot recur — RS-2 row ids are content-derived — but it
  // stays listed so an unexpected recurrence under the same key would still dedupe.
  'throw_or_assert|w0-soak::30::4::ca-015|unknown',
];

const { grid } = await import(`${RS4}/scripts/soak/pool.mjs`);
const { planRun, determinismFindings } = await import(`${RS4}/scripts/soak/run.mjs`);
const { evaluateTripwires } = await import(`${RS4}/scripts/soak/tripwires.mjs`);
const { buildCapsule, tickBandOf } = await import(`${RS4}/scripts/soak/capsule.mjs`);
const {
  resolveStateHome, ledgerPath, assertHomeWritable, emptyLedger, recordRun, findingKey,
} = await import(`${RS4}/scripts/soak/seedLedger.mjs`);
const { rollingReport } = await import(`${RS4}/scripts/soak/rolling.mjs`);
const { registryBandFamilies, provisionalCurves } = await import(`${RS4}/scripts/soak/curveBands.mjs`);
const { emitRows } = await import(`${RS4}/scripts/telemetry/simMetricEmitter.mjs`);
const { aggregate, populationRunaway } = await import(`${RS4}/scripts/telemetry/simMetricAggregate.mjs`);

mkdirSync(ART, { recursive: true });
const config = JSON.parse(readFileSync(`${SCRATCH}/rs5-config.json`, 'utf8'));
const cells = grid(config);
const receiptPathOf = (cell) => join(RECEIPT_DIR, `${cell.key.replace(/[^A-Za-z0-9_.-]+/g, '_')}.json`);

const missing = [];
const receipts = new Map();
for (const cell of cells) {
  const path = receiptPathOf(cell);
  if (!existsSync(path)) { missing.push(cell.key); continue; }
  receipts.set(cell.key, JSON.parse(readFileSync(path, 'utf8')));
}

const findings = [];
const observability = [];
const notExecutables = [];
for (const cell of cells) {
  const receipt = receipts.get(cell.key);
  if (!receipt) continue;
  const { findings: det, observability: obs } = evaluateTripwires(receipt);
  for (const firing of det) {
    const identity = findingKey({ id: firing.id, tickBand: tickBandOf(undefined) }, cell);
    findings.push({ ...firing, cellKey: cell.key, cell, identity, known: STANDING.includes(identity) });
  }
  for (const firing of obs) observability.push({ ...firing, cellKey: cell.key });
  for (const row of Array.isArray(receipt.notExecutable) ? receipt.notExecutable : []) {
    notExecutables.push({ cellKey: cell.key, name: row.name, reason: String(row.reason || '').slice(0, 220) });
  }
}

const controlKeyOf = (cell) => `${cell.seed}::${cell.years}::${cell.settlements}::dark-control`;
const controlsAttached = [...new Set(findings
  .filter((f) => receipts.has(controlKeyOf(f.cell)))
  .map((f) => f.cellKey))];

const stateHome = resolveStateHome(process.env);
const probe = (dir) => {
  try { mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, '.probe'), 'ok'); return true; }
  catch { return false; }
};
const homeRefusals = assertHomeWritable(stateHome, probe);
const capsules = [];
const capsulesWithheldKnown = [];
if (!homeRefusals.length) {
  for (const firing of findings) {
    if (firing.known) { capsulesWithheldKnown.push(firing.identity); continue; }
    // The runner-observed crash class is not a registry row; its census key belongs to no
    // tripwire, so no capsule is minted (the registry law: new classes join by registry
    // row, never inline). The repro artifact is rs5-crash-repro.log + the plan argv.
    if (firing.runnerObserved) { capsulesWithheldKnown.push(`${firing.identity} (runner-observed class; repro is rs5-crash-repro.log)`); continue; }
    const built = buildCapsule({
      stateHome,
      firing: { id: firing.id, class: firing.class, detail: firing.detail },
      cell: firing.cell,
      checkpoint: { absent: 'the SK-1 runner argv carries no --checkpoint-every; no checkpoint was captured for this firing' },
      sourceSha: TIP,
      tick: undefined,
      soakArgv: planRun({ config, host: { freeMemBytes: 0, cpus: 1 }, identity: { sourceSha: TIP }, receiptDir: RECEIPT_DIR })
        .cells.find((c) => c.key === firing.cellKey).argv,
      host: { nodeVersion: process.version, platform: process.platform, arch: process.arch },
    });
    if (built.refusals.length) { capsulesWithheldKnown.push({ refused: built.refusals }); continue; }
    for (const file of built.files) {
      mkdirSync(join(built.directory), { recursive: true });
      writeFileSync(file.path, file.contents);
      if (file.mode) chmodSync(file.path, file.mode);
    }
    capsules.push({ id: built.id, directory: built.directory, firing: firing.id, cellKey: firing.cellKey });
  }
}

// LEDGER JUDGMENT (recorded, vetoable): the 18 receipted cells are COMPLETE
// measurements and fold under status 'complete' (the coordinator's runs:2 instruction);
// the 150 unrunnable cells are EXCLUDED from the ledger surface entirely — stamping
// lastRun on a cell that crashed before measuring would report a measurement that never
// happened (the survivorship law's other face). Tripwire findings fold; the
// runner-observed class stays out of density (not a registry row).
const status = 'complete';
const measuredCells = cells.filter((cell) => receipts.has(cell.key));
const CREDIT_SENTINEL = `${SCRATCH}/rs5-ledger-credited.marker`;
let ledgerResult = null;
if (!homeRefusals.length && existsSync(CREDIT_SENTINEL)) {
  ledgerResult = {
    credited: false,
    reason: 'already credited in this lane — the sentinel rs5-ledger-credited.marker exists; recordRun is NOT idempotent (RS-3 finding), so the fold is refused rather than repeated',
    sentinel: CREDIT_SENTINEL,
    ledgerRuns: JSON.parse(readFileSync(ledgerPath(stateHome), 'utf8')).runs,
  };
} else if (!homeRefusals.length) {
  const path = ledgerPath(stateHome);
  const ledger = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : emptyLedger();
  const result = recordRun(ledger, {
    status,
    findings: findings.filter((f) => !f.runnerObserved)
      .map((f) => ({ id: f.id, tickBand: tickBandOf(undefined), cell: f.cell })),
    cells: measuredCells,
    standingCapsules: STANDING,
  });
  if (result.credited) {
    writeFileSync(path, `${JSON.stringify(result.ledger, null, 2)}\n`);
    writeFileSync(CREDIT_SENTINEL, `credited runs=${result.ledger.runs} at ${new Date().toISOString()}\n`);
  }
  ledgerResult = {
    credited: result.credited, reason: result.reason,
    fresh: result.fresh, known: result.known,
    runs: result.credited ? result.ledger.runs : null, path,
  };
}

const families = registryBandFamilies();
mkdirSync(join(ART, 'curves'), { recursive: true });
const runawayByCell = [];
for (const cell of cells) {
  const receipt = receipts.get(cell.key);
  if (!receipt) continue;
  const rows = emitRows(receipt, { runId: `rs5-${cell.key}`, sourceSha: TIP, profile: 'cert-30' });
  const report = aggregate(rows);
  const safe = cell.key.replace(/[^A-Za-z0-9_.-]+/g, '_');
  writeFileSync(join(ART, 'curves', `${safe}.json`), `${JSON.stringify(report)}\n`);
  const runaway = populationRunaway(report);
  runawayByCell.push({
    cellKey: cell.key,
    base: runaway.base,
    finalMultiple: runaway.multiples[runaway.multiples.length - 1] ?? null,
    maxMultiple: Math.max(...runaway.multiples.map((m) => Number(m) || 0)),
    minMultiple: Math.min(...runaway.multiples.map((m) => (Number.isFinite(m) ? m : 1))),
    crossed2xAt: runaway.crossedAt,
  });
}
const foldSeries = (report) => {
  const perYearSum = (obj) => {
    const lists = Object.values(obj || {});
    const years = Math.max(0, ...lists.map((l) => l.length));
    return Array.from({ length: years }, (_, y) => lists.reduce((s, l) => s + (Number(l[y]) || 0), 0));
  };
  return {
    sim_population_epoch: (report.populationTrajectory || []).map((r) => r.total),
    sim_prosperity_epoch: perYearSum(report.prosperityLadder),
    sim_governance_epoch: perYearSum(report.governance),
    sim_mover_activity: perYearSum(report.moverActivity),
    sim_event_tempo: perYearSum(report.eventTempo),
    sim_stressor_rhythm: report.stressorRhythm || [],
    sim_succession: perYearSum(report.succession),
    sim_narration_tempo: perYearSum(report.narrationTempo),
  };
};
for (const rowId of ['dark-control', 'maximal-lawful']) {
  const key = `w0-soak::30::4::${rowId}`;
  const receipt = receipts.get(key);
  if (!receipt) continue;
  const rows = emitRows(receipt, { runId: `rs5-${key}`, sourceSha: TIP, profile: 'cert-30' });
  const series = foldSeries(aggregate(rows));
  const provisional = provisionalCurves({
    families,
    series: Object.fromEntries(families.map((f) => [f, series[f] || []])),
    receipt: { sourceSha: TIP },
  });
  writeFileSync(join(ART, `provisional-curves-${rowId}.json`), `${JSON.stringify(provisional, null, 2)}\n`);
}

const detCellKey = 'w0-soak::30::4::maximal-lawful';
const soloPath = `${SCRATCH}/rs5-solo-receipt.json`;
let determinism = null;
if (existsSync(soloPath) && receipts.has(detCellKey)) {
  const inPoolReceiptPath = receiptPathOf(cells.find((c) => c.key === detCellKey));
  determinism = {
    cellKey: detCellKey,
    inPoolVsFreshSolo: determinismFindings({ inPoolReceiptPath, soloReceiptPath: soloPath }),
    inPoolVsPrePoolProbe: existsSync('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/rs5-probe-receipt.json')
      ? determinismFindings({ inPoolReceiptPath, soloReceiptPath: '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/rs5-probe-receipt.json' })
      : null,
  };
}

const report = rollingReport({
  archivedTipSha: TIP,
  cells: cells.length,
  findings: findings.map(({ cell, ...rest }) => rest),
  observability,
  controlsAttached,
});
writeFileSync(join(ART, 'rolling-report.json'), `${JSON.stringify(report, null, 2)}\n`);

const seedOf = (cellKey) => String(cellKey).split('::')[0];
const distinctSeeds = (keys) => [...new Set(keys.map(seedOf))].sort();
// §255 site accounting, computed rather than asserted.
const sites = {
  rule: 'a SITE is a distinct world (seed); a cell is one flag-row within a world. Never quote a cell count as a world count.',
  seedsInGrid: [...new Set(cells.map((c) => seedOf(c.key)))].sort(),
  seedsMeasured: distinctSeeds([...receipts.keys()]),
  findingSites: distinctSeeds(findings.map((f) => f.cellKey)),
  findingSitesById: Object.fromEntries([...new Set(findings.map((f) => f.id))].map((id) => [
    id,
    {
      cells: findings.filter((f) => f.id === id).length,
      distinctWorlds: distinctSeeds(findings.filter((f) => f.id === id).map((f) => f.cellKey)),
    },
  ])),
  observabilitySites: {
    cells: observability.length,
    distinctWorlds: distinctSeeds(observability.map((o) => o.cellKey)),
  },
  notExecutableSites: {
    cells: notExecutables.length,
    distinctWorlds: distinctSeeds(notExecutables.map((n) => n.cellKey)),
  },
};

const worstRunaway = [...runawayByCell].sort((a, b) => b.maxMultiple - a.maxMultiple).slice(0, 5);
const worstCollapse = [...runawayByCell].sort((a, b) => a.minMultiple - b.minMultiple).slice(0, 5);
console.log(JSON.stringify({
  cells: cells.length,
  receipts: receipts.size,
  sites,
  missing,
  status,
  findings: findings.map((f) => ({ id: f.id, cellKey: f.cellKey, detail: f.detail, known: f.known })),
  epochCoverage: (() => {
    const lit = [...receipts.entries()].filter(([, r]) => (r.advanceEpochs || []).some((e) => e !== null));
    const dark = [...receipts.entries()].filter(([, r]) => (r.advanceEpochs || []).every((e) => e === null));
    return {
      cellsThatLitAnEpoch: lit.length,
      distinctWorlds: distinctSeeds(lit.map(([k]) => k)),
      cellsWithNoEpoch: dark.length,
      sampleEpoch: lit.length ? (receipts.get(lit[0][0]).advanceEpochs || []).slice(0, 2) : [],
      allEpochCellsPassed: lit.every(([, r]) => r.passed === true || (r.failures || []).length === 0),
    };
  })(),
  notExecutablesCount: notExecutables.length,
  notExecutablesSample: notExecutables.slice(0, 6),
  observabilityByTripwire: observability.reduce((acc, o) => ({ ...acc, [o.id]: (acc[o.id] || 0) + 1 }), {}),
  observabilityDetails: observability.map((o) => `${o.cellKey}: ${o.detail}`),
  controlsAttached,
  orphanFindings: report.orphanFindings,
  homeRefusals,
  capsules,
  capsulesWithheldKnown,
  ledgerResult,
  worstRunaway,
  worstCollapse,
  determinism,
}, null, 2));
