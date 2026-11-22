/**
 * domain/coherence/magicWordsFindings.js — does the rendered dossier describe magic the
 * way the settlement's one magic answer says? (lane MAGIC, 2026-11-03; fix shape C of
 * docs/GENERATION_ROOT_CAUSES_2026-11-02.md: "no magic words in historical mode", and "fails
 * when two tabs answer the magic questions differently").
 *
 * A STANDALONE check: it takes the settlement and the text a DM reads (any concatenation of
 * rendered tabs) and returns findings. It is not yet wired into the certification receipt;
 * the chair wires it there.
 *
 * Two findings:
 *   MAGIC-GRADE-WHERE-MAGIC-FAILS   magic does not work here (`magicWorksAt`), yet the text
 *                                   carries a magic grade row: "Magical Capability",
 *                                   "Magical stability", "Reliance on magic", or a role line.
 *   MAGIC-INTEGRAL-UNEARNED         the text calls magic "integral", but the one reliance
 *                                   reading is not integral (no practitioner and dependent).
 *
 * The labels below are the dossier's OWN row labels (the rows this check guards), not a
 * vocabulary for deciding who practises magic.
 *
 * Pure; never throws.
 */
import { magicWorksAt } from '../worldPulse/magicWorksAt.js';
import { deriveMagicReliance } from '../magicReliance.js';

/** The dossier row labels that grade or describe magic. */
const MAGIC_GRADE_LABEL = /Magical Capability|Magical stability|Reliance on magic|(?:Economic|Military|Medical|Infrastructure) role: /;

/** @typedef {{ code: string, message: string, excerpt: string }} MagicWordsFinding */

/**
 * @param {string} text @param {number} index @returns {string}
 */
function excerptAt(text, index) {
  return text.slice(Math.max(0, index - 20), index + 60).replace(/\s+/g, ' ').trim();
}

/**
 * @param {unknown} settlement
 * @param {unknown} renderedText
 * @returns {MagicWordsFinding[]}
 */
export function magicWordsFindings(settlement, renderedText) {
  const text = typeof renderedText === 'string' ? renderedText : '';
  if (!settlement || !text) return [];
  /** @type {MagicWordsFinding[]} */
  const findings = [];
  if (!magicWorksAt({ settlement })) {
    const hit = MAGIC_GRADE_LABEL.exec(text);
    if (hit) {
      findings.push({
        code: 'MAGIC-GRADE-WHERE-MAGIC-FAILS',
        message: `Magic does not work here, yet the page grades it ("${hit[0].trim()}").`,
        excerpt: excerptAt(text, hit.index),
      });
    }
    return findings;
  }
  const integral = /\bintegral\b/i.exec(text);
  if (integral && deriveMagicReliance(/** @type {import('../magicReliance.js').MagicRelianceSource} */ (/** @type {unknown} */ (settlement))).reading !== 'integral') {
    findings.push({
      code: 'MAGIC-INTEGRAL-UNEARNED',
      message: 'The page calls magic integral, but the settlement has no practitioner and dependent to make it so.',
      excerpt: excerptAt(text, integral.index),
    });
  }
  return findings;
}
