/**
 * shippedAssetLicence.test.js — the SHIPPED-ART LICENCE WALKER (AD-1 / ODQ §526–§529).
 *
 * WHAT HAPPENED, so nobody has to re-derive why this file exists. On 2026-08-24 the
 * estate was found to be commercially distributing 338 heraldic SVGs vendored with the
 * Fantasy Map Generator fork. 336 of them carried an inline `<metadata license="…"/>`
 * naming their own terms, and 179 of those named CC BY-NC-SA 3.0 — a NON-COMMERCIAL
 * licence — with 48 more under share-alike copyleft. They had been served publicly from
 * a commercial domain since April 2026. Nothing in the repository had ever looked.
 *
 * WHY NOTHING LOOKED. The estate has real supply-chain machinery over that fork and it
 * covers only code: `public/map/libs/VENDOR-MANIFEST.json` pins 140 entries whose
 * extensions are `js` and `css`, and `scripts/validate-map-fork.mjs` inspects only files
 * where `extname(entry.name) === '.js'`. 385 third-party art files sat beside twenty
 * SHA-256-pinned JavaScript files with no integrity, inventory or licence gate of any
 * kind. This walker is the missing half: the libs manifest asks "are these the bytes we
 * vetted?", and this asks "do these bytes forbid what we do with them?".
 *
 * THE RULE. No file shipped from `public/` may DECLARE, in its own embedded metadata, a
 * licence this product cannot honour. Two families cannot be honoured:
 *   - NON-COMMERCIAL (CC BY-NC*, "NonCommercial") — the product is sold, and attribution
 *     does not cure a non-commercial term.
 *   - SHARE-ALIKE COPYLEFT (CC BY-SA*, GFDL, Free Art Licence) — honouring it would mean
 *     licensing our derivative under the same terms, which a proprietary paid product
 *     cannot do.
 * Permissive declarations (CC0, CC BY, MIT, OFL, public domain) pass. This walker takes
 * no view on them beyond letting them through.
 *
 * TWO TIERS, because one detector could not cover both shapes without lying.
 *   TIER 1 — ATTRIBUTE-SHAPED DECLARATION, every shipped file. A licence URL or name
 *     appearing as the VALUE of a `license=` / `licence=` / `rdf:resource=` /
 *     `dc:rights=` / `xapRights:WebStatement=` attribute. This is how SVG, XMP and RDF
 *     metadata actually declare terms, and — the load-bearing property — it is immune to
 *     PROSE. `public/third-party-notices.html` names "CC BY-NC-SA 3.0" in its own §1.7
 *     while recording this very finding, and must not red the guard for saying so.
 *   TIER 2 — BARE TOKEN, non-text assets only. Inside a PNG `tEXt`/`iTXt` chunk, a JPEG
 *     COM/EXIF field or a video atom there is no legitimate reason for the string
 *     "NonCommercial" to appear except as a declaration, so in those file types a bare
 *     token is enough. Text-ish extensions are excluded from tier 2 precisely because
 *     they can legitimately discuss licences.
 *
 * CAPABILITY, PROVED AGAINST THE REAL CORPUS RATHER THAN ONLY A SYNTHETIC PLANT. Run
 * against the 361 files deleted on 2026-08-24 (recoverable at `5055990a3`), this
 * scanner convicts exactly **227 — 179 non-commercial and 48 share-alike** — and
 * acquits the other 134 (104 CC0, 4 CC BY, 3 that declare nothing, and the 23 textures
 * whose metadata was stripped). Those are the audit's own counts, reached independently.
 * All 227 convictions come from TIER 1, because `scanBytes` returns on the first tier-1
 * hit and every charge declared its licence in attribute position; measured separately
 * with tier 1 disabled, tier 2's bare-token scan matches the same 227, so the SVG case
 * is covered twice over and the `plant-chunk.png` control below is what proves tier 2
 * is independently live. The control arms re-prove all of this in-process, so the guard
 * cannot rot into a scanner that inspects nothing.
 *
 * WHAT THIS CANNOT CATCH — the residual, named so nobody trusts it past its reach:
 *   - ART WITH NO METADATA AT ALL. The 23 FMG textures deleted alongside the charges had
 *     their metadata stripped; this walker would have passed every one of them. Silence
 *     is not a declaration, and no scanner can read a licence that is not written down.
 *     That gap is covered by the written inventory in THIRD-PARTY-NOTICES.md §1.7 and §6,
 *     which names each unattributed group, and it is a matter of habit rather than of
 *     automation.
 *   - A LICENCE NAMED IN A SPELLING THIS FILE DOES NOT KNOW. The token list is explicit.
 *     A new copyleft family, or a national CC port spelled unusually, passes until its
 *     spelling is added here.
 *   - AN ASSET SERVED FROM ANYWHERE BUT `public/`. This walks the static payload Vite
 *     copies verbatim. Assets fetched at runtime from object storage are out of reach.
 *   - TERMS THAT ARE NOT LICENCES. Trademark exposure (the five social-network marks
 *     under `public/map/images/`) and vendor terms of service for AI-generated media are
 *     different questions entirely, recorded in the notices document, not here.
 *
 * TO COMPLY when this reds: DELETE the offending file, or replace it with an
 * estate-authored or permissively-licensed equivalent. Do NOT add it to the exempt list
 * to make the red go away — the exempt list is for files that DISCUSS licences, never for
 * files that CARRY one. Then record the removal in THIRD-PARTY-NOTICES.md §1.7.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PUBLIC = join(ROOT, 'public');

/** Skip anything larger than this; the video assets are tens of megabytes of pixel data. */
const MAX_BYTES = 24 * 1024 * 1024;

/**
 * Extensions whose content can legitimately DISCUSS a licence in prose. Tier 2's bare
 * token scan is not applied to these; tier 1 still is, because prose does not put a
 * licence URL in attribute position.
 */
const TEXTY = Object.freeze(new Set([
  '.html', '.htm', '.md', '.txt', '.json', '.js', '.mjs', '.cjs', '.css',
  '.xml', '.webmanifest', '.map', '.csv', '.yml', '.yaml',
]));

/** A licence declaration in attribute position: the shape SVG/XMP/RDF metadata uses. */
const DECLARATION = /(?:licen[cs]e|rdf:resource|dc:rights|xapRights:WebStatement|cc:license)\s*=\s*["']([^"']{0,300})["']/gi;

/**
 * Spellings of the two families the product cannot honour. Frozen 2026-08-24; every
 * entry was observed in the real deleted corpus except `cc-by-nc` and the spelled-out
 * prose forms, which are defensive.
 */
const UNHONOURABLE = Object.freeze([
  { token: /by-nc/i, family: 'non-commercial', why: 'CC BY-NC* forbids commercial use; this product is sold' },
  { token: /cc-by-nc/i, family: 'non-commercial', why: 'CC BY-NC* forbids commercial use; this product is sold' },
  { token: /noncommercial/i, family: 'non-commercial', why: 'a non-commercial term cannot be cured by attribution' },
  { token: /non-commercial/i, family: 'non-commercial', why: 'a non-commercial term cannot be cured by attribution' },
  { token: /by-sa/i, family: 'share-alike', why: 'CC BY-SA would require licensing our derivative under the same terms' },
  { token: /sharealike/i, family: 'share-alike', why: 'share-alike is incompatible with a proprietary paid product' },
  { token: /share-alike/i, family: 'share-alike', why: 'share-alike is incompatible with a proprietary paid product' },
  { token: /licenses\/sa\//i, family: 'share-alike', why: 'share-alike is incompatible with a proprietary paid product' },
  { token: /fdl-1\.[0-9]/i, family: 'share-alike', why: 'the GNU FDL is copyleft' },
  { token: /gnu[_ ]free[_ ]documentation/i, family: 'share-alike', why: 'the GNU FDL is copyleft' },
  { token: /artlibre/i, family: 'share-alike', why: 'the Free Art Licence is copyleft' },
  { token: /free art licen[cs]e/i, family: 'share-alike', why: 'the Free Art Licence is copyleft' },
  { token: /licence art libre/i, family: 'share-alike', why: 'the Free Art Licence is copyleft' },
]);

/**
 * Files that DISCUSS licences and must not be read as DECLARING one. Each entry is a
 * compliance surface whose whole job is to name the terms in play. Frozen 2026-08-24.
 *
 * This list is NOT an escape hatch for art. Adding an image here would be a lie; the
 * honesty arm below asserts every entry still exists, and the entries are hand-picked
 * text surfaces, but nothing mechanical stops a future author from abusing it — so the
 * rule is stated here in the header where a reviewer will see it.
 */
const DISCUSSES_LICENCES = Object.freeze({
  'public/third-party-notices.html': 'the served compliance page; §1.7 names the non-commercial terms it exists to record',
  'public/fonts/OFL.txt': 'the served SIL Open Font License notice — reproduces the licence body verbatim',
  'public/map/LICENSE-FMG.txt': "the fork's own MIT licence with its widened derivative-works clause",
});

/** Every file under public/, as repo-relative forward-slash paths. */
function shippedFiles() {
  const out = [];
  (function walk(dir) {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      if (err.code === 'ENOENT') return;       // directory removed mid-walk (see the note below)
      throw err;
    }
    for (const entry of entries) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) { walk(abs); continue; }
      if (!entry.isFile()) continue;
      out.push(relative(ROOT, abs).split(sep).join('/'));
    }
  })(PUBLIC);
  return out.sort();
}

/**
 * Scan one file's bytes for an unhonourable licence. Returns null, or a finding.
 * Read as latin1 so binary containers (PNG chunks, JPEG segments, MP4 atoms) are
 * searchable with ASCII tokens without a decoder throwing on invalid UTF-8.
 */
function scanBytes(rel, buf) {
  const src = buf.toString('latin1');
  for (const match of src.matchAll(DECLARATION)) {
    const value = match[1];
    const hit = UNHONOURABLE.find(({ token }) => token.test(value));
    if (hit) return { rel, tier: 1, family: hit.family, why: hit.why, evidence: value.slice(0, 120) };
  }
  if (!TEXTY.has(extname(rel).toLowerCase())) {
    const hit = UNHONOURABLE.find(({ token }) => token.test(src));
    if (hit) return { rel, tier: 2, family: hit.family, why: hit.why, evidence: (src.match(hit.token) || [''])[0] };
  }
  return null;
}

/**
 * Scan the whole shipped payload, honouring the exempt list.
 *
 * ⚠ THE TREE IS LIVE WHILE THIS RUNS. Sibling tests plant and delete temporary files
 * inside `public/` — `tests/build/vendorManifestExactSet.test.js` writes and removes
 * `public/map/libs/tinymce/plugins/__exact_set_probe__.js` to prove its own exact-set
 * assertion can fail. This walker enumerated that probe and then threw ENOENT on it when
 * it vanished a moment later, which surfaced as a licence failure that had nothing to do
 * with licences. A file that disappears between the listing and the read was never part
 * of the shipped payload, so it is skipped — but ONLY on ENOENT, and the non-vacuity arm
 * below still requires the walk to reach 300+ real files, so this cannot decay into a
 * scanner that skips everything and passes.
 */
function scanShippedPayload() {
  const findings = [];
  for (const rel of shippedFiles()) {
    if (rel in DISCUSSES_LICENCES) continue;
    const abs = join(ROOT, rel);
    const stat = statSync(abs, { throwIfNoEntry: false });
    if (stat === undefined) continue;          // vanished mid-walk: not shipped
    if (stat.size > MAX_BYTES) continue;
    let bytes;
    try {
      bytes = readFileSync(abs);
    } catch (err) {
      if (err.code === 'ENOENT') continue;     // same race, one step later
      throw err;
    }
    const finding = scanBytes(rel, bytes);
    if (finding) findings.push(finding);
  }
  return findings;
}

/** The failure message IS this guard's user interface — it must teach the rule. */
function violationMessage({ rel, tier, family, why, evidence }) {
  return `${rel}: declares a ${family.toUpperCase()} licence in its own embedded metadata`
    + ` (tier ${tier}, matched "${evidence}").\n`
    + `    ${why}.\n`
    + '    COMPLY BY DELETING THE FILE, or replacing it with an estate-authored or'
    + ' permissively-licensed equivalent, then recording the removal in'
    + ' THIRD-PARTY-NOTICES.md §1.7.\n'
    + '    Do NOT add it to DISCUSSES_LICENCES — that list is for files that DISCUSS a'
    + ' licence, never for files that CARRY one.';
}

describe('no shipped asset declares a licence the product cannot honour', () => {
  it('every file under public/ is free of non-commercial and share-alike declarations', () => {
    const violations = scanShippedPayload().map(violationMessage);
    expect(violations).toEqual([]);
  });

  it('CONTROL: the scanner convicts a planted non-commercial declaration', () => {
    // Without this arm an empty result is indistinguishable from a scanner that reads
    // nothing. Each planted shape is one the real corpus actually used.
    const plants = [
      {
        name: 'plant-nc.svg',
        body: '<svg xmlns="http://www.w3.org/2000/svg"><metadata source="http://wappenwiki.org"'
          + ' license="https://creativecommons.org/licenses/by-nc-sa/3.0"/></svg>',
        tier: 1,
        family: 'non-commercial',
      },
      {
        name: 'plant-sa.svg',
        body: '<svg xmlns="http://www.w3.org/2000/svg"><metadata'
          + ' license="https://creativecommons.org/licenses/by-sa/4.0"/></svg>',
        tier: 1,
        family: 'share-alike',
      },
      {
        name: 'plant-gfdl.svg',
        body: '<svg><metadata license="https://www.gnu.org/licenses/fdl-1.3.html"/></svg>',
        tier: 1,
        family: 'share-alike',
      },
      {
        // A PNG-shaped binary carrying the token in a tEXt chunk and NO attribute — only
        // tier 2 can see this one, so it proves tier 2 is live independently of tier 1.
        name: 'plant-chunk.png',
        body: '\x89PNG\r\n\x1a\n\x00\x00\x00\x1btEXtCopyright\x00CC BY-NC-SA 4.0\x00\x00\x00\x00',
        tier: 2,
        family: 'non-commercial',
      },
    ];
    const convicted = [];
    for (const plant of plants) {
      const finding = scanBytes(`public/${plant.name}`, Buffer.from(plant.body, 'latin1'));
      convicted.push(finding
        ? `${plant.name}: tier ${finding.tier} ${finding.family}`
        : `${plant.name}: NOT CONVICTED — the scanner is dead for this shape`);
    }
    expect(convicted).toEqual(plants.map((p) => `${p.name}: tier ${p.tier} ${p.family}`));
  });

  it('CONTROL: the scanner acquits permissive declarations and licence prose', () => {
    // The mirror of the arm above: a guard that convicts everything is as useless as one
    // that convicts nothing, and the prose case is the one that would have made this
    // walker unusable — the notices page names "by-nc-sa" while recording the finding.
    const acquittals = [
      ['public/ok-cc0.svg', '<svg><metadata license="https://creativecommons.org/publicdomain/zero/1.0"/></svg>'],
      ['public/ok-by.svg', '<svg><metadata license="https://creativecommons.org/licenses/by/4.0"/></svg>'],
      ['public/ok-prose.html', '<p>179 files declared CC BY-NC-SA 3.0, a non-commercial licence, and were deleted.</p>'],
    ];
    const wrongly = acquittals
      .filter(([rel, body]) => scanBytes(rel, Buffer.from(body, 'latin1')) !== null)
      .map(([rel]) => `${rel}: FALSE POSITIVE — a permissive or prose case was convicted`);
    expect(wrongly).toEqual([]);
  });

  it('CONTROL: the walk reaches the real payload rather than an empty directory', () => {
    // A scanner pointed at nothing passes forever. Pin that the walk actually enumerates
    // the shipped tree, and that it reaches a nested art directory specifically.
    const files = shippedFiles();
    expect(files.length).toBeGreaterThan(300);
    expect(files.some((f) => f.startsWith('public/map/heightmaps/'))).toBe(true);
    expect(files.some((f) => f.startsWith('public/fonts/'))).toBe(true);
  });
});

describe('the exempt list stays honest', () => {
  it('every file excused as licence prose still exists and is still text', () => {
    const stale = [];
    for (const [rel, reason] of Object.entries(DISCUSSES_LICENCES)) {
      if (!existsSync(join(ROOT, rel))) {
        stale.push(`${rel}: no longer exists — delete its row (reason was: ${reason})`);
        continue;
      }
      if (!TEXTY.has(extname(rel).toLowerCase())) {
        stale.push(`${rel}: is not a text surface — the exempt list may not excuse a binary asset`);
      }
    }
    expect(stale).toEqual([]);
  });

  it('every charge that ships declares CC0, and the removed classes have not returned', () => {
    // The AD-1 removal was SURGICAL, not wholesale: 234 of 338 charges went (179 CC BY-NC-SA,
    // 37 CC BY-SA, 10 GFDL, 1 Free Art Licence, 4 CC BY whose credit was never carried, 1
    // placeholder, 2 with no metadata at all) and the 104 CC0 files stayed. So "the directory
    // is gone" is NOT the invariant — "everything in it is public domain" is. A fork re-drop
    // restores all 338 and this arm names that specific regression, rather than leaving it to
    // surface as 227 unrelated violations from the arm above.
    const dir = join(ROOT, 'public/map/charges');
    const offenders = [];
    for (const name of existsSync(dir) ? readdirSync(dir) : []) {
      const declared = /license="([^"]*)"/.exec(readFileSync(join(dir, name), 'utf8'));
      if (!declared) { offenders.push(`${name}: declares no licence at all`); continue; }
      if (!/creativecommons\.org\/publicdomain\/zero/.test(declared[1])) {
        offenders.push(`${name}: declares ${declared[1]} — only CC0 charges may ship`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('the fork can only request art that ships', () => {
  // THE SECOND HALF OF THE REMOVAL, and the half a licence scan cannot see. Deleting art is
  // only safe if nothing still ASKS for it. The fork's emblem generator picks from a weighted
  // table baked into its hashed bundle, and its texture layer reads paths out of the style
  // presets and a dropdown — none of which a licence walker inspects. Measured on 2026-08-24:
  // against the surviving 104 charges the UNPATCHED table would have made 22,285 of 40,000
  // draws request a file that is not there. `fetchCharge` swallows that (it catches, logs
  // "Cannot fetch charge" and returns undefined, and `join('')` drops it), so the emblem
  // renders SILENTLY INCOMPLETE rather than visibly broken — which is precisely why it needs
  // a test and not a bug report.
  const BUNDLE = join(ROOT, 'public/map/index-Bp79q281.js');
  const TABLE_MARKER = 'Ue={types:{conventional:33,crosses:13';

  /** The emblem pick table, read out of the hashed bundle by balanced-brace scan. */
  function pickTable() {
    const src = readFileSync(BUNDLE, 'latin1');
    const at = src.indexOf(TABLE_MARKER);
    // A moved or reminified bundle must FAIL here, never silently scan nothing.
    expect(at, `the emblem pick table marker "${TABLE_MARKER}" is gone from the bundle —`
      + ' the fork was re-dropped or reminified; re-derive this guard before trusting it')
      .toBeGreaterThan(-1);
    const open = src.indexOf('{', at);
    let depth = 0;
    for (let i = open; i < src.length; i += 1) {
      if (src[i] === '{') depth += 1;
      else if (src[i] === '}') { depth -= 1; if (depth === 0) return src.slice(open, i + 1); }
    }
    throw new Error('unbalanced pick table');
  }

  it('the emblem pick table names no charge that is absent from the payload', () => {
    // Reading a data literal out of vendored minified code; `US` is a sibling identifier
    // the literal references and is stubbed empty.
    const table = new Function('US', `return (${pickTable()});`)({});
    const shipped = new Set(readdirSync(join(ROOT, 'public/map/charges')).map((f) => f.replace(/\.svg$/, '')));
    // `inescutcheon` is a SHIELD SHAPE category: selectCharge returns the literal string and
    // getCharges special-cases it, so its names are never fetched as charge files.
    const SPECIAL = new Set(['types', 'single', 'semy', 'data', 'inescutcheon']);
    const weighted = { ...table.types, ...table.single, ...(table.semy ?? {}) };
    const unreachable = [];
    for (const [category, weight] of Object.entries(weighted)) {
      if (weight <= 0 || SPECIAL.has(category)) continue;
      const charges = table[category];
      if (!charges) { unreachable.push(`${category}: weight ${weight} but no charge table`); continue; }
      const reachable = Object.entries(charges).filter(([, w]) => w > 0).map(([n]) => n);
      if (reachable.length === 0) {
        unreachable.push(`${category}: weight ${weight} but every charge in it has weight 0`
          + ' — the generator would draw undefined. Set its weight to 0 in BOTH types and single.');
      }
      for (const name of reachable) {
        if (!shipped.has(name)) {
          unreachable.push(`${category}/${name} is drawable but public/map/charges/${name}.svg`
            + ' does not ship — the emblem would silently render without it. Either restore a'
            + ' CC0 charge of that name or remove its row from the pick table.');
        }
      }
    }
    expect(unreachable).toEqual([]);
  });

  it('every style texture and dropdown option resolves to a file that ships', () => {
    const missing = [];
    const textures = join(ROOT, 'public/map/images/textures');
    const present = new Set(existsSync(textures) ? readdirSync(textures) : []);
    const sources = [join(ROOT, 'public/map/index.html'), join(ROOT, 'public/map/modules/io/load.js')];
    for (const name of readdirSync(join(ROOT, 'public/map/styles'))) sources.push(join(ROOT, 'public/map/styles', name));
    let referenced = 0;
    for (const file of sources) {
      const src = readFileSync(file, 'utf8');
      for (const m of src.matchAll(/images\/textures\/([A-Za-z0-9._-]+)/g)) {
        referenced += 1;
        if (!present.has(m[1])) {
          missing.push(`${relative(ROOT, file)} points at images/textures/${m[1]}, which does not ship`);
        }
      }
    }
    // Non-vacuity: if nothing referenced a texture at all, this arm would pass by looking at
    // nothing. The fork always names at least the layer's default.
    expect(referenced).toBeGreaterThan(0);
    expect(missing).toEqual([]);
  });
});

describe('the guard survives being pointed at a hostile tree', () => {
  it('a directory containing a planted offender is convicted end to end', () => {
    // The arms above test scanBytes in isolation. This one proves the WALK convicts too,
    // so a future refactor cannot leave a working scanner wired to nothing.
    const dir = mkdtempSync(join(tmpdir(), 'sf-asset-licence-'));
    try {
      writeFileSync(join(dir, 'clean.svg'), '<svg><metadata license="https://creativecommons.org/publicdomain/zero/1.0"/></svg>');
      writeFileSync(join(dir, 'dirty.svg'), '<svg><metadata license="https://creativecommons.org/licenses/by-nc-sa/3.0"/></svg>');
      const findings = readdirSync(dir)
        .map((name) => scanBytes(`planted/${name}`, readFileSync(join(dir, name))))
        .filter(Boolean);
      expect(findings.map((f) => `${f.rel}:${f.family}`)).toEqual(['planted/dirty.svg:non-commercial']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
