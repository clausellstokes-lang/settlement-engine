/**
 * galleryVeilDesc.pglite.test.js — R5-DESC's PAGE HALF (VEIL-37's R5D-PAGE-A; docs/chair/2026-11-20/veil/briefs/R5D-PAGE-BRIEF.md
 * items 0 (c), 2, 3, 4 and 7; the chair's E115, E116, E121, E126, E128, E129, E134, each vetoable by the owner).
 *
 * THE RULE (212 (36); the twin galleryWithholdAlways.js :: withholdAlways and galleryRosterChoices.js :: applyRosterChoices): on
 * EVERY non-owner read of every place, both engines, (a) each `powerStructure.factions[].desc` and master's `factions[].desc`
 * loses its STANDING TAIL by ONE table (STANDING_FORMS), the base kept; (b) a row flagged `hidden` or served under the
 * projection's mask ('an unseen interest') is served with NO desc; (c) a current tension's party served as the mask leaves
 * its list, the tension staying; (d) wherever a power is withheld, a relation's `dmNote` naming one by the lane's fold leaves.
 * THE PAGE (src/domain/veil/pageRederive.js :: rederiveStanding, reader S, at rederiveForPage and importRederive.js ::
 * rederiveInPlace, authoritative) writes each served power's standing again by the engine's own writer over the SERVED
 * ROSTER (every row the read hides out, as if never there) and appends it to the served base.
 *
 * BOTH ENGINES: 212 through the server on a pglite chain of every migration on disk; the twin (projectShareVeil over
 * galleryPayloadFor) beside it. BOTH STORED SHAPES (the new one; master's, the powers also in the top-level factions[]).
 * Every setting of the owner's switch (own, the mixed g:<bits>, allOpen, off) and `shown`, Reveal DM off and on; the gallery
 * read at every setting, the party link, the import and the campaign map's member at the own setting (the map's member and
 * the link are the player view: their twin is read with Reveal DM off).
 *
 * THE PLANTS (item 2; hand-made towns whose stored descs are the engine's own: base + the standing annotateFactionStanding
 * writes over the stored roster):
 *   (a) a shown power's standing naming a power withheld BY RULE (a hidden criminal house's criminal power: power.entry);
 *   (b) the same naming a power the OWNER hid (`hidden: true`), read where the owner-hidden name is served unmasked (the DM
 *       door) and on the player view (where the projection masks it: see (e));
 *   (c) the withheld power's BARE form (its bracketed qualifier dropped) and LOWER CASE ("the religious authorities": past
 *       the case-sensitive mask);
 *   (d) a HIDDEN row's own desc (the row's `hidden: true`, served on the DM door);
 *   (d2) a MASKED row's own desc (`name` the mask: an unstamped row carrying the owner-hidden power's name, which the
 *       projection serves under the mask);
 *   (e) THE MASK IN A STANDING ("they play the an unseen interest and ..."): E136 (a), the mask in the name slot, cut by
 *       R5D-SQL-2 (merged; green since);
 *   (f) a relation's dmNote naming a withheld power;
 *   (g) a tension's party served as the mask.
 * GREEN BY ABSENCE on every served payload: no served desc ends in a standing (by the JS reference cut,
 * scripts/veil/standingForms.mjs :: cutDesc over standingForms.data.json: an instrument apart from either engine), names a
 * withheld power by the lane's fold or carries the mask; no hidden or masked row carries a desc; no dmNote names a withheld
 * power; no tension party is the mask (the tension stays). THE TEETH: on a read that hides nothing, the page's desc (base + S)
 * equals the stored, byte for byte, but for the class item 3 lists.
 *
 * THE BORN POOL: R5DESC-MEASURE's births (out/v34/r5desc/measure/arm.probe.jsx over out/v27/tell/measure/tell-common.mjs ::
 * pool: seeds `r3m-<size>-<crisis>-<k>-<idx>`, its sizes, crises and dials; reproduced here by its recipe, no publicProse: the
 * births carry none; the stored halves of every proof are R5D-PAGE-B's item 5c). The standing run walks a slice
 * (STANDING_EVERY); `R5DP_POOL=full` walks N=2 (140), `R5DP_SHARD=<i>/<k>` a shard of it. Plus act T on jp6-city-8 (the join
 * probe's lit act, by its recipe: a non-governing power hidden by the DM takes the seat, rulingPower.js ::
 * transferRulingPower) and HAND HIDES on the pool's births (a density host: the power a density-law rival was minted from;
 * a noble power): each its own read.
 *   FIDELITY (item 3)    every nothing-hidden page's re-derived desc equals the stored, EXCEPT descs whose stored standing
 *                        carries the seat-contest line (factionStanding.js :: SEAT_CONTESTED_STANDING; R5DESC-MEASURE's 382),
 *                        LISTED as that class with its cause; a miss of any other cause reds.
 *   DIFFERENTIAL (item 4) a hiding read's page desc equals that of the same place with the withheld powers and houses NEVER
 *                        THERE (the stored record without them, read the same way), both engines, both doors, Reveal off
 *                        and DM; and the same for the masked tension party (player view). On the player view the never-there
 *                        record's text is masked as the projection masks the hiding read's (a name the owner hid). A served
 *                        desc that keeps a masked standing UNCUT is E136 (a)'s (the mask in the name slot): counted in its own
 *                        arm (green since R5D-SQL-2 merged). ONE CLASS IS LISTED, THE SHARE CLASS, by ruling 107 (1)'s FOUR
 *                        CONDITIONS and no looser (R5D-PAGE-B2): a differing row is listed ONLY IF (i) the read is on the DM
 *                        door, (ii) the place serves a stamped row ({power, hidden: true}), (iii) the two page descs differ
 *                        in S's GAP-BASED FORMS ALONE (GAP_BASED, below, by the standing table's ids) and (iv) the same
 *                        record's Reveal-off read (same engine, same door) is equal; anything else that differs is a fault.
 *                        The cause: on the DM door the stamped row is SERVED, so the served shares (registry power.share,
 *                        re-derived to 100 over the served rows) carry it and the never-there place's do not; S, its rows the
 *                        stamped one out, reads the served figures. READER B (rederiveRecentConflict) is judged the same way
 *                        on the same reads (ruling 107 (2)): the hiding page's sentence equals the never-there page's.
 *   THE STORED HALVES (item 5c; E134: the universe is the document AS src/lib/saves.js STORES IT): the plant's absence, the
 *                        fidelity arm and the differential again over today-born places STORED AS SAVED, their publicProse
 *                        composed as saves.js composes it (publicProseCompose.js :: composePublicProse, publicProse.js ::
 *                        withPublicProse; VEIL-33's dump.probe.jsx's recipe), a hand hide composed again after the hide (a
 *                        hide is a save). `R5DP_STORED=<dir>` reads a dumped pool (dump.sh's <seed>.json); else the standing
 *                        slice's births are stored so in-process. THE publicProse COUNT (ruling 111): every served
 *                        publicProse block field holding a power's stored desc, its base or its standing, word for word or
 *                        by the lane's fold, by block key and field, per engine, on hiding and nothing-hidden reads: a
 *                        figure, never asserted non-zero (once (a') serves no publicProse it reads 0 by construction).
 *   THE WHOLE-DOCUMENT SHAS (the chair's N67; material for a later ruling, JUDGED BY NOTHING, ASSERTED BY NOTHING): every
 *                        read of a stored document (the stored halves' records, the never-there place not among them) writes
 *                        the sha256 of the server's served document and of the twin's projection for the same read, each in
 *                        canonical form (keys sorted, recursively), to R5DP_SHAS (a TSV: place, pool, door, setting, Reveal,
 *                        server sha, twin sha) where it is set, and keeps the first 50 differing pairs whole under R5DP_SHA_DIFFS.
 *   EVERY NAME ARM IS CASE-BLIND (ruling 107 (2)): the verdict is the lane's fold (buildNameSearch: A-Z lowered), the mask is
 *                        searched without regard to case, and a hit is LISTED BY ITS EXACT FORM (formsOf, maskForms).
 *   THE ARM (item 0 (c)) every string a page reader writes (the sentence, the standing by S, the crime lists) names only
 *                        served rows (the lane's fold) and carries no mask; with it item 7's count: the strata's and the
 *                        contenders' own strings over the page (powerStrata.js :: derivePowerStrata, rulingPowerCoup.js ::
 *                        coupContenders) that name a withheld power or carry the mask.
 * The measures the hand-back quotes go to R5DP_MEASURES where it is set.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { appendFileSync, readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';
import { buildNameSearch, nameFold } from '../../src/domain/display/gallerySecondHomes.js';
import { HIDDEN_POWER_MASK } from '../../src/domain/display/publicSafe.js';
import { isHideableHouse, isVeiledPower } from '../../src/domain/people/cardVeil.js';
import { standingRosterOf, standingForceOf } from '../../src/generators/power/rosterText.js';
import { annotateFactionStanding, SEAT_CONTESTED_STANDING } from '../../src/generators/power/factionStanding.js';
import { seatKey } from '../../src/domain/density/seatKey.js';
import { compileRows, cutDesc, readTable } from '../../scripts/veil/standingForms.mjs';

const ARM_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget
const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
const note = (...a) => { if (process.env.R5DP_MEASURES) appendFileSync(process.env.R5DP_MEASURES, `${a.join(' ')}\n`); };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const CRIM = OPEN.slice(0, 3);
const AT = '2026-11-01T00:00:00.000Z';
const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
/** The JS reference cut (an instrument apart from both engines). */
const ROWS = compileRows(readTable().forms);
const refCut = (desc) => cutDesc(desc, ROWS);
const nameOf = (f) => (isRec(f) ? String(f.faction ?? f.name ?? '') : '');
const isMasked = (f) => isRec(f) && (f.faction === HIDDEN_POWER_MASK || f.name === HIDDEN_POWER_MASK);
const isCut = (f) => isRec(f) && (f.hidden === true || isMasked(f));
const listsOf = (x) => [...arr(x?.powerStructure?.factions), ...arr(x?.factions)].filter(isRec);
/** Equal without regard to case. */
const ci = (a, b) => typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * THE CASE-BLIND LOCATOR (107 (2)): the EXACT FORMS in which a text names any of `names`: the name, its bare form (a trailing
 * bracketed qualifier dropped) and the bare form without a leading "The", each with an optional article "the " before it and
 * a plural or possessive ending, matched without regard to case. It LISTS hits; the verdict stays the lane's fold.
 */
function formsOf(text, names) {
  if (typeof text !== 'string' || text === '') return [];
  const out = new Set();
  for (const n of names) {
    if (typeof n !== 'string' || n === '' || n === HIDDEN_POWER_MASK) continue;
    const bare = n.replace(/\s*[([][^)\]]*[)\]]\s*$/, '');
    for (const v of new Set([n, bare, bare.replace(/^the\s+/i, '')])) {
      if (v.length < 2) continue;
      const re = new RegExp(`(?<![\\p{L}\\p{N}])(?:the\\s+)?${esc(v).replace(/\s+/g, '[\\s_-]+')}(?:'s|s'|es|s)?(?![\\p{L}\\p{N}])`, 'giu');
      for (const x of text.matchAll(re)) out.add(x[0]);
    }
  }
  return [...out];
}
/** The mask, searched without regard to case: its exact forms in a text. */
const MASK_RE = new RegExp(esc(HIDDEN_POWER_MASK), 'giu');
const maskForms = (s) => (typeof s === 'string' ? [...new Set(s.match(MASK_RE) || [])] : []);
const hasMask = (s) => maskForms(s).length > 0;
/** A hit's listing: its exact forms (or the fold's own word where the locator finds none). */
const hitOf = (text, names) => { const f = formsOf(text, names); return f.length ? `forms ${J(f)}` : 'forms (the fold\'s hit; no listed form)'; };
/**
 * 107 (1) (iii): THE STANDING TABLE's GAP-BASED FORMS, by id (R5D-PAGE-B2's reading, vetoable): a form is GAP-BASED where
 * annotateFactionStanding PICKS it by a DIFFERENCE between two served figures against a threshold, so a re-share of the
 * served figures (the stamped row in the served shares) can move it. Two families, both counted:
 *   RANK (GAP_RANK)  the rank-1 forms R1-* (topTwoGap <= 6 / <= 14; R1-contest, the seat-contest line, only where topTwoGap
 *                    > 6), the rank-2 forms R2-* (gapAbove, gapBelow <= 5 / <= 10, levelCount: figures within 5 of the
 *                    first), the last rank's RL-few (power < 7 with gapAbove >= 5); master's and the history's wordings of
 *                    the same rungs (M-R1-*, M-R2-*, M-RL-narrow, H-R1-*, H-R2-*);
 *   PAIR             a named pair's figures against a margin: AR, RA (arcane vs religious, rival > power), CM, MC (merchant
 *                    vs craft guild, > power, > power - 8), MT (thieves > power), NM (merchant vs noble, > power + 12, >
 *                    power), GT, TG (guard vs thieves, +-10), RT (thieves > power), GR (|religious - guard| < 10), ST (the
 *                    steward +-10, its wording by the two figures), and their M-/H- wordings.
 * NOT gap-based: OC-* (the occupier's line reads no figure). A difference in an OC form, in the base, or in the forms' order
 * outside a gap-based form, is a FAULT. The two families are counted apart in the note (the rank family alone: the
 * stricter reading the hand-back gives beside it).
 */
const GAP_RANK = Object.freeze(new Set(readTable().forms.map((f) => f.id).filter((id) => /^(?:[HM]-)?R[12]-/.test(id) || id === 'RL-few' || id === 'M-RL-narrow')));
const GAP_BASED = Object.freeze(new Set(readTable().forms.map((f) => f.id).filter((id) => !/^OC-/.test(id))));
/** The standing's forms of a desc with their texts (the reference cut's own loop, each segment kept), and its base. */
function standingSegments(desc) {
  let rest = String(desc ?? ''); const segs = [];
  for (;;) {
    let best = null;
    for (const r of ROWS) { const x = r.re.exec(rest); if (x && (!best || x.index < best.at || (x.index === best.at && r.id < best.id))) best = { id: r.id, at: x.index }; }
    if (!best) break;
    segs.unshift({ id: best.id, text: rest.slice(best.at).replace(/^ /, '') });
    rest = rest.slice(0, best.at);
  }
  return { base: rest, segs };
}
/** 107 (1) (iii): two page descs differ in S's gap-based forms ALONE (the base equal, every other form equal in order). */
function gapOnly(a, b, gap = GAP_BASED) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const x = standingSegments(a); const y = standingSegments(b);
  const other = (s) => J(s.segs.filter((g) => !gap.has(g.id)));
  return x.base === y.base && other(x) === other(y);
}
/** 107 (1) (ii): the place serves a stamped row ({power, hidden: true}). */
const servesStamped = (d) => listsOf(d).some((f) => f.hidden === true && Object.prototype.hasOwnProperty.call(f, 'power'));

// ── THE HAND-MADE TOWNS (each desc the engine's own: base + the standing over the stored roster) ──────────────
/** The stored roster's standings, as rosterText.js :: standingsOf writes them. */
function standingsOver(factions, institutions, leg) {
  const seats = standingRosterOf(factions).map((f) => ({ ...f, desc: '' }));
  annotateFactionStanding(seats, standingForceOf(institutions), { publicLegitimacy: leg });
  return new Map(seats.map((f) => [f.faction, String(f.desc || '')]));
}
/** A town whose powers' descs are `<base> <standing>` by the engine's writer over its own roster (its figures sum to 100,
 * as a born roster's do: a set that does not is re-shared on every read, registry power.share). */
function townOf(name, powers, { houses = [], relations = [], tensions = [] } = {}) {
  const st = standingsOver(powers, houses, undefined);
  const factions = powers.map((p) => ({ ...p, desc: [p.base, st.get(p.faction)].filter(Boolean).join(' ') })).map(({ base: _b, ...f }) => f);
  return { name, tier: 'town', institutions: clone(houses), powerStructure: { factions, factionRelationships: clone(relations) },
    history: { currentTensions: clone(tensions) }, economicState: { safetyProfile: { crimeTypes: [] } } };
}
const TGC = Object.freeze({ id: 'inst-r5d-tgc', name: "Thieves' guild chapter", category: 'Criminal', desc: 'A chapter of the guild.' });
const FISH = Object.freeze({ id: 'inst-r5d-fish', name: 'Fish market', category: 'Economy', desc: 'Fish, salted and fresh.' });
const TG = "Thieves' Guild";
const TGP = "Thieves' Guild (powerful)";
const HAND = 'Silent Hand';
const RA = 'Religious Authorities';
/** (a), (f): the criminal power withheld by rule (power.entry: its house hidden), named in the Fishers' rank line; a dmNote. */
const takerPowers = (taker) => [{ faction: 'Shadow Senate', category: 'civic', power: 50, isGoverning: true, base: 'The senate sits behind closed doors.' },
  { faction: taker, category: 'criminal', power: 30, base: 'The guild takes its cut.' },
  { faction: 'Fishers', category: 'economic', power: 20, base: 'The fishers keep the quay.' }];
/** (b), (d), (d2), (e), (g): a power the OWNER hid, named in the Fishers' rank line; a tension it is party to. */
const ownerPowers = () => [{ faction: 'Town Council', category: 'civic', power: 45, isGoverning: true, base: 'The council sits weekly.' },
  { faction: HAND, category: 'civic', power: 30, hidden: true, base: 'Nobody says who they are.' },
  { faction: 'Fishers', category: 'economic', power: 25, base: 'The fishers keep the quay.' }];
/** (c) lower case: the owner-hidden Religious Authorities named in the guard's note in lower case (jp6-city-2's shape). */
const clergyPowers = () => [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true, base: 'The council sits weekly.' },
  { faction: RA, category: 'religious', power: 26, hidden: true, base: 'The temple keeps the calendar.' },
  { faction: 'Military/Guard', category: 'military', power: 24, base: 'The watch walks the walls.' }];
const openPowers = () => [{ faction: 'Reeve', category: 'civic', power: 40, isGoverning: true, base: 'The reeve keeps the rolls.' },
  { faction: 'Millers', category: 'economic', power: 33, base: 'The millers keep the weir.' },
  { faction: 'Fishers', category: 'economic', power: 27, base: 'The fishers keep the quay.' }];
const PLANT_TOWNS = Object.freeze({
  rule: townOf('Saltreach', takerPowers(TG), { houses: [TGC, FISH], relations: [{ pair: ['Shadow Senate', 'Fishers'], type: 'ally', dmNote: `${TG} pays the senate's clerks.` }] }),
  owner: townOf('Greywater', ownerPowers(), { houses: [FISH], tensions: [{ name: 'The quay levy', factions: [HAND, 'Fishers'], desc: 'The levy is disputed.' }],
    relations: [{ pair: ['Town Council', 'Fishers'], type: 'ally', dmNote: `${HAND} sits behind the council's votes.` }] }),
  bare: townOf('Copperhythe', takerPowers(TGP), { houses: [TGC, FISH] }),
  lower: townOf('Duskmere', clergyPowers(), { houses: [FISH] }),
  open: townOf('Millbrook', openPowers(), { houses: [FISH] }),
});
/** BOTH STORED SHAPES; and (d2)'s. */
const SHAPES = Object.freeze({
  new: (s) => clone(s),
  master: (s) => ({ ...clone(s), factions: clone(s.powerStructure.factions) }),
  // (d2): an UNSTAMPED row whose `name` is the owner-hidden power's (an envoy row carrying its name): the projection serves it
  // under the mask (the record's own stamp is on the other row)
  nameRow: (s) => { const x = clone(s); x.powerStructure.factions.push({ faction: 'Hand Envoys', name: HAND, category: 'civic', power: 5, desc: 'Envoys who speak for the hand.' }); return x; },
});

// ── THE JUDGMENT ─────────────────────────────────────────────────────────
/** The powers a read withholds: a stored power neither served list names; a row the read hides (flagged or masked) is out too. */
function withheldOf(stored, d) {
  const served = new Set(listsOf(d).filter((f) => !isCut(f)).map(nameOf).filter(Boolean));
  const out = new Set();
  for (const f of listsOf(stored)) { const n = nameOf(f); if (n && !served.has(n)) out.add(n); }
  return [...out];
}
/** The names a document serves openly (its uncut powers and its houses). */
const openNamesOf = (d) => [...new Set([...listsOf(d).filter((f) => !isCut(f)).map(nameOf), ...arr(d?.institutions).filter(isRec).map((h) => h.name)]
  .filter((v) => typeof v === 'string' && v && v !== HIDDEN_POWER_MASK))];
/** Whether a text names a withheld power by THE LANE'S FOLD (the served names open). */
function namesWithheld(text, withheld, d) {
  if (typeof text !== 'string' || text === '' || !withheld.length) return false;
  const search = buildNameSearch(withheld, openNamesOf(d).filter((n) => !withheld.some((w) => ci(w, n))));
  return !!search && search.hit(text);
}
/** Every string leaf of a value, with its path. */
function strings(v, p = '', out = []) {
  if (typeof v === 'string') out.push([p, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${p}[${i}]`, out));
  else if (isRec(v)) for (const [k, x] of Object.entries(v)) strings(x, p ? `${p}.${k}` : k, out);
  return out;
}
/**
 * THE ABSENCE on one engine's served payload: the faults, by plant letter. `stored` is the record read.
 * @returns {{ plant: string, why: string }[]}
 */
function absenceFaults(stored, d, { born = false } = {}) {
  const out = [];
  // THE SERVER'S WITHHELD (the rule 212 (36) (d) and the projection read): a stored power no served list names at all; a
  // stamped row the DM door serves is NOT withheld from that reader (R5-RECENT's measure: the DM door serves it, unmasked)
  const served = new Set(listsOf(d).map(nameOf).filter(Boolean));
  const wh = listsOf(stored).map(nameOf).filter((n) => n && !served.has(n));
  for (const [list, rows] of [['powerStructure.factions', arr(d?.powerStructure?.factions)], ['factions', arr(d?.factions)]]) {
    for (const f of rows.filter(isRec)) {
      const has = Object.prototype.hasOwnProperty.call(f, 'desc');
      if (f.hidden === true && has) out.push({ plant: '(d)', why: `${list} ${nameOf(f)}: a HIDDEN row serves its desc` });
      if (isMasked(f) && has) out.push({ plant: '(d2)', why: `${list} ${nameOf(f)}: a MASKED row serves its desc` });
      if (!has || typeof f.desc !== 'string') continue;
      const c = refCut(f.desc);
      if (c) out.push({ plant: '(a)', why: `${list} ${nameOf(f)}: the desc ends in a standing (${c.ids.join('+')}): ${J(c.standing).slice(0, 100)}` });
      if (namesWithheld(f.desc, wh, d)) out.push({ plant: '(a)', row: nameOf(f), why: `${list} ${nameOf(f)}: the desc names a withheld power ${J(wh)} (${hitOf(f.desc, wh)}): ${J(f.desc).slice(-120)}` });
      if (hasMask(f.desc)) out.push({ plant: '(e)', why: `${list} ${nameOf(f)}: the desc carries the mask (forms ${J(maskForms(f.desc))}): ${J(f.desc).slice(-120)}` });
    }
  }
  for (const r of arr(d?.powerStructure?.factionRelationships).filter(isRec)) {
    if (typeof r.dmNote === 'string' && namesWithheld(r.dmNote, wh, d)) out.push({ plant: '(f)', why: `relation ${J(r.pair)}: the dmNote names a withheld power (${hitOf(r.dmNote, wh)}): ${J(r.dmNote)}` });
  }
  for (const t of arr(d?.history?.currentTensions).filter(isRec)) {
    const ms = arr(t.factions).filter((p) => ci(p, HIDDEN_POWER_MASK));
    if (ms.length) out.push({ plant: '(g)', why: `tension ${J(t.name)}: a party served as the mask (forms ${J(ms)})` });
  }
  // (g) the tension stays: on a hand-made plant town every tension stays; on a BORN place (the stored half) a tension leaves
  // for other rules' reasons (a withheld house's), so there the tension that stays is one a power the owner hid is party to
  if (!born && arr(stored?.history?.currentTensions).length !== arr(d?.history?.currentTensions).length && isRec(d?.history)) out.push({ plant: '(g)', why: 'a tension left with its masked party' });
  if (born && isRec(d?.history)) {
    const own = new Set(listsOf(stored).filter((f) => f.hidden === true).map(nameOf).filter((n) => n && wh.includes(n)));
    const servedT = new Set(arr(d.history.currentTensions).filter(isRec).map((t) => t.name));
    for (const t of arr(stored?.history?.currentTensions).filter(isRec)) if (arr(t.factions).some((p) => own.has(String(p))) && !servedT.has(t.name)) out.push({ plant: '(g)', why: `tension ${J(t.name)} left with its masked party` });
  }
  return out;
}
/** THE PAGE's descs at a door: { name: desc } of the served powers. */
const pageDescs = (rd, door, d) => {
  const p = door === 'page' ? rd.page(clone(d)) : rd.served(d);
  return new Map(arr(p?.powerStructure?.factions).filter((f) => isRec(f) && !isCut(f)).map((f) => [nameOf(f), f.desc]));
};
/** A read hides nothing: every stored power served uncut, every stored house served. */
const hidesNothing = (stored, d) => !withheldOf(stored, d).length && !listsOf(d).some(isCut)
  && arr(stored.institutions).every((h) => arr(d?.institutions).some((x) => isRec(x) && x.name === h.name));
/** A stored desc whose standing carries the seat-contest line (item 3's listed class). */
const seatContestClass = (desc) => typeof desc === 'string' && (refCut(desc)?.standing ?? '').includes(SEAT_CONTESTED_STANDING);

describe('R5-DESC, the page half (R5D-PAGE-A): the standing cut on every read, reader S over the served roster, both engines', () => {
  let db; let veil; let sw; let rd; let strata; let m = 0;
  const cache = new Map();

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
    const page = await import('../../src/domain/veil/pageRederive.js');
    const imp = await import('../../src/domain/veil/importRederive.js');
    rd = { page: page.rederiveForPage, served: imp.rederiveServed };
    strata = { derive: (await import('../../src/domain/dossier/powerStrata.js')).derivePowerStrata, coup: (await import('../../src/domain/rulingPowerCoup.js')).coupContenders };
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { if (db) await db.close(); });

  /** The owner's switch settings, each computed on the record read, and `shown`. */
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
  /** Store one record and read it: the server's gallery read (and the map, link and import where asked), the twin's. */
  const store = async (stored, ov, dm) => {
    m += 1;
    const id = `7e5d7000-0000-0000-0000-${String(m).padStart(12, '0')}`;
    const slug = `r5dp${m}`;
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
  const twinOf = (stored, dm, ov) => veil.projectShareVeil(veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: ov }), ov);
  /** Every read of one record in one stored shape, both engines: [{ shape, setting, dm, read, server, twin }]. */
  const readAll = async (stored, shape) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of Object.entries(settingsOf(stored, dm))) {
      const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at: AT });
      const { id, slug } = await store(stored, ov, dm);
      const docs = { gallery: await gallery(slug) };
      if (setting === 'own') {
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
          values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, J({ campaign: { settlementIds: [id] } }), `${slug}-map`, `${slug}-mapl`]);
        docs.map = (await db.query('select public.get_gallery_map($1) #> \'{members,0,settlement}\' d', [`${slug}-map`])).rows[0]?.d;
        if (!dm) docs.link = (await db.query('select public.get_unlisted_dossier($1) -> \'dossier\' d', [`${slug}-link`])).rows[0]?.d;
        docs.import = await imported(slug);
      }
      const twin = twinOf(stored, dm, ov); const twinOff = dm ? twinOf(stored, false, ov) : twin;
      for (const [read, d] of Object.entries(docs)) out.push({ shape, setting, dm, read, server: isRec(d) ? d : null, twin: read === 'map' || read === 'link' ? twinOff : twin });
    }
    return out;
  };
  const readsOf = async (key, town, shapes = ['new', 'master']) => {
    if (!cache.has(key)) {
      const out = [];
      for (const shape of shapes) { const stored = SHAPES[shape](town); for (const r of await readAll(stored, shape)) out.push({ ...r, stored }); }
      cache.set(key, out);
    }
    return cache.get(key);
  };
  const tag = (r, eng) => `${eng} ${r.shape} ${r.read} ${r.setting} dm=${r.dm}`;
  /** Each engine of a read: [{ eng, d }]. */
  const engines = (r) => [['server', r.server], ['twin', r.twin]].filter(([, d]) => isRec(d)).map(([eng, d]) => ({ eng, d }));
  /** One plant over its town's reads: the faults of the plant's letters, and how often the plant reaches its gate. */
  const plantRun = async (key, town, letters, reach, shapes) => {
    const rs = await readsOf(key, town, shapes);
    const faults = []; let reached = 0; let judged = 0;
    for (const r of rs) {
      const es = engines(r);
      if (es.length !== 2) faults.push(`${tag(r, 'both')}: a document served by ${es.map((e) => e.eng).join('') || 'neither engine'} alone`);
      for (const { eng, d } of es) {
        judged += 1;
        if (reach(r, d)) reached += 1;
        for (const f of absenceFaults(r.stored, d)) if (letters.includes(f.plant)) faults.push(`${tag(r, eng)} ${f.plant}: ${f.why}`);
      }
    }
    return { rs, faults, reached, judged };
  };
  const READS_PER_SHAPE = 2 * 11 + 2 * 2 + 1;

  // ── ITEM 2: THE PLANTS ─────────────────────────────────────────────────
  it('PLANT (a), (f): a shown power\'s standing naming a power withheld BY RULE (power.entry), and a dmNote naming it: GREEN BY ABSENCE on every served payload (no standing tail, no name by the fold, no dmNote naming it), both engines, every setting, Reveal off and on, both stored shapes', async () => {
    const t = PLANT_TOWNS.rule;
    expect(namesWithheld(t.powerStructure.factions.find((f) => f.faction === 'Fishers').desc, [TG], { powerStructure: { factions: [] }, institutions: [] }), 'the stored Fishers\' standing names the withheld power').toBe(true);
    const { rs, faults, reached, judged } = await plantRun('rule', t, ['(a)', '(f)'], (r, d) => withheldOf(r.stored, d).includes(TG));
    note('R5DP plant (a)(f) rule: engine-reads', judged, '| withholding the target', reached, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 30).join('\n  ')}` : '');
    expect(rs.length).toBe(2 * READS_PER_SHAPE);
    expect(reached, 'the target is withheld on some read').toBeGreaterThan(0);
    expect(faults).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('PLANT (b), (d), (f), (g): a power the OWNER hid, named in a shown power\'s standing, its own row\'s desc, a dmNote and a tension naming it: on the DM door (its name served unmasked, its row stamped) GREEN BY ABSENCE (no standing tail, no hidden row\'s desc, no dmNote naming it, no masked party), both engines, every setting, both stored shapes', async () => {
    const { rs, faults, reached, judged } = await plantRun('owner', PLANT_TOWNS.owner, ['(a)', '(d)', '(f)', '(g)'], (r, d) => listsOf(d).some((f) => f.hidden === true && nameOf(f) === HAND));
    note('R5DP plant (b)(d)(f)(g) owner: engine-reads', judged, '| serving the stamped row', reached, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 30).join('\n  ')}` : '');
    expect(rs.length).toBe(2 * READS_PER_SHAPE);
    expect(reached, 'the DM door serves the stamped row').toBeGreaterThan(0);
    expect(faults).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('PLANT (c): the withheld power\'s BARE form (its qualifier dropped) and LOWER CASE ("the religious authorities", past the case-sensitive mask) in a shown power\'s standing: GREEN BY ABSENCE, both engines, every setting, Reveal off and on, both stored shapes', async () => {
    const out = [];
    for (const [key, target] of [['bare', TGP], ['lower', RA]]) {
      const { rs, faults, reached, judged } = await plantRun(key, PLANT_TOWNS[key], ['(a)'], (r, d) => withheldOf(r.stored, d).includes(target));
      note(`R5DP plant (c) ${key}: engine-reads`, judged, '| withholding the target', reached, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 30).join('\n  ')}` : '');
      expect(rs.length).toBe(2 * READS_PER_SHAPE);
      expect(reached, `${key}: the target is withheld on some read`).toBeGreaterThan(0);
      out.push(...faults);
    }
    expect(out).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('PLANT (d2): a MASKED row\'s own desc (an unstamped row carrying the owner-hidden power\'s name, served under the mask on the player view) is served with NO desc, both engines, every setting, Reveal off and on', async () => {
    const { faults, reached, judged } = await plantRun('owner-namerow', PLANT_TOWNS.owner, ['(d)', '(d2)'], (_r, d) => listsOf(d).some(isMasked), ['nameRow']);
    note('R5DP plant (d2) masked row: engine-reads', judged, '| serving a masked row', reached, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 30).join('\n  ')}` : '');
    expect(reached, 'the player view serves the masked row').toBeGreaterThan(0);
    expect(faults).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('PLANT (g): a tension\'s party served as the mask leaves its list on the player view, the tension staying, both engines, every setting, both stored shapes', async () => {
    const { faults, reached } = await plantRun('owner', PLANT_TOWNS.owner, ['(g)'], (r, d) => !listsOf(d).some((f) => nameOf(f) === HAND) && arr(d?.history?.currentTensions).length > 0);
    expect(reached, 'the player view withholds the party\'s power').toBeGreaterThan(0);
    expect(faults).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('PLANT (e) (E136 (a), the mask in the name slot): the owner-hidden power named in a shown power\'s standing, read on the player view where the projection masks it ("they play the an unseen interest and ..."): no served desc carries the mask, both engines, every setting, both stored shapes', async () => {
    const out = []; let reached = 0;
    for (const [key, town] of [['owner', PLANT_TOWNS.owner], ['lower', PLANT_TOWNS.lower]]) {
      const r = await plantRun(key, town, ['(e)'], (rr, d) => !listsOf(d).some((f) => nameOf(f) === HAND || nameOf(f) === RA) && rr.read !== 'import');
      reached += r.reached; out.push(...r.faults);
    }
    note('R5DP plant (e) the mask in a standing: player-view engine-reads', reached, '| faults', out.length, out.length ? `\n  ${out.slice(0, 12).join('\n  ')}` : '');
    expect(reached, 'the player view masks the owner-hidden name').toBeGreaterThan(0);
    expect(out).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('TEETH: a read that hides nothing (the open town on every read; every read of every plant town that hides nothing): the PAGE\'s desc (base + S) equals the stored, byte for byte, both engines, both doors (the page, the import\'s save), both stored shapes', async () => {
    const faults = []; let open = 0; let others = 0; let rows = 0;
    for (const [key, town] of Object.entries(PLANT_TOWNS)) for (const r of await readsOf(key, town)) for (const { eng, d } of engines(r)) {
      if (!hidesNothing(r.stored, d)) { if (key === 'open') faults.push(`open ${tag(r, eng)}: the open town's read hides something`); continue; }
      if (key === 'open') open += 1; else others += 1;
      const want = new Map(r.stored.powerStructure.factions.map((f) => [f.faction, f.desc]));
      for (const door of ['page', 'import']) for (const [n, v] of pageDescs(rd, door, d)) {
        rows += 1;
        if (v === undefined) continue; // the desc not served on this read (a criminal power's field veil, X-21c): not drawn
        if (v !== want.get(n) && !seatContestClass(want.get(n))) faults.push(`${key} ${tag(r, eng)} ${door} ${n}: page ${J(v)} | stored ${J(want.get(n))}`);
      }
    }
    note('R5DP teeth: open-town engine-reads', open, '| other hides-nothing engine-reads', others, '| page rows judged', rows, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 20).join('\n  ')}` : '');
    expect(open, 'the open town hides nothing on every engine-read').toBe(2 * 2 * READS_PER_SHAPE);
    expect(rows).toBeGreaterThan(0);
    expect(faults).toEqual([]);
  }, ARM_TIMEOUT_MS);

  // ── THE BORN POOL (R5DESC-MEASURE's births), ACT T, THE HAND HIDES ─────
  const POOL_FULL = process.env.R5DP_POOL === 'full';
  const POOL_TIMEOUT_MS = POOL_FULL ? 7_200_000 : 3_600_000; // deadlock guard, not a perf budget
  const SHARD = /^(\d+)\/(\d+)$/.exec(process.env.R5DP_SHARD || '');
  /** The standing slice: R5DESC-MEASURE's pool at N=1, every STANDING_EVERY-th place (its sizes and crises walked). */
  const STANDING_EVERY = 3;
  const P_SIZES = Object.freeze(['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis']);
  const P_CRISES = Object.freeze(['none', 'infiltrated', 'none', 'insurgency', 'occupied', 'indebted', 'none', 'under_siege', 'wartime', 'politically_fractured']);
  let births = null;
  const poolOf = async () => {
    if (!births) {
      const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
      const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
      const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
      const { transferRulingPower } = await import('../../src/domain/rulingPower.js');
      await loadGenerationLawPayloads();
      const out = []; let idx = 0;
      for (let k = 0; k < (POOL_FULL ? 2 : 1); k += 1) for (const size of P_SIZES) for (const crisis of P_CRISES) {
        idx += 1;
        if (!POOL_FULL && idx % STANDING_EVERY !== 1) continue;
        if (POOL_FULL && SHARD && idx % Number(SHARD[2]) !== Number(SHARD[1])) continue;
        const cfg = { ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
        const t = clone(generateSettlementPipeline(birthConfig(cfg), null, { seed: `r3m-${size}-${crisis}-${k}-${idx}`, customContent: {} }));
        delete t.publicProse;
        out.push({ seed: `r3m-${size}-${crisis}-${k}-${idx}`, t });
      }
      // ACT T on jp6-city-8 (the join probe's recipe: DEFAULT_CONFIG, no dials; the first non-governing, unveiled power hidden by
      // the DM takes the seat by a coup)
      const born = clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: 'jp6-city-8', customContent: {} }));
      delete born.publicProse;
      const fs = arr(born.powerStructure?.factions); const gov = fs.find((f) => f?.isGoverning);
      const A = nameOf(fs.find((f) => isRec(f) && f !== gov && !isVeiledPower(f)));
      const hid = clone(born); hid.powerStructure.factions = hid.powerStructure.factions.map((f) => (nameOf(f) === A ? { ...f, hidden: true } : f));
      const tr = transferRulingPower(hid, A, { cause: 'coup' });
      births = { pool: out, actT: tr.error ? null : { seed: 'jp6-city-8 act T', t: clone(tr.settlement), hidden: A, error: tr.error } };
    }
    return births;
  };
  /** The hand hides of a birth (E128 (a)): its density host (the power a density-law rival was minted from) and a noble power,
   * each hidden by hand (`hidden: true`), each its own record. */
  const handHidesOf = (t) => {
    const fs = arr(t.powerStructure?.factions).filter(isRec);
    const out = [];
    const rival = fs.find((f) => typeof f.contestsNiche === 'string');
    const host = rival ? fs.find((f) => f !== rival && seatKey(f) === rival.contestsNiche && !f.hidden) : null;
    if (host) out.push({ kind: 'density host', name: nameOf(host) });
    const noble = fs.find((f) => !f.isGoverning && !f.hidden && (f.category === 'noble' || ['Noble Families', 'Noble Houses', 'Landed Gentry', 'Manor Household'].includes(nameOf(f))));
    if (noble && !out.some((x) => x.name === nameOf(noble))) out.push({ kind: 'noble power', name: nameOf(noble) });
    return out.map((h) => { const x = clone(t); x.powerStructure.factions = x.powerStructure.factions.map((f) => (nameOf(f) === h.name ? { ...f, hidden: true } : f)); return { ...h, t: x }; });
  };
  /** The projection's mask over a record (publicSafe.js :: maskHiddenNames's rule, by its own words: every string VALUE at any
   * depth with each name split and joined by the mask; never a key, an `id`, or the record's own top-level `name`). */
  const maskAll = (v, names, isRoot = true) => {
    if (typeof v === 'string') return names.reduce((x, n) => x.split(n).join(HIDDEN_POWER_MASK), v);
    if (Array.isArray(v)) return v.map((x) => maskAll(x, names, false));
    if (isRec(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, (isRoot && k === 'name') || (k === 'id' && typeof x === 'string') ? x : maskAll(x, names, false)]));
    return v;
  };
  /** The names of a record's rows stamped `hidden` (the owner's hand). */
  const stampedOf = (t) => arr(t.powerStructure?.factions).filter((f) => isRec(f) && f.hidden === true).map(nameOf).filter(Boolean);
  /**
   * The same place with the withheld powers and houses NEVER THERE: their rows, their relation rows and tension parties gone;
   * on the player view (Reveal DM off) a name the owner hid is also masked in the record's text, as the projection masks it
   * on the hiding read (the place without the power names it nowhere; the mask is the projection's stand-in for that).
   */
  const neverThere = (t, wh, dm = true) => {
    let x = clone(t);
    const stamped = stampedOf(t).filter((n) => wh.includes(n));
    x.institutions = arr(x.institutions).filter((h) => !(isRec(h) && wh.includes(h.name)));
    const keep = (f) => !(isRec(f) && wh.includes(nameOf(f)));
    if (isRec(x.powerStructure)) {
      x.powerStructure.factions = arr(x.powerStructure.factions).filter(keep);
      x.powerStructure.factionRelationships = arr(x.powerStructure.factionRelationships).filter((r) => !(isRec(r) && arr(r.pair).some((n) => wh.includes(String(n)))));
    }
    if (Array.isArray(x.factions)) x.factions = x.factions.filter(keep);
    // a tension whose OWN words name a withheld power (its name, desc, stakes: not its party list) is no tension of the place
    // where that power was never there (R5D-PAGE-B2, on the stored pool: the projection's sweep withholds such an entry on the
    // hiding read, and a never-there place built by deletion kept it); its party list loses the withheld names as before
    const tensionNames = (c) => { const { factions: _p, ...own } = c; return strings(own).some(([, v]) => namesWithheld(v, wh, t)); };
    if (isRec(x.history)) x.history.currentTensions = arr(x.history.currentTensions).filter((c) => !(isRec(c) && tensionNames(c)))
      .map((c) => (isRec(c) && Array.isArray(c.factions) ? { ...c, factions: c.factions.filter((n) => !wh.includes(String(n))) } : c));
    if (!dm && stamped.length) x = maskAll(x, stamped);
    return x;
  };
  /**
   * E136 (a)'s served descs on a hiding read: a desc whose stored standing names a power the owner hid, served as the
   * projection masks it and NOT CUT (the table's name slot begins [A-Z]): served = mask(stored base) + ' ' + a tail.
   */
  const e136Of = (t, d) => {
    const stamped = stampedOf(t);
    if (!stamped.length) return [];
    const mk = (v) => stamped.reduce((x, n) => x.split(n).join(HIDDEN_POWER_MASK), v);
    const out = [];
    const stored = new Map(listsOf(t).map((f) => [mk(nameOf(f)), f.desc]));
    for (const f of listsOf(d)) {
      const sd = stored.get(nameOf(f));
      if (typeof f.desc !== 'string' || typeof sd !== 'string') continue;
      const base = mk(refCut(sd)?.base ?? sd);
      if (f.desc !== base && f.desc.startsWith(base) && hasMask(f.desc.slice(base.length))) out.push(`${nameOf(f)} (mask forms ${J(maskForms(f.desc.slice(base.length)))}): ${J(f.desc.slice(base.length)).slice(0, 140)}`);
    }
    return out;
  };
  /** One read at the owner's own setting: the server's gallery page and import, the twin's document. */
  const readOne = async (stored, dm) => {
    const ov = veil.writeShareVeil({}, opened(OPEN), { mode: 'live', at: AT });
    const { slug } = await store(stored, ov, dm);
    const g = await gallery(slug); const i = await imported(slug);
    const twin = twinOf(stored, dm, ov);
    return { server: { page: isRec(g) ? g : null, import: isRec(i) ? i : null }, twin: { page: twin, import: twin } };
  };
  /** The withheld powers and houses of a read (a stored power not served uncut; a stored house not served). */
  const withheldAllOf = (stored, d) => {
    const sh = new Set(arr(d?.institutions).filter(isRec).map((h) => h.name));
    return [...new Set([...withheldOf(stored, d), ...arr(stored.institutions).filter((h) => isRec(h) && typeof h.name === 'string' && h.name && !sh.has(h.name)).map((h) => h.name)])];
  };
  const hidesAny = (t) => arr(t.institutions).some((h) => isRec(h) && isHideableHouse(h)) || listsOf(t).some((f) => f.hidden === true);
  /** Every hiding record of the unit: the pool's hiding births, act T, the hand hides; on the STORED pool (item 5c) its
   * hiding places and their hand hides, each hand hide stored AS SAVED again (a hide is a save; act T is the born half's). */
  const hidingRecords = async (source = 'born') => {
    if (source === 'stored') {
      const pool = await storedPoolOf(); const out = [];
      for (const b of pool) if (hidesAny(b.t)) out.push({ seed: b.seed, how: 'house hide', t: b.t });
      for (const b of pool) for (const h of handHidesOf(b.t)) out.push({ seed: b.seed, how: `hand hide: ${h.kind} ${h.name}`, t: await asSaved(h.t) });
      return out;
    }
    const { pool, actT } = await poolOf();
    const out = pool.filter((b) => hidesAny(b.t)).map((b) => ({ seed: b.seed, how: 'house hide', t: b.t }));
    if (actT) out.push({ seed: actT.seed, how: `act T (${actT.hidden})`, t: actT.t });
    for (const b of pool) for (const h of handHidesOf(b.t)) out.push({ seed: b.seed, how: `hand hide: ${h.kind} ${h.name}`, t: h.t });
    return out;
  };

  // ── THE STORED POOL (item 5c; E134): today-born places STORED AS SAVED ──────────────────────────────────────────────
  /** N67: the canonical form (keys sorted, recursively) and its sha256. */
  const canonOf = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
  const shaOf = (v) => createHash('sha256').update(canonOf(v) ?? 'null').digest('hex');
  /** N67: one stored read's two shas per door, to R5DP_SHAS; the first 50 differing pairs whole to R5DP_SHA_DIFFS. Judges nothing. */
  const recordShas = (place, dm, got) => {
    const out = process.env.R5DP_SHAS; if (!out) return;
    const pool = /master/i.test(STORED_DIR) ? 'master' : 'today';
    for (const door of ['page', 'import']) {
      const a = shaOf(got.server[door]); const b = shaOf(got.twin[door]);
      appendFileSync(out, `${[place, pool, door, 'own', dm ? 'DM' : 'off', a, b].join('\t')}\n`);
      const dir = process.env.R5DP_SHA_DIFFS;
      if (a !== b && dir) {
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        if (readdirSync(dir).length < 50) writeFileSync(`${dir}/${createHash('sha256').update(`${place} ${door} ${dm}`).digest('hex').slice(0, 16)}.json`, JSON.stringify({ place, pool, door, setting: 'own', reveal: dm ? 'DM' : 'off', server: got.server[door], twin: got.twin[door] }));
      }
    }
  };
  const STORED_DIR = process.env.R5DP_STORED || '';
  let asSavedFn = null;
  /** A place as src/lib/saves.js stores it: its publicProse composed again over it (dump.probe.jsx's recipe). */
  const asSaved = async (t) => {
    if (!asSavedFn) {
      const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
      const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
      asSavedFn = (x) => { const u = { ...x }; delete u.publicProse; return clone(withPublicProse(u, composePublicProse(u))); };
    }
    return asSavedFn(t);
  };
  let storedPool = null;
  /** `R5DP_STORED=<dir>`: dump.sh's documents (<seed>.json, its index-shard*.json; `R5DP_SHARD=<i>/<k>` a shard by seed
   * order); else the standing slice's births stored as saved, in-process. */
  const storedPoolOf = async () => {
    if (!storedPool) {
      const out = [];
      if (STORED_DIR) {
        const index = readdirSync(STORED_DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort()
          .flatMap((f) => JSON.parse(readFileSync(`${STORED_DIR}/${f}`, 'utf8')).index).sort((a, b) => (a.seed < b.seed ? -1 : a.seed > b.seed ? 1 : 0));
        index.forEach((j, i) => { if (!SHARD || i % Number(SHARD[2]) === Number(SHARD[1])) out.push({ seed: j.seed, role: j.role, t: JSON.parse(readFileSync(`${STORED_DIR}/${j.seed}.json`, 'utf8')) }); });
      } else for (const b of (await poolOf()).pool) out.push({ seed: b.seed, role: 'slice', t: await asSaved(b.t) });
      storedPool = out;
    }
    return storedPool;
  };
  const poolName = (source) => (source === 'stored' ? `stored ${STORED_DIR ? `${STORED_DIR}${SHARD ? ` shard ${SHARD[0]}` : ''}` : 'standing slice, in-process'}`
    : `${POOL_FULL ? `full${SHARD ? ` shard ${SHARD[0]}` : ''}` : 'standing'} pool`);

  /** THE publicProse COUNT (item 5c; rulings 107 (2), 111): per engine, hiding or nothing-hidden, block key, field and what
   * (the stored desc, its base, its standing; word for word or by the lane's fold): the reads whose served publicProse holds it. */
  const prose = { reads: {}, served: {}, cells: new Map(), ex: [] };
  const tallyProse = (t, d, eng, hiding, tagOf) => {
    prose.reads[eng] = (prose.reads[eng] || 0) + 1;
    const pp = isRec(d?.publicProse) ? d.publicProse : null;
    if (!pp) return;
    prose.served[eng] = (prose.served[eng] || 0) + 1;
    const needles = [];
    for (const f of listsOf(t)) {
      if (typeof f.desc !== 'string' || f.desc === '') continue;
      const c = refCut(f.desc);
      for (const [what, x] of [['desc', f.desc], ['base', c?.base], ['standing', c?.standing]]) if (typeof x === 'string' && x.length >= 12) needles.push({ what, x, fx: nameFold(x) });
    }
    const seen = new Set();
    for (const [p, s] of strings(pp.blocks)) {
      const block = p.split(/[.[]/)[0]; const field = p.slice(block.length).replace(/\[\d+\]/g, '[]').replace(/^\./, '') || '(the block)';
      const fs = nameFold(s);
      for (const { what, x, fx } of needles) {
        const how = s.includes(x) ? 'word for word' : fx && fs.includes(fx) ? 'by the fold' : null;
        if (!how) continue;
        const key = `${eng}|${hiding ? 'hiding' : 'nothing hidden'}|${block}|${field}|${what}|${how}`;
        if (seen.has(key)) continue;
        seen.add(key); prose.cells.set(key, (prose.cells.get(key) || 0) + 1);
        if (prose.ex.length < 8) prose.ex.push(`${tagOf} ${eng} ${block}.${field} holds a ${what} ${how}: ${J(x).slice(0, 90)}`);
      }
    }
  };

  /** THE FIDELITY ARM over a pool ([{ seed, t }]); on the stored pool the served publicProse is counted with it. */
  const fids = new Map();
  const fidelityOver = async (pool, source) => {
    if (fids.has(source)) return fids.get(source);
    const faults = []; const listed = []; let pages = 0; let rows = 0; let equal = 0; let veiledField = 0; let closed = 0;
    for (const { seed, t } of pool) {
      if (source === 'stored' && hidesAny(t)) continue; // a stored place that hides is the differential's
      const want = new Map(arr(t.powerStructure?.factions).filter(isRec).map((f) => [nameOf(f), f.desc]));
      for (const f of want.values()) if (typeof f === 'string' && !refCut(f)) closed += 1;
      for (const dm of [false, true]) {
        const got = await readOne(t, dm);
        if (source === 'stored') recordShas(seed, dm, got);
        for (const eng of ['server', 'twin']) for (const door of ['page', 'import']) {
          const d = got[eng][door];
          if (!isRec(d)) { faults.push(`${seed} ${eng} ${door} dm=${dm}: no document`); continue; }
          if (!hidesNothing(t, d)) continue;
          pages += 1;
          if (source === 'stored') tallyProse(t, d, `${eng} ${door}`, false, `${seed} dm=${dm}`);
          for (const [n, v] of pageDescs(rd, door, d)) {
            rows += 1;
            if (v === want.get(n)) { equal += 1; continue; }
            if (v === undefined) { veiledField += 1; continue; } // the desc not served on this read (a criminal power's field veil, X-21c): not drawn
            if (seatContestClass(want.get(n))) { listed.push(`${seed} ${eng} ${door} dm=${dm} ${n}`); continue; }
            faults.push(`${seed} ${eng} ${door} dm=${dm} ${n}: page ${J(v).slice(-160)} | stored ${J(want.get(n)).slice(-160)}`);
          }
        }
      }
    }
    note(`R5DP fidelity (${poolName(source)}): places`, pool.length, '| nothing-hidden engine-door-pages', pages, '| page rows', rows, '| equal', equal,
      '| LISTED seat-contest (cause: the seat-contest line reads the seat\'s legitimacy after the last standing write)', listed.length, J([...new Set(listed.map((x) => x.split(' ')[0]))]),
      '| desc not served (field veil)', veiledField, '| stored descs no row cuts (served as base)', closed, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
    const r = { pages, rows, faults };
    fids.set(source, r);
    return r;
  };

  it('THE FIDELITY ARM (item 3; E115 (1)): every nothing-hidden born page\'s re-derived desc equals the stored, both engines, both doors, Reveal off and DM, EXCEPT descs whose stored standing carries the seat-contest line, LISTED as that class with its cause; a miss of any other cause reds', async () => {
    const r = await fidelityOver((await poolOf()).pool, 'born');
    expect(r.pages, 'the pool holds nothing-hidden pages').toBeGreaterThan(0);
    expect(r.rows).toBeGreaterThan(0);
    expect(r.faults).toEqual([]);
  }, POOL_TIMEOUT_MS);

  it('THE STORED HALF OF THE FIDELITY ARM (item 5c; E134): every nothing-hidden page of a today-born place STORED AS SAVED (its publicProse with it) re-derives the stored desc, both engines, both doors, Reveal off and DM, the seat-contest class LISTED; a miss of any other cause reds', async () => {
    const r = await fidelityOver(await storedPoolOf(), 'stored');
    expect(r.pages, 'the stored pool holds nothing-hidden pages').toBeGreaterThan(0);
    expect(r.rows).toBeGreaterThan(0);
    expect(r.faults).toEqual([]);
  }, POOL_TIMEOUT_MS);

  /** The page document at a door (A's readers: the page's rederiveForPage on a copy; the import's rederiveServed). */
  const pageOf = (door, d) => (door === 'page' ? rd.page(clone(d)) : rd.served(d));
  /** THE DIFFERENTIAL over a source's hiding records: the faults split (E136 (a)'s mask; the share class by 107 (1)'s four
   * conditions; reader B's sentence, 107 (2)); on the stored pool the served publicProse is counted with it. */
  const diffs = new Map();
  const differentialOver = async (source = 'born') => {
    if (diffs.has(source)) return diffs.get(source);
    const faults = []; const maskFaults = []; const bFaults = []; let reads = 0; let hiding = 0; let equal = 0; let tensionReads = 0;
    const share = { rows: 0, reads: new Set(), records: new Set(), notListed: { dm: 0, stamped: 0, gapOnly: 0, offEqual: 0 }, figsDiffer: 0, rankOnly: 0, pairRows: 0, pairReads: new Set(), pairRecords: new Set(), pairEx: [] };
    const b = { reads: 0, drawn: 0, equal: 0 };
    const recs = await hidingRecords(source);
    for (let ri = 0; ri < recs.length; ri += 1) {
      const { seed, how, t } = recs[ri];
      /** (iv): the same record's Reveal-off read, per engine and door: equal (no page desc differs) */
      const offEqual = new Map();
      for (const dm of [false, true]) {
        const got = await readOne(t, dm);
        if (source === 'stored') recordShas(`${seed} (${how})`, dm, got);
        const wh = withheldAllOf(t, got.twin.page);
        const whS = isRec(got.server.page) ? withheldAllOf(t, got.server.page) : null;
        if (J([...wh].sort()) !== J([...(whS || [])].sort())) faults.push(`${seed} (${how}) dm=${dm}: server and twin withhold differently: ${J(whS)} | ${J(wh)}`);
        if (!wh.length) continue;
        hiding += 1;
        const ng = await readOne(neverThere(t, wh, dm), dm);
        if (!dm) for (const eng of ['server', 'twin']) if (isRec(got[eng].page)) for (const x of e136Of(t, got[eng].page)) maskFaults.push(`${seed} (${how}) ${eng} dm=false ${x}`);
        for (const eng of ['server', 'twin']) for (const door of ['page', 'import']) {
          const d = got[eng][door]; const n = ng[eng][door];
          if (!isRec(d) || !isRec(n)) { faults.push(`${seed} (${how}) ${eng} ${door} dm=${dm}: no document`); continue; }
          reads += 1;
          if (source === 'stored') tallyProse(t, d, `${eng} ${door}`, true, `${seed} (${how}) dm=${dm}`);
          const pd = pageOf(door, d); const pnd = pageOf(door, n);
          const descsOf = (p) => new Map(arr(p?.powerStructure?.factions).filter((f) => isRec(f) && !isCut(f)).map((f) => [nameOf(f), f.desc]));
          const ph = descsOf(pd); const pn = descsOf(pnd);
          const names = [...new Set([...ph.keys(), ...pn.keys()])];
          const diff = names.filter((k) => ph.get(k) !== pn.get(k));
          if (!dm) offEqual.set(`${eng} ${door}`, diff.length === 0);
          if (!diff.length) equal += 1;
          // THE SHARE CLASS, 107 (1)'s four conditions, each judged and counted where it fails
          const figs = (x) => J(arr(x.powerStructure?.factions).filter((f) => isRec(f) && !isCut(f)).map((f) => [nameOf(f), f.power]).sort());
          if (diff.length && figs(d) !== figs(n)) share.figsDiffer += 1;
          for (const k of diff) {
            const c = { dm, stamped: servesStamped(d), gapOnly: gapOnly(ph.get(k), pn.get(k)), offEqual: offEqual.get(`${eng} ${door}`) === true };
            if (c.dm && c.stamped && c.gapOnly && c.offEqual) {
              share.rows += 1; share.reads.add(`${ri} ${eng} ${door}`); share.records.add(ri);
              if (gapOnly(ph.get(k), pn.get(k), GAP_RANK)) share.rankOnly += 1; else { share.pairRows += 1; share.pairReads.add(`${ri} ${eng} ${door}`); share.pairRecords.add(ri); if (share.pairEx.length < 6) share.pairEx.push(`${seed} (${how}) ${eng} ${door} ${k}: hiding ${J(standingSegments(ph.get(k)).segs.map((g) => g.id))} | never there ${J(standingSegments(pn.get(k)).segs.map((g) => g.id))}`); }
              continue;
            }
            if (dm) for (const w of Object.keys(share.notListed)) if (!c[w]) share.notListed[w] += 1;
            const ids = (v) => J(standingSegments(v).segs.map((g) => g.id));
            faults.push(`${seed} (${how}) ${eng} ${door} dm=${dm} ${k}${dm ? ` [not the share class: ${Object.entries(c).filter(([, v]) => !v).map(([w]) => w).join(', ')}]` : ''}: hiding ${ids(ph.get(k))} ${J(ph.get(k)).slice(-140)} | never there ${ids(pn.get(k))} ${J(pn.get(k)).slice(-140)}`);
          }
          // READER B (107 (2)): the hiding page's recent-conflict sentence equals the never-there page's; it names no power the
          // read withholds (the lane's fold, case-blind) and carries no mask (case-blind)
          const sh = typeof pd?.powerStructure?.recentConflict === 'string' ? pd.powerStructure.recentConflict : null;
          const sn = typeof pnd?.powerStructure?.recentConflict === 'string' ? pnd.powerStructure.recentConflict : null;
          b.reads += 1; if (sh !== null) b.drawn += 1;
          if (sh === sn) b.equal += 1;
          else bFaults.push(`${seed} (${how}) ${eng} ${door} dm=${dm}: reader B: hiding ${J(sh).slice(0, 120)} | never there ${J(sn).slice(0, 120)}`);
          const whB = withheldOf(t, d);
          if (sh !== null && namesWithheld(sh, whB, d)) bFaults.push(`${seed} (${how}) ${eng} ${door} dm=${dm}: reader B's sentence names a power the read hides ${J(whB)} (${hitOf(sh, whB)})`);
          if (sh !== null && hasMask(sh)) bFaults.push(`${seed} (${how}) ${eng} ${door} dm=${dm}: reader B's sentence carries the mask (forms ${J(maskForms(sh))})`);
          // the masked tension party: the hiding page's tensions equal the never-there page's
          const tp = (x) => J(arr(x?.history?.currentTensions).map((c) => arr(c?.factions)));
          if (!dm && arr(t.history?.currentTensions).some((c) => arr(c?.factions).some((p) => stampedOf(t).includes(String(p)) && wh.includes(String(p))))) {
            tensionReads += 1;
            if (tp(pd) !== tp(pnd)) faults.push(`${seed} (${how}) ${eng} ${door} dm=${dm}: the tensions' parties: hiding ${tp(pd).slice(0, 140)} | never there ${tp(pnd).slice(0, 140)}`);
          }
        }
      }
    }
    const r = { recs: recs.length, faults, maskFaults, bFaults, b, share, reads, hiding, equal, tensionReads };
    diffs.set(source, r);
    note(`R5DP differential (${poolName(source)}${source === 'born' ? ' + act T + hand hides' : ' + hand hides'}): hiding records`, recs.length, '| hiding reads (record x Reveal DM)', hiding, '| engine-door-reads', reads, '| equal', equal,
      '| tension reads', tensionReads, '| LISTED share class by 107 (1)\'s four conditions: rows', share.rows, '| reads', share.reads.size, '| records', share.records.size, J([...share.records].map((i) => `${recs[i].seed} (${recs[i].how})`).slice(0, 40)),
      '| DM rows differing that fail a condition', J(share.notListed), '| of the listed rows: the rank family alone', share.rankOnly, '| a PAIR form among the differing (rows / reads / records)', share.pairRows, share.pairReads.size, share.pairRecords.size, J(share.pairEx),
      '| differing reads whose kept figures differ (the witness)', share.figsDiffer, '| GAP_RANK ids', J([...GAP_RANK]), '| not gap-based', J(readTable().forms.map((f) => f.id).filter((id) => !GAP_BASED.has(id))),
      '| faults', faults.length, '| E136 (a) mask', maskFaults.length, '| READER B: engine-door-reads', b.reads, '| drawn', b.drawn, '| equal', b.equal, '| faults', bFaults.length,
      faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '', maskFaults.length ? `\n  MASK: ${maskFaults.slice(0, 10).join('\n  MASK: ')}` : '', bFaults.length ? `\n  B: ${bFaults.slice(0, 20).join('\n  B: ')}` : '');
    return r;
  };
  /** The standing slice's share class, PINNED (R5D-PAGE-A's figure, 107 (1)): 36 engine-door reads on 9 records. */
  const SHARE_PIN = Object.freeze({ reads: 36, records: 9 });

  it('THE DIFFERENTIAL (item 4): a hiding read\'s page desc equals that of the same place with the withheld powers and houses NEVER THERE, both engines, both doors, Reveal off and DM, over the pool\'s house hides, act T and the hand hides (a density host, a noble power); and the same for the masked tension party; server = twin', async () => {
    const r = await differentialOver('born');
    expect((await poolOf()).actT, 'act T was made (transferRulingPower on jp6-city-8)').not.toBeNull();
    expect(r.hiding, 'the unit holds hiding reads').toBeGreaterThan(0);
    expect(r.reads, 'both engines, both doors, every hiding read').toBe(r.hiding * 4);
    // anchored: reads is asserted above, so an empty fault list is a judgment over every hiding read
    expect(r.faults).toEqual([]);
  }, POOL_TIMEOUT_MS);

  it('THE SHARE CLASS (ruling 107 (1)): a differing row is LISTED only where (i) the read is on the DM door, (ii) the place serves a stamped row, (iii) the two page descs differ in S\'s gap-based forms alone and (iv) the same record\'s Reveal-off read is equal (anything else is a fault, judged by THE DIFFERENTIAL); the count pinned on the standing slice (36 reads on 9 records), re-counted on the full pool', async () => {
    const r = await differentialOver('born');
    expect(GAP_BASED.size, 'the table holds gap-based forms').toBeGreaterThan(0);
    expect(r.share.reads.size, 'the listed reads lie on the records counted').toBeGreaterThanOrEqual(r.share.records.size);
    if (!POOL_FULL) expect({ reads: r.share.reads.size, records: r.share.records.size }).toEqual(SHARE_PIN);
  }, POOL_TIMEOUT_MS);

  it('READER B\'s DIFFERENTIAL (ruling 107 (2)): on every hiding read of the born pool, act T and the hand hides, the page\'s recent-conflict sentence (rederiveRecentConflict, both doors) equals the never-there page\'s and names no power the read hides and no mask (case-blind), both engines, Reveal off and DM', async () => {
    const r = await differentialOver('born');
    expect(r.b.reads, 'reader B judged on every hiding engine-door read').toBe(r.reads);
    expect(r.b.drawn, 'reader B draws its sentence somewhere').toBeGreaterThan(0);
    expect(r.bFaults).toEqual([]);
  }, POOL_TIMEOUT_MS);

  it('THE MASK IN A STANDING ON THE BORN HAND HIDES (E136 (a), the mask in the name slot): on the player view no served desc keeps a standing the projection masked (served = the masked base and an uncut tail carrying the mask, case-blind), both engines', async () => {
    const r = await differentialOver('born');
    expect(r.reads).toBeGreaterThan(0);
    expect(r.maskFaults).toEqual([]);
  }, POOL_TIMEOUT_MS);

  it('THE STORED HALF OF THE DIFFERENTIAL, THE SHARE CLASS AND READER B (item 5c; E134, 107 (1), 107 (2)): over today-born places STORED AS SAVED (their house hides and hand hides, each hide stored as saved again), the page desc and the page sentence equal the never-there place\'s, both engines, both doors, Reveal off and DM, the share class listed by its four conditions; the mask uncut nowhere', async () => {
    const r = await differentialOver('stored');
    expect(r.hiding, 'the stored pool holds hiding reads').toBeGreaterThan(0);
    expect(r.reads, 'both engines, both doors, every hiding read').toBe(r.hiding * 4);
    expect(r.b.reads).toBe(r.reads);
    expect(r.maskFaults).toEqual([]);
    expect(r.bFaults).toEqual([]);
    expect(r.faults).toEqual([]);
  }, POOL_TIMEOUT_MS);

  it('THE STORED HALF OF THE PLANT (item 5c; item 2\'s absence): on every read of every stored place and its hiding records, both engines, both doors, Reveal off and DM, no served desc ends in a standing, names a withheld power (the lane\'s fold, case-blind) or carries the mask; no hidden or masked row carries a desc; no dmNote names a withheld power; no tension party is the mask', async () => {
    const pool = await storedPoolOf();
    const recs = [...pool.filter((x) => !hidesAny(x.t)).map((x) => ({ seed: x.seed, how: 'nothing hidden', t: x.t })), ...(await hidingRecords('stored'))];
    const faults = []; const chair = []; let judged = 0;
    for (const { seed, how, t } of recs) for (const dm of [false, true]) {
      const got = await readOne(t, dm);
      for (const eng of ['server', 'twin']) for (const door of ['page', 'import']) {
        const d = got[eng][door];
        if (!isRec(d)) { faults.push(`${seed} (${how}) ${eng} ${door} dm=${dm}: no document`); continue; }
        judged += 1;
        for (const f of absenceFaults(t, d, { born: true })) {
          // RULING 107 (3), THE CHAIR's (no cure here): a density rival's SERVED base naming its hidden host (named so; it reds)
          const rival = f.plant === '(a)' && f.row && listsOf(t).some((x) => nameOf(x) === f.row && typeof x.contestsNiche === 'string');
          (rival ? chair : faults).push(`${rival ? '107 (3), the chair\'s: ' : ''}${seed} (${how}) ${eng} ${door} dm=${dm} ${f.plant}: ${f.why}`);
        }
      }
    }
    note(`R5DP plant, stored half (${poolName('stored')}): records`, recs.length, '| engine-door-reads', judged, '| faults', faults.length, '| 107 (3), the chair\'s (a rival\'s served base naming its hidden host)', chair.length, J([...new Set(chair.map((x) => x.slice("107 (3), the chair's: ".length).split(' ')[0]))]),
      faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '', chair.length ? `\n  107 (3): ${chair.slice(0, 12).join('\n  107 (3): ')}` : '');
    expect(judged, 'both engines, both doors, Reveal off and DM, every stored record').toBe(recs.length * 8);
    expect(faults).toEqual([]);
    expect(chair, '107 (3), the chair\'s: a rival\'s served base naming its hidden host (built and run, not pinned)').toEqual([]);
  }, POOL_TIMEOUT_MS);

  it('THE publicProse COUNT (item 5c; rulings 107 (2), 111): by block key and field, every served publicProse block that holds a power\'s stored desc, its base or its standing (word for word or by the lane\'s fold), on hiding and nothing-hidden reads of the stored pool, per engine; a figure, never asserted non-zero (once (a\') serves no publicProse on a shared read it reads 0 by construction)', async () => {
    await fidelityOver(await storedPoolOf(), 'stored'); // the nothing-hidden reads (cached: counted once)
    await differentialOver('stored');
    const cells = [...prose.cells.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
    note(`R5DP publicProse count (${poolName('stored')}): page reads judged`, J(prose.reads), '| of them serving publicProse', J(prose.served),
      !Object.values(prose.served).some(Boolean) ? '| 0 BY CONSTRUCTION: no shared read serves publicProse' : `| cells (engine|reads|block|field|what|how = reads)\n  ${cells.map(([k, v]) => `${k} = ${v}`).join('\n  ')}`, prose.ex.length ? `\n  EX: ${prose.ex.join('\n  EX: ')}` : '');
    expect(Object.values(prose.reads).reduce((a, x) => a + x, 0), 'the count walked the stored pool\'s page reads').toBeGreaterThan(0);
    if (!Object.values(prose.served).some(Boolean)) expect(cells).toEqual([]);
  }, POOL_TIMEOUT_MS);

  it('THE ARM (item 0 (c); E128 (b), (c)) and ITEM 7\'s COUNT: every string a page reader writes (the recent-conflict sentence, the standing by S, the crime lists) names only SERVED rows (the lane\'s fold, every row the read hides out) and carries no mask, over the pool, the plants, act T and the hand hides, both engines, both doors, Reveal off and DM; the strata\'s and contenders\' own strings counted', async () => {
    const faults = []; let reads = 0; let strs = 0; const strataHits = { name: 0, mask: 0, own: 0, ex: [] }; const labels = { n: 0, hits: 0 }; const bases = { n: 0, ex: [] };
    const recs = [...(await hidingRecords()).map((x) => ({ ...x })), ...Object.entries(PLANT_TOWNS).map(([k, t]) => ({ seed: `plant ${k}`, how: 'plant', t }))];
    for (const { seed, how, t } of recs) for (const dm of [false, true]) {
      const got = await readOne(t, dm);
      for (const eng of ['server', 'twin']) for (const door of ['page', 'import']) {
        const d = got[eng][door];
        if (!isRec(d)) { faults.push(`${seed} ${eng} ${door} dm=${dm}: no document`); continue; }
        reads += 1;
        const wh = withheldOf(t, d);
        // power.label's census (item 6: off the composed form): a served label naming a withheld power or carrying the mask
        for (const f of listsOf(d)) if (typeof f.powerLabel === 'string') { labels.n += 1; if (namesWithheld(f.powerLabel, wh, d) || hasMask(f.powerLabel)) labels.hits += 1; }
        // a SERVED base (the desc as served, its standing cut) naming a power the read hides, past the mask (counted, not
        // judged here: a served field, 212's; the player view only, where the reader is not the DM)
        if (!dm) for (const f of arr(d.powerStructure?.factions).filter((x) => isRec(x) && !isCut(x) && typeof x.desc === 'string')) {
          if (namesWithheld(f.desc, wh, d)) { bases.n += 1; if (bases.ex.length < 6) bases.ex.push(`${seed} (${how}) ${eng} ${door} ${nameOf(f)} (${hitOf(f.desc, wh)}): ${J(f.desc).slice(0, 140)}`); }
        }
        const p = door === 'page' ? rd.page(clone(d)) : rd.served(d);
        const written = [];
        if (typeof p?.powerStructure?.recentConflict === 'string') written.push(['recentConflict', p.powerStructure.recentConflict]);
        const base = new Map(arr(d.powerStructure?.factions).filter((f) => isRec(f) && !isCut(f)).map((f) => [nameOf(f), typeof f.desc === 'string' ? f.desc : null]));
        for (const f of arr(p?.powerStructure?.factions).filter((x) => isRec(x) && !isCut(x) && typeof x.desc === 'string')) {
          const b = base.get(nameOf(f));
          const cutB = typeof b === 'string' ? (refCut(b)?.base ?? b) : '';
          written.push([`standing ${nameOf(f)}`, f.desc.startsWith(cutB) ? f.desc.slice(cutB.length) : f.desc]);
        }
        for (const [path, s] of strings(p?.economicState?.safetyProfile?.crimeTypes, 'crimeTypes')) written.push([path, s]);
        for (const [what, s] of written) {
          strs += 1;
          if (namesWithheld(s, wh, d)) faults.push(`${seed} (${how}) ${eng} ${door} dm=${dm} ${what}: names a withheld power ${J(wh)} (${hitOf(s, wh)}): ${J(s).slice(0, 140)}`);
          if (hasMask(s)) faults.push(`${seed} (${how}) ${eng} ${door} dm=${dm} ${what}: carries the mask (forms ${J(maskForms(s))}): ${J(s).slice(0, 140)}`);
        }
        if (door === 'page') {
          let ss;
          try { ss = [...strings(strata.derive(p), 'strata'), ...strings(strata.coup(p), 'coup')]; } catch { ss = []; }
          // the strata's OWN strings: those that are no string the page document itself holds (a served row's name or desc
          // handed back whole is the description's, cured or counted there)
          const held = new Set(strings(p).map(([, x]) => x));
          for (const [path, s] of ss) {
            const nh = namesWithheld(s, wh, d); const mh = hasMask(s);
            if (nh) strataHits.name += 1;
            if (mh) strataHits.mask += 1;
            if ((nh || mh) && !held.has(s)) strataHits.own += 1;
            if ((nh || mh) && strataHits.ex.length < 6) strataHits.ex.push(`${seed} ${eng} dm=${dm} ${path} (${nh ? hitOf(s, wh) : `mask forms ${J(maskForms(s))}`}): ${J(s).slice(0, 120)}`);
          }
        }
      }
    }
    note('R5DP arm (item 0 (c)): records', recs.length, '| engine-door-reads', reads, '| strings a reader wrote', strs, '| faults', faults.length,
      '| power.label served', labels.n, '| naming a withheld power or the mask', labels.hits, '| ITEM 7 strata/contenders strings naming a withheld power', strataHits.name, '| carrying the mask', strataHits.mask, '| of them the strata\'s OWN (no string the page holds)', strataHits.own, '| served bases naming a power the read hides (player view)', bases.n, bases.ex.length ? `\n  BASE: ${bases.ex.join('\n  BASE: ')}` : '', strataHits.ex.length ? `\n  STRATA: ${strataHits.ex.join('\n  STRATA: ')}` : '', faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
    expect(reads).toBeGreaterThan(0);
    expect(strs).toBeGreaterThan(0);
    expect(labels.hits, 'power.label names no withheld power and carries no mask').toBe(0);
    expect(strataHits.own, 'item 7: the strata\'s and contenders\' own strings name no withheld power and carry no mask').toBe(0);
    expect(faults).toEqual([]);
  }, POOL_TIMEOUT_MS);
});
