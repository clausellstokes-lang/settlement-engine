// Shared constants for all tab components

export const isMobile = () => window.innerWidth < 640;
export const PROSPERITY_COLORS = {Poverty:'#8b1a1a',Impoverished:'#8b1a1a',Struggling:'#8a4010',Poor:'#8a4010',Moderate:'#7a5010',Modest:'#7a5010',Comfortable:'#1a5a28',Prosperous:'#1a4a2a',Wealthy:'#1a5a28',Thriving:'#0a3a18'};
export const EVENT_COLORS = {disaster:{color:'#8b1a1a',bg:'#fdf4f4',border:'#e8c0c0',label:'Disaster'},political:{color:'#1a3a7a',bg:'#f4f6fd',border:'#c0cce8',label:'Political'},economic:{color:'#a0762a',bg:'#faf6ec',border:'#e0d0a0',label:'Economic'},religious:{color:'#5a2a8a',bg:'#f8f4fd',border:'#d0b8e8',label:'Religious'},magical:{color:'#2a5a8a',bg:'#f4f8fd',border:'#b8cce8',label:'Magical'}};
export const SEV_COLORS = {minor:'#6b5340',major:'#a0762a',catastrophic:'#8b1a1a'};
export const SERVICE_META = {lodging:{label:'Lodging',accent:'#2a3a7a',icon:'\u{1F3E0}'},food:{label:'Food & Drink',accent:'#1a5a28',icon:'\u{1F37A}'},equipment:{label:'Equipment',accent:'#a0762a',icon:'\u2694\uFE0F'},magic:{label:'Magical Services',accent:'#5a2a8a',icon:'\u2728'},information:{label:'Information',accent:'#1a5a6a',icon:'\u{1F4DC}'},healing:{label:'Healing',accent:'#8b1a1a',icon:'\u2695\uFE0F'},transport:{label:'Transportation',accent:'#2a4a7a',icon:'\u{1F40E}'},legal:{label:'Legal & Financial',accent:'#3a3a3a',icon:'\u2696\uFE0F'},entertainment:{label:'Entertainment',accent:'#7a3a1a',icon:'\u{1F3AD}'},employment:{label:'Employment',accent:'#1a4a2a',icon:'\u{1F4CB}'},criminal:{label:'Criminal Services',accent:'#3a1a1a',icon:'\u{1F5E1}\uFE0F',note:'Available if you know where to look'}};
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
  lodging:     { label:'Lodging',           accent:'#2a3a7a', icon:'🏠' },
  food:        { label:'Food & Drink',      accent:'#1a5a28', icon:'🍺' },
  equipment:   { label:'Equipment',         accent:'#a0762a', icon:'⚔️' },
  magic:       { label:'Magical Services',  accent:'#5a2a8a', icon:'✨' },
  information: { label:'Information',       accent:'#1a5a6a', icon:'📜' },
  healing:     { label:'Healing',           accent:'#8b1a1a', icon:'⚕️' },
  transport:   { label:'Transportation',    accent:'#2a4a7a', icon:'🐎' },
  legal:       { label:'Legal & Financial', accent:'#3a3a3a', icon:'⚖️' },
  entertainment:{ label:'Entertainment',    accent:'#7a3a1a', icon:'🎭' },
  employment:  { label:'Employment',        accent:'#1a4a2a', icon:'📋' },
  criminal:    { label:'Criminal Services', accent:'#3a1a1a', icon:'🗡️', note:'Available if you know where to look' },
};


// Expected service categories per tier (used by ServicesTab to flag missing categories)
export const J0 = {
  thorp:      ['food'],
  hamlet:     ['food', 'healing'],
  village:    ['food', 'healing', 'equipment'],
  town:       ['food', 'healing', 'equipment', 'information', 'lodging'],
  city:       ['food', 'healing', 'equipment', 'information', 'lodging', 'legal', 'transport'],
  metropolis: ['food', 'healing', 'equipment', 'information', 'lodging', 'legal', 'transport', 'entertainment'],
};
