/**
 * domain/prose/entryWalker.js — THE SAME-ENTRY CONTRADICTION WALKER (CLERK-LAWS §2).
 *
 * ── WHAT IT IS ──────────────────────────────────────────────────────────────────────
 * `check-pair.mjs` is the PAIR instrument: a rewrite's BEFORE against its AFTER. This is
 * the ENTRY instrument: ONE rendered unit against its OWN typed facts and its siblings,
 * with no BEFORE needed. The gap it closes is the one R-DA-20 measured and named — the
 * pair checker tests no claim against a FIELD. Six typed classes:
 *
 *   C1 a count vs a count          C4 a modality spent (B-CLAIM)
 *   C2 a duty vs an exemption      C5 sibling vs sibling
 *   C3 a state vs its provenance   C6 a relation gestured at
 *
 * ── THE THREE CHANNELS (CLERK-LAWS §2.3; the chair's 13:22 ruling) ─────────────────
 *   FAIL     an assertion that resolves to NO field or to a NULL column; a quantifier
 *            over an OPEN column; a typed fact contradicted inside the cell.
 *   WITHHELD the semantic half — is this clause historical? does the rejected alternative
 *            name what a sibling band supplies? — REPORTED with the field consulted, ruled
 *            on by the refuter, and NEVER counted as a pass.
 *   NOTE     a pre-existing debt the entry neither causes nor cures, and the audience mark.
 *
 * A fourth outcome exists and is the §908 law made executable: **NOT-EXECUTABLE**. A limb
 * keyed on a field the ground does not carry declares itself not-executable and says which
 * field it wanted, instead of answering `[]` and reading as a pass. Every run prints them.
 *
 * ── THE TWO SCOPES, AND WHY THE SPLIT IS LOAD-BEARING ──────────────────────────────
 * A pool VARIANT is not bound to a settlement — it is a sentence the corpus holds for any
 * town whose state selects it. So a corpus-wide run cannot consult a per-settlement row,
 * and a walker that pretended otherwise would be inventing a table. The ground therefore
 * declares its `scope`:
 *
 *   `'estate'`      the facts that hold on EVERY settlement the product can generate:
 *                   persons are never closed; `whoIsExempt` is null everywhere; an office
 *                   noun absent from the whole estate is absent from every table. These
 *                   limbs run over the corpus at the freeze.
 *   `'settlement'`  a real (or fixture) institution table for ONE town: every limb runs.
 *
 * A limb whose scope the ground cannot serve is NOT-EXECUTABLE, never a pass.
 *
 * ── WHERE IT RUNS (CLERK-LAWS §2.5) ────────────────────────────────────────────────
 * At the GATE (`tests/lint/proseEntryContradiction.walker.test.js`) and in the projection's
 * `--check`. NEVER at the draw. `stateProseKernel.drawVariant` is
 * `eligible[avalanche32(fnv1a32(seed::blockId::poolKey)) % eligible.length]`, so a
 * draw-time refusal would change `eligible` and move every later index — a SEED INPUT
 * under THE PROMISE, owner-gated. A refused variant is rewritten IN PLACE at the freeze;
 * the pool's length and key never move (A7/A17). This module imports nothing from the
 * kernel and the kernel imports nothing from here.
 *
 * ── WHAT IT IS NOT ─────────────────────────────────────────────────────────────────
 * Not a detector (fault 33): it measures resolution against fields, never perplexity. Not
 * an order instrument — order is the B-GRAMMAR walker's, and the two must stay apart or a
 * claim rule will be mistaken for a shape rule. Not a runtime consistency checker:
 * `domain/validation/consistency.js` and `domain/contradictions.js` are display-trust and
 * narrative-tension paths and this is a build-time instrument over TEXT against FIELDS. It
 * shares their record shape so a report can render in the same UI; wiring it into either
 * path is a product surface and an owner decision.
 *
 * ── HONEST LIMITS, STATED SO THEY CANNOT BE MISREAD ────────────────────────────────
 * The detectors are word lists (`entryLexicons.js`, published). They find CANDIDATES; the
 * table judges. A candidate the lists miss is a miss, and the lists are argued with by
 * editing that file. Clause attribution is a split on sentence and clause punctuation, so a
 * fail names the clause it found, not a parse tree. Precision over the shipped corpus is
 * MEASURED and printed by the walker test, never assumed.
 *
 * PURE, HEADLESS. No settlement import, no clock, no RNG, no I/O.
 *
 * @enforced-by tests/lint/proseEntryContradiction.walker.test.js
 */
import {
  AMBIGUOUS_EXEMPTION_LEMMAS, AUTHORED_MAGNITUDES, BAND_EQUIVALENCE, BAND_PHRASES,
  BARE_RELATIVE, CARDINAL_WORDS, CLOSE_KINDS, COUNT_NOUNS, DUTY_CONTEXT_WORDS,
  DUTY_PREDICATES, DUTY_STEM_NOUNS, EXEMPTION_LEMMAS, FUTURE_INDICATIVE,
  OFFICE_NOUN_CANDIDATES, PROVENANCE_LEXICONS, QUANTIFIERS, RECORD_CITATION,
  RELATION_LEMMAS, SPECIFICATIONAL_COPULA, SUPPLY_CLAIM_LEXICONS,
} from './entryLexicons.js';

/**
 * One rendered unit with its provenance. `text` is the corpus text WITH its `{slot}`
 * markers intact — a slot is a typed reference and the walker reads it as one.
 * @typedef {object} ProseEntry
 * @property {string} id a stable address: `file::block::pool#idx` or `file:line`
 * @property {string} text
 * @property {string} [block]
 * @property {string} [pool]
 * @property {string} [angle]
 * @property {ReadonlyArray<string>} [marks]
 * @property {ReadonlyArray<string>} [slots] the slots the variant DECLARES it names
 * @property {ReadonlyArray<string>} [reads] the TYPED FIELDS the pool's selecting branch
 *   evaluates, from the wiring census. ⭐ ADDED AT REWRITE car 8a-6 so ARM Q can ask the
 *   question it was written to ask: R-DA-03 licenses a qualifier by a SECOND TYPED FIELD, and
 *   until this column reached the walker the arm could only look for a `{slot}` or a band word
 *   — so a clause naming a real second field in the field's OWN words was withheld anyway.
 * @property {Readonly<Record<string, ReadonlyArray<string>>>} [vocabulary] the census's
 *   `fieldSynonyms` REPORT column for this row: the nouns a field may be named by in prose,
 *   ratified like an alias and cited to the card (SITTING §H rule 3). Absent is not a failure;
 *   it narrows what the arm can see to the field path's own words.
 * @property {string} [file]
 * @property {number} [line]
 * @property {string} [register] R1 · R2 · R5 · R6 · R7 · annex · generator …
 */

/**
 * One column of the institution table, as the walker consults it.
 * @typedef {object} TableColumn
 * @property {boolean} closed is the column's value set CLOSED on this settlement?
 * @property {ReadonlyArray<string>|null} values the values it holds; `null` = unknown at
 *   this scope (an estate-wide ground knows `closed` without knowing a town's rows)
 * @property {boolean} [nullEverywhere] the column is null on EVERY settlement the product
 *   can generate (measured, not assumed) — the one estate-wide fact that lets an
 *   exemption assertion FAIL without a per-town row
 */

/**
 * The typed ground one entry is walked against.
 * @typedef {object} EntryGround
 * @property {'estate'|'settlement'} scope
 * @property {Record<string, TableColumn>} columns
 * @property {ReadonlyArray<Record<string, unknown>>} [rows] the table's rows (settlement
 *   scope only)
 * @property {ReadonlyArray<string>} [joins] the join edges the world holds, as
 *   `"<a>→<b>"` strings; absent ⇒ C6 is NOT-EXECUTABLE
 * @property {boolean} [eventProvenance] does the entry's BLOCK carry an event-provenance
 *   field? absent ⇒ C3's lexical half is NOT-EXECUTABLE
 * @property {string} [gender] the bearer's typed gender; absent ⇒ C3 arm (a) is
 *   NOT-EXECUTABLE
 * @property {{declared: ReadonlyArray<string>, variantUnion: ReadonlyArray<string>,
 *   composed: ReadonlyArray<string>|null}} [fill] the block's slot census — what the block
 *   DECLARES, what its variants NAME, and what the composer actually FILLS for this
 *   (block, pool); `composed: null` ⇒ arm D is NOT-EXECUTABLE
 * @property {ReadonlyArray<ProseEntry>} [siblings] the OTHER variants of this pool cell
 * @property {{status: string, reason?: string, slotsFilled?: ReadonlyArray<string>,
 *   predicate?: ReadonlyArray<{field: string, op: string, value: string}>,
 *   keyFunction?: string}} [wiring] car 8's WIRING CENSUS row for this (block, pool) — the
 *   predicate that selects the pool and the slots its composer bag fills. ABSENT ⇒ every
 *   wiring-licensed arm behaves exactly as it did before car 8, so no caller that does not
 *   pass a census can be reddened by the wiring alone.
 */

/**
 * One finding. The shape is `domain/validation/consistency.js`'s record shape so a report
 * renders in the same UI without this module knowing anything about a UI.
 * @typedef {object} Finding
 * @property {string} id the entry's id
 * @property {'C1'|'C2'|'C3'|'C4'|'C5'|'C6'|'D'|'Q'|'X'|'F25'|'W'} klass
 * @property {string} arm the named limb inside the class
 * @property {string} clause the clause the detector fired on
 * @property {string} column the table column consulted, or the field wanted
 * @property {string} value what the column returned
 * @property {string} [sibling] the sibling entry id, for C5
 * @property {string} description one plain sentence
 */

/** @typedef {{fails: Finding[], withheld: Finding[], notes: Finding[],
 *   notExecutable: Finding[]}} WalkResult */

// ── text machinery ──────────────────────────────────────────────────────────────────

/** A slot marker reads as one opaque token so a slot name is never mistaken for prose. */
const SLOT_RE = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;

/**
 * Split into sentences. Slots are neutralised first so `{settlement}. ` splits and
 * `Mr.`-style abbreviations are not manufactured by a fill.
 * @param {string} text
 * @returns {string[]}
 */
export function sentencesOf(text) {
  if (typeof text !== 'string' || text.trim() === '') return [];
  return text.replace(SLOT_RE, 'X').split(/(?<=[.?!])\s+(?=[A-Z"'(])/).filter((s) => s.trim() !== '');
}

/**
 * Split into clauses — the unit a finding is attributed to. A clause boundary is a
 * sentence end, a semicolon, a colon, a comma, or a coordinator. This is a REPORTING
 * granularity, not a parse: a finding names the clause the detector fired in.
 * @param {string} text
 * @returns {string[]}
 */
export function clausesOf(text) {
  if (typeof text !== 'string') return [];
  return text
    .split(/(?<=[.?!;:])\s+|,\s+|\s+(?:and|but|or|yet|while|though|because|so)\s+/i)
    .map((c) => c.trim())
    .filter((c) => c !== '');
}

/** @param {string} s @returns {string} */
const lower = (s) => String(s || '').toLowerCase();

/**
 * Word-boundary search for a multi-word phrase.
 * @param {string} haystack already lower-cased
 * @param {string} needle already lower-cased
 * @returns {boolean}
 */
function holds(haystack, needle) {
  return locate(haystack, needle) >= 0;
}

/**
 * WHERE a phrase occurs, under the SAME word-boundary rule `holds` tests with.
 *
 * ⛔ THE PAIR `holds(t, q)` + `t.indexOf(q)` IS A REAL DEFECT AND IT SHIPPED. `holds` is
 * word-boundary; `indexOf` is a substring, so "The wall is old, and all souls are counted
 * here." detected the quantifier `all` at word boundary and then LOCATED it inside `wall` at
 * index 4 — the governed noun read as "is/old", no column resolved, and a totality over the
 * open persons column degraded from FAIL to NOTE. Measured over the shipped corpus: 69 of
 * 3,132 entries carry a mis-located quantifier (70 occurrences). `bandReadings` shared the
 * same pair. One locator, one rule, both callers.
 * @param {string} haystack already lower-cased
 * @param {string} needle already lower-cased
 * @returns {number} the index of the phrase itself, or -1
 */
function locate(haystack, needle) {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp(`(^|[^a-z])(${escaped})([^a-z]|$)`).exec(haystack);
  return m ? m.index + m[1].length : -1;
}

/**
 * The clause a phrase occurs in, for attribution.
 * @param {string} text
 * @param {string} phrase already lower-cased
 * @returns {string}
 */
function clauseHolding(text, phrase) {
  for (const clause of clausesOf(text)) if (holds(lower(clause), phrase)) return clause;
  return String(text).trim();
}

/**
 * @param {ProseEntry} entry
 * @param {Finding['klass']} klass
 * @param {string} arm
 * @param {string} clause
 * @param {string} column
 * @param {string} value
 * @param {string} description
 * @param {string} [sibling]
 * @returns {Finding}
 */
function finding(entry, klass, arm, clause, column, value, description, sibling) {
  return {
    id: entry.id, klass, arm, clause, column, value, description, ...(sibling ? { sibling } : {}),
  };
}

// ── the band reader ─────────────────────────────────────────────────────────────────

/** Longest phrases first, so `a few souls` is read before `a few`. */
const BAND_BY_LENGTH = Object.freeze(
  [...BAND_PHRASES, ...AUTHORED_MAGNITUDES].slice().sort((a, b) => b.length - a.length),
);

/**
 * Which licensed band or magnitude phrases does this text hold, and what does each govern?
 * @param {string} text
 * @returns {Array<{phrase: string, noun: string, clause: string}>}
 */
export function bandReadings(text) {
  const t = lower(text);
  /** @type {Array<{phrase: string, noun: string, clause: string}>} */
  const out = [];
  /** @type {string[]} */
  const claimed = [];
  for (const phrase of BAND_BY_LENGTH) {
    if (!holds(t, phrase)) continue;
    // A phrase already covered by a longer one it sits inside is the same reading.
    if (claimed.some((c) => c.includes(phrase))) continue;
    claimed.push(phrase);
    const at = locate(t, phrase);
    const tail = t.slice(at + phrase.length, at + phrase.length + 40);
    const noun = COUNT_NOUNS.find((n) => holds(tail, n)) || (COUNT_NOUNS.find((n) => holds(phrase, n)) || '');
    out.push({ phrase, noun, clause: clauseHolding(text, phrase) });
  }
  return out;
}

/**
 * The equivalence class a band phrase belongs to, or the phrase itself when it belongs to
 * none (an unclassed phrase is its own class — never silently merged).
 * @param {string} phrase
 * @returns {string}
 */
export function bandClassOf(phrase) {
  const cls = BAND_EQUIVALENCE.find((set) => set.includes(phrase));
  return cls ? cls[0] : phrase;
}

/** The digit value of a spelled cardinal word. @type {Readonly<Record<string, number>>} */
const CARDINAL_VALUE = Object.freeze({
  two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
});

/**
 * The value of a cardinal RUN — `three hundred` is 300, `two` is 2. A run whose shape the
 * table does not cover returns null and is treated as a full figure.
 * @param {ReadonlyArray<string>} run
 * @returns {number|null}
 */
function cardinalValue(run) {
  if (run.length === 1) return CARDINAL_VALUE[run[0]] ?? (run[0] === 'hundred' ? 100 : null);
  let total = 0;
  for (const word of run) {
    if (word === 'hundred') total = (total || 1) * 100;
    else if (word === 'thousand') total = (total || 1) * 1000;
    else if (CARDINAL_VALUE[word] !== undefined) total += CARDINAL_VALUE[word];
    else return null;
  }
  return total || null;
}

/**
 * Mask the licensed vocabulary so a band phrase never surfaces its own parts: `several
 * hundred` must not read as `hundred`, and `no one` must not read as the quantifier `no`.
 * @param {string} text
 * @returns {string} the lower-cased text with every band and magnitude phrase blanked
 */
function maskBands(text) {
  let masked = lower(text);
  for (const phrase of BAND_BY_LENGTH) masked = masked.split(phrase).join(' '.repeat(phrase.length));
  return masked;
}

/**
 * Cardinal runs and digits — a FIGURE where the record allows only a band word.
 *
 * ⚠ A CARDINAL IS A FIGURE ONLY WHERE IT COUNTS A COUNT NOUN, and this cost a measurement
 * to learn. The first cut reported every cardinal and returned 129 findings over the dossier
 * leaves, of which the great majority were enumerations of THINGS — "the two things that
 * matter", "having all three" — none of them a head count and none of them what
 * `QUANTITY_BANDS` exists to keep out. A4 bans DIGITS outright; the band vocabulary governs
 * the QUANTITY OF PEOPLE. So a cardinal governing a count noun FAILS (the Brackwater "three
 * hundred souls"), any digit FAILS, and a cardinal governing anything else is REPORTED.
 * @param {string} text
 * @returns {Array<{figure: string, noun: string, value: number|null, clause: string,
 *   governed: boolean}>}
 */
export function figureReadings(text) {
  const words = maskBands(text).split(/([^a-z0-9]+)/);
  /** @type {Array<{figure: string, noun: string, value: number|null, clause: string,
   *   governed: boolean}>} */
  const out = [];
  /** @type {string[]} */
  let run = [];
  /** @param {number} at the index in `words` just past the run */
  const flush = (at) => {
    if (!run.length) return;
    const tail = words.slice(at, at + 8).filter((w) => /[a-z]/.test(w));
    const noun = tail.slice(0, 3).find((w) => COUNT_NOUNS.includes(w)) || '';
    out.push({
      figure: run.join(' '),
      noun,
      value: cardinalValue(run),
      clause: clauseHolding(text, run[0]),
      governed: noun !== '',
    });
    run = [];
  };
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!/[a-z0-9]/.test(w)) continue;
    if (CARDINAL_WORDS.includes(w)) run.push(w);
    else flush(i);
  }
  flush(words.length);
  for (const m of lower(text).matchAll(/\b\d[\d,.]*\b/g)) {
    // A DIGIT is banned outright (A4) whatever it counts, so it never takes the band
    // vocabulary's benefit of the doubt.
    out.push({
      figure: m[0], noun: '', value: null, clause: clauseHolding(text, m[0]), governed: true,
    });
  }
  return out;
}

// ── the class arms ──────────────────────────────────────────────────────────────────

/**
 * C1 — a count vs a count. Two band phrases governing ONE count noun contradict; two
 * governing different nouns (or none) are REPORTED, because "one quantity" is a semantic
 * judgment the walker does not make. A figure is a fail against the closed vocabulary
 * itself, and no table row can license it (CLERK-LAWS §1.4: "REFUSED as a figure …
 * nothing more: the band word").
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armC1(entry, ground, out) {
  const bands = bandReadings(entry.text);
  /** @type {Map<string, Array<{phrase: string, noun: string, clause: string}>>} */
  const byNoun = new Map();
  for (const b of bands) {
    const key = b.noun || '';
    // GET-OR-CREATE, because a typed Map's `get` returns `T | undefined` and this loop must
    // not read through that. Re-setting a key a Map already holds does NOT move it, so the
    // noun order the loop below walks is still first-arrival order: the same tallies.
    const list = byNoun.get(key) || [];
    list.push(b);
    byNoun.set(key, list);
  }
  for (const [noun, list] of byNoun) {
    const classes = [...new Set(list.map((b) => bandClassOf(b.phrase)))];
    if (classes.length < 2) continue;
    const where = list.map((b) => b.phrase).join(' / ');
    if (noun) {
      out.fails.push(finding(entry, 'C1', 'two bands, one count noun', list[0].clause,
        'whoIsCounted', where,
        `two count words (${where}) govern one noun ("${noun}") inside the entry`));
    } else {
      out.notes.push(finding(entry, 'C1', 'two bands, no shared noun', list[0].clause,
        'whoIsCounted', where,
        `two count words (${where}) with no shared count noun; whether they name one quantity is the refuter's`));
    }
  }
  for (const f of figureReadings(entry.text)) {
    if (f.governed) {
      // ⚠ A CARDINAL AT OR BELOW THE FIRST BAND'S CEILING IS WITHHELD, NOT FAILED. The
      // lowest band (`a few souls`) tops out at three, so "two houses" and "three people"
      // sit BELOW the vocabulary rather than outside it, and in this estate they nearly
      // always enumerate PARTIES ("between two people rather than two houses") rather than
      // band a population. Whether such a count is a population figure is the refuter's;
      // "three hundred souls" is not, and fails.
      // `3` is `QUANTITY_BANDS`' LOWEST CEILING (`[3, 'a few souls']`) — the edge of the band
      // vocabulary itself, not a dial. It is written at its use site rather than hoisted,
      // because a module-top-level named number in `src/domain` is an unregistered tuning dial
      // by the estate's own register, and this is not a tuning value: it is the first row of a
      // closed vocabulary this file already pins against its source.
      const channel = f.value !== null && f.value <= 3 ? out.withheld : out.fails;
      channel.push(finding(entry, 'C1', 'a figure outside the closed vocabulary', f.clause,
        'whoIsCounted', f.figure,
        `"${f.figure}"${f.noun ? ` counts "${f.noun}"` : ''} outside QUANTITY_BANDS; the record speaks counts as band words`));
    } else {
      out.notes.push(finding(entry, 'C1', 'a cardinal governing no count noun', f.clause,
        'whoIsCounted', f.figure,
        `"${f.figure}" enumerates something the count vocabulary does not govern; reported, not failed`));
    }
  }
}

/**
 * C2 — a duty vs an exemption. Three limbs, each naming the column it consults.
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armC2(entry, ground, out) {
  const t = lower(entry.text);
  const exemptCol = ground.columns?.whoIsExempt;
  // (a) an exemption assertion. The unambiguous lemmas fire alone; the ambiguous ones
  // ("spared", "free of") need a DUTY word in the same entry, because an exemption is an
  // exemption FROM something and without one they are ordinary prose about weather and
  // terrain (measured: three such findings in the first corpus run).
  // ⚠ THE DUTY CONTEXT IS CLAUSE-LOCAL, not entry-local. An entry-wide test passed a crier
  // line — "the survivors COUNT their losses and give thanks for those SPARED" — where the
  // duty word and the ambiguous lemma sit in different clauses about different things.
  /** @param {string} lemma */
  const ambiguousIsLicensed = (lemma) => {
    const clause = lower(clauseHolding(entry.text, lemma));
    return DUTY_CONTEXT_WORDS.some((w) => holds(clause, w));
  };
  for (const lemma of [...EXEMPTION_LEMMAS, ...AMBIGUOUS_EXEMPTION_LEMMAS]) {
    if (!holds(t, lemma)) continue;
    if (AMBIGUOUS_EXEMPTION_LEMMAS.includes(lemma) && !ambiguousIsLicensed(lemma)) continue;
    const clause = clauseHolding(entry.text, lemma);
    if (!exemptCol) {
      out.notExecutable.push(finding(entry, 'C2', 'exemption (no column given)', clause,
        'whoIsExempt', 'not supplied',
        'the ground carries no whoIsExempt column; the limb declares itself not-executable'));
    } else if (exemptCol.nullEverywhere || (Array.isArray(exemptCol.values) && exemptCol.values.length === 0)) {
      out.fails.push(finding(entry, 'C2', 'exemption on a null column', clause,
        'whoIsExempt', 'null',
        `"${lemma}" asserts an exemption; the whoIsExempt column holds nothing`));
    } else if (exemptCol.values === null) {
      out.withheld.push(finding(entry, 'C2', 'exemption, values unknown at this scope', clause,
        'whoIsExempt', 'unknown',
        `"${lemma}" asserts an exemption; whether THIS town holds the row is a settlement-scope read`));
    }
    break; // one exemption finding per entry: the clause, not the vocabulary, is the fault
  }
  // (b) an office noun the table does not hold.
  const officeCol = ground.columns?.office;
  for (const noun of OFFICE_NOUN_CANDIDATES) {
    if (!holds(t, noun)) continue;
    const clause = clauseHolding(entry.text, noun);
    if (!officeCol || officeCol.values === null) {
      out.notExecutable.push(finding(entry, 'C2', 'office noun (no roster given)', clause,
        'office', 'not supplied',
        `"${noun}" is an office candidate; the ground carries no office roster to judge it`));
    } else if (!officeCol.values.some((v) => lower(v).includes(noun))) {
      // A NEGATED office noun is R-DA-02's LACK — "no constable anywhere" states an absence
      // rather than asserting an office — and the LACK is licensed by the world holding it.
      // Whether the world holds THIS lack is a per-settlement read, so it is reported.
      const negated = new RegExp(`\\b(no|not|without|never)\\b[^.;]{0,20}${noun}`).test(lower(clause));
      const channel = negated ? out.withheld : out.fails;
      channel.push(finding(entry, 'C2', negated ? 'a LACK naming an office the world has no term for' : 'an office the world does not hold', clause,
        'office', noun,
        `"${noun}" names an office absent from the office column (${officeCol.values.length} roles held)`));
    }
  }
  // (c) a duty PREDICATE with no bearer the table holds.
  const dutyCol = ground.columns?.whatItCounts;
  const duty = DUTY_PREDICATES.find((d) => holds(t, d));
  if (duty) {
    const clause = clauseHolding(entry.text, duty);
    if (!dutyCol || dutyCol.values === null) {
      out.notExecutable.push(finding(entry, 'C2', 'duty predicate (no service rows given)', clause,
        'whatItCounts', 'not supplied',
        `"${duty}" is a duty predicate; the ground carries no instantiated service rows`));
    } else if (dutyCol.values.length === 0) {
      out.fails.push(finding(entry, 'C2', 'a duty no institution carries', clause,
        'whatItCounts', 'empty',
        `"${duty}" asserts a duty; no live institution on this settlement carries a count duty`));
    }
  } else {
    // A bare stem is a noun far more often than a predicate in this estate; it is REPORTED
    // with the ambiguity named, never failed (the NL-4 fixture's "since the last muster").
    const stem = DUTY_STEM_NOUNS.find((d) => holds(t, d));
    if (stem) {
      out.notes.push(finding(entry, 'C2', 'a duty stem used as a noun', clauseHolding(entry.text, stem),
        'whatItCounts', stem,
        `"${stem}" is a duty lemma in its bare form; whether it names a duty or an event is not mechanisable`));
    }
  }
}

/**
 * C3 — a state vs its provenance. The LEXICAL half only; the semantic half is WITHHELD.
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armC3(entry, ground, out) {
  const t = lower(entry.text);
  const hits = [];
  for (const [kind, list] of Object.entries(PROVENANCE_LEXICONS)) {
    for (const phrase of list) if (holds(t, phrase)) hits.push({ kind, phrase });
  }
  if (typeof ground.eventProvenance !== 'boolean') {
    if (hits.length) {
      out.notExecutable.push(finding(entry, 'C3', 'provenance (no field flag given)',
        clauseHolding(entry.text, hits[0].phrase), 'eventProvenance', 'not supplied',
        `${hits.length} provenance-class phrase(s) found; the block's event-provenance flag was not supplied`));
    }
  } else if (!ground.eventProvenance) {
    for (const h of hits) {
      out.fails.push(finding(entry, 'C3', `${h.kind} claim on a state-only field`,
        clauseHolding(entry.text, h.phrase), 'provenance', 'state-only',
        `"${h.phrase}" is a ${h.kind} claim; the block carries no event-provenance field (R-DST-B)`));
    }
  }
  // The semantic half, always withheld when a past-tense finite verb rides a state field.
  if (/\b(had|were|was|used to|once|formerly|no longer)\b/.test(t)) {
    out.withheld.push(finding(entry, 'C3', 'is this clause historical?',
      clauseHolding(entry.text, 'was'), 'provenance', 'semantic',
      'a past-tense or formerly-construction: whether it asserts history is A6, the refuter\'s'));
  }
  // The SUPPLY-CHAIN / ROUTE half. Always WITHHELD: the licensing row (`resources[].flow`,
  // a `supplyChainState` chain, a route field) is a per-settlement read, and the walker
  // names the field it wanted rather than guessing.
  for (const [kind, list] of Object.entries(SUPPLY_CLAIM_LEXICONS)) {
    for (const phrase of list) {
      if (!holds(t, phrase)) continue;
      out.withheld.push(finding(entry, 'C3', `a ${kind} claim on a goods sentence`,
        clauseHolding(entry.text, phrase),
        kind === 'route' ? 'route field' : 'supplyChainState chain row', 'unresolved',
        `"${phrase}" asserts a ${kind} fact; a flow word is licensed by the field, a ${kind} step by a chain row`));
    }
  }
  // Arm (a): a pronoun against the bearer's typed gender.
  if (typeof ground.gender !== 'string') {
    if (/\b(he|him|his|she|her|hers)\b/.test(t)) {
      out.notExecutable.push(finding(entry, 'C3', 'pronoun vs gender (no gender given)',
        clauseHolding(entry.text, 'he'), 'gender', 'not supplied',
        'the line carries a gendered pronoun and the ground supplies no bearer gender'));
    }
  } else {
    const male = /\b(he|him|his)\b/.test(t);
    const female = /\b(she|her|hers)\b/.test(t);
    const wrong = (ground.gender === 'female' && male && !female)
      || (ground.gender === 'male' && female && !male);
    if (wrong) {
      out.fails.push(finding(entry, 'C3', 'pronoun contradicts the bearer\'s gender',
        clauseHolding(entry.text, male ? 'he' : 'she'), 'gender', ground.gender,
        `the line's pronoun contradicts the typed gender "${ground.gender}"`));
    }
  }
}

/**
 * Which column does a quantified noun belong to? A quantifier is judged against the
 * `closed` flag of the column its governed noun resolves to, and a noun that resolves to
 * no column is REPORTED rather than failed.
 * @param {string} noun
 * @returns {string}
 */
export function columnOfNoun(noun) {
  const n = lower(noun);
  if (COUNT_NOUNS.includes(n) || n === 'one' || n === 'ones') return 'whoIsCounted';
  if (/^institutions?$/.test(n) || /^houses?$/.test(n)) return 'institution';
  if (/^(offices?|officials?)$/.test(n)) return 'office';
  return '';
}

/**
 * C4 — a modality spent (B-CLAIM made executable at the entry).
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armC4(entry, ground, out) {
  const t = lower(entry.text);
  // ⚠ THE GOVERNED NOUN IS THE NEXT NOUN, NOT ANY NOUN IN THE NEXT FORTY CHARACTERS. The
  // first cut scanned a window and matched the `one` in "Every advantage the town holds is
  // ONE it has paid for" — reporting a totality over PERSONS on a sentence about
  // advantages. And the band phrases are masked first, so "no one" is read as the count
  // word `quantityWords(0)` returns rather than as the quantifier `no`.
  const masked = maskBands(entry.text);
  for (const q of QUANTIFIERS) {
    if (!holds(masked, q)) continue;
    const at = locate(masked, q);
    const tail = masked.slice(at + q.length, at + q.length + 40);
    const next = (tail.match(/[a-z']+/g) || []).slice(0, 2);
    // ⛔ BARE `one` IS A PRONOUN IN THIS ESTATE, not a count. It maps to the persons column
    // ONLY in the `every one` / `each one` idiom and only as the immediately next token;
    // otherwise "the town is not for any ONE thing" and "rarer than any ONE of them" read
    // as totalities over people (measured: six such findings before this narrowing).
    const noun = next.find((w, i) => {
      if (w !== 'one') return Boolean(columnOfNoun(w));
      return i === 0 && (q === 'every' || q === 'each');
    }) || '';
    const clause = clauseHolding(entry.text, q);
    const column = columnOfNoun(noun);
    if (!column) {
      out.notes.push(finding(entry, 'C4', 'a quantifier over an unnamed column', clause,
        '(none)', q,
        `"${q}" quantifies something the walker cannot resolve to a column; reported, not failed`));
      continue;
    }
    const col = ground.columns?.[column];
    if (!col) {
      out.notExecutable.push(finding(entry, 'C4', 'quantifier (no column given)', clause,
        column, 'not supplied', `"${q}" quantifies ${column}; the ground carries no such column`));
    } else if (!col.closed) {
      out.fails.push(finding(entry, 'C4', 'a totality over an open column', clause,
        column, 'open',
        `"${q}" asserts a totality over ${column}, which is not closed on this settlement`));
    }
  }
  if (FUTURE_INDICATIVE.test(t)) {
    out.fails.push(finding(entry, 'C4', 'a bare future indicative', clauseHolding(entry.text, 'will'),
      '(modality)', 'future',
      'a bare future indicative forecasts; the record states, and an edge is subjunctive (STATE never FATE)'));
  }
}

/**
 * The typed facts a sibling comparison reads. Only these; everything else is a small
 * particular and may differ freely (R-DA-09's device is not erased).
 * @param {ProseEntry} entry
 * @returns {{bands: Record<string, string>, offices: string[], quantifiers: string[],
 *   statuses: string[]}} `bands` maps a governed count noun to its band's equivalence class
 */
export function typedFactsOf(entry) {
  const t = lower(entry.text);
  // ⚠ BANDS ARE KEYED BY THE NOUN THEY GOVERN. A first cut compared the SET of band words
  // across siblings and reported 42 "contradictions", of which the great majority were two
  // variants speaking about two different quantities — "in several places" against "can find
  // nobody whose responsibility the defense is". Two records of one town disagree only when
  // they band THE SAME NOUN differently; a band governing nothing is a manner word, not a
  // structural fact, and is dropped here rather than compared.
  /** @type {Record<string, string>} */
  const bands = {};
  for (const b of bandReadings(entry.text)) if (b.noun) bands[b.noun] = bandClassOf(b.phrase);
  return {
    bands,
    offices: OFFICE_NOUN_CANDIDATES.filter((n) => holds(t, n)).sort(),
    quantifiers: QUANTIFIERS.filter((q) => holds(t, q)).sort(),
    statuses: ['ruined', 'destroyed', 'removed', 'remnant', 'impaired', 'standing', 'abandoned']
      .filter((s) => holds(t, s)).sort(),
  };
}

/**
 * C5 — sibling vs sibling. Fails ONLY on a CONFLICT: both siblings carry a value in one
 * typed slot and the values are disjoint. An OMISSION is never a contradiction — two
 * records of one town may say different amounts about it, and the pool's whole design is
 * that they do.
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armC5(entry, ground, out) {
  const siblings = ground.siblings || [];
  if (!siblings.length) {
    out.notExecutable.push(finding(entry, 'C5', 'sibling coherence (no siblings given)',
      '', '(pool cell)', 'not supplied',
      'the ground supplied no sibling variants for this pool cell'));
    return;
  }
  // ⚠ THE PREMISE C5 RESTS ON IS "same key ⇒ same state", and car 8's census is what makes
  // that premise checkable. Where the pool's selecting predicate could not be recovered, the
  // premise is unestablished, so a disagreement between two variants is NOT-EXECUTABLE
  // rather than a contradiction — the §908 law applied to this arm's own reach. Without a
  // census the arm behaves exactly as it did before car 8.
  if (ground.wiring && ground.wiring.status !== 'RESOLVED') {
    out.notExecutable.push(finding(entry, 'C5', 'sibling coherence (predicate not recovered)',
      '', '(wiring predicate)', String(ground.wiring.status),
      'two variants contradict only if ONE predicate selected both; this pool\'s predicate is not recovered, so the premise is unestablished'));
    return;
  }
  const mine = typedFactsOf(entry);
  for (const sib of siblings) {
    const theirs = typedFactsOf(sib);
    // The BAND comparison runs per governed noun: same noun, different band class.
    for (const [noun, band] of Object.entries(mine.bands)) {
      const other = theirs.bands[noun];
      if (!other || other === band) continue;
      out.fails.push(finding(entry, 'C5', 'siblings band one noun differently', entry.text,
        `whoIsCounted (${noun})`, `${band} vs ${other}`,
        `this variant bands "${noun}" as ${band}; its sibling bands it ${other} (the same cell, the same state)`,
        sib.id));
    }
    // ⚠ THE OFFICE AND STATUS LIMBS ARE **WITHHELD**, and that is a measured retreat. A bag
    // comparison over status words reported four "contradictions" of which every one was two
    // variants speaking about DIFFERENT SUBJECTS — "the ground it has given up" (abandoned)
    // beside "the fields furthest out are standing untended" (standing). Without a subject a
    // status word is not a structural fact about one thing, and C5 fails only on a genuine
    // conflict. The band limb above HAS its subject (the governed noun) and keeps its FAIL.
    for (const slot of /** @type {const} */ (['offices', 'statuses'])) {
      const a = mine[slot];
      const b = theirs[slot];
      if (!a.length || !b.length) continue;
      const shared = a.filter((x) => b.includes(x));
      if (shared.length) continue;
      out.withheld.push(finding(entry, 'C5', `siblings differ in ${slot}`, entry.text,
        slot, `${a.join('/')} vs ${b.join('/')}`,
        `this variant carries ${slot} ${a.join('/')}; its sibling carries ${b.join('/')}; whether they name one subject is the refuter's`,
        sib.id));
    }
  }
}

/**
 * C6 — a relation gestured at. A relation predicate needs a JOIN FIELD, or two names on
 * one roll have been rendered as an edge.
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armC6(entry, ground, out) {
  const t = lower(entry.text);
  for (const lemma of RELATION_LEMMAS) {
    if (!holds(t, lemma)) continue;
    const clause = clauseHolding(entry.text, lemma);
    if (!Array.isArray(ground.joins)) {
      out.notExecutable.push(finding(entry, 'C6', 'relation (no join set given)', clause,
        '(joins)', 'not supplied',
        `"${lemma}" renders a relation; the ground carries no join set to judge it`));
    } else if (ground.joins.length === 0) {
      out.fails.push(finding(entry, 'C6', 'a relation no join field holds', clause,
        '(joins)', 'empty',
        `"${lemma}" renders two parties as related; the world holds no join between them`));
    }
  }
}

/**
 * ARM D — the LICENCE, read against the block's COMPOSED FILL. A variant naming a slot the
 * composer never fills is UNREACHABLE: anchored liveness drops it at every draw, so it is
 * authored prose no reader can ever meet. That is not a contradiction — it is a licence
 * fault, and it is the arm the taste sample's refutations asked for by name (SITTING §J
 * gap (e): keyed on (block, pool), never on the block alone).
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armD(entry, ground, out) {
  const named = [...new Set([...String(entry.text).matchAll(SLOT_RE)].map((m) => m[1]))];
  const declared = Array.isArray(entry.slots) ? entry.slots : [];
  for (const slot of named) {
    if (!declared.includes(slot)) {
      out.fails.push(finding(entry, 'D', 'a slot the variant does not declare', slot,
        '(variant.slots)', declared.join(', ') || 'none',
        `the sentence names {${slot}} and the variant's declared slot list does not carry it`));
    }
  }
  const composed = ground.fill?.composed;
  if (!Array.isArray(composed)) {
    if (named.length) {
      out.notExecutable.push(finding(entry, 'D', 'licence (no composed fill given)',
        named.join(', '), '(composed fill)', 'not supplied',
        'the ground carries no composed fill for this (block, pool); the licence arm cannot run'));
    }
    return;
  }
  const unfillable = named.filter((s) => !composed.includes(s));
  if (unfillable.length) {
    out.fails.push(finding(entry, 'D', 'a slot the composer never fills', unfillable.join(', '),
      '(composed fill)', composed.join(', ') || 'empty',
      `the sentence names {${unfillable.join('}, {')}}, which this (block, pool)'s composer bag does not offer; the variant is unreachable at every draw`));
  }
}

/**
 * The words that CLAIM a field, derived from the field's own path.
 *
 * A dotted path's last segment is the field; a camel-cased segment is two or more words the
 * prose would spell apart (`economicGates` is "economic gates"); a plural and its singular are
 * one claim. A caller with a richer vocabulary passes it in; nothing is guessed beyond the
 * name the census itself carries.
 * @param {string} field
 * @returns {string[]} lower-case tokens, longest first
 */
export function claimTokensOf(field) {
  const path = String(field || '').split('.').filter(Boolean);
  const leaf = path.length ? path[path.length - 1] : '';
  if (leaf === '') return [];
  const words = leaf.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase().split(/[\s_]+/)
    .filter((word) => word.length > 2);
  /** @type {string[]} */
  const tokens = [];
  for (const word of [leaf.toLowerCase(), ...words]) {
    if (word.length <= 2 || tokens.includes(word)) continue;
    tokens.push(word);
    const singular = word.endsWith('s') ? word.slice(0, -1) : `${word}s`;
    if (singular.length > 2 && !tokens.includes(singular)) tokens.push(singular);
  }
  return tokens.sort((a, b) => b.length - a.length);
}

/**
 * Does this text CLAIM this field? A `{slot}` naming the field's leaf is a typed reference and
 * counts outright; otherwise one of the field's own words must stand as a whole word.
 * @param {string} text
 * @param {string} field
 * @param {Readonly<Record<string, ReadonlyArray<string>>>} [vocabulary] extra words per field
 * @returns {string} the token that claimed it, or `''`
 */
export function claimsField(text, field, vocabulary = {}) {
  const body = String(text || '');
  const lower = body.toLowerCase();
  const extra = vocabulary[field] || [];
  const tokens = [...claimTokensOf(field), ...extra.map((word) => String(word).toLowerCase())];
  for (const token of tokens) {
    if (body.includes(`{${token}}`)) return `{${token}}`;
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`).test(lower)) return token;
  }
  return '';
}

/**
 * ARM Q — the QUALIFY licence (R-DA-03 as the chair restated it after the taste sample's
 * third refutation: a second FACT licensed by a SECOND typed field, its own sentence, never
 * a which-tail). A second sentence that references no slot and no typed field is an
 * UNLICENSED second fact — it may be a summarising beat, which is the machine's own
 * signature. Never a silent pass: the walker WITHHOLDS it with the fields it consulted.
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armQualify(entry, ground, out) {
  const raw = String(entry.text).split(/(?<=[.?!])\s+(?=[A-Z"'(])/).filter((s) => s.trim() !== '');
  const declared = Array.isArray(entry.slots) ? entry.slots : [];
  // ⭐⭐ THE THIRD LICENCE, AND THE ARM'S CURE AT CAUSE (REWRITE car 8a-6; SITTING §H rule 3
  // and the chair's M-9 ruling 4: "ARM Q IS DEFECTIVE, not merely short of vocabulary").
  //
  // ⛔ THE CONVICTING ROW, KEPT: `the threat is on the town's books as plainly as the grain.`
  // sits on a spine that READS `settlement.config.monsterThreat`, names it in the field's own
  // word — `threat` — and arm Q withheld it anyway. The arm asked two questions (is there a
  // `{slot}`? is there a band word?) and never the one R-DA-03 actually asks: does the segment
  // name a SECOND TYPED FIELD. It could not ask it, because the walker had no `reads` column.
  // Now it does, and the question is put through `claimsField` — the estate's one reader of
  // "does this text claim this field" — with the census's ratified synonyms as its vocabulary.
  //
  // ⛔ AND THE WITHHOLD SAYS WHICH FIELDS IT CONSULTED, so an unlicensed segment is still a
  // refuter's question and never a silent pass, and a reader can see whether the arm was short
  // of a column or the line was short of a fact.
  const reads = Array.isArray(entry.reads) ? entry.reads : [];
  const vocabulary = entry.vocabulary || {};
  /**
   * @param {string} segment the candidate qualifier
   * @param {string} shape the arm's own name for the shape it found
   */
  const consider = (segment, shape) => {
    const text = segment.trim();
    if (!text) return;
    if ([...text.matchAll(SLOT_RE)].length) return; // a second field is named: licensed
    // A segment carrying a band word or a status word is grounded in the same typed reading
    // and is not the unlicensed shape.
    if (bandReadings(text).length) return;
    const claimed = reads.map((field) => ({ field, token: claimsField(text, field, vocabulary) }))
      .filter((row) => row.token !== '');
    if (claimed.length) return; // a SECOND TYPED FIELD is named in words: licensed (R-DA-03)
    out.withheld.push(finding(entry, 'Q', shape, text,
      '(second typed field)',
      reads.length
        ? `reads [${reads.join(', ')}]; none claimed`
        : (declared.join(', ') || 'none'),
      'R-DA-03 licenses a QUALIFY by a SECOND typed field; this segment names none; a second fact or a summarising beat is the refuter\'s call'));
  };
  for (let i = 1; i < raw.length; i++) consider(raw[i], 'a second sentence naming no second field');
  // ⛔ THE ARM RETURNED EARLY ON A ONE-SENTENCE VARIANT, AND THE BRIEF'S OWN NAMED POSITIVE
  // CONTROL IS ONE. `power.generated.js::DS-POW-5::autocrat#2` carries its second fact after
  // a SEMICOLON — "…the people closest to it; a seat held by one person is lost the way one
  // person can be replaced." — one sentence by `sentencesOf`, two facts by R-DA-03, and the
  // walker returned PASS with three empty channels. A trailing coordinate inside one
  // sentence is the same shape as a second sentence and is read as one; the finding names
  // which shape it was, so a reader can tell the two apart.
  for (const sentence of raw) {
    const parts = sentence.split(/\s*;\s*/);
    for (let i = 1; i < parts.length; i++) consider(parts[i], 'a trailing coordinate naming no second field');
  }
}

/**
 * ARM X — EXHAUSTIVITY. A specificational or inverted copula ("the {seat} is the
 * government", "X is what Y calls itself") entails that the subject is the ONLY value of
 * its column. Licensed only where the column is closed. Self-naming is WITHHELD by the
 * chair's own ruling (MOVE-GRAMMAR §9.1: whether it is an INSTITUTION assertion or a
 * PRESENT state is the walker lane's spec, and this lane declines to settle it).
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armExhaustivity(entry, ground, out) {
  for (const sentence of String(entry.text).split(/(?<=[.?!])\s+/)) {
    if (!SPECIFICATIONAL_COPULA.test(sentence)) continue;
    const selfNaming = /\b(calls?|call|calling|names?|styles?)\s+(itself|themselves)\b/i.test(sentence);
    if (selfNaming) {
      out.withheld.push(finding(entry, 'X', 'self-naming copula', sentence.trim(),
        'institution', 'unclassified',
        'self-naming is not among the INSTITUTION assertion types; whether it is one is WITHHELD (MOVE-GRAMMAR §9.1)'));
      continue;
    }
    const col = ground.columns?.office || ground.columns?.institution;
    if (!col) {
      out.notExecutable.push(finding(entry, 'X', 'exhaustivity (no column given)', sentence.trim(),
        'office|institution', 'not supplied',
        'a specificational copula entails exhaustivity; no column was supplied to judge it'));
    } else if (!col.closed) {
      out.withheld.push(finding(entry, 'X', 'exhaustivity over an open column', sentence.trim(),
        'office|institution', 'open',
        'the copula entails the subject is the column\'s only value; the column is not closed'));
    }
  }
}

/**
 * ARM F25 — a citation's CONTENT, not its existence, licenses the predicate (§9 (vi); the
 * spec deferred the arm to this lane). FIRST ARM ONLY: the citation is detected and the
 * cited record is named; whether the record's fields carry the predicate is WITHHELD,
 * because no loader reaches a cited record's fields today.
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armCitation(entry, ground, out) {
  for (const m of String(entry.text).matchAll(RECORD_CITATION)) {
    out.withheld.push(finding(entry, 'F25', 'a cited record\'s content', m[0],
      '(cited record)', 'unresolved',
      'the predicate is attributed to a record; fault 25 asks what that record HOLDS, and no loader reaches its fields yet'));
  }
}

/**
 * ARM W — THE WIRING LICENCE (car 8; the owner's 19:01 addendum made executable).
 *
 * The BEFORE's prose is evidence of what the pool was WRITTEN to say; the wiring — the
 * predicate that selects it and the bag that fills it — is what it is ENTITLED to say. So a
 * claim the wiring does not license is banked as WITHHELD and labelled PRE-EXISTING, never
 * failed: at the entry there is no rewrite to blame, and calling a shipped line a failure
 * would price the corpus's own debt to the wave that is trying to cure it. `walkPair` is
 * where the distinction becomes a verdict.
 *
 * A pool whose predicate car 8 could not recover is NOT-EXECUTABLE and says which reason —
 * never a pass, and never an inference from the pool's own name (§908's law, and the
 * owner's "never inferred").
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @param {WalkResult} out
 */
function armWiring(entry, ground, out) {
  const wiring = ground.wiring;
  if (!wiring) return;
  const named = [...new Set([...String(entry.text).matchAll(SLOT_RE)].map((m) => m[1]))];
  if (wiring.status !== 'RESOLVED') {
    out.notExecutable.push(finding(entry, 'W', 'wiring licence (predicate not recovered)',
      named.join(', '), '(wiring predicate)', String(wiring.status),
      wiring.reason || 'the census could not recover this pool\'s selecting predicate, so what it is entitled to say is unknown'));
    return;
  }
  const filled = wiring.slotsFilled || [];
  const unlicensed = named.filter((slot) => !filled.includes(slot));
  if (unlicensed.length) {
    out.withheld.push(finding(entry, 'W', 'PRE-EXISTING unlicensed', unlicensed.join(', '),
      `(wiring: ${wiring.keyFunction || 'unnamed key'})`, filled.join(', ') || 'nothing',
      `the sentence names {${unlicensed.join('}, {')}}, which this (block, pool)'s wiring does not fill; a pre-existing unlicensed claim, banked for the wave`));
  }
}

/**
 * THE WALKER. One entry, one ground, three channels and the not-executable roster.
 * @param {ProseEntry} entry
 * @param {EntryGround} ground
 * @returns {WalkResult}
 */
export function walkEntry(entry, ground) {
  /** @type {WalkResult} */
  const out = {
    fails: [], withheld: [], notes: [], notExecutable: [],
  };
  if (!entry || typeof entry.text !== 'string') return out;
  const g = ground || /** @type {EntryGround} */ ({ scope: 'estate', columns: {} });
  if (Array.isArray(entry.marks) && entry.marks.length) {
    out.notes.push(finding(entry, 'C4', 'marks', '', '(marks)', entry.marks.join(', '),
      entry.marks.includes('dm-only')
        ? 'dm-only: the audience law truncates this variant to silence on the player page'
        : 'the variant carries marks the projection demoted from the STATE-KEY'));
  }
  armC1(entry, g, out);
  armC2(entry, g, out);
  armC3(entry, g, out);
  armC4(entry, g, out);
  armC5(entry, g, out);
  armC6(entry, g, out);
  armD(entry, g, out);
  armQualify(entry, g, out);
  armExhaustivity(entry, g, out);
  armCitation(entry, g, out);
  armWiring(entry, g, out);
  return out;
}

/**
 * C-PAIR — a rewrite's AFTER against its BEFORE, with the WIRING as the yardstick.
 *
 * The pair rule the owner stated in one sentence: a claim the wiring does not license is a
 * PRE-EXISTING unlicensed claim when the BEFORE already carried it, and a rewrite failure
 * only when the AFTER added it. Everything here is that sentence: walk both, key the
 * findings by (class, arm, column) so a re-worded clause is still the same claim, and split.
 *
 * ⚠ THE GROUND IS ONE GROUND. Both halves are walked against the SAME ground, because a
 * pair whose two halves were judged against two different worlds measures the worlds.
 * @param {ProseEntry} before
 * @param {ProseEntry} after
 * @param {EntryGround} ground
 * @returns {{added: Finding[], preExisting: Finding[], cured: Finding[],
 *   withheldAdded: Finding[], notExecutable: Finding[]}}
 */
export function walkPair(before, after, ground) {
  const a = walkEntry(before, ground);
  const b = walkEntry(after, ground);
  // ⛔ THE CLAIM KEY CARRIES THE FINDING'S **SITE** (CLERK-LAWS §2.6.1; INSTR-912 car 10,
  // cure 9). Keyed on `(class, arm, column)` alone, an AFTER that adds a genuinely NEW fault
  // of a class the BEFORE already carried read `added 0` and inflated the inherited-debt
  // count from one to two — measured, on a pair whose AFTER buys a SECOND totality over the
  // same open column. §2.6's rule is "a rewrite may not ADD a FAIL", and a class-only key
  // cannot see one. `clause` is the site: the clause the detector fired on, which survives a
  // re-wording of the rest of the entry (the property the class-only key was reaching for)
  // while distinguishing two faults of one class inside one entry.
  //
  // ⚠ THIS IS THE INSTRUMENT THE REWRITE WAVE IS JUDGED BY (FOLD-2 hazard H9). Left as it
  // was, every same-class regression the wave introduced would have read as inherited debt.
  /** @param {Finding} f @returns {string} */
  const claimKey = (f) => `${f.klass}|${f.arm}|${f.column}|${String(f.clause || '').trim()}`;
  const had = new Set(a.fails.map(claimKey));
  const now = new Set(b.fails.map(claimKey));
  const hadWithheld = new Set(a.withheld.map(claimKey));
  // NOT-EXECUTABLE IS THE UNION OF BOTH HALVES. A limb the BEFORE could not execute is a
  // limb the pair did not judge, whether or not the AFTER happens to reach it; reporting the
  // AFTER's alone dropped a BEFORE-only row in silence.
  const notExecutable = [...b.notExecutable];
  const seen = new Set(b.notExecutable.map(claimKey));
  for (const f of a.notExecutable) {
    if (seen.has(claimKey(f))) continue;
    seen.add(claimKey(f));
    notExecutable.push(f);
  }
  return {
    added: b.fails.filter((f) => !had.has(claimKey(f))),
    // A pre-existing FAIL is reported as debt, so the pair instrument stays a pair
    // instrument (CLERK-LAWS §2.6's A11 PRE-EXISTING pattern).
    preExisting: b.fails.filter((f) => had.has(claimKey(f)))
      .map((f) => ({ ...f, arm: `PRE-EXISTING · ${f.arm}` })),
    cured: a.fails.filter((f) => !now.has(claimKey(f))),
    withheldAdded: b.withheld.filter((f) => !hadWithheld.has(claimKey(f))),
    notExecutable,
  };
}

/**
 * The verdict word for one walk. `PASS` means no FAIL — never "nothing was found": a
 * WITHHELD verdict is a report the refuter owes an answer on, and a NOT-EXECUTABLE limb is
 * a field the ground did not carry. Neither is a pass and this function says so.
 * @param {WalkResult} result
 * @returns {'FAIL'|'WITHHELD'|'PASS'}
 */
export function verdictOf(result) {
  if (result.fails.length) return 'FAIL';
  if (result.withheld.length) return 'WITHHELD';
  return 'PASS';
}

/**
 * The CLOSE-KIND arm (SITTING §J gap (b)) — reported per pool, never per entry. A pool
 * whose every variant closes in one kind is the finding; the walker does not rewrite it.
 * @param {string} text
 * @returns {string} the first kind whose shape the close matches, or `other`
 */
export function closeKindOf(text) {
  const last = String(text || '').trim();
  for (const [kind, re] of Object.entries(CLOSE_KINDS)) if (re.test(last)) return kind;
  return 'other';
}

/**
 * The BARE-RELATIVE adjacency arm (SITTING §J gap (g)) — `name what`, `title what`.
 * Reported, never failed: it is a shape finding for the wave, not a claim fault.
 * @param {string} text
 * @returns {string[]}
 */
export function bareRelatives(text) {
  return [...String(text || '').matchAll(BARE_RELATIVE)].map((m) => m[0]);
}
