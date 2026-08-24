/**
 * i8-nodrift-trace.mjs — REG-I0 · INSTRUMENT 8 · THE NO-DRIFT TRACE.
 *
 * L-REG-4 (§574): *"every visual element traces to Watabou, FTG, or the corpus; traceable-to-none
 * is drift needing written justification."* A law with no roster is a slogan, so this instrument
 * does two things:
 *   1. RE-DERIVES the op-class roster from `harness/renderFolio.mjs` at the sealed tip, by
 *      walking its own numbered section headers. The roster is never typed by hand.
 *   2. Checks every class against the COMMITTED TRACE TABLE below. **An untraced class is a
 *      countable miss** — the instrument returns the count, and the count is the exit criterion.
 *
 * ⭐⭐ IT IS A RATCHET, AND THAT IS THE POINT. A later wave that adds a drawing section to
 * renderFolio and does not trace it will see the miss count rise. The failure mode this closes is
 * the one §574 exists for: a novel visual language accumulating one well-meant flourish at a
 * time, with nobody able to name when it stopped looking like its references.
 *
 * ═══ THE ROSTER'S DEFINITION ═══
 *   A section header in renderFolio.mjs matching  `// ── <N> · <TITLE>`  where N is the section
 *   number (`7`, `11a`, `15c`). These are the file's own organisation, authored by the renderer
 *   rather than by this lane, and they partition the draw list exhaustively — every primitive the
 *   folio emits is emitted inside exactly one of them.
 *   ⚠ THE EMITTED `<g id>` GROUPS ARE A DIFFERENT, SMALLER SET AND ARE **NOT** THE ROSTER.
 *   `B.flush(id)` is called with an id exactly TWICE in the whole file (`fields`, `squares`), and
 *   the finished SVG carries ten groups. A trace table built on groups would cover a tenth of the
 *   drawing and read as complete. Both sets are reported; the SECTIONS are the roster.
 *
 * ═══ THE TRACE VALUES ═══
 *   'watabou' | 'ftg' | 'corpus'  — one or more, the references the class descends from
 *   'DRIFT'                       — traceable to NONE. Lawful only with a written justification,
 *                                   which this table carries inline and the report surfaces.
 *
 * Usage: node i8-nodrift-trace.mjs --wt=<worktree> [--json=]
 *        node i8-nodrift-trace.mjs --wt=<worktree> --controls
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';

/**
 * ⭐⭐⭐ THE COMMITTED TRACE TABLE. One row per op class. `why` is the written justification
 * L-REG-4 demands and is REQUIRED on every DRIFT row — a DRIFT row without one is itself a miss.
 * ⚠ THE THREE DRIFT ROWS ARE THE FINDING OF THIS INSTRUMENT, not an oversight. All three are the
 * engine's TRUTH layer surfacing as ink, which is exactly the thing no reference can supply: the
 * references are fixed pictures of invented places and have no history to draw.
 */
export const TRACE = Object.freeze({
  '0': { name: 'PAPER + the aged ground', trace: ['corpus'], why: 'the plate ground itself — the corpus\'s aged paper tone and low-value wash patches' },
  '1': { name: 'THE OPEN FIELDS — strips that tile', trace: ['ftg', 'corpus'], why: 'FTG draws cultivated parcels around a settlement; the corpus supplies the strip-furrow dress' },
  '2': { name: 'TERRACE LINES on the strips', trace: ['corpus'], why: 'terraced hillside plates' },
  '3': { name: 'THE RELIEF PASS', trace: ['watabou', 'corpus'], why: 'Watabou draws relief as marks rather than shading; the corpus supplies hachure grammar' },
  '4': { name: 'TREES', trace: ['watabou', 'ftg'], why: 'both references draw canopy as small repeated marks' },
  '4b': { name: 'THE WALK-SCALE RINGS (§12.3)', trace: ['DRIFT'], why: 'NO reference draws a walking-time ring. It is an immersion device of ours; §12.3 owns it. Lawful under L-REG-4 only with this justification on the record, and it is a NAMED CANDIDATE for the register\'s first subtraction if the judging round finds it reads as an overlay rather than as plate furniture.' },
  '4c': { name: 'THE COUNTRYSIDE EVENT MARKS (§12.5)', trace: ['DRIFT'], why: 'a dated stone or camp ground marking a real event has no analogue in a fixed picture — this is the truth layer becoming ink, and it is the engine\'s differentiator rather than a borrowing. Register-side it must READ as period map furniture; that is the judging question, not whether it traces.' },
  '5': { name: 'THE WATER BODY', trace: ['watabou', 'ftg', 'corpus'], why: 'all three; the corpus supplies bank and current-stroke dress' },
  '6': { name: 'THE URBAN GROUND', trace: ['corpus'], why: '§2.2\'s warm ground the town sits on — a corpus plate convention' },
  '6c': { name: 'THE FILLED-DITCH GARDENS (§250.5)', trace: ['corpus'], why: 'ribbon plots over a filled ditch are a real plate fossil the corpus shows' },
  '7': { name: 'THE STREET WEB — six ranks', trace: ['watabou', 'ftg'], why: 'Watabou\'s street-as-negative-space is the structure; rank hierarchy is FTG\'s legibility grammar' },
  '8': { name: 'SQUARES — holes in the fabric', trace: ['watabou', 'corpus'], why: 'Watabou\'s market hole; corpus plates draw the place as an inked void' },
  '9': { name: 'THE BLOCK GROUND\'S ABSENCE', trace: ['watabou'], why: 'the negative-space law itself — the block is not a filled shape' },
  '10': { name: 'YARDS', trace: ['corpus'], why: 'burgage-plot back ground on town plates' },
  '11': { name: 'THE FABRIC — every building inked', trace: ['watabou', 'ftg', 'corpus'], why: 'all three draw buildings as inked footprints' },
  '11a': { name: 'THE TWO-TIER STROKE + PLOT SERIES', trace: ['corpus'], why: 'measured off corpus plate hf40 at exactly 2:1 — the INK_SCALE ladder\'s origin' },
  '11b': { name: 'COUNTRYSIDE DWELLINGS + THE FAUBOURG', trace: ['ftg', 'corpus'], why: 'FTG\'s outlying steadings; the corpus\'s extramural suburbs' },
  '11c': { name: 'THE ACCESSIBLE LENS\'S HATCH GEOMETRY', trace: ['corpus'], why: 'hand-coloured plates distinguished washes by ruled hatch for a printer with no colour' },
  '12': { name: 'ROOF-RIDGE TICKS', trace: ['corpus'], why: 'the interior detail line that turns a filled quad into a roof on a plate' },
  '13': { name: 'LANDMARKS — §6 archetypes', trace: ['watabou', 'ftg', 'corpus'], why: 'all three give civic buildings a distinct larger form' },
  '13b': { name: 'THE VISIBLE WORK (§161b)', trace: ['corpus'], why: 'retaining walls and cuttings are drawn works on terraced plates' },
  '14': { name: 'TERRACES inside the town', trace: ['corpus'], why: 'as 13b, intramural' },
  '14b': { name: 'THE BRIDGES', trace: ['watabou', 'ftg', 'corpus'], why: 'all three; the street continues across the water' },
  '15': { name: 'WALLS — towers, gate breaks, piers', trace: ['watabou', 'corpus'], why: 'Watabou\'s circuit is the loudest stroke; §214 iconography is corpus-sourced' },
  '15a': { name: 'THE FOSSILS OF A SUPERSEDED CIRCUIT', trace: ['corpus'], why: 'old wall lines survive as street curves on real historic plates' },
  '15b': { name: 'THE STATE EXPRESSIONS (§10)', trace: ['DRIFT'], why: 'a besieger\'s camp, a barred gate, a lazar house beyond the last of them: these draw a settlement\'s CURRENT CONDITION, which a fixed picture has no way to express. The truth layer again. Justification: it is the §10 catalogue rendered in calm ink at plate weight, deliberately NOT a game overlay — the register test is whether a reader takes it for a surveyor\'s note.' },
  '15c': { name: 'THE SANCTUARY / LIBERTY BOUND (§18.1)', trace: ['corpus'], why: 'precinct and liberty bounds are drawn as dashed lines on period town plates' },
  '16': { name: 'WARD LABELS (now spliced at §173)', trace: ['ftg', 'corpus'], why: 'FTG names its quarters; the corpus supplies curved plate lettering' },
  '17': { name: 'THE FOLIO CHROME — cartouche + compass', trace: ['corpus'], why: 'plate chrome is a corpus convention outright' },
  '18': { name: 'THE IN-WORLD LEGEND (§12.7)', trace: ['corpus'], why: 'period plates carry a legend box teaching their own conventions' },
  '19': { name: 'THE LETTERING SPLICE (§173)', trace: ['corpus', 'ftg'], why: 'plate typography from the corpus; label placement discipline from FTG' },
});

export const REFERENCES = ['watabou', 'ftg', 'corpus'];

/** re-derive the roster from the renderer's own numbered section headers */
export function roster(renderFolioPath) {
  const s = readFileSync(renderFolioPath, 'utf8');
  const secs = [];
  for (const m of s.matchAll(/\/\/ ──+ *(?:⭐*)? *([0-9]+[a-z0-9]*) *· *([^\n]{0,120})/g)) {
    secs.push({ id: m[1], title: m[2].trim(), line: s.slice(0, m.index).split('\n').length });
  }
  const groups = [...new Set([...s.matchAll(/<g id="([a-z0-9]+)"/g)].map((m) => m[1]))];
  const flushes = [...new Set([...s.matchAll(/B\.flush\((["'])([^"']+)\1\)/g)].map((m) => m[2]))];
  return { sections: secs, groups, flushes, bytes: s.length, lines: s.split('\n').length };
}

export function audit(renderFolioPath) {
  const R = roster(renderFolioPath);
  const rows = [];
  for (const sec of R.sections) {
    const t = TRACE[sec.id];
    if (!t) { rows.push({ ...sec, status: 'UNTRACED', trace: null, why: null }); continue; }
    const drift = t.trace.includes('DRIFT');
    const bad = t.trace.filter((x) => x !== 'DRIFT' && !REFERENCES.includes(x));
    rows.push({
      ...sec, tableName: t.name, trace: t.trace, why: t.why,
      status: bad.length ? 'BAD_REFERENCE'
        : (drift ? (t.why && t.why.length > 40 ? 'DRIFT_JUSTIFIED' : 'DRIFT_UNJUSTIFIED') : 'TRACED'),
    });
  }
  const stale = Object.keys(TRACE).filter((k) => !R.sections.some((s) => s.id === k));
  const misses = rows.filter((r) => r.status === 'UNTRACED' || r.status === 'DRIFT_UNJUSTIFIED' || r.status === 'BAD_REFERENCE');
  const byRef = {};
  for (const ref of [...REFERENCES, 'DRIFT']) byRef[ref] = rows.filter((r) => r.trace && r.trace.includes(ref)).length;
  return {
    renderFolio: renderFolioPath, rendererLines: R.lines,
    opClasses: R.sections.length, tableRows: Object.keys(TRACE).length,
    emittedGroups: R.groups, flushIdsInSource: R.flushes,
    traced: rows.filter((r) => r.status === 'TRACED').length,
    driftJustified: rows.filter((r) => r.status === 'DRIFT_JUSTIFIED').length,
    untracedMisses: misses.length, misses: misses.map((m) => ({ id: m.id, title: m.title, status: m.status })),
    staleTableRows: stale,
    byReference: byRef,
    rows,
    pass: misses.length === 0 && stale.length === 0,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const wt = arg('wt', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0/w3f-tree');
  const rf = join(wt, 'harness/renderFolio.mjs');
  const res = audit(rf);
  const json = arg('json', null);

  if (process.argv.includes('--controls')) {
    // ⛔ THE RATCHET CONTROL: plant a section header the table has never seen and confirm the
    // miss count rises by exactly one. A roster walker that cannot see a new class is a walker
    // that will silently bless every future drift.
    const src = readFileSync(rf, 'utf8');
    const planted = `${HERE}/out/.renderFolio-PLANTED.mjs`;
    writeFileSync(planted, `${src}\n  // ── 99z · ⭐ A PLANTED OP CLASS THAT NOBODY TRACED\n`);
    const P = audit(planted);
    // and a STALE control: a table row whose section no longer exists
    const trimmed = `${HERE}/out/.renderFolio-TRIMMED.mjs`;
    writeFileSync(trimmed, src.replace(/\/\/ ──+ *(?:⭐*)? *15c *· /, '// -- removed 15c -- '));
    const S = audit(trimmed);

    process.stdout.write(`BASE      opClasses=${res.opClasses} traced=${res.traced} driftJustified=${res.driftJustified} misses=${res.untracedMisses} stale=${res.staleTableRows.length}\n`);
    process.stdout.write(`PLANTED   opClasses=${P.opClasses} misses=${P.untracedMisses}  ${JSON.stringify(P.misses)}\n`);
    process.stdout.write(`TRIMMED   opClasses=${S.opClasses} stale=${JSON.stringify(S.staleTableRows)}\n`);
    const live = [
      ['the base roster is fully traced', res.untracedMisses === 0],
      ['no stale table rows on the base', res.staleTableRows.length === 0],
      ['a planted op class raises the miss count by exactly one', P.untracedMisses === res.untracedMisses + 1],
      ['a removed section is reported as a STALE table row', S.staleTableRows.length === 1],
      ['every DRIFT row carries a written justification', res.rows.filter((r) => r.trace && r.trace.includes('DRIFT')).every((r) => r.status === 'DRIFT_JUSTIFIED')],
      ['the roster is bigger than the emitted group set (groups are NOT the roster)', res.opClasses > res.emittedGroups.length * 3],
    ];
    process.stdout.write('\n── LIVENESS\n');
    for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
    writeFileSync(`${HERE}/out/i8-controls.json`, JSON.stringify({ base: res, planted: P, trimmed: S, liveness: live }, null, 2));
    process.stdout.write(`\nI8_CONTROLS ${live.every((l) => l[1]) ? 'LIVE' : 'BROKEN'}\n`);
  } else {
    process.stdout.write(`── THE NO-DRIFT TRACE TABLE · ${res.opClasses} op classes over ${res.rendererLines} lines of renderFolio.mjs\n\n`);
    process.stdout.write(`  ${'#'.padEnd(5)} ${'trace'.padEnd(26)} class\n`);
    for (const r of res.rows) {
      process.stdout.write(`  ${r.id.padEnd(5)} ${(r.trace || ['—']).join('+').padEnd(26)} ${r.title.slice(0, 74)}\n`);
      if (r.trace && r.trace.includes('DRIFT')) process.stdout.write(`        ⚠ DRIFT · ${r.why}\n`);
    }
    process.stdout.write(`\n  traced=${res.traced}  driftJustified=${res.driftJustified}  UNTRACED MISSES=${res.untracedMisses}  staleRows=${res.staleTableRows.length}\n`);
    process.stdout.write(`  by reference: ${Object.entries(res.byReference).map(([k, v]) => `${k}=${v}`).join('  ')}\n`);
    process.stdout.write(`  emitted <g id> groups (NOT the roster): ${res.emittedGroups.join(', ')}\n`);
    process.stdout.write(`  B.flush ids in source: ${res.flushIdsInSource.join(', ')}\n`);
    if (json) writeFileSync(json, JSON.stringify(res, null, 2));
    process.stdout.write(`I8_${res.pass ? 'PASS' : 'FAIL'}\n`);
  }
}
