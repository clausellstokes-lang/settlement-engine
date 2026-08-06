/**
 * spAxisVocabulary.walker.test.js — SP-B. THE AXIS VOCABULARY CONTRACT (SP seam contract 6).
 *
 * TWO CLASSES, ONE FILE, because they are two halves of one claim: that SP-B's axis
 * vocabulary is spelled in exactly one place and says exactly one thing.
 *
 * ── HALF ONE: THE BORROWED LADDERS CANNOT DRIFT ────────────────────────────────
 *
 * Three of SP-B's five ladders are BORROWS, and two of the three are borrowed BY SPELLING
 * rather than by import — `ENVOY_STORES_BANDS` lives in the GRAMMAR port and
 * `ROUTE_FLOW_BANDS` in the TRADE port, and importing either from an INFO leaf would mint
 * an unlicensed cross-layer pair, which is a chair declaration rather than an
 * implementer's move. So the leaf mirrors them, exactly as `beliefAxes.AXIS_TUNING`
 * already mirrors `BELIEF_TUNING.CAT_ADOPT_ACCURACY` one file over.
 *
 * A MIRROR THAT DRIFTS IS THE WORST KIND OF BUG: both halves stay internally consistent,
 * every runtime test keeps passing, and the WR-10 appraisal simply stops recognising a
 * word SP-B hands it. TEST FILES HAVE NO LAYER, so this walker can do what the leaf
 * cannot — import BOTH sides and assert them verbatim equal in both directions. The
 * devotion ladder is proven harder still: `pietyBandLabel` is EXECUTED across its own
 * rungs, so this compares against the function's real behaviour rather than against a
 * transcription of its source.
 *
 * ── HALF TWO: THE FIELD NAMES ARE A CLOSED SET WITH A NAMED DOOR ───────────────
 *
 * Every consumer volume (TRADE's believed markets, POPULATIONS' destination reads, the
 * espionage products' `legRefs`) joins against SP-B's exact field spellings. The
 * writer/reader spelling-drift class is what happens when a fourth surface invents
 * `conditionBands` or `scarcityBand`. The scan below is total over src/ and every lawful
 * speller carries a written reason, so the map can never grow a silent member.
 *
 * BOTH HALVES CARRY A POSITIVE CONTROL, and the mint scan carries an executed mutant. A
 * comparison that stopped matching would report clean and prove nothing.
 *
 * @enforced-by itself (imports + a source scan; no runtime coupling)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  SCARCITY_BANDS,
  STORES_BANDS,
  ROUTE_POSITION_BANDS,
  PULL_BANDS,
  DEVOTION_BANDS,
  CONDITIONS_KEYS,
  SUBJECT_AXIS_FIELDS,
  conditionsGroundTruth,
} from '../../src/domain/worldPulse/beliefAxisSubjects.js';
import { ENVOY_STORES_BANDS } from '../../src/domain/worldPulse/envoyErrandVocabulary.js';
import { ROUTE_FLOW_BANDS } from '../../src/domain/worldPulse/routeNetworkFlows.js';
import { pietyBandLabel } from '../../src/components/settlement/faithPanelModel.js';
import { TIER_ORDER } from '../../src/data/constants.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The one module allowed to DECLARE the SP-B ladders. */
const VOCABULARY_HOME = 'src/domain/worldPulse/beliefAxisSubjects.js';

/**
 * THE LAWFUL SPELLERS of an SP-B axis FIELD name, each with the reason it may. Stated,
 * never omitted: the scan reds on any other module, so this map is the only door and a
 * new consumer volume adds itself here in the commit that starts reading the field.
 */
const ARGUED_FIELD_SPELLERS = Object.freeze({
  'src/domain/worldPulse/beliefAxisSubjects.js':
    'the vocabulary home — it declares the fields and derives their values',
  'src/domain/worldPulse/beliefMap.js':
    'the BeliefRecord typedef: the fields live on its rows, so its type surface must name them',
  'src/domain/certification/subsystemRowsVirtual.js':
    'the three certification rows: a row that cannot name the field it gates says nothing falsifiable',
  'src/domain/worldPulse/sovereigntyMarketStage.js':
    'SP-B2, the first CONSUMER: beliefLegsOf reads conditionsBands off a belief record and'
    + ' renames its route rung onto the appraisal key, so it must spell the field it reads',
  'src/domain/worldPulse/pactFormation.js':
    'FP GR-2, the SECOND consumer, and the first to read all three families at once: a'
    + ' peacetime pact is raised by what a court BELIEVES about its neighbour, so'
    + ' believedBandsOf reads scarcityBands, conditionsBands and devotionBand straight off'
    + ' the belief record and hands the WORDS to the pure trigger leaf. It spells the three'
    + ' fields and nothing else — it declares no ladder and renames no rung, which is why it'
    + ' appears here and not in the ladder census above',
  'src/domain/worldPulse/envoyErrandVocabulary.js':
    'FP ES-1, and it is the only speller here that WRITES none of them. ⟨F5⟩ closes the'
    + ' covert mission\'s ACQUIRE target list — the appraisal legs a spy may be sent to fill'
    + ' — as a closed six-member set, and three of the six ARE these field names, because'
    + ' the whole point of the product is that it lands on SP-B\'s own slots rather than on'
    + ' a parallel espionage surface. It is a POINTER, spelled exactly: the mint refuses a'
    + ' legRef outside the six, and it refuses `pullBand` specifically because SP-B\'s own'
    + ' populations road feeds that one and no espionage product can. Renaming a field here'
    + ' would not invent a fourth surface, it would break the join this list exists to make,'
    + ' which is why the spelling is argued rather than indirected',
  'src/domain/worldPulse/espionage/espionageProducts.js':
    'FP ES-3, and the FIRST module in the estate that WRITES conditionsBands from outside'
    + ' the SP-B family. The three typed products compose the ground-truth argument'
    + ' reconcileBelief re-anchors toward, and an ACQUIRE that fills a granary leg has to'
    + ' put the observed rung on the field SP-B owns — that is the whole seam, and the'
    + ' alternative is a parallel espionage surface, which is exactly what this list exists'
    + ' to prevent. It spells the FIELD and never a RUNG: the band words themselves come'
    + ' from conditionsGroundTruth, so a re-spelled ladder still reds in the census above',
  'src/domain/worldPulse/espionage/espionageProductStage.js':
    'FP ES-3, the stage that feeds the products. It reaches conditionsGroundTruth for the'
    + ' TARGET read — what a covert agent standing in a market can see of a town\'s size,'
    + ' granary and roads — and hands the resulting record onward under SP-B\'s own field'
    + ' name. Like the leaf above it declares no ladder and renames no rung; the spelling'
    + ' is the join, and indirecting it would hide the coupling this list makes visible',
});

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }))
  .sort((a, b) => a.rel.localeCompare(b.rel));

/**
 * Files spelling any of `words` as a quoted string literal.
 * @param {readonly string[]} words @returns {string[]}
 */
function filesSpelling(words) {
  const res = words.map((w) => new RegExp(`['"\`]${w}['"\`]`));
  return SRC_FILES.filter(({ src }) => res.some((re) => re.test(src))).map(({ rel }) => rel);
}

/**
 * Files naming any of `words` as a bare identifier or property (the field-name scan —
 * these are object KEYS, not string literals, so the literal scan above cannot see them).
 * @param {readonly string[]} words @returns {string[]}
 */
function filesNaming(words) {
  const res = words.map((w) => new RegExp(`\\b${w}\\b`));
  return SRC_FILES.filter(({ src }) => res.some((re) => re.test(src))).map(({ rel }) => rel);
}

describe('SP-B axis vocabulary — the borrowed ladders are verbatim mirrors', () => {
  test('guard the guard: every imported ladder is live and non-empty', () => {
    // Each absence or equality claim below is worthless if one side silently emptied.
    for (const [name, ladder] of Object.entries({
      SCARCITY_BANDS, STORES_BANDS, ROUTE_POSITION_BANDS, PULL_BANDS, DEVOTION_BANDS,
      ENVOY_STORES_BANDS, ROUTE_FLOW_BANDS, TIER_ORDER,
    })) {
      expect(ladder.length, `${name} emptied`).toBeGreaterThanOrEqual(4);
    }
    expect(SRC_FILES.length).toBeGreaterThan(500);
  });

  test('storesBand IS ENVOY_STORES_BANDS, verbatim and in order', () => {
    // Both directions in one equality: a rung added on either side, removed on either
    // side, or re-spelled on either side reds here.
    expect([...STORES_BANDS]).toEqual([...ENVOY_STORES_BANDS]);
  });

  test('routePositionBand IS ROUTE_FLOW_BANDS, verbatim and in order', () => {
    expect([...ROUTE_POSITION_BANDS]).toEqual([...ROUTE_FLOW_BANDS]);
  });

  test('devotionBand IS the piety ladder, proven by EXECUTING it', () => {
    // Not a source comparison: the display function is RUN across the whole 0..1 range
    // and the set of words it actually returns is compared to the borrowed ladder. A
    // transcription pin would survive a change to the thresholds; this does not survive
    // a change to the WORDS, which is the thing being borrowed.
    const produced = new Set();
    for (let i = 0; i <= 100; i += 1) produced.add(pietyBandLabel(i / 100));
    expect([...produced].sort()).toEqual([...DEVOTION_BANDS].sort());
    // …and the ORDER is ours to assert, since a Set carries none: ascending devotion.
    expect(pietyBandLabel(0)).toBe(DEVOTION_BANDS[0]);
    expect(pietyBandLabel(1)).toBe(DEVOTION_BANDS[DEVOTION_BANDS.length - 1]);
  });

  test('tierBand is TIER_ORDER itself — no second spelling exists', () => {
    // The one ladder that IS imported rather than mirrored, so the claim is that the
    // derivation cannot emit a word outside it.
    for (const tier of TIER_ORDER) {
      const bands = conditionsGroundTruth({ tier, economicState: {} });
      expect(bands, `tier ${tier} produced no conditions at all`).toBeTruthy();
      expect(bands.tierBand).toBe(tier);
    }
    // NEGATIVE CONTROL: a tier the ladder does not carry yields NO KEY rather than
    // passing an unknown word through to a consumer's ladder lookup.
    expect(conditionsGroundTruth({ tier: 'megalopolis', economicState: {} })).toBeNull();
  });

  test('MUTANT: a drifted mirror is caught in both directions', () => {
    // The predicates under test, run against mutated measurements — the fix for a red
    // must be to re-spell the mirror, so the comparison has to actually fail.
    // anchored: the two equalities above assert these lists EQUAL, so both inequalities
    // here measure the planted drift rather than a comparison that never held.
    expect([...STORES_BANDS, 'brimming']).not.toEqual([...ENVOY_STORES_BANDS]);
    expect([...ROUTE_POSITION_BANDS].map((r) => (r === 'stirring' ? 'stirred' : r)))
      .not.toEqual([...ROUTE_FLOW_BANDS]);
    expect([...DEVOTION_BANDS].slice(0, 4)).not.toEqual([...DEVOTION_BANDS]);
  });
});

describe('SP-B axis vocabulary — the mints are singular, the fields are closed', () => {
  test('the two MINTED ladders are spoken by the vocabulary home and nothing else', () => {
    // Both were chosen so their rungs appear as quoted literals ZERO times anywhere under
    // src/ (the bandFamilies.js discipline): a ladder whose words no other ladder speaks
    // cannot be read by mistake.
    expect(filesSpelling(SCARCITY_BANDS)).toEqual([VOCABULARY_HOME]);
    expect(filesSpelling(PULL_BANDS)).toEqual([VOCABULARY_HOME]);
  });

  test('MUTANT: a stray rung in a second module WOULD be caught', () => {
    // The literal scanner, run against a planted source rather than a planted file.
    const planted = `${readFileSync(join(ROOT, VOCABULARY_HOME), 'utf8')}\nconst STRAY = ['${PULL_BANDS[0]}'];\n`;
    expect(new RegExp(`['"\`]${PULL_BANDS[0]}['"\`]`).test(planted)).toBe(true);
    // anchored: the scan above returns exactly one file, so this pair proves the detector
    // bites rather than proving an empty set is empty.
    expect(filesSpelling([PULL_BANDS[0]])).toEqual([VOCABULARY_HOME]);
  });

  test('the three axis FIELD names are spelled only by argued spellers', () => {
    const offenders = filesNaming(SUBJECT_AXIS_FIELDS)
      .filter((rel) => !Object.prototype.hasOwnProperty.call(ARGUED_FIELD_SPELLERS, rel));
    expect(
      offenders,
      'a module names an SP-B axis field without a written reason. The consumer volumes'
      + ' join against these exact spellings; a fourth surface inventing `conditionBands`'
      + ' is the writer/reader drift class. Add the module to ARGUED_FIELD_SPELLERS with'
      + ' its reason in the commit that starts reading the field.',
    ).toEqual([]);
    // Every argued speller is real and really spells one, so the map cannot rot into a
    // list of files that stopped mattering.
    for (const [rel, reason] of Object.entries(ARGUED_FIELD_SPELLERS)) {
      expect(SRC_FILES.map((f) => f.rel), `${rel} vanished — re-aim the argument`).toContain(rel);
      expect(filesNaming(SUBJECT_AXIS_FIELDS), `${rel} no longer names a field`).toContain(rel);
      expect(reason.length, `${rel} is admitted without a reason`).toBeGreaterThan(20);
    }
  });

  test('the conditions key set is closed, codepoint-ordered, and matches the derivation', () => {
    expect([...CONDITIONS_KEYS]).toEqual([...CONDITIONS_KEYS].sort());
    expect(CONDITIONS_KEYS).toHaveLength(4);
    // The derivation may never emit a key outside the closed set — that is the half of
    // the seam an ES product or a TRADE consumer reads against.
    const rich = conditionsGroundTruth({
      tier: 'city',
      economicState: {
        prosperity: 'Prosperous', tradeAccess: 'crossroads', isEntrepot: true,
        foodSecurity: { storageMonths: 9, foodRatio: 1.2 },
      },
    });
    expect(Object.keys(rich)).toEqual([...CONDITIONS_KEYS]);
    // anchored: the fixture above resolves ALL FOUR reads, so an equality against the
    // closed set is a totality measurement rather than a subset that happened to match.
    expect(Object.keys(rich)).toHaveLength(4);
  });

  test('SUBJECT_AXIS_FIELDS is codepoint-ordered and holds exactly the three families', () => {
    expect([...SUBJECT_AXIS_FIELDS]).toEqual([...SUBJECT_AXIS_FIELDS].sort());
    expect([...SUBJECT_AXIS_FIELDS]).toEqual(['conditionsBands', 'devotionBand', 'scarcityBands']);
  });
});
