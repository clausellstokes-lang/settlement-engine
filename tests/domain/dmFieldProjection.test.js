/**
 * dmFieldProjection.test.js — LANE P-2: THE DM-FIELD PROJECTION RULE, proven.
 *
 * The amendment's own pin, verbatim:
 *
 *   > a DM-edited field renders byte-identical with the state-prose corpus fully wired
 *   > (the hardest negative — machine prose must be provably incapable of touching the
 *   > pen's ground).
 *
 * "Provably incapable" is the bar, so this file carries two kinds of evidence:
 *
 *   BEHAVIOURAL — the projection returns the DM's string by IDENTITY (===), unchanged
 *   in every case the corpus can produce: no line, a line, a blank line, a line for a
 *   field the DM has not touched, and a field whose text happens to equal the machine
 *   sentence.
 *
 *   STRUCTURAL — a source scan over the whole stateProse family proving no module in it
 *   contains an assignment into any DM-editable prose path. Behaviour pins protect the
 *   call sites that exist; the scan protects the ones a future wiring would add.
 *
 * @enforced-by this file
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DM_EDITABLE_PROSE_PATHS_BY_KIND,
  DM_EDITABLE_SETTLEMENT_PROSE_PATHS,
  DM_FIELD_FRAMED_BY_BLOCK,
  isDmEditableProsePath,
  projectBesideDmField,
  projectBesideSettlementField,
  readProsePath,
} from '../../src/domain/display/stateProse/dmFieldProjection.js';
import { QUEUE_WIRED_PROSE_PATHS } from '../../src/store/settlementPendingEdits.js';
import { readStateProse } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';

const ROOT = resolve(import.meta.dirname, '../..');
const FAMILY_DIR = join(ROOT, 'src/domain/display/stateProse');

/**
 * Every DM-editable LEAF across every entity arm, and who owns it. The scan searches
 * for leaves rather than dotted paths because a writer never spells the whole path —
 * it holds the parent object and assigns the last segment. Deriving from ALL arms is
 * the lane-PT repair: `faction.desc` and `institution.desc` are queue-wired too, so a
 * settlement-only derivation left `.desc =` unwatched.
 */
const DM_EDITABLE_LEAVES = [...new Set(
  Object.values(DM_EDITABLE_PROSE_PATHS_BY_KIND).flatMap((paths) => paths)
    .map((path) => path.split('.').pop()),
)];

/** leaf → the `kind.path` spellings it stands for, so an offender names the real field. */
const LEAF_OWNERS = new Map(DM_EDITABLE_LEAVES.map((leaf) => [
  leaf,
  Object.entries(DM_EDITABLE_PROSE_PATHS_BY_KIND)
    .flatMap(([kind, paths]) => paths.filter((p) => p.split('.').pop() === leaf).map((p) => `${kind}.${p}`)),
]));

describe('the DM-editable path register', () => {
  it('is in exact lockstep with the queue-wired prose paths, ARM FOR ARM', () => {
    // The editor's list is canonical. A path added there and forgotten here would let a
    // composer write into a field the DM can edit, which is the whole failure this rule
    // exists to prevent.
    //
    // The WHOLE object, not the settlement arm alone (lane PT): comparing one arm left
    // `faction.desc` and `institution.desc` outside the register, and therefore outside
    // the no-writer scan below, which derives its search from the register. A new ENTITY
    // KIND wired into the queue must red here, not just a new path on a known kind.
    expect(structuredClone(DM_EDITABLE_PROSE_PATHS_BY_KIND))
      .toEqual(structuredClone(QUEUE_WIRED_PROSE_PATHS));
    // The settlement arm is derived, never re-listed — proven, not assumed.
    expect(DM_EDITABLE_SETTLEMENT_PROSE_PATHS)
      .toBe(DM_EDITABLE_PROSE_PATHS_BY_KIND.settlement);
  });

  it('names a real editable path for every block the corpus frames onto one', () => {
    for (const [block, path] of Object.entries(DM_FIELD_FRAMED_BY_BLOCK)) {
      expect(isDmEditableProsePath(path), `${block} → ${path}`).toBe(true);
    }
    expect(Object.keys(DM_FIELD_FRAMED_BY_BLOCK).length).toBeGreaterThanOrEqual(8);
  });
});

describe('THE RULE: machine prose renders beside the pen, never into it', () => {
  const EDITED = 'The gate is watched by a man who remembers my players burning it down.';

  /**
   * THE FIELD THE PIN NEEDED (lane PR, 2026-08-03). `EDITED` is a tidy sentence: it
   * survives `.trim()`, `.replace(/\s+/g, ' ')` and `.normalize('NFKC')` unchanged, so a
   * projection that quietly did any of those still returned an identical string and the
   * byte-identity pin stayed green. The module's own docstring already forbids exactly
   * these — "not trimmed, not normalised, not re-cased" — so the fixture now carries one
   * of each hazard: leading and trailing spaces, an internal double space, a ligature
   * (U+FB01) that NFKC expands to `fi`, and a no-break space (U+00A0) NFKC folds to a
   * plain one. A DM's pasted text looks like this far more often than EDITED does.
   */
  // Written with \u escapes on purpose: the exotic codepoints ARE the fixture, and a
  // raw paste of them is how an agent edit smuggles an unreviewable byte into a source
  // file (the authored-NUL class). Assembled once, compared everywhere.
  const UNTIDY = '  The \uFB01rst gate is  watched by a man\u00A0who remembers.  ';

  it('returns the DM string by identity when a machine line is offered', () => {
    const projected = projectBesideDmField(EDITED, 'The approach is ordinary and the town is used to it.');
    expect(projected.field).toBe(EDITED);
    expect(projected.beside).toBe('The approach is ordinary and the town is used to it.');
  });

  it('returns the same DM string byte-identically whether or not the corpus speaks', () => {
    // The amendment's pin. Four corpus outcomes, one field, one set of bytes.
    const dark = projectBesideDmField(EDITED, null);
    const wired = projectBesideDmField(EDITED, 'A machine sentence.');
    const blank = projectBesideDmField(EDITED, '   ');
    const undefinedLine = projectBesideDmField(EDITED, undefined);
    for (const projected of [dark, wired, blank, undefinedLine]) {
      expect(projected.field).toBe(EDITED);
      expect(projected.hasField).toBe(true);
    }
    // A whitespace-only machine line is NOT a line: it must not open an empty slot
    // beside the field where a reader would infer withheld content.
    expect(blank.beside).toBeNull();
    expect(undefinedLine.beside).toBeNull();
  });

  it('keeps an UNTIDY field byte-for-byte — no trim, no collapse, no normalisation', () => {
    // Guard-the-guard FIRST: if the fixture ever loses a hazard, these three reds say so
    // before the pin below quietly stops proving anything.
    expect(UNTIDY, 'the fixture must not survive a trim').not.toBe(UNTIDY.trim());
    expect(UNTIDY, 'the fixture must not survive a whitespace collapse')
      .not.toBe(UNTIDY.replace(/\s+/g, ' '));
    expect(UNTIDY, 'the fixture must not survive NFKC').not.toBe(UNTIDY.normalize('NFKC'));

    for (const machineLine of [null, undefined, '   ', 'A machine sentence.']) {
      const projected = projectBesideDmField(UNTIDY, machineLine);
      expect(projected.field).toBe(UNTIDY);
      // Codepoint-for-codepoint, not just ===: this is the assertion a future refactor
      // that returned a "clean" copy would have to defeat deliberately.
      expect([...String(projected.field)].map((c) => c.codePointAt(0)))
        .toEqual([...UNTIDY].map((c) => c.codePointAt(0)));
      expect(projected.hasField).toBe(true);
    }

    // The same through the settlement-and-path door, which is the one composers use.
    const settlement = { economicViability: { summary: UNTIDY } };
    const viaPath = projectBesideSettlementField(settlement, 'economicViability.summary', 'A machine sentence.');
    expect(viaPath.field).toBe(UNTIDY);
    expect(settlement.economicViability.summary).toBe(UNTIDY);
  });

  it('does not swallow a DM field that happens to equal the machine sentence', () => {
    const same = 'The town is poor and hard to reach.';
    const projected = projectBesideDmField(same, same);
    expect(projected.field).toBe(same);
    expect(projected.beside).toBe(same);
  });

  it('reports an untouched field as absent without inventing one', () => {
    expect(projectBesideDmField(undefined, 'A machine sentence.').hasField).toBe(false);
    expect(projectBesideDmField('', 'A machine sentence.').hasField).toBe(false);
    expect(projectBesideDmField(undefined, 'A machine sentence.').field).toBeUndefined();
  });

  it('never mutates the settlement it reads through', () => {
    const settlement = {
      arrivalScene: EDITED,
      history: { founding: { reason: 'A ford that had to be watched.' } },
    };
    const before = JSON.stringify(settlement);
    const line = readStateProse(DOSSIER_STATE_PROSE_GENERAL, 'DS-GEN-5', 'ordinary (route road and the default)',
      { slots: { settlement: 'Thornwall' }, seed: 'w1', audience: 'dm' });
    const projected = projectBesideSettlementField(settlement, 'arrivalScene', line?.text);
    expect(projected.field).toBe(EDITED);
    expect(projected.beside).toBe(line?.text ?? null);
    expect(JSON.stringify(settlement)).toBe(before);
    expect(settlement.arrivalScene).toBe(EDITED);
  });

  it('reads a nested path without creating it', () => {
    const settlement = { history: { founding: { reason: 'A ford.' } } };
    expect(readProsePath(settlement, 'history.founding.reason')).toBe('A ford.');
    expect(readProsePath(settlement, 'history.founding.overcoming')).toBeUndefined();
    expect(readProsePath(settlement, 'economicViability.summary')).toBeUndefined();
    expect(settlement.economicViability).toBeUndefined();
  });
});

/**
 * Blank out every comment, preserving line and column geometry so the `^`/`m` anchors
 * below still mean what they say.
 *
 * WHY THE SCAN STOPS READING COMMENTS (lane PR, 2026-08-03). The object-literal arm of
 * the pattern matches `{ desc:` — which is exactly how a JSDoc `@example` block SHOWS
 * the shape of a record it does not write. The old comment beside the pattern claimed
 * `(?!:)` excluded that case ("a TYPE annotation is not read as one"); it does no such
 * thing — `(?!:)` excludes a DOUBLE colon and nothing else. Rather than leave a guard
 * whose only defence against documenting the shape was that nobody had documented it,
 * the scan now reads code alone, and the two fixtures below pin both directions.
 * @param {string} source
 * @returns {string}
 */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '))
    .replace(/^([ \t]*)\/\/.*$/gm, '$1');
}

/**
 * The writer pattern for one DM-editable leaf: `x.leaf =`, `x['leaf'] =`, `x["leaf"] =`,
 * and the object-literal spelling `leaf:` a rebuild-the-settlement composer would use.
 * `==` and `=>` are excluded so a comparison or an arrow is not read as a write; `(?!:)`
 * after the literal form excludes the DOUBLE-colon spelling only.
 * @param {string} leaf
 * @returns {RegExp}
 */
function writerPattern(leaf) {
  return new RegExp(
    `(\\.${leaf}\\s*=(?![=>])`
    + `|\\['${leaf}'\\]\\s*=(?![=>])`
    + `|\\["${leaf}"\\]\\s*=(?![=>])`
    + `|(?:^|[{,]\\s*)${leaf}\\s*:(?!:))`,
    'm',
  );
}

/** Does this SOURCE (comments excluded) write this leaf? */
function writesLeaf(source, leaf) {
  return writerPattern(leaf).test(stripComments(source));
}

/**
 * The fixture the cycle-11 verifier planted: a module that only DOCUMENTS the shape.
 * A scan that reads comments calls this a writer, which is a false offender nobody can
 * clear without deleting the documentation.
 */
const __mutantJsdoc = [
  '/**',
  ' * A reader that shows the record it reads.',
  ' * @example',
  ' * { desc: \'the faction blurb\' }',
  ' * @property {string} desc the blurb',
  ' */',
  '// arrivalScene: the DM writes this one, we never do',
  'export function readBlurb(faction) { return faction.desc; }',
  'export const same = (a, b) => a.desc === b.desc;',
].join('\n');

/** The real thing, so stripping comments cannot be mistaken for stripping teeth. */
const __mutantWriter = [
  '/** Rebuilds a faction record. */',
  'export function rebuild(faction, line) {',
  '  return { ...faction, desc: line };',
  '}',
].join('\n');

describe('THE RULE, structurally: the family holds no writer', () => {
  /** Every source file of the state-prose family. */
  function familySources() {
    return readdirSync(FAMILY_DIR, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
      .map((entry) => join(entry.parentPath ?? entry.path, entry.name));
  }

  it('has sources to scan — an emptied family would make the scan vacuous', () => {
    expect(familySources().length).toBeGreaterThanOrEqual(2);
  });

  it('scans a leaf from EVERY entity arm — a settlement-only scan is half a scan', () => {
    // Guard-the-guard. `desc` enters the search only through the faction/institution
    // arms; if the derivation silently narrows back to the settlement, this reds before
    // the scan below goes quietly blind on two thirds of the register.
    expect(DM_EDITABLE_LEAVES).toContain('desc');
    expect(DM_EDITABLE_LEAVES).toContain('arrivalScene');
    expect(new Set(Object.keys(DM_EDITABLE_PROSE_PATHS_BY_KIND)))
      .toEqual(new Set(['faction', 'institution', 'settlement']));
  });

  it('reads code and not comments — the guard says what it does, and does it', () => {
    // The verifier's __mutantJsdoc fixture, promoted to a pin. Documenting the shape of
    // a DM-editable record must not be an offence; writing it must.
    for (const leaf of ['desc', 'arrivalScene']) {
      expect(
        writesLeaf(__mutantJsdoc, leaf),
        `a JSDoc block that only SHOWS ${leaf} is read as a writer`,
      ).toBe(false);
    }
    expect(writesLeaf(__mutantWriter, 'desc'), 'a real object-literal write went unseen').toBe(true);
    expect(writesLeaf('faction.desc = line;', 'desc')).toBe(true);
    expect(writesLeaf("faction['desc'] = line;", 'desc')).toBe(true);
    expect(writesLeaf('if (faction.desc === other.desc) return;', 'desc')).toBe(false);
    // Stripping must preserve line geometry, or the `^` arm silently stops anchoring.
    expect(stripComments(__mutantJsdoc).split('\n').length).toBe(__mutantJsdoc.split('\n').length);
    expect(writesLeaf('/* desc: shown */\nconst x = { desc: line };', 'desc')).toBe(true);
  });

  it('contains no assignment into any DM-editable prose path, on any entity kind', () => {
    const offenders = [];
    for (const file of familySources()) {
      const source = readFileSync(file, 'utf8');
      for (const leaf of DM_EDITABLE_LEAVES) {
        if (writesLeaf(source, leaf)) {
          offenders.push(`${file.slice(ROOT.length + 1)} writes ${LEAF_OWNERS.get(leaf).join(' / ')}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('imports no store, no slice and no persistence seam', () => {
    // A leaf that cannot reach a writer cannot become one. The projection rule is only
    // as strong as the family's inability to persist anything at all.
    const offenders = [];
    for (const file of familySources()) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/^\s*import\s[^;]*?from\s+['"]([^'"]+)['"]/gm)) {
        const spec = match[1];
        if (/store|slice|persist|supabase|localStorage|pendingEdits/i.test(spec)) {
          offenders.push(`${file.slice(ROOT.length + 1)} imports ${spec}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
