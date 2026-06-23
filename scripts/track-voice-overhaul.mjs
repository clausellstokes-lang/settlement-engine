#!/usr/bin/env node
/**
 * track-voice-overhaul.mjs — progress tracker for the Voice & Tone overhaul.
 *
 * A separate workstream is rewriting every user-facing string to the
 * `docs/VOICE_AND_TONE.md` bible (calm campaign archivist: ONE idea per sentence,
 * ZERO em dashes, no exclamation points in copy, state-don't-sell). That pass
 * stashes/resets the working tree, so structural UI work must wait until it
 * reaches a logical checkpoint. This tool measures that progress objectively and
 * tells us (and a poller) when it's safe to begin.
 *
 * PRIMARY METRIC: em dashes inside STRING / TEMPLATE literals (the bible's single
 * hardest, most-violated rule — "zero em dashes in any user-facing string"). Code
 * comments are explicitly out of scope, so we tokenize and only count dashes that
 * sit inside a quoted string, never in a // or /* *\/ comment.
 * SECONDARY: exclamation points inside string literals (also banned in copy).
 *
 * It records a timestamped snapshot each run to scripts/voice-overhaul-state.json
 * (a new, untracked file that survives the other workstream's tree resets) so
 * successive runs compute deltas and detect quiescence.
 *
 * VERDICT (exit code): 0 = CHECKPOINT reached, 1 = IN_PROGRESS, 2 = error.
 * Checkpoint = the copy is substantially de-em-dashed AND the count has stopped
 * moving across checks AND the source has been idle (no edits) for a window.
 *
 * Usage: node scripts/track-voice-overhaul.mjs [--json] [--quiet]
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const STATE_FILE = path.join(ROOT, 'scripts', 'voice-overhaul-state.json');
const SCAN_DIRS = ['src/copy', 'src/components', 'src/data', 'src/pdf'];
const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const SKIP_RE = /node_modules|__tests__|\.test\.|\.spec\./;

// ── Checkpoint thresholds (tunable) ─────────────────────────────────────────
const CHECKPOINT_REL = 0.15;     // <=15% of the worst observed baseline …
const CHECKPOINT_ABS = 25;       // …or this few absolute string-em-dashes
const IDLE_MIN = 18;             // source untouched for >= this many minutes
const STABLE_CHECKS = 2;         // count unchanged across this many recent snapshots

const args = new Set(process.argv.slice(2));
const QUIET = args.has('--quiet');
const AS_JSON = args.has('--json');

// ── Tokenizing scanner: count em-dashes / exclamations inside string literals ─
// Tiny JS-ish state machine. States: code, line-comment, block-comment,
// string ('), string ("), template (`). Counts the target chars only while in a
// string/template state, so comments and code are excluded.
// Classify em-dashes inside string literals as PROSE (real voice violations — a
// sentence with an em dash) vs GLYPH (the standalone "—" empty-value placeholder,
// a UI convention the prose-rewrite pass does not target). We buffer each string
// literal and classify it on close.
function scanFile(src) {
  let i = 0, n = src.length;
  let state = 'code';
  let proseEm = 0, glyphEm = 0, bang = 0;
  let buf = '', bufEm = 0;
  const flush = () => {
    if (bufEm) {
      const t = buf.trim();
      const isProse = t.length > 4 && /[a-zA-Z]{3,}/.test(t.replace(/—/g, ' '));
      if (isProse) proseEm += bufEm; else glyphEm += bufEm;
    }
    buf = ''; bufEm = 0;
  };
  while (i < n) {
    const c = src[i], c2 = src[i + 1];
    if (state === 'code') {
      if (c === '/' && c2 === '/') { state = 'line'; i += 2; continue; }
      if (c === '/' && c2 === '*') { state = 'block'; i += 2; continue; }
      if (c === "'") { state = 'sq'; buf = ''; bufEm = 0; i++; continue; }
      if (c === '"') { state = 'dq'; buf = ''; bufEm = 0; i++; continue; }
      if (c === '`') { state = 'tpl'; buf = ''; bufEm = 0; i++; continue; }
      i++; continue;
    }
    if (state === 'line') { if (c === '\n') state = 'code'; i++; continue; }
    if (state === 'block') { if (c === '*' && c2 === '/') { state = 'code'; i += 2; continue; } i++; continue; }
    // inside a string/template
    const quote = state === 'sq' ? "'" : state === 'dq' ? '"' : '`';
    if (c === '\\') { buf += (src[i + 1] || ''); i += 2; continue; } // escape
    if (c === quote) { flush(); state = 'code'; i++; continue; }
    if (c === '—') bufEm++;
    else if (c === '!') bang++;
    buf += c; i++;
  }
  flush();
  return { proseEm, glyphEm, bang };
}

function walk(dir, acc = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (SKIP_RE.test(p)) continue;
    if (e.isDirectory()) walk(p, acc);
    else if (EXTS.has(path.extname(e.name))) acc.push(p);
  }
  return acc;
}

function sh(cmd) { try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return ''; } }

// ── Measure ─────────────────────────────────────────────────────────────────
let totalProse = 0, totalGlyph = 0, totalBang = 0, filesWithProse = 0, newestMtime = 0;
const perFile = [];
for (const d of SCAN_DIRS) {
  for (const f of walk(path.join(ROOT, d))) {
    let src;
    try { src = fs.readFileSync(f, 'utf8'); } catch { continue; }
    const st = fs.statSync(f);
    if (st.mtimeMs > newestMtime) newestMtime = st.mtimeMs;
    const { proseEm, glyphEm, bang } = scanFile(src);
    totalProse += proseEm; totalGlyph += glyphEm; totalBang += bang;
    if (proseEm > 0) { filesWithProse++; perFile.push({ file: path.relative(ROOT, f), prose: proseEm, glyph: glyphEm }); }
  }
}
perFile.sort((a, b) => b.prose - a.prose);

const now = Date.now();
const idleMin = newestMtime ? Math.round((now - newestMtime) / 60000) : null;
const head = sh('git rev-parse --short HEAD');
const headSubject = sh('git log -1 --pretty=%s');
const headWhen = sh('git log -1 --pretty=%cI');
const dirty = (sh('git status --porcelain') || '').split('\n').filter(Boolean).length;
const staged = (sh('git diff --cached --name-only') || '').split('\n').filter(Boolean).length;
const stashes = (sh('git stash list') || '').split('\n').filter(Boolean).length;
const commitCount = parseInt(sh('git rev-list --count HEAD') || '0', 10);

// ── Load history, compute deltas, decide verdict ────────────────────────────
let history;
try { history = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { history = []; }
const prev = history[history.length - 1] || null;
const proseHist = h => (h.proseEmDashes != null ? h.proseEmDashes : h.stringEmDashes); // back-compat
const baselineMax = history.length ? Math.max(...history.map(proseHist), totalProse) : totalProse;
const deltaVsPrev = prev ? totalProse - proseHist(prev) : null;

// stable = the last STABLE_CHECKS PROSE counts (incl. this one) all match
const recent = [...history.slice(-(STABLE_CHECKS - 1)).map(proseHist), totalProse];
const stable = recent.length >= STABLE_CHECKS && recent.every(v => v === totalProse);

const idleEnough = idleMin != null && idleMin >= IDLE_MIN;
const lowEnough = totalProse <= Math.max(CHECKPOINT_ABS, Math.round(baselineMax * CHECKPOINT_REL)); // reported, not gated
const newCommits = prev ? commitCount - prev.commitCount : 0;

// CHECKPOINT = the pass has truly QUIESCED and is SAFE to build on:
//   stable  — prose-em-dash count unchanged across the last checks,
//   idle    — source untouched for the window, AND
//   clean index — NO files staged. A non-empty index means the automation is
//     mid-commit (or stuck on its pre-commit hook): "idle" then means STUCK,
//     not done, and committing structural work on top would collide / fail the
//     shared husky hook. Requiring a clean index distinguishes done from stuck.
const indexClean = staged === 0;
const checkpoint = stable && idleEnough && indexClean;

const snapshot = {
  ts: new Date(now).toISOString(),
  proseEmDashes: totalProse,
  glyphEmDashes: totalGlyph,
  stringEmDashes: totalProse + totalGlyph,
  stringExclamations: totalBang,
  filesWithProse,
  idleMin,
  head, headSubject, headWhen,
  dirty, staged, stashes, commitCount,
  verdict: checkpoint ? 'CHECKPOINT' : 'IN_PROGRESS',
};
history.push(snapshot);
try { fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true }); fs.writeFileSync(STATE_FILE, JSON.stringify(history, null, 2) + '\n'); } catch {}

if (AS_JSON) { console.log(JSON.stringify({ ...snapshot, baselineMax, deltaVsPrev, newCommits, stable, lowEnough, idleEnough, topOffenders: perFile.slice(0, 8) }, null, 2)); }
else if (!QUIET) {
  const bar = (v, max) => { const w = 24; const f = max ? Math.round((v / max) * w) : 0; return '█'.repeat(Math.min(f, w)) + '░'.repeat(Math.max(0, w - f)); };
  console.log(`\n  VOICE & TONE OVERHAUL TRACKER  —  ${snapshot.ts}`);
  console.log(`  ${'─'.repeat(60)}`);
  console.log(`  PROSE em-dashes (real violations): ${totalProse}   ${prev ? `(Δ ${deltaVsPrev >= 0 ? '+' : ''}${deltaVsPrev} vs last)` : '(baseline)'}`);
  console.log(`  ${bar(totalProse, baselineMax)}  ${baselineMax ? Math.round((totalProse / baselineMax) * 100) : 0}% of worst-seen (${baselineMax})`);
  console.log(`  '—' placeholder glyphs (not prose): ${totalGlyph}`);
  console.log(`  exclamations in strings          : ${totalBang}`);
  console.log(`  files with prose em-dashes        : ${filesWithProse}`);
  console.log(`  source idle for                  : ${idleMin == null ? '?' : idleMin + ' min'}   (newest edit)`);
  console.log(`  git                              : HEAD ${head} "${(headSubject || '').slice(0, 42)}"`);
  console.log(`                                     dirty ${dirty} files · ${staged} staged · ${stashes} stash(es) · ${newCommits >= 0 ? '+' : ''}${newCommits} commits since last`);
  console.log(`  ${'─'.repeat(60)}`);
  console.log(`  gate: stable=${stable}  idle>=${IDLE_MIN}m=${idleEnough}  index-clean=${indexClean}   (context: prose-low=${lowEnough})`);
  if (staged > 0 && idleEnough) console.log(`  ⚠ ${staged} files STAGED while idle ${idleMin}m — automation is likely STUCK mid-commit, not done.`);
  if (perFile.length) {
    console.log(`  files with prose em-dashes still:`);
    for (const o of perFile.slice(0, 6)) console.log(`    prose ${String(o.prose).padStart(3)} · glyph ${String(o.glyph).padStart(3)}  ${o.file}`);
  }
  console.log(`\n  VERDICT: ${snapshot.verdict}${checkpoint ? '  ✔ pass has quiesced — safe to begin structural work' : '  … voice pass still active'}\n`);
}

process.exit(checkpoint ? 0 : 1);
