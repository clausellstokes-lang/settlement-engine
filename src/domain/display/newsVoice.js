/**
 * domain/display/newsVoice.js — THE CRIER'S VOICE SIDECAR.
 *
 * A pure DISPLAY read-model, cut from the same cloth as the W2 conjunction
 * ladder (causeConjunctionContent.js): it READS a wizardNews entry and returns
 * one short, speakable, register-appropriate line a herald/town-crier would
 * proclaim about that news — war, faith, or trade. It is byte-inert to the
 * engine:
 *
 *   • It NEVER mutates an entry — it reads a handful of fields and returns a
 *     string (or null for out-of-scope news).
 *   • It is imported ONLY by the lazy news panel
 *     (src/components/map/WizardNewsPanel.jsx, itself lazy(() => import(...))),
 *     so it rides the lazy chunk and adds ZERO first-paint bytes. It must NEVER
 *     be imported by generation or the world-pulse kernel (SAME-SEED / GOLDEN
 *     laws), and wizardNews.js must never import this.
 *   • Variant selection is a PURE FNV-1a hash of a stable string — no rng
 *     stream, no Date, no wall-clock. Same entry ⇒ same line, always; two
 *     entries in the same cell with distinct ids generally get distinct
 *     variants (anti-repetition), exactly as the conjunction ladder seeds off
 *     the npc id.
 *
 * The voice is diegetic and settlement-AGNOSTIC: it says "the town", "the
 * front", "the market roads", "the faithful" — never a place name (the panel
 * already shows settlement pills), which keeps the module a pure (entry) → line.
 */

/** FNV-1a 32-bit — the pure variant-selection hash (no rng, no Date).
 *  A LOCAL copy of the 8-line helper (the conjunction module is deliberately
 *  NOT imported: it drags large content tables into the news chunk).
 *  @param {string} str */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** @typedef {'war'|'faith'|'trade'} VoiceCategory */
/** @typedef {'onset'|'impact'|'relief'|'fade'} VoiceBucket */

// ── Category vocabularies (the categorization precedence) ────────────────────
// impactKind-PRIMARY: the impact's NATURE classifies first, across all three
// beats (faith → war → trade); channelType is only the fallback when impactKind
// did not classify (bare/persisted entries). Mirrors the impactKind /
// channelType vocabulary in domain/region/wizardNews.js WITHOUT importing it.
// NB: resource_competition is a WAR channel — the engine only ever mints it
// alongside conflict_pressure, never as a bare trade beat.

/** @type {ReadonlySet<string>} */
const WAR_IMPACT_KINDS = new Set(['conflict_pressure', 'protection_gap']);
/** @type {ReadonlySet<string>} */
const WAR_CHANNEL_TYPES = new Set(['war_front', 'military_protection', 'resource_competition']);
/** @type {ReadonlySet<string>} */
const TRADE_IMPACT_KINDS = new Set([
  'import_shortage', 'export_market_loss', 'route_disruption', 'tax_revenue_disruption',
]);
/** @type {ReadonlySet<string>} */
const TRADE_CHANNEL_TYPES = new Set(['trade_dependency', 'trade_route']);

/**
 * THE CONTENT MAP — VOICE_LINES[category][bucket] is a frozen array of >=3
 * distinct, speakable herald lines. Every (war|faith|trade) × (onset|impact|
 * relief|fade) = 12 cells is authored; VOICE_FLOOR (below) guarantees totality
 * for any future bucket. Each line is self-contained, settlement-agnostic,
 * ends in terminal punctuation, and carries no template tokens.
 * @type {Readonly<Record<VoiceCategory, Readonly<Record<VoiceBucket, ReadonlyArray<string>>>>>}
 */
export const VOICE_LINES = Object.freeze({
  war: Object.freeze({
    onset: Object.freeze([
      'Steel is drawn along the marches — the muster horns have not stopped since dawn.',
      'Hear it and mark it: a war is gathering at the borders, and the levy is called to the walls.',
      'The watchfires are doubled and the roads run thick with soldiers; the town braces for what is coming.',
      'Grievance has hardened into muster, and the drums along the front will not be quieted.',
    ]),
    impact: Object.freeze([
      'The blow has fallen; smoke stands where the watchfires were.',
      'War has come in earnest — the fighting is upon the front, and the wounded are already carried back.',
      'The clash is joined, and the town counts its dead before it counts the cost.',
      'Steel has met steel at the front; what was feared is now simply true.',
    ]),
    relief: Object.freeze([
      'The banners are furled and the wounded carried home — this front, at least, goes quiet.',
      'The fighting has ebbed; the drums are silent and the muster horns hung up at last.',
      'Peace of a kind holds along the marches, and the levy may sleep in its own beds tonight.',
      'The war has spent itself here — the roads are safe again, and the widows begin their mourning.',
    ]),
    fade: Object.freeze([
      'The threatened war never came to the sword; the levy stands down, grumbling.',
      'The muster is dismissed — the threatened war never marched, and the horns fall quiet unblooded.',
      'Whatever gathered at the borders has thought better of it; the walls are unmanned and the drums put away.',
      'The alarm came to nothing — no steel was drawn, and the town returns to its plows.',
    ]),
  }),
  faith: Object.freeze({
    onset: Object.freeze([
      'The temples stir — a fervor is rising that the priests did not summon and cannot yet name.',
      'Hear the bells rung out of hour: something moves among the faithful, and the pews will not stay empty.',
      'A holy wind is gathering; the pilgrims are on the roads and the prayers grow loud.',
      'The altars are crowded and the incense thick — a great devotion is coming over the people.',
    ]),
    impact: Object.freeze([
      'The fervor has taken the town; every knee is bent and every voice raised to one name.',
      'The faith has broken over the people like a wave — the temples overflow and the doubters have gone silent.',
      'What stirred in the temples now rules the streets; the devout carry their conviction like a torch.',
      'The revival is upon us in full — the priests scarcely lead it, so hard does it pull.',
    ]),
    relief: Object.freeze([
      'The pilgrims disperse; whatever moved the faithful has, for now, moved on.',
      'The fervor has cooled to embers, and the temples keep their ordinary hours once more.',
      'The great devotion has passed its peak; the roads empty and the bells ring on their proper hours.',
      'Calm returns to the altars — the people have prayed their fill and gone back to their labors.',
    ]),
    fade: Object.freeze([
      'The kindling of faith never caught; the pilgrims turned for home and the pews stand empty again.',
      'The stir at the temples came to little — a season of talk, and the devout no more numerous than before.',
      'Whatever the priests feared or hoped for has guttered out; the altars are as quiet as ever.',
      'The looked-for revival did not come; the incense is packed away and the bells keep their old silence.',
    ]),
  }),
  trade: Object.freeze({
    onset: Object.freeze([
      'The caravan-masters trade worried looks — a shortage is riding in ahead of the wagons.',
      'Mark the market roads: a want is coming, and the wise are laying in stores while they can.',
      'The convoys run thin and the guilds mutter; hard bargaining is on the way.',
      'Word runs ahead of the wagons that the goods will not come as they should — best fill the larder now.',
    ]),
    impact: Object.freeze([
      'The market has felt it: shelves thin, prices climb, and the guilds count what is left.',
      'The shortage has bitten — the stalls stand half-empty and every coin buys less than it did.',
      'The want is upon the market roads in full; the merchants ration and the poor go without.',
      'Trade has faltered and the town feels the pinch, from the guildhall down to the humblest cart.',
    ]),
    relief: Object.freeze([
      'The roads run sweet again — the missing goods came in on the last convoy.',
      'The wagons are rolling once more; the stalls fill and the prices ease back toward reason.',
      'The shortage has broken — the caravans are through and the market breathes again.',
      'Plenty returns to the market roads, and the guilds breathe easy at last.',
    ]),
    fade: Object.freeze([
      'The feared shortage never came; the wagons rolled in as they should and the worry was for nothing.',
      'The market held after all — the trouble passed the town by, and the stalls stayed full.',
      "The caravan-masters' fears proved idle; the goods arrived as ever and the prices never stirred.",
      'Whatever threatened the trade roads came to naught; the ledgers close as black as before.',
    ]),
  }),
});

/**
 * PER-CATEGORY FLOOR — generic lines used only if a (category × bucket) cell is
 * ever missing (guarantees totality for future buckets). >=2 lines each.
 * @type {Readonly<Record<VoiceCategory, ReadonlyArray<string>>>}
 */
export const VOICE_FLOOR = Object.freeze({
  war: Object.freeze([
    'Word of the war moves along the front, and the town listens for the drums.',
    'The matter of arms stands unsettled, and every ear is turned toward the marches.',
    'News of the fighting passes hand to hand, and the watch keeps a wary eye on the road.',
  ]),
  faith: Object.freeze([
    'Word of the faith moves among the temples, and the people turn to hear it.',
    'The matter of devotion stirs the congregation, and the priests weigh what it means.',
    'News from the altars passes pew to pew, and the faithful mark it well.',
  ]),
  trade: Object.freeze([
    'Word of the trade moves along the market roads, and the guilds take note.',
    'The matter of goods and coin stirs the merchants, and the caravan-masters listen close.',
    'News of the markets passes stall to stall, and the town reckons its stores.',
  ]),
});

/**
 * Categorize a wizardNews entry into the crier's beat. impactKind-PRIMARY;
 * channelType is the fallback. impactKind (the impact's nature) classifies
 * first across all three beats (faith → war → trade); only when impactKind did
 * not classify does channelType decide (bare/persisted entries). Deterministic
 * and total. Out-of-scope entries (authority, migration, crime, information,
 * service, …) return null and the panel renders no voice line.
 * @param {{ impactKind?: string|null, channelType?: string|null }|null|undefined} entry
 * @returns {VoiceCategory|null}
 */
export function newsVoiceCategory(entry) {
  if (!entry) return null;
  const impactKind = entry.impactKind || '';
  const channelType = entry.channelType || '';
  // impactKind is the impact's NATURE — it classifies first, across all three beats.
  if (impactKind === 'religious_pressure') return 'faith';
  if (WAR_IMPACT_KINDS.has(impactKind)) return 'war';
  if (TRADE_IMPACT_KINDS.has(impactKind)) return 'trade';
  // channelType is only a fallback when impactKind did not classify (bare/persisted entries).
  if (WAR_CHANNEL_TYPES.has(channelType)) return 'war';
  if (TRADE_CHANNEL_TYPES.has(channelType)) return 'trade';
  return null;
}

/**
 * Map an entry's transition (entry.kind) to its voice bucket. Total: any
 * unknown/missing transition falls back to 'onset'.
 * @param {string|null|undefined} kind
 * @returns {VoiceBucket}
 */
function bucketFor(kind) {
  switch (kind) {
    case 'queued':
    case 'ready':
      return 'onset';
    case 'applied':
      return 'impact';
    case 'resolved':
      return 'relief';
    case 'ignored':
    case 'expired':
      return 'fade';
    default:
      return 'onset';
  }
}

/**
 * THE READ-MODEL — resolve one wizardNews entry to a single speakable crier's
 * line, or null when the entry is out of scope. Deterministic: same entry ⇒
 * same line, always. Distinct entry ids in the same cell generally reach
 * distinct variants (anti-repetition via the FNV seed).
 * @param {{ id?: string|number|null, kind?: string|null, impactKind?: string|null, channelType?: string|null }|null|undefined} entry
 * @returns {string|null}
 */
export function newsVoiceLine(entry) {
  if (!entry) return null;
  const cat = newsVoiceCategory(entry);
  if (cat === null) return null;
  const bucket = bucketFor(entry.kind);
  // Fall through to the category floor on a missing OR empty cell — an empty
  // array is truthy and would yield variants[NaN] === undefined.
  const cell = VOICE_LINES[cat][bucket];
  const variants = (cell && cell.length) ? cell : VOICE_FLOOR[cat];
  const seed = String(entry.id ?? '');
  const h = fnv1a32(`${seed}::${cat}:${bucket}`);
  return variants[h % variants.length];
}
