/**
 * couplingReceiptSample.js — CW-0w slice 3: THE SHARED RECEIPT-FIELD SAMPLER.
 *
 * A coupling row's `receiptField` is the address that makes the foreign read
 * REVIEWABLE: it names where the evidence lands. Nothing checked those addresses
 * against emitted receipts, so a row could name a field the writer never writes
 * and the registry would still read as a complete audit trail.
 *
 * This helper is the join. It parses the address grammar the registry actually
 * uses and resolves the state-rooted addresses against real emitted records.
 * Per seam SC-9 the SAMPLING is distributed: CW-0w lands the helper plus the WAR
 * volume's sample, and each later volume's convergence wave (TR-9, GR-7, …)
 * samples its OWN rows through this same helper. Central sampling would need
 * every volume's flags lit in one harness — the empty-harness vacuity hazard.
 *
 * THE HONESTY RULE. An address this helper cannot resolve is reported as
 * UNSAMPLABLE with its reason; it is never silently counted as satisfied. A
 * sampler that passes on addresses it did not check is worse than no sampler,
 * because it converts an unknown into a green.
 *
 * THE GRAMMAR, as the 26 live rows spell it:
 *   `pulseRecord.warCoalitionEvidence[kind=a|b].{band,callId}`   state-rooted
 *   `worldState.envoyErrands[state=home].{id,npcId}`             state-rooted
 *   `spatialLedgers.treaties[].{sourceTermSheetId}`              state-rooted
 *   `readWarPeaceDecision(...).receipt.{decision,reason}`        returned read
 *   several addresses on one row, separated by `; `
 */

/** Roots that name persisted/emitted state this helper can walk. */
export const STATE_ROOTS = Object.freeze(['pulseRecord', 'worldState', 'spatialLedgers']);

/** Split `a,b,c.{d,e}` on TOP-level commas only. */
function splitTopLevel(text) {
  const out = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (char === ',' && depth === 0) { out.push(current); current = ''; continue; }
    current += char;
  }
  if (current) out.push(current);
  return out.map((part) => part.trim()).filter(Boolean);
}

/** `{type,context.{decisionId,actualAction}}` -> type, context.decisionId, … */
function flattenLeafGroup(group) {
  const out = [];
  for (const part of splitTopLevel(group)) {
    const nested = part.match(/^([A-Za-z0-9_]+)\.\{(.*)\}$/s);
    if (nested) {
      for (const child of flattenLeafGroup(nested[2])) out.push(`${nested[1]}.${child}`);
    } else {
      out.push(part);
    }
  }
  return out;
}

/**
 * Parse ONE address into a typed shape.
 * @param {string} address
 * @returns {{raw:string, rootKind:string, root:string, segments:Array<{name:string,filter:string|null}>, leafFields:string[]}}
 */
export function parseReceiptAddress(address) {
  const raw = String(address || '').trim();
  let body = raw;
  const leafFields = [];
  // The trailing brace group is the leaf field set; everything before it is path.
  const leaf = body.match(/\.\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}$/s);
  if (leaf) {
    leafFields.push(...flattenLeafGroup(leaf[1]));
    body = body.slice(0, leaf.index);
  }
  const rawSegments = splitPath(body);
  const head = rawSegments[0]?.name ?? '';
  const returnedRead = /\($/.test(head) || /\(\.\.\.\)$/.test(rawSegments[0]?.raw ?? '');
  const rootKind = returnedRead ? 'returned-read'
    : (STATE_ROOTS.includes(head) ? head : 'unknown-root');
  return {
    raw,
    rootKind,
    root: head,
    segments: returnedRead ? rawSegments : rawSegments.slice(1),
    leafFields,
  };
}

/**
 * Split `a.b[kind=x].c` into segments, keeping bracket filters attached.
 *
 * A MID-PATH brace group is a BRANCH, not a leaf: WR-4 spells its two trade
 * components as `homeFrontComponents.{roads,markets}.{band,stateRead}`, where
 * the first group names two sibling sub-objects and only the second names
 * fields. A parser that recognised the trailing group alone resolved that
 * address to nothing — caught by sampling against the real read rather than by
 * reading the grammar.
 */
function splitPath(body) {
  const out = [];
  for (const piece of String(body).split(/\.(?![^[]*\])/)) {
    const text = piece.trim();
    if (!text) continue;
    const branch = text.match(/^\{(.*)\}$/s);
    if (branch) {
      out.push({ raw: text, name: null, branch: splitTopLevel(branch[1]), filter: null });
      continue;
    }
    const match = text.match(/^([A-Za-z0-9_().]+?)(?:\[(.*)\])?$/s);
    out.push({
      raw: text,
      name: (match?.[1] ?? text).replace(/\(\.\.\.\)$/, '('),
      branch: null,
      filter: match?.[2] ?? null,
    });
  }
  return out;
}

/** Every address on one registry row. */
export function parseReceiptField(receiptField) {
  return String(receiptField || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map(parseReceiptAddress);
}

const asArray = (value) => (Array.isArray(value) ? value : (value == null ? [] : [value]));
const readPath = (object, path) => path.split('.')
  .reduce((node, key) => (node == null ? undefined : node[key]), object);

/** A `[kind=a|b]` / `[state=home]` filter, applied to one record. */
function matchesFilter(record, filter) {
  if (!filter || filter === '' || filter === '...' || filter === '*') return true;
  const equality = filter.match(/^([A-Za-z0-9_]+)=(.+)$/s);
  if (!equality) return true; // `[plant:*]` and friends are shape hints, not predicates
  const allowed = equality[2].split('|');
  return allowed.includes(String(readPath(record, equality[1])));
}

/**
 * Resolve one parsed address against a real emitted record.
 *
 * @param {ReturnType<typeof parseReceiptAddress>} parsed
 * @param {Record<string, unknown>} roots e.g. `{ pulseRecord, worldState }`
 * @returns {{status:'sampled'|'unsampled'|'missing', reason?:string, matched:number, presentFields:string[], absentFields:string[]}}
 */
export function resolveReceiptAddress(parsed, roots) {
  if (parsed.rootKind === 'returned-read') {
    return {
      status: 'unsampled',
      reason: `${parsed.root} is a RETURNED read, not persisted state — sample it by calling the read`,
      matched: 0,
      presentFields: [],
      absentFields: [],
    };
  }
  if (!Object.prototype.hasOwnProperty.call(roots, parsed.root)) {
    return {
      status: 'unsampled',
      reason: `no '${parsed.root}' root was supplied to the sampler`,
      matched: 0,
      presentFields: [],
      absentFields: [],
    };
  }
  let nodes = asArray(roots[parsed.root]);
  for (const segment of parsed.segments) {
    const next = [];
    const names = segment.branch ?? [segment.name];
    for (const node of nodes) {
      for (const name of names) {
        for (const child of asArray(readPath(node, name))) {
          if (child != null && matchesFilter(child, segment.filter)) next.push(child);
        }
      }
    }
    nodes = next;
  }
  if (!nodes.length) {
    return { status: 'missing', reason: 'the address resolved to nothing', matched: 0, presentFields: [], absentFields: parsed.leafFields };
  }
  const presentFields = parsed.leafFields
    .filter((field) => nodes.some((node) => readPath(node, field) !== undefined));
  return {
    status: 'sampled',
    matched: nodes.length,
    presentFields,
    absentFields: parsed.leafFields.filter((field) => !presentFields.includes(field)),
  };
}

/**
 * Sample every address on a registry row.
 * @param {{couplingId:string, receiptField:string}} row
 * @param {Record<string, unknown>} roots
 */
export function sampleCouplingRow(row, roots) {
  return parseReceiptField(row.receiptField)
    .map((parsed) => ({ couplingId: row.couplingId, parsed, result: resolveReceiptAddress(parsed, roots) }));
}
