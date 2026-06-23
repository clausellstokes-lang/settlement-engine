import { Home, Beer, Sword, Sparkles, ScrollText, Cross, Ship, Scale, Drama, ClipboardList, VenetianMask } from 'lucide-react';
import { swatch } from '../theme.js';
import { getIsMobile } from '../../hooks/useIsMobile.js';
// Shared constants for all tab components

// Delegate to the ONE shared mobile-flag source so the tabs read the same,
// reactive-backed value as Buttons/IconButtons instead of a separate
// `innerWidth` probe that went stale on rotate. Still a plain function for
// non-React callers; each call returns a fresh read at the 640 breakpoint.
export const isMobile = () => getIsMobile(640);

// ── BODY token ───────────────────────────────────────────────────────────────
// The tabs historically used a per-file `const second=swatch['#6B5340']` for body
// copy. Centralising it here means a future contrast adjustment is one edit,
// not 13. The hex value matches the existing ink-mid brown so the visual
// is identical to what the per-file constants were already rendering.
export const BODY = swatch['#6B5340'];
export const PROSPERITY_COLORS = {Poverty:'#8b1a1a',Impoverished:'#8b1a1a',Struggling:'#8a4010',Poor:'#8a4010',Moderate:'#7a5010',Modest:'#7a5010',Comfortable:'#1a5a28',Prosperous:'#1a4a2a',Wealthy:'#1a5a28',Thriving:'#0a3a18'};
export const EVENT_COLORS = {disaster:{color:'#8b1a1a',bg:'#fdf4f4',border:'#e8c0c0',label:'Disaster'},political:{color:'#1a3a7a',bg:'#f4f6fd',border:'#c0cce8',label:'Political'},economic:{color:'#a0762a',bg:'#faf6ec',border:'#e0d0a0',label:'Economic'},religious:{color:'#5a2a8a',bg:'#f8f4fd',border:'#d0b8e8',label:'Religious'},magical:{color:'#2a5a8a',bg:'#f4f8fd',border:'#b8cce8',label:'Magical'}};
export const SEV_COLORS = {minor:'#6b5340',major:'#a0762a',catastrophic:'#8b1a1a'};
export const FACTION_COLORS = ['#a0762a','#8b1a1a','#1a4a2a','#2a3a7a','#5a2a8a','#3a2a1a'];
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
export const Ts = {
  lodging:     { label:'Lodging',           accent:'#2a3a7a', icon:Home },
  food:        { label:'Food & Drink',      accent:'#1a5a28', icon:Beer },
  equipment:   { label:'Equipment',         accent:'#a0762a', icon:Sword },
  magic:       { label:'Magical Services',  accent:'#5a2a8a', icon:Sparkles },
  information: { label:'Information',       accent:'#1a5a6a', icon:ScrollText },
  healing:     { label:'Healing',           accent:'#8b1a1a', icon:Cross },
  transport:   { label:'Transportation',    accent:'#2a4a7a', icon:Ship },
  legal:       { label:'Legal & Financial', accent:'#3a3a3a', icon:Scale },
  entertainment:{ label:'Entertainment',    accent:'#7a3a1a', icon:Drama },
  employment:  { label:'Employment',        accent:'#1a4a2a', icon:ClipboardList },
  criminal:    { label:'Criminal Services', accent:'#3a1a1a', icon:VenetianMask, note:'Available if you know where to look' },
};


// Expected service categories per tier (used by ServicesTab to flag missing
// categories). The map now lives in domain/display/servicesDisplay.js so the PDF
// derives the same absences from one source; re-exported here as J0 for callers.
export { EXPECTED_SERVICES_BY_TIER as J0 } from '../../domain/display/servicesDisplay.js';
