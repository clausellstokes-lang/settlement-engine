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
