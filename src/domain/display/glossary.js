/**
 * domain/display/glossary.js — THE GENERATED GLOSSARY (W-GUIDE-2 §6).
 *
 * "How to interpret everything." One pure derivation of glossary entries FROM
 * the code registries, so the reference can never drift from what the engine
 * actually does (the analytics-dictionary generate+freshness idiom). The SAME
 * derivation feeds two consumers: the runtime "what am I reading?" affordance
 * (SurveyorGlossary), and the committed human reference docs/glossary.md
 * (scripts/generate-glossary.mjs), pinned byte-identical by the freshness test.
 *
 * HONESTY GATE (§9): a definition never invents a world fact. Where the code
 * already carries the interpretation (BAND_HINT, a verb's label, a dial's
 * label), it is READ from code — zero authoring, zero drift. Where the code
 * carries only an enum of terms (capture rungs, strain/severity/magnitude
 * bands), a definition is authored HERE with a both-directions coverage pin
 * (tests/docs/glossaryFreshness.test.js), so a new engine term forces a new
 * entry and an orphaned definition fails.
 *
 * SCOPE (as registered today, W-COMPOSER-2 will extend the manifest later):
 * event verbs + dials (the affordance manifest), stability bands (state/bands),
 * strain bands (capacityModel), capture rungs (corruption), and the severity /
 * magnitude dial vocabularies. DEFERRED, documented: institution FACETS (their
 * vocabulary is un-exported inside src/domain/spatial/cohesionWeave.js — the
 * spatial lane this wave must not touch) and the continuous CREDIBILITY stock
 * (a weight, not a labelled ladder — no discrete terms to name yet).
 *
 * FIRST-PAINT: imported only by the lazy glossary affordance (and the node
 * generator + tests). It reads small legend exports from engine modules that
 * are already eager, so it adds no first-paint bytes; the affordance's lazy
 * mount keeps this module off the entry closure (guarded in vendorPdfLazy).
 *
 * @enforced-by tests/docs/glossaryFreshness.test.js (byte-identity + coverage)
 */

import { authorableVerbs, STRESSOR_SEVERITY_VALUES, RELIEF_MAGNITUDE_VALUES } from '../events/affordanceManifest.js';
import { BAND_HINT } from '../state/bands.js';
import { CAPACITY_BANDS } from '../capacityModel.js';
import { CAPTURE_LADDER } from '../corruption.js';
// W-COMPOSER-2: the realm verbs join the reference. NOTE the import weight —
// realmManifest rides the engine tree; the glossary is a lazy reference
// surface, so the chunk cost is runtime-only (zero first-paint; the dist
// guard's GLOSSARY_LAZY_SENTINEL still enforces the lazy boundary).
import { realmVerbs } from '../events/realmManifest.js';
import { slugify } from '../../kernel/slugify.js';

/** The schema-owned loose record alias (the affordanceManifest Mut idiom).
 * @typedef {NonNullable<import('../settlement.schema.js').SimSettlement['config']>} Loose */

export const GLOSSARY_LAZY_SENTINEL = 'GLOSSARY_LAZY_SENTINEL';

/** kebab-case a term into a stable anchor-safe slug (the ONE slugify primitive).
 * @param {unknown} s */
const slug = (s) => slugify(String(s));

/** A concise title-cased term from an ENUM key or event type.
 * @param {string} key */
function titleize(key) {
  return String(key)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Authored definitions (both-directions coverage-pinned) ───────────────────
// Terms whose CODE carries only an enum of names, not an interpretation. If the
// engine adds a term, the freshness test reds until it gets a definition here;
// an orphan here (a term the engine dropped) also reds. Never invents a fact —
// each line states what the band/rung MEANS in the simulation.

/** capacityModel CAPACITY_BANDS — the strain instrument. */
const STRAIN_DEFS = Object.freeze({
  surplus:   'More capacity than the settlement needs. A cushion against a bad season.',
  adequate:  'Supply meets demand. The settlement is not straining here.',
  strained:  'Demand is outrunning supply; the margin is thin and a shock would bite.',
  critical:  'Supply is far short of demand. This capacity is close to failing.',
  collapsed: 'Demand dwarfs supply; the function has effectively broken down.',
  absent:    'Neither supplied nor demanded. The capacity does not exist here at all.',
});

/** corruption CAPTURE_LADDER — how far a criminal interest has taken a seat. */
const CAPTURE_DEFS = Object.freeze({
  none:        'No criminal capture. The seat answers to its lawful holder.',
  adversarial: 'A criminal interest is pushing at the seat, and the seat is pushing back.',
  equilibrium: 'The lawful holder and the criminal interest have reached an uneasy standoff.',
  corrupted:   'The criminal interest now bends the seat to its ends more often than not.',
  capture:     'The seat is captured. The criminal interest owns its decisions outright.',
});

/** affordanceManifest STRESSOR_SEVERITY_VALUES — the severity dial. */
const SEVERITY_DEFS = Object.freeze({
  minor:    'A light touch — the stressor nudges the settlement without upending it.',
  moderate: 'A real strain the settlement must reckon with, short of a crisis.',
  severe:   'A heavy blow — the stressor forces the settlement toward crisis.',
});

/** affordanceManifest RELIEF_MAGNITUDE_VALUES — the generosity magnitude dial. */
const MAGNITUDE_DEFS = Object.freeze({
  token:    'A gesture — a small share of the giver’s surplus above its own floor.',
  measured: 'A considered gift — a meaningful share of the surplus, kept sustainable.',
  generous: 'An open hand — most of the giver’s surplus above its floor goes out.',
});

// ── The compendium deep-link map per category (?tab= + #anchor exist) ─────────
const LINK = Object.freeze({
  verb:            { tab: 'living', anchor: 'living' },
  'stability-band': { tab: 'stress', anchor: 'stress' },
  'strain-band':   { tab: 'stress', anchor: 'stress' },
  'capture-rung':  { tab: 'power', anchor: 'power' },
  severity:        { tab: 'stress', anchor: 'stress' },
  magnitude:       { tab: 'stress', anchor: 'stress' },
});

/**
 * @typedef {Object} GlossaryEntry
 * @property {string} id          — stable slug (the affordance lookup key).
 * @property {string} term        — the display term.
 * @property {string} category    — verb | stability-band | strain-band | capture-rung | severity | magnitude.
 * @property {string} definition  — one honest sentence (code-read or authored).
 * @property {string} [family] - the verb family (verbs only).
 * @property {string[]} [dials] - the dial labels a verb exposes (verbs only).
 * @property {string} tab         — the compendium tab the lifeline deep-links to.
 * @property {string} anchor      — the compendium #anchor.
 */

/** A code-DERIVED (never invented) one-liner for a REALM order (W-COMPOSER-2:
 * stages as a proposal; deferred lanes say so honestly).
 * @param {Loose} verb */
function realmVerbDefinition(verb) {
  const dials = (verb.dials || []).map((/** @type {{ label?: string }} */ d) => d.label).filter(Boolean);
  const base = verb.lane === 'deferred'
    ? `A ${verb.family} order registered but deferred with its wave's own seam`
    : `A ${verb.family} order the DM stages as a proposal; approval applies through the world's own machinery`;
  if (dials.length === 0) return `${base}.`;
  const list = dials.length === 1 ? dials[0] : `${dials.slice(0, -1).join(', ')} and ${dials[dials.length - 1]}`;
  return `${base}, with ${dials.length === 1 ? 'the option' : 'options'} ${list}.`;
}

/** A code-DERIVED (never invented) one-liner for an event verb (the manifest's
 * loose open-entry shape — the affordanceManifest Mut idiom).
 * @param {Loose} verb */
function verbDefinition(verb) {
  const dials = (verb.dials || []).map((/** @type {{ label?: string }} */ d) => d.label).filter(Boolean);
  const article = /^[aeiou]/i.test(verb.family) ? 'An' : 'A';
  const base = `${article} ${verb.family} verb the DM can apply to the settlement`;
  if (dials.length === 0) return `${base}.`;
  const list = dials.length === 1 ? dials[0] : `${dials.slice(0, -1).join(', ')} and ${dials[dials.length - 1]}`;
  return `${base}, with ${dials.length === 1 ? 'the option' : 'options'} ${list}.`;
}

/**
 * THE DERIVATION — build every glossary entry from the live registries. Pure,
 * deterministic (stable registry order), dependency-only. Returns a frozen array.
 * @returns {ReadonlyArray<GlossaryEntry>}
 */
export function buildGlossaryEntries() {
  /** @type {GlossaryEntry[]} */
  const out = [];

  // Event verbs + dials (affordance manifest, registry order).
  for (const verb of authorableVerbs()) {
    out.push({
      id: `verb-${slug(verb.type)}`,
      term: verb.label,
      category: 'verb',
      definition: verbDefinition(verb),
      family: verb.family,
      dials: (verb.dials || []).map((/** @type {{ label?: string }} */ d) => d.label).filter(Boolean),
      ...LINK.verb,
    });
  }

  // Realm verbs (W-COMPOSER-2 — the realm affordance manifest, registry order;
  // the loose open-entry read — the affordanceManifest Mut idiom).
  for (const verb of /** @type {Loose[]} */ (/** @type {unknown} */ (realmVerbs()))) {
    out.push({
      id: `verb-${slug(verb.verb)}`,
      term: verb.label,
      category: 'realm-verb',
      definition: realmVerbDefinition(verb),
      family: verb.family,
      dials: /** @type {string[]} */ ((verb.dials || []).map((/** @type {{ label?: string }} */ d) => d.label).filter(Boolean)),
      ...LINK.verb,
    });
  }

  // Stability bands (state/bands) — definition READ from BAND_HINT (zero drift).
  for (const [band, hint] of Object.entries(BAND_HINT)) {
    out.push({
      id: `stability-${slug(band)}`,
      term: band,
      category: 'stability-band',
      definition: hint,
      ...LINK['stability-band'],
    });
  }

  // Strain bands (capacityModel) — authored, coverage-pinned.
  for (const band of CAPACITY_BANDS) {
    out.push({
      id: `strain-${slug(band)}`,
      term: titleize(band),
      category: 'strain-band',
      definition: /** @type {Record<string, string>} */ (STRAIN_DEFS)[band],
      ...LINK['strain-band'],
    });
  }

  // Capture rungs (corruption) — authored, coverage-pinned.
  for (const rung of CAPTURE_LADDER) {
    out.push({
      id: `capture-${slug(rung)}`,
      term: titleize(rung),
      category: 'capture-rung',
      definition: /** @type {Record<string, string>} */ (CAPTURE_DEFS)[rung],
      ...LINK['capture-rung'],
    });
  }

  // Severity dial (STRESSOR_SEVERITY_VALUES) — authored, coverage-pinned.
  for (const level of Object.keys(STRESSOR_SEVERITY_VALUES)) {
    out.push({
      id: `severity-${slug(level)}`,
      term: titleize(level),
      category: 'severity',
      definition: /** @type {Record<string, string>} */ (SEVERITY_DEFS)[level],
      ...LINK.severity,
    });
  }

  // Magnitude dial (RELIEF_MAGNITUDE_VALUES) — authored, coverage-pinned.
  for (const level of Object.keys(RELIEF_MAGNITUDE_VALUES)) {
    out.push({
      id: `magnitude-${slug(level)}`,
      term: titleize(level),
      category: 'magnitude',
      definition: /** @type {Record<string, string>} */ (MAGNITUDE_DEFS)[level],
      ...LINK.magnitude,
    });
  }

  return Object.freeze(out);
}

// The registries are frozen/static, so the derivation is invariant at runtime.
// buildGlossaryEntries stays PURE (recomputes — the generator + freshness test
// want the live derivation); runtime consumers read the memoized cache so a
// per-render lookup (an instrument affordance) never rebuilds 52 entries.
let _cache = null;
/** The memoized glossary (runtime consumers). @returns {ReadonlyArray<GlossaryEntry>} */
export function glossaryEntries() {
  return (_cache ||= buildGlossaryEntries());
}

/**
 * The retained glossary object — the sentinel rides a LIVE property so it
 * survives DCE into the lazy chunk (the non-vacuity idiom; consumers read
 * `.entries`).
 */
export const GLOSSARY = Object.freeze({
  sentinel: GLOSSARY_LAZY_SENTINEL,
  get entries() { return glossaryEntries(); },
});

/** Look up a single glossary entry by its stable id. @param {string} id */
export function glossaryEntryFor(id) {
  // Read through the retained GLOSSARY object (not glossaryEntries() directly)
  // so its sentinel survives DCE into the lazy chunk — the non-vacuity idiom.
  return GLOSSARY.entries.find((e) => e.id === id) || null;
}

/** Every glossary entry grouped by category (walker/reference helper). */
export function glossaryByCategory() {
  /** @type {Record<string, GlossaryEntry[]>} */
  const groups = {};
  for (const e of GLOSSARY.entries) (groups[e.category] ||= []).push(e);
  return groups;
}
