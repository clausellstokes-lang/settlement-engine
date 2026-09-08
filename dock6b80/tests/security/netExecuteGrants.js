/**
 * netExecuteGrants.js — shared EXECUTE-grant replay helper for the credit RPCs.
 *
 * Hoisted verbatim from refundLedger.contract.test.js AND creditLedger.pglite.
 * test.js, which each carried an identical copy. Both now import it from here so
 * the multi-role capture logic lives in exactly one place. Not a `*.test.js`
 * file, so vitest never collects it as a suite.
 */

/** Pure core of netExecuteGrants: replay grant/revoke statements from an
 *  ordered list of SQL texts. The role capture takes the FULL comma-separated
 *  role list (`to service_role, authenticated`) and applies every role — a
 *  single-role `(\w+)` capture here previously registered only the first role,
 *  so a re-grant to `authenticated` hidden second in a role list would have
 *  slipped past the audit-#1 regression guard below. */
export function netExecuteGrantsFromSql(fnName, sqlTexts) {
  const re = new RegExp(`(grant|revoke)\\s+execute\\s+on\\s+function\\s+public\\.${fnName}\\b[\\s\\S]*?\\b(?:to|from)\\s+((?:\\w+\\s*,\\s*)*\\w+)`, 'i');
  const roles = new Set();
  for (const sql of sqlTexts) {
    for (const stmt of sql.split(';')) {
      const m = stmt.match(re);
      if (!m) continue;
      for (const role of m[2].split(/\s*,\s*/)) {
        if (/grant/i.test(m[1])) roles.add(role.toLowerCase());
        else roles.delete(role.toLowerCase());
      }
    }
  }
  return roles;
}
