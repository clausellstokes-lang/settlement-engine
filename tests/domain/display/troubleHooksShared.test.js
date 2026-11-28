/**
 * troubleHooksShared.test.js — A TROUBLE'S HOOKS ON A SHARED READ (LINE91-SAMENESS-2; the chair's ruling of 04:27 UTC
 * 2026-11-22). The proof that `tests/lint/samenessHideable.walker.test.js :: EXEMPT` cites for
 * `src/data/troubleHooks.js :: TROUBLE_HOOKS` (class 'trouble': "its hooks are dropped on a public page").
 *
 * (A) EVERY SHARED PROJECTION BUT THE OWNER'S FULL REVEAL carries no hook of a trouble (`history.currentTensions[].plotHooks`):
 *     `toPublicSafe` (its deep denylist `publicSafe.js :: PRIVATE_KEY_RE` takes `plotHook|hook`), with every member
 *     revealed by a per-member override, the gallery payload without the DM door, the gallery's default veil and the
 *     share's projected veil; on born places that hold troubles and on a planted one.
 * (B) THE FULL REVEAL (`toPublicSafe(record, { full: true })`, reachable only where the owner set `gallery_share_dm`)
 *     PRINTS the hooks, by the owner's choice, and VEILS NOTHING: on a record with a veiled card and a hidden power it holds
 *     that card's house and that power's name exactly as the owner's record does.
 * (C) THE GALLERY'S OWN VEIL (the chair's ruling of 05:42 UTC 2026-11-22): the reader runs `galleryVeil.js`'s veil after the
 *     projection, and its DEFAULT set hides every hook (`tab:plot_hooks`, `class:tension:hooks`, X-21d) and a criminal or
 *     clandestine house whole (X-21e), on a DM-door share too: the DM-door payload under the default veil (applied, and
 *     through `projectShareVeil` with a marked, empty delta list) serves no hook of a trouble, on born places and the planted one.
 * (D) THE GAP, PINNED: every default is an eye the owner can open. With the DM door and ONLY the hooks' eyes opened, the
 *     thieves' guild left veiled, the planted hook IS served while the house's card is gone. That state is NOT held by the
 *     sameness walker; it is owed to the share veil's instrument and LISTED for the security reader. The day the veil holds
 *     it, (D) reds and the walker's TROUBLE_HOOKS entry is rewritten.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { HIDDEN_POWER_MASK, galleryMemberKey, toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { applyVeil, defaultVeilFor, galleryPayloadFor, projectShareVeil, resolveVeil, writeShareVeil } from '../../../src/domain/display/galleryVeil.js';
import { collectPlotHooks } from '../../../src/domain/dossier/plotHooks.js';
import { TROUBLE_HOOKS } from '../../../src/data/troubleHooks.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const PLANTED_HOOK = 'A fixer of the Hollow Hand wants a door left unbarred tonight, and pays in silver';

/** A planted place: a trouble with its hooks, a veiled card whose house is a thieves' guild, a hidden criminal power. */
const planted = () => ({
  id: 'set_planted', name: 'Ashford', tier: 'town', population: 2400,
  institutions: [{ id: 'inst_watch', name: 'Town watch', category: 'Defense' }, { id: 'inst_tg', name: 'Thieves guild', category: 'Criminal' }],
  powerStructure: { factions: [
    { faction: 'Town Council', category: 'government', power: 50 },
    { faction: 'The Hollow Hand', category: 'criminal', power: 30, hidden: true },
  ] },
  npcs: [
    { id: 'npc.mara', name: 'Mara Quill', role: 'Fixer', title: 'Fixer of the Low Lanes', personality: 'Patient',
      institution: { kind: 'house', key: 'Thieves guild', title: 'Fixer', veiled: true },
      memberships: [{ faction: 'The Hollow Hand', veiled: true }] },
    { id: 'npc.oren', name: 'Oren Vale', role: 'Reeve', personality: 'Dry' },
  ],
  relationships: [{ from: 'npc.mara', to: 'npc.oren', npc1Role: 'Fixer', npc2Role: 'Reeve', type: 'rival' }],
  history: { currentTensions: [{ type: 'crime_wave', description: 'Thefts by night are rising.', plotHooks: [PLANTED_HOOK, TROUBLE_HOOKS.crime_wave[0].text] }] },
});

/** The hooks a document's troubles carry. @param {any} doc */
const troubleHooksIn = (doc) => (doc?.history?.currentTensions ?? []).flatMap((/** @type {any} */ t) => (Array.isArray(t?.plotHooks) ? t.plotHooks : []));

/** @type {Record<string, (record: any) => any>} every shared projection but the owner's full reveal */
const SHARED = {
  'toPublicSafe': (r) => toPublicSafe(r),
  'toPublicSafe, every member revealed': (r) => toPublicSafe(r, { memberOverrides: Object.fromEntries((r.npcs ?? []).map((/** @type {any} */ n) => [galleryMemberKey(n), { revealDm: true }])) }),
  'galleryPayloadFor without the DM door': (r) => galleryPayloadFor(r, { shareDm: false }),
  'the gallery\'s default veil': (r) => { const p = toPublicSafe(r); return applyVeil(p, resolveVeil(defaultVeilFor(p), null)); },
  'the share\'s projected veil': (r) => projectShareVeil(toPublicSafe(r), writeShareVeil({}, [])),
};

/** @type {Record<string, (record: any) => any>} the DM door (`gallery_share_dm`) under the gallery's DEFAULT veil (C) */
const DM_DOOR_DEFAULT_VEIL = {
  'the DM door, the default veil applied': (r) => { const p = galleryPayloadFor(r, { shareDm: true }); return applyVeil(p, resolveVeil(defaultVeilFor(p), null)); },
  'the DM door, the share\'s projected veil (marked, no delta)': (r) => projectShareVeil(galleryPayloadFor(r, { shareDm: true }), writeShareVeil({}, [])),
};

/**
 * Where a shared projection serves a trouble's hook: `projection: hook` for each stored hook its document carries (as a
 * trouble's `plotHooks`, anywhere in its text, or as a hook the dossier's Plot Hooks tab collects).
 * @param {Record<string, (record: any) => any>} projections @param {any} record
 */
const servedHooks = (projections, record) => {
  const stored = troubleHooksIn(record);
  return Object.entries(projections).flatMap(([label, project]) => {
    const doc = project(record);
    const text = JSON.stringify(doc);
    const collected = new Set(collectPlotHooks(doc).map((/** @type {any} */ h) => h.text));
    return stored.filter((h) => troubleHooksIn(doc).includes(h) || text.includes(h) || collected.has(h)).map((h) => `${label}: ${h}`);
  });
};

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** @type {Array<[string, any]>} */ let troubled = [];

beforeAll(async () => {
  const { generateSettlementPipeline } = await import('../../../src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import('../../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../../src/store/configSlice.js');
  await loadGenerationLawPayloads();
  troubled = SIZES.flatMap((size) => [0, 1].map((i) => {
    const seed = `hxd-${size}-${i}`;
    return /** @type {[string, any]} */ ([seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} })]);
  })).filter(([, r]) => (r.history?.currentTensions ?? []).some((/** @type {any} */ t) => Object.hasOwn(TROUBLE_HOOKS, t?.type) && t.plotHooks?.length));
}, 180000);

describe('a trouble\'s hooks on a shared read: absent from every shared projection; the full reveal veils nothing; the gallery\'s veil and its gap', () => {
  it("(A) every shared projection but the owner's full reveal carries no hook of a trouble, on born places and a planted one; (B) the full reveal holds the veiled card's house and the hidden power's name as the owner's record does; (C) the DM-door payload under the gallery's default veil serves no hook of a trouble; (D) the gap: with only the hooks' eyes opened and the house veiled, the hook is served", () => {
    // (A) born places that hold troubles, and the planted one
    expect(troubled.length).toBeGreaterThan(0);
    expectNoSeedFailures(collectSeedFailures(troubled, ([seed, record]) => { expect(servedHooks(SHARED, record), seed).toEqual([]); }), 'no trouble hook on a shared projection of a born place');
    const record = planted();
    expect(servedHooks(SHARED, record)).toEqual([]);
    // the read discriminates: the owner's full reveal (gallery_share_dm) serves the planted hooks, and the tab collects them
    const full = toPublicSafe(record, { full: true });
    expect(servedHooks({ full: (r) => toPublicSafe(r, { full: true }) }, record)).toEqual(troubleHooksIn(record).map((h) => `full: ${h}`));
    expect(collectPlotHooks(full).map((/** @type {any} */ h) => h.text)).toEqual(expect.arrayContaining(troubleHooksIn(record)));
    // (B) the full reveal veils nothing: the card's house, its title and memberships, the hidden power's row and name
    expect(full.npcs).toEqual(record.npcs);
    expect(full.powerStructure).toEqual(record.powerStructure);
    expect(full.institutions).toEqual(record.institutions);
    expect(full.relationships).toEqual(record.relationships);
    expect(full.history).toEqual(record.history);
    const count = (/** @type {unknown} */ doc, /** @type {string} */ s) => JSON.stringify(doc).split(s).length - 1;
    expect(count(full, 'The Hollow Hand')).toBe(count(record, 'The Hollow Hand'));
    expect(count(full, HIDDEN_POWER_MASK)).toBe(0);
    // and the fixture is a veiled one: the default projection takes the card's house off and masks the power's name
    const served = toPublicSafe(record);
    expect(served.npcs.find((/** @type {any} */ n) => n.id === 'npc.mara')?.institution).toBeUndefined();
    expect(count(served, 'The Hollow Hand')).toBe(0);
    // (C) the DM door under the gallery's DEFAULT veil: applied, and through the share's projection with a marked, empty delta list
    expectNoSeedFailures(collectSeedFailures([...troubled, ['planted', record]], ([seed, r]) => {
      expect(servedHooks(DM_DOOR_DEFAULT_VEIL, r), seed).toEqual([]);
    }), 'no trouble hook on the DM-door payload under the default veil');
    // the fixture's house is one the default veil hides whole (X-21e)
    const door = galleryPayloadFor(record, { shareDm: true });
    const houseCard = defaultVeilFor(door).map((/** @type {any} */ d) => (typeof d === 'string' ? d : d.address)).filter((a) => a.startsWith('card:institution:'));
    expect(houseCard).toHaveLength(1);
    // (D) THE GAP, PINNED. NOT held by the sameness walker; owed to the share veil's instrument (LISTED for the security reader).
    // The day the veil holds it, this reds and the walker's TROUBLE_HOOKS entry is rewritten.
    const eyes = writeShareVeil({}, [{ address: 'tab:plot_hooks', hidden: false }, { address: 'class:tension:hooks', hidden: false }]);
    const opened = projectShareVeil(galleryPayloadFor(record, { shareDm: true, memberOverrides: eyes }), eyes);
    expect(troubleHooksIn(opened)).toContain(PLANTED_HOOK);
    expect(collectPlotHooks(opened).map((/** @type {any} */ h) => h.text)).toContain(PLANTED_HOOK);
    expect((opened.institutions ?? []).map((/** @type {any} */ i) => i.name)).toContain('Town watch');
    // anchored: the same list holds 'Town watch' (the line above), so the institutions were served and only the veiled house is gone
    expect((opened.institutions ?? []).map((/** @type {any} */ i) => i.name)).not.toContain('Thieves guild');
  });
});
