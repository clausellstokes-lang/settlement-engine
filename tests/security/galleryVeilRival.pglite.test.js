/**
 * galleryVeilRival.pglite.test.js — R5D-RIVAL (VEIL-40, chain A; docs/chair/2026-11-20/veil/briefs/R5D-RIVAL-BRIEF.md; the chair's
 * N63, ruling 107 (3) closed; each line vetoable by the owner): THE RIVAL LEAVES WITH ITS HOST.
 *
 * THE RULE (212 :: _gallery_veil_roster_choices, registry power.rival; the twin galleryRosterChoices.js :: applyRosterChoices):
 * wherever a power's row is withheld on a read (by the hand or by rule, at either door, in the host's own way there: ABSENT on
 * the player view, STAMPED on the DM door), every row minted against it (its stored `contestsNiche` the host's seat key;
 * CLOSED OVER, so a rival's rival follows) is withheld the same way, with everything a withheld power already takes with it.
 * Computed where the withheld set is resolved (after power.entry, before every rule that reads the set). `contestsNiche` stays
 * withheld always on every served read (ruling 51): the server reads it from the record it is handed, never serves it.
 *
 * BOTH ENGINES: 212 through the server on a pglite chain of every migration on disk; the twin (projectShareVeil over
 * galleryPayloadFor) beside it. BOTH DOORS: the gallery read's served document and the import's. Reveal DM off and on.
 *
 * THE PLANTS (hand-made towns; the setting `own`: the criminal groupings open, every house at its default eye):
 *   (a) a host hidden BY HAND, its rival and the rival's rival (the closure): absent on the player view, stamped on the DM
 *       door (`hidden: true`, no desc), a relation and a tension naming the rival not served on the player view;
 *   (b) a host withheld BY RULE (power.entry: a criminal power, its criminal house hidden whole): its civic rival absent on
 *       both doors, and a rival the owner stamped itself, absent with its absent host;
 *   (c) an open host: its rival served on both doors (nothing moves).
 * THE POOLS (THE ARM, Q2's own sentence and Q3): R5DPAGE-B-5B-MEASURE's places and records, by its recipes: A's born pool
 *   (`r3m-<size>-<crisis>-<k>-<idx>`, galleryVeilDesc :: poolOf; publicProse deleted), R5-RECENT's (`r5c2-m3{,b}-<size>-<i>`,
 *   galleryVeilRecent :: poolOf, as born) and act T on jp6-city-8, every birth of a pool made first in its recipe's order in
 *   one process. Every place that holds a stored rival is read OPEN (setting `shown`: every criminal grouping open and every
 *   house card and field shown, so the only hide is the hand's and the rule's; and setting `own`), and once per distinct host
 *   with that host hidden BY HAND (`shown`; and `own`); act T as it stands (its taker hidden) and with each other host also
 *   hidden. Judged on every read:
 *     Q2   EVERY SERVED RIVAL HAS ITS HOST SERVED BESIDE IT (served: a row neither stamped nor masked);
 *     Q3   no case form of a withheld power's name (the name; its bare form; without a leading "The"; its singular; each with
 *          an optional leading "the " and a plural or possessive ending; case-blind) in any SERVED power's desc, each hit
 *          listed by its exact form (asserted at `shown`, the measure's setting; counted and listed at `own`);
 *     ROSTER server = twin on the served roster at each door (ruling 110: each row's list, name, form (open, stamped,
 *          masked) and base, the base by the JS reference cut; no whole-document arm);
 *     NEVER THERE (`shown`) the same place with the withheld powers and houses NEVER THERE, THE CLOSURE TAKEN (every row
 *          minted against a withheld row, a rival's rival following, deleted with its relation rows and tension parties;
 *          galleryVeilDesc :: neverThere otherwise, copied): every served power's base equal, hiding against never there.
 *   `R5DRV_POOL=full` walks the full pools (A's `R5DP_POOL=full` recipe, R5-RECENT's `R5C6_POOL=full` recipe); the default
 *   walks a slice (A's N=1 every third place, R5-RECENT's first prefix, the first six of each size, and act T).
 *   `R5DRV_WHICH=A|C6` one pool (A carries act T); `R5DRV_SHARD=<i>/<k>` a shard of the rival places (every birth still made).
 *   Measures to R5DRV_MEASURES, the listed hits and faults to R5DRV_OUT (ndjson), where set.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { appendFileSync } from 'node:fs';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';
import { HIDDEN_POWER_MASK } from '../../src/domain/display/publicSafe.js';
import { isHideableHouse, isVeiledPower } from '../../src/domain/people/cardVeil.js';
import { seatKey } from '../../src/domain/density/seatKey.js';
import { compileRows, cutDesc, readTable } from '../../scripts/veil/standingForms.mjs';

const ARM_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget
const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
const note = (...a) => { if (process.env.R5DRV_MEASURES) appendFileSync(process.env.R5DRV_MEASURES, `${a.join(' ')}\n`); };
const emit = (o) => { if (process.env.R5DRV_OUT) appendFileSync(process.env.R5DRV_OUT, `${J(o)}\n`); };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const AT = '2026-11-01T00:00:00.000Z';
const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
/** The JS reference cut (an instrument apart from both engines). */
const ROWS = compileRows(readTable().forms);
const baseOf = (desc) => (typeof desc === 'string' ? (cutDesc(desc, ROWS)?.base ?? desc) : null);
const nameOf = (f) => (isRec(f) ? String(f.faction ?? f.name ?? '') : '');
const isMasked = (f) => isRec(f) && (f.faction === HIDDEN_POWER_MASK || f.name === HIDDEN_POWER_MASK);
const isCut = (f) => isRec(f) && (f.hidden === true || isMasked(f));
const formOf = (f) => (f.hidden === true ? 'stamped' : isMasked(f) ? 'masked' : 'open');
const listsOf = (x) => [...arr(x?.powerStructure?.factions), ...arr(x?.factions)].filter(isRec);
const servedNames = (d) => new Set(listsOf(d).filter((f) => !isCut(f)).map(nameOf).filter(Boolean));
/** The stored powers a read withholds: every stored power's name that no served row (neither stamped nor masked) carries. */
const withheldOf = (stored, d) => {
  const served = servedNames(d);
  return [...new Set(listsOf(stored).map(nameOf).filter((n) => n && !served.has(n)))];
};
/** The powers and houses a read withholds (galleryVeilDesc's, for the never-there place). */
const withheldAllOf = (stored, d) => {
  const sh = new Set(arr(d?.institutions).filter(isRec).map((h) => h.name));
  return [...new Set([...withheldOf(stored, d), ...arr(stored.institutions).filter((h) => isRec(h) && typeof h.name === 'string' && h.name && !sh.has(h.name)).map((h) => h.name)])];
};
/** THE CLOSURE (the ruling, as the never-there reference takes it): every stored row minted against a withheld row (its
 * `contestsNiche` that row's seat key), a rival's rival following; a rival whose host the record does not hold: withheld. */
const closureOf = (t, wh) => {
  const rows = listsOf(t);
  const out = new Set(wh);
  for (let moved = true; moved;) {
    moved = false;
    for (const f of rows) {
      const n = nameOf(f);
      if (typeof f.contestsNiche !== 'string' || !f.contestsNiche || out.has(n)) continue;
      const host = rows.find((x) => x !== f && seatKey(x) === f.contestsNiche);
      if (!host || out.has(nameOf(host))) { out.add(n); moved = true; }
    }
  }
  return [...out];
};
/** The projection's mask over a record (galleryVeilDesc's maskAll, copied). */
const maskAll = (v, names, isRoot = true) => {
  if (typeof v === 'string') return names.reduce((x, n) => x.split(n).join(HIDDEN_POWER_MASK), v);
  if (Array.isArray(v)) return v.map((x) => maskAll(x, names, false));
  if (isRec(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, (isRoot && k === 'name') || (k === 'id' && typeof x === 'string') ? x : maskAll(x, names, false)]));
  return v;
};
const stampedOf = (t) => arr(t.powerStructure?.factions).filter((f) => isRec(f) && f.hidden === true).map(nameOf).filter(Boolean);
/** The same place with the withheld powers and houses NEVER THERE (galleryVeilDesc :: neverThere, copied), THE CLOSURE TAKEN. */
const neverThere = (t, wh0, dm = true) => {
  const wh = closureOf(t, wh0);
  let x = clone(t);
  const stamped = stampedOf(t).filter((n) => wh.includes(n));
  x.institutions = arr(x.institutions).filter((h) => !(isRec(h) && wh.includes(h.name)));
  const keep = (f) => !(isRec(f) && wh.includes(nameOf(f)));
  if (isRec(x.powerStructure)) {
    x.powerStructure.factions = arr(x.powerStructure.factions).filter(keep);
    x.powerStructure.factionRelationships = arr(x.powerStructure.factionRelationships).filter((r) => !(isRec(r) && arr(r.pair).some((n) => wh.includes(String(n)))));
  }
  if (Array.isArray(x.factions)) x.factions = x.factions.filter(keep);
  if (isRec(x.history)) x.history.currentTensions = arr(x.history.currentTensions).map((c) => (isRec(c) && Array.isArray(c.factions) ? { ...c, factions: c.factions.filter((n) => !wh.includes(String(n))) } : c));
  if (!dm && stamped.length) x = maskAll(x, stamped);
  return x;
};
/** Every case form of a name (R5DPAGE-B's Q3 search, copied): the stems searched without regard to case, each hit by its exact form. */
function formSearch(N) {
  const stems = [['name', N]];
  const bare = N.replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (bare && bare !== N) stems.push(['bare', bare]);
  for (const [, s] of [...stems]) if (/^the\s+/i.test(s)) stems.push(['no-article', s.replace(/^the\s+/i, '')]);
  for (const [, s] of [...stems]) {
    const sing = /ies$/i.test(s) ? s.replace(/ies$/i, 'y') : /(ss|x|ch|sh)es$/i.test(s) ? s.replace(/es$/i, '') : /[^s]s$/i.test(s) ? s.slice(0, -1) : null;
    if (sing && sing.length > 2) stems.push(['singular', sing]);
  }
  const uniq = [...new Map(stems.filter(([, s]) => s.length > 2).map(([k, s]) => [s.toLowerCase(), [k, s]])).values()].sort((a, b) => b[1].length - a[1].length);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(the\\s+)?(${uniq.map(([, s]) => esc(s)).join('|')})('s|’s|'|’|es|s)?(?![\\p{L}\\p{N}])`, 'giu');
  const sentence = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return (text) => {
    const out = [];
    for (const m of String(text).matchAll(re)) {
      const core = m[2];
      const st = uniq.find(([, s]) => s.toLowerCase() === core.toLowerCase().replace(/\s+/g, ' ')) || ['?', core];
      const s = st[1];
      const cs = core === s ? 'exact' : core === s.toLowerCase() ? 'lower' : core === sentence(s) ? 'sentence' : core === s.toUpperCase() ? 'upper' : 'mixed';
      const suf = m[3] || '';
      const morph = !suf ? '' : /^(es|s)$/i.test(suf) ? 'plural' : 'possessive';
      out.push({ form: [st[0], cs, morph, m[1] ? 'the' : ''].filter(Boolean).join('+'), text: m[0] });
    }
    return out;
  };
}
/** The served roster (ruling 110): each row's list, name, form and base. */
const rosterOf = (d) => [['powerStructure', arr(d?.powerStructure?.factions)], ['top', arr(d?.factions)]]
  .flatMap(([l, list]) => list.filter(isRec).map((f) => [l, nameOf(f), formOf(f), typeof f.desc === 'string' ? baseOf(f.desc) : null]));

// ── THE PLANTS (hand-made towns) ───────────────────────────────────────────────────────────────────────────────────────────────
const TGC = Object.freeze({ id: 'inst-rv-tgc', name: "Thieves' guild chapter", category: 'Criminal', desc: 'A chapter of the guild.' });
/** A town of the given powers (shares as stored), its relations and tensions. */
const townOf = (name, powers, { houses = [], relations = [], tensions = [] } = {}) => ({ name, tier: 'city', institutions: clone(houses),
  powerStructure: { factions: clone(powers), factionRelationships: clone(relations) }, history: { currentTensions: clone(tensions) },
  economicState: { safetyProfile: { crimeTypes: [] } } });
const GOV = { faction: 'Lord Mayor', category: 'civic', power: 40, isGoverning: true, desc: 'The mayor sits in the hall.' };
const NAT = { faction: 'Fishers', category: 'economic', power: 15, desc: 'The fishers keep the quay.' };
/** (a) the hand: Merchant Guilds hidden by the owner; The Trade Compact minted against it; The Coin Circle against the Compact. */
const PLANT_HAND = townOf('Rivalhold', [GOV, NAT,
  { faction: 'Merchant Guilds', category: 'economic', power: 25, hidden: true, desc: 'Merchants of the long road.' },
  { faction: 'The Trade Compact', category: 'economic', power: 12, contestsNiche: 'Merchant Guilds', desc: 'Merchants of the long road.' },
  { faction: 'The Coin Circle', category: 'economic', power: 8, contestsNiche: 'The Trade Compact', desc: 'Merchants of the long road.' }],
{ relations: [{ pair: ['The Trade Compact', 'Lord Mayor'], type: 'rivalry', narrative: 'They quarrel over tolls.', dmNote: 'The Trade Compact buys votes.' }],
  tensions: [{ name: 'The toll quarrel', type: 'political', factions: ['The Trade Compact', 'Lord Mayor'], description: 'Tolls are disputed.' }] });
/** (b) the rule: Thieves' Guild withheld by power.entry (its criminal house hidden whole by default); The Night Bench, civic,
 * minted against it; The Grey Hand, stamped by the owner, minted against it too. */
const PLANT_RULE = townOf('Rulehold', [GOV, NAT,
  { faction: "Thieves' Guild", category: 'criminal', power: 25, desc: 'The guild takes its cut.' },
  { faction: 'The Night Bench', category: 'civic', power: 12, contestsNiche: "Thieves' Guild", desc: 'They sit at night.' },
  { faction: 'The Grey Hand', category: 'civic', power: 8, hidden: true, contestsNiche: "Thieves' Guild", desc: 'They sit at dusk.' }], { houses: [TGC] });
/** (c) open: the host shown, its rival served. */
const PLANT_OPEN = townOf('Openhold', [GOV, NAT,
  { faction: 'Merchant Guilds', category: 'economic', power: 30, desc: 'Merchants of the long road.' },
  { faction: 'The Trade Compact', category: 'economic', power: 15, contestsNiche: 'Merchant Guilds', desc: 'Merchants of the long road.' }]);

describe('R5D-RIVAL: the rival leaves with its host (the chair\'s N63), both engines, both doors, Reveal off and DM', () => {
  let db; let veil; let rd; let m = 0;

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
    const page = await import('../../src/domain/veil/pageRederive.js');
    const imp = await import('../../src/domain/veil/importRederive.js');
    rd = { page: page.rederiveForPage, served: imp.rederiveServed };
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { if (db) await db.close(); });

  /** The owner's settings: `own` (the criminal groupings open, every house at its default eye) and `shown` (every house card
   * and field shown besides: the only hide is the hand's and the rule's). */
  const settingOf = (stored, which) => {
    if (which === 'own') return opened(OPEN);
    const idOf = (h) => veil.CARD_KINDS.institution.idOf(h);
    const shows = arr(stored.institutions).filter((h) => isHideableHouse(h))
      .flatMap((h) => [`card:institution:${idOf(h)}`, ...['description', 'function', 'services', 'people'].map((f) => `field:institution:${idOf(h)}:${f}`)]);
    return opened([...OPEN, ...shows]);
  };
  const store = async (stored, ov, dm) => {
    m += 1;
    const id = `7e5d9000-0000-0000-0000-${String(m).padStart(12, '0')}`;
    const slug = `r5drv${m}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name), String(stored.tier), J(stored), slug, `${slug}-link`, J(ov), dm]);
    await db.exec(`set test.uid = '';`);
    return { id, slug };
  };
  const gallery = async (slug) => (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d;
  const imported = async (slug) => {
    await db.exec(`set test.uid = '${READER}';`);
    const d = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
    await db.exec(`set test.uid = '';`);
    return d;
  };
  /** One record read at one setting and door state: { server: { page, import }, twin: { page, import } } (the twin's import is
   * its served document, as the server's import is the same body). */
  const readOne = async (stored, dm, setting) => {
    const ov = veil.writeShareVeil({}, settingOf(stored, setting), { mode: 'live', at: AT });
    const { slug } = await store(stored, ov, dm);
    const g = await gallery(slug); const i = await imported(slug);
    const twin = veil.projectShareVeil(veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: ov }), ov);
    return { server: { page: isRec(g) ? g : null, import: isRec(i) ? i : null }, twin: { page: twin, import: twin } };
  };
  const VARIANTS = [['server', 'page'], ['server', 'import'], ['twin', 'page'], ['twin', 'import']];
  const rowOf = (d, n) => listsOf(d).find((f) => nameOf(f) === n);

  it('THE PLANTS: a host hidden by hand (the closure: a rival\'s rival), a host withheld by rule (and a stamped rival of it), an open host', async () => {
    const faults = [];
    for (const dm of [false, true]) {
      // (a) THE HAND
      const a = await readOne(PLANT_HAND, dm, 'own');
      for (const [eng, door] of VARIANTS) {
        const d = a[eng][door]; const tag = `(a) ${eng}/${door} dm=${dm}`;
        if (!isRec(d)) { faults.push(`${tag}: no document`); continue; }
        for (const n of ['Merchant Guilds', 'The Trade Compact', 'The Coin Circle']) {
          const f = rowOf(d, n);
          if (dm ? !(f && f.hidden === true && !('desc' in f)) : f) faults.push(`${tag}: ${n} served as ${J(f ?? null)}, owed ${dm ? 'stamped, no desc' : 'absent'}`);
          if (f && 'contestsNiche' in f) faults.push(`${tag}: ${n} carries contestsNiche (ruling 51)`);
        }
        for (const n of ['Lord Mayor', 'Fishers']) if (!(rowOf(d, n) && !isCut(rowOf(d, n)))) faults.push(`${tag}: ${n} not served open`);
        if (!dm) {
          if (arr(d.powerStructure?.factionRelationships).some((r) => arr(r?.pair).includes('The Trade Compact'))) faults.push(`${tag}: a relation names the absent rival`);
          if (arr(d.history?.currentTensions).some((t) => arr(t?.factions).includes('The Trade Compact'))) faults.push(`${tag}: a tension party names the absent rival`);
          const sum = arr(d.powerStructure?.factions).filter(isRec).reduce((x, f) => x + (typeof f.power === 'number' ? f.power : 0), 0);
          if (sum !== 100) faults.push(`${tag}: the served shares sum to ${sum}`);
        }
      }
      // (b) THE RULE
      const b = await readOne(PLANT_RULE, dm, 'own');
      for (const [eng, door] of VARIANTS) {
        const d = b[eng][door]; const tag = `(b) ${eng}/${door} dm=${dm}`;
        if (!isRec(d)) { faults.push(`${tag}: no document`); continue; }
        for (const n of ["Thieves' Guild", 'The Night Bench', 'The Grey Hand']) if (rowOf(d, n)) faults.push(`${tag}: ${n} served as ${J(rowOf(d, n))}, owed absent`);
        for (const n of ['Lord Mayor', 'Fishers']) if (!(rowOf(d, n) && !isCut(rowOf(d, n)))) faults.push(`${tag}: ${n} not served open`);
      }
      // (c) OPEN
      const c = await readOne(PLANT_OPEN, dm, 'own');
      for (const [eng, door] of VARIANTS) {
        const d = c[eng][door]; const tag = `(c) ${eng}/${door} dm=${dm}`;
        if (!isRec(d)) { faults.push(`${tag}: no document`); continue; }
        for (const n of ['Merchant Guilds', 'The Trade Compact', 'Lord Mayor', 'Fishers']) if (!(rowOf(d, n) && !isCut(rowOf(d, n)))) faults.push(`${tag}: ${n} not served open`);
      }
      for (const [k, got] of [['(a)', a], ['(b)', b], ['(c)', c]]) for (const door of ['page', 'import']) {
        if (J(rosterOf(got.server[door])) !== J(rosterOf(got.twin[door]))) faults.push(`${k} ${door} dm=${dm}: server ${J(rosterOf(got.server[door]))} != twin ${J(rosterOf(got.twin[door]))}`);
      }
    }
    note('R5DRV plants: faults', faults.length, faults.length ? `\n  ${faults.join('\n  ')}` : '');
    expect(faults).toEqual([]);
  }, ARM_TIMEOUT_MS);

  // ── THE POOLS ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
  const POOL_FULL = process.env.R5DRV_POOL === 'full';
  const WHICH = process.env.R5DRV_WHICH || 'all';
  const POOL_TIMEOUT_MS = POOL_FULL ? 9_000_000 : 3_600_000; // deadlock guard, not a perf budget
  const SHARD = /^(\d+)\/(\d+)$/.exec(process.env.R5DRV_SHARD || '');
  // instrument knobs (the red-first run's economy): R5DRV_SETTINGS=shown reads the measure's setting alone; R5DRV_NEVER=0 skips
  // the never-there reads. The arm's own run sets neither.
  const SETTINGS = (process.env.R5DRV_SETTINGS || 'shown,own').split(',').filter((x) => x === 'shown' || x === 'own');
  const NEVER = process.env.R5DRV_NEVER !== '0';
  const P_SIZES = Object.freeze(['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis']);
  const P_CRISES = Object.freeze(['none', 'infiltrated', 'none', 'insurgency', 'occupied', 'indebted', 'none', 'under_siege', 'wartime', 'politically_fractured']);
  const C6_SIZES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

  /** Every birth of the pools asked, each pool in its recipe's order (the measure's): [{ pool, seed, t }]. */
  const birthsOf = async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { transferRulingPower } = await import('../../src/domain/rulingPower.js');
    await loadGenerationLawPayloads();
    const out = [];
    if (WHICH !== 'C6') {
      let idx = 0;
      for (let k = 0; k < (POOL_FULL ? 2 : 1); k += 1) for (const size of P_SIZES) for (const crisis of P_CRISES) {
        idx += 1;
        if (!POOL_FULL && idx % 3 !== 1) continue;
        const cfg = { ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
        const seed = `r3m-${size}-${crisis}-${k}-${idx}`;
        const t = clone(generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }));
        delete t.publicProse;
        out.push({ pool: 'A', seed, t });
      }
      // ACT T on jp6-city-8 (the join probe's recipe: the first non-governing, unveiled power hidden by the DM takes the seat)
      const born = clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: 'jp6-city-8', customContent: {} }));
      delete born.publicProse;
      const fs = arr(born.powerStructure?.factions); const gov = fs.find((f) => f?.isGoverning);
      const A = nameOf(fs.find((f) => isRec(f) && f !== gov && !isVeiledPower(f)));
      const hid = clone(born); hid.powerStructure.factions = hid.powerStructure.factions.map((f) => (nameOf(f) === A ? { ...f, hidden: true } : f));
      const tr = transferRulingPower(hid, A, { cause: 'coup' });
      expect(tr.error ?? null, 'act T').toBeNull();
      out.push({ pool: 'T', seed: 'jp6-city-8 act T', t: clone(tr.settlement), taker: A });
    }
    if (WHICH !== 'A') {
      for (const prefix of POOL_FULL ? ['r5c2-m3', 'r5c2-m3b'] : ['r5c2-m3']) for (const size of C6_SIZES) for (let i = 0; i < (POOL_FULL ? 40 : 6); i += 1) {
        const seed = `${prefix}-${size}-${i}`;
        out.push({ pool: 'C6', seed, t: clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size }), null, { seed, customContent: {} })) });
      }
    }
    return out;
  };
  /** A place's stored rivals: each row with `contestsNiche`, its host (the other row whose seat key is the niche). */
  const rivalsOf = (t) => {
    const fs = arr(t.powerStructure?.factions).filter(isRec);
    return fs.filter((f) => typeof f.contestsNiche === 'string').map((r) => {
      const host = fs.find((f) => f !== r && seatKey(f) === r.contestsNiche) || null;
      return { name: nameOf(r), host: host ? nameOf(host) : null, gov: r.isGoverning === true, own: r.hidden === true, hostOwn: host?.hidden === true };
    });
  };
  /** The records a place is read as: OPEN, and once per distinct host hidden by hand (act T: as it stands, and each other host). */
  const recordsOf = (pl) => {
    const rivals = rivalsOf(pl.t);
    const hide = (t, h) => { const x = clone(t); x.powerStructure.factions = x.powerStructure.factions.map((f) => (nameOf(f) === h ? { ...f, hidden: true } : f)); return x; };
    const hosts = [...new Set(rivals.map((r) => r.host).filter(Boolean))];
    if (pl.pool === 'T') return [{ kind: 'hide', rec: `${pl.seed} (${pl.taker} hidden, the taker)`, t: pl.t },
      ...hosts.filter((h) => h !== pl.taker).map((h) => ({ kind: 'hide', rec: `${pl.seed} + hand hide ${h}`, t: hide(pl.t, h) }))];
    return [{ kind: 'open', rec: `${pl.seed} open`, t: pl.t }, ...hosts.map((h) => ({ kind: 'hide', rec: `${pl.seed} hand hide ${h}`, t: hide(pl.t, h) }))];
  };

  it('THE POOLS: every served rival has its host served beside it; no withheld power\'s name in a served desc; server = twin on the served roster; the never-there place (the closure taken)', async () => {
    const births = await birthsOf();
    let places = births.filter((b) => rivalsOf(b.t).length > 0);
    if (SHARD) places = places.filter((_p, i) => i % Number(SHARD[2]) === Number(SHARD[1]));
    const tally = { places: places.length, births: births.length, rivals: 0, rivalsGoverning: 0, rivalsOwnStamp: 0, records: 0, reads: 0,
      rivalReads: 0, rivalServed: 0, lone: 0, q3Shown: 0, q3Own: 0, rosterMiss: 0, baseDiff: 0 };
    const faults = [];
    const q3Forms = new Map();
    for (const pl of places) {
      const rivals = rivalsOf(pl.t);
      tally.rivals += rivals.length; tally.rivalsGoverning += rivals.filter((r) => r.gov).length; tally.rivalsOwnStamp += rivals.filter((r) => r.own).length;
      emit({ k: 'place', pool: pl.pool, seed: pl.seed, rivals });
      for (const r of recordsOf(pl)) {
        tally.records += 1;
        const storedRivals = rivalsOf(r.t).filter((x) => x.host);
        for (const setting of SETTINGS) for (const dm of [false, true]) {
          const got = await readOne(r.t, dm, setting);
          const nt = NEVER && setting === 'shown' && r.kind === 'hide' && isRec(got.twin.page) ? await readOne(neverThere(r.t, withheldAllOf(r.t, got.twin.page), dm), dm, setting) : null;
          for (const [eng, door] of VARIANTS) {
            const d = got[eng][door]; const tag = `${r.rec} [${setting} dm=${dm} ${eng}/${door}]`;
            tally.reads += 1;
            if (!isRec(d)) { faults.push(`${tag}: no document`); continue; }
            const served = servedNames(d);
            // Q2 (each read's own record, so a run cut short still leaves its count)
            emit({ k: 'q2', rec: r.rec, kind: r.kind, setting, dm, eng, door, rivals: storedRivals.length, served: storedRivals.filter((rv) => served.has(rv.name)).length,
              lone: storedRivals.filter((rv) => served.has(rv.name) && !served.has(rv.host)).map((rv) => rv.name) });
            for (const rv of storedRivals) {
              tally.rivalReads += 1;
              if (!served.has(rv.name)) continue;
              tally.rivalServed += 1;
              if (!served.has(rv.host)) {
                tally.lone += 1;
                const k = `lone ${r.kind} ${setting}`;
                tally[k] = (tally[k] || 0) + 1;
                const hr = rowOf(d, rv.host);
                if (faults.length < 400) faults.push(`${tag}: rival ${rv.name} served beside its withheld host ${rv.host} (${hr ? formOf(hr) : 'absent'})`);
              }
            }
            // Q3
            const wh = withheldOf(r.t, d);
            for (const N of wh) {
              const search = formSearch(N);
              for (const f of listsOf(d).filter((x) => !isCut(x) && typeof x.desc === 'string')) {
                for (const hit of search(f.desc)) {
                  const key = `${setting}\u0001${hit.form}\u0001${N}\u0001${nameOf(f)}\u0001${hit.text}`;
                  q3Forms.set(key, (q3Forms.get(key) || 0) + 1);
                  if (setting === 'shown') tally.q3Shown += 1; else tally.q3Own += 1;
                  emit({ k: 'q3', setting, rec: r.rec, dm, eng, door, withheld: N, in: nameOf(f), form: hit.form, text: hit.text, desc: f.desc });
                  if (setting === 'shown' && faults.length < 400) faults.push(`${tag}: Q3 ${J(hit.text)} (${hit.form}, of the withheld ${N}) in the desc of ${nameOf(f)}`);
                }
              }
            }
            // the never-there place, the closure taken
            if (nt) {
              const n = nt[eng][door];
              if (!isRec(n)) { faults.push(`${tag}: no never-there document`); continue; }
              const bh = new Map(listsOf(d).filter((f) => !isCut(f)).map((f) => [nameOf(f), baseOf(f.desc)]));
              const bn = new Map(listsOf(n).filter((f) => !isCut(f)).map((f) => [nameOf(f), baseOf(f.desc)]));
              for (const nm of new Set([...bh.keys(), ...bn.keys()])) {
                const x = bh.has(nm) ? bh.get(nm) : '(absent)'; const y = bn.has(nm) ? bn.get(nm) : '(absent)';
                if (x !== y) { tally.baseDiff += 1; if (faults.length < 400) faults.push(`${tag}: ${nm}'s base hiding ${J(x)} != never there ${J(y)}`); }
              }
            }
          }
          // ROSTER: server = twin at each door
          for (const door of ['page', 'import']) {
            if (J(rosterOf(got.server[door])) !== J(rosterOf(got.twin[door]))) {
              tally.rosterMiss += 1;
              if (faults.length < 400) faults.push(`${r.rec} [${setting} dm=${dm} ${door}]: server roster ${J(rosterOf(got.server[door]))} != twin ${J(rosterOf(got.twin[door]))}`);
            }
          }
        }
      }
    }
    note('R5DRV pools:', J(tally));
    note('R5DRV Q3 forms (setting, form, withheld, in the desc of, text: reads):', [...q3Forms].map(([k, v]) => `\n  ${k.split('\u0001').join(' | ')}: ${v}`).join(''));
    note('R5DRV pool faults', faults.length, faults.length ? `\n  ${faults.slice(0, 60).join('\n  ')}` : '');
    for (const f of faults) emit({ k: 'fault', f });
    expect(tally.places, 'the pools hold rival places').toBeGreaterThan(0);
    expect(faults).toEqual([]);
  }, POOL_TIMEOUT_MS);
});
