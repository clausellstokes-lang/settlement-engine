/**
 * editTravel.test.js — EM-B3a cases A3, A7, A8; EM-B3d case A6. ARCH §8 instrument 8.
 *
 * HZ-TRAVEL, PROVED AT RUNTIME: the settlement editor's two persisted keys —
 * `dmLayer` and `decrees` — travel NOWHERE. Not into a fork, not into an import,
 * not into the gallery projection in either mode, not into a realm snapshot, and
 * not into the owner's own backup export. This is a RUNTIME suite by design
 * (ARCH §8 instrument 8): a static walker over the denylists would prove the
 * spelling and not the behaviour, and the behaviour is what a reader is owed.
 *
 * ⛔ THE TWO VALUES ARE OPAQUE HERE TOO (EM-B3a §6, chair ruling B3a-2). Every
 * mechanism this suite drives is name-based or whole-value — an allowlist
 * membership, a key-name regex, an explicit delete, a destructure-drop — so not
 * one assertion names a field inside either value, and nothing here imports from
 * `src/domain/edit/**`, a directory EM-R0a created. THE VEIL PRECEDES THE WRITER:
 * `EM-B2a` (the layer's writer) and `EM-C1` (the registry's) land AFTER this packet and depend on it,
 * which is why every case below runs on HAND-PLANTED fixtures through code that
 * already exists.
 *
 * @enforced-by this test
 */
import { describe, test, expect, vi } from 'vitest';

// The account export's module imports the supabase client for its deletion-request
// path alone; pin it dark so this suite is headless and deterministic.
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: null, isConfigured: false, setSessionPersistence: () => {},
}));

import { toPublicSafe, PUBLIC_TOPLEVEL_KEYS } from '../../src/domain/display/publicSafe.js';
import {
  serializeWorldSnapshotPublic,
  WORLD_SNAPSHOT_HARD_DENY,
} from '../../src/domain/display/worldSnapshotPublic.js';
import { buildAccountExport } from '../../src/lib/accountData.js';
import { SAMPLE_SETTLEMENTS, forkConfigFor, forkSeedFor } from '../../src/data/sampleSettlements.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { prepareSettlementEntry, ensureNormalizeLoaded } from '../../src/lib/accountImport.js';

/** An OPAQUE dmLayer: one nested object, one order-observable array. */
const dmLayerFixture = () => ({
  'root:alpha': { kept: 'one', inner: { ordered: ['gamma', 'alpha', 'beta'] } },
  'root:omega': [{ ref: 'first' }, { ref: 'second' }],
});

/** An OPAQUE decree registry: an ORDERED array of two distinguishable entries. */
const decreesFixture = () => ([
  { ref: 'entry-one', payload: { rank: 1, tags: ['aa', 'bb'] } },
  { ref: 'entry-two', payload: { rank: 2, tags: ['bb', 'aa'] } },
]);

/** An edited settlement: allowlisted public content, a genuine DM field the
 *  `gallery_share_dm` opt-in DOES reveal, a DM scratch space it does not, and the
 *  two editor keys planted opaque. */
const editedSettlement = () => ({
  id: 'set-em-b3a', name: 'Ashford', tier: 'town', population: 1200,
  spatialLayout: { districts: ['dA'] },
  institutions: [{ id: 'inst.market', name: 'Market' }],
  npcs: [{ id: 'npc.varn', name: 'Lord Varn', role: 'Reeve', secret: 'the reeve weighs the grain twice' }],
  dossierNotes: 'the private scratch space',
  dmLayer: dmLayerFixture(),
  decrees: decreesFixture(),
});

const uneditedSettlement = () => ({
  id: 'set-plain', name: 'Redhollow', tier: 'village', population: 300,
  institutions: [{ id: 'inst.inn', name: 'The Inn' }],
});

const saveRow = (id, settlement) => ({
  id, name: settlement.name, tier: settlement.tier, settlement,
  config: { settType: settlement.tier }, campaignState: null, versionHistory: [],
});

function expectByteEqual(actual, expected) {
  expect(actual).toEqual(expected);
  expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
}

describe('EM-B3a — neither editor key reaches a public projection, in either mode', () => {
  test('A3 — the DEFAULT fail-closed projection drops both keys and still projects the allowlisted content', () => {
    // The top-level allowlist is the mechanism, so it is asserted against the LIVE
    // constant with `spatialLayout` as the anchor: an allowlisted sibling that
    // travels the same projection path as the two exclusions, exactly as the
    // landed fogSessions arm anchors its own.
    expectAbsentWithAnchor(
      [...PUBLIC_TOPLEVEL_KEYS], 'dmLayer', 'spatialLayout', 'the public top-level key allowlist',
    );
    expectAbsentWithAnchor(
      [...PUBLIC_TOPLEVEL_KEYS], 'decrees', 'spatialLayout', 'the public top-level key allowlist',
    );

    const pub = toPublicSafe(editedSettlement());
    expect(pub.name).toBe('Ashford');
    expect(Array.isArray(pub.institutions)).toBe(true);
    expect(Object.hasOwn(pub, 'dmLayer')).toBe(false);
    expect(Object.hasOwn(pub, 'decrees')).toBe(false);
  });

  test('A8 — the DM-full share skips the allowlist gate and still refuses both keys', () => {
    const full = toPublicSafe(editedSettlement(), { full: true });

    // The owner's opt-in IS revealing DM content here: the NPC secret survives and
    // an allowlisted sibling survives, so this case cannot pass by the projection
    // returning nothing.
    expect(full.name).toBe('Ashford');
    expect(full.npcs[0].secret).toBe('the reeve weighs the grain twice');
    // `dossierNotes` is the LIVE ANCHOR for the two exclusions below: it proves the
    // explicit delete chain in the `full` branch actually ran, because the
    // fail-closed allowlist that would otherwise have dropped it is skipped here.
    expect(Object.hasOwn(full, 'dossierNotes')).toBe(false);
    expect(Object.hasOwn(full, 'dmLayer')).toBe(false);
    expect(Object.hasOwn(full, 'decrees')).toBe(false);
  });
});

describe('EM-B3a — HZ-TRAVEL: a fork, a backup export and a realm snapshot carry neither key', () => {
  test('A7 — the three travel surfaces, executed end to end', () => {
    // ── (i) A FORK IS A FRESH GENERATION ────────────────────────────────────────
    // The sample's seed is the generation ARGUMENT, never a config key, so a fork
    // re-derives a world from dials alone. Nothing carries over that could bring
    // an edit with it.
    const sample = SAMPLE_SETTLEMENTS.find((entry) => entry.id === 'sample-cnocby');
    expect(sample.tier).toBe('village');
    const forkedConfig = forkConfigFor(sample);
    expect(forkedConfig.customName).toBe('Cnocby');
    expect(Object.hasOwn(forkedConfig, 'seed')).toBe(false);
    const forked = generateSettlementPipeline(forkedConfig, null, {
      seed: forkSeedFor(sample, 'user-1234'), customContent: {},
    });
    expect(typeof forked.name).toBe('string');
    expect(Object.hasOwn(forked, 'dmLayer')).toBe(false);
    expect(Object.hasOwn(forked, 'decrees')).toBe(false);

    // ── (ii) THE BACKUP EXPORT, THE ONE SEAM OUT OF THE OWNER'S ACCOUNT ─────────
    const unedited = Object.freeze(saveRow('save-plain', uneditedSettlement()));
    const edited = saveRow('save-edited', editedSettlement());
    const payload = buildAccountExport({
      auth: { user: { email: 'keeper@example.com' }, displayName: 'Keeper', tier: 'free' },
      savedSettlements: [edited, unedited],
      campaigns: [],
    });
    const serializedExport = JSON.stringify(payload);

    // Anchored: the export demonstrably carries both saves and the edited world's
    // own content, so the two absences below are measuring an omission rather than
    // an empty export.
    expect(payload.settlements).toHaveLength(2);
    expect(payload.settlements[0].settlement.name).toBe('Ashford');
    expect(serializedExport.includes('"dmLayer"')).toBe(false);
    expect(serializedExport.includes('"decrees"')).toBe(false);

    // Every sibling field of the edited save survives BYTE-EXACT: the omission is
    // surgical, and the surviving key order is the entry's own.
    const expectedEdited = JSON.parse(JSON.stringify(edited));
    delete expectedEdited.settlement.dmLayer;
    delete expectedEdited.settlement.decrees;
    expectByteEqual(payload.settlements[0], expectedEdited);

    // ⭐ THE DORMANCY PROOF, and under veil-first it is EVERY account: no writer of
    // either key exists at this commit, so the unedited entry is the case 100% of
    // real saves take, and it must come back as the VERY OBJECT that went in. A
    // shallow-copy-always helper would silently move the bytes of every export
    // that has ever been taken.
    expect(payload.settlements[1]).toBe(unedited);

    // ── (iii) THE REALM SNAPSHOT, EVERY SECTION ENABLED ─────────────────────────
    // The hard-deny list is the mechanism, anchored on a member that was already
    // there, so the membership assertion cannot pass against an emptied list.
    expect([...WORLD_SNAPSHOT_HARD_DENY]).toContain('npcStates');
    expect([...WORLD_SNAPSHOT_HARD_DENY]).toContain('dmLayer');
    expect([...WORLD_SNAPSHOT_HARD_DENY]).toContain('decrees');

    const worldState = {
      schemaVersion: 4, tick: 3,
      calendar: { elapsedMonths: 30, month: 6, year: 3, season: 'summer' },
      simulationRules: { presetId: 'standard', propagationMode: 'regional', intensity: 'normal', migrationMode: 'open' },
      pantheon: { 'deity.sun': { tier: 'major', seats: 2, wins: 1, losses: 0 } },
      dispositionStats: { 'set-em-b3a': { wins: 2, losses: 1, score: 1 } },
      proposals: [],
      pulseHistory: [{
        tick: 3,
        selectedOutcomes: [{
          id: 'o1', applyMode: 'auto', headline: 'The market reopens',
          summary: 'Trade resumes along the road.', targetSaveId: 'set-em-b3a',
        }],
        impactDigest: [],
      }],
      // Planted on the realm as well, so the hard-deny arm is measured rather than
      // merely listed: the allowlist construction never reads them, and the final
      // scrub would drop them if it ever did.
      dmLayer: dmLayerFixture(),
      decrees: decreesFixture(),
    };
    const regionalGraph = {
      channels: [{
        id: 'wf:1', type: 'war_front', status: 'confirmed', visibility: 'public',
        from: 'set-plain', to: 'set-em-b3a', strength: 0.7, goods: [],
      }],
    };
    const snapshot = serializeWorldSnapshotPublic(
      worldState, regionalGraph,
      [{ id: 'set-em-b3a', name: 'Ashford', settlement: editedSettlement() },
        { id: 'set-plain', name: 'Redhollow', settlement: uneditedSettlement() }],
      { worldClock: true, chronicle: true, pantheon: true, warNetwork: true, dashboard: true },
    );
    const serializedSnapshot = JSON.stringify(snapshot);

    // Anchored: the snapshot demonstrably READ the member settlements (the siege's
    // target resolved to its display name) and every section is populated, so the
    // deep scan below is measuring a refusal rather than an empty snapshot.
    expect(snapshot.warNetwork.sieges[0].targetName).toBe('Ashford');
    expect(snapshot.worldClock.tick).toBe(3);
    expect(snapshot.chronicle[0].headlines[0].headline).toBe('The market reopens');
    expect(serializedSnapshot.includes('"dmLayer"')).toBe(false);
    expect(serializedSnapshot.includes('"decrees"')).toBe(false);
  });

  test('A6 — the IMPORT, the fourth surface this suite has always claimed, executed end to end', async () => {
    // ⭐ THE ARM THE DOCBLOCK ALREADY PROMISED. Design §12 item 4 names a fork, an
    // IMPORT and the gallery projection; A7 above executes fork, backup export and
    // realm snapshot. EM-B3a discharged the import row by REASONING ("the source is
    // already veiled"), which was correct and is not a runtime proof of the surface.
    // EM-B3d's strip makes it drivable, and this drives it. `prepareSettlementEntry`
    // is the one import door reachable headlessly, and it is the door the account
    // file, the reconciliation session and accountImportBody all route through.
    await ensureNormalizeLoaded();
    // `importedAt` is PINNED. Unpinned, the door stamps `new Date().toISOString()`, so
    // two runs differ by a millisecond and the byte-exact half below would be a flake.
    const META = { importedAt: '2026-01-01T00:00:00.000Z', sourceName: 'keeper-export' };
    const edited = prepareSettlementEntry(
      { name: 'Ashford', tier: 'town', settlement: editedSettlement() }, META,
    );
    expect(edited.ok).toBe(true);

    // Anchored: the door demonstrably RAN and demonstrably READ the record — the name,
    // the tier, an institution and the import stamp all survive — so the two absences
    // below measure an omission rather than an entry that was never built.
    expect(edited.entry.name).toBe('Ashford');
    expect(edited.entry.tier).toBe('town');
    expect(edited.entry.settlement.institutions).toEqual([{ id: 'inst.market', name: 'Market' }]);
    expect(edited.entry.settlement.importedFrom.source).toBe('account-export');

    // Neither key survives at ANY depth of the prepared entry.
    const serializedEntry = JSON.stringify(edited.entry);
    expect(serializedEntry.includes('"dmLayer"')).toBe(false);
    expect(serializedEntry.includes('"decrees"')).toBe(false);

    // Every sibling survives BYTE-EXACT beside the two omissions: the SAME settlement
    // imported WITHOUT the editor keys lands on the identical entry, so the strip took
    // exactly those two and moved nothing else anywhere through the door.
    const plain = { ...editedSettlement() };
    delete plain.dmLayer;
    delete plain.decrees;
    const unedited = prepareSettlementEntry(
      { name: 'Ashford', tier: 'town', settlement: plain }, META,
    );
    expect(unedited.ok).toBe(true);
    expectByteEqual(edited.entry, unedited.entry);
  });
});
