/**
 * spatialSubstrateDerive.js — THE SPATIAL SUBSTRATE CANONIZE BODY (DOOR 1, owner
 * ruling #8).
 *
 * The design's projection law: "the engine NEVER reads the render or the layout model
 * directly ... at generation/canonize time a compact SPATIAL SUBSTRATE is derived and
 * stored sidecar." THIS lib module is that generation/canonize-time derivation — it is
 * the ONLY place that imports the town-map builder (buildTownMapModel), keeping the
 * strict-typed engine kernel and the first-paint closure free of the render layout
 * graph. It is reached ONLY through a DYNAMIC import at the canonize seam
 * (campaignWorldPulseSlice.canonizeCampaignWorld), so the layout graph it pulls never
 * enters the eager store closure — and, gated on the flag, a DARK world never imports
 * it at all (byte-identical).
 *
 * WHAT IT DOES: builds each settlement's ACTIVE town-map model (buildTownMapModel
 * dispatches v1/v2 off mapEdits.layoutLawVersion — the SAME entry the renderer uses,
 * so the substrate coheres with the drawn map) and hands the model to the pure-domain
 * geometry (deriveSpatialSubstrate). A cheap STRUCTURAL SIGNATURE lets an unchanged
 * town reuse its prior substrate (no rebuild), so a re-canonize only re-derives towns
 * whose shape actually changed. Returns the sidecar map { [settlementId]: substrate },
 * or null when nothing lit/derivable (drop-when-empty at the call site).
 *
 * Pure of side effects (no store, no set()); the caller folds the returned map into
 * worldState.spatialLedgers.spatialSubstrate inside its own producer.
 */
import { buildTownMapModel } from '../domain/townMap/townMapModel.js';
import { readMapEdits } from '../domain/townMap/mapEdits.js';
import { deriveSpatialSubstrate, SUBSTRATE_VERSION } from '../domain/spatial/spatialSubstrate.js';
import { hash32 } from '../domain/spatial/spatialSubstrateRead.js';

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * The structural SIGNATURE of a settlement's layout — the cheap fingerprint the
 * re-canonize compares to decide whether to re-derive. Captures every input that
 * changes the town's SHAPE (seed, active layout version + variant, the size band,
 * walls, the institution roster, the quarter count) but NOT the volatile urban-fabric
 * memory (which drifts every tick and only cosmetically nudges positions — the
 * substrate is topology, not pixels). Lives HERE (not the domain geometry leaf)
 * because it reads settlement identity fields the tier-blind spatial scan fences.
 * PURE.
 * @param {Record<string, unknown>|null|undefined} settlement @returns {string}
 */
export function substrateSignatureOf(settlement) {
  const s = asObject(settlement);
  const edits = asObject(s.mapEdits);
  const lyr = Number(edits.layoutLawVersion) === 2 ? 2 : 1;
  const variant = Number.isInteger(edits.layoutVariant) ? Number(edits.layoutVariant) : 0;
  const seed = String(s._seed ?? s.id ?? '');
  const sizeBand = String(s.tier ?? '');
  const insts = Array.isArray(s.institutions) ? s.institutions : [];
  const instKey = insts
    .map((i) => `${String(asObject(i).name ?? '')}:${String(asObject(i).status ?? 'active')}`)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join(',');
  const quarters = Array.isArray(asObject(s.spatialLayout).quarters) ? /** @type {unknown[]} */ (asObject(s.spatialLayout).quarters).length : 0;
  const walls = s.defenseProfile != null ? 1 : 0;
  return `${SUBSTRATE_VERSION}:${lyr}:${variant}:${seed}:${sizeBand}:w${walls}:q${quarters}:${hash32(instKey).toString(36)}`;
}

/**
 * Derive the spatial-substrate sidecar map for a campaign's saves. Reuses a prior
 * substrate whose structural signature is unchanged (no rebuild). Returns the map
 * keyed by settlement id, or null when it would be empty (so the caller drops the key
 * and a substrate-less world stays byte-identical). PURE (no store writes).
 *
 * @param {Array<{ id?: (string|number), settlement?: Record<string, unknown> }>} saves
 * @param {Record<string, unknown>|null|undefined} priorLedger  worldState.spatialLedgers.spatialSubstrate
 * @returns {Record<string, unknown>|null}
 */
export function deriveCampaignSubstrates(saves, priorLedger) {
  const list = Array.isArray(saves) ? saves : [];
  const prior = asObject(priorLedger);
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const save of list) {
    const sid = String(save?.id ?? '');
    if (sid === '') continue;
    const settlement = asObject(save.settlement);
    const sig = substrateSignatureOf(settlement);
    const priorRec = asObject(prior[sid]);
    if (typeof priorRec.sig === 'string' && priorRec.sig === sig && Array.isArray(priorRec.d) && priorRec.d.length) {
      out[sid] = priorRec; // structurally unchanged ⇒ reuse (no rebuild)
      continue;
    }
    const mapEdits = readMapEdits(/** @type {Parameters<typeof readMapEdits>[0]} */ (settlement));
    const model = buildTownMapModel(
      /** @type {Parameters<typeof buildTownMapModel>[0]} */ (settlement),
      /** @type {Parameters<typeof buildTownMapModel>[1]} */ (mapEdits),
    );
    const substrate = deriveSpatialSubstrate(
      /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (model)),
      sig,
    );
    if (substrate) out[sid] = substrate;
  }
  // Codepoint-stable key order (byte-stable sidecar).
  /** @type {Record<string, unknown>} */
  const sorted = {};
  for (const sid of Object.keys(out).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) sorted[sid] = out[sid];
  return Object.keys(sorted).length ? sorted : null;
}
