/**
 * dmFieldProjection.test.js — LANE P-2: THE DM-FIELD PROJECTION RULE, proven.
 *
 * The amendment's own pin, verbatim:
 *
 *   > a DM-edited field renders byte-identical with the state-prose corpus fully wired
 *   > (the hardest negative — machine prose must be provably incapable of touching the
 *   > pen's ground).
 *
 * "Provably incapable" is the bar, so this file carries two kinds of evidence:
 *
 *   BEHAVIOURAL — the projection returns the DM's string by IDENTITY (===), unchanged
 *   in every case the corpus can produce: no line, a line, a blank line, a line for a
 *   field the DM has not touched, and a field whose text happens to equal the machine
 *   sentence.
 *
 *   STRUCTURAL — a source scan over the whole stateProse family proving no module in it
 *   contains an assignment into any DM-editable prose path. Behaviour pins protect the
 *   call sites that exist; the scan protects the ones a future wiring would add.
 *
 * @enforced-by this file
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DM_EDITABLE_SETTLEMENT_PROSE_PATHS,
  DM_FIELD_FRAMED_BY_BLOCK,
  isDmEditableProsePath,
  projectBesideDmField,
  projectBesideSettlementField,
  readProsePath,
} from '../../src/domain/display/stateProse/dmFieldProjection.js';
import { QUEUE_WIRED_PROSE_PATHS } from '../../src/store/settlementPendingEdits.js';
import { readStateProse } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';

const ROOT = resolve(import.meta.dirname, '../..');
const FAMILY_DIR = join(ROOT, 'src/domain/display/stateProse');

describe('the DM-editable path register', () => {
  it('is in exact lockstep with the queue-wired prose paths', () => {
    // The editor's list is canonical. A path added there and forgotten here would let a
    // composer write into a field the DM can edit, which is the whole failure this rule
    // exists to prevent.
    expect([...DM_EDITABLE_SETTLEMENT_PROSE_PATHS])
      .toEqual([...QUEUE_WIRED_PROSE_PATHS.settlement]);
  });

  it('names a real editable path for every block the corpus frames onto one', () => {
    for (const [block, path] of Object.entries(DM_FIELD_FRAMED_BY_BLOCK)) {
      expect(isDmEditableProsePath(path), `${block} → ${path}`).toBe(true);
    }
    expect(Object.keys(DM_FIELD_FRAMED_BY_BLOCK).length).toBeGreaterThanOrEqual(8);
  });
});

describe('THE RULE: machine prose renders beside the pen, never into it', () => {
  const EDITED = 'The gate is watched by a man who remembers my players burning it down.';

  it('returns the DM string by identity when a machine line is offered', () => {
    const projected = projectBesideDmField(EDITED, 'The approach is ordinary and the town is used to it.');
    expect(projected.field).toBe(EDITED);
    expect(projected.beside).toBe('The approach is ordinary and the town is used to it.');
  });

  it('returns the same DM string byte-identically whether or not the corpus speaks', () => {
    // The amendment's pin. Four corpus outcomes, one field, one set of bytes.
    const dark = projectBesideDmField(EDITED, null);
    const wired = projectBesideDmField(EDITED, 'A machine sentence.');
    const blank = projectBesideDmField(EDITED, '   ');
    const undefinedLine = projectBesideDmField(EDITED, undefined);
    for (const projected of [dark, wired, blank, undefinedLine]) {
      expect(projected.field).toBe(EDITED);
      expect(projected.hasField).toBe(true);
    }
    // A whitespace-only machine line is NOT a line: it must not open an empty slot
    // beside the field where a reader would infer withheld content.
    expect(blank.beside).toBeNull();
    expect(undefinedLine.beside).toBeNull();
  });

  it('does not swallow a DM field that happens to equal the machine sentence', () => {
    const same = 'The town is poor and hard to reach.';
    const projected = projectBesideDmField(same, same);
    expect(projected.field).toBe(same);
    expect(projected.beside).toBe(same);
  });

  it('reports an untouched field as absent without inventing one', () => {
    expect(projectBesideDmField(undefined, 'A machine sentence.').hasField).toBe(false);
    expect(projectBesideDmField('', 'A machine sentence.').hasField).toBe(false);
    expect(projectBesideDmField(undefined, 'A machine sentence.').field).toBeUndefined();
  });

  it('never mutates the settlement it reads through', () => {
    const settlement = {
      arrivalScene: EDITED,
      history: { founding: { reason: 'A ford that had to be watched.' } },
    };
    const before = JSON.stringify(settlement);
    const line = readStateProse(DOSSIER_STATE_PROSE_GENERAL, 'DS-GEN-5', 'ordinary (route road and the default)',
      { slots: { settlement: 'Thornwall' }, seed: 'w1', audience: 'dm' });
    const projected = projectBesideSettlementField(settlement, 'arrivalScene', line?.text);
    expect(projected.field).toBe(EDITED);
    expect(projected.beside).toBe(line?.text ?? null);
    expect(JSON.stringify(settlement)).toBe(before);
    expect(settlement.arrivalScene).toBe(EDITED);
  });

  it('reads a nested path without creating it', () => {
    const settlement = { history: { founding: { reason: 'A ford.' } } };
    expect(readProsePath(settlement, 'history.founding.reason')).toBe('A ford.');
    expect(readProsePath(settlement, 'history.founding.overcoming')).toBeUndefined();
    expect(readProsePath(settlement, 'economicViability.summary')).toBeUndefined();
    expect(settlement.economicViability).toBeUndefined();
  });
});

describe('THE RULE, structurally: the family holds no writer', () => {
  /** Every source file of the state-prose family. */
  function familySources() {
    return readdirSync(FAMILY_DIR, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
      .map((entry) => join(entry.parentPath ?? entry.path, entry.name));
  }

  it('has sources to scan — an emptied family would make the scan vacuous', () => {
    expect(familySources().length).toBeGreaterThanOrEqual(2);
  });

  it('contains no assignment into any DM-editable prose path', () => {
    const offenders = [];
    for (const file of familySources()) {
      const source = readFileSync(file, 'utf8');
      for (const path of DM_EDITABLE_SETTLEMENT_PROSE_PATHS) {
        const leaf = path.split('.').pop();
        // `x.arrivalScene =`, `x['arrivalScene'] =`, and the object-literal spelling
        // `arrivalScene:` that a rebuild-the-settlement composer would use. `==` and
        // `=>` are excluded so a comparison or an arrow is not read as a write.
        const assignment = new RegExp(
          `(\\.${leaf}\\s*=(?![=>])|\\['${leaf}'\\]\\s*=(?![=>])|\\["${leaf}"\\]\\s*=(?![=>]))`,
        );
        if (assignment.test(source)) offenders.push(`${file.slice(ROOT.length + 1)} writes ${path}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('imports no store, no slice and no persistence seam', () => {
    // A leaf that cannot reach a writer cannot become one. The projection rule is only
    // as strong as the family's inability to persist anything at all.
    const offenders = [];
    for (const file of familySources()) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/^\s*import\s[^;]*?from\s+['"]([^'"]+)['"]/gm)) {
        const spec = match[1];
        if (/store|slice|persist|supabase|localStorage|pendingEdits/i.test(spec)) {
          offenders.push(`${file.slice(ROOT.length + 1)} imports ${spec}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
