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
 * ── THE ANTI-VACUITY GUARD (CLERK-LAWS §2.4, as §2.4.1 amends the roster to SIX) ────
 * An instrument that passes a corpus it has never once failed measures nothing. So the
 * walker is run over the shipped corpus and MUST fail on the known breaches, each with
 * the class the sitting assigned it. And because "it failed" is not the same as "the arm
 * did the work", every breach carries a MUTATION control: the same sentence with the one
 * offending word removed must stop failing on that arm. A detector that reds on everything
 * is as useless as one that reds on nothing.
 *
 * ⛔ THE SUCCESSOR PLAN, WRITTEN DOWN BEFORE IT IS NEEDED — because this file is designed to
 * RED at the moment the reconstruction wave does its job. Every anchor below is a SHIPPED
 * BREACH, and the wave's whole purpose is to cure shipped breaches. The first wave car that
 * rewrites `newsVoice.js:97`, `RECEIPT_POOLS_DOSSIER_STATE.md:5233`, its leaf twin
 * `general.generated.js:855` or `factionDynamics.js:466` reds this file twice: once with the
 * named "the breach text is no longer in the corpus" message, and once at the census bound
 * `failing > FAILING_FLOOR`. Neither red is a defect. THE PROCEDURE, in the order a wave car
 * must follow it:
 *
 *   1. NAME THE REPLACEMENT ANCHOR IN THE SAME CAR. An anchor is any shipped sentence that
 *      the arm fails on and that the wave is not about to cure. `armCandidates()` below
 *      prints live candidates per arm from the corpus itself, so the replacement is chosen by
 *      measurement rather than by memory. A car that cures an anchor and adds none has taken
 *      the guard's teeth out.
 *   2. LOWER `FAILING_FLOOR` DELIBERATELY, by the number of entries the car actually cured,
 *      and record the new value with the car's sha. The floor is a FLOOR the wave walks down
 *      on purpose — never a number edited to make a suite green.
 *   3. RE-RUN THE MUTATION CONTROL on every surviving anchor. A cure that silences an arm
 *      everywhere is a broken arm wearing a cured corpus's coat.
 *
 * The end state is a corpus with no FAIL at all, at which point this guard's anti-vacuity
 * arms move to a FIXTURE corpus and the shipped-corpus assertion becomes `failing === 0` —
 * CLERK-LAWS §2.5's second gate, which is the freeze's and not this lane's.
 *
 * @see src/domain/prose/entryWalker.js
 * @see tests/fixtures/brackwaterTables.js
 */
import { describe, expect, it } from 'vitest';
import { verdictOf, walkEntry, walkPair } from '../../src/domain/prose/entryWalker.js';
import { BAND_PHRASES, OFFICE_NOUN_CANDIDATES } from '../../src/domain/prose/entryLexicons.js';
import { estateGround, withEntryContext } from '../../src/domain/prose/entryGround.js';
import { QUANTITY_BANDS } from '../../src/domain/worldPulse/demographicsHerald.js';
import { UNMOUNTED_BLOCKS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { FACTION_ROLES } from '../../src/generators/factionRoles.js';
import * as ROLE_CATALOG from '../../src/generators/npc/factionRoleCatalog.js';
import { POWER_ROLES_BY_CATEGORY } from '../../src/data/historyData.js';
import { ROLE_CATEGORY_KEYWORDS } from '../../src/generators/roleCategory.js';
import {
  BRACKWATER_ENTRY, GENDER_FIXTURE, POSITIVE_CONTROLS,
  TABLE_CLOSED, TABLE_EMPTY, TABLE_FULL, TABLE_ROW_CLOSED,
} from '../fixtures/brackwaterTables.js';
import {
  joinAnnexToLeaves, loadCausalLeaf, loadCrierVoice, loadInFunctionNarratives, loadNpcLadder,
  loadStateAnnex, loadStateLeaves, poolCells,
} from '../helpers/dossierCorpus.js';
import { composedFillByBlock, fillSites } from '../helpers/dossierComposedFill.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

/**
 * The estate's OFFICE roster, DERIVED from EVERY role source rather than transcribed.
 *
 * ⛔ TWO OF THE FOUR SOURCES WERE MISSING, AND THE WALKER CALLED A LIVE OFFICE ABSENT. The
 * first cut read `factionRoles.js` and `npc/factionRoleCatalog.js` — 35 roles — and on that
 * ground the estate's C2 arm reported three crier lines (`VOICE_LINES::authority::onset#3`,
 * `::relief#3`, `::fade#3`) as "an office the world does not hold" for the noun `reeve`. The
 * world holds it: `historyData.js:119` carries `{role: 'Reeve', title: 'overseer'}` in
 * `POWER_ROLES_BY_CATEGORY`, consumed by two generators, and `roleCategory.js:34` carries
 * `reeve` in `ROLE_CATEGORY_KEYWORDS.government`. MEASURED: the union takes the roster from
 * 35 to 249 and the candidate nouns it calls absent from 25 of 37 down to 12 — and the census
 * row `C2 · an office the world does not hold` from 3 to 0. Those three were the only three,
 * so SITTING K.6's "the live breaches are SEVEN" loses its three crier lines and returns to
 * A6's FOUR. `bailiff` stays absent, which is the Brackwater lesson intact.
 *
 * ⚠ THE FOURTH SOURCE IS UNREACHABLE BY IMPORT AND IS DECLARED RATHER THAN SKIPPED.
 * `npcGenerator.js`'s `ROLE_FACTION_MAP` is a function-local `const` inside `mergeNPCLists`
 * (`:1002`) with no export, so no test can read it. `roleCategory.js`'s own header says the
 * two "share the same vocabulary", and the keyword table IS imported here — so the vocabulary
 * is covered even though the map is not.
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
  for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)) {
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      if (row?.role) roles.add(row.role);
      if (row?.title) roles.add(row.title);
    }
  }
  for (const list of Object.values(ROLE_CATEGORY_KEYWORDS)) {
    for (const keyword of list) roles.add(keyword);
  }
  return [...roles].sort();
}

/**
 * THE CENSUS BOUND, as a named FLOOR the wave walks down on purpose (cure 17's step 2).
 *
 * It is `> 4` because the sitting's own LIVE BREACHES list is four; the walk must find more
 * than the list it was told about, or it is a hard-coded roster wearing a walker's coat. A
 * wave car that cures N entries lowers this by N and records the new value with its sha.
 */
const FAILING_FLOOR = 4;

/**
 * LIVE REPLACEMENT ANCHORS PER ARM, printed from the corpus itself — cure 17's step 1.
 *
 * A wave car that cures an anchor must NAME its replacement in the same car, and choosing one
 * from memory is how a guard quietly loses its teeth. This reads the shipped corpus and
 * reports, per arm, how many entries currently fail on it and three ids to choose from.
 * @param {ReadonlyArray<import('../../src/domain/prose/entryWalker.js').ProseEntry>} corpus
 * @param {import('../../src/domain/prose/entryWalker.js').EntryGround} ground
 * @returns {Array<{arm: string, count: number, candidates: string[]}>}
 */
function armCandidates(corpus, ground) {
  /** @type {Map<string, string[]>} */
  const byArm = new Map();
  for (const entry of corpus) {
    for (const finding of walkEntry(entry, ground).fails) {
      if (!byArm.has(finding.arm)) byArm.set(finding.arm, []);
      /** @type {string[]} */ (byArm.get(finding.arm)).push(entry.id);
    }
  }
  return [...byArm].map(([arm, ids]) => ({ arm, count: ids.length, candidates: ids.slice(0, 3) }))
    .sort((a, b) => b.count - a.count);
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

  it('takes the union of EVERY role source, so a live office is not called absent', async () => {
    const roster = deriveOfficeRoster();
    // `reeve` is held twice over — as a POWER role with a title, and as a government keyword.
    expect(roster.some((role) => /reeve/i.test(role))).toBe(true);
    // The union is materially larger than the two-catalogue roster, or the fix is cosmetic.
    expect(roster.length).toBeGreaterThan(200);
    const absent = OFFICE_NOUN_CANDIDATES.filter((noun) => !roster.some((role) => role.toLowerCase().includes(noun)));
    console.log(`\nOFFICE ROSTER · union of four sources (one unreachable by import)\n`
      + `  roster ${roster.length} · candidates ${OFFICE_NOUN_CANDIDATES.length}`
      + ` · still absent ${absent.length}: ${absent.join(' · ')}\n`);
    // 25 of 37 candidates were called absent on the 35-role ground; 12 remain, and `bailiff`
    // is one of them.
    expect(absent.length).toBe(12);
    expect(absent).toContain('bailiff');

    // THE ARM CURE 1 NAMES: the three crier lines return no C2 office fail.
    const base = estateGround({ officeRoster: roster });
    const crier = await loadCrierVoice();
    const lines = ['VOICE_LINES::authority::onset#3', 'VOICE_LINES::authority::relief#3', 'VOICE_LINES::authority::fade#3']
      .map((id) => crier.find((entry) => entry.id === id));
    // PRESENT-THEN-ABSENT, in one call per line: the SAME sentence fails on the old
    // two-catalogue ground and falls silent on the union, so the silence is the roster's
    // doing and not a dead arm.
    /** @type {Set<string>} */
    const narrow = new Set();
    for (const list of Object.values(FACTION_ROLES)) for (const row of list) if (row.role) narrow.add(row.role);
    for (const value of Object.values(ROLE_CATALOG)) {
      if (!Array.isArray(value)) continue;
      for (const row of value) { if (row?.role) narrow.add(row.role); if (row?.title) narrow.add(row.title); }
    }
    const narrowGround = estateGround({ officeRoster: [...narrow].sort() });
    for (const [i, entry] of lines.entries()) {
      expect(entry, `the crier line is gone from the corpus: ${i}`).toBeTruthy();
      expectPresentThenAbsent(
        walkEntry(entry, withEntryContext(narrowGround, {})).fails.map((f) => f.arm),
        walkEntry(entry, withEntryContext(base, {})).fails.map((f) => f.arm),
        'an office the world does not hold',
        `${entry.id} (the 35-role ground calls \`reeve\` absent; the union holds it)`,
      );
    }
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

  it('ANCHOR 6 (CLERK-LAWS §2.4.1) — the shipped gendered R6 lines drive C3 arm (a), present-then-absent', async () => {
    const base = estateGround({ officeRoster: deriveOfficeRoster() });
    const ladder = await loadNpcLadder();
    const male = ladder.filter((row) => /\bhis\b/i.test(row.text) && !/\bher\b/i.test(row.text));
    // The anchor is SHIPPED material, and there is a lot of it: 121 male-pronoun rows of
    // 1,662. A single hand-picked line would be a fixture wearing a corpus's coat.
    expect(male.length).toBeGreaterThan(50);
    const anchor = male[0];
    // PRESENT-THEN-ABSENT: the bearer's typed gender contradicts the pronoun and the arm
    // fails; the matching gender and the same shipped line falls silent.
    expectPresentThenAbsent(
      walkEntry(anchor, { ...base, gender: 'female' }).fails.map((f) => f.arm),
      walkEntry(anchor, { ...base, gender: 'male' }).fails.map((f) => f.arm),
      'pronoun contradicts the bearer\'s gender',
      `${anchor.id} (CLERK-LAWS §2.4.1 anchor 6 — the shipped gendered R6 lines)`,
    );
    // AND WITH NO GENDER FIELD the arm says so rather than passing — which is the ladder's
    // actual state today: R6 rows carry no bearer gender at all.
    expect(walkEntry(anchor, base).notExecutable.map((f) => f.arm))
      .toContain('pronoun vs gender (no gender given)');
  });

  it('ANCHOR 5 (CLERK-LAWS §2.4.1) — the C3-LEXICAL class, and why the census reads ZERO C3 findings', async () => {
    const base = estateGround({ officeRoster: deriveOfficeRoster() });
    const leaves = await loadStateLeaves();
    const { joined } = joinAnnexToLeaves(loadStateAnnex(), leaves);

    // ⛔ THE ANCHOR §2.4.1 NAMES DOES NOT FIRE, AND THAT IS REPORTED RATHER THAN PATCHED.
    // `RECEIPT_POOLS_DOSSIER_STATE.md:2247` is the `[counterforce]` turtling row under an
    // `economicBase: extraction` header (SITTING A5). Measured at this tip, against every
    // value of the provenance flag, it fires NO arm of this walker: its defect is a pool-key
    // SCOPE fault (a military-doctrine sentence under an economic-base key — R-DA-19), and
    // this walker carries no scope arm. So it cannot serve as a C3-lexical anchor, and the
    // roster's fifth entry is NOT-EXECUTABLE with its reason rather than silently absent.
    const row = joined.find((r) => r.line === 2247);
    expect(row, 'RECEIPT_POOLS_DOSSIER_STATE.md:2247 did not load').toBeTruthy();
    for (const eventProvenance of [true, false]) {
      expect(walkEntry(row, withEntryContext(base, { eventProvenance })).fails).toEqual([]);
    }

    // ⭐ SO THE CLASS IS ANCHORED WHERE IT ACTUALLY LIVES, AND THE ZERO IS EXPLAINED. The C3
    // class reports zero findings over 3,132 entries not because the arm is dark but because
    // the corpus walk supplies no per-block `eventProvenance` flag, so the lexical half
    // declares itself NOT-EXECUTABLE. Supply the flag and the SAME shipped entries fail:
    // 44 of them, on the same 44 the flagless walk reports not-executable.
    const corpus = [...leaves, ...await loadCausalLeaf(), ...await loadCrierVoice(), ...loadInFunctionNarratives()];
    let notExecutable = 0;
    let fails = 0;
    /** @type {string[]} */
    const anchors = [];
    for (const entry of corpus) {
      if (walkEntry(entry, withEntryContext(base, {})).notExecutable
        .some((f) => f.klass === 'C3' && f.arm.startsWith('provenance'))) notExecutable += 1;
      const failed = walkEntry(entry, withEntryContext(base, { eventProvenance: false })).fails
        .filter((f) => f.klass === 'C3');
      if (failed.length) { fails += 1; if (anchors.length < 3) anchors.push(`${entry.id} — ${failed[0].arm}`); }
    }
    console.log(`\nC3-LEXICAL · the class the census reads as ZERO\n`
      + `  entries carrying a provenance-class phrase: ${notExecutable} (NOT-EXECUTABLE without the flag)\n`
      + `  the same entries WITH \`eventProvenance: false\`: ${fails} FAIL\n`
      + `${anchors.map((a) => `    ${a}`).join('\n')}\n`);
    // The two figures are the same 44 entries seen twice, which is the whole explanation.
    expect(notExecutable).toBe(44);
    expect(fails).toBe(44);
    // PRESENT-THEN-ABSENT on one of them, so the arm is proved rather than counted.
    const anchor = corpus.find((entry) => walkEntry(entry, withEntryContext(base, { eventProvenance: false }))
      .fails.some((f) => f.klass === 'C3'));
    expectPresentThenAbsent(
      walkEntry(anchor, withEntryContext(base, { eventProvenance: false })).fails.map((f) => f.klass),
      walkEntry(anchor, withEntryContext(base, { eventProvenance: true })).fails.map((f) => f.klass),
      'C3',
      `${anchor.id} (the flag is the licence: a provenance claim is lawful where the block carries the field)`,
    );
  });

  it('prints LIVE REPLACEMENT ANCHORS per arm, so a wave car can choose one by measurement', async () => {
    const base = estateGround({ officeRoster: deriveOfficeRoster() });
    const corpus = [
      ...await loadStateLeaves(), ...await loadCrierVoice(), ...loadInFunctionNarratives(),
    ];
    const rows = armCandidates(corpus, withEntryContext(base, {}));
    console.log(`\nANTI-VACUITY · live replacement anchors, per arm (cure 17 step 1)\n${
      rows.map((r) => `  ${String(r.count).padStart(4)}  ${r.arm}\n${r.candidates.map((c) => `          ${c}`).join('\n')}`).join('\n')}\n`);
    // The procedure is only usable if the corpus actually offers alternatives on more than
    // one arm; a single-arm corpus would leave a wave car with nothing to swap in.
    expect(rows.length).toBeGreaterThan(2);
    expect(rows.every((r) => r.candidates.length > 0)).toBe(true);
    // And every one of the sitting's own arms must be findable this way, or the helper is
    // reporting a different corpus from the guard above.
    expect(rows.map((r) => r.arm)).toContain('exemption on a null column');
  });

  it('C-PAIR reads the WIRING per (block, pool): an added claim, a PRE-EXISTING one, and a cure', () => {
    const base = estateGround({ officeRoster: deriveOfficeRoster() });
    // The census row for ONE pool: its wiring fills {settlement} and nothing else.
    const wired = withEntryContext(base, {});
    wired.wiring = { status: 'RESOLVED', slotsFilled: ['settlement'], keyFunction: 'moodPoolKey' };
    const before = { id: 'p#0', text: 'The hall at {settlement} keeps the rolls.', slots: ['settlement'] };
    const after = { id: 'p#0', text: 'The {institution} at {settlement} keeps the rolls.', slots: ['institution', 'settlement'] };
    // ADDED: the AFTER names a slot this pool's wiring does not fill.
    const added = walkPair(before, after, wired);
    expect(added.withheldAdded.map((f) => f.arm)).toContain('PRE-EXISTING unlicensed');
    // PRE-EXISTING: the same claim in BOTH halves is the corpus's debt, not the rewrite's.
    const both = walkPair(after, after, wired);
    expect(both.withheldAdded).toEqual([]);
    // CURED: removing it is credited.
    const cured = walkPair(after, before, wired);
    expect(cured.withheldAdded).toEqual([]);
    // AN UNRESOLVED ROW MAKES THE ARM NOT-EXECUTABLE — never a pass, and never inferred from
    // the pool's own name.
    const dark = withEntryContext(base, {});
    dark.wiring = { status: 'WIRING-UNRESOLVED', reason: 'no key function returns this key as a literal' };
    const unresolved = walkPair(before, after, dark);
    expect(unresolved.notExecutable.map((f) => f.arm)).toContain('wiring licence (predicate not recovered)');
    expect(unresolved.withheldAdded).toEqual([]);
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
    // THE FLOOR, NAMED (cure 17's step 2): a wave car that cures N entries lowers it by N
    // and records the new value with its sha. It is not a number edited to make a suite green.
    expect(failing).toBeGreaterThan(FAILING_FLOOR);
    expect(failing).toBeLessThan(corpus.length / 4);
    expect(arms.size).toBeGreaterThanOrEqual(4);
    // Every limb that could not run says so rather than answering [] (the §908 law).
    expect(notExecutable).toBeGreaterThan(0);
  });
});
