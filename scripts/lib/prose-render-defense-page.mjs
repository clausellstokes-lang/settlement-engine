/**
 * scripts/lib/prose-render-defense-page.mjs — THE DEFENSE TAB, RENDERED TO TEXT IN PAGE ORDER
 * WITHOUT A BROWSER (brief ADDENDUM 18 ruling 6: the refuter reads the rendered page).
 *
 * Follows `src/components/new/tabs/DefenseTab.jsx` line by line (the derivations at :82-230,
 * the JSX order from :211): the readiness badge and the guard paragraph, the posture lines
 * (DS-DEF-1), the military-status lines (DS-DEF-8), the five threat rows with the composed
 * lines (DS-DEF-2) above them and each row's badge, assessment and funding note, the public
 * order fold (safety label, safetyDesc, DS-DEF-3 beside-lines, the criminal structure note,
 * DS-DEF-4), the armed forces (DS-DEF-5, the wall names, DS-DEF-11, the force names), the
 * supporting capabilities (DS-DEF-6) and the stress postures. Audience `dm` (the DM's own view;
 * the public gallery draws none of the desks — §885.3).
 *
 * Every composed line carries its pool key, variant id and face index from the rung's own
 * provenance (`pieces[0]`), so a refuter can name the face it is reading.
 *
 * Shared by `scripts/prose-render-page.mjs` and `scripts/prose-region-nouns.mjs`. Not a product
 * module. Deterministic for a given settlement.
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import * as defense from '../../src/domain/display/stateProse/defenseStateProse.js';
import { drawnAtMount } from '../../src/domain/display/stateProse/dossierMounts.js';
import { pageProse } from '../../src/domain/display/stateProse/faceSources.js';
import { buildThreatAssessment } from '../../src/domain/display/threatAssessment.js';
import {
  deriveDefenseReadiness, deriveGuardAssessment, deriveCriminalStructure,
  deriveSupportingCapabilities, DEFENSE_STRESS_STATUS,
} from '../../src/domain/display/defenseDisplay.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { rateGrid } from '../prose-rate-corpus.mjs';

/** @typedef {{section: string, kind: string, text: string, block?: string, pool?: string, vid?: number, face?: number, label?: string}} PageLine */

/** @param {object|null|undefined} rung @param {string} mount */
function composed(rung, mount) {
  const drawn = drawnAtMount(mount, rung);
  if (!drawn || !drawn.sentence) return null;
  const p = drawn.provenance || rung?.provenance || {};
  const piece = Array.isArray(p.pieces) ? p.pieces[0] : null;
  return { text: drawn.sentence, block: p.blockId, pool: p.poolKey, vid: piece?.vid, face: piece?.face };
}

/** The projected shape (DS-DEF-1 / DS-DEF-3): `{rung, beside}` — the beside line is taken only when the rung speaks. */
function projectedBeside(entry, mount) {
  if (!entry || !entry.rung) return null;
  const drawn = drawnAtMount(mount, entry.rung);
  if (!drawn || !drawn.sentence) return null;
  const p = entry.rung.provenance || {};
  const piece = Array.isArray(p.pieces) ? p.pieces[0] : null;
  return { text: entry.beside || drawn.sentence, block: p.blockId, pool: p.poolKey, vid: piece?.vid, face: piece?.face };
}

/**
 * ⭐ RENDER ONE SETTLEMENT'S DEFENSE TAB.
 * @param {object} s a generated settlement
 * @param {{audience?: string}} [options]
 * @returns {PageLine[]}
 */
export function renderDefensePage(s, options = {}) {
  const r = s || {};
  const seed = String(r._seed ?? r.id ?? '');
  // ⭐⭐ ONE PAGE READ FOR THE WHOLE TAB (car 8b-W-18o-r), exactly as `DefenseTab.jsx` does it —
  // this renderer follows that file line by line and must follow it here too, or the refuter
  // would read a page whose no-repeat state is not the page's.
  const opts = pageProse(r, { seed, audience: options.audience || 'dm' });
  /** @type {PageLine[]} */
  const out = [];
  const push = (section, kind, text, extra = {}) => { if (text) out.push({ section, kind, text: String(text), ...extra }); };
  const pushComposed = (section, c) => { if (c) out.push({ section, kind: 'composed', text: c.text, block: c.block, pool: c.pool, vid: c.vid, face: c.face }); };

  const d = r.defenseProfile || {};
  const inst = d.institutions || {};
  const sp = r.economicState?.safetyProfile || {};
  push('header', 'town', `${r.name || '(unnamed)'} · ${r.tier} · ${r.config?.culture || '?'} · threat ${r.config?.monsterThreat} · route ${r.config?.tradeRouteAccess} · terrain ${r.resourceAnalysis?.terrain || r.config?.terrainOverride || '?'} · seed ${seed}`);

  // The header badge and the guard paragraph.
  push('posture', 'badge', d.readiness?.label || 'Unknown', { label: 'readiness' });
  push('posture', 'machine', deriveGuardAssessment(r), { label: 'guardEffectivenessDesc' });
  const posture = defense.defensePostureProse(r, opts);
  for (const k of ['posture', 'terrain', 'prize']) pushComposed('posture', projectedBeside(posture[k], 'defense.postureHeader'));
  const status = defense.defenseMilitaryStatusProse(r, opts);
  for (const k of ['override', 'viability']) pushComposed('posture', composed(status[k], 'defense.militaryStatus'));

  // The five readiness rows: the composed lines above, then each machine row.
  const threat = defense.defenseThreatProse(r, opts);
  for (const k of ['beasts', 'invasion', 'internal', 'economic', 'disaster']) pushComposed('threat', composed(threat[k], 'defense.threatAssessment'));
  const rows = deriveDefenseReadiness(r);
  const threats = buildThreatAssessment(r);
  for (const row of threats) {
    const ready = rows.find((x) => x.label === row.label);
    push('threat', 'row', `${row.label} — ${ready ? scoreBand(ready.score) : '?'}`, { label: row.label });
    push('threat', 'machine', row.assess, { label: `${row.label}.assess` });
    if (ready?.fundingNote) push('threat', 'machine', ready.fundingNote, { label: `${row.label}.fundingNote` });
  }

  // Criminal Architecture & Public Order.
  const order = defense.defenseStateProse(r, opts);
  push('order', 'badge', sp.safetyLabel || '', { label: 'safetyLabel' });
  push('order', 'machine', sp.safetyDesc || '', { label: 'safetyDesc' });
  pushComposed('order', projectedBeside(order.publicOrder, 'defense.publicOrder'));
  pushComposed('order', projectedBeside(order.firstSurvey, 'defense.publicOrder'));
  const csd = deriveCriminalStructure(r);
  if (csd) { push('order', 'badge', csd.label, { label: 'criminalStructure' }); push('order', 'machine', csd.note, { label: 'criminalStructure.note' }); }
  const criminal = defense.defenseCriminalProse(r, csd?.key || null, opts);
  for (const k of ['structure', 'capture']) pushComposed('order', composed(criminal[k], 'defense.criminalStructure'));

  // Armed forces.
  const forces = defense.defenseForcesProse(r, opts);
  for (const k of ['fortification', 'force', 'contracted', 'charter', 'arcane']) pushComposed('forces', composed(forces[k], 'defense.armedForces'));
  const walls = inst.walls || [];
  if (walls.length) push('forces', 'roster', `fortifications: ${walls.map((w) => w.name).join(', ')}`);
  const wall = defense.defenseWallRationaleProse(r, opts);
  pushComposed('forces', composed(wall.rationale, 'defense.wallRationale'));
  const main = [...new Map([...(inst.garrison || []), ...(inst.militia || []), ...(inst.watch || [])].map((m) => [m.name, m])).values()];
  if (main.length) push('forces', 'roster', `standing forces: ${main.map((w) => w.name).join(', ')}`);
  if ((inst.mercenary || []).length) push('forces', 'roster', `contracted: ${inst.mercenary.map((w) => w.name).join(', ')}`);
  if ((inst.charter || []).length) push('forces', 'roster', `charter: ${inst.charter.map((w) => w.name).join(', ')}`);
  if ((inst.magicDef || []).length) push('forces', 'roster', `arcane: ${inst.magicDef.map((w) => w.name).join(', ')}`);
  // The roster lines above are the SNAPSHOT the tab prints (defenseProfile.institutions); the
  // composed force lines read the LIVE roster through the desk — the seam the card names.

  // Supporting capabilities.
  const supporting = defense.defenseSupportingProse(r, opts);
  for (const k of ['logistics', 'naval']) pushComposed('supporting', composed(supporting[k], 'defense.supportingCapabilities'));
  for (const cap of deriveSupportingCapabilities(r)) push('supporting', 'machine', `${cap.label}: ${cap.status} — ${cap.note}`, { label: cap.label });

  // Stress postures.
  const stresses = (Array.isArray(r.stress) ? r.stress : r.stress ? [r.stress] : []).filter(Boolean);
  for (const st of stresses) {
    const row = DEFENSE_STRESS_STATUS[st?.type];
    if (row) push('stress', 'badge', `${row.posture} (${st.type})`, { label: 'militaryStatus' });
  }
  return out;
}

/** @param {PageLine[]} lines @returns {string} */
export function pageText(lines) {
  let section = '';
  const out = [];
  for (const l of lines) {
    if (l.section !== section) { section = l.section; out.push(`── ${section.toUpperCase()} ──`); }
    const tag = l.kind === 'composed' ? `[composed ${l.block} · ${l.pool} · v${l.vid ?? '?'} f${l.face ?? '?'}]`
      : l.kind === 'machine' ? `[machine ${l.label || ''}]` : l.kind === 'badge' ? `[badge ${l.label || ''}]` : `[${l.kind}]`;
    out.push(`${tag} ${l.text}`);
  }
  return out.join('\n');
}

/** The (block, pool) keys the defense desks draw on a settlement. @param {object} s */
export function defensePoolsFired(s) {
  return renderDefensePage(s).filter((l) => l.kind === 'composed').map((l) => ({ block: l.block, pool: l.pool }));
}

/**
 * Generate rate-grid towns lazily until `n` on which (block, pool) fires are found.
 * @param {string} block @param {string} pool @param {number} n @param {{maxTowns?: number, onProgress?: Function}} [options]
 * @returns {Array<{spec: object, settlement: object}>}
 */
export function findTownsWhereKeyFires(block, pool, n, options = {}) {
  const grid = rateGrid();
  const max = options.maxTowns || grid.length;
  const found = [];
  let scanned = 0;
  for (const spec of grid) {
    if (found.length >= n || scanned >= max) break;
    scanned += 1;
    let s;
    try { s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { continue; }
    if (defensePoolsFired(s).some((f) => f.block === block && f.pool === pool)) found.push({ spec, settlement: s });
    if (options.onProgress && scanned % 50 === 0) options.onProgress(scanned, found.length);
  }
  return found;
}

/** The pool's packet directory slug. @param {string} block @param {string} pool */
export const poolDir = (block, pool) => `${block}-${pool}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
