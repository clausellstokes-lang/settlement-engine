/**
 * composerPipeline.js — ST-3, the composer's PIPELINE-AS-DATA (DESIGN_FMG_WEAVE D12).
 *
 * ⛔ WHY THIS IS NOT `registerStep`, AND THE REASON IS STRUCTURAL RATHER THAN
 * STYLISTIC. The generator has a perfectly good step registry, and reaching for it
 * here would be the obvious move — but the registry is a MODULE-GLOBAL map that the
 * settlement pipeline topologically sorts, and the composer INVOKES that pipeline
 * NESTED, once per member. Registering composer steps into the same registry would
 * splice them into the settlement pipeline's own sort order, so every member mint
 * would try to run the composer's steps inside itself. The shape D12 rules is an
 * INSTANCE-SCOPED list: the composer builds its own step array per call, and this
 * module runs it. Same contract vocabulary, no shared registry, no nesting hazard.
 *
 * WHAT THE CAR IS ACTUALLY FOR. Turning straight-line code into a list of named
 * steps buys nothing on its own — the code already ran in that order. The value is
 * that the composer carried FOUR HIDDEN COUPLINGS which were invisible because
 * nothing named them, and any of the four would survive a reordering that silently
 * changed the composed world. They are declared as data below, and the strict arm
 * checks the declarations against what the steps actually touch.
 */

/**
 * THE FOUR HIDDEN COUPLINGS (D12). Each one is a rule that makes the step ORDER
 * load-bearing in a way no type or test previously expressed.
 */
export const COMPOSER_COUPLINGS = Object.freeze([
  Object.freeze({
    id: 'id_order',
    subject: 'the shared id counter',
    // The default id factory is a counter closed over per call. The campaign takes
    // the FIRST id and each member the next, so the ids a realm gets are a function
    // of the order these steps run in, not of anything about the realm. Insert a
    // step that mints an id before the campaign and every member's id shifts by one
    // — a diff that looks like scaffolding noise and is actually a different world
    // to anything that keys on ids.
    rule: 'Any step that mints an id must keep its position relative to every other id-minting step; the campaign id is minted FIRST and each member id follows in slot order.',
    guardedBy: 'idMintOrder',
  }),
  Object.freeze({
    id: 'placement_join',
    subject: 'the placements ⇄ members join',
    // This one was a LATENT DEFECT rather than merely an undocumented rule: the
    // placement loop joined a planned site to a member by ARRAY INDEX, which is
    // correct only for as long as the member array is built by mapping the site
    // array and is never filtered, sorted, or appended to. Nothing said so, and
    // nothing would have failed loudly — a reorder would have silently placed each
    // settlement on its neighbour's site. The join is now on `slot`, which is the
    // identity the plan and the member actually share.
    rule: 'A placement joins its member by SLOT, never by array index.',
    guardedBy: 'placementJoinBySlot',
  }),
  Object.freeze({
    id: 'in_place_mutation',
    subject: 'the post-mint passes that mutate members in place',
    // Two steps mutate the already-minted member array rather than returning a new
    // one (the world-scoped faction de-dup, and the genesis-tie materializer).
    // A reader scanning for `provides` would conclude neither writes anything.
    rule: 'A step that mutates the member array in place declares it under `mutates`, never `provides`.',
    guardedBy: 'strictWriteSet',
  }),
  Object.freeze({
    id: 'shared_now',
    subject: 'the single timestamp',
    // Every timestamp in a composed bundle is ONE value read once. Letting a step
    // read the clock again would make a bundle whose parts disagree about when it
    // was made, and would break the replayability the injected-clock pin rests on.
    rule: 'The clock is read exactly once, before any step runs; every step reads that one value.',
    guardedBy: 'singleClockRead',
  }),
]);

/** The coupling ids, frozen so a walker can iterate them without parsing prose. */
export const COMPOSER_COUPLING_IDS = Object.freeze(COMPOSER_COUPLINGS.map(c => c.id));

/**
 * The DECLARED step contract, in execution order. `reads` are context keys a step
 * consumes, `provides` are keys it writes by returning a patch, and `mutates` are
 * existing keys it changes IN PLACE — the same three words the generator pipeline
 * uses, so a reader who knows one knows the other.
 *
 * This is the ORDER OF RECORD. The composer builds its step list against these
 * names and `runComposerSteps` refuses a list that does not match, so the order
 * cannot drift out of this file without a loud failure.
 */
export const COMPOSER_STEP_CONTRACT = Object.freeze([
  Object.freeze({ name: 'derivePlan', reads: ['seed', 'knobs'], provides: ['plan'], mutates: [] }),
  // Mints the campaign id — the FIRST call on the id counter (coupling: id_order).
  Object.freeze({ name: 'openCampaignIdentity', reads: ['plan', 'name'], provides: ['campaignId', 'campaignName'], mutates: [] }),
  Object.freeze({ name: 'mintMembers', reads: ['plan', 'engine', 'contentRuntime', 'now'], provides: ['settlements'], mutates: [] }),
  Object.freeze({ name: 'dedupeFactionNames', reads: ['settlements'], provides: [], mutates: ['settlements'] }),
  Object.freeze({ name: 'materializeGenesisTies', reads: ['plan', 'settlements'], provides: [], mutates: ['settlements'] }),
  Object.freeze({ name: 'placeMembers', reads: ['plan', 'settlements', 'now'], provides: ['placements'], mutates: [] }),
  Object.freeze({ name: 'discoverChannels', reads: ['settlements', 'now'], provides: ['regionalGraph'], mutates: [] }),
  Object.freeze({ name: 'applyTonePreset', reads: ['plan', 'campaignId', 'campaignName'], provides: ['worldState'], mutates: [] }),
  Object.freeze({ name: 'buildMapState', reads: ['plan', 'placements', 'now'], provides: ['mapState'], mutates: [] }),
  Object.freeze({ name: 'assembleCampaign', reads: ['campaignId', 'campaignName', 'now', 'settlements', 'mapState', 'regionalGraph', 'worldState', 'plan'], provides: ['campaign'], mutates: [] }),
]);

/** The declared step names, in order. */
export const COMPOSER_STEP_ORDER = Object.freeze(COMPOSER_STEP_CONTRACT.map(s => s.name));

/** Cheap structural hash of a value, for strict-mode change detection. */
function hashOf(value) {
  try { return JSON.stringify(value); } catch { return String(value); }
}

/**
 * Run an instance-scoped composer step list against a shared context.
 *
 * @param {Array<{ name: string, fn: (ctx: any) => (object|void) }>} steps
 * @param {Record<string, any>} ctx  the shared context (mutated as steps provide)
 * @param {{ strict?: boolean, onViolation?: (v: {step:string, keys:string[]}) => void }} [options]
 * @returns {Record<string, any>} the same ctx, for convenience
 */
export function runComposerSteps(steps, ctx, options = {}) {
  const given = (steps || []).map(s => s.name);
  // THE ORDER GUARD. A step list that does not match the contract — a renamed
  // step, a dropped one, or two swapped — is refused before anything runs, because
  // every one of the four couplings above is an ORDER claim and a silently
  // reordered pipeline is exactly what they exist to prevent.
  if (given.length !== COMPOSER_STEP_ORDER.length
      || given.some((n, i) => n !== COMPOSER_STEP_ORDER[i])) {
    throw new Error(
      `composer pipeline: step list does not match the declared contract.\n`
      + `  declared: ${COMPOSER_STEP_ORDER.join(' → ')}\n`
      + `  given:    ${given.join(' → ')}`,
    );
  }

  const strict = options.strict === true;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const declared = COMPOSER_STEP_CONTRACT[i];
    const before = strict ? snapshot(ctx) : null;

    const patch = step.fn(ctx);
    if (patch && typeof patch === 'object') Object.assign(ctx, patch);

    if (strict && before) {
      const allowed = new Set([...(declared.provides || []), ...(declared.mutates || [])]);
      const undeclared = [];
      for (const key of Object.keys(ctx)) {
        const had = before.has(key);
        const changed = !had || before.get(key) !== hashOf(ctx[key]);
        if (changed && !allowed.has(key)) undeclared.push(key);
      }
      if (undeclared.length) {
        const violation = { step: step.name, keys: undeclared };
        if (options.onViolation) options.onViolation(violation);
        else {
          throw new Error(
            `composer pipeline: step "${step.name}" wrote undeclared context keys: ${undeclared.join(', ')}. `
            + `Declare them under provides (returned patch) or mutates (changed in place).`,
          );
        }
      }
    }
  }
  return ctx;
}

/** @param {Record<string, any>} ctx */
function snapshot(ctx) {
  const snap = new Map();
  for (const k of Object.keys(ctx)) snap.set(k, hashOf(ctx[k]));
  return snap;
}
