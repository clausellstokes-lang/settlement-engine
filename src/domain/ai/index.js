/**
 * domain/ai/index.js — the CLIENT-facing analyst retrieval surface (S1).
 *
 * The client builds the audience-appropriate retrieval bundle here (selectSlices) and
 * POSTs it to the ai-analyst edge function, which grounds the provider on it and
 * enforces the citation law. The enforcement core (claim validation, prompt, hashing,
 * the aiOperationLog shape) lives with the edge function
 * (supabase/functions/ai-analyst/analystCore.ts) so the server is the trust boundary.
 */

export {
  selectSlices,
  resolveAudience,
  isPlayerFramed,
} from './stateSlicers.js';
