/**
 * scribe-render/scribeCore.ts — THE PURE HALF OF THE SCRIBE: what crosses the boundary in both
 * directions, and what is allowed back onto a settlement.
 *
 * Everything here is a pure function over plain data, so the money path in `index.ts` is a thin
 * shell around it and the whole contract is testable without a provider, a database or a clock.
 *
 * ── THE CONTRACT IN (design §3.1) ────────────────────────────────────────────────────────────
 * Two parts, and the split is the whole economics of the feature:
 *   1. THE BRIEF — byte-stable, `cache_control: ephemeral` with a one-hour TTL: the VOICE, the
 *      mechanical bars, the output schema and the rules of the unit. Written once per hour per
 *      model and read at a fraction of the price on every tab of every settlement after that.
 *   2. THE VOLATILE TURN — the town card for THIS tab, the epoch record, and the game master's
 *      instructions. Everything that differs between two settlements is here and nowhere else.
 *
 * ⭐ JUDGMENT (vetoable): ONE BRIEF FOR EVERY BLOCK, NOT ONE PER BLOCK. The design calls the
 * cached part "the block brief", per block. Measured against the contract, the only block-specific
 * content it could hold is the block's pool keys and their spine stances — and those are per-TOWN
 * facts (which pools fired, which variant was drawn), already carried by the card in the volatile
 * turn. Hoisting them into the prefix would make the prefix vary by town and destroy the cache,
 * which is the opposite of what §3.1 is for. So the prefix is byte-identical for every user, every
 * world and every tab, which is also what §8 requires of the managed path.
 *
 * ── THE CONTRACT OUT (design §3.2) ───────────────────────────────────────────────────────────
 * Structured, schema-validated, never free text. One object per pool, carrying ONLY the words:
 * the annex `vid` it was written for, the spine, the faces in the corpus's own order, and the
 * notebook rows. Nothing about marks, sources, pairs or slots can cross — see the kernel's
 * `scribeVariantPool` for why that is a wall and not a convenience.
 *
 * ── WHAT IS ALLOWED BACK (design §4, chair rulings 5 and 6) ──────────────────────────────────
 * Every returned unit is run through the TIER-0 REFUTER — the same instruments, from the same
 * bundle, that the corpus programme is audited by. A FAIL never ships: the unit is dropped and
 * that pool draws the hand corpus, silently, because the dossier is one archiver and the reader
 * is not told which line a model wrote. A WITHHELD ships (the corpus's own rule). The verdicts
 * ride on the artefact so the DM page can read them as a report.
 */

// deno-lint-ignore-file no-explicit-any

/** The artefact shape this renderer writes. Pinned equal to `SCRIBE_ARTEFACT_SCHEMA`. */
export const SCRIBE_ARTEFACT_SCHEMA = 1;

/** The writer and the tier-1 refuter (chair ruling 8; the API skill's current default). */
export const SCRIBE_MODEL = 'claude-opus-5';

/** The provider beta that turns on server-side refusal fallbacks in their scalar form. */
export const SCRIBE_FALLBACK_BETA = 'server-side-fallback-2026-07-01';

/**
 * The cached prefix's floor. Below this many tokens a prefix silently does not cache at all, so
 * the brief is padded to clear it exactly as `prompts.ts` already pads the narrative's.
 */
export const CACHE_MIN_PREFIX_TOKENS = 4096;
const CACHE_PAD_TARGET_TOKENS = 4400;
const CACHE_PAD_SENTENCE =
  'Ignore this line; it is content-neutral filler present only to keep the cached prompt prefix at a stable, cacheable size. ';

/** The estate's own 4-chars-per-token estimate, so this file and `prompts.ts` agree. */
export const estimateTokens = (text: string): number => Math.ceil(String(text || '').length / 4);

/** Pad a prefix to clear the cache floor. Returns the PAD ALONE, as `cachePadding` does. */
export function cachePadding(prefixText: string): string {
  const est = estimateTokens(prefixText);
  if (est >= CACHE_MIN_PREFIX_TOKENS) return '';
  const neededChars = (CACHE_PAD_TARGET_TOKENS - est) * 4;
  const reps = Math.max(1, Math.ceil(neededChars / CACHE_PAD_SENTENCE.length));
  return `\n\n[CACHE-STABILIZER — ignore this block; it is not settlement data]\n${CACHE_PAD_SENTENCE.repeat(reps)}\n[END CACHE-STABILIZER]`;
}

export interface ScribeUnit {
  blockId: string;
  poolKey: string;
  vid: number;
  spine: string;
  faces: string[];
  notebook: string[];
}

export interface ScribeVerdict {
  blockId: string;
  poolKey: string;
  vid: number;
  verdict: string;
  arms: string[];
}

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
 * ⭐ THE BRIEF — the cached half. Byte-stable by construction: it closes over NOTHING but module
 * constants, so two calls in different processes on different worlds produce identical bytes and
 * the provider's prefix cache is hit from the second settlement of the hour onward.
 *
 * @param voice the VOICE transcription (`voice.ts`), passed in so this module stays testable
 */
export function buildScribeBrief(voice: string): string {
  const body = [
    'You are writing the composed prose of a settlement dossier for a tabletop game master.',
    'The dossier is compiled by ONE archiver. You are writing in that archiver\'s hand.',
    '',
    voice,
    '',
    MECHANICAL_BARS,
    '',
    UNIT_RULES,
    '',
    'THE FACTS ARE NOT YOURS TO CHOOSE. The card in the next turn is the whole world you may',
    'write about: every value it holds is true, everything it does not hold does not exist, and a',
    'sentence asserting a value the card does not carry is refused by the instruments. You are not',
    'summarising the card and not translating it. You are writing the lines the card already',
    'decided, in the words a professional archiver would have used.',
  ].join('\n');
  return body + cachePadding(body);
}

/** A pool as the volatile turn presents it: the ground, and the corpus line as the exemplar. */
function poolBrief(pool: any): string {
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
  rows.push('  THE CORPUS LINE, as the exemplar and the fallback:');
  rows.push(`    spine: ${String(pool?.unit?.spine ?? '')}`);
  for (let i = 0; i < faces.length; i += 1) rows.push(`    face ${i}: ${String(faces[i] ?? '')}`);
  return rows.join('\n');
}

/**
 * ⭐ THE VOLATILE TURN (design §3.1 parts 2-4). The card, the epoch record, and — LAST and clearly
 * ranked below the law — the game master's instructions.
 *
 * ⛔ THE INSTRUCTIONS ARE FLAVOUR, NEVER FACT (§5c rule 3, ruling 18). They may choose emphasis,
 * tone within the archiver's hand, which sources to hear more from and what to dwell on. They may
 * not add a fact the card does not hold, name a person, or lift a floor — and the sentence that
 * says so is in the SYSTEM half, above, so an instruction cannot argue with it from inside the
 * user turn. Under FINITE-SEMANTICS free text shapes words and never the world, and the tier-0
 * refuter runs unchanged over the result, so an instruction asking for an unlawful line yields a
 * FAIL and the corpus draw rather than the unlawful line.
 */
export function buildScribeUserTurn(input: {
  card: any;
  record?: any;
  guidance?: string;
}): string {
  const card = input?.card || {};
  const pools = Array.isArray(card.pools) ? card.pools : [];
  const parts: string[] = [];

  parts.push(`THE TOWN, as the engine holds it (tab ${String(card.tab ?? '')}, audience ${String(card.audience ?? '')}):`);
  parts.push(JSON.stringify(card.town ?? {}, null, 1));
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
 */
export function parseScribeUnits(answerText: string): { ok: boolean; units: ScribeUnit[]; reason: string } {
  let parsed: any = null;
  try {
    parsed = JSON.parse(String(answerText || ''));
  } catch {
    return { ok: false, units: [], reason: 'unparseable' };
  }
  const rows = Array.isArray(parsed?.units) ? parsed.units : null;
  if (!rows) return { ok: false, units: [], reason: 'no_units' };
  const units: ScribeUnit[] = [];
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
      faces: Array.isArray(row.faces) ? row.faces.map((f: unknown) => String(f ?? '').trim()) : [],
      notebook: Array.isArray(row.notebook) ? row.notebook.map((n: unknown) => String(n ?? '').trim()) : [],
    });
  }
  return { ok: units.length > 0, units, reason: units.length > 0 ? '' : 'no_lawful_units' };
}

/** The card's pool row for one (block, key), or null. */
function cardPool(card: any, blockId: string, poolKey: string): any {
  const pools = Array.isArray(card?.pools) ? card.pools : [];
  return pools.find((p: any) => String(p?.blockId) === blockId && String(p?.poolKey) === poolKey) || null;
}

/**
 * ⭐⭐ THE GATE EVERY RENDERED LINE PASSES (design §4; chair rulings 5 and 6).
 *
 * The tier-0 instruments run over every unit, from the SAME bundle the corpus programme is audited
 * by, so the Scribe is held to the corpus's own standard rather than to a second one written for
 * it. The rule is the corpus's rule:
 *   FAIL      → the unit is DROPPED and that pool draws the hand corpus. Silently, on the player
 *               page: the dossier is one archiver, and telling the reader which line a model wrote
 *               would break the frame (ruling 6).
 *   WITHHELD  → SHIPS. The corpus ships its own WITHHELDs; a rendered line is held to the same bar
 *               and not to a stricter one invented here.
 *   PASS      → ships.
 * A unit whose FACE COUNT does not match the corpus unit's is dropped BEFORE the instruments see
 * it, because the words would be mis-seated rather than merely wrong.
 *
 * @param refute the bundle's `refuteUnit`, injected so this module has no import of its own
 */
export function judgeUnits(
  units: ScribeUnit[],
  card: any,
  refute: (unit: any, card: any, extra?: any) => any,
): { kept: ScribeUnit[]; verdicts: ScribeVerdict[]; dropped: number } {
  const kept: ScribeUnit[] = [];
  const verdicts: ScribeVerdict[] = [];
  let dropped = 0;

  for (const unit of units) {
    const pool = cardPool(card, unit.blockId, unit.poolKey);
    const corpusFaces = Array.isArray(pool?.unit?.faces) ? pool.unit.faces : [];
    const row: ScribeVerdict = {
      blockId: unit.blockId, poolKey: unit.poolKey, vid: unit.vid, verdict: 'FAIL', arms: [],
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
    const arms = new Set<string>();
    for (const text of texts) {
      let out: any = null;
      try {
        out = refute(
          { text, blockId: unit.blockId, poolKey: unit.poolKey },
          card,
          { corpusUnit: pool.unit || null },
        );
      } catch {
        out = { verdict: 'FAIL', findings: [{ arm: 'REFUTER-THREW' }] };
      }
      const verdict = String(out?.verdict || 'FAIL');
      if (verdict === 'FAIL') worst = 'FAIL';
      else if (verdict === 'WITHHELD' && worst !== 'FAIL') worst = 'WITHHELD';
      for (const finding of Array.isArray(out?.findings) ? out.findings : []) {
        if (finding && (finding.channel === 'FAIL' || finding.channel === 'WITHHELD')) {
          arms.add(String(finding.arm));
        }
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
 * repair-loop budget. A `no` on any question is a finding; the unit falls to the corpus like any
 * other FAIL.
 */
export function buildTier1Checklist(units: ScribeUnit[], card: any): string {
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
  for (const unit of units) {
    for (const text of [unit.spine, ...unit.faces, ...unit.notebook]) {
      if (!text) continue;
      n += 1;
      lines.push(`${n}. ${text}`);
    }
  }
  return lines.join('\n');
}
