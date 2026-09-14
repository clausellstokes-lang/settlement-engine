/**
 * infiltrationDepth.test.js — the battery for W-OPS car O3's two new rungs.
 *
 * ⭐⭐ THE DISCIPLINE THIS FILE IS BUILT AROUND, inherited from car O2's battery. The leaf
 * takes its seam values as INPUTS and declares no cap, no appetite and no asset registry of
 * its own, so a battery driven only on hand-written literals would prove the leaf
 * self-consistent and discover NOTHING about whether it agrees with the estate's real
 * producers (§711.4: "an arm that cannot discover anything is a green that means less than
 * it looks").
 *
 * So the arms below are driven from BOTH ends. The F8 enrollment boundary is pinned against
 * the REAL `CORRUPTION_WEB_TUNING.MAX_ASSETS_PER_PATRON`, imported from the real module —
 * so the day somebody retunes the web's cap, this suite moves with it or reds. The gate
 * census's DENOMINATOR is extracted from `corruptionWeb.js`'s own source rather than
 * transcribed, so a gate the web adds later cannot sit undispositioned. The ramp shape law
 * is run over ES's REAL `DWELL_RAMP` as well as this leaf's table, so "of the dwellRamp
 * shape" is a checked claim rather than a phrase.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`: a loop-registered suite is
 * TEST_UNREGISTERED to the lighting census and its assertions are then evidence nowhere,
 * however green vitest reports it. Loops live INSIDE the arms.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  ENROLLMENT_DEFERRALS,
  ENROLLMENT_GATE_DISPOSITION,
  INFILTRATION_DEPTH_TUNING,
  INFILTRATION_LEVELS,
  INFILTRATION_LEVEL_NAMES,
  INFILTRATION_PROVENANCE,
  NEW_INFILTRATION_LEVELS,
  PLACEMENT_MISSION_KINDS,
  PLACEMENT_MISSION_KIND_WORDS,
  STANDING_COVER_GATE,
  WEB_SHARED_DEFERRALS,
  holdOrWithdrawRead,
  placementEnrollment,
  placementVettingRamp,
  rampForLevel,
  rampLawViolations,
} from '../../src/domain/worldPulse/espionage/infiltrationDepth.js';
import { ESPIONAGE_TUNING, dwellRamp } from '../../src/domain/worldPulse/espionage/espionageMath.js';
// LGT-P5-WOPS: the door this leaf's flag was minted onto. The read lives in the family
// gate module by charter (this leaf takes `lit` as an argument), so the battery that owns
// the darkness claim is also the one that owns the door's arms.
import { infiltrationDepthActive } from '../../src/domain/worldPulse/espionage/espionageGate.js';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';
import { CORRUPTION_WEB_TUNING } from '../../src/domain/worldPulse/corruptionWeb.js';
// O6-B's reconcile pin reads the ONE dispatch registry from its own home. The LEAF still
// does not — arm 6's `expectAbsentWithAnchor` on `MISSION_KIND_CATALOG` is what keeps the
// union an append; this is the BATTERY reaching across, which is the only place the two
// sights can be held in one hand.
import {
  DISPATCHABLE_MISSION_KINDS,
  MISSION_KINDS,
  isDispatchableKind,
  missionKindRow,
} from '../../src/domain/worldPulse/operations/operationGrammar.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/worldPulse/espionage/infiltrationDepth.js';
const WEB = 'src/domain/worldPulse/corruptionWeb.js';

/** Every .js/.jsx under src/, repo-relative — the live tree, never a fixture list. */
function srcModules(dir = join(ROOT, 'src'), out = /** @type {string[]} */ ([])) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) srcModules(p, out);
    else if (p.endsWith('.js') || p.endsWith('.jsx')) out.push(relative(ROOT, p).replace(/\\/g, '/'));
  }
  return out;
}

/** Source with block and line comments stripped, so a citation in prose is never a match. */
function codeOf(rel) {
  return readFileSync(join(ROOT, rel), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

// ── 1. THE LADDER ────────────────────────────────────────────────────────────────

describe('W-OPS O3 — the infiltration ladder', () => {
  test('the ladder is closed, ordered 0..4, and every rung is uniquely named', () => {
    expect(INFILTRATION_LEVELS.map((row) => row.level)).toEqual([0, 1, 2, 3, 4]);
    expect(new Set(INFILTRATION_LEVEL_NAMES).size).toBe(INFILTRATION_LEVELS.length);
    expect(INFILTRATION_LEVEL_NAMES).toEqual([
      'passing_ear', 'observer', 'rooted', 'placed', 'seated',
    ]);
    expect(Object.isFrozen(INFILTRATION_LEVELS)).toBe(true);
  });

  test('exactly the two rungs this volume adds are NEW — the other three are ES\'s own', () => {
    expect(NEW_INFILTRATION_LEVELS).toEqual(['placed', 'seated']);
    const built = INFILTRATION_LEVELS.filter((row) => row.status === 'built');
    expect(built.map((row) => row.level)).toEqual([0, 1, 2]);
  });

  test('⭐ every rung\'s home resolves against the LIVE tree — a citation, not a story', () => {
    for (const row of INFILTRATION_LEVELS) {
      const [modulePath, symbol] = row.home.split('#');
      expect(srcModules(), `${row.name}: ${modulePath}`).toContain(modulePath);
      const code = codeOf(modulePath);
      expect(
        new RegExp(`export (?:function|const) ${symbol}\\b`).test(code),
        `${row.name}: ${modulePath} does not export ${symbol}`,
      ).toBe(true);
    }
  });
});

// ── 2. THE SHAPE LAW — MACHINERY, RUN OVER BOTH TABLES ───────────────────────────

describe('W-OPS O3 §8b F4 — the self-limiting ramp law', () => {
  test('⭐⭐ ES\'s REAL DWELL_RAMP satisfies the law — so "of the dwellRamp shape" is checked', () => {
    expect(rampLawViolations(ESPIONAGE_TUNING.DWELL_RAMP)).toEqual([]);
  });

  test('this car\'s PLACEMENT_RAMP satisfies the same law', () => {
    expect(rampLawViolations(INFILTRATION_DEPTH_TUNING.PLACEMENT_RAMP)).toEqual([]);
  });

  test('⭐ NEGATIVE CONTROLS: each clause is separately reachable, so the law is not vacuous', () => {
    // A ramp that starts above 1 silently prices a placement that never re-vets.
    expect(rampLawViolations([1.1, 1.4])).toEqual(['identity_at_zero']);
    // A ramp that dips gives a man a SAFER interval by waiting — the brake runs backwards.
    expect(rampLawViolations([1, 1.4, 1.2])).toEqual(['monotone_non_decreasing']);
    // An empty table has no plateau and every index reads undefined.
    expect(rampLawViolations([])).toEqual(['non_empty', 'identity_at_zero']);
    expect(rampLawViolations(null)).toEqual(['non_empty', 'identity_at_zero']);
  });

  test('the placement ramp is SHARPER than the dwell ramp at every band past the first', () => {
    const placed = INFILTRATION_DEPTH_TUNING.PLACEMENT_RAMP;
    const dwell = ESPIONAGE_TUNING.DWELL_RAMP;
    expect(placed[0]).toBe(dwell[0]);
    for (let i = 1; i < Math.min(placed.length, dwell.length); i += 1) {
      expect(placed[i], `band ${i}`).toBeGreaterThan(dwell[i]);
    }
  });

  test('interval 0 is exactly 1 and the top band plateaus for every interval past the table', () => {
    expect(placementVettingRamp(0)).toBe(1);
    const top = INFILTRATION_DEPTH_TUNING.PLACEMENT_RAMP.at(-1);
    expect(placementVettingRamp(INFILTRATION_DEPTH_TUNING.PLACEMENT_RAMP.length)).toBe(top);
    expect(placementVettingRamp(9999)).toBe(top);
    // Junk is CLAMPED, never NaN — a bad index in a product is the recorded failure mode.
    expect(placementVettingRamp(-4)).toBe(1);
    expect(placementVettingRamp('nonsense')).toBe(1);
    expect(placementVettingRamp(undefined)).toBe(1);
  });

  test('⭐ rampForLevel routes L0–L2 to ES\'s table and L3/L4 to this one — no wrong-table pick', () => {
    for (let interval = 0; interval <= 5; interval += 1) {
      expect(rampForLevel(0, interval)).toBe(dwellRamp(interval));
      expect(rampForLevel(2, interval)).toBe(dwellRamp(interval));
      expect(rampForLevel(3, interval)).toBe(placementVettingRamp(interval));
      expect(rampForLevel(4, interval)).toBe(placementVettingRamp(interval));
    }
    // The two tables really do differ where it matters, so the routing arm can discover.
    expect(dwellRamp(2)).not.toBe(placementVettingRamp(2));
  });
});

// ── 3. THE BRAKE — TERMINATION AS A PROPERTY, NOT A HOPE ─────────────────────────

describe('W-OPS O3 §8b F4 — the brake terminates by construction', () => {
  test('⭐⭐ TERMINATION IS TOTAL: every (appetite, hazard) pair withdraws within the cap', () => {
    const cap = INFILTRATION_DEPTH_TUNING.PLACEMENT_RESAMPLE_CAP;
    let swept = 0;
    for (let a = 0; a <= 20; a += 1) {
      for (let h = 0; h <= 20; h += 1) {
        const appetite01 = a / 20;
        const hazard01 = h / 20;
        let interval = 0;
        let choice = 'hold';
        while (choice === 'hold' && interval <= cap + 2) {
          const read = holdOrWithdrawRead({ intervalIdx: interval, appetite01, hazard01 });
          choice = read.choice;
          if (choice === 'hold') interval += 1;
        }
        expect(choice, `appetite ${appetite01} hazard ${hazard01} never terminated`).toBe('withdraw');
        expect(interval).toBeLessThanOrEqual(cap);
        swept += 1;
      }
    }
    expect(swept).toBe(441); // the sweep is live, not an empty loop
  });

  test('⭐ the risk climbs MONOTONICALLY while the appetite does not move — both halves', () => {
    const seen = [];
    for (let interval = 0; interval <= 6; interval += 1) {
      seen.push(holdOrWithdrawRead({ intervalIdx: interval, appetite01: 1, hazard01: 0.2 }).vettingRisk01);
    }
    for (let i = 1; i < seen.length; i += 1) expect(seen[i]).toBeGreaterThanOrEqual(seen[i - 1]);
    expect(seen.at(-1)).toBeGreaterThan(seen[0]);
    // The appetite is an ARGUMENT and nothing in the leaf can move it: the same interval
    // read twice with the same bar is the same verdict, which is what F4's freeze buys.
    const once = holdOrWithdrawRead({ intervalIdx: 3, appetite01: 0.5, hazard01: 0.3 });
    const twice = holdOrWithdrawRead({ intervalIdx: 3, appetite01: 0.5, hazard01: 0.3 });
    expect(twice).toEqual(once);
  });

  test('a bolder man holds where a warier man withdraws, at the same interval and hazard', () => {
    const bold = holdOrWithdrawRead({ intervalIdx: 1, appetite01: 0.9, hazard01: 0.35 });
    const wary = holdOrWithdrawRead({ intervalIdx: 1, appetite01: 0.2, hazard01: 0.35 });
    expect(bold.choice).toBe('hold');
    expect(wary.choice).toBe('withdraw');
    expect(bold.vettingRisk01).toBe(wary.vettingRisk01); // the WORLD is identical; the man is not
  });

  test('⛔ THE CAP IS NOT A DEAD BAND AT THIS RUNG, and that differs from ES\'s own dwell note', () => {
    // ES's DWELL_RAMP comment says the soft bound "must bind first on every reachable
    // input, or the cap is a dead band". A PLATEAUING ramp cannot make that promise: once
    // the table tops out, a low hazard against a high appetite never crosses. Exhibited
    // rather than argued, so nobody deletes the cap believing it unreachable.
    const cap = INFILTRATION_DEPTH_TUNING.PLACEMENT_RESAMPLE_CAP;
    const top = INFILTRATION_DEPTH_TUNING.PLACEMENT_RAMP.at(-1);
    const hazard01 = 0.05;
    const appetite01 = 0.99;
    expect(hazard01 * top).toBeLessThan(appetite01); // the plateau genuinely never crosses
    const atCap = holdOrWithdrawRead({ intervalIdx: cap, appetite01, hazard01 });
    expect(atCap.choice).toBe('withdraw');
    expect(atCap.reason).toBe('resample_cap');
    // …and one interval earlier he was still holding, so the cap is what bound.
    expect(holdOrWithdrawRead({ intervalIdx: cap - 1, appetite01, hazard01 }).choice).toBe('hold');
  });

  test('the soft bound DOES bind first wherever the hazard can reach the appetite', () => {
    const read = holdOrWithdrawRead({ intervalIdx: 1, appetite01: 0.3, hazard01: 0.25 });
    expect(read.choice).toBe('withdraw');
    expect(read.reason).toBe('risk_over_appetite');
    expect(read.intervalIdx).toBeLessThan(INFILTRATION_DEPTH_TUNING.PLACEMENT_RESAMPLE_CAP);
  });
});

// ── 4. ABSENCE IS DECLARED, NEVER A SUPPLIED ZERO ────────────────────────────────

describe('W-OPS O3 — the typed guard, and the two unreadables that are not the same fact', () => {
  test('⭐⭐ null and "" are ABSENT, never a supplied zero — the O2/L5 convention held', () => {
    for (const junk of [null, '', true, undefined, NaN, Infinity, {}]) {
      const noAppetite = holdOrWithdrawRead({ intervalIdx: 0, appetite01: junk, hazard01: 0.4 });
      expect(noAppetite.choice, String(junk)).toBe('withdraw');
      expect(noAppetite.reason).toBe('appetite_unreadable');
      expect(noAppetite.termsAbsent).toEqual(['appetite']);
    }
  });

  test('an unreadable hazard names ITSELF — "he would not risk it" is not "nobody priced it"', () => {
    const noHazard = holdOrWithdrawRead({ intervalIdx: 0, appetite01: 0.5, hazard01: null });
    expect(noHazard.reason).toBe('hazard_unreadable');
    expect(noHazard.termsAbsent).toEqual(['hazard']);
    // A genuine zero appetite is a DIFFERENT fact from an unread one, and says so.
    const coward = holdOrWithdrawRead({ intervalIdx: 0, appetite01: 0, hazard01: 0.4 });
    expect(coward.choice).toBe('withdraw');
    expect(coward.reason).toBe('risk_over_appetite');
    expect(coward.termsAbsent).toEqual([]);
  });

  test('both terms absent are BOTH named, so a partial reading says so on its face', () => {
    const blind = holdOrWithdrawRead({});
    expect(blind.termsAbsent).toEqual(['appetite', 'hazard']);
    expect(blind.choice).toBe('withdraw');
  });
});

// ── 5. F8 — THE ENROLLMENT, PINNED TO THE WEB'S REAL LAW ─────────────────────────

describe('W-OPS O3 §8b F8 — L4 enrolls through the corruption web\'s creation seam', () => {
  const patronId = 'save:patron';
  const targetId = 'save:target';
  const CAP = CORRUPTION_WEB_TUNING.MAX_ASSETS_PER_PATRON;
  /** @param {number} n @param {string} [at] */
  const assets = (n, at = 'save:elsewhere') => Array.from({ length: n }, (_, i) => ({
    targetId: `${at}${i}`, npcKey: `k${i}`, kind: 'foreign_settlement',
  }));

  test('DARK BY DEFAULT: anything but lit === true returns null — zero keys written', () => {
    for (const lit of [undefined, null, false, 0, 1, 'true', {}]) {
      expect(placementEnrollment({
        lit, patronId, targetId, liveAssets: [], maxAssetsPerPatron: CAP, upkeepAfforded: true,
      }), String(lit)).toBeNull();
    }
  });

  test('⭐⭐ THE CAP BOUNDARY IS THE WEB\'S OWN NUMBER, imported from the real module', () => {
    expect(typeof CAP).toBe('number');
    const under = placementEnrollment({
      lit: true, patronId, targetId, liveAssets: assets(CAP - 1), maxAssetsPerPatron: CAP, upkeepAfforded: true,
    });
    expect(under?.admitted).toBe(true);
    expect(under?.liveAssetCount).toBe(CAP - 1);
    const at = placementEnrollment({
      lit: true, patronId, targetId, liveAssets: assets(CAP), maxAssetsPerPatron: CAP, upkeepAfforded: true,
    });
    expect(at?.admitted).toBe(false);
    expect(at?.deferral).toBe('per_patron_cap');
  });

  test('⛔ AN UNSUPPLIED CAP IS NOT AN INFINITE CAP — the fail-closed direction', () => {
    for (const bad of [undefined, null, '', NaN, '3']) {
      const read = placementEnrollment({
        lit: true, patronId, targetId, liveAssets: [], maxAssetsPerPatron: bad, upkeepAfforded: true,
      });
      expect(read?.admitted, String(bad)).toBe(false);
      expect(read?.deferral).toBe('per_patron_cap');
    }
  });

  test('one live asset per (patron, target) pair, and it refuses BEFORE the cap does', () => {
    // Held AND at cap: the held-pair reason wins, because the two facts send a principal
    // to different places — pick another court, versus spend nothing anywhere.
    const read = placementEnrollment({
      lit: true,
      patronId,
      targetId,
      liveAssets: [...assets(CAP - 1), { targetId, npcKey: 'k', kind: 'foreign_settlement' }],
      maxAssetsPerPatron: CAP,
      upkeepAfforded: true,
    });
    expect(read?.admitted).toBe(false);
    expect(read?.deferral).toBe('pair_already_held');
  });

  test('only an explicit false refuses on upkeep — a dark door invents no refusal', () => {
    const refused = placementEnrollment({
      lit: true, patronId, targetId, liveAssets: [], maxAssetsPerPatron: CAP, upkeepAfforded: false,
    });
    expect(refused?.deferral).toBe('upkeep_unaffordable');
    const silent = placementEnrollment({
      lit: true, patronId, targetId, liveAssets: [], maxAssetsPerPatron: CAP,
    });
    expect(silent?.admitted).toBe(true);
  });

  test('an unnamed patron or target is not an enrollment at all', () => {
    expect(placementEnrollment({
      lit: true, patronId: '', targetId, liveAssets: [], maxAssetsPerPatron: CAP,
    })).toBeNull();
    expect(placementEnrollment({
      lit: true, patronId, targetId: '   ', liveAssets: [], maxAssetsPerPatron: CAP,
    })).toBeNull();
  });

  test('⭐⭐ THE GATE CENSUS HAS A DENOMINATOR, AND IT IS THE WEB\'S OWN SOURCE', () => {
    // Extract the web's real deferral vocabulary from its code rather than transcribing it,
    // so a gate the web adds later cannot sit undispositioned in this leaf's census.
    const webCode = codeOf(WEB);
    const webReasons = [...new Set(
      [...webCode.matchAll(/reason:\s*'([a-z0-9_]+)'/g)].map((m) => m[1]),
    )].sort();
    expect(webReasons.length).toBeGreaterThan(2); // the extraction is live, not an empty scan
    const dispositioned = ENROLLMENT_GATE_DISPOSITION.map((row) => row.gate).sort();
    // Every gate the web actually names is dispositioned here. The leaf's own extra word
    // (`pair_already_held`) is the one the web has no spelling for — declared, not smuggled.
    for (const reason of webReasons) expect(dispositioned, reason).toContain(reason);
    expect(dispositioned).toContain('pair_already_held');
    expectAbsentWithAnchor(
      webReasons, 'pair_already_held', 'per_patron_cap',
      'the web has no word for a pair it already holds — it filters, never refuses',
    );
  });

  test('⭐ the two SHARED words are spelled identically to the web\'s, and both really apply', () => {
    const webCode = codeOf(WEB);
    for (const word of WEB_SHARED_DEFERRALS) {
      expect(webCode, word).toContain(`reason: '${word}'`);
      const row = ENROLLMENT_GATE_DISPOSITION.find((r) => r.gate === word);
      expect(row?.disposition, word).toBe('applies');
    }
    expect(ENROLLMENT_DEFERRALS).toEqual(expect.arrayContaining([...WEB_SHARED_DEFERRALS]));
  });

  test('⛔ the two gates that CANNOT apply are named as such, each with a reason', () => {
    const replaced = ENROLLMENT_GATE_DISPOSITION.find((r) => r.gate === 'e0_deferred');
    expect(replaced?.disposition).toBe('replaced_by_the_mission');
    const inapplicable = ENROLLMENT_GATE_DISPOSITION.find((r) => r.gate === 'no_eligible_npc');
    expect(inapplicable?.disposition).toBe('inapplicable');
    for (const row of ENROLLMENT_GATE_DISPOSITION) expect(row.note.length).toBeGreaterThan(20);
    // No enrollment result may ever carry a word from the two dispositions above: a leaf
    // that quietly emitted `e0_deferred` would be rolling the web's die a second time.
    const leafCode = codeOf(LEAF);
    // The anchor is a defer() call the leaf DOES make, so a renamed helper reds on the
    // anchor rather than passing as an absence of everything.
    expectAbsentWithAnchor(
      leafCode, "defer('e0_deferred')", "defer('per_patron_cap')",
      'the rarity die is the mission\u2019s, not a second roll',
    );
    expectAbsentWithAnchor(
      leafCode, "defer('no_eligible_npc')", "defer('pair_already_held')",
      'there is no local to find at L4',
    );
  });
});

// ── 6. THE TASK QUALIFICATION LAW ────────────────────────────────────────────────

describe('W-OPS O3 §0 — the task qualification law, encoded rather than asserted', () => {
  test('the kinds are closed, uniquely named, and each sits on a real rung', () => {
    expect(PLACEMENT_MISSION_KIND_WORDS).toEqual(['place_agent', 'seat_agent']);
    expect(new Set(PLACEMENT_MISSION_KIND_WORDS).size).toBe(2);
    for (const row of PLACEMENT_MISSION_KINDS) {
      expect(NEW_INFILTRATION_LEVELS).toContain(
        INFILTRATION_LEVELS.find((rung) => rung.level === row.level)?.name,
      );
    }
  });

  test('⭐⭐ every receipt family names a module and a symbol that resolve against the LIVE tree', () => {
    const modules = srcModules();
    for (const row of PLACEMENT_MISSION_KINDS) {
      expect(modules, row.kind).toContain(row.receiptModule);
      const code = codeOf(row.receiptModule);
      expect(
        new RegExp(`export (?:function|const) ${row.receiptWriter}\\b`).test(code),
        `${row.kind}: ${row.receiptModule} does not export ${row.receiptWriter}`,
      ).toBe(true);
    }
  });

  test('⭐ qualification and WRITER-LANDED are two fields, and they genuinely differ today', () => {
    const l3 = PLACEMENT_MISSION_KINDS.find((r) => r.kind === 'place_agent');
    const l4 = PLACEMENT_MISSION_KINDS.find((r) => r.kind === 'seat_agent');
    expect(l3?.sourceVerdict).toBe('verified');
    expect(l4?.sourceVerdict).toBe('verified');
    // The pair that makes the two-field encoding non-vacuous: same verdict, different
    // readiness. Collapsing them would tell a later reader one of two false things.
    expect(l3?.writerLanded).toBe(false);
    expect(l4?.writerLanded).toBe(true);
  });

  test('every kind is an UNSIGNED candidate — nothing here is frozen without the owner\'s pen', () => {
    for (const row of PLACEMENT_MISSION_KINDS) expect(row.signedBy).toBeNull();
    expect(INFILTRATION_PROVENANCE.signedBy).toBeNull();
    expect(INFILTRATION_PROVENANCE.status).toBe('CANDIDATE');
  });

  test('⛔ the rows carry O1\'s catalog FIELD SHAPE so the landing unions instead of forking', () => {
    const O1_FIELDS = [
      'kind', 'operationClass', 'receiptFamily', 'receiptWriter', 'receiptModule',
      'sourceVerdict', 'sourceNote', 'signedBy',
    ];
    for (const row of PLACEMENT_MISSION_KINDS) {
      for (const field of O1_FIELDS) expect(Object.keys(row), `${row.kind}.${field}`).toContain(field);
      expect(row.operationClass).toBe('MISSION');
    }
    // …and this leaf does NOT spell the catalog's own name, which is what makes the union
    // an append rather than a collision when the two lines meet.
    expectAbsentWithAnchor(
      codeOf(LEAF), 'MISSION_KIND_CATALOG', 'PLACEMENT_MISSION_KINDS',
      'the extension set is named, the one home is not re-spelled',
    );
  });
});

// ── 6b. O6-B — THE place_agent RECONCILE PIN ─────────────────────────────────────

/**
 * ⭐⭐ ONE KIND WORD, TWO HONEST SIGHTS — AND THE CHAIR RULED THEM BOTH KEPT.
 *
 * O1's catalog row and O3's annex row both say `place_agent`, and they disagree on every
 * column that carries meaning. They are not a contradiction: they answer DIFFERENT
 * QUESTIONS. O1 asks what a placement's SUCCESS writes and finds nothing — no placement or
 * cover writer exists anywhere under `src`, so its verdict is `unverified`. O3 asks what a
 * placement's FAILURE writes and finds a live record family with a live cause word — the
 * covert custody hold — held only behind the arm the ES charter opens, so its verdict is
 * `verified` with `writerLanded:false`.
 *
 * ⛔ A MERGE UNDER ONE ROW WOULD HAVE ERASED A REAL ENCODING DIFFERENCE. Whichever family
 * and whichever verdict the merged row picked, the other sight would be gone and no reader
 * could recover it — and the merge would additionally have to mint a two-family schema,
 * moving O1's derived-dispatchability law to pay for it. Option (b), forking the kind word,
 * was rejected for the opposite reason: two kinds for ONE act forks the dispatcher's
 * vocabulary against finite-semantics economy.
 *
 * ⭐ SO THE RULING IS "BOTH ROWS, IN THEIR OWN HOMES, PLUS THIS PIN" — the estate's
 * mirror-with-reconcile-pin idiom, zero vocabulary minted. The catalog stays the ONE
 * dispatch registry; the annex is a per-level EXTENSION SET. What this pin adds that neither
 * home can assert alone is the JOIN, in both directions, and the one invariant that makes
 * the future safe: while the annex says the capture write has not landed, the catalog row
 * stays `unverified`. The day the ES charter opens that write, BOTH rows move in the same
 * commit or this reds.
 *
 * @enforced-by this test
 */
describe('W-OPS O6-B — place_agent is TWO honest sights, and neither may absorb the other', () => {
  test('⭐⭐ the collision is EXACTLY ONE kind, and the append is exactly one more', () => {
    // Pinned as a PARTITION rather than a subset claim. The annex does NOT promise that
    // every row names a catalog kind — `seat_agent` is a genuine append, which is what the
    // extension set exists to do. What must never drift unnoticed is WHICH rows collide:
    // a second collision is a second two-sights ruling somebody owes.
    const catalogKinds = new Set(MISSION_KINDS);
    const shared = PLACEMENT_MISSION_KIND_WORDS.filter((kind) => catalogKinds.has(kind));
    const appended = PLACEMENT_MISSION_KIND_WORDS.filter((kind) => !catalogKinds.has(kind));
    expect(shared).toEqual(['place_agent']);
    expect(appended).toEqual(['seat_agent']);
  });

  test('⭐ BOTH rows are found BY KIND in their own homes, so this pin cannot pass on absence', () => {
    // The anti-vacuity floor for everything below: an arm that read `undefined` from either
    // home would satisfy most `not.toBe` comparisons by accident.
    expect(PLACEMENT_MISSION_KINDS.find((row) => row.kind === 'place_agent')).toBeTruthy();
    expect(missionKindRow('place_agent')).toBeTruthy();
  });

  test('⛔⛔ the two rows keep their OWN encodings — a merge would red exactly here', () => {
    const annex = PLACEMENT_MISSION_KINDS.find((row) => row.kind === 'place_agent');
    const catalog = missionKindRow('place_agent');
    // O1's SUCCESS-receipt question, one-word verdict.
    expect(catalog?.receiptFamily).toBe('infiltration_placement');
    expect(catalog?.receiptWriter).toBeNull();
    expect(catalog?.sourceVerdict).toBe('unverified');
    // O3's FAILURE-receipt question, two-field verdict.
    expect(annex?.receiptFamily).toBe('foreign_guest_hold_covert');
    expect(annex?.receiptWriter).toBe('FOREIGN_GUEST_HOLD_COVERT_CAUSE');
    expect(annex?.sourceVerdict).toBe('verified');
    // ⛔ AND THEY DISAGREE ON EVERY COLUMN THAT CARRIES THE DIFFERENCE. A merged row would
    // have to pick one of each pair, and every pick erases a sight that is true.
    expect(annex?.receiptFamily).not.toBe(catalog?.receiptFamily);
    expect(annex?.sourceVerdict).not.toBe(catalog?.sourceVerdict);
    expect(annex?.receiptWriter).not.toBe(catalog?.receiptWriter);
    // ⭐ THE DIFFERENCE IS AN ENCODING, NOT ONLY A VALUE. The catalog spells its doubt with
    // `sourceUnverified`; the annex spells readiness with `writerLanded`. A row carrying
    // both keys is a merged row wearing two hats, and it reds here.
    expect(Object.keys(catalog ?? {})).toContain('sourceUnverified');
    // anchored: the positive on the line above reads the SAME key set, so a row that vanished or was re-keyed reds THERE rather than passing here
    expect(Object.keys(catalog ?? {})).not.toContain('writerLanded');
    expect(Object.keys(annex ?? {})).toContain('writerLanded');
    // anchored: the positive on the line above reads the SAME key set, so a row that vanished or was re-keyed reds THERE rather than passing here
    expect(Object.keys(annex ?? {})).not.toContain('sourceUnverified');
  });

  test('⭐ the CATALOG is the ONE dispatch registry — the annex mints no dispatchability', () => {
    const annex = PLACEMENT_MISSION_KINDS.find((row) => row.kind === 'place_agent');
    // The sharpest statement of the ruling: the annex says `verified` and the kind is STILL
    // not dispatchable, because dispatchability derives from the CATALOG's verdict column
    // and from nothing else. If the annex ever became a second dispatch source, this reds.
    expect(annex?.sourceVerdict).toBe('verified');
    expect(isDispatchableKind('place_agent')).toBe(false);
    // ⚠ ANCHORED BY A LIVE SIBLING, NOT BY A BARE ABSENCE. `DISPATCHABLE_MISSION_KINDS` is
    // DERIVED (`MISSION_KIND_CATALOG.filter((row) => row.sourceVerdict === 'verified')`), so an
    // emptied or re-keyed catalog would satisfy a bare `not.toContain` exactly as a correct
    // exclusion does. `confirm_belief` travels that same filter and must still be there.
    expectAbsentWithAnchor(
      DISPATCHABLE_MISSION_KINDS, 'place_agent', 'confirm_belief', 'the ONE dispatch registry',
    );
    // …and the APPENDED kind is not dispatchable either — it is not in the registry at all,
    // which is the same refusal for the same reason rather than a second rule.
    expect(missionKindRow('seat_agent')).toBeNull();
    expect(isDispatchableKind('seat_agent')).toBe(false);
    // anchored by the same live sibling, for the same reason as the pair above
    expectAbsentWithAnchor(
      DISPATCHABLE_MISSION_KINDS, 'seat_agent', 'confirm_belief', 'the ONE dispatch registry',
    );
  });

  test('⛔ THE RECONCILE INVARIANT — the capture write opens BOTH rows in one commit or reds', () => {
    const annex = PLACEMENT_MISSION_KINDS.find((row) => row.kind === 'place_agent');
    const catalog = missionKindRow('place_agent');
    // Written as ONE total assertion rather than a conditional: an `if` guard here would let
    // the arm stop asking the day the premise moved, which is precisely the day it matters.
    // Flipping either half alone reds; flipping both together is the one-commit act the
    // ruling asks for.
    expect([annex?.writerLanded, catalog?.sourceVerdict]).toEqual([false, 'unverified']);
  });
});

// ── 7. F15 — THE COVER IS RECONNED AND GATED, AND NOT BUILT ──────────────────────

describe('W-OPS O3 §8b F15 — the standing cover is owner-gated, so none is built', () => {
  test('the gate row is unsigned and names what the owner is being asked to admit', () => {
    expect(STANDING_COVER_GATE.signedBy).toBeNull();
    expect(STANDING_COVER_GATE.status).toBe('RECON_COMPLETE_AWAITING_OWNER');
    expect(STANDING_COVER_GATE.owes.length).toBeGreaterThanOrEqual(2);
  });

  test('⭐⭐ the gate offers a CHOICE of two shapes, and the lean is one of them', () => {
    // A gate that presents one shape is a yes/no on somebody's first idea. Both shapes are
    // carried, each priced and each naming what it grazes, and the lean names a real row.
    const shapes = STANDING_COVER_GATE.candidateShapes.map((row) => row.shape);
    expect(shapes).toEqual(['persisted_cover_record', 'derived_cover_query']);
    for (const row of STANDING_COVER_GATE.candidateShapes) {
      expect(row.cost.length, row.shape).toBeGreaterThan(20);
      expect(row.grazes.length, row.shape).toBeGreaterThan(10);
    }
    expect(shapes.some((shape) => STANDING_COVER_GATE.chairLean.startsWith(shape))).toBe(true);
    // The constitutional law the persisted shape grazes is REAL, quoted from the live file.
    // RAW source, deliberately, not `codeOf`: this law lives in a DOCSTRING, and the
    // comment-stripping accessor every other arm uses would find nothing and prove nothing.
    const knownCharacterSource = readFileSync(join(ROOT, 'src/domain/npc/knownCharacter.js'), 'utf8');
    expect(knownCharacterSource).toMatch(/No per-NPC memory store exists or may be minted/);
  });

  test('⭐⭐ every MEASURED premise of the gate row is true of the live tree right now', () => {
    const modules = srcModules();
    for (const claim of STANDING_COVER_GATE.measured) {
      const [modulePath, symbol] = claim.split(' ')[0].split('#');
      expect(modules, claim).toContain(modulePath);
      // A claim that names a SYMBOL is bound to that symbol too — a citation that only
      // proved its file exists would survive the day the thing it cites is renamed away.
      if (symbol) {
        expect(
          new RegExp(`export (?:function|const) ${symbol}\\b`).test(codeOf(modulePath)),
          `${claim} — ${modulePath} no longer exports ${symbol}`,
        ).toBe(true);
      }
    }
    // The two facts the fold's premise rests on, re-measured here rather than quoted:
    // the cover has exactly one writer, and terminal errands really do leave persistence.
    expect(codeOf('src/domain/worldPulse/errandMint.js')).toMatch(/declaredPurpose: declared, truePurpose: resolved/);
    expect(codeOf('src/domain/worldPulse/envoyErrandVocabulary.js')).toMatch(/TERMINAL_STATES = new Set\(\['home', 'lost'\]\)/);
    expect(codeOf('src/domain/worldPulse/envoyErrand.js')).toMatch(/TERMINAL_STATES\.has\(String\(errand\.state\)\)/);
  });

  test('⛔ NO COVER IS PERSISTED BY THIS CAR — the leaf writes no cover key at all', () => {
    const leafCode = codeOf(LEAF);
    // ⭐ THE ANCHORS ARE THE COVER VOCABULARY THE LEAF *DOES* CARRY. The gate row names
    // `declaredPurpose/truePurpose` in prose, so the scan demonstrably sees those tokens
    // — what is absent is a WRITTEN KEY. Deleting the gate row reds the anchor.
    expectAbsentWithAnchor(
      leafCode, 'declaredPurpose:', 'declaredPurpose/truePurpose',
      'the cover is named, never written',
    );
    expectAbsentWithAnchor(
      leafCode, 'truePurpose:', 'declaredPurpose/truePurpose',
      'the cover is named, never written',
    );
    expectAbsentWithAnchor(
      leafCode, 'standingCover:', 'STANDING_COVER_GATE',
      'the gate exists; the schema it gates does not',
    );
  });
});

// ── 8. DARKNESS AND PROVENANCE ───────────────────────────────────────────────────

describe('W-OPS O3 — darkness, and citations that cannot rot', () => {
  test('⭐⭐ NO PRODUCTION CALLER: nothing under src/ imports this leaf', () => {
    const modules = srcModules().filter((rel) => rel !== LEAF);
    expect(modules.length).toBeGreaterThan(200); // the scan is live, not an empty walk
    // ⏱ NARROWED 2026-09-05 BY LGT-P5-WOPS, ON THIS VOLUME'S OWN RULING. The arm's CLAIM
    // is that nothing under src/ IMPORTS this leaf, and its first spelling measured
    // MENTIONS instead — so the leaf's own certification row, whose `module` field must
    // name the file it certifies, reddened an arm about callers. The sibling car already
    // ruled the instrument: `tests/domain/missionDispatcher.test.js` says verbatim "An
    // IMPORT SPECIFIER census, not a mention census … a header is not a caller." This is
    // that census, and it is STRICTLY STRONGER than the old one for the property named:
    // the mention scan could be satisfied by a renamed import, and this cannot.
    const importers = modules.filter((rel) => /from\s+'[^']*infiltrationDepth\.js'/.test(codeOf(rel)));
    expect(importers).toEqual([]);
    // ...AND THE MENTIONS STAY CENSUSED, as an EXACT roster rather than an empty one, so a
    // sixth namer still reds. Four are the mint's own surfaces (the manifest, the row, the
    // door, the sibling leaf's provenance) and the fifth is this leaf itself.
    // ⚠ THE WORD BOUNDARY IS LOAD-BEARING AND WAS MEASURED, NOT ASSUMED: `\b` after
    // `infiltrationDepth` refuses `infiltrationDepthEnabled`, so this roster is the FILE's
    // namers and not the KEY's. The key's own roster is the polarity census at the foot of
    // this file, which counts comparisons rather than names.
    const namers = srcModules().filter((rel) => /\binfiltrationDepth\b/.test(codeOf(rel))).sort();
    expect(namers).toEqual([
      'src/domain/certification/subsystemRowsOps.js',
      'src/domain/worldPulse/espionage/infiltrationDepth.js',
    ]);
  });

  test('⛔ NO FLAG IS MINTED HERE — the door is named, and the gate read is not written', () => {
    const leafCode = codeOf(LEAF);
    // ⏱ UPDATE, 2026-09-05 (lighting wave, L-HOMES car 4 / LGT-P5-WOPS): THE MINT HAS
    // LANDED, AND THIS ARM IS UNCHANGED ON PURPOSE. The CR-WR10-C trio — the by-name
    // `rules.<key> === true` read, the manifest entry, the authored certification row —
    // is now in the tree, but the READ is in the family DOOR module and never here: the
    // leaf's own header declares that every door-bearing export takes an explicit `lit`
    // ARGUMENT, so a gate inside this pure injected leaf would be a second place a world
    // could be consulted. The two negatives below are therefore MORE load-bearing after
    // the mint than before it, and the door's own arms are at the foot of this file.
    // ⭐ THE DOOR IS NAMED AND NEVER READ, and both halves are asserted through the same
    // source: `infiltrationDepthEnabled` is present, `simulationRules` is not, and the
    // `!== true` anchor proves the scan can see a strict comparison in this file at all.
    expectAbsentWithAnchor(
      leafCode, 'simulationRules', 'infiltrationDepthEnabled',
      'the CR-WR10-C gate read is not written here',
    );
    expectAbsentWithAnchor(
      leafCode, '=== true', '!== true',
      'no by-name flag read exists to owe a manifest entry',
    );
    expect(INFILTRATION_PROVENANCE.door).toBe('infiltrationDepthEnabled');
  });

  test('the leaf is PURE — no clock, no PRNG, no store, no mutation of an argument', () => {
    const leafCode = codeOf(LEAF);
    // `Math.max` and `Object.freeze` are the same-path anchors: both are live calls in
    // this leaf, so a scan that stopped seeing the source reds on them first.
    expectAbsentWithAnchor(leafCode, 'Math.random', 'Math.max', 'no PRNG');
    expectAbsentWithAnchor(leafCode, 'Date.now', 'Object.freeze', 'no clock');
    expectAbsentWithAnchor(leafCode, 'new Date(', 'Object.freeze', 'no clock');
    expectAbsentWithAnchor(leafCode, 'localStorage', 'Object.freeze', 'no store');
    expectAbsentWithAnchor(leafCode, 'fetch(', 'Object.freeze', 'no I/O');
    // Every returned decision is frozen, so a consumer cannot edit a verdict after the fact.
    const read = placementEnrollment({
      lit: true, patronId: 'a', targetId: 'b', liveAssets: [], maxAssetsPerPatron: 3, upkeepAfforded: true,
    });
    expect(Object.isFrozen(read)).toBe(true);
  });

  test('⭐ every provenance address resolves against the LIVE tree', () => {
    const modules = srcModules();
    for (const address of [...INFILTRATION_PROVENANCE.consumes, ...INFILTRATION_PROVENANCE.extends]) {
      const [modulePath, symbol] = address.split('#');
      expect(modules, address).toContain(modulePath);
      const code = codeOf(modulePath);
      expect(
        new RegExp(`export (?:function|const) ${symbol}\\b`).test(code),
        `${address} — the symbol is not exported there`,
      ).toBe(true);
    }
  });

  test('this leaf declares NO cap of its own — the web\'s number has exactly one home', () => {
    const leafCode = codeOf(LEAF);
    // ⭐ THE ANCHORS ARE THE PLUMBING FOR THE VERY VALUES BEING BANNED: the leaf carries
    // `maxAssetsPerPatron` and `upkeepAfforded` as ARGUMENTS, so the scan provably sees
    // the cap seam while finding no constant defined here.
    expectAbsentWithAnchor(
      leafCode, 'MAX_ASSETS_PER_PATRON:', 'maxAssetsPerPatron', 'the cap has one home',
    );
    expectAbsentWithAnchor(
      leafCode, 'UPKEEP_AFFORD_FLOOR:', 'upkeepAfforded', 'the upkeep floor has one home',
    );
    // …and it imports the web not at all, so it can neither drift from nor drag that graph.
    expectAbsentWithAnchor(
      leafCode, "from '../corruptionWeb.js'", "from './espionageMath.js'",
      'the only import is same-family, so no graph is dragged and nothing can drift',
    );
  });
});

// ── 9. THE DOOR, MINTED 2026-09-05 BY LGT-P5-WOPS ────────────────────────────────

describe('W-OPS O3 — the CR-WR10-C door, and the polarity census that keeps it single', () => {
  test('⭐ THE ONE GATE READ IS LIT, AND IT IS THE FAMILY DOOR — not this leaf', () => {
    // THE LIT DRIVE. `infiltrationDepthEnabled: true` reaches the door through a real
    // world shape, with the espionage conjunction satisfied, so the mint has a standing
    // flag-ON proof rather than a dark-only one.
    // ⚠ `beliefsActive` reads a positive integer `spatialCanonVersion` and an info mode
    // that is not omniscient — NOT a `beliefsEnabled` key. The fixture is the real door's
    // real precondition, measured from `beliefMap.beliefsActive`, so a world shape that
    // could never satisfy ES-0 cannot make this arm pass by accident.
    const lit = {
      spatialCanonVersion: 1,
      simulationRules: {
        // ⚠ `infoModeOf` FAILS CLOSED TO 'omniscient', and `beliefsActive` refuses that
        // mode — so an omitted infoMode is a DARK world, not a lit one. Measured from
        // `simulationRules.infoModeOf`, never assumed.
        infoMode: 'full',
        errandSpineEnabled: true,
        espionageEnabled: true,
        infiltrationDepthEnabled: true,
      },
    };
    expect(infiltrationDepthActive(lit)).toBe(true);
    // ...and the key is what carries it: drop it alone and the door refuses.
    expect(infiltrationDepthActive({
      ...lit, simulationRules: { ...lit.simulationRules, infiltrationDepthEnabled: false },
    })).toBe(false);
    expect(infiltrationDepthActive({ simulationRules: {} })).toBe(false);
    expect(infiltrationDepthActive(null)).toBe(false);
    expect(infiltrationDepthActive(undefined)).toBe(false);
  });

  test('⛔ STRICT, NOT TRUTHY: every truthy non-true spelling reads exactly like absent', () => {
    // The strict `=== true` read is what makes these identical to the absent case rather
    // than merely close, which is the whole of the dormancy claim (§6: dark ⇒ zero keys).
    const absent = infiltrationDepthActive({
      spatialCanonVersion: 1,
      simulationRules: { infoMode: 'full', errandSpineEnabled: true, espionageEnabled: true },
    });
    expect(absent).toBe(false);
    for (const truthy of [1, 'true', {}, []]) {
      expect(infiltrationDepthActive({
        spatialCanonVersion: 1,
        simulationRules: {
          infoMode: 'full',
          errandSpineEnabled: true,
          espionageEnabled: true,
          infiltrationDepthEnabled: truthy,
        },
      }), `a truthy non-true ${JSON.stringify(truthy)} must read exactly like absent`).toBe(absent);
    }
  });

  test('⛔ THE CONJUNCTION: a lit ladder over a dark espionage layer stays dark', () => {
    // Each of ES-0's three doors dropped ALONE, because a test that only proves the last
    // one has proven nothing about the first two — the recorded two-guard defect.
    const base = {
      infoMode: 'full',
      errandSpineEnabled: true,
      espionageEnabled: true,
      infiltrationDepthEnabled: true,
    };
    // Door 1 — beliefs live: dropped by removing the canon marker `beliefsActive` reads.
    expect(infiltrationDepthActive({ simulationRules: base })).toBe(false);
    // Door 2 — the errand spine, ES-0's lighting-order precondition.
    expect(infiltrationDepthActive({
      spatialCanonVersion: 1, simulationRules: { ...base, errandSpineEnabled: false },
    })).toBe(false);
    // Door 3 — the espionage flag itself, by name.
    expect(infiltrationDepthActive({
      spatialCanonVersion: 1, simulationRules: { ...base, espionageEnabled: false },
    })).toBe(false);
    // NON-VACUITY: the same fixture with all three doors open is TRUE, so the three
    // refusals above are refusals and not a fixture that could never pass.
    expect(infiltrationDepthActive({ spatialCanonVersion: 1, simulationRules: base })).toBe(true);
  });

  test('⛔ THE POLARITY CENSUS: exactly ONE by-name read in src/, and it is strict', () => {
    // Over a comment-stripped strip, so a name written in a comment or a receipt string
    // is never miscounted as a use — the shared `codeOnly` discipline in this leaf's own
    // spelling (`codeOf`), which the arms above already drive.
    const KEY = 'infiltrationDepthEnabled';
    // ⛔ A READ, NOT A MENTION. The manifest member, the certification row's `rule` field
    // and the sibling leaf's provenance string all NAME the key and gate nothing; a census
    // that counted them would convict the mint's own bookkeeping. The scan therefore looks
    // for the COMPARISON — the only shape `engineGatedRuleKeys` counts as a gate.
    const READ_RE = new RegExp(`\\b${KEY}\\s*(?:===|!==|==|!=)`);
    const readers = srcModules()
      .map((rel) => ({ rel, code: codeOf(rel) }))
      .filter((entry) => READ_RE.test(entry.code))
      .map((entry) => entry.rel)
      .sort();
    expect(readers).toEqual(['src/domain/worldPulse/espionage/espionageGate.js']);
    const gate = codeOf('src/domain/worldPulse/espionage/espionageGate.js');
    expect(new RegExp(`rules\\.${KEY}\\s*===\\s*true`).test(gate)).toBe(true);
    // No loose-truthiness spelling anywhere: a bare `rules.<key>` used as a condition, or
    // a `!== false`, would be a second polarity to keep in step.
    expect(new RegExp(`${KEY}\\s*!==\\s*false`).test(gate)).toBe(false);
    // NON-VACUITY: the scan can see the token, proven by a plant rather than assumed.
    expect(READ_RE.test('rules.infiltrationDepthEnabled === true')).toBe(true);
    expect(READ_RE.test("door: 'infiltrationDepthEnabled'")).toBe(false);
  });

  test('⛔ THE KEY IS VIRTUAL: absent from the defaults and from every preset spread', () => {
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, 'infiltrationDepthEnabled')).toBe(false);
    for (const [id, preset] of Object.entries(SIMULATION_RULE_PRESETS)) {
      expect(
        Object.prototype.hasOwnProperty.call(preset.rules, 'infiltrationDepthEnabled'),
        `${id} declares the key — a virtual key must be false everywhere by ABSENCE`,
      ).toBe(false);
    }
    // ...and it IS in the manifest, which is what makes it censusable at all.
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain('infiltrationDepthEnabled');
  });
});
