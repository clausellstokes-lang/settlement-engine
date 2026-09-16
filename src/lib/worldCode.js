/**
 * worldCode.js — THE SEED POST (Vision V-13): a whole world in a sentence.
 *
 * A world in this engine IS its seed + a tiny config preset (the three Instant
 * World knobs: realmSize / tone / mapKind). This module encodes that tuple into a
 * compact, URL-safe, VERSIONED, CHECKSUMMED share code — so `/world/<code>`
 * regenerates the byte-identical world client-side, no server state, and the
 * gallery becomes a commons anyone can reproduce.
 *
 * FORMAT:  w1.<base64url(payload)>.<fnv1a32-hex>
 *   • `w1`      — the code-scheme version (envelope), so a future scheme can be
 *                 rejected/migrated without ambiguity.
 *   • payload   — JSON `{ v: 1, s: <seed>, c: { realmSize?, tone?, mapKind? } }`.
 *   • checksum  — FNV-1a-32 (8 hex) of the base64url payload, so a
 *                 mistyped/truncated code fails to decode instead of quietly
 *                 replaying the WRONG world.
 *
 * `.` separates the three parts and is absent from the base64url alphabet
 * (A–Z a–z 0–9 - _), so the split is unambiguous.
 *
 * PURE + DEPENDENCY-LIGHT: only the kernel FNV hash. `decodeWorldCode` returns the
 * RAW preset; the caller passes it to `composeInstantWorld`, whose
 * `normalizeBasicConfig` defaults any unknown/missing knob — so a partial or
 * stale code still yields a valid, replayable world. Any malformed / tampered /
 * unknown-scheme / unknown-version input decodes to `null` (fail closed).
 *
 * LAZY: reached only from the lazy /world route + the (lazy) share affordance, so
 * it costs zero first-paint bytes.
 *
 * @enforced-by tests/lib/worldCode.test.js
 */

import { fnv1a32 } from '../kernel/proseHash.js';

/** The code-scheme (envelope) version prefix. */
export const WORLD_CODE_SCHEME = 'w1';
/**
 * The payload schema version (inside the JSON) that NEW codes are minted at.
 *
 * ⭐⭐ v2, AND v1 CODES REPLAY AS v1 FOREVER (POLIS-1, Q-W3 pre-ruled). The envelope
 * prefix stays `w1` deliberately: the ENVELOPE (base64url + FNV checksum + dot split)
 * has not changed, only the payload inside it, and bumping the visible prefix would
 * have made every existing code LOOK wrong to a user while decoding perfectly.
 */
export const WORLD_CODE_PAYLOAD_VERSION = 2;
/** The original payload schema. Frozen for life — see `decodeWorldCode`. */
export const WORLD_CODE_PAYLOAD_LEGACY = 1;
/** Payload versions this build can replay. Unknown versions still fail closed. */
export const SUPPORTED_PAYLOAD_VERSIONS = Object.freeze([WORLD_CODE_PAYLOAD_LEGACY, WORLD_CODE_PAYLOAD_VERSION]);

// URL-safe base64 alphabet (RFC 4648 §5), padless.
const B64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
/** @type {Record<string, number>} */
const B64URL_INDEX = {};
for (let i = 0; i < B64URL.length; i += 1) B64URL_INDEX[B64URL[i]] = i;

/** @param {Uint8Array} bytes @returns {string} */
function bytesToBase64url(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const has1 = i + 1 < bytes.length;
    const has2 = i + 2 < bytes.length;
    const b1 = has1 ? bytes[i + 1] : 0;
    const b2 = has2 ? bytes[i + 2] : 0;
    out += B64URL[b0 >> 2];
    out += B64URL[((b0 & 0x03) << 4) | (b1 >> 4)];
    if (has1) out += B64URL[((b1 & 0x0f) << 2) | (b2 >> 6)];
    if (has2) out += B64URL[b2 & 0x3f];
  }
  return out;
}

/** @param {string} str @returns {Uint8Array|null} null on any invalid character */
function base64urlToBytes(str) {
  /** @type {number[]} */
  const bytes = [];
  let bits = 0;
  let value = 0;
  for (let i = 0; i < str.length; i += 1) {
    const idx = B64URL_INDEX[str[i]];
    if (idx === undefined) return null;
    value = (value << 6) | idx;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >> bits) & 0xff);
    }
  }
  return Uint8Array.from(bytes);
}

/** @param {string} str @returns {string} the 8-hex FNV-1a-32 checksum */
function checksum(str) {
  return fnv1a32(str).toString(16).padStart(8, '0');
}

/**
 * Canonicalize a loose basicConfig to only the three known knob keys that are
 * present as strings (so codes are compact + stable; missing knobs default at
 * replay time via normalizeBasicConfig).
 * @param {any} basicConfig
 * @returns {{ realmSize?: string, tone?: string, mapKind?: string }}
 */
function canonicalPreset(basicConfig, version) {
  const src = basicConfig && typeof basicConfig === 'object' && !Array.isArray(basicConfig) ? basicConfig : {};
  /** @type {{ realmSize?: string, tone?: string, mapKind?: string, magic?: string }} */
  const out = {};
  // ⛔⛔ THE MAGIC KNOB WAS MISSING, AND THAT WAS A REAL DEFECT — not a v2 feature.
  // The realm's arcane stance is the FOURTH knob and the one answer that cannot be
  // changed afterwards without regenerating, because every member is minted under it.
  // It was absent from this list, so sharing a MUNDANE realm handed the recipient a
  // MAGICAL one: `normalizeBasicConfig` defaults an absent magic knob to 'yes'. The
  // world silently gained mages on the way through the code.
  //
  // It is folded into the v2 payload rather than back-patched into v1, because adding
  // a key to v1 would change what an existing code decodes to — and an existing code
  // must keep naming the world it always named, defect included. A v1 code therefore
  // still replays magical, forever, which is the honest reading of what it recorded.
  const keys = version >= WORLD_CODE_PAYLOAD_VERSION
    ? /** @type {const} */ (['realmSize', 'tone', 'mapKind', 'magic'])
    : /** @type {const} */ (['realmSize', 'tone', 'mapKind']);
  for (const key of keys) {
    if (typeof src[key] === 'string') out[key] = src[key];
  }
  return out;
}

/**
 * Encode a world's identity (seed + config preset) into a share code.
 * @param {{ seed: (string|number), basicConfig?: any }} world
 * @returns {string} the share code (`w1.<payload>.<checksum>`)
 * @throws {Error} when the seed is missing/empty (a world without a seed cannot be shared)
 */
export function encodeWorldCode(world) {
  const w = world && typeof world === 'object' ? world : {};
  const seed = w.seed == null ? '' : String(w.seed);
  if (!seed) throw new Error('encodeWorldCode: a non-empty seed is required');
  const payload = {
    v: WORLD_CODE_PAYLOAD_VERSION,
    s: seed,
    c: canonicalPreset(w.basicConfig, WORLD_CODE_PAYLOAD_VERSION),
  };
  const json = JSON.stringify(payload);
  const b64 = bytesToBase64url(new TextEncoder().encode(json));
  return `${WORLD_CODE_SCHEME}.${b64}.${checksum(b64)}`;
}

/**
 * Decode a share code back to its world identity. Fails CLOSED: returns null for
 * any malformed / tampered / unknown-scheme / unknown-version / bad-checksum input.
 * @param {unknown} code
 * @returns {{ version: number, planLaw: number, seed: string,
 *   basicConfig: { realmSize?: string, tone?: string, mapKind?: string } } | null}
 *   `planLaw` is DERIVED from the payload version, never read from the code's own bytes —
 *   which is why a v1 code cannot be talked into replaying under a later law.
 */
export function decodeWorldCode(code) {
  if (typeof code !== 'string' || !code) return null;
  const parts = code.split('.');
  if (parts.length !== 3) return null;
  const [scheme, b64, ck] = parts;
  if (scheme !== WORLD_CODE_SCHEME) return null;
  if (!b64 || checksum(b64) !== ck) return null; // tampered / truncated / mistyped
  const bytes = base64urlToBytes(b64);
  if (!bytes) return null;
  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
  if (!payload || typeof payload !== 'object') return null;
  // Still fails CLOSED on an unknown version — a future v3 code decodes to null here
  // rather than being replayed under the wrong law.
  if (!SUPPORTED_PAYLOAD_VERSIONS.includes(payload.v)) return null;
  const seed = payload.s == null ? '' : String(payload.s);
  if (!seed) return null;
  // ⭐ THE VERSION SELECTS THE PLAN LAW, AND THAT IS THE WHOLE PROMISE. A v1 code
  // replays under the ORIGINAL derivation forever — not "this seed under today's
  // laws" — so a world someone saved, posted, or played keeps being the world their
  // code names. Every later improvement to the plan arrives as a new law, reachable
  // only by codes minted after it.
  const planLaw = payload.v === WORLD_CODE_PAYLOAD_LEGACY ? 1 : 2;
  return {
    version: payload.v,
    planLaw,
    seed,
    basicConfig: canonicalPreset(payload.c, payload.v),
  };
}
