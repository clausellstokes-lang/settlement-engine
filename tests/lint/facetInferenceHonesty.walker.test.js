/**
 * facetInferenceHonesty.walker.test.js — THE ANCHOR-DISCIPLINE walker for the ONE facet
 * chokepoint (CH-1 · MF-CH1, ODQ §503.3; structural-prevention Pattern 1 + Pattern 3).
 *
 * THE CLASS: `FACET_INFERENCE` (src/domain/spatial/cohesionWeave.js) guesses an entity's
 * coherence facet from its NAME when no facet is declared. Every alternative used to be a
 * bare substring, so a name asserted natures it never claimed — "Priest (resi**den**t)",
 * "War**den**'s Lodge" and "Dragon resi**den**t" all read `vice`, and a village parish
 * priest drew the TAVERN interior. CH-1 anchors every alternative; this walker is what
 * stops the next author from adding an unanchored one, and what holds the anchoring's own
 * trap — a UNIFORM leading `\b` strips `craft` from four rows and `arms` from two.
 *
 * ⚠⚠ THE MEASUREMENT LAW THIS FILE EXISTS UNDER (ODQ §503.2, proved by live counter).
 * `facetOf` is called ZERO times inside the generation pipeline, so a whole-record corpus
 * digest is STRUCTURALLY BLIND to every `FACET_INFERENCE` change: breaking the `faith`
 * pattern to `/./i` moves 15,101 interior cells across all 504 corpus settlements while the
 * digest stays byte-identical. A digest that cannot move proves nothing here. THEREFORE
 * every arm below pins either the CATALOG VERDICT or the DERIVED INTERIOR — never a record
 * hash — and each arm names the mutant that convicts it.
 *
 * ⚠ SIGNPOSTED SUCCESSOR RE-RECORD (so it is found before it is discovered by reddening):
 * CH-3a is chartered to add `facets: { institutionNature: 'faith' }` to the catalog row
 * `Priest (resident)`. That declaration wins at the chokepoint, so A1's LIVE derived
 * interior for that ONE row moves `generic` → `faith`. Re-record that cell in CH-3a's own
 * member with the declaration as its cause; nothing else in this file moves with it — the
 * inference-only half of A1 and the whole of A3 read a declaration-stripped entity and are
 * deliberately immune to it.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { facetOf } from '../../src/domain/spatial/cohesionWeave.js';
import { INTERIOR_KINDS, interiorKindOf, interiorFunctionOf, resolveRoomSet, tierIndexOf } from '../../src/domain/interior/interiorTemplates.js';
import { TIER_ORDER } from '../../src/data/constants.js';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const WEAVE_PATH = 'src/domain/spatial/cohesionWeave.js';
const WEAVE_SRC = fs.readFileSync(path.join(REPO, WEAVE_PATH), 'utf8');
const FACET_KINDS = Object.freeze(['institutionNature', 'institutionFunction', 'institutionSubstructure']);

/** Every catalog row in the production shape the generator spreads onto a settlement —
 *  `{ category, name, ...entry }`, the same shape tests/domain/undercityStrataExistence.js
 *  builds. One entry per (tier, category, name) triple, which is the 316-row denominator. */
const CATALOG_ROWS = Object.freeze(Object.entries(institutionalCatalog).flatMap(([tier, groups]) =>
  Object.entries(groups).flatMap(([category, rows]) =>
    Object.entries(rows).map(([name, entry]) => Object.freeze({
      tier, category, name, at: `${tier}/${category}/${name}`,
      inst: Object.freeze({ category, name, ...entry, source: 'generated', catalogId: catalogIdForName(name) }),
    })))));

/** The same row with every DECLARATION removed, so the read is pure keyword inference.
 *  This is what makes A3 survive CH-3a's `facets` key instead of being foreclosed by it. */
function inferenceOnly(inst) {
  const tags = Array.isArray(inst.tags) ? inst.tags.filter((t) => !(typeof t === 'string' && t.startsWith('facet:'))) : inst.tags;
  return { ...inst, facets: undefined, tags };
}

/**
 * ⛔ FROZEN 2026-08-23: `FACET_INFERENCE` EXACTLY AS IT STOOD AT 00e7af612, the commit
 * before CH-1. It is a historical constant and is never edited to match a later table —
 * editing it would erase the only reference A3 has. A later deliberate change to the live
 * table adds its moved rows to DECLARED_INFERENCE_DELTA with a reason; it never touches
 * this object.
 */
const PRE_CH1_INFERENCE = Object.freeze({
  institutionNature: [
    { value: 'faith', rx: /temple|shrine|church|monaster|chapel|cathedral|abbey|cloister|cult/i },
    { value: 'security', rx: /barrack|garrison|watch|guard|militia|fort|citadel/i },
    { value: 'trade', rx: /market|guild|exchange|bank|counting|merchant|bazaar/i },
    { value: 'craft', rx: /forge|smith|workshop|foundry|mill|tannery|atelier/i },
    { value: 'learning', rx: /librar|academy|college|school|scriptorium|university/i },
    { value: 'vice', rx: /tavern|brothel|den|gambling|smuggl/i },
    { value: 'civic', rx: /\bhall\b|court|assembly|council|magistrat/i },
  ],
  institutionFunction: [
    { value: 'heals', rx: /almshouse|hospice|infirmary|hospital|healer|apothecar/i },
    { value: 'feeds', rx: /granary|storehouse|kitchen|almon/i },
    { value: 'arms', rx: /armor|arsenal|barrack|foundry|smith/i },
    { value: 'judges', rx: /court|tribunal|magistrat|assize/i },
  ],
  institutionSubstructure: [
    { value: 'none', rx: /^access to /i },
    { value: 'sewer', rx: /sewage|sewer|drain/i },
    { value: 'mine', rx: /\bmine\b|quarry/i },
    { value: 'crypt', rx: /church|cathedral|monaster|friary|abbey|graveyard|cemetery|ossuary|crypt|temple/i },
    { value: 'cellar', rx: /warehouse|cellar|granar|storehouse|undercroft|vintner|brewer/i },
  ],
});

/**
 * ⛔ THE DECLARED DELTA — every catalog cell whose inference verdict CH-1 moved, with its
 * cause. EXACT EQUALITY: a cell that moves and is not here reds, and a row listed here that
 * stops moving reds too. To land a further deliberate change to `FACET_INFERENCE`, APPEND
 * the cells it moves with their reason. Never delete a row to make this green.
 */
const DECLARED_INFERENCE_DELTA = Object.freeze({
  'village/Religious/Priest (resident)::institutionNature': {
    before: 'vice', after: null,
    why: 'the bare /den/ matched "resi(den)t" — a parish priest drew the tavern interior',
  },
  "town/Magic/Warden's Lodge::institutionNature": {
    before: 'vice', after: null,
    why: 'the bare /den/ matched "War(den)\'s"',
  },
  'town/Adventuring/Charlatan fortune tellers::institutionNature': {
    before: 'security', after: null,
    why: 'the bare /fort/ matched "fortune" — a booth read as a barracks; "fortune" opens a '
      + 'word, so only the \\bforts?\\b|\\bfortif|\\bfortress stem set separates the two',
  },
  'city/Exotic/Dragon resident::institutionNature': {
    before: 'vice', after: null,
    why: 'the bare /den/ matched "resi(den)t"',
  },
});

/** first-match-wins, the exact semantics of cohesionWeave.inferFacet. */
function inferWith(table, inst, kind) {
  const rowsForKind = table[kind];
  if (!rowsForKind) return null;
  const text = `${String(inst?.name ?? '')} ${String(inst?.type ?? '')} ${String(inst?.category ?? '')}`;
  if (!text.trim()) return null;
  for (const row of rowsForKind) if (row.rx.test(text)) return row.value;
  return null;
}

/** The LIVE table, parsed out of the production source — so the arms below read the shipped
 *  bytes rather than a copy that could drift away from them. */
function liveTableFromSource() {
  const open = WEAVE_SRC.indexOf('const FACET_INFERENCE = Object.freeze({');
  expect(open, `${WEAVE_PATH} no longer declares FACET_INFERENCE the way this walker parses it`).toBeGreaterThan(-1);
  const close = WEAVE_SRC.indexOf('\n});', open);
  expect(close, 'FACET_INFERENCE has no closing `});` — re-point this parser').toBeGreaterThan(open);
  const block = WEAVE_SRC.slice(open, close);
  /** @type {Record<string, Array<{ value: string, rx: RegExp, raw: string, kind: string }>>} */
  const table = {};
  for (const kindMatch of block.matchAll(/^ {2}(institution[A-Za-z]+): \[$/gm)) {
    const kind = kindMatch[1];
    const from = kindMatch.index + kindMatch[0].length;
    const to = block.indexOf('\n  ],', from);
    expect(to, `the ${kind} array is not closed the way this walker parses it`).toBeGreaterThan(from);
    table[kind] = [...block.slice(from, to).matchAll(/\{ value: '([a-z]+)', rx: \/(.+?)\/i \}/g)]
      .map(([, value, raw]) => ({ value, raw, kind, rx: new RegExp(raw, 'i') }));
  }
  return table;
}
const LIVE_TABLE = liveTableFromSource();

describe('§I FACET INFERENCE HONESTY — the anchoring walker (CH-1, ODQ §503.3)', () => {
  it('A0 · the parse is faithful: the table read out of the shipped source reproduces facetOf on every one of the 948 catalog cells', () => {
    // NON-VACUITY FOR EVERYTHING BELOW. A3 compares a hand-frozen historical table against
    // a re-implementation of inferFacet; if either the parser or that re-implementation
    // were wrong, A3 would be measuring this file's own bug. This arm rules that out by
    // executing the parsed live table against the real chokepoint, cell by cell.
    // MUTANT: drop one alternative from the parser's regex → the reproduction breaks.
    expect(CATALOG_ROWS.length, 'the catalog row count moved — re-measure, do not re-word').toBe(316);
    const disagreements = [];
    for (const row of CATALOG_ROWS) {
      const bare = inferenceOnly(row.inst);
      for (const kind of FACET_KINDS) {
        const parsed = inferWith(LIVE_TABLE, bare, kind);
        const real = facetOf(bare, kind);
        if (parsed !== real) disagreements.push(`${row.at}::${kind} parsed=${parsed} chokepoint=${real}`);
      }
    }
    expect(disagreements).toEqual([]);
    expect(CATALOG_ROWS.length * FACET_KINDS.length).toBe(948);
  });

  it('A1 · the four mis-inferring rows stop asserting a nature, and the DERIVED INTERIOR each one draws moves to `generic`', () => {
    // THE ARM THE CAR EXISTS FOR, pinned where the engine can actually observe it (§503.2).
    // MUTANT: restore /den/ in the vice row → the first, second and fourth rows read `vice`
    // again and draw the tavern; restore /fort/ in the security row → the third reads
    // `security` again and draws the barracks. Both were executed at the build.
    const cured = [
      ['village/Religious/Priest (resident)', 'vice'],
      ["town/Magic/Warden's Lodge", 'vice'],
      ['town/Adventuring/Charlatan fortune tellers', 'security'],
      ['city/Exotic/Dragon resident', 'vice'],
    ];
    const observed = cured.map(([at]) => {
      const row = CATALOG_ROWS.find((r) => r.at === at);
      expect(row, `the catalog no longer holds ${at} — CH-1's defect roster needs re-deriving`).toBeTruthy();
      return [at, {
        inferredNature: facetOf(inferenceOnly(row.inst), 'institutionNature'),
        // the LIVE read, declarations honoured — this is what interiorDraw actually gets.
        // ⚠ CH-3a moves the first row's value to 'faith' by declaration; see the header.
        liveInteriorKind: interiorKindOf(row.inst),
      }];
    });
    expect(Object.fromEntries(observed)).toEqual({
      'village/Religious/Priest (resident)': { inferredNature: null, liveInteriorKind: 'generic' },
      "town/Magic/Warden's Lodge": { inferredNature: null, liveInteriorKind: 'generic' },
      'town/Adventuring/Charlatan fortune tellers': { inferredNature: null, liveInteriorKind: 'generic' },
      'city/Exotic/Dragon resident': { inferredNature: null, liveInteriorKind: 'generic' },
    });
    // and the BEFORE half, so the arm records a move rather than a state: each of the four
    // DID read the wrong nature under the pre-CH-1 table.
    expect(Object.fromEntries(cured.map(([at, was]) => {
      const row = CATALOG_ROWS.find((r) => r.at === at);
      return [at, inferWith(PRE_CH1_INFERENCE, inferenceOnly(row.inst), 'institutionNature')];
    }))).toEqual(Object.fromEntries(cured));
  });

  it('A2 · the anchoring\'s own trap: both Blacksmith rows keep `craft` AND `institutionFunction: arms`, and the wider non-regression roster is unmoved', () => {
    // ⚠ THE GAP THE CH SKEPTIC PANEL FOUND (§503.3): a uniform leading `\b` costs SIX cells
    // over FOUR rows, not four — `Blacksmith` and `Blacksmiths (3-10)` lose `arms` as well as
    // `craft`, because /smith/ appears in BOTH the craft nature row and the arms function row.
    // The charter's own acceptance pinned only `craft`. This arm pins both halves.
    // MUTANT (executed at the build): rewrite `smiths?\b` to `\bsmith` in both rows →
    // CHANGED_CELLS goes 4 → 10 and the two Blacksmith rows fall to generic with no `arms`.
    const roster = {
      'village/Crafts/Blacksmith': { nature: 'craft', fn: 'arms' },
      'town/Crafts/Blacksmiths (3-10)': { nature: 'craft', fn: 'arms' },
      'hamlet/Crafts/Resident smith (part-time)': { nature: 'craft', fn: 'arms' },
      'village/Crafts/Sawmill': { nature: 'craft', fn: null },
      'town/Crafts/Sawmill (commercial)': { nature: 'craft', fn: null },
      'village/Crafts/Mill': { nature: 'craft', fn: null },
      'town/Crafts/Mills (2-5)': { nature: 'craft', fn: null },
      'town/Entertainment/Gambling den': { nature: 'vice', fn: null },
      'town/Defense/Town watch': { nature: 'security', fn: null },
      'metropolis/Defense/Massive walls and fortifications': { nature: 'security', fn: null },
      'city/Economy/Banking houses': { nature: 'trade', fn: null },
      'town/Defense/Barracks': { nature: 'security', fn: 'arms' },
      'town/Infrastructure/Courthouse': { nature: 'civic', fn: 'judges' },
    };
    const observed = Object.fromEntries(Object.keys(roster).map((at) => {
      const row = CATALOG_ROWS.find((r) => r.at === at);
      expect(row, `the non-regression roster names ${at}, which the catalog no longer holds`).toBeTruthy();
      const bare = inferenceOnly(row.inst);
      return [at, { nature: facetOf(bare, 'institutionNature'), fn: facetOf(bare, 'institutionFunction') }];
    }));
    expect(observed).toEqual(roster);
  });

  it('A3 · the whole-catalog differential against the pre-CH-1 table is EXACTLY the declared delta — four cells of 948, and nothing else moved', () => {
    // MUTANT: any extra anchor change anywhere in the table adds a key here and reds.
    const moved = {};
    for (const row of CATALOG_ROWS) {
      const bare = inferenceOnly(row.inst);
      for (const kind of FACET_KINDS) {
        const before = inferWith(PRE_CH1_INFERENCE, bare, kind);
        const after = facetOf(bare, kind);
        if (before !== after) moved[`${row.at}::${kind}`] = { before, after };
      }
    }
    expect(
      Object.fromEntries(Object.entries(moved).map(([k, v]) => [k, { before: v.before, after: v.after }])),
      'a catalog row\'s inference verdict moved against the frozen pre-CH-1 table.\n'
      + 'If the move is intended, APPEND the cell to DECLARED_INFERENCE_DELTA with its reason.\n'
      + 'Never edit PRE_CH1_INFERENCE and never delete a row here to go green — that erases\n'
      + 'the only record of what the anchoring actually cost.',
    ).toEqual(Object.fromEntries(Object.entries(DECLARED_INFERENCE_DELTA)
      .map(([k, v]) => [k, { before: v.before, after: v.after }])));
    expect(Object.keys(moved).length).toBe(4);
  });

  it('A4 · the undercity SEED GATE is still: `institutionSubstructure` moves zero of the 316 rows', () => {
    // The existence gate (ODQ §311.1) reads this kind through the same chokepoint, so the
    // anchoring had to be proved inert here rather than assumed.
    // MUTANT, EXECUTED AND CORRECTED AT THE BUILD: dropping the `^` from `^access to ` does
    // NOT convict this arm — the phrase only ever occurs at the start of a name, so the
    // verdicts do not move (A5 catches that edit instead, as an anchor-discipline breach).
    // What convicts a ZERO-MOVE claim is a substructure edit that actually moves a row:
    // appending `|\bgranar` to the `sewer` pattern flips the three granary rows cellar →
    // sewer and this arm names all three. That was run; it reds here and nowhere else.
    const moved = CATALOG_ROWS
      .filter((row) => inferWith(PRE_CH1_INFERENCE, inferenceOnly(row.inst), 'institutionSubstructure')
        !== facetOf(inferenceOnly(row.inst), 'institutionSubstructure'))
      .map((row) => row.at);
    expect(moved).toEqual([]);
    // non-vacuity: the kind really does resolve on this catalog.
    const resolving = CATALOG_ROWS.filter((row) => facetOf(inferenceOnly(row.inst), 'institutionSubstructure') != null);
    expect(resolving.length, 'no catalog row resolves a substructure at all — the zero-move claim above would be empty').toBeGreaterThan(20);
  });

  it('A5 · ANCHOR DISCIPLINE: every alternative in every FACET_INFERENCE pattern carries a `\\b` or a `^`', () => {
    // THE ARM THAT REMOVES THE CLASS'S HABITAT (structural-prevention Pattern 3). A bare
    // substring is how "resi(den)t" became a tavern; a future author cannot add one here
    // without this reddening.
    // MUTANT: append `|lodge` (no anchor) to any row → this arm names it.
    const bare = [];
    let alternatives = 0;
    for (const [kind, rowsForKind] of Object.entries(LIVE_TABLE)) {
      for (const row of rowsForKind) {
        // GUARD THE GUARD: the split below is only sound while no pattern uses a group or a
        // character class, either of which could hide a `|`. If one ever does, this reds
        // rather than silently mis-splitting.
        expect(/[([]/.test(row.raw), `${kind}/${row.value}: the pattern now uses a group or class — `
          + 'the alternative split in this arm is no longer sound; teach it the new shape').toBe(false);
        for (const alt of row.raw.split('|')) {
          alternatives++;
          if (!alt.includes('\\b') && !alt.startsWith('^')) bare.push(`${kind}/${row.value}: "${alt}"`);
        }
      }
    }
    expect(
      bare,
      'these FACET_INFERENCE alternatives are bare substrings. A bare substring makes a NAME\n'
      + 'assert a facet it never claimed ("resi(den)t" → vice). Anchor it: a leading \\b by\n'
      + 'default; a TRAILING boundary (smiths?\\b) where English closes the stem into compounds\n'
      + 'the table means to catch; both boundaries where a leading one still admits a longer\n'
      + 'word; or an explicit stem set. Then re-run A3 and declare whatever cells moved.',
    ).toEqual([]);
    expect(alternatives, 'the alternative scan found nothing — the parser broke').toBeGreaterThan(40);
  });

  it('A6 · no catalog row matches two rules within one facet kind — the ordering no longer carries a verdict by accident', () => {
    // MEASURED, so the zero is earned rather than asserted: at 00e7af612 there was exactly
    // ONE collision — `Resident smith (part-time)` matched craft (/smith/) AND vice (/den/,
    // via "Resi(den)t") and was right only because `craft` is listed first.
    // MUTANT: restore /den/ → that one collision returns and this arm names it.
    const collide = (table) => {
      const out = [];
      for (const row of CATALOG_ROWS) {
        const bare = inferenceOnly(row.inst);
        const text = `${bare.name} ${''} ${bare.category}`;
        for (const [kind, rowsForKind] of Object.entries(table)) {
          const hits = rowsForKind.filter((r) => r.rx.test(text)).map((r) => r.value);
          if (hits.length > 1) out.push(`${row.at}::${kind} → ${hits.join(' + ')}`);
        }
      }
      return out;
    };
    // ⚠ ONE DELIBERATE ORDERING OVERRIDE SURVIVES, and it is declared rather than scoped
    // away: `institutionSubstructure` opens with `^access to `, which exists precisely to beat
    // the later `crypt` / `cellar` rules for the 'Access to …' rows (the church is ELSEWHERE,
    // so the settlement holds no crypt). It is the ONE place where position carries a verdict
    // on purpose, and it predates CH-1.
    expect(collide(LIVE_TABLE)).toEqual([
      'thorp/Religious/Access to parish church::institutionSubstructure → none + crypt',
      'hamlet/Religious/Access to parish church::institutionSubstructure → none + crypt',
    ]);
    // the same scan under the PRE-CH-1 table finds the accidental collision CH-1 removed,
    // which is what proves this arm is a measurement and not an empty loop.
    expect(collide(PRE_CH1_INFERENCE)).toEqual([
      'thorp/Religious/Access to parish church::institutionSubstructure → none + crypt',
      'hamlet/Crafts/Resident smith (part-time)::institutionNature → craft + vice',
      'hamlet/Religious/Access to parish church::institutionSubstructure → none + crypt',
    ]);
  });

  it('A7 · every DECLARED catalog facet names a real value, and the scan proves itself live on the five rows that carry one', () => {
    // Today no catalog row declares a kind that FACET_INFERENCE also infers, so the value
    // check would be empty on its own — stated rather than hidden. The scan is held live by
    // the rows that DO carry a `facets` map and by a synthetic negative.
    // ── COUNT MOVED 3 → 5 BY CH-3 §3.6 (R-INST-6-1), which is this arm working as designed.
    // MF-CH1 wrote this arm "ready for CH-3a's first declaration"; CH-3 made it, declaring
    // `subterranean` on the metropolis `Underground city` and `Black market bazaar` rows,
    // which are explicitly subterranean in their own prose and seeded the undercity sheet
    // zero times before. So the five are the three `Underground network` rows (clandestine +
    // subterranean) plus those two (subterranean only — the one-key form is deliberate;
    // `clandestine` drives live D6 couplings and is a separately priced question).
    // Neither new declaration names a kind FACET_INFERENCE infers, so the value check below
    // is still exercised only by the synthetic negative, exactly as before.
    const declared = CATALOG_ROWS
      .filter((row) => row.inst.facets && typeof row.inst.facets === 'object')
      .map((row) => ({ at: row.at, facets: row.inst.facets }));
    expect(declared.length, 'the declared-facet scan found nothing — it is no longer live').toBe(5);
    const VALUES_BY_KIND = Object.fromEntries(Object.entries(LIVE_TABLE)
      .map(([kind, rowsForKind]) => [kind, rowsForKind.map((r) => r.value)]));
    const check = (facets, at) => Object.entries(facets)
      .filter(([kind]) => kind in VALUES_BY_KIND)
      .filter(([kind, value]) => !VALUES_BY_KIND[kind].includes(value)
        || (kind === 'institutionNature' && !INTERIOR_KINDS.includes(value)))
      .map(([kind, value]) => `${at}: ${kind} declares "${value}", which is not a value of that kind`);
    expect(declared.flatMap(({ at, facets }) => check(facets, at))).toEqual([]);
    // the synthetic negative — without it the predicate above could be inert.
    expect(check({ institutionNature: 'bogus' }, 'synthetic')).toEqual([
      'synthetic: institutionNature declares "bogus", which is not a value of that kind',
    ]);
    expect(check({ institutionNature: 'faith' }, 'synthetic')).toEqual([]);
  });

  it('A8 · what the reader actually sees: a village parish priest no longer draws a tavern\'s common room, kitchen and cellar', () => {
    // The legibility payoff of the whole car, pinned as rooms rather than as a facet token.
    // MUTANT: restore /den/ → the room set returns to the vice set below.
    const row = CATALOG_ROWS.find((r) => r.at === 'village/Religious/Priest (resident)');
    const villageIndex = tierIndexOf({ tier: 'village' });
    expect(villageIndex).toBe(TIER_ORDER.indexOf('village'));
    const roomsFor = (kind) => resolveRoomSet(kind, interiorFunctionOf(row.inst), villageIndex).map((r) => r.kind);
    const before = inferWith(PRE_CH1_INFERENCE, inferenceOnly(row.inst), 'institutionNature');
    expect(before).toBe('vice');
    expect(roomsFor(before)).toEqual(['common', 'kitchen', 'cellar']);
    expect(roomsFor(interiorKindOf(row.inst))).toEqual(['main', 'back']);
  });
});
