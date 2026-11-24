/** @vitest-environment node */
/**
 * MASTER-REDERIVE (CLOSE-7 chain two; RULING-R24f (3)): WHAT THE LINE ALREADY DOES TO A SAVED PLACE. A MEASURE.
 *
 * Births 30 places a size on MASTER's engine (the C corpus's own birth: `birthConfig({ settType })`, seeds `dp-<size>-<i>`,
 * i 0..29, `read24/make-plan.mjs`; options `{ seed, customContent: {} }` after `loadGenerationLawPayloads()`), SAVES each in
 * master's shape (`components/generate/SaveToLibraryButton.jsx :: handleSave`'s payload { name, tier, settlement: with
 * `mapEdits` minted, config: settlement._config } through `lib/saves.js :: supabaseSave`'s row: data =
 * withNeighbourNetworkFromRelationship(migrateSaveToV2(entry).settlement), config, seed), as JSON. Then on a LOAD tree it reads
 * each row back by that tree's load path (`lib/saves.js :: saveEntryFromSupabaseRow` → `migrateSaveToV2` → `migrateSettlementShape`
 * = `domain/normalizeSettlement.js :: normalizeSettlement`, which runs `settlementMigrations.js :: migrateSettlementToLatest`)
 * and RE-DERIVES it with an EMPTY layer exactly as `store/editSlice.js` does on an edit: `settlementRederiveAction.js ::
 * regenerateWithLayer(live, storedConfigFor(...) = row.config, layer, DECLARATION_CONSULT)` → `dmLayer.rederive`, then
 * `carryForward(live, derived)`. The module-private save/load helpers are reached through the module's own exported service
 * where it exposes them, else restated here verbatim from the tree (named in the report).
 * Env: MR_MASTER, MR_LOAD (the load-and-rederive tree), MR_OUT (dir), MR_N (per size, default 30).
 */
import { test } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';

const MASTER = String(process.env.MR_MASTER); const LOAD = String(process.env.MR_LOAD);
const OUT = String(process.env.MR_OUT); const N = Number(process.env.MR_N || 30);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const names = (arr, key) => (Array.isArray(arr) ? arr : []).map((x) => String((isObj(x) ? (x[key] ?? x.name) : x) ?? ''));
const diffBag = (a, b) => { const m = new Map(); for (const x of a) m.set(x, (m.get(x) || 0) + 1); const lost = []; const gained = [];
  const n = new Map(); for (const x of b) n.set(x, (n.get(x) || 0) + 1);
  for (const [k, c] of m) for (let i = 0; i < c - (n.get(k) || 0); i++) lost.push(k);
  for (const [k, c] of n) for (let i = 0; i < c - (m.get(k) || 0); i++) gained.push(k); return { lost, gained }; };
/** the place's events: the history's events and its current tensions, keyed by their text */
const eventsOf = (s) => {
  const h = isObj(s?.history) ? s.history : {};
  const ev = [...(Array.isArray(h.events) ? h.events : []), ...(Array.isArray(h.historicalEvents) ? h.historicalEvents : [])];
  return ev.map((e) => (isObj(e) ? String(e.name ?? e.title ?? e.event ?? e.description ?? JSON.stringify(e)) : String(e)));
};
/** the same events keyed by when they happened (`yearsAgo`) and their kind, a key no rewording moves */
const eventYearsOf = (s) => {
  const h = isObj(s?.history) ? s.history : {};
  return (Array.isArray(h.historicalEvents) ? h.historicalEvents : []).map((e) => (isObj(e) ? `${e.yearsAgo ?? '?'}y ${e.type || ''}` : '?'));
};
const holdings = (s) => ({
  houses: names(s?.institutions, 'name'),
  people: names(s?.npcs, 'name'),
  roles: (Array.isArray(s?.npcs) ? s.npcs : []).map((c) => `${c?.name} (${c?.role ?? c?.title ?? ''})`),
  powers: names(s?.powerStructure?.factions, 'faction'),
  government: String(s?.powerStructure?.governingName ?? s?.powerStructure?.government ?? ''),
  events: eventsOf(s),
  eventYears: eventYearsOf(s),
});

test('master births, saved, loaded and re-derived', async () => {
  mkdirSync(`${OUT}/saved`, { recursive: true });
  // ── master: the birth and the save ──
  const M = `${MASTER}/src/`;
  const mPipe = await import(/* @vite-ignore */ M + 'generators/generateSettlementPipeline.js');
  const mB = await import(/* @vite-ignore */ M + 'domain/density/densityCreateBoundary.js');
  const { newSettlementMapEdits } = await import(/* @vite-ignore */ M + 'domain/townMap/mapEdits.js');
  await mB.loadGenerationLawPayloads();
  // ── the load tree: its load path and its re-derivation ──
  const L = `${LOAD}/src/`;
  const lPipe = await import(/* @vite-ignore */ L + 'generators/generateSettlementPipeline.js');
  const lB = await import(/* @vite-ignore */ L + 'domain/density/densityCreateBoundary.js');
  const lRunner = await import(/* @vite-ignore */ L + 'generators/pipeline.js');
  const { rederive } = await import(/* @vite-ignore */ L + 'domain/edit/dmLayer.js');
  const { normalizeSettlement } = await import(/* @vite-ignore */ L + 'domain/normalizeSettlement.js');
  // editSlice.js's own consult: `Object.freeze({ isEditableCard, declarationsFor })` from domain/edit/fieldDeclarations.js
  const fd = await import(/* @vite-ignore */ L + 'domain/edit/fieldDeclarations.js');
  const consult = Object.freeze({ isEditableCard: fd.isEditableCard, declarationsFor: fd.declarationsFor });
  await lB.loadGenerationLawPayloads();
  const engine = { run: (c, n, o) => lPipe.generateSettlementPipeline(c, n, o), getStepMeta: lRunner.getStepMeta };
  const EMPTY = Object.freeze({ roots: Object.freeze({}), worldFacts: Object.freeze({}), minted: Object.freeze({}), phantoms: Object.freeze({}) });

  const rows = [];
  for (const size of SIZES) for (let i = 0; i < N; i++) {
    const seed = `dp-${size}-${i}`;
    const born = mPipe.generateSettlementPipeline(mB.birthConfig({ settType: size }), null, { seed, customContent: {} });
    // SaveToLibraryButton's payload, then supabaseSave's row (migrateSaveToV2 is identity on settlement; the neighbour link
    // is derived only from a generated `neighborRelationship`, which no census birth carries: checked below)
    const minted = born.mapEdits ? born : { ...born, mapEdits: newSettlementMapEdits() };
    const row = JSON.parse(JSON.stringify({ name: minted.name, tier: minted.tier, data: minted, config: minted._config || null,
      seed: minted._seed ?? minted._config?._seed ?? null, campaign_state: { phase: 'draft' }, updated_at: '2026-11-07T00:00:00Z' }));
    writeFileSync(`${OUT}/saved/${seed}.json`, JSON.stringify(row));
    // the load tree's load path: the row's settlement, normalized (migrations to latest)
    const live = normalizeSettlement(row.data);
    let derived = null; let err = null;
    try { derived = rederive(live, row.config || {}, EMPTY, engine, consult).record; } catch (e) { err = String(e?.message || e).slice(0, 300); }
    const after = derived ? Object.assign(derived, Object.fromEntries(Object.keys(live).filter((k) => !Object.hasOwn(derived, k)).map((k) => [k, live[k]]))) : null;
    const a = holdings(row.data); const b = after ? holdings(after) : null;
    rows.push({ seed, size, err, neighbour: !!row.data?.neighborRelationship?.name, seedCarried: row.data?._seed ?? null, configCarried: !!row.config,
      houses: b ? diffBag(a.houses, b.houses) : null, people: b ? diffBag(a.people, b.people) : null, roles: b ? diffBag(a.roles, b.roles) : null,
      powers: b ? diffBag(a.powers, b.powers) : null, government: b ? [a.government, b.government] : null, events: b ? diffBag(a.events, b.events) : null, eventYears: b ? diffBag(a.eventYears, b.eventYears) : null,
      counts: { housesBefore: a.houses.length, housesAfter: b?.houses.length ?? null, peopleBefore: a.people.length, peopleAfter: b?.people.length ?? null,
        powersBefore: a.powers.length, powersAfter: b?.powers.length ?? null, eventsBefore: a.events.length, eventsAfter: b?.events.length ?? null } });
  }
  writeFileSync(`${OUT}/rows.jsonl`, `${rows.map((r) => JSON.stringify(r)).join('\n')}\n`);
}, 7200000);
