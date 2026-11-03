import { swatch } from '../theme.js';
import { SERVICE_LABELS } from '../../domain/display/servicesDisplay.js';
// Shared constants for all tab components

// F28 — the old `isMobile = () => window.innerWidth < 640` helper was a
// non-reactive one-shot read: it never re-evaluated on resize/rotate, so a tab
// laid out for desktop stayed desktop after the viewport narrowed (and vice
// versa). All consumers now use the reactive `useIsMobile` hook
// (src/hooks/useIsMobile.js), which subscribes to window resize. The export was
// removed once the last call site migrated — reach for the hook, not a helper.

// ── Tier 7.19 — BODY token (sweep across components) ─────────────────────────
// The tabs historically used a per-file `const second=swatch['#6B5340']` for body
// copy. Centralising it here means a future contrast adjustment is one edit,
// not 13. The hex value matches the existing ink-mid brown so the visual
// is identical to what the per-file constants were already rendering.
export const BODY = swatch['#6B5340'];
export const PROSPERITY_COLORS = {Poverty:'#8b1a1a',Impoverished:'#8b1a1a',Struggling:'#8a4010',Poor:'#8a4010',Moderate:'#7a5010',Modest:'#7a5010',Comfortable:'#1a5a28',Prosperous:'#1a4a2a',Wealthy:'#1a5a28',Thriving:'#0a3a18'};
export const EVENT_COLORS = {disaster:{color:'#8b1a1a',bg:'#fdf4f4',border:'#e8c0c0',label:'Disaster'},political:{color:'#1a3a7a',bg:'#f4f6fd',border:'#c0cce8',label:'Political'},economic:{color:'#a0762a',bg:'#faf6ec',border:'#e0d0a0',label:'Economic'},religious:{color:'#5a2a8a',bg:'#f8f4fd',border:'#d0b8e8',label:'Religious'},magical:{color:'#2a5a8a',bg:'#f4f8fd',border:'#b8cce8',label:'Magical'}};
export const SEV_COLORS = {minor:'#6b5340',major:'#a0762a',catastrophic:'#8b1a1a'};
// Canonical index-keyed faction palette for the dossier. Single source of truth
// for the Power tab's stacked faction bar and the Summary tab's faction bar —
// both import this instead of forking their own arrays. (Consolidated from four
// drifted copies; this is the dossier-canonical sequence the Power tab rendered.)
export const FACTION_COLORS = ['#a0762a','#8b1a1a','#1a4a2a','#2a3a7a','#5a2a8a','#3a1a6a','#6a3a1a'];
export const REL_STYLES = {
  ally:           {color:'#1a5a28',bg:'#f0faf2',border:'#a8d8b0'},
  rival:          {color:'#8b1a1a',bg:'#fdf4f4',border:'#e8c0c0'},
  enemy:          {color:'#5a0a0a',bg:'#fdf0f0',border:'#e0a0a0'},
  patron_client:  {color:'#a0762a',bg:'#faf8e4',border:'#e0d090'},
  debtor_creditor:{color:'#5a2a8a',bg:'#f8f4fd',border:'#d0b8e8'},
  political:      {color:'#2a3a7a',bg:'#f0f4ff',border:'#a8b8e8'},
  respect:        {color:'#1a4a6a',bg:'#f0f8ff',border:'#a8c8e8'},
  mentor_student: {color:'#2a5a2a',bg:'#f4faf4',border:'#b0d8b0'},
  family:         {color:'#6a3a1a',bg:'#faf4ee',border:'#d8b898'},
};
export const relStyle = t => REL_STYLES[t] || {color:'#6b5340',bg:'#faf8f4',border:'#e0d0b0'};
// Service categories. NO ICON FIELD (owner icon-sweep directive, 2026-08-03):
// the eleven emoji pictograms that used to dress these rows are gone — the label
// and the accent colour carry the category. Do not reintroduce an icon slot;
// tests/lint/copyCorruption.test.js SIG 1 bans the empty-string form outright,
// and tests/components/serviceCategoryIcons.test.jsx pins the absence of glyphs.
// LABELS HAVE ONE SOURCE (RS-14, chair ruling 2026-10-30): servicesDisplay.js ::
// SERVICE_LABELS. This table keeps only what is the screen's own, the accent. The dead,
// emoji-bearing SERVICE_META copy and the criminal card's note ("Available if you know
// where to look", R1: the descs already say so) are deleted.
const SERVICE_ACCENTS = {
  lodging: '#2a3a7a', food: '#1a5a28', equipment: '#a0762a', magic: '#5a2a8a',
  information: '#1a5a6a', healing: '#8b1a1a', transport: '#2a4a7a', legal: '#3a3a3a',
  entertainment: '#7a3a1a', employment: '#1a4a2a', criminal: '#3a1a1a',
};
export const Ts = Object.fromEntries(
  Object.entries(SERVICE_ACCENTS).map(([key, accent]) => [key, { label: SERVICE_LABELS[key], accent }]),
);


// Expected service categories per tier (used by ServicesTab to flag missing
// categories). The map now lives in domain/display/servicesDisplay.js so the PDF
// derives the same absences from one source; re-exported here as J0 for callers.
export { EXPECTED_SERVICES_BY_TIER as J0 } from '../../domain/display/servicesDisplay.js';
