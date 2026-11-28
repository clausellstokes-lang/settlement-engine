/* CONFIG-HEADERS probe (2026-11-10). Reads the contrast of every pre-generation header,
 * subtitle and small label against what is PAINTED BEHIND IT, and screenshots each state.
 *
 *   node docs/chair/2026-11-10/config-headers/probe.cjs <baseURL> <outDir> <tag>
 *
 * Method: for each target text, the probe finds the text node, reads its element's computed
 * colour/size/weight and box,  then repaints the page with ALL text transparent and samples the
 * pixels inside that box — per element, scrolled to the viewport's middle, because the
 * painting is position:fixed and only a viewport capture shows what truly sits behind it. Contrast is reported against the 5th (darkest) and 95th (lightest)
 * percentile of the luminance behind it — the chair's own method — so a busy painting shows as
 * a wide band and a solid plate as a single figure. Desktop 1440x900 and iPhone 13; anonymous
 * landing, the signed-in chooser, Basic and Advanced.
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const [base = 'http://localhost:5199', outDir = '.', tag = 'x'] = process.argv.slice(2);

const TARGETS = [
  'Forge a settlement', 'Create a settlement', /^Pick a character|^Every dial|^Character \+|Choose a generation mode/,
  'Exact seed', 'reproduce a world: every dial rolls from the seed',
  'Character', 'Pick a settlement archetype to shape it in one tap',
  'Neutral', 'Economic', 'Military', 'Religious', 'Arcane', 'Civic',
  '1 · Foundations', 'size, route, culture: the essentials',
  '2 · Institutions, services & trade', 'force or forbid specifics', 'nothing forced or forbidden yet',
  'Optional', 'Force or forbid', 'Guarantee or forbid', 'Exports & imports',
  'Place in Region', 'Ready to generate',
  'Founding Worlds', /^Start somewhere already alive/, 'Want full control?',
];

const SIGNED_IN = {
  user: { id: 'mock-e2e', email: 'dm@example.test', user_metadata: {} },
  session: { access_token: 'mock-token' },
  tier: 'premium', role: 'user', displayName: 'DM', isFounder: false, needsVerification: false,
};

function lum([r, g, b]) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const ratio = (a, b) => { const [h, l] = a > b ? [a, b] : [b, a]; return (h + 0.05) / (l + 0.05); };

const HIDE = '*,*::before,*::after{color:transparent!important;text-shadow:none!important;caret-color:transparent!important;-webkit-text-fill-color:transparent!important} svg{visibility:hidden!important}';

// Per element: scroll it to the middle of the viewport (the painting is FIXED, so only a
// viewport capture shows what really sits behind the words), read its box, repaint with every
// glyph transparent, clip-capture the box, sample its luminance.
async function measure(page) {
  const rows = [];
  const targets = TARGETS.map((t) => (t instanceof RegExp ? { __re: true, src: t.source } : t));
  for (let i = 0; i < targets.length; i += 1) {
    const f = await page.evaluate((t) => {
      const re = t && t.__re ? new RegExp(t.src) : null;
      const root = document.querySelector('main') || document.body;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n = null;
      while (walker.nextNode()) {
        const x = walker.currentNode; const s = x.textContent.trim();
        if (!s) continue;
        const r = x.parentElement.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (re ? re.test(s) : s.replace(/\s+/g, ' ') === t) { n = x; break; }
      }
      if (!n) return null;
      n.parentElement.scrollIntoView({ block: 'center' });
      const range = document.createRange(); range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      const cs = getComputedStyle(n.parentElement);
      return { label: re ? n.textContent.trim().slice(0, 40) : t, color: cs.color, size: parseFloat(cs.fontSize), weight: cs.fontWeight, box: { x: r.x, y: r.y, width: r.width, height: r.height } };
    }, targets[i]);
    if (!f) continue;
    await page.waitForTimeout(120);
    const style = await page.addStyleTag({ content: HIDE });
    const vw = page.viewportSize();
    const clip = { x: Math.max(0, f.box.x), y: Math.max(0, f.box.y), width: Math.max(1, Math.min(f.box.width, vw.width - Math.max(0, f.box.x))), height: Math.max(1, Math.min(f.box.height, vw.height - Math.max(0, f.box.y))) };
    const shot = await page.screenshot({ clip, animations: 'disabled' });
    await style.evaluate((s) => s.remove());
    const px = await page.evaluate(async (b64) => {
      const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data; const out = [];
      for (let k = 0; k < d.length; k += 4) out.push([d[k], d[k + 1], d[k + 2]]);
      return out;
    }, shot.toString('base64'));
    const fg = f.color.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
    const L = px.map(lum).sort((a, b) => a - b);
    const p = (q) => L[Math.min(L.length - 1, Math.floor(q * L.length))];
    const lf = lum(fg);
    const a = ratio(lf, p(0.05)), b = ratio(lf, p(0.95));
    rows.push({ label: f.label, color: f.color, size: f.size, weight: f.weight, min: Math.min(a, b).toFixed(2), max: Math.max(a, b).toFixed(2) });
  }
  return rows;
}

const ANCHORS = ['Create a settlement', '1 · Foundations', '2 · Institutions, services & trade', 'Ready to generate', 'Founding Worlds'];
async function viewportShots(page, file) {
  let k = 0;
  for (const a of ANCHORS) {
    const ok = await page.evaluate((t) => {
      const root = document.querySelector('main') || document.body;
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const x = w.currentNode;
        if (x.textContent.trim().replace(/\s+/g, ' ') === t && x.parentElement.getBoundingClientRect().height) {
          x.parentElement.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); return true;
        }
      }
      return false;
    }, a);
    if (!ok) continue;
    await page.waitForTimeout(200);
    k += 1;
    await page.screenshot({ path: `${file}-${k}.png` });
  }
}

async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(900);
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch(fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
  const rows = [];
  const vps = [
    ['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }],
    ['iphone13', { ...devices['iPhone 13'] }],
  ];
  for (const [vp, opts] of vps) {
    const states = [['anon-landing', null], ['chooser', null], ['basic', 'Basic Generate'], ['advanced', 'Advanced Generate']];
    for (const [state, mode] of states) {
      const ctx = await browser.newContext({ ...opts, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      const signed = state !== 'anon-landing';
      await page.addInitScript((a) => {
        try {
          localStorage.clear();
          if (a) localStorage.setItem('settlement_mock_auth', JSON.stringify(a));
        } catch { /* storage */ }
      }, signed ? SIGNED_IN : null);
      await page.goto(`${base}/create`);
      await settle(page);
      if (mode) { await page.getByRole('button', { name: mode }).first().click(); await settle(page); }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      await viewportShots(page, path.join(outDir, `${tag}-${vp}-${state}`));
      await page.evaluate(() => window.scrollTo(0, 0));
      for (const r of await measure(page)) rows.push({ vp, state, ...r });
      rows.push({ vp, state, label: '(horizontal overflow px)', min: overflow, max: overflow });
      await ctx.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(outDir, `${tag}-contrast.json`), JSON.stringify(rows, null, 1));
  for (const r of rows) console.log([r.vp, r.state, r.label, r.color || '', r.size || '', r.weight || '', r.min, r.max].join(' | '));
})();
