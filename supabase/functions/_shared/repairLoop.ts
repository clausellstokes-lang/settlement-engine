/**
 * _shared/repairLoop.ts - THE FORMATIVE LOOP (wave L-6 of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md).
 *
 * WHAT CHANGED, AND ON WHOSE ORDER. Until this wave every Surveyor surface treated a
 * failed validation as terminal: the deterministic wall dropped the bad entry into
 * `unsupported[]` (or `musings[]`) and the human read the wreckage. The design doc listed
 * a repair loop under NON-GOALS. The owner overturned that on 2026-07-27 with a one-line
 * standing: the tests become part of the process for the AI rather than a barrier. This
 * module is that sentence, made mechanical: the validator's verdict is fed BACK to the
 * model as typed, machine-generated feedback, and the model gets a bounded number of
 * chances to re-emit only the entries the validator rejected.
 *
 * THE CONFLICTED-WITNESS RULE STILL HOLDS, AND THIS MODULE IS BUILT AROUND IT
 * (docs/DESIGN_AI_CONTROL_SURFACE.md:280-284). A model never grades itself here. Every
 * violation this loop shows the model is produced by the same deterministic validator
 * that will judge the repair, and every entry that survives a round survived BECAUSE the
 * validator accepted it, never because the model asserted it had fixed something. The
 * model's own commentary about its output - a confidence tag, a rider, a musing, a claim
 * that a value is fine - is not read by any decision in this file. The loop's three
 * decisions (repair again / accept the merge / stop) are functions of the validator's
 * output and the round counter alone. A "repair" that fixes nothing is simply a round
 * spent; it can never talk its way past the wall.
 *
 * WHERE IT SITS IN THE MONEY PATH. Entirely INSIDE one `runCreditedCall` window
 * (ai-analyst/creditFlow.ts), within the `callModel` effect. The seven credit invariants
 * are untouched by construction: this module never sees a reservation, a spend id, a
 * refund, a rate limit or a meter, and the surface still makes exactly ONE credited call
 * no matter how many provider round-trips happen inside it. Repair rounds cost provider
 * tokens, not credits, and those tokens are summed into the SAME per-call
 * `ai_usage_events` row the surface already writes (see RepairUsage below).
 *
 * WHERE IT SITS IN THE CACHE. A repair re-call reuses the sealed static prefix verbatim:
 * the repair prompt is `basePrompt + tail`, and `splitForAnthropic` breaks on the FIRST
 * cache marker, which is the one `sealStaticPrefix` put at the end of the static prefix.
 * So the charter and the vocabulary are cache-READ on every repair round; only the tail
 * is new input. That is what makes a repair round cheap enough to be worth having.
 *
 * INERT AS SHIPPED. `REPAIR_ROUNDS_BY_TIER` is all zeros. With maxRounds 0 the loop
 * performs exactly one model call, parses, validates, and returns - the same statements
 * in the same order as the pre-wave code path. Activation is an owner switch, not a code
 * change (see the constant's own note).
 *
 * Pure of platform: no Deno globals, no network, no remote imports, no clock of its own
 * (the caller may inject one), no rng. Imported by BOTH the edge shells and the pins.
 */

import { estimateTokens, stripCacheMarker } from './anthropicCache.ts';
import type { LadderTier, TierClass } from '../ai-analyst/modelResolver.ts';
import { TIER_BY_CLASS } from '../ai-analyst/modelResolver.ts';

// ── the vocabulary of a verdict ──────────────────────────────────────────────

/**
 * One rejection, as the VALIDATOR spelled it. `code` is the validator's own reason code,
 * carried verbatim (`invalid_value`, `unregistered_bucket`, `no_primitive`, `wrong_family`,
 * `unregistered_signal`, `out_of_bounds`, and their siblings). The loop never invents a
 * code, never translates one into prose, and never lets a model-supplied string become one.
 */
export interface RepairViolation {
  /** The validator's reason code, verbatim. */
  code: string;
  /** What was rejected: a bucket, a field, a config key, an op type, a signal id. */
  subject: string;
  /** An optional locator, when the validator can name where the subject sat. */
  where?: string;
}

/** What a single provider round-trip gives back. */
export interface RepairDraft {
  answerText: string;
  /**
   * Stop the loop immediately and return without parsing. The surfaces set this on a
   * provider REFUSAL (`stop_reason === 'refusal'`), which is not a validation failure and
   * must not be re-prompted: the model declined, and asking again is both rude and paid.
   */
  halt?: boolean;
  /** Provider-reported usage for THIS round, if the response carried any. */
  usage?: { input?: number | null; output?: number | null } | null;
}

/**
 * The per-call token ledger, accumulated ACROSS rounds. The caller owns the object and
 * reads it after the loop returns OR after the loop throws, which is why it is passed in
 * rather than only returned: a provider error on round 2 must not erase round 1's tokens
 * from the COGS row the surface is about to write.
 *
 * `inputTokens` / `outputTokens` stay null until some round actually reports usage; a
 * reporting round adds into them. `promptEstTokens` / `answerEstTokens` are the chars/4
 * SIZING fallback, summed the same way, for surfaces whose provider reported nothing.
 */
export interface RepairUsage {
  inputTokens: number | null;
  outputTokens: number | null;
  promptEstTokens: number;
  answerEstTokens: number;
  /** Provider round-trips performed, including the initial draft. */
  calls: number;
}

/** A fresh, zeroed ledger. */
export function newRepairUsage(): RepairUsage {
  return { inputTokens: null, outputTokens: null, promptEstTokens: 0, answerEstTokens: 0, calls: 0 };
}

// ── the tier dial (INERT) ────────────────────────────────────────────────────

/**
 * The L-3a resolver reports a `tierClass`; the ladder speaks in rungs. One small literal
 * map, in one place, so the two vocabularies cannot drift apart in six shells.
 *
 * WAVE L-WIRE moved the declaration UP to ai-analyst/modelResolver.ts and re-exports it
 * here. The map gained a second consumer (the thinking dial), and the resolver is where the
 * ladder's vocabulary belongs; re-exporting rather than relocating keeps every existing
 * importer and every existing pin working unchanged.
 */
export type { LadderTier };
export { TIER_BY_CLASS };

/**
 * HOW MANY REPAIR ROUNDS EACH RUNG MAY SPEND. ALL ZEROS ON PURPOSE.
 *
 * Shipping this at zero makes the whole wave inert: every surface performs exactly one
 * provider call, gets exactly the answer it would have got before L-6, and writes exactly
 * the same rows. The machinery is present, gated, and proven by executed pins, and the
 * behaviour change is a separate, deliberate act.
 *
 * ACTIVATION (owner switch, M5-adjacent - batch it with the tier-pricing activation in
 * migration 192, because a repair round is provider spend and the two decisions are the
 * same decision): the INTENDED shape is
 *
 *     { scout: 0, journeyman: 1, master: 2 }
 *
 * The shape is deliberate rather than uniform. A scout-class model that failed the wall
 * once tends to fail it the same way twice, so paying for its second try is the worst
 * value on the ladder; a master-class model given the typed verdict usually lands the
 * correction, which is exactly the ceiling difference the no-flattening directive asks us
 * to let models have. Flipping these numbers changes what users are charged in provider
 * tokens per call, which is why it is owner-gated and not a tuning knob.
 */
export const REPAIR_ROUNDS_BY_TIER: Readonly<Record<LadderTier, number>> = Object.freeze({
  scout: 0,
  journeyman: 0,
  master: 0,
});

/**
 * Rounds allowed for a resolved tier class. A NULL class (a model id the registry mirror
 * does not carry, which a `Deno.env.get(...) || literal` default can genuinely produce)
 * gets ZERO rounds: an unclassified model has not earned a ceiling, and inventing one is
 * the flattening the ladder exists to prevent.
 */
export function repairRoundsForTierClass(tierClass: TierClass | null | undefined): number {
  if (!tierClass) return 0;
  const tier = TIER_BY_CLASS[tierClass];
  if (!tier) return 0;
  return REPAIR_ROUNDS_BY_TIER[tier] ?? 0;
}

// ── the repair prompt ────────────────────────────────────────────────────────

/** The loop's OWN fence around the prior answer. Deliberately distinct from every core's
 *  fence tokens, so a core fence echoed inside a model answer cannot close this block. */
export const PRIOR_ANSWER_OPEN = '<<<PRIOR_ANSWER>>>';
export const PRIOR_ANSWER_CLOSE = '<<<END_PRIOR_ANSWER>>>';

/** How many violations a repair tail may carry. A wall-scale failure (a model that
 *  answered in the wrong shape entirely) must not turn the tail into a second prompt. */
export const MAX_VIOLATIONS_IN_TAIL = 24;

/** Strip this module's fence tokens AND the cache marker out of text that came from a
 *  model, to a fixpoint. Keeps "one marker, at the end of the sealed prefix" true for the
 *  repair prompt, and keeps the prior-answer block closable only by the loop. */
export function sanitizePriorAnswer(text: string): string {
  let out = stripCacheMarker(String(text ?? ''));
  let prev: string;
  do {
    prev = out;
    out = stripCacheMarker(out)
      .split(PRIOR_ANSWER_OPEN).join('')
      .split(PRIOR_ANSWER_CLOSE).join('');
  } while (out !== prev);
  return out;
}

/** Render the typed feedback block. The codes are the validator's, verbatim. */
export function renderViolationBlock(violations: readonly RepairViolation[]): string {
  return violations
    .slice(0, MAX_VIOLATIONS_IN_TAIL)
    .map((v) => `  - ${v.code}: ${v.subject}${v.where ? ` (in ${v.where})` : ''}`)
    .join('\n');
}

export interface RepairPromptArgs {
  basePrompt: string;
  previousAnswerText: string;
  violations: readonly RepairViolation[];
  round: number;
  maxRounds: number;
}

/**
 * The default repair tail. Appended to the UNCHANGED base prompt, so the sealed static
 * prefix (charter, vocabulary, output contract) is byte-identical and cache-read.
 *
 * The wording is deliberate on three points. It names the verdict as the SERVER's and
 * deterministic, so the model does not argue with it. It asks for corrected entries ONLY,
 * so the merge has something small to work with and the round is cheap. And it explicitly
 * blesses `unsupported` as the correct answer when a request has no representation in the
 * vocabulary, so a bounded loop cannot pressure a model into inventing a primitive - the
 * exact failure the schema wall exists to prevent.
 */
export function renderRepairPrompt(args: RepairPromptArgs): string {
  const prior = sanitizePriorAnswer(args.previousAnswerText).slice(0, 12000);
  return `${args.basePrompt}

REPAIR PASS ${args.round} of ${args.maxRounds}. Your previous answer was checked by the server's deterministic validator before you saw this. Part of it was accepted. The rest is listed below with the validator's own reason codes.
${PRIOR_ANSWER_OPEN}
${prior || '(empty answer)'}
${PRIOR_ANSWER_CLOSE}

THE VALIDATOR REJECTED:
${renderViolationBlock(args.violations) || '  - (none)'}

These codes are the server's verdict, not an opinion, and the same validator will check your next answer. Re-emit ONLY corrected versions of the rejected items, in the SAME JSON contract as before. Do not repeat the parts that were accepted. Do not explain or dispute a code. If an item genuinely has no representation in the vocabulary, leave it in "unsupported" with its reason and move on: an honest "unsupported" is a correct answer, and an invented value is not.`;
}

// ── a shared merge primitive ─────────────────────────────────────────────────

/**
 * Union two lists of text-bearing items (musings, and anything else shaped like them),
 * keeping the earlier list's order and dropping exact-duplicate text. Surface-agnostic on
 * purpose: every core needs the same rule for the conversational register across rounds,
 * and one implementation is one place for that rule to live.
 */
export function mergeByText<T extends { text: string }>(
  previous: readonly T[] | null | undefined,
  repaired: readonly T[] | null | undefined,
): T[] {
  const out: T[] = [...(previous || [])];
  const seen = new Set(out.map((item) => String(item?.text ?? '')));
  for (const item of repaired || []) {
    const text = String(item?.text ?? '');
    if (seen.has(text)) continue;
    seen.add(text);
    out.push(item);
  }
  return out;
}

// ── the loop ─────────────────────────────────────────────────────────────────

export interface RepairLoopOptions<TParsed> {
  /** The full prompt for the initial draft, sealed prefix and per-request tail included. */
  basePrompt: string;
  /**
   * One provider round-trip. Receives the prompt for this round, the round number (0 for
   * the initial draft) and an AbortSignal the loop aborts when the round's budget or the
   * overall deadline runs out. A callback that already carries its own per-call timeout
   * may ignore the signal; a callback that does not MUST honour it, or the loop's
   * boundedness is only a round COUNT.
   */
  callModel: (args: { prompt: string; round: number; signal: AbortSignal }) => Promise<RepairDraft>;
  /** Answer text to the surface's parsed-and-validated shape (its existing compile fn). */
  parse: (answerText: string) => TParsed;
  /** The verdict. Must be a pure function of the parsed value. */
  validate: (parsed: TParsed) => readonly RepairViolation[];
  /** Fold a repaired parse into the accepted one. See MERGE SAFETY in runWithRepair. */
  merge: (args: { accepted: TParsed; repaired: TParsed; addressed: readonly RepairViolation[] }) => TParsed;
  /** Override the repair tail. Defaults to renderRepairPrompt above. */
  renderPrompt?: (args: RepairPromptArgs) => string;
  /** Repair rounds allowed BEYOND the initial draft. 0 means the loop is inert. */
  maxRounds?: number;
  /** Per-round wall-clock budget in ms. Omitted means the round has no timer of its own. */
  roundTimeoutMs?: number;
  /** Absolute epoch-ms budget for the whole loop. Never shortens the initial draft. */
  deadline?: number | null;
  /** Injected clock, for pins. Defaults to Date.now. */
  now?: () => number;
  /** Caller-owned token ledger, so a mid-loop throw still leaves earlier rounds counted. */
  usage?: RepairUsage;
}

export interface RepairLoopResult<TParsed> {
  /** The model answer backing `parsed`: the last one whose merge the validator accepted. */
  answerText: string;
  /** Absent only when the loop halted before parsing (a provider refusal). */
  parsed?: TParsed;
  halted: boolean;
  /** Repair rounds actually spent (never counts the initial draft). */
  roundsUsed: number;
  /** The verdict on the FIRST draft: what the human would have been shown pre-L-6. */
  violationsInitial: RepairViolation[];
  /** What is still rejected after the loop gave up. These degrade exactly as before. */
  violationsFinal: RepairViolation[];
  usage: RepairUsage;
}

/** A stable identity for a violation, so two verdicts can be compared as sets. */
function violationKey(v: RepairViolation): string {
  return `${v.code} ${v.subject} ${v.where ?? ''}`;
}

/** Coerce a validator's output to the wire shape. Total: garbage yields an empty verdict. */
function normalizeViolations(raw: readonly RepairViolation[] | null | undefined): RepairViolation[] {
  const out: RepairViolation[] = [];
  const seen = new Set<string>();
  for (const item of Array.isArray(raw) ? raw : []) {
    if (!item || typeof item !== 'object') continue;
    const code = String(item.code ?? '').trim().slice(0, 64);
    const subject = String(item.subject ?? '').trim().slice(0, 120);
    if (!code || !subject) continue;
    const where = item.where == null ? undefined : String(item.where).trim().slice(0, 120) || undefined;
    const v: RepairViolation = where ? { code, subject, where } : { code, subject };
    const key = violationKey(v);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

/**
 * Run the draft-verdict-repair-merge-degrade loop.
 *
 * THE SHAPE, in one paragraph. Call the model once with `basePrompt`. Parse. Validate.
 * While the verdict is non-empty AND rounds remain AND the deadline allows: render the
 * verdict as a typed feedback block, re-call the SAME model with the SAME sealed prefix
 * plus a repair tail, parse and validate the reply, merge it into the accepted state, and
 * re-validate the merge. Whatever is still rejected when the loop stops is returned as
 * `violationsFinal` and degrades exactly as it did before this wave: into the surface's
 * own `unsupported[]`, shown to the human.
 *
 * MERGE SAFETY. The loop re-validates the MERGED value and compares its verdict against
 * the union of the verdicts on the two inputs. A merge whose result carries a violation
 * that neither input carried has fabricated something, so the merge is DISCARDED whole
 * and the loop stops on the last state the validator accepted. The invariant this buys is
 * that nothing reaches the human which the validator did not accept.
 *
 * WHAT MERGE SAFETY DOES NOT BUY, AND WHERE THAT LIVES INSTEAD. This check alone does NOT
 * bound the size of the rejected set. Its allow-list is the UNION of both inputs' verdicts,
 * so a repair draft's own rejects are always "allowed" - and a merge that appended them to
 * the original's would sail through while handing the human a LONGER list of rejects than
 * the first draft produced. This docblock previously claimed "a repair round can only ever
 * shrink the rejected set or waste money"; that was false, and it was false in the direction
 * that costs a user something for a retry they never asked for.
 *
 * The bound is now enforced where it belongs, at the MERGE layer, by every core:
 *
 *     |violationsFinal| <= |violationsInitial|, and every subject in violationsFinal
 *     appears in violationsInitial.
 *
 * Each core sources its merged unsupported ledger from the ACCEPTED state alone, keyed by
 * subject, keeping the ORIGINAL verdict for a subject still rejected and dropping a subject
 * the repair genuinely fixed. Style-overhaul spells the same rule as an intersection,
 * matching its re-emit shape. Pinned per surface, over the real validators and merges, in
 * repairLoop.test.ts section H, with the hostile-repair fixtures that used to grow it.
 * MERGE SAFETY stays as the outer backstop: it now can never fire on the shipped merges
 * (their output is a subset of an input's verdict), and that is the point of a backstop.
 *
 * BOUNDED THREE WAYS. `maxRounds` caps the round count. Each round gets its own
 * AbortController, armed with `roundTimeoutMs` (and, for repair rounds, with whatever the
 * deadline leaves, whichever is smaller). The deadline is re-checked before every repair
 * round. The INITIAL draft is unconditional and is never shortened by the deadline: the
 * credited call has already spent the user's credit by the time this runs, so declining to
 * make the call would charge for nothing.
 */
export async function runWithRepair<TParsed>(
  options: RepairLoopOptions<TParsed>,
): Promise<RepairLoopResult<TParsed>> {
  const now = options.now ?? (() => Date.now());
  const usage = options.usage ?? newRepairUsage();
  const rawMax = Number(options.maxRounds ?? 0);
  const maxRounds = Number.isFinite(rawMax) && rawMax > 0 ? Math.floor(rawMax) : 0;
  const render = options.renderPrompt ?? renderRepairPrompt;
  const roundTimeoutMs = Number.isFinite(Number(options.roundTimeoutMs)) && Number(options.roundTimeoutMs) > 0
    ? Number(options.roundTimeoutMs)
    : null;

  const remainingMs = (): number | null => (
    options.deadline == null ? null : options.deadline - now()
  );

  const oneRound = async (prompt: string, round: number): Promise<RepairDraft> => {
    // The initial draft (round 0) uses its own budget verbatim; a repair round may only
    // use what the overall deadline still allows.
    const left = round === 0 ? null : remainingMs();
    const budget = roundTimeoutMs == null
      ? left
      : (left == null ? roundTimeoutMs : Math.min(roundTimeoutMs, left));
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (budget != null && budget > 0) timer = setTimeout(() => controller.abort(), budget);
    usage.calls += 1;
    usage.promptEstTokens += estimateTokens(prompt);
    try {
      const draft = await options.callModel({ prompt, round, signal: controller.signal });
      const answerText = String(draft?.answerText ?? '');
      usage.answerEstTokens += estimateTokens(answerText);
      const reportedIn = typeof draft?.usage?.input === 'number' ? draft.usage.input : null;
      const reportedOut = typeof draft?.usage?.output === 'number' ? draft.usage.output : null;
      if (reportedIn != null) usage.inputTokens = (usage.inputTokens ?? 0) + reportedIn;
      if (reportedOut != null) usage.outputTokens = (usage.outputTokens ?? 0) + reportedOut;
      return { answerText, halt: draft?.halt === true };
    } finally {
      if (timer != null) clearTimeout(timer);
    }
  };

  const first = await oneRound(options.basePrompt, 0);
  if (first.halt) {
    return {
      answerText: first.answerText,
      halted: true,
      roundsUsed: 0,
      violationsInitial: [],
      violationsFinal: [],
      usage,
    };
  }

  let answerText = first.answerText;
  let accepted = options.parse(answerText);
  let violations = normalizeViolations(options.validate(accepted));
  const violationsInitial = violations;
  let roundsUsed = 0;

  while (violations.length > 0 && roundsUsed < maxRounds) {
    const left = remainingMs();
    if (left != null && left <= 0) break;

    const prompt = render({
      basePrompt: options.basePrompt,
      previousAnswerText: answerText,
      violations,
      round: roundsUsed + 1,
      maxRounds,
    });
    const next = await oneRound(prompt, roundsUsed + 1);
    roundsUsed += 1;
    if (next.halt) break;

    const repaired = options.parse(next.answerText);
    const repairedViolations = normalizeViolations(options.validate(repaired));
    const merged = options.merge({ accepted, repaired, addressed: violations });
    const mergedViolations = normalizeViolations(options.validate(merged));

    // MERGE SAFETY: a violation in the merge that neither input carried means the merge
    // manufactured content. Discard the whole merge and stop on the last accepted state.
    const allowed = new Set([...violations, ...repairedViolations].map(violationKey));
    if (mergedViolations.some((v) => !allowed.has(violationKey(v)))) break;

    accepted = merged;
    answerText = next.answerText;
    violations = mergedViolations;
  }

  return {
    answerText,
    parsed: accepted,
    halted: false,
    roundsUsed,
    violationsInitial,
    violationsFinal: violations,
    usage,
  };
}
