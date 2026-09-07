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
 * And nothing in `src/` READS the key (livingContentRoster.js says so in its own
 * header), so allowlisting it would be pure exposure with zero product value.
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
 * shipped anonymous-result / pre-publish-preview path and it drops the roster.
 * The `full: true` DM-share projection does NOT run the root allowlist at all,
 * and it is MEASURED below to carry the roster through. That is the same V1
 * boundary `townMapEditsPublicDrop.test.js` records for `mapEdits`, and the same
 * reason applies: the DM-share opt-in needs its SQL-sanitizer twin migration, so
 * the drop lands with that car and not this one.
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
    expect(ROSTER_KEY in pub).toBe(false);
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
    expect(PROVENANCE_KEY in toPublicSafe(settlement)).toBe(false);
  });

  it('the deeper denylist would strip NOTHING here — the drop is the allowlist\'s alone', () => {
    // Recorded rather than assumed: if a roster key happened to match
    // PRIVATE_KEY_RE, a reader could believe the deeper denylist was a second
    // line of defence for this key. It is not. The root allowlist is the only
    // thing standing between the roster and a public read.
    const rosterKeys = [
      'schemaVersion', 'buckets', 'source', 'isCustom', 'customDefinitionCategory',
      'localUid', ROSTER_KEY, ...CUSTOM_DEFINITION_IDENTITY_KEYS,
    ];
    expect(rosterKeys.length).toBeGreaterThan(6);
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

  it('⛔ THE DM-FULL PROJECTION DOES NOT DROP THE ROSTER, and the dormant dial is why that is safe', () => {
    // MEASURED, and it CORRECTS the reading that the allowlist protects every
    // public path: `toPublicSafe(s, { full: true })` does not run the root
    // allowlist at all — it deep-clones and deletes a named list — so the roster
    // and the provenance receipt both survive a DM share.
    const settlement = litSettlement();
    const full = toPublicSafe(settlement, { full: true });
    expect(ROSTER_KEY in full).toBe(true);
    expect(PROVENANCE_KEY in full).toBe(true);
    // ⛔ THE ONLY REASON THAT IS NOT A LEAK TODAY, ASSERTED SO THE LIGHTING DAY
    // MUST VISIT THIS FILE. While the dial sits at the dormant default no
    // generated world carries a roster at all, so there is nothing for the
    // DM-share path to carry. Flipping the dial reds HERE, by design: whoever
    // lights the law must decide whether the DM-full projection drops the roster
    // — which needs its `_gallery_dm_full_json` SQL twin, exactly as the
    // mapEdits precedent records for the same §6 opt-in.
    expect(
      NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
      'THE DIAL HAS BEEN LIT. Shipped worlds can now carry customContentRoster, and the'
      + ' DM-full projection (gallery_share_dm) does NOT drop it — see the measurement in'
      + ' this test. Decide the DM-full drop and land its SQL twin before this ships.',
    ).toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
  });
});
