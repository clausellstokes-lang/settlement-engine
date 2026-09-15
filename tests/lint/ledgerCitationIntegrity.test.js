/**
 * ledgerCitationIntegrity.test.js — the only-shrinks ratchet over dangling §
 * citations in the ledger estate (ODQ §685.5(vi), measured at ODQ §920,
 * instrumented at ODQ §921).
 *
 * THE CLASS: a section can be cited without ever having been written. `bc907c3ad`
 * announced "§683: the last Fable rulings", touched four documents and not the
 * ledger, and eleven citations now point at a section that does not exist. §920
 * measured the class for the first time and found two more numbers nobody had
 * named, §178 and §183. Before this file, NOTHING in tests/ or scripts/ measured
 * it: `git grep -l OWNER_DECISION_QUEUE -- tests scripts` returned one hit, and
 * that hit was a string inside a commit-message template.
 *
 * THE CONTROLS COME FIRST AND THEY ARE THE POINT. Six of the ten arms below are
 * negative controls proving this instrument can RED — on a new dangling number,
 * on a resolved one, on an alias whose proof has rotted, on an alias pointing at
 * a non-existent target, on a dead alias, and on the forward-reference rule. A
 * green from an instrument never shown to fail is the estate's own FALSE-GREEN
 * class (§685.4's five planted controls are the idiom this follows).
 *
 * THE BASELINE ONLY SHRINKS. It holds the SET of numbers known to dangle, never
 * their counts: a count assertion would red every time a chair legitimately
 * writes "§683" again, and a gate that reds on correct behaviour gets turned
 * off. A NEW number fails; a baselined number whose citations have all gone also
 * fails, with "delete its entry" — so the set can only fall.
 */

import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  ALIASES,
  analyzeCorpus,
  resolveCorpus,
} from '../../scripts/audit/ledger-citations.mjs';

const BASELINE_PATH = fileURLToPath(new URL('./.ledger-citation-baseline.json', import.meta.url));
const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const baselinedHoles = new Set(Object.keys(baseline.holes).map(Number));

/** A minimal synthetic estate, so the controls need no fixture in the repo. */
function corpus({ odq, extra = [] }) {
  return [{ path: 'docs/OWNER_DECISION_QUEUE.md', text: odq }, ...extra];
}

const OPENERS_1_TO_3 = ['## §1 · one', '## §2 · two', '## §3 · three'].join('\n');

describe('ledger citation integrity — the controls (each proves the instrument can RED)', () => {
  test('CONTROL: a citation with no opener and no alias is convicted', () => {
    const a = analyzeCorpus({
      files: corpus({ odq: `${OPENERS_1_TO_3}\n\nas ruled at §2 and at §999 the thing holds.\n` }),
      aliases: [],
    });
    // §999 is above the high-water mark §3, so it lands in beyondLedger; the
    // hole class is for numbers the ledger has already passed.
    expect(a.beyondLedger.map((d) => d.number)).toEqual([999]);

    const b = analyzeCorpus({
      files: corpus({ odq: `${OPENERS_1_TO_3}\n## §9 · nine\n\nas ruled at §2 and at §5 the thing holds.\n` }),
      aliases: [],
    });
    expect(b.dangling.map((d) => d.number)).toEqual([5]);
    expect(b.dangling[0].occurrences).toBe(1);
    expect(b.dangling[0].sites[0]).toMatchObject({ file: 'docs/OWNER_DECISION_QUEUE.md', line: 6 });
  });

  test('CONTROL: the same number acquits the moment its opener exists', () => {
    const before = analyzeCorpus({
      files: corpus({ odq: `${OPENERS_1_TO_3}\n## §9 · nine\n\nsee §5.\n` }),
      aliases: [],
    });
    expect(before.dangling.map((d) => d.number)).toEqual([5]);

    const after = analyzeCorpus({
      files: corpus({ odq: `${OPENERS_1_TO_3}\n## §5 · five\n## §9 · nine\n\nsee §5.\n` }),
      aliases: [],
    });
    expect(after.dangling).toEqual([]);
  });

  test('CONTROL: an alias whose proof string has rotted is a failure, not a silence', () => {
    const alias = {
      numbers: [5],
      kind: 'design-only',
      proof: { file: 'docs/OWNER_DECISION_QUEUE.md', contains: 'THE PROOF SENTENCE' },
      why: 'test alias',
    };
    const proved = analyzeCorpus({
      files: corpus({ odq: `${OPENERS_1_TO_3}\n## §9 · nine\n\nTHE PROOF SENTENCE — see §5.\n` }),
      aliases: [alias],
    });
    expect(proved.aliasFailures).toEqual([]);
    expect(proved.dangling).toEqual([]);

    const rotted = analyzeCorpus({
      files: corpus({ odq: `${OPENERS_1_TO_3}\n## §9 · nine\n\nsee §5.\n` }),
      aliases: [alias],
    });
    expect(rotted.aliasFailures.map((f) => f.kind)).toEqual(['ALIAS_PROOF_ROTTED']);
  });

  test('CONTROL: a combined-header alias whose target is not an opener is a failure', () => {
    const a = analyzeCorpus({
      files: corpus({ odq: `${OPENERS_1_TO_3}\n## §9 · nine\n\nPROOF — see §5.\n` }),
      aliases: [
        {
          numbers: [5],
          kind: 'combined-header',
          target: 4, // §4 has no opener: the alias would be hiding a real hole
          proof: { file: 'docs/OWNER_DECISION_QUEUE.md', contains: 'PROOF' },
          why: 'test alias',
        },
      ],
    });
    expect(a.aliasFailures.map((f) => f.kind)).toEqual(['ALIAS_TARGET_MISSING']);
  });

  test('CONTROL: an alias for a number that has gained a real opener is a DEAD_ALIAS', () => {
    const a = analyzeCorpus({
      files: corpus({ odq: `${OPENERS_1_TO_3}\n## §5 · five\n## §9 · nine\n\nPROOF — see §5.\n` }),
      aliases: [
        {
          numbers: [5],
          kind: 'design-only',
          proof: { file: 'docs/OWNER_DECISION_QUEUE.md', contains: 'PROOF' },
          why: 'test alias',
        },
      ],
    });
    expect(a.aliasFailures.map((f) => f.kind)).toEqual(['DEAD_ALIAS']);
  });

  test('CONTROL: a forward reference above the high-water mark is reported, never ratcheted', () => {
    // The estate plans its next section by name: docs/OPUS_CHAIR_MANUAL.md §6.9
    // was "The §920 landing chain" while the ledger's high-water mark was §919,
    // and §920 was cited thirteen times before it was written. Ratcheting that
    // would red on every planning document.
    const a = analyzeCorpus({
      files: corpus({ odq: `${OPENERS_1_TO_3}\n\nthe §4 landing chain comes next.\n` }),
      aliases: [],
    });
    expect(a.highWater).toBe(3);
    expect(a.dangling).toEqual([]);
    expect(a.beyondLedger.map((d) => d.number)).toEqual([4]);
  });
});

describe('ledger citation integrity — the live ledger estate', () => {
  const { source, files } = resolveCorpus({});
  const analysis = analyzeCorpus({ files });

  test('the alias table still proves itself against the live corpus', () => {
    expect(analysis.aliasFailures).toEqual([]);
    // Every alias carries a checkable proof — never a bare comment.
    for (const alias of ALIASES) {
      expect(alias.proof?.file, `alias ${alias.numbers[0]} needs a proof file`).toBeTruthy();
      expect(alias.proof?.contains, `alias ${alias.numbers[0]} needs a proof string`).toBeTruthy();
      expect(alias.why, `alias ${alias.numbers[0]} needs a reason`).toBeTruthy();
    }
  });

  test('ONLY-SHRINKS: no dangling § number outside the baseline', () => {
    const found = analysis.dangling.map((d) => d.number);
    const novel = found.filter((n) => !baselinedHoles.has(n));
    expect(
      novel,
      `NEW dangling § citation(s) in ${source}. A section is cited that was never written — `
        + 'the §683 class (ODQ §685.5(vi), §920). Either write the section, or name its '
        + 'authoritative home in the ledger and add a PROVED alias to ALIASES in '
        + `scripts/audit/ledger-citations.mjs. Sites: ${JSON.stringify(
          analysis.dangling.filter((d) => novel.includes(d.number)).flatMap((d) => d.sites.slice(0, 3)),
        )}`,
    ).toEqual([]);
  });

  test('ONLY-SHRINKS: every baselined number is still cited — delete its entry when it clears', () => {
    const found = new Set(analysis.dangling.map((d) => d.number));
    const cleared = [...baselinedHoles].filter((n) => !found.has(n)).sort((a, b) => a - b);
    expect(
      cleared,
      `§${cleared.join(', §')} no longer dangles. The ratchet only shrinks: delete `
        + `the entr${cleared.length === 1 ? 'y' : 'ies'} from tests/lint/.ledger-citation-baseline.json.`,
    ).toEqual([]);
  });

  test('the numbering is complete below the high-water mark, except the baselined holes and the proved aliases', () => {
    const openers = new Set(analysis.openers);
    const aliased = new Set(ALIASES.flatMap((a) => a.numbers));
    const missing = [];
    for (let n = 0; n <= analysis.highWater; n += 1) {
      if (!openers.has(n) && !aliased.has(n) && !baselinedHoles.has(n)) missing.push(n);
    }
    expect(
      missing,
      'a ledger number below the high-water mark has no opener, no alias and no baseline entry — '
        + 'the ledger skipped it. This arm sees a hole even when nothing cites it yet.',
    ).toEqual([]);
  });
});
