/**
 * Supabase Edge Function: scribe-render — THE SCRIBE (docs/DESIGN_SCRIBE_GENERATION_TIME_PROSE.md).
 *
 * Renders ONE TAB of one settlement's dossier prose, once per epoch, from the town card the client
 * builds and POSTs. The rendered words land on `settlement.prose` through the save outbox; the
 * display layer swaps a pool from the hand corpus to the rendered line only where the words fit
 * the variant they were written for (the kernel's `scribeVariantPool`).
 *
 * ⭐⭐ WHY THIS IS ITS OWN FUNCTION AND NOT A FOURTH `type` ON `generate-narrative` (JUDGMENT,
 * VETOABLE — the brief offers both and says to judge by the budget). Four reasons, measured:
 *   1. THE DESIGN ASKS FOR `runCreditedCall` AND ITS SEVEN INVARIANTS BY NAME (§6), and
 *      `generate-narrative` DOES NOT USE IT — it carries its own inline reserve/spend/refund
 *      sequence (index.ts:1159-1433), which no other AI surface shares. Putting the Scribe there
 *      would mean either rewriting the narrative's money path or shipping the one surface the
 *      design names the orchestrator for on a second, unshared one.
 *   2. THE NEXT COMMIT GUTS THAT MODULE. The owner's rule 17 retires the narrative overlay, and
 *      `requestNarrative` with it. A new paid surface entangled with a module being retired in the
 *      same wave is a merge hazard for no benefit.
 *   3. THE SHAPES DIFFER. `generate-narrative` is ONE invocation per settlement that fans out
 *      internally under a 55 s budget; the Scribe is ONE INVOCATION PER TAB (§6), each landing and
 *      swapping independently through the outbox. Seven small calls, not one large one.
 *   4. BLAST RADIUS. While the flag is dark, a separate function cannot regress the live narrative
 *      path at all — there is no shared code to get wrong.
 *
 * THE MONEY PATH is `runCreditedCall` (`../ai-analyst/creditFlow.ts`) verbatim: reserve the global
 * USD cap before the spend, rate-limit after reserve, capture the spend id, meter(false) → refund →
 * release on model failure, meter(true) → release on success, never refund an elevated spend, and
 * release the reservation on every post-reserve exit. The FREE FIRST RENDER (chair ruling 2) rides
 * on migration 118's pattern — `claim_free_scribe` before the spend, `release_free_scribe` on any
 * failure — so it is unfarmable by construction and returned when the render does not land.
 *
 * ⭐⭐ ONE RENDER, ONE CHARGE (W5b; migration 203). A render is one invocation PER TAB, and until
 * W5b every one of them ran its own `spend_credits`, so a seven-to-ten-tab render charged 35 to 50
 * credits where migration 202's header and the redraw button both said five. The cure is a
 * SERVER-MINTED RENDER SESSION: `open_scribe_render` keys on the tuple the open trigger already
 * keys on — (account, saveId, advanceSeq, renderedFor) — and tells exactly ONE invocation per
 * render `first: true`. Only that one claims the free render and only that one spends. Every other
 * tab runs the model under the same reservation and rate-limit arms (a paid render is not a licence
 * to be unbounded) and is metered like any call, because COST is per call and the SPEND is per
 * render. THE TOKEN IS NEVER CLIENT-SUPPLIED: the body is the same body W2 sent, and the server
 * derives the identity from it.
 *
 * ⛔ WHICH FAILURE REFUNDS. A FIRST tab that lands nothing aborts the session and is refunded and
 * released exactly as before — the reader's next open is a fresh, chargeable render. A LATER tab's
 * failure refunds NOTHING, because it never spent and because the render has already landed
 * something: that tab's pools simply draw the hand corpus, which is the floor the whole design
 * rests on.
 *
 * ⭐ AND A FAIR-USE FLOOR EXISTS AT LAST (W5b car 4; `scribe_usage_precheck`, migration 203). A
 * per-account daily cap was in no design, no ruling and no line of code; the estate's own usage
 * governor (migration 144) cannot express one, because it meters TOKENS and DOLLARS against caps
 * the user sets on their own wallet and a render is one unit of use spread over seven to ten of
 * those rows. The new door is asked on the FIRST tab of a render only, refuses before the claim and
 * before the spend with the session released, and fails OPEN when it cannot be read. The number is
 * an operator setting with the chair's default of five, NOT the owner's signed number.
 *
 * ⛔ EVERY RENDERED LINE PASSES THE TIER-0 INSTRUMENTS BEFORE IT IS RETURNED, from
 * `_shared/proseKernel.bundle.js` — the byte-derived copy of the same `refuteUnit` the corpus
 * programme is audited by. A FAIL is dropped and that pool draws the hand corpus. The refuter runs
 * SERVER-SIDE deliberately: a forged card harms only the forger's own prose, but the persisted
 * artefact stays lawful whatever the client sent.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
import { isSessionSuperseded, deviceLabelFromRequest } from '../_shared/sessionGate.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import { scheduleAutoReload } from '../_shared/autoReload.ts';
import { aiIpRateGuard } from '../_shared/rateLimit.ts';
import { runCreditedCall } from '../ai-analyst/creditFlow.ts';
import { resolveProviderKey, isVaultUnavailable } from '../ai-analyst/byok.ts';
// @ts-ignore — the bundle is generated JavaScript with JSDoc types, checked by `deno check` in
// tests/lint/scribeBundle.walker.test.js and byte-derived from src/domain/prose/refuteUnit.js.
import { refuteUnit } from '../_shared/proseKernel.bundle.js';
import { SCRIBE_VOICE } from './voice.ts';
import { SCRIBE_EXEMPLARS } from './exemplars.ts';
import {
  SCRIBE_FALLBACK_BETA,
  SCRIBE_MODEL,
  SCRIBE_OUTPUT_SCHEMA,
  TIER1_ANSWER_SCHEMA,
  applyTier1,
  buildScribeBrief,
  buildScribeUserTurn,
  buildTier1Checklist,
  buildTownBlock,
  judgeUnits,
  parseScribeUnits,
  parseTier1Answers,
} from './scribeCore.ts';
import type { ScribeUnit, ScribeVerdict } from './scribeCore.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const ANTHROPIC_VERSION = '2023-06-01';
const SCRIBE_PROVIDER = 'anthropic';
/** The ONE render SKU (chair ruling 1 as amended by ruling 19: one price for the whole render). */
const SCRIBE_FEATURE = 'dossierProse';
/**
 * ⛔ THE BUDGET WRAPS BOTH READERS. `generate-narrative` bounds one invocation at 55 s and the
 * Scribe is one invocation per tab; the tier-1 pass is a SECOND provider call inside that same
 * invocation, so the timer is armed once, before the first call, and cleared after the second.
 * Two timers would let a slow writer plus a slow reader spend 110 s between them.
 */
const SCRIBE_TIMEOUT_MS = 55_000;
const SCRIBE_SPEND_ESTIMATE_USD = 0.08;
/** A tab's card is tens of kilobytes; thirteen tabs of one town run to 261 KB, and this is one. */
const MAX_BODY_BYTES = 512 * 1024;
const MAX_OUTPUT_TOKENS = 16_000;
/** The second reader answers yes or no six times a line, so its ceiling is a fraction of that. */
const TIER1_MAX_OUTPUT_TOKENS = 4_000;

/**
 * ⭐ THE FAIR-USE REFUSAL, IN THE HOUSE'S OWN VOICE (W5b car 4). Small numbers are spelled because
 * the estate's refusals read as sentences a game master would say, and NO EM DASH anywhere: the E2
 * ratchet holds every rendered line at hard zero on that mark and a refusal is a rendered line.
 */
const SPELLED = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
function dailyCapMessage(cap: number): string {
  const word = Number.isInteger(cap) && cap >= 0 && cap < SPELLED.length ? SPELLED[cap] : String(cap);
  const towns = cap === 1 ? 'town' : 'towns';
  return `The survey has written ${word} ${towns} today; it writes again tomorrow.`;
}

function getCorsHeaders(req?: Request) { return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' }); }
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

function defaultUserClient(authHeader: string) {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
}
function defaultAdminClient() { return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!); }

/**
 * THE PROVIDER CALL, per the API skill's current contract for `claude-opus-5`:
 *   • TWO CACHED `system` BLOCKS, each `cache_control: {type:'ephemeral', ttl:'1h'}` (chair ruling
 *     31). The API allows four breakpoints and this uses two, because the two halves have
 *     DIFFERENT LIFETIMES: the brief is byte-identical for every user, every world and every tab,
 *     so it is written once an hour and read by everybody after that; the town block is identical
 *     across one settlement's six or seven tab calls and different for the next settlement. One
 *     breakpoint over both would re-write the whole prefix, exemplar pack included, on every town.
 *     The card's volatile half is the user turn, so no per-tab byte sits inside a cached block.
 *   • ADAPTIVE THINKING (`{type:'adaptive'}`), which is the only on-mode on this model family;
 *   • `output_config.effort: 'high'` and `output_config.format`, the CURRENT structured-output
 *     parameter (the deprecated top-level `output_format` is not used);
 *   • server-side `fallbacks: 'default'` under its beta, so a refusal category re-routes inside the
 *     same call instead of blanking a tab.
 *
 * ⭐ THE SAME FUNCTION SERVES BOTH READERS (the writer and the tier-1 checklist), and it must:
 * the second call re-sends the SAME TWO cached system blocks, which is the whole reason the second
 * reader is nearly free. Only the user turn, the output schema and `max_tokens` differ.
 */
async function callAnthropic(args: {
  apiKey: string; brief: string; townBlock: string; turn: string;
  schema: Record<string, unknown>; maxTokens: number;
  providerFetch: typeof fetch; signal: AbortSignal;
}): Promise<Response> {
  return args.providerFetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal: args.signal,
    headers: {
      'x-api-key': args.apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'anthropic-beta': SCRIBE_FALLBACK_BETA,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: SCRIBE_MODEL,
      max_tokens: args.maxTokens,
      thinking: { type: 'adaptive' },
      fallbacks: 'default',
      output_config: {
        effort: 'high',
        format: { type: 'json_schema', schema: args.schema },
      },
      system: [
        { type: 'text', text: args.brief, cache_control: { type: 'ephemeral', ttl: '1h' } },
        { type: 'text', text: args.townBlock, cache_control: { type: 'ephemeral', ttl: '1h' } },
      ],
      messages: [{ role: 'user', content: args.turn }],
    }),
  });
}

/** The text of a structured answer: the first text block, which the schema wall has validated. */
function answerTextOf(data: any): string {
  const blocks = Array.isArray(data?.content) ? data.content : [];
  for (const block of blocks) {
    if (block?.type === 'text' && typeof block.text === 'string') return block.text;
  }
  return '';
}

export async function handleScribeRender(
  req: Request,
  deps: {
    userClient?: (authHeader: string) => ReturnType<typeof createClient>;
    adminClient?: () => ReturnType<typeof createClient>;
    anthropicFetch?: typeof fetch;
  } = {},
): Promise<Response> {
  const makeUserClient = deps.userClient ?? defaultUserClient;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const providerFetch = deps.anthropicFetch ?? fetch;
  const cors = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);

  const guard = botGuard(req, 'scribe-render');
  if (guard.reject) return guard.reject;

  /**
   * ⛔ THE TWO UNDO ARMS LIVE OUTSIDE THE TRY, and that is the W5b fix to the free-claim race.
   * Both were closures INSIDE the body, so anything that threw between the claim and the response
   * — a metering insert, `scheduleAutoReload`, a JSON stringify on a huge answer — consumed the
   * account's one free render and left it consumed. They are declared here, assigned once the user
   * is known, and run by the outer catch as well as by every typed refusal.
   */
  let releaseFreeClaim: () => Promise<void> = () => Promise.resolve();
  let abortRenderSession: () => Promise<boolean> = () => Promise.resolve(false);

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization' }, 401, cors);
    const supabaseUser = makeUserClient(authHeader);
    const supabaseAdmin = makeAdminClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401, cors);
    if (await isSessionSuperseded(supabaseAdmin, user.id, authHeader, deviceLabelFromRequest(req))) {
      return json({ error: 'session_superseded' }, 401, cors);
    }
    const ipGate = await aiIpRateGuard(supabaseAdmin, guard.meta.ip, cors);
    if (ipGate) return ipGate;

    const { data: isActive, error: activeErr } = await supabaseAdmin.rpc('account_is_active', { p_uid: user.id });
    if (activeErr) logError('scribe-render', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    const raw = await req.text().catch(() => '');
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413, cors);
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return json({ error: 'invalid_json' }, 400, cors); }

    const saveId = typeof body?.saveId === 'string' ? body.saveId : '';
    const renderedFor = typeof body?.renderedFor === 'string' ? body.renderedFor : '';
    const engineVersion = typeof body?.engineVersion === 'string' ? body.engineVersion : '';
    const advanceSeq = typeof body?.advanceSeq === 'number' && Number.isFinite(body.advanceSeq) ? body.advanceSeq : 0;
    const card = body?.card && typeof body.card === 'object' ? body.card : null;
    const record = body?.record && typeof body.record === 'object' ? body.record : null;
    const guidance = typeof body?.guidance === 'string' ? body.guidance : '';
    // THE DURABLE-HOME CONDITION, enforced on the paying side as well as in the trigger: no credit
    // is spent on a settlement that cannot keep what it paid for.
    if (!saveId) return json({ error: 'Save this settlement first.' }, 400, cors);
    if (!card || !Array.isArray(card.pools) || card.pools.length === 0) {
      return json({ error: 'Missing card' }, 400, cors);
    }
    if (!renderedFor) return json({ error: 'Missing seed' }, 400, cors);

    // ⭐ BYOK (chair ruling 10): a BYOK user's Scribe runs on THEIR key, and the tier-0 refuter is
    // unchanged either way. FAIL CLOSED on a vault error — a typed, retryable refusal BEFORE the
    // credit flow is constructed, so there is no reservation to release and no spend to refund.
    const providerKey = await resolveProviderKey(
      supabaseAdmin, user.id, SCRIBE_PROVIDER, ANTHROPIC_API_KEY,
      (note) => logError('scribe-render', user.id, note, { stage: 'byok' }), supabaseUser,
    );
    if (isVaultUnavailable(providerKey)) {
      return json({ error: providerKey.message, code: providerKey.code, retryable: providerKey.retryable }, providerKey.status, cors);
    }

    // ⭐⭐ THE RENDER SESSION (W5b; migration 203). Minted AFTER the vault check on purpose: a
    // session that exists but never called the model would tell the reader's retry `first: false`
    // and hand them an unpaid render, so nothing mints until every refusal that costs nothing has
    // already been made. FAIL CLOSED on an error here — the estate's posture for a gate it cannot
    // read, and the only direction that cannot over-charge. The hand corpus is on the page either
    // way, so a refused render is a dossier that reads exactly as it did.
    let sessionId: string | null = null;
    let sessionFirst = false;
    let sessionFree = false;
    try {
      const { data: opened, error: openErr } = await supabaseAdmin.rpc('open_scribe_render', {
        p_user: user.id,
        p_save: saveId,
        p_seq: advanceSeq,
        p_rendered_for: renderedFor,
        p_engine: engineVersion,
        p_tabs: typeof body?.tabsExpected === 'number' && Number.isFinite(body.tabsExpected) ? body.tabsExpected : 0,
      });
      if (openErr) throw new Error(openErr.message);
      const row = opened as { session_id?: string | null; first?: boolean; free?: boolean | null } | null;
      sessionId = row?.session_id ?? null;
      sessionFirst = row?.first === true;
      sessionFree = row?.free === true;
      if (!sessionId) throw new Error('open_scribe_render returned no session');
    } catch (e) {
      logError('scribe-render', user.id, e, { stage: 'render-session' });
      return json({ error: 'The dossier survey is temporarily unavailable. Nothing was charged.' }, 503, cors);
    }
    abortRenderSession = async () => {
      if (!sessionId || !sessionFirst) return false;
      try {
        const { data, error } = await supabaseAdmin.rpc('abort_scribe_render', { p_session: sessionId });
        if (error) { logError('scribe-render', user.id, error.message, { stage: 'render-session-abort' }); return true; }
        return data !== false;
      } catch (e) {
        logError('scribe-render', user.id, e, { stage: 'render-session-abort' });
        // An abort that could not be reached is treated as HAVING released: the user-favourable
        // direction, because the alternative is silently keeping a free claim they did not get.
        return true;
      }
    };

    // ⭐⭐ THE FAIR-USE GOVERNOR (W5b car 4; migration 203's `scribe_usage_precheck`). A per-account
    // daily cap existed NOWHERE before this: not in the design, not in the rulings, not in the
    // code, and the estate's own usage governor (`surveyor_usage_precheck`, migration 144) cannot
    // express it, because it sums TOKENS and DOLLARS out of `ai_usage_events` against caps the USER
    // sets on their own wallet, and a render is one unit of use that produces seven to ten rows in
    // that table. So this is a second, narrower door, and it answers a different question: the
    // house's floor rather than the user's own.
    //
    // ⛔ IT IS ASKED ON THE FIRST TAB OF A RENDER AND NOWHERE ELSE, because a render is ONE unit of
    // use. Refusing a later tab would leave a reader with half a dossier rendered and half not,
    // having been told they were over a limit they were under when the render began.
    //
    // ⛔ AND IT REFUSES BEFORE THE CLAIM AND BEFORE THE SPEND, with the session released, so a
    // capped reader is charged nothing, keeps their free render, and reads the hand corpus exactly
    // as they did. The number is an OPERATOR SETTING (chair default five, not owner-signed).
    if (sessionFirst) {
      let capped: { used: number; cap: number } | null = null;
      try {
        const { data, error } = await supabaseAdmin.rpc('scribe_usage_precheck', { p_user: user.id });
        if (error) throw new Error(error.message);
        const row = data as { allowed?: boolean; used?: number; cap?: number } | null;
        // FAIL OPEN on an unreadable governor, exactly as the SQL fails open on an unreadable
        // setting: a fair-use floor is the house's protection, and a house protection that cannot
        // be read must not become an outage on a paid surface. The global USD cap still bounds it.
        if (row && row.allowed === false) {
          capped = { used: Number(row.used ?? 0), cap: Number(row.cap ?? 0) };
        }
      } catch (e) {
        logError('scribe-render', user.id, e, { stage: 'usage-governor' });
      }
      if (capped) {
        await abortRenderSession();
        return json({
          ok: false, outcome: 'daily_cap', used: capped.used, cap: capped.cap,
          error: dailyCapMessage(capped.cap),
        }, 429, cors);
      }
    }

    // ⭐ THE FREE FIRST RENDER (chair ruling 2), on migration 118's atomic pattern: claimed BEFORE
    // the spend, released on EVERY path that does not land a render, so it is unfarmable and never
    // silently consumed by a failure.
    //
    // ⭐⭐ AND IT IS CLAIMED ONLY BY THE FIRST TAB OF A RENDER (W5b). Before the session existed,
    // the claim was taken by the first TAB and the other six of the same render were charged, so
    // "your first render is free" was true of one seventh of one render. The free claim now rides
    // the same `first` bit the spend does, which is what makes it a free RENDER.
    let usedFree = false;
    let freeReleased = false;
    const releaseFree = async () => {
      if (!usedFree || freeReleased) return;
      freeReleased = true;
      try { await supabaseAdmin.rpc('release_free_scribe', { p_user: user.id }); }
      catch (e) { logError('scribe-render', user.id, e, { stage: 'free-release' }); }
    };
    releaseFreeClaim = releaseFree;
    if (sessionFirst) {
      try {
        const { data: claimed, error: claimErr } = await supabaseAdmin.rpc('claim_free_scribe', { p_user: user.id });
        if (claimErr) logError('scribe-render', user.id, `claim_free_scribe errored: ${claimErr.message}`, { stage: 'free-claim' });
        usedFree = claimed === true;
      } catch (e) { logError('scribe-render', user.id, e, { stage: 'free-claim' }); }
    }

    let spendId: string | null = null;
    let promptChars = 0;
    let answerChars = 0;
    let usage: { input: number | null; output: number | null; cacheRead: number | null; cacheWrite: number | null } =
      { input: null, output: null, cacheRead: null, cacheWrite: null };
    let units: ScribeUnit[] = [];
    let verdicts: ScribeVerdict[] = [];
    let dropped = 0;
    let tier1Dropped = 0;
    /**
     * ⭐ HOW MANY UNITS SHIPPED WITH A ROW REPLACED BY THE HAND CORPUS (W3b car 3), over BOTH
     * readers. RUN 2 measured a seven-line unit lost to one invented face; a patched unit is that
     * unit shipping with the one face the corpus would have supplied anyway, and the pilot needs
     * the figure apart from `dropped` to tell the two outcomes apart.
     */
    let patched = 0;
    /** `none` where tier 0 kept nothing to read, `ok` where the second reader ran, `skipped` on any failure of it. */
    let tier1: 'none' | 'ok' | 'skipped' = 'none';
    let calls = 0;
    let refused = false;
    let fellBack = false;
    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    /**
     * ⭐ BOTH CALLS ARE ONE EVENT FOR MONEY. The render is one credited act (ruling 19's one
     * render SKU), so the writer's usage and the second reader's are SUMMED into one set of
     * totals and one `ai_usage_events` row, with `calls` on the response saying how many provider
     * turns produced them. A null stays null only while NOTHING has been counted: once a figure
     * arrives, a later absent one adds zero rather than erasing what was measured.
     */
    const addUsage = (data: unknown) => {
      const row = (data as { usage?: Record<string, unknown> } | null)?.usage ?? {};
      const add = (held: number | null, next: unknown) => {
        if (typeof next !== 'number' || !Number.isFinite(next)) return held;
        return (held ?? 0) + next;
      };
      usage = {
        input: add(usage.input, row.input_tokens),
        output: add(usage.output, row.output_tokens),
        cacheRead: add(usage.cacheRead, row.cache_read_input_tokens),
        cacheWrite: add(usage.cacheWrite, row.cache_creation_input_tokens),
      };
    };

    const outcome = await runCreditedCall({
      async reserve() {
        const { data, error } = await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: SCRIBE_SPEND_ESTIMATE_USD });
        if (error) logError('scribe-render', user.id, `reserve_ai_spend errored: ${error.message}`, { stage: 'spend-cap' });
        return {
          allowed: (data as { allowed?: boolean } | null)?.allowed === true,
          reservationId: (data as { reservation_id?: string | null } | null)?.reservation_id ?? null,
        };
      },
      async rateLimit() {
        const { data, error } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
        if (error) { logError('scribe-render', user.id, `rate_limit errored: ${error.message}`, { stage: 'rate-limit' }); return { allowed: true }; }
        return { allowed: (data as { allowed?: boolean } | null)?.allowed !== false };
      },
      async spend() {
        // ⭐⭐ ONE RENDER, ONE CHARGE (W5b). A tab that did NOT mint the session is already paid
        // for: it reports an ok spend with no id, so the orchestrator's refund arm has nothing to
        // refund, the release arm still runs, and `spend_credits` is never reached. This is the
        // whole defect, closed in three lines, and the session is what makes them safe.
        if (!sessionFirst) return { ok: true, spendId: null, elevated: false, balance: null };
        // The free first render skips the charge entirely and reports an ok spend with no id, so
        // the orchestrator's refund arm has nothing to refund and the release arm still runs.
        if (usedFree) return { ok: true, spendId: null, elevated: false, balance: null };
        const { data, error } = await supabaseUser.rpc('spend_credits', { feature: SCRIBE_FEATURE });
        if (error) { logError('scribe-render', user.id, `spend_credits errored: ${error.message}`, { stage: 'spend' }); throw new Error('spend_failed'); }
        const res = data as any;
        spendId = res?.spend_id ?? res?.id ?? null;
        return { ok: !!res?.ok, spendId, elevated: !!res?.elevated, balance: res?.balance ?? null, reason: res?.reason ?? null };
      },
      async callModel() {
        const brief = buildScribeBrief({ voice: SCRIBE_VOICE, exemplars: SCRIBE_EXEMPLARS });
        const townBlock = buildTownBlock(card);
        const turn = buildScribeUserTurn({ card, record, guidance });
        promptChars = brief.length + townBlock.length + turn.length;
        // ⛔ ONE TIMER OVER BOTH READERS. See SCRIBE_TIMEOUT_MS: the tier-1 pass is a second call
        // inside the SAME invocation and the same budget, so the controller is armed once here
        // and cleared once at the end, whichever path the function leaves by.
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), SCRIBE_TIMEOUT_MS);
        try {
          const resp = await callAnthropic({
            apiKey: providerKey.key,
            brief,
            townBlock,
            turn,
            schema: SCRIBE_OUTPUT_SCHEMA,
            maxTokens: MAX_OUTPUT_TOKENS,
            providerFetch,
            signal: ac.signal,
          });
          if (!resp.ok) {
            const text = await resp.text().catch(() => '');
            logError('scribe-render', user.id, `anthropic ${resp.status}: ${text.slice(0, 500)}`, { stage: 'provider' });
            throw new Error(`Anthropic ${resp.status}`);
          }
          const data = await resp.json();
          addUsage(data);
          calls = 1;
          // A fallback block names the model that declined and the one that continued; a sticky
          // turn carries none, so the iteration list is read too. Receipts, never control flow.
          fellBack = (Array.isArray(data?.content) ? data.content : []).some((b: any) => b?.type === 'fallback')
            || (Array.isArray(data?.usage?.iterations) ? data.usage.iterations : []).some((i: any) => i?.type === 'fallback_message');
          // THE WHOLE CHAIN REFUSED. Not an error and not a line: the tab keeps the hand corpus.
          if (data?.stop_reason === 'refusal') { refused = true; return { ok: false, answerText: '' }; }

          const answer = answerTextOf(data);
          answerChars = answer.length;
          const parsed = parseScribeUnits(answer);
          if (!parsed.ok) return { ok: false, answerText: '' };

          const judged = judgeUnits(parsed.units, card, refuteUnit);
          units = judged.kept;
          verdicts = judged.verdicts;
          dropped = judged.dropped;
          patched = judged.patched;

          // ⭐⭐ TIER 1 — THE SECOND READER (design §4; chair ruling 29). It runs only where tier 0
          // kept something, on the SAME two cached system blocks, so its input is almost entirely
          // a cache read and its output is six words a line.
          //
          // ⭐ AND IT READS UNDER THE SAME LAW AS THE WRITER (W3b cars 4 and 5). The checklist opens
          // with THE STANDARD (ruling 36: refused for CONTRADICTING the settlement, never for
          // adding to it), then THE READER'S EYE and the two-ladders
          // and funding notes that the town block above already gives both seats, because RUN 2
          // measured 63 lines lost to a reader that had been shown the page's badge and never the
          // note saying the badge and the band are two true readings of one score. A row BYTE-EQUAL
          // to the corpus is never sent here at all: it is the line a refusal falls back to.
          //
          // ⛔ A TIER-1 FAILURE IS NOT A RENDER FAILURE. The design says tier 0 is the FLOOR and
          // tier 1 the second reader; a dossier is not blanked because the second reader was
          // unavailable. Any provider error, refusal, unparseable answer or abort here is logged,
          // tier 0's kept units ship, and the response says `tier1: 'skipped'` so the pilot can
          // tell a page the second reader passed from a page it never saw.
          if (units.length > 0) {
            try {
              const checklist = buildTier1Checklist(units, card);
              promptChars += checklist.length;
              const second = await callAnthropic({
                apiKey: providerKey.key,
                brief,
                townBlock,
                turn: checklist,
                schema: TIER1_ANSWER_SCHEMA,
                maxTokens: TIER1_MAX_OUTPUT_TOKENS,
                providerFetch,
                signal: ac.signal,
              });
              if (!second.ok) {
                const text = await second.text().catch(() => '');
                throw new Error(`Anthropic ${second.status}: ${text.slice(0, 200)}`);
              }
              const secondData = await second.json();
              addUsage(secondData);
              calls = 2;
              if (secondData?.stop_reason === 'refusal') throw new Error('tier1 refused');
              const answers = parseTier1Answers(answerTextOf(secondData));
              if (!answers.ok) throw new Error('tier1 unparseable');
              const second0 = applyTier1(units, answers.answers, card);
              units = second0.kept;
              verdicts = [...verdicts, ...second0.verdicts];
              tier1Dropped = second0.dropped;
              dropped += second0.dropped;
              patched += second0.patched;
              tier1 = 'ok';
            } catch (e) {
              logError('scribe-render', user.id, e, { stage: 'tier1' });
              tier1 = 'skipped';
            }
          }

          // EVERY unit refused is not a model failure: it is a render that landed nothing, and the
          // reader keeps the corpus. It is still a failed call for money, so the spend is refunded.
          return { ok: units.length > 0, answerText: answer };
        } finally { clearTimeout(timer); }
      },
      async refund(id, reason, elevated) {
        if (!id || elevated) return;
        try {
          const { error } = await supabaseAdmin.rpc('refund_credits', { spend_ledger_row: id, refund_reason: reason });
          if (error) logError('scribe-render', user.id, error.message, { stage: 'refund', spend_id: id });
        } catch (e) { logError('scribe-render', user.id, e, { stage: 'refund', spend_id: id }); }
      },
      async release(id) {
        if (!id) return;
        try { await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: id }); }
        catch (e) { logError('scribe-render', user.id, `release failed: ${e instanceof Error ? e.message : String(e)}`, { stage: 'spend-cap' }); }
      },
      async meter(ok) {
        try {
          // ⭐ THE CACHE READ IS THE RECEIPT the design says no test can prove (§6), so it is
          // METERED rather than assumed: cache reads and writes are folded into `input_tokens` at
          // full input price, exactly as `generate-narrative` folds them — conservative, so the
          // global cap trips no later than reality — and the raw figures ride in the response for
          // the pilot to read on two consecutive calls.
          const inTok = (usage.input ?? estTokens(String(promptChars))) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
          const outTok = usage.output ?? Math.max(1, Math.ceil(answerChars / 4));
          const costUsd = providerKey.byok ? 0 : Number((((inTok / 1_000_000) * 5) + ((outTok / 1_000_000) * 25)).toFixed(6));
          const { error } = await supabaseAdmin.from('ai_usage_events').insert({
            user_id: user.id, feature: SCRIBE_FEATURE, phase: String(card?.tab ?? ''), provider: SCRIBE_PROVIDER,
            model: SCRIBE_MODEL, model_preference: null,
            input_tokens: inTok, output_tokens: outTok,
            tokens_estimated: usage.input == null || usage.output == null,
            estimated_cost_usd: costUsd, ok, fellback: fellBack, duration_ms: 0, spend_id: spendId,
          });
          if (error) logError('scribe-render', user.id, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
        } catch (e) { logError('scribe-render', user.id, e, { stage: 'metering' }); }
      },
    }, 'scribe render failed');

    if (outcome.outcome !== 'ok') {
      // ⭐ THE SESSION IS RELEASED ONLY WHEN THE FIRST TAB LANDED NOTHING, and the free claim
      // follows it rather than the other way round. `abort_scribe_render` refuses when any tab of
      // this session has landed, so in the one interleaving where a sibling tab landed while this
      // first tab failed, the render DID land, the free claim stays spent on it, and the reader's
      // next open reads the render they have rather than paying for it twice.
      const released = await abortRenderSession();
      if (released || !sessionFirst) await releaseFree();
      const status = outcome.status;
      const message = outcome.outcome === 'cap'
        ? 'The dossier survey is temporarily unavailable. Nothing was charged.'
        : outcome.outcome === 'rate_limited'
          ? 'Too many renders in a short time. Nothing was charged.'
          : outcome.outcome === 'insufficient'
            ? 'Not enough credits to render this dossier.'
            : 'The survey could not be written this time; the dossier reads as it did.';
      return json({ ok: false, outcome: outcome.outcome, refused, error: message }, status, cors);
    }

    // ⭐ THE RESPONSE IS BLOCK-SHAPED, because the artefact lands a BLOCK at a time and a tab swaps
    // from the corpus to the rendered line the moment ITS block is present.
    const blocks: Record<string, Record<string, Array<{ vid: number; spine: string; faces: string[]; notebook: string[] }>>> = {};
    for (const unit of units) {
      if (!blocks[unit.blockId]) blocks[unit.blockId] = {};
      const pool = blocks[unit.blockId][unit.poolKey] || [];
      pool.push({ vid: unit.vid, spine: unit.spine, faces: unit.faces, notebook: unit.notebook });
      blocks[unit.blockId][unit.poolKey] = pool;
    }

    // ⭐ THE TAB IS COUNTED AGAINST THE RENDER, and the render's ONE spend is stamped on the
    // session the first time it is known. `close_scribe_render_tab` coalesces, so a later tab
    // passing nulls can never erase the receipt the first tab wrote.
    try {
      await supabaseAdmin.rpc('close_scribe_render_tab', {
        p_session: sessionId,
        p_spend: sessionFirst ? spendId : null,
        p_free: sessionFirst ? usedFree : null,
      });
    } catch (e) { logError('scribe-render', user.id, e, { stage: 'render-session-close' }); }

    // The reader is coming back for more tabs of this same dossier, so the session's own reload
    // window is extended here exactly as every other credited surface extends it.
    scheduleAutoReload(supabaseAdmin, user.id);
    return json({
      ok: true,
      saveId,
      advanceSeq,
      renderedFor,
      engineVersion,
      tab: String(card?.tab ?? ''),
      blocks,
      verdicts,
      dropped,
      // ⭐ THE TWO READERS ARE REPORTED APART. `dropped` is every unit that fell, `tier1Dropped`
      // the share the SECOND reader took, and `tier1` says whether it ran at all — which is the
      // figure the pilot needs to tell a page the checklist passed from a page it never saw.
      tier1,
      tier1Dropped,
      // ⭐ A PATCHED UNIT IS A KEPT UNIT, so it is already in `blocks` above with the corpus row at
      // the seat that fell: `landBlock` carries it like any other, because the shape is unchanged
      // and the composer renders a copied corpus wording exactly as it renders the corpus's own.
      // This figure is how a reader tells "shipped whole" from "shipped with a row replaced".
      patched,
      calls,
      balance: outcome.balance,
      free: sessionFirst ? usedFree : sessionFree,
      // ⭐⭐ WHICH TAB PAID FOR THIS RENDER. `charged` is true on EXACTLY ONE invocation of a
      // render and false on every other, which is the figure a pilot reads to prove the whole
      // defect closed: seven tabs, one `charged: true`. `first` is the same bit named for what it
      // is about the SESSION rather than about the money.
      first: sessionFirst,
      charged: sessionFirst && !usedFree,
      usage: {
        input: usage.input, output: usage.output,
        cacheRead: usage.cacheRead, cacheWrite: usage.cacheWrite,
        fellBack,
      },
    }, 200, cors);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logError('scribe-render', null, message, { stage: 'outer' });
    // ⛔ THE UNDO ARMS RUN HERE TOO (W5b). Anything that threw after the claim — the metering
    // insert, the reload scheduler, a stringify — used to leave the account's one free render
    // consumed by a render the reader never received, and the session holding the epoch's slot so
    // the retry read as already paid. Both are now released on this path as well.
    try { await abortRenderSession(); } catch { /* the log above is the record */ }
    try { await releaseFreeClaim(); } catch { /* idempotent by construction (202) */ }
    return json({ error: 'The survey could not be written this time.' }, 500, getCorsHeaders(req));
  }
}

serve((req) => handleScribeRender(req));
