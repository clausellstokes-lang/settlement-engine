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
 * ⛔ THE DIAL STAYS AT 1, AND THAT IS WHY THIS FILE HAS TWO HALVES. With the dial
 * dormant the mint returns `{}`, so a test that only ran the product path would
 * be green because NOTHING HAPPENS — the vacuous green this estate refuses. Every
 * dark arm below is therefore paired with a LIT one that drives the same code
 * with the law's module mocked to a lit dial. The dark arms are the product
 * truth; the lit arms are what stops them proving nothing.
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
 *   PERSIST     — `geographyLockedConfig` overlays geography keys ONLY, so a lit
 *                 previous world cannot smuggle its law into a dark generation.
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
import { geographyLockedConfig } from '../../src/domain/locksPreservation.js';
import { deepClone } from '../../src/domain/clone.js';
import { isAllowedConfigKey } from '../../src/store/configSlice.js';
// The Library's Load runs a saved `settlement._config` through this before handing
// it to `updateConfig`; the clamp arm below walks that exact hop rather than
// asserting about it.
import { migrateSettlementConfig } from '../../src/lib/settlementConfigMigration.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
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

/** A config that asks for the law EXPLICITLY, which is the only way to get a v2
 *  world while the dial is dormant. */
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
  it('the register says WIRED and the dial says DORMANT — wiring is not lighting', () => {
    expect(
      GENERATION_LAWS.livingContent.wiring,
      'this file is written against a WIRED law; if the row went back to UNWIRED the'
      + ' arms below are proving something about a mint nothing calls',
    ).toBe('WIRED');
    expect(GENERATION_LAWS.livingContent.configKey).toBe(LIVING_CONTENT_LAW_CONFIG_KEY);
    expect(
      NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
      'the dial must stay at the dormant default — lighting it is a separate owner act',
    ).toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
    expect(newSettlementLivingContentLaw()).toEqual({});
  });

  // ── CREATE ─────────────────────────────────────────────────────────────────
  it('CREATE (dark): birthConfig writes not one config byte', () => {
    const minted = birthConfig({ ...CONFIG });
    expect(minted).toEqual({ ...CONFIG });
    expect(Object.keys(minted).sort()).toEqual(Object.keys(CONFIG).sort());
    expect(minted[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();
    // Null/undefined tolerance is the boundary's own contract, unchanged by the
    // second mint being spread beside the first.
    expect(birthConfig(null)).toEqual({});
    expect(birthConfig(undefined)).toEqual({});
  });

  it('CREATE (dark, THE SAME-SEED CONTROL): a birth through the boundary is the same world', () => {
    // The strongest statement the dark half can make: run the REAL pipeline
    // twice on one seed, once with the config the boundary produces and once
    // with the raw config, and require the two settlements to be identical.
    // If the wiring ever wrote a byte at the dormant dial, this reds — no
    // golden file to re-record, and no way for the change to ride silently.
    const seed = 'l-mat-wiring-same-seed';
    const through = generateSettlementPipeline(birthConfig({ ...CONFIG }), null, { seed });
    const raw = generateSettlementPipeline({ ...CONFIG }, null, { seed });
    expect(through).toEqual(raw);
    expect(through[ROSTER_KEY]).toBeUndefined();
    expect(resolveLivingContentLawVersion(through.config))
      .toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
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

    const born = birthConfig(hydrated);
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
  it('PERSIST: geographyLockedConfig overlays geography keys ONLY', () => {
    // The one place a PREVIOUS settlement's config is read on the birth path.
    // If the overlay were a spread of the whole previous config, a lit world on
    // screen would decide the law of the next world generated beside it.
    const previous = { config: { ...LIT_CONFIG, terrainOverride: 'hills' } };
    const overlaid = geographyLockedConfig({ geography: true }, previous, { ...CONFIG });
    expect(
      overlaid[LIVING_CONTENT_LAW_CONFIG_KEY],
      'the geography overlay carried a generation LAW across from the previous world',
    ).toBeUndefined();
    // Non-vacuity: the overlay really did overlay something.
    expect(overlaid.terrainOverride).toBe('hills');
    expect(materializesLivingContent(overlaid)).toBe(false);
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
