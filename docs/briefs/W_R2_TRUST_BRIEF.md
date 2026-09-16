# W-R2-TRUST — the commerce/auth/privacy wave
## Read docs/briefs/W_R2_COMMON_PROTOCOL.md FIRST. Branch: `claude/w-r2-trust`.
## Base symbols to verify: src/components/AuthModal.jsx exists; src/components/BuyThisDossier.jsx has runSaveFirst; supabase/functions/stripe-webhook/index.ts has clawback handling.

**CHARGE:** the funnel's narrowest pixels get the craft the money engineering behind them
already has. All client + edge-function work; zero engine bytes; zero goldens.

**FENCE:** src/components/** (auth/commerce/dossier surfaces named below), src/lib (analytics
call-site fixes + tierFacts walk list), src/hooks if needed, supabase/functions/** (the three
named fixes — NO new functions, NO migration changes), config/tierFacts + its contract test,
tests thereof.

**THE FIXES** (verdict corrections BIND; extraction per protocol):
1. `components-shell-commerce-1` — AuthModal adopts useDialogFocusTrap + the card-level
   onKeyDown stopPropagation (the PurchaseModal shape). Pin: Enter inside the form submits and
   does NOT close; failed sign-in error visible; Space in a field does not dismiss.
2. `components-shell-commerce-2` — the wizard save flow stamps store identity at the save
   chokepoint (activeSaveId + savedSettlements upsert as ONE store action both BuyThisDossier
   and SaveToLibraryButton call); BuyThisDossier advances to the 'unpurchased' rung;
   GenerateWizard threads saveId; the exit dialog stops claiming an already-saved draft is
   unsaved. Pin: save → re-render → rung advances; duplicate clicks insert ZERO extra rows.
3. `components-shell-commerce-3` — post-purchase copy truth (drop/correct the free-edit claim;
   render FREE_SAVE_LIMIT instead of the literal); add SingleDossierSuccessPage.jsx +
   WizardNextSteps.jsx to the tierFacts contract-test SURFACES walk.
4. `components-dossier-library-5` — SuccessorPrompt stops borrowing first_canon_export:
   drop the trigger from pickNew (the composer flow IS the value moment) — JUDGMENT recorded
   in the finding; if you disagree after reading pricingMoments' header, register a dedicated
   succession moment with honest copy instead and record the choice.
5. `components-dossier-library-1` — WelcomeCreditCard: both Funnel.track calls move userId to
   the hashed opts lane (the signupCompleted pattern). 
6. `components-dossier-library-6` — CompendiumGlobalSearch drops the raw query prop (term+tab
   already carry controlled vocabulary); update docs/analytics-event-dictionary.md rows.
7. NEW STRUCTURAL GUARD (closes the class for 5+6): a source-scan test — no Funnel.track call
   site passes userId/user_id/query/email inside the props argument (grep-based, the house
   prevention idiom; allowlist file for sanctioned coarse props if needed).
8. `backend-functions-1` — founder clawback honors the file's own post-claim failure posture:
   after the atomic is_founder flip, downgrade/auth/credit steps log-not-throw (each in its
   own try/catch) or become idempotent re-runnable; optionally stamp a remediation row per the
   referral-clawback pattern. Pin with a transient-failure fixture.
9. `backend-functions-3` — tighten the Vercel suffix rule to the full deploy-URL shape
   (/^[a-z0-9-]+-[a-z0-9]{9}-settlement-forge\.vercel\.app$/ or ALLOWED_ORIGINS enumeration);
   add the spoof-shaped negative case to cors.test.ts.
10. Round-1 backend-5 (recorded-open) — verify-checkout-session migrates to the shared CORS
    module (kill the legacy inline allowlist + '*' fallback). Contract-test it like siblings.
11. `backend-migrations` low (from the register): the PUBLIC-execute revoke for
    service_update_profile_metadata — ⚠️ this is a MIGRATION. Write migration 135 (the 113
    revoke pattern, next free number, search_path-pinned) — WRITTEN, NEVER APPLIED (deploy is
    owner-gated). Extend the grant-posture pin so the class is walked.

**EXCLUDED:** anything touching TIER_GATE values (owner-ruled, already correct), pricing
catalog numbers, or the covert-scrub chip (owner-gated separately).
