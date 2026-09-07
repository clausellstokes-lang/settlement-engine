/**
 * useReferralIntent.js — shared state + gating for the "Referred by someone?"
 * field on the purchase surfaces (PurchaseModal, PricingPage).
 *
 * Eligibility (all must hold, else the field renders nothing):
 *   - payments configured and the user is signed in (the RPC binds the intent
 *     to auth.uid(), so anonymous input would be meaningless),
 *   - not already premium / founder / elevated (a referral rewards the FIRST
 *     subscription payment; existing payers can't be referred),
 *   - no prior referral row as referee — any status. The seat is spent once;
 *     re-asking would only produce an `already_referred` rejection.
 *
 * `recordIntent()` is deliberately swallow-everything: a referral is a bonus
 * on top of a purchase, so no failure in here may ever block or delay
 * checkout. Rejections surface as a calm inline note and nothing else.
 *
 * WEB-3 (§359.8): this hook is also the funnel's single EMIT CHOKEPOINT. It is
 * the only caller of recordReferralIntent and the only place the outcome is
 * observable — `recordIntent()` resolves to undefined and swallows every
 * rejection, so a parent awaiting it cannot tell 'recorded' from 'rejected'
 * from 'error'. There are three invocation paths, not two (PricingPage's buy,
 * PurchaseModal's buy, and ReferralIntentField's own Record button, which is
 * wired straight to `referral.recordIntent`), so an emit placed in the parents
 * would miss the third outright. The emit is POST-HOC — strictly after the RPC
 * has resolved or thrown — so an intent that never landed can never be
 * reported as one, and a failing analytics layer can never reach checkout.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../store/index.js';
import { isConfigured } from '../lib/supabase.js';
import { hasPriorReferral, recordReferralIntent } from '../lib/referralRedeem.js';
import { track, EVENTS } from '../lib/analytics.js';
import { t } from '../copy/index.js';

// RPC rejection reason → copy key. Anything unlisted falls back to the
// generic "not recorded, checkout unaffected" line.
const REASON_COPY = {
  self_referral:          'purchase.referralSelf',
  unknown_account_number: 'purchase.referralUnknown',
  already_referred:       'purchase.referralAlready',
  referrer_cap_reached:   'purchase.referralCap',
  account_inactive:       'purchase.referralInactive',
};

/**
 * @param {'pricing'|'purchase_modal'} surface — WHERE the field is mounted. The
 *   call site owns this because the hook cannot know it; it is the only prop
 *   referral_intent_recorded carries beyond the outcome.
 * @returns {{
 *   eligible: boolean,
 *   value: string,
 *   setValue: (v: string) => void,
 *   note: { tone: 'ok'|'warn', text: string } | null,
 *   busy: boolean,
 *   recorded: boolean,
 *   recordIntent: () => Promise<void>,
 * }}
 */
export function useReferralIntent(surface) {
  const user       = useStore(s => s.auth.user);
  const tier       = useStore(s => s.auth.tier);
  const isFounder  = useStore(s => s.auth.isFounder);
  const isElevated = useStore(s => s.isElevated());

  // Synchronous gate; the async prior-referral check below narrows further.
  const candidate = isConfigured && Boolean(user)
    && tier !== 'premium' && !isFounder && !isElevated;

  // Tri-state prior-referral answer: null until the async check lands, then
  // boolean. `eligible` is DERIVED (candidate && confirmed-no-prior) so the
  // effect never has to set state synchronously.
  const [prior, setPrior]       = useState(null);
  const [value, setValue]       = useState('');
  const [note, setNote]         = useState(null);
  const [busy, setBusy]         = useState(false);
  const [recorded, setRecorded] = useState(false);
  // Once an intent lands (ok, or the server says already_referred) stop
  // re-sending — the RPC is idempotent-rejecting but a second call would only
  // swap the confirmation note for a rejection note.
  const doneRef = useRef(false);

  const userId = user?.id;
  useEffect(() => {
    if (!candidate || !userId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const p = await hasPriorReferral(userId);
        if (!cancelled) setPrior(p);
      } catch {
        // Can't tell — hide the field rather than invite a doomed submission.
        if (!cancelled) setPrior(true);
      }
    })();
    return () => { cancelled = true; };
  }, [candidate, userId]);

  const eligible = candidate && prior === false;

  const recordIntent = useCallback(async () => {
    const v = value.trim();
    if (!eligible || !v || doneRef.current || busy) return;
    setBusy(true);
    // WEB-3: the collapsed funnel verdict. Assigned only after the RPC settles,
    // so 'error' is the honest default until something better is known.
    let outcome = 'error';
    try {
      const res = await recordReferralIntent(v);
      outcome = res.ok ? 'recorded' : 'rejected';
      if (res.ok) {
        doneRef.current = true;
        setRecorded(true);
        setNote({ tone: 'ok', text: t('purchase.referralRecorded') });
      } else {
        if (res.reason === 'already_referred') doneRef.current = true;
        setNote({ tone: 'warn', text: t(REASON_COPY[res.reason] || 'purchase.referralFailed') });
      }
    } catch {
      // Transport failure — say so, but checkout proceeds regardless.
      setNote({ tone: 'warn', text: t('purchase.referralFailed') });
    } finally {
      setBusy(false);
      // POST-HOC observer, structure only: the surface and the collapsed
      // outcome. The typed account number NEVER leaves the client. track() is
      // fire-and-forget and swallows a throwing provider, so this line cannot
      // reach the caller's await and cannot delay checkout.
      track(EVENTS.REFERRAL_INTENT_RECORDED, { surface, outcome });
    }
  }, [value, eligible, busy, surface]);

  return { eligible, value, setValue, note, busy, recorded, recordIntent };
}
