// data/securityQuestions.js — the fixed security-question contract.
//
// Two of these are chosen at sign-up (email/password accounts only; OAuth users
// are exempt). The answers are hashed server-side with pgcrypto bcrypt and never
// reach the client; only the stable `id` is stored alongside the hash. The free
// text below is display-only and may be reworded over time WITHOUT a migration —
// the `id` is the contract the database validates against.
//
// CONTRACT (do not break without a coordinated DB migration):
//   - Every id here MUST appear in the allowed-id set the recovery RPCs validate
//     against (supabase/migrations/066_security_questions_and_recovery.sql →
//     public.is_allowed_security_question_id). A test pins this two-way match.
//   - ids are STABLE and append-only. Never reuse or repurpose an id; retiring a
//     question means dropping it from this list but leaving the id allowed so
//     existing rows still verify.
//   - ids are short, lowercase, snake_case, <= 40 chars.
//
// Voice: calm, concrete, factual — questions a person answers the same way years
// later, with no leading drama. Avoid anything a data breach elsewhere would
// already expose (no "mother's maiden name").

/** @typedef {{ id: string, text: string }} SecurityQuestion */

/** @type {SecurityQuestion[]} */
export const SECURITY_QUESTIONS = [
  { id: 'first_street',       text: 'What was the name of the first street you lived on?' },
  { id: 'childhood_friend',   text: 'What was the first name of your oldest childhood friend?' },
  { id: 'first_pet',          text: 'What was the name of your first pet?' },
  { id: 'first_school',       text: 'What was the name of your first school?' },
  { id: 'birth_city',         text: 'In what city were you born?' },
  { id: 'first_concert',      text: 'What was the first concert or live show you attended?' },
  { id: 'favorite_teacher',   text: "What was the last name of your favourite teacher?" },
  { id: 'first_car',          text: 'What was the make of your first car?' },
  { id: 'childhood_nickname', text: 'What was your childhood nickname?' },
  { id: 'first_employer',     text: 'What was the name of your first employer?' },
];

/** Stable id set, for client-side validation (mirrors the DB allow-list). */
export const SECURITY_QUESTION_IDS = SECURITY_QUESTIONS.map((q) => q.id);

/**
 * Look up the display text for a stored question id (e.g. to render which
 * questions an account has set). Returns null for an unknown id.
 * @param {string} id
 * @returns {string|null}
 */
export function securityQuestionText(id) {
  const found = SECURITY_QUESTIONS.find((q) => q.id === id);
  return found ? found.text : null;
}

/**
 * True when `id` is one of the contract's stable ids.
 * @param {string} id
 * @returns {boolean}
 */
export function isAllowedSecurityQuestionId(id) {
  return SECURITY_QUESTION_IDS.includes(id);
}
