/**
 * headlines — single-line "TLDR" insight for each chapter.
 *
 * Each function takes the relevant viewModel slice and returns either:
 *   - a string headline ready to render in <ChapterHeadline>
 *   - or null if there's nothing strong enough to surface
 *
 * Keep the logic conservative: only call something out when the data
 * actually warrants it. A weak or generic headline is worse than none —
 * it forces the DM to read past empty noise on every chapter opener.
 */
import { cap, humanize, label as labelOf } from './format.js';

// ── Overview ────────────────────────────────────────────────────────────────
export function overviewHeadline(o, identity) {
  if (!o) return null;
  const parts = [];
  // Dominant feature: prosperity + safety in plain English
  if (o.prosperity && o.safety) {
    parts.push(`A ${o.prosperity.toLowerCase()}, ${o.safety.toLowerCase()} ${(identity?.tier || 'settlement').toLowerCase()}`);
  } else if (identity?.tier) {
    parts.push(`A ${identity.tier.toLowerCase()}`);
  }
  // Stress overlay
  if (o.stress?.length) {
    parts.push(`under active strain (${o.stress.length} crisis chip${o.stress.length === 1 ? '' : 's'})`);
  }
  // Viability flag if explicit
  if (o.viability === false) {
    parts.push('with viability flagged as marginal or worse');
  }
  if (!parts.length) return null;
  return parts.join(' ') + '.';
}

export function overviewTone(o) {
  if (o?.stress?.length) return 'bad';
  if (o?.prosperityTone === 'good') return 'good';
  if (o?.prosperityTone === 'warn') return 'warn';
  return 'gold';
}

// ── Power Structure ─────────────────────────────────────────────────────────
export function powerHeadline(power, _identity) {
  if (!power) return null;
  const govType = power.governmentType ? humanize(power.governmentType) : null;
  const factions = power.factions || [];
  const top = factions.find(f => f?.isGoverning) || factions[0];
  const challenger = factions.filter(f => !f?.isGoverning).sort((a, b) => (b?.power || 0) - (a?.power || 0))[0];

  if (!govType && !top) return null;
  const bits = [];
  // powerSlice factions expose `.name` (mapped from f.faction); the old `.faction`
  // reads were always undefined so the headline never named the governing body.
  if (top?.name) bits.push(`${top.name}${govType ? ` (${govType.toLowerCase()})` : ''} governs`);
  else if (govType) bits.push(`${govType} rule`);
  if (challenger?.name && challenger?.power && top?.power && challenger.power >= top.power * 0.7) {
    // A continuation clause weaves onto the lead with a comma.
    bits.push(`, with ${challenger.name} pressing close behind`);
  } else if (factions.length > 2) {
    // An independent clause stands as its own sentence.
    bits.push(`, with ${factions.length - 1} other faction${factions.length - 1 === 1 ? '' : 's'} competing for influence`);
  }
  if (!bits.length) return null;
  return bits.join('') + '.';
}

export function powerTone(power) {
  if (!power) return 'gold';
  const stab = (power.stability || '').toLowerCase();
  if (stab === 'unstable' || stab === 'fragile' || stab === 'volatile') return 'bad';
  if (stab === 'tense' || stab === 'contested') return 'warn';
  return 'gold';
}

// ── Economics ───────────────────────────────────────────────────────────────
export function economicsHeadline(eco) {
  if (!eco) return null;
  const prosperity = eco.prosperity ? cap(eco.prosperity) : null;
  const complexity = eco.economicComplexity ? humanize(eco.economicComplexity) : null;
  const topExport = eco.primaryExports?.[0] ? labelOf(eco.primaryExports[0]) : null;
  const fb = eco.foodBalance || {};
  const bits = [];
  if (prosperity && complexity) bits.push(`${prosperity}, ${complexity.toLowerCase()} economy`);
  else if (prosperity) bits.push(`${prosperity} economy`);
  if (topExport) bits.push(`anchored on ${topExport.toLowerCase()}`);
  if (fb?.deficit > 0) {
    // importCoverage is a qty; coverage% = qty ÷ pre-import gap (rawDeficit).
    const ic = fb.importCoverage || 0;
    const pct = ic > 0 ? Math.round((ic / (fb.rawDeficit || ic)) * 100) : 0;
    bits.push(`food deficit: imports cover ${pct}% of the gap`);
  } else if (fb?.surplus > 0) bits.push(`food surplus`);
  if (!bits.length) return null;
  return bits.join(' · ') + '.';
}

export function economicsTone(eco) {
  if (!eco) return 'gold';
  const fb = eco.foodBalance || {};
  if (fb?.deficit > 0) {
    const ic = fb.importCoverage || 0;
    const pct = ic > 0 ? (ic / (fb.rawDeficit || ic)) * 100 : 0;
    return pct < 60 ? 'bad' : 'warn';
  }
  return 'gold';
}

// ── Defense ────────────────────────────────────────────────────────────────
export function defenseHeadline(def, identity) {
  if (!def) return null;
  const readiness = def.readiness?.label || def.readiness || null;
  const avg = def.scoreAvg ?? null;
  const tier = identity?.tier ? identity.tier.toLowerCase() : 'settlement';
  if (!readiness && avg == null) return null;
  const bits = [];
  if (readiness) bits.push(`${typeof readiness === 'string' ? cap(readiness) : readiness} readiness`);
  if (avg != null) bits.push(`avg defense ${avg}/100`);
  if (def.magicDependency) bits.push('magic-dependent');
  return `Defense for a ${tier}: ${bits.join(' · ')}.`;
}

export function defenseTone(def) {
  if (!def) return 'gold';
  const r = (def.readiness?.label || def.readiness || '').toString().toLowerCase();
  if (r.includes('critical') || r.includes('underdef') || r.includes('vulnerab')) return 'bad';
  if (r.includes('marginal') || r.includes('thin')) return 'warn';
  return 'good';
}

// ── Services ───────────────────────────────────────────────────────────────
export function servicesHeadline(services) {
  if (!services) return null;
  const list = services.detailed || [];
  const total = list.length;
  if (!total) return null;
  // Tally by category
  const byCat = {};
  for (const inst of list) {
    const c = inst?.category || 'other';
    byCat[c] = (byCat[c] || 0) + 1;
  }
  const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const top2 = sorted.slice(0, 2).map(([c, n]) => `${n} ${humanize(c).toLowerCase()}`).join(', ');
  return `${total} institution${total === 1 ? '' : 's'} on the books, heaviest in ${top2}.`;
}

// ── Resources ──────────────────────────────────────────────────────────────
export function resourcesHeadline(resources) {
  if (!resources) return null;
  // The resources slice exposes exportPotential + nearbyDepleted, not the
  // primaryExports/primaryImports that live on the economics slice.
  const exports = resources.exportPotential || resources.primaryExports || [];
  const depleted = resources.nearbyDepleted || [];
  if (!exports.length && !depleted.length) return null;
  const bits = [];
  if (exports.length) bits.push(`Exports ${exports.slice(0, 2).map(e => labelOf(e).toLowerCase()).join(', ')}`);
  if (depleted.length) bits.push(`${depleted.length} depleted resource${depleted.length === 1 ? '' : 's'}`);
  return bits.join('; ') + '.';
}

// ── Viability ──────────────────────────────────────────────────────────────
export function viabilityHeadline(viability) {
  if (!viability) return null;
  const verdict = viability.verdict || (viability.viable === false ? 'Not viable' : viability.viable === true ? 'Viable' : null);
  if (!verdict) return null;
  return `${verdict}. ${viability.summary || ''}`.trim();
}

export function viabilityTone(viability) {
  if (!viability) return 'gold';
  if (viability.viable === false) return 'bad';
  if (viability.viable === true) return 'good';
  return 'warn';
}

// ── History ────────────────────────────────────────────────────────────────
export function historyHeadline(history) {
  if (!history) return null;
  const age = history.age;
  const character = history.historicalCharacter;
  const events = (history.events || []).length;
  const tensions = (history.tensions || []).length;
  const bits = [];
  if (age) bits.push(`${age} years old`);
  if (character) bits.push(character);
  if (events) bits.push(`${events} recorded event${events === 1 ? '' : 's'}`);
  if (tensions) bits.push(`${tensions} live tension${tensions === 1 ? '' : 's'}`);
  if (!bits.length) return null;
  // Capitalise first character
  const out = bits.join(' · ');
  return out.charAt(0).toUpperCase() + out.slice(1) + '.';
}

// ── NPCs ───────────────────────────────────────────────────────────────────
export function npcsHeadline(npcs) {
  if (!npcs) return null;
  const list = npcs.all || [];
  if (!list.length) return null;
  const sorted = npcs.sorted || list.slice().sort((a, b) => (b.power || 0) - (a.power || 0));
  const top = sorted[0];
  const total = list.length;
  if (!top) return null;
  return `${total} named figure${total === 1 ? '' : 's'}: ${top.name}${top.title ? `, ${top.title}` : ''}, the most powerful (power ${top.power}).`;
}

// ── Hooks ──────────────────────────────────────────────────────────────────
export function hooksHeadline(hooks) {
  if (!hooks) return null;
  const all = hooks.all || [];
  if (!all.length) return null;
  // Tally by source
  const bySrc = {};
  for (const h of all) {
    const k = h?.source || 'other';
    bySrc[k] = (bySrc[k] || 0) + 1;
  }
  const top = Object.entries(bySrc).sort((a, b) => b[1] - a[1])[0];
  return `${all.length} plot hook${all.length === 1 ? '' : 's'} surfaced, heaviest from ${humanize(top[0]).toLowerCase()} (${top[1]}).`;
}

// ── Relationships ──────────────────────────────────────────────────────────
export function relationshipsHeadline(rel) {
  if (!rel) return null;
  // The relationships slice exposes `neighbours` (external) + `internal`, not the
  // `all`/`relationships` the old code read.
  const neighbours = rel.neighbours || [];
  const internal = rel.internal || rel.relationships || rel.all || [];
  const total = neighbours.length + internal.length;
  if (!total) return null;
  const bits = [];
  if (neighbours.length) bits.push(`${neighbours.length} neighbour link${neighbours.length === 1 ? '' : 's'}`);
  if (internal.length) bits.push(`${internal.length} internal tie${internal.length === 1 ? '' : 's'}`);
  return bits.join(', ') + ' on file.';
}
