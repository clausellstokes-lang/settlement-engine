/**
 * components/townMap/provenanceModel.js — SM-5 (1) THE MAP EXPLAINS ITSELF.
 *
 * PURE, view-time, store-free formatting over the v2 town-layout model's retained
 * provenance (`model.provenance`, a Record<elementId, {sourceFamily, sourceRef,
 * effect}[]>) + the latent-advantage map (`model.latentAdvantages`) + the founding
 * response mode (`meta.responseMode`). The v2 engine records a NAMED CAUSE for every
 * deformation (the no-uniform-jitter enforcement); this module turns those data
 * annotations into display rows the hover card and the surveyor's-read panel show.
 *
 * DEGRADES GRACEFULLY (the InstitutionCard honesty gate, generalized): a v1 model
 * carries NO provenance and NO latentAdvantages (both `undefined`) — every reader
 * here returns its empty value, so a v1 map shows the affordance NOTHING, never a
 * broken/empty tooltip. It invents no prose: `sourceRef` is the engine's own
 * human-readable cause string, shown verbatim; only the machine `effect` label is
 * humanised, and an unknown effect falls back to a neutral phrase.
 *
 * No React, no store, no config, no theme — a formatter of an already-derived model.
 */

/** sourceFamily → a short display label. The v2 families are exactly these three. */
const FAMILY_LABEL = Object.freeze({
  region: 'The land',
  resource: 'A resource',
  habit: 'People’s habits',
});

/** effect → the human phrase for WHAT the cause did to the element. Unknown effects
 *  fall back to a neutral 'shaped by' so a future engine effect never renders raw. */
const EFFECT_LABEL = Object.freeze({
  'district-drift': 'drew this quarter toward it',
  'regional-grain': 'set the grain of the ground',
  'scar-shrink': 'scarred and shrank this quarter',
  'desire-path': 'wore a path here',
  'square-at-convergence': 'gathered a square where the paths meet',
  'wall-embrace': 'the wall bends to take it in',
  'site-water': 'placed the town on the water',
  'site-slope': 'set the town against the slope',
  'site-flats': 'set the town on the flats',
  'reconcile-hold': 'holds to its founding doctrine',
  'reconcile-planned': 'a planned move toward its site’s advantage',
  'reconcile-encroach': 'growth creeping toward what the site offers',
  'response-exploit': 'founded to exploit its site',
  'response-endure': 'founded to endure a hard site',
  'response-fortify': 'founded to defend',
});

/** The three founding response modes → a titled human label. */
const RESPONSE_LABEL = Object.freeze({
  exploit: 'Exploit — it took the advantage of its site',
  endure: 'Endure — it made peace with a hard site',
  fortify: 'Fortify — it was founded to defend',
});

/** A raw 0..1 latent strength → a coarse band (never a false-precision number). */
function latentBand(v) {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : 0;
  return n >= 0.66 ? 'strong' : n >= 0.33 ? 'moderate' : 'slight';
}

/** @param {string} effect */
export function effectLabel(effect) {
  return EFFECT_LABEL[effect] || 'shaped by';
}

/** @param {string} family */
export function familyLabel(family) {
  return FAMILY_LABEL[family] || 'A cause';
}

/**
 * @typedef {Object} ProvenanceRow
 * @property {string} family        region | resource | habit
 * @property {string} familyLabel
 * @property {string} ref           the engine's own cause string (verbatim)
 * @property {string} effect
 * @property {string} effectLabel
 */

/**
 * The provenance rows for one district id, or [] when the model carries none (a v1
 * model, or a district with no recorded cause). Pure; reads model.provenance only.
 * @param {{ provenance?: Record<string, Array<{sourceFamily:string, sourceRef:string, effect:string}>> }|null|undefined} model
 * @param {string|null|undefined} districtId
 * @returns {ProvenanceRow[]}
 */
export function districtProvenance(model, districtId) {
  const prov = model && typeof model === 'object' ? model.provenance : null;
  if (!prov || typeof prov !== 'object' || typeof districtId !== 'string') return [];
  const causes = prov[districtId];
  if (!Array.isArray(causes) || causes.length === 0) return [];
  const out = [];
  for (const c of causes) {
    if (!c || typeof c !== 'object') continue;
    const family = typeof c.sourceFamily === 'string' ? c.sourceFamily : '';
    const ref = typeof c.sourceRef === 'string' ? c.sourceRef : '';
    const effect = typeof c.effect === 'string' ? c.effect : '';
    if (!ref && !effect) continue;
    out.push({ family, familyLabel: familyLabel(family), ref, effect, effectLabel: effectLabel(effect) });
  }
  return out;
}

/** True iff the model is a v2 model that retained provenance (the affordance gate).
 *  @param {{ provenance?: unknown, layoutLawVersion?: number }|null|undefined} model */
export function hasProvenance(model) {
  return !!(model && typeof model === 'object' && model.provenance
    && typeof model.provenance === 'object' && Object.keys(model.provenance).length > 0);
}

/**
 * @typedef {Object} MapStory
 * @property {string|null} responseMode        exploit | endure | fortify
 * @property {string|null} responseLabel
 * @property {string|null} responseRef         the founding story string (site:response), if recorded
 * @property {ProvenanceRow[]} site            site-level causes (site:water / site:landform)
 * @property {Array<{ ref: string, band: string, band01: number }>} declined  the latent-advantage map
 */

/**
 * The MAP-LEVEL surveyor's read: the founding response mode, the site causes, and
 * the latent-advantage map (advantages the founding mode DECLINED — the town's
 * roads-not-taken). Returns null for a v1 model or when nothing was recorded.
 * @param {{ meta?: { responseMode?: string }, provenance?: Record<string, Array<{sourceFamily:string, sourceRef:string, effect:string}>>, latentAdvantages?: Array<{ attractorRef?: string, declinedBy?: string, latentValue01?: number }> }|null|undefined} model
 * @returns {MapStory|null}
 */
export function mapProvenanceStory(model) {
  if (!model || typeof model !== 'object') return null;
  const prov = model.provenance && typeof model.provenance === 'object' ? model.provenance : null;
  const latentRaw = Array.isArray(model.latentAdvantages) ? model.latentAdvantages : [];
  const responseMode = model.meta && typeof model.meta.responseMode === 'string' ? model.meta.responseMode : null;
  // A v1 model has neither provenance nor latentAdvantages nor responseMode.
  if (!prov && latentRaw.length === 0 && !responseMode) return null;

  const responseArr = prov ? prov['site:response'] : null;
  const responseRef = Array.isArray(responseArr) && responseArr[0] && typeof responseArr[0].sourceRef === 'string'
    ? responseArr[0].sourceRef : null;

  /** @type {ProvenanceRow[]} */
  const site = [];
  for (const key of ['site:water', 'site:landform']) {
    for (const row of districtProvenance(model, key)) site.push(row);
  }

  const declined = [];
  for (const a of latentRaw) {
    if (!a || typeof a !== 'object') continue;
    const ref = typeof a.attractorRef === 'string' ? a.attractorRef : '';
    if (!ref) continue;
    const band01 = typeof a.latentValue01 === 'number' && Number.isFinite(a.latentValue01) ? a.latentValue01 : 0;
    declined.push({ ref, band: latentBand(band01), band01 });
  }

  return {
    responseMode,
    responseLabel: responseMode ? (RESPONSE_LABEL[responseMode] || null) : null,
    responseRef,
    site,
    declined,
  };
}
