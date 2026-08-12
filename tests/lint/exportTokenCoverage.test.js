/**
 * tests/lint/exportTokenCoverage.test.js — SITE COHERENCE / WAVE 0, the predicate-liveness
 * census. Every alternative in every export-matching predicate is either EXERCISED by at
 * least one string in the live generated vocabulary, or QUARANTINED in `KNOWN_INERT` with a
 * written reason.
 *
 * ⛔⛔ LIVENESS ONLY, NEVER CORRECTNESS. This file says nothing about whether a match is
 * RIGHT. `/mill/` matching `Milled flour` and drawing a river across a landlocked town is a
 * false positive of the first order — and it is LIVE, so it passes here. Judging it is Wave
 * 4's job and Wave 8's assertion. What this census catches is the opposite defect: an
 * alternative that matches NOTHING the generator produces, which is a mutation-proof dead
 * branch. Deleting `/pearl|whal|ferry/` today changes zero of 462 models, so a regression
 * test written over those tokens can never fail — the audit's M6.
 *
 * ⛔⛔ THE DENOMINATOR IS DERIVED FROM SOURCE, NEVER TRANSCRIBED, and two independent live
 * guards force it — either alone decisive:
 *   • contractTestAntiVacuity.walker.test.js Rule 2 scopes tests/lint/*.test.js and reds an
 *     exhaustive-claim test that iterates a LOCAL PURE LITERAL in a file deriving nothing
 *     from source. A hardcoded token list under a title saying "every alternative" is
 *     precisely that shape.
 *   • SITE_COHERENCE_PLAN.md:115's own list of predicate sites is INCOMPLETE — it names
 *     three and there are four; `siteGenesis.js:239` decides marsh-versus-river and is
 *     materially decisive. A transcribed list would have been silently wrong on the day it
 *     landed.
 * Extraction routes through tests/helpers/sourceContract.js, which THROWS on absence instead
 * of returning '' — anti-vacuity Rule 1b's shape, and the reason a rename reddens here
 * rather than quietly emptying the census. The throw is PROVEN below, not assumed.
 *
 * KNOWN_INERT IS EXACT-SET-EQUAL TO THE MEASURED INERT SET, which buys three properties in
 * one assertion: a NEWLY dead alternative reds (the quarantine is non-growing); an entry
 * naming an alternative the source no longer spells reds (Wave 4's deletions cannot leave
 * the quarantine describing nothing); and an entry that has become LIVE reds, so the win is
 * BANKED by deleting the row rather than absorbed. ⛔ Emptying the quarantine is Wave 4's
 * job, not this file's — nothing here deletes a token.
 *
 * PURE: no clock, no network, no randomness beyond the corpus's pinned seeds.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { canonExports } from '../../src/domain/canonicalAccessors.js';
import { CULTURE_PROFILE_KEYS } from '../../src/data/cultureProfiles.js';
import { mustExtract, jsRegexTokens } from '../helpers/sourceContract.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE_GENESIS_REL = 'src/domain/townMap/siteGenesis.js';
const ASYMMETRY_REL = 'src/domain/townMap/asymmetrySources.js';

/** The estate's heavy-suite local budget (determinismBanCoverage.test.js:169), which is also
 *  CR-SCW0-5's ruled corpus budget. A LOCAL timeout, never a raise of the global
 *  `testTimeout`, and never an assertion on wall clock. */
const CORPUS_BUDGET_MS = 120_000;

// The corpus axes are the same frozen literals siteCoherenceRatchet.test.js pins; they are
// restated rather than imported because a test file importing another test file makes the
// second file's registration shape depend on the first, and the lighting census reads
// registration shape per file.
const SETT_TYPES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const TERRAINS = Object.freeze(['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert']);
const ROUTES = Object.freeze(['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass']);
const ARM_A_SEEDS = Object.freeze(['scw0-a1', 'scw0-a2', 'scw0-a3', 'scw0-a4', 'scw0-a5']);
const ARM_B_SEED = 'scw0-b1';
const CORPUS_SIZE = 462;

/**
 * THE QUARANTINE — measured at `d0af9b35`, not inherited from the audit. Key is
 * `<predicate site>|<alternative>`; the value is why the generator never spells it.
 *
 * ⚠ THE AUDIT'S LIST IS ALREADY STALE AND THIS IS WHY THE SET IS DERIVED.
 * SITE_COHERENCE_AUDIT.md:113 measured `/pearl/`, `/whal/`, `/ferry/` AND `/barge/` at zero.
 * `/barge/` is now LIVE — the vocabulary gained `Cargo barges` — so transcribing the audit's
 * four would have quarantined a live alternative and this census would have reddened on its
 * own first run.
 * ⚠ `/salt/` is NOT here. The audit's finding about it is that the dunes leg is SHADOWED
 * (never DECISIVE), which is a statement about the arm chain, not about liveness: `salt`
 * matches five live strings. Decisiveness is the ratchet's business, not this census's.
 */
const KNOWN_INERT = Object.freeze({
  'siteGenesis:WATER_ECONOMY_RE|pearl': 'No pearl fishery vocabulary exists. Coastal economies ship "Smoked seafood", "Fish oil" and "Maritime services (cargo, pilotage)"; pearls are not in any resource table\'s tradeGoods.',
  'siteGenesis:WATER_ECONOMY_RE|whal': 'No whaling vocabulary exists anywhere in the resource tables — the maritime pool tops out at fishing, salt and shipping.',
  'siteGenesis:WATER_ECONOMY_RE|ferry': 'Ferry work is spelled as a SERVICE, not a good: the corpus ships "Ship passage", "Maritime services (cargo, pilotage)" and "Toll income (transit)". No emitted string contains the stem.',
  'siteGenesis:mountain-flankExports|silver': 'Precious metal ships under its category, never its element: "Precious metals", "Fine metalwork and jewelry", "Coin minting". No generated string names silver.',
  'siteGenesis:mountain-flankExports|gold': 'Same as silver — the generator emits "Precious metals" and "Coin minting" and never spells the metal, so this alternative can decide nothing.',
  'EXPORT_RULES:tannery|hide': 'Hides ship finished: "Leather goods", "Camel leather", "Furs and pelts". The sibling alternatives /leather/ and /pelt/ already carry every live string in the family.',
  'EXPORT_RULES:tannery|tann': 'No emitted string names the tanning process; the trade appears only as its product ("Leather goods"), which /leather/ catches.',
  'EXPORT_RULES:quarry|marble': 'Dimension stone is undifferentiated in the resource tables — everything ships as "Quarried stone" or as gemstones. No stone TYPE is ever named.',
  'EXPORT_RULES:quarry|slate': 'As marble: no stone type is spelled by any resource table.',
  'EXPORT_RULES:quarry|granite': 'As marble: no stone type is spelled by any resource table.',
  'EXPORT_RULES:quarry|quarry': 'A near miss rather than an absence: the emitted string is "Quarried stone", whose stem is "quarri", so the literal /quarry/ does not match it. /stone/ catches the string instead, which is why this alternative is dead rather than the rule.',
  'EXPORT_RULES:mine|copper': 'The only base metals emitted are iron ("Iron ore", "Pig iron", "Refined iron ingots") and the undifferentiated "Precious metals". Copper is never spelled.',
  'EXPORT_RULES:mine|silver': 'Duplicate of the siteGenesis mountain arm\'s dead /silver/ leg, in the second of the token\'s two homes — the duplication Wave 2 exists to remove.',
  'EXPORT_RULES:mine|gold': 'Duplicate of the siteGenesis mountain arm\'s dead /gold/ leg, in the second of the token\'s two homes.',
  'EXPORT_RULES:weavers|linen': 'Cloth ships by grade, not by fibre: "Fine wool cloth", "Dyed cloth", "Fulled cloth", "Fine textiles". Flax and linen are absent from every resource table.',
  'EXPORT_RULES:weavers|weav': 'The craft is never named in a trade good; /cloth/, /wool/ and /textile/ carry all five live strings in this family.',
  'EXPORT_RULES:market-farms|wheat': 'Cereal ships as the undifferentiated "Grain surplus" and "Desert grain"; no cereal SPECIES is named anywhere. /grain/ catches all of them.',
  'EXPORT_RULES:market-farms|barley': 'As wheat — no cereal species is emitted by any resource table.',
  'EXPORT_RULES:market-farms|produce': 'Farm produce ships under concrete names ("Dates and fruit", "Dried fruit", "Aged cheese"); the abstract noun is never emitted.',
  'EXPORT_RULES:market-farms|wine': 'The drink vocabulary is "Ale (barrel)" and "Beer (barrel)"; no viticulture string exists in the resource tables.',
  'EXPORT_RULES:market-farms|hop': 'Brewing inputs are not emitted as their own good — only the finished "Ale (barrel)" and "Beer (barrel)", which /ale/ catches.',
  'EXPORT_RULES:reagent-works|scroll': 'Written goods ship as "Rare texts", "Books and manuscripts" and "Maps and charts"; the scroll stem appears in no emitted string.',
});

// ── DERIVATION ──────────────────────────────────────────────────────────────────────────

/**
 * The export-matching predicates in siteGenesis.js, in source order. Two shapes, both read
 * structurally so a FIFTH predicate is discovered rather than missed:
 *   (a) a NAMED const regex the file applies to an export element;
 *   (b) an INLINE literal regex applied to an export expression.
 * THROWS when nothing is found — a blind extractor must be loud, never empty.
 * @param {string} src @returns {Array<{ site: string, alternatives: string[] }>}
 */
export function siteGenesisPredicates(src) {
  const found = [];
  for (const m of src.matchAll(/const\s+([A-Z][A-Z0-9_]*_RE)\s*=\s*\/([^/\n]+)\/i;/g)) {
    if (!new RegExp(`\\b${m[1]}\\.test\\(String\\(e\\)\\)`).test(src)) continue;
    found.push({ at: m.index, site: `siteGenesis:${m[1]}`, alternatives: jsRegexTokens(m[2]) });
  }
  for (const m of src.matchAll(/\/([^/\n]+)\/i\.test\((String\(e\)|exports\.join\(' '\))\)/g)) {
    const kindMatch = src.slice(m.index).match(/kind = '([a-z-]+)'/);
    const label = m[2] === "exports.join(' ')" ? 'marshSplit' : `${kindMatch ? kindMatch[1] : 'unknown'}Exports`;
    found.push({ at: m.index, site: `siteGenesis:${label}`, alternatives: jsRegexTokens(m[1]) });
  }
  if (found.length === 0) {
    throw new Error('exportTokenCoverage: zero export predicates extracted from siteGenesis.js — the extractor went blind');
  }
  return found.sort((a, b) => a.at - b.at).map(({ site, alternatives }) => ({ site, alternatives }));
}

/**
 * The eight EXPORT_RULES rows in asymmetrySources.js, keyed by their own `label`.
 * THROWS when nothing is found. @param {string} src
 * @returns {Array<{ site: string, alternatives: string[] }>}
 */
export function asymmetryPredicates(src) {
  const found = [];
  for (const m of src.matchAll(/\{\s*re:\s*\/([^/\n]+)\/i,[\s\S]*?label:\s*'([^']+)'\s*\}/g)) {
    found.push({ site: `EXPORT_RULES:${m[2]}`, alternatives: jsRegexTokens(m[1]) });
  }
  if (found.length === 0) {
    throw new Error('exportTokenCoverage: zero EXPORT_RULES rows extracted from asymmetrySources.js — the extractor went blind');
  }
  return found;
}

/** The union denominator: every `<site>|<alternative>` key the two files spell. */
export function allAlternativeKeys(sgSrc, asSrc) {
  const keys = [];
  for (const { site, alternatives } of [...siteGenesisPredicates(sgSrc), ...asymmetryPredicates(asSrc)]) {
    for (const alt of alternatives) keys.push({ key: `${site}|${alt}`, alternative: alt });
  }
  return keys;
}

/** The numerator: the distinct export strings the frozen 462-corpus produces. */
export function corpusVocabulary() {
  const vocab = new Set();
  let size = 0;
  let i = 0;
  const next = () => CULTURE_PROFILE_KEYS[i++ % CULTURE_PROFILE_KEYS.length];
  const take = (cfg, seed) => {
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    size += 1;
    for (const e of canonExports(s)) vocab.add(String(e));
  };
  for (const settType of SETT_TYPES) {
    for (const terrainOverride of TERRAINS) {
      for (const seed of ARM_A_SEEDS) {
        take({ settType, terrainOverride, tradeRouteAccess: 'road', monsterThreat: 'civilized', culture: next() }, seed);
      }
    }
  }
  for (const settType of SETT_TYPES) {
    for (const terrainOverride of TERRAINS) {
      for (const tradeRouteAccess of ROUTES) {
        take({ settType, terrainOverride, tradeRouteAccess, monsterThreat: 'civilized', culture: next() }, ARM_B_SEED);
      }
    }
  }
  return { vocabulary: [...vocab].sort(), size };
}

let memo = null;
function vocabulary() {
  if (memo === null) memo = corpusVocabulary();
  return memo;
}

const sgSource = readFileSync(join(ROOT, SITE_GENESIS_REL), 'utf8');
const asSource = readFileSync(join(ROOT, ASYMMETRY_REL), 'utf8');

describe('export-token coverage census (Wave 0 — predicate liveness, never correctness)', () => {
  it('the extractors are non-empty and THROW rather than emptying when a target is renamed', () => {
    // The non-empty guard comes FIRST: everything below is vacuous if the reads came back ''.
    expect(sgSource.length, 'the siteGenesis source read came back empty').toBeGreaterThan(0);
    expect(asSource.length, 'the asymmetrySources source read came back empty').toBeGreaterThan(0);
    mustExtract(sgSource, /const WATER_ECONOMY_RE = \/[^/\n]+\/i;/, 'the water-economy predicate');
    mustExtract(asSource, /const EXPORT_RULES = Object\.freeze\(\[/, 'the asymmetry export rules');
    expect(allAlternativeKeys(sgSource, asSource).length, 'the derived denominator is empty').toBeGreaterThan(0);
    // THE RENAMED-AWAY CONTROL. A silent extractor would return [] here and every assertion
    // in this file would pass having checked nothing. Both must THROW instead.
    const renamed = sgSource
      .replace(/const WATER_ECONOMY_RE = /, 'const RENAMED_AWAY_THING = ')
      .replace(/\/i\.test\(String\(e\)\)/g, '/i.testRenamed(String(e))')
      .replace(/\/i\.test\(exports\.join\(' '\)\)/g, "/i.testRenamed(exports.join(' '))");
    expect(() => siteGenesisPredicates(renamed), 'the siteGenesis extractor returned empty instead of throwing').toThrow(/went blind/);
    expect(() => asymmetryPredicates('const EXPORT_RULES = [];'), 'the asymmetry extractor returned empty instead of throwing').toThrow(/went blind/);
    expect(() => mustExtract(sgSource, /const NO_SUCH_PREDICATE_RE = /, 'a control'), 'mustExtract did not throw on an absent target').toThrow();
  });

  it('all four siteGenesis export predicate sites are derived, including the marsh split at :239', () => {
    const sites = siteGenesisPredicates(sgSource).map(({ site }) => site);
    expect(sites, 'the plan lists three predicate sites and there are four — §5c item 2').toEqual([
      'siteGenesis:WATER_ECONOMY_RE',
      'siteGenesis:marshSplit',
      'siteGenesis:mountain-flankExports',
      'siteGenesis:dunesExports',
    ]);
    const asSites = asymmetryPredicates(asSource).map(({ site }) => site);
    expect(asSites.length, 'the eight frozen EXPORT_RULES rows').toBe(8);
    expect(asSites, 'the mine rule is the second home of the /coal/ token Wave 2 exists to unify').toContain('EXPORT_RULES:mine');
  });

  it('the corpus vocabulary is live and the census is not measuring an empty set', () => {
    const { vocabulary: vocab, size } = vocabulary();
    expect(size, 'the corpus size moved — the axes are frozen literals').toBe(CORPUS_SIZE);
    expect(vocab.length, 'the corpus produced no export strings at all — the numerator is empty and every'
      + ' alternative below would read as inert').toBeGreaterThan(0);
    console.log(`[scw-0] distinct export vocabulary at this HEAD: ${vocab.length} strings`);
  }, CORPUS_BUDGET_MS);

  it('every predicate alternative is exercised by the live vocabulary or quarantined in KNOWN_INERT', () => {
    const { vocabulary: vocab } = vocabulary();
    expect(vocab.length, 'the numerator is empty — this claim would be vacuous').toBeGreaterThan(0);
    const keys = allAlternativeKeys(sgSource, asSource);
    expect(keys.length, 'the denominator is empty — this claim would be vacuous').toBeGreaterThan(0);
    const measuredInert = [];
    const unaccounted = [];
    for (const { key, alternative } of keys) {
      const re = new RegExp(alternative, 'i');
      if (vocab.some((v) => re.test(v))) continue;
      measuredInert.push(key);
      if (!(key in KNOWN_INERT)) {
        unaccounted.push(`${key} — matches no string in the live ${vocab.length}-string vocabulary and is not quarantined. Add a KNOWN_INERT row with a written reason, or find out why the vocabulary lost it.`);
      }
    }
    expect(unaccounted, 'a predicate alternative went dead without a quarantine row').toEqual([]);
    // EXACT SET EQUALITY, which is what makes the quarantine non-growing AND membership-checked
    // AND bankable in one assertion: a row naming an alternative the source no longer spells,
    // or one that has become LIVE, is no longer in `measuredInert` and reds here.
    expect(Object.keys(KNOWN_INERT).sort(),
      'KNOWN_INERT is not exactly the measured inert set. A row that is now LIVE must be DELETED'
      + ' (bank the win); a row naming an alternative the source no longer spells must be deleted'
      + ' with it. Emptying this quarantine is Wave 4\'s job — do not delete a token to pass.')
      .toEqual(measuredInert.sort());
    console.log(`[scw-0] predicate alternatives: ${keys.length} total, ${keys.length - measuredInert.length} live, ${measuredInert.length} inert`);
  }, CORPUS_BUDGET_MS);

  it('every KNOWN_INERT row names an alternative the source still spells, with a real reason', () => {
    const spelled = new Set(allAlternativeKeys(sgSource, asSource).map(({ key }) => key));
    expect(spelled.size, 'the derived key set is empty — the membership check would be vacuous').toBeGreaterThan(0);
    const orphans = [];
    const thin = [];
    for (const [key, reason] of Object.entries(KNOWN_INERT)) {
      if (!spelled.has(key)) orphans.push(`${key} — no longer spelled in source; delete the quarantine row in the same change`);
      if (typeof reason !== 'string' || reason.length < 40) thin.push(`${key} — the reason is too thin to be a reason`);
    }
    expect(orphans, 'a quarantine row describes nothing').toEqual([]);
    expect(thin, 'a quarantine row has no substantive written reason').toEqual([]);
  });
});
