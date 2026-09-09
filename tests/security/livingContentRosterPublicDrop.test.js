/**
 * livingContentRosterPublicDrop.test.js — O-11 PATH 1: the living-content roster
 * NEVER reaches a public projection (lane L-MAT, the townMapEditsPublicDrop idiom
 * in its stronger anchored form).
 *
 * ⭐ WHY THE DROP IS THE RULING AND NOT A GAP. `settlement.customContentRoster`
 * records EVERY reviewed living-content definition that was in scope for a run —
 * adopted or not — so it is an author's unadopted homebrew library, not a
 * property of the town. Every row carries the five stable, account-scoped
 * identifiers of `CUSTOM_DEFINITION_IDENTITY_KEYS`, which is exactly what would
 * let an observer correlate one private definition across two published worlds.
 * The key has exactly ONE reader in `src/` — the account-import remap, which
 * `livingContentRoster.js` names in its "⚠ AMENDED (lane L-MAT, O-11 path 2)"
 * paragraph — and no display, export or projection
 * surface reads it at all, so allowlisting it would be pure exposure with zero
 * product value. (This header used to say "nothing in `src/` READS the key",
 * citing that same file's header, which car 5 of this very consist had already
 * amended to name the reader. Corrected at §912, DEF-12. ⛔ AND THAT CORRECTION
 * SHIPPED A LINE NUMBER — `livingContentRoster.js:37` — WHICH WAS ALREADY WRONG AT
 * ITS OWN COMMIT, because the same car pushed the paragraph down by adding header
 * lines above it. A line number cited across files is a hypothesis with a decay
 * rate; the marker above is not. Cited by marker at §913.)
 * The fail-closed root allowlist already drops it; this file holds that to the
 * tree so the day someone adds it is a deliberate day with an SQL twin.
 *
 * ⛔ WHY THIS FILE EXISTS WHEN `gallerySanitizeAllowlist.contract.test.js`
 * ALREADY ROUND-TRIPS A REAL SETTLEMENT. That suite generates a DORMANT world
 * (`customContent: {}`, no law marker), so no roster is ever built and its
 * round-trip proves exactly nothing about this key: the roster is absent from the
 * projection because it was absent from the input. Every behavioural arm below
 * therefore generates a LIT world with the reference pack and asserts the key IS
 * THERE before asserting it is gone.
 *
 * SCOPE — READ THE DM-FULL ARM. The DEFAULT (fail-closed) projection is the
 * shipped anonymous-result / pre-publish-preview path and it drops both records.
 * The `full: true` DM-share projection does NOT run the root allowlist at all —
 * it deep-clones and deletes a named list — so it used to carry both through.
 * §912 (R-G) landed the CLIENT half of that drop in `publicSafe.js`, beside the
 * existing `dmNotes` / seed-carrier / `latentPantheon` strips, after reading the
 * share model: `gallery_share_dm` publishes to "anyone who opens this gallery
 * page", so it is not a transfer to the owner's own other device and no reader of
 * a full share is entitled to the author's unadopted library.
 * ⚠ THE SERVER TWIN IS STILL OWED AND IS OWNER-GATED — `_gallery_dm_full_json`
 * (supabase migrations 121/129) re-issues both keys, so a shared dossier read
 * back from the server still carries them. Same V1 boundary
 * `townMapEditsPublicDrop.test.js` records for `mapEdits`, same reason.
 *
 * ⭐⭐ AND THE ONE FACT A LIGHTING ENGINEER MET BEFORE ANY OF THIS, NOW DISCHARGED
 * (§912, R-J; cured by lane LIGHT, car 1a). `loadLivingContentRoster` HAD NO CALLER:
 * `livingContentSeam.js` defined it and nothing in `src/` invoked it (the occurrence
 * count this sentence used to carry was false at its own commit — the sentence was
 * one of the occurrences — and was deleted at §913), so lighting the dial did not
 * produce leaky worlds, it produced NO worlds: a lit config threw
 * `[livingContentSeam] v2 world, roster payload not loaded` out of
 * `generateSettlementPipeline`. That outage, and not the dial, was the true ground of
 * every inertness claim in this file, and it is gone: the create boundary's
 * `loadGenerationLawPayloads()` is awaited by every module that can reach the
 * pipeline. The arms below still arm the seam explicitly (see the
 * `registerLivingContentRosterBuilder` call) because they are synchronous.
 *
 * @enforced-by this test
 */
import { describe, expect, it } from 'vitest';

import { toPublicSafe, PUBLIC_TOPLEVEL_KEYS, PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  DEFAULT_LIVING_CONTENT_LAW_VERSION,
  LIVING_CONTENT_LAW_CONFIG_KEY,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
} from '../../src/domain/content/livingContentLawVersion.js';
import {
  NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
} from '../../src/domain/content/livingContentLaw.js';
import {
  CUSTOM_DEFINITION_IDENTITY_KEYS,
} from '../../src/domain/content/customDefinitionIdentityProjection.js';
import {
  registerLivingContentRosterBuilder,
} from '../../src/domain/content/livingContentSeam.js';
import { buildLivingContentRoster } from '../../src/domain/content/livingContentRoster.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  customContentReferencePack,
  identifyCustomContentPack,
} from '../fixtures/customContentReferencePack.js';

// The pipeline throws rather than degrading when a v2 world finds no builder, so
// arming the seam is what makes every lit arm below take production's own path.
registerLivingContentRosterBuilder(buildLivingContentRoster);

const ROSTER_KEY = 'customContentRoster';
const PROVENANCE_KEY = 'customContentProvenance';

const CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  monsterThreat: 'civilized',
});

const LIT_CONFIG = Object.freeze({
  ...CONFIG,
  [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
});

/** A world that really carries a roster — the only input that can prove a drop. */
function litSettlement(seed = 'l-mat-o11-public') {
  return generateSettlementPipeline(LIT_CONFIG, null, {
    seed,
    customContent: identifyCustomContentPack(customContentReferencePack()),
  });
}

describe('O-11 path 1 — the living-content roster is dropped from the public projection', () => {
  it('the roster and the provenance receipt are NOT allowlisted top-level public keys', () => {
    // The anchored form: `config` is a live sibling that travels the same
    // allowlist, so an emptied or renamed allowlist reds on the anchor rather
    // than passing as a correct exclusion.
    expectAbsentWithAnchor(
      [...PUBLIC_TOPLEVEL_KEYS], ROSTER_KEY, 'config', 'PUBLIC_TOPLEVEL_KEYS',
    );
    expectAbsentWithAnchor(
      [...PUBLIC_TOPLEVEL_KEYS], PROVENANCE_KEY, 'config', 'PUBLIC_TOPLEVEL_KEYS',
    );
  });

  it('⭐ BEHAVIOURAL: a LIT world really carries a roster, and the default projection drops it', () => {
    const settlement = litSettlement();
    // ── THE ANTI-VACUITY HALF, AND IT IS THE WHOLE REASON THIS FILE EXISTS ──
    const roster = settlement[ROSTER_KEY];
    expect(
      roster,
      'the lit generation produced no roster — every drop assertion below would be'
      + ' green because there was nothing to drop',
    ).toBeTruthy();
    const rowCount = Object.values(roster.buckets || {})
      .reduce((total, rows) => total + rows.length, 0);
    expect(rowCount, 'the roster is empty — the drop proves nothing').toBeGreaterThan(0);

    const pub = toPublicSafe(settlement);
    // §912 DEF-9: through the anchoring helper, not a bare `in` test, so
    // `negativeAssertionAnchor.walker` can SEE this negative. `config` is the
    // anchor because it travels the same root allowlist as the roster — a
    // projection that returned nothing reds on the anchor instead of passing.
    expectAbsentWithAnchor(Object.keys(pub), ROSTER_KEY, 'config', 'default public projection');
    // …and the allowlisted siblings it rides beside really do survive, so the
    // drop is a selection rather than a projection that returned nothing.
    expect(pub.name).toBe(settlement.name);
    expect(pub.tier).toBe(settlement.tier);
    expect(Array.isArray(pub.institutions)).toBe(true);
    expect(pub.config).toBeTruthy();
  });

  it('BEHAVIOURAL: the provenance receipt is dropped from the same projection', () => {
    const settlement = litSettlement();
    expect(
      settlement[PROVENANCE_KEY],
      'the reference pack produced no provenance receipt — this drop would be vacuous',
    ).toBeTruthy();
    expectAbsentWithAnchor(
      Object.keys(toPublicSafe(settlement)), PROVENANCE_KEY, 'config', 'default public projection',
    );
  });

  it('the deeper denylist would strip NOTHING here — the drop is the allowlist\'s alone', () => {
    // Recorded rather than assumed: if a roster key happened to match
    // PRIVATE_KEY_RE, a reader could believe the deeper denylist was a second
    // line of defence for this key. It is not. The root allowlist is the only
    // thing standing between the roster and a public read.
    // ⛔ DERIVED FROM THE REAL ROSTER, NEVER HAND-TRANSCRIBED (§912, DEF-7). The
    // literal that used to sit here named eleven keys, and the builder copies
    // every manifest-declared authored field on top of them — so the claim "no
    // roster key matches the denylist" was being tested against a third of the
    // real surface, and `toBeGreaterThan(6)` over an 11-element literal could not
    // fail. A future manifest field named `dmGuidance` or `notes` would falsify
    // the claim while this arm stayed green. Reading the generated row instead
    // means the arm grows with the roster, which is the only version of it worth
    // having.
    const settlement = litSettlement();
    const roster = settlement[ROSTER_KEY];
    expect(roster, 'no roster was generated — the key census below would be empty').toBeTruthy();
    const rows = Object.values(roster.buckets || {}).flat();
    expect(rows.length, 'the roster has no rows — there are no row keys to census').toBeGreaterThan(0);
    const rosterKeys = [...new Set([
      ROSTER_KEY,
      ...Object.keys(roster),
      ...rows.flatMap(row => Object.keys(row)),
    ])];
    // The count is READ OFF THE REAL ROW rather than asserted against a hand
    // number: it must at least cover the identity projection plus the roster's own
    // structural keys, and it is in fact far wider.
    expect(
      rosterKeys.length,
      `the roster surface collapsed to ${rosterKeys.length} keys — this census is no longer`
      + ' measuring the real record',
    ).toBeGreaterThan(CUSTOM_DEFINITION_IDENTITY_KEYS.length + 2);
    // Non-vacuity for the census itself: the account-scoped identifiers this file
    // exists to keep out of public view really are among the keys measured.
    // ⛔ UNCONDITIONAL, AND THE GUARD THAT USED TO STAND HERE WAS THE DEF-6 TAUTOLOGY
    // WEARING DEF-7's LABEL (§913). The deleted form was
    // `if (rows.some(row => Object.hasOwn(row, key))) expect(rosterKeys).toContain(key)`,
    // and `rosterKeys` is built from `rows.flatMap(row => Object.keys(row))` two
    // statements up — so the guard and the assertion were computed from one source and
    // `Object.hasOwn(row, key)` ENTAILED `key ∈ rosterKeys`. The arm could not fail.
    // Worse, the regression it read as guarding — the identity projection ceasing to
    // emit an account-scoped identifier — turned the `if` FALSE and the arm silently
    // green. Measured, once per key: dropping any one of the five from every row left
    // the guarded arm GREEN 5 times out of 5 and reds this form 5 times out of 5.
    expect(rosterKeys).toEqual(expect.arrayContaining(CUSTOM_DEFINITION_IDENTITY_KEYS));
    expect(rosterKeys.filter(key => PRIVATE_KEY_RE.test(key))).toEqual([]);
    // The anchor for that emptiness: the regex is live and still convicts the
    // keys it exists for.
    expect(PRIVATE_KEY_RE.test('dmNotes')).toBe(true);
    expect(PRIVATE_KEY_RE.test('latentPantheon')).toBe(true);
  });

  it('⚠ RECORDED (R-D): config._livingContentLawVersion DOES reach the public projection', () => {
    // Measured and RECORDED, not changed. The marker rides `settlement.config`,
    // which is allowlisted, and no denylist token matches it — so a lit world's
    // law version is publicly visible. That is the same kind of fact as
    // `schemaVersion` and `generatorVersion`, both of which are allowlisted
    // outright: it says which generation law produced the world, not anything
    // about the author's content. `customContentProvenance` is held to the
    // opposite line in the same idiom above — it already ships on every run with
    // a pack, and it is dropped.
    const pub = toPublicSafe(litSettlement());
    expect(pub.config[LIVING_CONTENT_LAW_CONFIG_KEY])
      .toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(PUBLIC_TOPLEVEL_KEYS).toContain('schemaVersion');
    expect(PUBLIC_TOPLEVEL_KEYS).toContain('generatorVersion');
  });

  it('⛔ THE DM-FULL PROJECTION DROPS BOTH RECORDS TOO — and its SQL twin is still owed', () => {
    // §912 R-G. `toPublicSafe(s, { full: true })` does not run the root allowlist
    // at all — it deep-clones and deletes a named list — so before this car both
    // records survived a DM share. They are now deleted explicitly, beside
    // `dmNotes`, the two seed carriers and `latentPantheon`, each of which is
    // stripped from full mode for exactly this reason.
    //
    // ⛔ AND THE OPT-IN NEVER COVERED THEM. `gallery_share_dm` publishes the
    // owner's authored DM-private content — "Secrets, plot hooks, NPC goals and
    // relationships, your DM notes, and the DM Compass … publicly visible to
    // anyone who opens this gallery page", in the toggle's own words. It is a
    // PUBLICATION switch, not a transfer to the owner's other device, so no reader
    // of a full share is entitled to the author's unadopted homebrew library, and
    // no surface reads either key off a shared dossier.
    const settlement = litSettlement();
    // THE LIVENESS HALF: the input really carries both records, so the drop below
    // is a removal rather than an absence.
    expect(
      settlement[ROSTER_KEY],
      'the lit generation produced no roster — the full-mode drop would be vacuous',
    ).toBeTruthy();
    expect(settlement[PROVENANCE_KEY]).toBeTruthy();

    const full = toPublicSafe(settlement, { full: true });
    expectAbsentWithAnchor(Object.keys(full), ROSTER_KEY, 'config', 'DM-full projection');
    expectAbsentWithAnchor(Object.keys(full), PROVENANCE_KEY, 'config', 'DM-full projection');
    // …and full mode still is full: the DM-private content the owner DID opt to
    // publish survives, so this is a selection and not a second allowlist.
    expect(full.name).toBe(settlement.name);
    expect(full.config).toBeTruthy();

    // ⛔ THE HALF THAT IS NOT LANDED, ASSERTED SO THE LIGHTING DAY MUST VISIT THIS
    // FILE. The SERVER re-issues the DM-full payload from `_gallery_dm_full_json`
    // (migrations 121/129), which has no delete for either key — so a shared
    // dossier read back through the server still carries them. That twin is a
    // migration and is owner-gated; this arm is the tripwire that keeps it from
    // being forgotten.
    expect(
      NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
      'THE DIAL HAS BEEN LIT. The CLIENT half of the DM-full drop is landed (publicSafe.js),'
      + ' but its SERVER twin is NOT: `_gallery_dm_full_json` (supabase migrations 121/129)'
      + ' still re-issues customContentRoster and customContentProvenance, so a DM-shared'
      + ' dossier read back from the server carries the author\'s private library. Land that'
      + ' migration before this ships.'
      + ' ⚠ AND EXPECT A TOTAL GENERATION OUTAGE FIRST: `loadLivingContentRoster` has NO'
      + ' caller in src/ (livingContentSeam.js defines it; nothing calls it), so a lit config'
      + ' throws "[livingContentSeam] v2 world, roster payload not loaded" before any world'
      + ' is built. Wire the loader before reading anything else in this file as a symptom.',
    ).toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
  });
});
