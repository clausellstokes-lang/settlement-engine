/**
 * coveringArrayCoverage.test.js — SK-4's proof surface (sk-b; ODQ §143.2).
 *
 * ⛔⛔ SK.U4 ORDERS THE ARMS. The recorded compile-fixture hazard is a fixture whose
 * parameters make the defect unreachable: base ≡ cure, and a green meaningless pin. For
 * the EFFECTIVE-PAIR rule the defect is "a pair credited on a structurally dark key", so
 * the FIRST assertion below is the FIXTURE'S OWN SHAPE — that a row exists in which a key
 * reads ON and is not effective. Only then is any coverage number read.
 */

import { describe, expect, it } from 'vitest';

import {
  CONSTRAINT_KINDS,
  CONSTRAINT_MANIFEST,
  OWNER_GATED_ABSENT,
  darkControlRow,
  isEffective,
  manifestDefects,
  maximalLawfulRow,
  requiresGraph,
  varyingFactors,
} from '../../scripts/soak/flagConstraints.mjs';
import {
  MEASURED_ROWS_AT_MINT,
  STRENGTH,
  buildCoveringArray,
  effectivePairsIn,
  rowCountBand,
} from '../../scripts/soak/coveringArray.mjs';
import { flagDomainCensus, soakAdvanceEpoch } from '../../scripts/audit/soakRules.mjs';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';
import {
  EFFECTIVE_ROW,
  FIXTURE_CENSUS,
  FIXTURE_MANIFEST,
  INEFFECTIVE_ROW,
} from '../fixtures/soakFlagRegistryFixture.js';

const liveCensus = () => flagDomainCensus({
  defaults: DEFAULT_SIMULATION_RULES,
  presets: SIMULATION_RULE_PRESETS,
  virtualKeys: ENGINE_GATED_VIRTUAL_RULE_KEYS,
});

describe('the covering array and its constraint manifest', () => {
  it('SK.U4 — the FIXTURE can execute its own defect, asserted before any coverage number', () => {
    const graph = requiresGraph(FIXTURE_MANIFEST);
    expect([...(graph.get('child') || [])]).toEqual(['parent']);
    // THE DISTINGUISHING CASE EXISTS: `child` reads ON and is NOT effective, because its
    // parent is off. Without this row the effective-pair rule has nothing to discriminate
    // and every arm below would pass for the wrong reason.
    expect(INEFFECTIVE_ROW.child).toBe(true);
    expect(isEffective(INEFFECTIVE_ROW, 'child', graph)).toBe(false);
    expect(isEffective(EFFECTIVE_ROW, 'child', graph)).toBe(true);
    // …and a key with no parents is effective exactly when it is on.
    expect(isEffective(INEFFECTIVE_ROW, 'loner', graph)).toBe(true);
    expect(isEffective({ loner: false }, 'loner', graph)).toBe(false);
  });

  it('a pair on a structurally dark key COVERS NOTHING, and the lawful row re-covers it', () => {
    const graph = requiresGraph(FIXTURE_MANIFEST);
    const factors = varyingFactors(FIXTURE_CENSUS, FIXTURE_MANIFEST);
    // The excluded key and the non-boolean key are both gone; the other three remain.
    expect(factors).toEqual(['parent', 'loner', 'child']);
    const ineffective = effectivePairsIn(INEFFECTIVE_ROW, factors, graph);
    const effective = effectivePairsIn(EFFECTIVE_ROW, factors, graph);
    // ⛔ THE RULE: `child=on` earns NO credit in the row where its parent is dark.
    expect([...ineffective].filter((pair) => pair.includes('child=on'))).toEqual([]);
    // The same assignment, made lawful, DOES earn it — so the rule discriminates rather
    // than simply never crediting the key.
    expect([...effective].filter((pair) => pair.includes('child=on')).sort())
      .toEqual(['loner=on|child=on', 'parent=on|child=on']);
    // The dark-parent row still credits everything that WAS effective in it.
    expect([...ineffective].sort()).toEqual(['parent=off|loner=on']);
  });

  it('the manifest is typed, sourced, rationale-carrying and SHRINK-GUARDED', () => {
    const census = liveCensus();
    expect(manifestDefects(census)).toEqual([]);
    for (const row of CONSTRAINT_MANIFEST) {
      expect(CONSTRAINT_KINDS).toContain(row.kind);
      expect(String(row.source).length).toBeGreaterThan(10);
      expect(String(row.rationale).length).toBeGreaterThan(20);
    }
    // The guard convicts a row whose key no longer exists — a constraint pointing at
    // nothing is the shape this arm exists to catch, and it caught one on its first run.
    const stale = [...CONSTRAINT_MANIFEST, {
      kind: 'requires', key: 'aFlagThatWasDeleted', parents: ['warLayerEnabled'],
      source: 'a stale row left behind by a deletion',
      rationale: 'this rationale is long enough to pass the length arm on its own',
    }];
    expect(manifestDefects(census, stale)).toEqual([
      'aFlagThatWasDeleted: named by a requires row but absent from the live flag census',
    ]);
    // ⭐ THE DECLARED ABSENCE. `neutralNeighborsEnabled` is OWNER-GATED and is not in the
    // census at all, so an exclusion row for it would point at nothing. It is recorded as
    // an absence with its own guard: if it ever ENTERS the census, that reds and somebody
    // decides deliberately instead of the flag drifting into the grid.
    expect(OWNER_GATED_ABSENT.map((row) => row.key)).toEqual(['neutralNeighborsEnabled']);
    expect(census.union.filter((key) => key === 'neutralNeighborsEnabled')).toEqual([]);
    expect(manifestDefects({ ...census, union: [...census.union, 'neutralNeighborsEnabled'] })).toEqual([
      'neutralNeighborsEnabled: declared ABSENT from the flag census but is now present — it must become a live exclusion row or a grid axis, deliberately',
    ]);

    // ── THE SK-4 DISPOSITION FOR `advanceEpochEnabled` (chair disposition (a), member F1) ──
    // ⛔ THE DEFECT: the key joined the census at EP-1 with NO manifest disposition at all,
    // so the array lawfully generated 50 rows the instrument could not execute — 150 of 168
    // cells exited 1 at the first pulse with no receipt (RS-2 F1). The chair ruled that the
    // flag must be able to light LAWFULLY, so the disposition is an INCLUSION carrying an
    // obligation, not an exclusion.
    expect([...CONSTRAINT_KINDS]).toEqual([
      'lockstep', 'requires', 'excluded-with-rationale', 'non-boolean', 'harness-companion',
    ]);
    const companions = CONSTRAINT_MANIFEST.filter((row) => row.kind === 'harness-companion');
    expect(companions.map((row) => row.key)).toEqual(['advanceEpochEnabled']);
    expect(companions[0].companion).toBe('advanceEpoch');
    // ⭐ THE ROW NAMES A SEAM, AND THE SEAM EXISTS. A companion row pointing at a function
    // nobody wrote would be a comment claiming a cure — the same defect as a census key
    // with no disposition, wearing the opposite sign.
    expect(companions[0].seam).toContain('soakAdvanceEpoch');
    expect(typeof soakAdvanceEpoch).toBe('function');
    expect(soakAdvanceEpoch({ simulationRules: { advanceEpochEnabled: true }, seed: 's', year: 1 }))
      .toBe('soak::s::advance:1');
    // ⛔ DISPOSITION (a) MEANS THE KEY STILL VARIES. An exclusion row would have removed it
    // from the factors and from the maximal-lawful row, permanently unmeasuring the one
    // flag whose whole purpose is to change the stream a re-advance draws from.
    expect(varyingFactors(census)).toContain('advanceEpochEnabled');
    expect(maximalLawfulRow(census).advanceEpochEnabled).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(darkControlRow(census), 'advanceEpochEnabled')).toBe(true);
    expect(darkControlRow(census).advanceEpochEnabled).toBe(false);
    // …and a companion row that names no value or no seam is a DEFECT, because a row
    // asserting an obligation nobody can discharge reads as a disposition and is not one.
    expect(manifestDefects(census, [...CONSTRAINT_MANIFEST, {
      kind: 'harness-companion', key: 'warLayerEnabled',
      source: 'a companion row left half-written',
      rationale: 'this rationale is long enough to pass the length arm on its own',
    }])).toEqual([
      'warLayerEnabled: a harness-companion row names no companion value',
      'warLayerEnabled: a harness-companion row names no seam that threads its companion',
    ]);
  });

  it('the flag domain is ENUMERATED FROM THE REGISTRY, and its arithmetic closes', () => {
    const census = liveCensus();
    // 25 normalizer-governed + 32 preset-declared-but-ungoverned + 25 engine-gated virtual.
    // ⭐ THE VIRTUAL ARM MOVED 22 → 23 AT EP-1 (2026-08-16), which mints advanceEpochEnabled
    // with its certification row in one commit. The arithmetic below is what makes that a
    // measurement rather than a bump: `union` moves in lockstep (79 → 80) and the
    // governed/ungoverned arms do not move at all, because a VIRTUAL key is by definition
    // absent from DEFAULT_SIMULATION_RULES and from every preset spread. A flag mint that
    // moved any other arm would be mis-declared as virtual, and this closure would say so.
    // ⭐ AND 23 → 24 AT WF-1a (2026-08-16), which mints faithUnseatingEnabled with its
    // certification row in one commit. `union` moved 80 → 81 in lockstep and the governed
    // and ungoverned arms did NOT move, which is the closure confirming the key really is
    // virtual — it appears in neither DEFAULT_SIMULATION_RULES nor any preset spread. THIS
    // FILE IS A NAMED PATH ON EVERY FLAG-MINTING PACKET for the same reason
    // contributionLedgerShape.test.js is: these three literals live in a soak-harness suite
    // no faith battery would think to run, and a wave that pays the rest of the flag-mint
    // bill meets them for the first time at the terminal gate.
    expect(census.governed.length).toBe(25);
    expect(census.ungoverned.length).toBe(32);
    // §489: MF-UC4's `undercityHighWaterEnabled` — the sixth flag-bill surface, paid at the landing act.
    // ⭐ AND 25 → 26 AT W-COIN-1a (2026-08-30), which mints `treasuryEnabled` with its
    // certification row in one commit. THE CLOSURE IS THE PROOF, exactly as it was at EP-1
    // and WF-1a: `union` moves 82 → 83 in lockstep while the governed (25) and ungoverned
    // (32) arms do NOT move at all — which is this arithmetic confirming the key really is
    // VIRTUAL, absent from DEFAULT_SIMULATION_RULES and from every preset spread. A key
    // mis-declared as virtual would have moved one of those two arms and this line would
    // have said so. The `union − governed` figure rises with it by construction (57 → 58):
    // a virtual key is never normalizer-governed.
    // ⭐ AND 26 → 27 AT W-SEAT SEAT-1 (2026-08-30), which mints `foreignSeatEnabled` with its
    // certification row in one commit. THE CLOSURE IS AGAIN THE PROOF: `union` moves 83 → 84
    // in lockstep while governed (25) and ungoverned (32) do NOT move, confirming the key is
    // genuinely VIRTUAL — absent from DEFAULT_SIMULATION_RULES and from every preset spread.
    // `union − governed` rises with it by construction (58 → 59).
    // ⭐ AND 27 → 28 AT W-SEAT SEAT-2b (2026-08-31), which mints `legitimacyUpheavalEnabled`
    // with its certification row in one commit. THE CLOSURE IS AGAIN THE PROOF AND IT IS THE
    // ONLY THING THAT DISTINGUISHES A VIRTUAL MINT FROM A PRESET ONE: `union` moves 84 → 85
    // in lockstep while governed (25) and ungoverned (32) do NOT move, which is affirmative
    // evidence the key is absent from DEFAULT_SIMULATION_RULES and from every preset spread.
    // A key that had leaked into either would have moved `governed` and the sum would still
    // have closed — so the lockstep, not the sum, is the assertion doing the work.
    // ⭐ AND 28 → 29 AT THE WAR LANDING (§876): the coupled union carries T12's
    // `warMemoryEnabled` beside SEAT-2b's mint — re-measured, never re-applied.
    // ⭐ AND 29 → 30 AT ENC-3 (§893), which mints `chanceEncountersEnabled` with its
    // certification row in one commit. THE CLOSURE IS THE PROOF, exactly as at EP-1, WF-1a,
    // W-COIN-1a, SEAT-1 and SEAT-2b, and it was MEASURED BEFORE THE LITERALS WERE MOVED
    // rather than after: `union` moves 86 → 87 in lockstep while `governed` (25) and
    // `ungoverned` (32) do NOT move at all — affirmative evidence the key is genuinely
    // VIRTUAL, absent from DEFAULT_SIMULATION_RULES and from all seven preset spreads
    // (both checked directly, not inferred from the arithmetic). `union − governed` rises
    // with it by construction (61 → 62): a virtual key is never normalizer-governed.
    // ⚠ AND THE MEASUREMENT HAD TO BE TAKEN OUT OF BAND, because the virtual assertion is
    // the FIRST one here and a red at an early assertion blinds every later one in the same
    // test — so "governed and ungoverned did not move" could not have been read off this
    // suite's own failure. It was measured by calling `flagDomainCensus` directly.
    // ⭐ AND 30 → 31 AT SEAT-78 (§900, `bc3002c55`), which mints `irregularForceEnabled`
    // with its certification row in one commit. THE CLOSURE IS THE PROOF, exactly as at
    // EP-1, WF-1a, W-COIN-1a, SEAT-1, SEAT-2b and ENC-3, and it was again MEASURED OUT OF
    // BAND BEFORE THE LITERALS MOVED, for the reason the paragraph directly above records:
    // `union` moves 87 → 88 in lockstep while `governed` (25) and `ungoverned` (32) do NOT
    // move at all — affirmative evidence the key is genuinely VIRTUAL, and both checked
    // directly rather than inferred from the arithmetic (absent from DEFAULT_SIMULATION_RULES,
    // and absent from all seven preset spreads). `union − governed` rises with it by
    // construction (62 → 63): a virtual key is never normalizer-governed. `nonBoolean` (13)
    // does not move, because the key is a boolean.
    // ⛔ THE MINTING LANE DID NOT PAY THIS SURFACE. SEAT-78 paid the manifest, the row and
    // the gate; this census, contributionLedgerShape's pair, subsystemRowsVirtual's three
    // module-scope edits and militaryStrength's importer allowlist were all met at the
    // composition by a landing lane. ⚠ AND ONLY ONE OF THE FOUR FIGURES BELOW WAS EVER
    // REPORTED RED, because the first assertion in this test blinds the three after it —
    // which is exactly why the out-of-band measurement is not optional here.
    // ⭐ AND 31 → 35 AT THE LIGHTING LANDING (§901), where LGT-P5-WOPS (six cars, replayed from
    // `427b85c63`) mints `infiltrationDepthEnabled`, `missionDispatcherEnabled`,
    // `operationsVoiceEnabled` and `envoyTaskCatalogEnabled` — the manifest members, their
    // certification rows, and their by-name reads at the family doors (three in the espionage
    // gate, one at the errand door; the L-CHAIR-901 receipt's table). THE CLOSURE IS THE
    // PROOF, exactly as at every mint above, and it was MEASURED OUT OF BAND at the composed
    // tip d75e807a6 BEFORE these literals moved, by calling `flagDomainCensus` with this
    // suite's own arguments: `union` moves 88 → 92 in lockstep while `governed` (25) and
    // `ungoverned` (32) do NOT move — affirmative evidence all four keys are genuinely
    // VIRTUAL, and both checked directly rather than inferred from the arithmetic (absent from
    // DEFAULT_SIMULATION_RULES, and absent from all seven preset spreads). `union − governed`
    // rises by construction (63 → 67); `nonBoolean` (13) does not move, because all four are
    // booleans; `overlap` stays empty.
    // ⛔ THE MINTING LANE DID NOT PAY THIS SURFACE EITHER — the seventh sighting of the
    // habitat. LGT-P5-WOPS paid the manifest, the rows and the doors, and its
    // contributionLedgerShape pair was settled against SEAT-78's mint at the trial
    // composition; this census was met at the composed-tip proof by the landing chair, one
    // landing after SEAT-78's was met the same way. The registry the mint site can enumerate
    // (TE-GUARDS-1) is still the cure.
    expect(census.virtual.length).toBe(35);
    expect(census.overlap).toEqual([]);
    // 85 -> 86 at the WAR landing (§876): the same coupled-union key, same re-measure.
    // 86 -> 87 at ENC-3 (§893): the virtual mint above, moving in lockstep.
    // 87 -> 88 at SEAT-78 (§900): the virtual mint above, moving in lockstep.
    // 88 -> 92 at the LIGHTING landing (§901): the four virtual mints above, moving in lockstep.
    expect(census.union.length).toBe(92);
    expect(census.governed.length + census.ungoverned.length + census.virtual.length).toBe(census.union.length);
    // 57 of 82 sit outside the normalizer's fail-closed coercion — the measured content of
    // "the normalizer is NOT the oracle", and the reason the manifest had to be minted. It
    // rises with the virtual arm by construction: a virtual key is never governed.
    // 60 -> 61 at the WAR landing (§876): the coupled key is virtual, not governed.
    // 61 -> 62 at ENC-3 (§893): likewise virtual, so it lands outside the normalizer.
    // 62 -> 63 at SEAT-78 (§900): likewise virtual, so it lands outside the normalizer.
    // 63 -> 67 at the LIGHTING landing (§901): four virtual keys, all outside the normalizer.
    expect(census.union.length - census.governed.length).toBe(67);
    expect(census.nonBoolean.length).toBe(13);
  });

  it('all-on is recast as the MAXIMAL-LAWFUL row, and all-off stays the dark control', () => {
    const census = liveCensus();
    const maximal = maximalLawfulRow(census);
    const dark = darkControlRow(census);
    const graph = requiresGraph();
    // Every varying key is on, and every one of them is EFFECTIVE — which is what
    // separates a maximal-lawful row from a literal all-on row over a space containing
    // derived and owner-gated keys.
    const notEffective = varyingFactors(census).filter((key) => !isEffective(maximal, key, graph));
    expect(notEffective).toEqual([]);
    // The excluded keys are absent from BOTH rows, not merely set false in them.
    for (const key of ['majorChangesRequireProposal', 'religionDynamicsEnabled', 'presetId', 'schemaVersion']) {
      expect(Object.prototype.hasOwnProperty.call(maximal, key), `${key} leaked into the maximal row`).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(dark, key), `${key} leaked into the dark control`).toBe(false);
    }
    expect(Object.values(dark).filter((value) => value !== false)).toEqual([]);
  });

  it('the array covers EVERY reachable pair, is deterministic, and refuses a thin one', () => {
    const census = liveCensus();
    const built = buildCoveringArray(census);
    expect(STRENGTH).toBe(2);
    expect(built.refusals).toEqual([]);
    // FULL coverage of the reachable target, not "most of it".
    expect(built.coverage.uncovered).toEqual([]);
    expect(built.coverage.coveredPairs).toBe(built.coverage.targetPairs);
    expect(built.coverage.targetPairs).toBeGreaterThan(10000);
    // Constraint-forbidden pairs are REPORTED, never counted as gaps — `child=on` forces
    // its ancestors on, so a pair asking for the parent off is not a miss.
    expect(built.coverage.constraintForbidden).toBeGreaterThan(0);
    // The row count is an OUTPUT inside a band, and the band was re-derived from this
    // measurement rather than inherited: the compile's [10,20] was for the unconstrained
    // space and would have refused the correct answer.
    const band = rowCountBand(built.factors.length);
    expect(built.coverage.rowCount).toBeGreaterThanOrEqual(band.min);
    expect(built.coverage.rowCount).toBeLessThanOrEqual(band.max);
    expect(MEASURED_ROWS_AT_MINT).toBeGreaterThan(20);
    // DETERMINISM: the same config yields the identical array, every time. No Math.random,
    // no host input — a grid that differs between two runs of one config is not a grid.
    expect(JSON.stringify(buildCoveringArray(census).rows)).toBe(JSON.stringify(built.rows));
    // Row 0 is the dark control and row 1 is maximal-lawful, by construction.
    expect(Object.values(built.rows[0]).filter((value) => value !== false)).toEqual([]);
    expect(Object.values(built.rows[1]).filter((value) => value !== true)).toEqual([]);
    // A THIN array is refused rather than silently reported — the arm that stops a 95%
    // construction from one day being quoted as pairwise.
    const thin = buildCoveringArray(census, { maxRows: 3 });
    expect(thin.refusals.length).toBeGreaterThan(0);
    expect(thin.refusals.join(' ')).toContain('uncovered');
  });
});
