/**
 * domain/simulationSpine.js — Compact causal summary of a settlement.
 *
 * Tier 2.5 of the roadmap. The spine answers seven structured questions
 * about a settlement in single-line answers derived from existing
 * simulation fields. No new generator work needed; this is read-only
 * over current settlement state.
 *
 *   Why it is here…                   (settlementReason / history)
 *   It survives by…                   (economy + resources)
 *   It is ruled by…                   (governance / dominant faction)
 *   Its real power lies with…         (faction power vs. legitimacy)
 *   It is currently strained by…      (stressors / volatility)
 *   Its people fear…                  (stressor fears / threats)
 *   Its likely future is…             (tensions trajectory)
 *
 * ── THE MOLD (read this before touching a deriver) ────────────────────────
 *
 * Every rung has exactly ONE authored form: a COMPLEMENT. A complement is the
 * phrase that completes its frame — lowercase-initial, no terminal
 * punctuation, grammatical the instant the frame word is prepended. The frame
 * word itself lives in `SPINE_RUNGS` and NOWHERE else, which is what makes the
 * defect this file was rebuilt to retire structurally impossible:
 *
 *   BEFORE  deriveStrainedBy returned the whole sentence "Strained by X.",
 *           and the rail printed its own label above it, so first-run users
 *           read: "It is currently strained by / Strained by under Siege,
 *           infiltrated." The frame word was authored twice, in two places
 *           that could never agree, and the title-case catalog label was
 *           mangled by lowercasing only its first character.
 *   AFTER   deriveStrainedBy returns "an active siege and quiet penetration
 *           by an outside interest". The frame is prepended by exactly one
 *           writer. Doubling cannot occur because the deriver has no frame.
 *
 * Two projections are built from that single form, so the two consumers can
 * never drift apart:
 *
 *   simulationSpineRows()  → [frame, complement + '.']   (the rail: frame is
 *                            the <dt>, complement the <dd>)
 *   deriveSimulationSpine()→ frame + ' ' + complement + '.'  (a standalone
 *                            sentence, for AI grounding and causal views)
 *
 * One rung is a STATEMENT rather than a complement. `existsBecause` answers
 * with authored founding prose that is already a whole sentence; no mechanical
 * transform turns an arbitrary authored sentence into a "because" clause. Its
 * frame is therefore a HEADING ("Why it is here"), and both projections print
 * the sentence unprefixed.
 *
 * ── THE SPLICE GUARD ──────────────────────────────────────────────────────
 *
 * Several source fields LOOK like phrases and are actually narrative bodies:
 * `powerStructure.recentConflict` is a governance vignette of two or three
 * sentences, `currentTensions[].description` is a full sentence, stressor
 * `summary` is a paragraph. Splicing one into a noun slot is what produced
 * "People fear a return of the settlement is under active siege. Every
 * resource decision is a military decision. ….." on the live site.
 *
 * `nounPhrase()` is the single chokepoint that refuses them. EVERY noun slot
 * in this file draws its candidate through it, so the class is closed at the
 * mold rather than patched per rung. A refused candidate does not degrade the
 * sentence — the arm simply declines and the next arm answers.
 *
 * Tolerant of missing fields: every line falls back to a sensible
 * placeholder if the source data isn't present. A settlement loaded
 * from before this feature existed still produces a usable spine.
 *
 * Pure function — no I/O, no state, no React. Safe to call from
 * anywhere.
 */

import { STRESSOR_SPINE_PHRASES } from '../data/stressorSpinePhrases.js';
import { governingFactionOf, nameOf } from './rulingPower.js';

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} SimulationSpine
 * @property {string} existsBecause
 * @property {string} survivesBy
 * @property {string} ruledBy
 * @property {string|null} realPower
 * @property {string} strainedBy
 * @property {string} peopleFear
 * @property {string} likelyFuture
 */

/**
 * The ONE place a rung's frame word is written.
 *
 * `mode` is 'clause' when the deriver returns a complement the frame
 * completes, and 'statement' when the deriver returns a whole authored
 * sentence and the frame is only a heading over it.
 *
 * @type {ReadonlyArray<{ key: keyof SimulationSpine, frame: string, mode: 'clause' | 'statement' }>}
 */
export const SPINE_RUNGS = Object.freeze([
  { key: 'existsBecause', frame: 'Why it is here',              mode: 'statement' },
  { key: 'survivesBy',    frame: 'It survives by',              mode: 'clause'    },
  { key: 'ruledBy',       frame: 'It is ruled by',              mode: 'clause'    },
  { key: 'realPower',     frame: 'Its real power lies with',    mode: 'clause'    },
  { key: 'strainedBy',    frame: 'It is currently strained by', mode: 'clause'    },
  { key: 'peopleFear',    frame: 'Its people fear',             mode: 'clause'    },
  { key: 'likelyFuture',  frame: 'Its likely future is',        mode: 'clause'    },
]);

/**
 * The longest a candidate may be and still be treated as a phrase. Every
 * authored noun phrase in the catalogs sits far under this; the narrative
 * bodies that used to be spliced in run three to six times longer. Kept
 * deliberately tight — a slot that overflows this is not a slot the source
 * field was written for.
 */
const MAX_PHRASE_CHARS = 80;

/**
 * @param {...unknown} candidates
 * @returns {string|null}
 */
function firstNonEmpty(...candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }
  return null;
}

/**
 * Like `firstNonEmpty`, but a candidate may also be an ARRAY of strings — the
 * shape `settlementReason` and `economicState.primaryExports` actually carry.
 * The old string-only read is why the founding reason never once reached the
 * spine: `settlementReason` has been `['Established along a road route …']`
 * for as long as the pipeline has assembled it.
 *
 * @param {...unknown} candidates
 * @returns {string|null}
 */
function firstText(...candidates) {
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const found = firstText(...candidate);
      if (found) return found;
      continue;
    }
    const text = firstNonEmpty(candidate);
    if (text) return text;
  }
  return null;
}

/**
 * Read a display name off a catalog row without an any-cast. Rows across the
 * estate spell it `label` or `name`; neither is guaranteed to be a string.
 * @param {unknown} value
 * @returns {string|null}
 */
function labelOf(value) {
  if (!value || typeof value !== 'object') return null;
  const row = /** @type {{ label?: unknown, name?: unknown }} */ (value);
  return firstText(row.label, row.name);
}

/**
 * Read a catalog row's snake_case type token.
 * @param {unknown} value
 * @returns {string|null}
 */
function typeTokenOf(value) {
  if (!value || typeof value !== 'object') return null;
  return firstNonEmpty(/** @type {{ type?: unknown }} */ (value).type);
}

/** @param {unknown} value @returns {unknown[]} */
function asList(value) {
  if (Array.isArray(value)) return value.filter(entry => entry != null);
  return value == null ? [] : [value];
}

/**
 * THE SPLICE GUARD. Returns the candidate as a usable noun phrase, or null
 * when it is really a narrative body wearing a phrase's clothes.
 *
 * A phrase may carry ONE optional trailing period (authored fields are
 * inconsistent about it). What it may not carry is sentence-terminal
 * punctuation in the MIDDLE — that is the signature of a description body —
 * nor a length no slot could absorb.
 *
 * @param {unknown} candidate
 * @returns {string|null}
 */
function nounPhrase(candidate) {
  const text = firstNonEmpty(candidate);
  if (!text) return null;
  const trimmed = text.replace(/[.\s]+$/, '');
  if (!trimmed) return null;
  if (trimmed.length > MAX_PHRASE_CHARS) return null;
  // A terminal mark followed by whitespace means a sentence ended inside the
  // candidate: it is a body, not a phrase.
  if (/[.!?]\s/.test(trimmed)) return null;
  return trimmed;
}

/**
 * Lowercase a catalog DISPLAY label for use inside a sentence, without
 * flattening a proper name.
 *
 * The old code lowercased only the FIRST CHARACTER, which turned "Under
 * Siege" into "under Siege" — the mangled case the chair read on the live
 * site. But lowering everything is equally wrong: it would turn "The
 * Salt-Tongue Guild" into a common noun. The distinguishing signal is where
 * the capitals fall:
 *
 *   every word capitalized ("Under Siege", "Beast & Raider Threat")
 *       → a title-cased DISPLAY LABEL; lower the whole thing.
 *   only the first word capitalized ("Medicinal herbs", "Smoked river fish")
 *       → a sentence-cased COMMON NOUN; lower just the opening character.
 *   capitals after the first word ("The Salt-Tongue Guild", "Riverwarden
 *   Temple") → a PROPER NAME; leave it exactly as authored.
 *
 * @param {string} label
 * @returns {string}
 */
function lowerLabel(label) {
  const text = label.trim();
  const words = text.split(/\s+/);
  const isMinorWord = (/** @type {string} */ word) => /^(?:of|the|and|to|a|an|or|in|on)$/i.test(word);
  const isCapitalized = (/** @type {string} */ word) => /^[^a-zA-Z]*[A-Z]/.test(word);

  if (words.length > 1 && words.every(word => isCapitalized(word) || isMinorWord(word))) {
    return text.toLowerCase();
  }
  if (words.slice(1).some(word => isCapitalized(word) && !isMinorWord(word))) {
    return text;
  }
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * Give a bare label the article the frame needs: "It is ruled by an elected
 * reeve", not "It is ruled by elected reeve". Labels that already open with a
 * determiner are left as they are.
 *
 * @param {string} phrase
 * @returns {string}
 */
function withArticle(phrase) {
  if (/^(?:a|an|the|its|their|his|her|no|some|one|two)\s/i.test(phrase)) return phrase;
  return `${/^[aeiou]/i.test(phrase) ? 'an' : 'a'} ${phrase}`;
}

/**
 * Join phrases the way a sentence joins them, and cap the list so the rung
 * stays a single readable line. Covers every arity the arms produce: one, two,
 * three, and more-than-three.
 *
 * @param {string[]} phrases
 * @param {number} [cap]
 * @returns {string|null}
 */
function joinPhrases(phrases, cap = 3) {
  const list = phrases.filter(Boolean);
  if (!list.length) return null;
  const shown = list.slice(0, cap);
  const overflow = list.length > cap;
  let joined;
  if (shown.length === 1) joined = shown[0];
  else if (shown.length === 2) joined = `${shown[0]} and ${shown[1]}`;
  else joined = `${shown.slice(0, -1).join(', ')}, and ${shown[shown.length - 1]}`;
  return overflow ? `${joined}, among others` : joined;
}

/**
 * Give a fragment EXACTLY one terminal mark. The doubled period the chair read
 * ("…it is about survival..") came from appending '.' to a field that already
 * ended in one; this is the single writer, and it can no longer do that.
 *
 * @param {string} text
 * @returns {string}
 */
function terminate(text) {
  const trimmed = text.trim().replace(/\s+([.!?]+)$/, '$1').replace(/([.!?])[.!?]+$/, '$1');
  if (!trimmed) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/**
 * Render an authored fragment as a whole sentence: one leading capital and one
 * terminal mark.
 *
 * @param {string} text
 * @returns {string}
 */
function asSentence(text) {
  const terminated = terminate(text);
  return terminated.charAt(0).toUpperCase() + terminated.slice(1);
}

/**
 * Compose a rung's standalone sentence from its frame and its answer.
 * @param {{ frame: string, mode: 'clause' | 'statement' }} rung
 * @param {string} answer
 * @returns {string}
 */
function composeSentence(rung, answer) {
  return rung.mode === 'statement'
    ? asSentence(answer)
    : asSentence(`${rung.frame} ${answer}`);
}

/**
 * Normalize the stressor container to a list of catalog-shaped entries.
 * `stressors` is dual-written with the legacy `stress` name and may be a
 * string, a bare object, or an array (assembleSettlement.js writes all three
 * shapes depending on how many stressors survived confirmation).
 *
 * @param {Record<string, unknown>} settlement
 * @returns {Array<Record<string, unknown>>}
 */
function stressorEntries(settlement) {
  const raw = settlement.stressors ?? settlement.stress;
  if (typeof raw === 'string') {
    const text = raw.trim();
    return text ? [{ label: text }] : [];
  }
  return asList(raw)
    .map(entry => (typeof entry === 'string' ? { label: entry } : entry))
    .filter(entry => entry && typeof entry === 'object');
}

/** @param {Record<string, unknown>} entry @returns {string|null} */
function stressorTypeKey(entry) {
  const type = firstNonEmpty(entry.type);
  return type && Object.prototype.hasOwnProperty.call(STRESSOR_SPINE_PHRASES, type)
    ? type
    : null;
}

/**
 * What the settlement is strained by. Falls back to the entry's display label
 * — lowered WHOLE — for custom-authored stressors outside the catalog.
 * @param {Record<string, unknown>} entry
 * @returns {string|null}
 */
function strainPhraseOf(entry) {
  const type = stressorTypeKey(entry);
  if (type) return STRESSOR_SPINE_PHRASES[type].strain;
  const label = nounPhrase(firstText(entry.label, entry.name));
  return label ? lowerLabel(label) : null;
}

/**
 * What the people fear. Unlike the strain form there is NO label fallback: a
 * fear is a claim about what is in people's heads, and a display label does
 * not carry one. An uncatalogued stressor declines rather than have a fear
 * manufactured for it, and the next arm answers instead.
 * @param {Record<string, unknown>} entry
 * @returns {string|null}
 */
function fearPhraseOf(entry) {
  const type = stressorTypeKey(entry);
  return type ? STRESSOR_SPINE_PHRASES[type].fear : null;
}

/** @param {unknown} value @returns {number} */
function powerOf(value) {
  const n = Number(/** @type {{ power?: unknown }} */ (value)?.power);
  return Number.isFinite(n) ? n : 0;
}

// ── Per-line derivations ──────────────────────────────────────────────────
// Each returns the rung's ANSWER — a complement for 'clause' rungs, a whole
// authored sentence for the one 'statement' rung — or null, in which case
// `deriveSimulationSpine` substitutes a placeholder so the spine is always
// seven entries.

/** @param {Record<string, any>} s @returns {string} */
function deriveExistsBecause(s) {
  // STATEMENT rung: authored founding prose, printed whole.
  // `settlementReason` is an ARRAY of authored sentences in every settlement
  // the pipeline produces. Reading it as a bare string (as this did) meant the
  // real reason was dropped on every single generation and the rung fell
  // through to the historical-character fallback forever.
  const reason = firstText(s.settlementReason);
  if (reason) return asSentence(reason);

  const histChar = firstText(s.history?.historicalCharacter);
  if (histChar) return asSentence(histChar);

  const tier = firstText(s.tier) || 'settlement';
  const trade = firstText(s.config?.tradeRouteAccess);
  if (trade && trade !== 'isolated') {
    return asSentence(`A ${tier} grew up along the ${trade.replace(/_/g, ' ')} route`);
  }
  return asSentence(`A ${tier} took root here for reasons no one writes down`);
}

/** @param {Record<string, any>} s @returns {string} */
function deriveSurvivesBy(s) {
  const eco = s.economicState || s.economy || {};
  // `primaryExports` is the name the generator actually writes; topExport and
  // primaryExport are legacy aliases kept for settlements saved before it.
  const exports_ = asList(eco.primaryExports)
    .map(entry => nounPhrase(entry))
    .filter(Boolean)
    .map(entry => lowerLabel(/** @type {string} */ (entry)));
  const top = firstText(eco.topExport, eco.primaryExport);
  const named = top ? [lowerLabel(top), ...exports_] : exports_;
  const unique = [...new Set(named)];
  if (unique.length) {
    return /** @type {string} */ (joinPhrases(unique, 2));
  }

  const band = firstText(eco.prosperity, eco.prosperityBand, eco.prospBand);
  if (band) return `what the land yields, on a ${band.toLowerCase()} footing`;

  return 'subsistence trade with its neighbours and what the land offers';
}

/** @param {Record<string, any>} s @returns {string} */
function deriveRuledBy(s) {
  const power = s.powerStructure || s.power;
  if (!power) return 'an informal authority no one has thought to question yet';

  // `government` is the live field; governanceType/governance are legacy.
  const formal = firstText(power.government, power.governanceType, power.governance);
  const governing = nameOf(governingFactionOf({ powerStructure: power }))
    || firstText(power.governingName);

  if (formal && governing && formal.toLowerCase() !== governing.toLowerCase()) {
    return `${withArticle(lowerLabel(formal))}, currently ${governing}`;
  }
  if (formal) return withArticle(lowerLabel(formal));
  if (governing) return withArticle(lowerLabel(governing));
  return 'an authority that is contested and unclear';
}

/** @param {Record<string, any>} s @returns {string|null} */
function deriveRealPower(s) {
  // "Real power" is interesting only when it differs from "ruled by."
  const power = s.powerStructure || s.power;
  if (!power) return null;

  // Faction rows are keyed `.faction`, not `.name` — the FACTION-KEY defect
  // class. `nameOf` is the canonical reader; never hand-roll it.
  const factions = asList(power.factions);
  const top = [...factions].sort((a, b) => powerOf(b) - powerOf(a))[0];
  const topName = nameOf(/** @type {any} */ (top));
  if (!topName) return null;

  const governing = nameOf(governingFactionOf({ powerStructure: power }))
    || firstText(power.governingName)
    || '';

  if (governing && governing.toLowerCase() === topName.toLowerCase()) {
    const legitimacy = firstText(power.publicLegitimacy?.label);
    if (legitimacy && legitimacy !== 'Endorsed') {
      return `the same hands that hold the seat, though their legitimacy is ${legitimacy.toLowerCase()}`;
    }
    return 'the same hands that hold the seat; authority and power are aligned, for now';
  }

  // "whose practical influence outweighs" agrees with `influence`, not with
  // the faction name, so the line stays grammatical whether the strongest
  // faction is "The Riverwarden Temple" or "Religious Authorities". The
  // earlier "which commands" disagreed with every plural faction name.
  return `${topName}, whose practical influence outweighs the formal authority`;
}

/** @param {Record<string, any>} s @returns {string} */
function deriveStrainedBy(s) {
  const strains = stressorEntries(s).map(strainPhraseOf).filter(Boolean);
  const joined = joinPhrases(/** @type {string[]} */ (strains));
  if (joined) return joined;

  // Economic / viability fallback. `issues[]` entries are OBJECTS; the old
  // code passed the object straight to a string test, so this arm was dead.
  const issue = nounPhrase(firstText(
    s.economicViability?.issues?.[0]?.title,
    s.economicViability?.issues?.[0],
  ));
  if (issue) return lowerLabel(issue);

  return 'nothing it cannot carry at the moment';
}

/** @param {Record<string, any>} s @returns {string} */
function derivePeopleFear(s) {
  const fears = stressorEntries(s).map(fearPhraseOf).filter(Boolean);
  const fromStressors = joinPhrases(/** @type {string[]} */ (fears), 2);
  if (fromStressors) return fromStressors;

  const threats = asList(s.defenseProfile?.threats)
    .map(threat => nounPhrase(typeof threat === 'string' ? threat : labelOf(threat)))
    .filter(Boolean)
    .map(threat => lowerLabel(/** @type {string} */ (threat)));
  const fromThreats = joinPhrases(threats, 2);
  if (fromThreats) return fromThreats;

  // `powerStructure.recentConflict` is DELIBERATELY NOT an arm here.
  //
  // It was one, and it is the field that shipped "People fear a return of the
  // settlement is under active siege. Every resource decision is a military
  // decision. …" to every first-run user. The tempting repair is to guard the
  // splice and keep the arm, but the field is a governance VIGNETTE by
  // contract (governanceNarrative.js buildStressNarratives) — a two-to-three
  // sentence scene, occasionally a single long finite clause. Even its short
  // form ("a dispute over field rotation and grazing rights has divided the
  // village for most of this season") is a CLAUSE, not a noun phrase, and no
  // length or punctuation guard reliably separates the two. A field whose
  // contract is prose does not belong in a noun slot at any length.
  //
  // The fear rung therefore speaks only from the typed stressor vocabulary
  // and the defense roster. A settlement with neither has no shared dread to
  // report, and says so.

  if (asList(s.plotHooks).length) {
    return 'the things this place has not told anyone yet';
  }

  return 'nothing they will say out loud';
}

/** @param {Record<string, any>} s @returns {string} */
function deriveLikelyFuture(s) {
  // Tension entries carry `.type` (a snake_case token) and `.description` (a
  // whole sentence). The token humanizes into a noun phrase; the description
  // never enters the slot.
  const tensions = asList(s.history?.currentTensions)
    .map(tension => {
      if (typeof tension === 'string') return nounPhrase(tension);
      const labelled = nounPhrase(labelOf(tension));
      if (labelled) return labelled;
      const type = firstNonEmpty(typeTokenOf(tension));
      return type ? type.replace(/_/g, ' ') : null;
    })
    .filter(Boolean)
    .map(tension => lowerLabel(/** @type {string} */ (tension)));
  const named = joinPhrases(tensions, 2);
  if (named) return `bound to the unresolved ${named}`;

  const stability = firstText(s.powerStructure?.stability);
  if (stability) {
    const normalized = stability.toLowerCase();
    if (normalized.includes('critical') || normalized.includes('desperate') || normalized.includes('siege')) {
      return 'a crisis, unless someone intervenes';
    }
    if (normalized.includes('unstable') || normalized.includes('volatile')) {
      return 'a test of whoever holds the chair';
    }
    if (normalized.includes('stable')) {
      return 'continuity, with the usual slow erosion of any settlement';
    }
  }

  return 'whatever the table decides to make it';
}

// ── Composer ──────────────────────────────────────────────────────────────

/** @type {Readonly<SimulationSpine>} */
const PLACEHOLDER_SPINE = Object.freeze({
  existsBecause: 'Origin unknown.',
  survivesBy:    'Means unknown.',
  ruledBy:       'Authority unknown.',
  realPower:     null,
  strainedBy:    'No strain recorded.',
  peopleFear:    'No fears recorded.',
  likelyFuture:  'Future unwritten.',
});

/**
 * The rung ANSWERS — complements for 'clause' rungs, an authored sentence for
 * the 'statement' rung. This is the single authored form; both public
 * projections below are composed from it, so the rail and the grounding
 * payload can never disagree about a settlement.
 *
 * @param {unknown} settlement
 * @returns {SimulationSpine|null} null for nullish input
 */
function deriveSpineAnswers(settlement) {
  if (!settlement || typeof settlement !== 'object') return null;
  const s = /** @type {Record<string, any>} */ (settlement);
  return {
    existsBecause: deriveExistsBecause(s),
    survivesBy:    deriveSurvivesBy(s),
    ruledBy:       deriveRuledBy(s),
    realPower:     deriveRealPower(s),
    strainedBy:    deriveStrainedBy(s),
    peopleFear:    derivePeopleFear(s),
    likelyFuture:  deriveLikelyFuture(s),
  };
}

/**
 * Build the seven-line simulation spine as STANDALONE SENTENCES — the form
 * the AI grounding payload and the causal narrative view consume. Tolerant of
 * missing fields: every line either succeeds or substitutes a placeholder so
 * consumers never need to guard against null.
 *
 * @param {unknown} settlement
 * @returns {SimulationSpine}
 */
export function deriveSimulationSpine(settlement) {
  const answers = deriveSpineAnswers(settlement);
  // Defensive — a placeholder spine rather than a throw.
  if (!answers) return { ...PLACEHOLDER_SPINE };

  // Start from the placeholders so a rung that declines keeps its placeholder
  // rather than punching a null into a field typed as a string. realPower's
  // placeholder IS null, which is exactly its documented "omitted" value.
  const spine = /** @type {SimulationSpine} */ ({ ...PLACEHOLDER_SPINE });
  for (const rung of SPINE_RUNGS) {
    const answer = answers[rung.key];
    if (answer) spine[rung.key] = composeSentence(rung, answer);
  }
  return spine;
}

/**
 * Render the spine as an ordered array of `[frame, body]` pairs, ready
 * for the rail or PDF. The body is the COMPLEMENT — it never repeats the
 * frame, because the deriver that produced it has no access to one. Skips
 * lines that came back null (only realPower can be null today — it's
 * deliberately omitted when the settlement has no faction roster at all).
 *
 * @param {unknown} settlement
 * @returns {Array<[string, string]>}
 */
export function simulationSpineRows(settlement) {
  const answers = deriveSpineAnswers(settlement);
  /** @type {Array<[string, string]>} */
  const rows = [];
  for (const rung of SPINE_RUNGS) {
    const answer = answers ? answers[rung.key] : PLACEHOLDER_SPINE[rung.key];
    if (!answer) continue;
    // A clause row keeps its lowercase opening on purpose: the frame is the
    // <dt> and the complement the <dd>, so reading down the pair yields one
    // grammatical sentence. Only a statement row stands alone and is
    // capitalized.
    rows.push([rung.frame, rung.mode === 'statement' ? asSentence(answer) : terminate(answer)]);
  }
  return rows;
}
