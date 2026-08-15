/**
 * townMapEdgeAnnotations.test.js — SM-5 (3) EDGE ANNOTATIONS.
 *
 * Labels the map's exits with the settlement's named neighbours — honestly: names +
 * relationship (the only town-scale data), NO invented distance. A real integer-weeks
 * resolver (the realm spatial-digest seam) is the ONLY way a travel number appears.
 *
 * ⚠⚠ THIS SUITE USED TO PASS WHILE THE FEATURE RENDERED NOTHING. Every fixture below
 * once hand-built `settlement.neighbors[]` — a spelling NO WRITER IN THE ESTATE HAS
 * EVER PRODUCED (settlement.schema.js carries `neighbors` only as a commented-out
 * FUTURE alias that normalize deliberately does not synthesize). The reader read that
 * field, the fixture wrote that field, and the two agreed with each other all the way
 * to a green suite while `buildEdgeAnnotations` returned [] for every real settlement
 * and the "Roads out" section never rendered for anyone. That is the recorded
 * FIXTURE-MIRRORS-THE-DERIVER class: a fixture shaped like the reader can never see a
 * dead arm. The fixtures now build the two shapes that HAVE writers — the persisted
 * `neighbourNetwork[]` and the live singular `neighborRelationship` — so the suite
 * fails if the reader drifts off them again.
 */
import { describe, expect, it } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildEdgeAnnotations } from '../../src/components/townMap/edgeAnnotations.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const model = () => buildTownMapModel(
  makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'edge-1' }),
  { layoutLawVersion: 2 },
);
/** A settlement carrying whatever neighbour shape(s) the case under test needs. */
const withShape = (patch) => ({
  ...makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'edge-1' }),
  ...patch,
});
/** The PERSISTED array — what a saved settlement actually has. */
const withNetwork = (entries) => withShape({ neighbourNetwork: entries });

describe('edge annotations — named neighbours on the exits', () => {
  it('assigns named neighbours to exit roads in stable (name-sorted) order, honest labels', () => {
    const m = model();
    const s = withNetwork([
      { name: 'Zephyr Hold', relationshipType: 'rival' },
      { name: 'Ashford', relationshipType: 'trade_partner' },
    ]);
    const ann = buildEdgeAnnotations(m, s);
    expect(ann.length).toBe(2); // 2 neighbours, ≤ road count
    // name-sorted: Ashford before Zephyr Hold
    expect(ann.map((a) => a.neighborName)).toEqual(['Ashford', 'Zephyr Hold']);
    expect(ann[0].relationshipLabel).toBe('trade partner');
    expect(ann[1].relationshipLabel).toBe('a rival');
    // NO invented travel number without a resolver
    expect(ann[0].travelLabel).toBeNull();
    // anchored to a real road edge point, nudged inward (inside the 0..1000 box)
    for (const a of ann) {
      expect(a.x).toBeGreaterThanOrEqual(0);
      expect(a.x).toBeLessThanOrEqual(1000);
      expect(['start', 'middle', 'end']).toContain(a.align);
      expect(typeof a.roadId).toBe('string');
    }
  });

  it('caps at the number of exit roads (extra neighbours are not map exits)', () => {
    const m = model();
    const many = Array.from({ length: 8 }, (_, i) => ({ name: `Town ${String.fromCharCode(65 + i)}`, relationshipType: 'neutral' }));
    const ann = buildEdgeAnnotations(m, withNetwork(many));
    expect(ann.length).toBe(m.frame.roads.length); // capped
  });

  it('a real integer-weeks resolver (the digest seam) is the ONLY source of a travel number', () => {
    const m = model();
    const s = withNetwork([{ name: 'Ashford', relationshipType: 'allied' }]);
    const ann = buildEdgeAnnotations(m, s, { weeksFor: () => 3 });
    expect(ann[0].travelLabel).toBe('≈3 weeks away');
    // a resolver that returns null/garbage invents nothing
    expect(buildEdgeAnnotations(m, s, { weeksFor: () => null })[0].travelLabel).toBeNull();
    expect(buildEdgeAnnotations(m, s, { weeksFor: () => 1 })[0].travelLabel).toBe('≈1 week away');
  });

  it('no neighbours or no roads ⇒ [] (never throws)', () => {
    const m = model();
    expect(buildEdgeAnnotations(m, withNetwork([]))).toEqual([]);
    expect(buildEdgeAnnotations(m, {})).toEqual([]);
    expect(buildEdgeAnnotations(m, null)).toEqual([]);
    expect(buildEdgeAnnotations(null, withNetwork([{ name: 'X' }]))).toEqual([]);
    // unnamed neighbours are ignored
    expect(buildEdgeAnnotations(m, withNetwork([{ relationshipType: 'rival' }]))).toEqual([]);
  });

  // ── THE REPAIR: the reader now reads the fields that HAVE writers ──────────────

  it('POSITIVE — the LIVE SINGULAR `neighborRelationship` labels an exit on an unsaved settlement', () => {
    // The generator writes this shape; saves.js only migrates it into
    // `neighbourNetwork` at save time, so before the first save it is the ONLY
    // neighbour a settlement has. Reading it is what makes the map's exits carry
    // wayfinding labels for a settlement the user has just rolled.
    const ann = buildEdgeAnnotations(model(), withShape({
      neighborRelationship: { name: 'Ashford', tier: 'town', relationshipType: 'trade_partner' },
    }));
    expect(ann.map((a) => a.neighborName)).toEqual(['Ashford']);
    expect(ann[0].relationshipLabel).toBe('trade partner');
  });

  it('POSITIVE — `neighbourNetwork` and the live singular UNION, and the network wins a name collision', () => {
    // saves.js mints the network row FROM the live singular, so after one save the
    // same neighbour is present twice. It must be labelled ONCE, and from the
    // richer persisted row — the same precedence RelationshipsTab.jsx uses.
    const ann = buildEdgeAnnotations(model(), withShape({
      neighbourNetwork: [{ name: 'Ashford', relationshipType: 'allied' }],
      neighborRelationship: { name: 'ashford', relationshipType: 'hostile' },
    }));
    expect(ann.map((a) => a.neighborName)).toEqual(['Ashford']);
    // The NETWORK's relationship survived, not the live singular's — which also
    // proves the dedupe is case-insensitive rather than an exact-string accident.
    expect(ann[0].relationshipLabel).toBe('allied');
  });

  it('POSITIVE — a persisted row spelled `neighbourName` (the manual-link alias) still labels', () => {
    const ann = buildEdgeAnnotations(model(), withNetwork([
      { neighbourName: 'Greywatch', relationshipType: 'cold_war' },
    ]));
    expect(ann.map((a) => a.neighborName)).toEqual(['Greywatch']);
    expect(ann[0].relationshipLabel).toBe('an uneasy peace');
  });

  it('A LABEL IS A DISPLAY STRING, NEVER AN ENTITY — no identity survives onto an annotation', () => {
    // ⭐ THE RULING THIS PIN ENFORCES (owner, 2026-08-11): an exit-road label may only
    // ever say what generation GENUINELY KNOWS. The moment anything JOINS ON that
    // string — mints a settlement from it, links it, looks it up, persists it as a
    // reference — we have rebuilt the reader-with-no-writer defect at the PRODUCT
    // level, which is the exact class this program spent itself eliminating.
    //
    // The subject is chosen so the refusal MEASURES something: a persisted
    // `neighbourNetwork` row genuinely CARRIES an identity (saves.js writes
    // `{ id, name, neighbourName, neighbourTier, tier, relationshipType, … }`), so the
    // id below is real input the producer must DROP rather than a straw value that was
    // never there. The realistic regression is someone making the label clickable —
    // "link the road to the neighbour's dossier" — which propagates `id` onto the
    // annotation and is precisely the moment the label becomes an entity.
    const ann = buildEdgeAnnotations(model(), withNetwork([
      { id: 'save-7f3a', name: 'Ashford', relationshipType: 'trade_partner' },
    ]));

    // (0) LIVENESS FIRST, so a dead producer names ITSELF. Without this the key-set
    // arm below reads `ann[0]` of an empty array and the suite reports a bare
    // "TypeError: Cannot convert undefined or null to object" — a true failure with a
    // message that points at the test instead of at the producer that went dark.
    expect(ann.length, 'the producer emitted no annotation at all — fix it, not this pin').toBe(1);

    // (1) THE TOTAL POSITIVE PREDICATE. An enumeration of forbidden keys fails open —
    // it only refuses the identities someone thought to list. Exact key-set equality
    // refuses EVERY key that is not display, including ones not invented yet.
    expect(Object.keys(ann[0]).sort()).toEqual([
      'align', 'neighborName', 'relationshipLabel', 'roadId', 'travelLabel', 'x', 'y',
    ]);

    // (2) …and the NAMED-CAUSE arm beside it. Two construction details were MEASURED
    // by mutant, not reasoned — the obvious spelling of each was wrong:
    //
    //  • THE COLLECTION IS THE JOINED VALUE TEXT, NOT THE VALUE ARRAY. `toContain` over
    //    an array is exact-ELEMENT equality, so an id SMUGGLED INTO an existing field
    //    (`neighborName: name + id`) slips straight through an array form — the key set
    //    is untouched and no element equals the id. Joining first restores substring
    //    semantics, which is what "the identity must not reach the label" actually means.
    //    Mapping over ALL annotations (not `ann[0]`) also means a producer that returns
    //    [] yields '' rather than throwing, so the failure arrives as the helper's
    //    message instead of a TypeError.
    //
    //  • THE ANCHOR IS THE RELATIONSHIP LABEL, NOT THE NAME. `neighborName` fails the
    //    recorded anchor rule: the name is exactly what an id-leak CORRUPTS, so the
    //    id-embedding mutant made the anchor itself vanish and the helper reported
    //    "the whole collection drifted away" — the OPPOSITE of the truth, sending the
    //    next reader hunting a dead producer while the real defect was a live producer
    //    admitting an identity. `relationshipLabel` travels the SAME neighbour path (it
    //    is derived from `nb.relationshipType` in the same push), so it dies of every
    //    drift that would fake this green, yet is untouched by which string wins the
    //    name slot — so the EXCLUSION arm fires and names the true cause.
    const labelText = ann.map((a) => Object.values(a).map(String).join(' | ')).join(' || ');
    expectAbsentWithAnchor(
      labelText,
      'save-7f3a',
      'trade partner',
      'a road label carries the neighbour NAME as display text and never its identity',
    );
  });

  it('NEGATIVE — the dead `neighbors` spelling labels nothing, beside a live neighbour that does', () => {
    // ⚠⚠ THE ANCHOR IS THE POINT, AND IT IS A LIVE SIBLING IN THE SAME RESULT rather
    // than a bare `toEqual([])`. A negative against a rendered/derived surface has a
    // SECOND vacuity mode: `expect(annotations).toEqual([])` is equally true when the
    // dead field is correctly ignored AND when the producer broke outright (no roads,
    // a thrown model, a renamed export). Feeding a REAL neighbour alongside the dead
    // one collapses that ambiguity — the live name must come back, which proves roads,
    // frame, sort and label pipeline are all alive, and only then does the refusal of
    // the dead spelling measure anything.
    //
    // The realistic regression this guards is RESTORATION-AS-AN-EXTRA-ARM: someone
    // "restoring tolerance" appends `settlement.neighbors` as another OR-source rather
    // than replacing the live read. That flips this from one label to two and reds on
    // the exclusion arm, naming the true cause.
    const ann = buildEdgeAnnotations(model(), withShape({
      neighbourNetwork: [{ name: 'Ashford', relationshipType: 'allied' }],
      neighbors: [{ name: 'Ghostmere', relationshipType: 'rival' }],
    }));
    const names = ann.map((a) => a.neighborName);
    expectAbsentWithAnchor(
      names,
      'Ghostmere',
      'Ashford',
      'buildEdgeAnnotations ignores the writer-less `neighbors` spelling',
    );
    // …and the count is asserted POSITIVELY beside it, so the restored-arm regression
    // reds twice and both halves of the failure are named.
    expect(names).toEqual(['Ashford']);
  });
});
