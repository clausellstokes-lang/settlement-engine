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
 *   3. THE VOLATILE TURN — `buildScribeUserTurn`. The epoch, the record, THE PAGE AS THE READER
 *      MEETS IT, the pools, and LAST the game master's instructions. Everything that differs
 *      between two tabs is here, the page rows included: they are a tab's own and not a town's.
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

/**
 * The shape rules of a unit, which are the artefact's own and not the voice's.
 *
 * ⭐ THE FOUR GUESSES, ANSWERED (chair ruling 26, W3a car 2). The 2026-09-14 Opus seat recorded
 * four things the W2 brief left it to work out, and every one of them is a thing an instrument
 * can convict on: whether a returned row is a spine or a face (every `pieces[].role` on the card
 * reads `spine` while four DEF-2 pools carry sources and an attributed rendering); whether the DM
 * audience wants the notebook register; whether a `{slot}` should be written as a token or as its
 * fill; and whether the corpus line beside the pool is a model of the law (two of the defense
 * tab's own units break it). Each is one sentence here and costs the prefix nothing, because the
 * prefix is cached.
 */
const UNIT_RULES = [
  'THE SHAPE OF WHAT YOU RETURN, per pool the card lists:',
  '- `vid` is the ANNEX ROW the card gives for that pool. Copy it exactly. It is not a position.',
  '- `spine` replaces the corpus unit\'s spine and states the same fact in the archiver\'s hand.',
  '- `faces` replaces the corpus unit\'s faces IN THE SAME ORDER AND THE SAME NUMBER. Face i speaks',
  '  through the source the card gives at position i and through no other: the seating, the pairs',
  '  and the compromised roll are already decided and you are writing the words for them.',
  '- `notebook` replaces the DM-only rows, in their order, or is empty where the card has none.',
  '- `{slot}` tokens: use only the ones the card declares for that pool, or none at all.',
  '',
  'STANCE. `spine` is always the pool\'s stated fact in the archiver\'s own hand, bare, on the',
  'document\'s own authority. A `face` speaks THROUGH the source named at its position, and says so.',
  'Where the card lists no face for a pool, `faces` is the empty list and the spine is the whole',
  'unit.',
  '',
  'THE DM REGISTER. On audience `dm`, `notebook` carries the archiver\'s private rows, one per',
  'dm-only face the card lists, in the notebook register the VOICE describes. On audience',
  '`player`, `notebook` is the empty list and nothing private appears anywhere on the page. The',
  'card says per pool how many such rows it holds, and on the shipped corpus that number is zero.',
  '',
  'SLOT FILL. Write the RENDERED WORDS, with the card\'s fills applied: where the card says',
  '`{settlement}` is "Spitzplatz" here, write Spitzplatz. Name the town at most once in a unit,',
  'and never as the first word of two units on one page.',
  '',
  'THE CORPUS LINE. It is the CLAIM you must keep and the line that ships if yours is refused. It',
  'is not a model of the law: where it breaks a bar above, do not imitate the breach.',
  '',
  'A POOL YOU CANNOT WRITE LAWFULLY IS OMITTED. An omitted pool draws the hand corpus, which is',
  'always there; a unit that breaks a bar above is dropped by the instruments and draws it too.',
  'Do not explain, apologise, or write anything outside the schema.',
].join('\n');

/**
 * ⭐⭐ THE LINE THAT IS REFUSED, AND THE LINE THAT IS NOT (chair ruling 36, THE OWNER 2026-09-14
 * ~14:4x: "the goal is that it doesn't contradict the settlement not that it invents when it comes
 * to prose"). It REPLACES W3b car 1's six invention bars, which ruling 36 supersedes, and it is
 * the owner's 09-12 corpus law applied to the Scribe: SILENCE IS PERMISSION, and "unlicensed" is
 * not a finding.
 *
 * ⛔ WHY THE MEASUREMENT DID NOT SETTLE IT. RUN 2 put sixteen cells through two writer seats and an
 * Opus second reader per pair, and the reader refused about seven in ten units — but it was reading
 * against NON-INVENTION, and the owner's standard is NON-CONTRADICTION. Most of what it refused is
 * exactly what a game master opens a dossier for: servants at the inn nursing a sick guest, a store
 * filled by the trades, the court's business waiting on the parish. These are plot hooks, not
 * falsehoods, and nothing on the card denies one of them. RUN 2's seventy per cent is therefore NOT
 * the product's number; a re-read under this standard is RUN 3's first act.
 *
 * ⛔ THE ONE FLOOR THAT KEPT ITS TEETH is the record floor: an EVENT, a DATE or a NUMBER stated as
 * record where the card holds none. That is the owner's surviving "no invented history or numbers",
 * and it is why an ORIGIN is still refused — a founding is an event, not a flavour.
 *
 * ⭐ THE POSITIVE RULE IS STILL FIRST, BECAUSE A WRITER TOLD ONLY WHAT NOT TO DO STILL HAS A SEAT
 * TO FILL. The corpus face at the same seat is always lawful and always ships.
 */
const CONTRADICTION_BARS = [
  'WHEN THE CARD GIVES A FACE NOTHING TO STAND ON, COPY THE CORPUS. Write the CORPUS FACE VERBATIM',
  'at that seat. A copied corpus row is never refused: it already ships, and it is the line that',
  'would have shipped anyway. A pool with nothing lawful to say in its SPINE is omitted, and the',
  'hand corpus draws the whole of it. Neither is a failure; both are the dossier reading as it',
  'always did.',
  '',
  'THE LINE THAT IS REFUSED, AND THE LINE THAT IS NOT. THE STANDARD IS NON-CONTRADICTION. A line is',
  'refused for CONTRADICTING the settlement and never for ADDING to it. What the card does not hold,',
  'the card does not forbid: silence is permission.',
  '',
  'REFUSED, AND ONLY FOR THESE:',
  '- A VALUE A CARD FIELD DENIES. A wall on a town whose walls field says there is none; "no goods',
  '  come in" where the page says trade proceeds at an ordinary pace; "nothing organised behind it"',
  '  where the town\'s own rows list a street gang and front businesses.',
  '- A PAGE LINE OR A BADGE CONTRADICTED. The machine lines on this page are what the reader sees',
  '  beside your words. The posture badge and the readiness band are TWO LADDERS over one score and',
  '  both are true; a funding note and a backing word are TWO FIELDS and both are true. Neither pair',
  '  is a contradiction, and writing to the pool key is not a breach of either.',
  '- A ROLE THE TOWN DOES NOT SEAT, OR A RECORD NO BODY HERE KEEPS. Every speaker is one the town',
  '  block seats and every record cited is one a body here keeps.',
  '- THE ENGINE\'S OWN MODEL DENIED. Do not explain a state by a cause the engine does not run it on:',
  '  a readiness band by how hard people work, a stress by the weather.',
  '- AN EVENT, A DATE OR A NUMBER STATED AS RECORD. No founding, no battle, no year, no count, no',
  '  rate and no price that the card does not hold. This is the floor with no exception, and it is',
  '  why an ORIGIN is refused: "carts stopped on this spot before any stall did" is a founding stated',
  '  as record. It is refused for that and never for being invented.',
  '- A FORECAST. The dossier reports what stands, never what is going to happen.',
  '',
  'NOT REFUSED, BECAUSE SILENCE IS PERMISSION:',
  'A practice, a custom, a motive, a belief, an interpretation, a feeling attributed to a source,',
  'and an absence or a smallness asserted on a field the card leaves UNKNOWN, all SHIP, provided no',
  'row and no page line denies them. Servants at the inn nursing a sick guest on a town with no',
  'hospital ships. A store filled by the trades ships. The court\'s business waiting on the parish',
  'ships. "Nothing here is being built" on an unknown ranking of prosperity ships, unless a row says',
  'otherwise. This is the flavour a game master opens the dossier for, and it is yours to write.',
  '',
  'AN UNKNOWN FIELD IS ONE YOU MAY WRITE AROUND BUT MAY NOT GIVE A VALUE, A COUNT OR A DATE.',
].join('\n');

/**
 * ⭐ THE STANDARD IN A BREATH, for the SECOND READER's preface (W3b car 5, ruling 36). The writer
 * and the reader must hold ONE law: RUN 2 measured a page where the writer wrote to the band
 * because the brief told it to and the reader answered `yes` because the reader had never been
 * given the same note. A checklist asked against a different law from the one the writer was given
 * refuses lines the writer was licensed to write, which is ruling 26's own defect class.
 */
export const READERS_EYE = Object.freeze([
  'THE STANDARD: a line is refused for CONTRADICTING the settlement, and NEVER for adding to it.',
  'SILENCE IS PERMISSION: a practice, a custom, a motive, a belief, an interpretation, or an absence asserted on a field with no value is FLAVOUR, and it ships unless a row or a page line denies it.',
  'THE TWO LADDERS are two true readings of one score and the funding note and the backing word are two true fields; neither pair is a contradiction.',
  'THE ONE FLOOR WITH NO EXCEPTION: an event, a date or a number stated as record where the facts hold none.',
  'A ROLE OR A RECORD the town does not seat or keep is a contradiction; so is a cause the engine\'s own model denies, and so is a forecast.',
]);

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
  'key\'s band; never name the badge word and never reconcile the two. A line that agrees with the',
  'band is NOT a contradiction of the badge, and neither reading refutes the other.',
].join('\n');

/**
 * ⭐ THE FUNDING NOTE, SPLIT OUT OF THE LADDERS NOTE (W3b car 2) so the town block and the tier-1
 * checklist can carry it under its own name. It is the same class as the ladders: two fields, two
 * true readings, and a model asked to reconcile them will invent the reconciliation.
 */
const FUNDING_NOTE = [
  'THE FUNDING NOTE IS TWO FIELDS, BOTH TRUE. A note reading `Upkeep underfunded ... at 97%`',
  'beside `Economic Backing: Well-funded` is two true readings of two fields and not a',
  'contradiction; write to the pool key and to neither number.',
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
    CONTRADICTION_BARS,
    '',
    TWO_LADDERS,
    '',
    FUNDING_NOTE,
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
    '',
    // ⭐ THE LADDERS RIDE HERE TOO (W3b car 2). They are facts of the PAGE, and every seat that
    // reads this block reads them: the writer, and the second reader whose checklist rides on the
    // same two cached blocks. RUN 2 measured the cost of their living only in the writer's half —
    // the writer wrote to the band as instructed and the reader answered SAME PAGE `yes` on the
    // badge beside it. One law, in the block both seats are given.
    TWO_LADDERS,
    '',
    FUNDING_NOTE,
  ].join('\n');
}

/**
 * ⭐ THE SOURCE FACE i SPEAKS THROUGH, AND THE OFF-BY-ONE THAT SAID OTHERWISE.
 *
 * ⛔ MEASURED, W3a car 2. The W2 brief read `pool.faceSources[i]` for face i. That list is the
 * DEDUPLICATED, SORTED set of sources the DRAWN pieces spoke through — on a real DEF-2 pool it
 * holds ONE entry while the unit has nine faces — so the model was told face 0 spoke through the
 * one drawn source and faces 1 to 8 spoke as the bare fact, when the annex seats a different
 * source on every one of them. The per-face list is `unit.faceSourceTags`, which is the leaf's
 * own `sources` array and is indexed with the SPINE AT 0 (`faceRawOf` uses the same convention:
 * face 0 is the spine, face i is `wordings[i - 1]`). Measured on the pinned town's defense tab:
 * every pool with faces carries exactly one more tag than it has faces, which is that spine slot.
 * So face i's tag is `faceSourceTags[i + 1]`, and the old reading was wrong on every face but one.
 *
 * @param {object} pool @param {number} i the index into `pool.unit.faces`
 * @returns {string|null} the source tag, or null for a face the annex leaves bare
 */
function sourceOfFace(pool, i) {
  const tags = Array.isArray(pool?.unit?.faceSourceTags) ? pool.unit.faceSourceTags : null;
  const faces = Array.isArray(pool?.unit?.faces) ? pool.unit.faces : [];
  if (tags && tags.length === faces.length + 1) {
    const tag = tags[i + 1];
    return tag === null || tag === undefined || tag === '' ? null : String(tag);
  }
  // A card whose tag list does not carry the spine slot is a shape this function has not seen.
  // It answers from the drawn set rather than guessing an offset, and a bare answer is honest.
  const drawn = Array.isArray(pool?.faceSources) ? pool.faceSources : [];
  const fallback = drawn[i];
  return fallback === undefined || fallback === null || fallback === '' ? null : String(fallback);
}

/** The roster one source may draw a person from, as one line. */
function rosterLine(pool, source) {
  const seat = (Array.isArray(pool?.faceRoles) ? pool.faceRoles : [])
    .find((r) => String(r?.source) === String(source));
  const roster = Array.isArray(seat?.roster) ? seat.roster : [];
  if (!roster.length) return '';
  return roster.map((r) => `${String(r?.role ?? '')} (${String(r?.n ?? '')})`).join(' · ');
}

/**
 * ⭐⭐ ONE POOL AS THE VOLATILE TURN PRESENTS IT — the ground, and the corpus line as the claim.
 *
 * ⛔ EVERY ROW BELOW ANSWERS A QUESTION AN ARM CONVICTS ON (chair ruling 26). A refusal for a rule
 * the model was never given is an instrument defect, not a model failure, and the simulation
 * produced four of those on one page. So: THE ORDER answers `CORPUS-DIFF`'s level-1 arm; THE
 * FIELDS answer arm `Q`, which withholds a second sentence that names no second typed field and
 * withheld six of fifteen units for want of the field paths; THE FILLS answer arm `D` and ruling
 * 12's slot-opener tell at once, because a model writing `{settlement}` where the page prints
 * `Spitzplatz` has written a token and not a word; THE ROSTER answers `REFERENT-role`, which
 * refuses any office the town does not seat.
 */
function poolBrief(pool) {
  const faces = Array.isArray(pool?.unit?.faces) ? pool.unit.faces : [];

  const declared = Array.isArray(pool?.slots?.declared) ? pool.slots.declared : [];
  const fills = Array.isArray(pool?.slots?.fills) ? pool.slots.fills : [];
  const fields = Array.isArray(pool?.fields) ? pool.fields : [];
  const order = pool?.unit?.order || null;
  const marks = Array.isArray(pool?.marks) ? pool.marks : [];
  const rows = [
    `POOL ${JSON.stringify(String(pool?.poolKey ?? ''))} in block ${String(pool?.blockId ?? '')}`,
    `  vid: ${String(pool?.vid ?? '')}`,
    `  stance: ${String(pool?.angle ?? '')}${marks.length ? ` · marks ${marks.join(' ')}` : ''}`,
  ];

  // ⭐⭐ THE POOL THE CARD CANNOT LICENSE IS NAMED AS ONE, AT THE TOP OF ITS OWN ROW (W3b car 2).
  // RUN 2's shipped share tracked the card's thinness exactly — defense thirty five per cent,
  // overview thirty three, economics twenty one, power thirteen — because a writer handed a pool
  // with no value under it fills the gap. Omitting it lands the SAME line the refusal would have
  // landed, and spends nothing to get there.
  if (pool?.writeable === false) {
    rows.push('  THIS POOL IS NOT WRITEABLE ON THIS TOWN: OMIT IT. No reading it rests on has a');
    rows.push('  value here, so there is nothing to stand a sentence on but the pool key itself.');
    rows.push('  Return no unit for this pool. The hand corpus draws it, which is the right answer.');
  }

  if (order && String(order.id ?? '') !== '') {
    rows.push(`  THE ORDER: the corpus spine realises the move order \`${String(order.id)}\` — \`${(Array.isArray(order.moves) ? order.moves : []).join(' then ')}\` (${String(order.licences ?? '')}); keep that order in your spine.`);
  } else {
    rows.push('  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.');
  }

  rows.push(`  slots you may use: ${declared.join(', ') || '(none)'}`);
  for (const fill of fills) {
    rows.push(`    {${String(fill?.slot ?? '')}} is ${JSON.stringify(String(fill?.value ?? ''))} on this town`);
  }
  if (fills.length) {
    rows.push('    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.');
  }

  if (fields.length) {
    rows.push('  THE FIELDS this pool reads, with their values here:');
    for (const field of fields) {
      // ⛔⛔ THE TWO VALUELESS READINGS ARE NOT THE SAME FACT, AND SAYING SO IS CAR 6's WHOLE
      // POINT. `unreadable` means THIS CARD cannot resolve the reading (a desk-local spelling, an
      // expression) while the engine decided it and the POOL KEY STATES IT; `not-decided` means a
      // real settlement path whose leaf is absent. Printing the first as "the engine has not
      // decided this" would be a false fact on the card, and printing it as a bare `null` would
      // invite the absence RUN 2 measured. Measured: 42 of 42 valueless rows on the pinned town
      // are the FIRST kind.
      if (field?.unknown === true) {
        rows.push(String(field?.state) === 'unreadable'
          ? `    ${String(field?.field ?? '')} = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)`
          : `    ${String(field?.field ?? '')} = UNKNOWN (the engine has not decided this; assert nothing that depends on it)`);
        continue;
      }
      rows.push(`    ${String(field?.field ?? '')} = ${JSON.stringify(field?.value ?? null)}${field?.status ? ` (${String(field.status)})` : ''}`);
    }
    rows.push('    The second sentence of a unit, if there is one, must rest on one of these fields');
    rows.push('    and name it in its own word, or the instruments withhold it.');
    if (fields.some((f) => f?.unknown === true && String(f?.state) !== 'unreadable')) {
      rows.push('    A field reading UNKNOWN cannot carry a sentence, and no absence may be read');
      rows.push('    out of it.');
    }
  } else {
    rows.push('  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.');
  }

  rows.push(`  faces to write: ${faces.length}`);
  for (let i = 0; i < faces.length; i += 1) {
    const source = sourceOfFace(pool, i);
    const roster = source ? rosterLine(pool, source) : '';
    rows.push(`    face ${i} speaks through: ${String(source ?? '(the bare fact)')}`);
    if (source && roster) {
      rows.push(`      and is one of these people and no other: ${roster}`);
    } else if (source) {
      rows.push(`      and is one of the roles the town block lists for \`${String(source)}\` under \`roles\`, and no other.`);
    }
  }
  if (pool?.compromised && pool.compromised.speaks === true) {
    rows.push(`  THE COMPROMISED SOURCE SPEAKS THIS YEAR: ${String(pool.compromised.source)} — it conceals on the symptom of its own secret and denies nothing else.`);
  }
  rows.push('  THE CORPUS LINE, as the claim and the fallback:');
  rows.push(`    spine: ${String(pool?.unit?.spine ?? '')}`);
  for (let i = 0; i < faces.length; i += 1) rows.push(`    face ${i}: ${String(faces[i] ?? '')}`);
  // ⛔ THE NOTEBOOK HAS NO CORPUS ROW TO REPLACE, MEASURED. Over all six shipped leaves: 2,266
  // variants, 83 marked `dm-only`, and ZERO of those 83 carry a single `wordings` row; no variant
  // anywhere carries a per-face mark of any kind. So `dm-only` is a WHOLE-VARIANT property and
  // there is no such thing as a dm-only FACE for a notebook row to stand against. The list is
  // therefore empty on every pool the corpus ships today, and the card says so rather than
  // leaving the model to invent a private register nothing asked for. What the mark DOES change
  // is the register the unit is written in, which is the instruction below.
  rows.push(marks.includes('dm-only')
    ? '    notebook: none. This pool is marked `dm-only`: the unit itself is the archiver\'s private working note and is written in the notebook register the VOICE describes, and it still rides in `spine`.'
    : '    notebook: none. Return an empty list.');
  return rows.join('\n');
}

/**
 * ⭐⭐ THE PAGE THE WRITER IS WRITING INTO (W3d car 1). The sentence the chair wrote, kept whole.
 *
 * ⛔⛔ THE MEASUREMENT THAT PUT IT IN THE WRITER'S TURN. RUN 3 read ~1,400 lines by a second reader
 * and found 28 contradictions, of which TWENTY FOUR were contradictions of a MACHINE LINE THE
 * WRITER NEVER SAW: "nothing here is urgent" beside the page's own crisis summary "caravans are
 * disappearing"; "no soldier in it" beside `guardEffectivenessDesc`'s mercenary company; "nothing
 * organised behind the wrongdoing" beside `Internal Security: Dangerous`. W3a hoisted the town into
 * its own cached block and, in doing so, left the card's `page` rows reaching only the SECOND
 * reader, which refuses on them. A reader refusing a line for a fact the writer was never given is
 * ruling 26's own defect class, pointed at the page instead of at an arm.
 */
const PAGE_NOTE = [
  'THE PAGE AS THE READER MEETS IT',
  'These lines are printed on the same page as yours.',
  'A line of yours that denies one of them is refused; a line that agrees with the band where the',
  'badge word differs is not (the two ladders).',
].join('\n');

/**
 * ⭐ THE VOLATILE TURN (design §3.1 parts 2-4). The epoch, the record, the page, the pools, and —
 * LAST and clearly ranked below the law — the game master's instructions. The TOWN is not here: it
 * is in the second cached block above.
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

  // ⭐⭐ THE PAGE, IMMEDIATELY BEFORE THE LINES IT SITS BESIDE (W3d car 1). Only the machine
  // lines, the badges and the threat rows: the COMPOSED rows are the corpus prose this writer is
  // replacing, and printing them here would hand it its own predecessor's words as a page fact.
  // `pageLinesOf` is the same reader the second seat's checklist uses, so the two seats are shown
  // the same page in the same words.
  const page = pageLinesOf(card);
  if (page.length) {
    parts.push('');
    parts.push(PAGE_NOTE);
    for (const row of page) parts.push(row);
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
 * ⭐⭐ A FACE FALLS ALONE (W3b car 3; ruling 5/6's "a unit ships whole" AMENDED by the chair to
 * "a unit ships whole OR PATCHED, never with a refused row").
 *
 * ⛔ THE MEASUREMENT. RUN 2 finding 3: a SEVEN-LINE unit died on face one with its spine and its
 * face nought answered all-no. The ships-whole rule turns ONE invented face into six lost lawful
 * lines, and the pool then draws the hand corpus for all seven — which is the line face one would
 * have got anyway. So the fallback is taken at the grain the refusal was found at:
 *
 *   A REFUSED FACE  → that face is replaced by THE CORPUS FACE AT THE SAME SEAT and the unit ships
 *                     PATCHED. The corpus face is the raw wording the composer already renders for
 *                     this pool (`scribeVariantPool` overlays `spine`/`faces` onto the variant's
 *                     `text`/`wordings`, so a copied wording is filled and seated exactly as the
 *                     corpus's own is), which is why the patch is a line and not a hole.
 *   A REFUSED SPINE → the unit is DROPPED whole. The spine is the FACT; a pool whose fact is
 *                     refused has no seat left to stand the faces on.
 *   A REFUSED NOTE  → that notebook row is dropped ALONE. The notebook has no corpus twin to
 *                     copy (measured: zero of the corpus's 83 dm-only variants carry a wording),
 *                     and on the shipped corpus `notebook` is `[]` on every pool.
 *
 * The rest of the gate is unchanged: the tier-0 instruments are the corpus programme's own, from
 * the same bundle; WITHHELD still SHIPS, because the corpus ships its own WITHHELDs; a unit whose
 * FACE COUNT does not match is dropped before the instruments see it, since the words would be
 * mis-seated rather than merely wrong.
 *
 * ⭐ EVERY FINDING NAMES ITS SEAT. RUN 2 finding 4 was that the judge under-reports: a reader of
 * a verdict could not tell which row of a unit earned the arm. The seat is now on the finding.
 *
 * @param {ReadonlyArray<object>} units
 * @param {object} card
 * @param {(unit: object, card: object, extra?: object) => object} refute the bundle's `refuteUnit`,
 *   injected so this module has no import of its own
 * @returns {{kept: object[], verdicts: object[], dropped: number, patched: number}}
 */
export function judgeUnits(units, card, refute) {
  const kept = [];
  const verdicts = [];
  let dropped = 0;
  let patched = 0;

  for (const unit of (Array.isArray(units) ? units : [])) {
    const pool = cardPool(card, unit.blockId, unit.poolKey);
    const corpusFaces = Array.isArray(pool?.unit?.faces) ? pool.unit.faces : [];
    const row = {
      blockId: unit.blockId,
      poolKey: unit.poolKey,
      vid: unit.vid,
      verdict: 'FAIL',
      arms: [],
      patched: [],
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
    // line — and each row's answer is acted on at ITS OWN GRAIN.
    const rows = [
      { seat: 'spine', kind: 'spine', at: -1, text: String(unit.spine ?? '') },
      ...unit.faces.map((text, i) => ({ seat: `face ${i}`, kind: 'face', at: i, text: String(text ?? '') })),
      ...unit.notebook.map((text, i) => ({ seat: `notebook ${i}`, kind: 'notebook', at: i, text: String(text ?? '') })),
    ].filter((r) => r.text !== '');

    let worst = 'PASS';
    let spineFailed = false;
    const arms = new Set();
    const badFaces = new Set();
    const badNotes = new Set();
    for (const line of rows) {
      let out;
      try {
        // ⛔ ONE ROW AT A TIME, AND THE UNIT'S OWN FACES ARE NOT PASSED. A5 and A6 are SIBLING
        // arms: handed the face set on every row they would run four times over one unit and
        // report the same overlap four times. The row is judged as the string it is, exactly as
        // it was before this module took the function over, so no verdict moves with the move.
        out = refute(
          { text: line.text, blockId: unit.blockId, poolKey: unit.poolKey },
          card,
          { corpusUnit: pool.unit || null },
        );
      } catch {
        out = { verdict: 'FAIL', findings: [{ arm: 'REFUTER-THREW', channel: 'FAIL' }] };
      }
      const verdict = String(out?.verdict || 'FAIL');
      if (verdict === 'FAIL') {
        if (line.kind === 'spine') spineFailed = true;
        else if (line.kind === 'face') badFaces.add(line.at);
        else badNotes.add(line.at);
      } else if (verdict === 'WITHHELD' && worst === 'PASS') worst = 'WITHHELD';
      for (const finding of Array.isArray(out?.findings) ? out.findings : []) {
        if (!finding || (finding.channel !== 'FAIL' && finding.channel !== 'WITHHELD')) continue;
        arms.add(String(finding.arm));
        row.findings.push({
          arm: String(finding.arm ?? ''),
          channel: String(finding.channel ?? ''),
          seat: line.seat,
          subject: String(finding.subject ?? ''),
          value: String(finding.value ?? ''),
          description: String(finding.description ?? ''),
        });
      }
    }
    row.arms = [...arms].sort();

    if (spineFailed) {
      row.verdict = 'FAIL';
      verdicts.push(row);
      dropped += 1;
      continue;
    }
    if (badFaces.size === 0 && badNotes.size === 0) {
      row.verdict = worst;
      verdicts.push(row);
      kept.push(unit);
      continue;
    }
    // ⭐ THE PATCH. A NEW unit is built rather than the caller's mutated: the harness and the
    // handler both keep the model's own answer beside the judged one.
    row.verdict = 'PATCHED';
    row.patched = [
      ...[...badFaces].sort((a, b) => a - b).map((i) => `face ${i}`),
      ...[...badNotes].sort((a, b) => a - b).map((i) => `notebook ${i}`),
    ];
    verdicts.push(row);
    patched += 1;
    kept.push({
      ...unit,
      faces: unit.faces.map((text, i) => (badFaces.has(i) ? String(corpusFaces[i] ?? '') : text)),
      notebook: unit.notebook.filter((_, i) => !badNotes.has(i)),
    });
  }

  return { kept, verdicts, dropped, patched };
}

/**
 * ⭐⭐ THE SIX CONTRADICTION TESTS (chair ruling 36, THE OWNER 2026-09-14 ~14:4x). They REPLACE the
 * seven questions of W3a car 4 and W3b car 4, which ruling 35 set and ruling 36 supersedes.
 *
 * ⛔ WHAT WAS STRUCK, AND WHY IT HAD TO BE. CERTAINTY, QUANTIFIER (except a number stated as
 * record), SCOPE and MECHANISM are gone. Every one of them asked whether the line ADDED something,
 * and the owner's standard is whether it CONTRADICTS something: "the goal is that it doesn't
 * contradict the settlement not that it invents when it comes to prose". Measured, those four were
 * most of the refusals: RUN 2's second reader answered `yes` on certainty 177 times, mechanism 205,
 * scope 106 and quantifier 76, against same-page 63, actor 26 and forecast 12. So RUN 2's seventy
 * per cent refusal rate is not this product's number, and a re-read under these six is RUN 3's
 * first act.
 *
 * ⭐ WHAT SURVIVED, AND WHERE EACH CAME FROM. FIELD and PAGE are the contradiction the tier-0 arms
 * cannot see (they read one row at a time and never the page beside it). ROSTER is floor 1 asked
 * again at the second seat. MODEL is floor 4. RECORD is floor 2, the owner's surviving "no invented
 * history or numbers", and it is the one that keeps QUANTIFIER's teeth where they belonged.
 * FORECAST is the no-future bar.
 *
 * The `key` is the schema field the model answers in; the `arm` is what a refusal is recorded as.
 * @type {ReadonlyArray<{key: string, arm: string, ask: string}>}
 */
export const TIER1_QUESTIONS = Object.freeze([
  Object.freeze({
    key: 'fieldDenied',
    arm: 'T1-FIELD',
    ask: 'FIELD: does the line assert a value a field below DENIES? Not a value the facts are silent about, and not a value a field leaves UNKNOWN: a value a field below states otherwise.',
  }),
  // ⭐ THE LADDERS ARE IN THE QUESTION. RUN 2 finding 5: the writer wrote to the readiness BAND
  // because its brief told it to, and this reader, shown the page's `Well-Defended` badge and
  // never shown that note, answered `yes` on it. Sixty three lines fell to that.
  Object.freeze({
    key: 'page',
    arm: 'T1-PAGE',
    ask: 'PAGE: does it contradict a machine line or a badge on this page? The posture badge word and the readiness band are TWO LADDERS over one score and BOTH are the engine\'s, so a line that agrees with the band is NOT a contradiction of the badge; a funding note reading underfunded at ninety seven percent beside `Economic Backing: Well-funded` is likewise two fields and both are true. Neither pair is an answer of yes.',
  }),
  Object.freeze({
    key: 'roster',
    arm: 'T1-ROSTER',
    ask: 'ROSTER: does someone act in it, or is a record cited in it, that the facts below do not seat or keep?',
  }),
  Object.freeze({
    key: 'model',
    arm: 'T1-MODEL',
    ask: 'MODEL: does it explain a state by a cause the engine\'s own model denies, such as a readiness band explained by how hard people work, or a stress explained by the weather?',
  }),
  Object.freeze({
    key: 'record',
    arm: 'T1-RECORD',
    ask: 'RECORD: does it state an EVENT, a DATE or a NUMBER as record where the facts hold none? A founding, a battle, a year, a count, a rate or a price that the facts do not carry. This is the one floor with no exception.',
  }),
  Object.freeze({
    key: 'forecast',
    arm: 'T1-FORECAST',
    ask: 'FORECAST: does it say what is going to happen rather than what stands?',
  }),
]);

/**
 * ⭐ THE NUMBERED LINES, DERIVED ONCE. The checklist prints them and `applyTier1` maps an answer
 * back to its unit, so both must enumerate identically or a `yes` would drop the wrong line. One
 * function, two callers.
 *
 * ⭐⭐ A ROW BYTE-EQUAL TO THE CORPUS AT ITS OWN SEAT IS MARKED `corpus` AND IS NOT SENT TO THE
 * SECOND READER (W3b car 3). It is the hand-written line: it already ships on this page, it was
 * written by the corpus programme and audited by the corpus programme's own instruments, and
 * paying a model to re-judge it would let the second reader refuse the very thing every refusal
 * falls back TO. Tier 0 still runs on it, as it runs on the corpus's own rows. The NUMBERING is
 * over EVERY row either way, so `n` does not move when a patch turns a face into the corpus and a
 * stray answer for an exempt line maps to the row it names rather than to the wrong one.
 *
 * @param {ReadonlyArray<object>} units
 * @param {object} [card] the town card, for the corpus row at each seat; without it nothing is
 *   exempt, which is the safe answer for a caller that has no card to compare against
 * @returns {Array<{n: number, unit: number, row: string, kind: string, at: number,
 *   text: string, corpus: boolean}>}
 */
export function tier1Lines(units, card) {
  const rows = [];
  let n = 0;
  const all = Array.isArray(units) ? units : [];
  for (let u = 0; u < all.length; u += 1) {
    const unit = all[u] || {};
    const faces = Array.isArray(unit.faces) ? unit.faces : [];
    const notebook = Array.isArray(unit.notebook) ? unit.notebook : [];
    const pool = card ? cardPool(card, String(unit.blockId ?? ''), String(unit.poolKey ?? '')) : null;
    const corpusSpine = String(pool?.unit?.spine ?? '');
    const corpusFaces = Array.isArray(pool?.unit?.faces) ? pool.unit.faces : [];
    const labelled = [
      {
        row: 'spine', kind: 'spine', at: -1, text: String(unit.spine ?? ''),
        corpus: Boolean(pool) && corpusSpine !== '' && String(unit.spine ?? '') === corpusSpine,
      },
      ...faces.map((text, i) => ({
        row: `face ${i}`,
        kind: 'face',
        at: i,
        text: String(text ?? ''),
        corpus: Boolean(pool) && String(corpusFaces[i] ?? '') !== '' && String(text ?? '') === String(corpusFaces[i] ?? ''),
      })),
      // ⛔ A NOTEBOOK ROW HAS NO CORPUS TWIN, so it is never exempt. Measured over all six shipped
      // leaves: 83 dm-only variants and not one of them carries a `wordings` row.
      ...notebook.map((text, i) => ({
        row: `notebook ${i}`, kind: 'notebook', at: i, text: String(text ?? ''), corpus: false,
      })),
    ];
    for (const line of labelled) {
      if (!line.text) continue;
      n += 1;
      rows.push({ n, unit: u, ...line });
    }
  }
  return rows;
}

/**
 * ⭐ THE CARD'S OWN MACHINE LINES — the PAGE question's subject, and since W3d car 1 the writer's
 * page too. ONE reader for both seats: a writer shown a softer page than the reader judges it
 * against is exactly how RUN 3's twenty four page contradictions were written.
 *
 * ⛔ THE COMPOSED ROWS ARE NEVER IN IT. They are the hand corpus's own prose — the very lines the
 * Scribe is replacing and the lines a refusal falls back to — so printing them as page FACTS would
 * tell a writer that its predecessor's sentences are machine truths it may not deny.
 */
function pageLinesOf(card) {
  return (Array.isArray(card?.page) ? card.page : [])
    .filter((row) => ['machine', 'badge', 'row'].includes(String(row?.kind)))
    .map((row) => `  [${String(row?.kind)}] ${String(row?.label ?? '')}: ${String(row?.text ?? '')}`);
}

/**
 * The pool row a unit was written for, for its field list.
 *
 * ⛔ THE READER IS SHOWN WHAT THE WRITER WAS SHOWN, IN THE SAME WORDS (W3b cars 4 and 6). A field
 * with no value prints here exactly as it prints in the writer's turn, and the two KINDS of
 * valueless reading are kept apart: `UNREADABLE BY THIS CARD` (the engine decided it and the pool
 * key states it) against `UNKNOWN` (the engine has not decided it). A bare `= null` reads to a
 * model as "the answer is nothing", and a reader given a harsher rendering of the same fact than
 * the writer was refuses lines the writer was licensed to write (ruling 26's defect class, pointed
 * at the second seat).
 */
function fieldsFor(card, unit) {
  const pool = cardPool(card, String(unit?.blockId ?? ''), String(unit?.poolKey ?? ''));
  return (Array.isArray(pool?.fields) ? pool.fields : [])
    .map((f) => {
      if (f?.unknown !== true) return `    ${String(f?.field ?? '')} = ${JSON.stringify(f?.value ?? null)}`;
      return String(f?.state) === 'unreadable'
        ? `    ${String(f?.field ?? '')} = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)`
        : `    ${String(f?.field ?? '')} = UNKNOWN (the engine has not decided this; assert nothing that depends on it)`;
    });
}

/**
 * ⭐ THE TIER-1 CHECKLIST (design §4; re-cut to ruling 36). The case for a second pass is the
 * CONTRADICTION no tier-0 arm can see: tier 0 reads ONE ROW AT A TIME and never the page beside
 * it, so a line that denies a field, a badge or the engine's own model passes every arm there is.
 * It is a CHECKLIST and not a critic: a closed list of yes/no questions about ONE line, on the same
 * model as the writer (ruling 10's conflicted-witness rule applies to BYOK), inside the repair-loop
 * budget. A `yes` is a finding; the row falls to the corpus at its own seat, and a `yes` on the
 * spine takes the unit.
 *
 * ⛔ THE FACTS ARE THE CARD'S OWN AND NOT A SUMMARY OF THEM. The town, the epoch, the page's
 * machine lines, and — per unit — the FIELD PATHS AND VALUES that unit's pool reads. A checklist
 * asked against less than the writer was given would refuse lines the writer was licensed to
 * write, which is the instrument defect ruling 26 exists to stop.
 *
 * @param {ReadonlyArray<object>} units
 * @param {object} card
 * @returns {string}
 */
export function buildTier1Checklist(units, card) {
  const lines = [
    'Below are lines written for one settlement dossier, and the facts they were written from.',
    // ⭐⭐ THE STANDARD, BEFORE THE QUESTIONS (ruling 36). A reader told only what to look for
    // finds it: RUN 2's seven questions asked whether a line ADDED anything and the reader
    // answered yes on seven units in ten. These six ask whether it CONTRADICTS anything, and the
    // sentence below is what keeps them read that way.
    'THE STANDARD: a line is refused for CONTRADICTING the settlement, and NEVER for adding to it.',
    'What the facts do not hold, they do not forbid. A practice, a custom, a motive, a belief, an',
    'interpretation or an absence asserted on a field with no value is FLAVOUR, and it ships unless',
    'a row or a page line below denies it. You are not asked whether the line was invented.',
    '',
    `For EACH numbered line answer these ${TIER1_QUESTIONS.length} CONTRADICTION TESTS with \`yes\` or \`no\` and nothing else.`,
  ];
  TIER1_QUESTIONS.forEach((q, i) => lines.push(`  ${i + 1}. ${q.ask}`));
  lines.push('A `yes` to any question means the line is refused and the hand-written line ships instead.');
  lines.push('Answer for every numbered line, in order, and write nothing outside the schema.');
  lines.push('');
  // ⭐ THE READER'S EYE — the standard the WRITER holds, so the two seats hold ONE law.
  lines.push('THE READER\'S EYE. This is the law the writer was given, and it is the law you are');
  lines.push('reading against. A line that keeps it is not refused for keeping it.');
  for (const bar of READERS_EYE) lines.push(`  - ${bar}`);
  lines.push('');
  // ⭐ AND THE TWO TRUTHS THAT ARE NOT CONTRADICTIONS. They ride in the town block the writer and
  // this reader are both given, and they are repeated here because the PAGE question is the one
  // they bear on and RUN 2 measured sixty three lines lost for want of them.
  lines.push(TWO_LADDERS);
  lines.push('');
  lines.push(FUNDING_NOTE);
  lines.push('');
  lines.push('THE TOWN:');
  lines.push(JSON.stringify(card?.town ?? {}, null, 1));
  lines.push('');
  lines.push('THE STATE THIS PAGE READS:');
  lines.push(JSON.stringify(card?.epoch ?? {}, null, 1));
  const page = pageLinesOf(card);
  if (page.length) {
    lines.push('');
    lines.push('THE PAGE, as the reader meets it. Question 7 is about these lines and no others:');
    for (const row of page) lines.push(row);
  }
  lines.push('');
  lines.push('THE LINES. The numbering skips the hand-written lines, which are not yours to judge;');
  lines.push('answer for the numbers that appear and for no others.');
  // ⛔ THE EXEMPT ROWS ARE NOT PRINTED, AND THE NUMBERS DO NOT CLOSE UP BEHIND THEM. A row
  // byte-equal to the corpus at its seat already ships on this page; sending it here would let the
  // second reader refuse the line every refusal falls back TO, and re-numbering would move every
  // answer after it onto the wrong line.
  const rows = tier1Lines(units, card).filter((row) => row.corpus !== true);
  const all = Array.isArray(units) ? units : [];
  let at = -1;
  for (const row of rows) {
    if (row.unit !== at) {
      at = row.unit;
      const unit = all[at] || {};
      lines.push(`  POOL ${JSON.stringify(String(unit.poolKey ?? ''))} in block ${String(unit.blockId ?? '')}, which reads:`);
      const fields = fieldsFor(card, unit);
      if (fields.length) for (const field of fields) lines.push(field);
      else lines.push('    (this pool declares no typed field)');
    }
    lines.push(`${row.n}. (${row.row}) ${row.text}`);
  }
  return lines.join('\n');
}

/**
 * ⭐ THE TIER-1 ANSWER SCHEMA. Closed at every level, like the writer's, so a reply naming a key
 * this contract does not hold is refused by the provider rather than half-trusted here. The two
 * allowed values are spelled as an enum rather than a boolean because the model is answering a
 * question in words and a boolean invites it to reason about truthiness instead.
 */
export const TIER1_ANSWER_SCHEMA = Object.freeze({
  type: 'object',
  additionalProperties: false,
  required: ['answers'],
  properties: {
    answers: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['n', ...TIER1_QUESTIONS.map((q) => q.key)],
        properties: Object.fromEntries([
          ['n', { type: 'integer' }],
          ...TIER1_QUESTIONS.map((q) => [q.key, { type: 'string', enum: ['yes', 'no'] }]),
        ]),
      },
    },
  },
});

/**
 * ⭐⭐ THE SECOND READER'S VERDICT, APPLIED (chair ruling 29; W3b car 3).
 *
 * A `yes` falls at THE GRAIN IT WAS FOUND AT, exactly as tier 0's does and for the same measured
 * reason (RUN 2 finding 3: a seven-line unit died on face one with its spine answered all-no):
 *   a `yes` on the SPINE   → the unit is dropped whole, because the spine is the fact;
 *   a `yes` on a FACE      → that face becomes THE CORPUS FACE at the same seat and the unit ships
 *                            PATCHED;
 *   a `yes` on a NOTEBOOK  → that row is dropped alone (it has no corpus twin to copy).
 *
 * The return is `judgeUnits`'s own shape so the two verdict lists concatenate, and a verdict row is
 * emitted ONLY for a unit tier 1 acts on: tier 0 has already written a row for every unit, and a
 * second PASS row per unit would double the artefact's verdict list to say nothing.
 *
 * ⛔ AN ANSWER FOR A LINE NUMBER THAT DOES NOT EXIST IS IGNORED, NOT GUESSED AT, and so is an
 * answer for an EXEMPT line: `tier1Lines` marks a row byte-equal to the corpus at its seat and the
 * checklist never prints it, so a `yes` there is an answer to a question nobody asked.
 *
 * ⛔ WITHOUT A CARD THERE IS NO CORPUS FACE TO PATCH WITH, so a refused face drops the unit whole,
 * which is W3a's rule and the safe answer. Every caller in the product and the pilot passes one.
 *
 * @param {ReadonlyArray<object>} units the units tier 0 kept
 * @param {ReadonlyArray<object>} answers the model's rows
 * @param {object} [card] the town card, for the corpus row at each seat
 * @returns {{kept: object[], verdicts: object[], dropped: number, patched: number}}
 */
export function applyTier1(units, answers, card) {
  const all = Array.isArray(units) ? units : [];
  const rows = tier1Lines(all, card);
  const byNumber = new Map(rows.map((row) => [row.n, row]));
  /** @type {Map<number, Array<{arm: string, row: string, kind: string, at: number, text: string}>>} */
  const refused = new Map();

  for (const answer of (Array.isArray(answers) ? answers : [])) {
    if (!answer || typeof answer !== 'object') continue;
    const line = byNumber.get(Number(answer.n));
    if (!line || line.corpus === true) continue;
    for (const question of TIER1_QUESTIONS) {
      if (String(answer[question.key] ?? '').toLowerCase() !== 'yes') continue;
      const held = refused.get(line.unit) || [];
      held.push({
        arm: question.arm, row: line.row, kind: line.kind, at: line.at, text: line.text,
      });
      refused.set(line.unit, held);
    }
  }

  const kept = [];
  const verdicts = [];
  let dropped = 0;
  let patched = 0;
  for (let u = 0; u < all.length; u += 1) {
    const hits = refused.get(u);
    if (!hits) { kept.push(all[u]); continue; }
    const unit = all[u];
    const pool = card ? cardPool(card, String(unit.blockId ?? ''), String(unit.poolKey ?? '')) : null;
    const corpusFaces = Array.isArray(pool?.unit?.faces) ? pool.unit.faces : [];
    const faces = Array.isArray(unit.faces) ? unit.faces : [];
    const notebook = Array.isArray(unit.notebook) ? unit.notebook : [];
    const badFaces = new Set(hits.filter((h) => h.kind === 'face').map((h) => h.at));
    const badNotes = new Set(hits.filter((h) => h.kind === 'notebook').map((h) => h.at));
    // A refused face with no corpus twin to put in its place cannot be patched, so the unit falls.
    const canPatch = [...badFaces].every((i) => String(corpusFaces[i] ?? '') !== '');
    const dropWhole = hits.some((h) => h.kind === 'spine') || !canPatch;
    const seats = [
      ...[...badFaces].sort((a, b) => a - b).map((i) => `face ${i}`),
      ...[...badNotes].sort((a, b) => a - b).map((i) => `notebook ${i}`),
    ];
    verdicts.push({
      blockId: unit.blockId,
      poolKey: unit.poolKey,
      vid: unit.vid,
      verdict: dropWhole ? 'FAIL' : 'PATCHED',
      arms: [...new Set(hits.map((h) => h.arm))].sort(),
      patched: dropWhole ? [] : seats,
      findings: hits.map((h) => ({
        arm: h.arm,
        channel: 'FAIL',
        seat: h.row,
        subject: 'the second reader refused this row',
        value: h.row,
        // ⛔ NO EM DASH IN A STRING THAT CAN REACH A READER. The DM page prints the per-unit
        // verdicts as a REPORT (ruling 6) and the E2 ratchet holds every rendered face at hard
        // zero on the mark, so a finding's own prose keeps the same bar the prose it judges does.
        description: `${h.text.slice(0, 120)} (the second reader answered yes on this question, so ${dropWhole ? 'the unit falls to the hand-written line' : 'this row falls to the hand-written line and the rest of the unit stands'})`,
      })),
    });
    if (dropWhole) { dropped += 1; continue; }
    patched += 1;
    kept.push({
      ...unit,
      faces: faces.map((text, i) => (badFaces.has(i) ? String(corpusFaces[i] ?? '') : text)),
      notebook: notebook.filter((_, i) => !badNotes.has(i)),
    });
  }
  return { kept, verdicts, dropped, patched };
}
