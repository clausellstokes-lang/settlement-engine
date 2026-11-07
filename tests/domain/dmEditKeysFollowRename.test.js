/**
 * dmEditKeysFollowRename.test.js — a DM edit that names a faction or a house by its
 * display name follows that faction's or house's rename (RUNG1B-F8, 2026-11-04).
 *
 * TWO DM-EDIT STORES KEY BY NAME, because the record gives a faction and a house no other
 * identity (design §22.4: a faction's identity IS its display name; 17,361 of 17,361
 * generated houses carry `name` and no `id`):
 *
 *   - the crisis cast edit (`<stress entry>._userEdits.castRoles`, one line of
 *     `role=kind:id` parts, domain/crisis/crisisCast.js), whose `faction:` and
 *     `institution:` parts carry the display name;
 *   - the house's backing edit (`institutions[]._userEdits.backs`, one line of power
 *     names, domain/dossier/powerSupport.js).
 *
 * Before this lane a rename moved the record and left the DM's line on the old name, and
 * both readers drop a part whose name the roster no longer answers to, without a word.
 * TRUST THE DM: the DM's edits are the DM's and never lost.
 *
 * REAL RECORDS. The soak corpus (scripts/audit/soak-review/corpus.mjs :: birth): seed
 * `soak1k-0` (a thorp under mass migration, one crisis, the stress container an OBJECT)
 * and `soak1k-4` (several crises, the container an ARRAY). The edit is written on the
 * live record through the edit layer's own writer and then JSON round-tripped, so the
 * `stressors` copy a reloaded save carries holds the edit too.
 */

import { beforeAll, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import {
  applyFactionRenameToSettlement,
  applyNpcRenameToSettlement,
  factionRenameChanges,
} from '../../src/domain/factionRename.js';
import { applyInstitutionRenameToSettlement, institutionRenameChanges } from '../../src/domain/institutionRename.js';
import { CAST_EDIT_PATH, effectiveCastOf, formatCastRoles } from '../../src/domain/crisis/crisisCast.js';
import { formatBacksValue, houseBacksOf } from '../../src/domain/dossier/powerSupport.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';

const NEW_FACTION = 'The Amber Concord';
const NEW_HOUSE = 'The Amber Hall';
const NEW_PERSON = 'Ysolde Amberlane';
const EDITED_AT = '2026-11-04T09:00:00.000Z';

const reloaded = (value) => JSON.parse(JSON.stringify(value));
const entriesOf = (container) => (Array.isArray(container) ? container : container ? [container] : []).filter(Boolean);
const factionNames = (save) => (save.powerStructure?.factions || []).map((f) => String(f?.faction || f?.name || '')).filter(Boolean);

/** @type {Record<number, any>} */
const LIVE = {};

beforeAll(async () => {
  await ensureLaws();
  for (const index of [0, 2, 4]) LIVE[index] = birth(index).settlement;
}, 300000);

/**
 * The DM's cast line written on the first crisis of a live record, then the save reloaded.
 * @param {number} index @param {(save: any) => Array<{ role: string, kind: string, id: string }>} rowsOf
 */
function castEdited(index, rowsOf) {
  const live = reloaded(LIVE[index]);
  const entry = entriesOf(live.stress)[0];
  // The live store aliases `stressors` to `stress`; reproduce that before the edit lands.
  live.stressors = live.stress;
  const line = formatCastRoles(rowsOf(live));
  applyUserEdit(entry, CAST_EDIT_PATH, line, { editedAt: EDITED_AT });
  return { save: reloaded(live), line };
}

/** Every copy of the DM's cast line a reloaded save carries: both containers, both homes of the edit. */
function castLinesOf(save) {
  return ['stress', 'stressors'].flatMap((key) => entriesOf(save[key]).filter((e) => e._userEdits?.[CAST_EDIT_PATH])
    .flatMap((e) => [e._userEdits[CAST_EDIT_PATH].value, e[CAST_EDIT_PATH]]));
}

describe('the DM cast edit follows a rename (crisisCast :: castRoles)', () => {
  test('a DM cast edit naming a faction survives that faction\'s rename', () => {
    const { save, line } = castEdited(0, (s) => [{ role: 'brunt', kind: 'faction', id: factionNames(s)[0] }]);
    const old = factionNames(save)[0];
    expect(old, 'anti-vacuity: soak1k-0 has a faction').toBeTruthy();
    const entry = entriesOf(save.stress)[0];
    expect(effectiveCastOf(save, entry).cast.roles.map((r) => `${r.role}=${r.kind}:${r.name}`)).toEqual([`brunt=faction:${old}`]);

    expect(applyFactionRenameToSettlement(save, old, NEW_FACTION).changed).toBe(true);

    expect(effectiveCastOf(save, entry).cast.roles.map((r) => `${r.role}=${r.kind}:${r.name}`), 'the DM\'s row is kept, under the new name').toEqual([`brunt=faction:${NEW_FACTION}`]);
    const lines = castLinesOf(save);
    expect(lines.length, 'both containers, both homes of the edit').toBe(4);
    for (const l of lines) expect(l).toBe(line.replace(old, NEW_FACTION));
    expect(entry._userEdits[CAST_EDIT_PATH].editedAt, 'a rename is not the DM editing the cast').toBe(EDITED_AT);
  });

  test('a DM cast edit naming a house survives that house\'s rename', () => {
    const { save, line } = castEdited(0, (s) => [{ role: 'defender', kind: 'institution', id: s.institutions[0].name }]);
    const old = save.institutions[0].name;
    const entry = entriesOf(save.stress)[0];
    expect(effectiveCastOf(save, entry).cast.roles.map((r) => r.name)).toEqual([old]);

    expect(applyInstitutionRenameToSettlement(save, old, NEW_HOUSE).changed).toBe(true);

    expect(effectiveCastOf(save, entry).cast.roles.map((r) => `${r.role}=${r.kind}:${r.name}`)).toEqual([`defender=institution:${NEW_HOUSE}`]);
    for (const l of castLinesOf(save)) expect(l).toBe(line.replace(old, NEW_HOUSE));
  });

  test('the immutable forms carry the re-keyed line (the gallery and library lanes)', () => {
    const { save } = castEdited(4, (s) => [
      { role: 'brunt', kind: 'faction', id: factionNames(s)[0] },
      { role: 'defender', kind: 'institution', id: s.institutions[0].name },
    ]);
    const faction = factionNames(save)[0];
    const house = save.institutions[0].name;
    const f = factionRenameChanges(save, faction, NEW_FACTION);
    const afterFaction = { ...save, ...f.changes };
    expect(castLinesOf(afterFaction).every((l) => l.includes(`brunt=faction:${NEW_FACTION}`))).toBe(true);
    const h = institutionRenameChanges(afterFaction, house, NEW_HOUSE);
    const afterHouse = { ...afterFaction, ...h.changes };
    const lines = castLinesOf(afterHouse);
    expect(lines.length).toBeGreaterThan(0);
    for (const l of lines) expect(l).toBe(formatCastRoles([
      { role: 'brunt', kind: 'faction', id: NEW_FACTION },
      { role: 'defender', kind: 'institution', id: NEW_HOUSE },
    ]));
    expect(castLinesOf(save).every((l) => l.includes(faction)), 'the immutable form never writes its input').toBe(true);
  });

  test('control: a part of another kind, or naming another faction, is byte-identical after the rename', () => {
    const { save } = castEdited(4, (s) => [
      // The SAME spelling under another kind: a house part is the institution ledger's, never the faction's.
      { role: 'defender', kind: 'institution', id: factionNames(s)[0] },
      { role: 'treater', kind: 'faction', id: factionNames(s)[1] },
      { role: 'face', kind: 'npc', id: String(s.npcs[0].id) },
    ]);
    const before = castLinesOf(save);
    applyFactionRenameToSettlement(save, factionNames(save)[0], NEW_FACTION);
    expect(castLinesOf(save)).toEqual(before);
  });

  test('control: an NPC part is keyed by the durable character id, and an NPC rename leaves the line byte-identical', () => {
    const { save } = castEdited(0, (s) => [{ role: 'face', kind: 'npc', id: String(s.npcs[0].id) }]);
    const entry = entriesOf(save.stress)[0];
    const before = castLinesOf(save);
    expect(applyNpcRenameToSettlement(save, save.npcs[0].name, NEW_PERSON).changed).toBe(true);
    expect(castLinesOf(save)).toEqual(before);
    expect(effectiveCastOf(save, entry).cast.roles.map((r) => r.name)).toEqual([NEW_PERSON]);
  });
});

describe('the DM\'s backing edit follows a faction rename (powerSupport :: backs)', () => {
  /** @param {number} index @param {(names: string[]) => string[]} pick */
  function backsEdited(index, pick) {
    const save = reloaded(LIVE[index]);
    const names = factionNames(save);
    const house = save.institutions[0];
    applyUserEdit(house, 'backs', formatBacksValue(pick(names)), { editedAt: EDITED_AT });
    return { save, house, names };
  }

  test('a house the DM put behind a power still stands behind it after that power\'s rename', () => {
    const { save, house, names } = backsEdited(2, (n) => [n[1]]);
    expect(names.length, 'anti-vacuity: soak1k-2 has two powers').toBeGreaterThanOrEqual(2);
    expect(houseBacksOf(save).get(house.name)?.map((b) => `${b.faction}/${b.basis}`)).toEqual([`${names[1]}/authored`]);

    applyFactionRenameToSettlement(save, names[1], NEW_FACTION);

    expect(houseBacksOf(save).get(house.name)?.map((b) => `${b.faction}/${b.basis}`), 'the DM\'s word is kept, under the new name').toEqual([`${NEW_FACTION}/authored`]);
    expect(house._userEdits.backs.value).toBe(NEW_FACTION);
    expect(house.backs).toBe(NEW_FACTION);
    expect(house._userEdits.backs.editedAt).toBe(EDITED_AT);
  });

  test('the DM\'s spelling in another case still follows (the reader folds case)', () => {
    const { save, house, names } = backsEdited(2, (n) => [n[0], n[1].toLowerCase()]);
    applyFactionRenameToSettlement(save, names[1], NEW_FACTION);
    expect(house._userEdits.backs.value).toBe(formatBacksValue([names[0], NEW_FACTION]));
    expect(houseBacksOf(save).get(house.name)?.map((b) => b.faction)).toEqual([names[0], NEW_FACTION]);
  });

  test('the immutable faction form carries the re-keyed backing line', () => {
    const { save, names } = backsEdited(2, (n) => [n[1]]);
    const { changes } = factionRenameChanges(save, names[1], NEW_FACTION);
    expect(changes.institutions?.[0]?._userEdits?.backs?.value).toBe(NEW_FACTION);
    expect(save.institutions[0]._userEdits.backs.value).toBe(names[1]);
  });

  test('control: a backing line naming only other powers is byte-identical after the rename', () => {
    const { save, house, names } = backsEdited(2, (n) => [n[0]]);
    const before = JSON.stringify(house._userEdits);
    applyFactionRenameToSettlement(save, names[1], NEW_FACTION);
    expect(JSON.stringify(house._userEdits)).toBe(before);
  });
});

describe('the DM\'s own path: the edit and the rename through the store', () => {
  test('a cast role the DM set on the Crisis tab survives the DM renaming that faction', async () => {
    const stub = () => ({
      auth: { user: null, tier: 'free', loading: false }, config: {},
      institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
      customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
      isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
      applyCosmeticRename: vi.fn(),
    });
    const store = create(immer((...a) => ({ ...stub(...a), ...createSettlementSlice(...a) })));
    const save = reloaded(LIVE[0]);
    store.setState((s) => { s.settlement = save; s.phase = 'draft'; s.savedSettlements = []; s.activeSaveId = null; });
    const old = factionNames(save)[0];
    // The Crisis tab's own write (CrisisTab.jsx): one line on the crisis entry.
    store.getState().applyUserEditAction('crisis', 0, CAST_EDIT_PATH, formatCastRoles([{ role: 'brunt', kind: 'faction', id: old }]));
    const result = await store.getState().renameFaction(0, NEW_FACTION);
    expect(result.changed).toBe(true);
    const live = store.getState().settlement;
    const entry = entriesOf(live.stress)[0];
    expect(effectiveCastOf(live, entry).cast.roles.map((r) => `${r.role}=${r.kind}:${r.name}`)).toEqual([`brunt=faction:${NEW_FACTION}`]);
  });
});
