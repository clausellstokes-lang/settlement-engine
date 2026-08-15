/**
 * commandRegistry.js — legal application capabilities, not a store-action census.
 *
 * A CommandSpec names one user-meaningful capability and the adapter that reaches
 * its existing writer. It is intentionally much smaller than operationRegistry:
 * loaders, UI setters, auth plumbing, and internal persistence helpers are not
 * commands merely because they mutate Zustand state.
 */

const TARGET_SCOPES = new Set(['save', 'campaign', 'cross-save', 'global']);
const DELIVERIES = new Set([
  'local',
  'save-outbox',
  'server-uow',
  'next-pulse',
  // A bounded migration may route one admitted parameter family through a
  // stronger writer while preserving legacy families behind the same business
  // capability. The adapter must expose the actual result-level persistence;
  // this label is never permission to guess after execution.
  'writer-routed',
]);
const ATOMICITIES = new Set(['single-target', 'server-atomic', 'saga']);

function checkedSpec(spec) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
    throw new TypeError('command spec must be an object');
  }
  if (typeof spec.kind !== 'string' || !/^[a-z][a-z0-9.-]*$/.test(spec.kind)) {
    throw new TypeError('command spec kind must be a lower-case dotted identifier');
  }
  if (!TARGET_SCOPES.has(spec.targetScope)) {
    throw new TypeError(`command spec "${spec.kind}" has an invalid targetScope`);
  }
  if (!DELIVERIES.has(spec.delivery)) {
    throw new TypeError(`command spec "${spec.kind}" has an invalid delivery`);
  }
  if (!ATOMICITIES.has(spec.atomicity)) {
    throw new TypeError(`command spec "${spec.kind}" has an invalid atomicity`);
  }
  if (typeof spec.apply !== 'function') {
    throw new TypeError(`command spec "${spec.kind}" must provide apply()`);
  }
  for (const hook of ['validate', 'preflight']) {
    if (spec[hook] != null && typeof spec[hook] !== 'function') {
      throw new TypeError(`command spec "${spec.kind}" ${hook} must be a function`);
    }
  }
  return Object.freeze({
    description: '',
    surveyor: false,
    validate: null,
    preflight: null,
    ...spec,
  });
}

export function createCommandRegistry(initialSpecs = []) {
  const specs = new Map();

  function register(spec) {
    const checked = checkedSpec(spec);
    if (specs.has(checked.kind)) {
      throw new TypeError(`duplicate command spec "${checked.kind}"`);
    }
    specs.set(checked.kind, checked);
    return checked;
  }

  for (const spec of initialSpecs) register(spec);

  return Object.freeze({
    register,
    has(kind) {
      return specs.has(kind);
    },
    get(kind) {
      return specs.get(kind) || null;
    },
    list() {
      return Object.freeze([...specs.values()]);
    },
    surveyorCapabilities() {
      return Object.freeze([...specs.values()].filter((spec) => spec.surveyor));
    },
  });
}
