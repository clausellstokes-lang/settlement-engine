/**
 * readerCorpusManifest.test.js — the reader corpus is composed from the golden key.
 *
 * SCOPE AT THIS TIP. This file now covers BOTH halves of the corpus law. The KEY DERIVATION
 * half (arms 1-8) proves `scripts/lib/golden-corpus-key.mjs` is the same derivation the golden
 * test performs and round-trips every row of the real 525-row manifest. The COMPOSITION half
 * (arms 9-14, added by the documents car) proves the roster is well formed against that
 * manifest, that a composed region is the soak's region, that the whole document set renders
 * REPRODUCIBLY, and that a broken advance is refused rather than rendered around.
 *
 * IT EXTENDS THIS FILE RATHER THAN ADDING ANOTHER, deliberately: a new test file reds three
 * censuses at landing, and the composition arms belong to the same law as the key arms.
 *
 * WHAT THIS FILE CANNOT PROVE, STATED SO NOBODY MISTAKES ITS GREEN FOR THE WHOLE BAR. The
 * three tab SURFACES need a stubbed store installed through a resolver alias the corpus CLI
 * builds, and vitest does not carry that alias — so every arm here runs with NO tab renderer
 * and the corpus records the absence positively (`tabs.notRendered`). The tabs, and the
 * eleven-campaign roster at thirty years, are proven by the CLI's own full render and its
 * `--verify`, not here.
 *
 * NO `it.each` AND NO GENERATED TITLES: the each-family park ceiling has zero headroom, so
 * every arm is a plain `it` with its loop inside.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  GOLDEN_KEY_FIELDS,
  GOLDEN_KEY_SEPARATOR,
  goldenKeyOf,
  configFromGoldenKey,
  manifestRows,
} from '../../scripts/lib/golden-corpus-key.mjs';
import {
  LAUNCH_POSTURE_PRESETS,
  PREVIEW_OVERLAY,
  READER_CORPUS_ROSTER,
  CONTROL_CAMPAIGN_ID,
  configFromRow,
  composeReaderRegion,
  advanceReaderCampaign,
  renderReaderDocuments,
  readerCorpusManifest,
  launchPostureIsDark,
  overlayForRow,
  readerTuningBlock,
  refuseAdvanceResult,
  refuseNonFiniteWorld,
} from '../../scripts/review/readerCorpus.mjs';
import {
  verdictOf,
  mintBacklogRows,
  importPendingSurfaceRows,
  validateBacklog,
} from '../../scripts/review/reader-backlog.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { DEFAULT_SIMULATION_PRESET_ID } from '../../src/domain/worldPulse/simulationRules.js';

const MANIFEST_PATH = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');
const GOLDEN_TEST_PATH = resolve(process.cwd(), 'tests', 'property', 'generatorGoldenMaster.test.js');

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));

describe('the reader corpus is composed from the golden key', () => {
  it('the field order is exactly the six the golden manifest is keyed by, and it is frozen', () => {
    expect([...GOLDEN_KEY_FIELDS]).toEqual([
      'settType', 'culture', 'terrainOverride', 'tradeRouteAccess', 'monsterThreat', '_seed',
    ]);
    expect(Object.isFrozen(GOLDEN_KEY_FIELDS)).toBe(true);
    expect(GOLDEN_KEY_SEPARATOR).toBe('|');
  });

  it('the derivation is the golden test own arrow, read from its source and compared field for field', () => {
    // THE POINT OF THIS ARM: the golden test's private `keyOf` is the authority for this
    // law, and this module only transcribes it. If a future car changes the golden's key
    // — adds a seventh field, reorders two — this arm reds HERE, at the transcription,
    // rather than letting every consumer silently read a corpus keyed differently from
    // the manifest they compare it against.
    const source = readFileSync(GOLDEN_TEST_PATH, 'utf-8');
    const arrow = /const keyOf = \(c\) => \[([^\]]+)\]\.join\('\|'\);/.exec(source);
    expect(Array.isArray(arrow)).toBe(true);
    const fields = arrow[1].split(',').map((part) => part.trim().replace(/^c\./, ''));
    expect(fields).toEqual([...GOLDEN_KEY_FIELDS]);
  });

  it('every key in the real manifest carries exactly six fields and round-trips unchanged', () => {
    const keys = Object.keys(manifest);
    expect(keys.length).toBe(525);
    const broken = [];
    for (const key of keys) {
      const config = configFromGoldenKey(key);
      if (goldenKeyOf(config) !== key) broken.push(key);
      if (Object.keys(config).length !== GOLDEN_KEY_FIELDS.length) broken.push(key);
    }
    expect(broken).toEqual([]);
  });

  it('a reconstructed config names a real generator vocabulary in every field of every row', () => {
    // A round-trip alone would pass on garbage that happens to survive a split and a join.
    // This arm asserts the reconstruction lands on the generator's OWN closed vocabularies,
    // so a key that round-trips but names nothing real is still caught.
    const seen = { settType: new Set(), culture: new Set(), terrainOverride: new Set(), tradeRouteAccess: new Set(), monsterThreat: new Set(), _seed: new Set() };
    for (const config of manifestRows(manifest)) {
      for (const field of GOLDEN_KEY_FIELDS) seen[field].add(config[field]);
    }
    expect([...seen.settType].sort()).toEqual(['city', 'hamlet', 'metropolis', 'thorp', 'town', 'village']);
    expect([...seen.monsterThreat].sort()).toEqual(['civilized', 'frontier', 'plagued', 'safe']);
    expect([...seen._seed].sort()).toEqual(['gm-seed-a', 'gm-seed-b', 'gm-seed-c', 'golden-master-v3']);
    expect([...seen.terrainOverride].sort()).toEqual(['auto', 'coastal', 'desert', 'forest', 'hills', 'mountain', 'plains', 'riverside']);
    expect([...seen.tradeRouteAccess].sort()).toEqual(['crossroads', 'isolated', 'mountain_pass', 'none', 'port', 'random_trade', 'river', 'road']);
    expect([...seen.culture].length).toBe(12);
  });

  it('manifestRows returns one config per manifest key, in the manifest own key order', () => {
    const rows = manifestRows(manifest);
    const keys = Object.keys(manifest);
    expect(rows.length).toBe(keys.length);
    const drift = [];
    for (let index = 0; index < rows.length; index += 1) {
      if (goldenKeyOf(rows[index]) !== keys[index]) drift.push(keys[index]);
    }
    expect(drift).toEqual([]);
    expect(manifestRows(null)).toEqual([]);
    expect(manifestRows(undefined)).toEqual([]);
  });

  it('a key with the wrong field count is refused, and the refusal names both counts', () => {
    // A caller that silently accepted five fields would generate a DIFFERENT settlement
    // and compare it against another row's hash — a false red that reads like real drift.
    expect(() => configFromGoldenKey('town|germanic|plains|road|civilized')).toThrow(/must carry 6 fields/);
    expect(() => configFromGoldenKey('town|germanic|plains|road|civilized|seed|extra')).toThrow(/got 7/);
    expect(() => configFromGoldenKey('')).toThrow(/got 1/);
  });

  it('a non-string key is refused by type before it can be split', () => {
    expect(() => configFromGoldenKey(null)).toThrow(TypeError);
    expect(() => configFromGoldenKey(undefined)).toThrow(TypeError);
    expect(() => configFromGoldenKey(42)).toThrow(/must be a string/);
    expect(() => configFromGoldenKey(['town'])).toThrow(/must be a string/);
  });

  it('a missing or nullish field joins as the empty string, exactly as the golden test join does', () => {
    // Divergence here would be invisible: the module would key an incomplete config
    // differently from the arrow it transcribes, and only the rows with a missing field
    // would disagree.
    const partial = { settType: 'town', culture: 'germanic' };
    const viaJoin = [
      partial.settType, partial.culture, partial.terrainOverride,
      partial.tradeRouteAccess, partial.monsterThreat, partial._seed,
    ].join('|');
    expect(goldenKeyOf(partial)).toBe(viaJoin);
    expect(goldenKeyOf({})).toBe('|||||');
    expect(goldenKeyOf(null)).toBe('|||||');
    expect(goldenKeyOf({ settType: null, culture: undefined })).toBe('|||||');
  });

  // ── THE COMPOSITION HALF ───────────────────────────────────────────────────

  it('every roster row names a key the real manifest carries, or is fresh with an explicit null', () => {
    // THE POINT: a roster row naming a key the manifest lost would generate a settlement the
    // golden corpus never blessed, and the whole review would rest on it silently. Four of
    // the six keys this car first wrote did NOT exist in the manifest; this arm is why that
    // was caught at authoring time rather than four hours into a render.
    const broken = [];
    for (const row of READER_CORPUS_ROSTER) {
      if (row.goldenKey === null) continue;
      if (typeof row.goldenKey !== 'string') { broken.push(`${row.campaignId}: goldenKey is neither a string nor null`); continue; }
      if (!(row.goldenKey in manifest)) broken.push(`${row.campaignId}: ${row.goldenKey}`);
    }
    expect(broken).toEqual([]);
    // Six golden rows, one per tier — the axis along which every rubric system's density
    // changes. A tier lost here is a whole class of world nobody reads.
    const tiers = READER_CORPUS_ROSTER.filter((r) => r.goldenKey).map((r) => r.goldenKey.split('|')[0]);
    expect([...tiers].sort()).toEqual(['city', 'hamlet', 'metropolis', 'thorp', 'town', 'village']);
  });

  it('the roster carries the control, a preview twin, the DEFAULT preset, and eleven unique ids', () => {
    expect(READER_CORPUS_ROSTER.length).toBe(11);
    const ids = READER_CORPUS_ROSTER.map((r) => r.campaignId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(CONTROL_CAMPAIGN_ID);
    expect(READER_CORPUS_ROSTER.filter((r) => r.posture === 'preview').length).toBeGreaterThanOrEqual(1);
    // ⟦A51 L1⟧ THE WORLD THE CUSTOMER IS HANDED. Every new campaign starts on the default
    // preset, so a roster without it reviews three worlds most customers never choose.
    expect(LAUNCH_POSTURE_PRESETS).toContain(DEFAULT_SIMULATION_PRESET_ID);
    expect(LAUNCH_POSTURE_PRESETS[0]).toBe(DEFAULT_SIMULATION_PRESET_ID);
    const goldenPresets = new Set(READER_CORPUS_ROSTER.filter((r) => r.goldenKey).map((r) => r.preset));
    expect([...goldenPresets]).toEqual([DEFAULT_SIMULATION_PRESET_ID]);
    // The posture read is total over the LIVE preset table, both directions.
    const posture = launchPostureIsDark();
    expect(posture.unknown).toEqual([]);
    expect(posture.carriesDefault).toBe(true);
    // NEGATIVE CONTROL: a table missing a named preset must be reported, not shrugged off.
    expect(launchPostureIsDark({ [DEFAULT_SIMULATION_PRESET_ID]: {} }).unknown.length).toBe(3);
    // The preview overlay is the FOUR-key form, and `characterDriftEnabled` stays OUT: no
    // gate anywhere reads it, so setting it would be a no-op that reads as intent.
    expect(Object.keys(PREVIEW_OVERLAY).sort()).toEqual([
      'demographicsEnabled', 'espionageEnabled', 'neutralNeighborsEnabled', 'warMemoryEnabled',
    ]);
    expect(overlayForRow({ overlay: null })).toEqual({});
    expect(() => overlayForRow({ overlay: 'MADE_UP' })).toThrow(/unknown overlay/);
  });

  it('a composed region is the soak four-member region, with member zero taken from the key', () => {
    const row = READER_CORPUS_ROSTER.find((r) => r.campaignId === 'rr-golden-city');
    const members = configFromRow(row);
    expect(members.length).toBe(4);
    expect(members[0].fromGoldenKey).toBe(true);
    // The golden seed is destructured OUT: the member's seed is the region's, and threading
    // the golden corpus's own seed here would generate a settlement no roster row names.
    expect(members[0].config._seed).toBeUndefined();
    expect(members[0].config.settType).toBe('city');
    expect(members.slice(1).every((m) => m.fromGoldenKey === false)).toBe(true);

    const { campaign, saves } = composeReaderRegion(row);
    expect(saves.length).toBe(4);
    expect(saves.map((s) => s.id)).toEqual(['soak-a', 'soak-b', 'soak-c', 'soak-d']);
    expect(saves.every((s) => s.phase === 'canon' && s.settlement && s.settlement.name)).toBe(true);
    expect(campaign.wizardNews).toEqual({ currentTick: 0, entries: [] });
    expect(campaign.worldState.tick).toBe(0);
    expect(Array.isArray(campaign.regionalGraph?.edges)).toBe(true);
    expect(campaign.regionalGraph.edges.length).toBeGreaterThanOrEqual(4);
    // A fresh row takes the soak's own archetype 0 instead, and says so.
    const fresh = configFromRow(READER_CORPUS_ROSTER.find((r) => r.campaignId === 'rr-fresh-full'));
    expect(fresh[0].fromGoldenKey).toBe(false);
    expect(fresh[0].config.settType).toBe('city');
  });

  it('the whole document set renders twice with identical hashes, and the run id is not inside one', async () => {
    // THE COMPOSED CORPUS IS A BIT CLAIM, AND THIS IS THE FAST HALF OF ITS PROOF. One year is
    // enough to convict a volatile field — a clock, a random, an iteration order — because a
    // volatile producer differs on the FIRST render pair, not on the thirtieth.
    const row = READER_CORPUS_ROSTER.find((r) => r.campaignId === 'rr-fresh-dramatic');
    const renderOnce = async () => {
      const { campaign, saves } = composeReaderRegion(row);
      const advanced = await advanceReaderCampaign({ campaign, saves, years: 1, seed: String(row.seed) });
      const documents = await renderReaderDocuments({
        campaign: advanced.campaign, saves: advanced.saves, yearly: advanced.yearly, outDir: null,
      });
      return { documents, worldHash: advanced.yearly[0].worldHash };
    };
    const first = await renderOnce();
    const second = await renderOnce();

    expect(first.worldHash).toBe(second.worldHash);
    const drift = [];
    for (const [id, receipt] of Object.entries(first.documents)) {
      if (receipt.sha256 !== second.documents[id]?.sha256) drift.push(id);
    }
    expect(drift).toEqual([]);
    expect(Object.keys(second.documents).sort()).toEqual(Object.keys(first.documents).sort());

    // NO PRODUCER MAY FAIL SILENTLY. A producer that threw is recorded, and a recorded throw
    // is a red here — otherwise the corpus ships a document set with holes that hash cleanly.
    const failed = Object.entries(first.documents).filter(([, r]) => r.producerError).map(([id]) => id);
    expect(failed).toEqual([]);

    // ⛔ AND NO PRODUCER MAY BE SILENTLY EMPTY, WHICH IS THE HARDER FAILURE. A document that
    // renders, hashes and verifies while carrying nothing is invisible to every check above —
    // `chronicle-advance` did exactly that, emitting `null` for 27 of 30 years because it read
    // a field the runner deliberately keeps empty except at the decade dumps. A byte floor per
    // document is crude, and crude is the point: it convicts the hole.
    const empty = Object.entries(first.documents)
      .filter(([id, r]) => !id.startsWith('world-y') && !r.notRendered && r.bytes < 32)
      .map(([id]) => id);
    expect(empty).toEqual([]);

    // ⛔ THE RUN ID IS A DIRECTORY NAME ONLY. A manifest whose hashes moved with the run id
    // could never verify anything, so the id must not be reachable inside any document.
    const built = readerCorpusManifest({
      runId: 'run-id-that-must-not-appear', sourceSha: 'deadbeef', campaigns: [{ ...row, documents: first.documents, yearlyWorldHashes: [first.worldHash], addressChain: [], liveness: [] }],
    });
    expect(built.runId).toBe('run-id-that-must-not-appear');
    // ANCHORED: a bare `not.toContain` here would pass just as happily if the campaigns array
    // had drifted away entirely as if the run id were correctly excluded — and an empty array
    // contains nothing, so the assertion would outlive the regression it exists to catch. The
    // campaign id is the liveness anchor: it travels the same serialisation and MUST be there.
    expectAbsentWithAnchor(
      JSON.stringify(built.campaigns),
      'run-id-that-must-not-appear',
      row.campaignId,
      'the manifest run id must not reach any campaign entry',
    );
    // ⛔ THE TUNING BLOCK FAILS CLOSED, AND `signed` IS THE ONE WORD IT MAY NEVER INVENT.
    // A reader scoring a band word as wrong when the band is still draft is reporting a
    // decision nobody has made; a reader told `signed` when it is not would be worse.
    expect(['unregistered', 'draft', 'signed']).toContain(built.tuning.state);
    const live = readerTuningBlock();
    expect(live.state).toBe(live.signatureVersion > 0 ? 'signed' : 'draft');
    // No register on disk reads `unregistered` — never `signed`.
    expect(readerTuningBlock('/nonexistent-root-for-this-arm').state).toBe('unregistered');
    expect(readerTuningBlock('/nonexistent-root-for-this-arm').signatureVersion).toBe(0);
  }, 180_000);

  it('a paused year and a non-finite world are both refused, and each refusal names the campaign', () => {
    // THE ORCHESTRATOR'S CONTRACT under autoResolve is that it never pauses; a runner that
    // quietly resumed would render documents for a world the engine refused to advance, and
    // every reader would score a world that does not exist.
    //
    // ⚠ WHY THESE ARE TESTED DIRECTLY RATHER THAN THROUGH A PLANTED ADVANCE. This arm first
    // tried to summon a pause by threading `simulationRules: null`, and MEASURED that the
    // orchestrator tolerates it and advances anyway — so the pause branch has no known
    // on-demand plant through the real engine. The two refusals were extracted into pure
    // functions rather than left inline and unprovable, because a guard nobody can exercise
    // is a guard nobody knows still works.
    expect(() => refuseAdvanceResult({ result: { status: 'paused' }, campaignId: 'rr-plant', year: 7 }))
      .toThrow(/rr-plant.*year 7 PAUSED/);
    // The positive control: every other status passes through untouched.
    expect(() => refuseAdvanceResult({ result: { status: 'ok' }, campaignId: 'rr-plant', year: 7 })).not.toThrow();
    expect(() => refuseAdvanceResult({ result: {}, campaignId: 'rr-plant', year: 7 })).not.toThrow();

    expect(() => refuseNonFiniteWorld({ composite: { worldState: { a: { b: Number.POSITIVE_INFINITY } } }, campaignId: 'rr-plant', year: 3 }))
      .toThrow(/rr-plant.*non-finite/);
    expect(() => refuseNonFiniteWorld({ composite: { worldState: { a: NaN } }, campaignId: 'rr-plant', year: 3 })).toThrow();
    expect(() => refuseNonFiniteWorld({ composite: { worldState: { a: 1, b: 0, c: -2.5 } }, campaignId: 'rr-plant', year: 3 })).not.toThrow();
    // The refusal must NAME the path, not merely announce that one exists.
    expect(() => refuseNonFiniteWorld({ composite: { settlements: [{ population: NaN }] }, campaignId: 'rr-plant', year: 3 }))
      .toThrow(/settlements\[0\]\.population/);

    // And a roster row naming a preset the live table lost is refused at composition, by name.
    expect(() => composeReaderRegion({ campaignId: 'rr-bogus', preset: 'no_such_preset', seed: 's', overlay: null }))
      .toThrow(/unknown preset: no_such_preset/);
  });

  it('the dossier records the entitlement it was read at, and no surface document carries the tuning label', async () => {
    // ⟦A63 L13⟧ A free customer and a DM read DIFFERENT dossiers, and a review that scored one
    // while citing the other would be measuring nobody's experience.
    // ⟦A61 L11⟧ A `TUNING:` label inside a SURFACE document's bytes would change the
    // CUSTOMER's document, so the corpus would stop proving the customer's document and every
    // hash would flip at the signing for a reason that has nothing to do with the world.
    const row = READER_CORPUS_ROSTER.find((r) => r.campaignId === 'rr-fresh-dramatic');
    const { campaign, saves } = composeReaderRegion(row);
    const advanced = await advanceReaderCampaign({ campaign, saves, years: 1, seed: String(row.seed) });
    const documents = await renderReaderDocuments({
      campaign: advanced.campaign, saves: advanced.saves, yearly: advanced.yearly, outDir: null,
    });

    const dmVm = documents['dossier-soak-a.vm'];
    const freeVm = documents['dossier-soak-a.free.vm'];
    expect(dmVm.entitlement).toBe('dm');
    expect(freeVm.entitlement).toBe('free');

    // ⚠ A MEASUREMENT THIS ARM RECORDS RATHER THAN WISHES AWAY. The two entitlements produce
    // BYTE-IDENTICAL view models here, and that is a true fact about this world, not a wiring
    // fault: `buildPdfLiveWorld` resolves to null when the settlement carries no patron deity
    // and no belief map, and the soak archetypes carry neither at year one. So the premium
    // slice is empty on BOTH sides and the free/DM split is invisible.
    //
    // This is exactly the kind of thing the corpus exists to surface — a reader asking
    // Q-FAI-1 of this campaign is reading a world with no faith to read — so the arm asserts
    // the ENTITLEMENT IS RECORDED (the corpus's obligation) and binds the equality to its
    // CAUSE, both directions. The day a patron reaches this settlement the two must diverge,
    // and this arm reds right where the explanation is written.
    const soakA = advanced.saves.find((save) => save.id === 'soak-a');
    const carriesLiveWorld = Boolean(
      soakA?.settlement?.config?.primaryDeitySnapshot
      || advanced.campaign?.worldState?.spatialLedgers?.beliefMaps?.['soak-a'],
    );
    expect(dmVm.sha256 === freeVm.sha256).toBe(!carriesLiveWorld);

    const pdf = documents['dossier-soak-a.pdf'];
    expect(pdf.producerError).toBeUndefined();
    expect(pdf.pages).toBeGreaterThanOrEqual(12);

    // With no tab renderer injected the absence is RECORDED, never silently omitted.
    expect(documents.tabs.notRendered).toBe(true);

    // ⛔ THE CHRONICLE IS CAPTURED EVERY YEAR, NOT ONLY AT THE DECADE DUMPS. The advance keeps
    // the raw world only at years 10/20/30 to stay inside memory, and the chronicle producer
    // used to read THAT field — so the document rendered, hashed and verified while 27 of its
    // 30 years were null, and no reader could answer a chronology question from it.
    const captured = advanced.yearly.filter((c) => 'chronicleAtYear' in c).length;
    expect(captured).toBe(advanced.yearly.length);
    expect(advanced.yearly.every((c) => c.worldStateAtYear === null || c.year % 10 === 0)).toBe(true);
  }, 180_000);

  // ── THE BACKLOG THE PANEL DISCHARGES INTO ──────────────────────────────────

  it('a finding nobody refuted is REFUTED, and only confirmed findings become rows', () => {
    // DEFAULT REFUTED IS THE WHOLE POINT OF THE REFUTER SEAT: a finding that was never
    // attacked is an opinion with a ticket number. A missing, unknown or malformed verdict
    // must therefore all resolve the same way — to disbelief.
    expect(verdictOf(undefined)).toBe('REFUTED');
    expect(verdictOf(null)).toBe('REFUTED');
    expect(verdictOf({})).toBe('REFUTED');
    expect(verdictOf({ verdict: 'probably fine' })).toBe('REFUTED');
    expect(verdictOf({ verdict: 'CONFIRMED' })).toBe('CONFIRMED');
    expect(verdictOf({ verdict: 'ADJUSTED' })).toBe('ADJUSTED');

    const reports = [{
      campaignId: 'rr-golden-town',
      system: 'faith',
      answers: [{
        questionId: 'Q-FAI-3',
        citations: [{ doc: 'faith-soak-a', locator: '$.effects' }],
        findings: [
          { id: 'F1', classification: 'correct_but_invisible', carClass: 'DISPLAY' },
          { id: 'F2', classification: 'correct_but_invisible', carClass: 'DISPLAY' },
        ],
      }],
    }];
    const { rows, refuted } = mintBacklogRows(reports, [{ findingId: 'F1', verdict: 'CONFIRMED' }]);
    expect(rows.map((r) => r.id)).toEqual(['F1']);
    // A refuted finding is NOT discarded — the half of a review that usually goes missing is
    // the record of what was looked at and dismissed.
    expect(refuted.map((r) => r.id)).toEqual(['F2']);
    expect(rows[0].source).toBe('panel');
    expect(rows[0].outputMoving).toBe(false);
    expect(mintBacklogRows(null, null).rows).toEqual([]);
  });

  it('the walker seeds join the same backlog, and a duplicate or unverdicted row is refused', () => {
    // The static walker and the human panel must discharge into ONE list. Two lists that
    // quietly disagree is how the same defect gets fixed twice, or worse, un-fixed.
    const seeds = importPendingSurfaceRows([{ id: 'w1', writer: 'src/domain/display/warStatus.js' }]);
    expect(seeds.length).toBe(1);
    expect(seeds[0].carClass).toBe('DISPLAY');
    expect(seeds[0].classification).toBe('correct_but_invisible');
    expect(seeds[0].source).toBe('wrwalker');
    expect(seeds[0].verdict).toBeNull();
    expect(importPendingSurfaceRows(null)).toEqual([]);
    expect(validateBacklog(seeds).ok).toBe(true);

    // A PANEL row with no verdict is refused — the walker seed's null is legal, the panel's
    // is not, because a reader who looked and said nothing is not the same as nobody looking.
    const unverdicted = [{ ...seeds[0], id: 'p1', source: 'panel' }];
    expect(validateBacklog(unverdicted).ok).toBe(false);

    // Two rows sharing an id would have two lanes fixing one thing.
    const duplicated = [{ ...seeds[0] }, { ...seeds[0] }];
    const dupe = validateBacklog(duplicated);
    expect(dupe.ok).toBe(false);
    expect(dupe.refusals.some((r) => /2 rows share the id/.test(r.detail))).toBe(true);

    // ⟦A60 L9⟧ THE CLASS IS DECIDED BY WHERE THE WRITER LIVES. A lane-mintable PROSE_RENDER
    // row whose writer sits under worldPulse is PROSE_PERSISTED — a golden re-record, the
    // door's, never a lane's — and the validator refuses it by name.
    const persisted = validateBacklog([{
      id: 'p2', source: 'wrwalker', verdict: null,
      carClass: 'PROSE_RENDER', writerPath: 'src/domain/worldPulse/wizardNews.js',
    }]);
    expect(persisted.ok).toBe(false);
    expect(persisted.refusals.some((r) => /PROSE_PERSISTED/.test(r.detail))).toBe(true);
  });
});
