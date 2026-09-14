/**
 * domain/prose/scribeBrief.js — ONE PROMPT. The bytes that cross the boundary in both
 * directions, built HERE and nowhere else (chair ruling 25;
 * DESIGN_SCRIBE_GENERATION_TIME_PROSE §3.1, §3.2).
 *
 * ── ⛔⛔ THE DEFECT THIS MODULE EXISTS TO CURE ──────────────────────────────────────
 * The product (`scribe-render/scribeCore.ts`) and the pilot harness (`scribe-harness/lib
 * /brief.mjs`) each built their own brief, their own turn and their own OUTPUT SCHEMA, and the
 * two schemas were not the same shape: the product asked for `{blockId, poolKey, vid, spine,
 * faces[], notebook[]}` per pool and the harness for a flat `{stance, source, pair, text}`. The
 * 2026-09-14 simulation ran the HARNESS's fork, so the figures the chair read — 15 lawful units,
 * five fallbacks, the Q arm's blanket — were measured on a prompt the product has never sent and
 * would never send. A pilot that measures a different prompt from the one that ships measures
 * nothing. So the builders live in ONE pure domain leaf: the edge function imports them from the
 * Deno bundle, the harness imports them from the dock by absolute path, and what the pilot
 * measures is what the reader gets.
 *
 * ── THE THREE BLOCKS, AND WHY THE SPLIT IS THE ECONOMICS (§3.1, ruling 31) ──────────
 *   1. THE BRIEF — `buildScribeBrief`. Byte-stable given the VOICE and the exemplar pack, which
 *      are two module-level constants at every call site, so it is byte-identical for every user,
 *      every world and every tab. ONE cache breakpoint shared by every settlement of the hour.
 *   2. THE TOWN BLOCK — `buildTownBlock`. The card's `town` section, which is the same bytes on
 *      all thirteen tabs of one settlement (W0 measured ~7 KB a tab, 42 KB of repeats over six
 *      tabs). A SECOND cache breakpoint, shared by a settlement's tabs.
 *   3. THE VOLATILE TURN — `buildScribeUserTurn`. The epoch, the record, the pools, and LAST the
 *      game master's instructions. Everything that differs between two tabs is here.
 *
 * ── THE CONTRACT OUT (§3.2) ────────────────────────────────────────────────────────
 * `SCRIBE_OUTPUT_SCHEMA`, closed at every level, carrying ONLY words: the annex `vid` the unit
 * was written for, the spine, the faces in the corpus's own order, the notebook rows. Nothing
 * about marks, sources, pairs or slots can cross — that is a wall, not a convenience.
 *
 * ── WHAT IS ALLOWED BACK ───────────────────────────────────────────────────────────
 * `parseScribeUnits` and `judgeUnits` live here too, and for the same reason the builders do: the
 * edge function and the pilot must run ONE judge or the pilot's refusal rate is a different
 * number from the product's. `judgeUnits` takes the refuter by injection so this leaf keeps no
 * import of its own.
 *
 * PURE and HEADLESS: no import, no clock, no RNG, no store, no file system, no DOM. It is
 * bundled for Deno and imported by a browser-adjacent test, so it may not reach for any of them.
 *
 * ⛔ NO OBJECT LITERAL IN THIS FILE CARRIES A NON-COMPUTED KEY THAT NAMES A WORLD-STATE LEAF.
 * The census's producer walk reads `Property` keys under `src/domain/**` as WRITES; the schema
 * below names only `units`, `blockId`, `poolKey`, `vid`, `spine`, `faces`, `notebook`, `type`,
 * `items`, `properties`, `required` and `additionalProperties`, none of which is one of the
 * eighteen identifiers that walk reads. See `townCard.js`'s header for the measurement.
 *
 * @enforced-by tests/lint/scribeBundle.walker.test.js
 * @enforced-by supabase/functions/scribe-render/scribeCore.test.ts
 */

/**
 * ⭐ THE OUTPUT SCHEMA (design §3.2). Closed — `additionalProperties: false` at every level — so
 * a response carrying a key this contract does not name is refused by the provider rather than
 * parsed and half-trusted here.
 */
export const SCRIBE_OUTPUT_SCHEMA = Object.freeze({
  type: 'object',
  additionalProperties: false,
  required: ['units'],
  properties: {
    units: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['blockId', 'poolKey', 'vid', 'spine', 'faces', 'notebook'],
        properties: {
          blockId: { type: 'string' },
          poolKey: { type: 'string' },
          vid: { type: 'integer' },
          spine: { type: 'string' },
          faces: { type: 'array', items: { type: 'string' } },
          notebook: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
});

/** The mechanical bars, restated for the model in the words the refuter enforces them in. */
const MECHANICAL_BARS = [
  'THE MECHANICAL BARS (the tier-0 refuter enforces every one of these and a breach is DROPPED, not corrected):',
  '- no em dash, no exclamation mark, no digit, no semicolon, no contraction;',
  '- no first person anywhere, in the fair copy or the notebook;',
  '- no `will` and no `shall`: the dossier reports what stands, never what is going to happen;',
  '- no flag name, no tick, no week, no schema word, no raw identifier: the engine\'s own spellings never reach the page;',
  '- every role phrase you use must be one this town seats, and every body you name must be a row this card carries;',
  '- at most three sentences in a unit, and at most two in any one face.',
].join('\n');

/** The shape rules of a unit, which are the artefact's own and not the voice's. */
const UNIT_RULES = [
  'THE SHAPE OF WHAT YOU RETURN, per pool the card lists:',
  '- `vid` is the ANNEX ROW the card gives for that pool. Copy it exactly. It is not a position.',
  '- `spine` replaces the corpus unit\'s spine and states the same fact in the archiver\'s hand.',
  '- `faces` replaces the corpus unit\'s faces IN THE SAME ORDER AND THE SAME NUMBER. Face i speaks',
  '  through the source the card gives at position i and through no other: the seating, the pairs',
  '  and the compromised roll are already decided and you are writing the words for them.',
  '- `notebook` replaces the DM-only rows, in their order, or is empty where the card has none.',
  '- `{slot}` tokens: use only the ones the card declares for that pool, or none at all.',
  'A POOL YOU CANNOT WRITE LAWFULLY IS OMITTED. An omitted pool draws the hand corpus, which is',
  'always there; a unit that breaks a bar above is dropped by the instruments and draws it too.',
  'Do not explain, apologise, or write anything outside the schema.',
].join('\n');

/**
 * ⭐ THE PLAUSIBLE-ADDITION BAR (chair ruling 29; the simulation's own finding).
 *
 * ⛔ IT IS IN THE BRIEF BECAUSE NO TIER-0 ARM CAN SEE IT. Both seats of the 2026-09-14
 * simulation, an Opus and a Sonnet, reached for a MECHANISM the card does not hold on the same
 * pool — a fine and a debtor's cell, a court backlog — on a card carrying `court` and `prison`
 * and neither a fine nor a debt nor a queue. Two of thirty lines across the two seats. Neither
 * contradicts a field, so C4, C3, X and the referent scan are all silent; the tier-1 checklist's
 * question 6 is what catches it AFTER the fact, and this bar is what stops it before.
 */
const PLAUSIBLE_ADDITION = [
  'THE PLAUSIBLE-ADDITION BAR. Add no mechanism, practice, cause, procedure, custom, price or',
  'arrangement the card does not name. If the card says a court and a prison, you may not say a',
  'fine, a debt, a backlog or a bribe. A line that explains HOW a thing works where the card only',
  'says THAT it stands is refused by the second reader and falls to the corpus.',
].join('\n');

/**
 * ⭐ THE TWO LADDERS (chair ruling 30). A STATIC TRUTH about the shipped engine, so it rides in
 * the cached half rather than being re-derived per town.
 *
 * ⛔ THE CARD REALLY DOES CONTRADICT ITSELF AND A GOOD MODEL REALLY DOES NOTICE. The posture
 * badge prints `Well-Defended` (the LABEL ladder) beside pool key `readiness ADEQUATE` (the BAND
 * ladder) for one score of 57; every threat row's funding note prints an underfunded percentage
 * beside `Economic Backing: Well-funded`. Both pairs are two true readings of two fields, and
 * aligning them is a shipped-surface change that is the owner's. Until then the model is TOLD
 * which of the two it is writing to, rather than left to pick and then be refuted for picking.
 */
const TWO_LADDERS = [
  'THE TWO LADDERS, WHICH ARE BOTH THE ENGINE\'S. The posture badge word (Fortress, Well-Defended,',
  'Defensible, Lightly Defended, Vulnerable, Undefended) and the readiness band (STRONG, ADEQUATE,',
  'WEAK, CRITICAL) are TWO ladders over ONE score and both are the engine\'s. Write to the pool',
  'key\'s band; never name the badge word and never reconcile the two. A funding note reading',
  '`Upkeep underfunded ... at 97%` beside `Economic Backing: Well-funded` is likewise two true',
  'readings of two fields; write to the pool key and neither number.',
].join('\n');

/**
 * ⭐ THE CORPUS LINE'S STANDING (chair ruling 30). The card hands the model the shipped line as
 * the claim and the fallback, and two of the units it hands over on the defense tab BREAK THE
 * LAW THEY EXEMPLIFY (a which-clause close, a colon, a number error inside a fill). A model told
 * only "this is the exemplar" imitates the breach; a model told what the line is FOR does not.
 */
const CORPUS_LINE_STANDING = [
  'THE CORPUS LINE\'S STANDING. The corpus line given with a pool is the CLAIM you must keep and',
  'the line that ships if yours is refused. It is not a model of the law: where it breaks a bar',
  'above (a which-clause close, a colon, a number error in a fill), do not imitate the breach.',
].join('\n');

/** The closing paragraph: the card is the world, and the model is a clerk in it. */
const THE_FACTS = [
  'THE FACTS ARE NOT YOURS TO CHOOSE. The card in the next turn is the whole world you may',
  'write about: every value it holds is true, everything it does not hold does not exist, and a',
  'sentence asserting a value the card does not carry is refused by the instruments. You are not',
  'summarising the card and not translating it. You are writing the lines the card already',
  'decided, in the words a professional archiver would have used.',
].join('\n');

/** The heading the exemplar pack rides under, so its standing is never mistaken for a gate. */
const EXEMPLAR_HEADING = [
  '## THE EXEMPLAR PACK',
  'What follows is the SELECTOR\'S GROUND and never a refuter\'s finding: it is what good looks',
  'like in this register, not a list you can breach. Where it and a bar above disagree, the bar',
  'wins, because the bar is the thing that drops a unit.',
].join('\n');

/**
 * ⭐⭐ THE BRIEF — the cached half, cache breakpoint 1.
 *
 * Byte-stable given its two inputs, which are module constants at every call site: the VOICE is
 * a transcription (`voice.ts` in the product, the workflow's own literal in the harness) and the
 * exemplar pack is a committed file. Two calls in different processes on different worlds
 * produce identical bytes, and the provider's prefix cache is hit from the second settlement of
 * the hour onward.
 *
 * ⛔ NO PADDING IS NEEDED AND NONE IS ADDED. The 4096-token cache floor was cleared by
 * `cachePadding` when the brief was the VOICE alone; with the exemplar pack in it the prefix is
 * an order of magnitude above the floor. `scribeCore.ts` keeps the padding function for the
 * narrative path's own idiom and a test asserts the built brief clears the floor without it.
 *
 * @param {{voice: string, exemplars: string}} input
 * @returns {string}
 */
export function buildScribeBrief(input) {
  const voice = typeof input?.voice === 'string' ? input.voice : '';
  const exemplars = typeof input?.exemplars === 'string' ? input.exemplars : '';
  return [
    'You are writing the composed prose of a settlement dossier for a tabletop game master.',
    'The dossier is compiled by ONE archiver. You are writing in that archiver\'s hand.',
    '',
    voice,
    '',
    MECHANICAL_BARS,
    '',
    UNIT_RULES,
    '',
    PLAUSIBLE_ADDITION,
    '',
    TWO_LADDERS,
    '',
    CORPUS_LINE_STANDING,
    '',
    THE_FACTS,
    '',
    EXEMPLAR_HEADING,
    '',
    exemplars,
  ].join('\n');
}

/**
 * ⭐ THE TOWN BLOCK — cache breakpoint 2, one per settlement rather than one per tab.
 *
 * W0 measured that about 7 KB of every tab card is the same `town` section (the roster, the
 * roles, the institutions, the holders), which on six tabs is the same 42 KB sent six times. It
 * is hoisted out of the volatile turn into its own cached system block, so a settlement's second
 * and later tabs read it at cache price. The harness hoisted it at W1; this is that hoist in the
 * product too.
 *
 * @param {object} card the town card (`townCard.js`)
 * @returns {string}
 */
export function buildTownBlock(card) {
  const town = card && typeof card === 'object' ? card.town : null;
  return [
    'THE TOWN, WHICH DOES NOT CHANGE BETWEEN TABS',
    'Every role, body and record you may name is in this section. A role this town does not seat',
    'and a record no body here keeps are both refused outright by the instruments and never reach',
    'the page. A source speaks through one of the roles its own roster lists and through no other.',
    JSON.stringify(town ?? {}, null, 1),
  ].join('\n');
}

/** A pool as the volatile turn presents it: the ground, and the corpus line as the exemplar. */
function poolBrief(pool) {
  const faces = Array.isArray(pool?.unit?.faces) ? pool.unit.faces : [];
  const sources = Array.isArray(pool?.faceSources) ? pool.faceSources : [];
  const rows = [
    `POOL ${JSON.stringify(String(pool?.poolKey ?? ''))} in block ${String(pool?.blockId ?? '')}`,
    `  vid: ${String(pool?.vid ?? '')}`,
    `  stance: ${String(pool?.angle ?? '')}${Array.isArray(pool?.marks) && pool.marks.length ? ` · marks ${pool.marks.join(' ')}` : ''}`,
    `  slots you may use: ${(Array.isArray(pool?.slots?.declared) ? pool.slots.declared : []).join(', ') || '(none)'}`,
    `  faces to write: ${faces.length}`,
  ];
  for (let i = 0; i < faces.length; i += 1) {
    rows.push(`    face ${i} speaks through: ${String(sources[i] ?? '(the bare fact)')}`);
  }
  if (pool?.compromised && pool.compromised.speaks === true) {
    rows.push(`  THE COMPROMISED SOURCE SPEAKS THIS YEAR: ${String(pool.compromised.source)} — it conceals on the symptom of its own secret and denies nothing else.`);
  }
  rows.push('  THE CORPUS LINE, as the claim and the fallback:');
  rows.push(`    spine: ${String(pool?.unit?.spine ?? '')}`);
  for (let i = 0; i < faces.length; i += 1) rows.push(`    face ${i}: ${String(faces[i] ?? '')}`);
  return rows.join('\n');
}

/**
 * ⭐ THE VOLATILE TURN (design §3.1 parts 2-4). The epoch, the record, the pools, and — LAST and
 * clearly ranked below the law — the game master's instructions. The TOWN is not here: it is in
 * the second cached block above.
 *
 * ⛔ THE INSTRUCTIONS ARE FLAVOUR, NEVER FACT (§5c rule 3, ruling 18). They may choose emphasis,
 * tone within the archiver's hand, which sources to hear more from and what to dwell on. They may
 * not add a fact the card does not hold, name a person, or lift a floor — and the sentence that
 * says so is in the SYSTEM half, so an instruction cannot argue with it from inside the user
 * turn. Under FINITE-SEMANTICS free text shapes words and never the world, and the tier-0 refuter
 * runs unchanged over the result, so an instruction asking for an unlawful line yields a FAIL and
 * the corpus draw rather than the unlawful line.
 *
 * @param {{card: object, record?: object|null, guidance?: string}} input
 * @returns {string}
 */
export function buildScribeUserTurn(input) {
  const card = input?.card || {};
  const pools = Array.isArray(card.pools) ? card.pools : [];
  const parts = [];

  parts.push(`THIS PAGE: tab ${String(card.tab ?? '')}, audience ${String(card.audience ?? '')}.`);
  parts.push('The town itself is the second block of the system prompt above and does not change');
  parts.push('between tabs; everything below is this page and this page alone.');
  parts.push('');
  parts.push('THE STATE THIS PAGE READS:');
  parts.push(JSON.stringify(card.epoch ?? {}, null, 1));

  if (input?.record) {
    parts.push('');
    parts.push('WHAT HAS MOVED SINCE THE LAST SURVEY, in the engine\'s own typed vocabulary. You may');
    parts.push('say that a value has changed ONLY where this record names it; you have not been given');
    parts.push('the prior prose and you are not continuing it.');
    parts.push(JSON.stringify(input.record, null, 1));
  }

  parts.push('');
  parts.push('THE LINES TO WRITE:');
  for (const pool of pools) parts.push(poolBrief(pool));

  const guidance = typeof input?.guidance === 'string' ? input.guidance.trim() : '';
  if (guidance) {
    parts.push('');
    parts.push('THE GAME MASTER\'S INSTRUCTIONS FOR THIS DOSSIER. They rank BELOW everything above:');
    parts.push('they may choose emphasis, tone within the archiver\'s hand, which sources to hear more');
    parts.push('from and what to dwell on; they may not add a fact the card does not hold, name a');
    parts.push('person, or lift a rule. Where they ask for something the card cannot support, write');
    parts.push('the lawful line and omit what cannot be written.');
    parts.push(guidance.slice(0, 4000));
  }

  return parts.join('\n');
}

/**
 * Parse the provider's structured answer. Returns a typed refusal rather than throwing, because
 * every caller is inside a credited call and a throw there is a refund path rather than a fact.
 * @param {string} answerText
 * @returns {{ok: boolean, units: object[], reason: string}}
 */
export function parseScribeUnits(answerText) {
  let parsed;
  try {
    parsed = JSON.parse(String(answerText || ''));
  } catch {
    return { ok: false, units: [], reason: 'unparseable' };
  }
  const rows = Array.isArray(parsed?.units) ? parsed.units : null;
  if (!rows) return { ok: false, units: [], reason: 'no_units' };
  const units = [];
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const blockId = typeof row.blockId === 'string' ? row.blockId : '';
    const poolKey = typeof row.poolKey === 'string' ? row.poolKey : '';
    const vid = typeof row.vid === 'number' && Number.isFinite(row.vid) ? row.vid : null;
    const spine = typeof row.spine === 'string' ? row.spine.trim() : '';
    if (!blockId || !poolKey || vid === null || !spine) continue;
    units.push({
      blockId,
      poolKey,
      vid,
      spine,
      faces: Array.isArray(row.faces) ? row.faces.map((f) => String(f ?? '').trim()) : [],
      notebook: Array.isArray(row.notebook) ? row.notebook.map((n) => String(n ?? '').trim()) : [],
    });
  }
  return { ok: units.length > 0, units, reason: units.length > 0 ? '' : 'no_lawful_units' };
}

/** The card's pool row for one (block, key), or null. */
function cardPool(card, blockId, poolKey) {
  const pools = Array.isArray(card?.pools) ? card.pools : [];
  return pools.find((p) => String(p?.blockId) === blockId && String(p?.poolKey) === poolKey) || null;
}

/**
 * ⭐⭐ THE GATE EVERY RENDERED LINE PASSES (design §4; chair rulings 5 and 6).
 *
 * The tier-0 instruments run over every unit, from the SAME bundle the corpus programme is
 * audited by, so the Scribe is held to the corpus's own standard rather than to a second one
 * written for it. The rule is the corpus's rule:
 *   FAIL      → the unit is DROPPED and that pool draws the hand corpus. Silently, on the player
 *               page: the dossier is one archiver, and telling the reader which line a model wrote
 *               would break the frame (ruling 6).
 *   WITHHELD  → SHIPS. The corpus ships its own WITHHELDs; a rendered line is held to the same bar
 *               and not to a stricter one invented here.
 *   PASS      → ships.
 * A unit whose FACE COUNT does not match the corpus unit's is dropped BEFORE the instruments see
 * it, because the words would be mis-seated rather than merely wrong.
 *
 * ⭐ THE VERDICT ROW CARRIES ITS FAIL AND WITHHELD FINDINGS, and only those. Ruling 6 makes the
 * per-unit verdicts readable on the DM page as a REPORT, and a bare arm name ("Q") is not a
 * report a reader can act on; the arm's own subject, value and description are. The REPORT and
 * NOT-EXECUTABLE rows are deliberately NOT carried: the MEASURE limb alone emits six rows per
 * line, which would multiply the artefact's size for figures the pilot reads from its own run.
 *
 * @param {ReadonlyArray<object>} units
 * @param {object} card
 * @param {(unit: object, card: object, extra?: object) => object} refute the bundle's `refuteUnit`,
 *   injected so this module has no import of its own
 * @returns {{kept: object[], verdicts: object[], dropped: number}}
 */
export function judgeUnits(units, card, refute) {
  const kept = [];
  const verdicts = [];
  let dropped = 0;

  for (const unit of (Array.isArray(units) ? units : [])) {
    const pool = cardPool(card, unit.blockId, unit.poolKey);
    const corpusFaces = Array.isArray(pool?.unit?.faces) ? pool.unit.faces : [];
    const row = {
      blockId: unit.blockId,
      poolKey: unit.poolKey,
      vid: unit.vid,
      verdict: 'FAIL',
      arms: [],
      findings: [],
    };
    if (!pool) {
      row.arms = ['CARD-POOL'];
      verdicts.push(row);
      dropped += 1;
      continue;
    }
    if (unit.faces.length !== corpusFaces.length) {
      row.arms = ['FACE-COUNT'];
      verdicts.push(row);
      dropped += 1;
      continue;
    }

    // Every row of the unit is refuted on its own: the spine, then each face, then each notebook
    // line. The worst verdict any of them earns is the unit's, because a unit ships whole.
    const texts = [unit.spine, ...unit.faces, ...unit.notebook].filter((t) => t !== '');
    let worst = 'PASS';
    const arms = new Set();
    for (const text of texts) {
      let out;
      try {
        // ⛔ ONE ROW AT A TIME, AND THE UNIT'S OWN FACES ARE NOT PASSED. A5 and A6 are SIBLING
        // arms: handed the face set on every row they would run four times over one unit and
        // report the same overlap four times. The row is judged as the string it is, exactly as
        // it was before this module took the function over, so no verdict moves with the move.
        out = refute(
          { text, blockId: unit.blockId, poolKey: unit.poolKey },
          card,
          { corpusUnit: pool.unit || null },
        );
      } catch {
        out = { verdict: 'FAIL', findings: [{ arm: 'REFUTER-THREW', channel: 'FAIL' }] };
      }
      const verdict = String(out?.verdict || 'FAIL');
      if (verdict === 'FAIL') worst = 'FAIL';
      else if (verdict === 'WITHHELD' && worst !== 'FAIL') worst = 'WITHHELD';
      for (const finding of Array.isArray(out?.findings) ? out.findings : []) {
        if (!finding || (finding.channel !== 'FAIL' && finding.channel !== 'WITHHELD')) continue;
        arms.add(String(finding.arm));
        row.findings.push({
          arm: String(finding.arm ?? ''),
          channel: String(finding.channel ?? ''),
          subject: String(finding.subject ?? ''),
          value: String(finding.value ?? ''),
          description: String(finding.description ?? ''),
        });
      }
    }
    row.verdict = worst;
    row.arms = [...arms].sort();
    verdicts.push(row);
    if (worst === 'FAIL') { dropped += 1; continue; }
    kept.push(unit);
  }

  return { kept, verdicts, dropped };
}

/**
 * ⭐ THE TIER-1 CHECKLIST (design §4). W1 MEASURED that 27 of 50 moved claims are reachable by NO
 * tier-0 arm — the certainty, quantifier and scope classes — which is the whole case for a second
 * pass. It is a CHECKLIST and not a critic: a closed list of yes/no questions about ONE line, on
 * the same model as the writer (ruling 10's conflicted-witness rule applies to BYOK), inside the
 * repair-loop budget. A `yes` on any question is a finding; the unit falls to the corpus like any
 * other FAIL.
 * @param {ReadonlyArray<object>} units
 * @param {object} card
 * @returns {string}
 */
export function buildTier1Checklist(units, card) {
  const lines = [
    'Below are lines written for one settlement dossier, and the facts they were written from.',
    'For EACH line answer the five questions with `yes` or `no` and nothing else.',
    '  1. CERTAINTY: does the line claim to know something more surely than the facts below support?',
    '  2. QUANTIFIER: does it say how many, how much or how often, where the facts give no number?',
    '  3. SCOPE: does it apply to more of the town, or more of the time, than the facts cover?',
    '  4. ACTOR: does someone act in it who is not a body or role these facts seat?',
    '  5. FORECAST: does it say what is going to happen rather than what stands?',
    'A `yes` to any question means the line is refused.',
    '',
    'THE FACTS:',
    JSON.stringify(card?.town ?? {}, null, 1),
    JSON.stringify(card?.epoch ?? {}, null, 1),
    '',
    'THE LINES:',
  ];
  let n = 0;
  for (const unit of (Array.isArray(units) ? units : [])) {
    for (const text of [unit.spine, ...unit.faces, ...unit.notebook]) {
      if (!text) continue;
      n += 1;
      lines.push(`${n}. ${text}`);
    }
  }
  return lines.join('\n');
}
