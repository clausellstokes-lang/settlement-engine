/**
 * migration-ordering.mjs — pure helpers for SQL-migration ordering analysis.
 *
 * Extracted so the sequence test (tests/security/migrationSequence050to056.
 * pglite.test.js) and a focused unit test can BOTH exercise the same logic.
 * The sequence test's catch block used to swallow every non-syntax pglite error
 * as "environmental", which silently masked the very ordering bug its comment
 * promised to catch (a band migration referencing an object a LATER band
 * migration defines). These helpers classify that error precisely.
 *
 * Pure string analysis — no I/O, no DB — so the classifier is unit-testable
 * against forged error messages and forged band SQL.
 */

/**
 * Names of the public objects (functions + tables) a migration DEFINES,
 * lower-cased and unqualified.
 * @param {string} sql
 * @returns {string[]}
 */
export function definedObjects(sql) {
  const names = [];
  const re = /create\s+(?:or\s+replace\s+)?(?:function|table)(?:\s+if\s+not\s+exists)?\s+(?:public\.)?([a-z_][a-z0-9_]*)/gi;
  let m;
  while ((m = re.exec(sql)) !== null) names.push(m[1].toLowerCase());
  return names;
}

/**
 * Pull the offending object name out of a Postgres "does not exist" error. PG
 * phrases these as `function public.foo(...) does not exist`, `relation
 * "public.bar" does not exist`, `type "baz" does not exist`, etc.
 * @param {string} msg
 * @returns {string | null}  Bare object name (no schema/quotes/args), lower-cased.
 */
export function missingObjectName(msg) {
  const m = msg.match(/(?:function|relation|type|column|operator)\s+"?(?:public\.)?([a-z_][a-z0-9_]*)/i);
  return m ? m[1].toLowerCase() : null;
}

/**
 * Build the name -> first-defining-index map for an ordered band of migration
 * SQL bodies. First definition wins: a later `create or replace` of the same
 * name is a redefinition, not the file that must run first.
 * @param {string[]} bandSql  Migration bodies in apply order.
 * @returns {Map<string, number>}
 */
export function buildDefinedAt(bandSql) {
  /** @type {Map<string, number>} */
  const definedAt = new Map();
  bandSql.forEach((sql, i) => {
    for (const name of definedObjects(sql)) {
      if (!definedAt.has(name)) definedAt.set(name, i);
    }
  });
  return definedAt;
}

/**
 * Classify a pglite apply error for the band file at `failingIndex`. Returns the
 * kind plus, for an ordering bug, which later file defines the missing object.
 *
 *   'syntax'       — a genuine parse error (always a hard failure).
 *   'ordering'     — a "does not exist" error for an object DEFINED by a LATER
 *                    band file (the file ran before its in-band dependency).
 *   'environmental'— anything else (a pre-band/non-band dependency the minimal
 *                    scaffold doesn't model) — tolerated by the sequence test.
 *
 * @param {string} msg  The error message.
 * @param {number} failingIndex  Index of the band file that raised it.
 * @param {Map<string, number>} definedAt  From buildDefinedAt().
 * @returns {{ kind: 'syntax' | 'ordering' | 'environmental', missing?: string, definedAtIndex?: number }}
 */
export function classifyApplyError(msg, failingIndex, definedAt) {
  if (/syntax error|unterminated|invalid input syntax|parse error/i.test(msg)) {
    return { kind: 'syntax' };
  }
  if (/does not exist/i.test(msg)) {
    const missing = missingObjectName(msg);
    const defIdx = missing != null ? definedAt.get(missing) : undefined;
    if (defIdx !== undefined && defIdx > failingIndex) {
      return { kind: 'ordering', missing: /** @type {string} */ (missing), definedAtIndex: defIdx };
    }
  }
  return { kind: 'environmental' };
}
