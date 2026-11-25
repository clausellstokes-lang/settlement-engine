/** @vitest-environment node */
/**
 * LIVE-PATH (CLOSE-7; R24h (4), restated R24i (b)): THE LIVE PATH AS IT RUNS. A MEASURE; nothing built.
 *
 * Reads the 180 master-born saved rows MASTER-REDERIVE wrote (`close-7/master-rederive/master-rederive.census.jsx`: master's
 * engine at db832c892, `birthConfig({ settType })`, seeds `dp-<size>-<i>`, i 0..29; saved in master's shape, the
 * `lib/saves.js :: supabaseSave` row). On a LOAD tree (the line, or master for the control) each row is loaded as the library
 * entry `lib/saves.js :: saveEntryFromSupabaseRow` builds (id, name, tier, settlement, config, seed), its settlement through
 * `normalizeSettlement` (the line's `migrateSaveToV2` → `migrateSettlementShape`), and hydrated as the OPEN save.
 *
 * ONE ROSTER DECREE, through the store's OWN doors in `store/editSlice.js` against a minimal store (`get` / `set` over a plain
 * state whose `set(fn)` runs the producer on it, as the immer store does):
 *   1. `stageAddDecreeIntent(get, set, { cardType: 'npc', values: { name, role }, pools, orderedAt })`: the door
 *      `EditModeShell.jsx :: addTo('npc')` binds; it mints the newcomer's id (`mintNewcomerId` → `dmLayer.mintDmId`), builds
 *      the `add-npc` op (`operations.js :: makeOp`) and stages the entry (`stageDecree` → `registry.stage`). `pools` is
 *      `{ 'npc.role': poolValues('npc.role', record) }`, the world the advance itself reads a pool from
 *      (`campaignAdvanceSession.js:192`); the role is the pool's first member.
 *   2. `markDecreeApplied(get, set, { saveId, entryId, meta: { appliedAt, tickRef } })`: EM-C1's `registry.markApplied`, the
 *      verb the tick's hook (`worldPulse/decreeHook.js :: applyDecreesAtTick`) applies a due decree with.
 *   3. `applyRosterDecreesAtTick(get, set, { saveId })`: the call `campaignAdvanceSession.js` makes per roster save after the
 *      pulse. It mints the row into the layer (`dmLayer.applyEdit` → `mintRow`), hands `regenerateWithLayer` the layer
 *      holding THIS tick's one minted row, `storedConfigFor`'s config (the library row's `config`) and the declaration
 *      consult, then `carryForward` and one `set`.
 * The pulse's own world effects (the tick's other half) are NOT run: the measure isolates the roster half.
 *
 * Env: LP_LOAD (tree), LP_SAVED (dir of saved rows), LP_OUT (file), LP_SIZES (comma list, default all six), LP_N (default 30).
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const LOAD = String(process.env.LP_LOAD); const SAVED = String(process.env.LP_SAVED); const OUT = String(process.env.LP_OUT);
const N = Number(process.env.LP_N || 30);
const DUMP = new Set((process.env.LP_DUMP || '').split(',').filter(Boolean)); const DUMP_DIR = process.env.LP_DUMP_DIR || '';
const SIZES = process.env.LP_SIZES ? process.env.LP_SIZES.split(',') : ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const NEWCOMER = 'Aldous Newcombe';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const names = (arr, key) => (Array.isArray(arr) ? arr : []).map((x) => String((isObj(x) ? (x[key] ?? x.name) : x) ?? ''));
const diffBag = (a, b) => { const m = new Map(); for (const x of a) m.set(x, (m.get(x) || 0) + 1); const lost = []; const gained = [];
  const n = new Map(); for (const x of b) n.set(x, (n.get(x) || 0) + 1);
  for (const [k, c] of m) for (let i = 0; i < c - (n.get(k) || 0); i++) lost.push(k);
  for (const [k, c] of n) for (let i = 0; i < c - (m.get(k) || 0); i++) gained.push(k); return { lost, gained }; };
const kept = (a, b) => { const n = new Map(); for (const x of b) n.set(x, (n.get(x) || 0) + 1); let k = 0;
  for (const x of a) if ((n.get(x) || 0) > 0) { k++; n.set(x, n.get(x) - 1); } return k; };
const eventsOf = (s) => {
  const h = isObj(s?.history) ? s.history : {};
  const ev = [...(Array.isArray(h.events) ? h.events : []), ...(Array.isArray(h.historicalEvents) ? h.historicalEvents : [])];
  return ev.map((e) => (isObj(e) ? String(e.name ?? e.title ?? e.event ?? e.description ?? JSON.stringify(e)) : String(e)));
};
const eventYearsOf = (s) => {
  const h = isObj(s?.history) ? s.history : {};
  return (Array.isArray(h.historicalEvents) ? h.historicalEvents : []).map((e) => (isObj(e) ? `${e.yearsAgo ?? '?'}y ${e.type || ''}` : '?'));
};
const holdings = (s) => ({
  houses: names(s?.institutions, 'name'),
  people: names(s?.npcs, 'name'),
  powers: names(s?.powerStructure?.factions, 'faction'),
  government: String(s?.powerStructure?.governingName ?? s?.powerStructure?.government ?? ''),
  events: eventsOf(s),
  eventYears: eventYearsOf(s),
});
/** people (newcomer excluded) whose house or power the place no longer holds. Both record shapes are read: master's v1 card
 *  (`institution` a house name, `factionAffiliation` a power name) and the line's v2 card after `settlementMigrations.js ::
 *  migrateV1toV2` (`institution` `{ kind: 'house', key }`, `memberships[].power`, `allegiance { house, power }`).
 *  (`secondaryAffiliation` is a category such as "criminal network", not a faction name, so it is not read.) */
const linksOf = (p) => {
  const houses = []; const powers = [];
  if (typeof p.institution === 'string' && p.institution !== '') houses.push(p.institution);
  if (isObj(p.institution) && p.institution.kind === 'house' && typeof p.institution.key === 'string' && p.institution.key !== '') houses.push(p.institution.key);
  if (isObj(p.institution) && p.institution.kind === 'power' && typeof p.institution.key === 'string' && p.institution.key !== '') powers.push(p.institution.key);
  if (typeof p.factionAffiliation === 'string' && p.factionAffiliation !== '') powers.push(p.factionAffiliation);
  for (const m of (Array.isArray(p.memberships) ? p.memberships : [])) if (isObj(m) && typeof m.power === 'string' && m.power !== '') powers.push(m.power);
  if (isObj(p.allegiance)) {
    if (typeof p.allegiance.house === 'string' && p.allegiance.house !== '') houses.push(p.allegiance.house);
    if (typeof p.allegiance.power === 'string' && p.allegiance.power !== '') powers.push(p.allegiance.power);
  }
  return { houses, powers };
};
const orphans = (s) => {
  const I = new Set(names(s?.institutions, 'name')); const F = new Set(names(s?.powerStructure?.factions, 'faction'));
  let house = 0; let power = 0; let either = 0; let linked = 0;
  for (const p of (Array.isArray(s?.npcs) ? s.npcs : [])) {
    if (!isObj(p) || p.name === NEWCOMER) continue;
    const { houses, powers } = linksOf(p);
    if (houses.length || powers.length) linked++;
    const h = houses.some((x) => !I.has(x)); const f = powers.some((x) => !F.has(x));
    if (h) house++; if (f) power++; if (h || f) either++;
  }
  return { house, power, either, linked };
};
const hash = (v) => createHash('sha256').update(JSON.stringify(v ?? null)).digest('hex').slice(0, 16);
const IGNORE = new Set(['decrees', 'dmLayer']);
const keysMoved = (a, b) => [...new Set([...Object.keys(a || {}), ...Object.keys(b || {})])]
  .filter((k) => !IGNORE.has(k) && hash(a?.[k]) !== hash(b?.[k])).sort();

test('live path: one roster decree per master-born save', async () => {
  const L = `${LOAD}/src/`;
  const es = await import(/* @vite-ignore */ L + 'store/editSlice.js');
  const { normalizeSettlement } = await import(/* @vite-ignore */ L + 'domain/normalizeSettlement.js');
  const { poolValues } = await import(/* @vite-ignore */ L + 'domain/edit/pools.js');
  const rows = [];
  for (const size of SIZES) for (let i = 0; i < N; i++) {
    const seed = `dp-${size}-${i}`;
    const row = JSON.parse(readFileSync(`${SAVED}/${seed}.json`, 'utf8'));
    const saveId = `save-${seed}`;
    // saveEntryFromSupabaseRow's entry (the fields the tick reads), the settlement through the tree's load migration
    const settlement = normalizeSettlement(structuredClone(row.data));
    const entry = { id: saveId, name: row.name, tier: row.tier, settlement, config: row.config, seed: row.seed };
    const state = { activeSaveId: saveId, settlement, savedSettlements: [entry] };
    const get = () => state;
    const set = (fn) => { const r = typeof fn === 'function' ? fn(state) : fn; if (isObj(r) && r !== state) Object.assign(state, r); };
    const loaded = structuredClone(settlement);
    const pool = poolValues('npc.role', settlement);
    const role = pool[0] ?? '';
    const out = { seed, size, err: null, rowHash: hash(row), loadMoved: keysMoved(row.data, loaded) };
    try {
      const staged = es.stageAddDecreeIntent(get, set, { cardType: 'npc', values: { name: NEWCOMER, role },
        pools: { 'npc.role': pool }, orderedAt: '2026-11-25T00:00:00.000Z' });
      out.staged = staged.ok ? { decreeId: staged.decreeId, role } : { reason: staged.reason, errors: staged.errors, role };
      if (!staged.ok) throw new Error(`stage refused: ${staged.reason}`);
      const applied = es.markDecreeApplied(get, set, { saveId, entryId: staged.decreeId,
        meta: { appliedAt: '2026-11-25T00:00:01.000Z', tickRef: `pulse:live-path:${seed}:1` } });
      if (!applied.ok) throw new Error(`markApplied refused: ${applied.reason}`);
      if (applied.decrees.find((d) => d.id === staged.decreeId)?.status !== 'applied') throw new Error('decree not applied');
      const receipt = await es.applyRosterDecreesAtTick(get, set, { saveId });
      out.receipt = { ok: receipt.ok, minted: [...(receipt.minted || [])], rederived: receipt.rederived, unapplied: receipt.unapplied };
      if (!receipt.rederived) throw new Error('no re-derivation (the lane refused or the run threw)');
    } catch (e) { out.err = String(e?.message || e).slice(0, 300); }
    const after = state.settlement;
    const a = holdings(row.data); const b = holdings(after);
    const newcomers = (after?.npcs || []).filter((p) => p?.name === NEWCOMER);
    Object.assign(out, {
      rowSameAsLibrary: state.savedSettlements[0].settlement === after,
      newcomer: { count: newcomers.length, id: newcomers[0]?.id ?? null, role: newcomers[0]?.role ?? null },
      houses: diffBag(a.houses, b.houses), people: diffBag(a.people, b.people), powers: diffBag(a.powers, b.powers),
      government: [a.government, b.government], events: diffBag(a.events, b.events), eventYears: diffBag(a.eventYears, b.eventYears),
      peopleKeepName: kept(a.people, b.people), orphansBefore: orphans(row.data), orphansLoaded: orphans(loaded), orphansAfter: orphans(after),
      tickMoved: keysMoved(loaded, after),
      // a person the save held (same id and name) whose own row the tick rewrote (the newcomer excluded)
      peopleChangedInPlace: (() => { const by = new Map((loaded?.npcs || []).map((p) => [`${p?.id}|${p?.name}`, hash(p)]));
        return (after?.npcs || []).filter((p) => p?.name !== NEWCOMER && by.has(`${p?.id}|${p?.name}`) && by.get(`${p?.id}|${p?.name}`) !== hash(p)).length; })(),
      counts: { housesBefore: a.houses.length, housesAfter: b.houses.length, peopleBefore: a.people.length, peopleAfter: b.people.length,
        powersBefore: a.powers.length, powersAfter: b.powers.length, eventsBefore: a.events.length, eventsAfter: b.events.length },
    });
    if (DUMP.has(seed) && DUMP_DIR) writeFileSync(`${DUMP_DIR}/${seed}.json`, JSON.stringify({ saved: row.data, loaded, after }));
    rows.push(out);
  }
  writeFileSync(OUT, `${rows.map((r) => JSON.stringify(r)).join('\n')}\n`);
}, 1200000);
