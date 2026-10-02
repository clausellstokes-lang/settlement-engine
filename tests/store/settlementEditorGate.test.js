/**
 * settlementEditorGate.test.js — THE SETTLEMENT EDITOR'S TIER GATE, AND THE DARK RULE.
 *
 * ⛔⛔ THE DOOR IS DARK AND THIS FILE IS WHERE THAT IS MEASURED. `canEditSettlement()` is
 * the one predicate in the auth slice that INVERTS the house idiom: every other paid gate
 * opens for staff FIRST and then reads the tier, while this one reads the tier AND requires
 * a staff role, so it is false for anonymous, false for free, and false for every paying
 * Cartographer. Design §20.4 is the reason — "⛔ VISIBILITY IS THE OWNER'S" — and
 * `resolveTier` is the mechanism: it writes a staff account into the store as tier
 * 'premium', so the TIER GATE ALONE would open the editor to every subscriber the day it
 * landed. Both conjuncts are therefore load-bearing, and the arms below assert each one by
 * name rather than trusting the comment beside them.
 *
 * ⭐ THE SECOND CONJUNCT IS THE ONE LINE THE OWNER DELETES when he opens the door, and that
 * deletion is ONE OWNER-SIGNED ACT with two inseparable companions (the entitlement-ladder
 * row and the flow-b-auth-credits-ai browser spec). Nothing in this file, and nothing in any
 * packet, flips the gate.
 *
 * ⛔ `isStaffRole`, NEVER `staffUnlocksPaidFeatures`: the second is governed by the
 * STAFF_UNLOCK_ALL_PAID kill switch, and revoking a testing convenience must not take the
 * unbuilt editor away from the people building it. Arm 5 measures that difference with the
 * switch stubbed false rather than asserting it in prose.
 *
 * ⛔ THE PRODUCTION ABSENCE OF THE PREVIEW PERSONA IS NOT RE-PROVED HERE.
 * tests/build/previewPersonaAbsent.test.js already proves the mechanism eliminated from the
 * real dist, and tests/store/previewPersona.test.js proves it inert with DEV false. Arm 6
 * proves only that the persona's role reaches THIS predicate through the store's own
 * writers.
 *
 * SHAPE NOTE (the lighting census): ONE literal `describe`, EIGHT straight-line literal
 * `it`s, no loop, no `.each`, no nesting, no hook, and `describe`/`it`/`test` bound exactly
 * once in this module. Absence is asserted with `toBe(false)`, never with a bare
 * `not.toContain` / `not.toMatch` / `not.toHaveProperty`, so the negative-anchor walker that
 * governs `tests/store` needs no marker and no baseline row here.
 */
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TIER_GATE, createAuthSlice } from '../../src/store/authSlice.js';
import { TIER_FACTS } from '../../src/config/tierFacts.js';
import { STAFF_ROLES } from '../../src/lib/staffEntitlements.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const AUTH_SLICE_PATH = 'src/store/authSlice.js';
const TIER_FACTS_PATH = 'src/config/tierFacts.js';

/** The raw paid-tier comparison the premium-gate census convicts (its own matcher, :80). */
const PREMIUM_COMPARISON = /(?:===|!==)\s*['"](?:premium|founder)['"]/;

/**
 * A minimal store standing in for the real one, exactly as
 * tests/store/staffUnlockEntitlements.test.js:46 builds it: the permission queries only ever
 * read `get().auth`, so this exercises the SHIPPED predicate rather than a copy of it, and
 * the account is seated through the slice's own writer so `resolveTier` really runs.
 *
 * @param {{ tier?: unknown, role?: unknown }} seat
 */
function sliceFor({ tier = 'anon', role = 'user' } = {}) {
  /** @type {any} */
  let state = {};
  const get = () => state;
  const set = (fn) => { fn(state); };
  state = createAuthSlice(set, get);
  state.setAuth({ id: 'u1' }, { access_token: 't' }, tier, role, null);
  state.canAfford = () => false;
  return state;
}

/**
 * The same seat, built from a FRESHLY IMPORTED module graph so an env stub or a module mock
 * taken in an arm is the one the slice reads.
 *
 * @param {any} factory the `createAuthSlice` of the fresh graph
 * @param {{ tier?: unknown, role?: unknown }} [seat]
 */
function sliceFrom(factory, seat) {
  /** @type {any} */
  let state = {};
  const get = () => state;
  const set = (fn) => { fn(state); };
  state = factory(set, get);
  if (seat) state.setAuth({ id: 'u1' }, { access_token: 't' }, seat.tier, seat.role, null);
  state.canAfford = () => false;
  return state;
}

/** Read one repository file as text. */
const readSource = (rel) => readFileSync(join(ROOT, rel), 'utf8');

describe('the settlement editor gate is DARK: the tier field, the staff conjunct, and the line the owner deletes', () => {
  it('the gate and the facts carry settlementEditor, and neither table spells editMode', () => {
    // THE VALUES, BY NAME, ON BOTH TABLES. The contract test pins the two halves equal for
    // all three tiers; this arm pins WHICH values that equality is an equality of.
    expect(TIER_GATE.anon.settlementEditor).toBe(false);
    expect(TIER_GATE.free.settlementEditor).toBe(false);
    expect(TIER_GATE.premium.settlementEditor).toBe(true);
    expect(TIER_FACTS.anon.settlementEditor).toBe(false);
    expect(TIER_FACTS.free.settlementEditor).toBe(false);
    expect(TIER_FACTS.premium.settlementEditor).toBe(true);
    // ⛔ ONE VOCABULARY. `editMode` is the shipped Cartographer boolean in settlementSlice and
    // was the name this field nearly took; asserting its ABSENCE by name on both tables is
    // what stops a later author re-introducing the collision that rename removed.
    expect(Object.hasOwn(TIER_GATE.premium, 'editMode')).toBe(false);
    expect(Object.hasOwn(TIER_FACTS.premium, 'editMode')).toBe(false);
    expect(Object.hasOwn(TIER_GATE.free, 'editMode')).toBe(false);
    expect(Object.hasOwn(TIER_FACTS.free, 'editMode')).toBe(false);
  });

  it('a premium account without a staff role cannot edit — the paid-surface line', () => {
    const paying = sliceFor({ tier: 'premium', role: 'user' });
    // ⛔ ANTI-VACUITY FIRST. The account really is a paying Cartographer and the tier half of
    // the gate really is open for it, so the false below is the ROLE conjunct refusing and
    // never a seat that failed to take.
    expect(paying.auth.tier, 'the account is seated as a paying Cartographer').toBe('premium');
    expect(paying.auth.role, 'and it carries no staff role').toBe('user');
    expect(TIER_GATE.premium.settlementEditor, 'the tier half of the gate is open').toBe(true);
    // ⛔⛔ THE PAID-SURFACE LINE. Delete the second conjunct and this is the arm that reds.
    expect(paying.canEditSettlement()).toBe(false);
    // …and the paid surface it does reach is untouched, so this is the editor refusing and
    // not a broken account.
    expect(paying.canUseCustomContent()).toBe(true);
  });

  it('a staff role can edit, at every billing tier', () => {
    // THE PAIRED POSITIVE CONTROL: an always-false predicate satisfies every arm above and
    // reds here. Written out literally, one seat per line, because a seed loop over these
    // would be convicted by seedLoopTotality and parked by the lighting census.
    expect(STAFF_ROLES, 'the staff set is exactly the two roles these seats name')
      .toEqual(['developer', 'admin']);
    expect(sliceFor({ tier: 'anon', role: 'developer' }).canEditSettlement()).toBe(true);
    expect(sliceFor({ tier: 'free', role: 'developer' }).canEditSettlement()).toBe(true);
    expect(sliceFor({ tier: 'premium', role: 'developer' }).canEditSettlement()).toBe(true);
    expect(sliceFor({ tier: 'anon', role: 'admin' }).canEditSettlement()).toBe(true);
    expect(sliceFor({ tier: 'free', role: 'admin' }).canEditSettlement()).toBe(true);
    expect(sliceFor({ tier: 'premium', role: 'admin' }).canEditSettlement()).toBe(true);
    // …and the mechanism is the one the comment names: staff are written in as premium.
    expect(sliceFor({ tier: 'free', role: 'admin' }).auth.tier).toBe('premium');
  });

  it('anonymous, free, and every non-staff role read false', () => {
    // A presence control, so this arm cannot pass over a predicate broken to always-false.
    expect(sliceFor({ tier: 'premium', role: 'admin' }).canEditSettlement(), 'presence control')
      .toBe(true);
    expect(sliceFor({ tier: 'anon', role: 'user' }).canEditSettlement()).toBe(false);
    expect(sliceFor({ tier: 'free', role: 'user' }).canEditSettlement()).toBe(false);
    // Plausible-looking roles that are not the two exact strings, at the OPEN tier, so each
    // false is the role conjunct's fail-closed body and nothing else.
    expect(sliceFor({ tier: 'premium', role: 'owner' }).canEditSettlement()).toBe(false);
    expect(sliceFor({ tier: 'premium', role: 'staff' }).canEditSettlement()).toBe(false);
    expect(sliceFor({ tier: 'premium', role: 'ADMIN' }).canEditSettlement()).toBe(false);
    expect(sliceFor({ tier: 'premium', role: 'Developer' }).canEditSettlement()).toBe(false);
    expect(sliceFor({ tier: 'premium', role: 'admin ' }).canEditSettlement()).toBe(false);
    // …and the non-strings, which `isStaffRole` refuses by type.
    expect(sliceFor({ tier: 'premium', role: undefined }).canEditSettlement()).toBe(false);
    expect(sliceFor({ tier: 'premium', role: null }).canEditSettlement()).toBe(false);
    expect(sliceFor({ tier: 'premium', role: 42 }).canEditSettlement()).toBe(false);
    expect(sliceFor({ tier: 'premium', role: {} }).canEditSettlement()).toBe(false);
    expect(sliceFor({ tier: 'premium', role: ['admin'] }).canEditSettlement()).toBe(false);
    // An unknown tier reads through `?.` and fails closed rather than throwing.
    expect(sliceFor({ tier: 'enterprise', role: 'user' }).canEditSettlement()).toBe(false);
  });

  it('the conjunct is identity, not entitlement: revoking the paid unlock leaves staff editing', async () => {
    vi.resetModules();
    vi.doMock('../../src/lib/staffEntitlements.js', async (importOriginal) => {
      /** @type {any} */
      const actual = await importOriginal();
      // The ENTITLEMENT question follows the switch; IDENTITY is re-exported untouched.
      return { ...actual, STAFF_UNLOCK_ALL_PAID: false, staffUnlocksPaidFeatures: () => false };
    });
    try {
      /** @type {any} */
      const revoked = await import('../../src/store/authSlice.js');
      /** @type {any} */
      const entitlements = await import('../../src/lib/staffEntitlements.js');
      // ⛔ ANTI-VACUITY: the stub really took, and it moved exactly one of the two questions.
      expect(entitlements.STAFF_UNLOCK_ALL_PAID, 'the kill switch is off for this arm').toBe(false);
      expect(entitlements.staffUnlocksPaidFeatures('developer'), 'entitlement is revoked').toBe(false);
      expect(entitlements.isStaffRole('developer'), 'identity is not governed by the switch').toBe(true);

      const staff = sliceFrom(revoked.createAuthSlice, { tier: 'premium', role: 'developer' });
      // The tier override is gone, so the tier half is the account's OWN billing tier…
      expect(staff.auth.tier, 'a revoked staff account reads its real billing tier').toBe('premium');
      // …and the editor is STILL theirs, which is the whole point of the conjunct's choice.
      expect(staff.canEditSettlement()).toBe(true);

      // THE CONTRAST THAT MAKES IT IDENTITY RATHER THAN ENTITLEMENT. On the FREE tier the
      // same revoked staff account loses the paid surface the switch does govern — and the
      // editor closes there on the TIER conjunct, never on the role one.
      const onFree = sliceFrom(revoked.createAuthSlice, { tier: 'free', role: 'developer' });
      expect(onFree.auth.tier, 'the premium override really is gone').toBe('free');
      expect(onFree.canUseCustomContent(), 'the switched entitlement is revoked').toBe(false);
      expect(onFree.canEditSettlement(), 'and the tier half is what closes it there').toBe(false);
    } finally {
      vi.doUnmock('../../src/lib/staffEntitlements.js');
      vi.resetModules();
    }
  });

  it('the preview persona opens the door and its absence closes it', async () => {
    // The dev server reports MODE 'development'; vitest reports 'test', where the persona is
    // inert by design, so the stub below is what stands in for the preview worktree.
    expect(import.meta.env.DEV, 'this arm runs with DEV true').toBe(true);
    vi.stubEnv('MODE', 'development');
    try {
      vi.stubEnv('VITE_PREVIEW_ROLE', 'admin');
      vi.resetModules();
      /** @type {any} */
      const previewing = await import('../../src/store/authSlice.js');
      const seated = sliceFrom(previewing.createAuthSlice);
      // Seated through the store's own writers, from the first frame — never by calling
      // previewPersonaRole, which is module-private and is not this arm's subject.
      expect(seated.auth.role, 'the persona seats the role').toBe('admin');
      expect(seated.auth.tier, 'and the role resolves the tier').toBe('premium');
      expect(seated.canEditSettlement()).toBe(true);

      vi.stubEnv('VITE_PREVIEW_ROLE', '');
      vi.resetModules();
      /** @type {any} */
      const plain = await import('../../src/store/authSlice.js');
      const anonymous = sliceFrom(plain.createAuthSlice);
      expect(anonymous.auth.role, 'with no persona the visitor is a plain user').toBe('user');
      expect(anonymous.auth.tier).toBe('anon');
      expect(anonymous.canEditSettlement()).toBe(false);
    } finally {
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });

  it('the predicate spells no raw premium comparison', () => {
    const slice = readSource(AUTH_SLICE_PATH);
    const opensAt = slice.indexOf('  canEditSettlement: () => {');
    expect(opensAt, 'the predicate stands in the file under its own name').toBeGreaterThan(-1);
    const body = slice.slice(opensAt, slice.indexOf('\n  },', opensAt));
    // ⛔ ANTI-VACUITY: the census's own matcher is live on a planted comparison…
    expect(PREMIUM_COMPARISON.test("if (tier === 'premium') return true;"), 'the matcher fires')
      .toBe(true);
    // …and silent on the shipped predicate, which reads the gate and calls the role question.
    expect(body).toContain('TIER_GATE[tier]?.settlementEditor === true');
    expect(body).toContain('isStaffRole(role)');
    expect(PREMIUM_COMPARISON.test(body), 'the predicate joins no premium-gate census row')
      .toBe(false);
  });

  it('the changed files add no purchase surface', () => {
    const slice = readSource(AUTH_SLICE_PATH);
    const facts = readSource(TIER_FACTS_PATH);
    // ANTI-VACUITY: these are the edited files, and the scan really read them.
    expect(slice.includes('canEditSettlement')).toBe(true);
    expect(facts.includes('settlementEditor')).toBe(true);
    // ⛔ PURCHASES STAY LOCKED UNTIL LAUNCH (the owner, 2026-09-16). The lock is
    // launchGate.purchasesOpen(), worn as AvailableAtLaunchPill on LockedDestination; this
    // packet names none of the three and adds no price, no CTA and no upgrade path.
    expect(slice.includes('purchasesOpen')).toBe(false);
    expect(slice.includes('AvailableAtLaunchPill')).toBe(false);
    expect(slice.includes('LockedDestination')).toBe(false);
    expect(slice.includes('launchGate')).toBe(false);
    expect(facts.includes('purchasesOpen')).toBe(false);
    expect(facts.includes('AvailableAtLaunchPill')).toBe(false);
    expect(facts.includes('LockedDestination')).toBe(false);
    expect(facts.includes('launchGate')).toBe(false);
  });
});
