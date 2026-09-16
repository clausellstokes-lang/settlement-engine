/**
 * domain/events/registryFull.js — the event registry WITH composer prose.
 *
 * The lazy DM composer surfaces (EventComposer, BatchCart) import the registry
 * from here instead of registry.js. This module folds each event type's
 * composer-facing prose (description / targetPrompt — see registryProse.js)
 * back onto the SAME spec objects registry.js exports, then re-exports the
 * registry's whole surface. Composer code and the spec-prop consumers
 * (EventComposerTargetField) therefore see specs with the exact same shape
 * they always had — while the eager entry closure (store → eventPipeline /
 * batch → registry.js) never carries the prose bytes.
 *
 * The fold mutates the shared spec objects once at module evaluation; it is
 * idempotent and additive-only (no functional field is ever touched), so the
 * eager pipeline's view of a spec is unchanged whether or not this module has
 * loaded. @enforced-by tests/build/vendorPdfLazy.test.js (byte budget).
 */

import { EVENT_REGISTRY } from './registry.js';
import { EVENT_PROSE } from './registryProse.js';

for (const [type, prose] of Object.entries(EVENT_PROSE)) {
  const spec = EVENT_REGISTRY[type];
  if (spec) Object.assign(spec, prose);
}

export * from './registry.js';

/**
 * The subsystem keys an event of a given type touches: RERUN_KEYS_FOR_EVENT.
 * MOVED again (Wave R-3 Lane C) into its own pure-data leaf,
 * registryRerunKeys.js, so data-only consumers (the economy-freshness
 * display helper) can read the table without pulling this module's prose
 * fold into their chunk. Re-exported here so every existing consumer and
 * test keeps importing from registryFull unchanged. Full history and the
 * descriptive-metadata-only contract live in the table's own module header.
 */
export { RERUN_KEYS_FOR_EVENT } from './registryRerunKeys.js';
