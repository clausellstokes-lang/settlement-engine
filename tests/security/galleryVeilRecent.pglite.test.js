/**
 * galleryVeilRecent.pglite.test.js — R5-RECENT's RED FIRST, item 1 (VEIL-33's V33-R5R; the chair's E78 (1) of 2026-11-22
 * 12:21 UTC, vetoable by the owner; docs/chair/2026-11-20/veil/briefs/R5-RECENT-BRIEF.md): A POWER THE READ WITHHOLDS IS
 * NAMED ON A SHARED READ, by `powerStructure.recentConflict` (registry row power.recentConflict, its host PLANNED: built in
 * neither engine). BOTH ENGINES: 212 through the server on a pglite chain of every migration on disk; the twin
 * (projectShareVeil over galleryPayloadFor) beside it. galleryVeilTell5's harness: every setting of the owner's switch (own,
 * the mixed g:<bits>, allOpen, off) and `shown` (the own setting with every hideable house shown by hand), Reveal DM off and
 * on, BOTH STORED SHAPES (the new shape; master's, the powers also in the top-level factions[]); the gallery read at every
 * setting, the party link, the import and the campaign map's member at the own setting (the map's member and the link are
 * the player view: their twin is read with Reveal DM off).
 *
 * THE RULE (E78 (1), as ruled): on every shared read, `powerStructure.recentConflict` IS WITHHELD wherever it NAMES A POWER
 * THE READ WITHHOLDS (by rule: a power of the stored lists that neither served list names; or by the owner: a power flagged
 * `hidden`), in both engines. WITHHELD, NOT MASKED: on such a read the served value is the key's absence or the empty form
 * (null or ''; the writer measures which, ruling 62 (2)); a served sentence that names the power (by the lane's fold,
 * gallerySecondHomes.js :: buildNameSearch, the served powers' and houses' names its open names), carries the projection's
 * mask ("an unseen interest") or is any other rewrite of the stored sentence is a fault. server = twin at the key.
 *
 * A power the owner hid is withheld where the read does not serve its row (the player view; on Reveal DM its row is served).
 *
 * THE PLANTS (each its own arm, RED at abd68e653 by design: the cure is the writer's):
 *   (a) a hidden criminal house whose criminal power took the seat (power.entry withholds it), the sentence naming it;
 *   (b) the same naming a power the OWNER hid (`hidden: true`);
 *   (c) the name in another spelling: the bare form without its qualifier, a possessive, lower case (and lower case on (b)).
 * THE TEETH (GREEN, or the seat STOPs): a sentence naming only SERVED powers is served byte for byte, both engines, every read
 * (beside a withheld criminal power, and beside an owner-hidden one); on a read that hides nothing it is served as stored.
 *
 * ── THE CURE RE-STATES THEM (R5-RECENT's cure, second half: the chair's E92 (1), (5), E93 and E97 (1) of 2026-11-22,
 * vetoable by the owner; brief R5C6; VEIL-33's V33-R5C6) ──────────────────────────────────────────────────────
 * THE RULE AS CURED: `powerStructure.recentConflict` IS WITHHELD ALWAYS, on every shared read of every place, both engines,
 * both stored shapes, every door, Reveal DM off and on (212 :: _gallery_veil_withhold_always; the twin galleryWithholdAlways.js
 * :: withholdAlways), and with it its COPY, the top-level `pressureSentence` wherever it equals the stored sentence (E97 (1)).
 * An absence every place shows is no tell. So every arm below holds the field ABSENT from every served payload: no key
 * `recentConflict` at any depth, no served string holding the stored sentence, no `pressureSentence` that copied it; server =
 * twin. The plants still prove they reach the gate (the stored sentence names the withheld power on the reads they name).
 * THE TEETH, RE-STATED (E92 (5)): they assumed the stored sentence served; a tooth now holds that THE PAGE's re-derived
 * sentence (pageRederive.js :: rederiveRecentConflict, reader B, at the page's door rederiveForPage and the import's save
 * importRederive.js :: rederiveServed) equals the stored one on a read that hides nothing: THE FIDELITY ARM below, on born
 * places (a hand-made town carries no config, so the engine's writer draws nothing on it; its teeth hold the absence).
 *
 * THE BORN POOL (R5C2's births, docs/chair/2026-11-20/veil/out/v33/r5recent/R5C2-run.sh and its probes; seeds
 * `r5c2-m3-<size>-<i>`, `r5c2-m3b-<size>-<i>`): the standing run walks a slice of it (STANDING_POOL, below, with the listed
 * place in it); `R5C6_POOL=full` walks all 480. Through BOTH ENGINES (212 on pglite; the twin) and both of the reader's
 * doors (the page: rederiveForPage; the import: rederiveServed), Reveal DM off and on:
 *   FIDELITY   every nothing-hidden page reproduces the stored sentence, EXCEPT a page whose record shows a house added by
 *              a coherence repair AFTER the power step (E93 (1)): LISTED BY NAME with that cause (REPAIR_LISTED), the cause
 *              WITNESSED (the reader re-run with each `coherence_repair` house removed in turn: one removal restores the
 *              stored sentence). A miss with any other cause, or a repair miss not listed by name, reds.
 *   DIFFERENTIAL  the unit's real proof (E92 (5), E93 (2)): a HIDING read's page sentence equals the page sentence of the
 *              same place with the withheld powers and houses NEVER THERE (the stored record without them, read the same way),
 *              each engine, each door; and it names no power or house the read withholds (the lane's fold).
 *   THE HAND HIDES (R5D-PAGE item 0 (a); the chair's E128): the differential and the name check over plant (b) r5-owner,
 *              act T's jp6-city-8 and hand hides of a density host and a noble power on the pool's births (reader B re-creates a
 *              power hidden by hand from the served houses; the page names no power the served roster does not carry).
 *   THE COUNT c (E97 (2) (c), E98): on hiding reads (every setting, Reveal DM off and on, the gallery read), the places whose
 *              stored pressureSentence is NOT the sentence and names a power or house, whose SERVED pressureSentence names a
 *              withheld one: the server's c beside the twin's (server = twin; the figure goes to the hand-back).
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { appendFileSync } from 'node:fs';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';
import { buildNameSearch } from '../../src/domain/display/gallerySecondHomes.js';
import { HIDDEN_POWER_MASK } from '../../src/domain/display/publicSafe.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';

const ARM_TIMEOUT_MS = 600_000; // deadlock guard, not a perf budget
const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
/** The measures the hand-back quotes, to R5R_MEASURES where it is set (the config silences the console). */
const note = (...a) => { if (process.env.R5R_MEASURES) appendFileSync(process.env.R5R_MEASURES, `${a.join(' ')}\n`); };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const CRIM = OPEN.slice(0, 3);

// ── THE TOWNS ────────────────────────────────────────────────────────────
const TGC = Object.freeze({ id: 'inst-r5-tgc', name: "Thieves' guild chapter", category: 'Criminal', desc: 'A chapter of the guild.' });
const FISH = Object.freeze({ id: 'inst-r5-fish', name: 'Fish market', category: 'Economy', desc: 'Fish, salted and fresh.' });
const MILL = Object.freeze({ id: 'inst-r5-mill', name: 'Mill', category: 'Economy', desc: 'Grain, ground fine.' });
const TG = "Thieves' Guild";
const TGP = "Thieves' Guild (powerful)";
const HAND = 'Silent Hand';
/** The witness's shape (jp6-metropolis-0, act K): the criminal power is NOT the governing one, so power.entry withholds it. */
const takerPowers = (taker) => [{ faction: 'Shadow Senate', category: 'civic', power: 50, isGoverning: true, desc: 'The senate sits behind closed doors.' },
  { faction: taker, category: 'criminal', power: 30, desc: 'The guild takes its cut.' },
  { faction: 'Fishers', category: 'economic', power: 20, desc: 'The fishers keep the quay.' }];
/** A power the OWNER hid (`hidden: true`, the stress infiltrator's stamp). */
const ownerPowers = () => [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true, desc: 'The council sits weekly.' },
  { faction: HAND, category: 'civic', power: 25, hidden: true, desc: 'Nobody says who they are.' },
  { faction: 'Fishers', category: 'economic', power: 25, desc: 'The fishers keep the quay.' }];
const openPowers = () => [{ faction: 'Reeve', category: 'civic', power: 60, isGoverning: true, desc: 'The reeve keeps the rolls.' },
  { faction: 'Millers', category: 'economic', power: 40, desc: 'The millers keep the weir.' }];
const townOf = (name, factions, recent, houses = [TGC, FISH]) => ({
  name, tier: 'town', institutions: clone(houses),
  powerStructure: { factions: clone(factions), factionRelationships: [{ pair: [factions[0].faction, factions[factions.length - 1].faction], type: 'ally' }], recentConflict: recent },
  economicState: { safetyProfile: { crimeTypes: [] } },
  // the generator's fallback COPY (narrativeGenerator.js :: generatePressureSentence), withheld with its source (E97 (1))
  pressureSentence: recent,
});
/** The own setting's engine-reads (2 engines x 2 shapes x 7: Reveal off gallery, map, link, import; on, gallery, map, import). */
const ALL_OWN = 2 * 2 * 7;
/** Of them, the player view's (Reveal off, and the map's member whatever the share says): where an owner-hidden row is dropped. */
const PLAYER_OWN = 2 * 2 * 5;
/** THE PLANTS: each names the power its read withholds (`target`), stored once in the sentence; `ownWithheld` the own
 * setting's engine-reads that withhold it. */
const PLANTS = Object.freeze([
  { arm: '(a)', seed: 'r5-taker', target: TG, ownWithheld: ALL_OWN, how: 'a hidden criminal house\'s criminal power took the seat, named as itself',
    stored: townOf('Saltreach', takerPowers(TG), `${TG} overthrew the grand merchant oligarchy and reshaped the government as a shadow senate.`) },
  { arm: '(b)', seed: 'r5-owner', target: HAND, ownWithheld: PLAYER_OWN, how: 'a power the OWNER hid (hidden: true), named as itself',
    stored: townOf('Greywater', ownerPowers(), `${HAND} overthrew the council's old guard and reshaped the government as a shadow senate.`) },
  { arm: '(c)', seed: 'r5-bare', target: TGP, ownWithheld: ALL_OWN, how: 'the withheld power\'s BARE form, without its qualifier',
    stored: townOf('Copperhythe', takerPowers(TGP), `${TG} overthrew the grand merchant oligarchy and reshaped the government as a shadow senate.`) },
  { arm: '(c)', seed: 'r5-possessive', target: TG, ownWithheld: ALL_OWN, how: 'a POSSESSIVE of the withheld power',
    stored: townOf('Wrackmouth', takerPowers(TG), `The ${TG}'s enforcers overthrew the grand merchant oligarchy, and a shadow senate sits in its place.`) },
  { arm: '(c)', seed: 'r5-lower', target: TG, ownWithheld: ALL_OWN, how: 'the withheld power in LOWER CASE',
    stored: townOf('Eelford', takerPowers(TG), "the thieves' guild overthrew the grand merchant oligarchy and reshaped the government as a shadow senate.") },
  { arm: '(c)', seed: 'r5-owner-lower', target: HAND, ownWithheld: PLAYER_OWN, how: 'the owner-hidden power in LOWER CASE (past the mask)',
    stored: townOf('Duskmere', ownerPowers(), 'Since the silent hand overthrew the old guard, the town answers to a shadow senate.') },
]);
/** THE TEETH: a sentence naming only served powers, beside a withheld criminal power and beside an owner-hidden one; a town
 * that hides nothing (no hideable house, no hidden power). */
const TEETH = Object.freeze([
  { seed: 'r5-served', stored: townOf('Harrowgate', takerPowers(TG), 'The Fishers overthrew the grand merchant oligarchy and reshaped the government as a shadow senate.') },
  { seed: 'r5-owner-served', stored: townOf('Lowmoor', ownerPowers(), 'The Fishers overthrew the old guard and left the Town Council to sit in its place.') },
]);
const OPEN_TOWN = Object.freeze({ seed: 'r5-open', stored: townOf('Millbrook', openPowers(), "The Millers overthrew the reeve's old bailiff and reshaped the government as a council of elders.", [MILL]) });
// ── THE BORN POOL (R5C2's births) ────────────────────────────────────────
const POOL_FULL = process.env.R5C6_POOL === 'full';
const POOL_TIMEOUT_MS = POOL_FULL ? 3_600_000 : ARM_TIMEOUT_MS; // deadlock guard, not a perf budget
const SIZES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
/** THE LISTED PLACES (E93 (1)): a nothing-hidden page whose stored sentence the reader does not reproduce BECAUSE a house was
 * added by a coherence repair after the power step (`source: 'coherence_repair'`), by name, with the house the witness finds.
 * Today one in R5C2's 480 (its measure (3), variant C: removing the house restores the sentence). */
const REPAIR_LISTED = Object.freeze({ 'r5c2-m3-hamlet-8': 'Citizen militia' });
/** The standing slice: the first prefix, the first STANDING_N of each size, and every listed place. */
const STANDING_N = 6;
/** `R5C6_SHARD=<i>/<k>` (the full pool only): this run walks the places whose index is i modulo k, so k runs side by side
 * under one gate cover the 480 (each boots its own chain); the figures are the shards' sum. */
const SHARD = /^(\d+)\/(\d+)$/.exec(process.env.R5C6_SHARD || '');
function poolSeeds() {
  const out = [];
  for (const prefix of POOL_FULL ? ['r5c2-m3', 'r5c2-m3b'] : ['r5c2-m3']) for (const size of SIZES) for (let i = 0; i < (POOL_FULL ? 40 : STANDING_N); i += 1) out.push({ seed: `${prefix}-${size}-${i}`, size });
  for (const seed of Object.keys(REPAIR_LISTED)) if (!out.some((x) => x.seed === seed)) out.push({ seed, size: seed.split('-').slice(-2, -1)[0] });
  return POOL_FULL && SHARD ? out.filter((_x, i) => i % Number(SHARD[2]) === Number(SHARD[1])) : out;
}
/** The sentence a document holds, or null. */
const sentenceOf = (d) => (isRec(d?.powerStructure) && typeof d.powerStructure.recentConflict === 'string' ? d.powerStructure.recentConflict : null);
/** BOTH STORED SHAPES: the new one, and master's (the powers also in the top-level factions[], R3's 'openM'). */
const SHAPES = Object.freeze({ new: (s) => clone(s), master: (s) => ({ ...clone(s), factions: clone(s.powerStructure.factions) }) });

// ── THE JUDGMENT ─────────────────────────────────────────────────────────
const listsOf = (x) => [...arr(x?.powerStructure?.factions), ...arr(x?.factions)].filter(isRec);
/** The powers a read withholds: every name (and id, as text) of a stored power that neither served list names, whether the
 * rule withheld it (power.entry) or the owner hid it (`hidden: true`: the projection drops its row on the player view).
 * MEASURED (run 1, the twin and 212 alike): on Reveal DM the owner-hidden row IS SERVED, `hidden: true` on it, and the
 * sentence names it unmasked; that read does not withhold the power, so it is not judged here (the hand-back says so). */
function withheldOf(stored, d) {
  const served = new Set(listsOf(d).flatMap((f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v)));
  const out = new Set();
  for (const f of listsOf(stored)) {
    const names = [f.faction, f.name].filter((v) => typeof v === 'string' && v);
    if (!names.length || names.some((n) => served.has(n))) continue;
    for (const v of [...names, typeof f.id === 'number' ? String(f.id) : f.id]) if (typeof v === 'string' && v) out.add(v);
  }
  return [...out];
}
/** The names of the powers and houses a document serves (the search's open names, ruling 37 (a)). */
const servedNamesOf = (d) => [...new Set([...listsOf(d).flatMap((f) => [f.faction, f.name]), ...arr(d?.institutions).filter(isRec).map((h) => h.name)]
  .filter((v) => typeof v === 'string' && v))];
/** Whether a string names a withheld power by THE LANE'S FOLD (itself and its bare form, case-blind, a possessive and a plural
 * ending as a boundary), the served names its open names; the ONLY exemption a hit lying wholly inside a name the same
 * document serves (galleryRosterChoices.pglite.test.js :: searchHits, its rule); an id as the whole text. */
function namesWithheld(text, withheld, d) {
  if (typeof text !== 'string' || text === '') return false;
  if (withheld.includes(text)) return true;
  const words = withheld.filter((t) => !/^\d+$/.test(t));
  const opens = servedNamesOf(d);
  const bare = buildNameSearch(words, []);
  const search = buildNameSearch(words, opens);
  if (!bare || !bare.hit(text)) return false;
  if (search && search.hit(text)) return true;
  const holders = opens.filter((n) => text.includes(n) && bare.hit(n));
  return !holders.length || bare.hit(holders.reduce((x, n) => x.split(n).join(' '), text));
}
/** The served key: { has, v }. */
const recentOf = (d) => (isRec(d?.powerStructure) && Object.prototype.hasOwnProperty.call(d.powerStructure, 'recentConflict')
  ? { has: true, v: d.powerStructure.recentConflict } : { has: false });
/** The empty forms the rule admits on a read that withholds the named power (the writer measures which, ruling 62 (2)). */
const isWithheldForm = (k) => !k.has || k.v === null || k.v === '';
/** One engine's fault on a GATED read (the stored sentence names a power the read withholds), or null. */
function gatedFault(want, k, wh, d) {
  if (isWithheldForm(k)) return null;
  if (namesWithheld(k.v, wh, d)) return 'names the withheld power';
  if (typeof k.v === 'string' && k.v.includes(HIDDEN_POWER_MASK) && !want.includes(HIDDEN_POWER_MASK)) return 'serves the mask\'s form';
  return 'serves a rewritten form';
}

/** Every key and every string leaf of a document. */
function walkDoc(v, keys = new Set(), strs = []) {
  if (typeof v === 'string') strs.push(v);
  else if (Array.isArray(v)) for (const x of v) walkDoc(x, keys, strs);
  else if (isRec(v)) for (const [k, x] of Object.entries(v)) { keys.add(k); walkDoc(x, keys, strs); }
  return { keys, strs };
}
/** THE CURED RULE on one engine's served document (E92 (1), E97 (1)): the faults, [] where the field is absent. */
function absenceFaults(want, d) {
  const out = [];
  const { keys, strs } = walkDoc(d);
  if (keys.has('recentConflict')) out.push('serves a recentConflict key');
  if (typeof want === 'string' && want !== '' && strs.some((x) => x.includes(want))) out.push('serves the stored sentence (or a string holding it)');
  if (isRec(d) && Object.prototype.hasOwnProperty.call(d, 'pressureSentence') && d.pressureSentence === want) out.push('serves the pressureSentence copy');
  return out;
}
/** What server = twin is judged on, per read: the field's presence and the copy's. */
const presenceOf = (d) => ({ key: walkDoc(d).keys.has('recentConflict'), copy: isRec(d) && Object.prototype.hasOwnProperty.call(d, 'pressureSentence') });

describe('R5-RECENT (E78 (1); cured by E92 (1), E93, E97 (1)): powerStructure.recentConflict withheld always, the twin against 212', () => {
  let db;
  let veil;
  let sw;
  let m = 0;
  const at = '2026-11-01T00:00:00.000Z';
  const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
  const cache = new Map();
  /** The owner's switch settings, each computed on the record read (tell-common.mjs :: settings; g:111 is own), and `shown`. */
  const settingsOf = (stored, dm) => {
    const pub = veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: null });
    const model = veil.curateModelFor(pub, []);
    const present = sw.presentCriminalGroupings(pub);
    const out = { own: opened(OPEN) };
    for (let b = 0; b < 7; b += 1) {
      const bits = [4, 2, 1].map((x) => ((b & x) ? '1' : '0')).join('');
      out[`g:${bits}`] = opened(['tab:plot_hooks', ...CRIM.filter((_g, i) => bits[i] === '1')]);
    }
    out.allOpen = sw.setCriminalVeil(opened(OPEN), model.defaults, false, present, model).filter((d) => !String(d.address).startsWith('card:institution:'));
    out.off = sw.setCriminalVeil(opened(OPEN), model.defaults, true, present, model);
    const idOf = (h) => veil.CARD_KINDS.institution.idOf(h);
    const shows = arr(stored.institutions).filter((h) => isHideableHouse(h))
      .flatMap((h) => [`card:institution:${idOf(h)}`, ...['description', 'function', 'services', 'people'].map((f) => `field:institution:${idOf(h)}:${f}`)]);
    out.shown = opened([...OPEN, ...shows]);
    return out;
  };
  /** Every read of one record in one stored shape, both engines: [{ shape, setting, dm, read, server, twin }]. */
  const readAll = async (stored, shape) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of Object.entries(settingsOf(stored, dm))) {
      m += 1;
      const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at });
      const id = `7e5c7000-0000-0000-0000-${String(m).padStart(12, '0')}`;
      const slug = `r5r${m}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name), String(stored.tier), J(stored), slug, `${slug}-link`, J(ov), dm]);
      await db.exec(`set test.uid = '';`);
      const docs = { gallery: (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d };
      if (setting === 'own') {
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
          values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, J({ campaign: { settlementIds: [id] } }), `${slug}-map`, `${slug}-mapl`]);
        docs.map = (await db.query('select public.get_gallery_map($1) #> \'{members,0,settlement}\' d', [`${slug}-map`])).rows[0]?.d;
        if (!dm) docs.link = (await db.query('select public.get_unlisted_dossier($1) -> \'dossier\' d', [`${slug}-link`])).rows[0]?.d;
        await db.exec(`set test.uid = '${READER}';`);
        docs.import = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
        await db.exec(`set test.uid = '';`);
      }
      const twinOf = (d) => veil.projectShareVeil(veil.galleryPayloadFor(clone(stored), { shareDm: d, memberOverrides: ov }), ov);
      const twin = twinOf(dm); const twinOff = dm ? twinOf(false) : twin;
      for (const [read, d] of Object.entries(docs)) {
        out.push({ shape, setting, dm, read, server: isRec(d) ? d : null, twin: read === 'map' || read === 'link' ? twinOff : twin });
      }
    }
    return out;
  };
  /** Every read of a town, both stored shapes (read once, kept for the later arms). */
  const readsOf = async (town) => {
    if (!cache.has(town.seed)) {
      const out = [];
      for (const [shape, make] of Object.entries(SHAPES)) {
        const stored = make(town.stored);
        for (const r of await readAll(stored, shape)) out.push({ ...r, stored });
      }
      cache.set(town.seed, out);
    }
    return cache.get(town.seed);
  };
  const tag = (r, eng) => `${eng} ${r.shape} ${r.read} ${r.setting} dm=${r.dm}`;
  /** Per read and engine: the withheld powers, whether the stored sentence names one (gated), and the served key. */
  const judged = (r) => [['server', r.server], ['twin', r.twin]].filter(([, d]) => isRec(d)).map(([eng, d]) => {
    const want = r.stored.powerStructure.recentConflict;
    const wh = withheldOf(r.stored, d);
    return { eng, d, want, wh, gated: namesWithheld(want, wh, d), k: recentOf(d) };
  });
  /** The reads a town's every shape serves: 2 shapes x 2 Reveal DM x 11 settings gallery, + map and import (x2), + link. */
  const READS_PER_TOWN = 2 * (2 * 11 + 2 * 2 + 1);

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { if (db) await db.close(); });

  for (const p of PLANTS) {
    it(`PLANT ${p.arm} ${p.seed} (${p.how}): recentConflict is ABSENT from every served payload (no key at any depth, no string holding the sentence) and its pressureSentence copy with it, never naming the power by the lane's fold and never masked, both engines, every setting, Reveal DM off and on, both stored shapes; server = twin`, async () => {
      const rs = await readsOf(p);
      const faults = []; let gated = 0; let gatedOwn = 0; let own = 0; let ownWh = 0;
      for (const r of rs) {
        const js = judged(r);
        for (const j of js) {
          if (r.setting === 'own') own += 1;
          if (r.setting === 'own' && j.wh.includes(p.target)) ownWh += 1;
          for (const f of absenceFaults(j.want, j.d)) faults.push(`${tag(r, j.eng)}: ${f}`);
          if (!j.gated) continue;
          gated += 1;
          if (r.setting === 'own' && j.wh.includes(p.target)) gatedOwn += 1;
          const f = gatedFault(j.want, j.k, j.wh, j.d);
          if (f) faults.push(`${tag(r, j.eng)}: ${f}: ${J(j.k.v).slice(0, 120)}`);
        }
        if (js.length === 2 && canon(presenceOf(js[0].d)) !== canon(presenceOf(js[1].d))) faults.push(`${tag(r, 'server!=twin')}: server ${J(presenceOf(js[0].d))} | twin ${J(presenceOf(js[1].d))}`);
        else if (js.length !== 2) faults.push(`${tag(r, 'server!=twin')}: a document served by ${js.map((j) => j.eng).join('') || 'neither engine'} alone`);
      }
      note(`R5R plant ${p.arm} ${p.seed}: reads`, rs.length, '| gated reads (engine x read)', gated, '| own engine-reads withholding the target', ownWh, '| of them gated', gatedOwn, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
      // THE PLANT REACHES THE GATE (green: the red below is the rule's, not the plant's)
      expect(rs.length, 'every read was made').toBe(READS_PER_TOWN);
      expect(own, 'both engines served every read of the own setting').toBe(ALL_OWN);
      expect(ownWh, 'the own setting withholds the target on the reads the plant names, both engines, both shapes').toBe(p.ownWithheld);
      expect(gatedOwn, 'on each of them the stored sentence names the target (the lane\'s fold)').toBe(ownWh);
      // anchored: own and gated count the reads judged (asserted above), so an empty fault list is a judgment, not an empty walk
      expect(faults, `${faults.length} faults over ${2 * rs.length} engine-reads (${gated} gated)`).toEqual([]);
    }, ARM_TIMEOUT_MS);
  }

  for (const t of TEETH) {
    it(`TOOTH ${t.seed} (RE-STATED, E92 (5)): recentConflict naming only SERVED powers is ABSENT too, as on every place (an absence every place shows is no tell), both engines, every read and setting, Reveal DM off and on, both stored shapes; server = twin`, async () => {
      const rs = await readsOf(t);
      const faults = []; let beside = 0; let judgedN = 0;
      for (const r of rs) {
        const js = judged(r);
        for (const j of js) {
          judgedN += 1;
          if (j.wh.length) beside += 1;
          if (j.gated) faults.push(`${tag(r, j.eng)}: the tooth's sentence reads as naming a withheld power ${J(j.wh)}`);
          for (const f of absenceFaults(j.want, j.d)) faults.push(`${tag(r, j.eng)}: ${f}`);
        }
        if (js.length === 2 && canon(presenceOf(js[0].d)) !== canon(presenceOf(js[1].d))) faults.push(`${tag(r, 'server!=twin')}: server ${J(presenceOf(js[0].d))} | twin ${J(presenceOf(js[1].d))}`);
      }
      note(`R5R tooth ${t.seed}: engine-reads`, judgedN, '| beside a withheld power', beside, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
      expect(judgedN, 'both engines served every read').toBe(2 * READS_PER_TOWN);
      expect(beside, 'the tooth stands beside a withheld power on the gated reads').toBeGreaterThan(0);
      // anchored: judgedN is asserted above, so an empty fault list is a judgment over every engine-read
      expect(faults).toEqual([]);
    }, ARM_TIMEOUT_MS);
  }

  it('TOOTH (RE-STATED, E92 (5)): on a read that hides nothing (no power withheld, every stored house served), recentConflict is ABSENT as on every other read, both engines; the open town on every read, and every such read of every town (the page\'s sentence there: THE FIDELITY ARM, on born places)', async () => {
    const faults = []; let open = 0; let fromOthers = 0;
    for (const town of [OPEN_TOWN, ...TEETH, ...PLANTS]) for (const r of await readsOf(town)) for (const j of judged(r)) {
      const houses = new Set(arr(j.d.institutions).filter(isRec).map((h) => h.name));
      const hidesNothing = !j.wh.length && arr(r.stored.institutions).every((h) => houses.has(h.name));
      if (town === OPEN_TOWN && !hidesNothing) { faults.push(`${town.seed} ${tag(r, j.eng)}: the open town's read hides something ${J(j.wh)}`); continue; }
      if (!hidesNothing) continue;
      if (town === OPEN_TOWN) open += 1; else fromOthers += 1;
      for (const f of absenceFaults(j.want, j.d)) faults.push(`${town.seed} ${tag(r, j.eng)}: ${f}`);
    }
    note('R5R tooth hides-nothing: the open town\'s engine-reads', open, '| other towns\' reads that hide nothing', fromOthers, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
    expect(open, 'the open town hides nothing on every engine-read').toBe(2 * READS_PER_TOWN);
    // anchored: open is asserted above, so an empty fault list is a judgment over every read that hides nothing
    expect(faults).toEqual([]);
  }, ARM_TIMEOUT_MS);

  // ── THE BORN POOL: the page's ONE reader over both engines' payloads ─────
  let pool = null;
  let rd = null;
  /** The pool's births (made once), and the page's readers. */
  const poolOf = async () => {
    if (!pool) {
      const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
      const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
      const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
      await loadGenerationLawPayloads();
      pool = poolSeeds().map(({ seed, size }) => ({ seed, size, t: clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size }), null, { seed, customContent: {} })) }));
      const page = await import('../../src/domain/veil/pageRederive.js');
      const imp = await import('../../src/domain/veil/importRederive.js');
      rd = { page: page.rederiveForPage, reader: page.rederiveRecentConflict, served: imp.rederiveServed };
    }
    return pool;
  };
  const hidesAny = (t) => arr(t.institutions).some((h) => isRec(h) && isHideableHouse(h)) || listsOf(t).some((f) => f.hidden === true);
  /** One read of a stored record at one setting: the server's gallery read and import read, and the twin's document. */
  const readOne = async (stored, deltas, dm, { importToo = true } = {}) => {
    m += 1;
    const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at });
    const id = `7e5c7000-0000-0000-0000-${String(m).padStart(12, '0')}`;
    const slug = `r5c6${m}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name), String(stored.tier), J(stored), slug, `${slug}-link`, J(ov), dm]);
    await db.exec(`set test.uid = '';`);
    const gallery = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d;
    let imported = null;
    if (importToo) {
      await db.exec(`set test.uid = '${READER}';`);
      imported = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
      await db.exec(`set test.uid = '';`);
    }
    const twin = veil.projectShareVeil(veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: ov }), ov);
    return { server: { page: isRec(gallery) ? gallery : null, import: isRec(imported) ? imported : null }, twin: { page: twin, import: twin } };
  };
  /** The page's sentence at a door: the gallery page's (rederiveForPage) or the import's save (rederiveServed). */
  const pageSentence = (door, d) => (isRec(d) ? sentenceOf(door === 'page' ? rd.page(clone(d)) : rd.served(d)) : null);
  /** The withheld powers and houses of a read (a stored power neither served list names; a stored house the roster lacks). */
  const withheldAllOf = (stored, d) => {
    const sh = new Set(arr(d?.institutions).filter(isRec).map((h) => h.name));
    return [...new Set([...withheldOf(stored, d), ...arr(stored.institutions).filter((h) => isRec(h) && typeof h.name === 'string' && h.name && !sh.has(h.name)).map((h) => h.name)])];
  };

  it('THE FIDELITY ARM (E93 (1); the tooth re-stated): on every nothing-hidden born page the page\'s re-derived sentence equals the stored one, both engines, both doors, Reveal DM off and on, EXCEPT the pages LISTED BY NAME whose record shows a coherence-repair house added after the power step (the cause witnessed); a miss with any other cause reds', async () => {
    const births = (await poolOf()).filter((b) => !hidesAny(b.t));
    const faults = []; const misses = new Map(); let reads = 0; let reproduced = 0;
    for (const { seed, t } of births) {
      const S = t.powerStructure?.recentConflict;
      for (const dm of [false, true]) {
        const got = await readOne(t, opened(OPEN), dm);
        for (const eng of ['server', 'twin']) for (const door of ['page', 'import']) {
          const d = got[eng][door];
          if (!isRec(d)) { faults.push(`${seed} ${eng} ${door} dm=${dm}: no document`); continue; }
          reads += 1;
          for (const f of absenceFaults(S, d)) faults.push(`${seed} ${eng} ${door} dm=${dm}: the served payload ${f}`);
          const v = pageSentence(door, d);
          if (v === S) { reproduced += 1; continue; }
          // THE WITNESS: the reader re-run with each coherence-repair house removed in turn; one removal restores the sentence
          const repairs = arr(d.institutions).filter((h) => isRec(h) && h.source === 'coherence_repair');
          const cause = repairs.find((h) => { const x = clone(d); x.institutions = arr(x.institutions).filter((y) => !(isRec(y) && y.name === h.name && y.source === 'coherence_repair')); return sentenceOf(rd.reader(x, { authoritative: true })) === S; });
          misses.set(seed, [...(misses.get(seed) || []), { eng, door, dm, cause: cause ? cause.name : null, v }]);
        }
      }
    }
    const listedHere = Object.keys(REPAIR_LISTED).filter((k) => births.some((b) => b.seed === k));
    for (const [seed, ms] of misses) {
      for (const x of ms) if (!x.cause) faults.push(`${seed} ${x.eng} ${x.door} dm=${x.dm}: a miss with no coherence-repair cause: ${J(x.v).slice(0, 140)}`);
      if (ms.every((x) => x.cause) && REPAIR_LISTED[seed] !== ms[0].cause) faults.push(`${seed}: a coherence-repair miss (${ms[0].cause}) not LISTED BY NAME (REPAIR_LISTED)`);
    }
    for (const seed of listedHere) if (!misses.has(seed)) faults.push(`${seed}: LISTED, but its page reproduces the stored sentence now (re-take the list)`);
    note(`R5C6 fidelity (${POOL_FULL ? `full${SHARD ? ` shard ${SHARD[0]}` : ''}` : 'standing'} pool): births`, (await poolOf()).length, '| nothing-hidden', births.length, '| engine-door-reads', reads, '| reproduced', reproduced,
      '| missed places', J([...misses].map(([k, ms]) => `${k} (${ms.length} reads; cause ${J([...new Set(ms.map((x) => x.cause))])})`)), '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
    expect(births.length, 'the pool holds nothing-hidden places').toBeGreaterThan(0);
    expect(reads, 'both engines, both doors, Reveal DM off and on, every nothing-hidden place').toBe(births.length * 8);
    // anchored: reads is asserted above and every listed place is a miss here, so an empty fault list is a judgment
    expect(faults).toEqual([]);
  }, POOL_TIMEOUT_MS);

  it('THE DIFFERENTIAL (E92 (5), E93 (2)): a HIDING read\'s page sentence equals the page sentence of the same place with the withheld powers and houses NEVER THERE, each engine, both doors, Reveal DM off and on; it names nothing the read withholds; server = twin', async () => {
    const births = (await poolOf()).filter((b) => hidesAny(b.t));
    const faults = []; let reads = 0; let hiding = 0; let equal = 0;
    for (const { seed, t } of births) {
      for (const dm of [false, true]) {
        const got = await readOne(t, opened(OPEN), dm);
        const wh = withheldAllOf(t, got.twin.page);
        const whServer = isRec(got.server.page) ? withheldAllOf(t, got.server.page) : null;
        if (canon([...wh].sort()) !== canon([...(whServer || [])].sort())) faults.push(`${seed} dm=${dm}: server and twin withhold differently: ${J(whServer)} | ${J(wh)}`);
        if (!wh.length) continue;
        hiding += 1;
        const never = clone(t);
        never.institutions = arr(never.institutions).filter((h) => !(isRec(h) && wh.includes(h.name)));
        const keep = (f) => !(isRec(f) && [f.faction, f.name].some((n) => typeof n === 'string' && wh.includes(n)));
        if (isRec(never.powerStructure)) never.powerStructure.factions = arr(never.powerStructure.factions).filter(keep);
        if (Array.isArray(never.factions)) never.factions = never.factions.filter(keep);
        const ng = await readOne(never, opened(OPEN), dm);
        /** @type {Record<string, string | null>} */ const at2 = {};
        for (const eng of ['server', 'twin']) for (const door of ['page', 'import']) {
          const d = got[eng][door]; const n = ng[eng][door];
          if (!isRec(d) || !isRec(n)) { faults.push(`${seed} ${eng} ${door} dm=${dm}: no document`); continue; }
          reads += 1;
          for (const f of absenceFaults(t.powerStructure?.recentConflict, d)) faults.push(`${seed} ${eng} ${door} dm=${dm}: the served payload ${f}`);
          const ph = pageSentence(door, d); const pn = pageSentence(door, n);
          at2[`${eng} ${door}`] = ph;
          if (ph === null) faults.push(`${seed} ${eng} ${door} dm=${dm}: the page drew no sentence (the reader is not at this door)`);
          else if (ph === pn) equal += 1;
          else faults.push(`${seed} ${eng} ${door} dm=${dm}: hiding ${J(ph).slice(0, 110)} | never there ${J(pn).slice(0, 110)}`);
          if (namesWithheld(ph, wh, d)) faults.push(`${seed} ${eng} ${door} dm=${dm}: the page's sentence names a withheld power or house ${J(wh)}: ${J(ph).slice(0, 140)}`);
        }
        for (const door of ['page', 'import']) if (at2[`server ${door}`] !== at2[`twin ${door}`]) faults.push(`${seed} ${door} dm=${dm}: server ${J(at2[`server ${door}`]).slice(0, 100)} | twin ${J(at2[`twin ${door}`]).slice(0, 100)}`);
      }
    }
    note(`R5C6 differential (${POOL_FULL ? `full${SHARD ? ` shard ${SHARD[0]}` : ''}` : 'standing'} pool): hiding places`, births.length, '| hiding reads (place x Reveal DM)', hiding, '| engine-door-reads', reads, '| equal', equal, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
    expect(hiding, 'the pool holds hiding reads').toBeGreaterThan(0);
    expect(reads, 'both engines, both doors, every hiding read').toBe(hiding * 4);
    // anchored: reads is asserted above, so an empty fault list is a judgment over every hiding read
    expect(faults).toEqual([]);
  }, POOL_TIMEOUT_MS);

  // ── THE HAND HIDES (R5D-PAGE item 0 (a); the chair's E128, VEIL-34's review (H)): reader B builds its sentence from the
  // served HOUSES and config, never from the served powers, so a power an owner hid BY HAND is re-created in B's own roster.
  // The differential and the name check above ran on house hides only; here they run on (1) plant (b) r5-owner, (2) act T's
  // jp6-city-8 (the join probe's lit act by its recipe: the first non-governing, unveiled power hidden by the DM takes the
  // seat by a coup, rulingPower.js :: transferRulingPower), (3) on R5C2's births, each density host (the power a
  // density-law rival was minted from, seatKey(host) === rival.contestsNiche) and each non-governing noble power hidden by
  // hand (`hidden: true`), each its own record. THE RULE (E128 (b)): a page reader names no power the SERVED ROSTER does not
  // carry, every row the read hides OUT (a stamped row on the DM door too), as if never there.
  it('THE HAND HIDES (E128 (a)): the differential and the name check over plant (b) r5-owner, act T\'s jp6-city-8 and hand hides of a density host and a noble power on born towns: the page\'s sentence equals the never-there page\'s and names no power the read hides (a stamped row out), each engine, both doors, Reveal DM off and on', async () => {
    const births = await poolOf();
    const { seatKey } = await import('../../src/domain/density/seatKey.js');
    const { isVeiledPower } = await import('../../src/domain/people/cardVeil.js');
    const { transferRulingPower } = await import('../../src/domain/rulingPower.js');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const nameOf = (f) => (isRec(f) ? String(f.faction ?? f.name ?? '') : '');
    const hideByHand = (t, name) => { const x = clone(t); x.powerStructure.factions = x.powerStructure.factions.map((f) => (nameOf(f) === name ? { ...f, hidden: true } : f)); return x; };
    const recs = [{ seed: 'r5-owner', how: 'plant (b)', t: PLANTS.find((p) => p.seed === 'r5-owner').stored }];
    const born = clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: 'jp6-city-8', customContent: {} }));
    const gov = arr(born.powerStructure?.factions).find((f) => f?.isGoverning);
    const A = nameOf(arr(born.powerStructure?.factions).find((f) => isRec(f) && f !== gov && !isVeiledPower(f)));
    const tr = transferRulingPower(hideByHand(born, A), A, { cause: 'coup' });
    if (!tr.error) recs.push({ seed: 'jp6-city-8', how: `act T (${A})`, t: clone(tr.settlement) });
    for (const { seed, t } of births) {
      const fs = arr(t.powerStructure?.factions).filter(isRec);
      const rival = fs.find((f) => typeof f.contestsNiche === 'string');
      const host = rival ? fs.find((f) => f !== rival && seatKey(f) === rival.contestsNiche && !f.hidden) : null;
      if (host) recs.push({ seed, how: `hand hide: density host ${nameOf(host)}`, t: hideByHand(t, nameOf(host)) });
      const noble = fs.find((f) => !f.isGoverning && !f.hidden && (f.category === 'noble' || ['Noble Families', 'Noble Houses', 'Landed Gentry', 'Manor Household'].includes(nameOf(f))));
      if (noble && noble !== host) recs.push({ seed, how: `hand hide: noble power ${nameOf(noble)}`, t: hideByHand(t, nameOf(noble)) });
    }
    /** The powers the read hides: a stored power no served list carries UNCUT (a stamped or masked row is out). */
    const hiddenBy = (stored, d) => {
      const served = new Set(listsOf(d).filter((f) => f.hidden !== true && f.faction !== HIDDEN_POWER_MASK && f.name !== HIDDEN_POWER_MASK).map(nameOf).filter(Boolean));
      return [...new Set([...listsOf(stored).map(nameOf).filter((n) => n && !served.has(n)), ...withheldAllOf(stored, d)])];
    };
    /** The lane's fold, the uncut served powers' and houses' names open (a stamped row's name is NOT open: it is hidden). */
    const namesHidden = (text, wh, d) => {
      const opens = [...listsOf(d).filter((f) => f.hidden !== true && f.faction !== HIDDEN_POWER_MASK && f.name !== HIDDEN_POWER_MASK).map(nameOf), ...arr(d?.institutions).filter(isRec).map((h) => h.name)]
        .filter((v) => typeof v === 'string' && v && !wh.includes(v));
      const search = buildNameSearch(wh, opens);
      return !!search && search.hit(text);
    };
    const faults = []; let reads = 0; let equal = 0; let drawn = 0; let hiding = 0; const recreated = new Set();
    for (const { seed, how, t } of recs) for (const dm of [false, true]) {
      const got = await readOne(t, opened(OPEN), dm);
      const wh = hiddenBy(t, got.twin.page);
      if (!wh.length) continue;
      hiding += 1;
      const never = clone(t);
      never.institutions = arr(never.institutions).filter((h) => !(isRec(h) && wh.includes(h.name)));
      const keep = (f) => !(isRec(f) && wh.includes(nameOf(f)));
      never.powerStructure.factions = arr(never.powerStructure.factions).filter(keep);
      if (Array.isArray(never.factions)) never.factions = never.factions.filter(keep);
      const ng = await readOne(never, opened(OPEN), dm);
      for (const eng of ['server', 'twin']) for (const door of ['page', 'import']) {
        const d = got[eng][door]; const n = ng[eng][door];
        if (!isRec(d) || !isRec(n)) { faults.push(`${seed} (${how}) ${eng} ${door} dm=${dm}: no document`); continue; }
        reads += 1;
        const ph = pageSentence(door, d); const pn = pageSentence(door, n);
        if (ph !== null) drawn += 1;
        if (ph === pn) equal += 1;
        else faults.push(`${seed} (${how}) ${eng} ${door} dm=${dm}: hiding ${J(ph).slice(0, 110)} | never there ${J(pn).slice(0, 110)}`);
        if (typeof ph === 'string' && namesHidden(ph, wh, d)) faults.push(`${seed} (${how}) ${eng} ${door} dm=${dm}: the page's sentence names a power the read hides ${J(wh)}: ${J(ph).slice(0, 140)}`);
        if (typeof ph === 'string' && ph.includes(HIDDEN_POWER_MASK)) faults.push(`${seed} (${how}) ${eng} ${door} dm=${dm}: the page's sentence carries the mask`);
        if (eng === 'twin' && door === 'page' && isRec(d.config)) {
          const { generatePowerStructure } = await import('../../src/generators/power/rulingStructure.js');
          try {
            const entries = arr(d.stressors).length ? arr(d.stressors) : isRec(d.stress) ? [d.stress] : arr(d.stress);
            const fresh = generatePowerStructure(d.tier, clone(d.economicState ?? {}), null, clone(d.config), clone(arr(d.institutions).filter(isRec)), { stressEntries: clone(entries) });
            for (const f of arr(fresh?.factions)) if (wh.includes(nameOf(f))) recreated.add(`${seed} (${how}) dm=${dm}: ${nameOf(f)}`);
          } catch { /* the engine cannot read it: B draws nothing */ }
        }
      }
    }
    note('R5D-PAGE item 0 (a) hand hides: records', recs.length, J(recs.map((r) => `${r.seed} (${r.how})`)), '| hiding reads', hiding, '| engine-door-reads', reads, '| sentence drawn', drawn, '| equal', equal,
      '| B re-creates the hidden power on', recreated.size, recreated.size ? J([...recreated].slice(0, 12)) : '', '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
    expect(recs.some((r) => r.how.startsWith('act T')), 'act T was made on jp6-city-8').toBe(true);
    expect(recs.some((r) => r.how.includes('density host')) && recs.some((r) => r.how.includes('noble power')), 'the births hold a density host and a noble power').toBe(true);
    expect(reads, 'both engines, both doors, every hiding read').toBe(hiding * 4);
    // anchored: reads is asserted above, so an empty fault list is a judgment over every hiding read
    expect(faults).toEqual([]);
  }, POOL_TIMEOUT_MS);

  it('THE COUNT c (E97 (2) (c), E98): the places whose stored pressureSentence is not the sentence, names a power or house, and is SERVED on a hiding read naming a withheld one (every setting, Reveal DM off and on, the gallery read): the server\'s c beside the twin\'s, server = twin', async () => {
    const births = await poolOf();
    const c = { server: new Set(), twin: new Set() }; const hits = { server: [], twin: [] }; let a = 0; let b = 0; let bHiding = 0; let reads = 0; const faults = [];
    for (const { seed, t } of births) {
      const ps = t.pressureSentence;
      if (ps === t.powerStructure?.recentConflict) continue;
      a += 1;
      const allNames = [...new Set([...listsOf(t).flatMap((f) => [f.faction, f.name]), ...arr(t.institutions).filter(isRec).map((h) => h.name)].filter((v) => typeof v === 'string' && v))];
      const all = buildNameSearch(allNames, []);
      if (!(typeof ps === 'string' && all && all.hit(ps))) continue;
      b += 1;
      if (!hidesAny(t)) continue;
      bHiding += 1;
      for (const dm of [false, true]) for (const [setting, deltas] of Object.entries(settingsOf(t, dm))) {
        const got = await readOne(t, deltas, dm, { importToo: false });
        for (const eng of ['server', 'twin']) {
          const d = got[eng].page;
          if (!isRec(d)) { faults.push(`${seed} ${eng} ${setting} dm=${dm}: no document`); continue; }
          reads += 1;
          if (typeof d.pressureSentence === 'string' && namesWithheld(d.pressureSentence, withheldAllOf(t, d), d)) { c[eng].add(seed); hits[eng].push(`${seed} ${setting} dm=${dm}`); }
        }
      }
    }
    note(`R5C6 count (${POOL_FULL ? `full${SHARD ? ` shard ${SHARD[0]}` : ''}` : 'standing'} pool): births`, births.length, '| a', a, '| b', b, '| b on places that hide', bHiding, '| engine-reads', reads, '| c server', c.server.size, '| c twin', c.twin.size, '| hit reads server', hits.server.length, '| twin', hits.twin.length, hits.server.length ? `\n  ${hits.server.slice(0, 20).join('\n  ')}` : '');
    expect(reads, 'every setting, Reveal DM off and on, both engines, on every place of (b) that hides').toBe(bHiding * 2 * 11 * 2);
    expect(faults).toEqual([]);
    // the figure is the hand-back's; the arm holds the two engines to one count, read for read
    expect([...c.server].sort()).toEqual([...c.twin].sort());
    expect(hits.server).toEqual(hits.twin);
  }, POOL_TIMEOUT_MS);
});
