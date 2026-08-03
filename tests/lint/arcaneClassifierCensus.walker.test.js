/**
 * tests/lint/arcaneClassifierCensus.walker.test.js — THE ARCANE-SPELLING CENSUS.
 *
 * THE CLASS (leak register L10-L12, all one shape): "a second spelling of the magic gate".
 * Four modules independently asked "is this thing arcane?" from their own name regex, each
 * mixing unambiguous tokens with ambiguous ones, and the four answers drifted apart. Chair
 * ruling R-BLD-5 named the cure — the catalog's authored tag is canonical, name patterns
 * are a fallback for non-catalog entities only — and MG-3h applied it at all four sites.
 *
 * WHY A CENSUS AND NOT ONLY THE BEHAVIOURAL PINS. The behavioural pins in
 * tests/domain/arcaneIdentity.test.js cover the four sites that exist. They cannot cover
 * the FIFTH one, and the fifth is exactly how this class regrew the first four times: an
 * author who needs to know whether a faction is arcane writes `/mage|arcane|tower/i` from
 * memory, two files away from the module that already knows. The habitat is "any author
 * writing the pattern from memory", so the guard has to meet them at CI.
 *
 * THE RULE: an arcane-token alternation may live in exactly the modules listed below.
 * A new one is not automatically wrong — it is a decision that must be made deliberately:
 * either route the site through domain/arcaneIdentity.js (almost always right), or add it
 * here WITH a stated reason for why the canonical detector does not fit.
 *
 * ⚠️ THE EXEMPTION IS PER-ALTERNATION, NOT PER-FILE (closed 2026-08-03). This census used
 * to `continue` on the whole file the moment its path appeared on the allowlist, which
 * meant the ten most magic-literate modules in the estate — precisely the ones an author
 * reaches for when they need to know whether a thing is arcane — were the ONLY ten where
 * the L10-L12 class could regrow completely unseen. Four of them carry a mixed alternation
 * today (arcaneIdentity, magicLedger, customContent, factionArchetypes); a fifth spelling
 * added beside any of those four was invisible to this guard, and a guard with a hole
 * shaped like its own subject matter is worse than none. Each entry below therefore
 * records the EXACT alternation(s) its exemption covers. An alternation in an allowlisted
 * file that is not recorded here is reported exactly like one in any other file, and a
 * recorded alternation that has vanished is reported as a stale exemption. Signatures are
 * the regex literal itself, so a pattern that merely MOVES within its file stays green
 * while a pattern that CHANGES comes back for a decision.
 *
 * CANNOT-CATCH (this guard's stated evasion gaps):
 *   (a) A classifier built from an ARRAY of keywords rather than a regex alternation —
 *       `['arcane','mage'].some(k => n.includes(k))`. magicFilter's ARCANE_INST_KW is
 *       exactly that shape and is on the allowlist by name, but a NEW array would slip
 *       past. Hand-search `includes(` near 'arcane' when auditing this class. This is now
 *       the guard's WIDEST gap, inside allowlisted files and outside them alike.
 *   (b) A single-token test (`/arcane/i.test(x)`) — no alternation, so no match here.
 *       Single tokens are also the least drift-prone shape, which is why the pattern
 *       requires two arcane tokens before it counts.
 *   (c) Anything outside src/ — the Deno edge tree is not scanned.
 *   (d) Tokens spelled through a variable or built at runtime.
 *   (e) An arcane token and an ambiguous one split across two LINES of one multi-line
 *       regex. Detection is line-scoped, which is what keeps the frozen baselines below
 *       stable and readable; a reformatted multi-line pattern is the price.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

/**
 * THE ALLOWLIST — every module permitted to spell an arcane-token alternation.
 *
 * `why` is the reason the site is not simply a call to the canonical detector.
 * `covers` is the EXACT set of mixed alternations that reason licenses, verbatim as the
 * regex literal appears in source. An empty `covers` is the strongest kind of entry: the
 * module is exempt on its vocabulary as a whole (arrays, unambiguous-only alternations)
 * and has NO mixed alternation today, so the very first one to appear will be reported.
 */
const ALLOWED = Object.freeze({
  'src/domain/arcaneIdentity.js': Object.freeze({
    why: 'THE CANONICAL DETECTOR (R-BLD-5). The certain/ambiguous split lives here by design.',
    covers: Object.freeze(['/tower|academy|college|sage/i']),
  }),
  'src/domain/arcaneInstitutionIdentity.js': Object.freeze({
    why: 'The institution catalog adapter. Its alternation is DERIVED from magicFilter.ARCANE_INST_KW, never re-typed.',
    covers: Object.freeze([]),
  }),
  'src/domain/magicAssertionText.js': Object.freeze({
    why: 'The world law\'s own assertion vocabulary — the question "does this text CLAIM magic works?", which is upstream of identity and shared with generationContext.',
    covers: Object.freeze([]),
  }),
  'src/domain/magicFilter.js': Object.freeze({
    why: 'ARCANE_INST_TAGS / ARCANE_INST_KW — the estate\'s authored catalog-strip vocabulary, reused BY the detector rather than duplicated.',
    covers: Object.freeze([]),
  }),
  'src/domain/magicLedger.js': Object.freeze({
    why: 'ARCANE_INSTITUTION_PATTERN answers a DIFFERENT question — "how much arcane infrastructure stands in this roster?", a census over already-generated institutions. Deliberately not folded (recorded in DESIGN_REALM_MAGIC_TOGGLE.md MG-3h); converting it moves magicProfile/capacityModel output.',
    covers: Object.freeze([
      '/(tower|sanctum|college|conclave|circle|guild.*mage|enclave|atheneum|library.*arcane)/i',
    ]),
  }),
  'src/generators/generationContext.js': Object.freeze({
    why: 'MAGIC_ROLE_PATTERN — the generation world law\'s role vocabulary, a different axis from entity identity.',
    covers: Object.freeze([]),
  }),
  'src/domain/customContent.js': Object.freeze({
    why: 'INSTITUTION_CATEGORY_PATTERNS\' arcane row is this surface\'s own AUTHORED vocabulary for user-typed names, consulted only after the catalog tag (R-BLD-5) and read with the denial clauses struck.',
    covers: Object.freeze([
      '/(tower|college|conclave|circle|enclave|atheneum|library.*arcane|sanctum)/i',
    ]),
  }),
  'src/generators/power/factionCategories.js': Object.freeze({
    why: 'MAGIC_CERTAIN/AMBIGUOUS_KEYWORDS — this surface\'s own authored vocabulary, split per R-BLD-5 and run THROUGH the canonical procedure. Authored as Title-Case ARRAYS joined into a RegExp at module load, so it spells no alternation on any single line.',
    covers: Object.freeze([]),
  }),
  'src/domain/factionArchetypes.js': Object.freeze({
    why: 'NAME_RULES\' arcane row keeps its ordering slot in the first-match loop; the decision itself is delegated to the canonical detector.',
    covers: Object.freeze([
      '/mage|arcane|wizard|sorcer|alchem|warlock|magister|tower|academy|college|sage/i',
    ]),
  }),
  'src/lib/entities.js': Object.freeze({
    why: 'INSTITUTION_KEYWORD_TAGS\' arcane row is a TAG BACKFILL for tag dispatch, not an identity classifier, and it is already W-K2-correct: it carries only UNAMBIGUOUS tokens (mage|wizard|arcane|spellcast|sorcer|conjur|enchant|magus) and files tower/academy/college under SCHOLARLY instead. Its own header documents it as a migration-era fallback that stops firing as the catalog gains declared tags. FOUND BY THIS CENSUS during MG-3h and left deliberately: converting it moves institutionTags() output estate-wide, which is not this lane\'s ruling. Recorded in DESIGN_REALM_MAGIC_TOGGLE.md\'s MG-3h block.',
    covers: Object.freeze([]),
  }),
});

/**
 * WHAT COUNTS. Not "any arcane regex" — a census of those returns fourteen files, most of
 * them alternations of purely UNAMBIGUOUS tokens, which are not the defect and never were.
 * The W-K2 shape is specifically an alternation that MIXES an arcane token with an
 * AMBIGUOUS one, so that a tower, an academy or a college gets swept into the arcane arm
 * by a word that describes masonry or teaching. That mixture is what this census hunts.
 */
const TOKENS = [
  'arcane', 'mage', 'wizard', 'sorcer', 'warlock', 'magister', 'alchem', 'enchant',
  'necromanc', 'spellcast', 'thaumatur', 'occult', 'magus', 'conjur',
];

/** Words that are arcane only where magic is being asserted. */
const AMBIGUOUS = ['tower', 'academy', 'college', 'sage', 'conclave', 'enclave', 'atheneum'];

const ALTERNATION_LINE = /\/[^/\n]*\|[^/\n]*\/[gimsuy]*/;

/**
 * Every alternation regex literal spelled on one line, in source order. This is the
 * exemption SIGNATURE: it survives the line moving, and it does not survive the pattern
 * changing — which is the trade the per-alternation allowlist is built on.
 * @param {string} line
 */
const alternationsOn = (line) => line.match(new RegExp(ALTERNATION_LINE.source, 'g')) || [];

/**
 * ⚠️ THE UNCONVERTED POPULATION — FROZEN 2026-08-03, SHRINK-ONLY.
 *
 * This census FOUND THESE. The leak register's L10 named two classifiers; the census run
 * during MG-3h turned up seven more sites of the identical shape, in six files nobody had
 * looked at. They are recorded rather than converted for one reason: chair ruling R-BLD-5
 * names four classifiers, and every entry below decides live GENERATED output (district
 * categories, NPC domains, stressor subsystems, ruin fates). Converting them is a
 * same-seed behaviour change on existing worlds and needs its own disclosed wave, not a
 * quiet ride inside this one.
 *
 * THE RULE IS SHRINK-ONLY. Convert a site → DELETE its line here (the win is locked).
 * Never add a line without a stated reason. A site that vanishes without this list
 * shrinking means the pattern moved rather than went away, and the next test reds.
 *
 * Keys are `path:line`; the line number is deliberately part of the key so a moved
 * pattern re-presents itself for a decision instead of drifting on unnoticed.
 */
const KNOWN_UNCONVERTED = Object.freeze({
  'src/domain/districtProfile.js:112':
    'TRUE MEMBER. District name → category: a "Tower District" or "College Row" is masonry and teaching, and reads arcane. Same shape as L10, one layer over.',
  'src/domain/npcProfile.js:333':
    'TRUE MEMBER. NPC workplace venue → domain; tower/college/library/laboratory decide alone.',
  'src/domain/npcProfile.js:374':
    'TRUE MEMBER. The second copy of the same table in the same file — a fork of a fork.',
  'src/domain/contradictions.js:222':
    'CONTEXTUALLY SCOPED, not the class — but only just. ARCANE_INST is selected by `p.archetype === \'arcane\'`, so it searches for an already-arcane faction\'s seat rather than deciding arcane-ness. It is entirely ambiguous tokens, though, so it will happily accept a masonry tower as an arcane order\'s home and report no contradiction. A real (small) false negative, recorded rather than fixed: the fix is the same conversion the TRUE MEMBERS need.',
  'src/domain/worldPulse/stressorDynamics.js:53':
    'TRUE MEMBER, and the sharpest: the arcane row is ENTIRELY ambiguous (sanctum|college|conclave|circle|enclave|atheneum|spire) with no unambiguous token at all, so every match it makes is a guess.',
  'src/domain/worldPulse/tierOutcomeApply.js:143':
    'TRUE MEMBER. A ruined settlement\'s institution fate: academy|library|sage|college|school route to "abandoned" beside the real arcane tokens.',
  'src/generators/factionRoles.js:57':
    'CONTEXTUALLY SCOPED, not the class. The Archmagister\'s `linkToInst` runs only INSIDE the already-classified `arcane:` bucket, so tower|academy|college is searching an arcane faction\'s own building, not deciding whether one is arcane. Listed for completeness so a future audit does not re-find it as a defect.',
  'src/generators/isolationGenerator.js:97':
    'CONTEXTUALLY SCOPED, not the class. "Does this settlement already have an arcane maintainer?" runs inside the magic-forcing arm and searches the Magic-category catalog, where "academy" means "Academy of magic".',
});

describe('the arcane-spelling census (MG-3h / R-BLD-5)', () => {
  const files = globSync('src/**/*.{js,jsx}').sort();

  it('finds source files to scan (the census is not vacuous)', () => {
    expect(files.length).toBeGreaterThan(500);
  });

  it('no alternation mixes arcane tokens with ambiguous ones outside the recorded set', () => {
    /** @type {string[]} */
    const found = [];
    for (const file of files) {
      const rel = file.replace(/\\/g, '/');
      const exemption = ALLOWED[rel];
      for (const [i, line] of readFileSync(file, 'utf8').split('\n').entries()) {
        if (!ALTERNATION_LINE.test(line)) continue;
        const lower = line.toLowerCase();
        const arcane = TOKENS.filter((t) => lower.includes(t));
        const ambiguous = AMBIGUOUS.filter((t) => lower.includes(t));
        if (!arcane.length || !ambiguous.length) continue;
        const site = `${rel}:${i + 1} — arcane [${arcane.join(', ')}] mixed with ambiguous [${ambiguous.join(', ')}]`;
        if (exemption) {
          // An allowlisted FILE is not an allowlisted LINE. Only the alternations the
          // exemption's reason actually covers ride; anything else is regrowth in the
          // one place the old file-scoped skip could never see it.
          const unrecorded = alternationsOn(line).filter((a) => !exemption.covers.includes(a));
          if (!unrecorded.length) continue;
          found.push(`${site} — UNRECORDED IN AN ALLOWLISTED FILE: ${unrecorded.join(' ')}`);
          continue;
        }
        if (KNOWN_UNCONVERTED[`${rel}:${i + 1}`]) continue;
        found.push(site);
      }
    }
    expect(
      found,
      'A NEW arcane classifier is mixing unambiguous tokens with ambiguous ones.\n'
      + 'That is the W-K2 shape and the L10-L12 class regrowing: a tower is masonry, a\n'
      + 'college is scholars, and an alternation that treats them as spells will\n'
      + 'misclassify a cobblers\' guild the same way four other classifiers already did.\n'
      + 'Route the site through domain/arcaneIdentity.js (isArcaneFaction /\n'
      + 'resolveArcaneIdentity / isArcaneInstitution), which reads the catalog\'s authored\n'
      + 'tag first and demands a functional-magic assertion before an ambiguous token\n'
      + 'decides anything. If the canonical detector genuinely does not fit, add the file\n'
      + 'to ALLOWED above WITH the reason. Do not add it silently.\n'
      + '\n'
      + 'A site marked UNRECORDED IN AN ALLOWLISTED FILE is the same class landing inside\n'
      + 'a module that already holds an exemption. The exemption covers the alternations\n'
      + 'named in its `covers` list and nothing else — being one of the ten magic-literate\n'
      + 'modules is not a licence to grow an eleventh spelling. Either route the new site\n'
      + 'through the canonical detector, or add its literal to that file\'s `covers` and\n'
      + 'extend `why` to say what the new alternation decides that the detector cannot.\n',
    ).toEqual([]);
  });

  it('every allowlisted module still exists, still spells an alternation, and states why', () => {
    // A shrink-only census: an entry whose file lost its pattern is a stale exemption and
    // must be DELETED, or the allowlist slowly becomes a licence rather than a record.
    /** @type {string[]} */
    const stale = [];
    for (const [rel, exemption] of Object.entries(ALLOWED)) {
      if (!exemption.why || exemption.why.length < 40) {
        stale.push(`${rel} — allowlisted without a stated reason; an exemption is a decision, not a path`);
      }
      /** @type {string} */
      let text;
      try {
        text = readFileSync(rel, 'utf8');
      } catch {
        stale.push(`${rel} — allowlisted but the file is gone`);
        continue;
      }
      // File-scoped rather than line-scoped: factionCategories authors its vocabulary as
      // Title-Case ARRAYS that are joined into a RegExp at module load, so a line-scoped
      // liveness check would call a live exemption stale.
      const lower = text.toLowerCase();
      const live = TOKENS.filter((t) => lower.includes(t)).length >= 2;
      if (!live) stale.push(`${rel} — allowlisted but no longer spells an arcane vocabulary`);
    }
    expect(stale, 'Delete the stale allowlist entries; an exemption outlives its reason.')
      .toEqual([]);
  });

  it('every recorded exemption alternation is still spelled in its file', () => {
    // The other half of the per-alternation allowlist. Without this, a `covers` entry
    // survives the conversion of the very pattern it licenses, and the exemption silently
    // widens back into the file-scoped skip this census was rebuilt to remove.
    /** @type {string[]} */
    const stale = [];
    for (const [rel, exemption] of Object.entries(ALLOWED)) {
      if (!exemption.covers.length) continue;
      /** @type {string} */
      let text;
      try {
        text = readFileSync(rel, 'utf8');
      } catch {
        stale.push(`${rel} — covers recorded but the file is gone`);
        continue;
      }
      for (const alternation of exemption.covers) {
        if (!text.includes(alternation)) stale.push(`${rel} — covers \`${alternation}\`, which the file no longer spells`);
      }
    }
    expect(
      stale,
      'A RECORDED EXEMPTION ALTERNATION HAS VANISHED.\n'
      + 'If you CONVERTED it to the canonical detector: delete it from that file\'s\n'
      + '`covers` — that locks the win, and if the list empties, the very next mixed\n'
      + 'alternation to appear in the file gets reported.\n'
      + 'If you merely REWROTE it: paste the new literal in, and check that `why` still\n'
      + 'describes what it now decides.\n',
    ).toEqual([]);
  });

  it('the unconverted baseline only ever shrinks', () => {
    /** @type {string[]} */
    const stale = [];
    for (const key of Object.keys(KNOWN_UNCONVERTED)) {
      const [rel, lineNo] = [key.slice(0, key.lastIndexOf(':')), Number(key.slice(key.lastIndexOf(':') + 1))];
      /** @type {string} */
      let line;
      try {
        line = readFileSync(rel, 'utf8').split('\n')[lineNo - 1] || '';
      } catch {
        stale.push(`${key} — file gone; delete the entry`);
        continue;
      }
      const lower = line.toLowerCase();
      const live = TOKENS.some((t) => lower.includes(t)) && AMBIGUOUS.some((t) => lower.includes(t));
      if (!live) stale.push(`${key} — no longer the recorded pattern`);
    }
    expect(
      stale,
      'A recorded unconverted site is no longer where it was recorded.\n'
      + 'If you CONVERTED it: delete its line from KNOWN_UNCONVERTED — that locks the win.\n'
      + 'If it merely MOVED: the pattern is still live and still unconverted; update the\n'
      + 'line number so the census keeps seeing it. Never delete an entry for a pattern\n'
      + 'that still exists somewhere else in the file.\n',
    ).toEqual([]);
  });

  it('the canonical detector is the one the classifiers actually import', () => {
    const consumers = [
      'src/domain/factionArchetypes.js',
      'src/generators/power/factionCategories.js',
      'src/generators/institutionProbability.js',
      'src/domain/customContent.js',
    ];
    for (const rel of consumers) {
      const text = readFileSync(rel, 'utf8');
      expect(text, `${rel} must consult the canonical arcane detector`)
        .toMatch(/arcaneIdentity\.js|arcaneInstitutionIdentity\.js/);
    }
  });
});
