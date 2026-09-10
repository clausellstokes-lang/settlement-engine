/**
 * domain/worldPulse/espionage/operationsVoice.js — THE OPERATIONS VOICE (W-OPS car O7;
 * DESIGN_W_OPS.md §8 car 7: mission beats, exposure news, the going-native arc).
 *
 * WHAT THIS HOLDS. The SENTENCES of the operations layer — the prose a reader meets
 * when a mission is taken or refused, when a spy is unmasked, priced, pardoned or
 * buried, and when a long embedding starts to show on a person. Three surfaces, one
 * law across them: every line is assembled from TYPED vocabulary and resolved reader
 * names, never from free text, and every beat carries its address chain (who, where,
 * under which typed action) and its reason — the standing news address law, satisfied
 * field by field.
 *
 * ── THE LAYER THIS FILE SITS IN, STATED EXACTLY ─────────────────────────────
 *
 * This is the RECEIPT-COMPOSER layer — the layer the estate's grammar receipts and
 * envoy receipts already occupy — and deliberately NOT a news authoring site. A beat
 * here is `kind` + `line` + `reasons` + addresses. The wizard-news envelope (the
 * banner field, the presentation weights, the desk registration) belongs to the
 * wiring car that first mounts these beats on a feed, exactly as the treaty voice
 * consumes the grammar's receipts. Until that car lands, nothing here is routed,
 * registered, or visible anywhere.
 *
 * ── THE FOG SHAPES EVERY SURFACE ────────────────────────────────────────────
 *
 * A covert operation that succeeds mints NO public word — the engine models what is
 * known, and an unseen spy is not yet a story. So the exposure surface speaks only
 * MOMENTS THE WORLD CAN SEE: a catch, a named price, a pardon, a death in keeping.
 * Its roster is closed at exactly the moments the estate's own writers can produce
 * at this tip — the custody ledger's two human-handed closures, the claim mint, and
 * the covert catch — and a parked exit (an escape, a release, an extraction, an
 * elected burn) has NO moment word here, because a sentence for a receipt no writer
 * can mint would be prose narrating a world that does not exist.
 *
 * ── THE GOING-NATIVE ARC SPEAKS STRAIN AND NEVER A TURNING ──────────────────
 *
 * The measured truth this voice must honour: ambient dwelling rests at a whisper —
 * one floor quantum per axis, at every rung — and the axis the arc runs on carries
 * ZERO reachable vice-ward sources in the real experience table. Whether ambient
 * life may EVER reverse a fidelity is an owner fork nobody has signed. So the arc
 * lines speak what watchers can see (manners worn, a life lived under a false face,
 * a heart that holds), the `reachable` verdict is a REAL vocabulary member this
 * voice deliberately refuses to speak (`unruled_reversal`), and the reversal line
 * is unwritten on purpose — the same discipline by which the treaty voice returns
 * `hollowed_quiet` and never says it. GOING_NATIVE_VOICE_LAW carries the rule in
 * the module so it cannot be lost.
 *
 * ── DARK, PURE, AND IT IMPORTS NOTHING AT ALL ───────────────────────────────
 *
 * No `src/` importer (proved by a walker), no flag minted (the door is NAMED in the
 * provenance, and the gate read is not written — the one-commit mint is a register
 * edit this packet did not order). No store, no clock, no PRNG, no I/O, no mutation.
 * Every typed word this file leans on is MIRRORED with a test-side reconcile pin
 * rather than imported, because a dark sibling's darkness arm and an import from
 * here are mutually exclusive — the law this family learned the hard way. The
 * substrate leaves it consumes are therefore named BY DESCRIPTION, never by
 * filename: the acceptance seam (whose refusal vocabulary and row-seven receipt
 * this voice speaks for), the depth-pricing leaf beside this file (whose ladder,
 * exposure words and verdicts it mirrors), the custody ledger (whose covert cause
 * and close reasons gate the exposure surface), and the ransom claim (whose worth
 * bands the price line borrows).
 *
 * @see docs/DESIGN_W_OPS.md §1 (the one grammar), §3 (the arc), §8 car 7, §9
 * @enforced-by tests/domain/operationsVoice.test.js
 */

// ── 0. Small pure helpers ─────────────────────────────────────────────────────

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * A reader NAME, or ''. Fails CLOSED: a name that merely echoes its id back is not a
 * name, and a beat rendering a slug where a person belongs is the fabrication the
 * address law forbids.
 * @param {unknown} id @param {unknown} name @returns {string}
 */
function readerName(id, name) {
  const resolved = text(name);
  return resolved && resolved !== text(id) ? resolved : '';
}

/**
 * THE READER GUARD. A spoken line may carry no digits, no scalar punctuation, and
 * none of the machine vocabulary — the same wall the envoy projection holds. Applied
 * to every line and reason at composition, so a later editor who writes a number
 * into a sentence produces a REFUSED beat rather than a leaked one.
 * @param {unknown} value @returns {string}
 */
export function readerLine(value) {
  const line = text(value);
  if (!line || /[\d%\u00d7_{}\u005b\u005d]/u.test(line)) return '';
  if (/\b(?:rng|roll|score|ratio|tick|chance|candidate|probability|odds|threshold|coefficient|multiplier|percent(?:age)?|per\s+cent|state\s*read)\b/i.test(line)) return '';
  return line;
}

// ── 1. THE CLOSED REFUSAL VOCABULARY OF THE VOICE ITSELF ──────────────────────

/**
 * Why a composer declined to speak. A refused beat is a RECEIPTED refusal, never a
 * bare null: a wiring author debugging a silent voice needs to be told which wall
 * it was — the plan-refusal idiom, carried to prose.
 * @type {readonly string[]}
 */
export const VOICE_REFUSALS = Object.freeze([
  'missing_name',       // a required reader name failed to resolve, or echoed its id
  'not_an_acceptance',  // the accepted beat was offered something other than an accepted decision
  'unreceipted_beat',   // a refusal beat with no signed row-seven receipt behind it, or the wrong shape
  'unstoried_refusal',  // a machine refusal (malformed or unpriced) — receipted, deliberately not voiced
  'not_covert_cause',   // the exposure voice was offered a hold that is not a spy's
  'not_the_moment',     // an exposure moment outside the closed roster
  'unknown_worth',      // a price line offered a worth band the claim vocabulary does not carry
  'unknown_rung',       // an arc line asked at a depth the ladder does not carry
  'unknown_verdict',    // an arc line offered a verdict word outside the closed three
  'unruled_reversal',   // the one verdict the voice must not speak while the fork is unsigned
  'short_of_dwell',     // an arc line before one whole ambient period has passed
  'unspeakable_line',   // a composed sentence failed the reader guard — defensive, proven unreachable today
]);

/**
 * The two audiences a beat can address. A covert mission's beats are the
 * PRINCIPAL'S — acceptance and refusal happen inside a room the town cannot see —
 * and so is the long watch on an embedded person; only an exposure moment is the
 * town's. Which surface sits on which side is a recorded judgment, vetoable.
 * @type {readonly string[]}
 */
export const VOICE_AUDIENCES = Object.freeze(['common_word', 'principal_private']);

/** @param {string} refusal a VOICE_REFUSALS member @returns {Readonly<Record<string, unknown>>} */
function refuse(refusal) {
  return Object.freeze({
    spoken: false,
    refusal,
    kind: '',
    audience: '',
    line: '',
    reasons: Object.freeze([]),
    npcIds: Object.freeze([]),
    settlementIds: Object.freeze([]),
    names: Object.freeze({}),
  });
}

/**
 * The one exit every composer returns through. Every sentence passes the reader
 * guard or the whole beat is refused — a beat with one leaked scalar is worse than
 * no beat at all.
 * @param {Object} args the composed beat
 * @param {string} args.kind
 * @param {string} args.audience
 * @param {string} args.line
 * @param {readonly string[]} args.reasons
 * @param {readonly string[]} args.npcIds
 * @param {readonly string[]} args.settlementIds
 * @param {Readonly<Record<string, string>>} args.names
 * @param {Readonly<Record<string, unknown>>} [args.extra]
 * @returns {Readonly<Record<string, unknown>>}
 */
function speak({ kind, audience, line, reasons, npcIds, settlementIds, names, extra }) {
  if (!readerLine(line)) return refuse('unspeakable_line');
  for (const reason of reasons) {
    if (!readerLine(reason)) return refuse('unspeakable_line');
  }
  return Object.freeze({
    spoken: true,
    refusal: null,
    kind,
    audience,
    line,
    reasons: Object.freeze([...reasons]),
    npcIds: Object.freeze([...npcIds].filter(Boolean)),
    settlementIds: Object.freeze([...new Set([...settlementIds].filter(Boolean))]),
    names: Object.freeze({ ...names }),
    ...asObject(extra),
  });
}

// ── 2. MISSION BEATS — the acceptance seam, voiced ────────────────────────────

/**
 * The acceptance seam's refusal vocabulary, MIRRORED — seven words, split here into
 * the four that are a person's story and the three that are a machine's. The
 * battery reconciles the union against the real seam, word for word.
 *
 * The three unstoried words are receipted like any refusal and deliberately not
 * voiced: a malformed or unpriced operation is a defect report, and a sentence
 * narrating a defect would put debugging prose in a reader's mouth. Whether they
 * ever deserve a sentence is the pen's call, recorded in the provenance.
 * @type {readonly string[]}
 */
export const STORIED_REFUSALS = Object.freeze([
  'vetting',
  'unwilling',
  'risk_above_window',
  'risk_below_window',
]);

/** The machine half of the mirror. @type {readonly string[]} */
export const UNSTORIED_REFUSALS = Object.freeze([
  'invalid_operation',
  'invalid_register',
  'unpriced_operation',
]);

/**
 * The owner-taste row that gates the refusal receipt this surface voices, mirrored
 * from the acceptance seam so the two files cannot drift apart silently. The voice
 * inherits that row's darkness whole: no signed receipt, no beat.
 */
export const RECEIPT_ROW_MIRROR = 'W-REGISTERS-PACK#REGISTER-VI.7';

/** The mission beat kinds. Closed. @type {readonly string[]} */
export const MISSION_BEAT_KINDS = Object.freeze(['mission_accepted', 'mission_refused']);

/**
 * The refusal lines, one per storied word. The window's two edges are separately
 * voiced on purpose: the timid refusal and the bored one are opposite statements
 * of character, and folding them into one sentence would delete half the register
 * the seam exists to read.
 * @type {Readonly<Record<string, (x: Record<string, string>) => string>>}
 */
const REFUSAL_LINE = Object.freeze({
  vetting: (x) => `${x.principal}'s own seat sets ${x.person} aside before the question is asked`,
  unwilling: (x) => `${x.person} hears ${x.principal}'s commission and will not take it`,
  risk_above_window: (x) => `${x.person} calls ${x.principal}'s commission a death warrant and hands it back`,
  risk_below_window: (x) => `${x.person} hands ${x.principal}'s commission back as work beneath them`,
});

/** @type {Readonly<Record<string, string>>} */
const REFUSAL_REASON = Object.freeze({
  vetting: 'The records were read before the person was, and the records ended it. Character speaks only for those the paperwork clears.',
  unwilling: 'The seat had cleared them and the work was fairly priced; the no was the person\'s own, and the record keeps it as one.',
  risk_above_window: 'The work asked more than they will carry, and declining it is a statement of character the principal now holds in writing.',
  risk_below_window: 'The work asked too little; a person of appetite refuses the errand that teaches nothing, and that refusal reads as ambition, not fear.',
});

/**
 * THE ACCEPTED BEAT. Composed from the acceptance seam's own verdict object —
 * handed in, never derived here — plus resolved reader names. When the verdict
 * says the governing register was the ROOTED one, the beat says so in words,
 * because "the one who stayed is the one who chose" is the whole drama of the
 * rooting freeze and a reader should meet it as a sentence.
 *
 * @param {Object} args
 * @param {unknown} [args.decision]      the acceptance seam's verdict object
 * @param {unknown} [args.principalId]
 * @param {unknown} [args.principalName]
 * @param {unknown} [args.npcId]
 * @param {unknown} [args.npcName]
 * @returns {Readonly<Record<string, unknown>>}
 */
export function missionAcceptedBeat({ decision, principalId, principalName, npcId, npcName } = {}) {
  const row = asObject(decision);
  if (row.verdict !== 'accepted') return refuse('not_an_acceptance');
  const principal = readerName(principalId, principalName);
  const person = readerName(npcId, npcName);
  if (!principal || !person) return refuse('missing_name');
  const rooted = row.registerSource === 'rooted';
  return speak({
    kind: 'mission_accepted',
    audience: 'principal_private',
    line: `${person} takes ${principal}'s commission`,
    reasons: [
      'The paperwork cleared, the willingness was real, and the work sat inside the risks this person carries well.',
      ...(rooted
        ? ['The appetite that decided is the one they rooted with. The one who stayed is the one who chose.']
        : []),
    ],
    npcIds: [text(npcId)],
    settlementIds: [],
    names: { person, principal },
    extra: {
      principalId: text(principalId),
      operationId: text(row.operationId),
      registerSource: text(row.registerSource),
    },
  });
}

/**
 * THE REFUSAL BEAT, and it inherits the receipt's darkness whole. The input is a
 * row-seven refusal receipt — the thing the acceptance seam returns ONLY when the
 * owner's pen has signed that row — so while the row is unsigned there is no
 * receipt, and with no receipt there is no beat. The voice never re-derives whose
 * refusal it was: `byThePerson` is the receipt's own field, passed through.
 *
 * @param {Object} args
 * @param {unknown} [args.receipt]        a row-seven refusal receipt
 * @param {unknown} [args.principalName]
 * @param {unknown} [args.npcId]
 * @param {unknown} [args.npcName]
 * @returns {Readonly<Record<string, unknown>>}
 */
export function missionRefusalBeat({ receipt, principalName, npcId, npcName } = {}) {
  const row = asObject(receipt);
  const refusal = text(row.refusal);
  const known = STORIED_REFUSALS.includes(refusal) || UNSTORIED_REFUSALS.includes(refusal);
  if (row.row !== RECEIPT_ROW_MIRROR || !known || !text(row.principalId)) {
    return refuse('unreceipted_beat');
  }
  if (UNSTORIED_REFUSALS.includes(refusal)) return refuse('unstoried_refusal');
  const principal = readerName(row.principalId, principalName);
  const person = readerName(npcId, npcName);
  if (!principal || !person) return refuse('missing_name');
  const line = REFUSAL_LINE[refusal]({ person, principal });
  return speak({
    kind: 'mission_refused',
    audience: 'principal_private',
    line,
    reasons: [REFUSAL_REASON[refusal]],
    npcIds: [text(npcId)],
    settlementIds: [],
    names: { person, principal },
    extra: {
      principalId: text(row.principalId),
      operationId: text(row.operationId),
      refusal,
      byThePerson: row.byThePerson === true,
    },
  });
}

// ── 3. EXPOSURE NEWS — the moments the world can see ──────────────────────────

/**
 * The covert custody cause, MIRRORED from the hold ledger's closed vocabulary and
 * reconciled by the battery. Every exposure composer is gated on this exact word:
 * an intercepted envoy and a jailed debtor are other desks' stories.
 */
export const COVERT_CAUSE_MIRROR = 'caught_spying';

/**
 * THE CLOSED MOMENT ROSTER, and its shortness is the finding it carries. Four
 * moments, because at this tip the world can produce exactly four: the catch
 * (the covert cause landing on a hold), the claim (a minted price), and the two
 * closures a human hand actually writes. An escape, a release, an extraction and
 * an elected burn are all PARKED in the custody census — no writer can mint their
 * receipts — so no word for them exists here, and adding one is unlocked by the
 * parked exit landing, never by a prose edit.
 * @type {readonly string[]}
 */
export const EXPOSURE_MOMENTS = Object.freeze([
  'taken',
  'price_named',
  'pardoned',
  'died_in_custody',
]);

/**
 * The ransom worth bands, MIRRORED from the claim vocabulary; the price line
 * spends them as words of standing, which is what they are.
 * @type {readonly string[]}
 */
export const WORTH_BAND_MIRROR = Object.freeze(['common', 'notable', 'principal']);

/** @type {Readonly<Record<string, (x: Record<string, string>) => string>>} */
const PRICE_LINE = Object.freeze({
  common: (x) => `${x.captor} names a common ransom for ${x.person}`,
  notable: (x) => `${x.captor} sets a notable price on ${x.person}`,
  principal: (x) => `${x.captor} prices ${x.person} as a principal taken in the act`,
});

/**
 * THE EXPOSURE BEAT. One composer for the four moments, all gated on the covert
 * cause, all fail-closed on names. The reasons carry the layer's own laws in
 * reader words: the catch names the false face read back as the true one (the
 * taint cascade), the price names why a spy is held longer and priced higher (the
 * custody scaling), and the death names what a closed mouth takes with it (the
 * gathered word that never travelled).
 *
 * @param {Object} args
 * @param {unknown} [args.moment]      an EXPOSURE_MOMENTS member
 * @param {unknown} [args.cause]       the hold's cause word — must be the covert one
 * @param {unknown} [args.npcId]
 * @param {unknown} [args.npcName]
 * @param {unknown} [args.captorId]    the holding settlement
 * @param {unknown} [args.captorName]
 * @param {unknown} [args.hostId]      where the catch happened (the taken moment)
 * @param {unknown} [args.hostName]
 * @param {unknown} [args.worthBand]   a WORTH_BAND_MIRROR member (the price moment)
 * @returns {Readonly<Record<string, unknown>>}
 */
export function exposureNewsBeat({
  moment, cause, npcId, npcName, captorId, captorName, hostId, hostName, worthBand,
} = {}) {
  const word = text(moment);
  if (!EXPOSURE_MOMENTS.includes(word)) return refuse('not_the_moment');
  if (text(cause) !== COVERT_CAUSE_MIRROR) return refuse('not_covert_cause');
  const person = readerName(npcId, npcName);
  if (!person) return refuse('missing_name');

  if (word === 'taken') {
    const host = readerName(hostId, hostName);
    if (!host) return refuse('missing_name');
    return speak({
      kind: 'operative_unmasked',
      audience: 'common_word',
      line: `${person} is taken for a spy in ${host}`,
      reasons: [
        'The watch stood at one of the places such work must pass, and the face the person wore did not answer for them.',
        'What was done under the false face is now read back under the true one.',
      ],
      npcIds: [text(npcId)],
      settlementIds: [text(hostId)],
      names: { person, host },
      extra: { moment: word, cause: COVERT_CAUSE_MIRROR },
    });
  }

  const captor = readerName(captorId, captorName);
  if (!captor) return refuse('missing_name');

  if (word === 'price_named') {
    const band = text(worthBand);
    if (!WORTH_BAND_MIRROR.includes(band)) return refuse('unknown_worth');
    return speak({
      kind: 'ransom_price_named',
      audience: 'common_word',
      line: PRICE_LINE[band]({ person, captor }),
      reasons: [
        'A caught spy is worth more than a caught traveller, and the deeper the work, the longer the holding and the higher the asking.',
      ],
      npcIds: [text(npcId)],
      settlementIds: [text(captorId)],
      names: { person, captor },
      extra: { moment: word, cause: COVERT_CAUSE_MIRROR, worthBand: band },
    });
  }

  if (word === 'pardoned') {
    return speak({
      kind: 'operative_pardoned',
      audience: 'common_word',
      line: `${captor} pardons ${person} and opens the road home`,
      reasons: [
        'The hold ended at the captor\'s own word, and the person walks out under it.',
      ],
      npcIds: [text(npcId)],
      settlementIds: [text(captorId)],
      names: { person, captor },
      extra: { moment: word, cause: COVERT_CAUSE_MIRROR },
    });
  }

  return speak({
    kind: 'operative_died_in_custody',
    audience: 'common_word',
    line: `${person} dies in ${captor}'s keeping`,
    reasons: [
      'The hold closed with a death; whatever the person had not already sent home will never arrive now.',
    ],
    npcIds: [text(npcId)],
    settlementIds: [text(captorId)],
    names: { person, captor },
    extra: { moment: word, cause: COVERT_CAUSE_MIRROR },
  });
}

// ── 4. THE GOING-NATIVE ARC — strain, spoken; a turning, refused ──────────────

/**
 * The infiltration ladder, MIRRORED (rung names, level order) and zipped to the
 * registers pack's five exposure words exactly as the depth-pricing leaf beside
 * this file zips them; the battery reconciles this mirror against BOTH — the real
 * ladder and the real bands — so three files cannot drift apart in any pair.
 * @type {ReadonlyArray<Readonly<{level: number, name: string, exposure: string}>>}
 */
export const ARC_RUNGS_MIRROR = Object.freeze([
  Object.freeze({ level: 0, name: 'passing_ear', exposure: 'faint' }),
  Object.freeze({ level: 1, name: 'observer', exposure: 'light' }),
  Object.freeze({ level: 2, name: 'rooted', exposure: 'full' }),
  Object.freeze({ level: 3, name: 'placed', exposure: 'deep' }),
  Object.freeze({ level: 4, name: 'seated', exposure: 'immersed' }),
]);

/** The exposure word whose rung lives the host's whole life — the sharper line. */
export const IMMERSED_WORD_MIRROR = ARC_RUNGS_MIRROR[ARC_RUNGS_MIRROR.length - 1].exposure;

/**
 * The three verdict words the depth-pricing read can return about the arc,
 * MIRRORED. Two are spoken; one is refused — see the law below.
 * @type {readonly string[]}
 */
export const GOING_NATIVE_VERDICT_WORDS = Object.freeze(['no_road', 'event_only', 'reachable']);

/**
 * ⭐⭐ THE VOICE LAW OF THIS SURFACE, in the module so a reader meets it as law.
 * Whether ambient life may EVER reverse a fidelity is an owner fork nobody has
 * signed — the depth-pricing leaf beside this file carries it in its ownerRows —
 * so no line here may state or presuppose a turning. The `reachable` verdict is
 * recognised, returned, and deliberately UNSPOKEN until the fork is signed; its
 * prose does not exist to be un-darkened by accident.
 * @type {Readonly<{rule: string, spoken: readonly string[], unspoken: readonly string[], measured: string, signedBy: string|null}>}
 */
export const GOING_NATIVE_VOICE_LAW = Object.freeze({
  rule: 'the voice speaks strain and never a turning: no line states or presupposes that dwelling can reverse a fidelity while the reversal fork is unsigned',
  spoken: Object.freeze(['no_road', 'event_only']),
  unspoken: Object.freeze(['reachable']),
  measured: 'ambient dwelling rests at a whisper (one floor quantum per axis at every rung), and the axis the arc runs on carries zero reachable vice-ward sources in the real experience table',
  signedBy: null,
});

/**
 * The dwell span bands — how long a person has lived inside the host, in words a
 * reader can hold. Counted in WHOLE AMBIENT PERIODS (the funnel's own cadence,
 * handed in by the caller as a count), spoken as band words because the corpus may
 * carry no digits. A first mint, owner-tunable; the pen renames or re-cuts.
 * @type {ReadonlyArray<Readonly<{id: string, underCadences: number, word: string}>>}
 */
export const DWELL_SPAN_BANDS = Object.freeze([
  Object.freeze({ id: 'newly_lodged', underCadences: 4, word: 'newly lodged' }),
  Object.freeze({ id: 'seasons_deep', underCadences: 12, word: 'seasons deep' }),
  Object.freeze({ id: 'years_grown', underCadences: Infinity, word: 'years grown' }),
]);

/** The span band for a whole-period count. @param {number} cadences @returns {Readonly<{id: string, underCadences: number, word: string}>} */
export function dwellSpanBandOf(cadences) {
  const count = Number(cadences) || 0;
  return DWELL_SPAN_BANDS.find((band) => count < band.underCadences) || DWELL_SPAN_BANDS[DWELL_SPAN_BANDS.length - 1];
}

/** The arc beat kinds. Closed. @type {readonly string[]} */
export const ARC_BEAT_KINDS = Object.freeze(['manners_worn', 'lives_the_host_life']);

/** @type {Readonly<Record<string, readonly string[]>>} */
const ARC_REASONS = Object.freeze({
  no_road: Object.freeze([
    'Dwelling teaches the habits of a place, and habits sit on a person without reaching what they are.',
    'The heart under the habits is the one they came with; the watch reads manners moving and fidelity holding.',
  ]),
  event_only: Object.freeze([
    'The habits of the place have settled on them, and habits are not fidelity.',
    'If the heart is ever to turn, it will be something that happens to them that turns it. Never the slow weight of the streets, which rests at a whisper however many years it presses.',
  ]),
});

/**
 * THE ARC BEAT. The watchers' sentence about a long-embedded person: what shows
 * (the host's manners, or at the seat, the host's whole life) and what holds (the
 * heart), keyed on the depth-pricing read's own verdict word. The `reachable`
 * verdict refuses by law; a verdict outside the closed three refuses as unknown
 * rather than being rounded to the nearest story.
 *
 * @param {Object} args
 * @param {unknown} [args.level]     a rung name or level number
 * @param {unknown} [args.verdict]   a GOING_NATIVE_VERDICT_WORDS member
 * @param {unknown} [args.cadences]  whole ambient periods dwelt, from the plan's own count
 * @param {unknown} [args.npcId]
 * @param {unknown} [args.npcName]
 * @param {unknown} [args.hostId]
 * @param {unknown} [args.hostName]
 * @returns {Readonly<Record<string, unknown>>}
 */
export function goingNativeArcBeat({ level, verdict, cadences, npcId, npcName, hostId, hostName } = {}) {
  const wanted = text(level) || String(level);
  const rung = ARC_RUNGS_MIRROR.find((row) => row.name === wanted || String(row.level) === wanted) || null;
  if (!rung) return refuse('unknown_rung');
  const word = text(verdict);
  if (!GOING_NATIVE_VERDICT_WORDS.includes(word)) return refuse('unknown_verdict');
  if (GOING_NATIVE_VOICE_LAW.unspoken.includes(word)) return refuse('unruled_reversal');
  const periods = Number(cadences);
  if (!Number.isFinite(periods) || periods < 1) return refuse('short_of_dwell');
  const person = readerName(npcId, npcName);
  const host = readerName(hostId, hostName);
  if (!person || !host) return refuse('missing_name');
  const span = dwellSpanBandOf(periods).word;
  const immersed = rung.exposure === IMMERSED_WORD_MIRROR;
  return speak({
    kind: immersed ? 'lives_the_host_life' : 'manners_worn',
    audience: 'principal_private',
    line: immersed
      ? `${person} lives ${host}'s life now, ${span} under a face that is not theirs`
      : `${person}, ${span} in ${host}, wears the town's manners like a borrowed coat`,
    reasons: [...ARC_REASONS[word]],
    npcIds: [text(npcId)],
    settlementIds: [text(hostId)],
    names: { person, host },
    extra: {
      rung: rung.name,
      exposure: rung.exposure,
      verdict: word,
      spanBand: dwellSpanBandOf(periods).id,
    },
  });
}

// ── 5. PROVENANCE ─────────────────────────────────────────────────────────────

/**
 * Provenance, in the module, the family idiom: a reader who arrives at the code
 * before the docs learns the signature status and the door here.
 * @type {Readonly<{status: string, signedBy: string|null, door: string, ownerRows: readonly string[], consumers: string}>}
 */
export const OPERATIONS_VOICE_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (every sentence in this file is voice-taste awaiting the pen; the vocabularies are closed, the lines are candidates)',
  signedBy: null,
  door: 'operationsVoiceEnabled: MINTED 2026-09-05 by the lighting wave car LGT-P5-WOPS, and the READ IS NOT HERE. The key is a manifest member with an authored certification row, and its one by-name strict gate lives in the espionage family door module, AND-composed with the layer: beneath it every surface inherits the doors of the subsystem whose receipts it voices. This leaf stays gate-free by its own contract, which its suite pins on the logic rather than on the prose',
  ownerRows: Object.freeze([
    'every line and reason here is the pen\'s: the words are candidates, and none is signed',
    'the going-native reversal line is DELIBERATELY UNWRITTEN. Writing it is a ruling on the unsigned reversal fork, never a prose edit',
    'the audience split (mission beats and the long watch are the principal\'s; exposure moments are the town\'s) is a recorded judgment, vetoable',
    'the dwell span words are a first mint of three bands; the pen renames or re-cuts them',
    'the four storied refusals are voiced and the three machine refusals are not. Whether a malformed or unpriced operation ever deserves a sentence is the pen\'s call',
  ]),
  consumers: 'NONE by design. No src module imports this leaf; the feed envelope and desk registration belong to the wiring car, and until it lands nothing here is routed anywhere',
});
