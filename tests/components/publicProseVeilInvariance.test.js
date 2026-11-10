/**
 * THE PROJECTION SAYS NOTHING THE SANITIZER STRIPS (VEIL-FIX R2, the chair's ruling of 2026-11-10 on
 * the pre-deploy review's finding 2; 207's law: the hall-capture state is DM truth).
 *
 * The composer (publicProseCompose.js) ships the owner's PLAYER view as text at every save, and 210
 * passes the text through untouched; so a sentence drawn from what publicSafe.js :: publicVeilPass
 * strips (the capture state, a capture or corrupted tie, a hidden power, a veiled face's title)
 * would re-publish it. The audience-gated readers (the governance account, the defense desk's
 * criminal lens, the power desk) draw the player view from the record AFTER the strip.
 *
 * (i) THE INVARIANCE PIN, structural: on the twelve fixture towns (soak1k-0..11) and 120 soak towns
 *     (soak1k-12..131), composePublicProse(owner) deep-equals composePublicProse(the owner's record
 *     after the strip, with only `_seed` restored) for EVERY block — anything the projection says
 *     that depends on stripped data fails it.
 * (ii) THE REVIEW'S THREE SPECIMENS, by text (soak1k-15, soak1k-3, soak1k-113), and its second path
 *     (a veiled governing face's title) on a crafted record; the DM's own view keeps every sentence.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { publicVeiledRecordOf } from '../../src/domain/display/publicSafe.js';
import { governanceAccountRead } from '../../src/components/new/powerDeskRead.js';
import { defenseDeskRead } from '../../src/components/new/defenseDeskRead.js';
import { criminalStructureOf } from '../../src/components/new/deskHostArgs.js';
import { estrangedPowersOf } from '../../src/domain/display/governanceAccount.js';

const FIXTURES = Array.from({ length: 12 }, (_, i) => i);
const SOAK = Array.from({ length: 120 }, (_, i) => 12 + i);

/** @type {Map<number, any>} */
const towns = new Map();
const town = (i) => { if (!towns.has(i)) towns.set(i, birth(i).settlement); return towns.get(i); };
beforeAll(async () => { await ensureLaws(); }, 120_000);

/** The owner's record after publicVeilPass's strip, with only `_seed` restored. */
function stripped(owner) {
  const out = publicVeiledRecordOf(owner);
  out._seed = owner._seed;
  return out;
}

describe('(i) the invariance pin: the projection depends on nothing the sanitizer strips', () => {
  it('composePublicProse(owner) deep-equals composePublicProse(stripped owner) on every block, 12 fixtures + 120 soak towns', () => {
    const mismatches = [];
    let blocks = 0;
    for (const i of [...FIXTURES, ...SOAK]) {
      const owner = town(i);
      const a = composePublicProse(owner).blocks;
      const b = composePublicProse(stripped(owner)).blocks;
      for (const site of new Set([...Object.keys(a), ...Object.keys(b)])) {
        blocks += 1;
        if (JSON.stringify(a[site]) !== JSON.stringify(b[site])) mismatches.push(`soak1k-${i} ${site}`);
      }
    }
    expect(blocks, 'anchored: the corpus ships blocks').toBeGreaterThan(132 * 10);
    expect(mismatches).toEqual([]);
  }, 600_000);
});

describe("(ii) the review's specimens, by text (each anchor computed from the DM's own draw, never a literal corpus sentence)", () => {
  /** The DM view's sentences (the record itself, no audience gate). */
  const sentencesOf = (text) => String(text || '').split(/(?<=[.!?])\s+/).filter(Boolean);
  const dmCriminal = (owner) => defenseDeskRead(owner, { tier: owner.tier, crimStructure: criminalStructureOf(owner)?.key ?? null }).criminal;

  it('soak1k-15 (capture state corrupted): every DM sentence naming the power that bought the hall stays off the shipped paragraph', () => {
    const owner = town(15);
    expect(owner.powerStructure.criminalCaptureState).toBe('corrupted');
    const governing = owner.powerStructure.factions.find((f) => f.isGoverning)?.faction;
    const bought = estrangedPowersOf(owner, governing).filter((e) => e.tie === 'corrupted' || e.tie === 'capture').map((e) => e.name);
    expect(bought.length, 'anchored: the record holds a corrupted tie').toBeGreaterThan(0);
    const dm = sentencesOf(governanceAccountRead(owner, {}).text);
    const shipped = composePublicProse(owner).blocks['power:governance'].text;
    const naming = dm.filter((line) => bought.some((name) => line.includes(name)));
    expect(naming.length, 'anchored: the DM view names the buyer').toBeGreaterThan(0);
    expect(shipped.length).toBeGreaterThan(0);
    for (const line of naming) expect(shipped.includes(line), line).toBe(false);
    for (const name of bought) expect(shipped.includes(name), name).toBe(false);
    // what the player paragraph is drawn from carries no capture or corrupted tie at all
    expect(estrangedPowersOf(publicVeiledRecordOf(owner), governing).filter((e) => e.tie === 'corrupted' || e.tie === 'capture')).toEqual([]);
  });

  it("soak1k-3 (equilibrium) and soak1k-113 (none): the criminal lens ships no capture sentence, though the DM view draws one (even 'none' reveals the state)", () => {
    for (const [i, state] of [[3, 'equilibrium'], [113, 'none']]) {
      const owner = town(i);
      expect(owner.powerStructure.criminalCaptureState, `soak1k-${i}`).toBe(state);
      const dmLine = dmCriminal(owner).capture?.sentence;
      expect(typeof dmLine === 'string' && dmLine.length > 0, `soak1k-${i}: anchored, the DM view draws the capture sentence`).toBe(true);
      const shipped = composePublicProse(owner).blocks['defense:criminal'];
      expect(typeof shipped.structure?.sentence === 'string' && shipped.structure.sentence.length > 0, `soak1k-${i}`).toBe(true);
      expect(shipped.capture ?? null, `soak1k-${i}`).toBeNull();
      expect(JSON.stringify(composePublicProse(owner).blocks).includes(dmLine), `soak1k-${i}`).toBe(false);
    }
  });

  it("the second path: a veiled governing face's title and role never reach the shipped paragraph; the DM view keeps them", () => {
    const owner = structuredClone(town(15));
    const governing = owner.powerStructure.factions.find((f) => f.isGoverning)?.faction;
    const dmBefore = governanceAccountRead(owner, {}).text;
    const face = owner.npcs.find((n) => n.name && dmBefore.startsWith(`${n.name}, `));
    expect(face, 'anchored: the DM paragraph opens on the seat-holder').toBeTruthy();
    const role = face.role;
    expect(dmBefore).toContain(`${face.name}, ${role}`);
    face.institution = { ...(face.institution || {}), kind: 'power', key: face.institution?.key || governing, veiled: true };
    const shipped = composePublicProse(owner).blocks['power:governance'].text;
    expect(shipped).toContain(face.name);
    expect(shipped.includes(role)).toBe(false);
    expect(governanceAccountRead(owner, {}).text).toContain(`${face.name}, ${role}`);
  });
});
