/**
 * dossier-annex-grammar.mjs — THE TYPED ANNEX LINES OF ARCH-COMPOSED-PROSE §2.5, and every
 * refusal in that table, as functions the projection and its contract test both drive.
 *
 * WHY A LIB AND NOT A BLOCK INSIDE THE PROJECTOR. scripts/generate-dossier-state-prose.mjs is
 * an ENTRY script: it reads the annexes and writes the leaves at import time, so a test cannot
 * import it to drive one refusal without regenerating the corpus. Every refusal below has to
 * be convicted by a plant, and a plant that has to re-run the whole projection to see one
 * thrown error is a plant nobody re-runs. scripts/lib/dossier-slot-shapes.mjs already carries
 * exactly this shape for the SHAPE gate — imported by the projector AND by
 * tests/data/dossierStateProseProjection.contract.test.js — so this file is that idiom applied
 * to the grammar, and the projector keeps ONE copy of each rule.
 *
 * WHAT IS AND IS NOT AUTHORED TODAY (SEAM car 4). The annex carries NO per-pool typed line at
 * this tip and NO face row: car 4 emits `poolMeta` for every pool from the projector's own
 * knowledge (`role: 'spine'`, the measured counts, `attach: []`) and mints `vid` on every
 * state variant. The grammar below is landed WHOLE anyway, with every refusal executable,
 * because cars 8 and 9 author against it and a rule that arrives with its first author is a
 * rule nobody has ever seen refuse anything.
 *
 * THE ONE THING THE ANNEX GAINS TODAY is `## §7b THE STATE CONNECTIVES` — the connective
 * phrases, which live in that section and in the projected leaf and nowhere else (T-F1).
 *
 * @enforced-by tests/data/dossierStateProseProjection.contract.test.js
 * @consumes docs/content/RECEIPT_POOLS_DOSSIER_STATE.md §7b
 */

/** ARCH §2.3: the three roles a pool may declare. */
export const POOL_ROLES = Object.freeze(['spine', 'modifier', 'turn']);

/**
 * ARCH line 59: a modifier adds ONE move, drawn from these six. `ABSENCE` is struck outright
 * (§4.6, R-DA-08, and the register card refuses it on its own terms); `HISTORY` is struck on
 * a state spine (R-DA-19, S15); `OPEN` is NOT-EXECUTABLE until a typed unresolved field
 * exists (SITTING A12); `CLOSE` and `LABEL` are positional and never authored.
 */
export const MODIFIER_MOVES = Object.freeze([
  'PRESENT', 'CONSEQUENCE', 'OBJECT', 'INSTITUTION', 'GEOGRAPHY', 'TRADITION',
]);

/** The four relations (ARCH §4.5). A fifth is refused because the brief names four. */
export const RELATIONS = Object.freeze(['addition', 'consequence', 'tension', 'contrast']);

/**
 * The FOUR REACHABLE (relation, seat) pairs, and the FORM each seat takes (E-F10, T-F6).
 * `consequence` seats at the clause and takes a fragment; the other three seat at the
 * sentence and take a sentence. A pair outside this table is a projector error.
 */
export const REACHABLE_SEATS = Object.freeze({
  consequence: Object.freeze({ seat: 'clause', form: 'fragment' }),
  tension: Object.freeze({ seat: 'sentence', form: 'sentence' }),
  contrast: Object.freeze({ seat: 'sentence', form: 'sentence' }),
  addition: Object.freeze({ seat: 'sentence', form: 'sentence' }),
});

/**
 * ⛔ S2 IS UNSIGNED AT THIS TIP (ARCH §13 row 6, §12 car 7). The clause seat exists only once
 * the owner signs it, so a `FORM: fragment` declaration is refused until this flag moves, and
 * it moves in the car that carries the signature and in no other.
 */
export const S2_SIGNED = false;

/**
 * ARCH §5.3 — what a turn may be keyed on. Tiers 1a to 1c are AVAILABLE; both tier-2 forms are
 * REFUSED at the dossier (the import wall; `cause:` needs the 16 scores, `join:` needs a
 * deriver that does not exist), and they are NAMED here rather than omitted so the refusal
 * answers with its reason instead of with "unknown id".
 */
export const TURN_KEY_REGISTRY = Object.freeze([
  Object.freeze({ tier: '1a', re: /^condition:[a-z0-9_]+(?::[a-z0-9_]+)?$/, standing: 'AVAILABLE' }),
  Object.freeze({ tier: '1b', re: /^corruption:(?:revealed|covert)$/, standing: 'AVAILABLE' }),
  Object.freeze({ tier: '1c', re: /^contradiction:[a-z0-9_]+$/, standing: 'AVAILABLE' }),
  Object.freeze({
    tier: '2', re: /^cause:[a-z0-9_-]+$/, standing: 'REFUSED',
    why: 'a `cause:` key needs the sixteen render-time scores behind the import wall (546,887 B'
      + ' over 28 files); ARCH §13 row 11 gates it on the persisted digest',
  }),
  Object.freeze({
    tier: '2', re: /^join:[A-Za-z0-9_-]+$/, standing: 'REFUSED',
    why: 'a `join:` key needs the causal register\'s join-deriver, which does not exist; ARCH'
      + ' §12 car 13 is owner-gated, wire or retire',
  }),
]);

/**
 * ⛔ THE FOUR INDEX-PAIRED LIST POSITIONS, BY BLOCK (P-F7). Their salience key
 * `${seed}::${blockId}::${spineKey}::salience::${candidateKey}` is byte-identical across the
 * rows of one list, so key 5 is a total tie there and a modifier would seat by accident.
 * Modifiers are REFUSED on them until Shift 2 (ARCH §12 car 10) lands `::${instanceId}`.
 *
 * THREE BLOCKS COVER THE FOUR POSITIONS, and the fourth position has no mount id of its own:
 * `conflicts` is DS-GEN-2 (`overview.conflicts`), `steadings` is DS-GEN-8
 * (`overview.steadings`), and BOTH `neighbours` and `cross-settlement engagements` come back
 * under DS-REL-1 while only `relationships.network` is in the mount registry (measured
 * against docs/content/wiring-census.json's `sites`, SEAM car 4). Keying the refusal on the
 * BLOCK therefore covers all four, and covers the mountless one too.
 */
export const INDEX_PAIRED_BLOCKS = Object.freeze(['DS-GEN-2', 'DS-GEN-8', 'DS-REL-1']);

/** A typed declaration line: `**ROLE:** \`modifier\` · **FORM:** \`fragment\``. */
const DECLARATION_RE = /\*\*([A-Z-]+):\*\*\s*([^*]*?)(?=\s*·\s*\*\*[A-Z-]+:\*\*|$)/g;
/** The tags §2.5 declares. Anything else on a `**WORD:**` line is not this grammar's. */
export const DECLARATION_TAGS = Object.freeze([
  'ROLE', 'READS', 'NARROWS', 'RELATION', 'FORM', 'MOVE', 'ATTACH', 'EXPLAINS', 'SPINES', 'COVERS',
]);
/** A face sub-row: `   - \`[face]\` the same claim, said again`. */
export const FACE_ROW_RE = /^\s*-\s+`\[face\]`\s+(.*)$/;
/** The `[grammar: Vn]` tag, wherever it stands among a variant's tags. */
export const GRAMMAR_TAG_RE = /^grammar:\s*(V[1-8])$/;
/** A pool key that is a bare number (P-F12) — it collides with a variant row's own numbering. */
export const NUMERIC_POOL_KEY_RE = /^\d+$/;

/**
 * ⭐ THE DECLARATIONS, READ OUT OF THE ANNEX BY THE CENSUS (TASTE car M-2).
 *
 * ⛔ WHY THE CENSUS NEEDS THEM AT ALL, AND WHY THIS IS NOT A SECOND PARSER. A MODIFIER pool's
 * selecting predicate lives in its desk's `*StateProseCandidates.js` leaf, so no rung of the
 * wiring census's ladder can recover its reading and the row would carry no `tests` — against
 * which the projector then refuses the pool's own `READS:` line. The census therefore reads
 * the annex's declaration for exactly that class of pool. This is a NARROW scan and not a
 * second annex grammar: it finds the `**ROLE:**` lines and walks BACKWARD to the nearest bold
 * label and the nearest block header, which is well defined because a declaration line can
 * only ever follow the pool it declares. The projector's own parse stays the one that decides
 * what a pool IS; the walker asserts the two agree on every pool that declares a role.
 *
 * @param {string} src the state annex
 * @returns {Map<string, {block: string, pool: string, role: string, reads: string[],
 *   relation: string, move: string, form: string, attach: string[]|null}>} `block :: pool` keyed
 */
export function readAnnexDeclarations(src) {
  const lines = String(src).split('\n');
  /** @type {Map<string, {block: string, pool: string, role: string, reads: string[],
   *   relation: string, move: string, form: string, attach: string[]|null}>} */
  const out = new Map();
  let block = '';
  let label = '';
  /** @type {{block: string, pool: string, role: string, reads: string[], relation: string,
   *   move: string, form: string, attach: string[]|null}|null} */
  let open = null;
  for (const raw of lines) {
    const line = raw.trimEnd();
    const header = line.match(/^###\s+(DS-[A-Z]+-\d+)\b/);
    if (header) { block = header[1]; label = ''; open = null; continue; }
    const bold = line.match(/^\*\*((?:(?!\*\*).)+)\*\*\s*$/);
    if (bold && !/^[A-Z-]+[:.]$/.test(bold[1].trim())) {
      label = bold[1].replace(/`/g, '').replace(/\s+/g, ' ').trim();
      open = null;
      continue;
    }
    if (!isDeclarationLine(line)) continue;
    if (!block || !label) continue;
    if (!open) {
      open = {
        block, pool: label, role: 'spine', reads: [], relation: '', move: '', form: '', attach: null,
      };
      out.set(`${block} :: ${label}`, open);
    }
    for (const decl of readDeclarations(line)) {
      if (decl.tag === 'ROLE') open.role = decl.tokens[0] || 'spine';
      if (decl.tag === 'READS') open.reads = decl.tokens;
      if (decl.tag === 'RELATION') open.relation = decl.tokens[0] || '';
      if (decl.tag === 'MOVE') open.move = decl.tokens[0] || '';
      if (decl.tag === 'FORM') open.form = decl.tokens[0] || '';
      if (decl.tag === 'ATTACH') open.attach = /^derived\b/.test(decl.body) ? null : decl.tokens;
    }
  }
  return out;
}

/** @param {string} line @returns {boolean} */
export function isDeclarationLine(line) {
  const m = String(line).match(/^\*\*([A-Z-]+):\*\*/);
  return Boolean(m) && DECLARATION_TAGS.includes(m[1]);
}

/**
 * Read every typed declaration on one line. A line may carry several, joined by ` · `, which
 * is §2.5's own worked row (`**ROLE:** \`modifier\` · **FORM:** \`fragment\` · **MOVE:** …`).
 * @param {string} line
 * @returns {Array<{tag: string, body: string, tokens: string[]}>}
 */
export function readDeclarations(line) {
  const out = [];
  for (const m of String(line).matchAll(DECLARATION_RE)) {
    const body = m[2].trim();
    out.push({
      tag: m[1],
      body,
      tokens: [...body.matchAll(/`([^`]+)`/g)].map((t) => t[1]),
    });
  }
  return out;
}

/** @param {string} label @param {string} message */
function refuse(label, message) {
  throw new Error(`${label}: ${message}`);
}

/**
 * Fold one declaration into a pool's declared metadata, refusing an unknown token AT THE
 * TOKEN. Cross-field refusals (a relation with no table row, an attach the block cannot hold)
 * need the whole block and run in `assertPoolDeclaration` below.
 * @param {{tag: string, body: string, tokens: string[]}} decl
 * @param {Record<string, unknown>} into
 * @param {string} label
 */
export function applyDeclaration(decl, into, label) {
  const { tag, body, tokens } = decl;
  switch (tag) {
    case 'ROLE':
      if (tokens.length !== 1 || !POOL_ROLES.includes(tokens[0])) {
        refuse(label, `ROLE \`${tokens.join('` `') || body}\` is outside {${POOL_ROLES.join(', ')}}`);
      }
      into.role = tokens[0];
      break;
    case 'READS':
      if (tokens.length === 0) refuse(label, 'READS names no backticked path');
      into.reads = tokens;
      break;
    case 'NARROWS':
      if (tokens.length === 0) refuse(label, 'NARROWS names no backticked path');
      // E-F2 / T-F7: a narrowing is a CHAIR RULING, so the row carries the ruling id and the
      // sentence it ruled. Without both the narrowing is one author's opinion of a branch.
      if (!/\bS\d+\b|\b§[\dA-Za-z.-]+/.test(body) || !/["“][^"”]+["”]/.test(body)) {
        refuse(label, 'NARROWS carries no chair ruling id and quoted sentence — the ruling is'
          + ' what makes a narrowing a ruling rather than a preference (E-F2, T-F7)');
      }
      into.narrows = tokens;
      into.narrowsRuling = body;
      break;
    case 'RELATION':
      if (tokens.length !== 1 || !RELATIONS.includes(tokens[0])) {
        refuse(label, `RELATION \`${tokens.join('` `') || body}\` is outside the four`
          + ` {${RELATIONS.join(', ')}} — a fifth relation is refused (§4.5)`);
      }
      into.relation = tokens[0];
      break;
    case 'FORM':
      if (tokens.length !== 1 || !['fragment', 'sentence'].includes(tokens[0])) {
        refuse(label, `FORM \`${tokens.join('` `') || body}\` is neither \`fragment\` nor \`sentence\``);
      }
      if (tokens[0] === 'fragment' && !S2_SIGNED) {
        refuse(label, 'FORM `fragment` needs the CLAUSE SEAT, and S2 is unsigned (ARCH §13'
          + ' row 6) — until the owner signs it the unit is spine plus one sentence');
      }
      into.form = tokens[0];
      break;
    case 'MOVE':
      if (tokens.length !== 1 || !MODIFIER_MOVES.includes(tokens[0])) {
        refuse(label, `MOVE \`${tokens.join('` `') || body}\` is outside the six`
          + ` {${MODIFIER_MOVES.join(', ')}} — ABSENCE is struck (§4.6, R-DA-08) and HISTORY`
          + ' is struck on a state spine (R-DA-19, S15)');
      }
      into.move = tokens[0];
      break;
    case 'ATTACH':
      // `derived` is the default and names no key; anything else is an explicit narrowing.
      into.attach = /^derived\b/.test(body) ? null : tokens;
      break;
    case 'EXPLAINS':
      if (tokens.length !== 1) refuse(label, 'EXPLAINS names exactly one registry id');
      into.explains = tokens[0];
      break;
    case 'SPINES':
      into.spines = tokens;
      break;
    case 'COVERS':
      into.covers = tokens;
      break;
    default:
      refuse(label, `unknown typed line \`${tag}\``);
  }
}

/**
 * Is this turn key in the registry, and is its tier available?
 * @param {string} id
 * @returns {{ok: true}|{ok: false, why: string}}
 */
export function turnKeyStanding(id) {
  const row = TURN_KEY_REGISTRY.find((r) => r.re.test(id));
  if (!row) return { ok: false, why: `\`${id}\` is outside TURN_KEY_REGISTRY (ARCH §5.3)` };
  if (row.standing !== 'AVAILABLE') return { ok: false, why: `\`${id}\` is tier ${row.tier}, REFUSED: ${row.why}` };
  return { ok: true };
}

/**
 * ⭐⭐ THE AUTHORING MARKER, AND THE ONE FLAG THAT ADMITS IT (TASTE car 6, ARCH §12 row 6).
 *
 * The taste's seven modifier pools land their TYPED LINES before a word of their prose exists,
 * because the writers author against a LICENCE CARD that can only be printed once the pool has
 * a census row, and the pool only has a census row once its annex declaration exists. The
 * placeholder each pool carries in the meantime is one `[plain]` row whose whole text is this
 * marker and the pool key.
 *
 * ⛔ AND THE SHIPPED BUILD REFUSES IT BY NAME. A placeholder that could ship is a placeholder
 * that ships: the projector throws on the marker unless it was invoked with `--taste`, which
 * nothing in the product's own gate, npm script or CI ever passes. The refusal names the pool
 * and the marker, so the day someone runs the ordinary projector over a taste annex they are
 * told exactly which rows are unwritten rather than being handed a leaf full of brackets.
 */
export const AUTHORING_MARKER = '\u27E6TO-AUTHOR\u27E7';

/**
 * Refuse a variant whose text carries the authoring marker, unless the taste flag is set.
 * @param {string} label
 * @param {ReadonlyArray<{text: string, index: number}>} variants
 * @param {boolean} taste
 * @param {(message: string) => void} [waive] called instead of throwing, under the flag
 */
export function assertNoAuthoringMarker(label, variants, taste, waive) {
  for (const v of variants || []) {
    if (!String(v.text).includes(AUTHORING_MARKER)) continue;
    const message = `variant ${v.index} carries the authoring marker ${AUTHORING_MARKER}:`
      + ' the pool\'s wording set has not been written. The marker is admitted ONLY under'
      + ' `node scripts/generate-dossier-state-prose.mjs --taste`, which the shipped build'
      + ' never passes (TASTE car 6, ARCH §12 row 6)';
    if (!taste) refuse(label, message);
    if (waive) waive(`${label}: ${message}`);
  }
}

/**
 * Every cross-field refusal of §2.5's table for ONE pool, against the block it sits in and
 * the census's reading of it.
 *
 * @param {object} input
 * @param {string} input.blockId
 * @param {string} input.poolKey
 * @param {Array<{angle: string, marks: string[], text: string, slots: string[], index: number}>} input.variants
 * @param {Record<string, unknown>} input.declared the folded declarations
 * @param {(pool: string) => {tests: string[], reads: string[], objectClass: string|null, sites: string[]}|null} input.censusOf
 * @param {(field: string) => boolean} input.isCovert
 * @param {(a: string, b: string) => Array<{relation: string, direction: string}>} input.edgesFrom
 * @param {Set<string>} input.blockPoolKeys
 * @param {Record<string, string>} input.declaredRoleByPool
 * @param {boolean} [input.taste] the `--taste` flag: the dock-only relaxations of TASTE car 6
 * @param {(message: string) => void} [input.waive] where a relaxed refusal is PRINTED instead
 */
export function assertPoolDeclaration(input) {
  const {
    blockId, poolKey, variants, declared, censusOf, isCovert, edgesFrom,
    blockPoolKeys, declaredRoleByPool,
  } = input;
  const taste = Boolean(input.taste);
  /** @param {string} message */
  const waive = (message) => { if (input.waive) input.waive(message); };
  const label = `DOSSIER_STATE ${blockId} :: ${poolKey}`;
  const role = declared.role || 'spine';

  if (NUMERIC_POOL_KEY_RE.test(poolKey)) {
    refuse(label, 'a pool key matching /^\\d+$/ collides with a variant row\'s own numbering'
      + ' and cannot be told from one in an annex diff (P-F12)');
  }

  const row = censusOf(poolKey);

  // ── READS ────────────────────────────────────────────────────────────────────────
  if (Array.isArray(declared.reads)) {
    if (role === 'modifier' && declared.reads.length > 1) {
      refuse(label, `a modifier READS exactly ONE field path; this row names ${declared.reads.length}`
        + ' — the one-path rule is what keeps the corpus off the exponential (§11)');
    }
    for (const path of declared.reads) {
      if (row && !row.tests.includes(path)) {
        refuse(label, `READS \`${path}\`, which the wiring census does not list under this`
          + ' pool\'s tests. The census is the source of truth for what a pool reads (§3.5);'
          + ' a READS line may narrow it, never widen it');
      }
      if (isCovert(path)) {
        const unmarked = variants.filter((v) => !(v.marks || []).includes('dm-only'));
        if (unmarked.length > 0) {
          refuse(label, `READS the COVERT-SOURCE path \`${path}\` while ${unmarked.length} of`
            + ` ${variants.length} variants carry no \`dm-only\` mark — a player page would`
            + ' show the shape of a DM fact (T-F5)');
        }
      }
    }
  }

  // ── NARROWS ──────────────────────────────────────────────────────────────────────
  if (Array.isArray(declared.narrows)) {
    for (const path of declared.narrows) {
      if (row && !row.tests.includes(path)) {
        refuse(label, `NARROWS to \`${path}\`, which is not among the census's tests for this`
          + ' pool — a narrowing is a SUBSET of what the branch evaluates (E-F2)');
      }
      const named = variants.some((v) => v.text.includes(`{${path.split('.').pop()}}`));
      if (named) {
        refuse(label, `NARROWS away \`${path}\` while a variant's text names it — A0b convicts`
          + ' a spine that discriminates on a field it claims not to read (T-F7)');
      }
    }
  }

  // ── RELATION and FORM ────────────────────────────────────────────────────────────
  if (role === 'modifier') {
    if (!declared.relation) {
      refuse(label, 'a modifier declares a RELATION — the connective is chosen by the typed'
        + ' provenance edge and never by the music (§4.5)');
    }
    const seat = REACHABLE_SEATS[declared.relation];
    if (declared.form && declared.form !== seat.form) {
      refuse(label, `FORM \`${declared.form}\` disagrees with the seat \`${declared.relation}\``
        + ` takes (\`${seat.seat}\` ⇒ \`${seat.form}\`)`);
    }
    if (declared.relation === 'consequence' || declared.relation === 'tension') {
      const spineKeys = declared.attach === null || declared.attach === undefined
        ? [...blockPoolKeys].filter((k) => (declaredRoleByPool[k] || 'spine') === 'spine')
        : declared.attach;
      const field = Array.isArray(declared.reads) ? declared.reads[0] : '';
      let licensed = false;
      let reversed = false;
      for (const spineKey of spineKeys) {
        const spineRow = censusOf(spineKey);
        const primary = spineRow ? spineRow.reads[0] : '';
        if (!primary || !field) continue;
        for (const edge of edgesFrom(primary, field)) {
          if (edge.relation !== declared.relation) continue;
          if (edge.direction === 'a→b' || edge.direction === 'a->b') licensed = true;
          else reversed = true;
        }
      }
      if (!licensed && reversed) {
        refuse(label, `RELATION \`${declared.relation}\` on a row whose only table edge runs`
          + ' modifier→spine — that row is a CAUSE and seats as `addition` (§4.5)');
      }
      if (!licensed) {
        refuse(label, `RELATION \`${declared.relation}\` with NO relation-table row whose`
          + ' endpoints include the spine\'s PRIMARY field. No row means `addition` (§5.2);'
          + ' at this tip the table joins nothing a desk reads (car 0\'s F1), so every'
          + ' authorable joint is an `addition`');
      }
    }
  } else if (declared.relation || declared.form || declared.move) {
    refuse(label, `a \`${role}\` pool carries a modifier-only line (RELATION / FORM / MOVE)`);
  }

  // ── TURNS ────────────────────────────────────────────────────────────────────────
  if (role === 'turn') {
    if (!declared.explains) refuse(label, 'a turn declares EXPLAINS — a turn with no registry id explains nothing (§5.3)');
    const standing = turnKeyStanding(declared.explains);
    if (!standing.ok) refuse(label, `EXPLAINS ${standing.why}`);
  } else if (declared.explains || declared.spines || declared.covers) {
    refuse(label, `a \`${role}\` pool carries a turn-only line (EXPLAINS / SPINES / COVERS)`);
  }

  // ── ATTACH ───────────────────────────────────────────────────────────────────────
  if (Array.isArray(declared.attach) && (role === 'modifier' || role === 'turn')) {
    const field = Array.isArray(declared.reads) ? declared.reads[0] : '';
    const ownClasses = row ? (row.objectClasses || (row.objectClass ? [row.objectClass] : [])) : [];
    const classes = new Set();
    for (const spineKey of declared.attach) {
      if (!blockPoolKeys.has(spineKey)) {
        refuse(label, `ATTACH names \`${spineKey}\`, which block ${blockId} does not hold`
          + ' — a cross-block attach is wave two\'s reservoir act and names its site in the act (P-F9)');
      }
      const spineRow = censusOf(spineKey);
      // ⛔ THE BRANCH GRAIN, NOT THE FUNCTION-WIDE ONE (TASTE car M-2). §2.5's own refusal row
      // reads "a spine whose BRANCH `tests` the modifier's field", and SITTING §O.1 ruled the
      // branch grain for exactly this question; `censusOf().tests` is the FUNCTION-WIDE union
      // and `.reads` is the selecting branch's own. Read against the function-wide set,
      // `wallRationalePoolKey`'s WALLED-STRAINED "tests" `config.monsterThreat` — a field its
      // branch returns before ever reaching — and the whole DS-DEF-11 country modifier of ARCH
      // §6.3 is refused at a site the architecture specifies. Zero shipped rows move: no
      // shipped pool declares `role: modifier`, so this guard has never run on the corpus.
      const spineTests = spineRow ? (spineRow.reads || spineRow.tests) : [];
      if (spineRow && field && spineTests.includes(field)) {
        refuse(label, `ATTACH \`${spineKey}\`, whose selecting branch already tests \`${field}\``
          + ' — a modifier may not restate or negate the fact its spine was chosen by (§4.6)');
      }
      if (INDEX_PAIRED_BLOCKS.includes(blockId)) {
        refuse(label, `ATTACH \`${spineKey}\` on an INDEX-PAIRED list position (${blockId}):`
          + ' every row of that list shares one salience key, so the rank is a total tie.'
          + ' Modifiers are refused there until Shift 2 lands the instance key (P-F7)');
      }
      // ⛔ THE REFUSAL READS THE SETS, NOT THE FIRST CLASS (TASTE car M-2, closing the
      // projector half of the MEASURE fold's cure 9). The census emits `objectClasses` because
      // a key can name two civic objects and first-wins hid it; the refusal here still compared
      // `objectClass` to `objectClass`, so `granary AND hospital` beside a `care` modifier was
      // admitted on the projector side exactly as the fold said it must not be. Two keys
      // collide when their class SETS intersect.
      const spineClasses = spineRow ? (spineRow.objectClasses || (spineRow.objectClass ? [spineRow.objectClass] : [])) : [];
      const shared = ownClasses.filter((k) => spineClasses.includes(k));
      if (shared.length > 0) {
        const message = `ATTACH \`${spineKey}\`: the spine's key and the modifier's key name the`
          + ` same civic object class \`${shared.join('` `')}\`, which is a restatement the field`
          + ' guard cannot see (T-F12)';
        // ⛔⛔ WAIVED UNDER `--taste`, PRINTED, AND NEVER SILENT. The taste measured that this
        // key-string proxy refuses FOUR of the seven attach sites ARCH §6.3-§6.5 specifies, and
        // that three of them collide on a POLARITY MARKER the sibling rule T-F3 requires the
        // key to carry (`country: pressed (walled)` shares `wall` with every DS-DEF-11 spine)
        // while the fourth collides on the building/stock conflation inside the `store` class
        // (`stores: short` beside `granary AND hospital`, the very site §8.3's own worked card
        // names). Renaming the pools to dodge the proxy is the failure the guard exists to
        // catch, and re-cutting the closed class list from a never-landed dock would move
        // shipped rows on a rule the chair froze. So the taste WAIVES it behind the same flag
        // that admits the authoring marker, prints every waiver with the class it collided on,
        // and hands the sitting the measurement. The real guard on the real text — arm A1 over
        // `typedFactsOf` — runs on every composed unit in the taste harness regardless.
        if (!taste) refuse(label, message);
        waive(`${label}: ${message}`);
      }
      if (spineRow) for (const cls of spineRow.objectClasses || []) classes.add(cls);
    }
    if (declared.relation && declared.relation !== 'addition' && classes.size > 1) {
      refuse(label, `ATTACH spans ${classes.size} value classes (${[...classes].sort().join(', ')})`
        + ' on a relation-bearing pool. A relation that flips with the spine\'s polarity is TWO'
        + ' pools with DISJOINT attach sets, never one set that spans both (T-F3)');
    }
  }
}

/**
 * ⭐⭐ THE SEAT LICENCE, ASKED WHERE THE CENSUS IS VISIBLE (SEAM car 4d; ARCH §4.4, §4.5, §5.2).
 *
 * ⛔ WHY IT LIVES HERE AND NOT IN THE COMPOSER, which is the whole point of the car. ARCH §5.2
 * fixes the licence as "the row for the spine's PRIMARY field — the first entry of `reads` —
 * times the modifier's field", and ARCH §16 keeps `reads` in the census JSON, which never
 * ships. So the composer was asking a question its own input could not answer: it read
 * `spineMeta.reads[0]` on a `PoolMeta` that has no `reads` key, got `undefined` on every pool
 * that will ever exist, and degraded INTO the correct answer only because the table joins
 * nothing today. A field name a module cannot license is a claim, not code. The licence is
 * therefore resolved at PROJECTION, where the census, the relation rows and the ratified
 * aliases are all in hand, and frozen onto the pool as a seat.
 *
 * ⛔ AND THE POOL-LEVEL ANSWER IS THE `every`-GRAIN, NOT THE `some`-GRAIN, which is the one
 * judgment this function makes. `assertPoolDeclaration` above asks the AUTHORING question —
 * "can this modifier seat anywhere?" — and one licensed spine is enough for it. A frozen
 * `seat` is read by the composer against WHATEVER spine drew, so it may say `clause` only
 * when EVERY (spine, modifier) pair the pool's attach set names carries a licensing row. A
 * mixed attach set answers `sentence`/`no-row` and loses a lawful clause on the licensed
 * spine; the veto shape is a per-pair map, which costs a key per pair and is recorded on the
 * receipt.
 *
 * @param {string} endpoint a relation-table endpoint (a PRODUCER token, `condition:plague`)
 * @param {string} readPath a desk READ path from the wiring census
 * @param {Map<string, string>} aliasOf the RATIFIED aliases, endpoint -> desk read root
 * @returns {boolean} whether the endpoint and the read path are the same fact
 */
export function endpointReads(endpoint, readPath, aliasOf) {
  if (!endpoint || !readPath) return false;
  // A ratified alias REPLACES the endpoint with the read root it is the same fact as
  // (SITTING §P.2-27); an endpoint with no alias may already be a read path itself.
  const root = aliasOf && aliasOf.has(endpoint) ? aliasOf.get(endpoint) : endpoint;
  return readPath === root || readPath.startsWith(`${root}.`);
}

/**
 * Every relation row that runs FROM one desk read path TO another, in READ space.
 *
 * The leaf keys a pair once and carries the direction on the row (ARCH §2.3), so a row under
 * `${b}|${a}` whose direction is `b→a` runs a→b just as a `a→b` row under `${a}|${b}` does;
 * both are read, and both mean "the engine computes `to` from `from`".
 * @param {ReadonlyArray<{a: string, b: string, relation: string, source: string,
 *   direction: string}>} rows the census's own relation rows
 * @param {Map<string, string>} aliasOf
 * @param {string} from the spine's PRIMARY field
 * @param {string} to the modifier's field
 * @returns {Array<{a: string, b: string, relation: string, source: string, direction: string}>}
 */
export function seatEdges(rows, aliasOf, from, to) {
  return (Array.isArray(rows) ? rows : []).filter((row) => {
    const forward = row.direction === 'a->b' || row.direction === 'a→b';
    const head = forward ? row.a : row.b;
    const tail = forward ? row.b : row.a;
    return endpointReads(head, from, aliasOf) && endpointReads(tail, to, aliasOf);
  });
}

/**
 * ⭐ THE RESOLUTION, one answer per pool, with the reason it took.
 *
 * The reasons are a closed vocabulary and every one of them is PRINTED by the projector, so
 * "no clause seats today" is a tally over 708 pools rather than a sentence in a header:
 *
 *   `not-a-modifier`  a spine or a turn: it is the seat, it does not take one
 *   `not-consequence` a modifier whose relation is `addition`, `tension` or `contrast` —
 *                     the sentence seat is its own by the register card, no licence needed
 *   `no-field`        a `consequence` modifier with no READS line (the gate refuses it too)
 *   `no-pair`         a `consequence` modifier naming no spine at all
 *   `no-primary`      a named spine whose census row recovered no reading
 *   `no-row`          a named pair with no relation row from the spine's primary field
 *   `s2-unsigned`     LICENSED, and the clause seat does not exist yet (ARCH §13 row 6)
 *   `row`             licensed and seated: `rows` names the row ids that licensed it
 *
 * ⚠ THE LICENCE IS ASKED BEFORE S2, deliberately. S2 is a signature, not a measurement, and
 * reporting `s2-unsigned` on a pool that has no row would hide car 0's F1 behind an owner
 * row. A pool reads `no-row` when it has no row, whatever S2 says.
 * @param {object} input
 * @param {string} input.role
 * @param {string} [input.relation] the DECLARED relation
 * @param {ReadonlyArray<string>|null} [input.attach] the spine keys this pool may attach to
 * @param {ReadonlyArray<string>} [input.reads] the pool's own declared READS
 * @param {(key: string) => {reads: string[]}|null} input.censusOf
 * @param {ReadonlyArray<{a: string, b: string, relation: string, source: string,
 *   direction: string}>} input.relationRows
 * @param {Map<string, string>} input.aliasOf
 * @param {boolean} [input.s2] defaults to the module's own S2 flag
 * @returns {{seat: 'sentence'|'clause', reason: string, rows: string[]}}
 */
export function seatOf(input) {
  const { role, relation, attach, reads, censusOf, relationRows, aliasOf } = input;
  const s2 = input.s2 === undefined ? S2_SIGNED : input.s2;
  const no = (reason) => ({ seat: /** @type {'sentence'} */ ('sentence'), reason, rows: [] });
  if (role !== 'modifier') return no('not-a-modifier');
  if ((relation || 'addition') !== 'consequence') return no('not-consequence');
  const field = Array.isArray(reads) ? reads[0] : '';
  if (!field) return no('no-field');
  const pairs = Array.isArray(attach) ? attach : [];
  if (pairs.length === 0) return no('no-pair');
  /** @type {string[]} */
  const ids = [];
  for (const spineKey of pairs) {
    const spineRow = censusOf(spineKey);
    const primary = spineRow && spineRow.reads ? spineRow.reads[0] : '';
    if (!primary) return no('no-primary');
    const licensing = seatEdges(relationRows, aliasOf, primary, field)
      .filter((row) => row.relation === 'consequence');
    if (licensing.length === 0) return no('no-row');
    for (const row of licensing) {
      const id = `${row.source}:${row.a}|${row.b}`;
      if (!ids.includes(id)) ids.push(id);
    }
  }
  ids.sort();
  if (!s2) return { seat: 'sentence', reason: 's2-unsigned', rows: ids };
  return { seat: 'clause', reason: 'row', rows: ids };
}

/**
 * ⭐ THE EMITTED FRAGMENT — exactly the keys the projector spreads into a pool's `poolMeta`.
 *
 * ⛔ A SPINE TAKES NO `seat` KEY, and that is the estate's own grain rather than a saving.
 * `relation`, `form`, `move`, `readsCount`, `explains`, `spines` and `covers` are all emitted
 * only where the pool has one — "a pool with no row is ABSENT, not zero" — and an ABSENT seat
 * reads in the composer as the sentence, which is what a pool that cannot take a seat takes.
 * Writing `seat: 'sentence'` onto all 708 shipped spines would add ≈ 47 KB across the six
 * leaves that says only what `role` already says. The veto shape is the unconditional key.
 * @param {Parameters<typeof seatOf>[0]} input
 * @returns {{seat?: string, seatReason?: string, seatRow?: string[]}}
 */
export function seatMeta(input) {
  if (input.role !== 'modifier') return {};
  const licence = seatOf(input);
  return licence.seat === 'clause'
    ? { seat: licence.seat, seatRow: licence.rows }
    : { seat: licence.seat, seatReason: licence.reason };
}

/**
 * The face sub-rows of one variant, refused where §2.5's table refuses them.
 * @param {object} input
 * @param {string} input.label
 * @param {{angle: string, text: string, slots: string[]}} input.parent
 * @param {string[]} input.faces
 * @param {number} input.pinnedFaceCount
 * @param {(slot: string) => string|undefined} input.shapeOf
 * @param {ReadonlyArray<string>} input.clauseOpeners
 * @param {'fragment'|'sentence'} input.form
 */
export function assertFaces(input) {
  const { label, parent, faces, pinnedFaceCount, shapeOf, clauseOpeners, form } = input;
  if (faces.length === 0) return;
  if (parent.angle === 'canonical') {
    refuse(label, 'a `canonical` row is a byte-copy of a string the engine ships; a face on it'
      + ' would mint a second home for that sentence, so the seven bound rows keep ONE face (P-F6)');
  }
  if (1 + faces.length > pinnedFaceCount) {
    refuse(label, `${1 + faces.length} faces against a pin of ${pinnedFaceCount}. A face count`
      + ' is a mechanism of the SHIFT REGISTER: every world drawing this variant re-rolls its'
      + ' face when the modulus moves, so growth is a declared car and never an edit (P-F6)');
  }
  const parentSlots = [...new Set(parent.slots)].sort().join(' ');
  for (const face of faces) {
    const slots = [...new Set([...face.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]))]
      .sort().join(' ');
    if (slots !== parentSlots) {
      refuse(label, `a face names slots {${slots || 'none'}} where its parent names`
        + ` {${parentSlots || 'none'}} — a wording set says the SAME claim with the same fills,`
        + ' so eligibility cannot differ within it (A6)');
    }
    if (form === 'fragment') {
      if (/^\s*,/.test(face)) refuse(label, 'a fragment face opens on a comma: the comma lives in the CONNECTIVES leaf and nowhere else (T-F1)');
      const first = face.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
      if (clauseOpeners.includes(first)) {
        refuse(label, `a fragment face opens on \`${first}\`, a word of a clause list — the joint`
          + ' is drawn from the leaf, so a face that carries one joins twice (T-F1)');
      }
    } else {
      const open = face.trim().match(/^\{([a-zA-Z_][a-zA-Z0-9_]*)\}/);
      if (open && shapeOf(open[1]) === 'proper') {
        refuse(label, `a sentence face opens on the \`proper\`-typed slot {${open[1]}} — wall 10`
          + ' widened across the join: the settlement token opens at most one variant per pool'
          + ' and never two adjacent (T-F8)');
      }
    }
  }
}

/**
 * The pool's row numbering, read as `vids[]` (ARCH §2.6). A `vid` is the annex ROW NUMBER at
 * the freeze, so it survives a renumbering: a run that would MOVE one is a projector error.
 * @param {string} label
 * @param {Array<{index: number}>} variants
 * @param {ReadonlyArray<number>|undefined} frozenVids the vids the last freeze recorded, if any
 * @param {number|undefined} pinnedCount
 * @returns {number[]}
 */
export function vidsOf(label, variants, frozenVids, pinnedCount) {
  const vids = variants.map((v) => v.index);
  const seen = new Set();
  let last = -1;
  for (const vid of vids) {
    if (!Number.isInteger(vid) || vid < 0) refuse(label, `variant id ${vid} is not a row number`);
    if (seen.has(vid)) refuse(label, `two variants carry row number ${vid} — a vid is an identity`);
    if (vid <= last) refuse(label, `row number ${vid} follows ${last}: the numbering runs backwards`);
    seen.add(vid);
    last = vid;
  }
  if (Array.isArray(frozenVids)) {
    for (let i = 0; i < Math.min(frozenVids.length, vids.length); i++) {
      if (frozenVids[i] !== vids[i]) {
        refuse(label, `a renumbering would move variant ${i}'s vid from ${frozenVids[i]} to`
          + ` ${vids[i]}. A vid is what names a variant across a rewrite and what §13 row 22's`
          + ' index-stable draw hashes on; nothing is ever deleted and nothing is renumbered (§2.6)');
      }
    }
    if (vids.length < frozenVids.length) {
      refuse(label, `${vids.length} variants against ${frozenVids.length} frozen vids — NEVER TRIM (§2.6)`);
    }
  }
  if (Number.isInteger(pinnedCount) && vids.length > pinnedCount) {
    refuse(label, `${vids.length} variants against a pin of ${pinnedCount}. Appending re-rolls`
      + ' three quarters of this pool\'s reads under `% length`, so growth is Shift 3 and a'
      + ' declared car (P-F1)');
  }
  return vids;
}

/**
 * ⭐⭐ THE SHA INTERLOCK (ARCH §3.5, §12 row 4). The census records the sha256 of every file it
 * was taken over. If one has moved since, the census's reading of what a pool TESTS is a
 * reading of a composer that no longer exists, and a `poolMeta` projected from it would be a
 * confident wrong answer that no later instrument could tell from a right one.
 *
 * ⛔ FAIL-CLOSED ON ABSENCE TOO: a census with no rows, or with a schema this projection does
 * not know, is not "no metadata" — it is a projection that cannot know what it is claiming.
 *
 * THE READER IS INJECTED so a plant can drive the refusal without moving a committed byte:
 * the projector passes a real one, the contract test passes a fake that answers with a moved
 * file. A guard nobody has watched refuse anything is a guard nobody has measured.
 *
 * @param {object} census
 * @param {(rel: string) => string} readText repo-relative path -> the file's bytes
 * @param {(text: string) => string} sha256
 */
export function assertCensusCurrent(census, readText, sha256) {
  const label = 'the wiring census';
  if (!census || typeof census !== 'object') refuse(label, 'is missing. The RENDER half of poolMeta is projected from it; run `node scripts/wiring-census.mjs` first');
  if (census.schema !== 'wiring-census/1') refuse(label, `carries schema \`${census.schema}\`, not \`wiring-census/1\``);
  if (!Array.isArray(census.rows) || census.rows.length === 0) refuse(label, 'carries no rows');
  const stale = [];
  for (const [rel, sha] of Object.entries(census.stamp?.files || {})) {
    const now = sha256(readText(rel));
    if (now !== sha) stale.push(`${rel} (census ${sha.slice(0, 12)}, tree ${now.slice(0, 12)})`);
  }
  if (stale.length) {
    refuse(label, `is STALE against ${stale.length} of its own stamped files:`
      + `\n  ${stale.join('\n  ')}`
      + '\n  Its reading of what each pool tests was taken over a composer that has since moved,'
      + ' and poolMeta is projected from that reading. Re-take the census'
      + ' (`node scripts/wiring-census.mjs`) before regenerating the leaves.');
  }
}

// ── §7b · THE STATE CONNECTIVES ──────────────────────────────────────────────────────

/** The spelling of the seat that takes no word at all. */
export const EMPTY_OPENER_TOKEN = 'EMPTY-OPENER';
/** The heading that opens the connectives section, and closes the block region before it. */
export const CONNECTIVES_HEADING_RE = /^##\s+§7b\b/;
/** One row of §7b's table. */
const CONNECTIVE_ROW_RE = /^\|\s*`([a-z]+)`\s*\|\s*`([a-z]+)`\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(.+?)\s*\|$/;

/**
 * Read `## §7b THE STATE CONNECTIVES` into the four lists, refusing every row §2.5 refuses.
 * @param {string} src the state annex
 * @returns {{lists: Record<string, Record<string, string[]>>, pins: Array<{relation: string,
 *   seat: string, floor: number, pin: number, owed: boolean}>}}
 */
export function parseConnectives(src) {
  const label = 'DOSSIER_STATE §7b';
  const lines = src.split('\n');
  const at = lines.findIndex((l) => CONNECTIVES_HEADING_RE.test(l.trimEnd()));
  if (at < 0) refuse(label, 'the section is missing — the connective phrases live there and in the projected leaf and nowhere else (T-F1)');
  /** @type {Record<string, Record<string, string[]>>} */
  const lists = {};
  /** @type {Array<{relation: string, seat: string, floor: number, pin: number, owed: boolean}>} */
  const pins = [];
  for (let i = at + 1; i < lines.length && !/^##\s/.test(lines[i]); i++) {
    const m = lines[i].trimEnd().match(CONNECTIVE_ROW_RE);
    if (!m) continue;
    const [, relation, seat, floorText, pinText, cell] = m;
    if (!RELATIONS.includes(relation)) {
      refuse(label, `relation \`${relation}\` is outside the four {${RELATIONS.join(', ')}}`);
    }
    if (REACHABLE_SEATS[relation].seat !== seat) {
      refuse(label, `(\`${relation}\`, \`${seat}\`) is not one of the FOUR REACHABLE pairs:`
        + ` \`${relation}\` seats at \`${REACHABLE_SEATS[relation].seat}\` (E-F10)`);
    }
    if (lists[relation] && lists[relation][seat]) refuse(label, `(\`${relation}\`, \`${seat}\`) is declared twice`);
    const pin = Number(pinText);
    const joints = /\bOWED\b/.test(cell)
      ? []
      : [...cell.matchAll(/`([^`]*)`/g)].map((j) => (j[1] === EMPTY_OPENER_TOKEN ? '' : j[1]));
    for (const joint of joints) {
      if (/[—–]/.test(joint)) refuse(label, `the joint \`${joint}\` carries an em dash`);
      if (/\bwhich\b/i.test(joint)) refuse(label, `the joint \`${joint}\` carries a \`which\` tail (wall 6)`);
      if (/[0-9%]/.test(joint)) refuse(label, `the joint \`${joint}\` carries a digit or a percent (T-F14)`);
    }
    if (joints.length > pin) {
      refuse(label, `(\`${relation}\`, \`${seat}\`) carries ${joints.length} joints against its`
        + ` pin of ${pin}. A longer list changes the modulus of every joint drawn on it, so a`
        + ' longer list is a DECLARED row on the shift register (§2.4 key 4)');
    }
    if (joints.length < pin) {
      refuse(label, `(\`${relation}\`, \`${seat}\`) carries ${joints.length} joints and pins ${pin}`
        + ' — the pin is a measurement of the list, not an aspiration');
    }
    lists[relation] = { ...(lists[relation] || {}), [seat]: joints };
    pins.push({ relation, seat, floor: Number(floorText), pin, owed: joints.length < Number(floorText) });
  }
  const reachable = Object.entries(REACHABLE_SEATS).map(([r, s]) => `${r}.${s.seat}`).sort();
  const declared = pins.map((p) => `${p.relation}.${p.seat}`).sort();
  if (declared.join(' ') !== reachable.join(' ')) {
    refuse(label, `the table declares ${declared.join(' ') || '(nothing)'} and the four reachable`
      + ` pairs are ${reachable.join(' ')} — a fifth pair is a projector error, and a missing one`
      + ' silences a seat with no reader ever told');
  }
  return { lists, pins };
}

// ── THE KINSHIP SET (REWRITE car 8a-4; SITTING §T.4 adopting agenda C″) ─────────────

/**
 * ⭐⭐ `kin` — WHICH OF A MODIFIER'S ATTACH SPINES IT ACTUALLY THREADS WITH, resolved HERE and
 * frozen onto the pool, because the composer may not read a lexicon and must not guess.
 *
 * ⛔⛔ WHY THE SIGNAL IS PROJECTED AND NOT COMPUTED AT RENDER, WITH THE MEASUREMENT. The owner's
 * thread rule (agenda C″) is lexical: "the modifier sharing the spine's subject noun sits
 * nearest the spine". Deciding that inside `composeStateProse.js` needs the estate's ONE stop
 * list, which lives in `src/domain/prose/composedWalker.js` — and ARCH §4.1 says in terms that
 * "an import from generation, the pulse kernel or `src/domain/prose/` reds" in the composer.
 * MEASURED with `scripts/lib/module-closure.mjs` rather than argued: that import adds 4 files
 * and 150,231 B to a composer whose whole closure is 70,252 B, so it would TRIPLE a first-paint
 * module and drag the entry walker and the move grammar onto the render path. Spelling a second
 * stop list in the composer is the drift REWRITE car 8a-2 refused by name (two vocabularies
 * that agree with themselves and with nothing else). So the reading is resolved where the
 * `reads`, the relation rows and the aliases already are — at PROJECTION, the same place and
 * the same commit as the SEAT LICENCE — and the composer reads a frozen array, which is ARCH
 * §4.1's own division of labour: the CORPUS supplies relations and roles.
 *
 * ⛔ EVERY VARIANT AND EVERY FACE, ON BOTH SIDES, so the answer cannot depend on a draw. A
 * spine is KIN only where every face of every variant of this pool shares a content word with
 * every face of every variant of that spine pool. The looser reading — ANY face sharing with
 * ANY face — was considered and refused: it would make the ORDER of composition a function of
 * which face the seeded face-draw happened to take, so two towns on the same seed could seat
 * different modifiers for a reason no instrument prints.
 *
 * ⛔ AND IT SHIPS ON NOTHING AT THIS TIP, BY CONSTRUCTION. `kin` is emitted only where it is
 * non-empty, and only a MODIFIER has an attach set; every one of the 708 shipped pools is a
 * spine with `attach: []`, so the key reaches no leaf and no generated byte moves. The
 * projection contract holds it at zero shipped pools beside `relation`, `form` and the rest.
 *
 * @param {{pools: Record<string, ReadonlyArray<{text?: string, wordings?: ReadonlyArray<string>}>>,
 *   attach: ReadonlyArray<string>,
 *   variants: ReadonlyArray<{text?: string, wordings?: ReadonlyArray<string>}>,
 *   contentWordsOf: (text: string) => ReadonlyArray<string>}} input
 * @returns {string[]} the attach spines this pool threads with, sorted
 */
export function kinSpines(input) {
  const facesOf = (variant) => [
    String(variant && variant.text ? variant.text : ''),
    ...(Array.isArray(variant && variant.wordings) ? variant.wordings.map(String) : []),
  ];
  const wordSetsOf = (variants) => (Array.isArray(variants) ? variants : [])
    .flatMap((variant) => facesOf(variant).map((face) => new Set(input.contentWordsOf(face))));
  const mine = wordSetsOf(input.variants);
  if (mine.length === 0) return [];
  /** @type {string[]} */
  const kin = [];
  for (const spineKey of Array.isArray(input.attach) ? input.attach : []) {
    const theirs = wordSetsOf(input.pools ? input.pools[spineKey] : undefined);
    if (theirs.length === 0) continue;
    // EVERY pair of faces must share at least one content word. `every` over an empty list is
    // true, which is why `mine.length === 0` and `theirs.length === 0` are answered above
    // rather than left to fall through as a vacuous kinship.
    const threads = mine.every((a) => theirs.every((b) => [...a].some((word) => b.has(word))));
    if (threads) kin.push(spineKey);
  }
  return kin.sort();
}
