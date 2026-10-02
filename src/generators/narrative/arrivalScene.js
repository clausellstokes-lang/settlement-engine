/**
 * generators/narrative/arrivalScene.js — THE ARRIVAL SCENE AS A PLACE (the Voice Program wave 3).
 *
 * The paragraph at the top of the Overview tab, the first prose a reader meets. It used to be a route or stress
 * opener, then a sentence identical for every settlement of the tier ("A proper village, large enough to have a
 * market…"), then a magic line keyed to nothing but the magic slider ("A magelight lamp post marks the main gate",
 * on every default settlement, gate or no gate), then a landmark, then a second approach sentence that restated the
 * first. The owner, 2026-10-02: "it's always bland", "each variant should insight something regarding either
 * senses, culture, about the people, … trade dynamics, recent history or events, the economic makeup", in the
 * manner of "Larian entertainment or BioWare".
 *
 * ── THE BEATS, EACH ANCHORED ON A FACT THE SETTLEMENT HOLDS ──────────────────────────────────────────────────────
 *   HOOK     the stress vignette, or the route scene (pre-existing pools). A vignette is drawn only where the
 *            settlement holds every structure it names (STRUCTURE_CLAIMS: no walls for a thorp), and a crossroads
 *            opens on its market only where it has one; otherwise it opens as an ordinary road does.
 *   SIGHT    a landmark its native institutions imply, else its culture's materialized built detail. Yields under
 *            a stress vignette, which is already a sight.
 *   SENSE    a sound or smell of a trade it practises (src/data/arrivalProse.js ARRIVAL_SENSES), the trade that
 *            fills the whole place where its exports or income name it.
 *   PEOPLE   what its people are seen doing, by its culture profile.
 *   CLOSING  one more truth, and none under a stress vignette: a visible sign of a printed danger (criminal
 *            governance, a controlled populace, unsafe streets), else the trace of the last major event its history
 *            recorded within living memory (the History tab's own band), else its poverty or plenty at the extremes.
 *
 * ⛔ ANCHORED, NOT DERIVED (the owner's rule; the law of 2026-09-12): a line embellishes freely with what the engine
 * does not track and is drawn only where its key's fact is present, so it never contradicts the settlement. Native
 * catalogue names only (`nativeSemanticNames`), so a custom display label cannot impersonate a smithy; a name that
 * says the settlement LACKS the thing ("Access to external mill") or only receives a visitor ("Traveling hedge
 * wizard") anchors nothing. Fragments match at a word start, so a sawmill is never a mill. Covert facts are never
 * read (floor 4); the arcane sense and the wild-magic memory are drawn only where the world's magic is real.
 *
 * ⛔ DRAWS: every pick is `pickRandom` on the ACTIVE stream, which the assembly step gives this scene alone (the
 * wave 2 substream 'arrival-scene'), so a change of draw count here can never move a fact generated after it.
 *
 * @enforced-by tests/generators/arrivalScene.test.js
 */
import { pickRandom } from '../helpers.js';
import { resolvePrimaryStress } from '../stressPriority.js';
import { sentenceCase } from '../narrativeProse.js';
import { checkInstCompat } from '../structuralValidator.js';
import { resolveGenerationWorldLaw } from '../generationContext.js';
import { nativeSemanticNames } from '../../domain/content/customContentSemanticAuthority.js';
import { CULTURE_PROFILES, resolveCultureProfileKey } from '../../data/cultureProfiles.js';
import { ARRIVAL_SCENES, STRESS_DESCS } from '../../data/narrativeData.js';
import {
  ARRIVAL_MEMORIES, ARRIVAL_PEOPLE, ARRIVAL_SENSES, ARRIVAL_TENSIONS,
} from '../../data/arrivalProse.js';

/**
 * Route → opening scene (the pool keys of ARRIVAL_SCENES). A port on riverside terrain is an inland river port.
 * Exported so the joins harness and the general desk's mirror can assert the mapping lands on real keys.
 */
export const ROUTE_TO_SCENE = Object.freeze({
  crossroads: 'market',
  port: 'port',
  river: 'river',
  isolated: 'smoke',
  mountain_pass: 'smoke',
});

/** Severities that leave a visible trace; a minor event does not mark a settlement. */
const MEMORY_SEVERITIES = Object.freeze(['major', 'catastrophic']);

/**
 * The structures a HOOK vignette may name, and the native catalogue fragments that hold each (the Voice Program
 * wave 4). A stress vignette is drawn only where the settlement holds every structure it names, so a besieged
 * thorp is never told "there are people on the walls". A household levy is not a guard at a gate.
 * @type {ReadonlyArray<Readonly<{ family: string, claim: RegExp, held: ReadonlyArray<string> }>>}
 */
export const STRUCTURE_CLAIMS = Object.freeze([
  { family: 'perimeter', claim: /\b(?:gates?|gatehouse|walls?|walled|ramparts?|battlements|watchtowers?)\b/i,
    held: ['wall', 'walls', 'palisade', 'gates', 'earthworks', 'citadel', 'fortifications'] },
  { family: 'guard', claim: /\b(?:guards?|garrison|sentr(?:y|ies)|watchmen)\b/i,
    held: ['town watch', 'city watch', 'professional city watch', 'garrison', 'garrisons', 'barracks', 'militia', 'citizen militia'] },
  { family: 'market', claim: /\b(?:market|marketplace|square|stalls?)\b/i,
    held: ['market square', 'market squares', 'weekly market', 'daily markets', 'markets', 'market hall', 'bazaar', 'annual fair', 'fairs', 'fish market'] },
  { family: 'granary', claim: /\bgranar(?:y|ies)\b/i, held: ['granary', 'granaries'] },
  { family: 'faith', claim: /\b(?:temples?|church(?:es)?|cathedral|chapel)\b/i,
    held: ['cathedral', 'temple', 'church', 'churches', 'chapel', 'monastery', 'abbey', 'shrine', 'priory', 'friary'] },
]);

/** Native names that say the settlement lacks the thing, or only receives it now and then. */
const ABSENT_PREFIXES = Object.freeze(['access to ', 'traveling ', 'travelling ']);

const lower = (/** @type {unknown} */ v) => String(v ?? '').toLowerCase();
const escapeRe = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * True when any fragment occurs at a word start in any of the names.
 * @param {readonly string[]} fragments
 * @param {readonly string[]} names lowercased
 */
function anyAtWordStart(fragments, names) {
  return fragments.some((fragment) => {
    const re = wordStartPattern(fragment);
    return names.some((name) => re.test(name));
  });
}

/** One compiled pattern per fragment for the module's life: the composer runs on every generated settlement. */
const WORD_START_PATTERNS = new Map();
/** @param {string} fragment */
function wordStartPattern(fragment) {
  let re = WORD_START_PATTERNS.get(fragment);
  if (!re) {
    re = new RegExp(`(^|[^a-z])${escapeRe(fragment)}`);
    WORD_START_PATTERNS.set(fragment, re);
  }
  return re;
}

/**
 * The structure families a rendered line names that the settlement does not hold.
 * @param {string} text
 * @param {string[]} names native institution names, lowercased, absences removed
 * @returns {string[]}
 */
export function unheldClaims(text, names) {
  return STRUCTURE_CLAIMS
    .filter((entry) => entry.claim.test(text) && !anyAtWordStart(entry.held, names))
    .map((entry) => entry.family);
}

/**
 * The SENSE: every key whose institutions the settlement has, scored up where its exports or income name the trade
 * (dominance) and down for the two near-universal keys (market, bread) when they are not dominant, so a distinctive
 * trade wins when there is one. A key with no plain `lines` (arms) is a candidate only when dominant. The draw is
 * among the keys within one point of the best, so neighbouring places of one economy do not all open on one sound.
 * @param {string[]} names native institution names, lowercased, absences removed
 * @param {string[]} tradeWords exports and income sources, lowercased
 * @param {boolean} magicReal
 * @returns {{ sense: typeof ARRIVAL_SENSES[number], dominant: boolean } | null}
 */
export function chooseSense(names, tradeWords, magicReal) {
  /** @type {Array<{ sense: typeof ARRIVAL_SENSES[number], dominant: boolean, score: number }>} */
  const scored = [];
  for (const sense of ARRIVAL_SENSES) {
    if (sense.arcane && !magicReal) continue;
    if (!anyAtWordStart(sense.institutions, names)) continue;
    const dominant = sense.trade.length > 0 && sense.dominant.length > 0 && anyAtWordStart(sense.trade, tradeWords);
    if (!dominant && sense.lines.length === 0) continue;
    const common = !dominant && (sense.key === 'market' || sense.key === 'bread') ? -1 : 0;
    scored.push({ sense, dominant, score: 2 + (dominant ? 3 : 0) + common });
  }
  if (!scored.length) return null;
  const best = Math.max(...scored.map((entry) => entry.score));
  const { sense, dominant } = pickRandom(scored.filter((entry) => entry.score >= best - 1));
  return { sense, dominant };
}

/**
 * The CLOSING key: a printed danger first, then a memory, then poverty or plenty. Player-visible facts only.
 * @param {any} settlement
 * @param {boolean} magicReal
 * @returns {{ pool: ReadonlyArray<(n: string) => string> } | null}
 */
export function chooseClosing(settlement, magicReal) {
  const safety = lower(settlement.economicState?.safetyProfile?.safetyLabel);
  if (safety.includes('criminal governance')) return { pool: ARRIVAL_TENSIONS.criminal_governance };
  if (safety.startsWith('controlled')) return { pool: ARRIVAL_TENSIONS.controlled };
  if (safety.startsWith('unsafe') || safety.startsWith('dangerous')) return { pool: ARRIVAL_TENSIONS.unsafe };

  // ⚠ LIVING MEMORY IS THE HISTORY TAB'S OWN BAND, MIRRORED, NOT A WINDOW CHOSEN HERE: HistoryTab.jsx's
  // recencyLabel prints "Recent" up to ten years and "Living memory" up to thirty beside every event, and
  // DS-GEN-9's recencyFramingPoolKey mirrors the same cuts. An event the tab calls older is not remembered
  // in the street. The arrival test extracts the tab's literal and drives this cut from both sides.
  const events = Array.isArray(settlement.history?.historicalEvents) ? settlement.history.historicalEvents : [];
  const recent = events
    .filter((event) => Number.isFinite(event?.yearsAgo) && event.yearsAgo <= 30
      && MEMORY_SEVERITIES.includes(event.severity))
    .sort((a, b) => a.yearsAgo - b.yearsAgo)[0];
  const memoryKey = recent?.templateType;
  if (memoryKey && ARRIVAL_MEMORIES[memoryKey] && (memoryKey !== 'wild_magic' || magicReal)) {
    return { pool: ARRIVAL_MEMORIES[memoryKey] };
  }

  const prosperity = lower(settlement.economicState?.prosperity);
  if (prosperity === 'subsistence' || prosperity === 'struggling' || prosperity === 'poor') return { pool: ARRIVAL_TENSIONS.poor };
  if (prosperity === 'prosperous' || prosperity === 'wealthy') return { pool: ARRIVAL_TENSIONS.prosperous };
  return null;
}

/**
 * The arrival scene, beat by beat. Same settlement + same stream ⇒ same paragraph.
 * @param {any} settlement
 * @returns {string | null}
 */
export function composeArrivalScene(settlement) {
  if (!settlement) return null;
  const { name, tier, config = {}, institutions = [], stress, culturalIdentity = null } = settlement;
  const names = nativeSemanticNames(institutions)
    .map(lower)
    .filter((n) => !ABSENT_PREFIXES.some((prefix) => n.startsWith(prefix)));
  const magicReal = resolveGenerationWorldLaw(null, config)?.magicEnabled === true;

  // HOOK: the stress vignette, else the route scene. A market opening needs a market.
  const stresses = (stress ? (Array.isArray(stress) ? stress : [stress]) : []).map((s) => s?.type);
  const primaryStress = resolvePrimaryStress(stresses);
  const underStress = Boolean(primaryStress && STRESS_DESCS[primaryStress]);
  const route = config.tradeRouteAccess || 'road';
  const riverPort = route === 'port' && config.terrainType === 'riverside';
  let sceneKey = riverPort ? 'river' : (/** @type {Record<string, string>} */ (ROUTE_TO_SCENE)[route] || 'ordinary');
  const marketSense = ARRIVAL_SENSES.find((sense) => sense.key === 'market');
  if (sceneKey === 'market' && marketSense && !anyAtWordStart(marketSense.institutions, names)) sceneKey = 'ordinary';
  // A stress vignette names only structures the settlement holds; the structure-free vignettes every stress
  // carries are the floor (pinned by the arrival test), so the filter never empties the pool.
  const vignettes = underStress
    ? STRESS_DESCS[primaryStress].filter((line) => unheldClaims(line(name), names).length === 0)
    : [];
  const hookTemplate = underStress
    ? pickRandom(vignettes.length ? vignettes : STRESS_DESCS[primaryStress])
    : pickRandom(ARRIVAL_SCENES[sceneKey]);
  const hook = typeof hookTemplate === 'function' ? hookTemplate(name, tier) : hookTemplate;

  // SIGHT: a landmark the native institutions imply, else the culture's built detail.
  let sight = null;
  if (!underStress) {
    sight = checkInstCompat(institutions, tier, config.priorityMagic ?? 50);
    if (!sight) {
      const materialized = typeof culturalIdentity?.architecturalDetail === 'string'
        ? culturalIdentity.architecturalDetail.trim()
        : '';
      const profile = CULTURE_PROFILES[resolveCultureProfileKey(config.culture || 'germanic')];
      const detail = materialized
        || (profile?.architecturalDetails?.length ? pickRandom(profile.architecturalDetails) : '');
      if (detail) sight = `${sentenceCase(detail)}.`;
    }
  }

  // SENSE: a trade the settlement practises, the one that fills the place first.
  const economy = settlement.economicState || {};
  const tradeWords = [
    ...(economy.primaryExports || []),
    ...(economy.incomeSources || []).map((/** @type {any} */ s) => (typeof s === 'string' ? s : s?.source)),
  ].map(lower);
  const chosen = chooseSense(names, tradeWords, magicReal);
  const sensePool = chosen ? (chosen.dominant ? chosen.sense.dominant : chosen.sense.lines) : null;
  const senseLine = sensePool?.length ? pickRandom(sensePool)(name) : null;

  // PEOPLE: the culture, shown.
  const peoplePool = ARRIVAL_PEOPLE[resolveCultureProfileKey(config.culture || 'germanic')] || ARRIVAL_PEOPLE.mixed;
  const peopleLine = peoplePool?.length ? pickRandom(peoplePool)(name) : null;

  // CLOSING: one more visible truth, none under a vignette.
  const closing = underStress ? null : chooseClosing(settlement, magicReal);
  const closingLine = closing ? pickRandom(closing.pool)(name) : null;

  return [hook, sight, senseLine, peopleLine, closingLine].filter(Boolean).join(' ');
}
