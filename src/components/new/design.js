import { GOLD, GOLD_B, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, BORDER2, CARD, PARCH, CARD_ALT } from '../theme.js';

export const C = {
  parchment: PARCH, card: CARD, cardAlt: CARD_ALT,
  ink: INK, inkDeep: INK_DEEP,
  textPrimary: INK, textSecond: SECOND, textMuted: MUTED,
  gold: GOLD, goldBright: GOLD_B, goldBg: GOLD_BG,
  border: BORDER2, borderLight: '#ede3cc', borderDark: BORDER,
  safe:     { bg:'#f0faf2', border:'#a8d8b0', accent:'#2d7a44', text:'#1a4a20' },
  moderate: { bg:'#fdf8e8', border:'#e0c860', accent:'#8a7a10', text:'#4a3a10' },
  unsafe:   { bg:'#fdf4e8', border:'#e0b880', accent:'#a0580a', text:'#5a3010' },
  danger:   { bg:'#fdf0e8', border:'#e8b0a0', accent:'#a03010', text:'#5a1a10' },
  critical: { bg:'#fdf4f4', border:'#e8b0b0', accent:'#8b1a1a', text:'#5a1a1a' },
  minor: '#8b5a2a', major: '#a0762a', catastrophic: '#8b1a1a',
  government: '#2a3a7a', military: '#8b1a1a', economy: '#a0762a',
  religious:  '#1a5a28', magic: '#5a2a8a', criminal: '#4a1a4a', other: '#5a4a2a',
};

export const TIER_LABELS = {
  thorp:'Thorp', hamlet:'Hamlet', village:'Village',
  town:'Town', city:'City', metropolis:'Metropolis',
};

export const FACTION_COLORS = ['#2a3a7a','#8b1a1a','#1a5a28','#5a2a8a','#a0762a','#2a5a6a','#6a3a2a'];

export const PROSPERITY_COLORS = {
  'Thriving':'#1a5a28','Prosperous':'#2d7a44','Stable':'#a0762a',
  'Struggling':'#a0580a','Poor':'#8b1a1a','Destitute':'#5a1a1a',
};

export const catColor = (cat) => C[cat?.toLowerCase()] || C.other;
export const prospColor = (p) => PROSPERITY_COLORS[p] || C.gold;
