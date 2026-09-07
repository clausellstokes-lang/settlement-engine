/**
 * reasonHeadlineRegister.test.js — the immersion register guards for the
 * post-CI-5 waves (content-immersion-r2-5 + r2-7).
 *
 * r2-5: reason pills reach the Chronicle in the FICTION register. Waves that
 * landed after CI-5 authored reasons in ENGINE voice on the same pills — raw
 * causeClass tokens ('Cause underfunded resolved…'), tick counts ('…held 3
 * ticks'), and raw npc_N ids ('npc_7 is removed'). This source lint keeps the
 * corruption-lifecycle + party-impact reason arrays in the reader's register.
 *
 * r2-7: factionCompetition's generic headline builder jammed a noun after 'may'
 * ('X may exhaustion'). The per-candidateType verb-phrase map now yields
 * grammatical hedged + applied twins; the guard pins full coverage.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { FACTION_VERB_PHRASES } from '../../src/domain/worldPulse/factionCompetition.js';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(REPO, rel), 'utf8');

/** Extract every `reasons: [ ... ]` array-literal body (may span lines). */
function reasonLiterals(src) {
  const out = [];
  const rx = /reasons:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = rx.exec(src)) !== null) out.push(m[1]);
  return out;
}

// ── r2-5: the reasons register lint ─────────────────────────────────────────

describe('reasons register — the corruption-lifecycle + party-impact reason pills stay in-fiction', () => {
  const FILES = ['src/domain/worldPulse/causeLifecycle.js', 'src/domain/worldPulse/partyImpact.js'];

  it('no reason literal carries a raw causeClass token ("Cause ${...}")', () => {
    const offenders = [];
    for (const f of FILES) {
      for (const lit of reasonLiterals(read(f))) {
        if (/Cause\s+\$\{/.test(lit)) offenders.push(`${f}: ${lit.trim().slice(0, 80)}`);
      }
    }
    expect(offenders, 'use causeLabel(...) — never a raw "Cause ${token}"').toEqual([]);
  });

  it('no reason literal carries a tick count ("… N ticks")', () => {
    const offenders = [];
    for (const f of FILES) {
      for (const lit of reasonLiterals(read(f))) {
        if (/\bticks\b/.test(lit)) offenders.push(`${f}: ${lit.trim().slice(0, 80)}`);
      }
    }
    expect(offenders, 'drop the mechanical tick-count clause from the visible reason').toEqual([]);
  });

  it('no reason literal carries a raw npc id ("npc_N" or a raw ${...npcId})', () => {
    const offenders = [];
    for (const f of FILES) {
      for (const lit of reasonLiterals(read(f))) {
        if (/\bnpc_\d/.test(lit) || /\$\{[^}]*\.npcId[^}]*\}/.test(lit)) {
          offenders.push(`${f}: ${lit.trim().slice(0, 80)}`);
        }
      }
    }
    expect(offenders, 'resolve the NPC display name — never a raw npc_N id in the pill').toEqual([]);
  });
});

// ── r2-7: the faction headline verb-phrase coverage guard ───────────────────

describe('faction headline register — every faction candidateType has a grammatical verb phrase', () => {
  const src = read('src/domain/worldPulse/factionCompetition.js');
  // Every faction candidateType literal that appears on a `candidateType` line.
  const candidateTypes = [...new Set(
    src.split('\n')
      .filter((l) => l.includes('candidateType'))
      .flatMap((l) => l.match(/faction_[a-z_]+/g) || []),
  )];

  it('the source actually declares faction candidateTypes (guard non-vacuity)', () => {
    expect(candidateTypes.length).toBeGreaterThanOrEqual(5);
  });

  it('every faction candidateType is covered by FACTION_VERB_PHRASES', () => {
    const missing = candidateTypes.filter((t) => !FACTION_VERB_PHRASES[t]);
    expect(missing, `faction candidateType(s) with no verb phrase (add to FACTION_VERB_PHRASES):\n  ${missing.join('\n  ')}`).toEqual([]);
  });

  it('every verb phrase is grammatical (a hedged/applied twin, never a bare noun after "may")', () => {
    for (const [type, vp] of Object.entries(FACTION_VERB_PHRASES)) {
      expect(vp.may.length, `${type} .may empty`).toBeGreaterThan(0);
      expect(vp.did.length, `${type} .did empty`).toBeGreaterThan(0);
      // hedged and applied differ (the de-hedger twin).
      expect(vp.did, `${type} .did must differ from .may`).not.toBe(vp.may);
      // Not the old mechanical form (the bare candidateType noun).
      const bareNoun = type.replace(/^faction_/, '').replace(/_/g, ' ');
      expect(vp.may, `${type} .may is the bare mechanical noun`).not.toBe(bareNoun);
    }
  });

  it('the generic "may ${candidateType…}" builder is gone from the source', () => {
    expect(src).not.toMatch(/may \$\{candidateType/);
  });
});
