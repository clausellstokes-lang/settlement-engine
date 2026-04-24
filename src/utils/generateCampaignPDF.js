/**
 * generateCampaignPDF.js — Campaign-level export.
 *
 * One PDF that zooms out across a whole campaign:
 *   1. Cover page (campaign name + stats)
 *   2. Settlement index (one-line roster, sortable)
 *   3. Relationship map (force-directed diagram across all settlements)
 *   4. Cross-settlement NPC connections (who talks to whom, across places)
 *   5. Per-settlement digest (one card per settlement — not the full sheet)
 *   6. Network effects appendix (cascading modifiers)
 *
 * Uses the same visual language as generateSettlementPDF.js but at a
 * higher altitude — prose is short, lists are wide, the goal is DM at-a-glance.
 */
import { jsPDF } from 'jspdf';
import { autoLayout } from './graphLayout.js';
import { getAllModifiers, EFFECT_CATEGORIES, REL_LABELS } from '../lib/relationshipGraph.js';

// ── Page geometry ──────────────────────────────────────────────────────────────
const PW = 210, PH = 297;
const ML = 14, MR = 14, MT = 14, MB = 14;
const CW = PW - ML - MR;
const BOT = PH - MB;

// ── Colour palette (matches settlement PDF) ───────────────────────────────────
const INK   = [28,  20,  9];
const PARCH = [250, 244, 232];
const CREAM = [245, 237, 224];
const TAN   = [200, 184, 154];
const GOLD  = [160, 118, 42];
const BROWN = [107, 83,  48];
const MUTED = [140, 120, 90];

// Relationship line colours (same hues as the web app)
const REL_COLORS = {
  trade_partner: [26,  90,  40],
  allied:        [26,  58,  122],
  patron:        [74,  26, 106],
  client:        [106, 58,  26],
  rival:         [138, 80,  16],
  cold_war:      [138, 48,  16],
  hostile:       [139, 26,  26],
  neutral:       [107, 83,  64],
};

const REL_DASH = {
  patron:   [1.5, 1.0],
  client:   [1.5, 1.0],
  cold_war: [0.8, 1.2],
  rival:    [0.5, 0.9],
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

function s(v) {
  return String(v||'').replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g,' ').replace(/\s+/g,' ').trim();
}
function wrap(d,text,maxW,fontSize) {
  d.setFontSize(fontSize);
  return d.splitTextToSize(s(text),maxW);
}
function truncate(text, maxChars) {
  const t = s(text);
  if (t.length <= maxChars) return t;
  const cut = t.slice(0, maxChars - 1).replace(/\s\S*$/, '');
  return (cut||t.slice(0,maxChars-1)) + '...';
}

// Section header bar
function secBar(d, y, label, clr = INK, textClr = [255,255,255]) {
  const bh = 6;
  rect(d, ML, y, CW, bh, clr);
  d.setFont('helvetica','bold'); d.setFontSize(8); st(d, textClr);
  d.text(s(label).toUpperCase(), ML+3, y+4.2);
  return y + bh + 3;
}

// Footer: "Campaign: <name>   Page N" bottom-right on each page
function footer(d, campaignName, pageN, totalPagesHint) {
  d.setFont('helvetica','italic'); d.setFontSize(7); st(d, MUTED);
  d.text(s(campaignName), ML, PH - 5);
  const right = `Page ${pageN}` + (totalPagesHint ? ` of ${totalPagesHint}` : '');
  const w = d.getStringUnitWidth(right) * 7 / d.internal.scaleFactor;
  d.text(right, PW - MR - w, PH - 5);
}

// Ensure there's room for `h` more millimetres, else paginate.
function ensureSpace(d, y, h, campaignName, pageN, newTopHandler) {
  if (y + h < BOT) return { y, pageN };
  footer(d, campaignName, pageN);
  d.addPage();
  pageN++;
  const newY = newTopHandler ? newTopHandler(d, pageN) : MT;
  return { y: newY, pageN };
}

// ─────────────────────────────────────────────────────────────────────────────
// Page 1: Cover
// ─────────────────────────────────────────────────────────────────────────────
function buildCover(d, campaign, settlements) {
  // Parchment backdrop
  rect(d, 0, 0, PW, PH, PARCH);

  // Decorative border
  sd(d, GOLD); d.setLineWidth(1.2);
  d.rect(10, 10, PW-20, PH-20);
  sd(d, GOLD); d.setLineWidth(0.35);
  d.rect(13, 13, PW-26, PH-26);

  // Title block (centered)
  const centerX = PW/2;
  const titleY = 60;

  d.setFont('helvetica','italic'); d.setFontSize(11); st(d, BROWN);
  d.text('CAMPAIGN DOSSIER', centerX, titleY, { align: 'center' });

  d.setFont('helvetica','bold'); d.setFontSize(28); st(d, INK);
  const titleLines = wrap(d, campaign.name || 'Untitled Campaign', CW - 20, 28);
  let ty = titleY + 16;
  for (const line of titleLines.slice(0, 3)) {
    d.text(line, centerX, ty, { align: 'center' });
    ty += 12;
  }

  // Gold divider
  sd(d, GOLD); d.setLineWidth(0.6);
  d.line(centerX - 30, ty + 4, centerX + 30, ty + 4);

  // Description (if any)
  if (campaign.description) {
    d.setFont('helvetica','normal'); d.setFontSize(10); st(d, BROWN);
    const descLines = wrap(d, campaign.description, CW - 40, 10);
    let dy = ty + 14;
    for (const line of descLines.slice(0, 6)) {
      d.text(line, centerX, dy, { align: 'center' });
      dy += 5;
    }
    ty = dy;
  }

  // Stat panel (bottom half)
  const panelY = 170;
  const panelH = 80;
  rect(d, ML + 10, panelY, CW - 20, panelH, CREAM, TAN);

  d.setFont('helvetica','bold'); d.setFontSize(9); st(d, BROWN);
  d.text('ROSTER', ML + 16, panelY + 9);
  hline(d, ML + 16, panelY + 11, ML + CW - 16, TAN, 0.4);

  // Count stats
  const tierCounts = {};
  let totalPop = 0;
  let totalNPCs = 0;
  const cultures = new Set();
  for (const s of settlements) {
    const tier = s.settlement?.tier || 'unknown';
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    totalPop += Number(s.settlement?.population) || 0;
    totalNPCs += (s.settlement?.npcs || []).length;
    if (s.settlement?.culture) cultures.add(s.settlement.culture);
  }

  // Two-column stat grid
  const col1X = ML + 16;
  const col2X = ML + CW / 2 + 2;
  let gy = panelY + 18;

  const statRow = (x, y, label, value) => {
    d.setFont('helvetica','normal'); d.setFontSize(8); st(d, MUTED);
    d.text(label, x, y);
    d.setFont('helvetica','bold'); d.setFontSize(10); st(d, INK);
    d.text(String(value), x + 45, y);
  };

  statRow(col1X, gy,      'Settlements',  settlements.length);
  statRow(col2X, gy,      'Population',   totalPop.toLocaleString());
  statRow(col1X, gy + 8,  'NPCs',         totalNPCs);
  statRow(col2X, gy + 8,  'Cultures',     cultures.size);

  // Tier breakdown
  d.setFont('helvetica','bold'); d.setFontSize(8); st(d, BROWN);
  d.text('BY TIER', col1X, gy + 22);
  hline(d, col1X, gy + 24, col1X + 60, TAN, 0.3);

  const tiers = Object.entries(tierCounts).sort((a,b)=>b[1]-a[1]);
  let ty2 = gy + 30;
  for (const [tier, count] of tiers.slice(0, 5)) {
    d.setFont('helvetica','normal'); d.setFontSize(8); st(d, INK);
    d.text(`${tier.charAt(0).toUpperCase() + tier.slice(1)}`, col1X, ty2);
    d.setFont('helvetica','bold');
    d.text(String(count), col1X + 55, ty2);
    ty2 += 5;
  }

  // Right column: top 3 cultures
  d.setFont('helvetica','bold'); d.setFontSize(8); st(d, BROWN);
  d.text('CULTURES', col2X, gy + 22);
  hline(d, col2X, gy + 24, col2X + 60, TAN, 0.3);

  let cy = gy + 30;
  for (const culture of Array.from(cultures).slice(0, 5)) {
    d.setFont('helvetica','normal'); d.setFontSize(8); st(d, INK);
    const cName = s(culture).replace(/_/g,' ');
    d.text(cName.charAt(0).toUpperCase() + cName.slice(1), col2X, cy);
    cy += 5;
  }

  // Footer byline
  d.setFont('helvetica','italic'); d.setFontSize(7); st(d, MUTED);
  d.text(`Generated ${new Date().toLocaleDateString()}`, centerX, PH - 20, { align: 'center' });
  d.text('SettlementForge', centerX, PH - 15, { align: 'center' });
}

// ─────────────────────────────────────────────────────────────────────────────
// Page 2: Settlement Index
// ─────────────────────────────────────────────────────────────────────────────
function buildIndex(d, campaignName, settlements, pageN) {
  let y = MT;
  y = secBar(d, y, 'Settlement Index', INK);

  // Column headers
  d.setFont('helvetica','bold'); d.setFontSize(7); st(d, BROWN);
  d.text('NAME',       ML + 1,  y);
  d.text('TIER',       ML + 65, y);
  d.text('POP',        ML + 95, y);
  d.text('CULTURE',    ML + 118,y);
  d.text('LINKS',      ML + 160,y);
  hline(d, ML, y + 1.5, ML + CW, TAN, 0.3);
  y += 5;

  // Row striping
  const rowH = 5.5;

  settlements.forEach((save, i) => {
    if (y + rowH > BOT - 10) {
      footer(d, campaignName, pageN);
      d.addPage();
      pageN++;
      y = MT;
      y = secBar(d, y, 'Settlement Index (continued)', INK);
      d.setFont('helvetica','bold'); d.setFontSize(7); st(d, BROWN);
      d.text('NAME',    ML + 1,  y);
      d.text('TIER',    ML + 65, y);
      d.text('POP',     ML + 95, y);
      d.text('CULTURE', ML + 118,y);
      d.text('LINKS',   ML + 160,y);
      hline(d, ML, y + 1.5, ML + CW, TAN, 0.3);
      y += 5;
    }

    if (i % 2 === 0) rect(d, ML, y - 3.5, CW, rowH, CREAM);

    const st_ = save.settlement || {};
    const links = (st_.neighbourNetwork || []).length;

    d.setFont('helvetica','bold'); d.setFontSize(8); st(d, INK);
    d.text(truncate(save.name || st_.name || 'Unnamed', 32), ML + 1, y);

    d.setFont('helvetica','normal'); d.setFontSize(7); st(d, BROWN);
    d.text(truncate(st_.tier || '-', 14), ML + 65, y);
    d.text(String((Number(st_.population) || 0).toLocaleString()), ML + 95, y);
    d.text(truncate(String(st_.culture || '-').replace(/_/g,' '), 20), ML + 118, y);

    d.setFont('helvetica','bold');
    st(d, links > 0 ? GOLD : MUTED);
    d.text(String(links), ML + 162, y);

    y += rowH;
  });

  return { y, pageN };
}

// ─────────────────────────────────────────────────────────────────────────────
// Page 3: Campaign Relationship Map
// ─────────────────────────────────────────────────────────────────────────────
function buildMap(d, campaignName, settlements, pageN) {
  let y = MT;
  y = secBar(d, y, 'Relationship Map', INK);

  // Build nodes & edges
  const nodes = settlements.map(s => ({
    id: s.id,
    label: s.name || s.settlement?.name || 'Unnamed',
    tier: s.settlement?.tier || '',
  }));

  const seenEdges = new Set();
  const edges = [];
  for (const save of settlements) {
    const net = save.settlement?.neighbourNetwork || [];
    for (const n of net) {
      if (!n.id) continue;
      if (!nodes.find(nn => nn.id === n.id)) continue;
      const key = [save.id, n.id].sort().join('::');
      if (seenEdges.has(key)) continue;
      seenEdges.add(key);
      edges.push({
        from: save.id,
        to: n.id,
        type: n.relationshipType || 'neutral',
      });
    }
  }

  if (nodes.length === 0) {
    d.setFont('helvetica','italic'); d.setFontSize(10); st(d, MUTED);
    d.text('No settlements in this campaign.', ML + 5, y + 10);
    return { y: y + 20, pageN };
  }

  // Diagram frame
  const DIAG_TOP = y + 2;
  const DIAG_BOT = 205;
  const DIAG_L   = ML + 5;
  const DIAG_R   = PW - MR - 5;
  const DIAG_W   = DIAG_R - DIAG_L;
  const DIAG_H   = DIAG_BOT - DIAG_TOP;

  rect(d, DIAG_L, DIAG_TOP, DIAG_W, DIAG_H, CREAM, TAN);

  const laid = autoLayout(nodes, edges);
  const posMap = new Map(laid.map(p => [p.id, p]));

  const proj = (p) => ({
    x: DIAG_L + 10 + p.x * (DIAG_W - 20),
    y: DIAG_TOP + 10 + p.y * (DIAG_H - 20),
  });

  // Draw edges first
  for (const e of edges) {
    const a = posMap.get(e.from);
    const b = posMap.get(e.to);
    if (!a || !b) continue;
    const pa = proj(a);
    const pb = proj(b);
    const clr = REL_COLORS[e.type] || REL_COLORS.neutral;
    sd(d, clr);
    // Line weight by edge type — stronger for hostile/alliance
    const lw = e.type === 'hostile' ? 0.9 :
               e.type === 'allied'  ? 0.7 :
               e.type === 'trade_partner' ? 0.6 : 0.45;
    d.setLineWidth(lw);
    if (REL_DASH[e.type]) {
      d.setLineDashPattern(REL_DASH[e.type], 0);
    }
    d.line(pa.x, pa.y, pb.x, pb.y);
    d.setLineDashPattern([], 0);
  }

  // Draw nodes
  for (const node of laid) {
    const p = proj(node);
    // Shadow ring
    sf(d, [230, 218, 192]);
    d.circle(p.x + 0.4, p.y + 0.4, 3.2, 'F');
    // Main circle
    sf(d, GOLD);
    d.circle(p.x, p.y, 3.0, 'F');
    sf(d, [255, 248, 232]);
    d.circle(p.x, p.y, 2.2, 'F');
    sd(d, GOLD); d.setLineWidth(0.35);
    d.circle(p.x, p.y, 3.0);

    // Label above
    d.setFont('helvetica','bold'); d.setFontSize(7); st(d, INK);
    const label = truncate(node.label, 20);
    d.text(label, p.x, p.y - 4, { align: 'center' });

    // Tier below (small)
    if (node.tier) {
      d.setFont('helvetica','normal'); d.setFontSize(5.5); st(d, MUTED);
      d.text(s(node.tier), p.x, p.y + 6, { align: 'center' });
    }
  }

  // Legend below diagram
  let ly = DIAG_BOT + 5;
  d.setFont('helvetica','bold'); d.setFontSize(7); st(d, BROWN);
  d.text('LEGEND', ML, ly);
  hline(d, ML, ly + 1, ML + CW, TAN, 0.3);
  ly += 5;

  const legendItems = Object.entries(REL_COLORS);
  const legCol = CW / 4;
  legendItems.forEach((entry, idx) => {
    const [type, clr] = entry;
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const lx = ML + col * legCol;
    const lyRow = ly + row * 5;
    sd(d, clr); d.setLineWidth(1.2);
    d.line(lx, lyRow - 0.5, lx + 8, lyRow - 0.5);
    d.setFont('helvetica','normal'); d.setFontSize(7); st(d, INK);
    d.text(REL_LABELS[type] || type.replace(/_/g,' '), lx + 10, lyRow);
  });

  return { y: DIAG_BOT + 20, pageN };
}

// ─────────────────────────────────────────────────────────────────────────────
// Cross-settlement NPC connections (who-talks-to-whom table)
// ─────────────────────────────────────────────────────────────────────────────
function buildNPCConnections(d, campaignName, settlements, pageN) {
  d.addPage();
  pageN++;
  let y = MT;
  y = secBar(d, y, 'Cross-Settlement NPC Contacts', INK);

  // Gather interSettlementNpcs across all saves
  const connections = [];
  for (const save of settlements) {
    const npcs = save.settlement?.npcs || [];
    for (const npc of npcs) {
      const isn = npc.interSettlementNpcs || [];
      for (const entry of isn) {
        connections.push({
          home: save.name || save.settlement?.name,
          npc:  npc.name,
          role: npc.role,
          partnerSettlement: entry.partnerSettlement,
          partnerName: entry.partnerName,
          partnerRole: entry.partnerRole,
          relType: entry.relType || 'neutral',
        });
      }
    }
  }

  if (connections.length === 0) {
    d.setFont('helvetica','italic'); d.setFontSize(9); st(d, MUTED);
    d.text('No cross-settlement NPC contacts recorded.', ML + 3, y + 8);
    d.setFont('helvetica','normal'); d.setFontSize(8); st(d, BROWN);
    d.text('Link settlements in the Settlements panel to automatically generate',
           ML + 3, y + 15);
    d.text('paired NPC contacts between them.', ML + 3, y + 20);
    return { y: y + 30, pageN };
  }

  // Column headers
  d.setFont('helvetica','bold'); d.setFontSize(7); st(d, BROWN);
  d.text('FROM',          ML + 1,  y);
  d.text('NPC',           ML + 48, y);
  d.text('->',            ML + 92, y);
  d.text('CONTACT',       ML + 100,y);
  d.text('AT',            ML + 148,y);
  hline(d, ML, y + 1.5, ML + CW, TAN, 0.3);
  y += 5;

  const rowH = 5;
  connections.forEach((c, i) => {
    if (y + rowH > BOT - 10) {
      footer(d, campaignName, pageN);
      d.addPage();
      pageN++;
      y = MT;
      y = secBar(d, y, 'Cross-Settlement NPC Contacts (cont.)', INK);
      d.setFont('helvetica','bold'); d.setFontSize(7); st(d, BROWN);
      d.text('FROM',    ML + 1,  y);
      d.text('NPC',     ML + 48, y);
      d.text('->',      ML + 92, y);
      d.text('CONTACT', ML + 100,y);
      d.text('AT',      ML + 148,y);
      hline(d, ML, y + 1.5, ML + CW, TAN, 0.3);
      y += 5;
    }

    if (i % 2 === 0) rect(d, ML, y - 3.5, CW, rowH, CREAM);

    const clr = REL_COLORS[c.relType] || REL_COLORS.neutral;
    // Left colored pip
    sf(d, clr);
    d.circle(ML + 0.5, y - 1.2, 1.1, 'F');

    d.setFont('helvetica','normal'); d.setFontSize(7); st(d, BROWN);
    d.text(truncate(c.home || '-', 22), ML + 3, y);

    d.setFont('helvetica','bold'); st(d, INK);
    d.text(truncate(c.npc || '-', 22), ML + 48, y);

    d.setFont('helvetica','bold'); st(d, clr);
    d.text('>', ML + 93, y);

    d.setFont('helvetica','bold'); st(d, INK);
    d.text(truncate(c.partnerName || '-', 22), ML + 100, y);

    d.setFont('helvetica','normal'); st(d, BROWN);
    d.text(truncate(c.partnerSettlement || '-', 22), ML + 148, y);

    y += rowH;
  });

  return { y, pageN };
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-settlement digest cards (one card per settlement, half-page each)
// ─────────────────────────────────────────────────────────────────────────────
function buildDigest(d, campaignName, settlements, pageN) {
  d.addPage();
  pageN++;
  let y = MT;
  y = secBar(d, y, 'Settlement Digest', INK);

  const CARD_H = 54;
  const CARD_GAP = 4;

  for (const save of settlements) {
    if (y + CARD_H > BOT - 10) {
      footer(d, campaignName, pageN);
      d.addPage();
      pageN++;
      y = MT;
      y = secBar(d, y, 'Settlement Digest (continued)', INK);
    }

    const st_ = save.settlement || {};

    // Card frame
    rect(d, ML, y, CW, CARD_H, CREAM, TAN);

    // Title band
    rect(d, ML, y, CW, 7, INK);
    d.setFont('helvetica','bold'); d.setFontSize(10); st(d, [255,245,220]);
    d.text(truncate(save.name || st_.name || 'Unnamed', 40), ML + 3, y + 4.8);

    // Tier | Culture | Pop (right-aligned pills in title band)
    const pill = (label) => {
      d.setFont('helvetica','bold'); d.setFontSize(7);
      return d.getStringUnitWidth(label) * 7 / d.internal.scaleFactor + 4;
    };
    const pops = (Number(st_.population) || 0).toLocaleString();
    const right1 = `${pops} pop`;
    const right2 = s(st_.tier || '');
    const right3 = s(String(st_.culture || '').replace(/_/g,' '));
    const pw1 = pill(right1);
    const pw2 = pill(right2);
    const pw3 = pill(right3);
    let rx = PW - MR - 3 - pw1;
    d.setFont('helvetica','bold'); d.setFontSize(7); st(d, GOLD);
    d.text(right1, rx, y + 4.8);
    rx -= (pw2 + 2);
    st(d, [220, 200, 160]);
    d.text(right2, rx, y + 4.8);
    rx -= (pw3 + 2);
    st(d, [200, 180, 140]);
    d.text(right3, rx, y + 4.8);

    // Two-column content: left = hook/overview, right = top NPCs + factions
    const colGap = 4;
    const colW = (CW - colGap) / 2;
    const L_X = ML + 3;
    const R_X = ML + colW + colGap + 3;
    const bodyY = y + 10;

    // LEFT — overview line (character & hook)
    d.setFont('helvetica','bold'); d.setFontSize(7); st(d, BROWN);
    d.text('OVERVIEW', L_X, bodyY);
    hline(d, L_X, bodyY + 1, L_X + colW - 6, TAN, 0.2);

    const overview = s(st_.characterSummary || st_.description || st_.overview || '');
    d.setFont('helvetica','normal'); d.setFontSize(7); st(d, INK);
    const ovLines = wrap(d, overview, colW - 6, 7);
    let ly = bodyY + 5;
    for (const line of ovLines.slice(0, 3)) {
      d.text(line, L_X, ly);
      ly += 3;
    }

    // Adventure hook (one-liner)
    const hooks = st_.plotHooks || st_.hooks || [];
    if (hooks.length > 0) {
      const hook = typeof hooks[0] === 'string' ? hooks[0] : (hooks[0].hook || hooks[0].text || hooks[0].title || '');
      if (hook) {
        d.setFont('helvetica','bold'); d.setFontSize(7); st(d, BROWN);
        d.text('HOOK', L_X, ly + 2);
        hline(d, L_X, ly + 3, L_X + colW - 6, TAN, 0.2);
        d.setFont('helvetica','italic'); d.setFontSize(7); st(d, INK);
        const hLines = wrap(d, hook, colW - 6, 7);
        let hy = ly + 7;
        for (const line of hLines.slice(0, 3)) {
          d.text(line, L_X, hy);
          hy += 3;
        }
      }
    }

    // RIGHT — key NPCs
    d.setFont('helvetica','bold'); d.setFontSize(7); st(d, BROWN);
    d.text('KEY NPCs', R_X, bodyY);
    hline(d, R_X, bodyY + 1, R_X + colW - 6, TAN, 0.2);
    const keyNpcs = (st_.npcs || [])
      .filter(n => n.influence === 'high')
      .slice(0, 3);
    const shownNpcs = keyNpcs.length > 0 ? keyNpcs : (st_.npcs || []).slice(0, 3);

    let ry = bodyY + 5;
    for (const npc of shownNpcs) {
      d.setFont('helvetica','bold'); d.setFontSize(7); st(d, INK);
      d.text(truncate(s(npc.name), 22), R_X, ry);
      d.setFont('helvetica','italic'); d.setFontSize(6.5); st(d, BROWN);
      d.text(truncate(s(npc.role), 30), R_X, ry + 3);
      ry += 7;
    }

    // Links count
    const links = (st_.neighbourNetwork || []).length;
    if (links > 0) {
      d.setFont('helvetica','bold'); d.setFontSize(6.5); st(d, GOLD);
      d.text(`${links} link${links===1?'':'s'}`, R_X, y + CARD_H - 2.5);
    }

    y += CARD_H + CARD_GAP;
  }

  return { y, pageN };
}

// ─────────────────────────────────────────────────────────────────────────────
// Appendix: Network Effects per settlement
// ─────────────────────────────────────────────────────────────────────────────
function buildNetworkAppendix(d, campaignName, settlements, pageN) {
  let allModifiers;
  try {
    allModifiers = getAllModifiers(settlements);
  } catch (e) {
    return { y: MT, pageN };
  }

  const withEffects = settlements.filter(s => {
    const m = allModifiers.get(s.id);
    return m && m.sources && m.sources.length > 0;
  });
  if (withEffects.length === 0) return { y: MT, pageN };

  d.addPage();
  pageN++;
  let y = MT;
  y = secBar(d, y, 'Network Effects Appendix', INK);

  for (const save of withEffects) {
    const m = allModifiers.get(save.id);
    const blockH = 10 + 5 * EFFECT_CATEGORIES.length + 4;
    if (y + blockH > BOT - 10) {
      footer(d, campaignName, pageN);
      d.addPage();
      pageN++;
      y = MT;
      y = secBar(d, y, 'Network Effects Appendix (cont.)', INK);
    }

    d.setFont('helvetica','bold'); d.setFontSize(9); st(d, INK);
    d.text(s(save.name), ML, y + 3);
    d.setFont('helvetica','italic'); d.setFontSize(7); st(d, MUTED);
    d.text(`${m.sources.length} source${m.sources.length===1?'':'s'}`, ML + 100, y + 3);
    hline(d, ML, y + 5, ML + CW, TAN, 0.3);
    y += 8;

    // Per-category bars
    const maxAbs = Math.max(0.01,
      ...EFFECT_CATEGORIES.map(c => Math.abs(m.totals[c.key] || 0)));

    for (const cat of EFFECT_CATEGORIES) {
      const val = m.totals[cat.key] || 0;
      const pct = Math.min(Math.abs(val) / maxAbs, 1);
      const isPos = val >= 0;
      d.setFont('helvetica','normal'); d.setFontSize(7); st(d, BROWN);
      d.text(cat.label, ML, y);
      // Bar track
      rect(d, ML + 40, y - 2.5, 80, 2.5, [228,216,196]);
      // Fill
      const fillClr = isPos ? [26, 90, 40] : [139, 26, 26];
      if (val !== 0) rect(d, ML + 40, y - 2.5, 80 * pct, 2.5, fillClr);
      // Value
      d.setFont('helvetica','bold'); d.setFontSize(7); st(d, isPos ? [26,90,40] : [139,26,26]);
      const valStr = (isPos ? '+' : '') + (val * 100).toFixed(1) + '%';
      d.text(valStr, ML + 124, y);
      y += 4;
    }
    y += 5;
  }

  return { y, pageN };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────
export function generateCampaignPDF(campaign, allSaves) {
  if (!campaign) throw new Error('generateCampaignPDF: missing campaign');

  const ids = new Set(campaign.settlementIds || []);
  const settlements = (allSaves || []).filter(s => ids.has(s.id));

  if (settlements.length === 0) {
    // Still emit a cover page so the user sees something.
  }

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  let pageN = 1;

  // Page 1: cover
  buildCover(doc, campaign, settlements);

  // Page 2+: index
  doc.addPage();
  pageN++;
  const r1 = buildIndex(doc, campaign.name, settlements, pageN);
  pageN = r1.pageN;
  footer(doc, campaign.name, pageN);

  // Page 3+: map
  if (settlements.length > 0) {
    doc.addPage();
    pageN++;
    const r2 = buildMap(doc, campaign.name, settlements, pageN);
    pageN = r2.pageN;
    footer(doc, campaign.name, pageN);
  }

  // Cross-settlement NPC connections
  if (settlements.length > 0) {
    const r3 = buildNPCConnections(doc, campaign.name, settlements, pageN);
    pageN = r3.pageN;
    footer(doc, campaign.name, pageN);
  }

  // Per-settlement digest
  if (settlements.length > 0) {
    const r4 = buildDigest(doc, campaign.name, settlements, pageN);
    pageN = r4.pageN;
    footer(doc, campaign.name, pageN);
  }

  // Network effects appendix
  if (settlements.length > 1) {
    const r5 = buildNetworkAppendix(doc, campaign.name, settlements, pageN);
    pageN = r5.pageN;
    footer(doc, campaign.name, pageN);
  }

  // Filename
  const slug = (campaign.name || 'campaign')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'campaign';

  doc.save(`campaign-${slug}.pdf`);
}
