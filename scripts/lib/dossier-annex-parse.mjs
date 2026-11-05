/**
 * scripts/lib/dossier-annex-parse.mjs — THE PROJECTOR'S ANNEX PARSE, importable (CENSUS-1g unit 5).
 *
 * Moved VERBATIM out of `scripts/generate-dossier-state-prose.mjs` (which runs at import and refuses
 * a stale wiring census) so the wiring census can read the annex's declarations through the
 * projector's OWN parse — never the generated leaves (the leaves are projected FROM the census, so a
 * census read off them is born one projection stale), and never a second spelling of the grammar.
 * Pure: string in, blocks out; no file, no clock.
 */
import {
  FACE_ROW_RE, GRAMMAR_TAG_RE, applyDeclaration, isDeclarationLine, readDeclarations,
} from './dossier-annex-grammar.mjs';
import { assertDeclarable, COLOUR_MARK, POOL_RULINGS, STATE_MARK_DIMENSIONS } from '../../src/domain/facts/factVocabulary.js';
import { colourConflicts } from '../../src/domain/facts/declarationRegisters.js';

/**
 * A variant line: `1. \`[street · dm-only]\` The market runs thin...`
 * A SECOND bracketed tag is lawful and load-bearing — R-DOS-G lets a causal variant
 * carry its audience separately (`6. \`[counterforce · seat]\` \`[dm-only]\` …`). Both
 * tags fold into the variant's marks; missing the second would publish dm-only prose.
 */
/** A state block's heading (`### DS-GEN-3`). */
export const STATE_HEADER = /^###\s+(DS-[A-Z]+-\d+)\b/;

export const VARIANT_RE = /^(\d+)\.\s+`\[([^\]]+)\]`\s+(?:`\[([^\]]+)\]`\s+)?(.*)$/;
/**
 * The canonical-at-zero row: `0. *(canonical)* <the live engine string>`, optionally with ONE tag
 * slot after the marker — `0. *(canonical)* \`[market · no crisis: hunger]\` <text>` (CENSUS-1f,
 * the chair's item 3 of 2026-11-05 ~04:50): every part of the slot is a MARK (the angle is fixed,
 * `canonical`), so a v0 row declares exactly as a numbered row's marks do (vid 0 is a real id). A
 * row with no slot projects `marks: []`, as before.
 */
export const CANONICAL_RE = /^0\.\s+\*\(([^)]*canonical[^)]*)\)\*\s+(?:`\[([^\]]+)\]`\s+)?(.*)$/;
/**
 * A pool label. Either a standalone bold line (`**COMBINATION C1 — ...**`) or a bold
 * label carrying an em-dash gloss (`**SUBSISTENCE** — *bare survival, no cushion*`).
 * A bold lead-in followed by ordinary prose (`**STATE-KEY.** The closed ladder ...`)
 * is deliberately NOT a label — the remainder must be empty or a gloss opener.
 */
export const BOLD_LINE_RE = /^\*\*((?:(?!\*\*).)+)\*\*(\s*(?:[—–·,:(-]\s*.*|\*.*)?)$/;

/**
 * ⭐ THE POOL-LEVEL DECLARATION (CENSUS-1b wave 1 item 2; `docs/DESIGN_POOL_CENSUS.md` §3.1). A
 * pool label may end in ONE brace group, `**UNDER SIEGE** {crisis: under_siege · no walls}`, holding
 * the atoms the pool key guarantees (declared once on the pool, never on its lines) and the two
 * pool rulings, `{crisis-scoped}` (silence there reads as calm) and `{colour}` (the pool presumes
 * nothing). Items are split on `·`; each must be a ruling or a DECLARABLE atom (a home answers it).
 */
export const POOL_BRACES_RE = /^(\*\*.*\*\*.*?)\s*\{([^{}]*)\}\s*$/;
/** A compact row's key with its trailing brace group (CENSUS-2b); a key's own `{…}` holds backticks. */
export const COMPACT_ROW_BRACES_RE = /^(.*\S)\s+\{([^{}`]*)\}$/;
/** A bold compact row with its brace group between the label and the em dash (CENSUS-2b). */
export const COMPACT_BOLD_BRACES_RE = /^(\*\*(?:(?!\*\*).)+\*\*)\s*\{([^{}`]*)\}\s*((?:\*\([^*]*\)\*\s*)?—\s+1\.\s+`\[.*)$/;

/**
 * Validate a pool's brace group into its declaration.
 * @param {string} body the text inside the braces
 * @param {string} where for the error
 * @returns {{ declares: string[], crisisScoped: boolean, colour: boolean }}
 */
export function poolBraces(body, where) {
  const out = { declares: [], crisisScoped: false, colour: false };
  for (const item of body.split('·').map((x) => x.trim()).filter(Boolean)) {
    if (item === 'crisis-scoped') { out.crisisScoped = true; continue; }
    if (item === 'colour') { out.colour = true; continue; }
    if (POOL_RULINGS.includes(item)) continue;
    try { assertDeclarable(item.replace(/^no\s+/i, '')); } catch (e) {
      throw new Error(`${where}: the pool's brace group names '${item}', which is neither a pool ruling (${POOL_RULINGS.join(', ')}) nor a declarable atom — ${e.message}`, { cause: e });
    }
    out.declares.push(item);
  }
  return out;
}

/** The kernel's mark words, flat: a state variant's mark is one of these, `dm-only`, or a declarable atom. */
export const MARK_WORDS = new Set(Object.values(STATE_MARK_DIMENSIONS).flat());

/**
 * ⭐ THE TAG SLOT IS A CLOSED VOCABULARY (CENSUS-1b wave 1 item 2). Every mark a STATE variant's
 * tag slot carries after its angle is the audience mark, a kernel mark word, or a fact ATOM of
 * the vocabulary (`X` needs, `no X` excludes, `crisis: …`), and an atom must be DECLARABLE: an
 * unknown word, or one whose dimension has no home yet, refuses the projection by name.
 * @param {ReadonlyArray<string>} marks
 * @param {string} where
 */
export function assertStateMarks(marks, where) {
  assertColourAlone(marks, where);
  for (const m of marks) {
    if (m === 'dm-only' || m === COLOUR_MARK || MARK_WORDS.has(m)) continue;
    try { assertDeclarable(m.replace(/^no\s+/i, '')); } catch (e) {
      throw new Error(`${where}: the tag slot carries '${m}', which is no mark word and no declarable atom — ${e.message}`, { cause: e });
    }
  }
}
/**
 * R-AO: a `colour` mark ("read; presumes nothing") stands alone — beside the audience mark and the
 * kernel's state words at most, never beside an atom or a fact mark word.
 * @param {ReadonlyArray<string>} marks
 * @param {string} where
 */
export function assertColourAlone(marks, where) {
  const beside = colourConflicts(marks);
  if (beside.length) {
    throw new Error(`${where}: the tag slot carries \`colour\` beside ${beside.map((m) => `'${m}'`).join(', ')} — a colour line declares nothing else (R-AO)`);
  }
}
/** A trailing italic authoring note. */
export const TRAILING_NOTE_RE = /\s*\*\([^*]*\)\*\s*$/;
/**
 * WRITER-4's COMPACT ROW — a whole pool on one bullet line:
 *   `- \`STRONG\` — 1. \`[visitor]\` text · 2. \`[ledger]\` text · 3. \`[street]\` text`
 * The row key sits between the bullet and the first em dash; the variants are
 * interpunct-separated. Five blocks (DS-GEN-3/4/5/6/10) are authored this way and are
 * invisible to the one-variant-per-line grammar — 225 variants that would have gone
 * missing silently if the drop check did not count them.
 */
export const COMPACT_BULLET_RE = /^-\s+(.+?)\s+—\s+(1\.\s+`\[.*)$/;
/** The same shape carrying its OWN bold label rather than nesting under a group. */
export const COMPACT_BOLD_RE = /^\*\*((?:(?!\*\*).)+)\*\*\s*(?:\*\([^*]*\)\*\s*)?—\s+(1\.\s+`\[.*)$/;
/** A leading second tag on a variant body, e.g. `` `[dm-only]` the sentence ``. */
export const LEADING_TAG_RE = /^`\[([^\]]+)\]`\s+/;
export const COMPACT_VARIANT_RE = /(\d+)\.\s+`\[([^\]]+)\]`\s+(.*?)(?=\s+·\s+\d+\.\s+`\[|$)/g;

/** The reserved key of a block whose variants carry no pool label at all. */
export const SOLE_POOL = '*';

/**
 * A pool label is a short state-shape name (`Endorsed`, `ARITY — no banner`,
 * `intensity: low`). The annexes also carry bold-led RULE paragraphs whose bold span
 * happens to be followed by a gloss opener — `**Fence (from the sibling family):**
 * **there is no believed-solvency axis.** …` — and taking one of those as a label
 * splits a family's pool in two, which is how three causal families lost their
 * variants to a metadata heading in the first pass. A label therefore never ends in a
 * colon and never carries a sentence break.
 * @param {string} label
 */
export function isPoolLabel(label, remainder) {
  const s = label.trim();
  // A colon-terminated bold span is a rule heading in both annexes, never a state
  // value — JF-CPL-12a's FENCE HONOURED heading split that family's pool until this.
  if (s.endsWith(':')) return false;
  if (remainder.trim() === '') {
    // A whole-line bold is a label unless it is plainly a sentence. Engine values can
    // carry a stop (`riskLabel: Critical. The seat could fall`), so length decides.
    return !(s.length > 70 && (/\.\s/.test(s) || s.endsWith('.')));
  }
  // A bold span followed by a gloss: labels are short noun phrases, rule headings
  // are colon-led or sentence-shaped.
  if (s.endsWith(':')) return false;
  if (/\.\s/.test(s)) return false;
  return !(s.endsWith('.') && s.length > 40);
}

/** @param {string} s */
export function stripInlineCode(s) {
  return s.replace(/`/g, '').trim();
}

/** @param {string} s the raw bold label @returns {string} a stable pool key */
export function poolKeyOf(s) {
  return stripInlineCode(s)
    .replace(TRAILING_NOTE_RE, '')
    .replace(/^\*\*|\*\*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strip the trailing italic authoring note — an aside to the chair, never prose.
 * A regex cannot do this: several notes contain their own `**bold**`, so an
 * asterisk-free body is not a safe delimiter. The note is the LAST ` *(` whose
 * remainder is a balanced italic parenthetical running to end of line.
 * @param {string} text @returns {string}
 */
export function cleanText(text) {
  const out = text.trim();
  if (!out.endsWith('*')) return out;
  // Two note openers are in use: ` *(…)*` (the parenthetical aside) and ` *— …*`
  // (the slot-requirement note DS-FTH-3 carries). Both run to end of line.
  const at = Math.max(out.lastIndexOf(' *('), out.lastIndexOf(' *—'));
  if (at <= 0) return out;
  const body = out.slice(0, at).trim();
  return body.length > 0 ? body : out;
}

/**
 * Split an angle tag into its parts: `street · dm-only` / `ledger · cut`.
 *
 * ⛔ AND ROUTE `grammar: Vn` AWAY FROM `marks` (GRAMMAR_TAG_CONTRACT, moveGrammar.js:151-157).
 * The tag rides the same bracket slot as an audience mark, and left in `marks` it would put
 * eight new words into a vocabulary the kernel treats as CLOSED: `STATE_MARK_DIMENSIONS`'s own
 * contract arm reds on an unclassified mark, because an unclassified word is a state dimension
 * the kernel cannot see. The tag is a per-variant DATUM — nothing reads it at the draw — so it
 * takes its own field and moves no index.
 * @param {string} tag
 * @returns {{angle: string, marks: string[], grammar: string|null}}
 */
export function parseTag(tag) {
  const parts = tag.split('·').map((p) => p.trim()).filter(Boolean);
  const grammars = parts.map((part) => part.match(GRAMMAR_TAG_RE)).filter(Boolean);
  const rest = parts.filter((part) => !GRAMMAR_TAG_RE.test(part));
  if (grammars.length > 1) {
    throw new Error(`a variant carries ${grammars.length} \`grammar:\` tags; a variant realises ONE order`);
  }
  return {
    angle: rest[0] || '',
    marks: rest.slice(1),
    grammar: grammars.length ? grammars[0][1] : null,
  };
}

/**
 * A second bracketed tag, folded in. The grammar tag may stand in EITHER bracket, so both are
 * asked; an angle-less second tag contributes its first part as a mark.
 * @param {{angle: string, marks: string[], grammar: string|null}} first
 * @param {{angle: string, marks: string[], grammar: string|null}|null} extra
 * @returns {{marks: string[], grammar: string|null}}
 */
export function foldTags(first, extra) {
  if (!extra) return { marks: first.marks, grammar: first.grammar };
  if (first.grammar && extra.grammar) {
    throw new Error('a variant carries two `grammar:` tags; a variant realises ONE order');
  }
  return {
    marks: [...first.marks, extra.angle, ...extra.marks].filter(Boolean),
    grammar: first.grammar || extra.grammar,
  };
}

/** @param {string} line @returns {string[]} every `{slot}` named on a line */
export function slotsOn(line) {
  return [...line.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]);
}

/**
 * Parse one annex into blocks.
 * @param {string} src the markdown
 * @param {RegExp} headerRe matches a block header, capture 1 = block id
 * @param {string} label for error messages
 */
export function parseAnnex(src, headerRe, label, options = {}) {
  const lines = src.split('\n');
  /** @type {Array<{id:string,title:string,sectionTarget:string[],sectionTargetRaw:string|null,arms:string[],slots:string[],pools:Array<{key:string,variants:Array<object>,declared:Record<string,unknown>}>}>} */
  const blocks = [];
  let block = null;
  let pool = null;
  let lastBold = null;
  /** the pending label's brace group, validated (CENSUS-1b wave 1) */
  let lastBraces = null;
  let lastIndex = -1;
  let skipping = false;

  const openPool = (key) => {
    if (block === null) throw new Error(`${label}: pool "${key}" outside any block`);
    pool = { key, variants: [], declared: {}, braces: lastBraces };
    lastBraces = null;
    block.pools.push(pool);
    lastIndex = -1;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();

    const header = line.match(headerRe);
    if (header) {
      // A FOLDED block is an id kept for the record with its content moved elsewhere.
      skipping = /FOLDED INTO/i.test(line);
      block = skipping ? null : {
        id: header[1],
        title: line.replace(/^###\s+/, '').trim(),
        sectionTarget: [],
        sectionTargetRaw: null,
        arms: [],
        slots: [],
        pools: [],
      };
      if (block) blocks.push(block);
      pool = null;
      lastBold = null;
      lastIndex = -1;
      continue;
    }
    // ⛔ THE BLOCK REGION ENDS AT A NAMED ANNEX SECTION. `## §7b THE STATE CONNECTIVES` sits
    // after the last block, and without this the last block would go on consuming its rows: a
    // bold cell would be read as a pool label and a numbered row as a variant. Passed in per
    // annex rather than derived, because the CAUSAL annex carries `## §2`…`## §7` headings
    // BETWEEN its families and closing the region on those would move that leaf's parse.
    if (options.regionEnd && options.regionEnd.test(line)) {
      skipping = true;
      block = null;
      pool = null;
      lastBold = null;
      continue;
    }
    if (skipping || !block) continue;

    if (isDeclarationLine(line)) {
      // ⛔ A PENDING LABEL ALWAYS OPENS ITS POOL HERE (TASTE car M-2). The guard was
      // `pool === null && lastBold !== null`, which is only true for the FIRST pool of a
      // block: on the second and every later one a pending bold label was ignored and the
      // typed lines were folded into the PREVIOUS pool's declarations — a modifier's ROLE,
      // READS and ATTACH landing silently on the spine above it. It has never fired because
      // the annex carried no typed line at all until this car, and it would have fired on the
      // first one authored after a block's opening pool. The plant is in the projection
      // contract: two declared pools in one block, and the second's READS must be its own.
      if (lastBold !== null) { openPool(poolKeyOf(lastBold)); lastBold = null; }
      if (pool === null) throw new Error(`${label} ${block.id}: a typed line stands outside any pool (line ${i + 1})`);
      for (const decl of readDeclarations(line)) {
        applyDeclaration(decl, pool.declared, `${label} ${block.id} :: ${pool.key}`);
      }
      continue;
    }

    const face = line.match(FACE_ROW_RE);
    if (face) {
      const last = pool && pool.variants.length ? pool.variants[pool.variants.length - 1] : null;
      if (!last) throw new Error(`${label} ${block.id}: a \`[face]\` row stands before any variant (line ${i + 1})`);
      last.wordings.push(cleanText(face[1]));
      continue;
    }

    if (/^\*\*SLOTS[:.]\*\*/.test(line)) {
      block.slots = [...new Set(slotsOn(line))];
      continue;
    }
    if (/^\*\*SECTION-TARGET[:.]\*\*/.test(line)) {
      // BACKTICKED TOKENS ONLY, which is the shape the ARMS extractor below has always
      // used. The rule this replaces split the declaration on `,` as well as the intended
      // `·`, so `` `economy` (economic resilience, prosperity, food) `` projected as the
      // three fragments `economy (economic resilience`, `prosperity` and `food)`, and 26
      // of the 45 declaring state blocks carried at least one string outside the eight.
      // Prose on this line is an aside to the reader, never a target; assertSectionTargets
      // below judges what lands, and the raw line is kept so it can quote the row.
      block.sectionTargetRaw = line.replace(/^\*\*SECTION-TARGET[:.]\*\*/, '');
      block.sectionTarget = [...block.sectionTargetRaw.matchAll(/`([a-z][a-z0-9_-]*)`/g)]
        .map((m) => m[1]);
      continue;
    }
    if (/^\*\*ARMS[:.]\*\*/.test(line)) {
      // Hyphens are lawful in an arm name (`broker-town`); an underscore-only class
      // silently dropped that arm and orphaned the two variants tagged with it.
      block.arms = [...line.matchAll(/`([a-z][a-z0-9_-]*)`/g)].map((m) => m[1]);
      continue;
    }

    const bulletRow = line.match(COMPACT_BULLET_RE);
    // CENSUS-2b: a bold compact row carries its brace group after its label (`**\`port\`** {coast} — 1. …`).
    const boldRowBraced = bulletRow ? null : line.match(COMPACT_BOLD_BRACES_RE);
    const boldRow = bulletRow ? null : (boldRowBraced ? `${boldRowBraced[1]} ${boldRowBraced[3]}` : line).match(COMPACT_BOLD_RE);
    const compact = bulletRow || boldRow;
    if (compact) {
      // CENSUS-2b: a compact row is its own pool, so its brace group rides the ROW KEY
      // (`- \`STRONG\` {crisis-scoped} — 1. …`), read off before the key is formed so the key —
      // hashed into the draw — is byte-identical. A key's own braces (`head word in {\`Secure\`, …}`)
      // carry backticks and are never a declaration.
      const rowBraced = compact[1].match(COMPACT_ROW_BRACES_RE);
      const rowKey = poolKeyOf(rowBraced ? rowBraced[1] : compact[1]);
      if (rowBraced) lastBraces = poolBraces(rowBraced[2], `${label} ${block.id} :: ${rowKey}`);
      if (boldRow && boldRowBraced) lastBraces = poolBraces(boldRowBraced[2], `${label} ${block.id} :: ${rowKey}`);
      // A bulleted row NESTS under the bold group heading above it; a row carrying its
      // own bold label IS the pool and takes no prefix (and clears the pending label,
      // so a following bullet cannot inherit a heading that was never a group).
      const group = bulletRow && lastBold !== null ? poolKeyOf(lastBold) : '';
      if (boldRow) lastBold = null;
      // THE JOIN IS A COLON, NOT AN EM DASH (VOICE-1b, §854). A group-plus-row key is
      // the label/title separator VOICE_AND_TONE §6 sends to a colon, and the separator
      // this line MINTS is the one em dash in a pool key no author can reach: it is not
      // in either annex, so 56 of the corpus's 299 key em dashes could only be burned
      // here. The key is hashed into the draw (stateProseKernel.js `drawVariant`), so
      // this separator is renameable only while the corpus is dark.
      openPool(group ? `${group}: ${rowKey}` : rowKey);
      for (const m of compact[2].matchAll(COMPACT_VARIANT_RE)) {
        const first = parseTag(m[2]);
        const lead = m[3].match(LEADING_TAG_RE);
        const folded = foldTags(first, lead ? parseTag(lead[1]) : null);
        pool.variants.push({
          index: Number(m[1]),
          angle: first.angle,
          marks: folded.marks,
          grammar: folded.grammar,
          wordings: [],
          text: cleanText(lead ? m[3].slice(lead[0].length) : m[3]),
        });
      }
      if (pool.variants.length === 0) {
        throw new Error(`${label} ${block.id}: compact row "${rowKey}" parsed to zero variants (line ${i + 1})`);
      }
      // The row is self-contained; the next row re-opens under the same group label.
      lastIndex = -1;
      continue;
    }

    // A label's trailing brace group is the pool's own declaration; the label is read without it.
    const braced = line.match(POOL_BRACES_RE);
    const bold = (braced ? braced[1] : line).match(BOLD_LINE_RE);
    if (bold && isPoolLabel(bold[1], bold[2] || "")) {
      lastBold = bold[1];
      lastBraces = braced ? poolBraces(braced[2], `${label} ${block.id} :: ${poolKeyOf(bold[1])}`) : null;
      continue;
    }

    const canonical = line.match(CANONICAL_RE);
    if (canonical) {
      if (lastBold !== null) { openPool(poolKeyOf(lastBold)); lastBold = null; }
      // A block whose variants carry no label at all has ONE pool (every causal
      // family, and the few single-state blocks); '*' is its reserved key.
      if (!pool) openPool(SOLE_POOL);
      const slot = canonical[2] ? canonical[2].split('·').map((p) => p.trim()).filter(Boolean) : [];
      if (slot.some((p) => GRAMMAR_TAG_RE.test(p))) {
        throw new Error(`${label} ${block.id}: a canonical row's tag slot carries a \`grammar:\` tag (line ${i + 1}); the canonical row realises the engine's own order`);
      }
      assertColourAlone(slot, `${label} ${block.id} :: ${pool.key} #0`);
      pool.variants.push({
        index: 0, angle: 'canonical', marks: slot, grammar: null, wordings: [], text: cleanText(canonical[3]),
      });
      lastIndex = 0;
      continue;
    }

    const variant = line.match(VARIANT_RE);
    if (variant) {
      const n = Number(variant[1]);
      if (lastBold !== null) { openPool(poolKeyOf(lastBold)); lastBold = null; }
      if (!pool) openPool(SOLE_POOL);
      // A restart of the numbering with no new label would silently merge two pools.
      if (n <= lastIndex) {
        throw new Error(
          `${label} ${block.id}: variant numbering restarted at ${n} inside pool "${pool.key}"`
          + ` (line ${i + 1}) — the pool label is missing or is not a standalone bold line.`,
        );
      }
      lastIndex = n;
      const first = parseTag(variant[2]);
      const folded = foldTags(first, variant[3] ? parseTag(variant[3]) : null);
      if (options.closedMarks) assertStateMarks(folded.marks, `${label} ${block.id} :: ${pool.key} #${n}`);
      pool.variants.push({
        index: n,
        angle: first.angle,
        marks: folded.marks,
        grammar: folded.grammar,
        wordings: [],
        text: cleanText(variant[4]),
      });
      continue;
    }

    // A pending label is STICKY across the note paragraph several pools carry
    // between their heading and their first variant (DS-STR-1's gated ARITY pool is
    // the case that forced this). A later label overwrites it, so the pool a variant
    // lands in is always the NEAREST PRECEDING label — never an earlier one.
  }
  return blocks;
}

