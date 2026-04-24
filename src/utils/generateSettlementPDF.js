/**
 * generateSettlementPDF.js  — v3
 *
 * Design principles:
 * 1. Text never sits inside a colored bar — bars are decoration only
 * 2. Income sources use sidebar-stripe stat lines, not horizontal bars
 * 3. NPC cards use fixed heights by influence tier, content clipped
 * 4. Page count adapts to settlement size (hamlet=3 pages, city=6+)
 * 5. Each content section has a unique masthead color for navigation
 * 6. Guaranteed 3mm breathing room before every section header
 * 7. No emoji / Unicode outside Latin-1 (jsPDF built-in font constraint)
 */
import { jsPDF } from 'jspdf';
import { autoLayout } from './graphLayout.js';

// ── Page geometry ──────────────────────────────────────────────────────────────
const PW = 210, PH = 297;
const ML = 13, MR = 13, MT = 14, MB = 14;
const CW = PW - ML - MR;                   // 184mm content width
const BOT = PH - MB;                        // y-limit before footer
const GAP = 3;                              // guaranteed gap before section headers

// ── Colour palette ─────────────────────────────────────────────────────────────
const INK   = [28,  20,  9];
const PARCH = [250, 244, 232];
const CREAM = [245, 237, 224];
const TAN   = [200, 184, 154];
const GOLD  = [160, 118, 42];
const GOLDD = [90,  58,  0];
const BROWN = [107, 83,  48];
const MIL   = [139, 26,  26];
const GOV   = [42,  58,  122];
const ECO   = [140, 100, 30];
const REL   = [26,  90,  40];
const MAG   = [90,  42,  138];
const CRIM  = [74,  26,  74];
const INFRA = [26,  70,  90];
const HIST  = [60,  45,  100];

// Section masthead colours — unique per content type for navigation
const MAST = {
  overview:  [22,  16,  7],      // near-black
  economy:   [70,  45,  5],      // dark amber
  npcs:      [20,  18,  55],     // dark indigo
  power:     [18,  38,  80],     // dark navy
  geography: [12,  55,  28],     // dark forest
  hooks:     [45,  20,  65],     // dark plum
};

const CAT_CLR = {
  government:    GOV, military:  MIL, economy:   ECO,
  religious:     REL, magic:     MAG, criminal:  CRIM,
  infrastructure:INFRA, crafts:  ECO, defense:   MIL,
  entertainment: [122,26,90], adventuring:[26,90,58],
  other: BROWN,
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const sf = (d,c) => d.setFillColor(c[0],c[1],c[2]);
const sd = (d,c) => d.setDrawColor(c[0],c[1],c[2]);
const st = (d,c) => d.setTextColor(c[0],c[1],c[2]);

function rect(d,x,y,w,h,fill,stroke=null) {
  sf(d,fill);
  if (stroke) { sd(d,stroke); d.setLineWidth(0.25); d.rect(x,y,w,h,'FD'); }
  else d.rect(x,y,w,h,'F');
}
function hline(d,x1,y,x2,clr=TAN,lw=0.2) { sd(d,clr); d.setLineWidth(lw); d.line(x1,y,x2,y); }

// Strip non-Latin-1; collapse whitespace
function s(v) {
  return String(v||'').replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g,' ').replace(/\s+/g,' ').trim();
}

// Culture display: replace underscores, proper case each word
function fmtCulture(c) {
  return s(c||'').split(/[_\s]+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ');
}

function wrap(d,text,maxW,fontSize) {
  d.setFontSize(fontSize);
  return d.splitTextToSize(s(text),maxW);
}

// Line height in mm for given fontSize and line count
const lh = (size, n=1) => size * 0.35278 * 1.45 * n;

// Word-boundary truncation with ellipsis
function truncate(text, maxChars) {
  const t = s(text);
  if (t.length <= maxChars) return t;
  const cut = t.slice(0, maxChars - 1).replace(/\s\S*$/, '');
  return (cut||t.slice(0,maxChars-1)) + '...';
}

// GAP-guaranteed section header bar → returns new y
function secBar(d, x, y, w, label, clr, textClr=[255,255,255]) {
  y += GAP;
  const bh = 5.5;
  rect(d, x, y, w, bh, clr);
  d.setFont('helvetica','bold'); d.setFontSize(7); st(d,textClr);
  d.text(label.toUpperCase(), x+3, y+3.9);
  return y + bh + 2;
}

// Score bar — text ALWAYS on parchment background, NEVER inside the bar
function scoreBar(d, x, y, label, value, totalW) {
  const v    = Math.min(100, Math.max(0, value||0));
  const clr  = v>=70 ? REL : v>=45 ? ECO : v>=25 ? [140,64,16] : MIL;
  const LW   = 54;   // label column  (fixed)
  const NW   = 13;   // number column (fixed)
  const barW = totalW - LW - NW - 4;

  // Label on parchment
  d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,BROWN);
  d.text(s(label), x, y);

  // Bar track + fill (purely decorative — no text inside)
  rect(d, x+LW, y-3.5, barW, 3.5, [228,216,196]);
  if (v>0) rect(d, x+LW, y-3.5, barW*v/100, 3.5, clr);

  // Number always to the right, always on parchment
  d.setFont('helvetica','bold'); d.setFontSize(8); st(d,clr);
  d.text(String(Math.round(v)), x+LW+barW+3, y);
  return y + 5.5;
}

// Income source as sidebar-stripe stat line — no horizontal bars
function incomeSource(d, x, y, src, w) {
  const isCrim = src.isCriminal;
  const clr    = isCrim ? CRIM : ECO;
  const pct    = String(src.percentage||0)+'%';
  const rowH   = src.desc ? 13.5 : 9;

  // Left accent strip (always opaque, always readable against parchment)
  rect(d, x, y, 2.5, rowH, clr);

  // Source name
  d.setFont('helvetica','bold'); d.setFontSize(8);
  st(d, isCrim ? CRIM : INK);
  const maxNameW = w - 20;
  const nameLines = wrap(d, src.source, maxNameW, 8);
  d.text(nameLines[0], x+5, y+5.5);

  // Percentage right-aligned — on parchment, always readable
  d.setFont('helvetica','bold'); d.setFontSize(9); st(d, clr);
  const pctW = d.getStringUnitWidth(pct)*9/d.internal.scaleFactor;
  d.text(pct, x+w-pctW, y+5.5);

  // Description (7pt, below the name line)
  if (src.desc) {
    d.setFont('helvetica','normal'); d.setFontSize(7); st(d,BROWN);
    const dL = wrap(d, src.desc, w-6, 7);
    d.text(dL.slice(0,1), x+5, y+10);
  }
  return y + rowH + 1.5;
}

// Page masthead
function masthead(d, name, section, sub='') {
  const clr = MAST[section] || INK;
  rect(d, ML, MT, CW, 13, clr);
  d.setFont('times','bold'); d.setFontSize(16); st(d,[220,185,110]);
  d.text(s(name), ML+4, MT+9);
  if (sub) {
    d.setFont('helvetica','bold'); d.setFontSize(7.5); st(d,[170,140,80]);
    d.text(sub.toUpperCase(), ML+CW - d.getStringUnitWidth(sub.toUpperCase())*7.5/d.internal.scaleFactor - 4, MT+9);
  }
  return MT+16;
}

// Page footer
function footer(d, name, pageLabel) {
  rect(d, ML, BOT-5, CW, 5, INK);
  d.setFont('helvetica','normal'); d.setFontSize(6.5); st(d,[140,110,60]);
  d.text(`${s(name)}  |  SettlementForge  |  ${pageLabel}`, ML+2, BOT-1.5);
}

// ── Founding string helper ─────────────────────────────────────────────────────
function foundingStr(f) {
  if (!f) return '';
  if (typeof f === 'string') return f;
  if (f.reason && f.foundedBy) return `The settlement ${f.reason}, founded by ${f.foundedBy}.`;
  if (f.reason) return `The settlement ${f.reason}.`;
  return f.text||f.description||f.primary||'';
}

// ── Main export ────────────────────────────────────────────────────────────────
export function generateSettlementPDF(settlement) {
  if (!settlement) return;
  const r    = settlement;
  const eco  = r.economicState    || {};
  const dp   = r.defenseProfile   || {};
  const hist = r.history          || {};
  const ra   = r.resourceAnalysis || {};
  const sp   = eco.safetyProfile  || {};
  const ps   = r.powerStructure   || {};
  const via  = r.economicViability|| {};
  const cfg  = r.config           || {};
  const stresses = (Array.isArray(r.stress)?r.stress:r.stress?[r.stress]:[]).filter(Boolean);
  const scores   = dp.scores || {};
  const name     = s(r.name||'Settlement');

  const doc = new jsPDF({ unit:'mm', format:'a4', orientation:'portrait' });

  // Determine layout tier
  const pop = r.population||0;
  const tier = r.tier||'village';
  const isSmall   = ['thorp','hamlet'].includes(tier);
  const isMedium  = tier === 'village';
  const isLarge   = ['town'].includes(tier);
  const isCity    = ['city','metropolis'].includes(tier);

  // ── Always: Page 1 — Stat Block ─────────────────────────────────────────────
  let pageN = 1;
  buildStatBlock(doc, r, eco, dp, hist, ra, sp, ps, via, cfg, stresses, scores, name, pageN);

  // ── Page 2 — Economy ─────────────────────────────────────────────────────────
  doc.addPage(); pageN++;
  if (isSmall) {
    buildEconomyCompact(doc, r, eco, ra, via, hist, ps, name, pageN);
  } else {
    buildEconomy(doc, r, eco, ra, via, name, pageN);
  }

  // ── NPCs ─────────────────────────────────────────────────────────────────────
  const npcs = (r.npcs||[]).filter(n=>n?.name);
  if (npcs.length) {
    doc.addPage(); pageN++;
    pageN = buildNPCs(doc, r, ps, name, pageN);
  }

  // ── Power & History ───────────────────────────────────────────────────────────
  doc.addPage(); pageN++;
  if (isSmall || isMedium) {
    buildPowerHistory(doc, r, ps, hist, name, pageN);
  } else {
    buildPowerHistory(doc, r, ps, hist, name, pageN);
  }

  // ── Geography & Relationships ─────────────────────────────────────────────────
  doc.addPage(); pageN++;
  buildGeography(doc, r, ra, name, pageN);

  // ── Hooks & Viability (city/town only, or if hooks exist) ────────────────────
  const hooks = gatherHooks(r, eco, sp);
  if (isLarge || isCity || hooks.length > 0) {
    doc.addPage(); pageN++;
    buildHooks(doc, r, eco, via, sp, name, pageN, hooks);
  }

  // ── Neighbour Network (if any linked settlements) ───────────────────────────
  const net = r.neighbourNetwork || [];
  const isr = r.interSettlementRelationships || [];
  if (net.length > 0) {
    doc.addPage(); pageN++;
    buildNeighbours(doc, r, net, isr, name, pageN);

    // Relationship diagram page — visual graph of the neighbour network
    doc.addPage(); pageN++;
    buildRelationshipDiagram(doc, r, net, name, pageN);
  }

  // ── AI Narrative (if generated) ─────────────────────────────────────────────
  if (r._aiNarrative) {
    doc.addPage(); pageN++;
    buildAiNarrative(doc, r._aiNarrative, name, pageN);
  }

  doc.save(`${name.replace(/\s+/g,'_')}_settlement_sheet.pdf`);
}

// ════════════════════════════════════════════════════════════════════════════════
// PAGE 1 — STAT BLOCK
// ════════════════════════════════════════════════════════════════════════════════
function buildStatBlock(doc, r, eco, dp, hist, ra, sp, ps, via, cfg, stresses, scores, name, pageN) {
  const d = doc;
  let y = masthead(d, name, 'overview');

  // Sub-line
  const sub = [
    r.tier ? r.tier.charAt(0).toUpperCase()+r.tier.slice(1) : '',
    r.population ? r.population.toLocaleString()+' pop.' : '',
    cfg.culture ? fmtCulture(cfg.culture) : '',
    cfg.tradeRouteAccess ? s(cfg.tradeRouteAccess).replace(/_/g,' ') : '',
    ra.terrain||'',
    hist.age ? 'Est. '+hist.age+' yrs' : '',
  ].filter(Boolean).join('  |  ');
  d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,[180,150,90]);
  // Already in masthead rect
  d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,BROWN);
  // Sub-line below masthead
  rect(d,ML,y-3,CW,5.5,CREAM);
  d.text(s(sub), ML+3, y+0.5);
  y += 5;

  // ── Character quote ──────────────────────────────────────────────────────────
  if (hist.historicalCharacter) {
    const qL = wrap(d, '"'+hist.historicalCharacter+'"', CW-8, 9);
    const qH = lh(9,qL.length)+6;
    rect(d,ML,y,CW,qH,CREAM);
    hline(d,ML,y,ML+CW,GOLD,0.5);
    d.setFont('times','italic'); d.setFontSize(9); st(d,[80,50,20]);
    d.text(qL,ML+4,y+5);
    y += qH+2;
  }

  // ── Arrival scene ────────────────────────────────────────────────────────────
  if (r.arrivalScene) {
    const aL = wrap(d,r.arrivalScene,CW-8,8.5);
    const aH = lh(8.5,Math.min(aL.length,3))+5;
    rect(d,ML,y,CW,aH,[22,16,7]);
    hline(d,ML,y,ML+CW,[160,118,42],0.5);
    d.setFont('times','italic'); d.setFontSize(8.5); st(d,[235,225,205]);
    d.text(aL.slice(0,3),ML+4,y+5);
    y += aH+3;
  }

  // ── 4 status chips ───────────────────────────────────────────────────────────
  const chipW = (CW-9)/4;
  const chips = [
    { label:'Prosperity', value: truncate(eco.prosperity||'--',18) },
    { label:'Safety',     value: truncate((sp.safetyLabel||'--').split('(')[0].trim(),18) },
    { label:'Coherence',  value: via.viable===false?'Not Coherent':via.viable===true?'Coherent':'Marginal' },
    { label:'Defense',    value: truncate(dp.readiness?.label||'--',18) },
  ];
  chips.forEach((chip,i)=>{
    const cx = ML + i*(chipW+3);
    rect(d,cx,y,chipW,12,CREAM,TAN);
    d.setFont('helvetica','bold'); d.setFontSize(6.5); st(d,BROWN);
    d.text(chip.label.toUpperCase(),cx+3,y+4.5);
    d.setFont('helvetica','bold'); d.setFontSize(8); st(d,INK);
    // chip value may need to wrap
    const cvL = wrap(d,chip.value,chipW-6,8);
    d.text(cvL[0],cx+3,y+9.5);
  });
  y += 15;

  // ── Score bars (two columns) ─────────────────────────────────────────────────
  const halfW = (CW-6)/2;
  const scoreDefs = [
    ['Military Might',    scores.military],
    ['Monster Defense',   scores.monster],
    ['Internal Security', scores.internal],
    ['Economic Strength', scores.economic],
    ['Magical Power',     scores.magical],
    ['Enforce. Ratio',    sp.safetyRatio!=null ? sp.safetyRatio*20 : null],
  ].filter(([,v])=>v!=null);

  let lc=y, rc=y;
  scoreDefs.forEach(([lbl,val],i)=>{
    const col=i%2, cx=col===0?ML:ML+halfW+6;
    if (col===0) lc=scoreBar(d,cx,lc,lbl,val,halfW);
    else         rc=scoreBar(d,cx,rc,lbl,val,halfW);
  });
  y=Math.max(lc,rc)+3;

  // ── Active stresses ───────────────────────────────────────────────────────────
  if (stresses.length) {
    y=secBar(d,ML,y,CW,'Active Crises',MIL);
    stresses.forEach(v=>{
      if (y>BOT-28) return;
      const sumL=wrap(d,v.summary||v.label||'',CW-6,8);
      const hookL=wrap(d,v.crisisHook||'',CW-14,7.5);
      const bh=lh(8,Math.min(sumL.length,2))+lh(7.5,Math.min(hookL.length,2))+12;
      rect(d,ML,y,CW,bh,[252,244,244],[230,190,190]);
      d.setFont('helvetica','bold'); d.setFontSize(9); st(d,MIL);
      d.text(s(v.label||'Crisis'),ML+3,y+6);
      d.setFont('helvetica','normal'); d.setFontSize(8); st(d,INK);
      d.text(sumL.slice(0,2),ML+3,y+11);
      const hy=y+11+lh(8,Math.min(sumL.length,2));
      if (hookL.length) {
        d.setFont('helvetica','bold'); d.setFontSize(7); st(d,MIL);
        d.text('Hook:',ML+3,hy+3);
        d.setFont('helvetica','italic'); d.setFontSize(7.5); st(d,[90,20,20]);
        d.text(hookL.slice(0,2),ML+14,hy+3);
      }
      y+=bh+2;
    });
  }

  // ── Governing faction ─────────────────────────────────────────────────────────
  const gov=(ps.factions||[]).find(f=>f.isGoverning)||(ps.factions||[])[0];
  if (gov && y<BOT-22) {
    y=secBar(d,ML,y,CW,'Governing Authority',GOV);
    d.setFont('helvetica','bold'); d.setFontSize(9); st(d,GOV);
    d.text(s(gov.faction||''),ML+3,y);
    d.setFont('helvetica','normal'); d.setFontSize(7); st(d,BROWN);
    d.text('['+s(gov.powerLabel||'Governing')+']',ML+3,y+4);
    y+=8;
    if (gov.desc) {
      const gL=wrap(d,gov.desc,CW-6,8);
      d.setFont('helvetica','normal'); d.setFontSize(8); st(d,INK);
      d.text(gL.slice(0,2),ML+3,y);
      y+=lh(8,Math.min(gL.length,2))+3;
    }
  }

  // ── Institutions (two-column compact list) ────────────────────────────────────
  if (y<BOT-20) {
    const byCategory={};
    (r.institutions||[]).forEach(inst=>{
      const cat=(inst.category||'other').toLowerCase();
      (byCategory[cat]=byCategory[cat]||[]).push(inst.name);
    });
    const catOrder=['infrastructure','government','economy','crafts','religious','military','defense','magic','adventuring','criminal','entertainment','other'];
    y=secBar(d,ML,y,CW,`Institutions (${(r.institutions||[]).length})`,BROWN);
    const cW2=(CW-4)/2; let lc2=y,rc2=y,left=true;
    for (const cat of catOrder) {
      const insts=byCategory[cat];
      if (!insts?.length) continue;
      const cc=CAT_CLR[cat]||BROWN;
      const cx=left?ML:ML+cW2+4;
      let cy=left?lc2:rc2;
      if (cy>BOT-10) { left=!left; continue; }
      d.setFont('helvetica','bold'); d.setFontSize(6.5); st(d,cc);
      d.text(cat.charAt(0).toUpperCase()+cat.slice(1),cx,cy); cy+=4;
      for (const nm of insts) {
        if (cy>BOT-10) break;
        d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
        const nL=wrap(d,nm,cW2-6,7.5);
        d.text('-',cx+1,cy);
        d.text(nL,cx+5,cy);
        cy+=lh(7.5,nL.length);
      }
      cy+=2;
      if (left) lc2=cy; else rc2=cy;
      left=!left;
    }
    y=Math.max(lc2,rc2)+2;
  }

  // ── Layout description footer strip ──────────────────────────────────────────
  if (r.spatialLayout?.layout && y<BOT-8) {
    hline(d,ML,y,ML+CW); y+=2;
    d.setFont('helvetica','italic'); d.setFontSize(7.5); st(d,BROWN);
    const slL=wrap(d,'Layout: '+r.spatialLayout.layout,CW,7.5);
    d.text(slL.slice(0,2),ML,y);
  }

  footer(d,name,`Page ${pageN}`);
}

// ════════════════════════════════════════════════════════════════════════════════
// PAGE 2 — ECONOMY (full)
// ════════════════════════════════════════════════════════════════════════════════
function buildEconomy(doc, r, eco, ra, via, name, pageN) {
  const d=doc;
  let y=masthead(d,name,'economy','Economy');

  // Prosperity + complexity
  if (eco.prosperity) {
    const prosClr=eco.prosperity.toLowerCase().includes('subsist')?MIL:
                  eco.prosperity.toLowerCase().includes('poor')?[140,64,16]:
                  eco.prosperity.toLowerCase().includes('modest')?ECO:REL;
    hline(d,ML,y,ML+CW,prosClr,0.6); y+=2;
    d.setFont('times','bold'); d.setFontSize(15); st(d,prosClr);
    d.text(s(eco.prosperity),ML+2,y+8);
    if (eco.economicComplexity) {
      d.setFont('helvetica','normal'); d.setFontSize(8); st(d,BROWN);
      d.text(s(eco.economicComplexity),ML+2,y+13);
    }
    y+=16;
    if (eco.situationDesc) {
      const sdL=wrap(d,eco.situationDesc,CW-4,8.5);
      d.setFont('helvetica','normal'); d.setFontSize(8.5); st(d,INK);
      d.text(sdL.slice(0,4),ML+2,y);
      y+=lh(8.5,Math.min(sdL.length,4))+3;
    }
  }

  // ── Income sources (sidebar-stripe stat lines — no bars) ─────────────────────
  const incomes=(eco.incomeSources||[]).filter(i=>i?.source);
  if (incomes.length) {
    y=secBar(d,ML,y,CW,'Income Sources',ECO);
    for (const src of incomes) {
      if (y>BOT-12) break;
      y=incomeSource(d,ML,y,src,CW);
    }
  }

  // ── Trade profile ─────────────────────────────────────────────────────────────
  y+=GAP;
  const tW=(CW-6)/2;
  const expY0=y, impY0=y;

  d.setFont('helvetica','bold'); d.setFontSize(7); st(d,REL);
  d.text('EXPORTS',ML,y); y+=4;
  let expY=y;
  (eco.primaryExports||[]).forEach(exp=>{
    if (expY>BOT-20) return;
    const transit=exp.includes('(transit)');
    d.setFont('helvetica', transit?'italic':'normal'); d.setFontSize(7.5);
    st(d,transit?GOV:REL);
    const eL=wrap(d,'- '+s(exp),tW-2,7.5);
    d.text(eL,ML,expY); expY+=lh(7.5,eL.length)+0.5;
  });
  if (eco.isEntrepot) {
    d.setFont('helvetica','italic'); d.setFontSize(6.5); st(d,GOV);
    d.text('(italic = transit goods)',ML,expY); expY+=4;
  }

  let impY=expY0+4;
  d.setFont('helvetica','bold'); d.setFontSize(7); st(d,MIL);
  d.text('IMPORTS',ML+tW+6,expY0);
  (eco.primaryImports||[]).forEach(imp=>{
    if (impY>BOT-20) return;
    const nec=(eco.necessityImports||[]).some(n=>imp.toLowerCase().includes(n.toLowerCase()));
    d.setFont('helvetica',nec?'bold':'normal'); d.setFontSize(7.5);
    st(d,nec?MIL:[120,80,20]);
    const iL=wrap(d,'- '+s(imp)+(nec?' [essential]':''),tW-2,7.5);
    d.text(iL,ML+tW+6,impY); impY+=lh(7.5,iL.length)+0.5;
  });

  y=Math.max(expY,impY)+3;

  // Local production
  if ((eco.localProduction||[]).length&&y<BOT-14) {
    y=secBar(d,ML,y,CW,'Local Production',BROWN);
    const lp=(eco.localProduction||[]).map(p=>s(p.replace(/_/g,' '))).join(', ');
    const lpL=wrap(d,lp,CW-4,7.5);
    d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
    d.text(lpL.slice(0,3),ML+2,y);
    y+=lh(7.5,Math.min(lpL.length,3))+3;
  }

  // Trade dependencies
  const deps=(eco.tradeDependencies||[]).filter(dep=>dep?.institution);
  if (deps.length&&y<BOT-14) {
    y=secBar(d,ML,y,CW,'Trade Dependencies',[140,60,20]);
    deps.forEach(dep=>{
      if (y>BOT-14) return;
      const isCrit=dep.severity==='critical';
      const bclr=isCrit?MIL:[160,100,20];
      rect(d,ML,y,CW,3.5,bclr);                           // top accent strip
      rect(d,ML,y+3.5,CW,10,[252,248,238]);                // body
      d.setFont('helvetica','bold'); d.setFontSize(8); st(d,bclr);
      d.text('[!] '+s(dep.institution),ML+3,y+9.5);
      d.setFont('helvetica','normal'); d.setFontSize(7); st(d,BROWN);
      const needStr='Needs: '+s(dep.resource||'');
      d.text(needStr,ML+3+d.getStringUnitWidth('[!] '+s(dep.institution))*8/d.internal.scaleFactor+4,y+9.5);
      if (dep.impact) {
        const impL=wrap(d,dep.impact,CW-6,7);
        d.setFont('helvetica','italic'); st(d,isCrit?MIL:BROWN);
        d.text(impL.slice(0,1),ML+3,y+13);
      }
      y+=15;
    });
    y+=2;
  }

  // Supply chains
  const chains=(eco.activeChains||[]).filter(c=>c.label);
  if (chains.length&&y<BOT-14) {
    y=secBar(d,ML,y,CW,'Active Supply Chains',ECO);
    const cW3=(CW-8)/3; let colYs=[y,y,y];
    chains.forEach((chain,i)=>{
      const col=i%3, cx=ML+col*(cW3+4);
      let cy=colYs[col];
      if (cy>BOT-12) return;
      d.setFont('helvetica','bold'); d.setFontSize(7.5); st(d,ECO);
      const cL=wrap(d,chain.label,cW3-2,7.5);
      d.text(cL,cx,cy); cy+=lh(7.5,cL.length);
      if (chain.outputs?.length) {
        d.setFont('helvetica','normal'); d.setFontSize(6.5); st(d,BROWN);
        d.text('-> '+chain.outputs.slice(0,2).map(s).join(', '),cx,cy); cy+=4;
      }
      cy+=2; colYs[col]=cy;
    });
    y=Math.max(...colYs);
  }

  footer(d,name,`Page ${pageN}`);
}

// Economy compact (hamlet/thorp) — adds history section on same page
function buildEconomyCompact(doc, r, eco, ra, via, hist, ps, name, pageN) {
  const d=doc;
  let y=masthead(d,name,'economy','Economy & History');

  // Prosperity line
  if (eco.prosperity) {
    const prosClr=eco.prosperity.toLowerCase().includes('subsist')?MIL:ECO;
    d.setFont('times','bold'); d.setFontSize(13); st(d,prosClr);
    d.text(s(eco.prosperity),ML+2,y+7);
    if (eco.economicComplexity) {
      d.setFont('helvetica','normal'); d.setFontSize(8); st(d,BROWN);
      d.text(s(eco.economicComplexity),ML+55,y+7);
    }
    y+=10;
  }

  // Income sources (compact — no descriptions for small settlements)
  const incomes=(eco.incomeSources||[]).filter(i=>i?.source);
  if (incomes.length) {
    y=secBar(d,ML,y,CW,'Income Sources',ECO);
    for (const src of incomes.slice(0,6)) {
      if (y>BOT/2) break;
      const sNoDesc={...src,desc:''};   // suppress desc on compact layout
      y=incomeSource(d,ML,y,sNoDesc,CW);
    }
  }

  // Trade profile
  y+=GAP;
  const tW=(CW-6)/2;
  if ((eco.primaryExports||[]).length) {
    y=secBar(d,ML,y,tW,'Exports',REL);
    (eco.primaryExports||[]).slice(0,8).forEach(exp=>{
      if (y>BOT/2) return;
      d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,REL);
      const eL=wrap(d,'- '+s(exp),tW-3,7.5);
      d.text(eL,ML,y); y+=lh(7.5,eL.length);
    });
  }

  // History section on same page (lower half)
  const histY=Math.max(y+GAP, BOT*0.52);
  y=histY;
  y=secBar(d,ML,y,CW,'History & Tensions',HIST);

  if (hist.historicalCharacter) {
    d.setFont('times','italic'); d.setFontSize(9); st(d,[80,50,20]);
    const qL=wrap(d,'"'+hist.historicalCharacter+'"',CW-4,9);
    d.text(qL.slice(0,2),ML+2,y); y+=lh(9,Math.min(qL.length,2))+3;
  }

  const events=(hist.historicalEvents||[]).sort((a,b)=>(a.yearsAgo||0)-(b.yearsAgo||0));
  events.slice(0,4).forEach(evt=>{
    if (y>BOT-12) return;
    const yrsLabel=evt.yearsAgo<=30?'Recent':evt.yearsAgo<=80?'Living memory':'Ancient';
    d.setFont('helvetica','bold'); d.setFontSize(7); st(d,HIST);
    d.text(s((evt.type||'').replace(/_/g,' '))+' ['+yrsLabel+']',ML+2,y); y+=3.5;
    const eL=wrap(d,evt.description||'',CW-4,7.5);
    d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
    d.text(eL.slice(0,2),ML+2,y); y+=lh(7.5,Math.min(eL.length,2))+2;
  });

  (hist.currentTensions||[]).slice(0,3).forEach(t=>{
    if (y>BOT-12) return;
    const desc=typeof t==='string'?t:t.description;
    const tL=wrap(d,desc||'',CW-4,7.5);
    d.setFont('helvetica','bold'); d.setFontSize(7); st(d,[160,120,10]);
    const ttype=typeof t==='object'&&t.type?t.type.replace(/_/g,' '):'Tension';
    d.text(s(ttype),ML+2,y); y+=3.5;
    d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
    d.text(tL.slice(0,2),ML+2,y); y+=lh(7.5,Math.min(tL.length,2))+2;
  });

  footer(d,name,`Page ${pageN}`);
}

// ════════════════════════════════════════════════════════════════════════════════
// PAGE 3+ — NPCs  (returns final page number)
// ════════════════════════════════════════════════════════════════════════════════
function buildNPCs(doc, r, ps, name, startPage) {
  const d=doc;
  let y=masthead(d,name,'npcs','Key Figures');
  let pageN=startPage;

  // NPC fixed heights by influence
  const NPC_H = { high:60, moderate:50, low:40 };

  const npcs=(r.npcs||[]).filter(n=>n?.name);
  const factionOrder=(ps.factions||[]).map(f=>f.faction);
  const factionCategory={};
  (ps.factions||[]).forEach(f=>{ factionCategory[f.faction]=f.category; });

  const byFaction={};
  npcs.forEach(n=>{ const k=n.factionAffiliation||'Unaffiliated'; (byFaction[k]=byFaction[k]||[]).push(n); });
  const factionKeys=Object.keys(byFaction).sort((a,b)=>{
    if (a==='Unaffiliated') return 1; if (b==='Unaffiliated') return -1;
    const ia=factionOrder.indexOf(a), ib=factionOrder.indexOf(b);
    if (ia===-1) return 1; if (ib===-1) return -1; return ia-ib;
  });

  const newPage=()=>{
    footer(d,name,`Page ${pageN}`); d.addPage(); pageN++;
    y=masthead(d,name,'npcs','Key Figures (continued)');
    return y;
  };

  for (const faction of factionKeys) {
    const fNPCs=byFaction[faction];
    const catClr=CAT_CLR[factionCategory[faction]]||BROWN;
    if (y>BOT-20) y=newPage();

    // Faction header
    rect(d,ML,y,CW,6.5,catClr);
    d.setFont('helvetica','bold'); d.setFontSize(8.5); st(d,[255,255,255]);
    d.text(s(faction),ML+3,y+4.6);
    y+=9;

    for (const npc of fNPCs) {
      // High-influence NPCs get a taller two-column "stat block" card
      const isHigh = npc.influence === 'high';
      const cardH = isHigh ? 72 : (NPC_H[npc.influence] || NPC_H.low);
      if (y+cardH>BOT-8) y=newPage();

      // Card container — always cream, always readable
      rect(d,ML,y,CW,cardH,CREAM,TAN);

      const nc=CAT_CLR[npc.category]||catClr;

      // Name bar — colored, text always white, height fixed at 9mm
      rect(d,ML,y,CW,9,nc);
      d.setFont('times','bold'); d.setFontSize(isHigh?12:11); st(d,[255,255,255]);
      const nameStr=s(npc.name);
      d.text(nameStr,ML+3,y+6.5);

      // Role + influence right-aligned in name bar
      const roleStr=[s(npc.role||''), npc.influence==='high'?'[High Influence]':npc.influence==='moderate'?'[Mod]':''].filter(Boolean).join('  ');
      if (roleStr) {
        d.setFont('helvetica','bold'); d.setFontSize(7); st(d,[220,200,160]);
        const rW=d.getStringUnitWidth(roleStr)*7/d.internal.scaleFactor;
        d.text(roleStr,ML+CW-rW-3,y+6.5);
      }

      // ── HIGH-INFLUENCE STAT BLOCK: two-column layout ────────────────────
      if (isHigh) {
        // Stats band — 6mm strip under the name bar with tier, faction, goal strength
        const bandY = y + 9;
        rect(d, ML, bandY, CW, 6, [250, 244, 228]);
        hline(d, ML, bandY + 6, ML + CW, TAN, 0.3);
        d.setFont('helvetica', 'bold'); d.setFontSize(6.5); st(d, BROWN);
        const tierLabel = 'TIER';
        const factionLabel = 'FACTION';
        const driveLabel = 'DRIVE';
        const bandInfo = [
          { label: tierLabel, value: npc.influence === 'high' ? 'High' : npc.influence || 'Unknown' },
          { label: factionLabel, value: truncate(s(npc.factionAffiliation || 'Independent'), 18) },
          { label: driveLabel, value: truncate(s(npc.personality?.dominant || npc.goal?.category || 'Varied'), 18) },
        ];
        const bandColW = CW / 3;
        bandInfo.forEach((info, i) => {
          const bx = ML + i * bandColW + 3;
          d.setFont('helvetica', 'bold'); d.setFontSize(5.5); st(d, BROWN);
          d.text(info.label, bx, bandY + 2.8);
          d.setFont('helvetica', 'bold'); d.setFontSize(7.5); st(d, INK);
          d.text(info.value, bx, bandY + 5.5);
        });

        // Split column layout under the stats band
        const contentY = bandY + 7.5;
        const colGap = 3;
        const colW = (CW - colGap) / 2;
        const lx = ML + 2;
        const rx = ML + colW + colGap + 2;
        let ly = contentY;
        let ry = contentY;
        const cardBot = y + cardH - 3;

        // ── LEFT COLUMN: Profile (impression → personality → goal) ───────
        const imp = s(npc.presentation?.impression ||
          [npc.physical?.age, npc.physical?.build, npc.physical?.feature].filter(Boolean).join(', ') || '');
        if (imp && ly < cardBot - 4) {
          d.setFont('helvetica', 'italic'); d.setFontSize(7.5); st(d, BROWN);
          const impL = wrap(d, imp, colW - 4, 7.5);
          d.text(impL.slice(0, 2), lx, ly);
          ly += lh(7.5, Math.min(impL.length, 2)) + 1;
        }

        if (ly < cardBot - 6) {
          d.setFont('helvetica', 'bold'); d.setFontSize(6); st(d, nc);
          d.text('PERSONALITY', lx, ly); ly += 2.8;
          const traits = [npc.personality?.dominant, npc.personality?.flaw, npc.personality?.modifier].filter(Boolean).join(' | ');
          d.setFont('helvetica', 'normal'); d.setFontSize(7); st(d, INK);
          const trL = wrap(d, s(traits), colW - 4, 7);
          d.text(trL.slice(0, 2), lx, ly);
          ly += lh(7, Math.min(trL.length, 2)) + 1;
        }

        if (npc.goal?.short && ly < cardBot - 6) {
          d.setFont('helvetica', 'bold'); d.setFontSize(6); st(d, nc);
          d.text('GOAL', lx, ly); ly += 2.8;
          d.setFont('helvetica', 'normal'); d.setFontSize(7.5); st(d, INK);
          const gL = wrap(d, s(npc.goal.short), colW - 4, 7.5);
          d.text(gL.slice(0, 3), lx, ly);
          ly += lh(7.5, Math.min(gL.length, 3));
        }

        // ── RIGHT COLUMN: Leverage (secret → hook) ───────────────────────
        // Vertical divider
        sd(d, TAN);
        d.setLineWidth(0.2);
        d.line(ML + colW + colGap / 2, contentY - 1, ML + colW + colGap / 2, cardBot);

        if (npc.secret?.what && ry < cardBot - 6) {
          d.setFont('helvetica', 'bold'); d.setFontSize(6); st(d, MIL);
          d.text('SECRET', rx, ry); ry += 2.8;
          const secTxt = s(npc.secret.what) + (npc.secret.stakes ? ' (' + s(npc.secret.stakes) + ')' : '');
          d.setFont('helvetica', 'italic'); d.setFontSize(7.5); st(d, [100, 20, 20]);
          const secL = wrap(d, secTxt, colW - 4, 7.5);
          d.text(secL.slice(0, 3), rx, ry);
          ry += lh(7.5, Math.min(secL.length, 3)) + 1;
        }

        const hook = (npc.plotHooks || [])[0];
        const hookTxt = typeof hook === 'string' ? hook : (hook?.hook || '');
        if (hookTxt && ry < cardBot - 4) {
          d.setFont('helvetica', 'bold'); d.setFontSize(6); st(d, REL);
          d.text('PLOT HOOK', rx, ry); ry += 2.8;
          d.setFont('helvetica', 'italic'); d.setFontSize(7.5); st(d, [20, 70, 20]);
          const hkL = wrap(d, hookTxt, colW - 4, 7.5);
          d.text(hkL.slice(0, 3), rx, ry);
          ry += lh(7.5, Math.min(hkL.length, 3));
        }

        y += cardH + 3;
        continue;
      }

      // ── MODERATE / LOW INFLUENCE: single-column compact card ─────────────
      let iy=y+12.5;
      const lineH8=lh(8);
      const lineH7=lh(7.5);

      // Physical impression (italic, 8pt) — 1 line
      const imp=s(npc.presentation?.impression||[npc.physical?.age,npc.physical?.build,npc.physical?.feature].filter(Boolean).join(', ')||'');
      if (imp&&iy<y+cardH-3) {
        d.setFont('helvetica','italic'); d.setFontSize(8); st(d,BROWN);
        d.text(truncate(imp,80),ML+3,iy); iy+=lineH8;
      }

      // Clothes (7pt) — 1 line
      if (npc.physical?.clothes&&iy<y+cardH-3) {
        d.setFont('helvetica','normal'); d.setFontSize(7); st(d,BROWN);
        d.text(truncate(s(npc.physical.clothes),90),ML+3,iy); iy+=lineH7+0.5;
      }

      // PERSONALITY label + traits (two lines)
      if (iy<y+cardH-6) {
        d.setFont('helvetica','bold'); d.setFontSize(6.5); st(d,nc);
        d.text('PERSONALITY',ML+3,iy); iy+=3.5;
        const traits=[npc.personality?.dominant,npc.personality?.flaw,npc.personality?.modifier].filter(Boolean).join('  |  ');
        d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
        d.text(s(traits),ML+3,iy); iy+=lineH7+1;
      }

      // Speech pattern (7pt italic) — 1 line, only if space
      if (npc.personality?.speech&&iy<y+cardH-5) {
        d.setFont('helvetica','italic'); d.setFontSize(7); st(d,BROWN);
        d.text(truncate(s(npc.personality.speech),95),ML+3,iy); iy+=lineH7;
      }

      // GOAL (8pt)
      if (npc.goal?.short&&iy<y+cardH-8) {
        d.setFont('helvetica','bold'); d.setFontSize(6.5); st(d,nc);
        d.text('GOAL',ML+3,iy); iy+=3.5;
        d.setFont('helvetica','normal'); d.setFontSize(8); st(d,INK);
        const gL=wrap(d,npc.goal.short,CW-6,8);
        d.text(gL.slice(0,2),ML+3,iy); iy+=lh(8,Math.min(gL.length,2))+1.5;
      }

      // SECRET (8pt, dark red)
      if (npc.secret?.what&&iy<y+cardH-8) {
        d.setFont('helvetica','bold'); d.setFontSize(6.5); st(d,MIL);
        d.text('SECRET',ML+3,iy); iy+=3.5;
        const secTxt=s(npc.secret.what)+(npc.secret.stakes?' ('+s(npc.secret.stakes)+')':'');
        d.setFont('helvetica','italic'); d.setFontSize(8); st(d,[100,20,20]);
        const secL=wrap(d,secTxt,CW-6,8);
        d.text(secL.slice(0,2),ML+3,iy); iy+=lh(8,Math.min(secL.length,2))+1.5;
      }

      // HOOK (8pt, dark green)
      const hook=(npc.plotHooks||[])[0];
      const hookTxt=typeof hook==='string'?hook:(hook?.hook||'');
      if (hookTxt&&iy<y+cardH-5) {
        d.setFont('helvetica','bold'); d.setFontSize(6.5); st(d,REL);
        d.text('HOOK',ML+3,iy); iy+=3.5;
        d.setFont('helvetica','italic'); d.setFontSize(8); st(d,[20,70,20]);
        const hkL=wrap(d,hookTxt,CW-6,8);
        d.text(hkL.slice(0,1),ML+3,iy);
      }

      y+=cardH+3;
    }
    y+=2;
  }

  footer(d,name,`Page ${pageN}`);
  return pageN;
}

// ════════════════════════════════════════════════════════════════════════════════
// POWER & HISTORY
// ════════════════════════════════════════════════════════════════════════════════
function buildPowerHistory(doc, r, ps, hist, name, pageN) {
  const d=doc;
  let y=masthead(d,name,'power','Power & History');

  const colW=(CW-5)/2;
  const lx=ML, rx=ML+colW+5;
  let ly=y, ry=y;

  // ── LEFT: Power ──────────────────────────────────────────────────────────────
  const leg=ps.publicLegitimacy;
  if (leg) {
    ly=secBar(d,lx,ly,colW,'Public Legitimacy',GOV);
    d.setFont('times','bold'); d.setFontSize(20); st(d,GOV);
    d.text(String(leg.score||''),lx+2,ly+11);
    d.setFont('helvetica','bold'); d.setFontSize(9); st(d,GOV);
    d.text(s(leg.label||''),lx+16,ly+11);
    ly+=15;
    if (leg.governanceFractured) {
      rect(d,lx,ly,colW,8,[252,244,244],[230,190,190]);
      d.setFont('helvetica','bold'); d.setFontSize(7); st(d,MIL);
      d.text('[!] Governance fractured — formal authority differs from real',lx+2,ly+5.5);
      ly+=10;
    }
    ly+=GAP;
  }

  if (ps.stability) {
    ly=secBar(d,lx,ly,colW,'Stability',[100,80,30]);
    const stL=wrap(d,ps.stability,colW-4,8);
    d.setFont('helvetica','normal'); d.setFontSize(8); st(d,INK);
    d.text(stL.slice(0,3),lx+2,ly); ly+=lh(8,Math.min(stL.length,3))+3;
  }

  if (ps.criminalCaptureState&&ps.criminalCaptureState!=='none') {
    const captureLabels={adversarial:'Criminal: Adversarial',equilibrium:'Criminal: Tolerated',corrupted:'Officials Corrupted',capture:'Governance Captured'};
    rect(d,lx,ly,colW,7.5,[252,240,252],[200,160,200]);
    d.setFont('helvetica','bold'); d.setFontSize(7.5); st(d,CRIM);
    d.text('[!] '+s(captureLabels[ps.criminalCaptureState]||ps.criminalCaptureState),lx+2,ly+5);
    ly+=9.5;
  }

  ly=secBar(d,lx,ly,colW,'Factions',GOV);
  (ps.factions||[]).forEach((fac,i)=>{
    if (ly>BOT-18) return;
    const fc=CAT_CLR[fac.category]||BROWN;
    // Left accent strip per faction
    rect(d,lx,ly,2.5,fac.desc?14:8,fc);
    d.setFont('helvetica','bold'); d.setFontSize(8); st(d,fc);
    d.text(s(fac.faction)+(fac.isGoverning?' [GOVERNING]':''),lx+5,ly+4.5);
    d.setFont('helvetica','normal'); d.setFontSize(6.5); st(d,BROWN);
    d.text('['+s(fac.powerLabel||'')+' | power: '+Math.round(fac.power||0)+']',lx+5,ly+8.5);
    let rowH=10;
    if (fac.desc) {
      const fL=wrap(d,fac.desc,colW-7,7.5);
      const clip=fL.slice(0,2);
      if (fL.length>2) clip[1]=clip[1].replace(/\.{0,3}$/,'...');
      d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
      d.text(clip,lx+5,ly+12); rowH=14+lh(7.5,clip.length-1);
    }
    hline(d,lx,ly+rowH,lx+colW,TAN); ly+=rowH+3;
  });

  // Conflicts
  const conflicts=(r.conflicts||[]);
  if (conflicts.length&&ly<BOT-18) {
    ly=secBar(d,lx,ly,colW,'Conflicts',MIL);
    conflicts.forEach(c=>{
      if (ly>BOT-14) return;
      d.setFont('helvetica','bold'); d.setFontSize(8); st(d,MIL);
      d.text(s((c.parties||[]).join(' vs ')),lx+2,ly); ly+=4;
      if (c.issue) {
        const iL=wrap(d,c.issue,colW-4,7.5);
        d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
        d.text(iL.slice(0,2),lx+2,ly); ly+=lh(7.5,Math.min(iL.length,2))+2;
      }
    });
  }

  // ── RIGHT: History ────────────────────────────────────────────────────────────
  const fstr=foundingStr(hist.founding);
  if (fstr) {
    ry=secBar(d,rx,ry,colW,'Founding',HIST);
    const fL=wrap(d,fstr,colW-4,8);
    d.setFont('helvetica','italic'); d.setFontSize(8); st(d,INK);
    d.text(fL.slice(0,3),rx+2,ry); ry+=lh(8,Math.min(fL.length,3))+3;
  }

  const origin=Array.isArray(r.settlementReason)?r.settlementReason.join(' '):(r.settlementReason?.primary||r.settlementReason||'');
  if (origin) {
    ry=secBar(d,rx,ry,colW,'Origin',HIST);
    const oL=wrap(d,origin,colW-4,8);
    d.setFont('helvetica','italic'); d.setFontSize(8); st(d,INK);
    d.text(oL.slice(0,3),rx+2,ry); ry+=lh(8,Math.min(oL.length,3))+3;
  }

  const events=(hist.historicalEvents||[]).sort((a,b)=>(a.yearsAgo||0)-(b.yearsAgo||0));
  if (events.length) {
    ry=secBar(d,rx,ry,colW,`Historical Events (${hist.age||0} yrs)`,HIST);
    events.forEach(evt=>{
      if (ry>BOT-15) return;
      const yrsL=evt.yearsAgo<=10?'Recent':evt.yearsAgo<=80?'Living memory':'Ancient';
      d.setFont('helvetica','bold'); d.setFontSize(6.5); st(d,HIST);
      d.text(s((evt.type||'').replace(/_/g,' '))+' ['+yrsL+']',rx+2,ry); ry+=3.5;
      const eL=wrap(d,evt.description||'',colW-4,7.5);
      if (eL.length>2) eL[1]=eL[1].replace(/\.{0,3}$/,'...');
      d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
      d.text(eL.slice(0,2),rx+2,ry); ry+=lh(7.5,Math.min(eL.length,2))+1;
      hline(d,rx,ry,rx+colW,TAN); ry+=2.5;
    });
  }

  const tensions=(hist.currentTensions||[]);
  if (tensions.length&&ry<BOT-18) {
    ry=secBar(d,rx,ry,colW,'Current Tensions',[170,125,10]);
    tensions.forEach(t=>{
      if (ry>BOT-14) return;
      const desc=typeof t==='string'?t:t.description;
      const ttype=typeof t==='object'&&t.type?t.type.replace(/_/g,' '):'';
      if (ttype) {
        d.setFont('helvetica','bold'); d.setFontSize(6.5); st(d,[130,95,0]);
        d.text(s(ttype),rx+2,ry); ry+=3.5;
      }
      const tL=wrap(d,desc||'',colW-4,7.5);
      d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
      d.text(tL.slice(0,2),rx+2,ry); ry+=lh(7.5,Math.min(tL.length,2))+1;
      if (typeof t==='object'&&t.factions?.length) {
        d.setFont('helvetica','italic'); d.setFontSize(6.5); st(d,BROWN);
        d.text('Factions: '+t.factions.map(s).join(', '),rx+2,ry); ry+=3.5;
      }
      hline(d,rx,ry,rx+colW,TAN); ry+=2;
    });
  }

  footer(d,name,`Page ${pageN}`);
}

// ════════════════════════════════════════════════════════════════════════════════
// GEOGRAPHY & RELATIONSHIPS
// ════════════════════════════════════════════════════════════════════════════════
function buildGeography(doc, r, ra, name, pageN) {
  const d=doc;
  let y=masthead(d,name,'geography','Geography & World');

  // Terrain header
  if (ra.terrain) {
    const tClr={Coastal:[26,58,106],Plains:[58,106,26],Forest:[26,90,40],
      Hills:[106,74,26],Mountains:[74,74,90],Riverside:[26,90,106],
      Desert:[138,90,26]}[ra.terrain]||GOLD;
    rect(d,ML,y,CW,14,[245,240,230],TAN);
    hline(d,ML,y,ML+CW,tClr,0.8);
    d.setFont('times','bold'); d.setFontSize(16); st(d,tClr);
    d.text(s(ra.terrain),ML+4,y+9.5);
    if (ra.strategicValue) {
      d.setFont('helvetica','normal'); d.setFontSize(8); st(d,BROWN);
      const svL=wrap(d,ra.strategicValue,CW-50,8);
      d.text(svL.slice(0,2),ML+4,y+13.5);
    }
    y+=17;
  }

  if ((ra.economicStrengths||[]).length) {
    d.setFont('helvetica','bold'); d.setFontSize(7); st(d,REL);
    d.text('ECONOMIC STRENGTHS: ',ML,y);
    d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
    d.text((ra.economicStrengths||[]).map(s).join('  |  '),ML+40,y);
    y+=6;
  }

  // Resource exploitation
  const exploit=ra.exploitation||{};
  const unex=(exploit.unexploited||[]);
  const part=(exploit.partiallyExploited||[]);
  const full=(exploit.fullyExploited||[]);

  if (unex.length||part.length||full.length) {
    y=secBar(d,ML,y,CW,'Resource Exploitation',ECO);
    if (unex.length) {
      d.setFont('helvetica','bold'); d.setFontSize(7); st(d,[110,75,0]);
      d.text('[!] UNEXPLOITED OPPORTUNITIES',ML+2,y); y+=4;
      unex.forEach(chain=>{
        if (y>BOT-22) return;
        const flow=[chain.rawResource,...(chain.intermediateGoods||[]),...(chain.finalProducts||[]).slice(0,2)].map(v=>s(v||'').replace(/_/g,' ')).join(' -> ');
        rect(d,ML,y,CW,16,[252,248,232],[220,190,90]);
        rect(d,ML,y,3,16,[180,135,20]); // thick left accent
        d.setFont('helvetica','bold'); d.setFontSize(8.5); st(d,[110,75,0]);
        d.text(s(chain.rawResource||'').replace(/_/g,' '),ML+5,y+6);
        d.setFont('helvetica','normal'); d.setFontSize(7); st(d,BROWN);
        d.text('Value: '+s(chain.exportValue||''),ML+5,y+10.5);
        const fL=wrap(d,flow,CW-55,7);
        d.text(fL.slice(0,1),ML+55,y+6);
        if ((chain.missingInstitutions||[]).length) {
          d.setFont('helvetica','italic'); d.setFontSize(6.5); st(d,MIL);
          d.text('Needs: '+chain.missingInstitutions.slice(0,3).map(s).join(', '),ML+55,y+11);
        }
        y+=18;
      });
    }
    if (part.length&&y<BOT-14) {
      d.setFont('helvetica','bold'); d.setFontSize(7); st(d,ECO);
      d.text('PARTIALLY EXPLOITED',ML+2,y); y+=4;
      part.forEach(chain=>{
        if (y>BOT-12) return;
        d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
        const pL=wrap(d,'- '+s(chain.rawResource||'').replace(/_/g,' ')+': '+(chain.finalProducts||[]).slice(0,2).map(s).join(', '),CW-4,7.5);
        d.text(pL.slice(0,1),ML+2,y); y+=lh(7.5,1)+1;
      });
      y+=2;
    }
    if (full.length&&y<BOT-12) {
      d.setFont('helvetica','bold'); d.setFontSize(7); st(d,REL);
      d.text('FULLY EXPLOITED: ',ML+2,y);
      d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
      d.text(full.slice(0,6).map(c=>s((c.rawResource||'').replace(/_/g,' '))).join(', '),ML+35,y);
      y+=6;
    }
    y+=2;
  }

  // Settlement districts
  const quarters=(r.spatialLayout?.quarters||[]);
  if (quarters.length&&y<BOT-18) {
    y=secBar(d,ML,y,CW,'Settlement Districts ('+quarters.length+')',INFRA);
    const qW=(CW-4)/2;
    let qLy=y, qRy=y;
    quarters.forEach((q,i)=>{
      const col=i%2, qx=col===0?ML:ML+qW+4;
      let qy=col===0?qLy:qRy;
      if (qy>BOT-16) return;
      const dL=wrap(d,q.desc||'',qW-4,7.5);
      const lmL=(q.landmarks||[]).slice(0,2);
      const qH=6+lh(7.5,Math.min(dL.length,3))+lmL.length*3.5+2;
      rect(d,qx,qy,qW,qH,[248,244,236],TAN);
      d.setFont('helvetica','bold'); d.setFontSize(8); st(d,INK);
      d.text(s(q.name||''),qx+3,qy+5);
      d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,BROWN);
      d.text(dL.slice(0,3),qx+3,qy+9);
      if (lmL.length) {
        const lmy=qy+9+lh(7.5,Math.min(dL.length,3));
        d.setFont('helvetica','italic'); d.setFontSize(7); st(d,[100,80,50]);
        lmL.forEach((lm,j)=>d.text('* '+s(lm),qx+3,lmy+j*3.5));
      }
      if (col===0) qLy=qy+qH+3; else qRy=qy+qH+3;
    });
    y=Math.max(qLy,qRy)+2;
  }

  // Neighbours
  const neighbours=(r.neighbourNetwork||[]);
  if (neighbours.length&&y<BOT-14) {
    y=secBar(d,ML,y,CW,'Neighbour Settlements',[50,70,120]);
    neighbours.forEach(nb=>{
      if (y>BOT-11) return;
      const relType=s((nb.relationshipType||'neutral').replace(/_/g,' '));
      const relClr=relType.includes('ally')?REL:relType.includes('rival')||relType.includes('enemy')?MIL:BROWN;
      d.setFont('helvetica','bold'); d.setFontSize(8); st(d,relClr);
      d.text(s(nb.name||nb.neighbourName||'')+(nb.neighbourTier?' ('+s(nb.neighbourTier)+')':'')+'  ['+relType+']',ML+2,y);
      y+=4;
      if (nb.description) {
        const nL=wrap(d,nb.description,CW-4,7.5);
        d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d,INK);
        d.text(nL.slice(0,2),ML+2,y); y+=lh(7.5,Math.min(nL.length,2))+2;
      }
    });
  }

  footer(d,name,`Page ${pageN}`);
}

// ════════════════════════════════════════════════════════════════════════════════
// GATHER HOOKS helper
// ════════════════════════════════════════════════════════════════════════════════
function gatherHooks(r, eco, sp) {
  const hooks=[];
  (r.npcs||[]).forEach(n=>{
    (n.plotHooks||[]).forEach(h=>{
      const txt=typeof h==='string'?h:(h?.hook||String(h||''));
      if (txt) hooks.push({text:txt,source:s(n.name)+(n.role?' ('+s(n.role)+')':''),cat:'npc'});
    });
  });
  (r.conflicts||[]).forEach(c=>{
    (c.plotHooks||[]).forEach(h=>{
      const txt=typeof h==='string'?h:(h?.hook||String(h||''));
      if (txt) hooks.push({text:txt,source:(c.parties||[]).map(s).join(' vs '),cat:'faction'});
    });
  });
  (r.history?.currentTensions||[]).forEach(t=>{
    const ths=typeof t==='object'?(t.plotHooks||[]):[];
    ths.forEach(h=>{
      const txt=typeof h==='string'?h:(h?.hook||String(h||''));
      if (txt) hooks.push({text:txt,source:s((t.type||'tension').replace(/_/g,' ')),cat:'tension'});
    });
  });
  (sp.plotHooks||[]).forEach(h=>{
    const txt=typeof h==='string'?h:(h?.hook||String(h||''));
    if (txt) hooks.push({text:txt,source:'Public safety',cat:'safety'});
  });
  return hooks;
}

// ════════════════════════════════════════════════════════════════════════════════
// HOOKS, VIABILITY & SERVICES
// ════════════════════════════════════════════════════════════════════════════════
function buildHooks(doc, r, eco, via, sp, name, pageN, hooks) {
  const d=doc;
  let y=masthead(d,name,'hooks','Hooks, Viability & Services');

  const HOOKS_MAX=BOT*0.58;
  const CAT_CLR2={npc:GOV,faction:MIL,tension:[170,125,10],safety:CRIM,economics:ECO};
  const CAT_LABELS={npc:'NPC Hooks',faction:'Faction Hooks',tension:'Tension Hooks',safety:'Safety Hooks'};

  if (hooks.length) {
    y=secBar(d,ML,y,CW,'Plot Hooks ('+hooks.length+')',[45,20,65]);
    const grouped={};
    hooks.forEach(h=>{ (grouped[h.cat]=grouped[h.cat]||[]).push(h); });

    for (const [cat,catHooks] of Object.entries(grouped)) {
      if (y>HOOKS_MAX) break;
      const cc=CAT_CLR2[cat]||BROWN;
      d.setFont('helvetica','bold'); d.setFontSize(7); st(d,cc);
      d.text(CAT_LABELS[cat]||cat,ML+2,y); y+=4;

      catHooks.forEach(h=>{
        if (y>HOOKS_MAX-8) return;
        const hL=wrap(d,h.text,CW-50,8);
        const hH=lh(8,Math.min(hL.length,2))+8;
        rect(d,ML,y,CW,hH,[248,246,242],TAN);
        rect(d,ML,y,2.5,hH,cc);  // left accent strip
        d.setFont('helvetica','normal'); d.setFontSize(8); st(d,INK);
        d.text(hL.slice(0,2),ML+5,y+5);
        d.setFont('helvetica','italic'); d.setFontSize(7); st(d,BROWN);
        const srcW=d.getStringUnitWidth('-- '+h.source)*7/d.internal.scaleFactor;
        d.text('-- '+s(h.source),ML+CW-srcW-2,y+5);
        y+=hH+2;
      });
      y+=2;
    }
    y+=3;
  }

  // Viability
  if (via&&y<BOT-25) {
    const viable=via.viable;
    const vClr=viable===false?MIL:viable===true?REL:[170,125,10];
    const vLabel=viable===false?'[!] NOT COHERENT':viable===true?'[Y] COHERENT':'[~] MARGINAL';
    y=secBar(d,ML,y,CW,'Structural Viability',vClr);
    d.setFont('helvetica','bold'); d.setFontSize(9); st(d,vClr);
    d.text(vLabel,ML+2,y); y+=5;
    if (via.summary) {
      const sumL=wrap(d,via.summary.replace(/^[^\w]*(NOT VIABLE:|VIABLE:)\s*/i,''),CW-4,8.5);
      d.setFont('helvetica','normal'); d.setFontSize(8.5); st(d,INK);
      d.text(sumL.slice(0,3),ML+2,y); y+=lh(8.5,Math.min(sumL.length,3))+3;
    }
    const crits=(via.issues||[]).filter(i=>i.severity==='critical'&&i.type!=='stress_consequence').slice(0,4);
    crits.forEach(issue=>{
      if (y>BOT-12) return;
      rect(d,ML,y,CW,9,[252,244,244],[230,190,190]);
      rect(d,ML,y,2.5,9,MIL);
      d.setFont('helvetica','bold'); d.setFontSize(7.5); st(d,MIL);
      d.text('[!] '+s(issue.title||issue.institution||''),ML+5,y+5.8);
      y+=11;
    });
    y+=2;
  }

  // Services
  const services=r.services||{};
  const svcCats=Object.entries(services).filter(([,v])=>v?.length);
  if (svcCats.length&&y<BOT-18) {
    y=secBar(d,ML,y,CW,'Available Services',BROWN);
    const sW=(CW-8)/3; let scols=[y,y,y]; let ci=0;
    svcCats.forEach(([cat,svcs])=>{
      const col=ci%3, cx=ML+col*(sW+4);
      let cy=scols[col];
      if (cy>BOT-12){ci++;return;}
      d.setFont('helvetica','bold'); d.setFontSize(7); st(d,BROWN);
      d.text(s(cat.charAt(0).toUpperCase()+cat.slice(1)),cx,cy); cy+=4;
      svcs.forEach(svc=>{
        if (cy>BOT-8) return;
        const nm=typeof svc==='string'?svc:(svc.name||'');
        d.setFont('helvetica','normal'); d.setFontSize(7); st(d,INK);
        const sL=wrap(d,nm,sW-6,7);
        d.text('-',cx,cy); d.text(sL,cx+4,cy);
        cy+=lh(7,sL.length);
      });
      cy+=2; scols[col]=cy; ci++;
    });
  }

  footer(d,name,`Page ${pageN}`);
}

// ════════════════════════════════════════════════════════════════════════════════
// NEIGHBOUR NETWORK PAGE
// ════════════════════════════════════════════════════════════════════════════════
function buildNeighbours(doc, r, net, isr, name, pageN) {
  const d = doc;
  let y = masthead(d, name, 'geography', 'Neighbour Network');

  y = secBar(d, ML, y, CW, 'Linked Settlements', [26,70,90]);
  net.forEach(n => {
    if (y > BOT - 20) { d.addPage(); y = masthead(d, name, 'geography', 'Neighbours cont.'); }
    const rel = s((n.relationshipType || 'linked').replace(/_/g,' '));
    const nName = s(n.neighbourName || n.name || '');
    const nTier = s(n.tier || n.neighbourTier || '');
    const relClr = rel.includes('rival') || rel.includes('hostile') || rel.includes('cold') ? MIL
                 : rel.includes('allied') || rel.includes('trade') ? REL
                 : rel.includes('patron') || rel.includes('client') ? GOV
                 : rel.includes('criminal') ? CRIM : BROWN;
    rect(d, ML, y, 2.5, 10, relClr);
    d.setFont('helvetica','bold'); d.setFontSize(9); st(d, INK);
    d.text(nName, ML+5, y+5);
    d.setFont('helvetica','normal'); d.setFontSize(7); st(d, BROWN);
    d.text(`${nTier}  |  ${rel}`, ML+5, y+9);
    y += 12;
  });

  if (isr.length > 0) {
    y = secBar(d, ML, y, CW, 'Inter-Settlement Contacts', [42,58,122]);
    isr.forEach(rel => {
      if (y > BOT - 20) { d.addPage(); y = masthead(d, name, 'geography', 'Contacts cont.'); }
      d.setFont('helvetica','bold'); d.setFontSize(8); st(d, INK);
      d.text(s(rel.npcName || ''), ML+2, y+4);
      d.setFont('helvetica','normal'); d.setFontSize(7); st(d, BROWN);
      const desc = s(rel.description || `${rel.npcName} (${rel.npcRole}) - ${rel.partnerName} (${rel.partnerRole}) in ${rel.partnerSettlement}`);
      const lines = wrap(d, desc, CW - 4, 7);
      d.text(lines.slice(0, 2), ML+2, y+8);
      y += 6 + lines.slice(0, 2).length * lh(7);
    });
  }

  footer(d, name, `Page ${pageN}`);
}

// ════════════════════════════════════════════════════════════════════════════════
// RELATIONSHIP DIAGRAM PAGE — force-directed graph of linked settlements
// ════════════════════════════════════════════════════════════════════════════════

// Relationship edge colors — mirrors neighbourSlice RELATIONSHIP_TYPES
const REL_COLORS = {
  neutral:       [136, 136, 136],
  trade_partner: [ 42, 122,  42],
  allied:        [ 42,  74, 138],
  patron:        [106,  74, 138],
  client:        [138, 106,  42],
  rival:         [138,  74,  42],
  cold_war:      [106,  42,  42],
  hostile:       [139,  26,  26],
};

function buildRelationshipDiagram(doc, r, net, name, pageN) {
  const d = doc;
  let y = masthead(d, name, 'geography', 'Relationship Map');

  // Build nodes: current settlement + all linked neighbours
  const nodes = [
    { id: '_self', label: s(r.name || 'This Settlement'), tier: s(r.tier || ''), isSelf: true },
    ...net.map((nb, i) => ({
      id: nb.settlementId || `nb_${i}`,
      label: s(nb.neighbourName || nb.name || `Neighbour ${i + 1}`),
      tier: s(nb.neighbourTier || nb.tier || ''),
      relType: (nb.relationshipType || 'neutral').toLowerCase(),
      isSelf: false,
    })),
  ];

  // Build edges: self → each neighbour, typed by relationshipType
  const edges = net.map((nb, i) => ({
    from: '_self',
    to: nb.settlementId || `nb_${i}`,
    type: (nb.relationshipType || 'neutral').toLowerCase(),
  }));

  // Compute layout in [0,1] unit square
  const laid = autoLayout(nodes, edges);
  const byId = new Map(laid.map(n => [n.id, n]));

  // Available diagram area on the page
  const DIAG_TOP = y + 4;
  const DIAG_BOT = BOT - 68; // leave room for legend + node list
  const DIAG_LEFT = ML + 6;
  const DIAG_RIGHT = ML + CW - 6;
  const DIAG_W = DIAG_RIGHT - DIAG_LEFT;
  const DIAG_H = DIAG_BOT - DIAG_TOP;

  // Background canvas for the diagram
  rect(d, ML, DIAG_TOP - 2, CW, DIAG_H + 4, CREAM, TAN);

  // Project unit coords to diagram area
  const project = (node) => ({
    px: DIAG_LEFT + node.x * DIAG_W,
    py: DIAG_TOP + node.y * DIAG_H,
  });

  // ── Draw edges first (so they sit under nodes) ──────────────────────────
  for (const e of edges) {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) continue;
    const { px: ax, py: ay } = project(a);
    const { px: bx, py: by } = project(b);
    const clr = REL_COLORS[e.type] || REL_COLORS.neutral;
    sd(d, clr);

    // Edge line weight by relationship strength
    const isStrong = ['allied', 'trade_partner', 'hostile'].includes(e.type);
    d.setLineWidth(isStrong ? 0.8 : 0.45);
    d.line(ax, ay, bx, by);

    // Label near midpoint
    const midX = (ax + bx) / 2;
    const midY = (ay + by) / 2;
    const label = e.type.replace(/_/g, ' ');
    d.setFont('helvetica', 'bold');
    d.setFontSize(5.5);
    st(d, clr);
    d.text(label, midX + 1, midY - 0.8);
  }

  // ── Draw nodes on top of edges ──────────────────────────────────────────
  for (const node of laid) {
    const { px, py } = project(node);
    const isSelf = node.isSelf;
    const nodeR = isSelf ? 7 : 5.5;

    // Shadow ring
    sf(d, [240, 232, 210]);
    d.circle(px + 0.5, py + 0.5, nodeR + 0.6, 'F');

    // Node circle
    sf(d, isSelf ? GOLD : [245, 240, 228]);
    sd(d, isSelf ? GOLDD : BROWN);
    d.setLineWidth(isSelf ? 0.8 : 0.5);
    d.circle(px, py, nodeR, 'FD');

    // Label below the node
    d.setFont('helvetica', 'bold');
    d.setFontSize(isSelf ? 8 : 7);
    st(d, isSelf ? GOLDD : INK);
    const txt = truncate(node.label, 22);
    const txtW = d.getStringUnitWidth(txt) * (isSelf ? 8 : 7) / d.internal.scaleFactor;
    d.text(txt, px - txtW / 2, py + nodeR + 3.5);

    // Tier below label
    if (node.tier) {
      d.setFont('helvetica', 'normal');
      d.setFontSize(5.5);
      st(d, BROWN);
      const tierTxt = node.tier.toUpperCase();
      const tierW = d.getStringUnitWidth(tierTxt) * 5.5 / d.internal.scaleFactor;
      d.text(tierTxt, px - tierW / 2, py + nodeR + 7);
    }
  }

  // ── Legend ──────────────────────────────────────────────────────────────
  const legendY = DIAG_BOT + 6;
  y = legendY;
  y = secBar(d, ML, y, CW, 'Relationship Legend', [26, 70, 90]);

  const legendEntries = Object.entries(REL_COLORS);
  const colsLeg = 4;
  const colW = (CW - 4) / colsLeg;
  legendEntries.forEach(([type, clr], i) => {
    const col = i % colsLeg;
    const row = Math.floor(i / colsLeg);
    const lx = ML + col * colW + 2;
    const ly = y + row * 5;
    // Color swatch (line)
    sd(d, clr);
    d.setLineWidth(1);
    d.line(lx, ly, lx + 7, ly);
    // Label
    d.setFont('helvetica', 'normal');
    d.setFontSize(6.5);
    st(d, INK);
    d.text(type.replace(/_/g, ' '), lx + 9, ly + 1.5);
  });
  y += Math.ceil(legendEntries.length / colsLeg) * 5 + 4;

  // ── Neighbour list (condensed) ──────────────────────────────────────────
  if (y < BOT - 14) {
    y = secBar(d, ML, y, CW, 'Linked Settlements', [26, 70, 90]);
    const colsLst = 2;
    const lstW = (CW - 4) / colsLst;
    let colYs = [y, y];
    net.forEach((nb, i) => {
      const col = i % colsLst;
      let cy = colYs[col];
      if (cy > BOT - 10) return;
      const cx = ML + col * (lstW + 4);
      const relType = (nb.relationshipType || 'neutral').toLowerCase();
      const clr = REL_COLORS[relType] || REL_COLORS.neutral;
      rect(d, cx, cy, 2, 5.5, clr);
      d.setFont('helvetica', 'bold');
      d.setFontSize(7);
      st(d, INK);
      d.text(truncate(nb.neighbourName || nb.name || '', 32), cx + 4, cy + 4);
      d.setFont('helvetica', 'normal');
      d.setFontSize(6);
      st(d, BROWN);
      d.text(`${s(nb.neighbourTier || nb.tier || '')} | ${relType.replace(/_/g, ' ')}`, cx + 4, cy + 7.8);
      cy += 10;
      colYs[col] = cy;
    });
  }

  footer(d, name, `Page ${pageN}`);
}

// ════════════════════════════════════════════════════════════════════════════════
// AI NARRATIVE PAGE
// ════════════════════════════════════════════════════════════════════════════════
function buildAiNarrative(doc, narrative, name, pageN) {
  const d = doc;
  let y = masthead(d, name, 'hooks', 'AI Narrative');

  [['Overview', narrative.overview], ['Atmosphere', narrative.atmosphere]].forEach(([label, text]) => {
    if (!text) return;
    if (y > BOT - 30) { d.addPage(); y = masthead(d, name, 'hooks', 'Narrative cont.'); }
    y = secBar(d, ML, y, CW, label, MAST.hooks);
    d.setFont('helvetica','normal'); d.setFontSize(8); st(d, INK);
    const lines = wrap(d, text, CW - 4, 8);
    lines.forEach(line => {
      if (y > BOT - 8) { d.addPage(); y = masthead(d, name, 'hooks', 'Narrative cont.'); y += 4; }
      d.text(line, ML+2, y);
      y += lh(8);
    });
    y += 2;
  });

  const hooks = narrative.hooks || [];
  if (hooks.length) {
    if (y > BOT - 25) { d.addPage(); y = masthead(d, name, 'hooks', 'Narrative cont.'); }
    y = secBar(d, ML, y, CW, 'Adventure Hooks', [45,20,65]);
    hooks.forEach((hook, i) => {
      if (y > BOT - 10) { d.addPage(); y = masthead(d, name, 'hooks', 'Hooks cont.'); y += 4; }
      d.setFont('helvetica','bold'); d.setFontSize(7.5); st(d, INK);
      d.text(`${i+1}.`, ML+2, y);
      d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d, BROWN);
      const hLines = wrap(d, hook, CW - 10, 7.5);
      d.text(hLines.slice(0, 3), ML+8, y);
      y += hLines.slice(0, 3).length * lh(7.5) + 2;
    });
  }

  const secrets = narrative.secrets || [];
  if (secrets.length) {
    if (y > BOT - 25) { d.addPage(); y = masthead(d, name, 'hooks', 'Narrative cont.'); }
    y = secBar(d, ML, y, CW, 'Hidden Truths', [74,26,74]);
    secrets.forEach(secret => {
      if (y > BOT - 10) { d.addPage(); y = masthead(d, name, 'hooks', 'Secrets cont.'); y += 4; }
      rect(d, ML, y-2, 2.5, 8, CRIM);
      d.setFont('helvetica','normal'); d.setFontSize(7.5); st(d, INK);
      const sLines = wrap(d, secret, CW - 8, 7.5);
      d.text(sLines.slice(0, 3), ML+5, y+2);
      y += sLines.slice(0, 3).length * lh(7.5) + 4;
    });
  }

  footer(d, name, `Page ${pageN}`);
}
