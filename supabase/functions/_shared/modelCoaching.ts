/**
 * _shared/modelCoaching.ts — THE FORMATIVE EXAM's renderer (wave L-7a of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md §4).
 *
 * THE OWNER RULING THIS SERVES (2026-07-27): "the exam should feed into the actual model
 * rather than only be a gate of choosing the model". A tier is a ranking, and a ranking
 * teaches nobody anything. The competency probe already knows far more than the tier it
 * reports: it knows WHICH of the three canonical filing tasks a model failed and WHICH of
 * four reason classes it failed under. Migration 191 persists that texture as the key's
 * probe_profile. This module is the other half: it turns a stored profile into a short
 * block of plain house sentences that can be shown to the model that sat the exam.
 *
 * THE CONFLICTED-WITNESS RULE SURVIVES THE ROUND TRIP. Every sentence this module can
 * emit is a frozen literal in COACHING_TABLE below. Nothing here reads, quotes, or
 * paraphrases a model answer; the only thing a profile contributes is WHICH literals are
 * selected. So the coaching a model receives is the repo's own validators speaking, never
 * a model's account of itself reflected back at it. That is a structural property of the
 * renderer, not a habit of its author: the output is always a subset of this file's
 * literals, whatever a profile contains.
 *
 * INERT BY ABSENCE. A missing profile, a malformed one, or a clean sweep all render the
 * empty string. There is no "you did fine" line, because a block that always appears is a
 * block that stops being read, and because a surface that has nothing to say should say
 * nothing rather than pad. A caller can therefore append the result unconditionally.
 *
 * PURE, TOTAL, BYTE-STABLE. Same profile in, same bytes out, no clock, no environment, no
 * throw on hostile input. Sentence order comes from this file's frozen table rather than
 * from the array it was handed, so two probe runs that found the same faults render
 * identically regardless of task order.
 *
 * TOKEN AND CACHE NOTE. The block is small by construction: one heading plus at most
 * COACHING_MAX_LINES sentences, which measures well under a hundred tokens by
 * _shared/anthropicCache.ts estimateTokens. It rides the END of a surface's static prefix,
 * passed as the `tail` option of sealStaticPrefix so it lands AFTER the stabilizer padding
 * and immediately before the marker, for two reasons. First, the provider cache is already
 * keyed per model, so a block that varies with the model adds no NEW fragmentation axis to
 * what caching already costs. Second, everything ahead of it — the whole generated charter,
 * which is the expensive part, plus whatever filler the floor demanded — stays
 * byte-identical across users, so only the tail differs and the prefix stays diffable by
 * eye. The one real invalidation is a re-probe, which rewrites a user's profile and so their
 * prefix; re-probes are user-initiated and rare, which is the bound.
 *
 * WHY THE `tail` OPTION AND NOT PLAIN CONCATENATION. Padding is appended, so a builder that
 * concatenated this block onto its body put it AHEAD of several thousand characters of
 * "[CACHE-STABILIZER: ignore this block]" filler on every padded surface. See the
 * sealStaticPrefix docblock for the measured distances; the short version is that a model
 * reads the last thing it was told, and the last thing it was told was furniture.
 *
 * WIRED SINCE WAVE L-WIRE. All six compile shells import renderCoachingBlock and hand it the
 * profile that rode out of the same RPC that decrypted the key (ai-analyst/byok.ts), and all
 * five prefix builders accept it. It is still INERT for a managed key, an unprobed key or a
 * clean sweep, which render '' (see INERT BY ABSENCE above).
 */

/** One stored verdict, as migration 191's probe_profile holds it. Typed loosely on the
 *  way in: this module is handed a jsonb blob that crossed a database boundary, and it
 *  validates rather than trusts. */
export interface CoachingProfileTask {
  key?: unknown;
  passed?: unknown;
  reasonClass?: unknown;
}

/** A stored probe profile. See migration 191's header for the shape the setter enforces. */
export interface CoachingProfile {
  tasks?: unknown;
  passes?: unknown;
  tasksRun?: unknown;
}

/** The heading the block opens with. Says where the lines came from, so a model reads
 *  them as recorded findings rather than as a fresh instruction someone made up. */
export const COACHING_HEADER =
  'NOTES FROM THE LAST CAPABILITY CHECK ON THIS MODEL (verdicts from the same validators that will grade this answer):';

/**
 * The most sentences the block will ever carry, so it cannot grow into the prompt if the
 * exam grows. Today's exam has three tasks, so the cap does not bind; it exists because a
 * renderer whose length depends on a future decision is a renderer nobody can budget.
 * With the heading this holds the whole block to between two and six lines.
 */
export const COACHING_MAX_LINES = 5;

/**
 * THE FROZEN SENTENCE TABLE — the complete vocabulary of this module's output.
 *
 * Outer key: the probe task, in the order the exam runs them, which is also the order the
 * block prints them. Inner key: the reason class the validators returned. Each sentence
 * says what happened and then states the rule that would have prevented it, because a
 * finding without its rule is a scolding rather than a teaching.
 *
 * These four reason classes are also spelled in surveyor-byok/probeCore.ts
 * PROBE_REASON_CLASSES and in migration 191's setter. The three spellings are bound
 * together by tests/edgeFunctions/surveyorByok.test.js, so a new class reds rather than
 * rendering nothing.
 *
 * HOUSE VOICE CONSTRAINTS, enforced by the test beside this file: no exclamation marks and
 * no em dashes in any literal, since these strings ride into prompts the copy tiers do not
 * scan and would otherwise drift from the rest of the house.
 */
export const COACHING_TABLE: Readonly<Record<string, Readonly<Record<string, string>>>> = Object.freeze({
  construct: Object.freeze({
    no_output:
      'On the last config task this model returned nothing the config vocabulary could read. A config is a set of named keys, and a request that implies nothing still returns an empty object rather than prose.',
    unsupported_emitted:
      'On the last config task this model set keys the config vocabulary does not name. The listed keys are the whole surface, and an unlisted key is reported as unsupported rather than approximated into a neighbour.',
    dropped_at_wall:
      'On the last config task values fell outside their stated bounds and were discarded. Every key carries a range or a list, and a value outside it is lost rather than clamped, so an omitted key beats an out-of-range guess.',
    below_floor:
      'On the last config task this model set too little for the generator to work from. Set every key the request actually implies, and leave the rest at the engine default.',
  }),
  customContent: Object.freeze({
    no_output:
      'On the last content task this model filed nothing into a bucket, so nothing could be created. Content exists only inside a registered bucket.',
    unsupported_emitted:
      'On the last content task this model used a field the manifest does not carry. The manifest is exhaustive: a bucket has exactly the fields it lists, and an invented field is refused rather than stored.',
    dropped_at_wall:
      'On the last content task an entry was rejected for naming no bucket or omitting its required field. Each entry needs a registered bucket and every field marked required.',
    below_floor:
      'On the last content task this model filed less than the request supported. Each distinct thing the request names is its own entry.',
  }),
  interpret: Object.freeze({
    no_output:
      'On the last interpretation task this model proposed no operations, so the session left no trace. Every change travels as a proposed operation for the Dungeon Master to approve.',
    unsupported_emitted:
      'On the last interpretation task this model emitted an operation type outside the registry. The op families and their types are fixed, and something the vocabulary has no primitive for is left out rather than renamed into the nearest type that exists.',
    dropped_at_wall:
      'On the last interpretation task an operation was discarded for missing its family or its type. Each op needs both, along with the params its type expects.',
    below_floor:
      'On the last interpretation task this model proposed less than the account described. One operation per distinct thing that happened.',
  }),
});

/** The task print order, taken from the table itself so there is no second list to drift. */
const TASK_ORDER: readonly string[] = Object.freeze(Object.keys(COACHING_TABLE));

/**
 * WHICH SURFACE EACH EXAM TASK SPEAKS FOR — the map that makes the header honest.
 *
 * COACHING_HEADER promises "verdicts from the same validators that will grade this answer".
 * Rendered unfiltered, that sentence was false on four of the six shells: a style-overhaul
 * request was shown the model's CONFIG-vocabulary failure, graded by a validator that will
 * never see this answer, and a user reading the prompt would have found the house asserting
 * something untrue about its own machinery. Filtering by surface makes the promise a
 * property of the renderer.
 *
 * Task keys and surface keys happen to coincide today, and this map is written out anyway:
 * they are different vocabularies (a task is a thing the exam asks; a surface is a thing the
 * product ships), and a future exam task that grades two surfaces, or a surface that gains
 * two tasks, must be a change to this table rather than a coincidence quietly ending.
 *
 * THE TWO SURFACES DELIBERATELY ABSENT: styleOverhaul and autonomy have no exam task, so
 * they render nothing. That is the correct output, not a gap to be filled with the nearest
 * available sentence: coaching a style compile with a config-vocabulary finding would be the
 * same unearned inference this whole layer exists to refuse. When the exam grows a task for
 * either, it lands here and they start speaking.
 */
export const COACHING_TASK_SURFACE: Readonly<Record<string, string>> = Object.freeze({
  construct: 'construct',
  customContent: 'customContent',
  interpret: 'interpret',
});

/**
 * The failed (task, reasonClass) pairs a profile actually records, deduplicated by task
 * (first verdict wins) and returned in the table's order. Unknown task keys and unknown
 * reason classes are dropped rather than rendered, which is what makes the output a strict
 * subset of this file's literals no matter what a stored blob contains.
 */
function findingsFrom(profile: CoachingProfile | null | undefined): { task: string; reason: string }[] {
  const tasks = profile && Array.isArray(profile.tasks) ? profile.tasks : [];
  const byTask = new Map<string, string>();
  for (const entry of tasks) {
    const task = entry as CoachingProfileTask | null;
    if (!task || task.passed !== false) continue;
    const key = typeof task.key === 'string' ? task.key : '';
    const reason = typeof task.reasonClass === 'string' ? task.reasonClass : '';
    if (!key || !reason || byTask.has(key)) continue;
    const row = COACHING_TABLE[key];
    if (!row || typeof row[reason] !== 'string') continue;
    byTask.set(key, reason);
  }
  const out: { task: string; reason: string }[] = [];
  for (const task of TASK_ORDER) {
    const reason = byTask.get(task);
    if (reason) out.push({ task, reason });
  }
  return out;
}

/**
 * Render the coaching block for one stored probe profile, FOR ONE SURFACE.
 *
 * Returns the empty string when there is nothing honest to say: no profile, a malformed
 * profile, a run that passed every task, a surface this exam has no task for, or a surface
 * whose task the model passed. Otherwise returns the heading followed by one frozen sentence
 * per failed task BELONGING TO THAT SURFACE, newline separated, with no trailing newline,
 * capped at COACHING_MAX_LINES sentences.
 *
 * `surface` is REQUIRED, and an unrecognised one renders ''. Both choices fail toward
 * silence: a caller that forgets the argument, or names a surface the table does not know,
 * gets no coaching rather than another surface's coaching. Silence is always defensible
 * here; the wrong surface's verdict never is.
 */
export function renderCoachingBlock(
  profile: CoachingProfile | null | undefined,
  surface: string,
): string {
  if (!profile || typeof profile !== 'object') return '';
  const wanted = typeof surface === 'string' ? surface : '';
  if (!wanted) return '';
  const findings = findingsFrom(profile)
    .filter(({ task }) => COACHING_TASK_SURFACE[task] === wanted)
    .slice(0, COACHING_MAX_LINES);
  if (findings.length === 0) return '';
  const lines = findings.map(({ task, reason }) => COACHING_TABLE[task][reason]);
  return [COACHING_HEADER, ...lines].join('\n');
}

/**
 * THE ONE PLACE THE COACHING GATE IS SPELLED — what the six shells call.
 *
 * Two conditions have to hold before a model is shown a finding, and neither is safe to
 * leave to six hand-written copies of the same ternary (the design doc's §2 already names
 * the copy-pasted `capturedModel` expression across ~10 surfaces as a root cause worth
 * extracting; this is that lesson applied before the duplication exists rather than after).
 *
 *   1. THE PROFILE MUST BELONG TO THE MODEL ABOUT TO ANSWER. `probeModel` is the model that
 *      sat the exam; `capturedModel` is the model this request resolved. A user may probe on
 *      one model and later switch their stored preference, so these genuinely diverge. On a
 *      mismatch this renders '' and says nothing at all - a model must never be coached on
 *      another model's failures, which would be an assertion about it that nothing measured,
 *      and is strictly worse than the silence it replaces.
 *   2. THE FINDING MUST BELONG TO THE SURFACE ABOUT TO BE GRADED. See COACHING_TASK_SURFACE.
 *
 * Total and pure: any missing, blank or mismatched input renders ''. Byte-stable for a given
 * (profile, model, model, surface), which is what the quantization law (design §4c.3) needs.
 */
export function renderCoachingFor(args: {
  profile: CoachingProfile | null | undefined;
  probeModel: string | null | undefined;
  capturedModel: string | null | undefined;
  surface: string;
}): string {
  const probed = typeof args?.probeModel === 'string' ? args.probeModel.trim() : '';
  const answering = typeof args?.capturedModel === 'string' ? args.capturedModel.trim() : '';
  // A never-probed key has no probeModel; an unresolved model has no capturedModel. Either
  // way there is no demonstrated evidence about THIS model, so there is nothing to say.
  if (!probed || !answering || probed !== answering) return '';
  return renderCoachingBlock(args.profile, args.surface);
}
