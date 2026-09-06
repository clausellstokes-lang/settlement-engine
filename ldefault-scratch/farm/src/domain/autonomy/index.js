/**
 * domain/autonomy/index.js — SURVEYOR S7 ADVANCED AUTONOMY barrel
 * (DESIGN_AI_CONTROL_SURFACE §2 stage 7; the MACHINERY-NOW / VOCABULARY-GROWS
 * compromise). Lazy-leaf discipline: consumed only by the lazy Surveyor surfaces and
 * src/lib/surveyorAutonomy.js — never by eager boot modules (the panels' lazy-membership
 * contract keeps this whole graph off first paint).
 */

export {
  PRESSURE_KINDS, PROSPERITY_LADDER, SEASONS,
  signalRegistryEntries, signalById, registerSignal, resetMintedSignalsForTest,
  prepareSignalFrame, resolveSignal,
} from './signalRegistry.js';

export {
  MAX_CONDITION_DEPTH, MAX_CONDITION_TESTS,
  validateStopCondition, evaluateStopCondition, describeStopCondition,
} from './stopConditions.js';

export {
  NUDGE_OP_TYPE, NUDGE_TYPES, MAX_NUDGE_SEVERITY, MIN_NUDGE_SEVERITY,
  validateNudge, buildNudgeOp, describeNudge,
} from './accelerationOps.js';

export {
  STANDING_INSTRUCTIONS_KEY, MAX_INSTRUCTIONS_CHARS,
  normalizeStandingInstructions, nextStandingInstructions, instructionsForCompile,
} from './standingInstructions.js';

export {
  AUTONOMOUS_ADVANCE_CAP_WEEKS, clampAutonomousWeeks,
  autonomousRunReceipt, autonomousRunLogRecord,
} from './autonomousRun.js';
