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
