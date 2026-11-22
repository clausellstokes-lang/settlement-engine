/**
 * _shared/surveyorStage.ts — the PER-STAGE KILL-SWITCH edge helper
 * (DESIGN_AI_CONTROL_SURFACE §2b THE LAUNCH-WHOLE AMENDMENT).
 *
 * Launch-whole ships every write stage behind a server-side kill-switch (migration 146:
 * surveyor_stage_switches + surveyor_stage_enabled) so the operator can PAUSE a stage
 * without a deploy. This pure helper is the edge side: it decides FAIL-CLOSED whether a
 * stage may run, and builds the §3d graceful refusal that NAMES the switch when it may
 * not. Shared by interpret-session + parley (and any future write stage), Deno-global-free
 * + remote-import free so the SAME code the edge runs is exercised by the vitest pin.
 */

/** The §3d graceful refusal a paused/unreachable stage returns. */
export interface StageRefusal {
  refused: true;
  /** The stage this refusal is about (named in the message + logged as the refusal class). */
  stage: string;
  message: string;
  /** Machine-readable door hints the client renders (always non-empty — never a dead end). */
  doors: string[];
  /** The aiOperationLog refusal_class receipt. */
  refusalClass: 'stage_disabled';
}

/**
 * FAIL-CLOSED gate: a stage runs ONLY when surveyor_stage_enabled() returned the literal
 * boolean `true`. A disabled stage (false), an errored/absent RPC result (null/undefined),
 * or any non-true value all read as NOT enabled — so an explicit OFF *and* an unreachable
 * switch both stop the stage, never a silent fall-through to serving. Pure + total.
 */
export function isStageEnabled(rpcData: unknown): boolean {
  return rpcData === true;
}

/**
 * §3d THE GRACEFUL REFUSAL CONTRACT for a paused stage: cordial, specific, names the
 * boundary (the stage's own kill-switch) and the nearest door. A paused write stage is a
 * DELIBERATE operator action (or an unreachable switch) — the refusal says so plainly and
 * offers the always-available read-side door (the analyst still reads the same world).
 */
export function killSwitchRefusal(stage: string): StageRefusal {
  const name = typeof stage === 'string' && stage ? stage : 'this feature';
  return {
    refused: true,
    stage: name,
    message: `This Surveyor capability (${name}) is paused right now, so nothing was charged. It will be back shortly — in the meantime you can still ask the analyst, which reads the same world.`,
    doors: ['ask_readonly', 'retry_later'],
    refusalClass: 'stage_disabled',
  };
}
