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
import { pickRandom } from '../helpers.js'; import { getActiveRng } from '../../kernel/rngContext.js'; // R-AT (CENSUS-1i unit 5): one line, so no cited line moves
import { textOf } from '../../domain/facts/textOf.js';
import { resolvePrimaryStress } from '../stressPriority.js';
import { sentenceCase } from '../narrativeProse.js';
import { checkInstCompat } from '../structuralValidator.js';
import { resolveGenerationWorldLaw } from '../generationContext.js';
import { nativeSemanticNames } from '../../domain/content/customContentSemanticAuthority.js';
import { defenseWordsFindings } from '../../domain/coherence/defenseWordsFindings.js'; // F1: one line
import { CULTURE_PROFILES, architecturalDetailRefused, resolveCultureProfileKey } from '../../data/cultureProfiles.js';
import { speakTierNoun } from '../../domain/display/stateProse/stateProseKernel.js';
import { tierNounFor } from '../../domain/display/stateProse/weaveBlock.js';
import { marketOf } from '../../domain/facts/market.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { drawDeclared } from '../../domain/facts/drawDeclared.js';
import { declarationAdmits, declarationOf } from '../../domain/facts/factVocabulary.js';
import { ARRIVAL_SCENES, ARRIVAL_SCENES_CRISIS_SCOPED, STRESS_DESCS } from '../../data/narrativeData.js';
import {
  ARRIVAL_CRISIS_SCOPED, ARRIVAL_MEMORIES, ARRIVAL_PEOPLE, ARRIVAL_SENSES, ARRIVAL_TENSIONS,
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

/**
 * THE MARKET PREDICATE, and it is DS-GEN-13's own (chair ruling T1-12, 2026-10-30; ODQ §934.101). The Overview's
 * market sentence (generalStateProse.js :: marketPoolKey) says a town with no market-class row "keeps no market",
 * and on the v2 sample the arrival SIGHT beat named a market, its stalls or a fair over 55 of those 319 towns. So
 * the SIGHT asks the same question the same way: the engine's market NAME class over the live roster. Mirrored
 * rather than imported (a generator does not reach into the display corpus) and pinned equal by the arrival test.
 */
/** Retired as the market reader (CENSUS-1b unit A (d)); kept exported, unread (rule 36). */
export const MARKET_INSTITUTION_NAME = /\b(market|bazaar|exchange|shambles|stalls)\b/i;
/** The words a SIGHT line uses to say there is a market. */
const MARKET_WORD = /\b(?:market\w*|fairs?|bazaars?|stalls?|agora)\b/i;
/** The words a line uses to say a catch is being dried on racks (A-11): the place has water. */
const CATCH_RACK_WORD = /\bracks of drying fish\b/i;

/**
 * Whether the live roster carries a market — THE MARKET HOME's answer (`facts/market.js`,
 * CENSUS-1 fact 5). CENSUS-1b unit A (d), the chair's ruling: this predicate and DS-GEN-13's
 * `marketPoolKey` are homed TOGETHER, so chair ruling T1-12's equality holds because both read
 * the home (tests/generators/arrivalScene.test.js, re-keyed to the home). The retired name
 * regex (`MARKET_INSTITUTION_NAME`) counted a black market and a stock exchange.
 * @param {unknown} institutions
 * @returns {boolean}
 */
export function holdsMarket(institutions) {
  return marketOf({ institutions });
}

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
    const re = new RegExp(`(^|[^a-z])${escapeRe(fragment)}`);
    return names.some((name) => re.test(name));
  });
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
 * @returns {{ pool: ReadonlyArray<import('../../data/arrivalProse.js').ArrivalLine> } | null}
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
 * THE ⚠ REDRAW-ONCE, DECLARED (CENSUS-1f unit 2; `docs/DESIGN_POOL_CENSUS.md` Appendix B, the arrival scene). A
 * beat draws its line exactly as before (one `pickRandom` over the whole pool); only where that line is REFUSED —
 * its declaration contradicted by the record (`declarationAdmits`), or the old market / drying-rack agreement
 * failing — does it redraw ONCE from the pool's lines that pass both, and an empty clean set leaves the beat out.
 * The extra draw is on the scene's own substream ('arrival-scene', `assembleSettlement.js`), so it moves nothing
 * outside this paragraph, and a birth whose first draws are all admitted draws exactly what it drew. The resolved
 * line is noted in the presumption ledger through `drawDeclared` (its `draw` is this rule).
 * @param {ReadonlyArray<any>} pool
 * `cleanOnly`: the caller's first line was already refused (the materialized built detail that names a market the
 * roster lacks), so the one draw is the redraw from the clean lines, as before.
 * @param {{ poolId: string, scoped: boolean, facts: () => object, speaks?: (line: any) => boolean, cleanOnly?: boolean }} opts
 * @returns {any}
 */
function drawAdmitted(pool, { poolId, scoped, facts, speaks = () => true, cleanOnly = false }) {
  const ok = (/** @type {any} */ line) => speaks(line)
    && declarationAdmits(declarationOf(line), /** @type {any} */ (facts()), { crisisScoped: scoped }).admitted;
  // R2-CODE-A-14 (the chair's ruling (s2)): A DRAW IS NOT MOVED: a refused line whose declared TWIN is admitted keeps
  // its slot, and drawDeclared resolves it to the twin, so no redraw is spent. A closure table's twin is keyed on its
  // original's template as the ledger writes it (`{name}`); twins never enter the draw (drawDeclared's domain).
  const twinOf = (/** @type {any} */ line) => {
    const t = textOf(line);
    const own = typeof t === 'function' ? t('{name}') : t;
    return pool.find((l) => l && typeof l === 'object' && typeof l.twinOf === 'string' && l.twinOf === own) ?? null;
  };
  const twinAdmitted = (/** @type {any} */ line) => { const twin = twinOf(line); return twin != null && ok(twin); };
  return drawDeclared(pool, {
    twin: twinOf,
    draw: (p) => {
      const first = cleanOnly ? null : pickRandom(p);
      if (!cleanOnly && (first == null || ok(first) || twinAdmitted(first))) return first;
      const clean = p.filter((l) => ok(l) || twinAdmitted(l));
      return clean.length ? pickRandom(clean) : null;
    },
    facts, poolId, key: `${getActiveRng()?.seed ?? ''}::${poolId}`, surface: 'overview', drawKind: 'R', crisisScoped: scoped, // R-AT (CENSUS-1i unit 5): the settlement's identity
  }).line;
}

/** @param {Readonly<Record<string, unknown>>} table @param {unknown} pool @returns {string | undefined} */
const keyOfPool = (table, pool) => Object.keys(table).find((k) => table[k] === pool);

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
  /** @type {object | undefined} */ let held;
  const facts = () => (held ??= factsOf(settlement)); // CENSUS-1f: read once, only when a drawn line declares
  const sensesScoped = new Set(ARRIVAL_CRISIS_SCOPED.ARRIVAL_SENSES);

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
    ? STRESS_DESCS[primaryStress].filter((line) => unheldClaims(textOf(line)(name), names).length === 0 && defenseWordsFindings({ institutions }, textOf(line)(name)).length === 0) // F1: and no force the record lacks; R-C: a declared row gives back its template (CENSUS-2d)
    : [];
  const hookTemplate = textOf(underStress
    ? drawAdmitted(vignettes.length ? vignettes : STRESS_DESCS[primaryStress], { poolId: `STRESS_DESCS.${primaryStress}`, scoped: false, facts })
    : drawAdmitted(ARRIVAL_SCENES[sceneKey], { poolId: `ARRIVAL_SCENES.${sceneKey}`, scoped: ARRIVAL_SCENES_CRISIS_SCOPED.includes(sceneKey), facts })); // R-C; CENSUS-1f: the redraw-once, declared
  // SIZE ruling 2 (ODQ §934.104): the vignettes and route scenes were written with 'town' for a place of any size,
  // so the drawn hook speaks the settlement's own tier noun through the dossier kernel's helper, with its kept
  // phrases ("at the edge of town"). Identity for a town; it draws nothing, so no later pick moves.
  const drawnHook = typeof hookTemplate === 'function' ? hookTemplate(name, tier) : hookTemplate;
  const hook = typeof drawnHook === 'string' ? speakTierNoun(drawnHook, tierNounFor(tier)) : drawnHook;

  // THE SCENE AGREES WITH THE INSTITUTIONS (T1-12, extended to every beat by the chair's ruling 3, 2026-10-30): a
  // line names a market, its stalls or a fair only where the roster holds a market (DS-GEN-13's predicate). A beat
  // that drew such a line over a market-less roster redraws from its own pool's other lines. The redraw happens ONLY
  // on that contradiction, so no other settlement's draw moves.
  const marketHeld = holdsMarket(institutions);
  // A-11 (soak 1000 row 7): the drying racks of a catch only where the world law's water fact
  // (`portKind`, from `config.terrainType` / `config.tradeRouteAccess`) gives a catch; inland the
  // beat redraws from its own pool's other lines, by the same one-redraw rule as the market.
  const waterHeld = resolveGenerationWorldLaw(null, config)?.portKind !== 'none';
  const speaks = (/** @type {string} */ line) => (marketHeld || !MARKET_WORD.test(line))
    && (waterHeld || !CATCH_RACK_WORD.test(line));
  /**
   * One beat's line from a pool of name-templates, redrawn once from the lines that agree where the first draw
   * names a market the roster lacks; null when no line of the pool agrees.
   * A row may carry its declaration (`{ text, needs?, excludes?, crisis? }`, R-C): read through `textOf`, byte-identical;
   * CENSUS-1c's wiring enforces it.
   * @param {ReadonlyArray<import('../../data/arrivalProse.js').ArrivalLine>} pool
   */
  const agreeingLine = (pool, /** @type {string} */ poolId, /** @type {boolean} */ scoped) => {
    const line = drawAdmitted(pool, { poolId, scoped, facts, speaks: (l) => speaks(textOf(l)(name)) });
    return line == null ? null : textOf(line)(name);
  };
  // SIGHT: a landmark the native institutions imply, else the culture's built detail.
  let sight = null;
  if (!underStress) {
    sight = checkInstCompat(institutions, tier, config.priorityMagic ?? 50);
    if (sight && !speaks(sight)) sight = null;
    if (!sight) {
      const materialized = typeof culturalIdentity?.architecturalDetail === 'string'
        ? culturalIdentity.architecturalDetail.trim()
        : '';
      const profileKey = resolveCultureProfileKey(config.culture || 'germanic');
      const profile = CULTURE_PROFILES[profileKey];
      const details = profile?.architecturalDetails || [];
      // W2-FIX-DATA-4 (REVIEW-W2A-3 #183; ROUND-3 #87 #112 #117): the materialized detail was chosen in resolveConfig, which
      // answers only the tier; here the record is whole, so the row it came from is held to its own declaration too (a
      // palisade, a river, a bathhouse). Refused there (and not already redrawn for a market it lacks), the sight beat is
      // left out: no redraw, so no draw is added and no later beat moves (a redraw would land small places on a line their
      // size makes false).
      const materializedRefused = architecturalDetailRefused(materialized, profileKey, facts); // W2-FIX-DATA-12 item 2: the one reading, the PDF's too
      const drawnDetail = (!materialized || !speaks(materialized)) && details.length
        ? drawAdmitted(details, { poolId: `CULTURE_PROFILES.${profileKey}.architecturalDetails`, scoped: false, facts, speaks: (d) => speaks(textOf(d)), cleanOnly: Boolean(materialized) })
        : null;
      const detail = materialized && speaks(materialized) ? (materializedRefused ? '' : materialized) : (drawnDetail == null ? '' : textOf(drawnDetail)); // R-C (CENSUS-2d); CENSUS-1f: the redraw-once, declared
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
  const senseField = chosen?.dominant ? 'dominant' : 'lines';
  const senseLine = sensePool?.length && chosen ? agreeingLine(sensePool, `ARRIVAL_SENSES.${chosen.sense.key}.${senseField}`, sensesScoped.has(`${chosen.sense.key}.${senseField}`)) : null;

  // PEOPLE: the culture, shown.
  const peopleKey = ARRIVAL_PEOPLE[resolveCultureProfileKey(config.culture || 'germanic')] ? resolveCultureProfileKey(config.culture || 'germanic') : 'mixed';
  const peoplePool = ARRIVAL_PEOPLE[peopleKey];
  const peopleLine = peoplePool?.length ? agreeingLine(peoplePool, `ARRIVAL_PEOPLE.${peopleKey}`, ARRIVAL_CRISIS_SCOPED.ARRIVAL_PEOPLE.includes(peopleKey)) : null;

  // CLOSING: one more visible truth, none under a vignette.
  const closing = underStress ? null : chooseClosing(settlement, magicReal);
  const tensionKey = closing ? keyOfPool(ARRIVAL_TENSIONS, closing.pool) : undefined;
  const memoryKey = closing && !tensionKey ? keyOfPool(ARRIVAL_MEMORIES, closing.pool) : undefined;
  const closingPick = closing ? drawAdmitted(closing.pool, {
    poolId: tensionKey ? `ARRIVAL_TENSIONS.${tensionKey}` : `ARRIVAL_MEMORIES.${memoryKey}`,
    scoped: tensionKey ? ARRIVAL_CRISIS_SCOPED.ARRIVAL_TENSIONS.includes(tensionKey) : ARRIVAL_CRISIS_SCOPED.ARRIVAL_MEMORIES.includes(String(memoryKey)),
    facts,
  }) : null;
  const closingLine = closingPick == null ? null : textOf(closingPick)(name); // CENSUS-1f: the redraw-once, declared

  return [hook, sight, senseLine, peopleLine, closingLine].filter(Boolean).join(' ');
}
