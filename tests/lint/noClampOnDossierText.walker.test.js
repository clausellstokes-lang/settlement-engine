// @vitest-environment node
/**
 * noClampOnDossierText.walker.test.js — AUTHORED TEXT IS NEVER CLAMPED ON THE DOSSIER
 * (the owner's rule, ODQ §934.23).
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────
 * A clamp on a written sentence is not a layout choice; it is the product declining
 * to print what it wrote. The Economics tab's revenue rows carried the shape in its
 * purest form: a 210 px side column with `overflow:hidden`, `textOverflow:ellipsis`
 * and `whiteSpace:nowrap` on BOTH the source name and its description, so every
 * desktop reader got "Payments in kind or coin from tenant farmers;…" and never the
 * clause that says what it means — while the phone, which the 2026-09-18 car had
 * already stacked, read the whole sentence. The same eight sites across the dossier
 * each clamped a generated name, a taxonomy label or a written line.
 *
 * ⛔ AND THE PRIOR CURE'S OWN WORDS ARE THE WARNING. Two of those sites had already
 * been reasoned about once — "Desktop keeps the clamp unchanged — above the
 * breakpoint the card is wide, the name fits, and the ellipsis never fires". That is
 * a PREDICTION about a generated string, not a proof about one. A conflict source
 * reads "X vs Y" and both halves are generated; a service category falls back to its
 * raw token on a catalogue the taxonomy has not named. No width makes these provably
 * short, which is why the rule is a rule and not a judgement per site.
 *
 * ── THE WALK ─────────────────────────────────────────────────────────────────
 * ARM 1 (THE RULE) parses every file under the dossier component trees and refuses
 * ANY style object carrying `textOverflow: 'ellipsis'` or a line clamp. There is no
 * exemption list, because a clamp cannot be proven harmless: it is defined by what
 * it removes.
 *
 * ARM 2 (THE NOWRAP REGISTRY) is the narrower rule, and it needs a registry because
 * `whiteSpace: 'nowrap'` is legitimate on furniture that cannot truncate. Every
 * nowrap site in the scope is counted PER FILE against a frozen row that names what
 * the line holds and why it cannot truncate — the per-file-count idiom
 * negativeAssertionAnchor.walker.test.js uses, which is stable under formatting and
 * still catches a NEW site in an already-registered file. A row whose proof is a
 * width guess rather than a bound on the string does not belong here.
 *
 * ARM 3 (ANTI-VACUITY) runs the detector over synthetic sources: a planted clamp is
 * found, a planted line clamp is found, and a clean source yields nothing — so a
 * detector that stopped matching reds here rather than passing the whole tree.
 *
 * ⚠ SCOPE. The dossier, its shells, and THE EDITOR AT ITS FOOT (`src/components/new/**`,
 * `src/components/dossier/**`, `src/components/edit/**`). Admin panels, pickers and palettes
 * outside the dossier are explicitly out of scope: this rule is about what the PRODUCT prints
 * to a reader, not about every string in the app.
 *
 * ⭐ THE EDITOR JOINED THE SCOPE AT THE UNFREEZE (U11, 2026-09-23). The widening was RULED in
 * advance and held back on purpose — judgment 267(4) reserved it for "once the mount is
 * landed", and EM-D3c landed the mount — because a tree whose pages nothing renders cannot be
 * measured for what it prints. Edit Mode draws written sentences at the dossier's foot: a
 * decree's authored line, a guard's reason, a counterparty's name, a free field's text. A
 * clamp there declines to print them exactly as the Economics tab's did.
 *
 * ⛔ AND THE GAP WAS MEASURED, NOT ASSUMED. At `8b5565922`, with `textOverflow: 'ellipsis'` and
 * `whiteSpace: 'nowrap'` planted by copy into `DecreeRegistryPage.jsx`, THIS WALKER STAYED
 * GREEN ("Test Files 1 passed | Tests 6 passed") while the phone-chrome census and the
 * keyboard-reachability walker each named that same planted file. Two of the three UI walkers
 * already governed the editor; this was the one that did not.
 *
 * ⭐ THE TREE ARRIVES CLEAN, AND THAT IS A MEASUREMENT: at `8b5565922` the five editor surfaces
 * carry ZERO clamps and ZERO nowraps, so the widening owes NOWRAP_REGISTRY not one row. The
 * surfaces and the members that landed them are the roster ARM 0 pins below.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'espree';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DOSSIER_TREES = ['src/components/new', 'src/components/dossier', 'src/components/edit'];

/**
 * ⭐ THE EDITOR'S ROSTER — each surface, what it draws, and the member that landed it.
 *
 * A tree name alone would let a page be renamed out of the rule in silence, which is the
 * failure the phone census's own header describes one level up. These rows are checked
 * against the walk in ARM 0: a surface that leaves the tree reds and must be re-pointed.
 * Every count below was measured at `8b5565922` by this file's own detector.
 */
const EDITOR_SURFACES = Object.freeze([
  {
    path: 'src/components/edit/EditModeShell.jsx',
    draws: "Edit Mode's shell — the register, the three roster roots, the seal block and EM-F3's counterparties roster",
    member: 'EM-D1 (the shell), EM-F3 (the counterparties roster), EM-D3c (the registry mount)',
    clamps: 0, nowraps: 0,
  },
  {
    path: 'src/components/edit/CardEditorDialog.jsx',
    draws: "the door: one card's fields, the provenance line and the Confirm act",
    member: 'EM-D0e (the door), EM-D2b (the coverage prop)',
    clamps: 0, nowraps: 0,
  },
  {
    path: 'src/components/edit/DecreeRegistryPage.jsx',
    draws: "the page of decrees at the dossier's foot — authored decree lines, guard reasons, chronicle links",
    member: 'EM-D3 (the page), EM-D3c (its mount)',
    clamps: 0, nowraps: 0,
  },
  {
    path: 'src/components/edit/PoolField.jsx',
    draws: "a pooled field's chooser inside the door",
    member: 'EM-D0e',
    clamps: 0, nowraps: 0,
  },
  {
    path: 'src/components/edit/FreeField.jsx',
    draws: "a free-text field inside the door, with EM-D2's uncovered-glyph notice",
    member: 'EM-D0e (the field), EM-D2/EM-D2b/EM-D2c (the coverage notice)',
    clamps: 0, nowraps: 0,
  },
]);

/**
 * THE NOWRAP REGISTRY — every `whiteSpace: 'nowrap'` the dossier is allowed to carry,
 * per file, each with the reason the line it holds cannot truncate. The count is
 * EXACT: a new nowrap in one of these files reds, and so does one that leaves.
 */
const NOWRAP_REGISTRY = Object.freeze([
  {
    path: 'src/components/new/tabs/WarTab.jsx', nowrap: 1,
    holds: 'the unit-staleness band word',
    proof: 'A closed vocabulary from STALENESS_TONE, longest member "stale" — the kicker is'
      + ' `marginLeft: auto` beside a flexible label, so it is the element that takes what it needs.',
  },
  {
    path: 'src/components/new/tabs/EconomicsTab.jsx', nowrap: 1,
    holds: 'the revenue percentage printed INSIDE the share run',
    proof: 'An integer percent plus a sign: at most four characters ("100%"), and it is drawn'
      + ' only when the run is at least 8% wide, so the glyphs always have room.',
  },
  {
    path: 'src/components/new/tabs/RumorsTab.jsx', nowrap: 1,
    holds: 'the rumor-age kicker',
    proof: 'A formatted relative age from a closed grammar ("3d ago"), bounded by the formatter'
      + ' rather than by the width of the card.',
  },
  {
    path: 'src/components/new/tabs/HistoryTab.jsx', nowrap: 1,
    holds: 'the timeline year label',
    proof: 'An integer and one letter ("142y"). The label is absolutely positioned OUTSIDE any'
      + ' clipping box, so nowrap keeps the number on one line and clips nothing.',
  },
  {
    path: 'src/components/new/tabs/TraditionsTab.jsx', nowrap: 1,
    holds: 'a tradition chip',
    proof: 'A chip from the tradition vocabulary in a wrapping flex row: the ROW wraps, so a'
      + ' chip that will not fit moves to the next line rather than being cut.',
  },
  {
    path: 'src/components/dossier/DossierTabStrip.jsx', nowrap: 1,
    holds: 'a tab label',
    proof: 'The tab vocabulary is a fixed, authored list and the strip SCROLLS horizontally'
      + ' (`flexShrink: 0` on each tab), so a long label widens the strip instead of losing letters.',
  },
  {
    path: 'src/components/dossier/DossierNarrativeButtons.jsx', nowrap: 1,
    holds: 'a button label',
    proof: 'Fixed authored button copy in a wrapping button row; no generated string reaches it.',
  },
]);

// ── The detector (shared by the live walk and the anti-vacuity plants) ────────

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkFiles(p, out);
    else if (/\.jsx?$/.test(p) && !/\.test\./.test(p)) out.push(p);
  }
  return out;
}

/** @param {any} node @param {(n:any)=>void} fn */
function visit(node, fn) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const n of node) visit(n, fn); return; }
  if (typeof node.type === 'string') fn(node);
  for (const key of Object.keys(node)) {
    if (key === 'range' || key === 'loc') continue;
    visit(node[key], fn);
  }
}

/** Both spellings of a line clamp, plus the ellipsis truncation. */
const CLAMP_KEYS = new Set(['WebkitLineClamp', '-webkit-line-clamp', 'lineClamp']);

/**
 * Every truncation and every nowrap in one source.
 * @param {string} source @param {string} path
 * @returns {{clamps: {path:string,line:number,key:string}[], nowraps: {path:string,line:number}[]}}
 */
function scanClampSites(source, path) {
  const ast = parse(source, {
    ecmaVersion: 'latest', sourceType: 'module', loc: true, range: true,
    ecmaFeatures: { jsx: true },
  });
  const clamps = [];
  const nowraps = [];
  visit(ast, (node) => {
    if (node.type !== 'Property' || node.computed) return;
    const key = node.key?.name ?? node.key?.value;
    const value = node.value?.value;
    if (key === 'textOverflow' && value === 'ellipsis') clamps.push({ path, line: node.loc.start.line, key });
    else if (CLAMP_KEYS.has(String(key))) clamps.push({ path, line: node.loc.start.line, key: String(key) });
    else if (key === 'whiteSpace' && value === 'nowrap') nowraps.push({ path, line: node.loc.start.line });
  });
  return { clamps, nowraps };
}

/** Every file the walk reads, repo-relative — the denominator ARM 0 pins. ONE walk. */
const SCANNED = DOSSIER_TREES
  .flatMap((tree) => walkFiles(join(ROOT, tree)))
  .map((abs) => relative(ROOT, abs).replace(/\\/g, '/'))
  .sort();

const LIVE = SCANNED
  .map((rel) => scanClampSites(readFileSync(join(ROOT, rel), 'utf8'), rel))
  .reduce((acc, r) => ({ clamps: [...acc.clamps, ...r.clamps], nowraps: [...acc.nowraps, ...r.nowraps] }),
    { clamps: [], nowraps: [] });

describe('no clamp on dossier text (ODQ §934.23) — the product prints what it wrote', () => {
  it('ARM 0 — the walk is live over all three declared trees, and the editor surfaces are in it', () => {
    // ⛔ ANTI-VACUITY FOR THE TREE LIST ITSELF. ARM 1 and ARM 2 both assert against an EMPTY
    // set, which a walk that read nothing also produces — a tree renamed or a directory moved
    // would silence the rule rather than red it. That is precisely how the editor went
    // ungoverned until this car: not by a broken detector, but by a scope nobody re-asked.
    for (const tree of DOSSIER_TREES) {
      expect(
        SCANNED.filter((f) => f.startsWith(`${tree}/`)).length,
        `${tree} contributed no file to the walk — has the tree moved or been renamed?`,
      ).toBeGreaterThanOrEqual(2);
    }
    expect(
      EDITOR_SURFACES.map((s) => s.path).filter((p) => !SCANNED.includes(p)),
      'an editor surface this roster names is no longer in the walk. It was renamed, moved or '
      + 'retired: re-point the row, rather than letting the surface leave the rule quietly.',
    ).toEqual([]);
    for (const row of EDITOR_SURFACES) {
      expect(row.member.length, `${row.path}: name the member that landed the surface`).toBeGreaterThan(3);
      expect(row.draws.length, `${row.path}: say what the surface draws`).toBeGreaterThan(20);
    }
  });

  it('ARM 1 — no ellipsis truncation and no line clamp anywhere on the dossier', () => {
    expect(
      LIVE.clamps.map((c) => `${c.path}:${c.line} ${c.key}`),
      'A clamp landed on the dossier. Authored text is never clamped: give the line a layout'
      + ' that wraps. A name column may keep `whiteSpace: nowrap` only with a registry row'
      + ' proving the string it holds cannot truncate — a width guess is not a proof.',
    ).toEqual([]);
  });

  it('ARM 2 — every nowrap in the dossier is registered with a proof, exactly', () => {
    const counted = new Map();
    for (const n of LIVE.nowraps) counted.set(n.path, (counted.get(n.path) ?? 0) + 1);
    const live = [...counted.entries()].map(([path, nowrap]) => ({ path, nowrap }))
      .sort((a, b) => a.path.localeCompare(b.path));
    const registered = NOWRAP_REGISTRY.map(({ path, nowrap }) => ({ path, nowrap }))
      .sort((a, b) => a.path.localeCompare(b.path));
    expect(
      live,
      'A `whiteSpace: nowrap` appeared, moved file or vanished on the dossier. Register it with'
      + ' the reason its line cannot truncate, or remove it.',
    ).toEqual(registered);
  });

  it('ARM 2b — a registry row without a real proof is not a registry row', () => {
    expect(NOWRAP_REGISTRY.length).toBeGreaterThanOrEqual(5);
    for (const row of NOWRAP_REGISTRY) {
      expect(typeof row.holds, row.path).toBe('string');
      expect(row.holds.length, `${row.path}: say what the line holds`).toBeGreaterThan(10);
      expect(row.proof.length, `${row.path}: the proof must bound the STRING, not guess a width`)
        .toBeGreaterThan(60);
    }
  });
});

describe('guard-the-guard: the clamp detector is not vacuous', () => {
  const PLANTED = [
    "export const A = () => <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.desc}</span>;",
    "export const B = () => <span style={{ display: '-webkit-box', WebkitLineClamp: 2 }}>{x.desc}</span>;",
  ].join('\n');

  it('a planted ellipsis and a planted line clamp are both found', () => {
    const { clamps, nowraps } = scanClampSites(PLANTED, 'src/planted.jsx');
    expect(clamps.map((c) => c.key)).toEqual(['textOverflow', 'WebkitLineClamp']);
    expect(nowraps.length).toBe(1);
  });

  it('a wrapping layout yields nothing (the detector does not flood the scope)', () => {
    const clean = "export const C = () => <span style={{ minWidth: 0, lineHeight: 1.45 }}>{x.desc}</span>;";
    const { clamps, nowraps } = scanClampSites(clean, 'src/clean.jsx');
    // anchored: the SAME detector returns two clamps and one nowrap for PLANTED in the arm
    // above, so an empty result here measures the predicate rather than a broken walk.
    expect(clamps).toEqual([]);
    expect(nowraps).toEqual([]);
  });

  it('a non-ellipsis textOverflow is not a clamp (the cured sites use `clip` with `normal`)', () => {
    const cured = "export const D = () => <span style={{ overflow: 'visible', textOverflow: 'clip', whiteSpace: 'normal' }}>{x.desc}</span>;";
    const { clamps, nowraps } = scanClampSites(cured, 'src/cured.jsx');
    // anchored: PLANTED's two clamps above prove the same detector fires on the real shape.
    expect(clamps).toEqual([]);
    expect(nowraps).toEqual([]);
  });
});
