/**
 * livingContentLawWiring.test.js — THE PROMISE, RE-PROVEN BY EXECUTION ON THE DAY
 * THE LIVING-CONTENT MINT ACQUIRED A CALLER (lane L-MAT).
 *
 * ⭐ WHY THIS FILE EXISTS SEPARATELY FROM `livingContentMaterialization.test.js`.
 * That file proves what the law DOES when a config asks for it: the roster
 * materializes, adoption does not. It says nothing about who may ask, because
 * until this lane nobody could — `newSettlementLivingContentLaw()` had no caller
 * anywhere in `src/`, so every lit world in that file is lit by a hand-written
 * `_livingContentLawVersion: 2`. This lane spread the mint into `birthConfig`,
 * which means a BIRTH now decides the law of every new world. THE PROMISE ("a
 * seed is a STARTING world forever, lived history immutable") is exactly the
 * guarantee a create boundary can break, and the L-UI-MAT brief named the shape
 * to watch: A MARKER STAMPED ON AN EXISTING WORLD AT REGEN. That STOP was not
 * fireable while the mint had no caller. This is the day it is, so it is fired
 * here deliberately and proved not to fire in the product.
 *
 * ⭐⭐ THE DIAL IS LIT SINCE 2026-09-08, AND THE FILE'S TWO HALVES SWAPPED SIDES
 * RATHER THAN COLLAPSING. This paragraph read "THE DIAL STAYS AT 1, AND THAT IS
 * WHY THIS FILE HAS TWO HALVES": with the dial dormant the mint returned `{}`, so
 * a test that only ran the product path was green because NOTHING HAPPENED, and
 * every dark arm was paired with a LIT one driven through a mocked lit dial. The
 * product path is the LIT one now, so the pairing is inverted: the lit arms are
 * the product truth and the DARK arms are driven through `boundaryWithDarkLaw()`.
 * Both halves are kept, and keeping the dark half is not tidiness — the dial is
 * one line in BOTH directions, and an estate that has stopped exercising the
 * dormant branch cannot revert it on a bad day.
 *
 * THE LIFECYCLE PATHS, each with its own way of breaking the promise:
 *   CREATE      — a birth mints; proved to write zero bytes while dormant, and
 *                 proved to really mint when lit.
 *   CREATE/CLAMP— a LIT marker arriving through the wizard form CANNOT birth a v2
 *                 world (§912, DEF-2). This is the path the file originally
 *                 argued could not exist; see the correction below.
 *   READ        — the version is resolved from the world's own config and NEVER
 *                 from the dial, so flipping the dial cannot re-birth old worlds.
 *   REGENERATE  — `regenSection` reads `settlement.config` FIRST. THE STOP.
 *   UNDO/CLONE  — the config bag survives the clone seam intact, marker and all.
 *   PERSIST     — no previous world's config reaches a birth: the one reader that did,
 *                 `geographyLockedConfig`, was retired with the world locks (2026-09-17).
 *   IMPORT      — out of scope here; the account-import path is proved in
 *                 `tests/store/accountImportSlice.test.js`, the gallery path in
 *                 `tests/lib/importScrub.test.js` and
 *                 `tests/store/campaignSlice.galleryImport.test.js`, and the
 *                 reconciliation path in `tests/lib/importReconciliation.test.js`.
 *
 * ⭐⭐ THE OUTAGE THAT OUTRANKED EVERY INERTNESS CLAIM IN THIS FILE IS CURED (§912,
 * R-J; cured by lane LIGHT, car 1a). `loadLivingContentRoster` HAD NO CALLER in
 * `src/` — `livingContentSeam.js` defined it and nothing invoked it. (The
 * enumeration that used to stand here — "only its own definition and one comment
 * beside it" — was self-falsifying, this sentence being a further occurrence;
 * deleted at §913, the no-caller fact kept.) So lighting the dial did not produce v2
 * worlds; it produced a THROW, `[livingContentSeam] v2 world, roster payload not
 * loaded`, out of `generateSettlementPipeline`. That outage, and not the dial, was
 * the real reason no shipped world carried a roster — the dial's gate reads the
 * WORLD'S config and can be satisfied by an import file. The caller is now
 * `loadGenerationLawPayloads()` on the create boundary, awaited by every module that
 * can reach the pipeline. The arms below still arm the seam BY HAND, and now for a
 * different reason: this file is synchronous and the product's edge is async, so
 * hand-registration is how a synchronous arm reaches the same builder.
 *
 * @enforced-by this test
 */
import { describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  birthConfig,
  GENERATION_LAWS,
} from '../../src/domain/density/densityCreateBoundary.js';
import {
  NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
  newSettlementLivingContentLaw,
} from '../../src/domain/content/livingContentLaw.js';
import {
  DEFAULT_LIVING_CONTENT_LAW_VERSION,
  LIVING_CONTENT_LAW_CONFIG_KEY,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
  materializesLivingContent,
  resolveLivingContentLawVersion,
} from '../../src/domain/content/livingContentLawVersion.js';
import * as locksPreservation from '../../src/domain/locksPreservation.js';
import { deepClone } from '../../src/domain/clone.js';
import { isAllowedConfigKey } from '../../src/store/configSlice.js';
// The Library's Load runs a saved `settlement._config` through this before handing
// it to `updateConfig`; the clamp arm below walks that exact hop rather than
// asserting about it.
import { migrateSettlementConfig } from '../../src/lib/settlementConfigMigration.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
// The three roster readers this file can drive directly. The two inside
// `accountImportBody.js` are driven end to end by tests/store/accountImportSlice,
// and the reconciliation drop by tests/lib/importReconciliation.
import { scrubGalleryImportLivingContent } from '../../src/lib/importScrub.js';
import {
  remapAccountSettlementLivingContentRoster,
} from '../../src/lib/accountSettlementContentPortability.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import {
  customContentReferencePack,
  identifyCustomContentPack,
} from '../fixtures/customContentReferencePack.js';
import {
  registerLivingContentRosterBuilder,
} from '../../src/domain/content/livingContentSeam.js';
import { buildLivingContentRoster } from '../../src/domain/content/livingContentRoster.js';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

// ⛔ THE SEAM MUST BE ARMED BEFORE ANY LIT PIPELINE RUN. The roster payload is
// reached through a dynamic import in production, and the pipeline THROWS rather
// than quietly degrading when a v2 world finds no builder registered. Registering
// the real builder makes the lit arms below take the path production WOULD take
// after `loadGenerationLawPayloads()` — and, more to the point here, it means a
// DARK arm that accidentally went lit would surface as a wrong world rather than
// as a throw that could be mistaken for the law being off.
// ⭐ THE TENSE MOVED ON THE LIGHTING DAY (lane LIGHT, car 1a). It read "WOULD take"
// here, and the §912 R-J ground was true then: nothing in `src/` called
// `loadLivingContentRoster`, so production reached the throw and not the builder.
// The loader has a caller now, on every path that can reach the pipeline; the
// hand-registration stays because this file is synchronous.
registerLivingContentRosterBuilder(buildLivingContentRoster);

const CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  monsterThreat: 'civilized',
});

/** A config that asks for the law EXPLICITLY. It was the ONLY way to get a v2
 *  world while the dial was dormant; since the lighting it is how an arm names a
 *  world's law without depending on the dial, which is the honest shape for a
 *  file whose subject is the difference between the two. */
const LIT_CONFIG = Object.freeze({
  ...CONFIG,
  [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
});

const ROSTER_KEY = 'customContentRoster';

/** Re-import the create boundary with the living-content law's module replaced by
 *  a LIT one. This is the "fire the STOP deliberately" seam: the product dial is
 *  never touched, and the mocked module is torn down with the module registry. */
async function boundaryWithLitLaw() {
  vi.resetModules();
  vi.doMock('../../src/domain/content/livingContentLaw.js', () => ({
    LIVING_CONTENT_BUCKETS: Object.freeze(['deities', 'factions', 'stressors', 'traditions']),
    NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION: ROSTER_LIVING_CONTENT_LAW_VERSION,
    newSettlementLivingContentLaw: () => ({
      [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
    }),
  }));
  const mod = await import('../../src/domain/density/densityCreateBoundary.js');
  return mod;
}

/** ⭐ THE MIRROR OF `boundaryWithLitLaw`, AND THE DIAL'S FLIP IS WHY IT EXISTS
 *  (2026-09-08, lane LIGHT car 1b). Until the dial was lit the PRODUCT was the
 *  dark half and the lit half had to be mocked; now it is the other way round.
 *  Every dark arm below is driven through this so it keeps proving what it always
 *  proved — that the mint writes nothing at the dormant dial, which is what makes
 *  reverting the dial a one-line act rather than a hope. */
async function boundaryWithDarkLaw() {
  vi.resetModules();
  vi.doMock('../../src/domain/content/livingContentLaw.js', () => ({
    LIVING_CONTENT_BUCKETS: Object.freeze(['deities', 'factions', 'stressors', 'traditions']),
    NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION: DEFAULT_LIVING_CONTENT_LAW_VERSION,
    newSettlementLivingContentLaw: () => ({}),
  }));
  return import('../../src/domain/density/densityCreateBoundary.js');
}

/** A settlement's bytes with BOTH config echoes of the law marker removed.
 *
 *  ⚠ THE MARKER RIDES TWO ECHOES, `config` AND `_config`, and this is the
 *  materialization suite's own measured helper rather than a second opinion: a
 *  first cut there stripped only `config` and missed by exactly 29 bytes, the
 *  literal length of `,"_livingContentLawVersion":2`. Stripping the marker is
 *  what lets a byte comparison answer the question this file actually asks —
 *  whether lighting the dial moved anything OTHER than the law it declares. */
function worldBytesWithoutMarker(settlement) {
  const strip = (bag) => {
    if (!bag || typeof bag !== 'object') return bag;
    const { [LIVING_CONTENT_LAW_CONFIG_KEY]: _marker, ...rest } = bag;
    return rest;
  };
  return JSON.stringify({
    ...settlement,
    config: strip(settlement.config),
    _config: strip(settlement._config),
  });
}

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { ...CONFIG },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
  setActivePricingMoment: () => {},
});

describe('the living-content law is WIRED, and THE PROMISE survives it', () => {
  // ── THE REGISTER AND THE DIAL ──────────────────────────────────────────────
  it('⭐ the register says WIRED and the dial says LIT — the separate owner act was taken', () => {
    // ⭐⭐ THIS ARM READ `the dial says DORMANT — wiring is not lighting` UNTIL
    // 2026-09-08. The owner took the separate act, so the assertion is inverted
    // rather than relaxed: a dial arm that accepts either value cannot see the
    // dial move, and this dial is one line in both directions.
    expect(
      GENERATION_LAWS.livingContent.wiring,
      'this file is written against a WIRED law; if the row went back to UNWIRED the'
      + ' arms below are proving something about a mint nothing calls',
    ).toBe('WIRED');
    expect(GENERATION_LAWS.livingContent.configKey).toBe(LIVING_CONTENT_LAW_CONFIG_KEY);
    expect(
      NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
      'the dial is LIT (owner, 2026-09-08). If this reads 1 the dial was reverted, which is a'
      + ' lawful one-line act — but every lit arm below is then asserting about a mint that'
      + ' writes nothing, so revert this arm with it.',
    ).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(newSettlementLivingContentLaw())
      .toEqual({ [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION });
  });

  // ── CREATE ─────────────────────────────────────────────────────────────────
  it('⭐ CREATE (LIT, the product path): birthConfig writes the law marker and NOTHING else', () => {
    const minted = birthConfig({ ...CONFIG });
    expect(minted).toEqual({
      ...CONFIG, [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
    });
    // EXACTLY ONE KEY MORE than the config handed in — the arm that would catch a
    // mint that started writing a second field, or the density mint waking up.
    expect(Object.keys(minted).sort())
      .toEqual([...Object.keys(CONFIG), LIVING_CONTENT_LAW_CONFIG_KEY].sort());
    // Null/undefined tolerance is the boundary's own contract, unchanged by the
    // second mint being spread beside the first.
    expect(birthConfig(null))
      .toEqual({ [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION });
    expect(birthConfig(undefined))
      .toEqual({ [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION });
  });

  it('CREATE (dark, fired deliberately): at the dormant dial birthConfig still writes not one byte', () => {
    // ⭐ THE ARM THIS FILE USED TO RUN AGAINST THE PRODUCT, KEPT AND DRIVEN
    // THROUGH A MOCKED DARK LAW. It is what makes reverting the dial a one-line
    // act rather than a hope: the mint's dormant branch is exercised, not argued.
    return boundaryWithDarkLaw().then((mod) => {
      const minted = mod.birthConfig({ ...CONFIG });
      expect(minted).toEqual({ ...CONFIG });
      expect(Object.keys(minted).sort()).toEqual(Object.keys(CONFIG).sort());
      expect(minted[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();
      expect(mod.birthConfig(null)).toEqual({});
      expect(mod.birthConfig(undefined)).toEqual({});
      vi.doUnmock('../../src/domain/content/livingContentLaw.js');
      vi.resetModules();
    });
  });

  it('⭐⭐ CREATE (THE SAME-SEED CONTROL, LIT): a birth through the boundary is the same world but the law it declares', () => {
    // ⭐⭐ THE ARM THE WHOLE LIGHTING RESTS ON, AND ITS CLAIM CHANGED SHAPE ON
    // 2026-09-08 WITHOUT WEAKENING. It used to require the two settlements to be
    // IDENTICAL, which was the strongest thing a dormant dial could say. A lit
    // dial writes one config key by definition, so identity would now be a claim
    // that the dial does not work. What it must still say — and does — is that
    // NOTHING ELSE MOVED: the same seed makes the same town, field for field,
    // once the marker's two config echoes are removed.
    const seed = 'l-mat-wiring-same-seed';
    const through = generateSettlementPipeline(birthConfig({ ...CONFIG }), null, { seed });
    const raw = generateSettlementPipeline({ ...CONFIG }, null, { seed });
    expect(worldBytesWithoutMarker(through)).toBe(worldBytesWithoutMarker(raw));
    // …and the marker really is there, so the comparison above is a subtraction
    // and not a description of two identical inputs.
    expect(resolveLivingContentLawVersion(through.config))
      .toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(resolveLivingContentLawVersion(raw.config))
      .toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
    // THE ROSTER IS ABSENT ON BOTH, and that is the law and not an accident: this
    // run's reviewed environment holds no living-content definition, so the roster
    // has nothing to record and no key is written. Lighting the dial makes a world
    // ELIGIBLE for a roster; it does not give it one.
    expect(through[ROSTER_KEY]).toBeUndefined();
    expect(raw[ROSTER_KEY]).toBeUndefined();
  });

  it('⛔ CREATE (THE CLAMP): a LIT marker arriving through the wizard form cannot birth a v2 world', () => {
    // DEF-2. The hole this arm closes was reachable on a SHIPPED DARK BUILD: the
    // Library's Load ("Apply Saved Configuration & Regenerate") hydrates the wizard
    // form from a saved `settlement._config`, `updateConfig` admits the underscore
    // family by prefix, and a spread of `{}` — which is what the dormant mint
    // returns — deletes nothing. So an imported v2 world's config, loaded and
    // regenerated, used to mint a roster on a build whose dial says v1.
    //
    // Each hop of that path is measured here rather than assumed, so the arm
    // cannot go green because the path stopped existing.
    const hydrated = migrateSettlementConfig({ ...LIT_CONFIG });
    expect(
      hydrated[LIVING_CONTENT_LAW_CONFIG_KEY],
      'migrateSettlementConfig stopped carrying the marker — this arm no longer tests the'
      + ' Library-Load path it was written for',
    ).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(isAllowedConfigKey(LIVING_CONTENT_LAW_CONFIG_KEY)).toBe(true);

    // THE POSITIVE CONTROL, and it is the defect itself: that hydrated config
    // really does mint a roster on this dark build when it reaches the builder
    // unclamped. A green below without this line would be equally true of a build
    // where nothing can mint a roster at all.
    const pack = { deities: [{ localUid: 'lu-clamp', name: 'Hydrated Patron' }] };
    expect(
      buildLivingContentRoster(pack, hydrated),
      'the hydrated lit config no longer mints a roster — the clamp arm below is vacuous',
    ).not.toBeNull();

    // ⭐⭐ AND THE CLAMP IS DRIVEN AT THE DORMANT DIAL, WHICH IS THE ONLY DIAL IT
    // MATTERS AT — a fact the lighting day made visible rather than changed
    // (2026-09-08, lane LIGHT car 1b). `birthConfig` spreads the mint LAST, so a
    // non-empty mint always wins and the marker cannot survive whatever the
    // incoming config says. The defect DEF-2 cured was a spread of `{}`, which
    // deletes nothing: at the dormant dial, and only there, the destructure is the
    // whole of what keeps a birth's law the dial's law. Running this arm against
    // the LIT product would therefore prove nothing about the clamp at all, and it
    // is run against a mocked dark law for exactly that reason. The lit direction
    // has its own arm below.
    return boundaryWithDarkLaw().then((mod) => {
      const born = mod.birthConfig(hydrated);
      expect(born[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();
      expect(
        Object.hasOwn(born, LIVING_CONTENT_LAW_CONFIG_KEY),
        'the marker key survived birthConfig — a birth\'s law is no longer the dial\'s law',
      ).toBe(false);
      expect(materializesLivingContent(born)).toBe(false);
      expect(buildLivingContentRoster(pack, born)).toBeNull();
      // …and through the REAL pipeline, which is where a roster would actually land.
      const world = generateSettlementPipeline(born, pack, { seed: 'l-mat-fix-clamp' });
      expect(world[ROSTER_KEY]).toBeUndefined();
      expect(world.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();
      // The clamp takes the marker and NOTHING ELSE.
      expect(Object.keys(born).sort()).toEqual(
        Object.keys(hydrated).filter(k => k !== LIVING_CONTENT_LAW_CONFIG_KEY).sort(),
      );
      vi.doUnmock('../../src/domain/content/livingContentLaw.js');
      vi.resetModules();
    });
  });

  it('⛔ CREATE (THE CLAMP, LIT): an imported config\'s marker never decides a birth\'s law', () => {
    // THE OTHER HALF OF DEF-2, AND THE ONE THAT IS LIVE ON THE SHIPPED BUILD. The
    // incoming config here declares the DORMANT law, which is the adversarial
    // direction now: an imported v1 world's configuration, loaded through the
    // Library and regenerated, must not birth a v1 world on a build whose dial
    // says v2. The mint spreads last, so it does not — and this arm is what says
    // so by execution rather than by reading the spread order.
    const hydratedDark = migrateSettlementConfig({
      ...CONFIG, [LIVING_CONTENT_LAW_CONFIG_KEY]: DEFAULT_LIVING_CONTENT_LAW_VERSION,
    });
    expect(
      resolveLivingContentLawVersion(hydratedDark),
      'the hydrated config is not dark — this arm no longer tests the direction it names',
    ).toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
    const born = birthConfig(hydratedDark);
    expect(born[LIVING_CONTENT_LAW_CONFIG_KEY]).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(materializesLivingContent(born)).toBe(true);
    // …and an incoming marker for a version that HAS NOT SHIPPED loses too, which
    // is the same rule and the one a future v3 would arrive by.
    const born3 = birthConfig({ ...CONFIG, [LIVING_CONTENT_LAW_CONFIG_KEY]: 3 });
    expect(born3[LIVING_CONTENT_LAW_CONFIG_KEY]).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
  });

  it('⛔ THE CLAMP DOES NOT DEFEAT THE MINT: with the dial LIT, a birth is still v2', () => {
    // The other direction, and the reason the clamp is a destructure rather than a
    // delete-after-spread: the mint is spread AFTER the carried keys, so lighting
    // the dial still governs every birth. A clamp that ran last would have made the
    // dial unlightable — a far worse defect than the one it cures.
    return boundaryWithLitLaw().then((mod) => {
      const hydrated = migrateSettlementConfig({ ...LIT_CONFIG });
      const born = mod.birthConfig(hydrated);
      expect(born[LIVING_CONTENT_LAW_CONFIG_KEY]).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
      expect(materializesLivingContent(born)).toBe(true);
      // …and a DARK incoming config is lit by the dial, not left dark.
      expect(mod.birthConfig({ ...CONFIG })[LIVING_CONTENT_LAW_CONFIG_KEY])
        .toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
      vi.doUnmock('../../src/domain/content/livingContentLaw.js');
      vi.resetModules();
    });
  });

  it('⭐ CREATE (LIT, fired deliberately): birthConfig really does spread the mint', () => {
    // THE ANTI-VACUITY ARM FOR EVERY DARK ONE ABOVE. Without it "birthConfig
    // writes nothing" is equally true of a boundary that forgot to call the
    // mint at all, which is precisely the defect the wiring car could ship.
    return boundaryWithLitLaw().then((mod) => {
      const minted = mod.birthConfig({ ...CONFIG });
      expect(
        minted[LIVING_CONTENT_LAW_CONFIG_KEY],
        'the mint is not reaching birthConfig — every dark arm in this file is vacuous',
      ).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
      expect(materializesLivingContent(minted)).toBe(true);
      // …and the density half is untouched by the second spread.
      expect(minted.settType).toBe(CONFIG.settType);
      vi.doUnmock('../../src/domain/content/livingContentLaw.js');
      vi.resetModules();
    });
  });

  // ── READ ───────────────────────────────────────────────────────────────────
  it('READ: the version comes from the world\'s config and NEVER from the dial', () => {
    // The single fact that makes flipping the dial safe for every existing
    // world. A dial-derived fallback would re-birth them all on the flip.
    expect(resolveLivingContentLawVersion({})).toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
    expect(resolveLivingContentLawVersion(undefined)).toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
    expect(resolveLivingContentLawVersion(LIT_CONFIG))
      .toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(materializesLivingContent({})).toBe(false);
  });

  it('READ (LIT dial): a markerless world still reads as v1 with the dial lit', () => {
    return boundaryWithLitLaw().then(async () => {
      // The leaf is deliberately NOT mocked: this re-imports the real gate under
      // a lit law module and requires the answer to be unchanged, which is the
      // executed form of "the read consults the config and nothing else".
      const leaf = await import('../../src/domain/content/livingContentLawVersion.js');
      expect(
        leaf.resolveLivingContentLawVersion({}),
        'a markerless world resolved to something other than v1 while the dial was lit —'
        + ' every pre-law world would be silently re-born on the flip',
      ).toBe(leaf.DEFAULT_LIVING_CONTENT_LAW_VERSION);
      expect(leaf.materializesLivingContent({ ...CONFIG })).toBe(false);
      vi.doUnmock('../../src/domain/content/livingContentLaw.js');
      vi.resetModules();
    });
  });

  // ── REGENERATE — THE STOP ──────────────────────────────────────────────────
  it('⛔ THE STOP: a section regen never stamps a law onto an existing world', async () => {
    // The shape the L-UI-MAT brief named. Build the adversarial case on purpose:
    // a MARKERLESS saved settlement on screen, and a wizard config that IS lit.
    // If `regenSection` read the store's form config the regenerated world would
    // silently acquire v2; it reads `settlement.config` first, so it cannot.
    const { createSettlementSlice } = await import('../../src/store/settlementSlice.js');
    const store = create(immer((...a) => ({
      ...stubSlice(),
      ...createSettlementSlice(...a),
    })));

    const settlement = generateSettlementPipeline({ ...CONFIG }, null, { seed: 'l-mat-stop' });
    expect(settlement.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();

    store.setState({ settlement, config: { ...LIT_CONFIG }, phase: 'draft', locks: {} });
    // THE CONTROL FOR THIS ARM: the wizard config really is lit, so a green below
    // cannot mean "both configs were dark anyway".
    expect(
      materializesLivingContent(store.getState().config),
      'the store config is not lit — THE STOP arm would pass on a world nothing threatened',
    ).toBe(true);

    const npcsBefore = JSON.stringify(settlement.npcs);
    await store.getState().regenSection('npcs');

    const after = store.getState().settlement;
    // ⛔ THE POSITIVE CONTROL, ADDED AT §912 (DEF-8), AND WITHOUT IT THIS ARM
    // COULD NOT FAIL. Measured by the skeptic pass: `regenNPCsPipeline` returns
    // root parts and never `config`, so all three post-conditions below are
    // untouchable by the regen in EITHER direction — the arm returned identical
    // results with the store's lit config and with the world's own dark one, and
    // would have stayed green on a build where `regenSection` did nothing at all.
    // Asserting the regen really rewrote the section is what makes the three
    // "and it did not stamp a law" assertions measure a live operation.
    expect(
      JSON.stringify(after.npcs),
      'regenSection("npcs") did not change the world — THE STOP arm is asserting that an'
      + ' operation which never ran also failed to stamp a law, which is true of any build',
    ).not.toBe(npcsBefore);

    expect(after.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();
    expect(resolveLivingContentLawVersion(after.config))
      .toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
    expect(
      after[ROSTER_KEY],
      'a regeneration materialized a roster onto a world that was born without one',
    ).toBeUndefined();
    // ⚠ AND THE INSTRUMENT THAT ACTUALLY GUARDS THE READ ORDER IS NOT THIS ONE.
    // What stops `regenSection` reading the store's form config is a SOURCE-TEXT
    // arm in `tests/lint/densityCreateBoundary.walker.test.js` (`/settlement\.config
    // \|\| config/` present, `/\bconfig \|\| settlement\.config/` absent). That arm
    // dies when the order flips; this one cannot. Cite the walker, not this file,
    // for the read-order claim.
  });

  // ── UNDO / CLONE ───────────────────────────────────────────────────────────
  it('UNDO/CLONE: the clone seam carries the world\'s own law, and mints none', () => {
    // Undo, snapshot and version-history all round-trip a settlement through
    // domain/clone.js. A clone that dropped the marker would re-derive the world
    // as v1 after an undo; one that added it would re-birth a v1 world as v2.
    const dark = generateSettlementPipeline({ ...CONFIG }, null, { seed: 'l-mat-clone' });
    const darkClone = deepClone(dark);
    expect(darkClone.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();
    expect(darkClone).toEqual(dark);

    const lit = generateSettlementPipeline({ ...LIT_CONFIG }, null, { seed: 'l-mat-clone' });
    expect(lit.config[LIVING_CONTENT_LAW_CONFIG_KEY])
      .toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    const litClone = deepClone(lit);
    expect(litClone.config[LIVING_CONTENT_LAW_CONFIG_KEY])
      .toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(litClone).toEqual(lit);
  });

  // ── PERSIST / THE GEOGRAPHY OVERLAY ────────────────────────────────────────
  it('PERSIST: no previous settlement config reaches the birth path (the geography overlay is retired)', () => {
    // `geographyLockedConfig` was the one place a PREVIOUS settlement's config was read on
    // the birth path, and this arm pinned that it carried geography keys only, never a
    // generation LAW. Owner order 2026-09-17 retired the world locks, and that overlay with
    // them, so the path this arm guarded no longer exists; it now pins that it stays gone.
    expect(typeof locksPreservation.carryLockedSections, 'the locks leaf itself is live').toBe('function');
    expect(Object.prototype.hasOwnProperty.call(locksPreservation, 'geographyLockedConfig'),
      'the geography overlay is back on the birth path').toBe(false);
    // And the birth keeps its own law: a dark config mints no living content.
    expect(materializesLivingContent({ ...CONFIG })).toBe(false);
  });

  // ── THE ADMISSION SURFACE, RECORDED RATHER THAN ASSUMED ────────────────────
  it('⚠ RECORDED: updateConfig ADMITS the marker as an underscore rider, and why that is still safe', () => {
    // ⛔ A CORRECTION, NOT A PIN. The lane brief carried "updateConfig drops
    // unknown keys" among the facts that keep an existing world safe. MEASURED:
    // it does not drop THIS key. `isAllowedConfigKey` admits the whole
    // underscore family (`_seed`, `_forkedFromSample`, …) by prefix, so a patch
    // carrying `_livingContentLawVersion` is admitted like any other rider.
    expect(isAllowedConfigKey(LIVING_CONTENT_LAW_CONFIG_KEY)).toBe(true);
    // The promise does not rest on that admission, which is why this is recorded
    // rather than changed: the only path that decides an EXISTING world's law
    // reads `settlement.config` first (THE STOP above), so a lit form config
    // governs the NEXT BIRTH — which is what a birth config is for — and no world
    // already on disk.
    //
    // ⛔ AND THE SECOND HALF OF THAT SENTENCE USED TO READ "the store config is
    // the WIZARD FORM, it is never hydrated from a saved settlement", WHICH WAS
    // FALSE (§912, DEF-11). The Library's "Apply Saved Configuration &
    // Regenerate" runs `updateConfig(migrateConfig(settlement._config || config))`
    // (`SettlementsPanel.jsx`, also reached from `SettlementDetail.jsx`), so a
    // saved — or IMPORTED — world's marker really does arrive here, admitted by
    // the prefix rule this very arm measures. What keeps the next birth honest is
    // the CLAMP in `birthConfig`, driven end to end by the CLAMP arm at the top of
    // this file. Recorded, not pinned: a future ruler may delete the admission,
    // and nothing in this file should stop them.
    expect(materializesLivingContent(LIT_CONFIG)).toBe(true);
    expect(materializesLivingContent(CONFIG)).toBe(false);
  });
});

/**
 * ⭐⭐ NO MIGRATION — THE OWNER'S SECOND RULING OF 2026-09-08, PROVED ON THE LIT
 * BUILD.
 *
 * The owner's first word that day asked for the lighting to apply
 * "Retroactively as well"; his second DISCHARGED that half rather than deferring
 * it: "There are no true launched settlements or campaigns … All of those that
 * exist were tests in which case inconsequential." So the module's law stands
 * exactly as written — property 3 of `livingContentLaw.js`, THERE IS NO
 * MIGRATION, DELIBERATELY — and nothing was written to stamp a persisted config
 * on any path.
 *
 * ⛔ WHAT THAT MAKES FALSIFIABLE, AND WHY IT IS WORTH ARMS. A migration is not
 * the only way a world acquires a law: a read path that falls back to the DIAL
 * would re-birth every saved world the moment the dial moved, which is the exact
 * PROMISE breach the version gate exists to prevent, and it would do it
 * silently. The arms below take a world born BEFORE the flip through the hops a
 * saved world really makes on the lit build and require it to come back as dark
 * as it went in.
 */
describe('NO MIGRATION — a law-1 world stays law-1 on every path, on the LIT build', () => {
  it('⛔ a PERSISTED law-1 world survives load, section regen and the clone seam unstamped', async () => {
    const { createSettlementSlice } = await import('../../src/store/settlementSlice.js');
    const store = create(immer((...a) => ({
      ...stubSlice(),
      ...createSettlementSlice(...a),
    })));

    // BORN BEFORE THE FLIP: a markerless world, exactly what a saved world from
    // any day before 2026-09-08 is.
    const born = generateSettlementPipeline({ ...CONFIG }, null, { seed: 'no-migration-born' });
    expect(born.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();
    expect(born[ROSTER_KEY]).toBeUndefined();

    // LOAD: the JSON round trip a save and a reload are.
    const loaded = JSON.parse(JSON.stringify(born));

    // …onto a store whose wizard config IS lit, which is the adversarial setting:
    // if any read path consulted the form config or the dial, the regen below
    // would stamp the world.
    store.setState({ settlement: loaded, config: { ...LIT_CONFIG }, phase: 'draft', locks: {} });
    expect(
      materializesLivingContent(store.getState().config),
      'the store config is not lit — this arm would pass on a world nothing threatened',
    ).toBe(true);
    expect(
      NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
      'the build is not lit — the whole point of this arm is that a LIT build leaves a v1 world alone',
    ).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);

    const npcsBefore = JSON.stringify(loaded.npcs);
    await store.getState().regenSection('npcs');
    const after = store.getState().settlement;
    // THE POSITIVE CONTROL: the regen really ran, so the three absences below are
    // absences after a live operation and not after a no-op.
    expect(
      JSON.stringify(after.npcs),
      'regenSection("npcs") did not change the world — this arm would be asserting that an'
      + ' operation which never ran also failed to stamp a law',
    ).not.toBe(npcsBefore);

    // UNDO / SNAPSHOT: the clone seam every undo, snapshot and version-history
    // entry round-trips through.
    const cloned = deepClone(after);

    for (const [label, world] of [['loaded', loaded], ['regenerated', after], ['cloned', cloned]]) {
      expect(
        world.config[LIVING_CONTENT_LAW_CONFIG_KEY],
        `${label}: a world born under law 1 acquired a law marker on a lit build. There is NO`
        + ' MIGRATION, deliberately, and no path may stamp a persisted config.',
      ).toBeUndefined();
      expect(resolveLivingContentLawVersion(world.config))
        .toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
      expect(world[ROSTER_KEY], `${label}: a law-1 world acquired a roster`).toBeUndefined();
    }
  });

  it('⭐ every reader of the roster key treats ABSENT as empty, driven not argued', () => {
    // ⛔ WHY THIS IS AN ARM AND NOT A READING. "There is no migration" means most
    // worlds in the estate will never carry this key, so every reader of it meets
    // `undefined` as its ordinary case. A reader that dereferenced instead of
    // testing for presence would turn a pre-lighting save into a crash on a
    // boundary the user never chose to cross.
    const dark = generateSettlementPipeline({ ...CONFIG }, null, { seed: 'no-migration-readers' });
    expect(Object.hasOwn(dark, ROSTER_KEY), 'the fixture must NOT carry the key').toBe(false);

    // 1. THE GALLERY STRIP — and it is reference-identical when there is nothing
    //    to strip, which is the stronger claim: it did not merely survive, it did
    //    not allocate.
    expect(scrubGalleryImportLivingContent(dark)).toBe(dark);
    expect(scrubGalleryImportLivingContent(null)).toBeNull();
    expect(scrubGalleryImportLivingContent(undefined)).toBeUndefined();

    // 2. THE ACCOUNT REMAPPER — absent is `{ok: true, roster: null}`, never a
    //    refusal, so an import of a pre-lighting world is not warned about a
    //    record it never had.
    for (const absent of [undefined, null]) {
      const result = remapAccountSettlementLivingContentRoster(absent, {});
      expect(result.ok).toBe(true);
      expect(result.roster).toBeNull();
    }

    // 3. THE PUBLIC PROJECTIONS, both modes.
    for (const options of [undefined, { full: true }]) {
      const projected = toPublicSafe(dark, options);
      expect(Object.hasOwn(projected, ROSTER_KEY)).toBe(false);
      expect(projected.name).toBe(dark.name);
    }
  });
});

/**
 * ⭐⭐ THE IMPORT BOUNDARIES, ON A WORLD THE LIT PRODUCT ACTUALLY MINTED (lane
 * LIGHT car 1e).
 *
 * ⛔ WHY THIS IS NOT A DUPLICATE OF L-MAT-FIX'S CARS 7-9. Those cars cured three
 * live holes (gallery ingest, the reconciliation path, undo/versionHistory) and
 * their arms are green — re-run at dial 2 by this lane and recorded in the
 * receipt. But every one of them drives a HAND-BUILT roster onto a hand-built
 * settlement, because on the day they were written the product could not mint
 * one: the dial was dark and, more to the point, the loader had no caller. What
 * no arm in the estate had was a world the PRODUCT minted, through `birthConfig`
 * on a lit build with a reviewed environment, carried into a boundary. This is
 * that arm, and it is what makes "the boundaries handle a real roster" a
 * measurement instead of an inference from a fixture's shape.
 *
 * The account remap and the reconciliation drop are deliberately NOT re-driven
 * here: they need an archive receipt and an ingest envelope respectively, and
 * both already have suites that build them properly
 * (`accountSettlementContentPortability.test.js`, `importReconciliation.test.js`).
 * Re-spelling either fixture here would be a second, drifting copy of a boundary
 * that is already held.
 */
describe('the import boundaries, on a world the LIT product minted', () => {
  /** A world minted the way the product mints one: through the create boundary,
   *  on the shipped dial, with a reviewed environment that really holds living
   *  content. */
  const mintLitWorld = () => generateSettlementPipeline(
    birthConfig({ ...CONFIG }),
    null,
    {
      seed: 'lgt-holes-lit-product',
      customContent: identifyCustomContentPack(customContentReferencePack()),
    },
  );

  it('⭐ the product really mints one — the anti-vacuity half, and it is first', () => {
    const world = mintLitWorld();
    expect(
      world.config[LIVING_CONTENT_LAW_CONFIG_KEY],
      'the create boundary did not mint the lit law, so every arm below is about a world the'
      + ' product cannot make',
    ).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(
      world[ROSTER_KEY],
      'a lit birth with the reference pack produced NO roster. Either the seam is unarmed or the'
      + ' pack stopped carrying living content, and either way the boundary arms below are'
      + ' asserting that nothing was dropped from nothing.',
    ).toBeTruthy();
    // …and the roster really records the four living-content buckets, so the
    // boundaries below are carrying a real record and not an empty husk.
    expect(Object.keys(world[ROSTER_KEY].buckets).sort())
      .toEqual(['deities', 'factions', 'stressors', 'traditions']);
    expect(world.customContentProvenance).toBeTruthy();
  });

  it('⛔ GALLERY INGEST drops the roster, the provenance receipt AND the foreign birth law', () => {
    // DEF-1. A dossier carries no archive, so no id in that roster can be
    // honestly re-addressed into the importing account; and the birth law of
    // someone else's world must not decide anything in this one.
    const world = mintLitWorld();
    const scrubbed = scrubGalleryImportLivingContent(JSON.parse(JSON.stringify(world)));
    expect(Object.hasOwn(scrubbed, ROSTER_KEY)).toBe(false);
    expect(Object.hasOwn(scrubbed, 'customContentProvenance')).toBe(false);
    expect(scrubbed.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();
    // A DROP, NOT A DEMOLITION: the town itself arrives intact.
    expect(scrubbed.name).toBe(world.name);
    expect(scrubbed.config.settType).toBe(world.config.settType);
  });

  it('⛔ BOTH PUBLIC PROJECTIONS drop both records off a real lit world', () => {
    const world = mintLitWorld();
    for (const [label, options] of [['default', undefined], ['DM-full', { full: true }]]) {
      const projected = toPublicSafe(world, options);
      expect(Object.hasOwn(projected, ROSTER_KEY), `${label}: the roster leaked`).toBe(false);
      expect(
        Object.hasOwn(projected, 'customContentProvenance'),
        `${label}: the provenance receipt leaked`,
      ).toBe(false);
    }
    // ⚠ RECORDED, NOT CURED: the DM-full projection DOES carry the law marker on
    // the config. That is a build fact about the world ("born under law 2"), not
    // an account-scoped identifier, and the gallery INGEST above drops it on the
    // way back in, so no importing world inherits a foreign birth law from it.
    // Written down because the next reader of these arms will notice the
    // asymmetry and should meet the reason rather than re-derive it.
    expect(toPublicSafe(world, { full: true }).config[LIVING_CONTENT_LAW_CONFIG_KEY])
      .toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
  });
});
