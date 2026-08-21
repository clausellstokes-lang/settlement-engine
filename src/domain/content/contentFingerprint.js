/**
 * Canonical JSON and synchronous SHA-256 for portable content identity.
 *
 * Content revisions, pack manifests, review previews, and campaign bindings all
 * cross browser, worker, export, and PostgreSQL boundaries. Their identity must
 * therefore depend on JSON meaning rather than insertion order or runtime
 * object identity. `canonicalContentJson` sorts object keys recursively and
 * emits no insignificant whitespace. Migration 185 installs the same canonical
 * form in PostgreSQL before hashing a command plan.
 *
 * This module intentionally contains no Node-only dependency. It is safe in the
 * browser's authoring bundle and remains synchronous so pack construction and
 * reducer admission do not acquire an asynchronous split.
 */

const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const MAX_DEPTH = 40;
const MAX_NODES = 20_000;

/** @param {unknown} value @returns {value is Record<string, unknown>} */
export function isPlainContentRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/**
 * PostgreSQL's `jsonb` parser cannot represent U+0000 or unpaired UTF-16
 * surrogate code units. Reject them before any local hash, review, or archive
 * seal can bless content that the durable authority cannot store.
 *
 * Checking code units, rather than code points, is intentional: a valid
 * surrogate pair represents one portable non-BMP code point, while an isolated
 * high or low surrogate is not valid Unicode scalar text.
 *
 * @param {string} text
 * @param {string} path
 */
function assertPortableJsonText(text, path) {
  for (let index = 0; index < text.length; index += 1) {
    const unit = text.charCodeAt(index);
    if (unit === 0) {
      throw new TypeError(
        `${path} contains U+0000, which durable JSON cannot represent.`,
      );
    }
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = text.charCodeAt(index + 1);
      if (next < 0xdc00 || next > 0xdfff) {
        throw new TypeError(
          `${path} contains an unpaired high UTF-16 surrogate.`,
        );
      }
      index += 1;
    } else if (unit >= 0xdc00 && unit <= 0xdfff) {
      throw new TypeError(
        `${path} contains an unpaired low UTF-16 surrogate.`,
      );
    }
  }
}

/**
 * PostgreSQL's bytewise C collation over UTF-8 sorts valid text by Unicode
 * scalar value. JavaScript relational comparison sorts UTF-16 code units,
 * which differs when one key is in the BMP and another is non-BMP. Canonical
 * JSON needs the database order; seeded simulation ordering intentionally
 * keeps using the separate UTF-16 comparator.
 *
 * @param {string} left
 * @param {string} right
 */
function compareCanonicalJsonKeys(left, right) {
  const leftScalars = Array.from(left);
  const rightScalars = Array.from(right);
  const sharedLength = Math.min(leftScalars.length, rightScalars.length);
  for (let index = 0; index < sharedLength; index += 1) {
    const leftCodePoint = leftScalars[index]?.codePointAt(0) ?? 0;
    const rightCodePoint = rightScalars[index]?.codePointAt(0) ?? 0;
    const difference = leftCodePoint - rightCodePoint;
    if (difference !== 0) return difference;
  }
  return leftScalars.length - rightScalars.length;
}

/** @param {string} sourceText */
function assertUniqueJsonObjectKeys(sourceText) {
  let index = 0;

  /** @param {string} message @returns {never} */
  function fail(message) {
    throw new TypeError(`JSON contains ambiguous object keys: ${message}.`);
  }

  /** @returns {void} */
  function skipWhitespace() {
    while (/\s/.test(sourceText[index] || '')) index += 1;
  }

  /** @returns {string} */
  function parseString() {
    const start = index;
    if (sourceText[index] !== '"') fail(`expected a string at byte ${index}`);
    index += 1;
    while (index < sourceText.length) {
      if (sourceText[index] === '\\') {
        index += 2;
        continue;
      }
      if (sourceText[index] === '"') {
        index += 1;
        return JSON.parse(sourceText.slice(start, index));
      }
      index += 1;
    }
    fail(`unterminated string at byte ${start}`);
  }

  /** @returns {void} */
  function parsePrimitive() {
    while (
      index < sourceText.length
      && !/[\s,\]}]/.test(sourceText[index])
    ) {
      index += 1;
    }
  }

  /** @param {string} path @returns {void} */
  function parseArray(path) {
    index += 1;
    skipWhitespace();
    let itemIndex = 0;
    if (sourceText[index] === ']') {
      index += 1;
      return;
    }
    while (index < sourceText.length) {
      parseValue(`${path}[${itemIndex}]`);
      itemIndex += 1;
      skipWhitespace();
      if (sourceText[index] === ']') {
        index += 1;
        return;
      }
      index += 1; // JSON.parse already proved this token is a comma.
      skipWhitespace();
    }
  }

  /** @param {string} path @returns {void} */
  function parseObject(path) {
    index += 1;
    skipWhitespace();
    const keys = new Set();
    if (sourceText[index] === '}') {
      index += 1;
      return;
    }
    while (index < sourceText.length) {
      const key = parseString();
      if (keys.has(key)) fail(`${path}.${key} is declared more than once`);
      keys.add(key);
      skipWhitespace();
      index += 1; // JSON.parse already proved this token is a colon.
      parseValue(`${path}.${key}`);
      skipWhitespace();
      if (sourceText[index] === '}') {
        index += 1;
        return;
      }
      index += 1; // JSON.parse already proved this token is a comma.
      skipWhitespace();
    }
  }

  /** @param {string} path @returns {void} */
  function parseValue(path) {
    skipWhitespace();
    if (sourceText[index] === '{') {
      parseObject(path);
    } else if (sourceText[index] === '[') {
      parseArray(path);
    } else if (sourceText[index] === '"') {
      parseString();
    } else {
      parsePrimitive();
    }
    skipWhitespace();
  }

  parseValue('$');
}

/**
 * Parse JSON without the standard parser's silent "last duplicate key wins"
 * behavior. A content manifest or pack with repeated decoded keys is ambiguous
 * to reviewers even when its final JavaScript value is deterministic.
 *
 * @param {string} sourceText
 * @returns {unknown}
 */
export function parseContentJson(sourceText) {
  if (typeof sourceText !== 'string') {
    throw new TypeError('Content JSON must be a string.');
  }
  const parsed = JSON.parse(sourceText);
  assertUniqueJsonObjectKeys(sourceText);
  return detachContentJson(parsed);
}

/**
 * Detach an untrusted value into ordinary JSON while enforcing bounded depth,
 * node count, finite numbers, acyclicity, and prototype safety.
 *
 * @param {unknown} value
 * @param {{ maxDepth?: number, maxNodes?: number }} [limits]
 * @returns {unknown}
 */
export function detachContentJson(value, limits = {}) {
  const maxDepth = typeof limits.maxDepth === 'number'
    && Number.isInteger(limits.maxDepth)
    ? limits.maxDepth
    : MAX_DEPTH;
  const maxNodes = typeof limits.maxNodes === 'number'
    && Number.isInteger(limits.maxNodes)
    ? limits.maxNodes
    : MAX_NODES;
  /** @type {Set<object>} */
  const seen = new Set();
  let nodes = 0;

  /**
   * @param {unknown} current
   * @param {string} path
   * @param {number} depth
   * @returns {unknown}
   */
  function visit(current, path, depth) {
    nodes += 1;
    if (nodes > maxNodes) throw new TypeError('Content exceeds the JSON node limit.');
    if (depth > maxDepth) throw new TypeError(`${path} exceeds the JSON depth limit.`);
    if (current === null || typeof current === 'boolean') {
      return current;
    }
    if (typeof current === 'string') {
      assertPortableJsonText(current, path);
      return current;
    }
    if (typeof current === 'number') {
      if (!Number.isFinite(current)) {
        throw new TypeError(`${path} must contain finite numbers.`);
      }
      return current;
    }
    if (typeof current !== 'object') {
      throw new TypeError(`${path} must contain JSON values only.`);
    }
    if (seen.has(current)) throw new TypeError(`${path} must not contain a cycle.`);
    seen.add(current);

    /** @type {unknown} */
    let detached;
    if (Array.isArray(current)) {
      detached = current.map((entry, index) => visit(
        entry,
        `${path}[${index}]`,
        depth + 1,
      ));
    } else {
      if (!isPlainContentRecord(current)) {
        throw new TypeError(`${path} must be a plain object.`);
      }
      /** @type {Record<string, unknown>} */
      const detachedRecord = {};
      const currentRecord = /** @type {Record<string, unknown>} */ (current);
      for (const key of Object.keys(currentRecord)) {
        if (BLOCKED_KEYS.has(key)) {
          throw new TypeError(`${path}.${key} is not allowed.`);
        }
        assertPortableJsonText(key, `${path} object key`);
        detachedRecord[key] = visit(
          currentRecord[key],
          `${path}.${key}`,
          depth + 1,
        );
      }
      detached = detachedRecord;
    }

    seen.delete(current);
    return detached;
  }

  return visit(value, '$', 0);
}

/**
 * JSON canonical form shared with `_content_canonical_json` in migration 185.
 *
 * @param {unknown} value
 * @param {{ maxDepth?: number, maxNodes?: number }} [limits]
 */
export function canonicalContentJson(value, limits = {}) {
  const detached = detachContentJson(value, limits);

  /** @param {unknown} current @returns {string} */
  function encode(current) {
    if (current === null || typeof current !== 'object') {
      return JSON.stringify(current);
    }
    if (Array.isArray(current)) {
      return `[${current.map(encode).join(',')}]`;
    }
    const record = /** @type {Record<string, unknown>} */ (current);
    const keys = Object.keys(record);
    for (const key of keys) assertPortableJsonText(key, '$ object key');
    return `{${keys.sort(compareCanonicalJsonKeys).map((key) => {
      return `${JSON.stringify(key)}:${encode(record[key])}`;
    }).join(',')}}`;
  }

  return encode(detached);
}

const SHA256_WORDS = Object.freeze([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const SHA256_INITIAL = Object.freeze([
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]);

/** @param {number} word @param {number} amount @returns {number} */
function rotateRight(word, amount) {
  return (word >>> amount) | (word << (32 - amount));
}

/** @param {string} text @returns {number[]} */
function utf8Bytes(text) {
  if (typeof TextEncoder !== 'undefined') {
    return Array.from(new TextEncoder().encode(text));
  }
  // TextEncoder exists in every supported browser and Node test runtime. This
  // fallback keeps the pure module usable in constrained JS shells.
  return Array.from(unescape(encodeURIComponent(text)), char => char.charCodeAt(0));
}

/**
 * Synchronous SHA-256 of a UTF-8 string.
 *
 * @param {string} text
 * @returns {string} 64 lowercase hexadecimal characters
 */
export function sha256Hex(text) {
  const bytes = utf8Bytes(String(text));
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);

  const high = Math.floor(bitLength / 0x100000000);
  const low = bitLength >>> 0;
  for (let shift = 24; shift >= 0; shift -= 8) bytes.push((high >>> shift) & 0xff);
  for (let shift = 24; shift >= 0; shift -= 8) bytes.push((low >>> shift) & 0xff);

  const hash = [...SHA256_INITIAL];
  const schedule = new Uint32Array(64);
  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      const start = offset + (index * 4);
      schedule[index] = (
        (bytes[start] << 24)
        | (bytes[start + 1] << 16)
        | (bytes[start + 2] << 8)
        | bytes[start + 3]
      ) >>> 0;
    }
    for (let index = 16; index < 64; index += 1) {
      const x = schedule[index - 15];
      const y = schedule[index - 2];
      const sigma0 = rotateRight(x, 7) ^ rotateRight(x, 18) ^ (x >>> 3);
      const sigma1 = rotateRight(y, 17) ^ rotateRight(y, 19) ^ (y >>> 10);
      schedule[index] = (
        schedule[index - 16]
        + sigma0
        + schedule[index - 7]
        + sigma1
      ) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 64; index += 1) {
      const sum1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choose = (e & f) ^ (~e & g);
      const temp1 = (h + sum1 + choose + SHA256_WORDS[index] + schedule[index]) >>> 0;
      const sum0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (sum0 + majority) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }

  return hash.map(word => word.toString(16).padStart(8, '0')).join('');
}

/**
 * @param {unknown} value
 * @param {{ maxDepth?: number, maxNodes?: number }} [limits]
 */
export function fingerprintContent(value, limits = {}) {
  return sha256Hex(canonicalContentJson(value, limits));
}
