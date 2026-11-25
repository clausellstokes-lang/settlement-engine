/**
 * rosterChoiceInversion.pglite.test.js — RULING VR26, THE INVERSION TEST (the seventh chair, 2026-11-20 01:15 UTC,
 * vetoable by the owner): a value the roster-choice registry sends AS STORED (a `diffuse` row) is a claim that it tells
 * nothing; the repository is public, so the claim is tested as a visitor would test it. For born towns under each veil,
 * each such value either CANNOT be re-derived from the served document (the row names what is not served) or EQUALS its
 * re-derivation by the engine's own functions. A difference re-classes the row under VR19. VEIL-20 item 3c: THE
 * HARNESS; R6 makes it an arm of the born counterfactual test.
 *
 * THROUGH THE SERVER (VR15): each town is stored on a chain of every migration on disk and read as anon by
 * get_gallery_dossier, under the default veil with Reveal DM off and on. THE VISITOR'S RE-DERIVATION (`revisit`): the
 * served document with prosperity and the standing label re-derived (src/domain/veil/importRederive.js ::
 * servedProsperityOutcomes; a Subsistence base, which took a birth draw, is not re-derivable and its town is counted
 * aside), then the defence profile (generateDefenseProfile), the safety band (generateSafetyProfile), the legitimacy
 * reading (computePublicLegitimacy) and the prose (composePublicProse) over it.
 * THE ARMS:
 *   TOTAL      every diffuse row is classed here: re-derived, or what is not served.
 *   FIDELITY   on the full STORED town, the re-derivation equals the stored value (the deriver is the engine's rule);
 *              a row whose deriver is not faithful is named in KNOWN_UNFAITHFUL (a harness debt R6 pays, shrink-only).
 *   RED        a served value moved by hand is caught.
 *   MAIN       the rows whose served value differs from its re-derivation ONLY where a house is hidden are EXACTLY
 *              KNOWN_INVERTING (measured at this tip): a new one reds, and R3/R6 shrink it to nothing by re-classing each
 *              under VR19; a composed row that differs even where nothing is hidden is KNOWN_NOT_REDERIVABLE (R5's).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { writeFileSync } from 'node:fs';
import { bootChain, storeShare, BIRTH_DIALS } from './veilChain.shared.mjs';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ARM_TIMEOUT_MS = 600_000;
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const BIRTHS = [['town', null], ['city', 'infiltrated'], ['metropolis', null], ['city', null], ['town', 'indebted'], ['metropolis', 'insurgency'], ['village', null], ['city', 'famine']];

/** The diffuse rows this harness re-derives (everything else is classed in NOT_SERVED). Prose rows by their path. */
const DERIVED = new Set(['defence.readiness.label', 'defence.readiness.colours', 'defence.scores.disaster', 'defence.scores.economic',
  'defence.scores.internal', 'defence.scores.magical', 'defence.scores.military', 'defence.scores.monster', 'defence.economicGates',
  'economy.prosperity', 'economy.prosperityStanding', 'safety.safetyLabel', 'legitimacy.label', 'legitimacy.score', 'legitimacy.colours']);
/** What is not served (or not re-derived by this harness), per diffuse row: the row names the input. */
const NOT_SERVED = Object.freeze({
  'food.record.storageMonths': 'the stores are laid by at the standing label\'s share through a label-keyed fork (economicState.js :: the kept food record): not re-derived here; R6',
  'food.resilienceScore': 'as the stores\' months: R6',
  'income.composition': 'the roster\'s composition (VR8): a lawful row only the counterfactual drew; no served field re-draws it',
  'power.composition': 'the roster\'s composition (VR8): the counterfactual\'s own draw',
  'power.relation.composition': 'the roster\'s composition (VR8): the counterfactual\'s own draw',
  'power.conflicts': 'the conflicts the counterfactual drew (VR8); a conflict naming a withheld power follows power.recentConflict',
  'history.founding.overcoming': 'picked from OVERCOMING_BY_PROSPERITY by the prosperity label: follows economy.prosperity (the chair, 01:20 UTC)',
  'tile.prosperity': 'a column beside data (VEIL-DOORS, SV7); a copy of economy.prosperity',
  'tile.threatLevel': 'a column beside data (VEIL-DOORS, SV7)',
  'tile.governmentType': 'a column beside data (VEIL-DOORS, SV7)',
  'conditions.severityBand': 'a condition\'s band (VR37, tier 2): promoted from the stressors through the prosperity band (conditionPromotion.js); not re-derived here: R6',
});
/** Measured at this tip (VEIL-20, 2026-11-20 02:3x UTC, 8 born towns x Reveal DM off and on): rows whose deriver does
 * not reproduce the stored town. Shrink-only. */
const KNOWN_UNFAITHFUL = Object.freeze(new Set([]));
/** Measured at this tip: rows whose re-derivation differs from the served value ONLY in towns with a hidden house: a
 * visitor recovers the stored value's hidden term. Each is re-classed under VR19 by R3/R6 (shrink-only). */
const KNOWN_INVERTING = Object.freeze(new Set(['economy.prosperity', 'economy.prosperityStanding',
  'legitimacy.colours', 'legitimacy.label', 'legitimacy.score', 'safety.safetyLabel']));
/** Measured at this tip: composed rows whose re-composition over the served document differs EVEN WHERE NOTHING IS
 * HIDDEN: the composer reads what the projection does not serve, so a visitor cannot re-derive them (VR26's first
 * branch), and the harness cannot judge them by re-composition. R5 (VR12) classes each by its inputs. Shrink-only. */
const KNOWN_NOT_REDERIVABLE = Object.freeze(new Set(['prose.conditionSeverity', 'prose.prosperity.sentence', 'prose.state.publicOrder.beside',
  'prose.state.publicOrder.rung.sentence', 'prose.threat.economic', 'prose.wall.rationale']));

/** Every leaf (or whole value at an array path) whose differ-normalised path the regex matches, keyed by its indexed path. */
function valuesAt(doc, re) {
  const out = new Map();
  const walk = (v, norm, exact) => {
    if (norm && (re.test(norm) || re.test(`${norm} (only in A)`))) { out.set(exact, JSON.stringify(v)); return; }
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${norm}[]`, `${exact}[${i}]`));
    else if (isRec(v)) for (const k of Object.keys(v)) walk(v[k], norm ? `${norm}.${k}` : k, exact ? `${exact}.${k}` : k);
  };
  walk(doc, '', '');
  return out;
}
const sameAt = (a, b, re) => { const x = valuesAt(a, re); const y = valuesAt(b, re); return x.size === y.size && [...x].every(([k, v]) => y.get(k) === v); };

describe('VR26: a value sent as stored either cannot be re-derived from the served document or equals its re-derivation (through the server)', () => {
  let db;
  let rows;
  let towns;
  let revisit;

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const veil = await import('../../src/domain/display/galleryVeil.js');
    const { isHideableHouse } = await import('../../src/domain/people/cardVeil.js');
    const { REGISTRY_ROWS } = await import('../../src/domain/veil/rosterChoiceRegistry.js');
    const { servedProsperityOutcomes } = await import('../../src/domain/veil/importRederive.js');
    const { computeBaseProsperity, standingBaseProsperity, deriveProsperityLabels } = await import('../../src/generators/economy/prosperity.js');
    const { generateDefenseProfile } = await import('../../src/generators/defenseGenerator.js');
    const { keepOfRecord } = await import('../../src/domain/facts/keep.js');
    const { generateSafetyProfile } = await import('../../src/generators/safetyProfile.js');
    const { computePublicLegitimacy } = await import('../../src/generators/factionDynamics.js');
    const { resolveFortuneLawVersion } = await import('../../src/domain/fortune/fortuneLaw.js');
    await loadGenerationLawPayloads();
    rows = REGISTRY_ROWS.filter((r) => r.rule === 'diffuse');

    /** The visitor's re-derivation of a served document: null where its prosperity took a birth draw. */
    revisit = (doc) => {
      const r = clone(doc);
      const cfg = r.config; const inst = r.institutions || []; const e = r.economicState;
      if (!isRec(cfg) || !isRec(e)) return null;
      const outcomes = servedProsperityOutcomes(r, cfg);
      if (outcomes.length !== 1) return null;
      const names = inst.map((i) => i?.name);
      const base = computeBaseProsperity(r.tier, cfg.tradeRouteAccess, inst, cfg, names, e.incomeSources || [], e.foodSecurity || null).label;
      const standing = standingBaseProsperity(r.tier, cfg.tradeRouteAccess, inst, cfg, names, e.incomeSources || []);
      e.prosperity = outcomes[0];
      e.prosperityStanding = deriveProsperityLabels(base, standing, cfg, inst).prosperityStanding;
      // R2 (VEIL-21): the stores' months are withheld on every read; the visitor reads them from the food record the share
      // serves, as the page and the import's save do (pageRederive.js, importRederive.js step 3)
      const months = e.foodSecurity?.foodRecord?.storageMonths;
      if (isRec(e.foodSecurity) && Number.isFinite(months)) e.foodSecurity.storageMonths = months;
      const dp = generateDefenseProfile(r, keepOfRecord(e));
      r.defenseProfile = { ...(r.defenseProfile || {}), scores: dp.scores, readiness: dp.readiness, economicGates: dp.economicGates };
      if (isRec(e.safetyProfile)) e.safetyProfile.safetyLabel = generateSafetyProfile(cfg, r.tier, inst).safetyLabel;
      if (isRec(r.powerStructure?.publicLegitimacy)) {
        // V53 cures UNIT E (RULING V3 (6)): under the record's laws, as every other call here reads them off its config; this
        // callee takes its law as its fourth argument, read off the record by the law's own resolver (else the dark version 1)
        const pl = computePublicLegitimacy(e, dp.readiness.label, r.tier, resolveFortuneLawVersion(r));
        Object.assign(r.powerStructure.publicLegitimacy, { score: pl.score, label: pl.label, color: pl.color, bg: pl.bg });
      }
      r.publicProse = composePublicProse(r);
      return r;
    };

    const plain = veil.writeShareVeil({}, []);
    towns = [];
    for (const [i, [size, crisis]] of BIRTHS.entries()) {
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      const born = generateSettlementPipeline(cfg, null, { seed: `vr26-${size}-${crisis || 'calm'}-${i}`, customContent: {} });
      const stored = clone(withPublicProse(born, composePublicProse(born)));
      for (const shareDm of [false, true]) {
        const slug = `vr26-${i}-${shareDm ? 'dm' : 'p'}`;
        await storeShare(db, { town: stored, slug, overrides: plain, shareDm });
        const served = (await db.query('select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d;
        towns.push({ seed: `${size}-${crisis || 'calm'}-${i}${shareDm ? ' +DM' : ''}`, stored, served, hidden: (stored.institutions || []).filter((h) => isHideableHouse(h)).length });
      }
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  const isProse = (r) => r.path.startsWith('^publicProse');

  it('TOTAL: every diffuse row is re-derived here or names what is not served', () => {
    expect(rows.length).toBeGreaterThan(10);
    expect(rows.filter((r) => !DERIVED.has(r.id) && !isProse(r) && !NOT_SERVED[r.id]).map((r) => r.id)).toEqual([]);
    expect(towns.every((t) => isRec(t.served))).toBe(true);
    expect(towns.filter((t) => t.hidden > 0).length).toBeGreaterThan(2);
  });

  it('FIDELITY: on the stored town the re-derivation equals the stored value (else named, shrink-only)', () => {
    const unfaithful = new Set();
    for (const t of towns) {
      const f = revisit(t.stored);
      if (!f) continue;
      for (const r of rows.filter((x) => DERIVED.has(x.id) || isProse(x))) if (!sameAt(t.stored, f, new RegExp(r.path))) unfaithful.add(r.id);
    }
    if (process.env.VR26_REPORT) writeFileSync(`${process.env.VR26_REPORT}.unfaithful`, JSON.stringify([...unfaithful].sort()));
    expect([...unfaithful].sort()).toEqual([...KNOWN_UNFAITHFUL].sort());
  }, ARM_TIMEOUT_MS);

  it('RED: a served value moved by hand is caught', () => {
    const t = towns.find((x) => revisit(x.served) && Number.isFinite(x.served?.powerStructure?.publicLegitimacy?.score));
    expect(t).toBeTruthy();
    const moved = clone(t.served); moved.powerStructure.publicLegitimacy.score += 7;
    const re = new RegExp(rows.find((r) => r.id === 'legitimacy.score').path);
    expect(sameAt(moved, revisit(t.served), re)).toBe(false);
  });

  it('MAIN: the rows a visitor re-derives otherwise are exactly the known ones (shrink-only; R3/R6 empty it)', () => {
    const where = new Map();
    for (const t of towns) {
      const r = revisit(t.served);
      if (!r) continue;
      for (const row of rows.filter((x) => (DERIVED.has(x.id) || isProse(x)) && !KNOWN_UNFAITHFUL.has(x.id))) {
        if (sameAt(t.served, r, new RegExp(row.path))) continue;
        const w = where.get(row.id) || { hidden: [], open: [] };
        (t.hidden ? w.hidden : w.open).push(t.seed);
        where.set(row.id, w);
      }
    }
    if (process.env.VR26_REPORT) writeFileSync(process.env.VR26_REPORT, JSON.stringify(Object.fromEntries(where), null, 1));
    const inverting = [...where].filter(([, w]) => w.hidden.length && !w.open.length).map(([id]) => id).sort();
    const notRederivable = [...where].filter(([, w]) => w.open.length).map(([id]) => id).sort();
    expect(inverting).toEqual([...KNOWN_INVERTING].sort());
    expect(notRederivable).toEqual([...KNOWN_NOT_REDERIVABLE].sort());
  }, ARM_TIMEOUT_MS);
});
