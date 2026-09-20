/**
 * launchPillHostWrap.walker.test.js: A LAUNCH-LOCKED BUTTON CAN ALWAYS WRAP ITS PILL.
 *
 * ── THE DEFECT (owner orders 2026-09-17, "Fix the small visual defects") ──────────
 * On the Realm page the Instant World card's locked "See Premium" button read
 * "ee Premium", its "Available at launch" pill cut off at the other end. The Button
 * primitive is `white-space: nowrap; justify-content: center`, and the a11y floor
 * `button { min-width: 24px }` (src/styles/a11y.css) replaces a flex item's automatic
 * min-content minimum. So a Button that is a flex item in a container narrower than
 * "label + pill" shrinks below its content, the content spills out of both sides,
 * and any clipping ancestor cuts both ends. The card sits in the Realm's 240px
 * sidebar, which is narrower than a phone, so the launch-lock pass that gave its
 * siblings a closed-only wrap by VIEWPORT width missed it.
 *
 * ── THE RULE ───────────────────────────────────────────────────────────────────
 * Every `<AvailableAtLaunchPill>` whose parent JSX element is a `<Button>` is a SITE.
 * A site WRAPS when the Button's own `style` attribute source names `flexWrap` (the
 * closed-only idiom: `style={purchasesAreOpen ? undefined : { flexWrap: 'wrap' }}`),
 * or when the pill's own style sets `whiteSpace: 'normal'` (its words can then break,
 * so the row's minimum shrinks to the longest word). Anything else must be EXEMPT by
 * name, with a measured reason. The census of 2026-09-17 found 35 pills in 24 files,
 * 22 of them in Buttons; every Button host now wraps except the two below.
 *
 * ── THE FROZEN SETS, EXACT IN BOTH DIRECTIONS ─────────────────────────────────
 *   WRAPS         file -> Button sites that can wrap.
 *   EXEMPT        file -> Button sites that cannot, each with a written reason.
 *   OTHER_HOSTS   file -> pills whose parent is not the Button primitive (a raw
 *                 <button>, a <span>, a menu row), which this rule does not judge;
 *                 frozen so a new host of any kind is looked at, not added silently.
 * A new un-wrapped Button host reds until it wraps or is exempted by name; a cured or
 * removed row also reds, so no stale row lingers as spare budget.
 *
 * ── KNOWN EDGES (accepted, stated) ─────────────────────────────────────────────
 *   - A wrap supplied only through a spread (`...lockedButtonStyle`) is invisible to a
 *     source read; BuyThisDossier is the one such host and is EXEMPT by name.
 *   - Only files that mention the pill are parsed; every one must parse and must
 *     import the pill under its own name, so an alias cannot hide a site.
 *   - This pins the ABILITY to wrap, not the geometry; the geometry was measured in
 *     Chromium at 1024 and 390 wide when this walker landed (the chair's survey).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'espree';
import { describe, expect, test } from 'vitest';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const PILL = 'AvailableAtLaunchPill';

/** Button sites that can wrap, per file. */
const WRAPS = Object.freeze({
  'src/components/account/AccountAutoReloadPanel.jsx': 1,
  'src/components/account/AccountSeatTransferPanel.jsx': 2,
  'src/components/account/AccountSubscriptionSection.jsx': 1,
  'src/components/account/ReferralRedeemBlocks.jsx': 1,
  // 2 since 2026-09-18: the ANONYMOUS arm gained its own tier door ("See
  // Cartographer"), which is the same conversion CTA the signed-in free arm
  // renders and therefore the same launch-locked site. Both carry the
  // closed-only wrap idiom.
  'src/components/compendium/CustomContentGate.jsx': 2,
  'src/components/dossier/DossierSessionNotices.jsx': 1,
  'src/components/gallery/GalleryDetail.jsx': 1,
  'src/components/generate/PlaceInRegionCard.jsx': 1,
  'src/components/home/LandingBelowFold.jsx': 1,
  'src/components/instant/InstantWorldEntry.jsx': 1,
  // The locked-Realm gate moved OUT of RealmDashboard.jsx into its own leaf on
  // 2026-09-18 so the desktop palette could render the same card: the pill and
  // its wrapping Button host moved with it, which is why RealmDashboard no
  // longer appears here and RealmLockedGate does.
  'src/components/map/RealmLockedGate.jsx': 1,
  'src/components/pricing/PricingMomentCard.jsx': 1,
  // the Subscribe CTA wraps; the credit-pack tile's pill sets whiteSpace: 'normal'
  'src/components/pricing/PricingTierCards.jsx': 2,
  'src/components/settlement/DeityAssignmentPanel.jsx': 2,
  'src/components/settlement/FaithSection.jsx': 1,
  'src/components/settlement/eventComposer/EventComposerDeityField.jsx': 1,
  'src/components/settlementDetail/SettlementDetailActions.jsx': 1,
  'src/components/settlements/SaveQuotaMeter.jsx': 1,
  'src/components/settlements/SettlementCard.jsx': 2,
});

/** Button sites that cannot wrap, each deliberately. */
const EXEMPT = Object.freeze({
  'src/components/BuyThisDossier.jsx': {
    count: 2,
    reason: 'the host is a min-content inline grid, where a wrap would ALWAYS break the line on desktop; it wraps on phones through the lockedButtonStyle spread (tests/components/launchLock.dossier.test.jsx pins both widths)',
  },
});

/** Pills whose parent is not the Button primitive, per file (not judged by this rule). */
const OTHER_HOSTS = Object.freeze({
  'src/components/AccountMenu.jsx': 1, // MenuRow
  'src/components/PurchaseModal.jsx': 3, // raw <button> tile (pill whiteSpace normal), a <span> note, a raw link button
  'src/components/account/AccountAutoReloadPanel.jsx': 1, // Row
  'src/components/account/AccountSubscriptionSection.jsx': 1, // raw <button> tile (pill whiteSpace normal)
  'src/components/dossier/DossierLadderModal.jsx': 1, // block <span>
  'src/components/dossier/ExportUnlockDialog.jsx': 1, // inline-flex <span> that already wraps
  // ⭐ A NEW KIND OF HOST, LOOKED AT RATHER THAN ADDED SILENTLY (FIX-P5, ODQ §934.63 F16).
  // The entitlement ladder's two value cells: the pill now joins any cell that quotes a
  // currency mark, which today is "$2.99 per settlement" alone. A `<td>` is not a Button
  // and this rule does not judge it — and it cannot clip the pill the way the Realm
  // sidebar clipped "ee Premium", because the cure carries its own geometry: the cell
  // drops `whiteSpace: 'nowrap'` to `'normal'` exactly where the pill joins the figure,
  // so the pill takes its own line inside a narrow column instead of spilling out of one.
  'src/components/pricing/PricingBands.jsx': 2, // the ladder's free + cartographer <td> cells
  'src/components/primitives/LockedDestination.jsx': 1, // raw <button>
  'src/components/settlement/NextActionRail.jsx': 1, // block <span>
});

function* walkSources(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walkSources(p);
    else if (/\.(js|jsx)$/.test(name)) yield p;
  }
}

/** Depth-first over every node, handing each JSX element its nearest JSX element parent. */
function visitJsx(node, parent, cb) {
  if (!node || typeof node.type !== 'string') return;
  let next = parent;
  if (node.type === 'JSXElement') {
    cb(node, parent);
    next = node;
  }
  for (const key of Object.keys(node)) {
    const value = node[key];
    if (Array.isArray(value)) {
      for (const child of value) if (child && typeof child.type === 'string') visitJsx(child, next, cb);
    } else if (value && typeof value.type === 'string') {
      visitJsx(value, next, cb);
    }
  }
}

/** @param {any} element */
function elementName(element) {
  const name = element.openingElement.name;
  if (name.type === 'JSXIdentifier') return name.name;
  if (name.type === 'JSXMemberExpression') return `${name.object.name}.${name.property.name}`;
  return '?';
}

/** @param {any} element @param {string} source @param {string} attr */
function attrSource(element, source, attr) {
  const found = element.openingElement.attributes
    .find((a) => a.type === 'JSXAttribute' && a.name.name === attr);
  return found ? source.slice(found.range[0], found.range[1]) : '';
}

/**
 * Census one source text.
 * @returns {{ sites: { line: number, wraps: boolean }[], others: { line: number, parent: string }[], importsUnderOwnName: boolean }}
 */
function censusSource(source) {
  const ast = parse(source, {
    ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true }, range: true, loc: true,
  });
  const sites = [];
  const others = [];
  visitJsx(ast, null, (element, parent) => {
    if (elementName(element) !== PILL) return;
    const parentName = parent ? elementName(parent) : '(none)';
    if (parentName !== 'Button') {
      others.push({ line: element.loc.start.line, parent: parentName });
      return;
    }
    const buttonWraps = /\bflexWrap\b/.test(attrSource(parent, source, 'style'));
    const pillBreaks = /whiteSpace:\s*['"]normal['"]/.test(attrSource(element, source, 'style'));
    sites.push({ line: element.loc.start.line, wraps: buttonWraps || pillBreaks });
  });
  const importsPill = ast.body.filter((n) => n.type === 'ImportDeclaration' && /AvailableAtLaunchPill(\.jsx)?$/.test(n.source.value));
  const importsUnderOwnName = importsPill.every((n) => n.specifiers
    .filter((s) => s.type === 'ImportDefaultSpecifier')
    .every((s) => s.local.name === PILL));
  return { sites, others, importsUnderOwnName };
}

function censusTree() {
  const wraps = {};
  const unwrapped = {};
  const others = {};
  const parseFailures = [];
  const aliased = [];
  const unwrappedDetail = [];
  let files = 0;
  let pills = 0;
  for (const file of walkSources(SRC)) {
    const text = readFileSync(file, 'utf8');
    if (!text.includes(PILL)) continue;
    const rel = relative(ROOT, file).split('\\').join('/');
    if (rel === 'src/components/primitives/AvailableAtLaunchPill.jsx') continue;
    files += 1;
    let result;
    try {
      result = censusSource(text);
    } catch (err) {
      parseFailures.push(`${rel}: ${err.message}`);
      continue;
    }
    if (!result.importsUnderOwnName) aliased.push(rel);
    for (const site of result.sites) {
      pills += 1;
      const bucket = site.wraps ? wraps : unwrapped;
      bucket[rel] = (bucket[rel] || 0) + 1;
      if (!site.wraps) unwrappedDetail.push(`${rel}:${site.line}`);
    }
    if (result.others.length) {
      pills += result.others.length;
      others[rel] = result.others.length;
    }
  }
  return { files, pills, wraps, unwrapped, others, parseFailures, aliased, unwrappedDetail };
}

const counts = (table) => Object.fromEntries(Object.entries(table).map(([k, v]) => [k, typeof v === 'number' ? v : v.count]));
const sorted = (obj) => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

describe('the detector sees what it claims to (mutant arms)', () => {
  test('a Button hosting the pill with no wrap is an un-wrapped site', () => {
    const src = 'export const A = () => <Button disabled={!open}>See Premium{!open && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}</Button>;';
    expect(censusSource(src).sites).toEqual([{ line: 1, wraps: false }]);
  });

  test('the closed-only wrap, a merged-style wrap, and a pill whose words break all count as wrapping', () => {
    const src = [
      "export const A = () => <Button style={open ? undefined : { flexWrap: 'wrap' }}>Go<AvailableAtLaunchPill /></Button>;",
      "export const B = () => <Button style={{ minHeight: 44, ...(open ? null : { flexWrap: 'wrap' }) }}>Go<AvailableAtLaunchPill /></Button>;",
      "export const C = () => <Button style={{ flex: 1 }}>Go<AvailableAtLaunchPill style={{ whiteSpace: 'normal' }} /></Button>;",
    ].join('\n');
    expect(censusSource(src).sites.map((s) => s.wraps)).toEqual([true, true, true]);
  });

  test('a wrap arriving only through a spread is invisible (why BuyThisDossier is named)', () => {
    const src = "export const A = () => <Button style={{ minHeight: 44, ...locked }}>Buy<AvailableAtLaunchPill /></Button>;";
    expect(censusSource(src).sites).toEqual([{ line: 1, wraps: false }]);
  });

  test('a pill inside a span inside a Button is judged by its span, and an aliased import is caught', () => {
    const src = [
      "import LaunchPill from '../primitives/AvailableAtLaunchPill.jsx';",
      'export const A = () => <Button><span><AvailableAtLaunchPill /></span></Button>;',
    ].join('\n');
    const result = censusSource(src);
    expect(result.sites).toEqual([]);
    expect(result.others).toEqual([{ line: 2, parent: 'span' }]);
    expect(result.importsUnderOwnName).toBe(false);
  });
});

describe('every launch-locked Button can wrap its pill, or is exempt by name', () => {
  const tree = censusTree();

  test('the walk is not vacuous: every host parsed, under the pill\'s own name, and the census is whole', () => {
    expect(tree.parseFailures).toEqual([]);
    expect(tree.aliased).toEqual([]);
    expect(tree.files).toBeGreaterThanOrEqual(20);
    expect(tree.pills).toBeGreaterThanOrEqual(35);
  });

  test('WRAPS is exact: a new wrapping host or a lost wrap both red', () => {
    expect(sorted(tree.wraps)).toEqual(sorted(WRAPS));
  });

  test('EXEMPT is exact: an un-wrapped Button host not named here clips when its box is narrow', () => {
    expect(sorted(tree.unwrapped), `un-wrapped Button hosts found:\n${tree.unwrappedDetail.join('\n')}`).toEqual(sorted(counts(EXEMPT)));
    for (const [file, row] of Object.entries(EXEMPT)) {
      expect(row.reason.length, `${file} carries a written reason`).toBeGreaterThan(20);
    }
  });

  test('OTHER_HOSTS is exact: a pill in a new kind of host is looked at, not added silently', () => {
    expect(sorted(tree.others)).toEqual(sorted(OTHER_HOSTS));
  });
});
