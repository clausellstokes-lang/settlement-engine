/**
 * readerRubric.mjs — THE TYPED RUBRIC AND ITS TOTAL VALIDATOR.
 *
 * THE DEFECT THIS EXISTS TO MAKE IMPOSSIBLE. A reader panel reports in prose, and prose
 * cannot be counted, contradicted or refused. Two failure shapes were found by asking
 * "could a panel pass a world where nothing shows?" — and the answer was yes, twice over:
 *
 *   1. BY OMISSION. A report that simply never asks a question scores nothing against it,
 *      so a system nobody looked at reads exactly like a system with no defects. A
 *      validator that is total over its VOCABULARY but not over its QUESTIONS refuses a
 *      wrong answer and waves through a missing one.
 *   2. BY MODEL DUMP. A report can score every question `shown` while citing only the
 *      record the engine wrote — the settlement's own state — rather than any document a
 *      customer reads. The fact is in the world; nobody can see it; the report says shown.
 *
 * SO THE VALIDATOR IS TOTAL OVER ITS QUESTIONS, AND A CITATION'S KIND IS DERIVED. Every
 * rubric id for the report's system must appear exactly once, and `surface` versus `record`
 * is computed from the document id rather than declared by the reader, so a model dump can
 * never be offered as a surface. A `shown` or `partial` answer must cite at least one
 * SURFACE document; an answer that says the fact is written but unseen must cite the RECORD
 * that proves it was written at all, so "correct but invisible" stays a measurement rather
 * than an opinion.
 *
 * THE FOURTH AXIS, AND WHY IT IS MACHINE-CHECKED. Under visibility, legibility and
 * coherence alone, a world where everything shows in the wrong register scores
 * `shown`/`addressed`/`coherent`. REGISTER is that fourth axis, and its five MECHANICAL
 * members (`em_dash`, `exclamation`, `digit_in_prose`, `feature_flag_language`,
 * `engine_token`) are DERIVED from the cited surface string rather than judged, in both
 * directions: a reader who misses a tell is corrected, and a reader who claims one that is
 * not there is corrected too. Only `meta_language` and `repeated_idea` are left to the
 * reader, because only they need a human.
 *
 * PURE: no I/O, no state, no clock. The CLI reads the files.
 */

/** The seven systems a reader is seated against. */
export const READER_SYSTEMS = Object.freeze([
  'character', 'operations', 'faith', 'war_memory', 'density', 'capacity', 'settlement_fact',
]);

/** Can the customer SEE it. */
export const VISIBILITY = Object.freeze([
  'shown', 'partial', 'shown_then_retired', 'invisible',
  'dark_by_flag', 'dark_in_default_preset', 'dark_by_entitlement', 'absent_by_design',
]);

/** The visibility values that assert the customer can read the fact on a surface. */
export const SHOWN_VISIBILITIES = Object.freeze(['shown', 'partial']);

/** The visibility values that assert the fact EXISTS but is not readable at launch. */
export const WRITTEN_BUT_UNSEEN_VISIBILITIES = Object.freeze([
  'shown_then_retired', 'invisible', 'dark_by_flag',
  'dark_in_default_preset', 'dark_by_entitlement',
]);

/** Can the customer tell WHO did WHAT to WHOM and WHY — the news address law, scored. */
export const LEGIBILITY = Object.freeze([
  'addressed', 'unaddressed_subject', 'unaddressed_action',
  'unaddressed_affected', 'unaddressed_reason', 'formula_leak', 'not_applicable',
]);

/** Does it sound like the product — the fourth axis. */
export const REGISTER = Object.freeze([
  'in_voice', 'em_dash', 'exclamation', 'digit_in_prose',
  'meta_language', 'feature_flag_language', 'engine_token', 'repeated_idea',
]);

/** The REGISTER members the validator derives rather than trusts. */
export const MECHANICAL_REGISTER_MEMBERS = Object.freeze([
  'em_dash', 'exclamation', 'digit_in_prose', 'feature_flag_language', 'engine_token',
]);

/** Does it agree with the rest of the world. */
export const COHERENCE = Object.freeze(['coherent', 'contradiction', 'unverifiable']);

export const CONTRADICTION_CLASSES = Object.freeze([
  'at_war_trading_normally', 'ousted_actor_acting', 'destroyed_settlement_acting',
  'bane_without_consequence', 'name_drift', 'count_nonreconciled', 'chronology_inversion',
  'dark_system_speaking', 'cross_document_disagreement', 'template_alternation',
]);

export const CAR_CLASSES = Object.freeze([
  'WIRING', 'PROSE_RENDER', 'PROSE_PERSISTED', 'DISPLAY', 'ENGINE_OWNER', 'LIGHTING_DESK', 'NONE',
]);

/** The classes a lane may mint on its own word. Everything else is the door's or the owner's. */
export const LANE_MINTABLE_CAR_CLASSES = Object.freeze(['WIRING', 'PROSE_RENDER', 'DISPLAY']);

/** The classes that may never be minted without an owner row. */
export const OWNER_CAR_CLASSES = Object.freeze(['ENGINE_OWNER', 'LIGHTING_DESK']);

export const READER_POSTURES = Object.freeze(['launch', 'preview']);

export const READER_ENTITLEMENTS = Object.freeze(['free', 'player', 'dm', 'premium_dm']);

/**
 * A string minted at tick time and written INTO the world lives under one of these, and a
 * fix to it is PROSE_PERSISTED — a golden re-record, owner-signed — never a lane's
 * PROSE_RENDER car. The split is decided by where the string LIVES, never by the symptom.
 */
export const PERSISTED_WRITER_PREFIXES = Object.freeze([
  'src/domain/worldPulse/', 'src/domain/region/', 'src/domain/spatial/',
]);

/**
 * The 15 rubric questions. Every one names the system it is seated under and the RECORD
 * home whose existence an "it is written but unseen" answer must cite.
 */
export const READER_RUBRIC = Object.freeze([
  Object.freeze({ id: 'Q-CHAR-1', system: 'character', recordHome: 'npc' }),
  Object.freeze({ id: 'Q-CHAR-2', system: 'character', recordHome: 'npc' }),
  Object.freeze({ id: 'Q-OPS-1', system: 'operations', recordHome: 'errand' }),
  Object.freeze({ id: 'Q-OPS-2', system: 'operations', recordHome: 'errand' }),
  Object.freeze({ id: 'Q-FAI-1', system: 'faith', recordHome: 'faith' }),
  Object.freeze({ id: 'Q-FAI-2', system: 'faith', recordHome: 'faith' }),
  Object.freeze({ id: 'Q-FAI-3', system: 'faith', recordHome: 'faith' }),
  Object.freeze({ id: 'Q-WAR-1', system: 'war_memory', recordHome: 'war' }),
  Object.freeze({ id: 'Q-WAR-2', system: 'war_memory', recordHome: 'war' }),
  Object.freeze({ id: 'Q-DEN-1', system: 'density', recordHome: 'power' }),
  Object.freeze({ id: 'Q-DEN-2', system: 'density', recordHome: 'power' }),
  Object.freeze({ id: 'Q-CAP-1', system: 'capacity', recordHome: 'outlook' }),
  Object.freeze({ id: 'Q-CAP-2', system: 'capacity', recordHome: 'outlook' }),
  Object.freeze({ id: 'Q-FACT-1', system: 'settlement_fact', recordHome: 'settlement' }),
  Object.freeze({ id: 'Q-ADR-1', system: 'settlement_fact', recordHome: 'news' }),
]);

/** Q-ADR-1 is asked of EVERY system, not only its own — it is the address law's question. */
export const UNIVERSAL_QUESTION_IDS = Object.freeze(['Q-ADR-1']);

/**
 * A citation's kind is DERIVED from its document id, never declared.
 *
 * A `.vm` document is a rendered view MODEL — the shape a surface would draw from — and it
 * is therefore a RECORD, not a surface. This is the whole point of deriving the kind: a
 * panel citing `dossier-soak-a.vm` has cited the data behind the page, not the page, and
 * calling that `shown` is the model-dump failure this validator exists to refuse.
 */
export const RECORD_DOC_PREFIXES = Object.freeze([
  'world-', 'faith-', 'war-', 'power-', 'npc-', 'errand-', 'outlook-', 'settlement-',
]);

/** Documents whose citation must carry the tick it was read at. */
export const TICK_REQUIRED_DOCS = Object.freeze(['news', 'chronicle-advance']);

/** Document-id prefixes whose citation must carry the tick it was read at. */
export const TICK_REQUIRED_PREFIXES = Object.freeze(['letter-']);

/**
 * @param {string} doc
 * @returns {'surface' | 'record'}
 */
export function readerCitationKind(doc) {
  const id = String(doc || '');
  if (id.endsWith('.vm')) return 'record';
  if (RECORD_DOC_PREFIXES.some((prefix) => id.startsWith(prefix))) return 'record';
  return 'surface';
}

/**
 * @param {string} doc
 * @returns {boolean}
 */
export function citationNeedsTick(doc) {
  const id = String(doc || '');
  return TICK_REQUIRED_DOCS.includes(id)
    || TICK_REQUIRED_PREFIXES.some((prefix) => id.startsWith(prefix));
}

/** The tells the mechanical REGISTER members are derived by. */
const REGISTER_TELLS = Object.freeze({
  em_dash: /—/,
  exclamation: /!/,
  digit_in_prose: /\d/,
  feature_flag_language: /\b(?:feature\s+flag|flag|toggle|enabled|disabled)\b|[A-Za-z]+Enabled\b/i,
  engine_token: /\b[a-z]+(?:_[a-z0-9]+)+\b|\b[a-z]+[A-Z][A-Za-z0-9]*\b/,
});

/**
 * The mechanical REGISTER members a cited surface string actually carries.
 * @param {string} text
 * @returns {string[]}
 */
export function mechanicalRegisterOf(text) {
  const value = String(text ?? '');
  return MECHANICAL_REGISTER_MEMBERS.filter((member) => REGISTER_TELLS[member].test(value));
}

/** The rubric ids a report for `system` must answer, exactly once each. */
export function requiredQuestionIdsFor(system) {
  const own = READER_RUBRIC.filter((q) => q.system === system).map((q) => q.id);
  const universal = UNIVERSAL_QUESTION_IDS.filter((id) => !own.includes(id));
  return [...own, ...universal];
}

const refusal = (code, answerId, detail) => ({ code, answerId: answerId ?? null, detail });

/**
 * Validate one reader report. TOTAL over its questions, not only over its vocabulary.
 *
 * @param {Record<string, any> | null | undefined} report
 * @param {Record<string, any> | null | undefined} manifest
 * @param {(locator: string) => unknown} [resolveLocator]
 * @returns {{ ok: boolean, refusals: { code: string, answerId: string | null, detail: string }[], histogram: Record<string, Record<string, number>> }}
 */
export function validateReaderReport(report, manifest, resolveLocator) {
  const refusals = [];
  const resolve = typeof resolveLocator === 'function' ? resolveLocator : () => true;
  const system = String(report?.system ?? '');
  const answers = Array.isArray(report?.answers) ? report.answers : [];

  if (!READER_SYSTEMS.includes(system)) {
    refusals.push(refusal('unknown_vocabulary', null, `system: ${system}`));
  }
  if (report?.posture !== undefined && !READER_POSTURES.includes(String(report.posture))) {
    refusals.push(refusal('posture_mismatch', null, `report posture: ${report.posture}`));
  }

  const seen = new Map();
  for (const answer of answers) {
    const id = answer?.questionId ?? answer?.id ?? null;
    seen.set(String(id), (seen.get(String(id)) || 0) + 1);

    const question = READER_RUBRIC.find((q) => q.id === String(id));
    if (!question) {
      refusals.push(refusal('unknown_question', id, `not a rubric id: ${id}`));
      continue;
    }

    const visibility = String(answer?.visibility ?? '');
    if (!VISIBILITY.includes(visibility)) {
      refusals.push(refusal('unknown_vocabulary', id, `visibility: ${visibility}`));
    }
    if (answer?.legibility !== undefined && !LEGIBILITY.includes(String(answer.legibility))) {
      refusals.push(refusal('unknown_vocabulary', id, `legibility: ${answer.legibility}`));
    }
    const coherence = String(answer?.coherence ?? '');
    if (answer?.coherence !== undefined && !COHERENCE.includes(coherence)) {
      refusals.push(refusal('unknown_vocabulary', id, `coherence: ${coherence}`));
    }
    for (const member of (Array.isArray(answer?.register) ? answer.register : [])) {
      if (!REGISTER.includes(String(member))) {
        refusals.push(refusal('unknown_vocabulary', id, `register: ${member}`));
      }
    }
    if (answer?.posture !== undefined && report?.posture !== undefined
      && String(answer.posture) !== String(report.posture)) {
      refusals.push(refusal('posture_mismatch', id, `answer ${answer.posture} vs report ${report.posture}`));
    }

    const citations = Array.isArray(answer?.citations) ? answer.citations : [];
    const isNotApplicable = String(answer?.legibility ?? '') === 'not_applicable';
    if (citations.length === 0 && visibility !== 'absent_by_design') {
      refusals.push(refusal('citation_required', id, 'no citation'));
    }

    const kinds = new Set();
    for (const citation of citations) {
      const doc = String(citation?.doc ?? '');
      const kind = readerCitationKind(doc);
      kinds.add(kind);
      if (resolve(citation?.locator) == null) {
        refusals.push(refusal('citation_unresolvable', id, `${doc}#${citation?.locator}`));
      }
      if (citationNeedsTick(doc) && !Number.isFinite(Number(citation?.tick))) {
        refusals.push(refusal('tick_required', id, `${doc} carries no tick`));
      }
      if (kind === 'surface') {
        const derived = mechanicalRegisterOf(citation?.text);
        const declared = new Set((Array.isArray(answer?.register) ? answer.register : []).map(String));
        for (const member of derived) {
          if (!declared.has(member)) {
            refusals.push(refusal('register_violation', id, `${doc} carries ${member}, undeclared`));
          }
        }
        for (const member of declared) {
          if (MECHANICAL_REGISTER_MEMBERS.includes(member) && !derived.includes(member)) {
            refusals.push(refusal('register_violation', id, `${doc} does not carry ${member}, declared`));
          }
        }
      }
    }

    if (SHOWN_VISIBILITIES.includes(visibility) && citations.length > 0 && !kinds.has('surface')) {
      refusals.push(refusal('surface_citation_required', id, 'a model dump is not a surface'));
    }
    if (WRITTEN_BUT_UNSEEN_VISIBILITIES.includes(visibility) && citations.length > 0 && !kinds.has('record')) {
      refusals.push(refusal('record_citation_required', id, `no record proves the fact exists (home: ${question.recordHome})`));
    }
    if (visibility === 'absent_by_design' && isNotApplicable && !kinds.has('record')) {
      refusals.push(refusal('record_citation_required', id, 'not_applicable needs a record saying why'));
    }
    if (coherence === 'contradiction' && !CONTRADICTION_CLASSES.includes(String(answer?.contradictionClass ?? ''))) {
      refusals.push(refusal('contradiction_class_required', id, `class: ${answer?.contradictionClass}`));
    }
  }

  for (const id of requiredQuestionIdsFor(system)) {
    const count = seen.get(id) || 0;
    if (count !== 1) {
      refusals.push(refusal('question_missing', id, `answered ${count} times, must be exactly once`));
    }
  }

  return { ok: refusals.length === 0, refusals, histogram: visibilityHistogram([report]) };
}

/**
 * The per-campaign visibility histogram FINDINGS.md prints first, so the owner reads
 * "N of 15 shown" before any prose.
 *
 * @param {Array<Record<string, any>>} reports
 * @returns {Record<string, Record<string, number>>}
 */
export function visibilityHistogram(reports) {
  /** @type {Record<string, Record<string, number>>} */
  const out = {};
  for (const system of READER_SYSTEMS) {
    out[system] = {};
    for (const value of VISIBILITY) out[system][value] = 0;
  }
  for (const report of (Array.isArray(reports) ? reports : [])) {
    const system = String(report?.system ?? '');
    if (!out[system]) continue;
    for (const answer of (Array.isArray(report?.answers) ? report.answers : [])) {
      const visibility = String(answer?.visibility ?? '');
      if (visibility in out[system]) out[system][visibility] += 1;
    }
  }
  return out;
}

/**
 * Validate one backlog row. `outputMoving` is MEASURED by the caller, never self-declared,
 * and this refuses every shape that would let a moved output land without a record.
 *
 * @param {Record<string, any> | null | undefined} row
 * @returns {{ ok: boolean, refusals: { code: string, answerId: string | null, detail: string }[] }}
 */
export function validateBacklogRow(row) {
  const refusals = [];
  const carClass = String(row?.carClass ?? '');
  const id = row?.id ?? null;

  if (!CAR_CLASSES.includes(carClass)) {
    refusals.push(refusal('unknown_vocabulary', id, `carClass: ${carClass}`));
  }
  if (row?.system !== undefined && !READER_SYSTEMS.includes(String(row.system))) {
    refusals.push(refusal('unknown_vocabulary', id, `system: ${row.system}`));
  }

  const writerPath = String(row?.writerPath ?? '');
  if (LANE_MINTABLE_CAR_CLASSES.includes(carClass)
    && PERSISTED_WRITER_PREFIXES.some((prefix) => writerPath.startsWith(prefix))) {
    refusals.push(refusal('unknown_vocabulary', id,
      `${carClass} writer lives at ${writerPath}: this is PROSE_PERSISTED, the door's, never a lane's`));
  }

  const goldensMoved = Array.isArray(row?.goldensMoved) ? row.goldensMoved : [];
  const hasRecord = Boolean(row?.shiftRecord) || Boolean(row?.ownerRow);
  if (goldensMoved.length > 0 && !row?.shiftRecord) {
    refusals.push(refusal('citation_required', id, `${goldensMoved.length} golden(s) moved with no shiftRecord`));
  }
  if (row?.outputMoving === true && !hasRecord) {
    refusals.push(refusal('citation_required', id, 'outputMoving with neither shiftRecord nor ownerRow'));
  }
  if (OWNER_CAR_CLASSES.includes(carClass) && !row?.ownerRow) {
    refusals.push(refusal('citation_required', id, `${carClass} needs an ownerRow`));
  }

  return { ok: refusals.length === 0, refusals };
}
