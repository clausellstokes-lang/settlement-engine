/**
 * undercity/strataExistence.js — THE UNDERGROUND EXISTENCE GATE (ODQ §311.1), the first car of
 * the undercity train (MF-UC0; charter draft-UNDERCITY-PLAN.md §4 UC-0, ruled ODQ §441,
 * ratified §445.2).
 *
 * The owner's law, verbatim: "the underground SHEET appears ONLY if the settlement actually has
 * qualifying subterranean institutions — sewers, crypts, cellars and their kin. No qualifying
 * seed → no sheet. … seed classes are TYPED sources with dossier homes (sanitation
 * infrastructure at the tiers that earn it; crypt-bearing institutions; cellar-bearing
 * commerce; mine/quarry workings where terrain licenses them)." This leaf IS the fact-licensed
 * StrataExistencePlan §287.4 names, at the engine: `deriveStrataExistence(settlement)` →
 * `{ exists, seeds[], refused[] }`, every seed row carrying its class, its licensing fact and
 * its dossier home — the receipts CT-4 cites (§7 F1) and the D5 strata fabric consumes.
 *
 * LAWS THIS LEAF KEEPS:
 *  - A PURE DERIVER at the domain root (the ageBands / T2R / T2Q precedent): generation never
 *    imports it, nothing is written, the generator golden is byte-identical — PROVEN at S0.
 *  - Institutions resolve through THE FACET CHOKEPOINT `facetOf` (cohesionWeave §I) ONLY —
 *    never a name string in this file, so a custom institution declaring a facet counts exactly
 *    like the catalog row (custom-content parity). The keys read are the catalog's OWN
 *    spellings: `subterranean` (declared on the three 'Underground network' rows) and the
 *    inference-only kind `institutionSubstructure` (crypt | cellar | sewer | mine | none) this
 *    car mints in FACET_INFERENCE. ⚠ NOT the precedent's `institutionFunction` key —
 *    clandestineFacet.js:50 reads the wrong kind (estate defect D-8 / HK-1, cured by its own
 *    car, never here).
 *  - ONE TRUTH WITH UC-1 (§441.1): the sanitation seed reads the SAME roster institution UC-1's
 *    FULL WEB rung reads — `sanitationRosterOf` is the shared read — and §311.7.1's "cesspits
 *    contribute no sheet" is stated as rung ≥ culvert over the closed SANITATION_LADDER that
 *    UC-1 imports from here. The derived-rung route is fed by the optional second argument;
 *    absent (UC-1 unbuilt), the roster read stands alone.
 *  - THE CATALOG'S OWN FORBIDDANCE IS HONOURED: a seed whose row forbids a resource the
 *    settlement's NATIVE roster carries (`forbiddenResources` — 'marshlands' /
 *    'fertile_floodplain' on the subterranean rows: "tunnels flood") is REFUSED, reported in
 *    `refused[]`, and never counts. Read the way assembleInstitutions.js refuses it: the same
 *    `nativeSemanticResourceKeys` projection, the same list.
 *  - THE ANCHOR KEY (§441.5(k)): rows anchor by the registry's stable name key — the
 *    generation-stamped `catalogId`, else the catalog's own slug of the name, else the name
 *    itself for unstamped custom rows — never the display name. ⚠ `id` is NOT read: no writer
 *    produces it on an institution today (the observed-shape corpus; 18 banked readers), so the
 *    `id`-precedence rung is DEFERRED to the entity-registry migration that mints it (packet
 *    deferred row D-UC0-1). Behaviour on every live world is identical.
 *  - FIRST-PAINT CLOSURE (§441.5(d)): `src/domain/undercity/**` never imports
 *    `src/domain/townMap/**`. Consumers are dormant or lazy (CT-4 prose, D5 fabric, UC-1..UC-5).
 *  - FINITE SEMANTICS: every vocabulary is closed and frozen; no scalar here reads as tuning.
 *  - PURITY: no clock, no ambient randomness, no locale or internationalization read, no I/O;
 *    iteration is ordered by `compareCodepoint`, the estate's one sanctioned string order.
 */
import { facetOf } from '../spatial/cohesionWeave.js';
import { resolveSettlementTerrain } from '../resolveTerrain.js';
import { nativeSemanticResourceKeys } from '../content/customContentSemanticAuthority.js';
import { compareCodepoint } from '../deterministicSort.js';
import { institutionalCatalog, catalogIdForName } from '../../data/institutionalCatalog.js';

/** @typedef {'sanitation'|'crypt'|'cellar'|'mine'|'subterranean'} SeedClass */
/** @typedef {'cesspits'|'culvert'|'quarter_network'|'full_web'} SanitationRung */
/** @typedef {'INSTITUTION_FACET'|'DERIVED_RUNG'} SeedLicence */
/** @typedef {'institutions'|'sanitation_ladder'} SeedHome */
/** @typedef {'FORBIDDEN_RESOURCE'} SeedRefusal */

/**
 * @typedef {Object} SeedInstitution
 * @property {unknown} [name]
 * @property {unknown} [catalogId]
 * @property {unknown} [forbiddenResources]
 * @property {unknown} [facets]
 * @property {unknown} [tags]
 * @property {unknown} [type]
 * @property {unknown} [category]
 */

/**
 * @typedef {Object} SeedRow
 * @property {SeedClass} class        the closed seed class (§311.1)
 * @property {SeedLicence} licence    what licenses it: the institution's facet, or UC-1's derived rung
 * @property {SeedHome} home          the dossier home CT-4 cites
 * @property {string|null} anchor     the canonical institution key (§441.5(k)); null for the ladder seed
 * @property {string|null} name       the institution's display name, a receipt — never the anchor
 * @property {string} facetKind       the facet kind read through `facetOf` (or the ladder's own name)
 * @property {string} facetValue      the resolved value (the seed class's facet spelling, or the rung)
 * @property {string|null} terrain    the settlement's resolved terrain class (resolveTerrain) — a receipt
 */

/**
 * @typedef {SeedRow & { refusal: SeedRefusal, resources: string[] }} RefusedRow
 */

/**
 * @typedef {Object} StrataExistence
 * @property {boolean} exists         the SHEET exists — at least one lawful seed (§311.1)
 * @property {SeedRow[]} seeds        every lawful seed, ordered by anchor then class
 * @property {RefusedRow[]} refused   seeds the catalog's own forbiddance refuses (tunnels flood)
 * @property {'STRATA_EXISTENCE_V1'} derivation  frozen; changing any rule is a declared shift
 */

/** The doctrine's four typed seed classes plus the declared-subterranean kin ('and their kin').
 *  @type {ReadonlyArray<SeedClass>} */
export const SEED_CLASSES = Object.freeze(/** @type {SeedClass[]} */ (['sanitation', 'crypt', 'cellar', 'mine', 'subterranean']));

/** §311.7.1's ladder, bottom to top. Cesspits contribute no sheet; culvert and above do.
 *  UC-1 imports THIS list — one truth for the rung names. @type {ReadonlyArray<SanitationRung>} */
export const SANITATION_LADDER = Object.freeze(/** @type {SanitationRung[]} */ (['cesspits', 'culvert', 'quarter_network', 'full_web']));

/** The two licences a seed row can carry. @type {ReadonlyArray<SeedLicence>} */
export const SEED_LICENCES = Object.freeze(/** @type {SeedLicence[]} */ (['INSTITUTION_FACET', 'DERIVED_RUNG']));

/** The facet kind this car mints (inference-only) and the closed values it may resolve to.
 *  `none` is what the catalog's 'Access to …' rows infer (the church or mill is ELSEWHERE) and
 *  what a custom row may declare to override an inference it would otherwise earn. */
export const SUBSTRUCTURE_FACET_KIND = 'institutionSubstructure';
/** @type {ReadonlyArray<string>} */
export const SUBSTRUCTURE_VALUES = Object.freeze(['crypt', 'cellar', 'sewer', 'mine', 'none']);
/** The catalog's own declared key for the underground-network kin. */
export const SUBTERRANEAN_FACET_KIND = 'subterranean';

export const STRATA_EXISTENCE_DERIVATION = 'STRATA_EXISTENCE_V1';

/** substructure value → seed class (sewer licenses the SANITATION seed; `none` licenses nothing).
 *  @type {Readonly<Record<string, SeedClass>>} */
const SUBSTRUCTURE_TO_CLASS = Object.freeze({ sewer: 'sanitation', crypt: 'crypt', cellar: 'cellar', mine: 'mine' });

/** @param {unknown} v @returns {string[]} */
function stringList(v) {
  return Array.isArray(v) ? v.filter((x) => typeof x === 'string').map((x) => x.trim().toLowerCase()).filter(Boolean) : [];
}

/**
 * The catalog's forbiddance, derived at load from the catalog itself (one truth): per stable key,
 * the row's `forbiddenResources`; and per declared facet kind, the union over every row declaring
 * it — so a CUSTOM institution declaring `subterranean` inherits the class's "tunnels flood" rule
 * even when its author wrote no forbiddance of its own.
 * @returns {{ byKey: ReadonlyMap<string, string[]>, byFacetKind: ReadonlyMap<string, string[]> }}
 */
function buildCatalogForbiddance() {
  /** @type {Map<string, string[]>} */
  const byKey = new Map();
  /** @type {Map<string, Set<string>>} */
  const byFacet = new Map();
  for (const tier of Object.values(institutionalCatalog)) {
    for (const group of Object.values(tier)) {
      for (const [name, row] of Object.entries(group)) {
        const forbidden = stringList(row.forbiddenResources);
        if (forbidden.length === 0) continue;
        const key = catalogIdForName(name);
        if (key) byKey.set(key, forbidden);
        const facets = row.facets && typeof row.facets === 'object' ? Object.keys(row.facets) : [];
        for (const kind of facets) {
          const set = byFacet.get(kind) ?? new Set();
          for (const r of forbidden) set.add(r);
          byFacet.set(kind, set);
        }
      }
    }
  }
  /** @type {Map<string, string[]>} */
  const byFacetKind = new Map();
  for (const [kind, set] of byFacet) byFacetKind.set(kind, [...set].sort(compareCodepoint));
  return { byKey, byFacetKind };
}

const CATALOG_FORBIDDANCE = buildCatalogForbiddance();

/**
 * The canonical institution key (§441.5(k)): the generation-stamped `catalogId`, else the
 * catalog's own slug of the name (unstamped legacy rows), else the name itself (custom rows —
 * the registry's stable name key for content that carries no id). Null when there is no name.
 * @param {SeedInstitution|null|undefined} inst @returns {string|null}
 */
export function institutionAnchorKey(inst) {
  if (!inst || typeof inst !== 'object') return null;
  if (typeof inst.catalogId === 'string' && inst.catalogId !== '') return inst.catalogId;
  const name = typeof inst.name === 'string' ? inst.name.trim() : '';
  if (!name) return null;
  return catalogIdForName(name) ?? name;
}

/**
 * THE SHARED ROSTER READ (§441.1, one truth with UC-1): every institution that resolves —
 * through the facet chokepoint — to the `sewer` substructure: the catalog's 'Sewage system' by
 * inference, or a custom institution declaring `institutionSubstructure: 'sewer'` (the
 * sanitation/drains facet). UC-1's FULL WEB rung exists exactly where this list is non-empty.
 * Ordered by anchor key. Total on garbage.
 * @param {ReadonlyArray<unknown>|null|undefined} institutions @returns {SeedInstitution[]}
 */
export function sanitationRosterOf(institutions) {
  const rows = Array.isArray(institutions) ? institutions : [];
  /** @type {SeedInstitution[]} */
  const out = [];
  for (const raw of rows) {
    if (!raw || typeof raw !== 'object') continue;
    const inst = /** @type {SeedInstitution} */ (raw);
    if (facetOf(inst, SUBSTRUCTURE_FACET_KIND) === 'sewer') out.push(inst);
  }
  return out.sort((a, b) => compareCodepoint(institutionAnchorKey(a), institutionAnchorKey(b)));
}

/**
 * §311.7.1 as a predicate: cesspits contribute no sheet; culvert / quarter network / full web do.
 * An unknown rung is not a seed (closed vocabulary; never a guess).
 * @param {unknown} rung @returns {boolean}
 */
export function sanitationRungSeeds(rung) {
  const i = typeof rung === 'string' ? SANITATION_LADDER.indexOf(/** @type {SanitationRung} */ (rung)) : -1;
  return i >= 1;
}

/**
 * The seed classes one institution licenses, through the chokepoint only: the declared
 * `subterranean` kin, and the `institutionSubstructure` value (declared or inferred) mapped to
 * its class. `none`, null and any value outside the closed set license nothing.
 * @param {SeedInstitution} inst @returns {Array<{ cls: SeedClass, facetKind: string, facetValue: string }>}
 */
function seedClassesOf(inst) {
  /** @type {Array<{ cls: SeedClass, facetKind: string, facetValue: string }>} */
  const out = [];
  if (facetOf(inst, SUBTERRANEAN_FACET_KIND) === SUBTERRANEAN_FACET_KIND) {
    out.push({ cls: 'subterranean', facetKind: SUBTERRANEAN_FACET_KIND, facetValue: SUBTERRANEAN_FACET_KIND });
  }
  const sub = facetOf(inst, SUBSTRUCTURE_FACET_KIND);
  const cls = sub != null ? SUBSTRUCTURE_TO_CLASS[sub] : undefined;
  if (sub != null && cls) out.push({ cls, facetKind: SUBSTRUCTURE_FACET_KIND, facetValue: sub });
  return out;
}

/**
 * The resources this seed's row forbids, from three spellings of one truth: the row's own
 * `forbiddenResources`, the catalog row it was stamped from, and the class union for every
 * declared facet kind the catalog forbids (a custom `subterranean` row inherits 'tunnels flood').
 * @param {SeedInstitution} inst @param {string|null} anchor @param {string} facetKind @returns {string[]}
 */
function forbiddanceOf(inst, anchor, facetKind) {
  const set = new Set(stringList(inst.forbiddenResources));
  for (const r of (anchor && CATALOG_FORBIDDANCE.byKey.get(anchor)) || []) set.add(r);
  for (const r of CATALOG_FORBIDDANCE.byFacetKind.get(facetKind) || []) set.add(r);
  return [...set].sort(compareCodepoint);
}

/**
 * THE EXISTENCE GATE. Pure, total, deterministic: the same settlement (and the same optional
 * derived rung) yields the same result; no draw is taken. Absent institutions ⇒ no seeds ⇒ the
 * sheet does not exist. The two-level reading's FIRST level only (§311.4): the undercity proper
 * (criminal-economic colonization) is UC-4's predicate, not this one.
 * @param {{ institutions?: unknown, config?: unknown }|null|undefined} settlement
 * @param {{ sanitationRung?: unknown }} [context]  UC-1's derived rung once it lands; absent ⇒ roster only
 * @returns {StrataExistence}
 */
export function deriveStrataExistence(settlement, context = {}) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const config = s.config && typeof s.config === 'object' ? /** @type {Record<string, unknown>} */ (s.config) : null;
  const terrain = resolveSettlementTerrain(s);
  const native = new Set(nativeSemanticResourceKeys(config).map((r) => r.trim().toLowerCase()));
  const rows = Array.isArray(s.institutions) ? s.institutions : [];
  /** @type {SeedRow[]} */
  const seeds = [];
  /** @type {RefusedRow[]} */
  const refused = [];
  for (const raw of rows) {
    if (!raw || typeof raw !== 'object') continue;
    const inst = /** @type {SeedInstitution} */ (raw);
    const anchor = institutionAnchorKey(inst);
    const name = typeof inst.name === 'string' ? inst.name : null;
    for (const { cls, facetKind, facetValue } of seedClassesOf(inst)) {
      /** @type {SeedRow} */
      const row = { class: cls, licence: 'INSTITUTION_FACET', home: 'institutions', anchor, name, facetKind, facetValue, terrain };
      const hit = forbiddanceOf(inst, anchor, facetKind).filter((r) => native.has(r));
      if (hit.length > 0) refused.push({ ...row, refusal: 'FORBIDDEN_RESOURCE', resources: hit });
      else seeds.push(row);
    }
  }
  const rung = context && typeof context === 'object' ? context.sanitationRung : undefined;
  if (sanitationRungSeeds(rung)) {
    seeds.push({
      class: 'sanitation', licence: 'DERIVED_RUNG', home: 'sanitation_ladder', anchor: null, name: null,
      facetKind: 'sanitationRung', facetValue: String(rung), terrain,
    });
  }
  const byAnchorThenClass = (/** @type {SeedRow} */ a, /** @type {SeedRow} */ b) =>
    compareCodepoint(a.anchor ?? '', b.anchor ?? '') || compareCodepoint(a.class, b.class);
  seeds.sort(byAnchorThenClass);
  refused.sort(byAnchorThenClass);
  return { exists: seeds.length > 0, seeds, refused, derivation: STRATA_EXISTENCE_DERIVATION };
}
