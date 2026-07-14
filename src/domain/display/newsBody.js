/**
 * domain/display/newsBody.js — THE WIZARD-NEWS CARD-BODY SIDECAR (content-immersion-5).
 *
 * A pure DISPLAY read-model, cut from the same cloth as newsVoice.js. The stored
 * wizardNews `summary` is composed engine-side as a system-log line:
 *   "Applied via trade dependency around Grain after guild collapse: …"
 * and the scoring `reasons` are analytic receipt pills ("critical regional
 * channel", "chain propagation"). Rendered beneath a diegetic headline and an
 * in-world crier quote, the card carries three registers at war.
 *
 * This module RE-COMPOSES the card body from the entry's persisted STRUCTURED
 * fields — the lifecycle transition (entry.kind), scope, and severity — into one
 * short in-world sentence, and recasts the terse scoring reasons into the fiction
 * register. The headline already names the subject, so the body speaks the beat
 * ("It is being felt across the region now.") without restating it. Prose reasons
 * (world-pulse sentences) pass through unchanged.
 *
 * BYTE-INERT to the engine: imported ONLY by the lazy WizardNewsPanel, never by
 * generation or the world-pulse kernel; never mutates an entry; no rng, no Date.
 */

/** @param {unknown} v @returns {number} */
function clamp01(v) {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : 0;
  return Math.max(0, Math.min(1, n));
}

/** @type {Readonly<Record<string, string>>} */
const SCOPE_PHRASE = Object.freeze({
  settlement: 'in the town',
  regional: 'across the region',
  realm: 'across the realm',
});

/** @param {string | null | undefined} scope */
function scopePhrase(scope) {
  return SCOPE_PHRASE[String(scope || '')] || 'across the region';
}

/**
 * The in-world card body for a wizardNews entry — the lifecycle beat spoken in
 * the house voice. The subject rides in the headline; this sentence carries the
 * transition (and, for an impact, its reach and weight). Total: any
 * unknown/missing transition falls back to a neutral in-world line.
 * @param {{ kind?: string|null, scope?: string|null, severity?: number|null }|null|undefined} entry
 * @returns {string}
 */
export function newsBodyText(entry) {
  if (!entry) return '';
  const kind = entry.kind || '';
  const scope = scopePhrase(entry.scope);
  const heavy = clamp01(entry.severity) >= 0.75;
  switch (kind) {
    case 'queued':
      return 'Word of it is only now reaching the roads.';
    case 'ready':
      return 'It hangs on the brink and may break at any hour.';
    case 'applied':
      return heavy ? `It is being felt hard ${scope} now.` : `It is being felt ${scope} now.`;
    case 'resolved':
      return 'It has, for the present, run its course.';
    case 'ignored':
      return 'In the end it came to nothing.';
    case 'expired':
      return 'It passed before it could take hold.';
    default:
      return `Word of it moves ${scope}.`;
  }
}

/**
 * The terse scoring-receipt reasons recast into the fiction register (the
 * treatment simulationProfile.js uses for receipt headlines). Keyed
 * case-insensitively; a reason already written as prose (world-pulse sentences)
 * passes through unchanged; duplicates collapse; order is preserved.
 * @type {Readonly<Record<string, string>>}
 */
const REASON_PHRASES = Object.freeze({
  'high severity': 'a heavy blow',
  'meaningful severity': 'a real blow',
  'critical impact type': 'a matter that cuts deep',
  'critical regional channel': 'carried along a vital road',
  'chain propagation': 'spreading from town to town',
  'multi-settlement scope': 'reaching across the country',
  'critical goods involved': 'touching goods the country cannot do without',
  'important goods involved': 'touching goods that matter',
  'effect took hold': 'the effect has taken hold',
  'delayed effect matured': 'the long wait is over',
  'major pressure resolved': 'a great pressure lifted',
  'threat window closed': 'the danger has passed',
  'routine regional update': 'a quiet matter',
});

/**
 * Fiction-register reason phrases for a wizardNews entry's scoring reasons.
 * @param {{ reasons?: Array<string|null|undefined> }|null|undefined} entry
 * @returns {string[]}
 */
export function newsReasonPhrases(entry) {
  const reasons = Array.isArray(entry?.reasons) ? entry.reasons : [];
  /** @type {string[]} */
  const out = [];
  const seen = new Set();
  for (const raw of reasons) {
    const key = String(raw || '').trim();
    if (!key) continue;
    const phrase = REASON_PHRASES[key.toLowerCase()] || key;
    if (seen.has(phrase)) continue;
    seen.add(phrase);
    out.push(phrase);
  }
  return out;
}
