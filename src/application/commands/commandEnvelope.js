/**
 * commandEnvelope.js — serializable application-command identity.
 *
 * A command is the addressed request that sits above an existing domain writer.
 * It carries no store function, React callback, persistence client, or executable
 * policy. Those live in the execution context and the registered adapter.
 *
 * The constructor is deliberately strict because the envelope is also the unit
 * of replay. Two requests that share a command id but differ in any
 * behavior-bearing field are a conflict, never "close enough."
 */

export const COMMAND_SCHEMA_VERSION = 1;

export const COMMAND_PROVENANCE = Object.freeze([
  'manual',
  'surveyor',
  'system',
]);

const PROVENANCE = new Set(COMMAND_PROVENANCE);
const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const MAX_JSON_DEPTH = 32;
const MAX_IDENTIFIER_LENGTH = 240;

/**
 * @typedef {{
 *   schemaVersion: number,
 *   commandId: string,
 *   kind: string,
 *   provenance: 'manual'|'surveyor'|'system',
 *   ownerRef: {accountId?:string, ownerKey?:string, [key:string]:unknown}|null,
 *   targets: {saveId?:string|null, campaignId?:string|null,
 *     draftId?:string|null, [key:string]:unknown},
 *   expected: {revision?:string|null, sourceFingerprint?:string|null,
 *     sessionEpoch?:string|null, [key:string]:unknown},
 *   params: Record<string, unknown>,
 *   correlation: Record<string, unknown>,
 *   requestedAt: string|null,
 * }} CommandEnvelope
 */

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isPlainRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function identifier(value, field, { required = false } = {}) {
  if (value == null && !required) return null;
  if (typeof value !== 'string') {
    throw new TypeError(`${field} must be a string`);
  }
  const normalized = value.trim();
  if ((required && !normalized) || normalized.length > MAX_IDENTIFIER_LENGTH) {
    throw new TypeError(`${field} is invalid`);
  }
  return normalized || null;
}

/**
 * Detach a JSON value while rejecting executable, cyclic, or prototype-bearing
 * input. Command payloads may cross lazy, worker, outbox, or server boundaries;
 * admitting only ordinary JSON keeps all of those paths equivalent.
 */
function detachJson(value, path = '$', seen = new Set(), depth = 0) {
  if (depth > MAX_JSON_DEPTH) {
    throw new TypeError(`${path} exceeds the command JSON depth limit`);
  }
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${path} must contain finite numbers`);
    return value;
  }
  if (typeof value !== 'object') {
    throw new TypeError(`${path} must contain JSON values only`);
  }
  if (seen.has(value)) throw new TypeError(`${path} must not contain a cycle`);
  seen.add(value);
  let detached;
  if (Array.isArray(value)) {
    detached = value.map((entry, index) => (
      detachJson(entry, `${path}[${index}]`, seen, depth + 1)
    ));
  } else {
    if (!isPlainRecord(value)) throw new TypeError(`${path} must be a plain object`);
    detached = {};
    for (const key of Object.keys(value)) {
      if (BLOCKED_KEYS.has(key)) throw new TypeError(`${path}.${key} is not allowed`);
      detached[key] = detachJson(value[key], `${path}.${key}`, seen, depth + 1);
    }
  }
  seen.delete(value);
  return detached;
}

function detachedRecord(value, field, { nullable = false } = {}) {
  if (value == null && nullable) return null;
  if (!isPlainRecord(value)) throw new TypeError(`${field} must be a plain object`);
  return detachJson(value, field);
}

function normalizeTargets(value) {
  const targets = detachedRecord(value || {}, 'targets');
  for (const field of ['saveId', 'campaignId', 'draftId']) {
    if (targets[field] != null) targets[field] = identifier(targets[field], `targets.${field}`);
  }
  return targets;
}

function normalizeOwnerRef(value) {
  const ownerRef = detachedRecord(value, 'ownerRef', { nullable: true });
  if (!ownerRef) return null;
  if (ownerRef.accountId != null) {
    ownerRef.accountId = identifier(ownerRef.accountId, 'ownerRef.accountId');
  }
  if (ownerRef.ownerKey != null) {
    ownerRef.ownerKey = identifier(ownerRef.ownerKey, 'ownerRef.ownerKey');
  }
  if (!ownerRef.accountId && !ownerRef.ownerKey) {
    throw new TypeError('ownerRef must name accountId or ownerKey');
  }
  return ownerRef;
}

function normalizeExpected(value) {
  const expected = detachedRecord(value || {}, 'expected');
  for (const field of ['revision', 'sourceFingerprint', 'sessionEpoch']) {
    if (expected[field] != null) {
      expected[field] = identifier(String(expected[field]), `expected.${field}`);
    }
  }
  return expected;
}

function deepFreezeJson(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const nested of Object.values(value)) deepFreezeJson(nested);
  return Object.freeze(value);
}

/**
 * Validate and normalize an unknown envelope without throwing.
 *
 * @param {unknown} raw
 * @returns {{ok:true, command:Readonly<CommandEnvelope>}
 *   | {ok:false, reason:'invalid-command-envelope', message:string}}
 */
export function validateCommandEnvelope(raw) {
  try {
    if (!isPlainRecord(raw)) throw new TypeError('command must be a plain object');
    const schemaVersion = Number(raw.schemaVersion ?? COMMAND_SCHEMA_VERSION);
    if (schemaVersion !== COMMAND_SCHEMA_VERSION) {
      throw new TypeError(`unsupported command schema version ${schemaVersion}`);
    }
    const commandId = identifier(raw.commandId, 'commandId', { required: true });
    const kind = identifier(raw.kind, 'kind', { required: true });
    if (!/^[a-z][a-z0-9.-]*$/.test(kind)) {
      throw new TypeError('kind must be a lower-case dotted identifier');
    }
    const provenance = identifier(
      raw.provenance ?? 'manual',
      'provenance',
      { required: true },
    );
    if (!PROVENANCE.has(provenance)) {
      throw new TypeError(`unsupported provenance "${provenance}"`);
    }
    const requestedAt = raw.requestedAt == null
      ? null
      : identifier(raw.requestedAt, 'requestedAt', { required: true });
    const command = {
      schemaVersion,
      commandId,
      kind,
      provenance,
      ownerRef: normalizeOwnerRef(raw.ownerRef),
      targets: normalizeTargets(raw.targets),
      expected: normalizeExpected(raw.expected),
      params: detachedRecord(raw.params || {}, 'params'),
      correlation: detachedRecord(raw.correlation || {}, 'correlation'),
      requestedAt,
    };
    return { ok: true, command: deepFreezeJson(command) };
  } catch (error) {
    return {
      ok: false,
      reason: 'invalid-command-envelope',
      message: error instanceof Error ? error.message : 'invalid command envelope',
    };
  }
}

/**
 * Construct a validated immutable command. Programmer-authored invalid input is
 * exceptional; untrusted input should call validateCommandEnvelope directly.
 */
export function makeCommandEnvelope(fields) {
  const checked = validateCommandEnvelope(fields);
  if (checked.ok === false) throw new TypeError(checked.message);
  return checked.command;
}

function canonicalize(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => (
    `${JSON.stringify(key)}:${canonicalize(value[key])}`
  )).join(',')}}`;
}

function hashPair(text) {
  let fnv = 0x811c9dc5;
  let djb = 0x1505;
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    fnv ^= code;
    fnv = Math.imul(fnv, 0x01000193) >>> 0;
    djb = (Math.imul(djb, 33) ^ code) >>> 0;
  }
  return `${text.length.toString(36)}-${fnv.toString(36)}-${djb.toString(36)}`;
}

/**
 * Produce a deterministic, non-content-bearing id for a logical command source.
 * Hash collisions remain fail-closed: the executor also compares the full
 * canonical command fingerprint before replaying an id.
 */
export function commandIdForValue(namespace, value) {
  const safeNamespace = identifier(namespace, 'namespace', { required: true })
    .replace(/[^a-zA-Z0-9.-]+/g, '-')
    .toLowerCase();
  const detached = detachJson(value, 'commandIdentity');
  return `cmd:${safeNamespace}:${hashPair(canonicalize(detached))}`;
}

/**
 * Canonical behavior identity used to detect command-id reuse with different
 * payloads. requestedAt is intentionally absent: a replay may be observed later,
 * but it must still describe the exact same requested behavior.
 */
export function commandFingerprint(command) {
  return canonicalize({
    schemaVersion: command.schemaVersion,
    commandId: command.commandId,
    kind: command.kind,
    provenance: command.provenance,
    ownerRef: command.ownerRef,
    targets: command.targets,
    expected: command.expected,
    params: command.params,
    correlation: command.correlation,
  });
}

/** Owner/target-qualified journal key. The runtime scope supplies tab/store isolation. */
export function commandJournalKey(command) {
  const owner = command.ownerRef?.accountId
    || command.ownerRef?.ownerKey
    || 'ownerless';
  const target = command.targets?.saveId
    || command.targets?.campaignId
    || command.targets?.draftId
    || 'untargeted';
  return `${owner}::${target}::${command.commandId}`;
}
