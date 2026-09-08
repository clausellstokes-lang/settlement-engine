/**
 * proseEntryContradiction.walker.test.js — THE SAME-ENTRY CONTRADICTION WALKER's own gate.
 *
 * ── WHAT THIS FILE ASSERTS, AND WHAT IT DELIBERATELY DOES NOT ──────────────────────
 * It asserts that the INSTRUMENT works: that the four Brackwater tables produce exactly the
 * verdicts CLERK-LAWS §2.4 names, that the positive controls resolve, that the detectors key
 * on the word rather than on the sentence, and that a run over the SHIPPED corpus finds the
 * breaches the estate already knows about.
 *
 * ⛔ IT DOES NOT ASSERT THAT THE CORPUS IS CLEAN, and that is not an oversight. Four LIVE
 * BREACHES ship at this tip by the chair's own measurement, and a walker that reddened on
 * them would red the suite before the wave that cures them has run. The corpus gate belongs
 * at the FREEZE, after the reconstruction wave and the owner's walk (CLERK-LAWS §2.5: a
 * rewrite may not ADD a FAIL, and the corpus at the freeze may hold no FAIL — two different
 * gates). What ships today is the instrument and its proof.
 *
 * ── THE ANTI-VACUITY GUARD (CLERK-LAWS §2.4) ───────────────────────────────────────
 * An instrument that passes a corpus it has never once failed measures nothing. So the
 * walker is run over the shipped corpus and MUST fail on the four known breaches, each with
 * the class the sitting assigned it. And because "it failed" is not the same as "the arm
 * did the work", every breach carries a MUTATION control: the same sentence with the one
 * offending word removed must stop failing on that arm. A detector that reds on everything
 * is as useless as one that reds on nothing.
 *
 * @see src/domain/prose/entryWalker.js
 * @see tests/fixtures/brackwaterTables.js
 */
import { describe, expect, it } from 'vitest';
import { verdictOf, walkEntry } from '../../src/domain/prose/entryWalker.js';
import { BAND_PHRASES, OFFICE_NOUN_CANDIDATES } from '../../src/domain/prose/entryLexicons.js';
import { estateGround, withEntryContext } from '../../src/domain/prose/entryGround.js';
import { QUANTITY_BANDS } from '../../src/domain/worldPulse/demographicsHerald.js';
import { UNMOUNTED_BLOCKS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { FACTION_ROLES } from '../../src/generators/factionRoles.js';
import * as ROLE_CATALOG from '../../src/generators/npc/factionRoleCatalog.js';
import {
  BRACKWATER_ENTRY, GENDER_FIXTURE, POSITIVE_CONTROLS,
  TABLE_CLOSED, TABLE_EMPTY, TABLE_FULL, TABLE_ROW_CLOSED,
} from '../fixtures/brackwaterTables.js';
import {
  joinAnnexToLeaves, loadCausalLeaf, loadCrierVoice, loadInFunctionNarratives,
  loadStateAnnex, loadStateLeaves, poolCells,
} from '../helpers/dossierCorpus.js';
import { composedFillByBlock, fillSites } from '../helpers/dossierComposedFill.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

/**
 * The estate's OFFICE roster, DERIVED from the two role catalogues rather than transcribed.
 * A renamed role changes the ground; a hand-copied list would leave a stale literal behind
 * and the walker would judge against a world that no longer exists.
 * @returns {string[]}
 */
function deriveOfficeRoster() {
  /** @type {Set<string>} */
  const roles = new Set();
  for (const list of Object.values(FACTION_ROLES)) {
    for (const row of list) if (row.role) roles.add(row.role);
  }
  for (const value of Object.values(ROLE_CATALOG)) {
    if (!Array.isArray(value)) continue;
    for (const row of value) {
      if (row?.role) roles.add(row.role);
      if (row?.title) roles.add(row.title);
    }
  }
  return [...roles].sort();
}

/** @param {import('../../src/domain/prose/entryWalker.js').WalkResult} r */
const failArms = (r) => r.fails.map((f) => `${f.klass}/${f.arm}`).sort();
/** @param {import('../../src/domain/prose/entryWalker.js').WalkResult} r */
const quantifierFails = (r) => r.fails.filter((f) => f.arm === 'a totality over an open column');

describe('the same-entry contradiction walker — the published lexicons', () => {
  it('pins its transcribed band vocabulary against the engine\'s own QUANTITY_BANDS', () => {
    const engine = ['nobody', ...QUANTITY_BANDS.map(([, phrase]) => phrase)];
    expect(BAND_PHRASES).toEqual(engine);
  });

  it('carries `bailiff` as an office candidate and no office the estate actually holds', () => {
    const roster = deriveOfficeRoster();
    expect(roster.length).toBeGreaterThan(20);
    expect(OFFICE_NOUN_CANDIDATES).toContain('bailiff');
    // The Brackwater lesson's own measurement: no bailiff anywhere in the estate.
    expect(roster.some((role) => role.toLowerCase().includes('bailiff'))).toBe(false);
  });
});

describe('the four Brackwater tables (CLERK-LAWS §2.4 + SITTING B.4.7)', () => {
  it('(a) the product today — refuses the office, the duty, the exemption, the figure and both quantifiers', () => {
    const r = walkEntry(BRACKWATER_ENTRY, TABLE_EMPTY);
    expect(verdictOf(r)).toBe('FAIL');
    expect(failArms(r)).toEqual([
      'C1/a figure outside the closed vocabulary',
      'C2/a duty no institution carries',
      'C2/an office the world does not hold',
      'C2/an office the world does not hold',
      'C2/exemption on a null column',
      'C4/a totality over an open column',
      'C4/a totality over an open column',
    ]);
    // §2.4's WITHHELD on "goes upriver salted": the flow field and the chain row are the
    // licence, and neither is a corpus-wide read.
    expect(r.withheld.map((w) => w.arm)).toContain('a route claim on a goods sentence');
    expect(r.withheld.map((w) => w.arm)).toContain('a processing claim on a goods sentence');
  });

  it('(b) every row the owner might add — the nouns and predicates resolve; the quantifiers do not', () => {
    const r = walkEntry(BRACKWATER_ENTRY, TABLE_FULL);
    expect(r.fails.filter((f) => f.klass === 'C2')).toHaveLength(0);
    expect(quantifierFails(r)).toHaveLength(2);
    // ⚠ A DECLARED DEVIATION FROM §2.4's WORDING. The spec says (b) fails "on the two
    // quantifiers ONLY". It fails on three things: the two quantifiers and the FIGURE. No
    // table row can license "three hundred" — CLERK-LAWS §1.4 walks that clause itself and
    // answers "REFUSED as a figure … nothing more: the band word". The figure arm keys on
    // the closed vocabulary, not on the table, so no row the owner adds reaches it.
    expect(failArms(r)).toEqual([
      'C1/a figure outside the closed vocabulary',
      'C4/a totality over an open column',
      'C4/a totality over an open column',
    ]);
  });

  it('(c) the synthetic closed column — the quantifier arm falls silent, proving it keys on the flag', () => {
    const r = walkEntry(BRACKWATER_ENTRY, TABLE_CLOSED);
    expect(quantifierFails(r)).toHaveLength(0);
    expect(r.fails.filter((f) => f.klass === 'C2')).toHaveLength(0);
    // The figure fail persists here too, for the same reason as (b).
    expect(failArms(r)).toEqual(['C1/a figure outside the closed vocabulary']);
  });

  it('(d) rows closed at the ROW while the COLUMN is open — behaves exactly like (b)', () => {
    const rowClosed = walkEntry(BRACKWATER_ENTRY, TABLE_ROW_CLOSED);
    const full = walkEntry(BRACKWATER_ENTRY, TABLE_FULL);
    expect(quantifierFails(rowClosed)).toHaveLength(2);
    expect(failArms(rowClosed)).toEqual(failArms(full));
    // The fixture is only worth having if the two tables actually differ.
    expect(TABLE_ROW_CLOSED.rows?.every((row) => row.closed === true)).toBe(true);
    expect(TABLE_ROW_CLOSED.columns.whoIsCounted.closed).toBe(false);
  });

  it('the four tables are not all the same table (the fixture set discriminates)', () => {
    const sets = [TABLE_EMPTY, TABLE_FULL, TABLE_CLOSED, TABLE_ROW_CLOSED]
      .map((t) => failArms(walkEntry(BRACKWATER_ENTRY, t)).join('|'));
    expect(new Set(sets).size).toBeGreaterThan(2);
  });
});

describe('the positive controls — a licensed sentence must resolve', () => {
  for (const control of POSITIVE_CONTROLS) {
    it(`passes: ${control.why}`, () => {
      const entry = {
        id: control.id,
        text: control.text,
        slots: [...control.text.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]),
      };
      const r = walkEntry(entry, TABLE_EMPTY);
      expect(r.fails).toEqual([]);
      expect(verdictOf(r)).not.toBe('FAIL');
    });
  }

  it('the NL-4 gender fixture fails on one bearer and passes on the other', () => {
    const verdicts = GENDER_FIXTURE.map((f) => verdictOf(
      walkEntry({ id: f.id, text: f.text }, { ...TABLE_EMPTY, gender: f.gender }),
    ));
    expect(verdicts).toEqual(GENDER_FIXTURE.map((f) => f.expect));
    // One line, two bearers, two verdicts: the arm reads the FIELD, not the sentence.
    expect(new Set(GENDER_FIXTURE.map((f) => f.text)).size).toBe(1);
  });
});

describe('the corpus loaders — fail-closed, and counted against the probe', () => {
  it('loads every home and reproduces the projection\'s own arithmetic', async () => {
    const leaves = await loadStateLeaves();
    const causal = await loadCausalLeaf();
    const crier = await loadCrierVoice();
    const generator = loadInFunctionNarratives();
    // PROBE_ALL X1: 2,734 leaves in 786 pools over the two dossier corpora.
    expect(leaves.length + causal.length).toBe(2734);
    expect(new Set([...leaves, ...causal].map((e) => e.poolId)).size).toBe(786);
    expect(new Set(leaves.map((e) => e.block)).size).toBe(68);
    expect(crier.length).toBeGreaterThan(300);
    expect(generator.length).toBeGreaterThan(0);
  });

  it('joins every annex row to its projected twin, so a breach can be cited by line', async () => {
    const leaves = await loadStateLeaves();
    const { joined, unjoined, leafLines } = joinAnnexToLeaves(loadStateAnnex(), leaves);
    // PROBE_ALL R-4: 2,030 wired DOSSIER_STATE rows.
    expect(joined.length).toBe(2030);
    expect(unjoined).toEqual([]);
    // The compact-row grammar (a whole pool on one bullet line, 225 variants) carries no
    // per-row address, so not every leaf variant has an annex line. That gap is the ADDRESS
    // reader's, is declared, and is why the pool grammar stays with the projection.
    expect(leafLines.size).toBeLessThan(leaves.length);
    expect(leafLines.size).toBe(2030);
  });
});

describe('the composed-fill resolver — measured against an orthogonal witness', () => {
  it('resolves every readStateProse call site with nothing left unread', () => {
    const sites = fillSites();
    expect(sites.length).toBeGreaterThan(30);
    expect(sites.filter((s) => s.unresolved.length).map((s) => `${s.file}:${s.line} ${s.unresolved.join('; ')}`)).toEqual([]);
    expect(sites.every((s) => s.block !== '(parameterised)')).toBe(true);
  });

  it('finds exactly the blocks the mount registry already calls unmounted', async () => {
    const leaves = await loadStateLeaves();
    const byBlock = composedFillByBlock(fillSites());
    const blocks = [...new Set(leaves.map((e) => e.block))].sort();
    const noBag = blocks.filter((b) => !byBlock.has(b));
    // ⭐ TWO INDEPENDENT WITNESSES, ONE ANSWER. `UNMOUNTED_BLOCKS` is a hand-maintained,
    // shrink-only registry of the corpus's darkness; this list is derived by resolving every
    // composer's slot bag from source and asking which blocks no bag serves. They agree
    // exactly. If the resolver ever goes dark it will disagree, loudly.
    expect(noBag.slice().sort()).toEqual([...UNMOUNTED_BLOCKS].sort());
    expect(noBag.length).toBe(15);
  });

  it('reads the three bags the reconciliation measured by hand', () => {
    const byBlock = composedFillByBlock(fillSites());
    // powerStateProse's `line5`: the source says {institution}, {route} and {good} are
    // deliberately absent from DS-POW-5's bag, and the resolver reads exactly that.
    expect(byBlock.get('DS-POW-5')?.slots).toEqual(['seat', 'settlement']);
    // generalStateProse's `craftSlots`: {resource} IS in the bag, conditionally — the slot
    // the source's twenty-line note exists to explain.
    expect(byBlock.get('DS-GEN-18')?.slots).toEqual(['good', 'institution', 'resource', 'settlement']);
    expect(byBlock.get('DS-GEN-18')?.conditional).toContain('resource');
    // economyStateProse's `exploitSlots`: the per-lens override reaches the kernel through a
    // helper PARAMETER, and the resolver follows it.
    expect(byBlock.get('DS-ECO-11')?.slots).toEqual(
      ['access', 'complexity', 'good', 'institution', 'resource', 'season', 'settlement'],
    );
  });
});

describe('THE ANTI-VACUITY GUARD — the walker must fail on the corpus it ships beside', () => {
  /**
   * The four LIVE BREACHES the chair's sitting confirmed at this tip (SITTING A6), each with
   * the class it was assigned and the one word the arm must be keying on.
   */
  const BREACHES = [
    {
      where: 'src/domain/display/newsVoice.js:97',
      find: 'every household is counted for the levy',
      arm: 'a totality over an open column',
      word: 'every household',
      cure: 'the households are counted for the levy',
    },
    {
      where: 'src/data/dossierStateProse/general.generated.js:855 (the leaf twin)',
      find: 'the same trades exempt',
      arm: 'exemption on a null column',
      word: 'exempt',
      cure: 'the same trades listed',
    },
    {
      where: 'src/generators/factionDynamics.js:466',
      find: 'Church land exemptions',
      arm: 'exemption on a null column',
      word: 'exemptions',
      cure: 'Church land holdings',
    },
  ];

  it('reds on all four shipped breaches, each in its assigned class', async () => {
    const base = estateGround({ officeRoster: deriveOfficeRoster() });
    const leaves = await loadStateLeaves();
    const corpus = [...leaves, ...await loadCrierVoice(), ...loadInFunctionNarratives()];
    for (const breach of BREACHES) {
      const entry = corpus.find((e) => e.text.includes(breach.find));
      expect(entry, `the breach text is no longer in the corpus: ${breach.where}`).toBeTruthy();
      const arms = walkEntry(entry, withEntryContext(base, {})).fails.map((f) => f.arm);
      expect(arms, `${breach.where} must fail on ${breach.arm}`).toContain(breach.arm);
    }
    // The fourth: the ANNEX row, cited by its own line number.
    const annexRow = joinAnnexToLeaves(loadStateAnnex(), leaves).joined
      .find((row) => row.line === 5233);
    expect(annexRow, 'RECEIPT_POOLS_DOSSIER_STATE.md:5233 did not load').toBeTruthy();
    expect(walkEntry(annexRow, withEntryContext(base, {})).fails.map((f) => f.arm))
      .toContain('exemption on a null column');
  });

  it('stops reding when the offending word goes — the arm keys on the word, not the sentence', async () => {
    const base = estateGround({ officeRoster: deriveOfficeRoster() });
    const corpus = [
      ...await loadStateLeaves(), ...await loadCrierVoice(), ...loadInFunctionNarratives(),
    ];
    for (const breach of BREACHES) {
      const entry = corpus.find((e) => e.text.includes(breach.find));
      const cured = { ...entry, text: entry.text.replace(breach.find, breach.cure) };
      const before = walkEntry(entry, withEntryContext(base, {})).fails.map((f) => f.arm);
      const after = walkEntry(cured, withEntryContext(base, {})).fails.map((f) => f.arm);
      // PRESENT-THEN-ABSENT, not a bare absence: the arm must fire on the shipped sentence
      // AND fall silent on the cured one. A bare "the cure passes" would pass just as
      // happily if the arm had stopped working altogether.
      expectPresentThenAbsent(before, after, breach.arm, breach.where);
    }
  });

  it('finds the breaches the sitting did NOT name, and prints the corpus census', async () => {
    const base = estateGround({ officeRoster: deriveOfficeRoster() });
    const leaves = await loadStateLeaves();
    const causal = await loadCausalLeaf();
    const cells = poolCells([...leaves, ...causal]);
    const byBlock = composedFillByBlock(fillSites());
    const corpus = [
      ...leaves, ...causal, ...await loadCrierVoice(), ...loadInFunctionNarratives(),
    ];
    /** @type {Map<string, number>} */
    const arms = new Map();
    let failing = 0;
    let withheld = 0;
    let notExecutable = 0;
    for (const entry of corpus) {
      const bag = byBlock.get(entry.block);
      const result = walkEntry(entry, withEntryContext(base, {
        siblings: (cells.get(entry.poolId) || []).filter((s) => s.id !== entry.id),
        ...(bag ? { fill: { declared: [], variantUnion: [], composed: bag.slots } } : {}),
      }));
      if (result.fails.length) failing += 1;
      withheld += result.withheld.length;
      notExecutable += result.notExecutable.length;
      for (const f of result.fails) arms.set(`${f.klass} · ${f.arm}`, (arms.get(`${f.klass} · ${f.arm}`) || 0) + 1);
    }
    const census = [...arms].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v.toString().padStart(4)}  ${k}`).join('\n');
    console.log(`\nENTRY WALKER · corpus census over ${corpus.length} entries\n`
      + `  entries with a FAIL: ${failing}\n  WITHHELD findings: ${withheld}\n`
      + `  NOT-EXECUTABLE limbs: ${notExecutable}\n${census}\n`);
    // The instrument must find MORE than the four the sitting named, or it is a hard-coded
    // list wearing a walker's coat; and it must not red on everything, or it measures noise.
    expect(failing).toBeGreaterThan(4);
    expect(failing).toBeLessThan(corpus.length / 4);
    expect(arms.size).toBeGreaterThanOrEqual(4);
    // Every limb that could not run says so rather than answering [] (the §908 law).
    expect(notExecutable).toBeGreaterThan(0);
  });
});
